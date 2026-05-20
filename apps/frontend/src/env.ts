import { z } from "zod";

const envSchema = z.object({
  // Core Settings
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),

  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(10),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(10),

  // Groq API (AI Content parser)
  GROQ_API_KEY: z.string().optional(),

  // Upstash Redis (Rate limiting)
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

  // Worker & Security
  WORKER_API_SECRET: z.string().min(16).default("temporary_fallback_secret_for_tests"),
});

// Since Next.js runs in both Server & Client environments, 
// we only validate server-side variables when we are on the server.
const isServer = typeof window === "undefined";

let env: z.infer<typeof envSchema>;

if (isServer) {
  const parsed = envSchema.safeParse({
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    WORKER_API_SECRET: process.env.WORKER_API_SECRET,
  });

  if (!parsed.success) {
    console.error("❌ Invalid environment variables during boot-up validation:");
    console.error(JSON.stringify(parsed.error.format(), null, 2));
    // Fail-fast in production to prevent deployment of broken states
    if (process.env.NODE_ENV === "production") {
      throw new Error("Missing or invalid environment variables. Build aborted.");
    }
  }

  env = (parsed.success ? parsed.data : process.env) as any;
} else {
  // On client side, only expose public environment variables
  env = {
    NODE_ENV: process.env.NODE_ENV as any,
    NEXT_PUBLIC_APP_URL: (process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000") as any,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL as any,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as any,
  } as any;
}

export { env };
