import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createInitialState } from "../src/game-core.mjs";
import { createGirlfriendFromProfile } from "../src/girlfriend-manager.mjs";
import { SaveManager } from "../src/save-manager.mjs";
import { GAME_MODES } from "../src/scenario-state.mjs";
import { resolveSituationEventChoice } from "../src/situation-event-manager.mjs";
import { DAY3_DISCHARGE_ACTIONS, beginStoryFreeAction, completeStoryFreeAction, getStoryFeatureAvailability, getStoryFreeActions, markStoryFreeActionEventComplete, resolveStoryFreeAction } from "../src/story-free-action-manager.mjs";
import { FREE_MODE_EVENT_CATALOG, getCompatibleSharedEvents, getEventCompatibilityDiagnostics, getSharedEventById } from "../src/event-compatibility.mjs";

const create=()=>{const state=createInitialState(createGirlfriendFromProfile("haeun",()=>.5),()=>.5,{mode:GAME_MODES.MARRIAGE_30});state.day=3;state.storyFlags={day3RuntimeComplete:true,haeun_contact_unlocked:true};state.scenario.unlockedActions.push("smartphone-basic");state.scenario.profileUnlocks.push("haeun-contact");state.storyHistory.push({sceneId:"m30-day3-discharge-phone",arc:"병원 밖으로",choiceId:"inspect-system-first",day:3,response:"확인 범위를 정했다."});return state;};
const context={occurrence:"free-action-result",location:"hospital",phase:"day",activeStoryId:"m30-day3-discharge-phone",phoneUnlocked:true,financeUnlocked:false,jobUnlocked:false,mapUnlocked:false,healthRiskAllowed:false};
const storage=()=>{const values=new Map();return {getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)}};

assert.equal(FREE_MODE_EVENT_CATALOG.length,63);
assert.equal(DAY3_DISCHARGE_ACTIONS.length,5);
const state=create(),progress=beginStoryFreeAction(state,"day3-discharge-room-day");
assert.equal(progress.location,"hospital");assert.equal(progress.phase,"day");assert.equal(state.currentLocation,"hospital");assert.equal(state.phase,1);
assert.equal(getStoryFreeActions(state).length,5);assert.equal(getStoryFeatureAvailability(state,"phone").available,true);assert.equal(getStoryFeatureAvailability(state,"investment").available,false);
assert.deepEqual(getCompatibleSharedEvents(state,context).map(event=>event.id),["micro-weather-rain","micro-lunch-photo","context-day3-discharge-safety-check"]);
assert.equal(getEventCompatibilityDiagnostics(state,{...context,occurrence:"story-dialogue"}).filter(event=>event.eligible).length,0);

let roll=0;const result=resolveStoryFreeAction(state,"set-medication-alarm",{random:()=>roll++===0?.1:0});
assert.equal(result.status,"EVENT");assert.equal(result.event.id,"context-day3-discharge-safety-check");assert.ok(result.event.scenes.length);assert.equal(result.event.choices.length,2);
assert.equal(state.eventCompatibility.dailyCounts["3"],1);assert.equal(state.situationEventStates[result.event.id].status,"ACTIVE");
assert.equal(resolveStoryFreeAction(state,"review-discharge-checklist"),null);
const choice=resolveSituationEventChoice(state,result.event,"save-hospital-first");assert.ok(choice);assert.equal(state.situationEventStates[result.event.id].status,"COMPLETED");
assert.equal(markStoryFreeActionEventComplete(state,result.event.id),true);assert.equal(state.storyFreeAction.status,"REPORT");
assert.equal(completeStoryFreeAction(state),true);assert.equal(state.storyFlags.day3FreeActionComplete,true);assert.equal(completeStoryFreeAction(state),false);

const store=storage();SaveManager.save(state,store);const loaded=SaveManager.load(store);assert.equal(loaded.storyFreeAction.status,"COMPLETE");assert.equal(loaded.eventCompatibility.dailyCounts["3"],1);assert.equal(loaded.situationEventStates[result.event.id].choiceId,"save-hospital-first");
assert.equal(getSharedEventById(result.event.id).id,result.event.id);

const locked=create();locked.scenario.unlockedActions=[];beginStoryFreeAction(locked,"day3-discharge-room-day");assert.equal(getStoryFreeActions(locked).some(action=>action.id==="set-medication-alarm"),false);assert.equal(getCompatibleSharedEvents(locked,context).some(event=>event.id==="context-day3-discharge-safety-check"),false);

const free=createInitialState(createGirlfriendFromProfile("haeun",()=>.5),()=>.5,{mode:GAME_MODES.FREE_ROMANCE});assert.equal(free.scenario.enabled,false);assert.equal(free.storyFreeAction,undefined);
const gameSource=readFileSync(new URL("../game.js",import.meta.url),"utf8");
assert.match(gameSource,/completedSession\?\.id==="m30-day3-discharge-phone"[\s\S]*?day3FreeActionComplete/);assert.match(gameSource,/fromStoryFreeAction/);assert.match(gameSource,/getSharedEventById\(saved\.activeEvent\)/);
console.log("✓ DAY 3 퇴원 병실 자유행동·휴대폰 해금·공용 이벤트 실제 장면·저장·중첩·스토리 차단 PASS");
