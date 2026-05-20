/**
 * lib/schemas/tools.ts
 * Unified Zod schemas untuk semua external API response boundaries.
 * Digunakan oleh route handlers di /api/tools/* untuk type-safe validation.
 */
import { z } from "zod";

// ─────────────────────────────────────────────
// 1. Crossref API (DOI lookup)
// https://api.crossref.org/works/{doi}
// ─────────────────────────────────────────────
export const CrossrefAuthorSchema = z.object({
  given: z.string().optional(),
  family: z.string().optional(),
  ORCID: z.string().optional(),
});

export const CrossrefWorkSchema = z.object({
  DOI: z.string(),
  title: z.array(z.string()).optional(),
  author: z.array(CrossrefAuthorSchema).optional(),
  "container-title": z.array(z.string()).optional(),
  issued: z
    .object({
      "date-parts": z.array(z.array(z.number())).optional(),
    })
    .optional(),
  volume: z.string().optional(),
  issue: z.string().optional(),
  page: z.string().optional(),
  publisher: z.string().optional(),
  URL: z.string().optional(),
  type: z.string().optional(),
  ISSN: z.array(z.string()).optional(),
  ISBN: z.array(z.string()).optional(),
});

export const CrossrefResponseSchema = z.object({
  status: z.string(),
  message: CrossrefWorkSchema,
});

export type CrossrefWork = z.infer<typeof CrossrefWorkSchema>;

// ─────────────────────────────────────────────
// 2. Open Library API (ISBN lookup)
// https://openlibrary.org/api/books?bibkeys=ISBN:{isbn}&format=json&jscmd=data
// ─────────────────────────────────────────────
export const OpenLibraryAuthorSchema = z.object({
  name: z.string(),
  url: z.string().optional(),
});

export const OpenLibraryBookSchema = z.object({
  title: z.string().optional(),
  authors: z.array(OpenLibraryAuthorSchema).optional(),
  publishers: z
    .array(z.object({ name: z.string() }))
    .optional(),
  publish_date: z.string().optional(),
  number_of_pages: z.number().optional(),
  url: z.string().optional(),
  identifiers: z
    .object({
      isbn_13: z.array(z.string()).optional(),
      isbn_10: z.array(z.string()).optional(),
    })
    .optional(),
});

export type OpenLibraryBook = z.infer<typeof OpenLibraryBookSchema>;

// Normalized citation metadata returned to the client
export const CitationMetadataSchema = z.object({
  source: z.enum(["crossref", "openlibrary", "manual"]),
  doi: z.string().optional(),
  isbn: z.string().optional(),
  title: z.string(),
  authors: z.array(
    z.object({
      given: z.string().optional(),
      family: z.string().optional(),
      fullName: z.string().optional(),
    })
  ),
  year: z.number().optional(),
  journal: z.string().optional(),
  publisher: z.string().optional(),
  volume: z.string().optional(),
  issue: z.string().optional(),
  pages: z.string().optional(),
  url: z.string().optional(),
  type: z.string().optional(),
});

export type CitationMetadata = z.infer<typeof CitationMetadataSchema>;

// ─────────────────────────────────────────────
// 3. Google PageSpeed Insights API v5
// https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed
// ─────────────────────────────────────────────
export const AuditSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  score: z.number().nullable().optional(),
  displayValue: z.string().optional(),
  scoreDisplayMode: z.string().optional(),
});

export const CategorySchema = z.object({
  score: z.number().nullable(),
  title: z.string(),
});

export const PageSpeedResponseSchema = z.object({
  id: z.string(),
  lighthouseResult: z.object({
    categories: z.object({
      performance: CategorySchema.optional(),
      accessibility: CategorySchema.optional(),
      "best-practices": CategorySchema.optional(),
      seo: CategorySchema.optional(),
    }),
    audits: z.record(z.string(), AuditSchema),
  }),
  loadingExperience: z
    .object({
      metrics: z
        .object({
          LARGEST_CONTENTFUL_PAINT_MS: z
            .object({ percentile: z.number(), category: z.string() })
            .optional(),
          INTERACTION_TO_NEXT_PAINT: z
            .object({ percentile: z.number(), category: z.string() })
            .optional(),
          CUMULATIVE_LAYOUT_SHIFT_SCORE: z
            .object({ percentile: z.number(), category: z.string() })
            .optional(),
          FIRST_INPUT_DELAY_MS: z
            .object({ percentile: z.number(), category: z.string() })
            .optional(),
        })
        .optional(),
      overall_category: z.string().optional(),
    })
    .optional(),
});

export type PageSpeedResult = z.infer<typeof PageSpeedResponseSchema>;

// Normalized output to client
export const WebVitalsResultSchema = z.object({
  url: z.string(),
  strategy: z.enum(["mobile", "desktop"]),
  performanceScore: z.number(),
  lcp: z.object({ value: z.number(), unit: z.string(), category: z.string() }).optional(),
  inp: z.object({ value: z.number(), unit: z.string(), category: z.string() }).optional(),
  cls: z.object({ value: z.number(), unit: z.string(), category: z.string() }).optional(),
  fid: z.object({ value: z.number(), unit: z.string(), category: z.string() }).optional(),
  suggestions: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string().optional(),
      score: z.number().nullable().optional(),
      displayValue: z.string().optional(),
    })
  ),
  timestamp: z.string(),
});

export type WebVitalsResult = z.infer<typeof WebVitalsResultSchema>;

// ─────────────────────────────────────────────
// 4. PDDikti API (Ministry of Education)
// https://api-frontend.kemdikbud.go.id/hit/{query}
// ─────────────────────────────────────────────
export const PddiktiItemSchema = z.object({
  id: z.string(),
  nama: z.string(),
  singkatan: z.string().nullable().optional(),
  status: z.string().optional(),
});

export const PddiktiResponseSchema = z.object({
  pt: z.array(PddiktiItemSchema).optional(),
  prodi: z.array(z.unknown()).optional(),
  mahasiswa: z.array(z.unknown()).optional(),
  dosen: z.array(z.unknown()).optional(),
});

export type PddiktiItem = z.infer<typeof PddiktiItemSchema>;

// Normalized university result
export const UniversityResultSchema = z.object({
  id: z.string(),
  npsn: z.string(),
  name: z.string(),
  category: z.string(),
  subcategory: z.string(),
  sector: z.string(),
  location: z.string(),
  accreditation: z.string(),
  citation_style: z.string(),
  turnitin_limit: z.string(),
});

export type UniversityResult = z.infer<typeof UniversityResultSchema>;

// ─────────────────────────────────────────────
// 5. Plagiarism Check Result
// ─────────────────────────────────────────────
export const PlagiarismMatchSchema = z.object({
  sentence: z.string(),
  similarity: z.number(),
  matchedSource: z.string().optional(),
});

export const PlagiarismResultSchema = z.object({
  score: z.number().min(0).max(100),
  status: z.enum(["CLEAR", "WARNING", "HIGH_RISK"]),
  wordCount: z.number(),
  sentenceCount: z.number(),
  matches: z.array(PlagiarismMatchSchema),
  checkedAt: z.string(),
});

export type PlagiarismResult = z.infer<typeof PlagiarismResultSchema>;

// ─────────────────────────────────────────────
// 6. Alerting System Payload
// ─────────────────────────────────────────────
export const AlertLevelSchema = z.enum(["INFO", "WARNING", "CRITICAL"]);

export const AlertPayloadSchema = z.object({
  level: AlertLevelSchema,
  title: z.string(),
  body: z.string(),
  auditId: z.string().optional(),
  timestamp: z.string(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type AlertLevel = z.infer<typeof AlertLevelSchema>;
export type AlertPayload = z.infer<typeof AlertPayloadSchema>;
