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
    // Authenticate the user submitting the form
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, message: "Autentikasi gagal. Silakan masuk terlebih dahulu." };
    }

    const rawData = Object.fromEntries(formData.entries());
    
    // Parse tags safely
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
    const uniqueSlug = `${baseSlug}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Insert as a personal entity inside polymorphic omni_directory
    const { data: expert, error } = await supabaseAdmin
      .from("omni_directory")
      .insert({
        owner_id: user.id,
        entity_type: "personal",
        name: validated.data.full_name,
        slug: uniqueSlug,
        website_url: validated.data.contact_routing.email,
        logo_url: null,
        description: `${validated.data.title}\n\n${validated.data.bio_summary}`,
        verification_status: "unverified",
        trust_score: 15.0,
        category: "personal",
        subcategory: validated.data.category,
        tags: validated.data.tags,
        email: validated.data.contact_routing.email,
        phone: validated.data.contact_routing.whatsapp,
        is_public: false
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      throw new Error(error.message);
    }

    // Write to audit log
    await auditLog({
      entity_type: "omni_directory",
      entity_id: expert.id,
      action: "CREATE_PENDING",
      changes: { status: "pending", name: expert.name },
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
    await auditLog({
      entity_type: "omni_directory",
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

    // 2. Query user_roles table to verify admin or moderator role
    const { data: userRole, error: roleError } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .single();

    if (roleError || !userRole) {
      return { success: false, message: "Akses ditolak: Hanya Admin yang diizinkan melakukan persetujuan." };
    }

    // 3. Perform update of expert state to active/public and basic_verified status
    const { data: expert, error: updateError } = await supabaseAdmin
      .from("omni_directory")
      .update({
        is_public: true,
        verification_status: "basic_verified",
        trust_score: 45.0, // Base approved score
        trust_score_updated_at: new Date().toISOString()
      })
      .eq("id", expertId)
      .select()
      .single();

    if (updateError || !expert) {
      console.error("Failed to approve entity record in database:", updateError);
      return { success: false, message: `Gagal memperbarui status: ${updateError?.message || "Tidak ditemukan"}` };
    }

    // 4. Log actions to the system_events audit trail
    await auditLog({
      entity_type: "omni_directory",
      entity_id: expert.id,
      action: "APPROVE_SUCCESS",
      changes: { is_public: true, previous_status: "unverified" },
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
    revalidatePath(`/${expert.slug}`);

    return { 
      success: true, 
      message: `Sukses menyetujui dan mempublikasikan profil pakar ${expert.name}!` 
    };

  } catch (err: any) {
    console.error("approveExpert action crashed:", err);
    return { 
      success: false, 
      message: `Terjadi kesalahan sistem saat menyetujui: ${err.message}` 
    };
  }
}
