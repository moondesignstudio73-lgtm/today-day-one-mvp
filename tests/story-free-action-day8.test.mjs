import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createInitialState } from "../src/game-core.mjs";
import { createGirlfriendFromProfile } from "../src/girlfriend-manager.mjs";
import { SaveManager } from "../src/save-manager.mjs";
import { GAME_MODES } from "../src/scenario-state.mjs";
import { resolveSituationEventChoice } from "../src/situation-event-manager.mjs";
import { DAY8_HOME_ACTIONS, DAY8_V3_HOME_ACTIONS, beginStoryFreeAction, completeStoryFreeAction, getStoryFeatureAvailability, getStoryFreeActions, markStoryFreeActionEventComplete, resolveStoryFreeAction } from "../src/story-free-action-manager.mjs";
import { FREE_MODE_EVENT_CATALOG, getCompatibleSharedEvents, getEventCompatibilityDiagnostics, getSharedEventById } from "../src/event-compatibility.mjs";

const create=()=>{const state=createInitialState(createGirlfriendFromProfile("haeun",()=>.5),()=>.5,{mode:GAME_MODES.MARRIAGE_30});state.day=8;state.storyFlags={day8RuntimeComplete:true,day8IndependentErrandCompleted:true,day8CurrentHouseholdChoiceSaved:true,day8ReturnDebriefSaved:true,day8OriginalPhoneAtHospital:true,day9SecondOfficeAdaptationPending:true,haeun_contact_unlocked:true};state.scenario.unlockedActions.push("smartphone-basic","day5-work-trial","past-contacts-index","current-life-map","independent-neighborhood-errand","review-current-mail","prepare-limited-office-return");state.storyHistory.push({sceneId:"m30-day8-independent-errand",arc:"첫 독립 심부름",choiceId:"day8_return_debrief",day:8,response:"독립 심부름 결과를 공유했다."});return state;};
const context={occurrence:"free-action-result",location:"home",phase:"evening",activeStoryId:"m30-day8-independent-errand",phoneUnlocked:true,financeUnlocked:false,jobUnlocked:true,mapUnlocked:true,healthRiskAllowed:false};
const storage=()=>{const values=new Map();return {getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)}};

assert.equal(FREE_MODE_EVENT_CATALOG.length,64);assert.equal(DAY8_HOME_ACTIONS.length,5);
const state=create(),progress=beginStoryFreeAction(state,"day8-home-evening");
assert.equal(progress.location,"home");assert.equal(progress.phase,"evening");assert.equal(state.currentLocation,"home");assert.equal(state.phase,2);
assert.equal(getStoryFreeActions(state).length,5);assert.equal(getStoryFeatureAvailability(state,"map").available,true);assert.equal(getStoryFeatureAvailability(state,"contacts").available,true);assert.equal(getStoryFeatureAvailability(state,"investment").available,false);
assert.deepEqual(getCompatibleSharedEvents(state,context).map(event=>event.id),["date-cancelled","micro-sns-like","context-day8-home-mail-deadline"]);
assert.equal(getEventCompatibilityDiagnostics(state,{...context,occurrence:"story-dialogue"}).filter(event=>event.eligible).length,0);

let roll=0;const result=resolveStoryFreeAction(state,"file-current-mail",{random:()=>roll++===0?.1:0});
assert.equal(result.status,"EVENT");assert.equal(result.event.id,"context-day8-home-mail-deadline");assert.ok(result.event.scenes.length);assert.equal(result.event.choices.length,2);
assert.equal(state.eventCompatibility.dailyCounts["8"],1);assert.equal(state.situationEventStates[result.event.id].status,"ACTIVE");assert.equal(resolveStoryFreeAction(state,"rest-after-independent-errand"),null);
const choice=resolveSituationEventChoice(state,result.event,"file-by-deadline");assert.ok(choice);assert.equal(state.situationEventStates[result.event.id].status,"COMPLETED");
assert.equal(markStoryFreeActionEventComplete(state,result.event.id),true);assert.equal(state.storyFreeAction.status,"REPORT");assert.equal(completeStoryFreeAction(state),true);assert.equal(state.storyFlags.day8FreeActionComplete,true);assert.equal(completeStoryFreeAction(state),false);

const store=storage();SaveManager.save(state,store);const loaded=SaveManager.load(store);assert.equal(loaded.storyFreeAction.status,"COMPLETE");assert.equal(loaded.eventCompatibility.dailyCounts["8"],1);assert.equal(loaded.situationEventStates[result.event.id].choiceId,"file-by-deadline");assert.equal(getSharedEventById(result.event.id).id,result.event.id);

const noMail=create();noMail.scenario.unlockedActions=noMail.scenario.unlockedActions.filter(id=>id!=="review-current-mail");beginStoryFreeAction(noMail,"day8-home-evening");assert.equal(getStoryFreeActions(noMail).some(action=>action.id==="file-current-mail"),false);assert.equal(getCompatibleSharedEvents(noMail,context).some(event=>event.id==="context-day8-home-mail-deadline"),false);
const noCompletion=create();delete noCompletion.storyFlags.day8RuntimeComplete;beginStoryFreeAction(noCompletion,"day8-home-evening");assert.equal(getCompatibleSharedEvents(noCompletion,context).some(event=>event.id==="context-day8-home-mail-deadline"),false);
const free=createInitialState(createGirlfriendFromProfile("haeun",()=>.5),()=>.5,{mode:GAME_MODES.FREE_ROMANCE});assert.equal(free.scenario.enabled,false);assert.equal(free.storyFreeAction,undefined);

const gameSource=readFileSync(new URL("../game.js",import.meta.url),"utf8");assert.match(gameSource,/completedSession\?\.id===LOCKED_DAY8_SCENE_ID[\s\S]*?day8FreeActionComplete/);assert.match(gameSource,/fromStoryFreeAction/);assert.match(gameSource,/getSharedEventById\(saved\.activeEvent\)/);
const v3=create();v3.storyFlags.day8V3Complete=true;assert.equal(DAY8_V3_HOME_ACTIONS.length,5);assert.deepEqual(getStoryFreeActions(v3).map(action=>action.id),DAY8_V3_HOME_ACTIONS.map(action=>action.id));assert.equal(getStoryFreeActions(v3).some(action=>/독립 심부름|세제|직장 방문/.test(`${action.title} ${action.description}`)),false);assert.match(gameSource,/지훈의 현재 삶을 듣고 하은과 서로 다른 오후/);assert.match(gameSource,/DAY 9, 하은이 보낸 두 가지 옷 색상 질문/);
console.log("✓ DAY 8 집·저녁 자유행동·우편 기한 이벤트·저장·중첩·스토리 차단 PASS");
