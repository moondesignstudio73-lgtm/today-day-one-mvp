import assert from "node:assert/strict";
import {DAY9_V3_CHOICES} from "../src/day9-v3-campaign-data.mjs";
import {DAY9_V3_PLAYABLE_SCRIPT_01_12,validateDay9V3PlayableScript01To12} from "../src/day9-v3-playable-script-01-12.mjs";

assert.equal(validateDay9V3PlayableScript01To12(),true);
assert.deepEqual(DAY9_V3_PLAYABLE_SCRIPT_01_12.map(scene=>scene.number),Array.from({length:12},(_,i)=>i+1));
const branchKeys=new Set(DAY9_V3_PLAYABLE_SCRIPT_01_12.flatMap(scene=>scene.branches.map(branch=>branch.key)));
for(const choice of DAY9_V3_CHOICES.slice(0,6))for(const option of choice.options)assert.ok(branchKeys.has(option.id),`missing immediate reaction: ${option.id}`);
for(const key of ["comfortable","unresolved","day8-rest","scarf-ask-first","scarf-bought-secret","scarf-waited"])assert.ok(branchKeys.has(key),key);
const text=JSON.stringify(DAY9_V3_PLAYABLE_SCRIPT_01_12);
for(const marker of ["다른 색 맞지?","오늘 수업료는 네 옷 입어 보는 걸로","내 입는 몸도 좀 기다려","나 오늘 예쁜 장면이 되려고 나온 건 아니야","마음에 드는 거랑 지금 사는 건 또 달라","목에 뭐 닿는 걸 잘 못 견뎌"])assert.ok(text.includes(marker),marker);
for(const forbidden of ["전 여자친구","윤서진","두 번째 직장 적응","day10-three-hour-work-rhythm"])assert.equal(text.includes(forbidden),false,forbidden);
console.log("day9-v3-playable-script-01-12.test: all assertions passed");
