import assert from "node:assert/strict";
import { createInitialState } from "../src/game-core.mjs";
import { createGirlfriendFromProfile } from "../src/girlfriend-manager.mjs";
import { GAME_MODES } from "../src/scenario-state.mjs";
import { selectNextStoryScene } from "../src/story-manager.mjs";
import { applyLockedDay14ChoiceState, getLockedDay14ResumePresentation, getLockedDay14Segment, validateLockedDay14Runtime } from "../src/day14-campaign-runtime.mjs";

const state=createInitialState(createGirlfriendFromProfile("haeun",()=>.5),()=>.5,{mode:GAME_MODES.MARRIAGE_30});state.day=14;state.storyHistory=[{sceneId:"m30-day13-current-household-budget",choiceId:"budget13_review_totals_only",day:13,response:"완료"}];state.storyFlags={day14CurrentChoiceSpendingPending:true};state.scenario.featureUnlocks={finance:true};
assert.equal(selectNextStoryScene(state)?.id,"m30-day14-current-choice-spending");assert.equal(validateLockedDay14Runtime(),true);assert.equal(getLockedDay14Segment(state).filter(step=>step.type==="choice").length,1);
assert.deepEqual(applyLockedDay14ChoiceState(state,"spend14_lane_personal"),{stage:1});assert.equal(getLockedDay14ResumePresentation(state).backgroundId,"day8-household-store-day");assert.deepEqual(applyLockedDay14ChoiceState(state,"spend14_purchase_one_item"),{stage:2});assert.equal(getLockedDay14ResumePresentation(state).backgroundId,"neighborhood-cafe-day");assert.deepEqual(applyLockedDay14ChoiceState(state,"spend14_consent_ask_first"),{stage:3});
assert.equal(state.storyFlags.day14CurrentChoiceSpendingCompleted,true);assert.equal(state.storyFlags.day15CurrentLeisureDatePending,true);assert.equal(state.scenario.featureUnlocks.finance,true);assert.equal(state.scenario.featureUnlocks.shop,true);assert.equal(state.scenario.featureUnlocks.investment,undefined);assert.ok(state.scenario.unlockedActions.includes("current-choice-spending"));assert.ok(state.scenario.unlockedActions.includes("controlled-shopping-checkout"));assert.ok(state.scenario.unlockedActions.includes("gift-consent-boundary"));assert.ok(state.scenario.unlockedActions.includes("basic-online-shopping"));
const restored=structuredClone(state);assert.equal(restored.storyFlags.day14RuntimeStage,3);assert.equal(getLockedDay14Segment(restored).at(-1).type,"sceneEnd");
console.log("✓ DAY 14 잠금 스토리·3단계 선택·안전 쇼핑/선물 동의·저장 복원 PASS");
