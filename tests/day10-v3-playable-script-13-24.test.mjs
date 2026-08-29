import assert from "node:assert/strict";
import {applyDay10V3Choice,applyDay10V3FollowUpChoice,beginDay10V3} from "../src/day10-v3-runtime.mjs";
import {DAY10_V3_PLAYABLE_SCRIPT_13_24,getDay10V3PlayableScene13To24,validateDay10V3PlayableScript13To24} from "../src/day10-v3-playable-script-13-24.mjs";

assert.equal(validateDay10V3PlayableScript13To24(),true);
assert.deepEqual(DAY10_V3_PLAYABLE_SCRIPT_13_24.map(scene=>scene.number),Array.from({length:12},(_,index)=>index+13));
assert.deepEqual(DAY10_V3_PLAYABLE_SCRIPT_13_24.map(scene=>scene.title),["초인종과 메시지","기다렸다는 말","마음을 설명하기 전에","의자를 당기는 소리","이름을 바꾸면 되는 음식","기대했던 얼굴","다음 숟가락","남은 것을 나누는 법","내일은 친구와","같이 가도 되는 자리","배웅하거나 보내는 말","한 자리의 이름"]);

const warm={money:50000,storyFlags:{day9V3DinnerStatus:"CONFIRMED"}};beginDay10V3(warm,{relationshipBand:"HIGH",greenShirtOwned:true,greenShirtWornToday:true,priorHandHold:true});
for(const id of ["dinner10_share_at_seven","menu10_egg_rice","spend10_food_first","work10_defer_folder","prep10_admit_not_started","remake10_serve_edible","timing10_give_estimate","repair10_acknowledge_her_time","meaning10_time_before_taste","cleanup10_i_wash_you_rest","sora10_ask_to_greet_later"])applyDay10V3Choice(warm,id);
assert.equal(getDay10V3PlayableScene13To24(warm,13).selectedBranch,"house-prepared");assert.equal(getDay10V3PlayableScene13To24(warm,14).selectedBranch,"meal-on-time");assert.equal(getDay10V3PlayableScene13To24(warm,15).selectedBranch,"meal-on-time");assert.equal(getDay10V3PlayableScene13To24(warm,16).selectedBranch,"seat-comfortable");assert.equal(getDay10V3PlayableScene13To24(warm,17).selectedBranch,"meal-together");assert.equal(getDay10V3PlayableScene13To24(warm,22).selectedBranch,"sora10_ask_to_greet_later");assert.equal(getDay10V3PlayableScene13To24(warm,23).selectedBranch,"farewell-comfortable");
assert.ok(getDay10V3PlayableScene13To24(warm,13).steps.some(step=>step.type==="dialogue"&&step.speaker==="하은"&&step.text==="진짜 저녁 냄새 난다."));
assert.ok(getDay10V3PlayableScene13To24(warm,23).steps.some(step=>step.type==="dialogue"&&step.text==="다음엔 내가 해 볼게."));

const conflict={money:50000,storyFlags:{day9V3DinnerStatus:"CONFIRMED"}};beginDay10V3(conflict,{relationshipBand:"MID"});
for(const id of ["dinner10_share_at_seven","menu10_fried_rice_and_soup","spend10_browse_presentation","work10_title_only","prep10_claim_nearly_done","remake10_start_over","timing10_say_soon","repair10_seek_intent_validation"])applyDay10V3Choice(conflict,id);
assert.equal(getDay10V3PlayableScene13To24(conflict,13).selectedBranch,"house-conflict");assert.equal(getDay10V3PlayableScene13To24(conflict,14).selectedBranch,"meal-conflict");assert.equal(getDay10V3PlayableScene13To24(conflict,15).selectedBranch,"repair10_seek_intent_validation");assert.equal(getDay10V3PlayableScene13To24(conflict,16).selectedBranch,"followup-pending");assert.ok(getDay10V3PlayableScene13To24(conflict,16).steps.some(step=>step.type==="choiceCue"&&step.choiceId==="day10-v3-scene-16-follow-up"));
applyDay10V3FollowUpChoice(conflict,"followup10_keep_demanding_understanding");assert.equal(getDay10V3PlayableScene13To24(conflict,16).selectedBranch,"followup-leave");
for(const id of ["meaning10_wanted_to_give","cleanup10_rest_first","sora10_ask_to_greet_later"])applyDay10V3Choice(conflict,id);
assert.equal(getDay10V3PlayableScene13To24(conflict,17).selectedBranch,"meal-alone");assert.equal(getDay10V3PlayableScene13To24(conflict,18).selectedBranch,"expectation-alone");assert.equal(getDay10V3PlayableScene13To24(conflict,19).selectedBranch,"meaning-alone");assert.equal(getDay10V3PlayableScene13To24(conflict,21).selectedBranch,"tomorrow-left");assert.equal(getDay10V3PlayableScene13To24(conflict,23).selectedBranch,"farewell-separate");

const separate={money:30000,storyFlags:{}};beginDay10V3(separate,{relationshipBand:"LOW"});
for(const id of ["dinner10_eat_separately","menu10_takeout_and_side","spend10_food_first","work10_rest_before_reply","prep10_report_menu_only","remake10_serve_edible","timing10_ask_help","repair10_serve_available","meaning10_pause_and_think","cleanup10_rest_first","sora10_respect_private_meeting"])applyDay10V3Choice(separate,id);
for(const [scene,key] of [[13,"house-alone"],[14,"meal-alone"],[15,"meal-alone"],[16,"seat-alone"],[17,"meal-alone"],[18,"expectation-alone"],[20,"cleanup-alone"],[21,"tomorrow-separate"],[23,"farewell-separate"]])assert.equal(getDay10V3PlayableScene13To24(separate,scene).selectedBranch,key,`scene ${scene}`);

const source=DAY10_V3_PLAYABLE_SCRIPT_13_24.map(scene=>scene.sourceMarkdown).join("\n"),serialized=JSON.stringify(DAY10_V3_PLAYABLE_SCRIPT_13_24);
for(const marker of ["내가 지금 배고프다고 말하면 네가 상처받을 것 같아서","오늘은 따로 먹자. 나 지금 여기서 계속 괜찮은 사람처럼 있고 싶지 않아.","독립한 계란.","소라한테 물어볼게.","오늘은 어땠어."])assert.ok(source.includes(marker),marker);
for(const forbidden of ["가짜 하은","전 여자친구","윤서진","사고 범인","MBTI"])assert.equal(serialized.includes(forbidden),false,forbidden);
assert.throws(()=>getDay10V3PlayableScene13To24({},12),/UNKNOWN/);assert.throws(()=>getDay10V3PlayableScene13To24({},25),/UNKNOWN/);
console.log("day10-v3-playable-script-13-24.test: all assertions passed");
