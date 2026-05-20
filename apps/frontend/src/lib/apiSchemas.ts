import { z } from "zod";

// ==============================================================================
// 🛡️ INFRAMEET2 — ZOD VALIDATION SCHEMA INDEX (DOC-8)
// ==============================================================================

// 1. Common Base Validators
export const uuidSchema = z.string().uuid({ message: "Format UUID tidak valid." });

export const slugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung (-).",
  })
  .max(60, { message: "Panjang slug maksimal 60 karakter." });

export const urlSchema = z.string().url({ message: "Format URL tidak valid." });

export const emailSchema = z.string().email({ message: "Format email tidak valid." });

export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, { message: "Format nomor telepon/WhatsApp tidak valid." });

// 2. Public API Schemas
export const inquirySubmitSchema = z.object({
  directoryId: uuidSchema,
  senderName: z.string().min(2, { message: "Nama pengirim minimal 2 karakter." }).max(100).optional(),
  senderEmail: emailSchema,
  senderPhone: phoneSchema.or(z.string()).nullable().optional(),
  subject: z.string().min(3).max(255).optional(),
  message: z.string().min(10, { message: "Pesan minimal 10 karakter." }).max(2000),
  captchaToken: z.string().min(1, { message: "Captcha wajib diisi." }),
});

// 3. Auth & Owner API Schemas
export const entityCreateSchema = z.object({
  name: z.string().min(3, { message: "Nama entitas minimal 3 karakter." }).max(255),
  slug: slugSchema,
  entity_type: z.enum(["personal", "brand", "saas", "institution"]),
  headline: z.string().min(10, { message: "Headline minimal 10 karakter." }).max(255),
  city: z.string().min(2, { message: "Nama kota minimal 2 karakter." }).max(100),
  country: z.string().length(2, { message: "Kode negara harus 2 huruf (e.g. ID)." }).default("ID"),
});

export const entityUpdateSchema = z.object({
  directory_id: uuidSchema,
  headline: z.string().min(10).max(255).optional(),
  description: z.string().max(5000).optional(),
  metadata_public: z
    .object({
      categories: z.array(z.string()).optional(),
      services: z.array(z.string()).optional(),
      location: z
        .object({
          country: z.string().optional(),
          city: z.string().optional(),
        })
        .optional(),
      contact: z
        .object({
          whatsapp: phoneSchema.optional(),
          email: emailSchema.optional(),
        })
        .optional(),
    })
    .optional(),
  visibility: z
    .object({
      show_whatsapp: z.boolean().default(true),
      show_reviews: z.boolean().default(true),
    })
    .optional(),
});

export const proofCreateSchema = z.object({
  directory_id: uuidSchema,
  proof_type: z.enum([
    "legal_document",
    "academic_profile",
    "business_profile",
    "portfolio",
    "identity",
    "social_proof",
    "escrow_receipt",
    "other",
  ]),
  title: z.string().min(3).max(255),
  description: z.string().max(1000).optional(),
  file_url: urlSchema.nullable().optional(),
  source_url: urlSchema.nullable().optional(),
  file_hash: z.string().max(100).optional(),
  file_size: z.number().positive().optional(),
  mime_type: z.string().max(100).optional(),
  visibility: z.enum(["public", "private", "verifier_only"]).default("public"),
});

export const claimRequestSchema = z.object({
  directory_id: uuidSchema,
  method: z.enum(["dns_txt", "email", "document"]),
  claim_target: z.string().min(3).max(255),
});

export const widgetCreateSchema = z.object({
  directory_id: uuidSchema,
  widget_type: z.enum(["badge", "testimonials", "stepper"]),
  domain: z.string().min(3).max(255),
});

// 4. Widget Real-time Tracking Schemas
export const widgetEventSchema = z.object({
  installation_id: uuidSchema,
  event_type: z.enum(["impression", "click", "lead_submit"]),
  page_url: urlSchema,
  referrer: z.string().optional(),
  target_url: urlSchema.optional(),
  ts: z.string().datetime().optional(),
  meta: z.record(z.string(), z.any()).optional(),
});

// 5. Admin Control Schemas
export const adminProofReviewSchema = z.object({
  proof_id: uuidSchema,
  action: z.enum(["approve", "reject"]),
  notes: z.string().max(1000).optional(),
});

export const adminClaimReviewSchema = z.object({
  claim_id: uuidSchema,
  action: z.enum(["approve", "reject"]),
  reason: z.string().max(1000).optional(),
});
