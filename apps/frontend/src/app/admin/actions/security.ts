"use server";

import { cookies, headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";
import { z } from "zod";

export interface AdminSession {
  staffId: string;
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
      // Query staff record if it exists to get staff ID, or fallback to dummy ID
      const { data: staff } = await supabaseAdmin
        .from("staff")
        .select("id")
        .eq("auth_user_id", user.id)
        .single();

      return {
        staffId: staff?.id || "00000000-0000-0000-0000-000000000000",
        actorEmail: user.email,
        userId: user.id
      };
    }

    // Regular staff authorization check
    const { data: staff, error: staffError } = await supabaseAdmin
      .from("staff")
      .select("id, email, role, is_active")
      .eq("auth_user_id", user.id)
      .single();

    if (staffError || !staff || staff.role !== "admin" || !staff.is_active) {
      throw new Error("Akses ditolak: Anda tidak memiliki wewenang administrator.");
    }

    return {
      staffId: staff.id,
      actorEmail: staff.email,
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

  // Use a fallback UUID if entityId is not a valid UUID (required by DB constraints)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const cleanEntityId = uuidRegex.test(entityId) ? entityId : "00000000-0000-0000-0000-000000000000";

  try {
    await supabaseAdmin.from("audit_log").insert({
      entity_type: entityType,
      entity_id: cleanEntityId,
      action: action,
      performed_by_staff_id: staffId === "00000000-0000-0000-0000-000000000000" ? null : staffId,
      changes: {
        actor_email: email,
        ...changes
      },
      ip_address: maskedIp,
      user_agent: userAgent
    });
  } catch (err) {
    console.error("Failed to insert security audit log:", err);
  }
}
