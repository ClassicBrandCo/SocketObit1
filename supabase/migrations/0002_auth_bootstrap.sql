-- Mirror of the deployed SocketObit backend.
create or replace function public.current_org_ids()
returns uuid[]
language sql
stable
as $$
  select coalesce(array_agg(distinct org_id), '{}'::uuid[])
  from public.my_memberships
  where member_id is not null;
$$;

create or replace function public.current_member_id(p_org_id uuid)
returns uuid
language sql
stable
as $$
  select member_id from public.my_memberships where org_id = p_org_id limit 1;
$$;

create or replace function public.is_org_member(target_org uuid)
returns boolean
language sql
stable
as $$
  select exists(select 1 from public.my_memberships where org_id = target_org);
$$;

create or replace function public.bootstrap_organization(p_name text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_user_id uuid := auth.uid();
  v_role_id uuid;
begin
  insert into public.organizations (name, owner_id, seat_limit, monthly_open_limit)
  values (p_name, v_user_id, 3, 0)
  returning id into v_org_id;

  insert into public.roles (org_id, name, is_system) values (v_org_id, 'Owner', true) returning id into v_role_id;
  insert into public.org_members (org_id, user_id, email, display_name, login_username, data_role, role_id, allocated_quota, status)
  select v_org_id, v_user_id, coalesce(auth.jwt()->>'email', ''), coalesce(auth.jwt()->>'email', 'Owner'), coalesce(auth.jwt()->>'email', 'owner'), 'owner', v_role_id, 0, true;
  return v_org_id;
end;
$$;

create or replace function public.log_login(p_org_id uuid, p_operation text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.login_logs (org_id, member_id, operation)
  values (p_org_id, public.current_member_id(p_org_id), p_operation);
end;
$$;

create or replace function public.log_operation(p_org_id uuid, p_category text, p_content text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.operation_logs (org_id, actor_id, category, content)
  values (p_org_id, public.current_member_id(p_org_id), p_category, p_content);
end;
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
