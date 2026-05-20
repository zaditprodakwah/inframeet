/**
 * /api/tools/submission/upload-url/route.ts
 * Creates Supabase Storage signed upload URLs.
 * Client uploads directly to Supabase — bypasses Vercel 4.5MB body limit.
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const BUCKET = "intake-docs";
const MAX_FILE_SIZE_MB = 50;

const RequestSchema = z.object({
  filename: z.string().min(1).max(255),
  contentType: z.string().min(1),
  fileSizeBytes: z.number().max(MAX_FILE_SIZE_MB * 1024 * 1024, 
    `Ukuran file maksimal ${MAX_FILE_SIZE_MB}MB`
  ).optional(),
});

function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "-")
    .replace(/-+/g, "-");
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: "Storage service not initialized." },
      { status: 503 }
    );
  }

  try {
    const body: unknown = await request.json();
    const validation = RequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { filename, contentType } = validation.data;
    const sanitized = sanitizeFilename(filename);
    const timestamp = Date.now();
    const storagePath = `submissions/${timestamp}-${sanitized}`;

    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET)
      .createSignedUploadUrl(storagePath);

    if (error || !data) {
      console.error("[Upload URL Error]", error?.message);
      return NextResponse.json(
        { error: "Gagal membuat URL upload. Coba beberapa saat lagi." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      signedUrl: data.signedUrl,
      token: data.token,
      path: storagePath,
      publicUrl: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${storagePath}`,
      contentType,
      expiresIn: 3600, // 1 hour
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[Upload URL Route Error]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
