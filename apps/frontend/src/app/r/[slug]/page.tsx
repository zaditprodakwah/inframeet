import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import { AffiliateManager } from "@/lib/affiliates/AffiliateManager";
import ClientRedirector from "./ClientRedirector";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function RedirectPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  if (!supabaseAdmin) {
    return redirect("/");
  }

  // 1. Fetch tool by name or category matching slug
  const { data: tool, error } = await supabaseAdmin
    .from("tools_directory")
    .select("id, name, website_url, original_url, affiliate_url, affiliate_network, network_advertiser_id, cached_deep_link, deep_link_generated_at")
    .ilike("name", slug)
    .single();

  if (error || !tool) {
    console.error(`Tool redirect error for slug '${slug}':`, error);
    return redirect("/tools");
  }

  const originalUrl = tool.original_url || tool.website_url || tool.affiliate_url || "";
  const network = tool.affiliate_network || "manual";
  const advertiserId = tool.network_advertiser_id || "";

  // 2. Resolve affiliate deep link using manager (caching implemented)
  const resolvedLink = await AffiliateManager.resolveAffiliateLink(
    tool.id,
    originalUrl,
    network,
    advertiserId,
    tool.cached_deep_link,
    tool.deep_link_generated_at
  );

  // 3. Log click in affiliate_click_logs
  try {
    await supabaseAdmin.from("affiliate_click_logs").insert({
      tool_id: slug,
      clicked_from_url: resolvedLink,
      user_ip_hashed: "anonymous_edge"
    });
  } catch (logError) {
    console.error("Failed to log affiliate click:", logError);
  }

  return (
    <ClientRedirector 
      toolName={tool.name} 
      targetUrl={resolvedLink} 
    />
  );
}
