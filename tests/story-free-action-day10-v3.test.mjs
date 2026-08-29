import assert from "node:assert/strict";
import {createInitialState} from "../src/game-core.mjs";
import {createGirlfriendFromProfile} from "../src/girlfriend-manager.mjs";
import {SaveManager} from "../src/save-manager.mjs";
import {GAME_MODES} from "../src/scenario-state.mjs";
import {DAY10_V3_HOME_ACTIONS,beginStoryFreeAction,completeStoryFreeAction,getStoryFreeActions,resolveStoryFreeAction,validateStoryFreeActionData} from "../src/story-free-action-manager.mjs";

const state=createInitialState(createGirlfriendFromProfile("haeun",()=>.5),()=>.5,{mode:GAME_MODES.MARRIAGE_30});state.day=10;state.storyFlags={day10RuntimeComplete:true,day10V3Complete:true,day10V3Conflict:false,day10V3SoraInvitationStatus:"PRIVATE_MEETING"};
assert.equal(validateStoryFreeActionData(),true);assert.equal(DAY10_V3_HOME_ACTIONS.length,5);beginStoryFreeAction(state,"day10-home-evening");
const actions=getStoryFreeActions(state);assert.deepEqual(actions.map(action=>action.id),DAY10_V3_HOME_ACTIONS.map(action=>action.id));assert.equal(actions.some(action=>/직장|서진|동료|근무|세 시간/.test(`${action.title} ${action.description}`)),false);assert.match(actions.find(action=>action.id==="prepare-day11-sora-consent").description,/소라가 직접 괜찮다고/);
const result=resolveStoryFreeAction(state,"record-day10-haeun-schedule",{random:()=>.99});assert.ok(result);assert.equal(state.storyFlags.day10_v3_free_haeun_schedule,true);if(state.storyFreeAction.status==="EVENT")throw new Error("DAY10_V3_UNEXPECTED_LEGACY_EVENT");assert.equal(completeStoryFreeAction(state),true);assert.equal(state.storyFlags.day10FreeActionComplete,true);
const values=new Map(),store={getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)};SaveManager.save(state,store);const loaded=SaveManager.load(store);assert.equal(loaded.storyFreeAction.status,"COMPLETE");assert.equal(getStoryFreeActions(loaded).some(action=>/직장|서진|동료|근무/.test(`${action.title} ${action.description}`)),false);
console.log("story-free-action-day10-v3.test: all assertions passed");
