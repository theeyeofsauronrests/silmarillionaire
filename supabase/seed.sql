-- Milestone 2 seed: JERIC2O scenario with matrix staffing and leadership visibility

insert into public.teams (name, description)
values
  ('Bolt', 'Delivery stream focused on execution velocity.'),
  ('ACE', 'Automation and continuous enablement team.'),
  ('Dominance', 'Platform quality and reliability stream.'),
  ('AARO', 'Cross-program analytics and architecture team.')
on conflict (name) do update
  set description = excluded.description;

insert into public.projects (name, codename, description, is_core)
values
  (
    'JERIC2O Platform Modernization',
    'JERIC2O',
    'Primary modernization initiative with matrixed designers across three teams.',
    false
  ),
  (
    'AARO Enablement Initiative',
    'AARO',
    'Secondary initiative used to demonstrate cross-project staffing.',
    false
  )
on conflict (codename) do update
  set name = excluded.name,
      description = excluded.description,
      is_core = excluded.is_core;

insert into public.people (display_name, title, org_unit, is_leadership)
values
  ('Arwen Callis', 'Product Designer', 'UX Software Factory', false),
  ('Mira Tan', 'Senior Product Designer', 'UX Software Factory', false),
  ('Rafi Noor', 'Principal Product Designer', 'UX Software Factory', false),
  ('Owen Pike', 'Program Manager', 'UX Software Factory', false),
  ('Dev Patel', 'Staff Engineer', 'UX Software Factory', false),
  ('Sky Wu', 'Software Engineer', 'UX Software Factory', false),
  ('Sana Reed', 'Data Scientist', 'UX Software Factory', false),
  ('Holen "Money" Holmquist', 'Director of Product and Design', 'UX Software Factory', true)
on conflict do nothing;

with ids as (
  select
    (select id from public.projects where codename = 'JERIC2O') as jerico_project_id,
    (select id from public.projects where codename = 'AARO') as aaro_project_id,
    (select id from public.teams where name = 'Bolt') as bolt_team_id,
    (select id from public.teams where name = 'ACE') as ace_team_id,
    (select id from public.teams where name = 'Dominance') as dominance_team_id,
    (select id from public.teams where name = 'AARO') as aaro_team_id,
    (select id from public.people where display_name = 'Arwen Callis' limit 1) as arwen_id,
    (select id from public.people where display_name = 'Mira Tan' limit 1) as mira_id,
    (select id from public.people where display_name = 'Rafi Noor' limit 1) as rafi_id,
    (select id from public.people where display_name = 'Owen Pike' limit 1) as owen_id,
    (select id from public.people where display_name = 'Dev Patel' limit 1) as dev_id,
    (select id from public.people where display_name = 'Sky Wu' limit 1) as sky_id,
    (select id from public.people where display_name = 'Sana Reed' limit 1) as sana_id,
    (select id from public.people where display_name = 'Holen "Money" Holmquist' limit 1) as holen_id
)
insert into public.project_teams (project_id, team_id)
select jerico_project_id, bolt_team_id from ids where jerico_project_id is not null and bolt_team_id is not null
union all
select jerico_project_id, ace_team_id from ids where jerico_project_id is not null and ace_team_id is not null
union all
select jerico_project_id, dominance_team_id from ids where jerico_project_id is not null and dominance_team_id is not null
union all
select aaro_project_id, aaro_team_id from ids where aaro_project_id is not null and aaro_team_id is not null
on conflict do nothing;

with ids as (
  select
    (select id from public.teams where name = 'Bolt') as bolt_team_id,
    (select id from public.teams where name = 'ACE') as ace_team_id,
    (select id from public.teams where name = 'Dominance') as dominance_team_id,
    (select id from public.teams where name = 'AARO') as aaro_team_id,
    (select id from public.people where display_name = 'Arwen Callis' limit 1) as arwen_id,
    (select id from public.people where display_name = 'Mira Tan' limit 1) as mira_id,
    (select id from public.people where display_name = 'Rafi Noor' limit 1) as rafi_id,
    (select id from public.people where display_name = 'Owen Pike' limit 1) as owen_id,
    (select id from public.people where display_name = 'Dev Patel' limit 1) as dev_id,
    (select id from public.people where display_name = 'Sky Wu' limit 1) as sky_id,
    (select id from public.people where display_name = 'Sana Reed' limit 1) as sana_id,
    (select id from public.people where display_name = 'Holen "Money" Holmquist' limit 1) as holen_id
)
insert into public.team_memberships (team_id, person_id, role, allocation_pct)
select bolt_team_id, owen_id, 'pm'::public.team_role, 50 from ids
union all
select bolt_team_id, arwen_id, 'designer'::public.team_role, 40 from ids
union all
select bolt_team_id, mira_id, 'designer'::public.team_role, 35 from ids
union all
select bolt_team_id, dev_id, 'engineer'::public.team_role, 70 from ids
union all
select bolt_team_id, holen_id, 'leadership'::public.team_role, null from ids
union all
select ace_team_id, owen_id, 'pm'::public.team_role, 35 from ids
union all
select ace_team_id, mira_id, 'designer'::public.team_role, 40 from ids
union all
select ace_team_id, rafi_id, 'designer'::public.team_role, 30 from ids
union all
select ace_team_id, sky_id, 'engineer'::public.team_role, 65 from ids
union all
select ace_team_id, sana_id, 'other'::public.team_role, 50 from ids
union all
select dominance_team_id, owen_id, 'pm'::public.team_role, 15 from ids
union all
select dominance_team_id, arwen_id, 'designer'::public.team_role, 25 from ids
union all
select dominance_team_id, dev_id, 'engineer'::public.team_role, 30 from ids
union all
select dominance_team_id, holen_id, 'leadership'::public.team_role, null from ids
union all
select aaro_team_id, rafi_id, 'designer'::public.team_role, 30 from ids
union all
select aaro_team_id, holen_id, 'leadership'::public.team_role, null from ids
on conflict do nothing;

with ids as (
  select
    (select id from public.projects where codename = 'JERIC2O') as jerico_project_id,
    (select id from public.projects where codename = 'AARO') as aaro_project_id,
    (select id from public.teams where name = 'Bolt') as bolt_team_id,
    (select id from public.teams where name = 'ACE') as ace_team_id,
    (select id from public.teams where name = 'Dominance') as dominance_team_id,
    (select id from public.teams where name = 'AARO') as aaro_team_id,
    (select id from public.people where display_name = 'Owen Pike' limit 1) as owen_id,
    (select id from public.people where display_name = 'Rafi Noor' limit 1) as rafi_id,
    (select id from public.people where display_name = 'Holen "Money" Holmquist' limit 1) as holen_id
)
insert into public.roadmap_items (project_id, team_id, horizon, title, body, owner_person_id)
select jerico_project_id, bolt_team_id, 'now'::public.roadmap_horizon, 'Unify design token governance', 'Consolidate token ownership and approval workflow across product surfaces.', owen_id from ids
union all
select jerico_project_id, ace_team_id, 'next'::public.roadmap_horizon, 'Automate UX telemetry checks', 'Introduce CI guards for critical interaction health metrics.', rafi_id from ids
union all
select jerico_project_id, dominance_team_id, 'later'::public.roadmap_horizon, 'Publish staffing observability dashboard', 'Ship project-level staffing visibility dashboards for quarterly planning.', holen_id from ids
union all
select aaro_project_id, aaro_team_id, 'now'::public.roadmap_horizon, 'Cross-project IA alignment', 'Align AARO and JERIC2O information architecture for shared reporting.', rafi_id from ids
on conflict do nothing;

with ids as (
  select
    (select id from public.projects where codename = 'JERIC2O') as jerico_project_id,
    (select id from public.projects where codename = 'AARO') as aaro_project_id
)
insert into public.project_links (project_id, label, url)
select jerico_project_id, 'JERIC2O Brief', 'https://example.com/jeric2o-brief' from ids
union all
select aaro_project_id, 'AARO Brief', 'https://example.com/aaro-brief' from ids
on conflict do nothing;

insert into public.waitlist_requests (name, email, status)
values ('Sample Pending User', 'pending.user@example.com', 'pending')
on conflict do nothing;
