import assert from "node:assert/strict";
import {DAY11_V3_PLAYABLE_SCRIPT_13_24,getDay11V3PlayableScene13To24,validateDay11V3PlayableScript13To24} from "../src/day11-v3-playable-script-13-24.mjs";

assert.equal(validateDay11V3PlayableScript13To24(),true);
assert.deepEqual(DAY11_V3_PLAYABLE_SCRIPT_13_24.map(scene=>scene.number),Array.from({length:12},(_,index)=>index+13));
assert.deepEqual(DAY11_V3_PLAYABLE_SCRIPT_13_24.map(scene=>scene.title),["잘 나누지 못하는 케이크","소라의 제목","누가 맞는지 고르지 않고","잠깐 비운 자리","내가 고른 사람이라고 말할 때","오래 아는 친구의 말","시우라는 이름","헤어질 시간을 먼저 말하는 사람","조금 더 함께할까","내 쪽으로 기울어진 어깨","외우지 않는 밤","질문 하나를 챙긴 사람"]);

const warm={storyFlags:{day11V3Invited:true,day11V3Choice1:"day11_attend_at_agreed_time",day11V3Choice7:"day11_ask_why_title_worked",day11V3Choice8:"day11_ask_haeun_today",day11V3Choice9:"day11_ask_exhibition_content",day11V3Choice10:"day11_invite_short_walk",day11V3Choice11:"day11_prepare_questions",day11V3RelationshipBand:"HIGH",day11V3PriorNaturalContact:true,day11V3UnresolvedConflict:false}};
assert.deepEqual(getDay11V3PlayableScene13To24(warm,13).selectedBranches,["attending"]);
assert.deepEqual(getDay11V3PlayableScene13To24(warm,15).selectedBranches,["day11_ask_why_title_worked"]);
assert.deepEqual(getDay11V3PlayableScene13To24(warm,19).selectedBranches,["attending","day11_ask_exhibition_content"]);
assert.deepEqual(getDay11V3PlayableScene13To24(warm,22).selectedBranches,["lean"]);
assert.equal(getDay11V3PlayableScene13To24(warm,22).skipped,false);
assert.ok(getDay11V3PlayableScene13To24(warm,22).steps.some(step=>step.type==="dialogue"&&step.speaker==="주인공"&&step.text==="좀 더 앉아 있고 싶어."));
assert.ok(getDay11V3PlayableScene13To24(warm,24).steps.some(step=>step.type==="message"&&step.sender==="하은"&&step.text==="오늘의 공평함."));

const cautious={storyFlags:{...warm.storyFlags,day11V3RelationshipBand:"MID",day11V3PriorNaturalContact:false}};
assert.deepEqual(getDay11V3PlayableScene13To24(cautious,22).selectedBranches,["cautious"]);
assert.equal(getDay11V3PlayableScene13To24(cautious,22).steps.some(step=>step.type==="narration"&&step.text.includes("어깨를 기울인다")),false);

const unresolved={storyFlags:{...warm.storyFlags,day11V3UnresolvedConflict:true}};
assert.deepEqual(getDay11V3PlayableScene13To24(unresolved,22).selectedBranches,["cautious"]);
assert.deepEqual(getDay11V3PlayableScene13To24(unresolved,24).selectedBranches,["unresolved"]);
assert.ok(getDay11V3PlayableScene13To24(unresolved,24).steps.some(step=>step.type==="message"&&step.text==="내일 무리하지 말고. 다녀와."));
assert.equal(getDay11V3PlayableScene13To24(unresolved,24).steps.some(step=>step.type==="message"&&step.text==="오늘의 공평함."),false);

const endAtFarewell={storyFlags:{...warm.storyFlags,day11V3Choice10:"day11_end_and_prepare"}};
assert.deepEqual(getDay11V3PlayableScene13To24(endAtFarewell,22).selectedBranches,["skipped"]);
assert.equal(getDay11V3PlayableScene13To24(endAtFarewell,22).skipped,true);
assert.deepEqual(getDay11V3PlayableScene13To24(endAtFarewell,22).steps,[]);

const declined={storyFlags:{day11V3Invited:true,day11V3Choice1:"day11_leave_friends_alone",day11V3Choice7:"day11_listen_as_newcomer",day11V3Choice8:"day11_admit_waiting_for_praise",day11V3Choice9:"day11_support_haeun_choice",day11V3Choice10:"day11_invite_short_walk",day11V3Choice11:"day11_stop_and_rest",day11V3RelationshipBand:"HIGH",day11V3PriorNaturalContact:true}};
assert.deepEqual(getDay11V3PlayableScene13To24(declined,13).selectedBranches,["nonAttendance"]);
assert.deepEqual(getDay11V3PlayableScene13To24(declined,15).selectedBranches,["nonAttendance","day11_listen_as_newcomer"]);
assert.deepEqual(getDay11V3PlayableScene13To24(declined,19).selectedBranches,["nonAttendance","day11_support_haeun_choice"]);
assert.deepEqual(getDay11V3PlayableScene13To24(declined,22).selectedBranches,["phone"]);
assert.equal(getDay11V3PlayableScene13To24(declined,22).steps.some(step=>step.type==="narration"&&step.text.includes("어깨를 기울인다")),false);
assert.ok(getDay11V3PlayableScene13To24(declined,18).steps.some(step=>step.type==="dialogue"&&step.speaker==="하은"&&step.text==="소라가 다음에는 편하게 인사하자고 했어."));

const anxious={storyFlags:{...warm.storyFlags,day11V3Choice9:"day11_ask_if_alone_with_siwoo"}};
const siwooScene=getDay11V3PlayableScene13To24(anxious,19);
assert.ok(siwooScene.steps.some(step=>step.type==="dialogue"&&step.speaker==="하은"&&step.text==="그건 아직 안 정했어."));
assert.equal(siwooScene.steps.some(step=>JSON.stringify(step).includes("둘이 간다")),false);

const source=DAY11_V3_PLAYABLE_SCRIPT_13_24.map(scene=>scene.sourceMarkdown).join("\n"),serialized=JSON.stringify(DAY11_V3_PLAYABLE_SCRIPT_13_24);
for(const marker of ["일단 이것부터 여행 보내자. 우리 입으로.","걔한테 허락받아서 너 만나는 건 아니야.","그건 아직 안 정했어.","나 오늘 네가 좀 더 좋아졌어.","세 시간 안쪽. 적응 방문. 열 시.","그건 답을 외우지 말고."])assert.ok(source.includes(marker),marker);
for(const forbidden of ["가짜 하은","사고 범인","시우와 둘이 간다","MBTI"])assert.equal(serialized.includes(forbidden),false,forbidden);
assert.throws(()=>getDay11V3PlayableScene13To24({},12),/UNKNOWN/);
assert.throws(()=>getDay11V3PlayableScene13To24({},25),/UNKNOWN/);
console.log("day11-v3-playable-script-13-24.test: all assertions passed");
