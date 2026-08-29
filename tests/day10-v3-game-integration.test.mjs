import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const source=readFileSync(new URL("../game.js",import.meta.url),"utf8");
assert.match(source,/getDay10V3Compatibility\(state\)\.mode!=="V1_LEGACY"/);
assert.match(source,/beginDay10V3\(state,\{relationshipBand:getDay6V3RelationshipBand\(state\),haeunAvailableForDinner:/);
assert.match(source,/greenShirtOwned:\["GIFT_ACCEPTED","HAEUN_SELF_PURCHASED"\]\.includes/);
assert.match(source,/priorHandHold:state\.storyFlags\?\.day7V3HandContactEstablished===true/);
assert.match(source,/getDay10V3Presentation\(sceneNumber,currentState\)/);
assert.match(source,/backgroundUrl:day10V3\?day10Resume\.backgroundUrl:getBackgroundAsset\(day10Resume\.backgroundId\)/);
assert.match(source,/getDay10V3ImmersiveSegment\(currentState\)\.steps/);
assert.match(source,/applyDay10V3FollowUpChoice\(state,choiceId\):applyDay10V3Choice\(state,choiceId\)/);
assert.match(source,/getDay10V3ChoiceContinuation\(state,followUp\?"FOLLOW_UP":result\.choiceNumber\)/);
assert.match(source,/session\.id===LOCKED_DAY10_SCENE_ID&&getDay10V3Compatibility\(state\)\.mode==="V1_LEGACY"/);
assert.match(source,/day10DebriefStrategy\|\|state\.storyFlags\?\.day10V3Complete/);
assert.doesNotMatch(source,/beginDay11V3|applyDay11V3/);
console.log("day10-v3-game-integration.test: all assertions passed");
