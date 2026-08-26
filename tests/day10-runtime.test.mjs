import assert from "node:assert/strict";
import { createInitialState } from "../src/game-core.mjs";
import { createGirlfriendFromProfile } from "../src/girlfriend-manager.mjs";
import { GAME_MODES } from "../src/scenario-state.mjs";
import { selectNextStoryScene } from "../src/story-manager.mjs";
import { applyLockedDay10ChoiceState, getLockedDay10ResumePresentation, getLockedDay10Segment, validateLockedDay10Runtime } from "../src/day10-campaign-runtime.mjs";

const state=createInitialState(createGirlfriendFromProfile("haeun",()=>.5),()=>.5,{mode:GAME_MODES.MARRIAGE_30});state.day=10;
state.storyHistory=[{sceneId:"m30-day9-second-office-adaptation",choiceId:"office9_debrief_write_protocol",day:9,response:"완료"}];
state.storyFlags={day10ThreeHourWorkRhythmPending:true,day9ScopeStrategy:"office9_scope_current_queue",day9PressureStrategy:"office9_pressure_route_questions",day9DebriefStrategy:"office9_debrief_write_protocol"};state.scenario.introducedNpcIds.push("female-coworker","team-lead","office-best-male");
assert.equal(selectNextStoryScene(state)?.id,"m30-day10-three-hour-work-rhythm");assert.equal(validateLockedDay10Runtime(),true);
assert.equal(getLockedDay10Segment(state).filter(step=>step.type==="choice").length,1);
assert.deepEqual(applyLockedDay10ChoiceState(state,"work10_rhythm_fixed_blocks"),{stage:1});assert.equal(getLockedDay10ResumePresentation(state).backgroundId,"day9-office-project-room-day");
assert.deepEqual(applyLockedDay10ChoiceState(state,"work10_lunch_current_roles"),{stage:2});assert.equal(getLockedDay10ResumePresentation(state).backgroundId,"neighborhood-cafe-day");
assert.deepEqual(applyLockedDay10ChoiceState(state,"work10_debrief_separate_scores"),{stage:3});assert.equal(state.storyFlags.day10ThreeHourWorkRhythmCompleted,true);assert.equal(state.storyFlags.day11CurrentLifePlanPending,true);
assert.ok(state.scenario.unlockedActions.includes("three-hour-work-rhythm"));assert.ok(state.scenario.unlockedActions.includes("current-coworker-lunch-record"));assert.ok(state.scenario.unlockedActions.includes("separate-work-recovery-social"));assert.ok(state.scenario.clues.includes("three-hour-work-rhythm-record"));
const restored=structuredClone(state);assert.equal(restored.storyFlags.day10RuntimeStage,3);assert.equal(getLockedDay10Segment(restored).at(-1).type,"sceneEnd");
console.log("✓ DAY 10 잠금 스토리·3단계 선택·후속 해금·저장 복원 PASS");
