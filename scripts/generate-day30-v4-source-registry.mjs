import {readFileSync, writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';

const root=resolve(import.meta.dirname,'..');
const sourcePath=resolve(root,'docs/scenarios/DAY30_SCENARIO_V4_NOTION.md');
const outputPath=resolve(root,'src/day30-v4-source-registry.mjs');
const raw=readFileSync(sourcePath,'utf8').replace(/\r\n/g,'\n');
const sceneMatches=[...raw.matchAll(/^## SCENE (\d{2}) — (.+)$/gm)];
const variantFor=sceneNumber=>sceneNumber<=4?'COMMON_OPENING':sceneNumber<=9?'HAEUN_PREPARATION':sceneNumber<=11?'HAEUN_DEFERRED':sceneNumber===12?'HAEUN_LONG_TERM':sceneNumber===13?'HAEUN_CONTINUING':sceneNumber===14?'HAEUN_BREAKUP':sceneNumber===15?'SOLO_AFTER_BREAKUP':sceneNumber===16?'YURI_RELATIONSHIP':sceneNumber===17?'SEOJIN_RELATIONSHIP':sceneNumber===18?'ARA_RELATIONSHIP':sceneNumber===19?'GETTING_TO_KNOW':sceneNumber===20?'SOLO':sceneNumber===21?'UNRESOLVED_TRUTH':sceneNumber<=24?'COMMON_LIFE':sceneNumber===25?'ROUTE_CLOSE':'COMMON_CLOSE';

const scenes=sceneMatches.map((match,index)=>{
  const start=match.index+match[0].length+1,end=sceneMatches[index+1]?.index??raw.indexOf('\n## AFTER STORY');
  const body=raw.slice(start,end).trim(),sceneNumber=Number(match[1]);
  const choices=[...body.matchAll(/^### 선택 (\d+) — (.+)$/gm)].map(choiceMatch=>{
    const afterHeading=body.slice(choiceMatch.index+choiceMatch[0].length+1),labels=[];
    for(const line of afterHeading.split('\n')){const bullet=line.match(/^- (.+)$/);if(!bullet)break;const label=bullet[1];labels.push(/^“.*”$/.test(label)?label.slice(1,-1):label);}
    return {number:Number(choiceMatch[1]),variant:variantFor(sceneNumber),title:choiceMatch[2].trim(),labels};
  });
  return {number:sceneNumber,title:match[2].trim(),body,choices};
});

if(scenes.length!==30)throw new Error(`DAY30_SOURCE_SCENE_COUNT:${scenes.length}`);
const choices=scenes.flatMap(scene=>scene.choices);
if(choices.length!==28)throw new Error(`DAY30_SOURCE_CHOICE_COUNT:${choices.length}`);
if(choices.some(choice=>![3,4,5].includes(choice.labels.length)))throw new Error('DAY30_SOURCE_CHOICE_LABEL_COUNT');
if(JSON.stringify(choices.map(choice=>choice.number))!==JSON.stringify(Array.from({length:28},(_,index)=>index+1)))throw new Error('DAY30_SOURCE_CHOICE_SEQUENCE');

const sha=createHash('sha256').update(raw).digest('hex');
const generated=`// Generated mechanically from docs/scenarios/DAY30_SCENARIO_V4_NOTION.md.\n`+
  `// Raw source is evidence; runtime must select only history-, relationship-, consent-, truth-, work-, money- and health-valid branches.\n`+
  `export const DAY30_V4_SOURCE_PAGE_ID = '3c9c31f0-29a6-81bb-bbc1-c80179590cdd';\n`+
  `export const DAY30_V4_SOURCE_URL = 'https://app.notion.com/p/3c9c31f029a681bbbbc1c80179590cdd';\n`+
  `export const DAY30_V4_SOURCE_LAST_EDITED = '2026-08-27T21:17:38.535Z';\n`+
  `export const DAY30_V4_SOURCE_SHA256 = '${sha}';\n`+
  `export const DAY30_V4_SOURCE_SCENES = Object.freeze(${JSON.stringify(scenes,null,2)}.map(scene=>Object.freeze({...scene,choices:Object.freeze(scene.choices.map(choice=>Object.freeze({...choice,labels:Object.freeze(choice.labels)})))})));\n`;
writeFileSync(outputPath,generated,'utf8');
console.log(`Generated ${scenes.length} scenes and ${choices.length} choice blocks; SHA-256 ${sha}`);
