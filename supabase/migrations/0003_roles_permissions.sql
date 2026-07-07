-- Mirror of the deployed SocketObit backend.
create or replace function public.has_permission(p_org_id uuid, p_permission_key text)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.my_memberships mm
    where mm.org_id = p_org_id
      and mm.member_id = public.current_member_id(p_org_id)
      and p_permission_key = any(mm.permissions)
  );
$$;

create or replace function public.is_org_elevated(p_org_id uuid)
returns boolean
language sql
stable
as $$
  select public.has_permission(p_org_id, 'users');
$$;

create or replace function public.get_role_permissions(p_role_id uuid)
returns text[]
language sql
stable
as $$
  select coalesce(array_agg(permission_key order by permission_key), '{}'::text[])
  from public.role_permissions
  where role_id = p_role_id;
$$;

create or replace function public.upsert_role(p_org_id uuid, p_name text, p_permission_keys text[], p_role_id uuid default null)
returns table(role_id uuid, name text, is_system boolean, permission_keys text[])
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role_id uuid;
begin
  if p_role_id is null then
    insert into public.roles (org_id, name, is_system) values (p_org_id, p_name, false) returning id into v_role_id;
  else
    update public.roles set name = p_name where id = p_role_id returning id into v_role_id;
    delete from public.role_permissions where role_id = p_role_id;
  end if;
  insert into public.role_permissions (role_id, permission_key)
  select v_role_id, unnest(coalesce(p_permission_keys, '{}'::text[]));
  return query select r.id, r.name, r.is_system, coalesce(array_agg(rp.permission_key order by rp.permission_key), '{}'::text[])
  from public.roles r left join public.role_permissions rp on rp.role_id = r.id
  where r.id = v_role_id group by r.id;
end;
$$;

create or replace function public.delete_role(p_role_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.roles where id = p_role_id and is_system = false;
end;
$$;

create or replace function public.current_member_roles(p_org_id uuid)
returns text[]
language sql
stable
as $$
  select coalesce(array_agg(distinct r.name), '{}'::text[])
  from public.org_members om
  join public.roles r on r.id = om.role_id
  where om.org_id = p_org_id;
$$;
