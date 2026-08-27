import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createInitialState } from "../src/game-core.mjs";
import { createGirlfriendFromProfile } from "../src/girlfriend-manager.mjs";
import { SaveManager } from "../src/save-manager.mjs";
import { GAME_MODES } from "../src/scenario-state.mjs";
import { resolveSituationEventChoice } from "../src/situation-event-manager.mjs";
import { DAY4_HOME_ACTIONS, beginStoryFreeAction, completeStoryFreeAction, getStoryFeatureAvailability, getStoryFreeActions, markStoryFreeActionEventComplete, resolveStoryFreeAction } from "../src/story-free-action-manager.mjs";
import { FREE_MODE_EVENT_CATALOG, getCompatibleSharedEvents, getEventCompatibilityDiagnostics, getSharedEventById } from "../src/event-compatibility.mjs";

const create=()=>{const state=createInitialState(createGirlfriendFromProfile("haeun",()=>.5),()=>.5,{mode:GAME_MODES.MARRIAGE_30});state.day=4;state.phase=3;state.storyFlags={day4RuntimeComplete:true,day4WorkContactPending:true,day4TestimonyLedgerUnlocked:true,haeun_contact_unlocked:true};state.scenario.unlockedActions.push("smartphone-basic","testimony-ledger","friend-archive-followup","past-contacts-index","day5-work-contact");state.storyHistory.push({sceneId:"m30-day4-arrive-home",arc:"낯선 나의 집",choiceId:"map-home-basics",day:4,response:"증언 장부를 정리했다."});return state;};
const context={occurrence:"free-action-result",location:"home",phase:"night",activeStoryId:"m30-day4-arrive-home",phoneUnlocked:true,financeUnlocked:false,jobUnlocked:false,mapUnlocked:false,healthRiskAllowed:false};
const storage=()=>{const values=new Map();return {getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)}};

assert.equal(FREE_MODE_EVENT_CATALOG.length,64);assert.equal(DAY4_HOME_ACTIONS.length,5);
const state=create(),progress=beginStoryFreeAction(state,"day4-home-night");
assert.equal(progress.location,"home");assert.equal(progress.phase,"night");assert.equal(state.currentLocation,"home");assert.equal(state.phase,3);
assert.equal(getStoryFreeActions(state).length,5);assert.equal(getStoryFeatureAvailability(state,"phone").available,true);assert.equal(getStoryFeatureAvailability(state,"map").available,false);
assert.deepEqual(getCompatibleSharedEvents(state,context).map(event=>event.id),["date-cancelled","micro-sns-like","micro-night-call","context-day4-home-ledger-review"]);
assert.equal(getEventCompatibilityDiagnostics(state,{...context,occurrence:"story-dialogue"}).filter(event=>event.eligible).length,0);

let roll=0;const result=resolveStoryFreeAction(state,"finish-testimony-ledger",{random:()=>roll++===0?.1:0});
assert.equal(result.status,"EVENT");assert.equal(result.event.id,"context-day4-home-ledger-review");assert.ok(result.event.scenes.length);assert.equal(result.event.choices.length,2);
assert.equal(state.eventCompatibility.dailyCounts["4"],1);assert.equal(state.situationEventStates[result.event.id].status,"ACTIVE");assert.equal(resolveStoryFreeAction(state,"rest-after-social-recovery"),null);
const choice=resolveSituationEventChoice(state,result.event,"mark-shared-facts");assert.ok(choice);assert.equal(state.situationEventStates[result.event.id].status,"COMPLETED");
assert.equal(markStoryFreeActionEventComplete(state,result.event.id),true);assert.equal(state.storyFreeAction.status,"REPORT");assert.equal(completeStoryFreeAction(state),true);assert.equal(state.storyFlags.day4FreeActionComplete,true);assert.equal(completeStoryFreeAction(state),false);

const store=storage();SaveManager.save(state,store);const loaded=SaveManager.load(store);assert.equal(loaded.storyFreeAction.status,"COMPLETE");assert.equal(loaded.eventCompatibility.dailyCounts["4"],1);assert.equal(loaded.situationEventStates[result.event.id].choiceId,"mark-shared-facts");assert.equal(getSharedEventById(result.event.id).id,result.event.id);

const noLedger=create();noLedger.scenario.unlockedActions=noLedger.scenario.unlockedActions.filter(id=>id!=="testimony-ledger");beginStoryFreeAction(noLedger,"day4-home-night");assert.equal(getStoryFreeActions(noLedger).some(action=>action.id==="finish-testimony-ledger"),false);assert.equal(getCompatibleSharedEvents(noLedger,context).some(event=>event.id==="context-day4-home-ledger-review"),false);
const free=createInitialState(createGirlfriendFromProfile("haeun",()=>.5),()=>.5,{mode:GAME_MODES.FREE_ROMANCE});assert.equal(free.scenario.enabled,false);assert.equal(free.storyFreeAction,undefined);

const gameSource=readFileSync(new URL("../game.js",import.meta.url),"utf8");assert.match(gameSource,/completedSession\?\.id===LOCKED_DAY4_SCENE_ID[\s\S]*?day4FreeActionComplete/);assert.match(gameSource,/fromStoryFreeAction/);assert.match(gameSource,/getSharedEventById\(saved\.activeEvent\)/);
console.log("✓ DAY 4 집·밤 자유행동·공용 이벤트 실제 장면·저장·중첩·스토리 차단·FREE 회귀 PASS");
