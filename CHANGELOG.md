# Changelog

All notable changes to this project are documented in this file.

The format is based on Keep a Changelog and this project follows Semantic Versioning.

## [1.0.0] - 2026-02-25

### Added
- Core app routes for auth, directory, projects, core views, and admin.
- Supabase schema, RLS policy model, and seed workflow.
- Project detail editing flows for roadmap, key milestones, links, and image references.
- Drag-and-drop roadmap movement with inline status/error feedback.
- Consolidated roadmap view and core team-oriented roadmap view.
- Regression test coverage for key project-detail workflows.

### Changed
- Visual system updated to a dark, high-contrast operational style.
- Sidebar navigation now supports desktop collapse/expand behavior.
- Project page now surfaces explicit edit-access status and jump links to editing sections.
- Consolidated roadmap grouping updated to support project-oriented swimlanes.

### Security
- Remote image handling tightened with allowlisted host validation.
- Middleware auth behavior set to fail closed for protected routes when auth env is missing.

