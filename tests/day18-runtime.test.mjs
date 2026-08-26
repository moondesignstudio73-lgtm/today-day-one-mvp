import assert from "node:assert/strict";
import { createInitialState } from "../src/game-core.mjs";
import { createGirlfriendFromProfile } from "../src/girlfriend-manager.mjs";
import { GAME_MODES } from "../src/scenario-state.mjs";
import { selectNextStoryScene } from "../src/story-manager.mjs";
import { DAY18_ACCESS_CHOICES, DAY18_ROUTE_CHOICES, DAY18_STORAGE_CHOICES, applyLockedDay18ChoiceState, getLockedDay18ResumePresentation, getLockedDay18Segment, validateLockedDay18Runtime } from "../src/day18-campaign-runtime.mjs";

const state=createInitialState(createGirlfriendFromProfile("haeun",()=>.5),()=>.5,{mode:GAME_MODES.MARRIAGE_30});
state.day=18;state.storyHistory=[{sceneId:"m30-day17-current-health-routine",choiceId:"health17_data_private_summary",day:17,response:"완료"}];state.storyFlags={day18CurrentHomeSafetyPending:true};state.scenario.featureUnlocks={finance:true,shop:true};
assert.equal(selectNextStoryScene(state)?.id,"m30-day18-current-home-safety");assert.equal(validateLockedDay18Runtime(),true);assert.equal(getLockedDay18Segment(state).filter(step=>step.type==="choice").length,1);
assert.equal(applyLockedDay18ChoiceState(state,DAY18_ROUTE_CHOICES[0].id).stage,1);assert.equal(getLockedDay18ResumePresentation(state).backgroundId,"day2-bedroom");assert.equal(applyLockedDay18ChoiceState(state,DAY18_STORAGE_CHOICES[0].id).stage,2);assert.equal(applyLockedDay18ChoiceState(state,DAY18_ACCESS_CHOICES[0].id).stage,3);
assert.equal(state.storyFlags.day18CurrentHomeSafetyCompleted,true);assert.equal(state.storyFlags.day19CurrentSharedChorePending,true);assert.equal(state.scenario.featureUnlocks.investment,undefined);assert.ok(state.scenario.unlockedActions.includes("current-home-safety-route"));assert.ok(state.scenario.unlockedActions.includes("verified-home-storage"));assert.ok(state.scenario.unlockedActions.includes("bounded-emergency-access"));assert.ok(state.scenario.followUpHooks.includes("day19-current-shared-chore"));assert.ok(state.scenario.clues.includes("current-home-safety-record"));
const restored=structuredClone(state);assert.equal(restored.storyFlags.day18RuntimeStage,3);assert.equal(getLockedDay18Segment(restored).at(-1).type,"sceneEnd");
console.log("day18-runtime.test: all assertions passed");
