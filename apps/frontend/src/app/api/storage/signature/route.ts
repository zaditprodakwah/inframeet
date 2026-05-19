import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    // 1. Parse body options
    const body = await req.json();
    const { fileName, fileType, fileSize, directoryId } = body;

    // Validate inputs
    if (!fileName || !fileType || !fileSize || !directoryId) {
      return NextResponse.json(
        { error: "fileName, fileType, fileSize, and directoryId are required fields" },
        { status: 400 }
      );
    }

    // 2. Enforce strict restrictions (PDF/PNG/JPG under 50MB)
    const allowedTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(fileType.toLowerCase())) {
      return NextResponse.json(
        { error: "Invalid file type. Only PDF, PNG, and JPG/JPEG files are allowed." },
        { status: 400 }
      );
    }

    const maxSizeBytes = 50 * 1024 * 1024; // 50MB
    if (fileSize > maxSizeBytes) {
      return NextResponse.json(
        { error: "File size exceeds the maximum 50MB limit." },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Supabase Admin client not configured on server" },
        { status: 500 }
      );
    }

    // 3. Construct a secure isolated file path
    const fileExtension = fileName.split(".").pop();
    const sanitizedFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExtension}`;
    const filePath = `${directoryId}/${sanitizedFileName}`;

    console.log(`[STORAGE SIGNATURE] Generating signed upload path: proofs/${filePath}`);

    // 4. Generate the signed upload URL using Supabase Admin Client
    const { data, error } = await supabaseAdmin.storage
      .from("proofs")
      .createSignedUploadUrl(filePath);

    if (error || !data) {
      console.error("[STORAGE SIGNATURE ERROR] Create signed URL failed:", error?.message);
      return NextResponse.json(
        { error: `Failed to generate signed upload URL: ${error?.message || "unknown error"}` },
        { status: 500 }
      );
    }

    // 5. Construct the final public asset URL mapping
    const publicUrlResult = supabaseAdmin.storage
      .from("proofs")
      .getPublicUrl(filePath);

    return NextResponse.json({
      signedUrl: data.signedUrl,
      token: data.token,
      path: filePath,
      publicUrl: publicUrlResult.data.publicUrl
    });
  } catch (error: any) {
    console.error("[STORAGE SIGNATURE ERROR] Request failed:", error.message);
    return NextResponse.json(
      { error: "Internal server error generating upload signature" },
      { status: 500 }
    );
  }
}
