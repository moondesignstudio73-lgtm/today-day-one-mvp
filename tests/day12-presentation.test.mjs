import assert from "node:assert/strict";
import { existsSync,readFileSync } from "node:fs";
import { BACKGROUND_ASSETS } from "../src/assets/asset-manifest.mjs";
import { STORY_OUTFIT_ASSETS } from "../src/story-outfit-assets.mjs";
import { DAY1_AUDIO_CUES } from "../src/day1-audio-data.mjs";
import { DAY2_AUDIO_CUES } from "../src/day2-audio-data.mjs";
import { DAY12_PRESENTATION_SCENES,DAY12_REQUIRED_NEW_ASSETS,validateDay12PresentationData } from "../src/day12-presentation-data.mjs";

assert.equal(validateDay12PresentationData(),true);
assert.deepEqual(DAY12_REQUIRED_NEW_ASSETS,{});
assert.equal(Object.keys(DAY12_PRESENTATION_SCENES).length,8);
assert.ok(Object.values(DAY12_PRESENTATION_SCENES).every(scene=>scene.assetStatus==="audited"));

const backgroundIds=[...new Set(Object.values(DAY12_PRESENTATION_SCENES).map(scene=>scene.backgroundId))];
assert.deepEqual(backgroundIds.sort(),["day2-home-entry","home-morning","neighborhood-cafe-day"].sort());
for(const id of backgroundIds){
  const path=BACKGROUND_ASSETS[id];
  assert.ok(path,id);
  assert.ok(existsSync(new URL(`../${path}`,import.meta.url)),path);
}
assert.ok(existsSync(new URL(`../${STORY_OUTFIT_ASSETS.day8}`,import.meta.url)));

const audio={...DAY1_AUDIO_CUES,...DAY2_AUDIO_CUES};
for(const [id,scene] of Object.entries(DAY12_PRESENTATION_SCENES))for(const cueId of scene.sfx){
  assert.ok(audio[cueId],`${id} ${cueId}`);
  assert.ok(existsSync(new URL(`../${audio[cueId].source}`,import.meta.url)),audio[cueId].source);
}

for(const id of ["S04_READ_NOT_SPEND","S07_ACCESS_SCOPE"]){
  assert.match(DAY12_PRESENTATION_SCENES[id].camera,/obscured/);
  assert.equal(DAY12_PRESENTATION_SCENES[id].expressionId,["S04_READ_NOT_SPEND"].includes(id)?"calm":"smile");
}
assert.ok(Object.values(DAY12_PRESENTATION_SCENES).every(scene=>scene.bgm.category==="daily"));
assert.ok(Object.values(DAY12_PRESENTATION_SCENES).every(scene=>!scene.sfx.some(id=>/HEART|RING|CRISIS|IMPACT|GLITCH/.test(id))));

const audit=readFileSync(new URL("../docs/day12/DAY12_ASSET_DIRECTION_AUDIO_AUDIT.md",import.meta.url),"utf8");
for(const marker of ["신규 최종 아트 필요: 0종","개인정보 비가독","공포 줌·비네트·글리치 금지","assetStatus: audited"])assert.ok(audit.includes(marker),marker);
console.log("✓ DAY 12 기존 3배경·하은 1인물 audited / 8 Scene 연출·daily BGM·생활 SFX / 신규 자산 0");
