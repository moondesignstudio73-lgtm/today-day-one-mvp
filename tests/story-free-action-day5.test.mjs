import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createInitialState } from "../src/game-core.mjs";
import { createGirlfriendFromProfile } from "../src/girlfriend-manager.mjs";
import { SaveManager } from "../src/save-manager.mjs";
import { GAME_MODES } from "../src/scenario-state.mjs";
import { resolveSituationEventChoice } from "../src/situation-event-manager.mjs";
import { DAY5_OFFICE_ACTIONS, beginStoryFreeAction, completeStoryFreeAction, getStoryFeatureAvailability, getStoryFreeActions, markStoryFreeActionEventComplete, resolveStoryFreeAction } from "../src/story-free-action-manager.mjs";
import { FREE_MODE_EVENT_CATALOG, getCompatibleSharedEvents, getEventCompatibilityDiagnostics, getSharedEventById } from "../src/event-compatibility.mjs";

const create=()=>{const state=createInitialState(createGirlfriendFromProfile("haeun",()=>.5),()=>.5,{mode:GAME_MODES.MARRIAGE_30});state.day=5;state.storyFlags={day5RuntimeComplete:true,day5ReturnPlanReady:true,haeun_contact_unlocked:true};state.scenario.unlockedActions.push("smartphone-basic","day5-team-map","day5-work-trial","day6-life-restart");state.scenario.profileUnlocks.push("seojin-basic");state.scenario.introducedNpcIds.push("female-coworker","team-lead","office-best-male");state.storyHistory.push({sceneId:"m30-day5-work-return",arc:"회사 복귀",choiceId:"set-return-boundary",day:5,response:"복귀 범위를 합의했다."});return state;};
const context={occurrence:"free-action-result",location:"office",phase:"evening",activeStoryId:"m30-day5-work-return",phoneUnlocked:true,financeUnlocked:false,jobUnlocked:true,mapUnlocked:false,healthRiskAllowed:false};
const storage=()=>{const values=new Map();return {getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)}};

assert.equal(FREE_MODE_EVENT_CATALOG.length,64);assert.equal(DAY5_OFFICE_ACTIONS.length,5);
const state=create(),progress=beginStoryFreeAction(state,"day5-office-evening");
assert.equal(progress.location,"office");assert.equal(progress.phase,"evening");assert.equal(state.currentLocation,"office");assert.equal(state.phase,2);
assert.equal(getStoryFreeActions(state).length,5);assert.equal(getStoryFeatureAvailability(state,"phone").available,true);assert.equal(getStoryFeatureAvailability(state,"job").available,true);assert.equal(getStoryFeatureAvailability(state,"investment").available,false);
assert.deepEqual(getCompatibleSharedEvents(state,context).map(event=>event.id),["date-cancelled","situation-late-dinner-coworker","micro-sns-like","context-day5-office-seojin-handoff"]);
assert.equal(getEventCompatibilityDiagnostics(state,{...context,occurrence:"story-dialogue"}).filter(event=>event.eligible).length,0);

let roll=0;const result=resolveStoryFreeAction(state,"archive-current-work-boundary",{random:()=>roll++===0?.1:0});
assert.equal(result.status,"EVENT");assert.equal(result.event.id,"context-day5-office-seojin-handoff");assert.ok(result.event.scenes.length);assert.equal(result.event.choices.length,2);
assert.equal(state.eventCompatibility.dailyCounts["5"],1);assert.equal(state.situationEventStates[result.event.id].status,"ACTIVE");assert.equal(resolveStoryFreeAction(state,"leave-office-on-time"),null);
const choice=resolveSituationEventChoice(state,result.event,"schedule-current-data");assert.ok(choice);assert.equal(state.situationEventStates[result.event.id].status,"COMPLETED");
assert.equal(markStoryFreeActionEventComplete(state,result.event.id),true);assert.equal(state.storyFreeAction.status,"REPORT");assert.equal(completeStoryFreeAction(state),true);assert.equal(state.storyFlags.day5FreeActionComplete,true);assert.equal(completeStoryFreeAction(state),false);

const store=storage();SaveManager.save(state,store);const loaded=SaveManager.load(store);assert.equal(loaded.storyFreeAction.status,"COMPLETE");assert.equal(loaded.eventCompatibility.dailyCounts["5"],1);assert.equal(loaded.situationEventStates[result.event.id].choiceId,"schedule-current-data");assert.deepEqual(loaded.scenario.introducedNpcIds,["female-coworker","team-lead","office-best-male"]);assert.equal(getSharedEventById(result.event.id).id,result.event.id);

const unknownNpc=create();unknownNpc.scenario.introducedNpcIds=[];beginStoryFreeAction(unknownNpc,"day5-office-evening");assert.equal(getCompatibleSharedEvents(unknownNpc,context).some(event=>event.id==="context-day5-office-seojin-handoff"),false);
const noJob=create();noJob.scenario.unlockedActions=noJob.scenario.unlockedActions.filter(id=>id!=="day5-work-trial");beginStoryFreeAction(noJob,"day5-office-evening");assert.equal(getStoryFreeActions(noJob).some(action=>action.id==="archive-current-work-boundary"),false);assert.equal(getCompatibleSharedEvents(noJob,context).some(event=>event.id==="context-day5-office-seojin-handoff"),false);
const free=createInitialState(createGirlfriendFromProfile("haeun",()=>.5),()=>.5,{mode:GAME_MODES.FREE_ROMANCE});assert.equal(free.scenario.enabled,false);assert.equal(free.storyFreeAction,undefined);

const gameSource=readFileSync(new URL("../game.js",import.meta.url),"utf8");assert.match(gameSource,/completedSession\?\.id===LOCKED_DAY5_SCENE_ID[\s\S]*?day5FreeActionComplete/);assert.match(gameSource,/fromStoryFreeAction/);assert.match(gameSource,/getSharedEventById\(saved\.activeEvent\)/);
console.log("✓ DAY 5 회사·저녁 자유행동·NPC 소개·직장 필터·실제 이벤트·저장·중첩·FREE 회귀 PASS");
