import assert from "node:assert/strict";
import { existsSync,readFileSync } from "node:fs";
import { BACKGROUND_ASSETS,NPC_ASSETS } from "../src/assets/asset-manifest.mjs";
import { STORY_OUTFIT_ASSETS } from "../src/story-outfit-assets.mjs";
import { DAY1_AUDIO_CUES } from "../src/day1-audio-data.mjs";
import { DAY2_AUDIO_CUES } from "../src/day2-audio-data.mjs";
import { DAY16_PRESENTATION_SCENES,DAY16_REQUIRED_NEW_ASSETS,validateDay16PresentationData } from "../src/day16-presentation-data.mjs";

assert.equal(validateDay16PresentationData(),true);
assert.deepEqual(DAY16_REQUIRED_NEW_ASSETS,[]);
assert.equal(Object.keys(DAY16_PRESENTATION_SCENES).length,8);
assert.ok(Object.values(DAY16_PRESENTATION_SCENES).every(scene=>scene.assetStatus==="audited"));
assert.equal(STORY_OUTFIT_ASSETS.day8,"assets/characters/story-outfits/haeun-day8-errand-sage-2d-v1.png");
assert.equal(NPC_ASSETS["best-friend"],"assets/npcs/best-friend.png");
for(const path of [STORY_OUTFIT_ASSETS.day8,NPC_ASSETS["best-friend"]])assert.ok(existsSync(new URL(`../${path}`,import.meta.url)),path);

const backgroundIds=[...new Set(Object.values(DAY16_PRESENTATION_SCENES).flatMap(scene=>[scene.backgroundId,...Object.values(scene.branchBackgrounds??{})]))];
assert.deepEqual(backgroundIds.sort(),["home-morning","neighborhood-cafe-day","neighborhood-street-day"].sort());
for(const id of backgroundIds){
  const path=BACKGROUND_ASSETS[id];
  assert.ok(path,id);
  assert.ok(existsSync(new URL(`../${path}`,import.meta.url)),path);
}

const audio={...DAY1_AUDIO_CUES,...DAY2_AUDIO_CUES};
for(const [id,scene] of Object.entries(DAY16_PRESENTATION_SCENES))for(const cueId of scene.sfx){
  assert.ok(audio[cueId],`${id} ${cueId}`);
  assert.ok(existsSync(new URL(`../${audio[cueId].source}`,import.meta.url)),audio[cueId].source);
}
assert.match(DAY16_PRESENTATION_SCENES.S02_REPLY_SENTENCE.camera,/obscured/);
assert.match(DAY16_PRESENTATION_SCENES.S05_SCOPE_OF_FRIEND.camera,/obscured/);
assert.ok(Object.values(DAY16_PRESENTATION_SCENES).every(scene=>scene.bgm.category==="daily"));
assert.ok(Object.values(DAY16_PRESENTATION_SCENES).every(scene=>!scene.sfx.some(id=>/HEART|RING|CRISIS|IMPACT|GLITCH/.test(id))));

const audit=readFileSync(new URL("../docs/day16/DAY16_ASSET_DIRECTION_AUDIO_AUDIT.md",import.meta.url),"utf8");
for(const marker of ["ASSET / DIRECTION / AUDIO AUDIT PASS","신규 최종 아트 필요: 0종","assetStatus: audited","하은 DAY 8 생활 외출복","지훈 기존 NPC","흐린 소품","공포 줌","하은 단독 감시 구도","다음 이미지 QA 관문"])assert.ok(audit.includes(marker),marker);
console.log("✓ DAY 16 기존 3배경·하은 DAY 8·지훈 NPC 감사 / 8 Scene 연출·daily 오디오 / 신규 자산 0");
