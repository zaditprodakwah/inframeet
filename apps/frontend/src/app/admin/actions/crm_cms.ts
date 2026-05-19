"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { validateAdminSession, insertAuditLog } from "./security";
import { z } from "zod";

const updateBriefStatusSchema = z.object({
  briefId: z.string().uuid("ID Brief tidak valid"),
  newStatus: z.string().min(1, "Status wajib diisi"),
  approvalNotes: z.string().nullable().optional(),
  staffId: z.string().uuid().nullable().optional()
});

const updateLeadStatusSchema = z.object({
  leadId: z.string().uuid("ID Lead tidak valid"),
  newStatus: z.string().min(1, "Status wajib diisi"),
  handlerNotes: z.string().nullable().optional()
});

const upsertPortfolioCaseSchema = z.object({
  id: z.string().uuid().nullable().optional(),
  title: z.string().min(2, "Judul minimal 2 karakter"),
  client_name: z.string().min(2, "Nama klien minimal 2 karakter"),
  category: z.string().min(2, "Kategori wajib diisi"),
  technologies: z.array(z.string()).nullable().optional(),
  metrics_impact: z.string().nullable().optional(),
  image_url: z.string().nullable().optional(),
  is_published: z.boolean().nullable().optional()
});

const deletePortfolioCaseSchema = z.object({
  id: z.string().uuid("ID Portfolio tidak valid")
});

const upsertDigitalToolSchema = z.object({
  id: z.string().uuid().nullable().optional(),
  name: z.string().min(2, "Nama minimal 2 karakter"),
  category: z.string().min(2, "Kategori wajib diisi"),
  description: z.string().nullable().optional(),
  logo_url: z.string().nullable().optional(),
  website_url: z.string().url("Format URL website tidak valid").or(z.string().length(0)).or(z.string().nullable().optional()),
  pricing_info: z.string().nullable().optional(),
  affiliate_url: z.string().url("Format URL afiliasi tidak valid").or(z.string().length(0)).or(z.string().nullable().optional()),
  affiliate_commission_percent: z.number().nullable().optional(),
  sponsor_status: z.enum(["none", "bronze", "silver", "gold"]).nullable().optional(),
  tags: z.array(z.string()).nullable().optional(),
  team_uses: z.boolean().nullable().optional()
});

const deleteDigitalToolSchema = z.object({
  id: z.string().uuid("ID Perkakas tidak valid")
});

const moderateUgcSubmissionSchema = z.object({
  id: z.string().uuid("ID UGC tidak valid"),
  newStatus: z.enum(["APPROVED", "REJECTED"])
});

/**
 * Updates status and notes on B2B Client briefs onboarding table
 */
export async function updateBriefStatus(
  briefId: string,
  newStatus: string,
  approvalNotes?: string,
  staffId?: string
) {
  try {
    const session = await validateAdminSession();
    const validated = updateBriefStatusSchema.parse({
      briefId,
      newStatus,
      approvalNotes,
      staffId
    });

    if (!supabaseAdmin) {
      return { success: false, message: "Database offline." };
    }

    const { error } = await supabaseAdmin
      .from("briefs")
      .update({
        status: validated.newStatus,
        approval_notes: validated.approvalNotes || null,
        approved_by_staff_id: validated.staffId || session.staffId || null,
        approved_at: validated.newStatus === "approved" ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      })
      .eq("id", validated.briefId);

    if (error) {
      console.error(`Gagal update brief status '${validated.briefId}':`, error);
      return { success: false, message: error.message };
    }

    await insertAuditLog(
      session.staffId,
      session.actorEmail,
      "briefs",
      validated.briefId,
      "UPDATE_BRIEF_STATUS",
      { newStatus: validated.newStatus }
    );

    revalidatePath("/admin/crm-cms");
    return { success: true, message: `Sukses memperbarui status brief ke '${validated.newStatus}'!` };
  } catch (err: any) {
    console.error("Critical error in updateBriefStatus:", err);
    return { success: false, message: err?.message || "Internal brief update failure." };
  }
}

/**
 * Updates details on crm_leads table
 */
export async function updateLeadStatus(
  leadId: string,
  newStatus: string,
  handlerNotes?: string
) {
  try {
    const session = await validateAdminSession();
    const validated = updateLeadStatusSchema.parse({
      leadId,
      newStatus,
      handlerNotes
    });

    if (!supabaseAdmin) {
      return { success: false, message: "Database offline." };
    }

    const { error } = await supabaseAdmin
      .from("crm_leads")
      .update({
        status: validated.newStatus,
        notes: validated.handlerNotes || null,
        updated_at: new Date().toISOString()
      })
      .eq("id", validated.leadId);

    if (error) {
      console.error(`Gagal update lead status '${validated.leadId}':`, error);
      return { success: false, message: error.message };
    }

    await insertAuditLog(
      session.staffId,
      session.actorEmail,
      "crm_leads",
      validated.leadId,
      "UPDATE_LEAD_STATUS",
      { newStatus: validated.newStatus }
    );

    revalidatePath("/admin/crm-cms");
    return { success: true, message: `Sukses memperbarui status lead ke '${validated.newStatus}'!` };
  } catch (err: any) {
    console.error("Critical error in updateLeadStatus:", err);
    return { success: false, message: err?.message || "Internal lead update failure." };
  }
}

/**
 * Upserts a client showcase portfolio case study item in the database
 */
export async function upsertPortfolioCase(portfolio: {
  id?: string;
  title: string;
  client_name: string;
  category: string;
  technologies?: string[];
  metrics_impact?: string;
  image_url?: string;
  is_published?: boolean;
}) {
  try {
    const session = await validateAdminSession();
    const validated = upsertPortfolioCaseSchema.parse(portfolio);

    if (!supabaseAdmin) {
      return { success: false, message: "Database offline." };
    }

    const payload: any = {
      title: validated.title,
      client_name: validated.client_name,
      category: validated.category,
      technologies: validated.technologies || [],
      metrics_impact: validated.metrics_impact || null,
      image_url: validated.image_url || null,
      is_published: validated.is_published ?? true,
      updated_at: new Date().toISOString()
    };

    if (validated.id) {
      payload.id = validated.id;
    } else {
      payload.created_at = new Date().toISOString();
    }

    const { data, error } = await supabaseAdmin
      .from("portfolio_cases")
      .upsert(payload, { onConflict: "id" })
      .select("id")
      .single();

    if (error) {
      console.error(`Gagal upsert portfolio case:`, error);
      return { success: false, message: error.message };
    }

    await insertAuditLog(
      session.staffId,
      session.actorEmail,
      "portfolio_cases",
      data?.id || validated.id || "00000000-0000-0000-0000-000000000000",
      "UPSERT_PORTFOLIO_CASE",
      { title: validated.title }
    );

    revalidatePath("/admin/crm-cms");
    revalidatePath("/portfolio");

    return { success: true, message: "Sukses menyimpan portfolio case study!" };
  } catch (err: any) {
    console.error("Critical error in upsertPortfolioCase:", err);
    return { success: false, message: err?.message || "Internal portfolio upsert failure." };
  }
}

/**
 * Deletes a portfolio case study by ID
 */
export async function deletePortfolioCase(id: string) {
  try {
    const session = await validateAdminSession();
    const validated = deletePortfolioCaseSchema.parse({ id });

    if (!supabaseAdmin) {
      return { success: false, message: "Database offline." };
    }

    const { error } = await supabaseAdmin
      .from("portfolio_cases")
      .delete()
      .eq("id", validated.id);

    if (error) {
      console.error(`Gagal menghapus portfolio '${validated.id}':`, error);
      return { success: false, message: error.message };
    }

    await insertAuditLog(
      session.staffId,
      session.actorEmail,
      "portfolio_cases",
      validated.id,
      "DELETE_PORTFOLIO_CASE",
      { id: validated.id }
    );

    revalidatePath("/admin/crm-cms");
    revalidatePath("/portfolio");

    return { success: true, message: "Sukses menghapus portfolio!" };
  } catch (err: any) {
    console.error("Critical error in deletePortfolioCase:", err);
    return { success: false, message: err?.message || "Internal failure." };
  }
}

/**
 * Upserts a digital utility tool inside the tools_directory directory
 */
export async function upsertDigitalTool(tool: {
  id?: string;
  name: string;
  category: string;
  description?: string;
  logo_url?: string;
  website_url?: string;
  pricing_info?: string;
  affiliate_url?: string;
  affiliate_commission_percent?: number;
  sponsor_status?: "none" | "bronze" | "silver" | "gold";
  tags?: string[];
  team_uses?: boolean;
}) {
  try {
    const session = await validateAdminSession();
    const validated = upsertDigitalToolSchema.parse(tool);

    if (!supabaseAdmin) {
      return { success: false, message: "Database offline." };
    }

    const payload: any = {
      name: validated.name,
      category: validated.category,
      description: validated.description || null,
      logo_url: validated.logo_url || null,
      website_url: validated.website_url || null,
      pricing_info: validated.pricing_info || "Free",
      affiliate_url: validated.affiliate_url || null,
      affiliate_commission_percent: validated.affiliate_commission_percent || 0,
      sponsor_status: validated.sponsor_status || "none",
      tags: validated.tags || [],
      team_uses: validated.team_uses || false,
      updated_at: new Date().toISOString()
    };

    if (validated.id) {
      payload.id = validated.id;
    } else {
      payload.created_at = new Date().toISOString();
    }

    const { data, error } = await supabaseAdmin
      .from("tools_directory")
      .upsert(payload, { onConflict: "id" })
      .select("id")
      .single();

    if (error) {
      console.error("Gagal upsert digital tool:", error);
      return { success: false, message: error.message };
    }

    await insertAuditLog(
      session.staffId,
      session.actorEmail,
      "tools_directory",
      data?.id || validated.id || "00000000-0000-0000-0000-000000000000",
      "UPSERT_DIGITAL_TOOL",
      { name: validated.name }
    );

    revalidatePath("/admin/crm-cms");
    revalidatePath("/admin/affiliate");
    revalidatePath("/tools");

    return { success: true, message: "Sukses menyimpan perkakas digital!" };
  } catch (err: any) {
    console.error("Critical error in upsertDigitalTool:", err);
    return { success: false, message: err?.message || "Internal tool upsert failure." };
  }
}

/**
 * Deletes a digital tool by ID
 */
export async function deleteDigitalTool(id: string) {
  try {
    const session = await validateAdminSession();
    const validated = deleteDigitalToolSchema.parse({ id });

    if (!supabaseAdmin) {
      return { success: false, message: "Database offline." };
    }

    const { error } = await supabaseAdmin
      .from("tools_directory")
      .delete()
      .eq("id", validated.id);

    if (error) {
      console.error(`Gagal menghapus digital tool '${validated.id}':`, error);
      return { success: false, message: error.message };
    }

    await insertAuditLog(
      session.staffId,
      session.actorEmail,
      "tools_directory",
      validated.id,
      "DELETE_DIGITAL_TOOL",
      { id: validated.id }
    );

    revalidatePath("/admin/crm-cms");
    revalidatePath("/admin/affiliate");
    revalidatePath("/tools");

    return { success: true, message: "Sukses menghapus perkakas digital!" };
  } catch (err: any) {
    console.error("Critical error in deleteDigitalTool:", err);
    return { success: false, message: err?.message || "Internal failure." };
  }
}

/**
 * Moderates a UGC content submission (APPROVED / REJECTED)
 */
export async function moderateUgcSubmission(id: string, newStatus: "APPROVED" | "REJECTED") {
  try {
    const session = await validateAdminSession();
    const validated = moderateUgcSubmissionSchema.parse({ id, newStatus });

    if (!supabaseAdmin) {
      return { success: false, message: "Database offline." };
    }

    const { error } = await supabaseAdmin
      .from("content_submissions")
      .update({
        status: validated.newStatus,
        updated_at: new Date().toISOString()
      })
      .eq("id", validated.id);

    if (error) {
      console.error(`Gagal update UGC status '${validated.id}':`, error);
      return { success: false, message: error.message };
    }

    // Record secure audit trail event
    await insertAuditLog(
      session.staffId,
      session.actorEmail,
      "content_submissions",
      validated.id,
      `UGC_${validated.newStatus}`,
      { status: validated.newStatus }
    );

    // Fire-and-Forget Omnichannel Webhook: trigger background integrations asynchronously (no blocking await)
    const webhookUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    fetch(`${webhookUrl}/api/admin/rss/curate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ submissionId: validated.id, action: validated.newStatus })
    }).catch(err => {
      console.log("Omnichannel webhook background sync triggered (non-blocking).");
    });

    revalidatePath("/admin/ugc");
    return { success: true, message: `Sukses memoderasi UGC menjadi ${validated.newStatus}!` };
  } catch (err: any) {
    console.error("Critical error in moderateUgcSubmission:", err);
    return { success: false, message: err?.message || "Internal UGC moderation failure." };
  }
}

const moderateRssItemSchema = z.object({
  id: z.string().uuid("ID RSS Item tidak valid"),
  isPublished: z.boolean()
});

/**
 * Moderates a scraped RSS Feed Item (APPROVE / REJECT)
 */
export async function moderateRssItem(id: string, isPublished: boolean) {
  try {
    const session = await validateAdminSession();
    const validated = moderateRssItemSchema.parse({ id, isPublished });

    if (!supabaseAdmin) {
      return { success: false, message: "Database offline." };
    }

    const { error } = await supabaseAdmin
      .from("rss_items")
      .update({
        is_published_to_index: validated.isPublished
      })
      .eq("id", validated.id);

    if (error) {
      console.error(`Gagal update status RSS '${validated.id}':`, error);
      return { success: false, message: error.message };
    }

    // Record secure audit trail event
    await insertAuditLog(
      session.staffId,
      session.actorEmail,
      "rss_items",
      validated.id,
      validated.isPublished ? "RSS_APPROVE" : "RSS_REJECT",
      { is_published_to_index: validated.isPublished }
    );

    revalidatePath("/admin/crm-cms");
    return { success: true, message: `Sukses memoderasi item RSS!` };
  } catch (err: any) {
    console.error("Critical error in moderateRssItem:", err);
    return { success: false, message: err?.message || "Internal RSS moderation failure." };
  }
}

const submitPublicDirectoryOrPostSchema = z.object({
  type: z.enum(["education", "tool", "insight", "case_study"]),
  title: z.string().min(3, "Nama atau judul minimal 3 karakter"),
  draftData: z.record(z.string(), z.any())
});

/**
 * Public crowd-sourced submission handler for directory entries and UGC posts
 */
export async function submitPublicDirectoryOrPost(payload: {
  type: "education" | "tool" | "insight" | "case_study";
  title: string;
  draftData: any;
}) {
  try {
    const validated = submitPublicDirectoryOrPostSchema.parse(payload);
    if (!supabaseAdmin) {
      return { success: false, message: "Database offline." };
    }

    if (validated.type === "education") {
      // Insert new campus/school directly to education_directory
      const npsn = validated.draftData.npsn || `SUG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      const { error } = await supabaseAdmin
        .from("education_directory")
        .insert({
          npsn,
          name: validated.title,
          category: validated.draftData.category || "PERGURUAN_TINGGI",
          type: validated.draftData.type || "Suggested",
          address: validated.draftData.address || "",
          province: validated.draftData.province || "Indonesia",
          city: validated.draftData.city || "",
          metadata: {
            akreditasi: validated.draftData.akreditasi || "Terakreditasi",
            citation_style: validated.draftData.citation_style || "APA Style",
            turnitin_limit: validated.draftData.turnitin_limit || "20%",
            contributed_by: validated.draftData.contributor || "Komunitas"
          }
        });

      if (error) {
        console.error("Gagal menyimpan direktori pendidikan baru:", error);
        return { success: false, message: error.message };
      }

      return { success: true, message: `Sukses mengajukan direktori ${validated.title}! Terima kasih atas kontribusi Anda.` };
    } else {
      // Insert new UGC digital tool or post suggestion into content_submissions
      const slug = validated.draftData.slug || validated.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Math.random().toString(36).substr(2, 5);
      const { error } = await supabaseAdmin
        .from("content_submissions")
        .insert({
          title: validated.title,
          slug,
          type: validated.type,
          package_sku: "COMMUNITY_FREE",
          draft_data: {
            ...validated.draftData,
            contributed_by: validated.draftData.contributor || "Komunitas"
          },
          status: "PENDING_REVIEW",
          payment_status: "UNPAID"
        });

      if (error) {
        console.error("Gagal menyimpan submission konten baru:", error);
        return { success: false, message: error.message };
      }

      return { success: true, message: `Sukses mengajukan konten '${validated.title}'! Pengajuan Anda saat ini dalam antrean moderasi.` };
    }
  } catch (err: any) {
    console.error("Error in submitPublicDirectoryOrPost:", err);
    return { success: false, message: err?.message || "Gagal mengirimkan pengajuan." };
  }
}
