/**
 * /api/tools/citation/route.ts
 * Proxies DOI and ISBN lookups to Crossref + Open Library APIs.
 * Returns normalized CitationMetadata for client-side formatting via citation-js.
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  CrossrefResponseSchema,
  OpenLibraryBookSchema,
  CitationMetadata,
} from "@/lib/schemas/tools";

export const dynamic = "force-dynamic";

const RequestSchema = z.object({
  doi: z.string().optional(),
  isbn: z.string().optional(),
}).refine((d) => d.doi || d.isbn, {
  message: "Either 'doi' or 'isbn' must be provided.",
});

async function lookupDoi(doi: string): Promise<CitationMetadata> {
  const cleanDoi = doi.replace(/^https?:\/\/doi\.org\//i, "").trim();
  const res = await fetch(`https://api.crossref.org/works/${encodeURIComponent(cleanDoi)}`, {
    headers: {
      "User-Agent": "INFRAMEET/1.0 (mailto:admin@inframeet.com)",
      "Accept": "application/json",
    },
    next: { revalidate: 86400 }, // cache 24h
  });

  if (!res.ok) {
    throw new Error(`Crossref API returned ${res.status}: DOI not found or invalid.`);
  }

  const raw = await res.json();
  const parsed = CrossrefResponseSchema.parse(raw);
  const msg = parsed.message;

  const yearParts = msg.issued?.["date-parts"]?.[0];
  const year = yearParts?.[0] ?? undefined;

  return {
    source: "crossref",
    doi: msg.DOI,
    title: msg.title?.[0] ?? "Unknown Title",
    authors: (msg.author ?? []).map((a) => ({
      given: a.given,
      family: a.family,
      fullName: [a.given, a.family].filter(Boolean).join(" "),
    })),
    year,
    journal: msg["container-title"]?.[0],
    publisher: msg.publisher,
    volume: msg.volume,
    issue: msg.issue,
    pages: msg.page,
    url: msg.URL ?? `https://doi.org/${msg.DOI}`,
    type: msg.type,
  };
}

async function lookupIsbn(isbn: string): Promise<CitationMetadata> {
  const cleanIsbn = isbn.replace(/[-\s]/g, "");
  const bibkey = `ISBN:${cleanIsbn}`;
  const res = await fetch(
    `https://openlibrary.org/api/books?bibkeys=${encodeURIComponent(bibkey)}&format=json&jscmd=data`,
    {
      headers: { "Accept": "application/json" },
      next: { revalidate: 86400 },
    }
  );

  if (!res.ok) {
    throw new Error(`Open Library API returned ${res.status}.`);
  }

  const raw = await res.json() as Record<string, unknown>;
  const bookData = raw[bibkey];
  if (!bookData) {
    throw new Error(`ISBN ${isbn} not found in Open Library.`);
  }

  const parsed = OpenLibraryBookSchema.parse(bookData);

  // Parse year from publish_date string (e.g., "January 1, 2023" or "2023")
  const yearMatch = parsed.publish_date?.match(/\d{4}/);
  const year = yearMatch ? parseInt(yearMatch[0], 10) : undefined;

  return {
    source: "openlibrary",
    isbn: cleanIsbn,
    title: parsed.title ?? "Unknown Title",
    authors: (parsed.authors ?? []).map((a) => ({
      fullName: a.name,
    })),
    year,
    publisher: parsed.publishers?.[0]?.name,
    url: parsed.url,
    type: "book",
  };
}

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

    const { doi, isbn } = validation.data;
    let metadata: CitationMetadata;

    if (doi) {
      metadata = await lookupDoi(doi);
    } else if (isbn) {
      metadata = await lookupIsbn(isbn);
    } else {
      return NextResponse.json({ error: "No identifier provided." }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: metadata });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[Citation API Error]", message);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
