"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

/**
 * Saves dynamic environment configurations to the database overrides table
 */
export async function saveSystemSettings(key: string, value: any, description?: string) {
  if (!supabaseAdmin) {
    return { success: false, message: "Database is offline." };
  }

  try {
    const { error } = await supabaseAdmin
      .from("system_settings")
      .upsert({
        key,
        value,
        description: description || null,
        updated_at: new Date().toISOString()
      }, { onConflict: "key" });

    if (error) {
      console.error(`Gagal menyimpan system settings '${key}':`, error);
      return { success: false, message: error.message };
    }

    revalidatePath("/admin/settings");
    revalidatePath("/admin/finance");

    return { success: true, message: `Sukses menyimpan konfigurasi '${key}'!` };
  } catch (err: any) {
    return { success: false, message: err?.message || "Internal server settings update failure." };
  }
}

/**
 * Dispatches a real-time test WhatsApp notification via Fonnte
 */
export async function testFonnteWhatsApp(targetPhone: string, testMessage: string) {
  const token = process.env.FONNTE_TOKEN;
  
  if (!token) {
    return { 
      success: false, 
      message: "Gagal memicu: FONNTE_TOKEN tidak terdefinisi di environment variables (.env)." 
    };
  }

  const cleanPhone = targetPhone.replace(/[^0-9]/g, "");
  if (!cleanPhone) {
    return { success: false, message: "Nomor handphone tidak valid." };
  }

  try {
    console.log(`Pemicuan WhatsApp test ke: ${cleanPhone}...`);
    
    const res = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: {
        "Authorization": token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        target: cleanPhone,
        message: testMessage || "🤖 God-Mode Test Alert: Konektivitas Fonnte WhatsApp Gateway INFRAMEET Aktif & Steril!"
      })
    });

    const result = await res.json();
    
    if (result.status) {
      // Create a security audit log event
      if (supabaseAdmin) {
        await supabaseAdmin.from("audit_log").insert({
          action_type: "INTEGRATION_TEST",
          actor_email: "muhzadit@gmail.com",
          ip_address: "127.0.0.1",
          details: { service: "Fonnte WhatsApp", status: "Success", recipient: cleanPhone }
        });
      }

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
    return { success: false, message: err?.message || "Koneksi gateway terputus." };
  }
}
