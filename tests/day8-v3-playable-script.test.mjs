import assert from "node:assert/strict";
import {DAY8_V3_PLAYABLE_SCRIPT_01_14,validateDay8V3PlayableScript01To14} from "../src/day8-v3-playable-script.mjs";

assert.equal(validateDay8V3PlayableScript01To14(),true);
assert.deepEqual(DAY8_V3_PLAYABLE_SCRIPT_01_14.map(scene=>scene.number),Array.from({length:14},(_,index)=>index+1));
const text=JSON.stringify(DAY8_V3_PLAYABLE_SCRIPT_01_14);
for(const signature of ["내 허락 기다린 거야?","그럼 별거 없는 얘기.","국경 분쟁 났다.","현재까지는.","남의 일이라 파일은 안 돼.","이번엔 고치려고 안 들을게.","그것도 듣고 싶어.","아까 잘렸다는 거 말고 다른 작업이야.","나 혼자 이상해진 줄 알았어.","좋으면 그냥 좋아해."])assert.ok(text.includes(signature),signature);
for(const forbidden of ["가짜 하은","사고 원인","차량 조작","키스","포옹"])assert.equal(text.includes(forbidden),false);
const scene6=DAY8_V3_PLAYABLE_SCRIPT_01_14.find(scene=>scene.number===6);
assert.equal(scene6.branches.length,3);
assert.equal(JSON.stringify(scene6.branches.find(branch=>branch.key==="prepare-your-present")).includes("책장 쓰러진 다음"),false);
const scene12=DAY8_V3_PLAYABLE_SCRIPT_01_14.find(scene=>scene.number===12);
assert.ok(JSON.stringify(scene12).includes("다른 작업"));
console.log("day8-v3-playable-script.test: SCENE 01-14 assertions passed");
