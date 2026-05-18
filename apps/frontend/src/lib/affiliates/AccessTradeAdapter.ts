import { IAffiliateAdapter } from "./IAffiliateAdapter";

export class AccessTradeAdapter implements IAffiliateAdapter {
  async generateDeepLink(originalUrl: string, advertiserId?: string): Promise<string> {
    const apiUrl = process.env.ACCESSTRADE_API_URL || "https://api.accesstrade.global/v1";
    const apiKey = process.env.ACCESSTRADE_API_KEY;
    const publisherId = process.env.ACCESSTRADE_PUBLISHER_ID;

    if (!apiKey || !publisherId) {
      console.warn("AccessTrade credentials missing. Falling back to constructed link.");
      return this.buildFallbackLink(originalUrl, publisherId || "");
    }

    try {
      const res = await fetch(`${apiUrl}/deeplink`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          url: originalUrl,
          publisher_id: publisherId,
          sub_id: advertiserId || "inframeet"
        })
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`AccessTrade API returned status ${res.status}: ${errorText}`);
        return this.buildFallbackLink(originalUrl, publisherId);
      }

      const data = await res.json();
      return data.deeplink || data.url || this.buildFallbackLink(originalUrl, publisherId);
    } catch (error) {
      console.error("AccessTrade Adapter link generation error:", error);
      return this.buildFallbackLink(originalUrl, publisherId);
    }
  }

  private buildFallbackLink(originalUrl: string, publisherId: string): string {
    if (!publisherId) return originalUrl;
    // Standard AccessTrade CPA tracking format
    return `https://click.accesstrade.co.id/adv.php?rk=${publisherId}&url=${encodeURIComponent(originalUrl)}`;
  }
}
