-- Mirror of the deployed SocketObit backend.
create extension if not exists pgcrypto;

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid not null,
  plan text not null default 'free',
  seat_limit integer not null default 3,
  monthly_open_limit integer not null default 0,
  monthly_opens_used integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.permission_modules (
  key text primary key,
  label text not null,
  parent_key text references public.permission_modules(key) on delete cascade,
  sort_order integer not null default 0
);

create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  is_system boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.role_permissions (
  role_id uuid not null references public.roles(id) on delete cascade,
  permission_key text not null references public.permission_modules(key) on delete cascade,
  primary key (role_id, permission_key)
);

create table if not exists public.org_members (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null,
  email text not null,
  display_name text not null,
  login_username text not null,
  data_role text not null default 'member',
  role_id uuid not null references public.roles(id),
  manager_id uuid references public.org_members(id) on delete set null,
  allocated_quota integer not null default 0,
  status boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.profile_groups (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.proxy_providers (
  key text primary key,
  label text not null,
  protocols text[] not null default '{}',
  active boolean not null default true
);

create table if not exists public.proxy_configs (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizations(id) on delete cascade,
  provider_key text references public.proxy_providers(key),
  protocol text,
  host text,
  port integer,
  username text,
  password_encrypted text,
  ip_version text not null default 'ipv4',
  proxy_type text,
  extraction_link_encrypted text,
  dedupe_check boolean not null default false,
  last_checked_at timestamptz,
  last_verified_at timestamptz,
  last_verified_ip jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.browser_profiles (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  created_by uuid not null,
  group_id uuid references public.profile_groups(id) on delete set null,
  proxy_config_id uuid references public.proxy_configs(id) on delete set null,
  name text,
  remark text,
  status text not null default 'stopped',
  seq integer not null default 0,
  platform_hint text,
  fingerprint jsonb not null default '{}'::jsonb,
  last_opened_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.operation_logs (
  id bigserial primary key,
  org_id uuid not null references public.organizations(id) on delete cascade,
  actor_id uuid not null,
  category text not null,
  content text not null,
  ip_address inet,
  created_at timestamptz not null default now()
);

create table if not exists public.login_logs (
  id bigserial primary key,
  org_id uuid not null references public.organizations(id) on delete cascade,
  member_id uuid not null,
  operation text not null,
  ip_address inet,
  created_at timestamptz not null default now()
);

create table if not exists public.org_member_groups (
  member_id uuid not null references public.org_members(id) on delete cascade,
  group_id uuid not null references public.profile_groups(id) on delete cascade,
  primary key (member_id, group_id)
);

alter table public.organizations enable row level security;
alter table public.roles enable row level security;
alter table public.role_permissions enable row level security;
alter table public.org_members enable row level security;
alter table public.profile_groups enable row level security;
alter table public.proxy_configs enable row level security;
alter table public.browser_profiles enable row level security;
alter table public.operation_logs enable row level security;
alter table public.login_logs enable row level security;
alter table public.org_member_groups enable row level security;

insert into public.permission_modules (key, label, parent_key, sort_order) values
  ('browser_profiles', 'Profiles', null, 10),
  ('proxy_ip', 'Proxies', null, 20),
  ('users', 'Users', null, 30),
  ('settings', 'Settings', null, 40),
  ('cloud_phone', 'Cloud Phone', null, 50),
  ('rpa', 'RPA', null, 60),
  ('groups', 'Groups', null, 70),
  ('extensions', 'Extensions', null, 80),
  ('referral', 'Referral', null, 90),
  ('operation_logs', 'Operation Logs', null, 100),
  ('help', 'Help', null, 110),
  ('qna', 'Q&A', null, 120),
  ('recycle_bin', 'Recycle Bin', null, 130)
on conflict do nothing;

create or replace view public.roles_with_permissions as
select r.id, r.org_id, r.name, r.is_system, r.created_at, coalesce(array_agg(rp.permission_key order by rp.permission_key) filter (where rp.permission_key is not null), '{}'::text[]) as permission_keys
from public.roles r
left join public.role_permissions rp on rp.role_id = r.id
group by r.id;

create or replace view public.my_memberships as
select om.id as member_id, om.org_id, o.name as org_name, om.role_id, r.name as role_name, om.display_name, om.login_username, om.data_role, om.status, om.allocated_quota, coalesce(array_agg(distinct pm.permission_key) filter (where pm.permission_key is not null), '{}'::text[]) as permissions
from public.org_members om
join public.organizations o on o.id = om.org_id
join public.roles r on r.id = om.role_id
left join public.role_permissions pm on pm.role_id = r.id
group by om.id, o.id, r.id;
