import assert from "node:assert/strict";
import {DAY6_V3_CHOICES} from "../src/day6-v3-campaign-data.mjs";
import {DAY6_V3_LATE_ACT_REACTIONS,DAY6_V3_LATE_ACT_SOURCE_RANGE,validateDay6V3LateActReactions} from "../src/day6-v3-late-act-reactions.mjs";

assert.equal(validateDay6V3LateActReactions(),true);
assert.deepEqual(DAY6_V3_LATE_ACT_SOURCE_RANGE.scenes,[15,16,17,18,19,20,21,22,23]);

const choice=(number)=>DAY6_V3_CHOICES.find(item=>item.number===number);
assert.deepEqual(choice(8).options.map(option=>option.label),["이번엔 제대로 웃어 볼게.","사진은 연출이라며.","각자 하고 싶은 표정으로 찍자."]);
assert.deepEqual(choice(9).options.map(option=>option.label),["김밥 앞에서 제일 많이 웃는 사람.","계획이 망가진 뒤에 더 많이 웃는 사람.","내가 지금 좋아하는 걸 알고 싶어 하는 사람."]);
assert.deepEqual(choice(10).options.map(option=>option.id),["hand-offer","hand-ask","hand-keep-walking"]);
assert.deepEqual(choice(11).options.map(option=>option.id),["name-first-date","name-restarted-date","name-next-day"]);

assert.equal(DAY6_V3_LATE_ACT_REACTIONS.hand["hand-offer"].LOW,"NO_CONTACT_NO_PENALTY");
assert.equal(DAY6_V3_LATE_ACT_REACTIONS.hand["hand-ask"].VERY_HIGH,"MUTUAL_CONTACT");
assert.ok(Object.values(DAY6_V3_LATE_ACT_REACTIONS.hand["hand-keep-walking"]).every(result=>result==="NO_CONTACT"));
assert.equal(DAY6_V3_LATE_ACT_REACTIONS.finalMessage.seojinHook,"사진 찾았어요.");
assert.equal(DAY6_V3_LATE_ACT_REACTIONS.finalMessage.seojinHookState,"UNOPENED");
assert.equal(DAY6_V3_LATE_ACT_REACTIONS.finalMessage.newAlbumPlacement,"과거 사진 옆에 두지 않음");
console.log("day6-v3-late-act-reactions.test: all assertions passed");
