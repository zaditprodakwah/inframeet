import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Redis } from "@upstash/redis";

export async function proxy(req: NextRequest) {
  const res = NextResponse.next();
  const { pathname } = req.nextUrl;

  // 0. Global Edge Rate Limiting (Upstash Redis)
  // Apply to API routes to protect database and reduce Vercel compute
  if (pathname.startsWith("/api/")) {
    const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
    const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;
    
    if (upstashUrl && upstashToken) {
      try {
        const redis = new Redis({
          url: upstashUrl,
          token: upstashToken,
        });
        
        const ip = req.headers.get("x-forwarded-for") || req.ip || "anon";
        // Sliding window token bucket: 60 requests per 60 seconds
        const WINDOW_SEC = 60;
        const MAX_REQ = 60;
        
        const key = `rl:${ip}:${Math.floor(Date.now() / 1000 / WINDOW_SEC)}`;
        const cur = await redis.incr(key);
        
        if (cur === 1) {
          await redis.expire(key, WINDOW_SEC);
        }
        
        if (cur > MAX_REQ) {
          return NextResponse.json(
            { error: "Too Many Requests. IP has been rate-limited." }, 
            { status: 429 }
          );
        }
      } catch (err) {
        console.warn("Redis Rate Limit failed or offline, bypassing safely:", err);
      }
    }
  }

  // 1. Guard administrative routes and serverless APIs
  const isAdminPath = pathname.startsWith("/admin");
  const isAdminApiPath = pathname.startsWith("/api/admin");
  const isLoginPath = pathname === "/login";

  // Append bulletproof anti-crawler & anti-AI header to login, admin, and admin API routes
  if (isAdminPath || isAdminApiPath || isLoginPath) {
    res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive, nosnippet, noimageindex");
  }

  if (isAdminPath || isAdminApiPath) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const unauthorizedResponse = () => {
      if (isAdminApiPath) {
        return NextResponse.json({ error: "Sesi admin tidak sah / tidak berhak (401 Unauthorized)." }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/login", req.url));
    };

    if (!supabaseUrl || !supabaseAnonKey) {
      return unauthorizedResponse();
    }

    // Try to get token from Supabase default cookies
    const cookieStore = req.cookies;
    
    // Supabase standard auth cookies are named sb-<project-ref>-auth-token or sb-access-token
    const projectRef = "iwowggzeqkzewdrdjkvu";
    const authCookie = cookieStore.get(`sb-${projectRef}-auth-token`) || cookieStore.get("sb-access-token");

    if (!authCookie) {
      return unauthorizedResponse();
    }

    try {
      // Parse the cookie to retrieve the access token
      let token = authCookie.value;
      if (token.startsWith("[") || token.startsWith("{")) {
        const parsed = JSON.parse(token);
        token = parsed.access_token || parsed[0] || token;
      }

      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const { data: { user }, error } = await supabase.auth.getUser(token);

      if (error || !user) {
        return unauthorizedResponse();
      }

      // Hardcoded bypass for the primary owner/admin to guarantee they can always access the Command Center (Adopted from myprofile)
      if (user.email === "muhzadit@gmail.com") {
        return res;
      }

      // Check if user is an admin by querying the user_roles table (replaces the legacy 'staff' table)
      const { data: userRole, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .single();

      if (roleError || !userRole) {
        if (isAdminApiPath) {
          return NextResponse.json({ error: "Akses Ditolak: Peran Administrator tidak aktif (403 Forbidden)." }, { status: 403 });
        }
        return NextResponse.redirect(new URL("/", req.url));
      }
    } catch (err) {
      console.error("Admin middleware auth verification failed:", err);
      return unauthorizedResponse();
    }
  }


  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/r/:path*"]
};
