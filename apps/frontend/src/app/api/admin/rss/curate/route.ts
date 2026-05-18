import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { Groq } from "groq-sdk";
import { AIContentParser } from "@/lib/rss/aiContentParser";

export async function POST(request: Request) {
  try {
    const groqApiKey = process.env.GROQ_API_KEY;

    if (!groqApiKey) {
      return NextResponse.json(
        { error: "GROQ_API_KEY tidak terkonfigurasi di server!" },
        { status: 500 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Supabase Admin Client tidak terkonfigurasi!" },
        { status: 500 }
      );
    }

    // Initialize Groq client
    const groq = new Groq({ apiKey: groqApiKey });

    // 1. Fetch 5 most recent uncurated RSS items
    const { data: items, error: itemsError } = await supabaseAdmin
      .from("rss_items")
      .select("*")
      .eq("relevance_score", 0.75)
      .limit(5);

    if (itemsError) {
      return NextResponse.json(
        { error: `Gagal memuat artikel: ${itemsError.message}` },
        { status: 500 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json({
        success: true,
        message: "Tidak ada artikel baru yang memerlukan kurasi AI saat ini.",
        curatedCount: 0,
      });
    }

    const curatedItems = [];

    // 2. Curate each article using Groq SDK and extract matching tools
    for (const item of items) {
      try {
        // Run AI analysis & tool extraction on the content first
        const analysis = await AIContentParser.parseAndExtractTools(
          item.title,
          item.content_summary || ""
        );

        const prompt = `
        Anda adalah asisten AI kurator riset dan konten teknologi eksklusif untuk platform INFRAMEET.
        Tugas Anda adalah menelaah, menerjemahkan, and meringkas artikel sains/IT berikut ini ke dalam Bahasa Indonesia kelas atas, formal, and mudah dipahami oleh audiens B2B enterprise and akademisi.

        Judul Asli: ${item.title}
        Ringkasan Analisis AI: ${analysis.summary}
        Kata Kunci / Tags: ${analysis.tags.join(", ")}

        Harap kembalikan respon berupa objek JSON murni (strict JSON) dengan skema berikut:
        {
          "curated_title": "Judul Bahasa Indonesia yang profesional dan memikat",
          "executive_summary": "3 poin penting ringkasan eksekutif (TL;DR) dipisah baris \\n",
          "faq": [
            {
              "question": "Pertanyaan FAQ 1",
              "answer": "Jawaban FAQ 1"
            },
            {
              "question": "Pertanyaan FAQ 2",
              "answer": "Jawaban FAQ 2"
            }
          ]
        }
        `;

        const chatCompletion = await groq.chat.completions.create({
          messages: [
            { role: "system", content: "You are a professional research curator. You must output ONLY a valid, parseable JSON object." },
            { role: "user", content: prompt },
          ],
          model: "llama-3.3-70b-versatile",
          temperature: 0.2,
          response_format: { type: "json_object" },
        });

        const rawText = chatCompletion.choices[0]?.message?.content;
        if (!rawText) throw new Error("Groq API mengembalikan respon kosong");

        const parsedContent = JSON.parse(rawText);

        // Formulate curated executive summary & FAQ blocks
        const curatedSummary = `**Executive Summary (TL;DR):**\n${parsedContent.executive_summary}\n\n**FAQ:**\n${parsedContent.faq.map((f: any) => `* **Q: ${f.question}**\n  A: ${f.answer}`).join("\n")}`;

        // Consolidate categories and matching affiliate tool tags
        const dbCategories = [
          ...analysis.tags,
          ...analysis.matchedToolSlugs.map((slug) => `tool:${slug}`)
        ];

        // Save curated result back to database
        const { error: updateError } = await supabaseAdmin
          .from("rss_items")
          .update({
            title: parsedContent.curated_title,
            content_summary: curatedSummary,
            categories: dbCategories,
            relevance_score: 0.95, // Mark as curated
          })
          .eq("id", item.id);

        if (updateError) {
          console.error(`Gagal mengupdate item ${item.id}:`, updateError);
          continue;
        }

        curatedItems.push({
          id: item.id,
          originalTitle: item.title,
          curatedTitle: parsedContent.curated_title,
        });
      } catch (err: any) {
        console.error(`Gagal mengkurasi item ${item.id}:`, err);
      }
    }

    return NextResponse.json({
      success: true,
      curatedCount: curatedItems.length,
      results: curatedItems,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: `Curation Error: ${error.message}` },
      { status: 500 }
    );
  }
}
