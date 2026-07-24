import roundelSvg from '$lib/assets/marks/roundel-solid.svg?raw';
import type { OgData } from './pages';

// satori can't read an on-disk file path at render time — it needs an `<img>` node
// whose `src` is already a self-contained data URI. Built once at module load and
// reused for every render.
const ROUNDEL_DATA_URI = `data:image/svg+xml;base64,${Buffer.from(roundelSvg).toString('base64')}`;

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 630;
const ROUNDEL_SIZE = 96;

// Satori's input is a React-element-like plain object tree (`{ type, props: {
// style, children } }` — see `node_modules/satori`'s README "Use without JSX"
// section), not a component. Hex literals below are allowed here per the task
// brief: satori objects aren't SCSS, so `_variables.scss`'s "tokens only" rule
// doesn't apply — each value is commented with the token it mirrors instead.

/**
 * Builds satori's object-tree representation of one page's Open Graph image:
 * umber canvas, copper eyebrow, a Basteleur title, an Apfel Grotezk summary line,
 * and the roundel mark in the bottom-right corner. One layout that reads for all
 * three content shapes this site needs (MOCKUP §3.10): the home page's long
 * two-part phrase, a case study's short title + one-line summary, and a plain
 * page's short title + short description.
 *
 * @param data - the page's OG title and one-line summary
 * @return satori's object-tree input for `satori()`
 */
export function ogTemplate(data: OgData): object {
   return {
      type: 'div',
      props: {
         style: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: `${CANVAS_WIDTH}px`,
            height: `${CANVAS_HEIGHT}px`,
            padding: '64px', // $space-8
            backgroundColor: '#1e1712', // $color-umber
            fontFamily: 'Apfel Grotezk',
         },
         children: [
            {
               type: 'div',
               props: {
                  style: {
                     display: 'flex',
                     fontFamily: 'Apfel Grotezk',
                     fontSize: '20px', // ~$font-size-body-md, scaled up for a 1200px canvas
                     fontWeight: 400,
                     letterSpacing: '0.2em', // $letter-spacing-label
                     textTransform: 'uppercase',
                     color: '#c5854e', // $color-copper
                  },
                  children: 'Andrei Muntean — Atelier',
               },
            },
            {
               type: 'div',
               props: {
                  style: {
                     display: 'flex',
                     flexDirection: 'column',
                     gap: '28px',
                     maxWidth: '1000px',
                  },
                  children: [
                     {
                        type: 'div',
                        props: {
                           style: {
                              display: 'flex',
                              fontFamily: 'Basteleur',
                              fontWeight: 700,
                              fontSize: '64px', // scaled-up $font-size-display-lg for a 1200px canvas
                              lineHeight: 1.12, // $line-height-tight
                              color: '#f1e8d8', // $color-ivory
                           },
                           children: data.title,
                        },
                     },
                     {
                        type: 'div',
                        props: {
                           style: {
                              display: 'flex',
                              fontFamily: 'Apfel Grotezk',
                              fontWeight: 400,
                              fontSize: '28px', // scaled-up $font-size-body-lg for a 1200px canvas
                              lineHeight: 1.6, // $line-height-body
                              color: 'rgba(241, 232, 216, 0.72)', // $color-text-muted
                           },
                           children: data.summary,
                        },
                     },
                  ],
               },
            },
            {
               type: 'div',
               props: {
                  style: {
                     display: 'flex',
                     justifyContent: 'flex-end',
                  },
                  children: [
                     {
                        type: 'img',
                        props: {
                           src: ROUNDEL_DATA_URI,
                           width: ROUNDEL_SIZE,
                           height: ROUNDEL_SIZE,
                        },
                     },
                  ],
               },
            },
         ],
      },
   };
}
