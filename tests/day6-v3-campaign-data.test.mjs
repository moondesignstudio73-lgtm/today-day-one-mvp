import assert from "node:assert/strict";
import {DAY6_V3_CHAPTER_CONTRACT,DAY6_V3_CHOICES,DAY6_V3_KNOWLEDGE_LEDGER,DAY6_V3_SAVE_KEYS,DAY6_V3_SCENES,DAY6_V3_VOICE_PROFILES,validateDay6V3CampaignData} from "../src/day6-v3-campaign-data.mjs";

assert.equal(validateDay6V3CampaignData(),true);
assert.equal(DAY6_V3_SCENES.length,23);
assert.equal(DAY6_V3_CHOICES.length,11);
assert.equal(DAY6_V3_CHOICES.flatMap(choice=>choice.options).length,33);
assert.deepEqual(DAY6_V3_CHAPTER_CONTRACT.locations.slice(1,5),["small-cafe","gimbap-village","dongsu-station","yeonhui-station"]);
assert.ok(DAY6_V3_CHAPTER_CONTRACT.locations.includes("vinyl-store"));
assert.ok(DAY6_V3_CHAPTER_CONTRACT.locations.includes("memory-park"));
assert.ok(DAY6_V3_CHAPTER_CONTRACT.followUpHooks.includes("seojin-photo-found-unopened"));
assert.ok(DAY6_V3_SAVE_KEYS.includes("day6V3HandContactEstablished"));
assert.match(DAY6_V3_VOICE_PROFILES.protagonist.rhythm,/관찰.*확인.*판단.*행동/);
assert.ok(DAY6_V3_KNOWLEDGE_LEDGER.haeun.DOES_NOT_KNOW.includes("현재 주인공이 무엇을 좋아하게 될지"));
assert.equal(Object.hasOwn(DAY6_V3_KNOWLEDGE_LEDGER.haeun,"LIES_ABOUT"),true);
console.log("day6-v3-campaign-data.test: all assertions passed");
