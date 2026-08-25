import assert from "node:assert/strict";
import {existsSync,readFileSync} from "node:fs";
import {BACKGROUND_ASSETS,getCharacterSprite} from "../src/assets/asset-manifest.mjs";
import {DAY1_AUDIO_CUES} from "../src/day1-audio-data.mjs";
import {DAY2_AUDIO_CUES} from "../src/day2-audio-data.mjs";
import {DAY6_PRESENTATION_SCENES,validateDay6PresentationData} from "../src/day6-presentation-data.mjs";

assert.equal(validateDay6PresentationData(),true);
const audio={...DAY1_AUDIO_CUES,...DAY2_AUDIO_CUES};
for(const [id,scene] of Object.entries(DAY6_PRESENTATION_SCENES)){
  const background=BACKGROUND_ASSETS[scene.backgroundId];
  assert.ok(background,`${id} background`);
  assert.ok(existsSync(new URL(`../${background}`,import.meta.url)),background);
  const sprite=getCharacterSprite(scene.characterId,scene.expressionId,scene.poseId);
  assert.ok(sprite,`${id} sprite`);
  assert.ok(existsSync(new URL(`../${sprite}`,import.meta.url)),sprite);
  for(const cueId of scene.sfx){
    const cue=audio[cueId];
    assert.ok(cue,cueId);
    assert.ok(existsSync(new URL(`../${cue.source}`,import.meta.url)),cue.source);
  }
}

assert.equal(DAY6_PRESENTATION_SCENES.S03_PHARMACY.backgroundId,"neighborhood-street-day");
assert.equal(DAY6_PRESENTATION_SCENES.S04_MARKET.backgroundId,"neighborhood-street-day");
assert.equal(DAY6_PRESENTATION_SCENES.S05_CAFE.backgroundId,"neighborhood-cafe-day");
assert.equal(DAY6_PRESENTATION_SCENES.S07_DATE_PLAN.backgroundId,"neighborhood-park-day");
assert.ok(!Object.values(DAY6_PRESENTATION_SCENES).some(scene=>scene.backgroundId.includes("department-food")));
assert.ok(!Object.values(DAY6_PRESENTATION_SCENES).some(scene=>["tense","worried"].includes(scene.expressionId)));
const audit=readFileSync(new URL("../docs/day6/DAY6_ASSET_DIRECTION_AUDIO_AUDIT.md",import.meta.url),"utf8");
for(const phrase of ["백화점 식품관","대체 사용 금지","임시 예비폰","윤서진의 두 수치","PASS"]){assert.match(audit,new RegExp(phrase));}

console.log("✓ DAY 6 기존 에셋 8 Scene·생활 톤·연출/BGM/SFX 매핑 검증 통과");
