<script lang="ts">
   import { localizeHref } from '$lib/paraglide/runtime';
   import { reactiveLocale, resolvedHref } from '$lib/i18n';
   import * as m from '$lib/paraglide/messages';
   import type { ProjectMeta } from '$lib/content/projects';
   import Metrics from './mdx/Metrics.svelte';

   let { project, variant }: { project: ProjectMeta; variant: 'flagship' | 'entry' } = $props();

   // `reactiveLocale()` (see `$lib/i18n.ts`) rather than `currentLocale()` —
   // keeps card copy correct after a client-side language switch, matching
   // the pattern established by `SiteNav.svelte`/`Availability.svelte`.
   const locale = $derived(reactiveLocale());

   // Status labels keyed by the frontmatter `status` union — `satisfies`
   // (implicit via the object literal's key set matching `ProjectMeta['status']`
   // exactly) keeps this exhaustive without a switch statement.
   const STATUS_MESSAGE = {
      shipped: m.status_shipped,
      'in-workshop': m.status_in_workshop,
      retired: m.status_retired,
   } as const;

   const statusLabel = $derived(STATUS_MESSAGE[project.status]({}, { locale }));

   const caseStudyHref = $derived(resolvedHref(localizeHref(`/work/${project.slug}`, { locale })));
</script>

{#snippet stack()}
   <ul class="card__stack">
      {#each project.stack as tech (tech)}
         <li class="card__stack-tag">{tech}</li>
      {/each}
   </ul>
{/snippet}

{#if variant === 'flagship' && project.tier === 'flagship'}
   <a class="card card--flagship" href={caseStudyHref}>
      <h3 class="card__title" style:view-transition-name={'title-' + project.slug}>
         {project.title}
      </h3>
      <p class="card__summary">{project.summary}</p>
      {#if project.metrics}
         <Metrics items={project.metrics} />
      {/if}
      {@render stack()}
      <span class="card__status card__status--{project.status}">{statusLabel}</span>
   </a>
{:else}
   <article class="card card--entry">
      {#if project.entryNo !== undefined}
         <p class="card__ledger">№ {String(project.entryNo).padStart(3, '0')}</p>
      {/if}
      <h3 class="card__title">{project.title}</h3>
      <p class="card__year">{project.year}</p>
      <p class="card__summary">{project.summary}</p>
      {@render stack()}
      {#if project.status !== 'shipped'}
         <span class="card__status card__status--{project.status}">{statusLabel}</span>
      {/if}
      {#if project.links.demo || project.links.github || project.links.figma}
         <ul class="card__links">
            {#if project.links.demo}
               <li>
                  <a
                     class="card__link"
                     href={project.links.demo}
                     target="_blank"
                     rel="noopener noreferrer external"
                  >
                     Demo
                  </a>
               </li>
            {/if}
            {#if project.links.github}
               <li>
                  <a
                     class="card__link"
                     href={project.links.github}
                     target="_blank"
                     rel="noopener noreferrer external"
                  >
                     GitHub
                  </a>
               </li>
            {/if}
            {#if project.links.figma}
               <li>
                  <a
                     class="card__link"
                     href={project.links.figma}
                     target="_blank"
                     rel="noopener noreferrer external"
                  >
                     Figma
                  </a>
               </li>
            {/if}
         </ul>
      {/if}
   </article>
{/if}
