import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const source=readFileSync(new URL("../game.js",import.meta.url),"utf8");
assert.match(source,/getDay11V3Compatibility\(state\)\.mode!=="V1_LEGACY"/);
assert.match(source,/beginDay11V3\(state,\{relationshipBand:getDay6V3RelationshipBand\(state\)\}\)/);
assert.match(source,/getDay11V3Compatibility\(currentState\)\.mode==="V1_LEGACY"\?getLegacyDay11ResumePresentation/);
assert.match(source,/getDay11V3Compatibility\(currentState\)\.mode==="V1_LEGACY"\?getLegacyDay11Segment\(currentState\):getDay11V3ImmersiveSegment\(currentState\)\.steps/);
assert.match(source,/applyDay11V3Choice\(state,choiceId\)/);
assert.match(source,/getDay11V3ChoiceContinuation\(state,result\.choiceNumber\)/);
assert.match(source,/session\.id===LOCKED_DAY11_SCENE_ID&&getDay11V3Compatibility\(state\)\.mode==="V1_LEGACY"/);
assert.match(source,/day11ShareStrategy\|\|state\.storyFlags\?\.day11V3Complete/);
assert.match(source,/state\.storyFlags\.day11RuntimeComplete=true/);
console.log("day11-v3-game-integration.test: all assertions passed");
