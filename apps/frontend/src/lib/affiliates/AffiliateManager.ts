import { supabaseAdmin } from "../supabase";
import { PartnerStackAdapter } from "./PartnerStackAdapter";
import { InvolveAsiaAdapter } from "./InvolveAsiaAdapter";
import { AccessTradeAdapter } from "./AccessTradeAdapter";
import { ImpactAdapter } from "./ImpactAdapter";
import { IAffiliateAdapter } from "./IAffiliateAdapter";

export class AffiliateManager {
  private static adapters: Record<string, IAffiliateAdapter> = {
    partnerstack: new PartnerStackAdapter(),
    involve_asia: new InvolveAsiaAdapter(),
    accesstrade: new AccessTradeAdapter(),
    impact: new ImpactAdapter()
  };

  /**
   * Resolves an affiliate deep link for a specific tool.
   * Utilizes a database cache for 24 hours to prevent exceeding provider API limits.
   */
  static async resolveAffiliateLink(
    toolId: string,
    originalUrl: string,
    network: string,
    advertiserId?: string,
    currentCachedLink?: string,
    lastGeneratedAt?: string
  ): Promise<string> {
    // 1. Check if cached link is valid (within 24 hours)
    if (currentCachedLink && lastGeneratedAt) {
      const generatedTime = new Date(lastGeneratedAt).getTime();
      const now = new Date().getTime();
      const ageInMs = now - generatedTime;
      const twentyFourHoursInMs = 24 * 60 * 60 * 1000;

      if (ageInMs < twentyFourHoursInMs) {
        return currentCachedLink;
      }
    }

    // 2. Resolve via designated adapter
    const adapter = this.adapters[network.toLowerCase()];
    let resolvedLink = originalUrl;

    if (adapter) {
      resolvedLink = await adapter.generateDeepLink(originalUrl, advertiserId);
    } else {
      // Direct direct-programs or manual fallbacks
      if (network === "direct_program" && advertiserId) {
        if (originalUrl.includes("digitalocean.com")) {
          resolvedLink = `https://m.do.co/c/${advertiserId}`;
        } else if (originalUrl.includes("aws.amazon.com")) {
          resolvedLink = `${originalUrl}?tag=${advertiserId}`;
        }
      } else if (currentCachedLink) {
        // Fallback to previous cached deep link if network adapter is missing but cache exists
        return currentCachedLink;
      }
    }

    // 3. Cache the resolved link back to the database in background if admin client is available
    if (supabaseAdmin && toolId) {
      try {
        await supabaseAdmin
          .from("tools_directory")
          .update({
            cached_deep_link: resolvedLink,
            deep_link_generated_at: new Date().toISOString()
          })
          .eq("id", toolId);
      } catch (dbError) {
        console.error(`Failed to cache deep link for tool ${toolId}:`, dbError);
      }
    }

    return resolvedLink;
  }
}
