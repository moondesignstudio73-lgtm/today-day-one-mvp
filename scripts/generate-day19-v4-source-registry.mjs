import {readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';

const root = resolve(import.meta.dirname, '..');
const sourcePath = resolve(root, 'docs/scenarios/DAY19_SCENARIO_V4_NOTION.md');
const outputPath = resolve(root, 'src/day19-v4-source-registry.mjs');
const raw = readFileSync(sourcePath, 'utf8').replace(/\r\n/g, '\n');
const publicSource = raw.split(/^# INTERNAL EDITORIAL NOTES\b/m)[0];
const sceneMatches = [...publicSource.matchAll(/^## SCENE (\d{2}) — (.+)$/gm)];

const scenes = sceneMatches.map((match, index) => {
  const start = match.index + match[0].length + 1;
  const end = sceneMatches[index + 1]?.index ?? publicSource.length;
  const body = publicSource.slice(start, end).trim();
  const choices = [...body.matchAll(/^### (?:[^\n]*?의 )?선택 (\d+) — (.+)$/gm)].map(choiceMatch => {
    const afterHeading = body.slice(choiceMatch.index + choiceMatch[0].length + 1);
    const labels = [];
    for (const line of afterHeading.split('\n')) {
      const bullet = line.match(/^- “(.+)”$/);
      if (!bullet) break;
      labels.push(bullet[1]);
    }
    return {number: Number(choiceMatch[1]), title: choiceMatch[2].trim(), labels};
  });
  return {number: Number(match[1]), title: match[2].trim(), body, choices};
});

if (scenes.length !== 24) throw new Error(`DAY19_SOURCE_SCENE_COUNT:${scenes.length}`);
const choices = scenes.flatMap(scene => scene.choices);
if (choices.length !== 16) throw new Error(`DAY19_SOURCE_CHOICE_COUNT:${choices.length}`);
if (choices.some(choice => choice.labels.length !== 3)) throw new Error('DAY19_SOURCE_CHOICE_LABEL_COUNT');

const generated = `// Generated mechanically from docs/scenarios/DAY19_SCENARIO_V4_NOTION.md.\n` +
  `// Raw source text is evidence; the playable bridge must select only history-valid branches.\n` +
  `export const DAY19_V4_SOURCE_PAGE_ID = '3c9c31f0-29a6-8126-8d1d-dd90f6b6d7f4';\n` +
  `export const DAY19_V4_SOURCE_URL = 'https://app.notion.com/p/3c9c31f029a681268d1ddd90f6b6d7f4';\n` +
  `export const DAY19_V4_SOURCE_LAST_EDITED = '2026-08-27T20:11:18.241Z';\n` +
  `export const DAY19_V4_SOURCE_SCENES = Object.freeze(${JSON.stringify(scenes, null, 2)}.map(scene => Object.freeze({...scene, choices: Object.freeze(scene.choices.map(choice => Object.freeze({...choice, labels: Object.freeze(choice.labels)})))})));\n`;

writeFileSync(outputPath, generated, 'utf8');
console.log(`Generated ${scenes.length} scenes and ${choices.length} choices: ${outputPath}`);
