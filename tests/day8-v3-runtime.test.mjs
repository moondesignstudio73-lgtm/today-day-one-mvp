import assert from "node:assert/strict";
import {DAY8_V3_CHOICES} from "../src/day8-v3-campaign-data.mjs";
import {applyDay8V3Choice,beginDay8V3,getDay8V3Compatibility,getNextDay8V3Choice,validateDay8V3Runtime} from "../src/day8-v3-runtime.mjs";

assert.equal(validateDay8V3Runtime(),true);
assert.deepEqual(getDay8V3Compatibility({storyFlags:{day8RuntimeComplete:true}}),{mode:"V1_LEGACY",complete:true,checkpoint:null});
assert.deepEqual(beginDay8V3({storyFlags:{day8RuntimeStage:2,day8OpeningStrategy:"legacy"}}),{mode:"V1_LEGACY",complete:false,checkpoint:2});

const state={storyFlags:{seojinAffection:4,seojinStatusInterest:7,day8JihoonInvitationPending:true}};
beginDay8V3(state,{relationshipBand:"HIGH",priorHandContact:true});
assert.equal(getNextDay8V3Choice(state).number,1);
assert.throws(()=>applyDay8V3Choice(state,"route-live-house"),/OUT_OF_ORDER/);
for(const choice of DAY8_V3_CHOICES){
  const option=choice.options[0];
  const result=applyDay8V3Choice(state,option.id);
  const restored=JSON.parse(JSON.stringify(state));
  assert.deepEqual(restored,state);
  assert.equal(getNextDay8V3Choice(restored)?.number??null,result.nextChoice?.number??null);
}
assert.equal(state.storyFlags.day8V3Complete,true);
assert.equal(state.storyFlags.day8V3SceneCheckpoint,24);
assert.equal(state.storyFlags.day8JihoonInvitationPending,false);
assert.equal(state.storyFlags.day9ClothingColorInvitationPending,true);
assert.equal(state.storyFlags.seojinAffection,4);
assert.equal(state.storyFlags.seojinStatusInterest,7);
assert.equal(new Set(state.storyFlags.day8V3SelectedChoiceIds).size,10);
assert.equal(getNextDay8V3Choice(state),null);
assert.deepEqual(getDay8V3Compatibility(JSON.parse(JSON.stringify(state))),{mode:"V3",complete:true,checkpoint:24});

const rest={storyFlags:{}};beginDay8V3(rest,{relationshipBand:"MID"});
const restIds=["contact-friend-then-rest","prepare-your-present","meal-share-tangsuyuk","withdrawal-leave-space","listen-without-fixing","route-home-rest","haeun-stay-present","schedule-explain-later","late-rest-tomorrow","debrief-private-boundary"];
for(const id of restIds)applyDay8V3Choice(rest,id);
assert.equal(rest.storyFlags.day8V3RestRoute,true);
assert.equal(rest.storyFlags.day8V3ActualLate,false);
assert.equal(rest.storyFlags.day8V3PrivateWorkProtected,true);
assert.equal(rest.storyFlags.day8V3PublicCreditSeen,false);

const lie={storyFlags:{}};beginDay8V3(lie);
const lieIds=["contact-evening-call","prepare-one-photo","meal-jjajang","withdrawal-check-now","offer-concrete-help","route-quiet-cafe","haeun-no-pressure-thought","schedule-explain-later","late-false-transit","debrief-public-credit"];
for(const id of lieIds)applyDay8V3Choice(lie,id);
assert.equal(lie.storyFlags.day8V3ExplanationTruth,"FALSE_TRANSIT");
assert.equal(lie.storyFlags.day8V3ExplanationHonest,false);
assert.equal(lie.storyFlags.day8V3LieRecorded,true);
assert.equal(lie.storyFlags.day8V3PublicCreditSeen,true);
assert.equal(lie.storyFlags.day8V3PrivateWorkProtected,false);
assert.equal(lie.storyFlags.day8V3JihoonDisclosureDepth,"PRACTICAL");
assert.equal(lie.storyFlags.day8V3CallAppointment,"19:00");

assert.throws(()=>beginDay8V3({storyFlags:{}},{relationshipBand:"INVALID"}),/RELATIONSHIP_BAND/);
assert.throws(()=>applyDay8V3Choice({storyFlags:{}},"contact-evening-call"),/NOT_STARTED/);
console.log("day8-v3-runtime.test: all assertions passed");
