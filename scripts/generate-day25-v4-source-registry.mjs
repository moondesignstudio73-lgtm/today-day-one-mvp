import {readFileSync, writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';

const root = resolve(import.meta.dirname, '..');
const sourcePath = resolve(root, 'docs/scenarios/DAY25_SCENARIO_V4_NOTION.md');
const outputPath = resolve(root, 'src/day25-v4-source-registry.mjs');
const raw = readFileSync(sourcePath, 'utf8').replace(/\r\n/g, '\n');
const sceneMatches = [...raw.matchAll(/^## SCENE (\d{2}) — (.+)$/gm)];

const variantFor = (sceneNumber, choiceNumber) => {
  if (choiceNumber <= 3) return 'COMMON_OPENING';
  if (sceneNumber >= 4 && sceneNumber <= 16) return 'HAEUN_FUTURE';
  if (sceneNumber === 17 || sceneNumber === 18) return 'SOLO_FUTURE';
  if (sceneNumber === 19) return 'NEW_MEETING';
  if (sceneNumber >= 20 && sceneNumber <= 22) return 'HAEUN_SOCIAL';
  throw new Error(`DAY25_SOURCE_VARIANT_MISSING:${sceneNumber}:${choiceNumber}`);
};

const scenes = sceneMatches.map((match, index) => {
  const start = match.index + match[0].length + 1;
  const end = sceneMatches[index + 1]?.index ?? raw.length;
  const body = raw.slice(start, end).trim();
  const sceneNumber = Number(match[1]);
  const choices = [...body.matchAll(/^### (?:(?:이 경로의 )?)선택 (\d+) — (.+)$/gm)].map(choiceMatch => {
    const afterHeading = body.slice(choiceMatch.index + choiceMatch[0].length + 1);
    const labels = [];
    for (const line of afterHeading.split('\n')) {
      const bullet = line.match(/^- “(.+)”$/);
      if (!bullet) break;
      labels.push(bullet[1]);
    }
    const number = Number(choiceMatch[1]);
    return {number, variant: variantFor(sceneNumber, number), title: choiceMatch[2].trim(), labels};
  });
  return {number: sceneNumber, title: match[2].trim(), body, choices};
});

if (scenes.length !== 24) throw new Error(`DAY25_SOURCE_SCENE_COUNT:${scenes.length}`);
const choices = scenes.flatMap(scene => scene.choices);
if (choices.length !== 20) throw new Error(`DAY25_SOURCE_CHOICE_COUNT:${choices.length}`);
if (choices.some(choice => choice.labels.length !== (choice.variant === 'HAEUN_FUTURE' && choice.number === 10 ? 4 : 3))) throw new Error('DAY25_SOURCE_CHOICE_LABEL_COUNT');
const expected = new Map([
  ['COMMON_OPENING', [1,2,3]], ['HAEUN_FUTURE', [4,5,6,7,8,9,10,11,12,13]],
  ['SOLO_FUTURE', [4,5,6]], ['NEW_MEETING', [7]], ['HAEUN_SOCIAL', [14,15,16]],
]);
for (const [variant, sequence] of expected) {
  const actual = choices.filter(choice => choice.variant === variant).map(choice => choice.number);
  if (JSON.stringify(actual) !== JSON.stringify(sequence)) throw new Error(`DAY25_SOURCE_${variant}_CHOICE_SEQUENCE`);
}

const sha = createHash('sha256').update(raw).digest('hex');
const generated = `// Generated mechanically from docs/scenarios/DAY25_SCENARIO_V4_NOTION.md.\n` +
  `// Raw source is evidence; runtime must select only history-, relationship-, consent- and availability-valid branches.\n` +
  `export const DAY25_V4_SOURCE_PAGE_ID = '3c9c31f0-29a6-81c0-93a3-d109c07f6995';\n` +
  `export const DAY25_V4_SOURCE_URL = 'https://app.notion.com/p/3c9c31f029a681c093a3d109c07f6995';\n` +
  `export const DAY25_V4_SOURCE_LAST_EDITED = '2026-08-27T20:46:24.113Z';\n` +
  `export const DAY25_V4_SOURCE_SHA256 = '${sha}';\n` +
  `export const DAY25_V4_SOURCE_SCENES = Object.freeze(${JSON.stringify(scenes, null, 2)}.map(scene => Object.freeze({...scene, choices: Object.freeze(scene.choices.map(choice => Object.freeze({...choice, labels: Object.freeze(choice.labels)})))})));\n`;

writeFileSync(outputPath, generated, 'utf8');
console.log(`Generated ${scenes.length} scenes and ${choices.length} choice blocks: ${outputPath}`);
