# Silmarillionaire

Silmarillionaire is an internal Accelint application for shared project intelligence.

It answers four daily operational questions:
- What projects are active?
- What is each project doing now, next, and later?
- Which teams and people support each project?
- How is staffing matrixed across initiatives?

The product is intentionally styled as a refined fantasy dossier: parchment-toned, print-friendly, and editorial in feel.

## Core Capabilities

- Authenticated project directory and relationship lookup
- Project detail dossiers with roadmap swimlanes, staffing views, links, images, and key milestones
- Drag-and-drop roadmap movement for editors/admins
- Consolidated roadmap view across all projects and teams
- Core-mode roadmap (`/core`) for initiatives marked `is_core = true`
- Admin operations:
  - Waitlist approval and denial
  - User role/status management
  - Project creation and team assignment
  - Project editor assignment management

## Access Model

Roles:
- `viewer`
- `editor`
- `admin`

High-level policy:
- Active authenticated users can read project/people/team data.
- Editors can mutate only assigned projects.
- Admins can manage users, projects, assignments, and waitlist approvals.

Enforcement is layered:
- Route middleware + server guards
- Server action authorization checks
- Supabase RLS policies

## Tech Stack

- Next.js App Router
- TypeScript (strict)
- Tailwind CSS
- Supabase Auth + Postgres + Storage
- Vitest (unit)
- Playwright (E2E)

## Local Development

Prerequisites:
- Node.js 22+
- Supabase project

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
# optional
# SUPABASE_PROJECT_IMAGES_BUCKET=project-images
```

### 3. Apply schema and seed data

Run in Supabase SQL editor:
- `supabase/migrations/20260224131500_milestone2_schema.sql`
- `supabase/migrations/20260225170000_milestone9_key_milestones.sql`
- `supabase/seed.sql`

### 4. Bootstrap admin user

```bash
ADMIN_EMAIL=admin@example.com ADMIN_NAME="Silmarillionaire Admin" npm run db:bootstrap-admin
```

### 5. Run the app

```bash
npm run dev
```

Open:
- `http://localhost:3000/login`

## Supabase Health Check

Run:
- `supabase/health-check.sql`

This validates required tables, columns, RLS, policies, functions, triggers, storage bucket presence, and data counts.

## Testing

```bash
npm run lint
npm run typecheck
npm test
```

E2E:

```bash
npm run test:e2e
```

Focused project-detail QA regression (drag/drop + milestones CRUD + links/images controls):

```bash
E2E_BASE_URL=http://127.0.0.1:3010 \
E2E_EMAIL=you@domain.com \
E2E_PASSWORD='your-password' \
E2E_PROJECT_ID='your-project-uuid' \
npm run test:e2e:qa
```

## Important Paths

- App routes: `app/`
- Shared UI components: `components/`
- Data access and guards: `lib/`
- Supabase SQL: `supabase/migrations/` and `supabase/seed.sql`
- Permission audit: `docs/PERMISSION_AUDIT.md`

## Product Direction

Silmarillionaire is designed to be operational, not ornamental. The fantasy motif should support clarity and memorability while preserving enterprise usability, security, and maintainability.
