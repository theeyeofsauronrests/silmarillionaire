# Permission Audit (Milestone 8)

Date: 2026-02-24

## Scope
- Route protection
- Server action protection
- RLS alignment

## Route Enforcement
- `middleware.ts`:
  - Unauthenticated users redirected to `/login` for non-public routes.
  - Authenticated users with non-`active` status redirected to `/waitlist`.
- `lib/auth/guards.ts`:
  - `requireUser({ activeOnly: true })` for protected pages.
  - `requireRole("admin" | "editor")` for role-gated pages.
- `lib/auth/project-access.ts`:
  - `getProjectEditAccess(projectId)` checks `admin` or assigned `editor` in `project_editors`.
  - `requireProjectEditAccess(projectId)` enforces editor/admin for mutations.

## Server Action Enforcement
- Project editing actions (`app/(protected)/projects/[projectId]/actions.ts`):
  - Guarded by `requireProjectEditAccess`.
  - Input validation for required strings and roadmap horizon whitelist.
- Admin actions:
  - Waitlist (`app/(protected)/admin/waitlist/actions.ts`): guarded by `requireRole("admin")`.
  - Users (`app/(protected)/admin/users/actions.ts`): guarded by `requireRole("admin")`.
  - Projects (`app/(protected)/admin/projects/actions.ts`): guarded by `requireRole("admin")`.

## RLS Alignment Check
- Read policies require `public.is_active_user()` on core app tables.
- Admin management policies use `public.is_admin()`.
- Project edit policies use `public.can_edit_project(project_id)`.
- Application guards mirror these boundaries, reducing risk of UI/server mismatch.

## Residual Risks
- Supabase email delivery must be configured for waitlist approval password setup flow.
- E2E full auth gating checks depend on environment-backed Supabase setup (`E2E_AUTH_GATING=true`).

## Recommendation
- Keep server action guards as the authority and treat client UI gating as convenience only.
- Add CI job with staging Supabase for full e2e auth/permissions smoke path.
