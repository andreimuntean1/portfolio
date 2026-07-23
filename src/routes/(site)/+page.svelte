<script lang="ts">
   import { localizeHref } from '$lib/paraglide/runtime';
   import { reactiveLocale, resolvedHref } from '$lib/i18n';
   import * as m from '$lib/paraglide/messages';
   import Availability from '$lib/components/Availability.svelte';
   import ProjectCard from '$lib/components/ProjectCard.svelte';
   import Quote from '$lib/components/mdx/Quote.svelte';
   import type { PageData } from './$types';

   let { data }: { data: PageData } = $props();

   // `reactiveLocale()` (see `$lib/i18n.ts`) rather than `currentLocale()` —
   // keeps every message/href below correct after a client-side language
   // switch, matching the pattern established by `SiteNav.svelte`.
   const locale = $derived(reactiveLocale());

   // No featured project has a seeded `quote` yet (see task report), so this
   // is currently always empty and the trust band renders nothing — the
   // conditional below is the correct behavior for that state, not a bug.
   const quotedProjects = $derived(
      data.featured.filter((project) => {
         return project.quote !== undefined;
      }),
   );
</script>

<section class="hero">
   <p class="hero__eyebrow">{m.home_eyebrow({}, { locale })}</p>
   <h1 class="hero__headline">{m.home_headline({}, { locale })}</h1>
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
</section>

<section class="featured" aria-labelledby="featured-heading">
   <h2 class="featured__heading" id="featured-heading">
      {m.work_flagships_heading({}, { locale })}
   </h2>
   <div class="featured__grid">
      {#each data.featured as project (project.slug)}
         <ProjectCard {project} variant="flagship" />
      {/each}
   </div>
</section>

<section class="process-strip" aria-labelledby="process-heading">
   <h2 class="process-strip__heading" id="process-heading">
      <a href={resolvedHref(localizeHref('/process', { locale }))}>
         {m.nav_process({}, { locale })}
      </a>
   </h2>
   <ol class="process-strip__list">
      <li class="process-strip__step">{m.home_step_1({}, { locale })}</li>
      <li class="process-strip__step">{m.home_step_2({}, { locale })}</li>
      <li class="process-strip__step">{m.home_step_3({}, { locale })}</li>
   </ol>
</section>

{#if quotedProjects.length > 0}
   <div class="trust-band">
      {#each quotedProjects as project (project.slug)}
         {#if project.quote}
            <Quote
               text={project.quote.text}
               author={project.quote.author}
               role={project.quote.role}
            />
         {/if}
      {/each}
   </div>
{/if}

<section class="contact-teaser">
   <Availability />
   <a class="cta cta--primary" href={resolvedHref(localizeHref('/contact', { locale }))}>
      {m.cta_get_in_touch({}, { locale })}
   </a>
</section>
