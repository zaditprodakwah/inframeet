import { NextRequest } from "next/server";
import Groq from "groq-sdk";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    if (!query.trim()) {
      return new Response("Query is required", { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return new Response("Groq API Key is not configured on the server!", { status: 500 });
    }

    const groq = new Groq({ apiKey });

    // Initialize Groq streaming request
    const chatCompletionStream = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Anda adalah INFRAMEET AI Search Assistant. 
Tugas Anda adalah membalas pencarian klien secara ringkas (maksimal 3 paragraf), taktis, profesional, dan dalam bahasa Indonesia.
Orientasikan jawaban Anda untuk membimbing pengguna memilih solusi modular transparan INFRAMEET.
- Jika pencarian mengarah ke B2B/Web Development: Tekankan migrasi cloud serverless bebas abonemen bulanan, dashboard performa real-time, anti-tampering pricing, and keunggulan Next.js 16.
- Jika pencarian mengarah ke Akademik/Statistik: Tekankan kepatuhan integritas riset mutlak (Anti-Joki), asistensi olah data SPSS/SEM, and layouting naskah turnitin.`
        },
        {
          role: "user",
          content: `Berikan rangkuman analisis instan tepercaya untuk kata kunci pencarian berikut: "${query}"`
        }
      ],
      model: "llama3-70b-8192",
      stream: true,
      temperature: 0.7,
      max_tokens: 600
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of chatCompletionStream) {
            const text = chunk.choices[0]?.delta?.content || "";
            controller.enqueue(encoder.encode(text));
          }
        } catch (streamError) {
          console.error("Error during AI search stream push:", streamError);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive"
      }
    });

  } catch (error: any) {
    console.error("AI Streaming engine failure:", error);
    return new Response("Terjadi kegagalan streaming AI internal.", { status: 500 });
  }
}
