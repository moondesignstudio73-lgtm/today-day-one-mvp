import assert from "node:assert/strict";
import {existsSync,readFileSync} from "node:fs";
import {BACKGROUND_ASSETS,getCharacterSprite} from "../src/assets/asset-manifest.mjs";
import {DAY1_AUDIO_CUES} from "../src/day1-audio-data.mjs";
import {DAY2_AUDIO_CUES} from "../src/day2-audio-data.mjs";
import {DAY7_PRESENTATION_SCENES,DAY7_REQUIRED_BACKGROUND_ASSETS,validateDay7PresentationData} from "../src/day7-presentation-data.mjs";

assert.equal(validateDay7PresentationData(),true);
const audio={...DAY1_AUDIO_CUES,...DAY2_AUDIO_CUES};
for(const [id,scene] of Object.entries(DAY7_PRESENTATION_SCENES)){
  if(scene.backgroundId){const path=BACKGROUND_ASSETS[scene.backgroundId];assert.ok(path,`${id} background`);assert.ok(existsSync(new URL(`../${path}`,import.meta.url)),path);}
  assert.ok(getCharacterSprite(scene.characterId,scene.expressionId,scene.poseId),`${id} sprite`);
  for(const cueId of scene.sfx){assert.ok(audio[cueId],cueId);assert.ok(existsSync(new URL(`../${audio[cueId].source}`,import.meta.url)),audio[cueId].source);}
}
assert.deepEqual(Object.keys(DAY7_REQUIRED_BACKGROUND_ASSETS).sort(),["day7-bookshop-day","day7-river-promenade-day"]);
for(const path of Object.values(DAY7_REQUIRED_BACKGROUND_ASSETS))assert.equal(existsSync(new URL(`../${path}`,import.meta.url)),false,`${path} intentionally pending art gate`);
assert.equal(DAY7_PRESENTATION_SCENES.S04_PRESENT_ACTIVITY.branchBackgrounds.date_new_place,"day7-gallery-day");
assert.equal(DAY7_PRESENTATION_SCENES.S04_PRESENT_ACTIVITY.branchBackgrounds.date_revisit_with_opt_out,"day7-river-promenade-day");
assert.ok(!Object.values(DAY7_PRESENTATION_SCENES).some(scene=>["crisis","theme"].includes(scene.bgm.category)));
assert.ok(!Object.values(DAY7_PRESENTATION_SCENES).some(scene=>["tense","worried"].includes(scene.expressionId)));
const audit=readFileSync(new URL("../docs/day7/DAY7_ASSET_DIRECTION_AUDIO_AUDIT.md",import.meta.url),"utf8");
for(const phrase of ["학교 도서실","대체 사용 금지","신규 배경 명세","REQUIRED ART 2","연출·오디오 데이터 계약 PASS"])assert.match(audit,new RegExp(phrase));
console.log("✓ DAY 7 기존 에셋 6 Scene·전시관 분기·필수 신규 배경 2종·연출/BGM/SFX 계약 검증 통과");
