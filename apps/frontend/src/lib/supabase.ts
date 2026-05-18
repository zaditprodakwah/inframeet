import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase public environment variables (URL/Anon Key)!");
}

// 1. Standard Client for user/client transactions (inherits RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
