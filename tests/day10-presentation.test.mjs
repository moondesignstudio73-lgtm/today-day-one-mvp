import assert from "node:assert/strict";
import {existsSync,readFileSync} from "node:fs";
import {BACKGROUND_ASSETS,getNpcSprite} from "../src/assets/asset-manifest.mjs";
import {STORY_OUTFIT_ASSETS} from "../src/story-outfit-assets.mjs";
import {DAY1_AUDIO_CUES} from "../src/day1-audio-data.mjs";
import {DAY2_AUDIO_CUES} from "../src/day2-audio-data.mjs";
import {DAY10_PRESENTATION_SCENES,DAY10_REQUIRED_NEW_ASSETS,validateDay10PresentationData} from "../src/day10-presentation-data.mjs";

assert.equal(validateDay10PresentationData(),true);
assert.deepEqual(DAY10_REQUIRED_NEW_ASSETS,{});
assert.equal(Object.keys(DAY10_PRESENTATION_SCENES).length,8);

const audio={...DAY1_AUDIO_CUES,...DAY2_AUDIO_CUES};
for(const [id,scene] of Object.entries(DAY10_PRESENTATION_SCENES)){
  const background=BACKGROUND_ASSETS[scene.backgroundId];
  assert.ok(background,`${id} background manifest`);
  assert.ok(existsSync(new URL(`../${background}`,import.meta.url)),`${id} background file`);
  if(scene.characterId==="girlfriend")assert.equal(scene.characterAssetKey,"day8",`${id} heroine outfit`);
  else assert.ok(getNpcSprite(scene.characterId),`${id} npc`);
  for(const characterId of scene.sequenceCharacterIds??[])assert.ok(getNpcSprite(characterId),`${id} sequence ${characterId}`);
  for(const cueId of scene.sfx){assert.ok(audio[cueId],cueId);assert.ok(existsSync(new URL(`../${audio[cueId].source}`,import.meta.url)),audio[cueId].source);}
}

const pngDimensions=path=>{const png=readFileSync(new URL(`../${path}`,import.meta.url));assert.equal(png.subarray(1,4).toString(),"PNG",path);return {width:png.readUInt32BE(16),height:png.readUInt32BE(20),colorType:png[25]};};
for(const backgroundId of ["home-morning","day9-office-project-room-day","neighborhood-cafe-day"]){
  const {width,height}=pngDimensions(BACKGROUND_ASSETS[backgroundId]);
  assert.equal(width,1672,backgroundId);assert.equal(height,941,backgroundId);assert.ok(Math.abs(width/height-16/9)<0.01,backgroundId);
}
for(const path of [STORY_OUTFIT_ASSETS.day8,getNpcSprite("office-best-male"),getNpcSprite("female-coworker"),getNpcSprite("team-lead")]){
  const {width,height,colorType}=pngDimensions(path);
  assert.ok(width>=887&&height>=1536,path);assert.equal(colorType,6,`${path} RGBA`);
}

assert.equal(DAY10_PRESENTATION_SCENES.S05_CURRENT_LUNCH.backgroundId,"neighborhood-cafe-day");
assert.deepEqual(DAY10_PRESENTATION_SCENES.S05_CURRENT_LUNCH.sequenceCharacterIds,["office-best-male","female-coworker"]);
assert.deepEqual(DAY10_PRESENTATION_SCENES.S06_FINAL_BLOCK.sequenceCharacterIds,["female-coworker","team-lead"]);
assert.ok(Object.values(DAY10_PRESENTATION_SCENES).every(scene=>scene.bgm.category==="daily"));
assert.ok(Object.values(DAY10_PRESENTATION_SCENES).every(scene=>!scene.sfx.some(id=>/HEART|RING|CRISIS|IMPACT/.test(id))));

console.log("✓ DAY 10 기존 4배경·4인물·8 Scene·낮 카페·화자 교대·daily BGM/SFX 계약 PASS / 신규 자산 0");
