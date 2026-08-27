import assert from "node:assert/strict";
import { existsSync,readFileSync } from "node:fs";
import { BACKGROUND_ASSETS } from "../src/assets/asset-manifest.mjs";
import { STORY_OUTFIT_ASSETS } from "../src/story-outfit-assets.mjs";
import { DAY1_AUDIO_CUES } from "../src/day1-audio-data.mjs";
import { DAY2_AUDIO_CUES } from "../src/day2-audio-data.mjs";
import { DAY15_PRESENTATION_SCENES,DAY15_REQUIRED_NEW_ASSETS,validateDay15PresentationData } from "../src/day15-presentation-data.mjs";

assert.equal(validateDay15PresentationData(),true);
assert.deepEqual(DAY15_REQUIRED_NEW_ASSETS,[]);
assert.equal(Object.keys(DAY15_PRESENTATION_SCENES).length,8);
assert.ok(Object.values(DAY15_PRESENTATION_SCENES).every(scene=>scene.assetStatus==="audited"));
assert.ok(Object.values(DAY15_PRESENTATION_SCENES).every(scene=>scene.characterAssetKey==="day7"));
assert.equal(STORY_OUTFIT_ASSETS.day7,"assets/characters/story-outfits/haeun-day7-date-dusty-rose-2d-v1.png");
assert.ok(existsSync(new URL(`../${STORY_OUTFIT_ASSETS.day7}`,import.meta.url)));

const backgroundIds=[...new Set(Object.values(DAY15_PRESENTATION_SCENES).flatMap(scene=>[scene.backgroundId,...Object.values(scene.branchBackgrounds??{})]))];
assert.deepEqual(backgroundIds.sort(),["home-morning","neighborhood-street-day","day7-bookshop-day","day7-gallery-day","day7-river-promenade-day","neighborhood-cafe-day"].sort());
for(const id of backgroundIds){
  const path=BACKGROUND_ASSETS[id];
  assert.ok(path,id);
  assert.ok(existsSync(new URL(`../${path}`,import.meta.url)),path);
}

const audio={...DAY1_AUDIO_CUES,...DAY2_AUDIO_CUES};
for(const [id,scene] of Object.entries(DAY15_PRESENTATION_SCENES))for(const cueId of scene.sfx){
  assert.ok(audio[cueId],`${id} ${cueId}`);
  assert.ok(existsSync(new URL(`../${audio[cueId].source}`,import.meta.url)),audio[cueId].source);
}
for(const id of ["S04_FIRST_OR_RETURN","S08_BEFORE_PHOTO"])assert.match(DAY15_PRESENTATION_SCENES[id].camera,/obscured/);
assert.ok(Object.values(DAY15_PRESENTATION_SCENES).every(scene=>!scene.sfx.some(id=>/HEART|RING|CRISIS|IMPACT|GLITCH/.test(id))));
assert.equal(DAY15_PRESENTATION_SCENES.S04_FIRST_OR_RETURN.bgm.category,"dateShopping");

const audit=readFileSync(new URL("../docs/day15/DAY15_ASSET_DIRECTION_AUDIO_AUDIT.md",import.meta.url),"utf8");
for(const marker of ["ASSET / DIRECTION / AUDIO AUDIT PASS","신규 최종 아트 필요: 0종","assetStatus: audited","DAY 7 데이트 외출복","별도 계정 CG는 만들지 않는다","공포 줌","하은 단독 감시 구도","다음 이미지 QA 관문"])assert.ok(audit.includes(marker),marker);
console.log("✓ DAY 15 기존 6배경·하은 DAY 7 외출복·8 Scene 연출/오디오 audited / 신규 자산 0");
