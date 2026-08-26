import assert from "node:assert/strict";
import { createInitialState } from "../src/game-core.mjs";
import { createGirlfriendFromProfile } from "../src/girlfriend-manager.mjs";
import { GAME_MODES } from "../src/scenario-state.mjs";
import { selectNextStoryScene } from "../src/story-manager.mjs";
import { applyLockedDay17ChoiceState, getLockedDay17ResumePresentation, getLockedDay17Segment, validateLockedDay17Runtime } from "../src/day17-campaign-runtime.mjs";

const state=createInitialState(createGirlfriendFromProfile("haeun",()=>.5),()=>.5,{mode:GAME_MODES.MARRIAGE_30});state.day=17;state.storyHistory=[{sceneId:"m30-day16-current-social-circle",choiceId:"social16_sharing_current_notes",day:16,response:"완료"}];state.storyFlags={day17CurrentHealthRoutinePending:true};state.scenario.featureUnlocks={finance:true,shop:true};
assert.equal(selectNextStoryScene(state)?.id,"m30-day17-current-health-routine");assert.equal(validateLockedDay17Runtime(),true);assert.equal(getLockedDay17Segment(state).filter(step=>step.type==="choice").length,1);
assert.deepEqual(applyLockedDay17ChoiceState(state,"health17_source_prescription"),{stage:1});assert.equal(getLockedDay17ResumePresentation(state).characterId,"hospital-nurse");assert.deepEqual(applyLockedDay17ChoiceState(state,"health17_routine_three_anchors"),{stage:2});assert.equal(getLockedDay17ResumePresentation(state).backgroundId,"neighborhood-pharmacy-day");assert.deepEqual(applyLockedDay17ChoiceState(state,"health17_data_private_summary"),{stage:3});
assert.equal(state.storyFlags.day17CurrentHealthRoutineCompleted,true);assert.equal(state.storyFlags.day18CurrentHomeSafetyPending,true);assert.equal(state.scenario.featureUnlocks.investment,undefined);assert.ok(state.scenario.unlockedActions.includes("verified-current-prescription"));assert.ok(state.scenario.unlockedActions.includes("current-health-routine"));assert.ok(state.scenario.unlockedActions.includes("health-data-boundary"));assert.ok(state.scenario.introducedNpcIds.includes("hospital-nurse"));assert.ok(state.scenario.profileUnlocks.includes("hyewon-current"));const nurse=state.npcs.find(npc=>npc.id==="hospital-nurse");assert.equal(nurse.active,true);assert.equal(nurse.storyState,"introduced");
const restored=structuredClone(state);assert.equal(restored.storyFlags.day17RuntimeStage,3);assert.equal(getLockedDay17Segment(restored).at(-1).type,"sceneEnd");
console.log("✓ DAY 17 잠금 스토리·3단계 선택·현재 건강 루틴/혜원 소개·저장 복원 PASS");
