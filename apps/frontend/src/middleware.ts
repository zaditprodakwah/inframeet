import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const { pathname } = req.nextUrl;

  // 1. Guard administrative routes and serverless APIs
  const isAdminPath = pathname.startsWith("/admin");
  const isAdminApiPath = pathname.startsWith("/api/admin");

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

      // Check if user is an admin by querying the staff table
      const { data: staff, error: staffError } = await supabase
        .from("staff")
        .select("role, is_active")
        .eq("auth_user_id", user.id)
        .single();

      if (staffError || !staff || staff.role !== "admin" || !staff.is_active) {
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
