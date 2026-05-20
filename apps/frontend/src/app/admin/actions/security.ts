"use server";

import { cookies, headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";

export interface AdminSession {
  staffId: string; // maps to user ID in the new schema
  actorEmail: string;
  userId: string;
}

/**
 * Validates the current admin user session via Supabase cookies.
 * Supports a super-admin bypass for muhzadit@gmail.com.
 */
export async function validateAdminSession(): Promise<AdminSession> {
  if (!supabaseAdmin) {
    throw new Error("Client database offline.");
  }

  const cookieStore = await cookies();
  const projectRef = "iwowggzeqkzewdrdjkvu";
  const authCookie = cookieStore.get(`sb-${projectRef}-auth-token`) || cookieStore.get("sb-access-token");

  if (!authCookie) {
    throw new Error("Akses ditolak: Sesi tidak ditemukan.");
  }

  try {
    let token = authCookie.value;
    if (token.startsWith("[") || token.startsWith("{")) {
      const parsed = JSON.parse(token);
      token = parsed.access_token || parsed[0] || token;
    }

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      throw new Error("Akses ditolak: Sesi tidak sah.");
    }

    // Bypass for primary owner
    if (user.email === "muhzadit@gmail.com") {
      return {
        staffId: user.id,
        actorEmail: user.email,
        userId: user.id
      };
    }

    // Modern authorization check referencing user_roles
    const { data: userRole, error: roleError } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .single();

    if (roleError || !userRole) {
      throw new Error("Akses ditolak: Anda tidak memiliki wewenang administrator.");
    }

    return {
      staffId: user.id,
      actorEmail: user.email || "admin@inframet.xyz",
      userId: user.id
    };
  } catch (err: any) {
    console.error("Admin action validation failed:", err);
    throw new Error(err.message || "Kegagalan otorisasi admin.");
  }
}

/**
 * Inserts a secure audit log tied to the current staff activity.
 */
export async function insertAuditLog(
  staffId: string,
  email: string,
  entityType: string,
  entityId: string,
  action: string,
  changes: any
) {
  if (!supabaseAdmin) return;

  const headerList = await headers();
  const rawIp = headerList.get("x-forwarded-for") || headerList.get("x-real-ip") || "127.0.0.1";
  
  // Mask IP last octet to protect privacy and satisfy UU PDP requirements
  const ipParts = rawIp.split(",");
  const primaryIp = ipParts[0].trim();
  const maskedIp = primaryIp.includes(".") 
    ? primaryIp.split(".").slice(0, 3).join(".") + ".xxx" 
    : primaryIp;

  const userAgent = headerList.get("user-agent") || "NextJS-Server-Action";

  // Use a fallback UUID if entityId is not a valid UUID
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const cleanEntityId = uuidRegex.test(entityId) ? entityId : "00000000-0000-0000-0000-000000000000";

  try {
    // Record to admin audit log
    await supabaseAdmin.from("admin_audit_logs").insert({
      admin_id: staffId,
      action_type: `${action}_${entityType.toUpperCase()}`,
      target_id: cleanEntityId
    });
  } catch (err) {
    console.error("Failed to insert security audit log:", err);
  }
}
