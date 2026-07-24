import { readFile, writeFile, mkdir } from 'node:fs/promises';
import wawoff2 from 'wawoff2';

const FONTS = [
   ['static/fonts/Basteleur-Bold.woff2', 'src/lib/server/og/fonts/Basteleur-Bold.ttf'],
   ['static/fonts/ApfelGrotezk-Regular.woff2', 'src/lib/server/og/fonts/ApfelGrotezk-Regular.ttf'],
];

await mkdir('src/lib/server/og/fonts', { recursive: true });

for (const [src, dest] of FONTS) {
   const ttf = await wawoff2.decompress(await readFile(src));

   await writeFile(dest, Buffer.from(ttf));
   console.log(`converted ${src} -> ${dest}`);
}
