import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

// One Markdown file per project in src/content/projects. The filename is the URL slug.
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    category: z.enum(['apps', 'web']),
    year: z.string(),
    role: z.string(),
    stack: z.array(z.string()),
    status: z.enum(['shipped', 'in-progress', 'research']),
    statusNote: z.string().optional(),
    links: z.array(z.object({ label: z.string(), url: z.string() })).default([]),
    summary: z.string(),
    order: z.number(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects };
