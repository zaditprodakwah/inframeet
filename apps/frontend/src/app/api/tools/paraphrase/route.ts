/**
 * /api/tools/paraphrase/route.ts
 * AI-powered paraphrase reconciler using Groq LLM (Llama 3.3 70b) via Vercel AI SDK.
 * Streams rewritten text back to client for real-time display.
 */
import { NextRequest } from "next/server";
import { z } from "zod";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const RequestSchema = z.object({
  text: z.string().min(20, "Teks minimal 20 karakter.").max(5000),
  style: z.enum(["academic", "formal", "simplified"]).default("academic"),
});

const STYLE_PROMPTS: Record<string, string> = {
  academic:
    "Rewrite the following text in a rigorous, original academic style. Maintain the scholarly meaning but completely rephrase the sentences, vary the vocabulary, and restructure the argument flow to eliminate similarity with existing sources. Use precise academic terminology.",
  formal:
    "Rewrite the following text in a professional formal tone. Retain all factual information but completely rephrase using different sentence structures and vocabulary. Ensure zero similarity with the original phrasing.",
  simplified:
    "Rewrite the following text in clear, simple language that is easy to understand. Keep all key information but use shorter sentences and common vocabulary. Eliminate technical jargon where possible.",
};

export async function POST(request: NextRequest): Promise<Response> {
  const groqApiKey = process.env.GROQ_API_KEY;
  if (!groqApiKey) {
    return new Response(
      JSON.stringify({ error: "AI Paraphrase service tidak dikonfigurasi." }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const body: unknown = await request.json();
    const validation = RequestSchema.safeParse(body);

    if (!validation.success) {
      return new Response(
        JSON.stringify({ error: validation.error.issues[0].message }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { text, style } = validation.data;
    const systemPrompt = STYLE_PROMPTS[style];

    // Call Groq API directly with streaming
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${groqApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Please paraphrase the following text:\n\n---\n${text}\n---\n\nProvide only the rewritten text, no explanations or preamble.`,
          },
        ],
        stream: true,
        max_tokens: 2048,
        temperature: 0.7,
      }),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      console.error("[Groq API Error]", groqRes.status, errText);
      return new Response(
        JSON.stringify({ error: "AI service error. Coba beberapa saat lagi." }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    // Stream the response directly back to client
    return new Response(groqRes.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[Paraphrase Route Error]", message);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
