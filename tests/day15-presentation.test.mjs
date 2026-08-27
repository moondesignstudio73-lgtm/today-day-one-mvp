import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync,readFileSync } from "node:fs";
import { BACKGROUND_ASSETS } from "../src/assets/asset-manifest.mjs";
import { STORY_OUTFIT_ASSETS } from "../src/story-outfit-assets.mjs";
import { DAY1_AUDIO_CUES } from "../src/day1-audio-data.mjs";
import { DAY2_AUDIO_CUES } from "../src/day2-audio-data.mjs";
import { DAY15_PRESENTATION_SCENES,DAY15_REQUIRED_NEW_ASSETS,validateDay15PresentationData } from "../src/day15-presentation-data.mjs";

assert.equal(validateDay15PresentationData(),true);
assert.deepEqual(DAY15_REQUIRED_NEW_ASSETS,[]);
assert.equal(Object.keys(DAY15_PRESENTATION_SCENES).length,8);
assert.ok(Object.values(DAY15_PRESENTATION_SCENES).every(scene=>scene.assetStatus==="ready"));
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

const expectedImages=new Map([
  ["assets/backgrounds/morning-studio-2d.png",{width:1672,height:941,colorType:2,sha256:"1412af800eef65ebcb8aa35bc0e2d26394d12c216b3512d6d10c823aa2f83f42"}],
  ["assets/backgrounds/street/BG_RELATIONSHIP_STREET_DAY_001.png",{width:1672,height:941,colorType:2,sha256:"973f0bc371f1ba76c932f1944d7952ad72bbc4883812e2cc06c3b69db3526583"}],
  ["assets/backgrounds/day7/day7-small-bookshop-day-v1.png",{width:1672,height:941,colorType:2,sha256:"0936dbd236a5143449b0dc00ff0362c72998b6715ffe565e6f90a1657691a229"}],
  ["assets/backgrounds/map-locations/016_gallery.png",{width:1672,height:941,colorType:2,sha256:"de1e0a06b3e879644ed4723b6912ad7795741f7b4809b7ce6014cfde9f52452c"}],
  ["assets/backgrounds/day7/day7-river-promenade-day-v1.png",{width:1672,height:941,colorType:2,sha256:"b2dabd2d5ddac5c1262e1ef1a40c3dbd91c1d510dee96ddf2da72f78d8953ada"}],
  ["assets/backgrounds/day6/day6-neighborhood-cafe-day-v1.png",{width:1672,height:941,colorType:2,sha256:"fefb300b80d4172ac83ad9b9c59c65d1e4016a459e1f458887d89eb9d8b21661"}],
  ["assets/characters/story-outfits/haeun-day7-date-dusty-rose-2d-v1.png",{width:887,height:1774,colorType:6,sha256:"e406ea58109d81712a7d2252235dce10e1cb678480c272170093073113d29c42"}]
]);
for(const [path,expected] of expectedImages){
  const bytes=readFileSync(new URL(`../${path}`,import.meta.url));
  assert.equal(bytes.subarray(1,4).toString(),"PNG",path);
  assert.equal(bytes.readUInt32BE(16),expected.width,path);
  assert.equal(bytes.readUInt32BE(20),expected.height,path);
  assert.equal(bytes[24],8,path);
  assert.equal(bytes[25],expected.colorType,path);
  assert.equal(createHash("sha256").update(bytes).digest("hex"),expected.sha256,path);
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
const imageQa=readFileSync(new URL("../docs/day15/DAY15_IMAGE_QUALITY_QA.md",import.meta.url),"utf8");
for(const marker of ["IMAGE QA PASS","NEEDS FIX`: 0","1672×941, 8-bit RGB PNG","887×1774, 8-bit RGBA PNG","assetStatus: ready","신규 자산 제작: 0종","공포 줌","기존 및 사용자 자산 수정·덮어쓰기·삭제·이동: 0건"])assert.ok(imageQa.includes(marker),marker);
console.log("✓ DAY 15 기존 6배경·하은 DAY 7 외출복 IMAGE QA PASS / 8 Scene ready / 신규 자산 0");
