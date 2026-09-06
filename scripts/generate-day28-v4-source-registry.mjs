import {readFileSync, writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';

const root=resolve(import.meta.dirname,'..');
const sourcePath=resolve(root,'docs/scenarios/DAY28_SCENARIO_V4_NOTION.md');
const outputPath=resolve(root,'src/day28-v4-source-registry.mjs');
const raw=readFileSync(sourcePath,'utf8').replace(/\r\n/g,'\n');
const sceneMatches=[...raw.matchAll(/^## SCENE (\d{2}) — (.+)$/gm)];

const variantFor=(sceneNumber,choiceNumber)=>{
  if(sceneNumber===1)return 'COMMON_MORNING';
  if(sceneNumber>=2&&sceneNumber<=8)return 'HAEUN_MEETING';
  if(sceneNumber>=9&&sceneNumber<=10)return 'BREAKUP_CLOSE';
  if(sceneNumber>=11&&sceneNumber<=16)return 'HAEUN_CONTINUING';
  if(sceneNumber===18)return 'NEW_MEETING';
  if(sceneNumber===19)return 'SOCIAL_SCOPE';
  if(sceneNumber>=20&&sceneNumber<=21)return 'SOLO_LIFE';
  if(sceneNumber===22&&choiceNumber===16)return 'CONTINUING_NIGHT';
  throw new Error(`DAY28_SOURCE_VARIANT_MISSING:${sceneNumber}:${choiceNumber}`);
};

const scenes=sceneMatches.map((match,index)=>{
  const start=match.index+match[0].length+1,end=sceneMatches[index+1]?.index??raw.length;
  const body=raw.slice(start,end).trim(),sceneNumber=Number(match[1]);
  const choices=[...body.matchAll(/^### (?:(?:새 만남 경로의|이 경로의) )?선택 (\d+) — (.+)$/gm)].map(choiceMatch=>{
    const afterHeading=body.slice(choiceMatch.index+choiceMatch[0].length+1),labels=[];
    for(const line of afterHeading.split('\n')){const bullet=line.match(/^- (.+)$/);if(!bullet)break;const label=bullet[1];labels.push(/^“.*”$/.test(label)?label.slice(1,-1):label);}
    const number=Number(choiceMatch[1]);
    return {number,variant:variantFor(sceneNumber,number),title:choiceMatch[2].trim(),labels};
  });
  return {number:sceneNumber,title:match[2].trim(),body,choices};
});

if(scenes.length!==24)throw new Error(`DAY28_SOURCE_SCENE_COUNT:${scenes.length}`);
const choices=scenes.flatMap(scene=>scene.choices);
if(choices.length!==26)throw new Error(`DAY28_SOURCE_CHOICE_COUNT:${choices.length}`);
if(choices.some(choice=>choice.labels.length!==3))throw new Error('DAY28_SOURCE_CHOICE_LABEL_COUNT');
const expected=new Map([
  ['COMMON_MORNING',[1]],['HAEUN_MEETING',[2,3,4,5,6,7,8]],['BREAKUP_CLOSE',[9,10]],
  ['HAEUN_CONTINUING',[9,10,11,12,13,14]],['NEW_MEETING',[8]],['SOCIAL_SCOPE',[15]],
  ['SOLO_LIFE',[2,3,4,5,6,7,8]],['CONTINUING_NIGHT',[16]],
]);
for(const [variant,sequence] of expected){const actual=choices.filter(choice=>choice.variant===variant).map(choice=>choice.number);if(JSON.stringify(actual)!==JSON.stringify(sequence))throw new Error(`DAY28_SOURCE_${variant}_CHOICE_SEQUENCE`);}

const sha=createHash('sha256').update(raw).digest('hex');
const generated=`// Generated mechanically from docs/scenarios/DAY28_SCENARIO_V4_NOTION.md.\n`+
  `// Raw source is evidence; runtime must select only actual-meeting, relationship-, consent-, truth- and contact-valid branches.\n`+
  `export const DAY28_V4_SOURCE_PAGE_ID = '3c9c31f0-29a6-81ab-aeb5-f17aaa4072d8';\n`+
  `export const DAY28_V4_SOURCE_URL = 'https://app.notion.com/p/3c9c31f029a681abaeb5f17aaa4072d8';\n`+
  `export const DAY28_V4_SOURCE_LAST_EDITED = '2026-08-27T21:01:47.079Z';\n`+
  `export const DAY28_V4_SOURCE_SHA256 = '${sha}';\n`+
  `export const DAY28_V4_SOURCE_SCENES = Object.freeze(${JSON.stringify(scenes,null,2)}.map(scene=>Object.freeze({...scene,choices:Object.freeze(scene.choices.map(choice=>Object.freeze({...choice,labels:Object.freeze(choice.labels)})))})));\n`;
writeFileSync(outputPath,generated,'utf8');
console.log(`Generated ${scenes.length} scenes and ${choices.length} choice blocks: ${outputPath}`);
