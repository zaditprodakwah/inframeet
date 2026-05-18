import { IAffiliateAdapter } from "./IAffiliateAdapter";

export class InvolveAsiaAdapter implements IAffiliateAdapter {
  async generateDeepLink(originalUrl: string, advertiserId?: string): Promise<string> {
    const apiUrl = process.env.INVOLVE_ASIA_API_URL || "https://api.involve.asia/api";
    const apiKey = process.env.INVOLVE_ASIA_API_KEY;
    const propertyId = process.env.INVOLVE_ASIA_PROPERTY_ID;

    if (!apiKey || !propertyId) {
      console.warn("Involve Asia credentials missing. Falling back to original URL.");
      return originalUrl;
    }

    try {
      const res = await fetch(`${apiUrl}/v1/deeplink`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          url: originalUrl,
          property_id: propertyId,
          sub_id: advertiserId || "inframeet"
        })
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`Involve Asia API returned status ${res.status}: ${errorText}`);
        
        // Return programmatically constructed tracking link if API call fails
        // Involve Asia tracking formats usually fall back to a redirect parameter
        return `https://trade.involve.asia/click?pid=${propertyId}&offer_id=${advertiserId || ""}&refurl=${encodeURIComponent(originalUrl)}`;
      }

      const data = await res.json();
      return data.deeplink || data.url || originalUrl;
    } catch (error) {
      console.error("Involve Asia Adapter link generation error:", error);
      return originalUrl;
    }
  }
}
