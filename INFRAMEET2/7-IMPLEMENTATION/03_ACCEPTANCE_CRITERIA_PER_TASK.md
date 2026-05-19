# INFRAMEET - Task-Level Acceptance Criteria Registry

This registry maps every atomic task in the backlog to exact, verifiable GIVEN/WHEN/THEN test scenarios.

## Authentication System (AUTH-001)
- **GIVEN** an unauthenticated visitor on the Signup page
- **WHEN** entering a valid corporate email address and strong password
- **THEN** a verification link is dispatched, and a new record appears in the `profiles` table.

## Trust Point Ingestion (TRUST-002)
- **GIVEN** a pending proof in the database
- **WHEN** a verifier user calls the RPC `approve_proof()` with `points = 25`
- **THEN** the points are logged in `reputation_logs`, and the score of the entity in `omni_directory` increments by 25 points.
