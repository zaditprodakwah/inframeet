# INFRAMEET - Core Security Model

Our security model follows a rigid defense-in-depth framework:
1. **Never Trust Client Inputs**: The client can submit raw text or requests, but the server validates structure via **Zod**, sanitizes strings against XSS, and performs all final mutations inside closed PostgreSQL transactions.
2. **Role Isolation**: Standard users, moderators, verifiers, and administrators have strict Postgres schema boundaries.

---
