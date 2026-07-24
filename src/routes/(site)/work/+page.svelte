<script lang="ts">
   import { localizeHref } from '$lib/paraglide/runtime';
   import { reactiveLocale, resolvedHref } from '$lib/i18n';
   import * as m from '$lib/paraglide/messages';
   import ProjectCard from '$lib/components/ProjectCard.svelte';
   import SectionHeader from '$lib/components/SectionHeader.svelte';
   import Seo from '$lib/seo/Seo.svelte';
   import { reveal } from '$lib/motion/reveal';
   import type { PageData } from './$types';

   let { data }: { data: PageData } = $props();

   // `reactiveLocale()` (see `$lib/i18n.ts`) rather than `currentLocale()` —
   // keeps every message below correct after a client-side language switch,
   // matching the pattern established by `SiteNav.svelte`/`+page.svelte` (`/`).
   const locale = $derived(reactiveLocale());

   const contactHref = $derived(resolvedHref(localizeHref('/contact', { locale })));

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

<header class="work-header page__header">
   <p class="page__eyebrow hero__eyebrow--ink" use:reveal>
      <span class="page__eyebrow-rule" aria-hidden="true"></span>
      {m.work_eyebrow({}, { locale })}
   </p>
   <h1 class="page__heading hero__headline--ink" use:reveal>{m.nav_work({}, { locale })}</h1>
   <p class="page__intro">{m.work_intro({}, { locale })}</p>
</header>

<section class="work-flagships" aria-labelledby="work-flagships-heading">
   <SectionHeader
      num="01"
      label={m.work_section_flagships({}, { locale })}
      id="work-flagships-heading"
      meta={m.work_section_flagships_meta({}, { locale })}
   />
   <div class="work-flagships__grid">
      {#each data.flagships as project (project.slug)}
         <ProjectCard {project} variant="flagship" />
      {/each}
   </div>
</section>

<section class="work-entries" aria-labelledby="work-entries-heading">
   <SectionHeader
      num="02"
      label={m.work_section_rest({}, { locale })}
      id="work-entries-heading"
      meta={m.work_section_rest_meta({}, { locale })}
   />
   <div class="work-entries__grid">
      {#each data.entries as project (project.slug)}
         <ProjectCard {project} variant="entry" />
      {/each}
   </div>
   <div class="work-ledger-note">
      <p class="work-ledger-note__text">
         <span class="work-ledger-note__prefix">n.b. —</span>
         {m.work_ledger_note({}, { locale })}
      </p>
      <a class="work-ledger-note__link" href={contactHref}>{m.work_add_yours({}, { locale })}</a>
   </div>
</section>
