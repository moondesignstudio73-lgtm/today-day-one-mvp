import assert from "node:assert/strict";
import {DAY8_V3_CHOICES,DAY8_V3_CONTRACT,DAY8_V3_KNOWLEDGE_LEDGER,DAY8_V3_SAVE_KEYS,DAY8_V3_SCENES,DAY8_V3_VOICE_PROFILES,validateDay8V3CampaignData} from "../src/day8-v3-campaign-data.mjs";

assert.equal(validateDay8V3CampaignData(),true);
assert.equal(DAY8_V3_SCENES.length,24);
assert.equal(DAY8_V3_CHOICES.length,10);
assert.equal(DAY8_V3_CHOICES[8].options.length,4);
assert.equal(DAY8_V3_CHOICES.flatMap(choice=>choice.options).length,31);
assert.deepEqual(DAY8_V3_SCENES.filter(scene=>scene.route!=="common").map(scene=>scene.id),["D8V3_S15"]);
assert.equal(DAY8_V3_CHOICES[5].options[2].effects.restRoute,true);
assert.equal(DAY8_V3_CHOICES[8].options[2].effects.truth,"FALSE_TRANSIT");
assert.equal(DAY8_V3_CONTRACT.nextHook,"day9-clothing-color-invitation");
assert.ok(DAY8_V3_CONTRACT.informationBudget.mustNotReveal.includes("fake-haeun-truth"));
assert.equal(DAY8_V3_CONTRACT.relationshipBudget.seojin,"AFFECTION과 STATUS_INTEREST 모두 변화 0");
assert.equal(DAY8_V3_VOICE_PROFILES.jihoon.boundary,"사적 작업과 공개 크레딧을 섞지 않는다");
assert.ok(DAY8_V3_KNOWLEDGE_LEDGER.haeun.doesNotKnow.includes("지훈의 사적 업무 내용"));
assert.equal(DAY8_V3_SAVE_KEYS.length,22);
for(const prompt of ["하은에게 오늘을 말하기","지훈의 짧은 대답 앞에서","남은 오후","하은에게 답하기","지훈의 오후를 전하기"])assert.ok(DAY8_V3_CHOICES.some(choice=>choice.prompt===prompt),prompt);
console.log("✓ DAY 8 V3 24 Scene·10선택·31전략·정보 경계·저장 키 데이터 계약 PASS");
