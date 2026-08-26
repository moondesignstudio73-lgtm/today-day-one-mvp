import assert from "node:assert/strict";
import { createInitialState } from "../src/game-core.mjs";
import { createGirlfriendFromProfile } from "../src/girlfriend-manager.mjs";
import { GAME_MODES } from "../src/scenario-state.mjs";
import { selectNextStoryScene } from "../src/story-manager.mjs";
import { applyLockedDay11ChoiceState, getLockedDay11ResumePresentation, getLockedDay11Segment, validateLockedDay11Runtime } from "../src/day11-campaign-runtime.mjs";

const state=createInitialState(createGirlfriendFromProfile("haeun",()=>.5),()=>.5,{mode:GAME_MODES.MARRIAGE_30});state.day=11;state.storyHistory=[{sceneId:"m30-day10-three-hour-work-rhythm",choiceId:"work10_debrief_separate_scores",day:10,response:"완료"}];state.storyFlags={day11CurrentLifePlanPending:true};
assert.equal(selectNextStoryScene(state)?.id,"m30-day11-current-life-plan");assert.equal(validateLockedDay11Runtime(),true);assert.equal(getLockedDay11Segment(state).filter(step=>step.type==="choice").length,1);
assert.deepEqual(applyLockedDay11ChoiceState(state,"life11_anchor_recovery"),{stage:1});assert.equal(getLockedDay11ResumePresentation(state).backgroundId,"neighborhood-street-day");
assert.deepEqual(applyLockedDay11ChoiceState(state,"life11_conflict_owner_decides"),{stage:2});assert.equal(getLockedDay11ResumePresentation(state).backgroundId,"neighborhood-park-day");
assert.deepEqual(applyLockedDay11ChoiceState(state,"life11_share_changes_only"),{stage:3});assert.equal(state.storyFlags.day11CurrentLifePlanCompleted,true);assert.equal(state.storyFlags.day12CurrentAccountReviewPending,true);
assert.ok(state.scenario.unlockedActions.includes("current-week-anchor"));assert.ok(state.scenario.unlockedActions.includes("schedule-conflict-rule"));assert.ok(state.scenario.unlockedActions.includes("shared-calendar-boundary"));assert.ok(state.scenario.unlockedActions.includes("protected-buffer-time"));assert.ok(state.scenario.clues.includes("current-week-plan-record"));
const restored=structuredClone(state);assert.equal(restored.storyFlags.day11RuntimeStage,3);assert.equal(getLockedDay11Segment(restored).at(-1).type,"sceneEnd");
console.log("✓ DAY 11 잠금 스토리·3단계 선택·생활표 해금·저장 복원 PASS");
