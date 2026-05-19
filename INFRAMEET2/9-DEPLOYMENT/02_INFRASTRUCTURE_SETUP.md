# INFRAMEET - Infrastructure Setup Guide

Step-by-step instructions to initialize external cloud platforms:

## 1. Setup Supabase Project
1. Register on [supabase.com](https://supabase.com).
2. Create project `inframeet-prod`.
3. Open the **SQL Editor**, paste the contents of `001_inframeet_initial_schema.sql`, and execute.
4. Go to API Settings, copy `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`.

## 2. Setup Vercel Deployments
1. Connect Vercel to your GitHub repo.
2. Select your Next.js project.
3. Copy environment variables from `.env.local.example` and paste them into Vercel dashboard.
