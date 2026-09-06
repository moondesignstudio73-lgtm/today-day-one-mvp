import {readFileSync, writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';

const root=resolve(import.meta.dirname,'..');
const sourcePath=resolve(root,'docs/scenarios/DAY27_SCENARIO_V4_NOTION.md');
const outputPath=resolve(root,'src/day27-v4-source-registry.mjs');
const raw=readFileSync(sourcePath,'utf8').replace(/\r\n/g,'\n');
const sceneMatches=[...raw.matchAll(/^## SCENE (\d{2}) — (.+)$/gm)];

const variantFor=(sceneNumber,choiceNumber)=>{
  if(sceneNumber===1)return 'COMMON_MORNING';
  if(sceneNumber===2)return 'CONVERSATION_START';
  if(sceneNumber>=4&&sceneNumber<=9)return 'RELATIONSHIP_TRUTH';
  if(sceneNumber>=11&&sceneNumber<=14)return 'HONEST_LISTENING';
  if(sceneNumber===15)return 'PUBLIC_CORRECTION';
  if(sceneNumber===16)return 'CONVERSATION_END';
  if(sceneNumber===18)return 'JIHOON_SUPPORT';
  if(sceneNumber===19)return 'COMMON_EVENING';
  if(sceneNumber===20)return 'CONTINUING_NIGHT';
  if(sceneNumber===21&&choiceNumber===16)return 'CONTINUING_NIGHT';
  if(sceneNumber===21&&choiceNumber===15)return 'SEPARATION_NIGHT';
  if(sceneNumber===23)return 'NO_CONVERSATION';
  throw new Error(`DAY27_SOURCE_VARIANT_MISSING:${sceneNumber}:${choiceNumber}`);
};

const scenes=sceneMatches.map((match,index)=>{
  const start=match.index+match[0].length+1,end=sceneMatches[index+1]?.index??raw.length;
  const body=raw.slice(start,end).trim(),sceneNumber=Number(match[1]);
  const choices=[...body.matchAll(/^### (?:(?:(?:이|이별 또는 비대화) 경로의 )?)선택 (\d+) — (.+)$/gm)].map(choiceMatch=>{
    const afterHeading=body.slice(choiceMatch.index+choiceMatch[0].length+1),labels=[];
    for(const line of afterHeading.split('\n')){const bullet=line.match(/^- “(.+)”$/);if(!bullet)break;labels.push(bullet[1]);}
    const number=Number(choiceMatch[1]);
    return {number,variant:variantFor(sceneNumber,number),title:choiceMatch[2].trim(),labels};
  });
  return {number:sceneNumber,title:match[2].trim(),body,choices};
});

if(scenes.length!==24)throw new Error(`DAY27_SOURCE_SCENE_COUNT:${scenes.length}`);
const choices=scenes.flatMap(scene=>scene.choices);
if(choices.length!==23)throw new Error(`DAY27_SOURCE_CHOICE_COUNT:${choices.length}`);
if(choices.some(choice=>choice.labels.length<3||choice.labels.length>4))throw new Error('DAY27_SOURCE_CHOICE_LABEL_COUNT');
const expected=new Map([
  ['COMMON_MORNING',[1]],['CONVERSATION_START',[2]],['RELATIONSHIP_TRUTH',[3,4,5,6,7]],
  ['HONEST_LISTENING',[8,9,10]],['PUBLIC_CORRECTION',[11]],['CONVERSATION_END',[12]],
  ['JIHOON_SUPPORT',[13]],['COMMON_EVENING',[14]],['CONTINUING_NIGHT',[15,16]],
  ['SEPARATION_NIGHT',[15]],['NO_CONVERSATION',[3,4,5,6,7,8]],
]);
for(const [variant,sequence] of expected){const actual=choices.filter(choice=>choice.variant===variant).map(choice=>choice.number);if(JSON.stringify(actual)!==JSON.stringify(sequence))throw new Error(`DAY27_SOURCE_${variant}_CHOICE_SEQUENCE`);}

const sha=createHash('sha256').update(raw).digest('hex');
const generated=`// Generated mechanically from docs/scenarios/DAY27_SCENARIO_V4_NOTION.md.\n`+
  `// Raw source is evidence; runtime must select only actual-recipient, honesty-, consent-, availability- and relationship-valid branches.\n`+
  `export const DAY27_V4_SOURCE_PAGE_ID = '3c9c31f0-29a6-81fe-b0e1-df8c541775c9';\n`+
  `export const DAY27_V4_SOURCE_URL = 'https://app.notion.com/p/3c9c31f029a681feb0e1df8c541775c9';\n`+
  `export const DAY27_V4_SOURCE_LAST_EDITED = '2026-08-27T20:56:48.044Z';\n`+
  `export const DAY27_V4_SOURCE_SHA256 = '${sha}';\n`+
  `export const DAY27_V4_SOURCE_SCENES = Object.freeze(${JSON.stringify(scenes,null,2)}.map(scene=>Object.freeze({...scene,choices:Object.freeze(scene.choices.map(choice=>Object.freeze({...choice,labels:Object.freeze(choice.labels)})))})));\n`;
writeFileSync(outputPath,generated,'utf8');
console.log(`Generated ${scenes.length} scenes and ${choices.length} choice blocks: ${outputPath}`);
