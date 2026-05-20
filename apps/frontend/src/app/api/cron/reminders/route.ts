/**
 * /api/cron/reminders/route.ts
 * Automated milestone reminder cron handler.
 * Protected by Vercel Cron Bearer token.
 * Queries active briefs with upcoming deadlines and sends notifications.
 */
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase";
import { dispatchAlert } from "@/lib/alerts";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

function safeCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

interface BriefRow {
  id: string;
  title: string;
  deadline: string;
  contact_email: string | null;
  client_name: string | null;
  submission_status: string;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  // Auth: Vercel Cron header OR Bearer token
  const isVercelCron = request.headers.get("x-vercel-cron") === "1";
  const authHeader = request.headers.get("authorization");
  const expectedToken = process.env.CRON_SECRET ?? process.env.UPTIMEROBOT_API_KEY ?? "";

  let isBearerValid = false;
  if (authHeader?.startsWith("Bearer ")) {
    isBearerValid = safeCompare(authHeader.substring(7).trim(), expectedToken);
  }

  if (!isVercelCron && !isBearerValid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Database service not initialized." }, { status: 503 });
  }

  try {
    const now = new Date();
    const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
    const in1h = new Date(now.getTime() + 60 * 60 * 1000).toISOString();

    // Fetch briefs with deadlines in next 24 hours
    const { data: dueSoon, error: dueError } = await supabaseAdmin
      .from("briefs")
      .select("id, title, deadline, contact_email, client_name, submission_status")
      .eq("submission_status", "active")
      .gte("deadline", now.toISOString())
      .lte("deadline", in24h);

    if (dueError) {
      console.error("[Reminders Cron] DB Error:", dueError.message);
      return NextResponse.json({ error: dueError.message }, { status: 500 });
    }

    const briefs = (dueSoon ?? []) as BriefRow[];
    let notified = 0;
    const errors: string[] = [];

    for (const brief of briefs) {
      const deadlineDate = new Date(brief.deadline);
      const hoursLeft = Math.round((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60));
      const urgency = hoursLeft <= 1 ? "CRITICAL" : "WARNING";

      // Dispatch system alert
      await dispatchAlert({
        level: urgency,
        title: `Deadline Brief: ${brief.title}`,
        body: `Project "${brief.title}" untuk klien ${brief.client_name ?? "unknown"} deadline dalam ${hoursLeft} jam. Status: ${brief.submission_status.toUpperCase()}`,
        auditId: `INF-DL-${brief.id.slice(0, 8).toUpperCase()}`,
        timestamp: new Date().toISOString(),
      });

      // Send email notification if contact email exists
      if (brief.contact_email) {
        try {
          await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? ""}/api/test-email`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              to: brief.contact_email,
              subject: `⏰ Pengingat Deadline: ${brief.title}`,
              body: `Proyek Anda "${brief.title}" memiliki tenggat waktu dalam ${hoursLeft} jam. Harap segera menyelesaikan dokumentasi yang diperlukan.`,
            }),
          });
          notified++;
        } catch (emailErr: unknown) {
          const msg = emailErr instanceof Error ? emailErr.message : "Email error";
          errors.push(`${brief.id}: ${msg}`);
        }
      } else {
        notified++;
      }

      // Log reminder sent in audit_log
      await supabaseAdmin.from("audit_log").insert({
        entity_type: "brief",
        entity_id: brief.id,
        action: "reminder_sent",
        changes: {
          hours_left: hoursLeft,
          urgency,
          contact: brief.contact_email,
        },
        ip_address: "0.0.0.0",
        user_agent: "Vercel-Cron/1.0",
      });
    }

    return NextResponse.json({
      success: true,
      processed: briefs.length,
      notified,
      errors: errors.length > 0 ? errors : undefined,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[Reminders Cron Error]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
