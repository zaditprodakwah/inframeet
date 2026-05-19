# INFRAMEET - Database Migration Strategy & Guide

Our Postgres schema changes follow a strict, versioned migration flow to guarantee zero-downtime deployments.

## Migration Versioning Standards
- All migration scripts reside in `supabase/migrations/`.
- Naming format: `[VERSION]_[DESCRIPTION].sql` (e.g., `001_initial_schema.sql`, `002_add_indexing.sql`).
- Migrations must be **idempotent** (use `CREATE TABLE IF NOT EXISTS`, `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`).

## Pre-Migration Backup Checklist
- [ ] Verify that automated daily snapshots succeeded in Supabase dashboard.
- [ ] Run manual database dump:
  ```bash
  supabase db dump --db-url "$DATABASE_URL" -f backup_pre_migration.sql
  ```
- [ ] Ensure local test suites pass completely on local replica.
- [ ] Confirm rollback script is ready and tested.

## Rollback Procedures
If a migration fails in production:
1. Immediately restore database to pre-migration snapshot or run rollback SQL:
   ```sql
   -- Example Rollback script for 002_add_indexing.sql
   DROP INDEX IF EXISTS idx_omni_directory_trust_score;
   ```
2. Point Vercel back to stable commit if application code was coupled with migrations.
