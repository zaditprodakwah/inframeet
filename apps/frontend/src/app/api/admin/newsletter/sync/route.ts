/**
 * /api/admin/newsletter/sync/route.ts
 * Syncs opted-in users to Listmonk (self-hosted) in batches.
 * Protected by Admin Bearer token. Non-blocking chunked processing.
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase";
import { dispatchAlert } from "@/lib/alerts";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const LISTMONK_BASE = process.env.LISTMONK_BASE_URL ?? "";
const LISTMONK_USERNAME = process.env.LISTMONK_USERNAME ?? "";
const LISTMONK_PASSWORD = process.env.LISTMONK_PASSWORD ?? "";
const LISTMONK_LIST_ID = parseInt(process.env.LISTMONK_LIST_ID ?? "1", 10);
const CHUNK_SIZE = 100;

const SubscriberSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  status: z.literal("enabled"),
  lists: z.array(z.number()),
  preconfirm_subscriptions: z.boolean(),
});

type Subscriber = z.infer<typeof SubscriberSchema>;

interface UserRow {
  email: string;
  full_name: string | null;
}

async function syncChunk(subscribers: Subscriber[]): Promise<{ synced: number; failed: number }> {
  if (!LISTMONK_BASE) return { synced: 0, failed: subscribers.length };

  const credentials = Buffer.from(`${LISTMONK_USERNAME}:${LISTMONK_PASSWORD}`).toString("base64");

  let synced = 0;
  let failed = 0;

  for (const sub of subscribers) {
    try {
      const res = await fetch(`${LISTMONK_BASE}/api/subscribers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${credentials}`,
        },
        body: JSON.stringify(sub),
      });

      if (res.ok || res.status === 409) {
        // 409 = already exists, still counts as synced
        synced++;
      } else {
        failed++;
        console.warn("[Listmonk Sync] Failed for", sub.email, res.status);
      }
    } catch {
      failed++;
    }
  }

  return { synced, failed };
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  // Admin auth
  const authHeader = request.headers.get("authorization");
  const expectedToken = process.env.ADMIN_SECRET_KEY;
  if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Database service not initialized." }, { status: 503 });
  }

  try {
    // Fetch opted-in users (GDPR/UU PDP compliant check)
    const { data: users, error } = await supabaseAdmin
      .from("clients")
      .select("email, full_name")
      .eq("newsletter_opt_in", true)
      .eq("is_active", true);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const rows = (users ?? []) as UserRow[];
    const total = rows.length;
    let synced = 0;
    let failed = 0;

    // Process in chunks to avoid Vercel timeout
    for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
      const chunk = rows.slice(i, i + CHUNK_SIZE);
      const subscribers: Subscriber[] = chunk.map((u) => ({
        email: u.email,
        name: u.full_name ?? u.email.split("@")[0],
        status: "enabled" as const,
        lists: [LISTMONK_LIST_ID],
        preconfirm_subscriptions: true,
      }));

      const result = await syncChunk(subscribers);
      synced += result.synced;
      failed += result.failed;
    }

    // Alert if significant failures
    if (failed > 10) {
      await dispatchAlert({
        level: "WARNING",
        title: "Newsletter Sync — High Failure Rate",
        body: `${failed}/${total} subscribers gagal disinkronisasi ke Listmonk. Periksa koneksi Listmonk.`,
        auditId: `INF-NL-${Date.now().toString(36).toUpperCase()}`,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      total,
      synced,
      failed,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[Newsletter Sync Error]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
