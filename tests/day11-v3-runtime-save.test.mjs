import assert from "node:assert/strict";
import {createInitialState} from "../src/game-core.mjs";
import {createGirlfriendFromProfile} from "../src/girlfriend-manager.mjs";
import {GAME_MODES} from "../src/scenario-state.mjs";
import {SaveManager} from "../src/save-manager.mjs";
import {DAY11_V3_CHOICES} from "../src/day11-v3-campaign-data.mjs";
import {applyDay11V3Choice,beginDay11V3,getDay11V3Compatibility,getDay11V3RestoreContract,getNextDay11V3Choice,validateDay11V3Runtime} from "../src/day11-v3-runtime.mjs";

const storage=()=>{const data=new Map();return {getItem:key=>data.get(key)??null,setItem:(key,value)=>data.set(key,value),removeItem:key=>data.delete(key)};};
const roundTrip=state=>{const store=storage();SaveManager.save(state,store);return SaveManager.load(store,GAME_MODES.MARRIAGE_30);};
function makeState(){const state=createInitialState(createGirlfriendFromProfile("haeun",()=>.5),()=>.5,{mode:GAME_MODES.MARRIAGE_30});state.day=11;state.affection=30;state.trust=30;state.scenario.seojinAffection=7;state.scenario.seojinStatusInterest=13;return state;}
function play(state,ids){for(const id of ids)applyDay11V3Choice(state,id);return state;}

assert.equal(validateDay11V3Runtime(),true);

let attending=makeState();attending.storyFlags.day10V3HaeunAgreesToSoraGreeting=true;attending.storyFlags.day10V3SoraConsents=true;attending.storyFlags.day10V3GreenShirtOwned=true;attending.storyFlags.day10V3PriorHandHold=true;
assert.deepEqual(beginDay11V3(attending,{relationshipBand:"HIGH"}),{mode:"V3",complete:false,checkpoint:1});
const protectedSeojin={affection:attending.scenario.seojinAffection,status:attending.scenario.seojinStatusInterest};
play(attending,["day11_attend_at_agreed_time","day11_wear_haeun_preference_if_owned","day11_ask_before_shared_bread"]);
assert.equal(getNextDay11V3Choice(attending).number,4);assert.equal(attending.storyFlags.day11V3HaeunPreferredOutfitWorn,true);assert.equal(attending.storyFlags.day11V3OutfitPurchasedToday,false);assert.equal(attending.storyFlags.day11V3FirstHourRespected,true);
attending=roundTrip(attending);assert.equal(getDay11V3RestoreContract(attending).nextChoiceNumber,4);
play(attending,["day11_say_still_learning","day11_want_safe_conversation","day11_ask_her_current_wish","day11_listen_as_newcomer","day11_ask_haeun_today","day11_support_haeun_choice","day11_invite_short_walk","day11_prepare_questions"]);
assert.equal(attending.storyFlags.day11V3Complete,true);assert.equal(attending.storyFlags.day11V3AttendedSoraMeeting,true);assert.equal(attending.storyFlags.day11V3TripDisclosed,true);assert.equal(attending.storyFlags.day11V3HeardSiwooName,true);assert.equal(attending.storyFlags.day11V3CompanionUndecided,true);assert.equal(attending.storyFlags.day11V3ShoulderLeanOccurred,true);assert.equal(attending.storyFlags.day11V3WorkVisitTime,"10:00");assert.equal(attending.storyFlags.day11V3WorkVisitMaxHours,3);assert.equal(attending.storyFlags.day11V3WorkIncludesLunch,true);assert.equal(attending.storyFlags.day11V3PreparedQuestion,true);assert.deepEqual({affection:attending.scenario.seojinAffection,status:attending.scenario.seojinStatusInterest},protectedSeojin);
for(const id of ["day11-haeun-cancelled-sora-trip","day11-siwoo-exhibition-schedule"])assert.ok(attending.scenario.clues.includes(id),id);
assert.ok(attending.scenario.followUpHooks.includes("day12-company-adaptation-visit"));
const completeContract=getDay11V3RestoreContract(roundTrip(attending));assert.equal(completeContract.complete,true);assert.equal(completeContract.shoulderLean,true);assert.deepEqual(completeContract.workVisit,{time:"10:00",maxHours:3,includesLunch:true,preparedQuestion:true});

let declined=makeState();beginDay11V3(declined,{relationshipBand:"HIGH",haeunConsent:true,soraConsent:true,priorNaturalContact:true});
play(declined,["day11_leave_friends_alone","day11_wear_personal_comfort","day11_wait_without_purchase"]);
assert.equal(getNextDay11V3Choice(declined).number,6);assert.throws(()=>applyDay11V3Choice(declined,"day11_say_still_learning"),/OUT_OF_ORDER|ATTENDING_ONLY/);
play(declined,["day11_name_haeun_complexity","day11_ask_why_title_worked","day11_admit_waiting_for_praise","day11_ask_if_alone_with_siwoo","day11_say_like_more","day11_stop_and_rest"]);
assert.equal(declined.storyFlags.day11V3AttendedSoraMeeting,false);assert.equal(declined.storyFlags.day11V3PlayerDeclined,true);assert.equal(declined.storyFlags.day11V3ShoulderLeanOccurred,false);assert.equal(declined.storyFlags.day11V3PreparedQuestion,false);assert.equal(getDay11V3RestoreContract(roundTrip(declined)).attended,false);

let unresolved=makeState();beginDay11V3(unresolved,{relationshipBand:"HIGH",haeunConsent:true,soraConsent:true,priorNaturalContact:true,unresolvedConflict:true});
for(const choice of DAY11_V3_CHOICES)applyDay11V3Choice(unresolved,choice.options[0].id);
assert.equal(unresolved.storyFlags.day11V3ShoulderLeanOccurred,false);

const legacy=makeState();legacy.storyFlags={day11CurrentLifePlanPending:false,day11CurrentLifePlanCompleted:true,day11RuntimeStage:3,day11AnchorStrategy:"life11_anchor_recovery",day11ConflictStrategy:"life11_conflict_owner_decides",day11ShareStrategy:"life11_share_changes_only"};const before=structuredClone(legacy.storyFlags);
assert.deepEqual(beginDay11V3(legacy,{relationshipBand:"HIGH",haeunConsent:true,soraConsent:true}),{mode:"V1_LEGACY",complete:true,checkpoint:3});assert.deepEqual(legacy.storyFlags,before);assert.equal(getDay11V3Compatibility(roundTrip(legacy)).mode,"V1_LEGACY");

console.log("day11-v3-runtime-save.test: all assertions passed");
