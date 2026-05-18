import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const { pathname } = req.nextUrl;

  // 1. Guard administrative routes
  if (pathname.startsWith("/admin")) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Try to get token from Supabase default cookies
    const cookieStore = req.cookies;
    
    // Supabase standard auth cookies are named sb-<project-ref>-auth-token or sb-access-token
    const projectRef = "iwowggzeqkzewdrdjkvu";
    const authCookie = cookieStore.get(`sb-${projectRef}-auth-token`) || cookieStore.get("sb-access-token");

    if (!authCookie) {
      // Redirect to custom admin login page if no token exists
      return NextResponse.redirect(new URL("/calculator", req.url));
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
        return NextResponse.redirect(new URL("/calculator", req.url));
      }

      // Check if user is an admin by querying the staff table
      const { data: staff, error: staffError } = await supabase
        .from("staff")
        .select("role")
        .eq("auth_user_id", user.id)
        .single();

      if (staffError || !staff || staff.role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    } catch (err) {
      console.error("Admin middleware auth verification failed:", err);
      return NextResponse.redirect(new URL("/calculator", req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/r/:path*"]
};
