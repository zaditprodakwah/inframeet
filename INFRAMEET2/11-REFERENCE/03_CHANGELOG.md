# INFRAMEET - Documentation Changelog

## [2.0.0] - 2026-05-20
### Added
- Integrated **Pillar 1 (Database Backbone)**: Deployed sequential SQL schema migrations incorporating the expert directory, verifiable credentials, utility tools engine, and the "God Mode" security addendum.
- Integrated **Pillar 2 (Universal API Contract)**: Centralized request validations via Zod schemas in `apiSchemas.ts` and response formatting in `apiEnvelope.ts`. Refactored inquiries routes with rate-limiting and Cloudflare Turnstile token validation.
- Integrated **Pillar 3 (God Mode Control Center)**: Implemented high-fidelity dashboard at `/admin/god-mode`, escrow release/refund bypasses, and active UGC moderation queues.
- Integrated **Pillar 4 (Mitra Embedded Widgets)**: Created interactive testimonials carousel, project milestone stepper, B2B ROI calculators, and academic DOI formatter lead magnet capturing Crossref metadata.

### Changed
- Replaced legacy `staff` reference checks inside Next.js and SQL trigger functions to reference the modern unified `user_roles` lookup table.
- Upgraded local `validateAdminSession()` helper in `security.ts` to prevent runtime crashes by matching roles against `user_roles` instead of the legacy deprecated table.
- Refactored all absolute documentation links in `INFRAMEET2/README.md` to portable relative markdown paths.

## [1.0.0] - 2026-05-19
- Initial release of the universal, modular documentation structure.
- Extracted and separated contents from the master `INFRAMEET.md` and `INFRAMEET_IMPLEMENTATION_HANDBOOK.md` files.
- Added actual JSON response examples, RLS pseudocode rules, GitHub Actions worker contracts, feature flags, and detailed testing plans.
