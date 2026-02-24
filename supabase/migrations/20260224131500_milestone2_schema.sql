-- Milestone 2: authoritative schema + RLS foundation for Silmarillion

create extension if not exists pgcrypto;
create extension if not exists citext;

create type public.app_role as enum ('viewer', 'editor', 'admin');
create type public.user_status as enum ('pending', 'active', 'denied');
create type public.waitlist_status as enum ('pending', 'approved', 'denied');
create type public.team_role as enum ('pm', 'engineer', 'designer', 'other', 'leadership');
create type public.roadmap_horizon as enum ('now', 'next', 'later');

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email citext not null unique,
  name text,
  role public.app_role not null default 'viewer',
  status public.user_status not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists public.waitlist_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email citext not null,
  requested_at timestamptz not null default now(),
  status public.waitlist_status not null default 'pending'
);

create unique index if not exists waitlist_requests_pending_email_unique
  on public.waitlist_requests (email)
  where status = 'pending';

create table if not exists public.people (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  title text not null,
  org_unit text not null,
  is_leadership boolean not null default false,
  profile_photo_url text
);

create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text not null default ''
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  codename text not null unique,
  description text not null default '',
  is_core boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.project_teams (
  project_id uuid not null references public.projects(id) on delete cascade,
  team_id uuid not null references public.teams(id) on delete cascade,
  primary key (project_id, team_id)
);

create table if not exists public.team_memberships (
  team_id uuid not null references public.teams(id) on delete cascade,
  person_id uuid not null references public.people(id) on delete cascade,
  role public.team_role not null,
  allocation_pct numeric(5,2),
  primary key (team_id, person_id, role),
  constraint team_memberships_allocation_check
    check (allocation_pct is null or (allocation_pct >= 0 and allocation_pct <= 100))
);

create table if not exists public.project_editors (
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  primary key (project_id, user_id)
);

create table if not exists public.roadmap_items (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  team_id uuid references public.teams(id) on delete set null,
  horizon public.roadmap_horizon not null,
  title text not null,
  body text not null,
  owner_person_id uuid references public.people(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.project_links (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  label text not null,
  url text not null,
  constraint project_links_url_check check (url ~* '^https?://'),
  constraint project_links_unique unique (project_id, label, url)
);

create table if not exists public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  storage_path text not null,
  caption text not null default '',
  constraint project_images_unique unique (project_id, storage_path)
);

create index if not exists project_teams_team_id_idx on public.project_teams (team_id);
create index if not exists team_memberships_person_id_idx on public.team_memberships (person_id);
create index if not exists project_editors_user_id_idx on public.project_editors (user_id);
create index if not exists roadmap_items_project_horizon_idx on public.roadmap_items (project_id, horizon);
create index if not exists roadmap_items_team_idx on public.roadmap_items (team_id);
create index if not exists project_links_project_id_idx on public.project_links (project_id);
create index if not exists project_images_project_id_idx on public.project_images (project_id);

create or replace function public.is_active_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.users u
    where u.id = auth.uid() and u.status = 'active'
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.users u
    where u.id = auth.uid() and u.role = 'admin' and u.status = 'active'
  );
$$;

create or replace function public.can_edit_project(target_project_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.users u
    where u.id = auth.uid()
      and u.status = 'active'
      and (
        u.role = 'admin'
        or exists (
          select 1
          from public.project_editors pe
          where pe.project_id = target_project_id
            and pe.user_id = auth.uid()
        )
      )
  );
$$;

grant execute on function public.is_active_user() to anon, authenticated;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.can_edit_project(uuid) to authenticated;

create or replace function public.handle_auth_user_created()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1))
  )
  on conflict (id) do update
    set email = excluded.email,
        name = coalesce(excluded.name, public.users.name);

  return new;
end;
$$;

create or replace function public.handle_auth_user_updated()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.users
    set email = new.email,
        name = coalesce(new.raw_user_meta_data ->> 'name', public.users.name)
  where id = new.id;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_auth_user_created();

drop trigger if exists on_auth_user_updated on auth.users;
create trigger on_auth_user_updated
  after update of email, raw_user_meta_data on auth.users
  for each row execute function public.handle_auth_user_updated();

alter table public.users enable row level security;
alter table public.waitlist_requests enable row level security;
alter table public.people enable row level security;
alter table public.teams enable row level security;
alter table public.projects enable row level security;
alter table public.project_teams enable row level security;
alter table public.team_memberships enable row level security;
alter table public.project_editors enable row level security;
alter table public.roadmap_items enable row level security;
alter table public.project_links enable row level security;
alter table public.project_images enable row level security;

create policy "users_select_self_or_admin"
  on public.users
  for select
  to authenticated
  using (id = auth.uid() or public.is_admin());

create policy "users_admin_insert"
  on public.users
  for insert
  to authenticated
  with check (public.is_admin());

create policy "users_admin_update"
  on public.users
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "waitlist_insert_request"
  on public.waitlist_requests
  for insert
  to anon, authenticated
  with check (status = 'pending');

create policy "waitlist_admin_read"
  on public.waitlist_requests
  for select
  to authenticated
  using (public.is_admin());

create policy "waitlist_admin_update"
  on public.waitlist_requests
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "waitlist_admin_delete"
  on public.waitlist_requests
  for delete
  to authenticated
  using (public.is_admin());

create policy "people_read_active_users"
  on public.people
  for select
  to authenticated
  using (public.is_active_user());

create policy "people_admin_manage"
  on public.people
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "teams_read_active_users"
  on public.teams
  for select
  to authenticated
  using (public.is_active_user());

create policy "teams_admin_manage"
  on public.teams
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "projects_read_active_users"
  on public.projects
  for select
  to authenticated
  using (public.is_active_user());

create policy "projects_admin_insert"
  on public.projects
  for insert
  to authenticated
  with check (public.is_admin());

create policy "projects_edit_assigned"
  on public.projects
  for update
  to authenticated
  using (public.can_edit_project(id))
  with check (public.can_edit_project(id));

create policy "projects_admin_delete"
  on public.projects
  for delete
  to authenticated
  using (public.is_admin());

create policy "project_teams_read_active_users"
  on public.project_teams
  for select
  to authenticated
  using (public.is_active_user());

create policy "project_teams_admin_manage"
  on public.project_teams
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "team_memberships_read_active_users"
  on public.team_memberships
  for select
  to authenticated
  using (public.is_active_user());

create policy "team_memberships_admin_manage"
  on public.team_memberships
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "project_editors_read_active_users"
  on public.project_editors
  for select
  to authenticated
  using (public.is_active_user());

create policy "project_editors_admin_manage"
  on public.project_editors
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "roadmap_items_read_active_users"
  on public.roadmap_items
  for select
  to authenticated
  using (public.is_active_user());

create policy "roadmap_items_edit_assigned"
  on public.roadmap_items
  for all
  to authenticated
  using (public.can_edit_project(project_id))
  with check (public.can_edit_project(project_id));

create policy "project_links_read_active_users"
  on public.project_links
  for select
  to authenticated
  using (public.is_active_user());

create policy "project_links_edit_assigned"
  on public.project_links
  for all
  to authenticated
  using (public.can_edit_project(project_id))
  with check (public.can_edit_project(project_id));

create policy "project_images_read_active_users"
  on public.project_images
  for select
  to authenticated
  using (public.is_active_user());

create policy "project_images_edit_assigned"
  on public.project_images
  for all
  to authenticated
  using (public.can_edit_project(project_id))
  with check (public.can_edit_project(project_id));
