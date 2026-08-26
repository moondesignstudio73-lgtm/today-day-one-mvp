import assert from "node:assert/strict";
import { createInitialState } from "../src/game-core.mjs";
import { createGirlfriendFromProfile } from "../src/girlfriend-manager.mjs";
import { GAME_MODES } from "../src/scenario-state.mjs";
import { selectNextStoryScene } from "../src/story-manager.mjs";
import { applyLockedDay15ChoiceState, getLockedDay15ResumePresentation, getLockedDay15Segment, validateLockedDay15Runtime } from "../src/day15-campaign-runtime.mjs";

const state=createInitialState(createGirlfriendFromProfile("haeun",()=>.5),()=>.5,{mode:GAME_MODES.MARRIAGE_30});state.day=15;state.storyHistory=[{sceneId:"m30-day14-current-choice-spending",choiceId:"spend14_consent_ask_first",day:14,response:"완료"}];state.storyFlags={day15CurrentLeisureDatePending:true};state.scenario.featureUnlocks={finance:true,shop:true};
assert.equal(selectNextStoryScene(state)?.id,"m30-day15-current-leisure-date");assert.equal(validateLockedDay15Runtime(),true);assert.equal(getLockedDay15Segment(state).filter(step=>step.type==="choice").length,1);
assert.deepEqual(applyLockedDay15ChoiceState(state,"leisure15_activity_each_pick"),{stage:1});assert.equal(getLockedDay15ResumePresentation(state).backgroundId,"day7-gallery-day");assert.deepEqual(applyLockedDay15ChoiceState(state,"leisure15_change_shorten"),{stage:2});assert.equal(getLockedDay15ResumePresentation(state).backgroundId,"neighborhood-cafe-day");assert.deepEqual(applyLockedDay15ChoiceState(state,"leisure15_privacy_private_note"),{stage:3});
assert.equal(state.storyFlags.day15CurrentLeisureDateCompleted,true);assert.equal(state.storyFlags.day16CurrentSocialCirclePending,true);assert.equal(state.scenario.featureUnlocks.finance,true);assert.equal(state.scenario.featureUnlocks.shop,true);assert.equal(state.scenario.featureUnlocks.investment,undefined);assert.ok(state.scenario.unlockedActions.includes("current-leisure-date"));assert.ok(state.scenario.unlockedActions.includes("date-change-boundary"));assert.ok(state.scenario.unlockedActions.includes("private-date-record"));
const restored=structuredClone(state);assert.equal(restored.storyFlags.day15RuntimeStage,3);assert.equal(getLockedDay15Segment(restored).at(-1).type,"sceneEnd");
console.log("✓ DAY 15 잠금 스토리·3단계 선택·현재형 데이트/공개 동의·저장 복원 PASS");
