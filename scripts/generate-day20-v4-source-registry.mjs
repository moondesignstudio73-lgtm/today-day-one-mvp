import {readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';

const root = resolve(import.meta.dirname, '..');
const sourcePath = resolve(root, 'docs/scenarios/DAY20_SCENARIO_V4_NOTION.md');
const outputPath = resolve(root, 'src/day20-v4-source-registry.mjs');
const raw = readFileSync(sourcePath, 'utf8').replace(/\r\n/g, '\n');
const sceneMatches = [...raw.matchAll(/^## SCENE (\d{2}) — (.+)$/gm)];

const scenes = sceneMatches.map((match, index) => {
  const start = match.index + match[0].length + 1;
  const end = sceneMatches[index + 1]?.index ?? raw.length;
  const body = raw.slice(start, end).trim();
  const choices = [...body.matchAll(/^### (?:(.+?)의 )?선택 (\d+) — (.+)$/gm)].map(choiceMatch => {
    const afterHeading = body.slice(choiceMatch.index + choiceMatch[0].length + 1);
    const labels = [];
    for (const line of afterHeading.split('\n')) {
      const bullet = line.match(/^- “(.+)”$/);
      if (!bullet) break;
      labels.push(bullet[1]);
    }
    const qualifier = choiceMatch[1]?.trim() ?? null;
    const variant = qualifier === '혼자 보내는 경로' ? 'SOLO' : qualifier === '이 경로' ? 'CONFLICT' : 'FACE_TO_FACE';
    return {number: Number(choiceMatch[2]), variant, title: choiceMatch[3].trim(), labels};
  });
  return {number: Number(match[1]), title: match[2].trim(), body, choices};
});

if (scenes.length !== 24) throw new Error(`DAY20_SOURCE_SCENE_COUNT:${scenes.length}`);
const choices = scenes.flatMap(scene => scene.choices);
if (choices.length !== 19) throw new Error(`DAY20_SOURCE_CHOICE_COUNT:${choices.length}`);
if (choices.some(choice => choice.labels.length !== 3)) throw new Error('DAY20_SOURCE_CHOICE_LABEL_COUNT');
const main = choices.filter(choice => choice.variant === 'FACE_TO_FACE');
if (main.length !== 14 || main.some((choice, index) => choice.number !== index + 1)) throw new Error('DAY20_SOURCE_MAIN_CHOICE_SEQUENCE');
if (choices.filter(choice => choice.variant === 'SOLO').length !== 4 ||
  choices.filter(choice => choice.variant === 'CONFLICT').length !== 1) throw new Error('DAY20_SOURCE_VARIANT_COUNTS');

const generated = `// Generated mechanically from docs/scenarios/DAY20_SCENARIO_V4_NOTION.md.\n` +
  `// Raw source text is evidence; playable paths must select only history- and consent-valid branches.\n` +
  `export const DAY20_V4_SOURCE_PAGE_ID = '3c9c31f0-29a6-81b3-b82a-c4fbc39173e4';\n` +
  `export const DAY20_V4_SOURCE_URL = 'https://app.notion.com/p/3c9c31f029a681b3b82ac4fbc39173e4';\n` +
  `export const DAY20_V4_SOURCE_LAST_EDITED = '2026-08-27T20:17:26.218Z';\n` +
  `export const DAY20_V4_SOURCE_SHA256 = '9db072f65fd3b0e0bf930628bbcb9e1601153413377baced59b0ae43ceeb3c1e';\n` +
  `export const DAY20_V4_SOURCE_SCENES = Object.freeze(${JSON.stringify(scenes, null, 2)}.map(scene => Object.freeze({...scene, choices: Object.freeze(scene.choices.map(choice => Object.freeze({...choice, labels: Object.freeze(choice.labels)})))})));\n`;

writeFileSync(outputPath, generated, 'utf8');
console.log(`Generated ${scenes.length} scenes and ${choices.length} choice blocks: ${outputPath}`);
