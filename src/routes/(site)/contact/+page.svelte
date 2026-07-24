<script lang="ts">
   import { enhance } from '$app/forms';
   import { reactiveLocale } from '$lib/i18n';
   import { getSiteConfig } from '$lib/content/site';
   import * as m from '$lib/paraglide/messages';
   import Availability from '$lib/components/Availability.svelte';
   import Seo from '$lib/seo/Seo.svelte';
   import type { ActionData, SubmitFunction } from './$types';

   let { form }: { form: ActionData } = $props();

   // `reactiveLocale()` (see `$lib/i18n.ts`) rather than `currentLocale()` —
   // keeps every message below correct after a client-side language switch,
   // matching the pattern established by `SiteNav.svelte`.
   const locale = $derived(reactiveLocale());

   const config = getSiteConfig();
   const responseTime = $derived(config.responseTime[locale]);

   // No MDX frontmatter backs this page (unlike process/about/colophon), so
   // its meta description is a plain locale-keyed literal here — same
   // `{ en, ro }` shape `SiteConfig` uses for bilingual strings that aren't
   // routed through paraglide messages.
   const DESCRIPTION = {
      en: 'Start a conversation about a project — availability and response time listed here, plus a direct email fallback.',
      ro: 'Ia legătura despre un proiect — disponibilitatea și timpul de răspuns sunt afișate aici, plus un email de rezervă.',
   } as const;

   // Stamped once on mount, not at module load — a lightweight time-based
   // spam-defense signal alongside the honeypot below: the server action
   // (`src/lib/server/inquiry.ts`) rejects submissions where this value is
   // implausibly close to the submit timestamp (a naive bot filling and
   // submitting instantly). Deliberately `$state` + `$effect`, not `$derived`
   // (which `eslint-plugin-svelte` would otherwise prefer here): this route
   // is prerendered for its GET (`export const prerender = true` in the root
   // `+layout.ts`; the form action itself opts back out, see
   // `+page.server.ts`), so a `$derived` value would be evaluated once at
   // build time and baked into the static HTML — the same timestamp for
   // every visitor, useless as a per-visit signal. `$effect` only runs
   // client-side, after the prerendered HTML has been served and hydrated,
   // giving each real visitor their own mount-time stamp; a no-JS submission
   // simply leaves this blank, which the same server action treats as
   // suspicious too.
   // eslint-disable-next-line svelte/prefer-writable-derived -- see above
   let startedAt = $state('');

   $effect(() => {
      startedAt = String(Date.now());
   });

   let submitting = $state(false);

   const handleSubmit: SubmitFunction = () => {
      submitting = true;

      return async ({ update }) => {
         await update();
         submitting = false;
      };
   };

   // The zod schema in `inquiry.ts` reports field errors as paraglide
   // message *names* (`form_error_name`, …), not display strings, so they
   // stay localizable. This record + guard resolve one of those names to
   // the actual message function without an unsafe `m[key as any]` index —
   // the same exhaustive-lookup shape as `ProjectCard.svelte`'s
   // `STATUS_MESSAGE`, just guarded because the key here is a runtime string
   // from the server rather than a closed frontmatter union.
   const ERROR_MESSAGE = {
      form_error_name: m.form_error_name,
      form_error_email: m.form_error_email,
      form_error_message: m.form_error_message,
   } as const;

   type ErrorMessageKey = keyof typeof ERROR_MESSAGE;

   function isErrorMessageKey(key: string): key is ErrorMessageKey {
      return key in ERROR_MESSAGE;
   }

   /**
    * Resolve a field's error message key to its localized text.
    *
    * @param key - message key returned by `parseInquiry()` for a field
    * @return the localized message, or undefined if there is no error
    */
   function errorMessage(key: string | undefined): string | undefined {
      if (key === undefined || !isErrorMessageKey(key)) {
         return undefined;
      }
      return ERROR_MESSAGE[key]({}, { locale });
   }
</script>

<Seo title={m.nav_contact({}, { locale })} description={DESCRIPTION[locale]} pageId="contact" />

<article class="page">
   <h1 class="page__heading">{m.nav_contact({}, { locale })}</h1>

   {#if form?.sent}
      <div class="contact-form__success">
         <h2 class="contact-form__success-title">{m.form_success_title({}, { locale })}</h2>
         <p class="contact-form__success-body">{m.form_success_body({}, { locale })}</p>
      </div>
   {:else}
      <form class="contact-form" method="POST" use:enhance={handleSubmit}>
         <div class="contact-form__field">
            <label class="contact-form__label" for="contact-name"
               >{m.form_name({}, { locale })}</label
            >
            <input
               class="contact-form__input"
               id="contact-name"
               name="name"
               type="text"
               value={form?.values?.name ?? ''}
               required
            />
            {#if form?.errors?.name}
               <p class="contact-form__error">{errorMessage(form.errors.name)}</p>
            {/if}
         </div>

         <div class="contact-form__field">
            <label class="contact-form__label" for="contact-email">
               {m.form_email({}, { locale })}
            </label>
            <input
               class="contact-form__input"
               id="contact-email"
               name="email"
               type="email"
               value={form?.values?.email ?? ''}
               required
            />
            {#if form?.errors?.email}
               <p class="contact-form__error">{errorMessage(form.errors.email)}</p>
            {/if}
         </div>

         <div class="contact-form__field">
            <label class="contact-form__label" for="contact-message">
               {m.form_message({}, { locale })}
            </label>
            <textarea
               class="contact-form__textarea"
               id="contact-message"
               name="message"
               rows="5"
               value={form?.values?.message ?? ''}
               required></textarea>
            {#if form?.errors?.message}
               <p class="contact-form__error">{errorMessage(form.errors.message)}</p>
            {/if}
         </div>

         <!-- Honeypot: invisible by design (MOCKUP §3.6) — real visitors never
              see or fill this in, a naive bot's form-filler often does. Hidden
              from sighted users (`.visually-hidden`), skipped by keyboard
              navigation (`tabindex="-1"`), skipped by browser autofill
              (`autocomplete="off"`), and hidden from assistive tech
              (`aria-hidden`) so no real screen-reader user ever lands on it. -->
         <div class="visually-hidden" aria-hidden="true">
            <label for="contact-company">Company</label>
            <input
               id="contact-company"
               name="company"
               type="text"
               tabindex="-1"
               autocomplete="off"
            />
         </div>

         <input type="hidden" name="startedAt" value={startedAt} />

         <button
            class="cta cta--primary"
            class:cta--busy={submitting}
            type="submit"
            disabled={submitting}
         >
            {#if submitting}
               <span class="cta__spinner" aria-hidden="true"></span>
            {/if}
            {submitting ? m.form_submitting({}, { locale }) : m.form_submit({}, { locale })}
         </button>

         {#if form?.failed}
            <p class="contact-form__error">{m.form_failure_body({}, { locale })}</p>
         {/if}
      </form>
   {/if}

   <p class="contact-form__fallback">
      <a class="contact-form__fallback-link" href="mailto:{config.email}">{config.email}</a>
   </p>

   <Availability />
   <p class="contact-form__response-time">{responseTime}</p>
   <p class="contact-form__language-note">{m.contact_language_note({}, { locale })}</p>
</article>
