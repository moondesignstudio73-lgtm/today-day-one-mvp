import assert from "node:assert/strict";
import { createInitialState } from "../src/game-core.mjs";
import { createGirlfriendFromProfile } from "../src/girlfriend-manager.mjs";
import { GAME_MODES } from "../src/scenario-state.mjs";
import { selectNextStoryScene } from "../src/story-manager.mjs";
import { applyLockedDay12ChoiceState, getLockedDay12ResumePresentation, getLockedDay12Segment, validateLockedDay12Runtime } from "../src/day12-campaign-runtime.mjs";

const state=createInitialState(createGirlfriendFromProfile("haeun",()=>.5),()=>.5,{mode:GAME_MODES.MARRIAGE_30});state.day=12;state.storyHistory=[{sceneId:"m30-day11-current-life-plan",choiceId:"life11_share_changes_only",day:11,response:"완료"}];state.storyFlags={day12CurrentAccountReviewPending:true};
assert.equal(selectNextStoryScene(state)?.id,"m30-day12-current-account-review");assert.equal(validateLockedDay12Runtime(),true);assert.equal(getLockedDay12Segment(state).filter(step=>step.type==="choice").length,1);
assert.deepEqual(applyLockedDay12ChoiceState(state,"account12_verify_owner_statement"),{stage:1});assert.equal(getLockedDay12ResumePresentation(state).backgroundId,"day2-home-entry");
assert.deepEqual(applyLockedDay12ChoiceState(state,"account12_expense_source_labels"),{stage:2});assert.equal(getLockedDay12ResumePresentation(state).backgroundId,"neighborhood-cafe-day");
assert.deepEqual(applyLockedDay12ChoiceState(state,"account12_access_separate_investment"),{stage:3});assert.equal(state.storyFlags.day12CurrentAccountReviewCompleted,true);assert.equal(state.storyFlags.day13CurrentHouseholdBudgetPending,true);assert.equal(state.scenario.featureUnlocks.finance,true);assert.equal(state.scenario.featureUnlocks.investment,undefined);
assert.ok(state.scenario.unlockedActions.includes("verified-current-account"));assert.ok(state.scenario.unlockedActions.includes("verified-living-expenses"));assert.ok(state.scenario.unlockedActions.includes("basic-finance-review"));assert.ok(state.scenario.unlockedActions.includes("account-ownership-boundary"));assert.ok(state.scenario.clues.includes("verified-current-account-record"));
const restored=structuredClone(state);assert.equal(restored.storyFlags.day12RuntimeStage,3);assert.equal(restored.scenario.featureUnlocks.finance,true);assert.equal(getLockedDay12Segment(restored).at(-1).type,"sceneEnd");
console.log("✓ DAY 12 잠금 스토리·3단계 선택·기본 금융만 해금·저장 복원 PASS");
