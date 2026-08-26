import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync,readFileSync } from "node:fs";
import { BACKGROUND_ASSETS } from "../src/assets/asset-manifest.mjs";
import { STORY_OUTFIT_ASSETS } from "../src/story-outfit-assets.mjs";
import { DAY1_AUDIO_CUES } from "../src/day1-audio-data.mjs";
import { DAY2_AUDIO_CUES } from "../src/day2-audio-data.mjs";
import { DAY12_PRESENTATION_SCENES,DAY12_REQUIRED_NEW_ASSETS,validateDay12PresentationData } from "../src/day12-presentation-data.mjs";

assert.equal(validateDay12PresentationData(),true);
assert.deepEqual(DAY12_REQUIRED_NEW_ASSETS,{heroineOutfit:STORY_OUTFIT_ASSETS.day12});
assert.equal(Object.keys(DAY12_PRESENTATION_SCENES).length,8);
assert.ok(Object.values(DAY12_PRESENTATION_SCENES).every(scene=>scene.assetStatus==="ready"));

const pngData=path=>{
  const png=readFileSync(new URL(`../${path}`,import.meta.url));
  assert.equal(png.subarray(1,4).toString(),"PNG",path);
  return {png,width:png.readUInt32BE(16),height:png.readUInt32BE(20),colorType:png[25],sha256:createHash("sha256").update(png).digest("hex")};
};

const backgroundIds=[...new Set(Object.values(DAY12_PRESENTATION_SCENES).map(scene=>scene.backgroundId))];
assert.deepEqual(backgroundIds.sort(),["day2-home-entry","home-morning","neighborhood-cafe-day"].sort());
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
assert.ok(existsSync(new URL(`../${STORY_OUTFIT_ASSETS.day12}`,import.meta.url)));
const heroine=pngData(STORY_OUTFIT_ASSETS.day12);
assert.equal(heroine.width,887);
assert.equal(heroine.height,1774);
assert.equal(heroine.colorType,6);
assert.equal(heroine.sha256,"6cc4baa8aea4572107bac09017bee07bd53e3d65c200d141de642982574a08f0");

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
for(const marker of ["신규 최종 아트 필요: 1종","개인정보 비가독","공포 줌·비네트·글리치 금지","assetStatus: audited"])assert.ok(audit.includes(marker),marker);
const imageQa=readFileSync(new URL("../docs/day12/DAY12_IMAGE_QUALITY_QA.md",import.meta.url),"utf8");
for(const marker of ["IMAGE QA PASS","NEEDS FIX: 0","1672×941","887×1774","RGBA"])assert.ok(imageQa.includes(marker),marker);
console.log("✓ DAY 12 기존 3배경·전용 하은 생활복 IMAGE QA PASS / 8 Scene ready / 신규 자산 1");
