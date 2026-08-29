import assert from "node:assert/strict";
import {createInitialState} from "../src/game-core.mjs";
import {createGirlfriendFromProfile} from "../src/girlfriend-manager.mjs";
import {GAME_MODES} from "../src/scenario-state.mjs";
import {SaveManager} from "../src/save-manager.mjs";
import {applyDay13V3Choice,beginDay13V3,getDay13V3Compatibility,getDay13V3RestoreContract,getNextDay13V3Choice,validateDay13V3Runtime} from "../src/day13-v3-runtime.mjs";

const makeState=()=>{const state=createInitialState(createGirlfriendFromProfile("haeun",()=>.5),()=>.5,{mode:GAME_MODES.MARRIAGE_30});state.day=13;state.storyFlags={day12V3Completed:true,day13OutsideViewPlanPending:true,day12V3DisclosureMismatch:"NONE"};state.scenario.seojinAffection=7;state.scenario.seojinStatusInterest=13;return state;};
const roundTrip=state=>{const values=new Map();const storage={getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)};SaveManager.save(state,storage);return SaveManager.load(storage,GAME_MODES.MARRIAGE_30);};

assert.equal(validateDay13V3Runtime(),true);
const legacy=makeState();legacy.storyFlags.day13RuntimeStage=2;legacy.storyFlags.day13ContributionStrategy="budget13_contribution_item_owner";const legacyCopy=JSON.stringify(legacy.storyFlags);assert.deepEqual(beginDay13V3(legacy),{mode:"V1_LEGACY",complete:false,checkpoint:2});assert.equal(JSON.stringify(legacy.storyFlags),legacyCopy);

let state=makeState();assert.deepEqual(beginDay13V3(state,{relationshipBand:"VERY_HIGH"}),{mode:"V3",complete:false,checkpoint:1});assert.equal(state.storyFlags.day13V3RelationshipBand,"HIGH");
const path=["day13_go_seoul_forest","day13_photo_without_perfection","day13_intro_reseeing_familiar","day13_move_one_step","day13_rest_here","day13_portrait_one_then_decide","day13_work_relearning","day13_ask_photo_contact","day13_name_girlfriend","day13_exchange_photos","day13_tell_ara_meeting","day13_comfort_no_full_explanation"];
for(const id of path){const expected=getNextDay13V3Choice(state);assert.ok(expected.options.some(option=>option.id===id),id);applyDay13V3Choice(state,id);state=roundTrip(state);}
const restored=getDay13V3RestoreContract(state);assert.equal(restored.complete,true);assert.equal(restored.checkpoint,24);assert.equal(restored.day22Callback,"ARA_MET");assert.equal(restored.floraInvitation,true);assert.equal(restored.publicPostPermission,false);assert.equal(state.scenario.seojinAffection,7);assert.equal(state.scenario.seojinStatusInterest,13);assert.ok(state.scenario.followUpHooks.includes("day14-flower-desk-plan"));

let noAra=makeState();beginDay13V3(noAra,{relationshipBand:"LOW"});const noAraPath=["day13_walk_neighborhood","day13_photo_for_self","day13_keep_imperfect_photo","day13_leave_now","day13_stay_photographer","day13_work_resting_visit","day13_no_contact","day13_report_rest"];
for(const id of noAraPath){assert.notEqual(getNextDay13V3Choice(noAra).number,3);applyDay13V3Choice(noAra,id);}
assert.equal(noAra.storyFlags.day13V3Completed,true);assert.equal(noAra.storyFlags.day13V3Day22Callback,"NO_ARA");assert.equal(noAra.storyFlags.day13V3Choice3,undefined);assert.equal(noAra.storyFlags.day13V3Choice8,undefined);assert.equal(noAra.storyFlags.day13V3Choice9,undefined);assert.equal(noAra.storyFlags.day13V3Choice12,undefined);
assert.throws(()=>applyDay13V3Choice(noAra,"day13_tell_ara_meeting"),/OUT_OF_ORDER/);
assert.equal(getDay13V3Compatibility({storyFlags:{}}).mode,"V3_NEW");
console.log("day13-v3-runtime-save.test: all assertions passed");
