import assert from "node:assert/strict";
import { ORDINARY_READING_CPM,TARGET_MINUTES,buildDay2Route,createRepresentativeDay2Routes,measureAllDay2SearchOrders,measureRepresentativeDay2Routes } from "../scripts/measure-day2-playtime.mjs";

const ordinary=measureRepresentativeDay2Routes();
assert.equal(ordinary.length,3);
for(const route of ordinary){
  assert.ok(route.minutes>=TARGET_MINUTES.min,`${route.id}: ${route.minutes}분은 목표보다 짧음`);
  assert.ok(route.minutes<=TARGET_MINUTES.max,`${route.id}: ${route.minutes}분은 목표보다 김`);
  assert.ok(route.choices>=8&&route.choices<=9);
  assert.ok(route.textSteps>=120);
  assert.ok(route.characters>=3000);
}

const allSearchOrders=measureAllDay2SearchOrders();
assert.equal(allSearchOrders.length,96,"5P3 탐색 순서와 열쇠 선택 2종을 모두 계측해야 함");
for(const route of allSearchOrders){
  const sequence=buildDay2Route({...createRepresentativeDay2Routes()[0],searchIds:route.searchIds,keyId:route.keyId});
  const text=sequence.map(step=>step.text??"").join("\n");
  for(const searchId of route.searchIds.filter(id=>id!=="unclassified_key_found")){
    const marker={room_desk_checked:"약국 선생님도 증언",pc_interest:"파일은 손대지 않았어",wardrobe_checked:"잘 어울린다는 증거",friends_interest:"연락처가 돌아오면 대조"}[searchId];
    assert.match(text,new RegExp(marker),`${searchId} 결과 반응 누락`);
  }
  if(route.searchIds.includes("unclassified_key_found"))assert.match(text,/용도는 미확인으로 남/,"작은 열쇠 결과 반응 누락");
}

const slow=measureRepresentativeDay2Routes({charactersPerMinute:280});
const fast=measureRepresentativeDay2Routes({charactersPerMinute:400});
assert.ok(slow.every((route,index)=>route.minutes>ordinary[index].minutes));
assert.ok(fast.every((route,index)=>route.minutes<ordinary[index].minutes));

const minutes=ordinary.map(route=>route.minutes);
console.log(`✓ DAY 2 플레이타임 대표 3경로 ${Math.min(...minutes).toFixed(2)}–${Math.max(...minutes).toFixed(2)}분 · 탐색 96경로 반응 보존 · 보통 ${ORDINARY_READING_CPM}자/분 PASS`);
