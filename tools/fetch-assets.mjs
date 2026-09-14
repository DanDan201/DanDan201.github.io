import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const iconsDir = path.join(root, 'assets', 'icons');
const flagsDir = path.join(root, 'assets', 'flags');
const logosDir = path.join(root, 'assets', 'logos');

// Simple Icons (CC0-1.0): https://github.com/simple-icons/simple-icons
const simple = [
  'python', 'c', 'cplusplus', 'javascript', 'html5', 'css', 'pytorch',
  'ultralytics', 'huggingface', 'langchain', 'langgraph', 'ollama', 'fastapi',
  'flask', 'react', 'streamlit', 'numpy', 'pandas', 'pytest',
  'sonarqubeserver', 'git', 'linux', 'github', 'facebook', 'instagram'
];
// Lucide (ISC): https://github.com/lucide-icons/lucide
const lucide = [
  'briefcase', 'folder-git-2', 'graduation-cap', 'wrench', 'sparkles', 'globe',
  'mail', 'map-pin', 'download', 'dumbbell', 'waves-ladder', 'gamepad-2',
  'chef-hat', 'plane', 'compass', 'film', 'tv', 'book-open', 'heart',
  'plane-takeoff', 'database', 'boxes', 'cloud', 'infinity', 'chart-spline'
];
// Devicon (MIT): https://github.com/devicons/devicon
const devicons = {
  azuredevops: 'azuredevops/azuredevops-original.svg',
  linkedin: 'linkedin/linkedin-plain.svg'
};
// circle-flags (MIT): https://github.com/HatScripts/circle-flags
const flags = [
  'vn', 'th', 'sg', 'nl', 'de', 'be', 'lu', 'hu', 'it', 'es', 'gr',
  'at', 'cz', 'no', 'ch', 'fr', 'jp', 'cn', 'kr', 'se', 'fi', 'pt'
];

await Promise.all([iconsDir, flagsDir, logosDir].map(dir => mkdir(dir, { recursive: true })));

async function download(url, destination) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  await writeFile(destination, Buffer.from(await response.arrayBuffer()));
}

await Promise.all([
  ...simple.map(name => download(
    `https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/${name}.svg`,
    path.join(iconsDir, `si-${name}.svg`)
  )),
  ...lucide.map(name => download(
    `https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/${name}.svg`,
    path.join(iconsDir, `lu-${name}.svg`)
  )),
  ...Object.entries(devicons).map(([name, source]) => download(
    `https://raw.githubusercontent.com/devicons/devicon/master/icons/${source}`,
    path.join(iconsDir, `dv-${name}.svg`)
  )),
  ...flags.map(code => download(
    `https://raw.githubusercontent.com/HatScripts/circle-flags/gh-pages/flags/${code}.svg`,
    path.join(flagsDir, `${code}.svg`)
  )),
  download(
    'https://www.philips.com/c-etc/philips/clientlibs/foundation-base/clientlibs-css/img/favicon/favicon.svg',
    path.join(logosDir, 'philips-shield.svg')
  )
]);

const philipsPath = path.join(logosDir, 'philips-shield.svg');
// Philips shield source: https://www.philips.com/c-etc/philips/clientlibs/foundation-base/clientlibs-css/img/favicon/favicon.svg
let philips = await readFile(philipsPath, 'utf8');
philips = philips.replace(/<style([^>]*)>([\s\S]*?)<\/style>/, (_, attributes, css) => {
  const cleaned = css
    .replace(/@media\s*\(prefers-color-scheme:\s*dark\)\s*\{[^}]*\}[^}]*\}/, '')
    .replace(/\s*}\s*$/, '');
  return `<style${attributes}>${cleaned}</style>`;
});
if (!philips.includes('fill: #0B5ED7') || philips.includes('prefers-color-scheme')) {
  throw new Error('Philips shield colour-mode cleanup failed');
}
await writeFile(philipsPath, philips);

try {
  await readFile(path.join(logosDir, 'hsgs.gif'));
} catch {
  throw new Error('hsgs.gif missing — fetch via headless browser, see plan step 3');
}

const innerSvg = svg => svg.match(/<svg\b[^>]*>([\s\S]*?)<\/svg>/)?.[1]?.trim();
const viewBox = svg => svg.match(/\bviewBox=(['"])(.*?)\1/i)?.[2];
const stripDeviconPaint = markup => markup
  .replace(/\sfill=(['"])[\s\S]*?\1/gi, '')
  .replace(/\sstyle=(['"])(.*?)\1/gi, (_, quote, styles) => {
    const kept = styles.split(';').filter(rule => rule.trim() && !/^\s*fill\s*:/i.test(rule));
    return kept.length ? ` style=${quote}${kept.join(';')}${quote}` : '';
  });

const symbols = [];
for (const name of simple) {
  const svg = await readFile(path.join(iconsDir, `si-${name}.svg`), 'utf8');
  const paths = [...svg.matchAll(/<path\b[^>]*\/?\s*>/gi)].map(match => match[0]).join('');
  if (!paths) throw new Error(`No paths found in Simple Icon: ${name}`);
  symbols.push(`<symbol id="si-${name}" viewBox="0 0 24 24" fill="currentColor">${paths}</symbol>`);
}
for (const name of lucide) {
  const svg = await readFile(path.join(iconsDir, `lu-${name}.svg`), 'utf8');
  const children = innerSvg(svg);
  if (!children) throw new Error(`No children found in Lucide icon: ${name}`);
  symbols.push(`<symbol id="lu-${name}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${children}</symbol>`);
}
for (const name of Object.keys(devicons)) {
  const svg = await readFile(path.join(iconsDir, `dv-${name}.svg`), 'utf8');
  const box = viewBox(svg);
  const children = innerSvg(svg);
  if (!box || !children) throw new Error(`Invalid Devicon SVG: ${name}`);
  symbols.push(`<symbol id="dv-${name}" viewBox="${box}" fill="currentColor">${stripDeviconPaint(children)}</symbol>`);
}

const indexPath = path.join(root, 'index.html');
const index = await readFile(indexPath, 'utf8');
const marker = /(<!-- sprite:start -->)[\s\S]*?(<!-- sprite:end -->)/;
if (!marker.test(index)) throw new Error('Sprite markers missing from index.html');
const sprite = `<!-- sprite:start -->\n    ${symbols.join('\n    ')}\n    <!-- sprite:end -->`;
await writeFile(indexPath, index.replace(marker, sprite));
console.log(`Fetched ${symbols.length} icons, ${flags.length} flags, and the Philips shield.`);
