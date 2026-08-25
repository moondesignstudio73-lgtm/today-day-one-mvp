import assert from "node:assert/strict";
import { createInitialState } from "../src/game-core.mjs";
import { createGirlfriendFromProfile } from "../src/girlfriend-manager.mjs";
import { SaveManager } from "../src/save-manager.mjs";
import { GAME_MODES } from "../src/scenario-state.mjs";
import { getEligibleMicroEvents, MICRO_EVENTS } from "../src/micro-event-manager.mjs";
import { beginStoryFreeAction, rollStoryFreeActionEvent } from "../src/story-free-action-manager.mjs";
import { CONTEXTUAL_SHARED_EVENTS, FREE_MODE_EVENT_CATALOG, SHARED_EVENT_CATALOG, evaluateEventCompatibility, getCompatibleSharedEvents } from "../src/event-compatibility.mjs";

const create=mode=>createInitialState(createGirlfriendFromProfile("haeun",()=>.5),()=>.5,{mode});
const setPath=(object,path,value)=>{const keys=path.split(".");let cursor=object;for(const key of keys.slice(0,-1))cursor=cursor[key]??={};cursor[keys.at(-1)]=value;};
const compatibleStateFor=event=>{
  const state=create(GAME_MODES.MARRIAGE_30);state.day=event.dayRange?.[0]??10;state.phase=3;state.storyFlags={};state.actionHistory=[];
  if(event.heroineIds?.length)state.partner.heroineId=event.heroineIds[0];
  if(event.excludedHeroineIds?.includes(state.partner.heroineId))state.partner.heroineId="compatible-heroine";
  for(const condition of event.conditions??[]){if(condition.recentTag){state.actionHistory.push({day:state.day,tag:condition.recentTag});continue;}setPath(state,condition.stat,condition.value);}
  const unlockContext={phoneUnlocked:true,financeUnlocked:true,jobUnlocked:true,mapUnlocked:true,healthRiskAllowed:true,npcIntroduced:event.npcRequirements??[]};
  const probe=evaluateEventCompatibility(state,event,unlockContext);
  return {state,context:{occurrence:"free-action-result",location:probe.allowedLocations[0]??"home",phase:probe.allowedPhases[0]??"night",...unlockContext}};
};

assert.equal(FREE_MODE_EVENT_CATALOG.length,63);
assert.equal(SHARED_EVENT_CATALOG.length,70);
assert.equal(new Set(SHARED_EVENT_CATALOG.map(event=>event.id)).size,70);
for(const event of FREE_MODE_EVENT_CATALOG){
  const {state,context}=compatibleStateFor(event),result=evaluateEventCompatibility(state,event,context);
  assert.equal(typeof result.eligible,"boolean",event.id);
  assert.ok(Array.isArray(result.blocks),event.id);
  assert.ok(Array.isArray(result.allowedLocations),event.id);
  assert.ok(Array.isArray(result.allowedPhases),event.id);
}

const day1=create(GAME_MODES.MARRIAGE_30);beginStoryFreeAction(day1);
const candidates=getCompatibleSharedEvents(day1,{occurrence:"free-action-result",location:"hospital",phase:"evening"});
const expectedDay1=CONTEXTUAL_SHARED_EVENTS.filter(event=>evaluateEventCompatibility(day1,event,{occurrence:"free-action-result",location:"hospital",phase:"evening"}).eligible);
assert.deepEqual(candidates.map(event=>event.id).sort(),expectedDay1.map(event=>event.id).sort());
assert.equal(expectedDay1.length,3);
for(const event of FREE_MODE_EVENT_CATALOG)assert.equal(candidates.some(candidate=>candidate.id===event.id),false,event.id);
assert.equal(getCompatibleSharedEvents(day1,{occurrence:"story-dialogue",location:"hospital",phase:"evening"}).length,0);

let roll=0;const first=rollStoryFreeActionEvent(day1,()=>roll++===0?.1:0);assert.ok(first);assert.equal(day1.eventCompatibility.dailyCounts["1"],1);
assert.equal(rollStoryFreeActionEvent(day1,()=>0),null);
assert.equal(day1.eventHistory.filter(record=>record.origin==="story-free-action").length,1);

const free=create(GAME_MODES.FREE_ROMANCE);free.phase=1;
assert.deepEqual(getEligibleMicroEvents(free).map(event=>event.id),MICRO_EVENTS.filter(event=>event.phases.includes(1)).map(event=>event.id));

const values=new Map(),storage={getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)};
SaveManager.save(day1,storage);const loaded=SaveManager.load(storage);
assert.equal(loaded.eventCompatibility.dailyCounts["1"],1);assert.equal(loaded.eventCompatibility.lastSelected,day1.eventCompatibility.lastSelected);

console.log("✓ FREE 63개 공용 이벤트·DAY 1 병원 3개 후보·스토리 중간 차단·예산·저장·FREE 회귀 PASS");
