import type { ProjectMeta } from '$lib/content/projects';
import { SITE_URL } from '$lib/seo/meta';

const HEADER = `# Andrei Muntean

Full-stack engineer working with an agentic build rig — plain language,
outcomes over adjectives, every AI-leverage claim paired with its guardrail.

- Work: ${SITE_URL}/work
- Process: ${SITE_URL}/process
- Contact: ${SITE_URL}/contact
- Resume: ${SITE_URL}/resume`;

/**
 * Builds the site's `llms.txt`: a hand-authored identity header followed by
 * a generated list of flagship case studies. English-only — this is a
 * machine-readable summary for agents/crawlers, not localized page content.
 *
 * Only flagship-tier projects get a line, since only flagships have a real
 * `/work/[slug]` case-study page to link to — an entry-tier project would
 * link to a page that 404s.
 *
 * @param flagships - flagship-tier projects, EN locale
 * @return the full `llms.txt` text
 */
export function buildLlmsTxt(flagships: ProjectMeta[]): string {
   const projectLines = flagships.map((project) => {
      return `- [${project.title}](${SITE_URL}/work/${project.slug}): ${project.summary}`;
   });

   return `${HEADER}\n\n## Projects\n\n${projectLines.join('\n')}\n`;
}
