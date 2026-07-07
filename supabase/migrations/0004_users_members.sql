-- Mirror of the deployed SocketObit backend.
create or replace function public.list_org_members(p_org_id uuid)
returns table(id uuid, org_id uuid, user_id uuid, email text, display_name text, login_username text, data_role text, role_id uuid, role_name text, manager_id uuid, manager_name text, allocated_quota integer, status boolean, group_ids uuid[], group_names text[], profile_count bigint, created_at timestamptz)
language sql
stable
as $$
  select
    om.id,
    om.org_id,
    om.user_id,
    om.email,
    om.display_name,
    om.login_username,
    om.data_role,
    om.role_id,
    r.name as role_name,
    om.manager_id,
    mgr.display_name as manager_name,
    om.allocated_quota,
    om.status,
    coalesce(array_agg(distinct og.group_id) filter (where og.group_id is not null), '{}'::uuid[]) as group_ids,
    coalesce(array_agg(distinct pg.name) filter (where pg.name is not null), '{}'::text[]) as group_names,
    count(bp.id)::bigint as profile_count,
    om.created_at
  from public.org_members om
  join public.roles r on r.id = om.role_id
  left join public.org_members mgr on mgr.id = om.manager_id
  left join public.org_member_groups og on og.member_id = om.id
  left join public.profile_groups pg on pg.id = og.group_id
  left join public.browser_profiles bp on bp.created_by = om.id
  where om.org_id = p_org_id
  group by om.id, r.id, mgr.id;
$$;

create or replace function public.list_potential_managers(p_org_id uuid)
returns table(id uuid, display_name text, data_role text)
language sql
stable
as $$
  select id, display_name, data_role from public.org_members where org_id = p_org_id and status = true order by display_name;
$$;

create or replace function public.deactivate_org_member(p_member_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.org_members set status = false where id = p_member_id;
end;
$$;

create or replace function public.hard_delete_org_member(p_member_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.org_members where id = p_member_id;
end;
$$;
