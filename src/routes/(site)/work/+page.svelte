<script lang="ts">
   import { reactiveLocale } from '$lib/i18n';
   import * as m from '$lib/paraglide/messages';
   import ProjectCard from '$lib/components/ProjectCard.svelte';
   import type { PageData } from './$types';

   let { data }: { data: PageData } = $props();

   // `reactiveLocale()` (see `$lib/i18n.ts`) rather than `currentLocale()` —
   // keeps every message below correct after a client-side language switch,
   // matching the pattern established by `SiteNav.svelte`/`+page.svelte` (`/`).
   const locale = $derived(reactiveLocale());
</script>

<section class="work-flagships" aria-labelledby="work-flagships-heading">
   <h1 class="work-flagships__heading" id="work-flagships-heading">
      {m.work_flagships_heading({}, { locale })}
   </h1>
   <div class="work-flagships__grid">
      {#each data.flagships as project (project.slug)}
         <ProjectCard {project} variant="flagship" />
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
