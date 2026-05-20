import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * Dispatch approved contents to n8n omnichannel social blasts & google indexing
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, title, slug, category, summary, authorName } = body;

    if (!title || !slug) {
      return NextResponse.json({ success: false, error: "Title and slug are required" }, { status: 400 });
    }

    // 1. Compile zero-cost dynamic Vercel OG (Satori) promotional image URL
    // This endpoint generates a high-fidelity visual card at Edge speed
    const host = req.headers.get("host") || "inframeet.com";
    const protocol = req.headers.get("x-forwarded-proto") || "https";
    const ogImageUrl = `${protocol}://${host}/api/og/content?title=${encodeURIComponent(title)}&category=${encodeURIComponent(category || "general")}`;

    // 2. Generate Cloudinary animated Zoom/Pan marketing video URL
    // Growth Hack: converts the static Satori OG image into a dynamic video pan
    // Using Cloudinary fetch feature: https://res.cloudinary.com/demo/image/fetch/
    const cloudinaryVideoUrl = `https://res.cloudinary.com/inframeet/image/fetch/e_zoompan,l_video:inframeet_promotion_template,w_1080,h_1920/f_auto/${encodeURIComponent(ogImageUrl)}`;

    // 3. Compile AEO/GEO and search engines-optimized JSON-LD Schema Markup
    const jsonLdSchema = {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "headline": title,
      "description": summary || "Rekomendasi platform and integrasi digital kustom terpercaya.",
      "image": ogImageUrl,
      "author": {
        "@type": "Person",
        "name": authorName || "Zadit Prodakwah"
      },
      "publisher": {
        "@type": "Organization",
        "name": "INFRAMEET",
        "url": `${protocol}://${host}`
      },
      "mainEntityOfPage": `${protocol}://${host}/${category || "layanan"}/${slug}`
    };

    // 4. Retrieve external n8n/Make webhook URL from database system_settings
    let webhookUrl = "";
    if (supabaseAdmin) {
      const { data } = await supabaseAdmin
        .from("system_settings")
        .select("value")
        .eq("key", "n8n_social_webhook")
        .single();
      if (data?.value) {
        webhookUrl = typeof data.value === "object" ? (data.value.url || data.value.value) : data.value;
      }
    }

    // Dev/Staging fallback webhook
    const finalWebhookUrl = webhookUrl || process.env.N8N_SOCIAL_WEBHOOK || "";

    let webhookDispatched = false;
    let webhookStatus = "skipped";

    if (finalWebhookUrl) {
      try {
        const res = await fetch(finalWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "content.approved",
            contentId: id,
            title,
            slug,
            category,
            summary,
            ogImageUrl,
            cloudinaryVideoUrl,
            jsonLdSchema
          })
        });
        webhookDispatched = res.ok;
        webhookStatus = res.ok ? "success" : "failed";
      } catch (err: any) {
        console.error("n8n Dispatch failed:", err);
        webhookStatus = `error: ${err.message}`;
      }
    }

    // Log the successful automated event in audit_log
    if (supabaseAdmin && id) {
      await supabaseAdmin.from("audit_log").insert({
        actor: "SYSTEM",
        action: "OMNICHANNEL_AUTOPOST",
        details: {
          content_id: id,
          title,
          webhook_status: webhookStatus,
          og_image_url: ogImageUrl
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: "Omnichannel dispatcher triggered successfully!",
      ogImageUrl,
      cloudinaryVideoUrl,
      jsonLdSchema,
      webhookDispatched,
      webhookStatus
    });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
