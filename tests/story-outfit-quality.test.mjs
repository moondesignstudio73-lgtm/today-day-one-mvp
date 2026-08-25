import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { getLockedDay4ResumePresentation } from "../src/day4-campaign-runtime.mjs";
import { getLockedDay5ResumePresentation } from "../src/day5-campaign-runtime.mjs";
import { resolveStoryPresentation } from "../src/scene-presentation.mjs";
import { STORY_SCENES } from "../src/story-data.mjs";
import { STORY_OUTFIT_ASSETS } from "../src/story-outfit-assets.mjs";

function inspectPng(source){
  const url=new URL(`../${source}`,import.meta.url);
  assert.equal(existsSync(url),true,`${source}: missing story outfit`);
  const file=readFileSync(url);
  assert.equal(file.subarray(1,4).toString(),"PNG",source);
  assert.equal(file[25],6,`${source}: expected a real RGBA PNG`);
  return {width:file.readUInt32BE(16),height:file.readUInt32BE(20)};
}

for(const source of Object.values(STORY_OUTFIT_ASSETS)){
  const {width,height}=inspectPng(source);
  assert.ok(width>=850,`${source}: width must stay high-resolution`);
  assert.ok(height>=1700,`${source}: height must stay high-resolution`);
}

const day3=STORY_SCENES.find(scene=>scene.id==="m30-day3-discharge-phone");
assert.equal(resolveStoryPresentation(day3,{day:3,phase:1}).characterAssetUrl,STORY_OUTFIT_ASSETS.day3);

for(const stage of [0,1,2,3,4,5]){
  assert.equal(getLockedDay4ResumePresentation({storyFlags:{day4RuntimeStage:stage}}).characterAssetUrl,STORY_OUTFIT_ASSETS.day4);
}
for(const stage of [0,1,2,3,4]){
  assert.equal(getLockedDay5ResumePresentation({storyFlags:{day5RuntimeStage:stage}}).characterAssetUrl,STORY_OUTFIT_ASSETS.day5);
}

const game=readFileSync(new URL("../game.js",import.meta.url),"utf8");
assert.match(game,/characterId==="girlfriend"&&immersiveScene\?\.activeCharacterAssetUrl/);
assert.match(game,/preloadImmersiveAssets\(\[\{assetUrl:immersiveScene\.activeCharacterAssetUrl\},\.\.\.session\.sequence\]\)/);

console.log("✓ DAY 3~5 일차별 고해상도 의상·복원 계약 PASS");
