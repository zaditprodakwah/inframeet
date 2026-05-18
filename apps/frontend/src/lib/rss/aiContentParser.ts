import { Groq } from "groq-sdk";
import { supabaseAdmin } from "../supabase";

export interface AIAnalysisResult {
  summary: string;
  tags: string[];
  matchedToolSlugs: string[];
}

export class AIContentParser {
  private static groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || "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"
  });

  /**
   * Evaluates an article's context, creates a structured summary, and resolves matching B2B tools.
   */
  static async parseAndExtractTools(
    articleTitle: string,
    articleBody: string
  ): Promise<AIAnalysisResult> {
    try {
      const prompt = `
        Analisis artikel berikut. Ekstrak kata kunci penting, buat ringkasan eksekutif singkat (maksimal 3 poin), dan cocokkan dengan nama alat teknologi (tools) yang paling relevan yang dibahas atau direkomendasikan untuk topik tersebut.
        
        Artikel:
        Judul: ${articleTitle}
        Isi: ${articleBody.slice(0, 1500)}
        
        Kembalikan respon strictly dalam format JSON dengan struktur berikut:
        {
          "ai_summary": "Poin-poin ringkasan tulisan...",
          "relevant_tags": ["AI", "Hosting", "Security", "SaaS"],
          "matched_tool_names": ["ChatGPT", "Vercel", "DigitalOcean", "Niagahoster", "Hostinger"]
        }
      `.trim();

      const chatCompletion = await this.groq.chat.completions.create({
        messages: [
          { role: "system", content: "You are an advanced B2B technology researcher. Return JSON output only." },
          { role: "user", content: prompt }
        ],
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" }
      });

      const responseText = chatCompletion.choices[0]?.message?.content;
      if (!responseText) {
        throw new Error("Empty completion returned from Groq API.");
      }

      const parsed = JSON.parse(responseText);
      
      const summary = parsed.ai_summary || "Ulasan teknologi terkini.";
      const tags = parsed.relevant_tags || [];
      const toolNames = parsed.matched_tool_names || [];

      // Cross-reference matched tool names against actual items in tools_directory
      const matchedToolSlugs: string[] = [];

      if (supabaseAdmin && toolNames.length > 0) {
        // Query database to find if any tools match the extracted names
        const { data: dbTools } = await supabaseAdmin
          .from("tools_directory")
          .select("name")
          .or(toolNames.map((name: string) => `name.ilike.%${name}%`).join(","));

        if (dbTools && dbTools.length > 0) {
          dbTools.forEach((t) => {
            matchedToolSlugs.push(t.name.toLowerCase().replace(/\s+/g, "-"));
          });
        }
      }

      return {
        summary,
        tags,
        matchedToolSlugs: matchedToolSlugs.slice(0, 3) // Limit to top 3 recommendations
      };
    } catch (err) {
      console.error("AI Content Parser evaluation crash:", err);
      return {
        summary: "Ulasan riset teknologi komputasi cloud, AI, dan optimasi digital.",
        tags: ["Teknologi", "Infrastruktur"],
        matchedToolSlugs: []
      };
    }
  }
}
