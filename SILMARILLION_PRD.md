# SILMARILLION – PRD + BUILD SPEC (FOR CODEX)

You are building **Silmarillion**, an internal web application for Accelint’s UX Software Factory.

The app provides shared situational awareness of:

* What projects we support
* What each project is doing (Now / Next / Later – 30/60/90 days)
* Which teams and people support each project
* How staffing is matrixed across teams and projects

The app is viewable by all authenticated users. Only admins can create projects and manage assignments.

We are building an MVP with clean architecture, strict TypeScript, and production-ready structure.

---

# 1. TECH STACK (MANDATORY)

## Frontend / Fullstack

* **Next.js (App Router)**
* **TypeScript**
* **React**
* **Tailwind CSS**
* Component library optional (shadcn/ui allowed but lightweight)

## Backend / Infra

* **Supabase**

  * Supabase Auth (email + password)
  * Supabase Postgres
  * Supabase Storage (project images)
  * Row Level Security (RLS)

## Testing

* Vitest (unit)
* Playwright (E2E)

## Deployment

* Vercel

---

# 2. VISUAL DESIGN SYSTEM

Theme: **Lord of the Rings-inspired**

## Constraints

* Light mode only
* Off-white parchment background
* Ornate but restrained
* Serif headings, clean body font
* Subtle borders, dividers, filigree motifs
* Print-friendly layout

## Design Tokens

* Background: warm off-white
* Primary accent: muted gold
* Secondary accent: deep forest green
* Borders: subtle sepia tone
* No dark UI

The UI should feel like a refined parchment dossier — not themed cosplay.

---

# 3. USER ROLES & PERMISSIONS

## Roles

* `viewer`
* `editor`
* `admin`

## Rules

* All authenticated users can view all projects
* Editors can edit only assigned projects
* Admin can:

  * Approve waitlist users
  * Assign roles
  * Create projects
  * Manage team assignments
  * Manage Core configuration

Enforce via:

* Supabase RLS
* Server-side validation (never rely on client checks)

---

# 4. ROUTE STRUCTURE (EXPLICIT)

Use Next.js App Router.

```
/login
/waitlist
/
/projects
/projects/[projectId]
/my-projects
/core
/admin
/admin/waitlist
/admin/users
/admin/projects
```

---

# 5. DATA MODEL (AUTHORITATIVE)

## users

* id (uuid)
* email
* name
* role: viewer | editor | admin
* status: pending | active | denied
* created_at

## waitlist_requests

* id
* name
* email
* requested_at
* status: pending | approved | denied

## people

Represents staffing directory (not just auth users)

* id
* display_name
* title
* org_unit
* is_leadership (boolean)
* profile_photo_url (nullable)

## teams

* id
* name
* description

## projects

* id
* name
* codename
* description
* is_core (boolean)
* created_at

## project_teams

* project_id
* team_id

## team_memberships

* team_id
* person_id
* role:

  * pm
  * engineer
  * designer
  * other        ← REQUIRED (for data scientists, solution architects, etc.)
  * leadership
* allocation_pct (nullable)

## project_editors

* project_id
* user_id

## roadmap_items

* id
* project_id
* team_id (nullable for Core orientation flexibility)
* horizon: now | next | later
* title
* body
* owner_person_id (nullable)
* created_at

## project_links

* id
* project_id
* label
* url

## project_images

* id
* project_id
* storage_path
* caption

---

# 6. CORE AREA SPECIAL RULES

Core is a special logical grouping.

Projects marked `is_core = true` appear in `/core`.

## Core Roadmap Orientation

* Swimlanes organized by TEAM
* Columns: Now / Next / Later
* Multiple initiatives (Conductor, Maestro, DevTK, etc.) represented as roadmap items or grouped projects

Core UI must clearly distinguish itself from normal projects.

---

# 7. REQUIRED FEATURES BY PAGE

---

## LOGIN (`/login`)

* Email + password (Supabase Auth)
* Link to waitlist
* Minimal LOTR styling

---

## WAITLIST (`/waitlist`)

Form:

* Name
* Email

Submission:

* Creates waitlist_request (status=pending)
* Confirmation message shown

Admin must approve before user becomes active.

---

## MAIN DIRECTORY (`/`)

Primary daily-use page.

Must include:

* Global search bar
* Filter tabs: Projects | Teams | People
* Card-based layout

Must support:

* Find a person → see their teams + projects
* Find a project → see teams + staffing
* Find a team → see projects + people

Search should be fast and client-filtered after initial load.

---

## PROJECTS LIST (`/projects`)

* List all projects
* Filter/search
* Link to detail page

---

## PROJECT DETAIL (`/projects/[projectId]`)

### Sections (in order)

### 1. Header

* Name
* Codename
* Print to PDF button

### 2. Description

### 3. Roadmap Board

* 3 columns: Now / Next / Later
* Swimlanes by team
* Cards contain:

  * Title
  * Short body
  * Owner (optional)

### 4. Images Section

### 5. Important Links

### 6. Team Directory

Grouped by team.

Each team shows:

* PM
* Engineers
* Designers
* Other (data scientists, solution architects, etc.)
* Leadership (if assigned)

### 7. Flattened People List

Shows all people supporting the project with roles.

---

## Print Mode

* Use `@media print`
* Hide nav/sidebar
* Clean parchment layout
* Include roadmap + description + staffing + links

---

## MY PROJECTS (`/my-projects`)

* List projects where user is editor
* Quick edit entry points

---

## CORE (`/core`)

* Show all projects where `is_core = true`
* Roadmap organized by team swimlanes
* UI label: “The Great Works of the Core”

---

# 8. ADMIN SECTION

## `/admin`

Dashboard summary:

* Pending approvals
* Total users
* Total projects

## `/admin/waitlist`

* List pending requests
* Approve → creates user (status=active, role=viewer)
* Deny

## `/admin/users`

* Assign roles
* Change status
* Assign project edit rights

## `/admin/projects`

* Create project
* Edit description
* Toggle is_core
* Assign teams

---

# 9. PERMISSIONS ENFORCEMENT

Must implement:

* Middleware protection for authenticated routes
* Role-based UI gating
* Server-side validation for:

  * Project creation
  * Role changes
  * Team assignments
  * Roadmap edits

Never rely solely on client checks.

---

# 10. INITIAL SEED DATA (FOR DEV)

Create seed data:

Project: **JERIC2O**

Teams:

* Bolt
* ACE
* Dominance

Three designers matrixed across teams.

One designer also assigned to:

* AARO team
* AARO project

Leadership person:

* Holen “Money” Holmquist

Demonstrate:

* Multi-team membership
* Multi-project membership
* Matrixed designer
* Leadership visibility

---

# 11. COMPONENT LIST (EXPLICIT)

## Layout

* AppShell
* SidebarNav
* TopNav
* PageHeader

## Auth

* LoginForm
* WaitlistForm

## Directory

* SearchBar
* FilterTabs
* ProjectCard
* TeamCard
* PersonCard

## Project Page

* ProjectHeader
* RoadmapBoard
* RoadmapColumn
* RoadmapCard
* TeamDirectory
* PersonList
* LinksList
* ImageGallery
* PrintButton

## Admin

* WaitlistTable
* UserRoleEditor
* ProjectEditorForm
* TeamAssignmentManager

## Core

* CoreRoadmapBoard

---

# 12. INCREMENTAL BUILD MILESTONES

## Milestone 1 – Scaffold

* Next.js app
* Tailwind setup
* Supabase integration
* Auth flow working
* Protected routes

## Milestone 2 – Data Model + Seed

* Create tables
* RLS policies
* Seed JERIC2O scenario
* Admin bootstrap user

## Milestone 3 – Directory

* Main page search
* Cards for Projects / Teams / People
* Relationship resolution

## Milestone 4 – Project Detail

* Roadmap display
* Team directory
* Links
* Images
* Print stylesheet

## Milestone 5 – Editing

* Editor permissions
* Roadmap item CRUD
* Project editing

## Milestone 6 – Admin

* Waitlist approval
* Role management
* Project creation

## Milestone 7 – Core Mode

* Core page
* Team-oriented roadmap view

## Milestone 8 – Hardening

* Unit tests (Vitest)
* E2E tests (Playwright)
* Permission audit
* Performance polish

---

# 13. CODE QUALITY REQUIREMENTS

* Strict TypeScript (no `any`)
* Server Components by default
* Client Components only where necessary
* Clean folder structure
* Reusable UI primitives
* No overengineering

---

# END STATE

Deliver a clean, production-ready MVP that:

* Clearly answers: “Who is working on what?”
* Shows now/next/later roadmaps per team
* Handles matrixed staffing cleanly
* Enforces role-based permissions
* Feels like a refined, parchment-themed LOTR dossier

Build incrementally, cleanly, and securely.
