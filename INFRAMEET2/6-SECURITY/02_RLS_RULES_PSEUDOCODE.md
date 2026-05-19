# INFRAMEET - Postgres RLS Pseudocode Rules

To help engineers easily understand, verify, and modify access rules, this document maps RLS policies to developer-readable pseudocode.

## Table: `profiles`
- **Read Policy**: Allow anyone to read.
  ```
  GIVEN any client
  WHEN SELECT * FROM profiles
  THEN return record
  ```
- **Update Policy**: Allow only the user owning the record.
  ```
  GIVEN authenticated user (auth.uid() = user_id)
  WHEN UPDATE profiles
  THEN allow modification
  ```

## Table: `user_roles`
- **Read Policy**: Allow anyone to read.
- **Write Policy**: Admin only.
  ```
  GIVEN authenticated user
  WHEN INSERT/UPDATE/DELETE ON user_roles
  THEN ALLOW ONLY IF user has role = 'admin' in user_roles
  ```

## Table: `omni_directory`
- **Read Policy**: Publicly readable.
- **Update Policy**: Owner only.
  ```
  GIVEN authenticated user (auth.uid() = owner_id)
  WHEN UPDATE omni_directory
  THEN allow modification
  ```

## Table: `reputation_logs`
- **Insert Policy**: Read-only via client. Mutation forbidden except by Server RPC (Security Definer).
  ```
  GIVEN any client query
  WHEN INSERT INTO reputation_logs
  THEN REJECT immediately
  ```
