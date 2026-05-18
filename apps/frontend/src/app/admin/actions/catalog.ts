"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import servicesDefault from "../../../../../../packages/config/services.json";

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
  if (!supabaseAdmin) {
    return { success: false, message: "Database is offline." };
  }

  try {
    const { error } = await supabaseAdmin
      .from("services_catalog")
      .upsert({
        sku: item.sku,
        category: item.category,
        name: item.name,
        base_price_idr: item.base_price_idr,
        description: item.description || null,
        features_checklist: item.features_checklist || [],
        price_flat_idr: item.price_flat_idr || null,
        price_per_unit_idr: item.price_per_unit_idr || null,
        unit_label: item.unit_label || null,
        is_volume_based: item.is_volume_based || false,
        min_units: item.min_units || null,
        max_units: item.max_units || null,
        limit_description: item.limit_description || null,
        updated_at: new Date().toISOString()
      }, { onConflict: "sku" });

    if (error) {
      console.error(`Gagal upsert catalog item '${item.sku}':`, error);
      return { success: false, message: error.message };
    }

    revalidatePath("/admin/catalog");
    revalidatePath("/calculator");
    revalidatePath("/layanan/b2b");
    revalidatePath("/layanan/akademik");

    return { success: true, message: `Sukses menyimpan catalog item ${item.sku}!` };
  } catch (err: any) {
    return { success: false, message: err?.message || "Internal server error." };
  }
}

/**
 * Deletes a catalog item by its SKU code
 */
export async function deleteCatalogItem(sku: string) {
  if (!supabaseAdmin) {
    return { success: false, message: "Database is offline." };
  }

  try {
    const { error } = await supabaseAdmin
      .from("services_catalog")
      .delete()
      .eq("sku", sku);

    if (error) {
      console.error(`Gagal menghapus catalog item '${sku}':`, error);
      return { success: false, message: error.message };
    }

    revalidatePath("/admin/catalog");
    revalidatePath("/calculator");

    return { success: true, message: `Sukses menghapus catalog item ${sku}!` };
  } catch (err: any) {
    return { success: false, message: err?.message || "Internal server error." };
  }
}

/**
 * Seeds or resets the DB catalog override table using static services.json
 */
export async function resetCatalogToDefault() {
  if (!supabaseAdmin) {
    return { success: false, message: "Database is offline." };
  }

  try {
    // 1. Gather all items from the single-source-of-truth JSON
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
          price_flat_idr: s.yearly_estimate_idr || 0, // yearly server estimate
          description: s.description || null,
          features_checklist: s.features ? s.features.map((f: any) => ({ label: f, included: true })) : []
        });
      });
    }

    // 2. Clear old database entries
    const { error: deleteErr } = await supabaseAdmin
      .from("services_catalog")
      .delete()
      .neq("sku", "TRASH-EMPTY"); // delete all rows safely

    if (deleteErr) {
      throw deleteErr;
    }

    // 3. Upsert initial batch
    if (itemsToInsert.length > 0) {
      const { error: insertErr } = await supabaseAdmin
        .from("services_catalog")
        .insert(itemsToInsert);

      if (insertErr) {
        throw insertErr;
      }
    }

    revalidatePath("/admin/catalog");
    revalidatePath("/calculator");

    return { success: true, message: `Sukses meriset katalog! ${itemsToInsert.length} item berhasil disinkronisasi.` };
  } catch (err: any) {
    console.error("Critical failure during catalog seeding:", err);
    return { success: false, message: err?.message || "Internal database reset failure." };
  }
}
