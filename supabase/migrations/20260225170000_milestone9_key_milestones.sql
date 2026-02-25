-- Milestone 9: key milestones for project timelines

create table if not exists public.key_milestones (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  details text not null default '',
  milestone_date date,
  category text not null default 'event',
  created_at timestamptz not null default now(),
  constraint key_milestones_category_check
    check (category in ('event', 'release', 'exercise', 'other'))
);

create index if not exists key_milestones_project_date_idx
  on public.key_milestones (project_id, milestone_date, created_at);

alter table public.key_milestones enable row level security;

create policy "key_milestones_read_active_users"
  on public.key_milestones
  for select
  to authenticated
  using (public.is_active_user());

create policy "key_milestones_edit_assigned"
  on public.key_milestones
  for all
  to authenticated
  using (public.can_edit_project(project_id))
  with check (public.can_edit_project(project_id));
