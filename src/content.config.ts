import { defineCollection, z } from "astro:content";

const insights = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    readTime: z.string(),
    order: z.number(),
    image: z.string(),
    author: z.string().default("Business Lens Advisory"),
    pillar: z.string().default("Cross-border execution"),
    publishedAt: z.string().optional(),
    updatedAt: z.string().optional(),
    videoUrl: z.string().url().optional(),
    transcriptUrl: z.string().url().optional(),
    platform: z.string().optional(),
    cta: z.string().optional(),
    sources: z.array(z.object({ name: z.string(), url: z.string().url() })).default([])
  })
});

export const collections = { insights };
