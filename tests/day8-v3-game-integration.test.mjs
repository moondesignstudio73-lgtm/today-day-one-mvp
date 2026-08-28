import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";

const source=readFileSync(new URL("../game.js",import.meta.url),"utf8");

test("game controller routes new DAY 8 saves through V3 and preserves V1 legacy",()=>{
  assert.match(source,/getDay8V3Compatibility\(state\)\.mode!=="V1_LEGACY"/);
  assert.match(source,/beginDay8V3\(state,\{relationshipBand:getDay6V3RelationshipBand\(state\),priorHandContact:state\.storyFlags\?\.day7V3HandContactEstablished===true\}\)/);
  assert.match(source,/day8V3\?getDay8V3ImmersiveSegment\(state\)\.steps:getLockedDay8Segment\(state\)/);
  assert.match(source,/applyDay8V3Choice\(state,choiceId\)/);
  assert.match(source,/getDay8V3ChoiceContinuation\(state,result\.choiceNumber\)/);
  assert.match(source,/day8ShareStrategy\|\|state\.storyFlags\?\.day8V3Complete/);
});

test("DAY 8 V3 resumes its authored route and direct asset URL",()=>{
  assert.match(source,/getDay8V3Presentation\(state\.storyFlags\?\.day8V3SceneCheckpoint\?\?1,state\)/);
  assert.match(source,/backgroundUrl:day8V3\?day8Resume\.backgroundUrl:getBackgroundAsset/);
});
