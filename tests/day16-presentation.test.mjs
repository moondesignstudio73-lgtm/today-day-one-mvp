import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync,readFileSync } from "node:fs";
import { BACKGROUND_ASSETS,NPC_ASSETS } from "../src/assets/asset-manifest.mjs";
import { STORY_OUTFIT_ASSETS } from "../src/story-outfit-assets.mjs";
import { DAY1_AUDIO_CUES } from "../src/day1-audio-data.mjs";
import { DAY2_AUDIO_CUES } from "../src/day2-audio-data.mjs";
import { DAY16_PRESENTATION_SCENES,DAY16_REQUIRED_NEW_ASSETS,validateDay16PresentationData } from "../src/day16-presentation-data.mjs";

assert.equal(validateDay16PresentationData(),true);
assert.deepEqual(DAY16_REQUIRED_NEW_ASSETS,[]);
assert.equal(Object.keys(DAY16_PRESENTATION_SCENES).length,8);
assert.ok(Object.values(DAY16_PRESENTATION_SCENES).every(scene=>scene.assetStatus==="ready"));
assert.equal(STORY_OUTFIT_ASSETS.day8,"assets/characters/story-outfits/haeun-day8-errand-sage-2d-v1.png");
assert.equal(NPC_ASSETS["best-friend"],"assets/npcs/best-friend.png");
for(const path of [STORY_OUTFIT_ASSETS.day8,NPC_ASSETS["best-friend"]])assert.ok(existsSync(new URL(`../${path}`,import.meta.url)),path);

const backgroundIds=[...new Set(Object.values(DAY16_PRESENTATION_SCENES).flatMap(scene=>[scene.backgroundId,...Object.values(scene.branchBackgrounds??{})]))];
assert.deepEqual(backgroundIds.sort(),["home-morning","neighborhood-cafe-day","neighborhood-street-day"].sort());
for(const id of backgroundIds){
  const path=BACKGROUND_ASSETS[id];
  assert.ok(path,id);
  assert.ok(existsSync(new URL(`../${path}`,import.meta.url)),path);
}

const expectedImages=new Map([
  ["assets/backgrounds/morning-studio-2d.png",{width:1672,height:941,colorType:2,sha256:"1412af800eef65ebcb8aa35bc0e2d26394d12c216b3512d6d10c823aa2f83f42"}],
  ["assets/backgrounds/day6/day6-neighborhood-cafe-day-v1.png",{width:1672,height:941,colorType:2,sha256:"fefb300b80d4172ac83ad9b9c59c65d1e4016a459e1f458887d89eb9d8b21661"}],
  ["assets/backgrounds/street/BG_RELATIONSHIP_STREET_DAY_001.png",{width:1672,height:941,colorType:2,sha256:"973f0bc371f1ba76c932f1944d7952ad72bbc4883812e2cc06c3b69db3526583"}],
  ["assets/characters/story-outfits/haeun-day8-errand-sage-2d-v1.png",{width:887,height:1774,colorType:6,sha256:"7526406e31919c4a5f625f31e5577d6f0a6d9a6ccead4a5f17a54cd0e30496ae"}],
  ["assets/npcs/best-friend.png",{width:1024,height:1536,colorType:6,sha256:"2d3ede82f10df1f651a6004c462399e2a9c96c848d4195cfbc9366cf3fe88e44"}]
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
for(const [id,scene] of Object.entries(DAY16_PRESENTATION_SCENES))for(const cueId of scene.sfx){
  assert.ok(audio[cueId],`${id} ${cueId}`);
  assert.ok(existsSync(new URL(`../${audio[cueId].source}`,import.meta.url)),audio[cueId].source);
}
assert.match(DAY16_PRESENTATION_SCENES.S02_REPLY_SENTENCE.camera,/obscured/);
assert.match(DAY16_PRESENTATION_SCENES.S05_SCOPE_OF_FRIEND.camera,/obscured/);
assert.ok(Object.values(DAY16_PRESENTATION_SCENES).every(scene=>scene.bgm.category==="daily"));
assert.ok(Object.values(DAY16_PRESENTATION_SCENES).every(scene=>!scene.sfx.some(id=>/HEART|RING|CRISIS|IMPACT|GLITCH/.test(id))));

const audit=readFileSync(new URL("../docs/day16/DAY16_ASSET_DIRECTION_AUDIO_AUDIT.md",import.meta.url),"utf8");
for(const marker of ["ASSET / DIRECTION / AUDIO AUDIT PASS","신규 최종 아트 필요: 0종","assetStatus: audited","하은 DAY 8 생활 외출복","지훈 기존 NPC","흐린 소품","공포 줌","하은 단독 감시 구도","다음 이미지 QA 관문"])assert.ok(audit.includes(marker),marker);
const imageQa=readFileSync(new URL("../docs/day16/DAY16_IMAGE_QUALITY_QA.md",import.meta.url),"utf8");
for(const marker of ["IMAGE QA PASS","NEEDS FIX`: 0","1672×941, 8-bit RGB PNG","887×1774, 8-bit RGBA PNG","1024×1536, 8-bit RGBA PNG","assetStatus: ready","신규 자산 제작: 0종","기존 및 사용자 자산 수정·덮어쓰기·삭제·이동: 0건"])assert.ok(imageQa.includes(marker),marker);
console.log("✓ DAY 16 기존 3배경·하은 DAY 8·지훈 NPC IMAGE QA PASS / 8 Scene ready / 신규 자산 0");
