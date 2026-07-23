import { error } from '@sveltejs/kit';
import { getFlagshipSlugs, getProject, loadProjectBody } from '$lib/content/projects';
import { currentLocale } from '$lib/i18n';
import type { EntryGenerator } from './$types';

export const entries: EntryGenerator = () => {
   return getFlagshipSlugs().map((slug) => {
      return { slug };
   });
};

export async function load({ params }: { params: { slug: string } }): Promise<{
   project: NonNullable<ReturnType<typeof getProject>>;
   body: import('svelte').Component;
}> {
   const locale = currentLocale(),
      project = getProject(locale, params.slug);

   if (!project || project.tier !== 'flagship') {
      error(404, 'Not part of the workshop');
   }

   return { project, body: await loadProjectBody(locale, params.slug) };
}
