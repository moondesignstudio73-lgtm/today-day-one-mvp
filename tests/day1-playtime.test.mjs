import assert from "node:assert/strict";
import { ORDINARY_READING_CPM, TARGET_MINUTES, measureAllDay1Routes } from "../scripts/measure-day1-playtime.mjs";

const ordinary=measureAllDay1Routes();
assert.equal(ordinary.length,9);
for(const route of ordinary){
  assert.ok(route.minutes>=TARGET_MINUTES.min,`${route.contactId}/${route.questionId}: ${route.minutes}분은 목표보다 짧음`);
  assert.ok(route.minutes<=TARGET_MINUTES.max,`${route.contactId}/${route.questionId}: ${route.minutes}분은 목표보다 김`);
  assert.equal(route.choices,2);
  assert.ok(route.textSteps>=100);
  assert.ok(route.characters>=2600);
}

const slow=measureAllDay1Routes({charactersPerMinute:280});
const fast=measureAllDay1Routes({charactersPerMinute:400});
assert.ok(slow.every((route,index)=>route.minutes>ordinary[index].minutes));
assert.ok(fast.every((route,index)=>route.minutes<ordinary[index].minutes));

const minutes=ordinary.map(route=>route.minutes);
console.log(`✓ DAY 1 플레이타임 9경로 ${Math.min(...minutes).toFixed(2)}–${Math.max(...minutes).toFixed(2)}분 · 보통 ${ORDINARY_READING_CPM}자/분 · 목표 7–10분 PASS`);
