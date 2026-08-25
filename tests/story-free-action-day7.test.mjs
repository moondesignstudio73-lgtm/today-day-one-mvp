import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createInitialState } from "../src/game-core.mjs";
import { createGirlfriendFromProfile } from "../src/girlfriend-manager.mjs";
import { SaveManager } from "../src/save-manager.mjs";
import { GAME_MODES } from "../src/scenario-state.mjs";
import { resolveSituationEventChoice } from "../src/situation-event-manager.mjs";
import { DAY7_HOME_ACTIONS, beginStoryFreeAction, completeStoryFreeAction, getStoryFeatureAvailability, getStoryFreeActions, markStoryFreeActionEventComplete, resolveStoryFreeAction } from "../src/story-free-action-manager.mjs";
import { FREE_MODE_EVENT_CATALOG, getCompatibleSharedEvents, getEventCompatibilityDiagnostics, getSharedEventById } from "../src/event-compatibility.mjs";

const create=()=>{const state=createInitialState(createGirlfriendFromProfile("haeun",()=>.5),()=>.5,{mode:GAME_MODES.MARRIAGE_30});state.day=7;state.storyFlags={day7RuntimeComplete:true,day7FirstPresentDateCompleted:true,day7ChangeSharedNotFailed:true,day8IndependentErrandPending:true,haeun_contact_unlocked:true};state.scenario.unlockedActions.push("smartphone-basic","day5-work-trial","past-contacts-index","current-life-map","review-present-date-memory","plan-independent-errand","shared-change-rule");state.storyHistory.push({sceneId:"m30-day7-first-present-date",arc:"오늘부터 우리의 데이트",choiceId:"date7_record_next_rule",day:7,response:"첫 현재형 데이트를 기록했다."});return state;};
const context={occurrence:"free-action-result",location:"home",phase:"evening",activeStoryId:"m30-day7-first-present-date",phoneUnlocked:true,financeUnlocked:false,jobUnlocked:true,mapUnlocked:true,healthRiskAllowed:false};
const storage=()=>{const values=new Map();return {getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)}};

assert.equal(FREE_MODE_EVENT_CATALOG.length,63);assert.equal(DAY7_HOME_ACTIONS.length,5);
const state=create(),progress=beginStoryFreeAction(state,"day7-home-evening");
assert.equal(progress.location,"home");assert.equal(progress.phase,"evening");assert.equal(state.currentLocation,"home");assert.equal(state.phase,2);
assert.equal(getStoryFreeActions(state).length,5);assert.equal(getStoryFeatureAvailability(state,"map").available,true);assert.equal(getStoryFeatureAvailability(state,"contacts").available,true);assert.equal(getStoryFeatureAvailability(state,"investment").available,false);
assert.deepEqual(getCompatibleSharedEvents(state,context).map(event=>event.id),["date-cancelled","micro-sns-like","context-day7-home-date-memory"]);
assert.equal(getEventCompatibilityDiagnostics(state,{...context,occurrence:"story-dialogue"}).filter(event=>event.eligible).length,0);

let roll=0;const result=resolveStoryFreeAction(state,"review-present-date-memory",{random:()=>roll++===0?.1:0});
assert.equal(result.status,"EVENT");assert.equal(result.event.id,"context-day7-home-date-memory");assert.ok(result.event.scenes.length);assert.equal(result.event.choices.length,2);
assert.equal(state.eventCompatibility.dailyCounts["7"],1);assert.equal(state.situationEventStates[result.event.id].status,"ACTIVE");assert.equal(resolveStoryFreeAction(state,"rest-after-first-date"),null);
const choice=resolveSituationEventChoice(state,result.event,"title-shared-change");assert.ok(choice);assert.equal(state.situationEventStates[result.event.id].status,"COMPLETED");
assert.equal(markStoryFreeActionEventComplete(state,result.event.id),true);assert.equal(state.storyFreeAction.status,"REPORT");assert.equal(completeStoryFreeAction(state),true);assert.equal(state.storyFlags.day7FreeActionComplete,true);assert.equal(completeStoryFreeAction(state),false);

const store=storage();SaveManager.save(state,store);const loaded=SaveManager.load(store);assert.equal(loaded.storyFreeAction.status,"COMPLETE");assert.equal(loaded.eventCompatibility.dailyCounts["7"],1);assert.equal(loaded.situationEventStates[result.event.id].choiceId,"title-shared-change");assert.equal(getSharedEventById(result.event.id).id,result.event.id);

const noMemory=create();noMemory.scenario.unlockedActions=noMemory.scenario.unlockedActions.filter(id=>id!=="review-present-date-memory");beginStoryFreeAction(noMemory,"day7-home-evening");assert.equal(getStoryFreeActions(noMemory).some(action=>action.id==="review-present-date-memory"),false);assert.equal(getCompatibleSharedEvents(noMemory,context).some(event=>event.id==="context-day7-home-date-memory"),false);
const noCompletion=create();delete noCompletion.storyFlags.day7RuntimeComplete;beginStoryFreeAction(noCompletion,"day7-home-evening");assert.equal(getCompatibleSharedEvents(noCompletion,context).some(event=>event.id==="context-day7-home-date-memory"),false);
const free=createInitialState(createGirlfriendFromProfile("haeun",()=>.5),()=>.5,{mode:GAME_MODES.FREE_ROMANCE});assert.equal(free.scenario.enabled,false);assert.equal(free.storyFreeAction,undefined);

const gameSource=readFileSync(new URL("../game.js",import.meta.url),"utf8");assert.match(gameSource,/completedSession\?\.id===LOCKED_DAY7_SCENE_ID[\s\S]*?day7FreeActionComplete/);assert.match(gameSource,/fromStoryFreeAction/);assert.match(gameSource,/getSharedEventById\(saved\.activeEvent\)/);
console.log("✓ DAY 7 집·저녁 자유행동·회복 제한·데이트 기록 이벤트·저장·중첩·스토리 차단 PASS");
