import assert from "node:assert/strict";
import {existsSync,readFileSync} from "node:fs";
import {
  DAY12_V3_PRESENTATION_SCENES,
  DAY12_V3_READY_REUSE_ASSETS,
  DAY12_V3_REQUIRED_NEW_ASSETS,
  getDay12V3Presentation,
  validateDay12V3PresentationAudit
} from "../src/day12-v3-presentation-data.mjs";

assert.equal(validateDay12V3PresentationAudit(),true);
assert.equal(Object.keys(DAY12_V3_PRESENTATION_SCENES).length,24);
assert.equal(Object.keys(DAY12_V3_REQUIRED_NEW_ASSETS).length,8);
assert.ok(Object.values(DAY12_V3_READY_REUSE_ASSETS).every(path=>existsSync(new URL(`../${path}`,import.meta.url))));
const readyAssets=Object.values(DAY12_V3_REQUIRED_NEW_ASSETS).filter(asset=>asset.status==="ready-new");
const pendingAssets=Object.values(DAY12_V3_REQUIRED_NEW_ASSETS).filter(asset=>asset.status==="production-required");
assert.equal(readyAssets.length,8);
assert.equal(pendingAssets.length,0);
assert.ok(readyAssets.every(asset=>existsSync(new URL(`../${asset.path}`,import.meta.url))));
assert.ok(pendingAssets.every(asset=>!existsSync(new URL(`../${asset.path}`,import.meta.url))));
for(const asset of readyAssets){
  const png=readFileSync(new URL(`../${asset.path}`,import.meta.url));
  assert.equal(png.readUInt32BE(16),1672);
  assert.equal(png.readUInt32BE(20),941);
  assert.equal(png[25],2,"DAY 12 V3 wide assets must be RGB PNG");
}

for(let sceneNumber=1;sceneNumber<=24;sceneNumber+=1){
  const scene=getDay12V3Presentation(sceneNumber);
  assert.equal(scene.sceneNumber,sceneNumber);
  assert.equal(scene.safeArea.mobile,"center-60");
}

assert.equal(getDay12V3Presentation(1).assetStatus,"ready-reuse");
assert.equal(getDay12V3Presentation(3).characterId,"female-coworker");
assert.equal(getDay12V3Presentation(4).characterId,"team-lead");
assert.equal(getDay12V3Presentation(7).requiredAsset,"trainingCompletionPov");
assert.match(getDay12V3Presentation(7).eventCgUrl,/cg-day12-v3-training-completion-pov-v1\.png$/);
assert.equal(getDay12V3Presentation(9).requiredAsset,"mixedNotesCirclePov");
assert.match(getDay12V3Presentation(9).eventCgUrl,/cg-day12-v3-mixed-notes-circle-pov-v1\.png$/);
assert.equal(getDay12V3Presentation(11).requiredAsset,"wrongCanVendingPov");
assert.match(getDay12V3Presentation(11).eventCgUrl,/cg-day12-v3-wrong-can-vending-pov-v1\.png$/);
assert.equal(getDay12V3Presentation(13).requiredAsset,"scallionLunchThreeShot");
assert.match(getDay12V3Presentation(13).eventCgUrl,/cg-day12-v3-scallion-lunch-three-shot-v1\.png$/);
assert.equal(getDay12V3Presentation(15).requiredAsset,"buildingLunchInterior");
assert.equal(getDay12V3Presentation(15).assetStatus,"ready-new");
assert.equal(getDay12V3Presentation(19).requiredAsset,"verifiedSheetHandoffPov");
assert.match(getDay12V3Presentation(19).eventCgUrl,/cg-day12-v3-verified-sheet-handoff-pov-v1\.png$/);
assert.equal(getDay12V3Presentation(21).requiredAsset,"haeunDisclosurePhonePov");
assert.match(getDay12V3Presentation(21).eventCgUrl,/cg-day12-v3-haeun-disclosure-phone-pov-v1\.png$/);
assert.equal(getDay12V3Presentation(24).requiredAsset,"endingDeskCluesPov");
assert.match(getDay12V3Presentation(24).eventCgUrl,/cg-day12-v3-ending-desk-clues-pov-v1\.png$/);
assert.equal(getDay12V3Presentation(20).characterId,null,"Haeun is present through phone messages, not a false physical sprite");
assert.match(getDay12V3Presentation(20).eventCgUrl,/cg-day12-v3-haeun-disclosure-phone-pov-v1\.png$/);
assert.equal(getDay12V3Presentation(25),null);

console.log("day12-v3-presentation-audit.test: all assertions passed");
