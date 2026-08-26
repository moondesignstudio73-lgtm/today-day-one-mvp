import assert from "node:assert/strict";
import { existsSync,readFileSync } from "node:fs";
import { BACKGROUND_ASSETS } from "../src/assets/asset-manifest.mjs";
import { STORY_OUTFIT_ASSETS } from "../src/story-outfit-assets.mjs";
import { DAY1_AUDIO_CUES } from "../src/day1-audio-data.mjs";
import { DAY2_AUDIO_CUES } from "../src/day2-audio-data.mjs";
import { DAY13_PRESENTATION_SCENES,DAY13_REQUIRED_NEW_ASSETS,validateDay13PresentationData } from "../src/day13-presentation-data.mjs";

assert.equal(validateDay13PresentationData(),true);
assert.deepEqual(DAY13_REQUIRED_NEW_ASSETS,[]);
assert.equal(Object.keys(DAY13_PRESENTATION_SCENES).length,8);
assert.ok(Object.values(DAY13_PRESENTATION_SCENES).every(scene=>scene.assetStatus==="audited"));
assert.ok(Object.values(DAY13_PRESENTATION_SCENES).every(scene=>scene.characterAssetKey==="day6"));
assert.equal(STORY_OUTFIT_ASSETS.day6,"assets/characters/story-outfits/haeun-day6-neighborhood-casual-2d-v1.png");
assert.ok(existsSync(new URL(`../${STORY_OUTFIT_ASSETS.day6}`,import.meta.url)));

const backgroundIds=[...new Set(Object.values(DAY13_PRESENTATION_SCENES).map(scene=>scene.backgroundId))];
assert.deepEqual(backgroundIds.sort(),["day2-home-entry","home-morning","neighborhood-cafe-day","neighborhood-market-day"].sort());
for(const id of backgroundIds){
  const path=BACKGROUND_ASSETS[id];
  assert.ok(path,id);
  assert.ok(existsSync(new URL(`../${path}`,import.meta.url)),path);
}

const audio={...DAY1_AUDIO_CUES,...DAY2_AUDIO_CUES};
for(const [id,scene] of Object.entries(DAY13_PRESENTATION_SCENES))for(const cueId of scene.sfx){
  assert.ok(audio[cueId],`${id} ${cueId}`);
  assert.ok(existsSync(new URL(`../${audio[cueId].source}`,import.meta.url)),audio[cueId].source);
}
for(const id of ["S06_PLAN_NOT_PAYMENT","S07_REVIEW_SCOPE"])assert.match(DAY13_PRESENTATION_SCENES[id].camera,/obscured/);
assert.ok(Object.values(DAY13_PRESENTATION_SCENES).every(scene=>scene.bgm.category==="daily"));
assert.ok(Object.values(DAY13_PRESENTATION_SCENES).every(scene=>!scene.sfx.some(id=>/HEART|RING|CRISIS|IMPACT|GLITCH/.test(id))));

const audit=readFileSync(new URL("../docs/day13/DAY13_ASSET_DIRECTION_AUDIO_AUDIT.md",import.meta.url),"utf8");
for(const marker of ["ASSET / DIRECTION / AUDIO AUDIT PASS","신규 최종 아트 필요: 0종","개인정보 비가독","공포 줌·비네트·글리치 금지","assetStatus: audited","DAY 6 생활형 외출복"])assert.ok(audit.includes(marker),marker);
console.log("✓ DAY 13 기존 4배경·하은 DAY 6 생활복 감사 PASS / 8 Scene audited / 신규 자산 0");
