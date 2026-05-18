import { IAffiliateAdapter } from "./IAffiliateAdapter";

export class ImpactAdapter implements IAffiliateAdapter {
  async generateDeepLink(originalUrl: string, advertiserId?: string): Promise<string> {
    const apiUrl = process.env.IMPACT_API_URL || "https://api.impact.com/Advertisers/v15";
    const accountSid = process.env.IMPACT_ACCOUNT_SID;
    const authToken = process.env.IMPACT_AUTH_TOKEN;

    if (!accountSid || !authToken) {
      console.warn("Impact.com credentials missing. Falling back to constructed link.");
      return this.buildFallbackLink(originalUrl, accountSid || "inframeet", advertiserId);
    }

    try {
      // Impact.com standard endpoint to create deep links programmatically
      const credentials = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
      
      const res = await fetch(`${apiUrl}/Campaigns/verify`, {
        method: "POST",
        headers: {
          "Authorization": `Basic ${credentials}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          Url: originalUrl,
          SubId: advertiserId || "inframeet"
        })
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`Impact.com API returned status ${res.status}: ${errorText}`);
        return this.buildFallbackLink(originalUrl, accountSid, advertiserId);
      }

      const data = await res.json();
      return data.DeepLink || data.Url || this.buildFallbackLink(originalUrl, accountSid, advertiserId);
    } catch (error) {
      console.error("Impact.com Adapter link generation error:", error);
      return this.buildFallbackLink(originalUrl, accountSid, advertiserId);
    }
  }

  private buildFallbackLink(originalUrl: string, accountSid: string, advertiserId?: string): string {
    if (!accountSid) return originalUrl;
    // Standard Impact.com global redirector link
    const cleanSid = accountSid.trim();
    return `https://impact.sjv.io/c/${cleanSid}/${advertiserId || "inframeet"}/?u=${encodeURIComponent(originalUrl)}`;
  }
}
