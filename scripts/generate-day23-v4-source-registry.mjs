import {readFileSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';

const root = resolve(import.meta.dirname, '..');
const sourcePath = resolve(root, 'docs/scenarios/DAY23_SCENARIO_V4_NOTION.md');
const outputPath = resolve(root, 'src/day23-v4-source-registry.mjs');
const raw = readFileSync(sourcePath, 'utf8').replace(/\r\n/g, '\n');
const sceneMatches = [...raw.matchAll(/^## SCENE (\d{2}) — (.+)$/gm)];

const scenes = sceneMatches.map((match, index) => {
  const start = match.index + match[0].length + 1;
  const end = sceneMatches[index + 1]?.index ?? raw.length;
  const body = raw.slice(start, end).trim();
  const sceneNumber = Number(match[1]);
  const choices = [...body.matchAll(/^### (?:(이 경로)의 )?선택 (\d+) — (.+)$/gm)].map(choiceMatch => {
    const afterHeading = body.slice(choiceMatch.index + choiceMatch[0].length + 1);
    const labels = [];
    for (const line of afterHeading.split('\n')) {
      const bullet = line.match(/^- “(.+)”$/);
      if (!bullet) break;
      labels.push(bullet[1]);
    }
    const variant = sceneNumber === 21 ? 'NO_TRAVEL' : sceneNumber === 17 ? 'NO_PENDING_CONTACT' : 'MAIN';
    return {number: Number(choiceMatch[2]), variant, title: choiceMatch[3].trim(), labels};
  });
  return {number: sceneNumber, title: match[2].trim(), body, choices};
});

if (scenes.length !== 24) throw new Error(`DAY23_SOURCE_SCENE_COUNT:${scenes.length}`);
const choices = scenes.flatMap(scene => scene.choices);
if (choices.length !== 24) throw new Error(`DAY23_SOURCE_CHOICE_COUNT:${choices.length}`);
if (choices.some(choice => choice.labels.length !== 3)) throw new Error('DAY23_SOURCE_CHOICE_LABEL_COUNT');
const main = choices.filter(choice => choice.variant === 'MAIN');
const noPendingContact = choices.filter(choice => choice.variant === 'NO_PENDING_CONTACT');
const noTravel = choices.filter(choice => choice.variant === 'NO_TRAVEL');
if (main.length !== 17 || main.some((choice, index) => choice.number !== index + 1)) throw new Error('DAY23_SOURCE_MAIN_CHOICE_SEQUENCE');
if (noPendingContact.length !== 1 || noPendingContact[0].number !== 14) throw new Error('DAY23_SOURCE_CONTACT_VARIANT');
if (noTravel.length !== 6 || noTravel.some((choice, index) => choice.number !== index + 3)) throw new Error('DAY23_SOURCE_NO_TRAVEL_CHOICE_SEQUENCE');

const generated = `// Generated mechanically from docs/scenarios/DAY23_SCENARIO_V4_NOTION.md.\n` +
  `// Raw source text is evidence; playable paths must select only history-, location-, knowledge- and consent-valid branches.\n` +
  `export const DAY23_V4_SOURCE_PAGE_ID = '3c9c31f0-29a6-814b-b599-e8b6ed6f23a6';\n` +
  `export const DAY23_V4_SOURCE_URL = 'https://app.notion.com/p/3c9c31f029a6814bb599e8b6ed6f23a6';\n` +
  `export const DAY23_V4_SOURCE_LAST_EDITED = '2026-08-27T20:35:59.361Z';\n` +
  `export const DAY23_V4_SOURCE_SHA256 = 'd0abf2a4f1ead70b38eb6429ca12df49def0ecc699e499cb35e6dd0327641055';\n` +
  `export const DAY23_V4_SOURCE_SCENES = Object.freeze(${JSON.stringify(scenes, null, 2)}.map(scene => Object.freeze({...scene, choices: Object.freeze(scene.choices.map(choice => Object.freeze({...choice, labels: Object.freeze(choice.labels)})))})));\n`;

writeFileSync(outputPath, generated, 'utf8');
console.log(`Generated ${scenes.length} scenes and ${choices.length} choice blocks: ${outputPath}`);
