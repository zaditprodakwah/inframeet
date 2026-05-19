"use server";

import { z } from "zod";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { auditLog } from "./audit";
import { sendAdminApprovalEmail, sendExpertWelcomeEmail } from "./email";

// Native implementation of a slugify utility to minimize npm bloat
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")           // Replace spaces with -
    .replace(/[^\w\-]+/g, "")       // Remove all non-word chars
    .replace(/\-\-+/g, "-")         // Replace multiple - with single -
    .replace(/^-+/, "")             // Trim - from start
    .replace(/-+$/, "");            // Trim - from end
}

// Zod Schema to validate expert onboarding inputs
export const ExpertOnboardingSchema = z.object({
  full_name: z.string().min(3, "Nama lengkap minimal 3 karakter"),
  title: z.string().min(5, "Gelar / Jabatan minimal 5 karakter"),
  category: z.enum(["ACADEMIC", "BUSINESS", "TECH", "LEGAL", "PUBLIC_SERVICE", "OTHER"], {
    message: "Kategori tidak valid",
  }),
  tags: z.array(z.string()).max(10, "Maksimal 10 keahlian"),
  bio_summary: z.string().min(20, "Bio minimal 20 karakter").max(1000, "Bio maksimal 1000 karakter"),
  contact_routing: z.object({
    whatsapp: z.string().regex(/^628\d{8,13}$/, "Format WA harus dimulai dengan 628 (contoh: 628123456789)"),
    email: z.string().email("Format email tidak valid"),
  }),
});

export async function submitExpertOnboarding(prevState: any, formData: FormData) {
  if (!supabaseAdmin) {
    return { success: false, message: "Kesalahan sistem: Database Admin tidak terkonfigurasi." };
  }

  try {
    const rawData = Object.fromEntries(formData.entries());
    
    // Parse tags from JSON string safely
    let parsedTags: string[] = [];
    try {
      parsedTags = JSON.parse((rawData.tags as string) || "[]");
    } catch {
      parsedTags = (rawData.tags as string)
        ? (rawData.tags as string).split(",").map((t) => t.trim()).filter(Boolean)
        : [];
    }

    const validated = ExpertOnboardingSchema.safeParse({
      full_name: rawData.full_name,
      title: rawData.title,
      category: rawData.category,
      tags: parsedTags,
      bio_summary: rawData.bio_summary,
      contact_routing: {
        whatsapp: rawData.whatsapp,
        email: rawData.email,
      },
    });

    if (!validated.success) {
      const fieldErrors = validated.error.flatten().fieldErrors;
      return { 
        success: false, 
        errors: fieldErrors, 
        message: "Validasi data gagal. Silakan periksa kembali isian Anda." 
      };
    }

    const baseSlug = slugify(validated.data.full_name);
    // Add random 4 digit suffix to ensure URL uniqueness
    const uniqueSlug = `${baseSlug}-${Math.floor(1000 + Math.random() * 9000)}`;

    const { data: expert, error } = await supabaseAdmin
      .from("expert_directory")
      .insert({
        ...validated.data,
        slug: uniqueSlug,
        is_public: false,
        profile_completion_score: 65, // Base completion score upon sign-up
        expert_tier: "BRONZE",
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      throw new Error(error.message);
    }

    // Write to audit log
    await auditLog({
      entity_type: "expert_directory",
      entity_id: expert.id,
      action: "CREATE_PENDING",
      changes: { status: "pending", full_name: expert.full_name },
      ip_address: "system-onboarding",
      user_agent: "onboarding-form",
    });

    // Send admin notification email
    try {
      await sendAdminApprovalEmail(expert);
    } catch (emailErr) {
      console.error("Failed to send admin email:", emailErr);
    }

    revalidatePath("/admin/expert-approvals");
    return { 
      success: true, 
      message: "Pendaftaran berhasil! Profil Anda akan ditinjau oleh Admin dalam 24 jam.", 
      expertId: expert.id 
    };

  } catch (err: any) {
    console.error("submitExpertOnboarding action failed:", err);
    // Log crash in audit using NIL UUID
    await auditLog({
      entity_type: "expert_directory",
      entity_id: "00000000-0000-0000-0000-000000000000",
      action: "CREATE_FAILED",
      changes: { error: err.message },
      ip_address: "system-onboarding",
      user_agent: "onboarding-form",
    });

    return { 
      success: false, 
      message: "Terjadi kesalahan sistem yang tidak terduga. Silakan hubungi dukungan kami." 
    };
  }
}

export async function approveExpert(expertId: string) {
  if (!supabaseAdmin) {
    return { success: false, message: "Kesalahan sistem: Database Admin tidak terkonfigurasi." };
  }

  try {
    // 1. Authenticate the performing staff member using standard Supabase client
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, message: "Autentikasi gagal. Silakan masuk terlebih dahulu." };
    }

    // 2. Query staff table to verify admin or manager role
    const { data: staff, error: staffError } = await supabaseAdmin
      .from("staff")
      .select("id, role")
      .eq("auth_user_id", user.id)
      .single();

    if (staffError || !staff || !["admin", "manager"].includes(staff.role)) {
      return { success: false, message: "Akses ditolak: Hanya Admin atau Manager yang diizinkan melakukan persetujuan." };
    }

    // 3. Perform update of expert state to active/public
    const { data: expert, error: updateError } = await supabaseAdmin
      .from("expert_directory")
      .update({
        is_public: true,
        profile_completion_score: 100, // Score goes to 100% upon verification
      })
      .eq("id", expertId)
      .select()
      .single();

    if (updateError || !expert) {
      console.error("Failed to approve expert record in database:", updateError);
      return { success: false, message: `Gagal memperbarui status pakar: ${updateError?.message || "Tidak ditemukan"}` };
    }

    // 4. Log actions to the audit trail
    await auditLog({
      entity_type: "expert_directory",
      entity_id: expert.id,
      action: "APPROVE_SUCCESS",
      performed_by_staff_id: staff.id,
      changes: { is_public: true, previous_status: "pending" },
      ip_address: "admin-console",
      user_agent: "admin-approvals-portal",
    });

    // 5. Send congrats welcome notification to the newly approved expert
    try {
      await sendExpertWelcomeEmail(expert);
    } catch (emailErr) {
      console.error("Failed to send welcome email to expert:", emailErr);
    }

    // 6. Revalidate pages for immediate layout updates
    revalidatePath("/admin/expert-approvals");
    revalidatePath("/experts");
    revalidatePath(`/experts/${expert.slug}`);

    return { 
      success: true, 
      message: `Sukses menyetujui dan mempublikasikan profil pakar ${expert.full_name}!` 
    };

  } catch (err: any) {
    console.error("approveExpert action crashed:", err);
    return { 
      success: false, 
      message: `Terjadi kesalahan sistem saat menyetujui: ${err.message}` 
    };
  }
}
