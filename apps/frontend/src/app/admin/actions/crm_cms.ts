"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

/**
 * Updates status and notes on B2B Client briefs onboarding table
 */
export async function updateBriefStatus(
  briefId: string,
  newStatus: string,
  approvalNotes?: string,
  staffId?: string
) {
  if (!supabaseAdmin) {
    return { success: false, message: "Database offline." };
  }

  try {
    const { error } = await supabaseAdmin
      .from("briefs")
      .update({
        status: newStatus,
        approval_notes: approvalNotes || null,
        approved_by_staff_id: staffId || null,
        approved_at: newStatus === "approved" ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      })
      .eq("id", briefId);

    if (error) {
      console.error(`Gagal update brief status '${briefId}':`, error);
      return { success: false, message: error.message };
    }

    revalidatePath("/admin/crm-cms");
    return { success: true, message: `Sukses memperbarui status brief ke '${newStatus}'!` };
  } catch (err: any) {
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
  if (!supabaseAdmin) {
    return { success: false, message: "Database offline." };
  }

  try {
    const { error } = await supabaseAdmin
      .from("crm_leads")
      .update({
        status: newStatus,
        notes: handlerNotes || null,
        updated_at: new Date().toISOString()
      })
      .eq("id", leadId);

    if (error) {
      console.error(`Gagal update lead status '${leadId}':`, error);
      return { success: false, message: error.message };
    }

    revalidatePath("/admin/crm-cms");
    return { success: true, message: `Sukses memperbarui status lead ke '${newStatus}'!` };
  } catch (err: any) {
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
  if (!supabaseAdmin) {
    return { success: false, message: "Database offline." };
  }

  const payload: any = {
    title: portfolio.title,
    client_name: portfolio.client_name,
    category: portfolio.category,
    technologies: portfolio.technologies || [],
    metrics_impact: portfolio.metrics_impact || null,
    image_url: portfolio.image_url || null,
    is_published: portfolio.is_published ?? true,
    updated_at: new Date().toISOString()
  };

  if (portfolio.id) {
    payload.id = portfolio.id;
  } else {
    payload.created_at = new Date().toISOString();
  }

  try {
    const { error } = await supabaseAdmin
      .from("portfolio_cases")
      .upsert(payload, { onConflict: "id" });

    if (error) {
      console.error(`Gagal upsert portfolio case:`, error);
      return { success: false, message: error.message };
    }

    revalidatePath("/admin/crm-cms");
    revalidatePath("/portfolio");

    return { success: true, message: "Sukses menyimpan portfolio case study!" };
  } catch (err: any) {
    return { success: false, message: err?.message || "Internal portfolio upsert failure." };
  }
}

/**
 * Deletes a portfolio case study by ID
 */
export async function deletePortfolioCase(id: string) {
  if (!supabaseAdmin) {
    return { success: false, message: "Database offline." };
  }

  try {
    const { error } = await supabaseAdmin
      .from("portfolio_cases")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(`Gagal menghapus portfolio '${id}':`, error);
      return { success: false, message: error.message };
    }

    revalidatePath("/admin/crm-cms");
    revalidatePath("/portfolio");

    return { success: true, message: "Sukses menghapus portfolio!" };
  } catch (err: any) {
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
  if (!supabaseAdmin) {
    return { success: false, message: "Database offline." };
  }

  const payload: any = {
    name: tool.name,
    category: tool.category,
    description: tool.description || null,
    logo_url: tool.logo_url || null,
    website_url: tool.website_url || null,
    pricing_info: tool.pricing_info || "Free",
    affiliate_url: tool.affiliate_url || null,
    affiliate_commission_percent: tool.affiliate_commission_percent || 0,
    sponsor_status: tool.sponsor_status || "none",
    tags: tool.tags || [],
    team_uses: tool.team_uses || false,
    updated_at: new Date().toISOString()
  };

  if (tool.id) {
    payload.id = tool.id;
  } else {
    payload.created_at = new Date().toISOString();
  }

  try {
    const { error } = await supabaseAdmin
      .from("tools_directory")
      .upsert(payload, { onConflict: "id" });

    if (error) {
      console.error("Gagal upsert digital tool:", error);
      return { success: false, message: error.message };
    }

    revalidatePath("/admin/crm-cms");
    revalidatePath("/admin/affiliate");
    revalidatePath("/tools");

    return { success: true, message: "Sukses menyimpan perkakas digital!" };
  } catch (err: any) {
    return { success: false, message: err?.message || "Internal tool upsert failure." };
  }
}

/**
 * Deletes a digital tool by ID
 */
export async function deleteDigitalTool(id: string) {
  if (!supabaseAdmin) {
    return { success: false, message: "Database offline." };
  }

  try {
    const { error } = await supabaseAdmin
      .from("tools_directory")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(`Gagal menghapus digital tool '${id}':`, error);
      return { success: false, message: error.message };
    }

    revalidatePath("/admin/crm-cms");
    revalidatePath("/admin/affiliate");
    revalidatePath("/tools");

    return { success: true, message: "Sukses menghapus perkakas digital!" };
  } catch (err: any) {
    return { success: false, message: err?.message || "Internal failure." };
  }
}
