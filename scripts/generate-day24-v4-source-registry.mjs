import {readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';

const root = resolve(import.meta.dirname, '..');
const sourcePath = resolve(root, 'docs/scenarios/DAY24_SCENARIO_V4_NOTION.md');
const outputPath = resolve(root, 'src/day24-v4-source-registry.mjs');
const raw = readFileSync(sourcePath, 'utf8').replace(/\r\n/g, '\n');
const sceneMatches = [...raw.matchAll(/^## SCENE (\d{2}) — (.+)$/gm)];

const variantFor = (sceneNumber, choiceNumber) => {
  if (sceneNumber === 13) return 'YURI';
  if (sceneNumber === 14) return 'SEOJIN';
  if (sceneNumber === 15) return 'ARA';
  if (sceneNumber === 16) return 'PENDING_RELATIONSHIP';
  if (sceneNumber === 17) return 'NO_PENDING_CONTACT';
  if (sceneNumber === 18) return 'CONTINUE';
  if (sceneNumber === 19) return 'DEFER_OR_END';
  if (sceneNumber === 20) return 'JIHOON';
  if (sceneNumber === 21) return 'NEW_MEETING';
  if (sceneNumber === 22) return 'CONTINUE';
  if (choiceNumber <= 8 || choiceNumber === 15) return 'COMMON';
  throw new Error(`DAY24_SOURCE_VARIANT_MISSING:${sceneNumber}:${choiceNumber}`);
};

const scenes = sceneMatches.map((match, index) => {
  const start = match.index + match[0].length + 1;
  const end = sceneMatches[index + 1]?.index ?? raw.length;
  const body = raw.slice(start, end).trim();
  const sceneNumber = Number(match[1]);
  const choices = [...body.matchAll(/^### (?:(.+?) 경로의 )?선택 (\d+) — (.+)$/gm)].map(choiceMatch => {
    const afterHeading = body.slice(choiceMatch.index + choiceMatch[0].length + 1);
    const labels = [];
    for (const line of afterHeading.split('\n')) {
      const bullet = line.match(/^- “(.+)”$/);
      if (!bullet) break;
      labels.push(bullet[1]);
    }
    const number = Number(choiceMatch[2]);
    return {number, variant: variantFor(sceneNumber, number), title: choiceMatch[3].trim(), labels};
  });
  return {number: sceneNumber, title: match[2].trim(), body, choices};
});

if (scenes.length !== 24) throw new Error(`DAY24_SOURCE_SCENE_COUNT:${scenes.length}`);
const choices = scenes.flatMap(scene => scene.choices);
if (choices.length !== 20) throw new Error(`DAY24_SOURCE_CHOICE_COUNT:${choices.length}`);
if (choices.some(choice => choice.labels.length !== 3)) throw new Error('DAY24_SOURCE_CHOICE_LABEL_COUNT');
const common = choices.filter(choice => choice.variant === 'COMMON');
if (common.length !== 9 || common.some((choice, index) => choice.number !== [...Array(8)].map((_, i) => i + 1).concat(15)[index])) {
  throw new Error('DAY24_SOURCE_COMMON_CHOICE_SEQUENCE');
}
const expectedVariants = new Map([
  ['YURI', [9]], ['SEOJIN', [9]], ['ARA', [9]], ['PENDING_RELATIONSHIP', [10]],
  ['NO_PENDING_CONTACT', [9, 10]], ['CONTINUE', [11, 14]], ['DEFER_OR_END', [11]],
  ['JIHOON', [12]], ['NEW_MEETING', [13]],
]);
for (const [variant, expected] of expectedVariants) {
  const actual = choices.filter(choice => choice.variant === variant).map(choice => choice.number);
  if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error(`DAY24_SOURCE_${variant}_CHOICE_SEQUENCE`);
}

const generated = `// Generated mechanically from docs/scenarios/DAY24_SCENARIO_V4_NOTION.md.\n` +
  `// Raw source text is evidence; playable paths must select only history-, relationship-, recipient- and consent-valid branches.\n` +
  `export const DAY24_V4_SOURCE_PAGE_ID = '3c9c31f0-29a6-811e-9af0-cedccb66d1cf';\n` +
  `export const DAY24_V4_SOURCE_URL = 'https://app.notion.com/p/3c9c31f029a6811e9af0cedccb66d1cf';\n` +
  `export const DAY24_V4_SOURCE_LAST_EDITED = '2026-08-27T20:41:08.035Z';\n` +
  `export const DAY24_V4_SOURCE_SHA256 = 'c0a59b11ceffa729a15b07da81a1ee7604035698406bba31ddf263a6debb2032';\n` +
  `export const DAY24_V4_SOURCE_SCENES = Object.freeze(${JSON.stringify(scenes, null, 2)}.map(scene => Object.freeze({...scene, choices: Object.freeze(scene.choices.map(choice => Object.freeze({...choice, labels: Object.freeze(choice.labels)})))})));\n`;

writeFileSync(outputPath, generated, 'utf8');
console.log(`Generated ${scenes.length} scenes and ${choices.length} choice blocks: ${outputPath}`);
