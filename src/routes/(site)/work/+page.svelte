<script lang="ts">
   import { reactiveLocale } from '$lib/i18n';
   import * as m from '$lib/paraglide/messages';
   import ProjectCard from '$lib/components/ProjectCard.svelte';
   import Seo from '$lib/seo/Seo.svelte';
   import type { PageData } from './$types';

   let { data }: { data: PageData } = $props();

   // `reactiveLocale()` (see `$lib/i18n.ts`) rather than `currentLocale()` —
   // keeps every message below correct after a client-side language switch,
   // matching the pattern established by `SiteNav.svelte`/`+page.svelte` (`/`).
   const locale = $derived(reactiveLocale());

   // No MDX frontmatter backs this index page (unlike process/about/colophon),
   // so its meta description is a plain locale-keyed literal here — same
   // `{ en, ro }` shape `SiteConfig` (`$lib/content/site`) uses for bilingual
   // strings that aren't routed through paraglide messages.
   const DESCRIPTION = {
      en: 'Flagship case studies and shorter engagements — the stack, the role and the outcome for each project.',
      ro: 'Studii de caz principale și proiecte mai mici — tehnologiile, rolul și rezultatul pentru fiecare.',
   } as const;
</script>

<Seo title={m.nav_work({}, { locale })} description={DESCRIPTION[locale]} pageId="work" />

<section class="work-flagships" aria-labelledby="work-flagships-heading">
   <h1 class="work-flagships__heading" id="work-flagships-heading">
      {m.work_flagships_heading({}, { locale })}
   </h1>
   <div class="work-flagships__grid">
      {#each data.flagships as project (project.slug)}
         <ProjectCard {project} variant="flagship" headingLevel={2} />
      {/each}
   </div>
</section>

<section class="work-entries" aria-labelledby="work-entries-heading">
   <h2 class="work-entries__heading" id="work-entries-heading">
      {m.work_entries_heading({}, { locale })}
   </h2>
   <div class="work-entries__grid">
      {#each data.entries as project (project.slug)}
         <ProjectCard {project} variant="entry" />
      {/each}
   </div>
</section>
