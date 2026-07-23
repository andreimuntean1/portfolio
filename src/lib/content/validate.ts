import type { ProjectFrontmatter } from './schema';

const MUST_MATCH = ['tier', 'status', 'year', 'featured', 'entryNo'] as const;

function sameJSON(a: unknown, b: unknown): boolean {
   return JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
}

/**
 * Check that the structural fields of a project's EN and RO frontmatter agree.
 *
 * @param slug - project folder name, used in error messages
 * @param en - parsed EN frontmatter
 * @param ro - parsed RO frontmatter
 * @return error messages; empty when the pair is consistent
 */
export function validateProjectPair(
   slug: string,
   en: ProjectFrontmatter,
   ro: ProjectFrontmatter,
): string[] {
   const errors: string[] = [];

   for (const field of MUST_MATCH) {
      if (!sameJSON(en[field], ro[field])) {
         errors.push(`${slug}: "${field}" differs between en and ro`);
      }
   }

   if (!sameJSON(en.links, ro.links)) {
      errors.push(`${slug}: "links" differ between en and ro`);
   }

   const enValues = (en.metrics ?? []).map((m) => {
         return m.value;
      }),
      roValues = (ro.metrics ?? []).map((m) => {
         return m.value;
      });

   if (!sameJSON(enValues, roValues)) {
      errors.push(`${slug}: metric values differ between en and ro (labels may differ)`);
   }

   return errors;
}

/**
 * Validate the whole registry: locale completeness, pair consistency, and
 * uniqueness of entryNo/featured across projects.
 *
 * @param pairs - map of slug to the frontmatter found per locale
 * @return error messages; empty when the registry is publishable
 */
export function validateRegistry(
   pairs: Record<string, { en?: ProjectFrontmatter; ro?: ProjectFrontmatter }>,
): string[] {
   const errors: string[] = [];
   const seenEntryNos = new Map<number, string>(),
      seenFeatured = new Map<number, string>();

   for (const [slug, pair] of Object.entries(pairs)) {
      if (!pair.en) {
         errors.push(`${slug}: missing en.mdx (EN is the source of truth)`);
         continue;
      }

      if (!pair.ro) {
         if (pair.en.draft !== true) {
            errors.push(`${slug}: missing ro.mdx (only draft projects may be EN-only)`);
         }
         continue;
      }

      errors.push(...validateProjectPair(slug, pair.en, pair.ro));

      if (pair.en.entryNo !== undefined) {
         const holder = seenEntryNos.get(pair.en.entryNo);

         if (holder) {
            errors.push(`${slug}: entryNo ${pair.en.entryNo} already used by ${holder}`);
         }
         seenEntryNos.set(pair.en.entryNo, slug);
      }

      if (pair.en.featured !== undefined) {
         const holder = seenFeatured.get(pair.en.featured);

         if (holder) {
            errors.push(`${slug}: featured ${pair.en.featured} already used by ${holder}`);
         }
         seenFeatured.set(pair.en.featured, slug);
      }
   }

   return errors;
}
