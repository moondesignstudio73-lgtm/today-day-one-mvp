import assert from "node:assert/strict";
import {existsSync,readFileSync} from "node:fs";
import {BACKGROUND_ASSETS,getCharacterSprite} from "../src/assets/asset-manifest.mjs";
import {DAY1_AUDIO_CUES} from "../src/day1-audio-data.mjs";
import {DAY2_AUDIO_CUES} from "../src/day2-audio-data.mjs";
import {DAY8_PRESENTATION_SCENES,DAY8_REQUIRED_BACKGROUND_ASSETS,validateDay8PresentationData} from "../src/day8-presentation-data.mjs";

assert.equal(validateDay8PresentationData(),true);
const audio={...DAY1_AUDIO_CUES,...DAY2_AUDIO_CUES};
for(const [id,scene] of Object.entries(DAY8_PRESENTATION_SCENES)){
  for(const backgroundId of [scene.backgroundId,...Object.values(scene.branchBackgrounds??{})]){
    const path=BACKGROUND_ASSETS[backgroundId];
    assert.ok(path,`${id} background`);
    assert.ok(existsSync(new URL(`../${path}`,import.meta.url)),path);
  }
  if(scene.characterId) assert.ok(getCharacterSprite(scene.characterId,scene.expressionId,scene.poseId),`${id} sprite`);
  else assert.equal(scene.expressionId,scene.poseId,`${id} solo presentation`);
  for(const cueId of scene.sfx){
    assert.ok(audio[cueId],cueId);
    assert.ok(existsSync(new URL(`../${audio[cueId].source}`,import.meta.url)),audio[cueId].source);
  }
}

assert.deepEqual(Object.keys(DAY8_REQUIRED_BACKGROUND_ASSETS),["day8-household-store-day"]);
for(const [id,path] of Object.entries(DAY8_REQUIRED_BACKGROUND_ASSETS)){
  const url=new URL(`../${path}`,import.meta.url);
  assert.equal(BACKGROUND_ASSETS[id],path,`${id} manifest mapping`);
  assert.equal(existsSync(url),true,`${path} generated art exists`);
  const png=readFileSync(url);
  assert.equal(png.subarray(1,4).toString(),"PNG",`${path} png signature`);
  const width=png.readUInt32BE(16),height=png.readUInt32BE(20);
  assert.equal(width,1672,`${path} width`);
  assert.equal(height,941,`${path} height`);
  assert.ok(Math.abs(width/height-16/9)<0.01,`${path} 16:9 aspect`);
}
assert.equal(DAY8_PRESENTATION_SCENES.S06_CURRENT_PURCHASE.branchBackgrounds.errand8_return_only_report,"neighborhood-cafe-day");
assert.equal(DAY8_PRESENTATION_SCENES.S06_CURRENT_PURCHASE.branchBackgrounds.errand8_timed_checkin,"day8-household-store-day");
assert.ok(["S04_MAILBOX","S05_STORE_MEMBER","S06_CURRENT_PURCHASE"].every(id=>DAY8_PRESENTATION_SCENES[id].characterId===null));
assert.ok(!Object.values(DAY8_PRESENTATION_SCENES).some(scene=>["crisis","theme"].includes(scene.bgm.category)));
assert.ok(!Object.values(DAY8_PRESENTATION_SCENES).some(scene=>["tense","worried"].includes(scene.expressionId)));

const audit=readFileSync(new URL("../docs/day8/DAY8_ASSET_DIRECTION_AUDIO_AUDIT.md",import.meta.url),"utf8");
for(const phrase of ["REQUIRED ART 1","대체 사용 금지","신규 배경 명세","인물 없음","연출·오디오 데이터 계약 PASS"]) assert.match(audit,new RegExp(phrase));
const imageQa=readFileSync(new URL("../docs/day8/DAY8_IMAGE_QUALITY_QA.md",import.meta.url),"utf8");
for(const phrase of ["IMAGE QA PASS","1672 × 941","생활용품점","인물·문자·상표 없음"]) assert.match(imageQa,new RegExp(phrase));
console.log("✓ DAY 8 신규 생활용품점·분기·16:9 해상도·연출/BGM/SFX 계약 검증 통과");
