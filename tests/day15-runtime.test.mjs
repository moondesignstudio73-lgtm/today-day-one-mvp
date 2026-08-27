import assert from "node:assert/strict";
import { createInitialState } from "../src/game-core.mjs";
import { createGirlfriendFromProfile } from "../src/girlfriend-manager.mjs";
import { GAME_MODES } from "../src/scenario-state.mjs";
import { SaveManager } from "../src/save-manager.mjs";
import { selectNextStoryScene } from "../src/story-manager.mjs";
import { STORY_OUTFIT_ASSETS } from "../src/story-outfit-assets.mjs";
import { DAY15_ACTIVITY_CHOICES,DAY15_CHANGE_CHOICES,DAY15_PRIVACY_CHOICES,applyLockedDay15ChoiceState,getLockedDay15ResumePresentation,getLockedDay15Segment,validateLockedDay15Runtime } from "../src/day15-campaign-runtime.mjs";

const makeState=(mode=GAME_MODES.MARRIAGE_30)=>{
  const state=createInitialState(createGirlfriendFromProfile("haeun",()=>.5),()=>.5,{mode});
  state.day=15;state.affection=44;state.trust=41;state.health=70;state.energy=70;state.stress=40;state.confidence=35;
  state.storyHistory=[{sceneId:"m30-day14-current-choice-spending",choiceId:"spend14_consent_ask_first",day:14,response:"완료"}];
  state.storyFlags={day15CurrentLeisureDatePending:true,day11ScheduleNoteMismatch:"unverified",day14PastPreferenceRecommendation:"unverified",day14LaneStrategy:"spend14_lane_personal",day14PurchaseStrategy:"spend14_purchase_one_item",day14ConsentStrategy:"spend14_consent_ask_first"};
  state.scenario.haeunAffection=20;state.scenario.haeunTrust=30;state.scenario.seojinAffection=12;state.scenario.seojinStatusInterest=19;state.scenario.featureUnlocks={finance:true,shop:true};
  return state;
};
const roundTrip=state=>{const values=new Map(),storage={getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)};SaveManager.save(state,storage);return SaveManager.load(storage,GAME_MODES.MARRIAGE_30);};
const effects={
  leisure15_activity_each_pick:{affection:3,trust:2,energy:-2,haeunAffection:2},leisure15_activity_two_options:{confidence:4,trust:2,energy:-2,haeunTrust:1},leisure15_activity_low_sensory:{health:3,trust:3,stress:-3,energy:-1,haeunTrust:2},
  leisure15_change_shorten:{health:3,trust:3,stress:-3,energy:-2,haeunTrust:2},leisure15_change_switch:{affection:3,confidence:3,stress:-3,energy:-2,haeunAffection:2},leisure15_change_end:{health:4,trust:3,stress:-4,energy:1,haeunTrust:2},
  leisure15_privacy_private_note:{affection:4,trust:3,stress:-2,haeunAffection:2,haeunTrust:1},leisure15_privacy_ask_each_photo:{trust:5,confidence:2,affection:2,haeunTrust:3},leisure15_privacy_no_location:{trust:4,confidence:3,stress:-2,haeunTrust:2}
};

assert.equal(selectNextStoryScene(makeState())?.id,"m30-day15-current-leisure-date");
assert.equal(validateLockedDay15Runtime(),true);
assert.equal(getLockedDay15Segment(makeState()).filter(step=>step.type==="choice").length,1);

const callbackCases=[
  ["day14LaneStrategy","spend14_lane_personal","첫 활동 하나"],["day14LaneStrategy","spend14_lane_shared","공통 후보"],["day14LaneStrategy","spend14_lane_gift","거절 가능한 질문"],
  ["day14PurchaseStrategy","spend14_purchase_one_item","활동 하나만"],["day14PurchaseStrategy","spend14_purchase_wait_compare","십 분만"],["day14PurchaseStrategy","spend14_purchase_receipt_owner","예약자, 비용 부담자"],
  ["day14ConsentStrategy","spend14_consent_ask_first","피사체, 보관, 공개"],["day14ConsentStrategy","spend14_consent_wishlist","남기고 싶은 순간"],["day14ConsentStrategy","spend14_consent_no_surprise","사진이 없어도"]
];
for(const [key,id,marker] of callbackCases){const state=makeState();state.storyFlags[key]=id;state.storyFlags.day15ActivityStrategy=DAY15_ACTIVITY_CHOICES[0].id;state.storyFlags.day15ChangeStrategy=DAY15_CHANGE_CHOICES[0].id;const text=[...getLockedDay15Segment(state,0),...getLockedDay15Segment(state,2)].map(step=>step.text??"").join(" ");assert.ok(text.includes(marker),`${id} callback`);}

let paths=0;
for(const activity of DAY15_ACTIVITY_CHOICES)for(const change of DAY15_CHANGE_CHOICES)for(const privacy of DAY15_PRIVACY_CHOICES){
  let state=makeState(),all=[];const base={affection:state.affection,trust:state.trust,health:state.health,energy:state.energy,stress:state.stress,confidence:state.confidence,haeunAffection:state.scenario.haeunAffection,haeunTrust:state.scenario.haeunTrust};
  all.push(...getLockedDay15Segment(state,0));assert.deepEqual(applyLockedDay15ChoiceState(state,activity.id),{stage:1});assert.deepEqual(applyLockedDay15ChoiceState(state,activity.id),{stage:1});state=roundTrip(state);
  assert.equal(state.storyFlags.day15RuntimeStage,1);assert.equal(state.storyFlags.day15LeisureReservationVisitLabel,"unverified");assert.ok(state.scenario.clues.includes("leisure-reservation-label-mismatch"));assert.equal(getLockedDay15ResumePresentation(state).backgroundId,activity.id==="leisure15_activity_low_sensory"?"day7-bookshop-day":"day7-gallery-day");
  all.push(...getLockedDay15Segment(state,1));assert.deepEqual(applyLockedDay15ChoiceState(state,change.id),{stage:2});assert.deepEqual(applyLockedDay15ChoiceState(state,change.id),{stage:2});state=roundTrip(state);
  assert.equal(state.storyFlags.day15RuntimeStage,2);assert.equal(getLockedDay15ResumePresentation(state).backgroundId,"neighborhood-cafe-day");
  all.push(...getLockedDay15Segment(state,2));assert.deepEqual(applyLockedDay15ChoiceState(state,privacy.id),{stage:3});assert.deepEqual(applyLockedDay15ChoiceState(state,privacy.id),{stage:3});state=roundTrip(state);all.push(...getLockedDay15Segment(state,3));
  const total=[activity.id,change.id,privacy.id].reduce((sum,id)=>{for(const [key,value] of Object.entries(effects[id]))sum[key]=(sum[key]??0)+value;return sum;},{});
  for(const key of ["affection","trust","health","energy","stress","confidence"])assert.equal(state[key],base[key]+(total[key]??0),`${activity.id}/${change.id}/${privacy.id} ${key}`);
  for(const key of ["haeunAffection","haeunTrust"])assert.equal(state.scenario[key],base[key]+(total[key]??0),`${activity.id}/${change.id}/${privacy.id} ${key}`);
  assert.equal(state.storyFlags.day15CurrentLeisureDatePending,false);assert.equal(state.storyFlags.day15CurrentLeisureDateCompleted,true);assert.equal(state.storyFlags.day15CurrentLeisureMemory,true);assert.equal(state.storyFlags.day15PrivateDateRecord,true);assert.equal(state.storyFlags.day16CurrentSocialCirclePending,true);
  assert.equal(state.scenario.seojinAffection,12);assert.equal(state.scenario.seojinStatusInterest,19);assert.equal(state.storyFlags.day11ScheduleNoteMismatch,"unverified");assert.equal(state.storyFlags.day14PastPreferenceRecommendation,"unverified");
  assert.deepEqual(state.scenario.featureUnlocks,{finance:true,shop:true});assert.equal(state.scenario.featureUnlocks.investment,undefined);
  for(const id of [activity.id,change.id,privacy.id])assert.equal(state.storyFlags[id],true,id);
  for(const id of ["current-leisure-date","date-change-boundary","private-date-record"])assert.ok(state.scenario.unlockedActions.includes(id),id);
  for(const id of ["leisure-reservation-label-mismatch","current-leisure-date-record"])assert.ok(state.scenario.clues.includes(id),id);
  assert.ok(state.scenario.followUpHooks.includes("day16-current-social-circle"));assert.equal(state.scenario.profileUnlocks.length,0);
  for(const key of ["unlockedActions","clues","followUpHooks"])assert.equal(state.scenario[key].length,new Set(state.scenario[key]).size,`${key} duplicate`);
  const transitions=all.filter(step=>step.type==="transition");assert.equal(transitions.length,9);assert.ok(transitions.slice(0,8).every(step=>step.camera&&step.characterAssetUrl===STORY_OUTFIT_ASSETS.day7));assert.equal(all.filter(step=>step.type==="sfx").length,19);assert.equal(all.at(-1).type,"sceneEnd");paths++;
}
assert.equal(paths,27);

const invalid=makeState(),invalidBefore=structuredClone(invalid);assert.equal(applyLockedDay15ChoiceState(invalid,"unknown-choice"),null);assert.deepEqual(invalid,invalidBefore);
const outOfOrder=makeState(),orderBefore=structuredClone(outOfOrder);assert.equal(applyLockedDay15ChoiceState(outOfOrder,DAY15_CHANGE_CHOICES[0].id),null);assert.equal(applyLockedDay15ChoiceState(outOfOrder,DAY15_PRIVACY_CHOICES[0].id),null);assert.deepEqual(outOfOrder,orderBefore,"out-of-order choices must not mutate state");
const changed=makeState();applyLockedDay15ChoiceState(changed,DAY15_ACTIVITY_CHOICES[0].id);const changedBefore=structuredClone(changed);assert.equal(applyLockedDay15ChoiceState(changed,DAY15_ACTIVITY_CHOICES[1].id),null);assert.deepEqual(changed,changedBefore,"a completed choice axis cannot be replaced");
const legacy=makeState();delete legacy.storyFlags.day15RuntimeStage;assert.equal(getLockedDay15ResumePresentation(legacy).backgroundId,"home-morning");assert.equal(getLockedDay15Segment(legacy).filter(step=>step.type==="choice").length,1);
const free=makeState(GAME_MODES.FREE_ROMANCE);assert.notEqual(selectNextStoryScene(free)?.id,"m30-day15-current-leisure-date");
const completed=makeState();applyLockedDay15ChoiceState(completed,DAY15_ACTIVITY_CHOICES[0].id);applyLockedDay15ChoiceState(completed,DAY15_CHANGE_CHOICES[0].id);applyLockedDay15ChoiceState(completed,DAY15_PRIVACY_CHOICES[0].id);completed.day=16;completed.storyHistory.push({sceneId:"m30-day15-current-leisure-date",choiceId:DAY15_PRIVACY_CHOICES[0].id,day:15,response:"완료"});assert.equal(selectNextStoryScene(completed)?.id,"m30-day16-current-social-circle");
const playerText=JSON.stringify([0,1,2,3].flatMap(stage=>getLockedDay15Segment(completed,stage)));for(const forbidden of ["가짜 하은","진짜 하은","사고는 고의","범인","하은의 거짓말"])assert.ok(!playerText.includes(forbidden),forbidden);

console.log("✓ DAY 15 8개 ready 연출·DAY 14 9콜백·27개 선택 경로·효과·실저장 복원·DAY 16 도달성 PASS");
