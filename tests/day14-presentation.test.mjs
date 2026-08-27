import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync,readFileSync } from "node:fs";
import { BACKGROUND_ASSETS } from "../src/assets/asset-manifest.mjs";
import { STORY_OUTFIT_ASSETS } from "../src/story-outfit-assets.mjs";
import { DAY1_AUDIO_CUES } from "../src/day1-audio-data.mjs";
import { DAY2_AUDIO_CUES } from "../src/day2-audio-data.mjs";
import { DAY14_PRESENTATION_SCENES,DAY14_REQUIRED_NEW_ASSETS,validateDay14PresentationData } from "../src/day14-presentation-data.mjs";

assert.equal(validateDay14PresentationData(),true);
assert.deepEqual(DAY14_REQUIRED_NEW_ASSETS,[]);
assert.equal(Object.keys(DAY14_PRESENTATION_SCENES).length,8);
assert.ok(Object.values(DAY14_PRESENTATION_SCENES).every(scene=>scene.assetStatus==="ready"));
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

const expectedImages=new Map([
  ["assets/backgrounds/morning-studio-2d.png",{width:1672,height:941,colorType:2,sha256:"1412af800eef65ebcb8aa35bc0e2d26394d12c216b3512d6d10c823aa2f83f42"}],
  ["assets/backgrounds/day2/day2-home-entry-living-afternoon-v1.png",{width:1672,height:941,colorType:2,sha256:"4dc6554963c7e63f396558ec8c1724ba3bc470f4ab3be34c955c109cff7afd38"}],
  ["assets/backgrounds/day8/day8-household-store-day-v1.png",{width:1672,height:941,colorType:2,sha256:"fa1e01c4d550f36057e0c4a25327da007c926f6c6882a8adb7e0e9d0d557a315"}],
  ["assets/backgrounds/day6/day6-neighborhood-market-day-v1.png",{width:1672,height:941,colorType:2,sha256:"3a5e2f7394dc54f189b23a0892e8f3b6bbda5bd3628307872c22ea87a81ffb9d"}],
  ["assets/backgrounds/day6/day6-neighborhood-cafe-day-v1.png",{width:1672,height:941,colorType:2,sha256:"fefb300b80d4172ac83ad9b9c59c65d1e4016a459e1f458887d89eb9d8b21661"}],
  ["assets/characters/story-outfits/haeun-day8-errand-sage-2d-v1.png",{width:887,height:1774,colorType:6,sha256:"7526406e31919c4a5f625f31e5577d6f0a6d9a6ccead4a5f17a54cd0e30496ae"}]
]);
for(const [path,expected] of expectedImages){
  const bytes=readFileSync(new URL(`../${path}`,import.meta.url));
  assert.equal(bytes.subarray(1,4).toString(),"PNG",path);
  assert.equal(bytes.readUInt32BE(16),expected.width,path);
  assert.equal(bytes.readUInt32BE(20),expected.height,path);
  assert.equal(bytes[25],expected.colorType,path);
  assert.equal(createHash("sha256").update(bytes).digest("hex"),expected.sha256,path);
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
const imageQa=readFileSync(new URL("../docs/day14/DAY14_IMAGE_QUALITY_QA.md",import.meta.url),"utf8");
for(const marker of ["IMAGE QA PASS","NEEDS FIX: 0","1672×941 RGB PNG","887×1774 RGBA PNG","assetStatus: ready","신규 자산 제작: 0종","공포 줌","기존 및 사용자 자산 수정·덮어쓰기·삭제·이동: 0건"])assert.ok(imageQa.includes(marker),marker);
console.log("✓ DAY 14 기존 5배경·하은 DAY 8 생활복 IMAGE QA PASS / 8 Scene ready / 신규 자산 0");
