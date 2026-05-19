# INFRAMEET - Database Indexing Strategy

To maintain sub-200ms API response latencies, our Postgres instance is hardened with highly specific indexes designed for frequent queries.

## Critical Production Indexes

### 1. Directory Search and Filters
```sql
CREATE INDEX idx_omni_directory_slug ON omni_directory (slug);
CREATE INDEX idx_omni_directory_verification_status ON omni_directory (verification_status);
CREATE INDEX idx_omni_directory_trust_score ON omni_directory (trust_score DESC);
```

### 2. Proof System Audit Queries
```sql
CREATE INDEX idx_trust_proofs_directory_id_status ON trust_proofs (directory_id, status);
CREATE INDEX idx_trust_proofs_file_hash ON trust_proofs (file_hash);
```

### 3. Widget Analytics & Aggregations
```sql
CREATE INDEX idx_widget_events_installation_created ON widget_events (installation_id, created_at DESC);
CREATE INDEX idx_widget_events_ip_hash ON widget_events (ip_hash);
```

### 4. Anti-Abuse Tracking
```sql
CREATE INDEX idx_rate_limit_events_key_created ON rate_limit_events (event_key, created_at DESC);
```
