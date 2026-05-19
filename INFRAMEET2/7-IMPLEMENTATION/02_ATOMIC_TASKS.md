# INFRAMEET - Jira/GitHub Compatible Atomic Tasks

A comprehensive checklist of modular tasks designed for both human engineers and AI Coder models.

## Phase 1: Foundation Tasks

### Task ID: INFRA-001 - Project Setup and Directory Scaffolding
- **Acceptance Criteria**:
  - **GIVEN** a new local repository directory
  - **WHEN** initializing Next.js and creating folders
  - **THEN** all 11 subfolders under `/docs` must exist, and local builds run without package compilation errors.
- **Dependencies**: None.
- **Estimated Effort**: 4 hours.
- **Definition of Done**:
  - [ ] Next.js 15 structure configured with TypeScript and pnpm.
  - [ ] ESLint and Prettier configs verified.
  - [ ] Document integrity check returns zero warnings.

### Task ID: INFRA-002 - Database Migration and Initial Schema Setup
- **Acceptance Criteria**:
  - **GIVEN** a clean Supabase project instance
  - **WHEN** applying the versioned SQL migrations
  - **THEN** all 20+ tables, custom enums, and default indexes are generated in PostgreSQL.
- **Dependencies**: INFRA-001.
- **Estimated Effort**: 8 hours.
- **Definition of Done**:
  - [ ] Database schema matches `001_inframeet_initial_schema.sql` exactly.
  - [ ] Table relationships and constraints verified on Supabase dashboard.

---

## Phase 2: Core Trust Feature Tasks

### Task ID: TRUST-001 - Proof Upload and Processing Pipeline
- **Acceptance Criteria**:
  - **GIVEN** an authenticated owner user on their dashboard
  - **WHEN** uploading a credibility document and submitting
  - **THEN** the file is stored in Cloudinary/R2, and a new record in `trust_proofs` with status `pending` is created.
- **Dependencies**: INFRA-002, AUTH-001.
- **Estimated Effort**: 16 hours.
