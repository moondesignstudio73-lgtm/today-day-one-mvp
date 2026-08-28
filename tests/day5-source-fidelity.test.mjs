import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {getLockedDay5Segment} from "../src/day5-campaign-runtime.mjs";
import {createScenarioState} from "../src/scenario-state.mjs";

const draft=readFileSync(new URL("../docs/day5/DAY5_SCENARIO_DRAFT_V1.md",import.meta.url),"utf8");
const speakers="하은|주인공|윤서진|민호|팀장|하은 메시지";
const sourceDialogue=[...draft.matchAll(new RegExp(`\\*\\*(${speakers})\\*\\*\\s*\\r?\\n\\s*\\r?\\n([^\\r\\n]+)`,"g"))].map(match=>match[2].trim());
const paths=[];
for(const entry of ["entry_current_facts","entry_social_map","entry_recovery_boundary"]){
  for(const seojin of ["seojin_role_history","seojin_current_intent","seojin_present_boundary"]){
    for(const work of ["work_observe_only","work_bounded_review","work_pair_check"]){
      for(const returning of ["request-current-briefing","rebuild-social-context","set-return-boundary"]){
        for(const relation of [[0,0],[4,4],[8,8]]){
          paths.push({gameMode:"marriage-in-30-days",storyFlags:{day4SharingStrategy:"sharing_transparent",day5EntryStrategy:entry,day5SeojinStrategy:seojin,day5WorkTrial:work,day5ReturnStrategy:returning},scenario:{...createScenarioState("marriage-in-30-days"),haeunAffection:relation[0],haeunTrust:relation[1]}});
        }
      }
    }
  }
}
const runtimeCorpus=paths.flatMap(state=>[0,1,2,3,4].flatMap(stage=>getLockedDay5Segment(state,stage))).filter(step=>step.type==="dialogue").map(step=>step.text);
const missing=sourceDialogue.filter(line=>!runtimeCorpus.includes(line));
assert.deepEqual(missing,[],`V1 dialogue missing from runtime:\n${missing.join("\n")}`);
assert.ok(runtimeCorpus.length>sourceDialogue.length,"V2 additions must supplement, not replace, V1 dialogue");
console.log(`✓ DAY 5 Notion 잠금 V1 대사 ${sourceDialogue.length}문장 런타임 누락 0`);
