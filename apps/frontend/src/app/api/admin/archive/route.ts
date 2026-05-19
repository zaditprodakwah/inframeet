import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { encryptPayload, decryptPayload } from "@/lib/archive";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, transactionId } = body;

    if (!action || !transactionId) {
      return NextResponse.json({ error: "action and transactionId are required fields" }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Database context error" }, { status: 550 });
    }

    const secretKey = process.env.ADMIN_MASTER_ENCRYPTION_KEY || "SuperSecretDefaultKey2026";

    if (action === "archive") {
      const { data: tx, error } = await supabaseAdmin
        .from("escrow_ledger")
        .select("*")
        .eq("id", transactionId)
        .single();

      if (error || !tx) {
        return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
      }

      // Encrypt transaction row payload using secure AES-256-GCM
      const stringifiedPayload = JSON.stringify(tx);
      const encrypted = encryptPayload(stringifiedPayload, secretKey);

      // Save encrypted packet to transaction row metadata & transition status
      const updatedMetadata = {
        ...tx.metadata,
        archived_packet: {
          encryptedData: encrypted.encryptedData,
          iv: encrypted.iv,
          authTag: encrypted.authTag,
          archived_at: new Date().toISOString()
        }
      };

      const { error: updateErr } = await supabaseAdmin
        .from("escrow_ledger")
        .update({
          metadata: updatedMetadata,
          description: `[ARCHIVED COLD STORAGE] - Payload encrypted via AES-256-GCM`
        })
        .eq("id", transactionId);

      if (updateErr) {
        return NextResponse.json({ error: `Gagal mengarsipkan: ${updateErr.message}` }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: "Transaksi berhasil diarsipkan ke Cold Storage!" });
    }

    if (action === "restore") {
      const { data: tx, error } = await supabaseAdmin
        .from("escrow_ledger")
        .select("*")
        .eq("id", transactionId)
        .single();

      if (error || !tx) {
        return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
      }

      const packet = tx.metadata?.archived_packet;
      if (!packet || !packet.encryptedData) {
        return NextResponse.json({ error: "No encrypted cold storage packet found to restore" }, { status: 400 });
      }

      // Decrypt transaction using master password key
      const decryptedString = decryptPayload(
        packet.encryptedData,
        secretKey,
        packet.iv,
        packet.authTag
      );

      const originalPayload = JSON.parse(decryptedString);

      // Restore parameters and clear cold storage references from metadata
      const cleanMetadata = { ...tx.metadata };
      delete cleanMetadata.archived_packet;

      const { error: restoreErr } = await supabaseAdmin
        .from("escrow_ledger")
        .update({
          metadata: cleanMetadata,
          description: originalPayload.description || "Transaksi dipulihkan dari Cold Storage."
        })
        .eq("id", transactionId);

      if (restoreErr) {
        return NextResponse.json({ error: `Gagal memulihkan: ${restoreErr.message}` }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: "Payload berhasil dipulihkan dari Cold Storage!" });
    }

    return NextResponse.json({ error: "Invalid action parameter" }, { status: 400 });
  } catch (err: any) {
    console.error("[COMPLIANCE ARCHIVE ENGINE ERROR]:", err.message);
    return NextResponse.json({ error: "Internal compliance worker error" }, { status: 500 });
  }
}
