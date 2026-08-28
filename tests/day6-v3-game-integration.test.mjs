import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";

const source=readFileSync(new URL("../game.js",import.meta.url),"utf8");

test("game controller routes new DAY 6 saves through V3 and preserves V1 legacy",()=>{
  assert.match(source,/getDay6V3Compatibility\(state\)\.mode!=="V1_LEGACY"/);
  assert.match(source,/beginDay6V3\(state/);
  assert.match(source,/day6V3\?getDay6V3ImmersiveSegment\(state\)\.steps:getLockedDay6Segment\(state\)/);
  assert.match(source,/applyDay6V3Choice\(state,choiceId\)/);
  assert.match(source,/getDay6V3ChoiceContinuation\(state,result\.choiceNumber\)/);
  assert.match(source,/day6DatePlan\|\|state\.storyFlags\?\.day6V3Complete/);
});

test("renderer accepts authored V3 asset URLs and choice prompts",()=>{
  assert.match(source,/step\.backgroundUrl\?\?getBackgroundAsset\(step\.backgroundId\)/);
  assert.match(source,/immersiveScene\?\.currentStep\?\.prompt\?\?prompt/);
});
