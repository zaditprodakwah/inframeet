# INFRAMEET - Postgres Database Maintenance Manual

To keep database queries fast on free tier servers:

## Monthly Indexes Maintenance
Verify that indexes are not bloated. If necessary, rebuild indexes during low-traffic hours:
```sql
REINDEX TABLE omni_directory;
REINDEX TABLE widget_events;
```

## Tablespace Cleanups
Purge logs that have aged past our 365-day retention policy:
```sql
DELETE FROM rate_limit_events WHERE created_at < NOW() - INTERVAL '30 days';
DELETE FROM system_events WHERE created_at < NOW() - INTERVAL '90 days';
```
