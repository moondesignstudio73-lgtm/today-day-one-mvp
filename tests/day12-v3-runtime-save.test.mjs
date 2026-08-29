import assert from "node:assert/strict";
import {createInitialState} from "../src/game-core.mjs";
import {createGirlfriendFromProfile} from "../src/girlfriend-manager.mjs";
import {GAME_MODES} from "../src/scenario-state.mjs";
import {SaveManager} from "../src/save-manager.mjs";
import {DAY12_V3_CHOICES} from "../src/day12-v3-campaign-data.mjs";
import {applyDay12V3Choice,beginDay12V3,getDay12V3Compatibility,getDay12V3PlayableScene,getDay12V3RestoreContract,getNextDay12V3Choice,validateDay12V3Runtime} from "../src/day12-v3-runtime.mjs";

const makeState=()=>{const state=createInitialState(createGirlfriendFromProfile("haeun",()=>.5),()=>.5,{mode:GAME_MODES.MARRIAGE_30});state.day=12;state.storyFlags={day11V3Complete:true,day12CompanyAdaptationVisitPending:true};state.scenario.seojinAffection=7;state.scenario.seojinStatusInterest=13;return state;};
const roundTrip=state=>{const values=new Map();const storage={getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)};SaveManager.save(state,storage);return SaveManager.load(storage,GAME_MODES.MARRIAGE_30);};

assert.equal(validateDay12V3Runtime(),true);
const legacy=makeState();legacy.storyFlags.day12RuntimeStage=2;legacy.storyFlags.day12VerifyStrategy="day12_verify_official";const legacyCopy=JSON.stringify(legacy.storyFlags);assert.deepEqual(beginDay12V3(legacy),{mode:"V1_LEGACY",complete:false,checkpoint:2});assert.equal(JSON.stringify(legacy.storyFlags),legacyCopy);

let state=makeState();assert.deepEqual(beginDay12V3(state,{relationshipBand:"VERY_HIGH",priorSeojinPhoto:true,priorSeojinPersonalInterest:true}),{mode:"V3",complete:false,checkpoint:1});assert.equal(state.storyFlags.day12V3RelationshipBand,"HIGH");assert.equal(getNextDay12V3Choice(state).number,1);
const selected=[0,2,1,0,2,1,1,1,1,0,1,0,1,2];
for(let index=0;index<12;index+=1){const choice=DAY12_V3_CHOICES[index];const beforeAffection=state.scenario.seojinAffection,beforeStatus=state.scenario.seojinStatusInterest;applyDay12V3Choice(state,choice.options[selected[index]].id);if(index===2){assert.equal(state.scenario.seojinStatusInterest,beforeStatus+1);assert.equal(state.scenario.seojinAffection,beforeAffection);}if(index===7){assert.equal(state.scenario.seojinAffection,beforeAffection+1);assert.equal(state.scenario.seojinStatusInterest,beforeStatus);}state=roundTrip(state);assert.equal(getDay12V3RestoreContract(state).nextChoiceNumber,index===11?13:index+2);}
assert.equal(state.storyFlags.day12V3PersonalInvitation,true);assert.equal(state.storyFlags.day12V3SeojinReply,"ACCEPTED_IN_PRINCIPLE");assert.equal(state.storyFlags.day12V3DisclosureMismatch,"NONE");
applyDay12V3Choice(state,DAY12_V3_CHOICES[12].options[selected[12]].id);state=roundTrip(state);assert.equal(state.storyFlags.day12V3SeojinIntent,"SPARK");assert.equal(state.storyFlags.day12V3HaeunNeedsSpace,true);assert.equal(getNextDay12V3Choice(state).number,14);
applyDay12V3Choice(state,DAY12_V3_CHOICES[13].options[selected[13]].id);state=roundTrip(state);const restored=getDay12V3RestoreContract(state);assert.equal(restored.complete,true);assert.equal(restored.day13Plan,"DECIDE_AFTER_REST");assert.equal(restored.checkpoint,24);assert.equal(state.storyFlags.day13OutsideViewPlanPending,true);assert.ok(state.scenario.followUpHooks.includes("day13-outside-view-plan"));assert.equal(getDay12V3PlayableScene(state,24).selectedBranches[0],"unresolvedEnding");

let noFollow=makeState();beginDay12V3(noFollow,{relationshipBand:"LOW"});for(let index=0;index<12;index+=1){const choice=DAY12_V3_CHOICES[index];const id=index===8?"day12_thank_as_colleague":index===11?"day12_claim_only_work":choice.options[0].id;applyDay12V3Choice(noFollow,id);}assert.equal(getNextDay12V3Choice(noFollow).number,14);assert.equal(noFollow.storyFlags.day12V3Choice13,undefined);assert.throws(()=>applyDay12V3Choice(noFollow,"day12_intent_colleague"),/OUT_OF_ORDER/);applyDay12V3Choice(noFollow,"day12_plan_neighborhood_walk");assert.deepEqual(getDay12V3PlayableScene(noFollow,24).selectedBranches,["comfortableEnding"]);

let contradiction=makeState();beginDay12V3(contradiction,{relationshipBand:"MID"});for(let index=0;index<12;index+=1){const choice=DAY12_V3_CHOICES[index];const id=index===8?"day12_invite_outside_work":index===10?"day12_tell_seojin_lunch":index===11?"day12_claim_only_work":choice.options[0].id;applyDay12V3Choice(contradiction,id);}assert.equal(contradiction.storyFlags.day12V3DisclosureMismatch,"EXPLICIT_CONTRADICTION");assert.ok(getDay12V3PlayableScene(contradiction,21).selectedBranches.includes("explicitContradiction"));
assert.equal(getDay12V3Compatibility({storyFlags:{}}).mode,"V3_NEW");assert.throws(()=>getDay12V3PlayableScene(makeState(),1),/NOT_STARTED/);assert.throws(()=>getDay12V3PlayableScene(state,25),/UNKNOWN/);
console.log("day12-v3-runtime-save.test: all assertions passed");
