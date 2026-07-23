import { z } from 'zod';
import rawConfig from '/content/site/config.json';

const siteConfigSchema = z.strictObject({
   availability: z.strictObject({ en: z.string().min(1), ro: z.string().min(1) }),
   email: z.email(),
   responseTime: z.strictObject({ en: z.string().min(1), ro: z.string().min(1) }),
   socials: z.strictObject({ github: z.url(), linkedin: z.url() }),
});

export type SiteConfig = z.infer<typeof siteConfigSchema>;

const CONFIG = siteConfigSchema.parse(rawConfig);

export function getSiteConfig(): SiteConfig {
   return CONFIG;
}
