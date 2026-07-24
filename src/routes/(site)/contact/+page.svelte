<script lang="ts">
   import { reactiveLocale } from '$lib/i18n';
   import { getSiteConfig } from '$lib/content/site';
   import * as m from '$lib/paraglide/messages';
   import Availability from '$lib/components/Availability.svelte';

   // `reactiveLocale()` (see `$lib/i18n.ts`) rather than `currentLocale()` —
   // keeps every message below correct after a client-side language switch,
   // matching the pattern established by `SiteNav.svelte`.
   const locale = $derived(reactiveLocale());

   const config = getSiteConfig();
   const responseTime = $derived(config.responseTime[locale]);

   // Stamped once on mount, not at module load — a lightweight time-based
   // spam-defense signal alongside the honeypot below: Task 14's server
   // action can reject submissions where this value is implausibly close to
   // the submit timestamp (a naive bot filling and submitting instantly).
   // Deliberately `$state` + `$effect`, not `$derived` (which `eslint-plugin-
   // svelte` would otherwise prefer here): this route is prerendered
   // (`export const prerender = true` in the root `+layout.ts`), so a
   // `$derived` value would be evaluated once at build time and baked into
   // the static HTML — the same timestamp for every visitor, useless as a
   // per-visit signal. `$effect` only runs client-side, after the prerendered
   // HTML has been served and hydrated, giving each real visitor their own
   // mount-time stamp; a no-JS submission simply leaves this blank, which the
   // same server action can treat as suspicious too.
   // eslint-disable-next-line svelte/prefer-writable-derived -- see above
   let startedAt = $state('');

   $effect(() => {
      startedAt = String(Date.now());
   });
</script>

<article class="page">
   <h1 class="page__heading">{m.nav_contact({}, { locale })}</h1>

   <!-- Static markup only — no `use:enhance`, no server action, no
        client-side validation. Task 14 wires all of that up; this task only
        builds the accessible, labeled form shape it will attach to. -->
   <form class="contact-form" method="POST">
      <div class="contact-form__field">
         <label class="contact-form__label" for="contact-name">{m.form_name({}, { locale })}</label>
         <input class="contact-form__input" id="contact-name" name="name" type="text" required />
      </div>

      <div class="contact-form__field">
         <label class="contact-form__label" for="contact-email">
            {m.form_email({}, { locale })}
         </label>
         <input class="contact-form__input" id="contact-email" name="email" type="email" required />
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
            required></textarea>
      </div>

      <!-- Honeypot: invisible by design (MOCKUP §3.6) — real visitors never
           see or fill this in, a naive bot's form-filler often does. Hidden
           from sighted users (`.visually-hidden`), skipped by keyboard
           navigation (`tabindex="-1"`), skipped by browser autofill
           (`autocomplete="off"`), and hidden from assistive tech
           (`aria-hidden`) so no real screen-reader user ever lands on it. -->
      <div class="visually-hidden" aria-hidden="true">
         <label for="contact-company">Company</label>
         <input id="contact-company" name="company" type="text" tabindex="-1" autocomplete="off" />
      </div>

      <input type="hidden" name="startedAt" value={startedAt} />

      <button class="cta cta--primary" type="submit">{m.form_submit({}, { locale })}</button>
   </form>

   <p class="contact-form__fallback">
      <a class="contact-form__fallback-link" href="mailto:{config.email}">{config.email}</a>
   </p>

   <Availability />
   <p class="contact-form__response-time">{responseTime}</p>
   <p class="contact-form__language-note">{m.contact_language_note({}, { locale })}</p>
</article>
