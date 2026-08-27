import assert from "node:assert/strict";
import { existsSync,readFileSync } from "node:fs";
import { BACKGROUND_ASSETS } from "../src/assets/asset-manifest.mjs";
import { STORY_OUTFIT_ASSETS } from "../src/story-outfit-assets.mjs";
import { DAY1_AUDIO_CUES } from "../src/day1-audio-data.mjs";
import { DAY2_AUDIO_CUES } from "../src/day2-audio-data.mjs";
import { DAY14_PRESENTATION_SCENES,DAY14_REQUIRED_NEW_ASSETS,validateDay14PresentationData } from "../src/day14-presentation-data.mjs";

assert.equal(validateDay14PresentationData(),true);
assert.deepEqual(DAY14_REQUIRED_NEW_ASSETS,[]);
assert.equal(Object.keys(DAY14_PRESENTATION_SCENES).length,8);
assert.ok(Object.values(DAY14_PRESENTATION_SCENES).every(scene=>scene.assetStatus==="audited"));
assert.ok(Object.values(DAY14_PRESENTATION_SCENES).every(scene=>scene.characterAssetKey==="day8"));
assert.equal(STORY_OUTFIT_ASSETS.day8,"assets/characters/story-outfits/haeun-day8-errand-sage-2d-v1.png");
assert.ok(existsSync(new URL(`../${STORY_OUTFIT_ASSETS.day8}`,import.meta.url)));

const backgroundIds=[...new Set(Object.values(DAY14_PRESENTATION_SCENES).map(scene=>scene.backgroundId))];
assert.deepEqual(backgroundIds.sort(),["day2-home-entry","day8-household-store-day","home-morning","neighborhood-cafe-day","neighborhood-market-day"].sort());
for(const id of backgroundIds){
  const path=BACKGROUND_ASSETS[id];
  assert.ok(path,id);
  assert.ok(existsSync(new URL(`../${path}`,import.meta.url)),path);
}

const audio={...DAY1_AUDIO_CUES,...DAY2_AUDIO_CUES};
for(const [id,scene] of Object.entries(DAY14_PRESENTATION_SCENES))for(const cueId of scene.sfx){
  assert.ok(audio[cueId],`${id} ${cueId}`);
  assert.ok(existsSync(new URL(`../${audio[cueId].source}`,import.meta.url)),audio[cueId].source);
}
for(const id of ["S04_UNSOURCED_RECOMMENDATION","S07_GIFT_CONSENT"])assert.match(DAY14_PRESENTATION_SCENES[id].camera,/obscured/);
assert.ok(Object.values(DAY14_PRESENTATION_SCENES).every(scene=>scene.bgm.category==="daily"));
assert.ok(Object.values(DAY14_PRESENTATION_SCENES).every(scene=>!scene.sfx.some(id=>/HEART|RING|CRISIS|IMPACT|GLITCH/.test(id))));

const audit=readFileSync(new URL("../docs/day14/DAY14_ASSET_DIRECTION_AUDIO_AUDIT.md",import.meta.url),"utf8");
for(const marker of ["ASSET / DIRECTION / AUDIO AUDIT PASS","신규 최종 아트 필요: 0종","개인정보 비가독","공포 줌","assetStatus: audited","DAY 8 생활형 외출복","하은 단독 감시 구도"])assert.ok(audit.includes(marker),marker);
console.log("✓ DAY 14 기존 5배경·하은 DAY 8 생활복·8 Scene 연출/오디오 audited / 신규 자산 0");
