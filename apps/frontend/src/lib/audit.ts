import { supabaseAdmin } from "./supabase";

interface AuditLogParams {
  entity_type: string;
  entity_id: string; // Must be a valid UUID or fallback NIL UUID
  action: string;
  performed_by_staff_id?: string | null;
  changes?: Record<string, any> | null;
  ip_address?: string | null;
  user_agent?: string | null;
}

// Fallback NIL UUID to comply with UUID NOT NULL database constraints
const NIL_UUID = "00000000-0000-0000-0000-000000000000";

function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

export async function auditLog({
  entity_type,
  entity_id,
  action,
  performed_by_staff_id = null,
  changes = null,
  ip_address = "system",
  user_agent = "system",
}: AuditLogParams) {
  try {
    if (!supabaseAdmin) {
      console.warn("supabaseAdmin is not configured, skipping auditLog write");
      return { success: false, error: "Database client missing" };
    }

    // Ensure entity_id is a valid UUID
    const cleanEntityId = isValidUUID(entity_id) ? entity_id : null;

    // Clean IP Address to comply with Postgres INET (must be clean IPv4/IPv6, otherwise null)
    const cleanIp = ip_address && /^[0-9a-fA-F.:]+$/.test(ip_address.split(",")[0].trim())
      ? ip_address.split(",")[0].trim()
      : null;

    const { error } = await supabaseAdmin.from("system_events").insert({
      event_type: action,
      severity: "info",
      target_entity_id: cleanEntityId,
      target_table: entity_type,
      description: `Action: ${action} performed on ${entity_type}`,
      changes: changes || {},
      ip_address: cleanIp,
      user_agent: user_agent === "system" ? null : user_agent,
    });

    if (error) {
      console.error("Failed to write to system_events table:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error("auditLog helper crashed:", err);
    return { success: false, error: err.message };
  }
}

