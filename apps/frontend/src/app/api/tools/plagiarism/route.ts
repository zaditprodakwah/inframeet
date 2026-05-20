/**
 * /api/tools/plagiarism/route.ts
 * Real plagiarism scoring using string-similarity tokenized chunk comparison.
 * Compares submitted text against corpus stored in Supabase plagiarism_corpus table.
 * Falls back to static built-in phrases if corpus is empty.
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { PlagiarismResult, PlagiarismMatchSchema } from "@/lib/schemas/tools";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const RequestSchema = z.object({
  text: z.string().min(50, "Teks minimal 50 karakter untuk analisis.").max(10000),
  email: z.string().email().optional().or(z.literal("")),
});

// Split text into analyzable sentence chunks
function tokenize(text: string): string[] {
  return text
    .split(/[.!?\n]+/)
    .map((s) => s.trim().toLowerCase())
    .filter((s) => s.length > 20);
}

// Jaccard similarity between two strings (word-level)
function jaccardSimilarity(a: string, b: string): number {
  const setA = new Set(a.split(/\s+/));
  const setB = new Set(b.split(/\s+/));
  const intersection = new Set([...setA].filter((x) => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  if (union.size === 0) return 0;
  return intersection.size / union.size;
}

// Built-in academic phrases corpus for fallback
const FALLBACK_CORPUS: string[] = [
  "penelitian ini bertujuan untuk menganalisis",
  "berdasarkan hasil penelitian yang telah dilakukan",
  "metode yang digunakan dalam penelitian ini adalah",
  "hasil penelitian menunjukkan bahwa",
  "dapat disimpulkan bahwa penelitian ini",
  "data yang diperoleh dari penelitian ini",
  "penelitian terdahulu menunjukkan bahwa",
  "analisis data dilakukan menggunakan metode statistik",
  "tujuan dari penelitian ini adalah untuk mengetahui",
  "pengumpulan data dilakukan melalui observasi dan wawancara",
  "hipotesis yang diajukan dalam penelitian ini",
  "populasi dalam penelitian ini adalah seluruh",
  "pengambilan sampel menggunakan teknik purposive sampling",
  "validitas dan reliabilitas instrumen telah diuji",
  "penelitian ini menggunakan pendekatan kuantitatif",
  "landasan teori yang digunakan dalam penelitian ini",
  "this study aims to examine the relationship between",
  "the results indicate that there is a significant",
  "based on the findings of this research",
  "the methodology used in this study",
  "the data were collected through questionnaires",
  "statistical analysis was conducted using spss",
];

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: unknown = await request.json();
    const validation = RequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { text, email } = validation.data;
    const chunks = tokenize(text);
    const wordCount = text.split(/\s+/).filter(Boolean).length;

    // Try to fetch corpus from Supabase
    let corpus: string[] = FALLBACK_CORPUS;
    try {
      const { data: corpusData } = await supabase
        .from("plagiarism_corpus")
        .select("abstract")
        .limit(300);

      if (corpusData && corpusData.length > 0) {
        const dbCorpus = corpusData
          .map((row: { abstract: string }) => tokenize(row.abstract))
          .flat();
        corpus = [...FALLBACK_CORPUS, ...dbCorpus];
      }
    } catch {
      // silently use fallback corpus
    }

    // Score each chunk against corpus
    const matchResults: z.infer<typeof PlagiarismMatchSchema>[] = [];
    let totalSimilarityScore = 0;

    for (const chunk of chunks) {
      let bestScore = 0;
      let bestMatch = "";

      for (const corpusEntry of corpus) {
        const sim = jaccardSimilarity(chunk, corpusEntry);
        if (sim > bestScore) {
          bestScore = sim;
          bestMatch = corpusEntry;
        }
      }

      if (bestScore > 0.3) {
        matchResults.push({
          sentence: chunk.slice(0, 120) + (chunk.length > 120 ? "..." : ""),
          similarity: Math.round(bestScore * 100),
          matchedSource: bestMatch.slice(0, 80) + "...",
        });
        totalSimilarityScore += bestScore;
      }
    }

    // Aggregate overall score
    const rawScore =
      chunks.length > 0
        ? Math.round((totalSimilarityScore / chunks.length) * 100)
        : 0;
    const score = Math.min(rawScore, 98); // cap at 98

    const status: PlagiarismResult["status"] =
      score > 50 ? "HIGH_RISK" : score > 15 ? "WARNING" : "CLEAR";

    // Save to database (non-blocking)
    supabase
      .from("plagiarism_checks")
      .insert({
        text_length: text.length,
        plagiarism_score: score,
        status,
        captured_email: email || null,
        match_count: matchResults.length,
      })
      .then(({ error }) => {
        if (error) console.error("[Plagiarism DB Log Error]", error.message);
      });

    const result: PlagiarismResult = {
      score,
      status,
      wordCount,
      sentenceCount: chunks.length,
      matches: matchResults.slice(0, 10), // top 10 matches
      checkedAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, data: result });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[Plagiarism Route Error]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
