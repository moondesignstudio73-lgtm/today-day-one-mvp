import assert from "node:assert/strict";
import fs from "node:fs";
import {DAY7_V3_EVENT_CG_ASSETS,DAY7_V3_PRESENTATION_SCENES,getDay7V3Presentation,validateDay7V3PresentationData} from "../src/day7-v3-presentation-data.mjs";
import {DAY1_AUDIO_CUES} from "../src/day1-audio-data.mjs";
import {DAY2_AUDIO_CUES} from "../src/day2-audio-data.mjs";

assert.equal(validateDay7V3PresentationData(),true);
assert.equal(Object.keys(DAY7_V3_PRESENTATION_SCENES).length,24);
const audio={...DAY1_AUDIO_CUES,...DAY2_AUDIO_CUES};
for(const [sceneId,view] of Object.entries(DAY7_V3_PRESENTATION_SCENES)){
  assert.ok(fs.existsSync(view.backgroundUrl),`${sceneId}:background`);
  assert.ok(fs.existsSync(view.characterAssetUrl),`${sceneId}:outfit`);
  for(const path of Object.values(view.routeBackgroundUrls))assert.ok(fs.existsSync(path),`${sceneId}:${path}`);
  for(const cue of view.sfx)assert.ok(audio[cue],`${sceneId}:${cue}`);
}
for(const path of Object.values(DAY7_V3_EVENT_CG_ASSETS)){
  assert.ok(fs.existsSync(path),path);
  const png=fs.readFileSync(path);assert.equal(png.subarray(1,4).toString(),"PNG");
  assert.equal(png.readUInt32BE(16),1672);assert.equal(png.readUInt32BE(20),941);
}
const now={storyFlags:{day7V3DateRoute:"night-view",day7V3PhotoState:"RECEIVED_NOW"}};
const deferred={storyFlags:{day7V3DateRoute:"theme-park",day7V3PhotoState:"DEFERRED"}};
const declined={storyFlags:{day7V3DateRoute:"book-and-dinner",day7V3PhotoState:"DECLINED"}};
assert.equal(getDay7V3Presentation(8,now).backgroundId,"k-tower");
assert.equal(getDay7V3Presentation(9,deferred).backgroundId,"dream-castle");
assert.equal(getDay7V3Presentation(10,declined).backgroundId,"central-department");
assert.equal(getDay7V3Presentation(2,now).eventCgUrl,DAY7_V3_EVENT_CG_ASSETS.company);
assert.equal(getDay7V3Presentation(2,deferred).eventCgUrl,null);
assert.equal(getDay7V3Presentation(12,declined).eventCgUrl,null);
assert.equal(getDay7V3Presentation(19,deferred).eventCgUrl,DAY7_V3_EVENT_CG_ASSETS.company);
assert.equal(getDay7V3Presentation(19,declined).eventCgUrl,null);
assert.equal(getDay7V3Presentation(17,now).eventCgUrl,DAY7_V3_EVENT_CG_ASSETS.card);
assert.equal(getDay7V3Presentation(21,declined).eventCgUrl,DAY7_V3_EVENT_CG_ASSETS.hand);
assert.equal(getDay7V3Presentation(25,now),null);
assert.ok(!Object.values(DAY7_V3_PRESENTATION_SCENES).some(v=>["crisis","theme"].includes(v.bgm.category)));
console.log("day7-v3-presentation.test: all assertions passed");
