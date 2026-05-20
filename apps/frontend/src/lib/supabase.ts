import { createClient } from "@supabase/supabase-js";

const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build" || process.env.CI === "true" || process.env.CI === "1" || !!process.env.CI;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || (isBuildPhase ? "https://placeholder-project-id.supabase.co" : "");
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || (isBuildPhase ? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder" : "");
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || (isBuildPhase ? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder-service" : "");

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase public environment variables (URL/Anon Key)!");
}

// 1. Standard Client for user/client transactions (inherits RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const supabaseClient = supabase; // Compatibility alias

// 2. Admin Client for bypasses and system operations (bypasses RLS)
// Note: This must only be imported and executed in server-side environments (Server Components, API routes).
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;

