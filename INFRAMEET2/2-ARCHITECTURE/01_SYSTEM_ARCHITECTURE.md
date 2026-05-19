# INFRAMEET - System Architecture

## Architecture Overview
INFRAMEET is built as a highly decoupled, modern monorepo designed for high-performance and low-cost maintenance.

```
+-----------------------+      HTTPS/CORS      +-----------------------------+
|    Visitor Browser    |--------------------->|     Next.js Web App        |
|  (Renders Widget/UI)  |<---------------------|   (Vercel Hosting Layer)    |
+-----------------------+                      +-----------------------------+
                                                              |
                                                              | Supabase JS SDK
                                                              v
+-----------------------+      Cron Job        +-----------------------------+
|  GitHub Actions Worker|<---------------------|        Supabase DB          |
|  (Scheduled Pipelines)|--------------------->| (Postgres + pgvector + RLS) |
+-----------------------+    Execute RPC RPC   +-----------------------------+
```

---
