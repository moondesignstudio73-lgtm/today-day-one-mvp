import assert from "node:assert/strict";
import {DAY13_V3_PLAYABLE_SCRIPT_13_24,getDay13V3PlayableScene13To24,validateDay13V3PlayableScript13To24} from "../src/day13-v3-playable-script-13-24.mjs";

assert.equal(validateDay13V3PlayableScript13To24(),true);
assert.deepEqual(DAY13_V3_PLAYABLE_SCRIPT_13_24.map(scene=>scene.number),Array.from({length:12},(_,index)=>index+13));

const araComfort={storyFlags:{
  day13V3Choice1:"day13_go_seoul_forest",day13V3AraMet:true,day13V3Choice5:"day13_rest_here",
  day13V3Choice6:"day13_portrait_now",day13V3Choice7:"day13_work_relearning",day13V3Choice8:"day13_brief_drink",
  day13V3AraPhysicallyPresent:true,day13V3Choice9:"day13_name_girlfriend",day13V3Choice10:"day13_exchange_photos",
  day13V3Choice11:"day13_tell_ara_meeting",day13V3Choice12:"day13_comfort_no_full_explanation"
}};
assert.ok(getDay13V3PlayableScene13To24(araComfort,13).steps.some(step=>step.speaker==="아라"&&step.text.includes("나무가 계속 일"))===false);
assert.ok(getDay13V3PlayableScene13To24(araComfort,14).steps.some(step=>step.text?.includes("증명사진")));
assert.ok(getDay13V3PlayableScene13To24(araComfort,15).steps.some(step=>step.text?.includes("남들은 제가 했던 걸 아는데")));
assert.ok(getDay13V3PlayableScene13To24(araComfort,17).steps.some(step=>step.type==="choiceCue"&&step.choiceNumber===8));
assert.ok(getDay13V3PlayableScene13To24(araComfort,18).steps.some(step=>step.speaker==="주인공"&&step.text.startsWith("여자친구예요")));
assert.ok(getDay13V3PlayableScene13To24(araComfort,19).steps.some(step=>step.text?.includes("미래가 너무 길어졌네요")));
assert.ok(getDay13V3PlayableScene13To24(araComfort,21).steps.some(step=>step.text?.includes("연락처를 나눴을 때만")));
assert.ok(getDay13V3PlayableScene13To24(araComfort,22).steps.some(step=>step.type==="choiceCue"&&step.choiceNumber===12));
assert.ok(getDay13V3PlayableScene13To24(araComfort,23).steps.some(step=>step.speaker==="하은"&&step.text==="그럼 내가 안 나와도 내 사진이야?"));
assert.ok(getDay13V3PlayableScene13To24(araComfort,23).steps.some(step=>step.type==="message"&&step.text.includes("플로라 카페")));
assert.ok(getDay13V3PlayableScene13To24(araComfort,24).steps.some(step=>step.text?.includes("대화방이 하나 생겼다")));

const decline={storyFlags:{...araComfort.storyFlags,day13V3Choice6:"day13_stay_photographer",day13V3PortraitExists:false,day13V3Choice10:"day13_no_contact"}};
const decline14=getDay13V3PlayableScene13To24(decline,14);
assert.ok(decline14.steps.some(step=>step.text?.includes("몰래 찍지 않는다")));
assert.ok(decline14.steps.some(step=>step.speaker==="아라"&&step.text.includes("나무도 좀 긴장")));
assert.equal(decline14.steps.some(step=>step.text?.includes("한 장 더 찍는다")),false);
assert.ok(getDay13V3PlayableScene13To24(decline,24).steps.some(step=>step.text?.includes("빈 길이나 창가의 물컵")));
assert.ok(getDay13V3PlayableScene13To24(decline,24).steps.some(step=>step.text?.includes("새로운 대화방이 생기지 않는다")));

const noAra={storyFlags:{
  day13V3Choice1:"day13_walk_neighborhood",day13V3AraMet:false,day13V3Choice5:"day13_leave_now",
  day13V3Choice6:"day13_stay_photographer",day13V3PortraitExists:false,day13V3Choice7:"day13_work_resting_visit",
  day13V3Choice10:"day13_no_contact",day13V3Choice11:"day13_tell_ara_meeting"
}};
for(const n of [13,14,15,16,17,18,19,20,21,22,23,24])assert.ok(getDay13V3PlayableScene13To24(noAra,n).steps.length>0,n);
assert.equal(getDay13V3PlayableScene13To24(noAra,17).choiceAvailable,false);
assert.equal(getDay13V3PlayableScene13To24(noAra,18).choiceAvailable,false);
assert.equal(getDay13V3PlayableScene13To24(noAra,22).choiceAvailable,false);
assert.equal(getDay13V3PlayableScene13To24(noAra,21).availableChoiceOptions.includes("day13_tell_ara_meeting"),false);
assert.ok(getDay13V3PlayableScene13To24(noAra,21).steps.some(step=>step.text?.includes("사진 찍는 게 생각보다 재밌더라")));
assert.equal(getDay13V3PlayableScene13To24(noAra,21).steps.some(step=>step.text?.includes("아라라는 분")),false);
assert.equal(getDay13V3PlayableScene13To24(noAra,24).steps.some(step=>step.text?.includes("사진을 전송받은 대화방")),false);

const personalInterest={storyFlags:{...araComfort.storyFlags,day13V3Choice12:"day13_admit_personal_interest",day13V3HaeunNeedsSpace:true}};
assert.ok(getDay13V3PlayableScene13To24(personalInterest,23).steps.some(step=>step.text?.includes("조금 생각해 볼게")));
assert.equal(getDay13V3PlayableScene13To24(personalInterest,23).steps.some(step=>step.text?.includes("그럼 내가 안 나와도")),false);
assert.equal(getDay13V3PlayableScene13To24(personalInterest,23).steps.some(step=>step.text?.includes("플로라 카페")),false);

const withheld={storyFlags:{...araComfort.storyFlags,day13V3Choice11:"day13_send_favorite_photo",day13V3Choice12:undefined}};
const withheld22=getDay13V3PlayableScene13To24(withheld,22);
assert.equal(withheld22.choiceAvailable,false);
assert.ok(withheld22.steps.some(step=>step.text?.includes("자동으로 알아맞히지 않는다")));
assert.equal(withheld22.steps.some(step=>step.speaker==="하은"&&step.text?.includes("그 사람")),false);

const mismatch={storyFlags:{...araComfort.storyFlags,day13V3Choice8:"day13_ask_photo_contact",day13V3Choice10:"day13_exchange_photos",day13V3Choice12:"day13_call_passing_meeting"}};
assert.ok(getDay13V3PlayableScene13To24(mismatch,23).steps.some(step=>step.text?.includes("조금 생각해 볼게")));

for(const n of [13,15,17,18,19,21,22])assert.ok(getDay13V3PlayableScene13To24(araComfort,n).steps.some(step=>step.type==="choiceCue"),n);
const serialized=JSON.stringify(DAY13_V3_PLAYABLE_SCRIPT_13_24);
for(const marker of ["그럼 저 나무가 계속 일하겠네요.","지금 증명사진 됐어요.","좋은 카메라 잘못은 아닌 것 같아요.","점심 챙길게. 먼저 말했어.","아직 한 장도 안 보냈는데 미래가 너무 길어졌네요.","그럼 내가 안 나와도 내 사진이야?","오늘의 얼굴"])assert.ok(serialized.includes(marker),marker);
for(const forbidden of ["가짜 하은","사고 범인","아라가 더 좋은","몰래 찍어 두었다","외도 확정","DAY14 공동","윤서진은 이제 관심이 없다"] )assert.equal(serialized.includes(forbidden),false,forbidden);
assert.throws(()=>getDay13V3PlayableScene13To24({},12),/UNKNOWN/);
assert.throws(()=>getDay13V3PlayableScene13To24({},25),/UNKNOWN/);
console.log("day13-v3-playable-script-13-24.test: all assertions passed");
