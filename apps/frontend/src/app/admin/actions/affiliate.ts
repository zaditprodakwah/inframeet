"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function updateToolAffiliate(
  toolId: string,
  network: string,
  advertiserId: string,
  originalUrl: string
) {
  if (!supabaseAdmin) {
    return { success: false, message: "Database offline." };
  }

  try {
    // 1. Update tools_directory network configuration
    // Flush cached_deep_link to enforce immediate renewal on next visit
    const { error } = await supabaseAdmin
      .from("tools_directory")
      .update({
        affiliate_network: network,
        network_advertiser_id: advertiserId,
        original_url: originalUrl || null,
        cached_deep_link: null,
        deep_link_generated_at: null
      })
      .eq("id", toolId);

    if (error) {
      console.error(`Failed to update tool network for ID '${toolId}':`, error);
      return { success: false, message: error.message };
    }

    revalidatePath("/admin/affiliate");
    revalidatePath("/tools");

    return { 
      success: true, 
      message: `Konfigurasi sukses disimpan! Jaringan afiliasi diubah ke '${network}' dan cache link dinonaktifkan.` 
    };
  } catch (err: any) {
    console.error("Critical failure during affiliate settings update:", err);
    return { success: false, message: err?.message || "Internal crash." };
  }
}
