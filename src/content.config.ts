import { defineCollection, z } from "astro:content";

const insights = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    readTime: z.string(),
    order: z.number(),
    image: z.string()
  })
});

export const collections = { insights };
