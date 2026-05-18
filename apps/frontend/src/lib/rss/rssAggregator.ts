export interface ParsedRSSItem {
  title: string;
  link: string;
  description: string;
  publishedAt: string;
}

export class RSSAggregator {
  /**
   * Fetches an external RSS feed and parses it into structured JSON objects.
   */
  static async fetchAndParse(feedUrl: string): Promise<ParsedRSSItem[]> {
    try {
      const res = await fetch(feedUrl, {
        next: { revalidate: 3600 } // Cache feed for 1 hour
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch RSS feed, status: ${res.status}`);
      }

      const xmlText = await res.text();
      return this.parseXML(xmlText);
    } catch (err) {
      console.error(`RSS Aggregator failed for URL '${feedUrl}':`, err);
      return [];
    }
  }

  private static parseXML(xml: string): ParsedRSSItem[] {
    const items: ParsedRSSItem[] = [];
    
    // Extract <item> tags
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xml)) !== null && items.length < 10) {
      const itemContent = match[1];

      // Extract elements using targeted regexes
      const title = this.extractTag(itemContent, "title");
      const link = this.extractTag(itemContent, "link");
      const description = this.extractTag(itemContent, "description");
      const pubDate = this.extractTag(itemContent, "pubDate");

      if (title && link) {
        items.push({
          title: this.sanitizeText(title),
          link: link.trim(),
          description: this.sanitizeText(description || "").slice(0, 200),
          publishedAt: pubDate || new Date().toISOString()
        });
      }
    }

    return items;
  }

  private static extractTag(content: string, tag: string): string | null {
    const regex = new RegExp(`<${tag}>([\\s\\S]*?)<\/${tag}>`, "i");
    const match = regex.exec(content);
    if (!match) return null;

    let val = match[1];
    // Strip CDATA wrapper if present
    if (val.startsWith("<![CDATA[")) {
      val = val.substring(9, val.length - 3);
    }
    return val;
  }

  private static sanitizeText(str: string): string {
    return str
      .replace(/<[^>]*>/g, "") // Strip HTML tags
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, " ")
      .trim();
  }
}
