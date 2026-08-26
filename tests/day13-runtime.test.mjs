import assert from "node:assert/strict";
import { createInitialState } from "../src/game-core.mjs";
import { createGirlfriendFromProfile } from "../src/girlfriend-manager.mjs";
import { GAME_MODES } from "../src/scenario-state.mjs";
import { SaveManager } from "../src/save-manager.mjs";
import { selectNextStoryScene } from "../src/story-manager.mjs";
import { STORY_OUTFIT_ASSETS } from "../src/story-outfit-assets.mjs";
import { DAY13_PRESENTATION_SCENES } from "../src/day13-presentation-data.mjs";
import { DAY13_BASE_CHOICES,DAY13_CONTRIBUTION_CHOICES,DAY13_REVIEW_CHOICES,applyLockedDay13ChoiceState,getLockedDay13ResumePresentation,getLockedDay13Segment,validateLockedDay13Runtime } from "../src/day13-campaign-runtime.mjs";

const makeState=()=>{
  const state=createInitialState(createGirlfriendFromProfile("haeun",()=>.5),()=>.5,{mode:GAME_MODES.MARRIAGE_30});
  state.day=13;state.affection=38;state.trust=36;
  state.storyHistory=[{sceneId:"m30-day12-current-account-review",choiceId:"account12_access_separate_investment",day:12,response:"완료"}];
  state.storyFlags={day13CurrentHouseholdBudgetPending:true,day11ScheduleNoteMismatch:"unverified",day12VerifyStrategy:"account12_verify_owner_statement",day12ExpenseStrategy:"account12_expense_personal_only",day12AccessStrategy:"account12_access_separate_investment"};
  state.scenario.featureUnlocks={finance:true};state.scenario.seojinAffection=7;state.scenario.seojinStatusInterest=13;
  return state;
};
const roundTrip=state=>{const values=new Map();const storage={getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)};SaveManager.save(state,storage);return SaveManager.load(storage,GAME_MODES.MARRIAGE_30);};

assert.equal(selectNextStoryScene(makeState())?.id,"m30-day13-current-household-budget");
assert.equal(selectNextStoryScene(makeState())?.presentation.characterAssetUrl,STORY_OUTFIT_ASSETS.day6);
assert.equal(validateLockedDay13Runtime(),true);
const callbackCases=[
  ["day12VerifyStrategy","account12_verify_owner_statement","공식 명의와 발행일"],["day12VerifyStrategy","account12_verify_support_call","변경 권한 없음"],["day12VerifyStrategy","account12_verify_living_entries","직접 대조한 생활비 세 건"],
  ["day12ExpenseStrategy","account12_expense_personal_only","새 공동 후보"],["day12ExpenseStrategy","account12_expense_shared_unconfirmed","확인 보류 카드"],["day12ExpenseStrategy","account12_expense_source_labels","현재 매장 가격"],
  ["day12AccessStrategy","account12_access_read_only","자동이체 실행 버튼"],["day12AccessStrategy","account12_access_monthly_review","월 1회 계정 검토"],["day12AccessStrategy","account12_access_separate_investment","투자·저축 이동 항목"]
];
for(const [key,id,marker] of callbackCases){const state=makeState();state.storyFlags[key]=id;state.storyFlags.day13BaseStrategy=DAY13_BASE_CHOICES[0].id;state.storyFlags.day13ContributionStrategy=DAY13_CONTRIBUTION_CHOICES[0].id;const text=[...getLockedDay13Segment(state,0),...getLockedDay13Segment(state,1),...getLockedDay13Segment(state,2)].map(step=>step.text??"").join(" ");assert.ok(text.includes(marker),`${id} callback`);}

let paths=0;
for(const base of DAY13_BASE_CHOICES)for(const contribution of DAY13_CONTRIBUTION_CHOICES)for(const review of DAY13_REVIEW_CHOICES){
  let state=makeState();const all=[];
  all.push(...getLockedDay13Segment(state,0));assert.deepEqual(applyLockedDay13ChoiceState(state,base.id),{stage:1});state=roundTrip(state);assert.equal(state.storyFlags.day13RuntimeStage,1);assert.equal(getLockedDay13ResumePresentation(state).backgroundId,"neighborhood-market-day");
  all.push(...getLockedDay13Segment(state,1));assert.deepEqual(applyLockedDay13ChoiceState(state,contribution.id),{stage:2});state=roundTrip(state);assert.equal(state.storyFlags.day13RuntimeStage,2);assert.equal(getLockedDay13ResumePresentation(state).backgroundId,"day2-home-entry");
  all.push(...getLockedDay13Segment(state,2));assert.deepEqual(applyLockedDay13ChoiceState(state,review.id),{stage:3});state=roundTrip(state);all.push(...getLockedDay13Segment(state,3));
  assert.equal(state.storyFlags.day13CurrentHouseholdBudgetCompleted,true);assert.equal(state.storyFlags.day14CurrentChoiceSpendingPending,true);assert.equal(state.scenario.featureUnlocks.finance,true);assert.equal(state.scenario.featureUnlocks.investment,undefined);
  assert.equal(state.affection,38);assert.equal(state.trust,36);assert.equal(state.scenario.seojinAffection,7);assert.equal(state.scenario.seojinStatusInterest,13);assert.equal(state.storyFlags.day11ScheduleNoteMismatch,"unverified");
  assert.equal(state.storyFlags.day12VerifyStrategy,"account12_verify_owner_statement");assert.equal(state.storyFlags.day12ExpenseStrategy,"account12_expense_personal_only");assert.equal(state.storyFlags.day12AccessStrategy,"account12_access_separate_investment");
  for(const id of ["current-budget-base","shared-expense-consent","current-household-budget","household-buffer-boundary"])assert.ok(state.scenario.unlockedActions.includes(id));
  assert.ok(state.scenario.clues.includes("current-household-budget-record"));assert.ok(state.scenario.followUpHooks.includes("day14-current-choice-spending"));
  for(const key of ["unlockedActions","clues","followUpHooks"])assert.equal(state.scenario[key].length,new Set(state.scenario[key]).size);
  const transitions=all.filter(step=>step.type==="transition").slice(0,8);assert.equal(transitions.length,8);assert.deepEqual(transitions.map(step=>step.backgroundId),Object.values(DAY13_PRESENTATION_SCENES).map(scene=>scene.backgroundId));assert.ok(transitions.every(step=>step.camera&&step.bgmId==="daily"&&step.characterAssetUrl===STORY_OUTFIT_ASSETS.day6));
  assert.equal(all.filter(step=>step.type==="sfx").length,15);assert.equal(all.at(-1).type,"sceneEnd");paths++;
}
assert.equal(paths,27);
const invalid=makeState();const before=JSON.stringify(invalid);assert.equal(applyLockedDay13ChoiceState(invalid,"unknown-choice"),null);assert.equal(JSON.stringify(invalid),before);
console.log("✓ DAY 13 8개 연출·DAY 12 9콜백·27개 선택 경로·실저장 복원 PASS");
