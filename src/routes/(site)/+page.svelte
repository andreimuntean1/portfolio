<script lang="ts">
   import { localizeHref } from '$lib/paraglide/runtime';
   import { reactiveLocale, resolvedHref } from '$lib/i18n';
   import * as m from '$lib/paraglide/messages';
   import Availability from '$lib/components/Availability.svelte';
   import ProjectCard from '$lib/components/ProjectCard.svelte';
   import SectionHeader from '$lib/components/SectionHeader.svelte';
   import Quote from '$lib/components/mdx/Quote.svelte';
   import Seo from '$lib/seo/Seo.svelte';
   import { jsonLdPerson } from '$lib/seo/meta';
   import { reveal } from '$lib/motion/reveal';
   import roundelMarkup from '$lib/assets/marks/roundel.svg?raw';
   import type { PageData } from './$types';

   let { data }: { data: PageData } = $props();

   // `reactiveLocale()` (see `$lib/i18n.ts`) rather than `currentLocale()` —
   // keeps every message/href below correct after a client-side language
   // switch, matching the pattern established by `SiteNav.svelte`.
   const locale = $derived(reactiveLocale());

   type ProcessStep = { title: string; body: string };

   const processSteps: ProcessStep[] = $derived([
      {
         title: m.home_process_step1_title({}, { locale }),
         body: m.home_process_step1_body({}, { locale }),
      },
      {
         title: m.home_process_step2_title({}, { locale }),
         body: m.home_process_step2_body({}, { locale }),
      },
      {
         title: m.home_process_step3_title({}, { locale }),
         body: m.home_process_step3_body({}, { locale }),
      },
      {
         title: m.home_process_step4_title({}, { locale }),
         body: m.home_process_step4_body({}, { locale }),
      },
   ]);

   const quote2Author = $derived(
      `${m.home_quote2_author({}, { locale })} ${m.home_quote2_illustrative({}, { locale })}`,
   );
</script>

<Seo description={m.home_support({}, { locale })} pageId="home" jsonLd={[jsonLdPerson()]} />

<section class="hero">
   <div class="hero__inner">
      <p class="hero__eyebrow hero__eyebrow--ink" use:reveal>
         <span class="hero__eyebrow-rule" aria-hidden="true"></span>
         {m.home_eyebrow({}, { locale })}
      </p>
      <h1 class="hero__headline hero__headline--ink" use:reveal>
         {m.home_headline_a({}, { locale })}
         <span class="hero__headline-accent">{m.home_headline_b({}, { locale })}</span>
      </h1>
      <p class="hero__support">{m.home_support({}, { locale })}</p>
      <Availability />
      <div class="hero__actions">
         <a class="cta cta--primary" href={resolvedHref(localizeHref('/contact', { locale }))}>
            {m.cta_get_in_touch({}, { locale })}
         </a>
         <a class="cta cta--secondary" href={resolvedHref(localizeHref('/work', { locale }))}>
            {m.cta_see_work({}, { locale })}
         </a>
      </div>
   </div>
</section>

<section class="featured" aria-labelledby="featured-heading" use:reveal>
   <SectionHeader
      num="01"
      label={m.home_section_work({}, { locale })}
      id="featured-heading"
      href={resolvedHref(localizeHref('/work', { locale }))}
      linkLabel={m.work_see_ledger({}, { locale })}
   />
   <div class="featured__grid">
      {#each data.featured as project (project.slug)}
         <ProjectCard {project} variant="flagship" headingLevel={3} />
      {/each}
   </div>
</section>

<section class="home-process" aria-labelledby="process-heading" use:reveal>
   <SectionHeader
      num="02"
      label={m.home_section_process({}, { locale })}
      id="process-heading"
      href={resolvedHref(localizeHref('/process', { locale }))}
      linkLabel={m.process_see_all({}, { locale })}
   />
   <ol class="home-process__grid">
      {#each processSteps as step, i (step.title)}
         <li class="home-process__step">
            <p class="home-process__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</p>
            <h3 class="home-process__title">{step.title}</h3>
            <p class="home-process__body">{step.body}</p>
         </li>
      {/each}
   </ol>
</section>

<section class="trust-band" aria-labelledby="words-heading" use:reveal>
   <SectionHeader num="03" label={m.home_section_words({}, { locale })} id="words-heading" />
   <div class="trust-band__grid">
      <Quote
         text={m.home_quote1_text({}, { locale })}
         author={m.home_quote1_author({}, { locale })}
      />
      <Quote text={m.home_quote2_text({}, { locale })} author={quote2Author} />
   </div>
</section>

<section class="contact-teaser" use:reveal>
   <div class="contact-teaser__body">
      <Availability />
      <h2 class="contact-teaser__heading">{m.home_contact_heading({}, { locale })}</h2>
      <p class="contact-teaser__support">{m.home_contact_body({}, { locale })}</p>
      <div class="contact-teaser__actions">
         <a class="cta cta--primary" href={resolvedHref(localizeHref('/contact', { locale }))}>
            {m.cta_get_in_touch({}, { locale })}
         </a>
         <a class="cta cta--secondary" href={resolvedHref(localizeHref('/process', { locale }))}>
            {m.cta_how_i_work({}, { locale })}
         </a>
      </div>
   </div>
   <!-- eslint-disable-next-line svelte/no-at-html-tags -- trusted local asset -->
   <span class="contact-teaser__mark" aria-hidden="true">{@html roundelMarkup}</span>
</section>
