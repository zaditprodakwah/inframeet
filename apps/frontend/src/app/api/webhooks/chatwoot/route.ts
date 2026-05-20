/**
 * /api/webhooks/chatwoot/route.ts
 * Ingests Chatwoot webhook events into admin support log.
 * Validates signature using CHATWOOT_WEBHOOK_SECRET.
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase";
import crypto from "crypto";

export const dynamic = "force-dynamic";

const ChatwootEventSchema = z.object({
  event: z.string(),
  id: z.number().optional(),
  conversation: z
    .object({
      id: z.number(),
      inbox_id: z.number().optional(),
      status: z.string().optional(),
      labels: z.array(z.string()).optional(),
    })
    .optional(),
  contact: z
    .object({
      id: z.number().optional(),
      name: z.string().optional(),
      email: z.string().optional(),
      phone_number: z.string().optional(),
    })
    .optional(),
  message: z
    .object({
      id: z.number().optional(),
      content: z.string().optional(),
      message_type: z.number().optional(),
    })
    .optional(),
  created_at: z.number().optional(),
});

type ChatwootEvent = z.infer<typeof ChatwootEventSchema>;

function verifySignature(body: string, signature: string | null): boolean {
  const secret = process.env.CHATWOOT_WEBHOOK_SECRET;
  if (!secret || !signature) return !secret; // Allow if no secret configured

  const hmac = crypto.createHmac("sha256", secret);
  const expectedSig = hmac.update(body).digest("hex");
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSig)
    );
  } catch {
    return false;
  }
}

function determineTenantFromLabels(labels: string[]): "b2b" | "academic" | "general" {
  const lower = labels.map((l) => l.toLowerCase());
  if (lower.some((l) => l.includes("b2b") || l.includes("enterprise") || l.includes("cloud"))) {
    return "b2b";
  }
  if (lower.some((l) => l.includes("akademik") || l.includes("academic") || l.includes("research"))) {
    return "academic";
  }
  return "general";
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const rawBody = await request.text();
  const signature = request.headers.get("x-chatwoot-signature");

  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const validation = ChatwootEventSchema.safeParse(body);
  if (!validation.success) {
    // Still return 200 to avoid Chatwoot retries for unknown event types
    console.warn("[Chatwoot Webhook] Unknown event shape:", validation.error.message);
    return NextResponse.json({ received: true });
  }

  const event = validation.data as ChatwootEvent;
  const labels = event.conversation?.labels ?? [];
  const tenant = determineTenantFromLabels(labels);

  // Log to admin support table (non-blocking)
  if (supabaseAdmin) {
    supabaseAdmin
      .from("admin_support_log")
      .insert({
        chatwoot_event: event.event,
        conversation_id: event.conversation?.id ?? null,
        contact_name: event.contact?.name ?? null,
        contact_email: event.contact?.email ?? null,
        tenant_type: tenant,
        labels: labels,
        raw_payload: event,
        received_at: new Date().toISOString(),
      })
      .then(({ error }) => {
        if (error) {
          // Table may not exist yet — log but don't crash
          console.warn("[Chatwoot DB Log]", error.message);
        }
      });
  }

  return NextResponse.json({ received: true, tenant, event: event.event });
}
