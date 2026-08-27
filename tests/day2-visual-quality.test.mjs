import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import {
  DAY2_RUNTIME_OVERLAYS,
  getLockedDay2ResumePresentation,
} from "../src/day2-campaign-runtime.mjs";

const dimensions = source => {
  const url = new URL(`../${source}`, import.meta.url);
  assert.equal(existsSync(url), true, source);
  const file = readFileSync(url);
  assert.equal(file.subarray(1, 4).toString(), "PNG", source);
  return { width:file.readUInt32BE(16), height:file.readUInt32BE(20) };
};

for (const source of Object.values(DAY2_RUNTIME_OVERLAYS.haeun)) {
  const { height } = dimensions(source);
  assert.ok(height >= 1200, `${source}: character overlay must be at least 1200px tall`);
}
for (const source of Object.values(DAY2_RUNTIME_OVERLAYS.pov)) {
  const { height } = dimensions(source);
  assert.ok(height >= 900, `${source}: POV overlay must be at least 900px tall`);
}

const presentation = flags => getLockedDay2ResumePresentation({storyFlags:flags});
assert.equal(presentation({day2RuntimeStage:3}).backgroundId, "day2-car-interior");
assert.equal(presentation({day2RuntimeStage:4,day2PendingPhotoReaction:"photo_observation"}).backgroundId, "day2-home-entry");
assert.equal(presentation({day2RuntimeStage:4,day2LastSearch:"pc_interest"}).backgroundId, "day2-bedroom");
assert.equal(presentation({day2RuntimeStage:"key"}).backgroundId, "day2-bedroom");
assert.equal(presentation({day2RuntimeStage:6}).backgroundId, "day2-home-entry");

const game = readFileSync(new URL("../game.js", import.meta.url), "utf8");
assert.match(game, /getLockedDay2ResumePresentation\(state\)/);
assert.match(game, /activeCharacterAssetUrl:session\.presentation\?\.characterAssetUrl/);
assert.match(game, /resumeVisual=getLockedDay2ResumePresentation\(state\)/);
assert.match(game, /applyScenePresentation\(immersiveScene\.presentation\)/);
assert.match(game, /immersiveScene\.activeCharacterAssetUrl=step\.assetUrl/);
assert.match(game, /\$\("#vnNpcFront"\)\.hidden=true/);

console.log("✓ DAY 2 고해상도 오버레이·단계별 화면 복원 계약 PASS");
