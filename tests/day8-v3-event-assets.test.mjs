import assert from "node:assert/strict";
import fs from "node:fs";
import {DAY8_V3_EVENT_CG_ASSETS,getDay8V3EventCg} from "../src/day8-v3-event-assets.mjs";

for(const path of Object.values(DAY8_V3_EVENT_CG_ASSETS)){
  assert.ok(fs.existsSync(path),path);
  const png=fs.readFileSync(path);
  assert.equal(png.subarray(1,4).toString(),"PNG");
  assert.equal(png.readUInt32BE(16),1672);
  assert.equal(png.readUInt32BE(20),941);
}
assert.equal(getDay8V3EventCg(5,{}),DAY8_V3_EVENT_CG_ASSETS.overfilledWaterGlass);
assert.equal(getDay8V3EventCg(6,{storyFlags:{day8V3JihoonPreparation:"prepare-one-photo",day8V3PhotoRequested:true}}),DAY8_V3_EVENT_CG_ASSETS.movingDayPhotoPhone);
assert.equal(getDay8V3EventCg(6,{storyFlags:{day8V3JihoonPreparation:"prepare-your-present",day8V3PhotoRequested:false}}),null);
assert.equal(getDay8V3EventCg(6,{storyFlags:{day8V3JihoonPreparation:"prepare-one-photo",day8V3PhotoRequested:false}}),null);
assert.equal(getDay8V3EventCg(12,{}),DAY8_V3_EVENT_CG_ASSETS.publicCreditPhone);
assert.equal(getDay8V3EventCg(15,{storyFlags:{day8V3AfternoonRoute:"LIVE_HOUSE"}}),DAY8_V3_EVENT_CG_ASSETS.liveHouseOffbeatClap);
assert.equal(getDay8V3EventCg(15,{storyFlags:{day8V3AfternoonRoute:"CAFE"}}),DAY8_V3_EVENT_CG_ASSETS.cafeNapkinDrawing);
assert.equal(getDay8V3EventCg(15,{storyFlags:{day8V3AfternoonRoute:"HOME"}}),null);
assert.equal(getDay8V3EventCg(24,{storyFlags:{day8V3RestBoundary:false}}),DAY8_V3_EVENT_CG_ASSETS.existingClothesPhotoPhone);
assert.equal(getDay8V3EventCg(24,{storyFlags:{day8V3ActualLate:true}}),DAY8_V3_EVENT_CG_ASSETS.existingClothesPhotoPhone);
assert.equal(getDay8V3EventCg(24,{storyFlags:{day8V3RestBoundary:true}}),null);
assert.equal(getDay8V3EventCg(7,{}),null);
console.log("day8-v3-event-assets.test: all 6 CG dimensions and route/time boundaries passed");
