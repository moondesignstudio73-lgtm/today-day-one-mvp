import assert from "node:assert/strict";
import {existsSync,readFileSync} from "node:fs";
import {BACKGROUND_ASSETS,getCharacterSprite,getNpcSprite} from "../src/assets/asset-manifest.mjs";
import {DAY1_AUDIO_CUES} from "../src/day1-audio-data.mjs";
import {DAY2_AUDIO_CUES} from "../src/day2-audio-data.mjs";
import {DAY9_PRESENTATION_SCENES,DAY9_REQUIRED_BACKGROUND_ASSETS,validateDay9PresentationData} from "../src/day9-presentation-data.mjs";

assert.equal(validateDay9PresentationData(),true);
const audio={...DAY1_AUDIO_CUES,...DAY2_AUDIO_CUES};
for(const [id,scene] of Object.entries(DAY9_PRESENTATION_SCENES)){
  assert.ok(BACKGROUND_ASSETS[scene.backgroundId],`${id} background`);
  assert.ok(existsSync(new URL(`../${BACKGROUND_ASSETS[scene.backgroundId]}`,import.meta.url)),scene.backgroundId);
  assert.ok(scene.characterId==="girlfriend"?getCharacterSprite(scene.characterId,scene.expressionId,scene.poseId):getNpcSprite(scene.characterId),`${id} character`);
  for(const cueId of scene.sfx){assert.ok(audio[cueId],cueId);assert.ok(existsSync(new URL(`../${audio[cueId].source}`,import.meta.url)),audio[cueId].source);}
}
assert.deepEqual(Object.keys(DAY9_REQUIRED_BACKGROUND_ASSETS),["day9-office-project-room-day"]);
const [id,path]=Object.entries(DAY9_REQUIRED_BACKGROUND_ASSETS)[0];
assert.equal(BACKGROUND_ASSETS[id],path);
const png=readFileSync(new URL(`../${path}`,import.meta.url));
assert.equal(png.subarray(1,4).toString(),"PNG");
const width=png.readUInt32BE(16),height=png.readUInt32BE(20);
assert.equal(width,1672);assert.equal(height,941);assert.ok(Math.abs(width/height-16/9)<0.01);
assert.equal(Object.keys(DAY9_PRESENTATION_SCENES).length,8);
assert.ok(Object.values(DAY9_PRESENTATION_SCENES).filter(scene=>scene.backgroundId==="day9-office-project-room-day").length>=4);
console.log("✓ DAY 9 신규 프로젝트룸·8 Scene·16:9·인물/BGM/SFX 계약 검증 통과");
