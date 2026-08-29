import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";

const source=readFileSync(new URL("../game.js",import.meta.url),"utf8");

test("game controller routes new DAY 9 saves through V3 and preserves V1 legacy",()=>{
  assert.match(source,/getDay9V3Compatibility\(state\)\.mode!=="V1_LEGACY"/);
  assert.match(source,/beginDay9V3\(state,\{relationshipBand:getDay6V3RelationshipBand\(state\),priorLightContact:state\.storyFlags\?\.day7V3HandContactEstablished===true/);
  assert.match(source,/day9V3\?getDay9V3ImmersiveSegment\(state\)\.steps:getLockedDay9Segment\(state\)/);
  assert.match(source,/applyDay9V3Choice\(state,choiceId\)/);
  assert.match(source,/getDay9V3ChoiceContinuation\(state,result\.choiceNumber\)/);
  assert.match(source,/day9DebriefStrategy\|\|state\.storyFlags\?\.day9V3Complete/);
});

test("DAY 9 V3 settles choice 9 once without automatic equipment and restores direct asset URLs",()=>{
  assert.match(source,/result\.choiceNumber===9\)settleDay9V3Transactions\(state/);
  assert.match(source,/greenGiftAccepted:choiceId==="checkout9_offer_green_gift"/);
  assert.match(source,/haeunSelfPurchase:choiceId==="checkout9_each_buys_own"/);
  assert.match(source,/playerPurchase:choiceId==="checkout9_each_buys_own"/);
  assert.match(source,/getDay9V3Presentation\(state\.storyFlags\?\.day9V3SceneCheckpoint\?\?1,state\)/);
  assert.match(source,/backgroundUrl:day9V3\?day9Resume\.backgroundUrl:getBackgroundAsset/);
  assert.match(source,/session\.id===LOCKED_DAY9_SCENE_ID&&getDay9V3Compatibility\(state\)\.mode==="V1_LEGACY"/);
  assert.match(source,/if\(step\.backgroundId\|\|step\.backgroundUrl\)/);
  assert.match(source,/backgroundUrl:transition\.backgroundUrl\?\?/);
  assert.doesNotMatch(source,/equipDay9V3GreenShirt/);
});
