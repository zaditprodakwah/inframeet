import { z } from "zod";

export const SchoolDataSchema = z.object({
  npsn: z.string().optional(),
  name: z.string().min(2, "Nama sekolah/kampus tidak valid"),
  category: z.enum(["SEKOLAH", "PERGURUAN_TINGGI"]),
  address: z.string().optional(),
  province: z.string(),
  city: z.string(),
  metadata: z.object({
    prodi: z.array(z.string()).optional(),
    akreditasi: z.string().optional(),
    jenjang: z.string().optional()
  }).default({})
});

export type SchoolData = z.infer<typeof SchoolDataSchema>;
