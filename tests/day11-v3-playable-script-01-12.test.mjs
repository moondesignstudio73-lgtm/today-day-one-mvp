import assert from "node:assert/strict";
import {DAY11_V3_PLAYABLE_SCRIPT_01_12,getDay11V3PlayableScene01To12,validateDay11V3PlayableScript01To12} from "../src/day11-v3-playable-script-01-12.mjs";

assert.equal(validateDay11V3PlayableScript01To12(),true);
assert.deepEqual(DAY11_V3_PLAYABLE_SCRIPT_01_12.map(scene=>scene.number),Array.from({length:12},(_,index)=>index+1));
assert.deepEqual(DAY11_V3_PLAYABLE_SCRIPT_01_12.map(scene=>scene.title),["초대받은 사람, 남겨 둔 시간","누구 옷을 입고 갈까","내일의 시간","조금 일찍 도착한 사람","문 앞에서 듣는 웃음","메뉴를 대신 말하는 사람","끝을 모르는 두 사람","잘 부탁한다는 말","좋은 사람처럼 대답하기","소라가 꺼내지 않는 이야기","가지 못한 여행","고맙다는 말이 멈추는 곳"]);

const attending={storyFlags:{day11V3Invited:true,day11V3Choice1:"day11_attend_at_agreed_time",day11V3Choice2:"day11_wear_haeun_preference_if_owned",day11V3Choice3:"day11_ask_before_shared_bread",day11V3Choice4:"day11_say_still_learning",day11V3Choice5:"day11_want_safe_conversation",day11V3Choice6:"day11_ask_her_current_wish"}};
assert.deepEqual(getDay11V3PlayableScene01To12(attending,1).selectedBranches,["invited","day11_attend_at_agreed_time"]);
assert.deepEqual(getDay11V3PlayableScene01To12(attending,4).selectedBranches,["attending","day11_ask_before_shared_bread"]);
assert.deepEqual(getDay11V3PlayableScene01To12(attending,6).selectedBranches,["attending","day11_say_still_learning"]);
assert.deepEqual(getDay11V3PlayableScene01To12(attending,9).selectedBranches,["day11_want_safe_conversation"]);
assert.deepEqual(getDay11V3PlayableScene01To12(attending,11).selectedBranches,["attending"]);
assert.ok(getDay11V3PlayableScene01To12(attending,5).steps.some(step=>step.type==="dialogue"&&step.speaker==="소라"&&step.text==="그럼 오늘 인사할게요. 소라예요."));
assert.ok(getDay11V3PlayableScene01To12(attending,12).steps.some(step=>step.type==="dialogue"&&step.speaker==="하은"&&step.text.includes("소라랑 먼저 정하고 싶어")));

const declined={storyFlags:{day11V3Invited:true,day11V3Choice1:"day11_leave_friends_alone",day11V3Choice3:"day11_wait_without_purchase",day11V3Choice4:"day11_say_still_learning",day11V3Choice5:"day11_promise_to_sora"}};
assert.deepEqual(getDay11V3PlayableScene01To12(declined,4).selectedBranches,["nonAttendance","day11_wait_without_purchase"]);
assert.deepEqual(getDay11V3PlayableScene01To12(declined,6).selectedBranches,["nonAttendance"]);
assert.deepEqual(getDay11V3PlayableScene01To12(declined,9).selectedBranches,["nonAttendance"]);
assert.equal(getDay11V3PlayableScene01To12(declined,6).steps.some(step=>step.type==="choiceCue"&&step.choiceNumber===4),false);
assert.equal(getDay11V3PlayableScene01To12(declined,9).steps.some(step=>step.type==="choiceCue"&&step.choiceNumber===5),false);
assert.ok(getDay11V3PlayableScene01To12(declined,11).steps.some(step=>step.type==="dialogue"&&step.speaker==="하은"&&step.text==="소라랑 작년에 못 간 여행 얘기 했어."));

const notInvited={storyFlags:{day11V3Invited:false,day11V3Choice1:"day11_admit_evaluation_anxiety"}};
assert.deepEqual(getDay11V3PlayableScene01To12(notInvited,1).selectedBranches,["nonAttendance","day11_admit_evaluation_anxiety"]);
assert.deepEqual(getDay11V3PlayableScene01To12(notInvited,5).selectedBranches,["nonAttendance"]);
assert.ok(getDay11V3PlayableScene01To12(notInvited,5).steps.some(step=>step.type==="note"&&step.text.includes("내일 물어볼 것")));

const source=DAY11_V3_PLAYABLE_SCRIPT_01_12.map(scene=>scene.sourceMarkdown).join("\n"),serialized=JSON.stringify(DAY11_V3_PLAYABLE_SCRIPT_01_12);
for(const marker of ["먼저 둘이 얘기 좀 하고.","내 약속이 없다고 내 하루도 없는 것은 아니다.","저한테는 처음이에요.","나 어디 맡겨?","너 때문에 취소했다는 얘기 하려는 거 아니야.","지금은 있잖아."])assert.ok(source.includes(marker),marker);
for(const forbidden of ["가짜 하은","사고 범인","시우와 둘이 간다","MBTI"])assert.equal(serialized.includes(forbidden),false,forbidden);
assert.throws(()=>getDay11V3PlayableScene01To12({},13),/UNKNOWN/);
console.log("day11-v3-playable-script-01-12.test: all assertions passed");
