import {readFileSync, writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';

const root=resolve(import.meta.dirname,'..');
const sourcePath=resolve(root,'docs/scenarios/DAY26_SCENARIO_V4_NOTION.md');
const outputPath=resolve(root,'src/day26-v4-source-registry.mjs');
const raw=readFileSync(sourcePath,'utf8').replace(/\r\n/g,'\n');
const sceneMatches=[...raw.matchAll(/^## SCENE (\d{2}) — (.+)$/gm)];

const variantFor=(sceneNumber,choiceNumber)=>{
  if(choiceNumber===1)return 'COMMON_START';
  if(sceneNumber>=2&&sceneNumber<=14)return 'HAEUN_FRIEND_MEAL';
  if(sceneNumber===15)return 'JIHOON_MEAL';
  if(sceneNumber>=16&&sceneNumber<=20)return 'NEW_MEETING';
  if(sceneNumber===21)return 'SOLO_DAY';
  if(sceneNumber===22)return 'HAEUN_NIGHT';
  if(sceneNumber===23&&choiceNumber===14)return 'COMMON_ENDING';
  throw new Error(`DAY26_SOURCE_VARIANT_MISSING:${sceneNumber}:${choiceNumber}`);
};

const scenes=sceneMatches.map((match,index)=>{
  const start=match.index+match[0].length+1,end=sceneMatches[index+1]?.index??raw.length;
  const body=raw.slice(start,end).trim(),sceneNumber=Number(match[1]);
  const choices=[...body.matchAll(/^### (?:(?:이 경로의 )?)선택 (\d+) — (.+)$/gm)].map(choiceMatch=>{
    const afterHeading=body.slice(choiceMatch.index+choiceMatch[0].length+1),labels=[];
    for(const line of afterHeading.split('\n')){const bullet=line.match(/^- “(.+)”$/);if(!bullet)break;labels.push(bullet[1]);}
    const number=Number(choiceMatch[1]);
    return {number,variant:variantFor(sceneNumber,number),title:choiceMatch[2].trim(),labels};
  });
  return {number:sceneNumber,title:match[2].trim(),body,choices};
});

if(scenes.length!==24)throw new Error(`DAY26_SOURCE_SCENE_COUNT:${scenes.length}`);
const choices=scenes.flatMap(scene=>scene.choices);
if(choices.length!==28)throw new Error(`DAY26_SOURCE_CHOICE_COUNT:${choices.length}`);
if(choices.some(choice=>choice.labels.length!==3))throw new Error('DAY26_SOURCE_CHOICE_LABEL_COUNT');
const expected=new Map([
  ['COMMON_START',[1]],['HAEUN_FRIEND_MEAL',[2,3,4,5,6,7,8,9,10,11,12]],
  ['JIHOON_MEAL',[2,3]],['NEW_MEETING',[4,5,6,7,8]],['SOLO_DAY',[2,3,4,5,6,7,8]],
  ['HAEUN_NIGHT',[13]],['COMMON_ENDING',[14]],
]);
for(const [variant,sequence] of expected){const actual=choices.filter(choice=>choice.variant===variant).map(choice=>choice.number);if(JSON.stringify(actual)!==JSON.stringify(sequence))throw new Error(`DAY26_SOURCE_${variant}_CHOICE_SEQUENCE`);}

const sha=createHash('sha256').update(raw).digest('hex');
const generated=`// Generated mechanically from docs/scenarios/DAY26_SCENARIO_V4_NOTION.md.\n`+
  `// Raw source is evidence; runtime must select only attendance-, relationship-, honesty-, consent- and availability-valid branches.\n`+
  `export const DAY26_V4_SOURCE_PAGE_ID = '3c9c31f0-29a6-815a-bd8b-cbd60569e6bf';\n`+
  `export const DAY26_V4_SOURCE_URL = 'https://app.notion.com/p/3c9c31f029a6815abd8bcbd60569e6bf';\n`+
  `export const DAY26_V4_SOURCE_LAST_EDITED = '2026-08-27T20:51:27.362Z';\n`+
  `export const DAY26_V4_SOURCE_SHA256 = '${sha}';\n`+
  `export const DAY26_V4_SOURCE_SCENES = Object.freeze(${JSON.stringify(scenes,null,2)}.map(scene=>Object.freeze({...scene,choices:Object.freeze(scene.choices.map(choice=>Object.freeze({...choice,labels:Object.freeze(choice.labels)})))})));\n`;
writeFileSync(outputPath,generated,'utf8');
console.log(`Generated ${scenes.length} scenes and ${choices.length} choice blocks: ${outputPath}`);
