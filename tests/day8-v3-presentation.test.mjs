import test from "node:test";
import assert from "node:assert/strict";
import {existsSync} from "node:fs";
import {DAY8_V3_PRESENTATION_SCENES,getDay8V3Presentation,validateDay8V3PresentationData} from "../src/day8-v3-presentation-data.mjs";

test("DAY 8 V3 has a complete 24-scene presentation contract",()=>{
  assert.equal(validateDay8V3PresentationData(),true);
  assert.equal(Object.keys(DAY8_V3_PRESENTATION_SCENES).length,24);
  for(const view of Object.values(DAY8_V3_PRESENTATION_SCENES)){
    assert.equal(existsSync(new URL(`../${view.backgroundUrl}`,import.meta.url)),true,view.backgroundUrl);
    if(view.characterAssetUrl)assert.equal(existsSync(new URL(`../${view.characterAssetUrl}`,import.meta.url)),true,view.characterAssetUrl);
    assert.equal(view.safeArea.mobile,"center-60");
  }
});

test("route, private-photo, and next-morning visual boundaries remain state-driven",()=>{
  assert.match(getDay8V3Presentation(15,{day8V3AfternoonRoute:"LIVE_HOUSE"}).backgroundUrl,/live/i);
  assert.match(getDay8V3Presentation(15,{day8V3AfternoonRoute:"CAFE"}).backgroundUrl,/cafe/i);
  assert.equal(getDay8V3Presentation(15,{day8V3AfternoonRoute:"HOME"}).characterId,null);
  assert.equal(getDay8V3Presentation(6,{day8V3JihoonPreparation:"prepare-nothing"}).eventCgUrl,null);
  assert.match(getDay8V3Presentation(6,{day8V3JihoonPreparation:"prepare-one-photo",day8V3PhotoRequested:true}).eventCgUrl,/photo/i);
  assert.equal(getDay8V3Presentation(24,{day8V3RestBoundary:true}).eventCgUrl,null);
});

test("Haeun is never rendered as an in-person DAY 8 character",()=>{
  assert.equal(Object.values(DAY8_V3_PRESENTATION_SCENES).some(view=>view.characterId==="girlfriend"),false);
});
