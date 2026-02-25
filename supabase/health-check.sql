-- Silmarillion Supabase Health Check
-- Run in Supabase SQL Editor.

with required_tables(table_name) as (
  values
    ('users'),
    ('waitlist_requests'),
    ('people'),
    ('teams'),
    ('projects'),
    ('project_teams'),
    ('team_memberships'),
    ('project_editors'),
    ('roadmap_items'),
    ('project_links'),
    ('project_images')
)
select
  rt.table_name,
  case when t.table_name is not null then 'OK' else 'MISSING' end as status
from required_tables rt
left join information_schema.tables t
  on t.table_schema = 'public'
 and t.table_name = rt.table_name
order by rt.table_name;

with required_columns(table_name, column_name) as (
  values
    ('users','role'),
    ('users','status'),
    ('waitlist_requests','status'),
    ('team_memberships','role'),
    ('roadmap_items','horizon'),
    ('projects','is_core'),
    ('project_images','storage_path')
)
select
  rc.table_name,
  rc.column_name,
  case when c.column_name is not null then 'OK' else 'MISSING' end as status
from required_columns rc
left join information_schema.columns c
  on c.table_schema = 'public'
 and c.table_name = rc.table_name
 and c.column_name = rc.column_name
order by rc.table_name, rc.column_name;

with required_enums(type_name) as (
  values
    ('app_role'),
    ('user_status'),
    ('waitlist_status'),
    ('team_role'),
    ('roadmap_horizon')
)
select
  re.type_name,
  case when t.typname is not null then 'OK' else 'MISSING' end as status
from required_enums re
left join pg_type t
  on t.typname = re.type_name
left join pg_namespace n
  on n.oid = t.typnamespace and n.nspname = 'public'
order by re.type_name;

with required_tables(table_name) as (
  values
    ('users'),
    ('waitlist_requests'),
    ('people'),
    ('teams'),
    ('projects'),
    ('project_teams'),
    ('team_memberships'),
    ('project_editors'),
    ('roadmap_items'),
    ('project_links'),
    ('project_images')
)
select
  rt.table_name,
  case when cls.relrowsecurity then 'OK' else 'RLS_DISABLED' end as rls_status
from required_tables rt
join pg_class cls on cls.relname = rt.table_name
join pg_namespace nsp on nsp.oid = cls.relnamespace and nsp.nspname = 'public'
order by rt.table_name;

with required_policies(policy_name, table_name) as (
  values
    ('users_select_self_or_admin','users'),
    ('waitlist_insert_request','waitlist_requests'),
    ('projects_read_active_users','projects'),
    ('projects_edit_assigned','projects'),
    ('project_teams_read_active_users','project_teams'),
    ('team_memberships_read_active_users','team_memberships'),
    ('project_editors_read_active_users','project_editors'),
    ('roadmap_items_edit_assigned','roadmap_items'),
    ('project_links_edit_assigned','project_links'),
    ('project_images_edit_assigned','project_images')
)
select
  rp.table_name,
  rp.policy_name,
  case when p.policyname is not null then 'OK' else 'MISSING' end as status
from required_policies rp
left join pg_policies p
  on p.schemaname = 'public'
 and p.tablename = rp.table_name
 and p.policyname = rp.policy_name
order by rp.table_name, rp.policy_name;

with required_functions(function_name) as (
  values
    ('is_active_user'),
    ('is_admin'),
    ('can_edit_project'),
    ('handle_auth_user_created'),
    ('handle_auth_user_updated')
)
select
  rf.function_name,
  case when p.proname is not null then 'OK' else 'MISSING' end as status
from required_functions rf
left join pg_proc p
  on p.proname = rf.function_name
left join pg_namespace n
  on n.oid = p.pronamespace and n.nspname = 'public'
order by rf.function_name;

select
  req.tgname as trigger_name,
  req.relname as table_name,
  case when trg.tgname is not null then 'OK' else 'MISSING' end as status
from (
  values
    ('on_auth_user_created', 'users'),
    ('on_auth_user_updated', 'users')
) req(tgname, relname)
left join pg_trigger trg on trg.tgname = req.tgname
left join pg_class cls on cls.oid = trg.tgrelid
order by trigger_name;

-- Storage bucket check (default bucket name expected by app is project-images)
select
  id as bucket_id,
  name as bucket_name,
  public,
  file_size_limit,
  case when name = 'project-images' then 'DEFAULT_BUCKET_FOUND' else 'OTHER_BUCKET' end as status
from storage.buckets
order by name;

-- Quick data presence snapshot (useful for seed validation)
select 'users' as table_name, count(*)::bigint as row_count from public.users
union all
select 'waitlist_requests', count(*)::bigint from public.waitlist_requests
union all
select 'people', count(*)::bigint from public.people
union all
select 'teams', count(*)::bigint from public.teams
union all
select 'projects', count(*)::bigint from public.projects
union all
select 'project_teams', count(*)::bigint from public.project_teams
union all
select 'team_memberships', count(*)::bigint from public.team_memberships
union all
select 'project_editors', count(*)::bigint from public.project_editors
union all
select 'roadmap_items', count(*)::bigint from public.roadmap_items
union all
select 'project_links', count(*)::bigint from public.project_links
union all
select 'project_images', count(*)::bigint from public.project_images
order by table_name;
