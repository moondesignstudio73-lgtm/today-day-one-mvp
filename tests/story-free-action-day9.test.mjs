import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createInitialState } from "../src/game-core.mjs";
import { createGirlfriendFromProfile } from "../src/girlfriend-manager.mjs";
import { SaveManager } from "../src/save-manager.mjs";
import { GAME_MODES } from "../src/scenario-state.mjs";
import { resolveSituationEventChoice } from "../src/situation-event-manager.mjs";
import { DAY9_HOME_ACTIONS, beginStoryFreeAction, completeStoryFreeAction, getStoryFeatureAvailability, getStoryFreeActions, markStoryFreeActionEventComplete, resolveStoryFreeAction } from "../src/story-free-action-manager.mjs";
import { FREE_MODE_EVENT_CATALOG, getCompatibleSharedEvents, getEventCompatibilityDiagnostics, getSharedEventById } from "../src/event-compatibility.mjs";

const create=()=>{const state=createInitialState(createGirlfriendFromProfile("haeun",()=>.5),()=>.5,{mode:GAME_MODES.MARRIAGE_30});state.day=9;state.storyFlags={day9RuntimeComplete:true,day9SecondOfficeAdaptationCompleted:true,day10ThreeHourWorkRhythmPending:true,haeun_contact_unlocked:true};state.scenario.unlockedActions.push("smartphone-basic","day5-work-trial","past-contacts-index","current-life-map","review-current-queue","bounded-office-contribution","current-coworker-lunch");state.scenario.introducedNpcIds.push("female-coworker","team-lead","office-best-male");state.storyHistory.push({sceneId:"m30-day9-second-office-adaptation",arc:"두 번째 직장 적응",choiceId:"office9_debrief_write_protocol",day:9,response:"현재 업무와 관계 피드백을 분리했다."});return state;};
const context={occurrence:"free-action-result",location:"home",phase:"evening",activeStoryId:"m30-day9-second-office-adaptation",phoneUnlocked:true,financeUnlocked:false,jobUnlocked:true,mapUnlocked:true,healthRiskAllowed:false};
const storage=()=>{const values=new Map();return {getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)}};

assert.equal(FREE_MODE_EVENT_CATALOG.length,63);assert.equal(DAY9_HOME_ACTIONS.length,5);
const state=create(),progress=beginStoryFreeAction(state,"day9-home-evening");
assert.equal(progress.location,"home");assert.equal(progress.phase,"evening");assert.equal(state.currentLocation,"home");assert.equal(state.phase,2);
assert.equal(getStoryFreeActions(state).length,5);assert.equal(getStoryFeatureAvailability(state,"job").available,true);assert.equal(getStoryFeatureAvailability(state,"contacts").available,true);assert.equal(getStoryFeatureAvailability(state,"investment").available,false);
assert.deepEqual(getCompatibleSharedEvents(state,context).map(event=>event.id),["date-cancelled","micro-sns-like","context-day9-home-separate-feedback"]);
assert.equal(getEventCompatibilityDiagnostics(state,{...context,occurrence:"story-dialogue"}).filter(event=>event.eligible).length,0);

let roll=0;const result=resolveStoryFreeAction(state,"separate-coworker-feedback",{random:()=>roll++===0?.1:0});
assert.equal(result.status,"EVENT");assert.equal(result.event.id,"context-day9-home-separate-feedback");assert.ok(result.event.scenes.length);assert.equal(result.event.choices.length,2);
assert.equal(state.eventCompatibility.dailyCounts["9"],1);assert.equal(state.situationEventStates[result.event.id].status,"ACTIVE");assert.equal(resolveStoryFreeAction(state,"rest-after-second-office"),null);
const choice=resolveSituationEventChoice(state,result.event,"split-work-and-social");assert.ok(choice);assert.equal(state.situationEventStates[result.event.id].status,"COMPLETED");
assert.equal(markStoryFreeActionEventComplete(state,result.event.id),true);assert.equal(state.storyFreeAction.status,"REPORT");assert.equal(completeStoryFreeAction(state),true);assert.equal(state.storyFlags.day9FreeActionComplete,true);assert.equal(completeStoryFreeAction(state),false);

const store=storage();SaveManager.save(state,store);const loaded=SaveManager.load(store);assert.equal(loaded.storyFreeAction.status,"COMPLETE");assert.equal(loaded.eventCompatibility.dailyCounts["9"],1);assert.equal(loaded.situationEventStates[result.event.id].choiceId,"split-work-and-social");assert.deepEqual(loaded.scenario.introducedNpcIds,["female-coworker","team-lead","office-best-male"]);assert.equal(getSharedEventById(result.event.id).id,result.event.id);

const noContribution=create();noContribution.scenario.unlockedActions=noContribution.scenario.unlockedActions.filter(id=>id!=="bounded-office-contribution");beginStoryFreeAction(noContribution,"day9-home-evening");assert.equal(getStoryFreeActions(noContribution).some(action=>action.id==="archive-ninety-minute-boundary"),false);assert.equal(getCompatibleSharedEvents(noContribution,context).some(event=>event.id==="context-day9-home-separate-feedback"),false);
const unknownNpc=create();unknownNpc.scenario.introducedNpcIds=[];beginStoryFreeAction(unknownNpc,"day9-home-evening");assert.equal(getCompatibleSharedEvents(unknownNpc,context).some(event=>event.id==="context-day9-home-separate-feedback"),false);
const noCompletion=create();delete noCompletion.storyFlags.day9RuntimeComplete;beginStoryFreeAction(noCompletion,"day9-home-evening");assert.equal(getCompatibleSharedEvents(noCompletion,context).some(event=>event.id==="context-day9-home-separate-feedback"),false);
const free=createInitialState(createGirlfriendFromProfile("haeun",()=>.5),()=>.5,{mode:GAME_MODES.FREE_ROMANCE});assert.equal(free.scenario.enabled,false);assert.equal(free.storyFreeAction,undefined);

const gameSource=readFileSync(new URL("../game.js",import.meta.url),"utf8");assert.match(gameSource,/completedSession\?\.id===LOCKED_DAY9_SCENE_ID[\s\S]*?day9FreeActionComplete/);assert.match(gameSource,/fromStoryFreeAction/);assert.match(gameSource,/getSharedEventById\(saved\.activeEvent\)/);
console.log("✓ DAY 9 집·저녁 자유행동·동료 피드백 분리 이벤트·NPC/직장 필터·저장·중첩·스토리 차단 PASS");
