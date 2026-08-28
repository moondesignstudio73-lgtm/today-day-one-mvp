import assert from "node:assert/strict";
import {DAY8_V3_CHOICES} from "../src/day8-v3-campaign-data.mjs";
import {applyDay8V3Choice,beginDay8V3,getDay8V3Compatibility,getDay8V3PlayableScene,getNextDay8V3Choice,validateDay8V3Runtime} from "../src/day8-v3-runtime.mjs";

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
const restIds=["contact-friend-then-rest","prepare-your-present","meal-share-tangsuyuk","withdrawal-leave-space","listen-without-fixing","route-home-rest","haeun-stay-present","schedule-explain-later","late-rest-tomorrow"];
for(const id of restIds)applyDay8V3Choice(rest,id);
assert.equal(rest.storyFlags.day8V3RestRoute,true);
assert.equal(rest.storyFlags.day8V3ActualLate,false);
assert.equal(rest.storyFlags.day8V3RestBoundary,true);
assert.equal(rest.storyFlags.day8V3Complete,true);
assert.equal(rest.storyFlags.day8V3ChoiceIndex,9);
assert.equal(getNextDay8V3Choice(rest),null);

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

const fullScenes=Array.from({length:24},(_,index)=>getDay8V3PlayableScene(state,index+1));
assert.equal(fullScenes.filter(scene=>!scene.skipped).length,24);
assert.equal(JSON.stringify(fullScenes[14]).includes("라이브 하우스"),true);
assert.equal(JSON.stringify(fullScenes[14]).includes("카페 모퉁이"),false);
assert.equal(JSON.stringify(fullScenes[21]).includes("오늘은 말로만 해도 되지?"),true);
assert.equal(JSON.stringify(fullScenes[23]).includes("사는 건 정하지 말고"),true);
const restScenes=Array.from({length:24},(_,index)=>getDay8V3PlayableScene(rest,index+1));
assert.equal(restScenes.filter(scene=>!scene.skipped).length,21);
assert.deepEqual(restScenes.filter(scene=>scene.skipped).map(scene=>scene.sceneNumber),[20,21,22]);
assert.equal(JSON.stringify(restScenes[14]).includes("집에 돌아온 주인공"),true);
assert.equal(JSON.stringify(restScenes[22]).includes("전화는 걸려 오지 않는다"),true);
assert.equal(JSON.stringify(restScenes[23]).includes("다음 날 아침"),true);
assert.throws(()=>getDay8V3PlayableScene({storyFlags:{}},1),/NOT_STARTED/);
assert.throws(()=>getDay8V3PlayableScene(state,25),/UNKNOWN_SCENE/);

assert.throws(()=>beginDay8V3({storyFlags:{}},{relationshipBand:"INVALID"}),/RELATIONSHIP_BAND/);
assert.throws(()=>applyDay8V3Choice({storyFlags:{}},"contact-evening-call"),/NOT_STARTED/);
console.log("day8-v3-runtime.test: all assertions passed");
