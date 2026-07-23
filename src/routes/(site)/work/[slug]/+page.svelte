<script lang="ts">
   import { localizeHref } from '$lib/paraglide/runtime';
   import { reactiveLocale, resolvedHref } from '$lib/i18n';
   import * as m from '$lib/paraglide/messages';
   import Metrics from '$lib/components/mdx/Metrics.svelte';
   import Quote from '$lib/components/mdx/Quote.svelte';
   import Stamp from '$lib/components/mdx/Stamp.svelte';
   import type { PageData } from './$types';

   let { data }: { data: PageData } = $props();

   // `reactiveLocale()` (see `$lib/i18n.ts`) rather than `currentLocale()` —
   // keeps the status chip and contact CTA correct after a client-side
   // language switch, matching the pattern established by `ProjectCard.svelte`.
   const locale = $derived(reactiveLocale());

   // Status labels keyed by the frontmatter `status` union — mirrors
   // `ProjectCard.svelte`'s exhaustive lookup.
   const STATUS_MESSAGE = {
      shipped: m.status_shipped,
      'in-workshop': m.status_in_workshop,
      retired: m.status_retired,
   } as const;

   const statusLabel = $derived(STATUS_MESSAGE[data.project.status]({}, { locale }));

   const contactHref = $derived(resolvedHref(localizeHref('/contact', { locale })));
</script>

<article class="case-study">
   <header class="case-study__header">
      {#if data.project.client}
         <p class="case-study__client">{data.project.client}</p>
      {/if}
      <h1 class="case-study__title" style:view-transition-name={'title-' + data.project.slug}>
         {data.project.title}
      </h1>
      <p class="case-study__summary">{data.project.summary}</p>
      <div class="case-study__meta">
         <span class="case-study__year">{data.project.year}</span>
         <span class="case-study__role">{data.project.role}</span>
         <ul class="case-study__stack">
            {#each data.project.stack as tech (tech)}
               <li class="case-study__stack-tag">{tech}</li>
            {/each}
         </ul>
         {#if data.project.timeline}
            <span class="case-study__timeline">{data.project.timeline}</span>
         {/if}
         <span class="case-study__status case-study__status--{data.project.status}">
            {statusLabel}
         </span>
      </div>
      {#if data.project.links.demo || data.project.links.github || data.project.links.figma}
         <ul class="case-study__links">
            {#if data.project.links.demo}
               <li>
                  <a
                     class="case-study__link"
                     href={data.project.links.demo}
                     target="_blank"
                     rel="noopener noreferrer external"
                  >
                     Demo
                  </a>
               </li>
            {/if}
            {#if data.project.links.github}
               <li>
                  <a
                     class="case-study__link"
                     href={data.project.links.github}
                     target="_blank"
                     rel="noopener noreferrer external"
                  >
                     GitHub
                  </a>
               </li>
            {/if}
            {#if data.project.links.figma}
               <li>
                  <a
                     class="case-study__link"
                     href={data.project.links.figma}
                     target="_blank"
                     rel="noopener noreferrer external"
                  >
                     Figma
                  </a>
               </li>
            {/if}
         </ul>
      {/if}
   </header>

   {#if data.project.metrics}
      <Metrics items={data.project.metrics} />
   {/if}

   <div class="case-study__body">
      {#if data.body}
         {@const Body = data.body}
         <Body slug={data.project.slug} />
      {/if}
   </div>

   {#if data.project.quote}
      <Quote
         text={data.project.quote.text}
         author={data.project.quote.author}
         role={data.project.quote.role}
      />
   {/if}

   <footer class="case-study__footer">
      <Stamp />
      <a class="cta cta--primary" href={contactHref}>{m.cta_get_in_touch({}, { locale })}</a>
   </footer>
</article>
