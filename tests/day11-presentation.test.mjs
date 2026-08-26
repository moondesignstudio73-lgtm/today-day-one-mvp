import assert from "node:assert/strict";
import { existsSync,readFileSync } from "node:fs";
import { BACKGROUND_ASSETS } from "../src/assets/asset-manifest.mjs";
import { STORY_OUTFIT_ASSETS } from "../src/story-outfit-assets.mjs";
import { DAY1_AUDIO_CUES } from "../src/day1-audio-data.mjs";
import { DAY2_AUDIO_CUES } from "../src/day2-audio-data.mjs";
import { DAY11_PRESENTATION_SCENES,DAY11_REQUIRED_NEW_ASSETS,validateDay11PresentationData } from "../src/day11-presentation-data.mjs";

assert.equal(validateDay11PresentationData(),true);
assert.deepEqual(DAY11_REQUIRED_NEW_ASSETS,{});
assert.equal(Object.keys(DAY11_PRESENTATION_SCENES).length,8);

const audio={...DAY1_AUDIO_CUES,...DAY2_AUDIO_CUES};
const pngDimensions=path=>{const png=readFileSync(new URL(`../${path}`,import.meta.url));assert.equal(png.subarray(1,4).toString(),"PNG",path);return {width:png.readUInt32BE(16),height:png.readUInt32BE(20),colorType:png[25]};};
const backgroundIds=[...new Set(Object.values(DAY11_PRESENTATION_SCENES).map(scene=>scene.backgroundId))];
assert.deepEqual(backgroundIds.sort(),["day2-home-entry","home-morning","neighborhood-cafe-day","neighborhood-park-day","neighborhood-street-day"].sort());
for(const id of backgroundIds){
  const path=BACKGROUND_ASSETS[id];assert.ok(path,id);assert.ok(existsSync(new URL(`../${path}`,import.meta.url)),path);
  const {width,height,colorType}=pngDimensions(path);assert.equal(width,1672,id);assert.equal(height,941,id);assert.equal(colorType,2,id);assert.ok(Math.abs(width/height-16/9)<0.01,id);
}
const heroine=pngDimensions(STORY_OUTFIT_ASSETS.day8);assert.equal(heroine.width,887);assert.equal(heroine.height,1774);assert.equal(heroine.colorType,6);
for(const [id,scene] of Object.entries(DAY11_PRESENTATION_SCENES))for(const cueId of scene.sfx){assert.ok(audio[cueId],`${id} ${cueId}`);assert.ok(existsSync(new URL(`../${audio[cueId].source}`,import.meta.url)),audio[cueId].source);}

assert.equal(DAY11_PRESENTATION_SCENES.S02_TWO_DATES.expressionId,"calm");
assert.equal(DAY11_PRESENTATION_SCENES.S02_TWO_DATES.bgm.category,"daily");
assert.ok(Object.values(DAY11_PRESENTATION_SCENES).every(scene=>!scene.sfx.some(id=>/HEART|RING|CRISIS|IMPACT|GLITCH/.test(id))));
console.log("✓ DAY 11 기존 5배경·하은 1인물·8 Scene·생활형 daily BGM/SFX 감사 PASS / 신규 자산 0");

