import assert from "node:assert/strict";
import { createInitialState } from "../src/game-core.mjs";
import { createGirlfriendFromProfile } from "../src/girlfriend-manager.mjs";
import { GAME_MODES } from "../src/scenario-state.mjs";
import { SaveManager } from "../src/save-manager.mjs";
import { selectNextStoryScene } from "../src/story-manager.mjs";
import { STORY_OUTFIT_ASSETS } from "../src/story-outfit-assets.mjs";
import { DAY14_PRESENTATION_SCENES } from "../src/day14-presentation-data.mjs";
import { DAY14_LANE_CHOICES,DAY14_PURCHASE_CHOICES,DAY14_CONSENT_CHOICES,applyLockedDay14ChoiceState,getLockedDay14ResumePresentation,getLockedDay14Segment,validateLockedDay14Runtime } from "../src/day14-campaign-runtime.mjs";

const makeState=(mode=GAME_MODES.MARRIAGE_30)=>{
  const state=createInitialState(createGirlfriendFromProfile("haeun",()=>.5),()=>.5,{mode});
  state.day=14;state.affection=40;state.trust=37;
  state.storyHistory=[{sceneId:"m30-day13-current-household-budget",choiceId:"budget13_review_totals_only",day:13,response:"완료"}];
  state.storyFlags={day14CurrentChoiceSpendingPending:true,day11ScheduleNoteMismatch:"unverified",day13BaseStrategy:"budget13_base_verified_personal",day13ContributionStrategy:"budget13_contribution_item_owner",day13ReviewStrategy:"budget13_review_totals_only"};
  state.scenario.featureUnlocks={finance:true};state.scenario.seojinAffection=9;state.scenario.seojinStatusInterest=16;
  return state;
};
const roundTrip=state=>{const values=new Map(),storage={getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)};SaveManager.save(state,storage);return SaveManager.load(storage,GAME_MODES.MARRIAGE_30);};

assert.equal(selectNextStoryScene(makeState())?.id,"m30-day14-current-choice-spending");
assert.equal(validateLockedDay14Runtime(),true);
assert.equal(getLockedDay14Segment(makeState()).filter(step=>step.type==="choice").length,1);

const callbackCases=[
  ["day13BaseStrategy","budget13_base_verified_personal","각자 확인한 고정비"],["day13BaseStrategy","budget13_base_shared_essentials","필수품 두 개"],["day13BaseStrategy","budget13_base_protected_buffer","보호 예비비"],
  ["day13ContributionStrategy","budget13_contribution_item_owner","사용 주체와 결제 책임"],["day13ContributionStrategy","budget13_contribution_equal_confirmed","이 두 개만 반씩"],["day13ContributionStrategy","budget13_contribution_capacity_review","임시 비율이 영구 규칙"],
  ["day13ReviewStrategy","budget13_review_totals_only","총액만 확인"],["day13ReviewStrategy","budget13_review_receipt_consent","이 범위로 보여 줄게"],["day13ReviewStrategy","budget13_review_weekly_changes","변화만 확인하자"]
];
for(const [key,id,marker] of callbackCases){const state=makeState();state.storyFlags[key]=id;state.storyFlags.day14LaneStrategy=DAY14_LANE_CHOICES[0].id;state.storyFlags.day14PurchaseStrategy=DAY14_PURCHASE_CHOICES[0].id;const text=[...getLockedDay14Segment(state,0),...getLockedDay14Segment(state,1),...getLockedDay14Segment(state,2)].map(step=>step.text??"").join(" ");assert.ok(text.includes(marker),`${id} callback`);}

let paths=0;
for(const lane of DAY14_LANE_CHOICES)for(const purchase of DAY14_PURCHASE_CHOICES)for(const consent of DAY14_CONSENT_CHOICES){
  let state=makeState(),all=[];
  all.push(...getLockedDay14Segment(state,0));assert.deepEqual(applyLockedDay14ChoiceState(state,lane.id),{stage:1});assert.deepEqual(applyLockedDay14ChoiceState(state,lane.id),{stage:1});state=roundTrip(state);
  assert.equal(state.storyFlags.day14RuntimeStage,1);assert.equal(state.storyFlags.day14PastPreferenceRecommendation,"unverified");assert.equal(getLockedDay14ResumePresentation(state).backgroundId,"day8-household-store-day");
  all.push(...getLockedDay14Segment(state,1));assert.deepEqual(applyLockedDay14ChoiceState(state,purchase.id),{stage:2});assert.deepEqual(applyLockedDay14ChoiceState(state,purchase.id),{stage:2});state=roundTrip(state);
  assert.equal(state.storyFlags.day14RuntimeStage,2);assert.equal(getLockedDay14ResumePresentation(state).backgroundId,"neighborhood-cafe-day");
  all.push(...getLockedDay14Segment(state,2));assert.deepEqual(applyLockedDay14ChoiceState(state,consent.id),{stage:3});assert.deepEqual(applyLockedDay14ChoiceState(state,consent.id),{stage:3});state=roundTrip(state);all.push(...getLockedDay14Segment(state,3));
  assert.equal(state.storyFlags.day14CurrentChoiceSpendingPending,false);assert.equal(state.storyFlags.day14CurrentChoiceSpendingCompleted,true);assert.equal(state.storyFlags.day15CurrentLeisureDatePending,true);
  assert.equal(state.scenario.featureUnlocks.finance,true);assert.equal(state.scenario.featureUnlocks.shop,true);assert.equal(state.scenario.featureUnlocks.investment,undefined);
  assert.equal(state.affection,40);assert.equal(state.trust,37);assert.equal(state.scenario.seojinAffection,9);assert.equal(state.scenario.seojinStatusInterest,16);assert.equal(state.storyFlags.day11ScheduleNoteMismatch,"unverified");
  assert.equal(state.storyFlags.day13BaseStrategy,"budget13_base_verified_personal");assert.equal(state.storyFlags.day13ContributionStrategy,"budget13_contribution_item_owner");assert.equal(state.storyFlags.day13ReviewStrategy,"budget13_review_totals_only");
  for(const id of [lane.id,purchase.id,consent.id])assert.equal(state.storyFlags[id],true,id);
  for(const id of ["current-choice-spending","controlled-shopping-checkout","gift-consent-boundary","basic-online-shopping"])assert.ok(state.scenario.unlockedActions.includes(id),id);
  assert.ok(state.scenario.clues.includes("current-choice-spending-record"));assert.ok(state.scenario.followUpHooks.includes("day15-current-leisure-date"));
  for(const key of ["unlockedActions","clues","followUpHooks"])assert.equal(state.scenario[key].length,new Set(state.scenario[key]).size,`${key} duplicate`);
  const transitions=all.filter(step=>step.type==="transition").slice(0,8);assert.deepEqual(transitions.map(step=>step.backgroundId),Object.values(DAY14_PRESENTATION_SCENES).map(view=>view.backgroundId));assert.ok(transitions.every(step=>step.camera&&step.bgmId==="daily"&&step.characterAssetUrl===STORY_OUTFIT_ASSETS.day8));
  assert.equal(all.filter(step=>step.type==="sfx").length,17);assert.equal(all.at(-1).type,"sceneEnd");paths++;
}
assert.equal(paths,27);

const invalid=makeState(),invalidBefore=structuredClone(invalid);assert.equal(applyLockedDay14ChoiceState(invalid,"unknown-choice"),null);assert.deepEqual(invalid,invalidBefore);
const outOfOrder=makeState(),orderBefore=structuredClone(outOfOrder);assert.equal(applyLockedDay14ChoiceState(outOfOrder,DAY14_PURCHASE_CHOICES[0].id),null);assert.equal(applyLockedDay14ChoiceState(outOfOrder,DAY14_CONSENT_CHOICES[0].id),null);assert.deepEqual(outOfOrder,orderBefore,"out-of-order choices must not mutate state");
const legacy=makeState();delete legacy.storyFlags.day14RuntimeStage;assert.equal(getLockedDay14ResumePresentation(legacy).backgroundId,"home-morning");assert.equal(getLockedDay14Segment(legacy).filter(step=>step.type==="choice").length,1);
const free=makeState(GAME_MODES.FREE_ROMANCE);assert.notEqual(selectNextStoryScene(free)?.id,"m30-day14-current-choice-spending");
const completed=makeState();applyLockedDay14ChoiceState(completed,DAY14_LANE_CHOICES[0].id);applyLockedDay14ChoiceState(completed,DAY14_PURCHASE_CHOICES[0].id);applyLockedDay14ChoiceState(completed,DAY14_CONSENT_CHOICES[0].id);completed.day=15;completed.storyHistory.push({sceneId:"m30-day14-current-choice-spending",choiceId:DAY14_CONSENT_CHOICES[0].id,day:14,response:"완료"});assert.equal(selectNextStoryScene(completed)?.id,"m30-day15-current-leisure-date");
const playerText=JSON.stringify([0,1,2,3].flatMap(stage=>getLockedDay14Segment(completed,stage)));for(const forbidden of ["가짜 하은","진짜 하은","사고는 고의","범인","하은의 거짓말"])assert.ok(!playerText.includes(forbidden),forbidden);

console.log("✓ DAY 14 8개 ready 연출·DAY 13 9콜백·27개 선택 경로·실저장 복원·DAY 15 도달성 PASS");
