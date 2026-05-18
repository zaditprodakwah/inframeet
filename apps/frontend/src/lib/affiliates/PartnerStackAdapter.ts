import { IAffiliateAdapter } from "./IAffiliateAdapter";

export class PartnerStackAdapter implements IAffiliateAdapter {
  async generateDeepLink(originalUrl: string, advertiserId?: string): Promise<string> {
    const apiUrl = process.env.PARTNERSTACK_API_URL || "https://api.partnerstack.com/api/v2";
    const privateKey = process.env.PARTNERSTACK_PRIVATE_KEY;
    const publicKey = process.env.PARTNERSTACK_PUBLIC_KEY;
    const token = privateKey || publicKey;

    if (!token) {
      console.warn("PartnerStack credentials are missing. Falling back to original URL.");
      return originalUrl;
    }

    try {
      const res = await fetch(`${apiUrl}/links`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          target_url: originalUrl,
          custom_ref: advertiserId || "inframeet"
        })
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`PartnerStack API returned status ${res.status}: ${errorText}`);
        return originalUrl;
      }

      const data = await res.json();
      return data.url || originalUrl;
    } catch (error) {
      console.error("PartnerStack Adapter link generation error:", error);
      return originalUrl;
    }
  }
}
