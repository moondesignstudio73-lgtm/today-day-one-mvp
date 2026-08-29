import assert from "node:assert/strict";
import {DAY13_V3_PLAYABLE_SCRIPT_01_12,getDay13V3PlayableScene01To12,validateDay13V3PlayableScript01To12} from "../src/day13-v3-playable-script-01-12.mjs";

assert.equal(validateDay13V3PlayableScript01To12(),true);
assert.deepEqual(DAY13_V3_PLAYABLE_SCRIPT_01_12.map(scene=>scene.number),Array.from({length:12},(_,index)=>index+1));

const seoul={storyFlags:{day13V3Choice1:"day13_go_seoul_forest",day13V3AraMet:true,day13V3Choice2:"day13_photo_without_perfection",day13V3Choice3:"day13_intro_reseeing_familiar",day13V3Choice4:"day13_move_one_step",day13V3Choice5:"day13_rest_here"}};
assert.equal(getDay13V3PlayableScene01To12(seoul,6).omitted,false);
assert.deepEqual(getDay13V3PlayableScene01To12(seoul,6).selectedBranches,["day13_intro_reseeing_familiar"]);
assert.ok(getDay13V3PlayableScene01To12(seoul,5).steps.some(step=>step.speaker==="여자"&&step.text.includes("얼굴 나오면 먼저")));
assert.ok(getDay13V3PlayableScene01To12(seoul,9).steps.some(step=>step.speaker==="아라"&&step.text.includes("두 명이면 새가")));
assert.ok(getDay13V3PlayableScene01To12(seoul,11).steps.some(step=>step.speaker==="아라"&&step.text==="아직 계시네요."));
assert.ok(getDay13V3PlayableScene01To12(seoul,12).steps.some(step=>step.speaker==="아라"&&step.text==="속상하죠. 그래서 아침을 맛있게 먹었어요."));

const early={storyFlags:{...seoul.storyFlags,day13V3Choice5:"day13_leave_now",day13V3AraEarlyExit:true}};
assert.ok(getDay13V3PlayableScene01To12(early,11).steps.some(step=>step.text?.includes("연락처는 없다")));
assert.equal(getDay13V3PlayableScene01To12(early,12).steps.some(step=>step.speaker==="아라"),false);

const neighborhood={storyFlags:{day13V3Choice1:"day13_walk_neighborhood",day13V3AraMet:false,day13V3Choice2:"day13_photo_for_self",day13V3Choice4:"day13_keep_imperfect_photo",day13V3Choice5:"day13_walk_then_rest"}};
assert.equal(getDay13V3PlayableScene01To12(neighborhood,6).omitted,true);
assert.equal(getDay13V3PlayableScene01To12(neighborhood,6).steps.length,0);
assert.ok(getDay13V3PlayableScene01To12(neighborhood,4).steps.some(step=>step.text?.includes("다른 사람의 얼굴")));
assert.equal(getDay13V3PlayableScene01To12(neighborhood,8).steps.some(step=>step.speaker==="아라"),false);
assert.ok(getDay13V3PlayableScene01To12(neighborhood,12).steps.some(step=>step.type==="note"&&step.text==="오늘 여기."));

const home={storyFlags:{day13V3Choice1:"day13_photo_at_home",day13V3AraMet:false,day13V3Choice2:"day13_photo_without_perfection",day13V3Choice4:"day13_wait_same_place",day13V3Choice5:"day13_rest_here"}};
assert.ok(getDay13V3PlayableScene01To12(home,4).steps.some(step=>step.text?.includes("빨래")));
assert.ok(getDay13V3PlayableScene01To12(home,9).steps.some(step=>step.text?.includes("컵의 반짝임")));
for(const n of [1,2,4,5,7,8,9,10,11,12])assert.ok(getDay13V3PlayableScene01To12(home,n).steps.length>0,n);

for(const n of [1,2,6,8,10])assert.ok(getDay13V3PlayableScene01To12(seoul,n).steps.some(step=>step.type==="choiceCue"),n);
const serialized=JSON.stringify(DAY13_V3_PLAYABLE_SCRIPT_01_12);
for(const marker of ["좋은 거 보면 나중에 보여 줘.","그럼 쓰레기통을 좋아하는 척하면 돼요.","그럼 저도 오늘은 처음이네요.","두 명이면 새가 있었다고 해도 되지 않을까요.","좋은 데 가서 일해요.","오늘 여기."])assert.ok(serialized.includes(marker),marker);
for(const forbidden of ["가짜 하은","사고 범인","아라가 더 좋은","거절했지만 몰래","기억이 돌아왔다","DAY14"] )assert.equal(serialized.includes(forbidden),false,forbidden);
assert.throws(()=>getDay13V3PlayableScene01To12({},13),/UNKNOWN/);
console.log("day13-v3-playable-script-01-12.test: all assertions passed");
