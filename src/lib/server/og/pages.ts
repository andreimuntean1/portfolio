import { getFlagshipSlugs, getProject, type Locale } from '$lib/content/projects';
import * as m from '$lib/paraglide/messages';
import { pageTitle } from '$lib/seo/meta';

const LOCALES: readonly Locale[] = ['en', 'ro'];

const STATIC_PAGE_IDS = ['home', 'work', 'process', 'about', 'contact', 'colophon'] as const;

export type OgData = { title: string; summary: string };

// Mirrors the `DESCRIPTION` literal in `src/routes/(site)/work/+page.svelte` — small
// enough that duplicating it here (rather than sharing a module) is fine.
const WORK_SUMMARY: Record<Locale, string> = {
   en: 'Flagship case studies and shorter engagements — the stack, the role and the outcome for each project.',
   ro: 'Studii de caz principale și proiecte mai mici — tehnologiile, rolul și rezultatul pentru fiecare.',
};

// Mirrors the `DESCRIPTION` literal in `src/routes/(site)/contact/+page.svelte`.
const CONTACT_SUMMARY: Record<Locale, string> = {
   en: 'Start a conversation about a project — availability and response time listed here, plus a direct email fallback.',
   ro: 'Ia legătura despre un proiect — disponibilitatea și timpul de răspuns sunt afișate aici, plus un email de rezervă.',
};

// Mirrors `content/site/process.{en,ro}.mdx` frontmatter `description`. Kept as a
// hardcoded literal (not read via `loadSitePage()`) because that loader is async and
// `ogDataFor()` below is a synchronous pure lookup — keep this in sync with the MDX by
// hand if that copy ever changes.
const PROCESS_SUMMARY: Record<Locale, string> = {
   en: 'How an engagement with Andrei actually runs — discovery, proposal, build, handover.',
   ro: 'Cum arată, concret, o colaborare cu Andrei — descoperire, propunere, construcție, predare.',
};

// Mirrors `content/site/about.{en,ro}.mdx` frontmatter `description` — same caveat as
// `PROCESS_SUMMARY` above.
const ABOUT_SUMMARY: Record<Locale, string> = {
   en: 'Self-taught, based in Bucharest, five years into building software professionally.',
   ro: 'Autodidact, stabilit în București, cu cinci ani de experiență în construit software.',
};

// Mirrors `content/site/colophon.{en,ro}.mdx` frontmatter `description` — same caveat
// as `PROCESS_SUMMARY` above.
const COLOPHON_SUMMARY: Record<Locale, string> = {
   en: 'Stack, fonts, and the AI-native workflow this site was built with.',
   ro: 'Stack-ul tehnic, fonturile și modul de lucru AI-native cu care a fost construit acest site.',
};

/**
 * Lists every (locale × page) pair this site needs an OG image for: the static
 * pages plus one per flagship case study, each in both locales.
 *
 * @return one `{ page }` entry per image, exactly matching `ogImagePath()`'s URL
 *   shape (`locale/pageId.png`) — that function is the only real consumer of these
 *   prerendered files, so the two must agree on the URL or the image 404s at runtime
 */
export function ogEntries(): { page: string }[] {
   const pageIds: string[] = [
      ...STATIC_PAGE_IDS,
      ...getFlagshipSlugs().map((slug) => {
         return `work/${slug}`;
      }),
   ];

   return LOCALES.flatMap((locale) => {
      return pageIds.map((pageId) => {
         return { page: `${locale}/${pageId}.png` };
      });
   });
}

/**
 * Looks up the title and one-line summary an OG image should render for one page.
 *
 * @param page - `locale/pageId`, with or without a trailing `.png` (e.g. `en/home`,
 *   `ro/work/carheltau.png`) — the same shape `ogEntries()` produces
 * @return the page's OG title and summary, or `undefined` when `page` doesn't match
 *   any known page — an unrecognized value signals real drift (a stale link, a
 *   renamed slug), which the endpoint turns into a 404 rather than a rendered image
 */
export function ogDataFor(page: string): OgData | undefined {
   const bare = page.replace(/\.png$/, '');
   const [locale, ...rest] = bare.split('/');

   if (locale !== 'en' && locale !== 'ro') {
      return undefined;
   }

   const pageId = rest.join('/');

   if (pageId === 'home') {
      return { title: pageTitle(), summary: m.home_support({}, { locale }) };
   }

   if (pageId === 'work') {
      return { title: m.nav_work({}, { locale }), summary: WORK_SUMMARY[locale] };
   }

   if (pageId === 'process') {
      return { title: m.nav_process({}, { locale }), summary: PROCESS_SUMMARY[locale] };
   }

   if (pageId === 'about') {
      return { title: m.nav_about({}, { locale }), summary: ABOUT_SUMMARY[locale] };
   }

   if (pageId === 'contact') {
      return { title: m.nav_contact({}, { locale }), summary: CONTACT_SUMMARY[locale] };
   }

   if (pageId === 'colophon') {
      return { title: m.footer_colophon({}, { locale }), summary: COLOPHON_SUMMARY[locale] };
   }

   const slugMatch = pageId.match(/^work\/(.+)$/);
   const project = slugMatch ? getProject(locale, slugMatch[1]) : undefined;

   if (!project) {
      return undefined;
   }

   return { title: project.title, summary: project.summary };
}
