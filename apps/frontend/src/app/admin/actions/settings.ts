"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { validateAdminSession, insertAuditLog } from "./security";
import { z } from "zod";

const saveSystemSettingsSchema = z.object({
  key: z.string().min(1, "Key wajib diisi"),
  value: z.any(),
  description: z.string().nullable().optional()
});

const testFonnteWhatsAppSchema = z.object({
  targetPhone: z.string().min(5, "Nomor telepon terlalu pendek"),
  testMessage: z.string().min(1, "Pesan wajib diisi")
});

/**
 * Saves dynamic environment configurations to the database overrides table
 */
export async function saveSystemSettings(key: string, value: any, description?: string) {
  try {
    // 1. Zero-Trust Admin session check
    const session = await validateAdminSession();

    // 2. Strict Zod payload validation
    const validated = saveSystemSettingsSchema.parse({ key, value, description });

    if (!supabaseAdmin) {
      return { success: false, message: "Database is offline." };
    }

    // 3. Upsert settings override record
    const { error } = await supabaseAdmin
      .from("system_settings")
      .upsert({
        key: validated.key,
        value: validated.value,
        description: validated.description || null,
        updated_at: new Date().toISOString()
      }, { onConflict: "key" });

    if (error) {
      console.error(`Gagal menyimpan system settings '${validated.key}':`, error);
      return { success: false, message: error.message };
    }

    // 4. Record secure audit trail event
    await insertAuditLog(
      session.staffId,
      session.actorEmail,
      "system_settings",
      "00000000-0000-0000-0000-000000000000",
      "UPDATE_SYSTEM_SETTINGS",
      { key: validated.key, value: validated.value }
    );

    revalidatePath("/admin/settings");
    revalidatePath("/admin/finance");

    return { success: true, message: `Sukses menyimpan konfigurasi '${validated.key}'!` };
  } catch (err: any) {
    console.error("Critical failure updating system settings:", err);
    return { success: false, message: err?.message || "Otorisasi ditolak atau input tidak valid." };
  }
}

/**
 * Dispatches a real-time test WhatsApp notification via Fonnte
 */
export async function testFonnteWhatsApp(targetPhone: string, testMessage: string) {
  try {
    // 1. Zero-Trust Admin session check
    const session = await validateAdminSession();

    // 2. Strict Zod payload validation
    const validated = testFonnteWhatsAppSchema.parse({ targetPhone, testMessage });

    const token = process.env.FONNTE_TOKEN;
    if (!token) {
      return { 
        success: false, 
        message: "Gagal memicu: FONNTE_TOKEN tidak terdefinisi di environment variables (.env)." 
      };
    }

    const cleanPhone = validated.targetPhone.replace(/[^0-9]/g, "");
    if (!cleanPhone) {
      return { success: false, message: "Nomor handphone tidak valid." };
    }

    console.log(`Pemicuan WhatsApp test ke: ${cleanPhone}...`);
    
    const res = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: {
        "Authorization": token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        target: cleanPhone,
        message: validated.testMessage
      })
    });

    const result = await res.json();
    
    if (result.status) {
      // 3. Record secure audit trail event via standard utility
      await insertAuditLog(
        session.staffId,
        session.actorEmail,
        "system_settings",
        "00000000-0000-0000-0000-000000000000",
        "INTEGRATION_TEST_FONNTE",
        { service: "Fonnte WhatsApp", status: "Success", recipient: cleanPhone }
      );

      return { 
        success: true, 
        message: `Pesan uji sukses terkirim ke WhatsApp! ID Transaksi Fonnte: ${result.id || "N/A"}` 
      };
    } else {
      return { 
        success: false, 
        message: `Fonnte menolak pengiriman: ${result.reason || "Kredensial salah"}` 
      };
    }
  } catch (err: any) {
    console.error("Critical failure during Fonnte WhatsApp integration test:", err);
    return { success: false, message: err?.message || "Koneksi gateway terputus atau otorisasi ditolak." };
  }
}
