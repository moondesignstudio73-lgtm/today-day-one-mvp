import assert from "node:assert/strict";
import {DAY7_V3_CHOICES,DAY7_V3_CONTRACT,DAY7_V3_KNOWLEDGE_LEDGER,DAY7_V3_SAVE_KEYS,DAY7_V3_SCENES,DAY7_V3_VOICE_PROFILES,validateDay7V3CampaignData} from "../src/day7-v3-campaign-data.mjs";

assert.equal(validateDay7V3CampaignData(),true);
assert.equal(DAY7_V3_SCENES.length,24);
assert.equal(DAY7_V3_CHOICES.length,11);
assert.deepEqual(DAY7_V3_SCENES.filter(scene=>scene.route!=="common").map(scene=>scene.route),["night-view","theme-park","book-and-dinner"]);
assert.equal(DAY7_V3_CHOICES[5].options[2].effects.requires.choiceId,"disclose-dismiss");
assert.equal(DAY7_V3_CONTRACT.targetPlaytimeMinutes[0],25);
assert.ok(DAY7_V3_CONTRACT.clueBudget.mustNotReveal.includes("fake-haeun-truth"));
assert.deepEqual(DAY7_V3_VOICE_PROFILES.seojin.axes,["AFFECTION","STATUS_INTEREST"]);
assert.ok(DAY7_V3_KNOWLEDGE_LEDGER.haeun.doesNotKnow.includes("선택 4 공개 전 서진 사진 연락"));
assert.equal(DAY7_V3_SAVE_KEYS.length,18);
for(const signature of ["서진에게 답장","오늘 가고 싶은 곳","아침의 이야기를 꺼내는 방식","하은의 시간을 함께 보내는 방법","서진에게 남기는 거리","곁에 있는 방법"])assert.ok(DAY7_V3_CHOICES.some(choice=>choice.prompt===signature),signature);
console.log("day7-v3-campaign-data.test: all assertions passed");
