import assert from "node:assert/strict";
import {DAY10_V3_CHOICES} from "../src/day10-v3-campaign-data.mjs";
import {getDay10V3ChoiceContinuation,getDay10V3ImmersiveScene,getDay10V3ImmersiveSegment,validateDay10V3ImmersiveAdapter} from "../src/day10-v3-immersive-adapter.mjs";
import {validateDay10V3PresentationAudit} from "../src/day10-v3-presentation-data.mjs";
import {applyDay10V3Choice,applyDay10V3FollowUpChoice,beginDay10V3} from "../src/day10-v3-runtime.mjs";

assert.equal(validateDay10V3PresentationAudit(),true);
const fresh={money:100000,storyFlags:{day9V3DinnerStatus:"CONTACT_BEFORE_NOON"}};beginDay10V3(fresh,{relationshipBand:"HIGH",priorHandHold:true});
const opening=getDay10V3ImmersiveSegment(fresh);assert.equal(opening.stopScene,2);assert.equal(opening.awaitingChoice,true);assert.equal(opening.steps.at(-1).choiceNumber,1);
applyDay10V3Choice(fresh,"dinner10_share_at_seven");const restored=JSON.parse(JSON.stringify(fresh)),resumed=getDay10V3ImmersiveSegment(restored);assert.equal(resumed.startScene,2);assert.equal(resumed.stopScene,4);assert.equal(resumed.steps.at(-1).choiceNumber,2);assert.ok(resumed.steps.some(step=>/많이 만들진 마/.test(step.text??"")));
const continuation=getDay10V3ChoiceContinuation(restored,1);assert.equal(continuation.filter(step=>/많이 만들진 마/.test(step.text??"")).length,1);assert.equal(continuation.at(-1).choiceNumber,2);assert.ok(!continuation.some(step=>/하은에게서 답장이 온다/.test(step.text??"")));

const conflict={money:100000,storyFlags:{}};beginDay10V3(conflict,{relationshipBand:"MID"});for(const id of ["dinner10_share_at_seven","menu10_fried_rice_and_soup","spend10_browse_presentation","work10_title_only","prep10_claim_nearly_done","remake10_start_over","timing10_say_soon","repair10_seek_intent_validation"])applyDay10V3Choice(conflict,id);
const follow=getDay10V3ImmersiveSegment(JSON.parse(JSON.stringify(conflict)));assert.equal(follow.stopScene,16);assert.equal(follow.steps.at(-1).choiceNumber,"FOLLOW_UP");applyDay10V3FollowUpChoice(conflict,"followup10_keep_demanding_understanding");assert.ok(!getDay10V3ImmersiveScene(conflict,18).steps.some(step=>step.type==="cgShow"));

for(const id of ["meaning10_wanted_to_give","cleanup10_rest_first","sora10_respect_private_meeting"])applyDay10V3Choice(conflict,id);assert.equal(validateDay10V3ImmersiveAdapter(conflict),true);const ending=getDay10V3ImmersiveSegment(JSON.parse(JSON.stringify(conflict)),{startScene:24});assert.equal(ending.steps.at(-1).type,"sceneEnd");assert.equal(ending.steps.at(-1).complete,true);assert.equal(ending.steps.at(-1).nextHook,"day11-sora-private-meeting");assert.doesNotMatch(JSON.stringify(ending),/가짜 하은|윤서진|전 여자친구|MBTI/);
assert.equal(DAY10_V3_CHOICES.length,11);
console.log("day10-v3-immersive-adapter.test: all assertions passed");
