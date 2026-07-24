<script lang="ts">
   import { localizeHref } from '$lib/paraglide/runtime';
   import { reactiveLocale, resolvedHref } from '$lib/i18n';
   import * as m from '$lib/paraglide/messages';
   import Metrics from '$lib/components/mdx/Metrics.svelte';
   import Quote from '$lib/components/mdx/Quote.svelte';
   import Stamp from '$lib/components/mdx/Stamp.svelte';
   import Seo from '$lib/seo/Seo.svelte';
   import { canonicalUrl, jsonLdBreadcrumbs, jsonLdCreativeWork } from '$lib/seo/meta';
   import { reveal } from '$lib/motion/reveal';
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

   // "Home"/"Work" breadcrumb labels: `nav_work` already exists as a
   // paraglide message and is reused here, but there's no visible-UI "Home"
   // label anywhere in the nav (SPEC never surfaces one), so introducing a
   // paraglide message just for this machine-readable JSON-LD field would be
   // scope creep — a plain locale-keyed literal instead, same `{ en, ro }`
   // shape `SiteConfig` uses for bilingual strings outside paraglide.
   const HOME_LABEL = { en: 'Home', ro: 'Acasă' } as const;

   const caseStudyUrl = $derived(
      canonicalUrl(localizeHref(`/work/${data.project.slug}`, { locale })),
   );

   const breadcrumbs = $derived(
      jsonLdBreadcrumbs([
         { name: HOME_LABEL[locale], url: canonicalUrl(localizeHref('/', { locale })) },
         { name: m.nav_work({}, { locale }), url: canonicalUrl(localizeHref('/work', { locale })) },
         { name: data.project.title, url: caseStudyUrl },
      ]),
   );
</script>

<Seo
   title={data.project.title}
   description={data.project.summary}
   pageId={`work/${data.project.slug}`}
   jsonLd={[jsonLdCreativeWork(data.project, caseStudyUrl), breadcrumbs]}
/>

<article class="case-study">
   <header class="case-study__header" use:reveal>
      {#if data.project.entryNo !== undefined}
         <p class="case-study__eyebrow hero__eyebrow--ink" use:reveal>
            <span class="case-study__eyebrow-rule" aria-hidden="true"></span>
            {m.case_eyebrow({ num: String(data.project.entryNo).padStart(3, '0') }, { locale })}
         </p>
      {/if}
      <h1 class="case-study__title" style:view-transition-name={'title-' + data.project.slug}>
         {data.project.title}
      </h1>
      <p class="case-study__summary">{data.project.summary}</p>

      <div class="case-study__meta">
         {#if data.project.client}
            <div class="case-study__meta-cell">
               <span class="case-study__meta-label">{m.case_client({}, { locale })}</span>
               <span class="case-study__meta-value">{data.project.client}</span>
            </div>
         {/if}
         <div class="case-study__meta-cell">
            <span class="case-study__meta-label">{m.case_year({}, { locale })}</span>
            <span class="case-study__meta-value">{data.project.year}</span>
         </div>
         <div class="case-study__meta-cell">
            <span class="case-study__meta-label">{m.case_role({}, { locale })}</span>
            <span class="case-study__meta-value">{data.project.role}</span>
         </div>
         {#if data.project.timeline}
            <div class="case-study__meta-cell">
               <span class="case-study__meta-label">{m.case_timeline({}, { locale })}</span>
               <span class="case-study__meta-value">{data.project.timeline}</span>
            </div>
         {/if}
         <div class="case-study__meta-cell">
            <span class="case-study__meta-label">{m.case_status({}, { locale })}</span>
            <span class="case-study__status case-study__status--{data.project.status}">
               <span class="case-study__status-dot" aria-hidden="true"></span>
               {statusLabel}
            </span>
         </div>
         {#if data.project.links.demo || data.project.links.github || data.project.links.figma}
            <div class="case-study__meta-cell">
               <span class="case-study__meta-label">{m.case_links({}, { locale })}</span>
               <ul class="case-study__links">
                  {#if data.project.links.demo}
                     <li>
                        <a
                           class="case-study__link"
                           href={data.project.links.demo}
                           target="_blank"
                           rel="noopener noreferrer external"
                        >
                           {m.case_link_demo({}, { locale })}
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
            </div>
         {/if}
      </div>
      <div class="case-study__stack-row">
         <span class="case-study__stack-label">{m.case_stack({}, { locale })}</span>
         {#each data.project.stack as tech (tech)}
            <span class="case-study__stack-tag">{tech}</span>
         {/each}
      </div>
   </header>

   {#if data.project.metrics}
      <Metrics items={data.project.metrics} />
   {/if}

   <div class="case-study__body" use:reveal>
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

   <footer class="case-study__footer" use:reveal>
      <Stamp />
      <a class="cta cta--primary" href={contactHref}>{m.cta_get_in_touch({}, { locale })}</a>
   </footer>
</article>
