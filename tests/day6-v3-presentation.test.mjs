import assert from "node:assert/strict";
import fs from "node:fs";
import {DAY6_V3_PRESENTATION_SCENES,getDay6V3Presentation,validateDay6V3PresentationData} from "../src/day6-v3-presentation-data.mjs";

assert.equal(validateDay6V3PresentationData(),true);
assert.equal(Object.keys(DAY6_V3_PRESENTATION_SCENES).length,23);
for(const [sceneId,view] of Object.entries(DAY6_V3_PRESENTATION_SCENES)){
  assert.ok(fs.existsSync(view.backgroundUrl),`${sceneId}:${view.backgroundUrl}`);
  assert.ok(fs.existsSync(view.characterAssetUrl),`${sceneId}:${view.characterAssetUrl}`);
}
assert.equal(getDay6V3Presentation(3).backgroundId,"small-cafe");
assert.equal(getDay6V3Presentation(12).backgroundId,"gimbap-village");
assert.deepEqual(getDay6V3Presentation(13).waypointBackgroundIds,["dongsu-station","yeonhui-station"]);
assert.equal(getDay6V3Presentation(15).backgroundId,"vinyl-store");
assert.equal(getDay6V3Presentation(20).backgroundId,"memory-park");
assert.equal(getDay6V3Presentation(21).backgroundId,"yeonhui-station");
assert.equal(getDay6V3Presentation(23).backgroundId,"home-night");
assert.equal(getDay6V3Presentation(24),null);
console.log("day6-v3-presentation.test: all assertions passed");
