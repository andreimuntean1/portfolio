<script lang="ts">
   import { localizeHref } from '$lib/paraglide/runtime';
   import { reactiveLocale, resolvedHref } from '$lib/i18n';
   import * as m from '$lib/paraglide/messages';
   import type { ProjectMeta } from '$lib/content/projects';
   import { reveal } from '$lib/motion/reveal';
   import Metrics from './mdx/Metrics.svelte';

   let {
      project,
      variant,
      headingLevel = 3,
   }: { project: ProjectMeta; variant: 'flagship' | 'entry'; headingLevel?: 2 | 3 } = $props();

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

   // `variant="flagship"` is used directly under a page's own `<h1>` on
   // `/work` (no intervening `<h2>`) and under an `<h2>` "featured" section
   // on `/`, so the card title's own level can't be a fixed `<h3>` in both
   // places without breaking heading order (axe `heading-order`, WCAG 1.3.1)
   // — `headingLevel` lets each call site supply the correct one.
   const titleTag = $derived(`h${headingLevel}` as const);
</script>

{#snippet ledgerRow()}
   <div class="card__ledger-row">
      {#if project.entryNo !== undefined}
         <span class="card__ledger" aria-hidden="true"
            >№ {String(project.entryNo).padStart(3, '0')}</span
         >
      {/if}
      <span class="card__status card__status--{project.status}">
         <span class="card__status-dot" aria-hidden="true"></span>
         {statusLabel}
      </span>
   </div>
{/snippet}

{#snippet stack()}
   <ul class="card__stack">
      {#each project.stack as tech (tech)}
         <li class="card__stack-tag">{tech}</li>
      {/each}
   </ul>
{/snippet}

{#if variant === 'flagship' && project.tier === 'flagship'}
   <a class="card card--flagship" href={caseStudyHref} use:reveal>
      {@render ledgerRow()}
      <svelte:element
         this={titleTag}
         class="card__title"
         style:view-transition-name={'title-' + project.slug}
      >
         {project.title}
      </svelte:element>
      <p class="card__summary">{project.summary}</p>
      {#if project.metrics}
         <Metrics items={project.metrics} />
      {/if}
      <div class="card__footer">
         {@render stack()}
         <span class="card__case-study-link">{m.card_case_study({}, { locale })}</span>
      </div>
   </a>
{:else}
   <article class="card card--entry card--{project.status}" use:reveal>
      {@render ledgerRow()}
      <div class="card__heading-row">
         <h3 class="card__title">{project.title}</h3>
         <p class="card__year">{project.year}</p>
      </div>
      <p class="card__summary">{project.summary}</p>
      <div class="card__footer">
         {@render stack()}
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
                        demo ↗
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
                        github ↗
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
                        figma ↗
                     </a>
                  </li>
               {/if}
            </ul>
         {:else}
            <span class="card__no-link">{m.card_no_link_yet({}, { locale })}</span>
         {/if}
      </div>
   </article>
{/if}
