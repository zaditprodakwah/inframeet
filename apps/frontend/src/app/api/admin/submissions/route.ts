import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { moderateUgcSubmission } from "@/app/admin/actions/crm_cms";

export const dynamic = "force-dynamic";

/**
 * GET: Fetches all content submissions pending moderation review
 */
export async function GET(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Database context error" }, { status: 550 });
    }

    const { data: subs, error } = await supabaseAdmin
      .from("content_submissions")
      .select("*")
      .eq("status", "PENDING_REVIEW")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: subs || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * POST: Handles approving or rejecting a public content submission
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { submissionId, action } = body; // action is "APPROVED" | "REJECTED"

    if (!submissionId || !action) {
      return NextResponse.json({ error: "submissionId and action are required fields" }, { status: 400 });
    }

    const outcome = await moderateUgcSubmission(submissionId, action);

    if (!outcome.success) {
      return NextResponse.json({ error: outcome.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: outcome.message });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
