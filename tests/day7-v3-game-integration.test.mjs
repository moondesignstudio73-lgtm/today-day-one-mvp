import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";

const source=readFileSync(new URL("../game.js",import.meta.url),"utf8");

test("game controller routes new DAY 7 saves through V3 and preserves V1 legacy",()=>{
  assert.match(source,/getDay7V3Compatibility\(state\)\.mode!=="V1_LEGACY"/);
  assert.match(source,/beginDay7V3\(state/);
  assert.match(source,/day7V3\?getDay7V3ImmersiveSegment\(state\)\.steps:getLockedDay7Segment\(state\)/);
  assert.match(source,/applyDay7V3Choice\(state,choiceId\)/);
  assert.match(source,/getDay7V3ChoiceContinuation\(state,result\.choiceNumber\)/);
  assert.match(source,/day7MemoryStrategy\|\|state\.storyFlags\?\.day7V3Complete/);
});

test("DAY 7 V3 resume presentation keeps authored route and CG URLs",()=>{
  assert.match(source,/getDay7V3Presentation\(state\.storyFlags\?\.day7V3SceneCheckpoint\?\?1,state\)/);
  assert.match(source,/backgroundUrl:day7V3\?day7Resume\.backgroundUrl:getBackgroundAsset/);
});
