import { z } from "zod";

const blobHost = (u: string) => {
  try {
    return new URL(u).hostname.endsWith(".public.blob.vercel-storage.com");
  } catch {
    return false;
  }
};

export const createEntrySchema = z.object({
  title: z.string().trim().min(1).max(200),
  content: z.string().min(1).max(50000),
  subtitle: z.string().trim().max(300).nullable().optional(),
  category: z.string().trim().max(50).nullable().optional(),
  author: z.string().trim().max(100).nullable().optional(),
  imageUrl: z.url().max(2000).refine(blobHost, "imageUrl must be a Vercel Blob URL").nullable().optional(),
  takeaways: z.array(z.string().trim().min(1).max(500)).max(10).optional(),
  sources: z
    .array(z.object({ title: z.string().trim().min(1).max(200), url: z.url().max(2000) }))
    .max(20)
    .optional(),
  rank: z.number().int().min(0).max(100000).nullable().optional(),
});

export const updateEntrySchema = createEntrySchema
  .partial()
  .refine((d) => Object.keys(d).length > 0, {
    message: "At least one field is required",
  });

export const idSchema = z.uuid();

export const listQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});