import {readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';

const root = resolve(import.meta.dirname, '..');
const sourcePath = resolve(root, 'docs/scenarios/DAY21_SCENARIO_V4_NOTION.md');
const outputPath = resolve(root, 'src/day21-v4-source-registry.mjs');
const raw = readFileSync(sourcePath, 'utf8').replace(/\r\n/g, '\n');
const sceneMatches = [...raw.matchAll(/^## SCENE (\d{2}) — (.+)$/gm)];

const scenes = sceneMatches.map((match, index) => {
  const start = match.index + match[0].length + 1;
  const end = sceneMatches[index + 1]?.index ?? raw.length;
  const body = raw.slice(start, end).trim();
  const choices = [...body.matchAll(/^### (?:(이 경로)의 )?선택 (\d+) — (.+)$/gm)].map(choiceMatch => {
    const afterHeading = body.slice(choiceMatch.index + choiceMatch[0].length + 1);
    const labels = [];
    for (const line of afterHeading.split('\n')) {
      const bullet = line.match(/^- “(.+)”$/);
      if (!bullet) break;
      labels.push(bullet[1]);
    }
    return {
      number: Number(choiceMatch[2]),
      variant: choiceMatch[1] === '이 경로' ? 'DEFERRED' : 'FACE_TO_FACE',
      title: choiceMatch[3].trim(),
      labels
    };
  });
  return {number: Number(match[1]), title: match[2].trim(), body, choices};
});

if (scenes.length !== 24) throw new Error(`DAY21_SOURCE_SCENE_COUNT:${scenes.length}`);
const choices = scenes.flatMap(scene => scene.choices);
if (choices.length !== 21) throw new Error(`DAY21_SOURCE_CHOICE_COUNT:${choices.length}`);
if (choices.some(choice => choice.labels.length !== 3)) throw new Error('DAY21_SOURCE_CHOICE_LABEL_COUNT');
const main = choices.filter(choice => choice.variant === 'FACE_TO_FACE');
const deferred = choices.filter(choice => choice.variant === 'DEFERRED');
if (main.length !== 16 || main.some((choice, index) => choice.number !== index + 1)) throw new Error('DAY21_SOURCE_MAIN_CHOICE_SEQUENCE');
if (deferred.length !== 5 || deferred.some((choice, index) => choice.number !== index + 4)) throw new Error('DAY21_SOURCE_DEFERRED_CHOICE_SEQUENCE');

const generated = `// Generated mechanically from docs/scenarios/DAY21_SCENARIO_V4_NOTION.md.\n` +
  `// Raw source text is evidence; playable paths must select only history-, knowledge- and consent-valid branches.\n` +
  `export const DAY21_V4_SOURCE_PAGE_ID = '3c9c31f0-29a6-8138-9d37-e5b6c8b74a32';\n` +
  `export const DAY21_V4_SOURCE_URL = 'https://app.notion.com/p/3c9c31f029a681389d37e5b6c8b74a32';\n` +
  `export const DAY21_V4_SOURCE_LAST_EDITED = '2026-08-27T20:23:21.832Z';\n` +
  `export const DAY21_V4_SOURCE_SHA256 = '39797c3086e9e2f23c4fc4acc37c9fe1525816e74a21fd709b011a4fdbcb9589';\n` +
  `export const DAY21_V4_SOURCE_SCENES = Object.freeze(${JSON.stringify(scenes, null, 2)}.map(scene => Object.freeze({...scene, choices: Object.freeze(scene.choices.map(choice => Object.freeze({...choice, labels: Object.freeze(choice.labels)})))})));\n`;

writeFileSync(outputPath, generated, 'utf8');
console.log(`Generated ${scenes.length} scenes and ${choices.length} choice blocks: ${outputPath}`);
