import assert from "node:assert/strict";
import {existsSync} from "node:fs";
import {BACKGROUND_ASSETS,getNpcSprite} from "../src/assets/asset-manifest.mjs";
import {DAY1_AUDIO_CUES} from "../src/day1-audio-data.mjs";
import {DAY2_AUDIO_CUES} from "../src/day2-audio-data.mjs";
import {DAY5_PRESENTATION_SCENES,validateDay5PresentationData} from "../src/day5-presentation-data.mjs";

assert.equal(validateDay5PresentationData(),true);
const audio={...DAY1_AUDIO_CUES,...DAY2_AUDIO_CUES};
for(const [id,scene] of Object.entries(DAY5_PRESENTATION_SCENES)){
  const background=BACKGROUND_ASSETS[scene.backgroundId];
  assert.ok(background,`${id} background`);
  assert.ok(existsSync(new URL(`../${background}`,import.meta.url)),background);
  if(scene.characterId!=="girlfriend"){
    const sprite=getNpcSprite(scene.characterId);
    assert.ok(sprite,`${id} sprite`);
    assert.ok(existsSync(new URL(`../${sprite}`,import.meta.url)),sprite);
  }
  if(scene.assetStatus==="ready"&&scene.shotMode==="event-cg"){
    assert.ok(scene.assetPath,`${id} event CG path`);
    assert.ok(existsSync(new URL(`../${scene.assetPath}`,import.meta.url)),scene.assetPath);
  }
  for(const cueId of scene.sfx){const cue=audio[cueId];assert.ok(cue,cueId);assert.ok(existsSync(new URL(`../${cue.source}`,import.meta.url)),cue.source);}
}
assert.equal(DAY5_PRESENTATION_SCENES.S05_SEOJIN_CONTEXT.characterId,"female-coworker");
assert.equal(DAY5_PRESENTATION_SCENES.S03_COWORKER_REUNION.characterId,"office-best-male");
assert.equal(Object.values(DAY5_PRESENTATION_SCENES).filter(scene=>scene.assetStatus==="ready").length,4);
assert.equal(Object.values(DAY5_PRESENTATION_SCENES).filter(scene=>scene.assetStatus==="needs-production").length,4);
assert.equal(DAY5_PRESENTATION_SCENES.S01_HOME_PREP.assetPath,"assets/events/day5/cg-day5-tie-boundary-pov-v1.png");
assert.equal(DAY5_PRESENTATION_SCENES.S04_DESK_RETURN.assetPath,"assets/events/day5/cg-day5-desk-two-folders-pov-v1.png");
assert.equal(DAY5_PRESENTATION_SCENES.S02_OFFICE_THRESHOLD.backgroundId,"day5-office-lobby-gate-day");
assert.equal(DAY5_PRESENTATION_SCENES.S03_COWORKER_REUNION.backgroundId,"day5-office-elevator-lobby-day");
assert.equal(new Set(Object.values(DAY5_PRESENTATION_SCENES).map(scene=>scene.plannedAssetId)).size,8);
assert.deepEqual(
  Object.values(DAY5_PRESENTATION_SCENES).map(scene=>scene.shotMode),
  ["event-cg","dedicated-background","dedicated-background","event-cg","dedicated-background","event-cg","dedicated-background","event-cg"]
);
console.log("✓ DAY 5 기존 에셋 8 Scene·서진/민호/팀장·BGM/SFX 매핑 검증 통과");
