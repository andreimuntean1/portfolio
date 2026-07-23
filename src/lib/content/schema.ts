import { z } from 'zod';

export const tierSchema = z.enum(['flagship', 'entry']);
export const statusSchema = z.enum(['shipped', 'in-workshop', 'retired']);

export const linksSchema = z.strictObject({
   demo: z.url().optional(),
   github: z.url().optional(),
   figma: z.url().optional(),
});

export const metricSchema = z.strictObject({
   label: z.string().min(1),
   value: z.string().min(1),
});

export const quoteSchema = z.strictObject({
   text: z.string().min(1),
   author: z.string().min(1),
   role: z.string().min(1).optional(),
});

export const projectFrontmatterSchema = z.strictObject({
   title: z.string().min(1),
   summary: z.string().min(1),
   tier: tierSchema,
   status: statusSchema,
   year: z.number().int().gte(2020).lte(2100),
   client: z.string().min(1).optional(),
   role: z.string().min(1),
   stack: z.array(z.string().min(1)).min(1),
   links: linksSchema.default({}),
   timeline: z.string().min(1).optional(),
   metrics: z.array(metricSchema).max(3).optional(),
   quote: quoteSchema.optional(),
   featured: z.number().int().positive().optional(),
   entryNo: z.number().int().positive().optional(),
   draft: z.boolean().optional(),
});

export type ProjectFrontmatter = z.infer<typeof projectFrontmatterSchema>;
export type Tier = z.infer<typeof tierSchema>;
export type Status = z.infer<typeof statusSchema>;
