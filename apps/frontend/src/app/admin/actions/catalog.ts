"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import servicesDefault from "../../../../../../packages/config/services.json";
import { validateAdminSession, insertAuditLog } from "./security";
import { z } from "zod";

const upsertCatalogItemSchema = z.object({
  sku: z.string().min(2, "SKU minimal 2 karakter"),
  category: z.string().min(2, "Kategori wajib diisi"),
  name: z.string().min(2, "Nama wajib diisi"),
  base_price_idr: z.number().nonnegative("Harga dasar tidak boleh negatif"),
  description: z.string().nullable().optional(),
  features_checklist: z.array(z.any()).nullable().optional(),
  price_flat_idr: z.number().nullable().optional(),
  price_per_unit_idr: z.number().nullable().optional(),
  unit_label: z.string().nullable().optional(),
  is_volume_based: z.boolean().nullable().optional(),
  min_units: z.number().nullable().optional(),
  max_units: z.number().nullable().optional(),
  limit_description: z.string().nullable().optional()
});

const deleteCatalogItemSchema = z.object({
  sku: z.string().min(2, "SKU tidak valid")
});

/**
 * Upserts a single item in the dynamic services catalog table
 */
export async function upsertCatalogItem(item: {
  sku: string;
  category: string;
  name: string;
  base_price_idr: number;
  description?: string;
  features_checklist?: any[];
  price_flat_idr?: number | null;
  price_per_unit_idr?: number | null;
  unit_label?: string | null;
  is_volume_based?: boolean;
  min_units?: number | null;
  max_units?: number | null;
  limit_description?: string | null;
}) {
  try {
    // 1. Zero-Trust check
    const session = await validateAdminSession();

    // 2. Schema parse input
    const validated = upsertCatalogItemSchema.parse(item);

    if (!supabaseAdmin) {
      return { success: false, message: "Database is offline." };
    }

    // 3. Upsert execution
    const { error } = await supabaseAdmin
      .from("services_catalog")
      .upsert({
        sku: validated.sku,
        category: validated.category,
        name: validated.name,
        base_price_idr: validated.base_price_idr,
        description: validated.description || null,
        features_checklist: validated.features_checklist || [],
        price_flat_idr: validated.price_flat_idr || null,
        price_per_unit_idr: validated.price_per_unit_idr || null,
        unit_label: validated.unit_label || null,
        is_volume_based: validated.is_volume_based || false,
        min_units: validated.min_units || null,
        max_units: validated.max_units || null,
        limit_description: validated.limit_description || null,
        updated_at: new Date().toISOString()
      }, { onConflict: "sku" });

    if (error) {
      console.error(`Gagal upsert catalog item '${validated.sku}':`, error);
      return { success: false, message: error.message };
    }

    // 4. Record secure audit trail event
    await insertAuditLog(
      session.staffId,
      session.actorEmail,
      "services_catalog",
      "00000000-0000-0000-0000-000000000000",
      "UPSERT_CATALOG_ITEM",
      { sku: validated.sku, name: validated.name }
    );

    revalidatePath("/admin/catalog");
    revalidatePath("/calculator");
    revalidatePath("/layanan/b2b");
    revalidatePath("/layanan/akademik");

    return { success: true, message: `Sukses menyimpan catalog item ${validated.sku}!` };
  } catch (err: any) {
    console.error("Critical error in upsertCatalogItem Server Action:", err);
    return { success: false, message: err?.message || "Internal server error." };
  }
}

/**
 * Deletes a catalog item by its SKU code
 */
export async function deleteCatalogItem(sku: string) {
  try {
    // 1. Zero-Trust check
    const session = await validateAdminSession();

    // 2. Schema parse input
    const validated = deleteCatalogItemSchema.parse({ sku });

    if (!supabaseAdmin) {
      return { success: false, message: "Database is offline." };
    }

    // 3. Delete execution
    const { error } = await supabaseAdmin
      .from("services_catalog")
      .delete()
      .eq("sku", validated.sku);

    if (error) {
      console.error(`Gagal menghapus catalog item '${validated.sku}':`, error);
      return { success: false, message: error.message };
    }

    // 4. Record secure audit trail event
    await insertAuditLog(
      session.staffId,
      session.actorEmail,
      "services_catalog",
      "00000000-0000-0000-0000-000000000000",
      "DELETE_CATALOG_ITEM",
      { sku: validated.sku }
    );

    revalidatePath("/admin/catalog");
    revalidatePath("/calculator");

    return { success: true, message: `Sukses menghapus catalog item ${validated.sku}!` };
  } catch (err: any) {
    console.error("Critical error in deleteCatalogItem Server Action:", err);
    return { success: false, message: err?.message || "Internal server error." };
  }
}

/**
 * Seeds or resets the DB catalog override table using static services.json
 */
export async function resetCatalogToDefault() {
  try {
    // 1. Zero-Trust check
    const session = await validateAdminSession();

    if (!supabaseAdmin) {
      return { success: false, message: "Database is offline." };
    }

    // 2. Gather all items from the single-source-of-truth JSON
    const itemsToInsert: any[] = [];

    // B2B Services
    if (Array.isArray(servicesDefault.b2b_services)) {
      servicesDefault.b2b_services.forEach((s: any) => {
        itemsToInsert.push({
          sku: s.sku,
          category: "b2b_services",
          name: s.name,
          base_price_idr: s.base_price_idr || 0,
          description: s.description || null,
          features_checklist: s.features_checklist || []
        });
      });
    }

    // B2B Modular Components
    if (Array.isArray(servicesDefault.b2b_modular_components)) {
      servicesDefault.b2b_modular_components.forEach((s: any) => {
        itemsToInsert.push({
          sku: s.sku,
          category: "b2b_modular_components",
          name: s.name,
          base_price_idr: 0,
          description: s.description || null,
          price_flat_idr: s.price_flat_idr || null,
          price_per_unit_idr: s.price_per_unit_idr || null,
          unit_label: s.unit_label || null,
          is_volume_based: s.is_volume_based || false,
          min_units: s.min_units || null,
          max_units: s.max_units || null
        });
      });
    }

    // Academic Modular Components
    if (Array.isArray(servicesDefault.academic_modular_components)) {
      servicesDefault.academic_modular_components.forEach((s: any) => {
        itemsToInsert.push({
          sku: s.sku,
          category: "academic_modular_components",
          name: s.name,
          base_price_idr: 0,
          description: s.description || null,
          price_flat_idr: s.price_flat_idr || null,
          price_per_unit_idr: s.price_per_unit_idr || null,
          unit_label: s.unit_label || null,
          is_volume_based: s.is_volume_based || false,
          min_units: s.min_units || null,
          max_units: s.max_units || null
        });
      });
    }

    // Academic Services
    if (Array.isArray(servicesDefault.academic_services)) {
      servicesDefault.academic_services.forEach((s: any) => {
        itemsToInsert.push({
          sku: s.sku,
          category: "academic_services",
          name: s.name,
          base_price_idr: s.base_price_idr || 0,
          limit_description: s.limit_description || null
        });
      });
    }

    // Hosting Options
    if (Array.isArray(servicesDefault.hosting_infrastructure_options)) {
      servicesDefault.hosting_infrastructure_options.forEach((s: any) => {
        itemsToInsert.push({
          sku: s.sku,
          category: "hosting_options",
          name: s.name,
          base_price_idr: s.setup_price_idr || 0,
          price_flat_idr: s.yearly_estimate_idr || 0,
          description: s.description || null,
          features_checklist: s.features ? s.features.map((f: any) => ({ label: f, included: true })) : []
        });
      });
    }

    // 3. Clear old database entries
    const { error: deleteErr } = await supabaseAdmin
      .from("services_catalog")
      .delete()
      .neq("sku", "TRASH-EMPTY");

    if (deleteErr) {
      throw deleteErr;
    }

    // 4. Upsert initial batch
    if (itemsToInsert.length > 0) {
      const { error: insertErr } = await supabaseAdmin
        .from("services_catalog")
        .insert(itemsToInsert);

      if (insertErr) {
        throw insertErr;
      }
    }

    // 5. Record secure audit trail event
    await insertAuditLog(
      session.staffId,
      session.actorEmail,
      "services_catalog",
      "00000000-0000-0000-0000-000000000000",
      "RESET_CATALOG_TO_DEFAULT",
      { itemsSynced: itemsToInsert.length }
    );

    revalidatePath("/admin/catalog");
    revalidatePath("/calculator");

    return { success: true, message: `Sukses meriset katalog! ${itemsToInsert.length} item berhasil disinkronisasi.` };
  } catch (err: any) {
    console.error("Critical failure during catalog seeding:", err);
    return { success: false, message: err?.message || "Internal database reset failure." };
  }
}
