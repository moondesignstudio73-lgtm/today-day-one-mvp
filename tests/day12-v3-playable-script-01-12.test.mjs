import assert from "node:assert/strict";
import {DAY12_V3_PLAYABLE_SCRIPT_01_12,getDay12V3PlayableScene01To12,validateDay12V3PlayableScript01To12} from "../src/day12-v3-playable-script-01-12.mjs";

assert.equal(validateDay12V3PlayableScript01To12(),true);
assert.deepEqual(DAY12_V3_PLAYABLE_SCRIPT_01_12.map(scene=>scene.number),Array.from({length:12},(_,index)=>index+1));
assert.deepEqual(DAY12_V3_PLAYABLE_SCRIPT_01_12.map(scene=>scene.title),["질문을 넣은 가방","전에 한 번 열었던 문","서진의 두 번째 인사","빈 의자가 아니라 오늘의 자리","한 장이 더 있다","익숙한 척하기 쉬운 말","내가 누른 버튼","메모 뒤에 남은 문장","작은 일이 남는 자리","여기까지라는 말","자판기 앞의 두 사람","점심을 고르는 질문"]);

const route={storyFlags:{day12V3PriorSeojinPhoto:true,day12V3PriorSeojinPersonalInterest:true,day12V3Choice1:"day12_support_haeun_day",day12V3Choice2:"day12_settle_before_reading",day12V3Choice3:"day12_ask_user_reason",day12V3Choice4:"day12_trace_confusion_together",day12V3Choice5:"day12_ask_to_continue",day12V3Choice6:"day12_lunch_ask_current_habit"}};
assert.deepEqual(getDay12V3PlayableScene01To12(route,3).selectedBranches,["priorPhoto","priorPersonalInterest"]);
assert.deepEqual(getDay12V3PlayableScene01To12(route,6).selectedBranches,["day12_ask_user_reason"]);
assert.ok(getDay12V3PlayableScene01To12(route,1).steps.some(step=>step.type==="message"&&step.sender==="하은"&&step.text.includes("미뤄 둔 일")));
assert.ok(getDay12V3PlayableScene01To12(route,7).steps.some(step=>step.type==="dialogue"&&step.speaker==="주인공"&&step.text.includes("끝났다고 들었어요")));
assert.ok(getDay12V3PlayableScene01To12(route,9).steps.some(step=>step.type==="dialogue"&&step.speaker==="서진"&&step.text==="오늘 방금 그렇게 느끼셨잖아요. 그게 필요했어요."));
assert.ok(getDay12V3PlayableScene01To12(route,12).steps.some(step=>step.type==="dialogue"&&step.speaker==="주인공"&&step.text==="시간은 잡았고 메뉴가 남았네요."));

const distance={storyFlags:{day12V3PriorSeojinPhoto:false,day12V3PriorSeojinPersonalInterest:false,day12V3Choice3:"day12_hold_early_opinion",day12V3Choice4:"day12_offer_to_cover_minho",day12V3Choice5:"day12_stop_at_boundary",day12V3Choice6:"day12_lunch_quiet_seat"}};
assert.deepEqual(getDay12V3PlayableScene01To12(distance,3).selectedBranches,["noPriorPhoto"]);
assert.equal(getDay12V3PlayableScene01To12(distance,3).steps.some(step=>step.text?.includes("회사 밖 얘기도 궁금")),false);
assert.ok(getDay12V3PlayableScene01To12(distance,8).steps.some(step=>step.type==="dialogue"&&step.speaker==="민호"&&step.text.includes("제 쪽은 제가")));
assert.ok(getDay12V3PlayableScene01To12(distance,12).steps.some(step=>step.type==="narration"&&step.text.includes("점심을 빼고")));

for(const sceneNumber of [1,4,6,8,10,12])assert.ok(getDay12V3PlayableScene01To12(route,sceneNumber).steps.some(step=>step.type==="choiceCue"));
const serialized=JSON.stringify(DAY12_V3_PLAYABLE_SCRIPT_01_12);
for(const marker of ["질문은 가방에만 두고 오지 마.","민호 씨가 길이었어요.","큰 아이디어보다 작은 오해가 더 정확하게 보이는 순간이었다.","처음 멈췄던 흔적이 오늘은 더 쓸모 있었다.","여기도 버튼을 고쳐야겠네요."])assert.ok(serialized.includes(marker),marker);
for(const forbidden of ["가짜 하은","사고 범인","과거 연애 확정","정식 복귀","DAY13 새 인연"])assert.equal(serialized.includes(forbidden),false,forbidden);
assert.throws(()=>getDay12V3PlayableScene01To12({},13),/UNKNOWN/);
console.log("day12-v3-playable-script-01-12.test: all assertions passed");
