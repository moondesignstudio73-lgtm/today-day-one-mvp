import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createInitialState } from "../src/game-core.mjs";
import { createGirlfriendFromProfile } from "../src/girlfriend-manager.mjs";
import { SaveManager } from "../src/save-manager.mjs";
import { GAME_MODES } from "../src/scenario-state.mjs";
import { resolveSituationEventChoice } from "../src/situation-event-manager.mjs";
import { DAY2_HOME_ACTIONS, beginStoryFreeAction, completeStoryFreeAction, getStoryFreeActions, markStoryFreeActionEventComplete, resolveStoryFreeAction } from "../src/story-free-action-manager.mjs";
import { FREE_MODE_EVENT_CATALOG, getCompatibleSharedEvents, getEventCompatibilityDiagnostics, getSharedEventById } from "../src/event-compatibility.mjs";

const create=()=>{const state=createInitialState(createGirlfriendFromProfile("haeun",()=>.5),()=>.5,{mode:GAME_MODES.MARRIAGE_30});state.day=2;state.storyFlags={day2RuntimeComplete:true,haeun_contact_unlocked:true};return state;};
const context={occurrence:"free-action-result",location:"home",phase:"evening",activeStoryId:"m30-day2-rehabilitation",phoneUnlocked:false,financeUnlocked:false,jobUnlocked:false,mapUnlocked:false,healthRiskAllowed:false};
const storage=()=>{const values=new Map();return {getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)}};

assert.equal(FREE_MODE_EVENT_CATALOG.length,63);
assert.equal(DAY2_HOME_ACTIONS.length,5);
const state=create(),progress=beginStoryFreeAction(state,"day2-home-evening");
assert.equal(progress.location,"home");assert.equal(progress.phase,"evening");assert.equal(state.currentLocation,"home");
assert.equal(getStoryFreeActions(state).length,5);
assert.deepEqual(getCompatibleSharedEvents(state,context).map(event=>event.id),["context-day2-home-haeun-check-in"]);
assert.equal(getEventCompatibilityDiagnostics(state,{...context,occurrence:"story-dialogue"}).filter(event=>event.eligible).length,0);

let roll=0;const result=resolveStoryFreeAction(state,"send-safe-arrival",{random:()=>roll++===0?.1:0});
assert.equal(result.status,"EVENT");assert.equal(result.event.id,"context-day2-home-haeun-check-in");assert.ok(result.event.scenes.length);assert.ok(result.event.choices.length);
assert.equal(state.eventCompatibility.dailyCounts["2"],1);assert.equal(state.situationEventStates[result.event.id].status,"ACTIVE");
const choice=resolveSituationEventChoice(state,result.event,"confirm-and-rest");assert.ok(choice);assert.equal(state.situationEventStates[result.event.id].status,"COMPLETED");
assert.equal(markStoryFreeActionEventComplete(state,result.event.id),true);assert.equal(state.storyFreeAction.status,"REPORT");
assert.equal(completeStoryFreeAction(state),true);assert.equal(state.storyFlags.day2FreeActionComplete,true);assert.equal(completeStoryFreeAction(state),false);

const store=storage();SaveManager.save(state,store);const loaded=SaveManager.load(store);assert.equal(loaded.storyFreeAction.status,"COMPLETE");assert.equal(loaded.eventCompatibility.dailyCounts["2"],1);assert.equal(loaded.situationEventStates[result.event.id].choiceId,"confirm-and-rest");
assert.equal(getSharedEventById(result.event.id).id,result.event.id);

const noContact=create();delete noContact.storyFlags.haeun_contact_unlocked;beginStoryFreeAction(noContact,"day2-home-evening");assert.equal(getStoryFreeActions(noContact).some(action=>action.id==="send-safe-arrival"),false);assert.equal(getCompatibleSharedEvents(noContact,context).length,0);

const gameSource=readFileSync(new URL("../game.js",import.meta.url),"utf8");
assert.match(gameSource,/completedSession\?\.id===LOCKED_DAY2_SCENE_ID[\s\S]*?day2FreeActionComplete/);
assert.match(gameSource,/fromStoryFreeAction/);assert.match(gameSource,/getSharedEventById\(saved\.activeEvent\)/);
console.log("✓ DAY 2 집 자유행동 5종·공용 이벤트 실제 장면·저장 복원·중첩·스토리 중 차단 PASS");
