import assert from "node:assert/strict";
import {existsSync,readFileSync} from "node:fs";
import {DAY1_AUDIO_CUES} from "../src/day1-audio-data.mjs";
import {DAY2_AUDIO_CUES} from "../src/day2-audio-data.mjs";
import {
  DAY13_V3_ARA_REFERENCE_ASSET,
  DAY13_V3_PRESENTATION_SCENES,
  DAY13_V3_READY_REUSE_ASSETS,
  DAY13_V3_REQUIRED_NEW_ASSETS,
  getDay13V3Presentation,
  validateDay13V3PresentationAudit
} from "../src/day13-v3-presentation-data.mjs";

assert.equal(validateDay13V3PresentationAudit(),true);
assert.equal(Object.keys(DAY13_V3_PRESENTATION_SCENES).length,24);
assert.equal(Object.keys(DAY13_V3_REQUIRED_NEW_ASSETS).length,11);
assert.equal(Object.values(DAY13_V3_REQUIRED_NEW_ASSETS).filter(asset=>asset.status==="ready-new").length,11);
assert.equal(Object.values(DAY13_V3_REQUIRED_NEW_ASSETS).filter(asset=>asset.status==="production-required").length,0);
for(const asset of Object.values(DAY13_V3_REQUIRED_NEW_ASSETS)){
  const exists=existsSync(new URL(`../${asset.path}`,import.meta.url));
  assert.equal(exists,asset.status==="ready-new",asset.path);
  if(exists){
    const png=readFileSync(new URL(`../${asset.path}`,import.meta.url));
    assert.equal(png.subarray(1,4).toString(),"PNG",asset.path);
    if(asset.kind==="character-sprite"){
      assert.ok(png.readUInt32BE(16)>=887,asset.path);
      assert.ok(png.readUInt32BE(20)>=1774,asset.path);
      assert.equal(png[25],6,asset.path);
    }else{
      assert.ok([1671,1672].includes(png.readUInt32BE(16)),asset.path);
      assert.equal(png.readUInt32BE(20),941,asset.path);
      assert.equal(png[25],2,asset.path);
    }
  }
}
assert.ok(existsSync(new URL("../assets/source-sheets/day13/ara-day13-photo-walk-casual-checker-v1.png",import.meta.url)));
assert.ok(existsSync(new URL("../scripts/process-day13-sprite.py",import.meta.url)));
assert.ok(existsSync(new URL(`../${DAY13_V3_ARA_REFERENCE_ASSET.path}`,import.meta.url)));
assert.equal(DAY13_V3_ARA_REFERENCE_ASSET.status,"reference-only");

for(const path of Object.values(DAY13_V3_READY_REUSE_ASSETS)){
  assert.ok(existsSync(new URL(`../${path}`,import.meta.url)),path);
  const png=readFileSync(new URL(`../${path}`,import.meta.url));
  assert.equal(png.subarray(1,4).toString(),"PNG",path);
  assert.equal(png.readUInt32BE(16),1672,path);
  assert.equal(png.readUInt32BE(20),941,path);
  assert.equal(png[25],2,path);
}

const audio={...DAY1_AUDIO_CUES,...DAY2_AUDIO_CUES};
for(const scene of Object.values(DAY13_V3_PRESENTATION_SCENES))for(const cueId of scene.sfx){
  assert.ok(audio[cueId],cueId);
  assert.ok(existsSync(new URL(`../${audio[cueId].source}`,import.meta.url)),audio[cueId].source);
}

for(let sceneNumber=1;sceneNumber<=24;sceneNumber+=1){
  const scene=getDay13V3Presentation(sceneNumber);
  assert.equal(scene.sceneNumber,sceneNumber);
  assert.equal(scene.safeArea.mobile,"center-60");
  assert.equal(scene.safeArea.desktop,"center-80");
}
assert.equal(getDay13V3Presentation(4).branchBackgroundUrls.SEOUL_FOREST,DAY13_V3_READY_REUSE_ASSETS.runningPark);
assert.equal(getDay13V3Presentation(4).branchBackgroundUrls.NEIGHBORHOOD,DAY13_V3_READY_REUSE_ASSETS.neighborhood);
assert.equal(getDay13V3Presentation(4).branchBackgroundUrls.HOME,DAY13_V3_READY_REUSE_ASSETS.homeBedroom);
assert.equal(getDay13V3Presentation(5).requiredAsset,"araFirstMeetingWide");
assert.equal(getDay13V3Presentation(6).characterAssetRequirement,"araPhotoWalkSprite");
assert.equal(getDay13V3Presentation(6).characterAssetUrl,DAY13_V3_REQUIRED_NEW_ASSETS.araPhotoWalkSprite.path);
assert.equal(getDay13V3Presentation(9).requiredAsset,"missedBirdPov");
assert.equal(getDay13V3Presentation(13).requiredAsset,"portraitConsentPov");
assert.equal(getDay13V3Presentation(14).requiredAsset,"portraitReviewPov");
assert.equal(getDay13V3Presentation(19).requiredAsset,"photoTransferConsentPov");
assert.equal(getDay13V3Presentation(21).characterId,null,"Haeun stays phone-only in the home debrief");
assert.equal(getDay13V3Presentation(23).requiredAsset,"haeunDeskPhotoPov");
assert.match(getDay13V3Presentation(24).branchEventCgUrls.portrait,/ending-current-face-phone-pov-v1\.png$/);
assert.match(getDay13V3Presentation(24).branchEventCgUrls.scenery,/ending-scenery-phone-pov-v1\.png$/);
assert.equal(getDay13V3Presentation(25),null);

const audit=readFileSync(new URL("../docs/day13/DAY13_V3_ASSET_PRESENTATION_AUDIO_AUDIT.md",import.meta.url),"utf8");
for(const marker of ["AUDIT PASS / IMAGE PRODUCTION 11/11 PASS","PRODUCTION REQUIRED 0","Notion","DAY 2 시각 기준 대조","reference-only","1672×941 RGB PNG","887×1774 RGBA PNG","SFX_PHOTO_FRAME","상위 `AI해커톤` 페이지의 Markdown 첨부는","신규 제작 요구 11종"])assert.ok(audit.includes(marker),marker);
const serialized=JSON.stringify(DAY13_V3_PRESENTATION_SCENES);
for(const forbidden of ["SFX_HEART","SFX_GLITCH","relationshipCrisis","haeun-standing","girlfriend-standing"])assert.equal(serialized.includes(forbidden),false,forbidden);
console.log("day13-v3-presentation-audit.test: 24 scenes / 7 reuse / 11 ready-new / 0 pending PASS");
