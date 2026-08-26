import assert from "node:assert/strict";
import { createInitialState } from "../src/game-core.mjs";
import { createGirlfriendFromProfile } from "../src/girlfriend-manager.mjs";
import { GAME_MODES } from "../src/scenario-state.mjs";
import { SaveManager } from "../src/save-manager.mjs";
import { selectNextStoryScene } from "../src/story-manager.mjs";
import { DAY12_PRESENTATION_SCENES } from "../src/day12-presentation-data.mjs";
import { DAY12_ACCESS_CHOICES, DAY12_EXPENSE_CHOICES, DAY12_VERIFY_CHOICES, applyLockedDay12ChoiceState, getLockedDay12ResumePresentation, getLockedDay12Segment, validateLockedDay12Runtime } from "../src/day12-campaign-runtime.mjs";

const makeState=()=>{
  const state=createInitialState(createGirlfriendFromProfile("haeun",()=>.5),()=>.5,{mode:GAME_MODES.MARRIAGE_30});
  state.day=12;state.affection=36;state.trust=34;
  state.storyHistory=[{sceneId:"m30-day11-current-life-plan",choiceId:"life11_share_changes_only",day:11,response:"완료"}];
  state.storyFlags={day12CurrentAccountReviewPending:true,day11AnchorStrategy:"life11_anchor_recovery",day11ConflictStrategy:"life11_conflict_owner_decides",day11ShareStrategy:"life11_share_changes_only",day11ScheduleNoteMismatch:"unverified"};
  state.scenario.seojinAffection=7;state.scenario.seojinStatusInterest=13;
  return state;
};
const roundTrip=state=>{const values=new Map();const storage={getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)};SaveManager.save(state,storage);return SaveManager.load(storage,GAME_MODES.MARRIAGE_30);};

assert.equal(selectNextStoryScene(makeState())?.id,"m30-day12-current-account-review");
assert.equal(validateLockedDay12Runtime(),true);
const callbackCases=[
  ["day11AnchorStrategy","life11_anchor_recovery","복약·휴식 사이"],["day11AnchorStrategy","life11_anchor_work","근무 블록 뒤"],["day11AnchorStrategy","life11_anchor_shared","개인 확인 카드"],
  ["day11ConflictStrategy","life11_conflict_health_first","건강 우선 규칙"],["day11ConflictStrategy","life11_conflict_owner_decides","유지·축소·이동"],["day11ConflictStrategy","life11_conflict_buffer","보호 버퍼"],
  ["day11ShareStrategy","life11_share_changes_only","영향을 주는 변경만"],["day11ShareStrategy","life11_share_weekly_review","주말 검토 전"],["day11ShareStrategy","life11_share_separate_ownership","소유권 분리 규칙"]
];
for(const [key,id,marker] of callbackCases){const state=makeState();state.storyFlags[key]=id;state.storyFlags.day12VerifyStrategy=DAY12_VERIFY_CHOICES[0].id;state.storyFlags.day12ExpenseStrategy=DAY12_EXPENSE_CHOICES[0].id;const text=[...getLockedDay12Segment(state,0),...getLockedDay12Segment(state,2)].map(step=>step.text??"").join(" ");assert.ok(text.includes(marker),`${id} callback`);}

let paths=0;
for(const verify of DAY12_VERIFY_CHOICES)for(const expense of DAY12_EXPENSE_CHOICES)for(const access of DAY12_ACCESS_CHOICES){
  let state=makeState();const all=[];
  all.push(...getLockedDay12Segment(state,0));assert.deepEqual(applyLockedDay12ChoiceState(state,verify.id),{stage:1});state=roundTrip(state);assert.equal(state.storyFlags.day12RuntimeStage,1);assert.equal(getLockedDay12ResumePresentation(state).backgroundId,"day2-home-entry");
  all.push(...getLockedDay12Segment(state,1));assert.deepEqual(applyLockedDay12ChoiceState(state,expense.id),{stage:2});state=roundTrip(state);assert.equal(state.storyFlags.day12RuntimeStage,2);assert.equal(getLockedDay12ResumePresentation(state).backgroundId,"neighborhood-cafe-day");
  all.push(...getLockedDay12Segment(state,2));assert.deepEqual(applyLockedDay12ChoiceState(state,access.id),{stage:3});state=roundTrip(state);all.push(...getLockedDay12Segment(state,3));
  assert.equal(state.storyFlags.day12CurrentAccountReviewCompleted,true);assert.equal(state.storyFlags.day13CurrentHouseholdBudgetPending,true);assert.equal(state.scenario.featureUnlocks.finance,true);assert.equal(state.scenario.featureUnlocks.investment,undefined);
  assert.equal(state.affection,36);assert.equal(state.trust,34);assert.equal(state.scenario.seojinAffection,7);assert.equal(state.scenario.seojinStatusInterest,13);assert.equal(state.storyFlags.day11ScheduleNoteMismatch,"unverified");
  assert.equal(state.storyFlags.day11AnchorStrategy,"life11_anchor_recovery");assert.equal(state.storyFlags.day11ConflictStrategy,"life11_conflict_owner_decides");assert.equal(state.storyFlags.day11ShareStrategy,"life11_share_changes_only");
  for(const id of ["verified-current-account","verified-living-expenses","basic-finance-review","account-ownership-boundary"])assert.ok(state.scenario.unlockedActions.includes(id));
  assert.ok(state.scenario.clues.includes("verified-current-account-record"));assert.ok(state.scenario.followUpHooks.includes("day13-current-household-budget"));
  for(const key of ["unlockedActions","clues","followUpHooks"])assert.equal(state.scenario[key].length,new Set(state.scenario[key]).size);
  const runtimeTransitions=all.filter(step=>step.type==="transition").slice(0,8);assert.equal(runtimeTransitions.length,8);assert.deepEqual(new Set(runtimeTransitions.map(step=>step.backgroundId)),new Set(Object.values(DAY12_PRESENTATION_SCENES).map(scene=>scene.backgroundId)));assert.ok(runtimeTransitions.every(step=>step.camera&&step.bgmId==="daily"));
  assert.equal(all.filter(step=>step.type==="sfx").length,16);assert.equal(all.at(-1).type,"sceneEnd");paths++;
}
assert.equal(paths,27);assert.equal(applyLockedDay12ChoiceState(makeState(),"unknown-choice"),null);
console.log("✓ DAY 12 8개 연출·DAY 11 9콜백·27개 선택 경로·실저장 복원 PASS");
