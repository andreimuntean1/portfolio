import { projectFrontmatterSchema, type ProjectFrontmatter } from './schema';
import { validateRegistry } from './validate';

export type Locale = 'en' | 'ro';
export type ProjectMeta = ProjectFrontmatter & { slug: string };

const metadataModules = import.meta.glob(
   ['/content/projects/*/en.mdx', '/content/projects/*/ro.mdx'],
   { eager: true, import: 'metadata' },
) as Record<string, unknown>;

const bodyModules = import.meta.glob('/content/projects/*/*.mdx');

function buildRegistry(): Record<Locale, ProjectMeta[]> {
   const pairs: Record<string, { en?: ProjectFrontmatter; ro?: ProjectFrontmatter }> = {};

   for (const [path, metadata] of Object.entries(metadataModules)) {
      const match = path.match(/\/content\/projects\/([^/]+)\/(en|ro)\.mdx$/);

      if (!match) {
         throw new Error(`Unexpected content path: ${path}`);
      }

      const [, slug, locale] = match;
      const parsed = projectFrontmatterSchema.safeParse(metadata);

      if (!parsed.success) {
         throw new Error(`Invalid frontmatter in ${path}:\n${parsed.error.message}`);
      }

      pairs[slug] = pairs[slug] ?? {};
      pairs[slug][locale as Locale] = parsed.data;
   }

   const errors = validateRegistry(pairs);

   if (errors.length > 0) {
      throw new Error(`Content registry invalid:\n - ${errors.join('\n - ')}`);
   }

   const byLocale: Record<Locale, ProjectMeta[]> = { en: [], ro: [] };

   for (const [slug, pair] of Object.entries(pairs)) {
      if (pair.en?.draft === true) {
         continue;
      }
      byLocale.en.push({ ...(pair.en as ProjectFrontmatter), slug });
      byLocale.ro.push({ ...(pair.ro as ProjectFrontmatter), slug });
   }

   for (const locale of ['en', 'ro'] as const) {
      byLocale[locale].sort((a, b) => {
         return (a.entryNo ?? 999) - (b.entryNo ?? 999);
      });
   }

   return byLocale;
}

const REGISTRY = buildRegistry();

export function getAllProjects(locale: Locale): ProjectMeta[] {
   return REGISTRY[locale];
}

export function getFlagships(locale: Locale): ProjectMeta[] {
   return REGISTRY[locale].filter((p) => {
      return p.tier === 'flagship';
   });
}

export function getEntries(locale: Locale): ProjectMeta[] {
   return REGISTRY[locale].filter((p) => {
      return p.tier === 'entry';
   });
}

export function getFeatured(locale: Locale): ProjectMeta[] {
   return REGISTRY[locale]
      .filter((p) => {
         return p.featured !== undefined;
      })
      .sort((a, b) => {
         return (a.featured ?? 0) - (b.featured ?? 0);
      });
}

export function getProject(locale: Locale, slug: string): ProjectMeta | undefined {
   return REGISTRY[locale].find((p) => {
      return p.slug === slug;
   });
}

export function getFlagshipSlugs(): string[] {
   return getFlagships('en').map((p) => {
      return p.slug;
   });
}

export async function loadProjectBody(
   locale: Locale,
   slug: string,
): Promise<import('svelte').Component> {
   const key = `/content/projects/${slug}/${locale}.mdx`;
   const loader = bodyModules[key];

   if (!loader) {
      throw new Error(`No case-study body at ${key}`);
   }

   const module = (await loader()) as { default: import('svelte').Component };

   return module.default;
}
