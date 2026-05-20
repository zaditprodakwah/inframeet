"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { validateAdminSession, insertAuditLog } from "./security";
import { z } from "zod";

const updateToolAffiliateSchema = z.object({
  toolId: z.string().uuid(),
  network: z.enum(['manual', 'involve_asia', 'accesstrade', 'partnerstack', 'impact', 'direct_program']),
  advertiserId: z.string().min(1, "ID Pengiklan wajib diisi"),
  originalUrl: z.string().url("Format URL asli tidak valid").or(z.string().length(0)).or(z.string().nullable().optional())
});

export async function updateToolAffiliate(
  toolId: string,
  network: string,
  advertiserId: string,
  originalUrl: string
) {
  try {
    // 1. Zero-Trust Admin session check
    const session = await validateAdminSession();

    // 2. Strict Zod payload validation
    const validated = updateToolAffiliateSchema.parse({
      toolId,
      network,
      advertiserId,
      originalUrl
    });

    if (!supabaseAdmin) {
      return { success: false, message: "Database offline." };
    }

    // 3. Update tools_directory network configuration
    const { error } = await supabaseAdmin
      .from("tools_directory")
      .update({
        affiliate_network: validated.network,
        network_advertiser_id: validated.advertiserId,
        original_url: validated.originalUrl || null,
        cached_deep_link: null,
        deep_link_generated_at: null
      })
      .eq("id", validated.toolId);

    if (error) {
      console.error(`Failed to update tool network for ID '${validated.toolId}':`, error);
      return { success: false, message: error.message };
    }

    // 4. Record secure audit trail event
    await insertAuditLog(
      session.staffId,
      session.actorEmail,
      "tools_directory",
      validated.toolId,
      "UPDATE_AFFILIATE_CONFIG",
      { network: validated.network, advertiserId: validated.advertiserId }
    );

    revalidatePath("/admin/affiliate");
    revalidatePath("/tools");

    return { 
      success: true, 
      message: `Konfigurasi sukses disimpan! Jaringan afiliasi diubah ke '${validated.network}' dan cache link dinonaktifkan.` 
    };
  } catch (err: any) {
    console.error("Critical failure during affiliate settings update:", err);
    return { success: false, message: err?.message || "Otorisasi ditolak atau input tidak valid." };
  }
}

const batchUpdateSchema = z.array(updateToolAffiliateSchema);

export async function batchUpdateToolAffiliates(
  payload: { toolId: string; network: string; advertiserId: string; originalUrl: string }[]
) {
  try {
    const session = await validateAdminSession();
    const validated = batchUpdateSchema.parse(payload);

    if (!supabaseAdmin) {
      return { success: false, message: "Database offline." };
    }

    // Bulk Upsert in O(1) single transaction
    const upsertData = validated.map((item) => ({
      id: item.toolId,
      affiliate_network: item.network,
      network_advertiser_id: item.advertiserId,
      original_url: item.originalUrl || null,
      cached_deep_link: null,
      deep_link_generated_at: null
    }));

    const { error } = await supabaseAdmin
      .from("tools_directory")
      .upsert(upsertData, { onConflict: "id" });

    if (error) {
      console.error(`Failed to batch update tool networks:`, error);
      return { success: false, message: error.message };
    }

    // Single Audit Log entry for the entire batch
    await insertAuditLog(
      session.staffId,
      session.actorEmail,
      "tools_directory",
      "BATCH_MULTIPLE_IDS",
      "BATCH_UPDATE_AFFILIATE_CONFIG",
      { count: validated.length }
    );

    revalidatePath("/admin/affiliate");
    revalidatePath("/tools");

    return { 
      success: true, 
      message: `Konfigurasi massal sukses! ${validated.length} alat telah diperbarui jaringannya.` 
    };
  } catch (err: any) {
    console.error("Critical failure during batch affiliate settings update:", err);
    return { success: false, message: err?.message || "Otorisasi ditolak atau input massal tidak valid." };
  }
}
