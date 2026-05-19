# INFRAMEET - Backup & Recovery Runbook

## Backup Routines
- **Daily Physical Snapshot**: Managed automatically by Supabase, retained for 7 days (Free tier) or 30 days (Pro tier).
- **Weekly Logical Backups**: Automated export of raw table schemas and contents written directly to an isolated Cloudflare R2 bucket.

## Recovery Procedures

### Restoring Schema in Disaster Event
1. Spin up a clean Supabase database instance.
2. Apply the initial schema:
   ```bash
   supabase db reset --db-url "$DATABASE_URL"
   ```
3. Import logical table backups in structural order (profiles first, then entities, then logs).
