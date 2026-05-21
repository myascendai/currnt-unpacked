import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const domains = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/domains" }),
  schema: z.object({
    letter: z.string().min(1).max(3),
    title: z.string(),
    summary: z.string(),
    surface: z.enum([
      "public-web",
      "corporate",
      "treehouse",
      "mobile-api",
      "service-api",
      "mixed",
    ]),
    routePrefixes: z.array(z.string()).default([]),
    headlineFlow: z.string().optional(),
    controllerCount: z.number().optional(),
    status: z.enum(["live-at-freeze", "dormant", "deprecated"]).default("live-at-freeze"),
    order: z.number().default(99),
  }),
});

export const collections = { domains };
