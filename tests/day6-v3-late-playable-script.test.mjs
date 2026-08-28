import assert from "node:assert/strict";
import {DAY6_V3_PLAYABLE_SCRIPT_15_23,validateDay6V3PlayableScript1523} from "../src/day6-v3-late-playable-script.mjs";

assert.equal(validateDay6V3PlayableScript1523(),true);
assert.equal(DAY6_V3_PLAYABLE_SCRIPT_15_23.length,9);
const text=JSON.stringify(DAY6_V3_PLAYABLE_SCRIPT_15_23);
for(const signature of ["네가 골랐다는 건 마음에 드는데.","나 때문에 웃은 거잖아.","그럼 다음 데이트 확정이네.","내가 지금 잡고 싶어서.","그냥 궁금해서.","내일도 하고 싶어서.","그런데 잊고 싶지 않은 하루가 생겼다.","사진 찾았어요."]){assert.ok(text.includes(signature),signature);}
for(const forbidden of ["가짜 하은","사고의 정답","사진의 내용"]){assert.equal(text.includes(forbidden),false,forbidden);}
const keys=DAY6_V3_PLAYABLE_SCRIPT_15_23.flatMap(scene=>scene.branches.map(branch=>branch.key));
assert.ok(keys.includes("hand-offer-NO_CONTACT"));
assert.ok(keys.includes("hand-ask-NO_CONTACT"));
assert.ok(keys.includes("hand-keep-walking"));
assert.ok(keys.includes("message-VERY_HIGH-CONTACT"));
assert.ok(keys.includes("message-VERY_HIGH-NO_CONTACT"));
console.log("day6-v3-late-playable-script.test: all assertions passed");
