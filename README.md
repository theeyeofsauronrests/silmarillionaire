# Silmarillion

Milestone 1 scaffold for the Silmarillion MVP.

## Prerequisites

- Node.js 22+
- Supabase project with auth enabled

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables:

```bash
cp .env.example .env.local
```

3. Start development server:

```bash
npm run dev
```

## Included in Milestone 1

- Next.js App Router + strict TypeScript
- Tailwind CSS with parchment-themed design tokens
- Supabase auth integration
- `/login` and `/waitlist` routes
- Middleware-protected authenticated routes
- Scaffolded route tree for all PRD pages

## Milestone 2 Assets

- Authoritative schema + RLS policies:
  - `supabase/migrations/20260224131500_milestone2_schema.sql`
- Dev seed data (JERIC2O + matrix staffing):
  - `supabase/seed.sql`
- Admin bootstrap helper:
  - `scripts/bootstrap-admin.mjs`

### Bootstrap Admin

```bash
ADMIN_EMAIL=admin@example.com ADMIN_NAME=\"Silmarillion Admin\" npm run db:bootstrap-admin
```

Required env vars:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
