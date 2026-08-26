import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createInitialState } from "../src/game-core.mjs";
import { createGirlfriendFromProfile } from "../src/girlfriend-manager.mjs";
import { SaveManager } from "../src/save-manager.mjs";
import { GAME_MODES } from "../src/scenario-state.mjs";
import { resolveSituationEventChoice } from "../src/situation-event-manager.mjs";
import { DAY10_HOME_ACTIONS, beginStoryFreeAction, completeStoryFreeAction, getStoryFeatureAvailability, getStoryFreeActions, markStoryFreeActionEventComplete, resolveStoryFreeAction } from "../src/story-free-action-manager.mjs";
import { FREE_MODE_EVENT_CATALOG, getCompatibleSharedEvents, getEventCompatibilityDiagnostics, getSharedEventById } from "../src/event-compatibility.mjs";

const create=()=>{const state=createInitialState(createGirlfriendFromProfile("haeun",()=>.5),()=>.5,{mode:GAME_MODES.MARRIAGE_30});state.day=10;state.storyFlags={day10RuntimeComplete:true,day10ThreeHourWorkRhythmCompleted:true,day11CurrentLifePlanPending:true,haeun_contact_unlocked:true};state.scenario.unlockedActions.push("smartphone-basic","day5-work-trial","past-contacts-index","current-life-map","three-hour-work-rhythm","current-coworker-lunch-record","separate-work-recovery-social");state.scenario.introducedNpcIds.push("female-coworker","team-lead","office-best-male");state.storyHistory.push({sceneId:"m30-day10-three-hour-work-rhythm",arc:"세 시간이라는 현재",choiceId:"work10_debrief_separate_scores",day:10,response:"세 기록을 분리했다."});return state;};
const context={occurrence:"free-action-result",location:"home",phase:"evening",activeStoryId:"m30-day10-three-hour-work-rhythm",phoneUnlocked:true,financeUnlocked:false,jobUnlocked:true,mapUnlocked:true,healthRiskAllowed:false};
const storage=()=>{const values=new Map();return {getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)}};

assert.equal(FREE_MODE_EVENT_CATALOG.length,63);assert.equal(DAY10_HOME_ACTIONS.length,5);
const state=create(),progress=beginStoryFreeAction(state,"day10-home-evening");assert.equal(progress.location,"home");assert.equal(progress.phase,"evening");assert.equal(state.currentLocation,"home");assert.equal(state.phase,2);
assert.equal(getStoryFreeActions(state).length,5);assert.equal(getStoryFeatureAvailability(state,"job").available,true);assert.equal(getStoryFeatureAvailability(state,"investment").available,false);
assert.deepEqual(getCompatibleSharedEvents(state,context).map(event=>event.id),["date-cancelled","micro-sns-like","context-day10-home-three-score-report"]);assert.equal(getEventCompatibilityDiagnostics(state,{...context,occurrence:"story-dialogue"}).filter(event=>event.eligible).length,0);

let roll=0;const result=resolveStoryFreeAction(state,"separate-three-daily-scores",{random:()=>roll++===0?.1:0});assert.equal(result.status,"EVENT");assert.equal(result.event.id,"context-day10-home-three-score-report");assert.ok(result.event.scenes.length);assert.equal(result.event.choices.length,2);
assert.equal(state.eventCompatibility.dailyCounts["10"],1);assert.equal(resolveStoryFreeAction(state,"rest-after-three-hour-work"),null);const choice=resolveSituationEventChoice(state,result.event,"confirm-three-separate-records");assert.ok(choice);
assert.equal(markStoryFreeActionEventComplete(state,result.event.id),true);assert.equal(completeStoryFreeAction(state),true);assert.equal(state.storyFlags.day10FreeActionComplete,true);assert.equal(completeStoryFreeAction(state),false);
const store=storage();SaveManager.save(state,store);const loaded=SaveManager.load(store);assert.equal(loaded.storyFreeAction.status,"COMPLETE");assert.equal(loaded.eventCompatibility.dailyCounts["10"],1);assert.equal(loaded.situationEventStates[result.event.id].choiceId,"confirm-three-separate-records");assert.equal(getSharedEventById(result.event.id).id,result.event.id);

const noFeature=create();noFeature.scenario.unlockedActions=noFeature.scenario.unlockedActions.filter(id=>id!=="separate-work-recovery-social");beginStoryFreeAction(noFeature,"day10-home-evening");assert.equal(getStoryFreeActions(noFeature).some(action=>action.id==="separate-three-daily-scores"),false);assert.equal(getCompatibleSharedEvents(noFeature,context).some(event=>event.id==="context-day10-home-three-score-report"),false);
const unknownNpc=create();unknownNpc.scenario.introducedNpcIds=[];beginStoryFreeAction(unknownNpc,"day10-home-evening");assert.equal(getCompatibleSharedEvents(unknownNpc,context).some(event=>event.id==="context-day10-home-three-score-report"),false);
const incomplete=create();delete incomplete.storyFlags.day10RuntimeComplete;beginStoryFreeAction(incomplete,"day10-home-evening");assert.equal(getCompatibleSharedEvents(incomplete,context).some(event=>event.id==="context-day10-home-three-score-report"),false);
const free=createInitialState(createGirlfriendFromProfile("haeun",()=>.5),()=>.5,{mode:GAME_MODES.FREE_ROMANCE});assert.equal(free.scenario.enabled,false);assert.equal(free.storyFreeAction,undefined);
const gameSource=readFileSync(new URL("../game.js",import.meta.url),"utf8");assert.match(gameSource,/completedSession\?\.id===LOCKED_DAY10_SCENE_ID[\s\S]*?day10FreeActionComplete/);assert.match(gameSource,/fromStoryFreeAction/);assert.match(gameSource,/getSharedEventById\(saved\.activeEvent\)/);
console.log("✓ DAY 10 집·저녁 자유행동·세 칸 보고 이벤트·NPC/직장 필터·저장·중첩·스토리 차단 PASS");
