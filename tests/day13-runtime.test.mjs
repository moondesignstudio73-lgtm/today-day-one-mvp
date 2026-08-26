import assert from "node:assert/strict";
import { createInitialState } from "../src/game-core.mjs";
import { createGirlfriendFromProfile } from "../src/girlfriend-manager.mjs";
import { GAME_MODES } from "../src/scenario-state.mjs";
import { selectNextStoryScene } from "../src/story-manager.mjs";
import { applyLockedDay13ChoiceState, getLockedDay13ResumePresentation, getLockedDay13Segment, validateLockedDay13Runtime } from "../src/day13-campaign-runtime.mjs";

const state=createInitialState(createGirlfriendFromProfile("haeun",()=>.5),()=>.5,{mode:GAME_MODES.MARRIAGE_30});state.day=13;state.storyHistory=[{sceneId:"m30-day12-current-account-review",choiceId:"account12_access_separate_investment",day:12,response:"완료"}];state.storyFlags={day13CurrentHouseholdBudgetPending:true};state.scenario.featureUnlocks={finance:true};
assert.equal(selectNextStoryScene(state)?.id,"m30-day13-current-household-budget");assert.equal(validateLockedDay13Runtime(),true);assert.equal(getLockedDay13Segment(state).filter(step=>step.type==="choice").length,1);
assert.deepEqual(applyLockedDay13ChoiceState(state,"budget13_base_verified_personal"),{stage:1});assert.equal(getLockedDay13ResumePresentation(state).backgroundId,"neighborhood-market-day");assert.deepEqual(applyLockedDay13ChoiceState(state,"budget13_contribution_item_owner"),{stage:2});assert.equal(getLockedDay13ResumePresentation(state).backgroundId,"neighborhood-cafe-day");assert.deepEqual(applyLockedDay13ChoiceState(state,"budget13_review_totals_only"),{stage:3});
assert.equal(state.storyFlags.day13CurrentHouseholdBudgetCompleted,true);assert.equal(state.storyFlags.day14CurrentChoiceSpendingPending,true);assert.equal(state.scenario.featureUnlocks.finance,true);assert.equal(state.scenario.featureUnlocks.investment,undefined);assert.ok(state.scenario.unlockedActions.includes("current-budget-base"));assert.ok(state.scenario.unlockedActions.includes("shared-expense-consent"));assert.ok(state.scenario.unlockedActions.includes("current-household-budget"));assert.ok(state.scenario.unlockedActions.includes("household-buffer-boundary"));
const restored=structuredClone(state);assert.equal(restored.storyFlags.day13RuntimeStage,3);assert.equal(getLockedDay13Segment(restored).at(-1).type,"sceneEnd");
console.log("✓ DAY 13 잠금 스토리·3단계 선택·가계 예산 경계·저장 복원 PASS");
