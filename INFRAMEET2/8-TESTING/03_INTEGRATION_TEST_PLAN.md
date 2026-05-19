# INFRAMEET - Integration Testing Plan

Integration tests verify the successful interaction between API route boundaries and PostgreSQL RLS.

## Core Scenarios

### 1. Proof Approval Integrations
- **GIVEN** a pending proof in the database
- **WHEN** calling `POST /api/proofs/:id/approve` with a valid Moderator JWT
- **THEN** verify the status updates to approved, a reputation log is inserted, and the trust score increments.

### 2. Escrow Release Webhooks
- **GIVEN** a held escrow transaction
- **WHEN** Stripe dispatches a successful transfer webhook to `/api/webhooks/stripe`
- **THEN** verify the status updates to released, and the provider receives a positive review permission ticket.
