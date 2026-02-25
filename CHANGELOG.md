# Changelog

All notable changes to this project are documented in this file.

The format is based on Keep a Changelog and this project follows Semantic Versioning.

## [1.0.1] - 2026-02-25

### Added
- Reusable submit-status button feedback for project editing forms (`Saving...` then `Saved`).
- Dedicated release notes for version `1.0.1`.

### Changed
- Updated visual tokens and typography to align with the adopted brand-guide color and font system while keeping product language vendor-neutral.
- Increased accent prominence across key UI surfaces (navigation, headers, and directory cards).
- Improved sidebar navigation clarity with stronger active-state signaling.

### Fixed
- Removed transition overlay/glint that reduced readability on page content.
- Improved CTA and form contrast to keep interactions legible in dark mode.

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
