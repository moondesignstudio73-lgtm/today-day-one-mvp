import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync,readFileSync } from "node:fs";
import { BACKGROUND_ASSETS } from "../src/assets/asset-manifest.mjs";
import { STORY_OUTFIT_ASSETS } from "../src/story-outfit-assets.mjs";
import { DAY1_AUDIO_CUES } from "../src/day1-audio-data.mjs";
import { DAY2_AUDIO_CUES } from "../src/day2-audio-data.mjs";
import { DAY13_PRESENTATION_SCENES,DAY13_REQUIRED_NEW_ASSETS,validateDay13PresentationData } from "../src/day13-presentation-data.mjs";

assert.equal(validateDay13PresentationData(),true);
assert.deepEqual(DAY13_REQUIRED_NEW_ASSETS,[]);
assert.equal(Object.keys(DAY13_PRESENTATION_SCENES).length,8);
assert.ok(Object.values(DAY13_PRESENTATION_SCENES).every(scene=>scene.assetStatus==="ready"));
assert.ok(Object.values(DAY13_PRESENTATION_SCENES).every(scene=>scene.characterAssetKey==="day6"));
assert.equal(STORY_OUTFIT_ASSETS.day6,"assets/characters/story-outfits/haeun-day6-neighborhood-casual-2d-v1.png");

const pngData=path=>{
  const png=readFileSync(new URL(`../${path}`,import.meta.url));
  assert.equal(png.subarray(1,4).toString(),"PNG",path);
  return {width:png.readUInt32BE(16),height:png.readUInt32BE(20),colorType:png[25],sha256:createHash("sha256").update(png).digest("hex")};
};

const backgroundIds=[...new Set(Object.values(DAY13_PRESENTATION_SCENES).map(scene=>scene.backgroundId))];
assert.deepEqual(backgroundIds.sort(),["day2-home-entry","home-morning","neighborhood-cafe-day","neighborhood-market-day"].sort());
for(const id of backgroundIds){
  const path=BACKGROUND_ASSETS[id];
  assert.ok(path,id);
  assert.ok(existsSync(new URL(`../${path}`,import.meta.url)),path);
  const image=pngData(path);
  assert.equal(image.width,1672,id);
  assert.equal(image.height,941,id);
  assert.equal(image.colorType,2,id);
  assert.ok(Math.abs(image.width/image.height-16/9)<0.01,id);
}
assert.deepEqual(Object.fromEntries(backgroundIds.map(id=>[id,pngData(BACKGROUND_ASSETS[id]).sha256])),{
  "home-morning":"1412af800eef65ebcb8aa35bc0e2d26394d12c216b3512d6d10c823aa2f83f42",
  "day2-home-entry":"4dc6554963c7e63f396558ec8c1724ba3bc470f4ab3be34c955c109cff7afd38",
  "neighborhood-market-day":"3a5e2f7394dc54f189b23a0892e8f3b6bbda5bd3628307872c22ea87a81ffb9d",
  "neighborhood-cafe-day":"fefb300b80d4172ac83ad9b9c59c65d1e4016a459e1f458887d89eb9d8b21661"
});
assert.ok(existsSync(new URL(`../${STORY_OUTFIT_ASSETS.day6}`,import.meta.url)));
const heroine=pngData(STORY_OUTFIT_ASSETS.day6);
assert.equal(heroine.width,887);
assert.equal(heroine.height,1774);
assert.equal(heroine.colorType,6);
assert.equal(heroine.sha256,"c8e116a8d27f8278e5b6f7126624bb9032fc6f083f06a03ecc8b88b1c8c8b910");

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
const imageQa=readFileSync(new URL("../docs/day13/DAY13_IMAGE_QUALITY_QA.md",import.meta.url),"utf8");
for(const marker of ["IMAGE QA PASS","NEEDS FIX: 0","1672×941 RGB PNG","887×1774 RGBA PNG","assetStatus: ready","신규 자산 제작: 0종"])assert.ok(imageQa.includes(marker),marker);
console.log("✓ DAY 13 기존 4배경·하은 DAY 6 생활복 IMAGE QA PASS / 8 Scene ready / 신규 자산 0");
