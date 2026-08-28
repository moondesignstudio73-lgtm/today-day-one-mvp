import assert from "node:assert/strict";
import {DAY6_V3_CHOICES} from "../src/day6-v3-campaign-data.mjs";
import {DAY6_V3_PLAYABLE_SCRIPT_01_07,DAY6_V3_PLAYABLE_SCRIPT_08_14,validateDay6V3PlayableScript0107,validateDay6V3PlayableScript0814} from "../src/day6-v3-playable-script.mjs";

assert.equal(validateDay6V3PlayableScript0107(),true);
assert.equal(DAY6_V3_PLAYABLE_SCRIPT_01_07.length,7);
const allText=JSON.stringify(DAY6_V3_PLAYABLE_SCRIPT_01_07);
for(const signature of ["잘하려고 만나는 거 아니야","내가 고르니까 더 어렵다. 밝은 거 한 표.","오늘 질문 몇 개 준비했어?","제가 보통 여기서 뭘 했는지 기억하세요?","나 먼저 나가 있을게."]){assert.ok(allText.includes(signature),signature);}
for(const choiceNumber of [1,2,3,4]){
  const choice=DAY6_V3_CHOICES.find(item=>item.number===choiceNumber);
  const branchIds=DAY6_V3_PLAYABLE_SCRIPT_01_07.flatMap(scene=>scene.branches.map(branch=>branch.choiceId));
  for(const option of choice.options) assert.ok(branchIds.includes(option.id),option.id);
}
const scene7=DAY6_V3_PLAYABLE_SCRIPT_01_07.at(-1);
assert.ok(scene7.branches.every(branch=>branch.after.some(step=>step.text==="나 먼저 나가 있을게.")));
assert.equal(allText.includes("가짜 하은"),false);
assert.equal(allText.includes("사진 찾았어요."),false);
assert.equal(validateDay6V3PlayableScript0814(),true);
assert.equal(DAY6_V3_PLAYABLE_SCRIPT_08_14.length,7);
const middleText=JSON.stringify(DAY6_V3_PLAYABLE_SCRIPT_08_14);
for(const signature of ["나는 그 사람 흉내 내는 너랑 데이트하고 싶은 게 아니야.","예전에 네가 좋아했던 거 말고, 지금 네가 좋아하는 것도 알고 싶어.","잘됐네. 벌써 하나 생겼다.","사진은 연출, 맛은 실전.","현재의 나는 길치인가 봐.","나만 처음인 게 아니잖아."]){assert.ok(middleText.includes(signature),signature);}
for(const choiceNumber of [5,6]){
  const choice=DAY6_V3_CHOICES.find(item=>item.number===choiceNumber);
  const branchIds=DAY6_V3_PLAYABLE_SCRIPT_08_14.flatMap(scene=>scene.branches.map(branch=>branch.choiceId));
  for(const option of choice.options) assert.ok(branchIds.includes(option.id),option.id);
}
assert.equal(middleText.includes("가짜 하은"),false);
assert.equal(middleText.includes("사진 찾았어요."),false);
console.log("day6-v3-playable-script.test: all assertions passed");
