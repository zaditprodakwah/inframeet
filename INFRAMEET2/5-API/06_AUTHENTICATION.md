# INFRAMEET - Authentication Architecture

## Supabase JWT and NextAuth
INFRAMEET securely handles authentication using two primary mechanisms:
1. **Client Identity**: Supabase Authentication handles password hashing, OAuth callbacks, and token signing.
2. **Next.js Server Session**: NextAuth decodes and verifies JWT signatures using our private `SUPABASE_JWT_SECRET`.

## Role Authorization Middleware
Server API routes extract the user ID and query the `user_roles` table. If the role does not match the route requirement (e.g., verifier role required for `/api/admin/proofs`), an immediate `403_FORBIDDEN` is returned before hitting database layers.
