# INFRAMEET - Security Incident Response SOP

Emergency procedures for engineering staff during critical service failures.

## Phase 1: Identification & Escalation
- **Trigger**: Sentry alerts showing high volumes of `401_UNAUTHORIZED` or `500_DATABASE_ERROR` on critical payment endpoints.
- **Action**: Alert the Lead Architect and Security Lead via Telegram and PagerDuty immediately.

## Phase 2: Containment
- **Action**: If database exposure is suspected, toggle **Maintenance Mode** immediately via feature flags. This returns an HTTP `503 Service Unavailable` to all users, preserving database integrity during inspection.

## Phase 3: Mitigation & Eradication
- If an admin token is leaked: Roll the `SUPABASE_SERVICE_ROLE_KEY` and update all GitHub Secrets and Vercel configs immediately.
