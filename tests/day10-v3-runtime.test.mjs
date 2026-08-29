import assert from "node:assert/strict";
import {DAY10_V3_CHOICES,DAY10_V3_FOLLOW_UP_CHOICE,DAY10_V3_SCENES,validateDay10V3CampaignData} from "../src/day10-v3-campaign-data.mjs";
import {applyDay10V3Choice,applyDay10V3FollowUpChoice,beginDay10V3,getDay10V3Compatibility,getDay10V3SceneMetadata,getNextDay10V3Choice,resolveDay10V3ShoppingSpend,resolveDay10V3SoraInvitation,validateDay10V3Runtime} from "../src/day10-v3-runtime.mjs";

assert.equal(validateDay10V3CampaignData(),true);assert.equal(validateDay10V3Runtime(),true);
assert.equal(DAY10_V3_SCENES.length,24);assert.deepEqual(DAY10_V3_SCENES.map(item=>item.number),Array.from({length:24},(_,index)=>index+1));
assert.equal(DAY10_V3_CHOICES.length,11);assert.equal(DAY10_V3_CHOICES.flatMap(item=>item.options).length,33);assert.equal(DAY10_V3_FOLLOW_UP_CHOICE.options.length,2);assert.equal(getDay10V3SceneMetadata(24).title,"한 자리의 이름");
assert.deepEqual(getDay10V3Compatibility({storyFlags:{day10ThreeHourWorkRhythmCompleted:true,day10RuntimeStage:3}}),{mode:"V1_LEGACY",complete:true,checkpoint:3});
assert.deepEqual(beginDay10V3({storyFlags:{day10RhythmStrategy:"legacy"}}),{mode:"V1_LEGACY",complete:false,checkpoint:null});

const warm={money:50000,storyFlags:{day9V3DinnerStatus:"CONFIRMED"}};beginDay10V3(warm,{relationshipBand:"HIGH",greenShirtOwned:true,greenShirtWornToday:true,day9TopTriedOn:true,priorHandHold:true});
assert.equal(warm.storyFlags.day10V3PriorDinnerStatus,"CONFIRMED");assert.equal(getNextDay10V3Choice(warm).number,1);assert.throws(()=>applyDay10V3Choice(warm,"menu10_egg_rice"),/OUT_OF_ORDER/);
for(const id of ["dinner10_share_at_seven","menu10_takeout_and_side","spend10_consider_one_plate"])applyDay10V3Choice(warm,id);
assert.equal(warm.storyFlags.day10V3GimbapVillageRoute,true);assert.deepEqual(resolveDay10V3ShoppingSpend(warm,{platePurchased:true,amount:5000}),{applied:true,balance:45000});
for(const id of ["work10_defer_folder","prep10_admit_not_started","remake10_fix_one_timed","timing10_give_estimate","repair10_acknowledge_her_time","meaning10_time_before_taste","cleanup10_i_wash_you_rest","sora10_ask_to_greet_later"])applyDay10V3Choice(warm,id);
assert.equal(warm.storyFlags.day10V3Complete,true);assert.equal(warm.storyFlags.day10V3Conflict,false);assert.equal(warm.storyFlags.day10V3WorkPerformed,false);assert.equal(warm.storyFlags.day10V3FarewellTouchAllowed,true);assert.equal(warm.storyFlags.day10V3GreenShirtCallback,true);assert.equal(warm.storyFlags.day10V3SleeveCallback,"GREEN_SHIRT");
assert.equal(resolveDay10V3SoraInvitation(warm,{haeunAgrees:true,soraConsents:true}),true);assert.equal(warm.storyFlags.day10V3SoraInvitationStatus,"INVITED_TO_FLORA");assert.equal(warm.storyFlags.day11SoraMeetingPending,true);

const conflict={money:20000,storyFlags:{day9V3DinnerStatus:"CONTACT_BEFORE_NOON"}};beginDay10V3(conflict,{relationshipBand:"MID",day9TopTriedOn:false});
for(const id of ["dinner10_share_at_seven","menu10_fried_rice_and_soup","spend10_browse_presentation","work10_title_only","prep10_claim_nearly_done","remake10_start_over","timing10_say_soon","repair10_seek_intent_validation"])applyDay10V3Choice(conflict,id);
assert.equal(conflict.storyFlags.day10V3Conflict,true);assert.equal(conflict.storyFlags.day10V3ActualWait,true);assert.equal(conflict.storyFlags.day10V3TruthfulTiming,false);assert.equal(getNextDay10V3Choice(conflict).id,"day10-v3-scene-16-follow-up");assert.throws(()=>applyDay10V3Choice(conflict,"meaning10_wanted_to_give"),/OUT_OF_ORDER/);
applyDay10V3FollowUpChoice(conflict,"followup10_keep_demanding_understanding");assert.equal(conflict.storyFlags.day10V3Departure,"HAEUN_LEAVES");
for(const id of ["meaning10_wanted_to_give","cleanup10_rest_first","sora10_ask_to_greet_later"])applyDay10V3Choice(conflict,id);
resolveDay10V3SoraInvitation(conflict,{haeunAgrees:true,soraConsents:true});assert.equal(conflict.storyFlags.day10V3SoraInvitationStatus,"PRIVATE_MEETING");assert.equal(conflict.storyFlags.day10V3FarewellTouchAllowed,false);assert.equal(conflict.storyFlags.day10V3SleeveCallback,"ZIPPER");

const declined={money:10000,storyFlags:{}};beginDay10V3(declined,{relationshipBand:"LOW",haeunAvailableForDinner:false});assert.throws(()=>applyDay10V3Choice(declined,"dinner10_share_at_seven"),/HAEUN_DECLINED/);applyDay10V3Choice(declined,"dinner10_eat_separately");
for(const id of ["menu10_egg_rice","spend10_food_first"])applyDay10V3Choice(declined,id);assert.deepEqual(resolveDay10V3ShoppingSpend(declined,{platePurchased:true,amount:1000}),{applied:false,reason:"CHOICE_FORBIDS_EXTRA"});
for(const id of ["work10_rest_before_reply","prep10_report_menu_only","remake10_serve_edible","timing10_ask_help","repair10_serve_available","meaning10_pause_and_think","cleanup10_rest_first","sora10_respect_private_meeting"])applyDay10V3Choice(declined,id);
assert.equal(declined.storyFlags.day10V3DinnerAgreement,"SEPARATE_MEALS");assert.equal(declined.storyFlags.day10V3FinishTogether,false);assert.equal(declined.storyFlags.day10V3Conflict,false);assert.equal(declined.storyFlags.day10V3SoraInvitationStatus,"PRIVATE_MEETING");

const funds={money:100,storyFlags:{}};beginDay10V3(funds);for(const id of ["dinner10_shop_then_defer","menu10_takeout_and_side","spend10_consider_one_plate"])applyDay10V3Choice(funds,id);assert.deepEqual(resolveDay10V3ShoppingSpend(funds,{platePurchased:true,amount:101}),{applied:false,reason:"INSUFFICIENT_FUNDS"});assert.equal(funds.money,100);
const restored=JSON.parse(JSON.stringify(conflict));assert.deepEqual(restored,conflict);assert.equal(getDay10V3Compatibility(restored).mode,"V3");
assert.throws(()=>beginDay10V3({storyFlags:{}},{relationshipBand:"INVALID"}),/RELATIONSHIP_BAND/);assert.throws(()=>getDay10V3SceneMetadata(25),/UNKNOWN_SCENE/);assert.throws(()=>applyDay10V3Choice({storyFlags:{}},"dinner10_share_at_seven"),/NOT_STARTED/);
console.log("day10-v3-runtime.test: all assertions passed");
