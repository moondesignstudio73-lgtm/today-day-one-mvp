import assert from "node:assert/strict";
import { createInitialState } from "../src/game-core.mjs";
import { createGirlfriendFromProfile } from "../src/girlfriend-manager.mjs";
import { GAME_MODES } from "../src/scenario-state.mjs";
import { selectNextStoryScene } from "../src/story-manager.mjs";
import { applyLockedDay16ChoiceState, getLockedDay16ResumePresentation, getLockedDay16Segment, validateLockedDay16Runtime } from "../src/day16-campaign-runtime.mjs";

const state=createInitialState(createGirlfriendFromProfile("haeun",()=>.5),()=>.5,{mode:GAME_MODES.MARRIAGE_30});state.day=16;state.storyHistory=[{sceneId:"m30-day15-current-leisure-date",choiceId:"leisure15_privacy_private_note",day:15,response:"완료"}];state.storyFlags={day16CurrentSocialCirclePending:true};state.scenario.featureUnlocks={finance:true,shop:true};
assert.equal(selectNextStoryScene(state)?.id,"m30-day16-current-social-circle");assert.equal(validateLockedDay16Runtime(),true);assert.equal(getLockedDay16Segment(state).filter(step=>step.type==="choice").length,1);
assert.deepEqual(applyLockedDay16ChoiceState(state,"social16_contact_one_to_one"),{stage:1});assert.equal(getLockedDay16ResumePresentation(state).characterId,"best-friend");assert.deepEqual(applyLockedDay16ChoiceState(state,"social16_meeting_public_45"),{stage:2});assert.equal(getLockedDay16ResumePresentation(state).backgroundId,"neighborhood-cafe-day");assert.deepEqual(applyLockedDay16ChoiceState(state,"social16_sharing_current_notes"),{stage:3});
assert.equal(state.storyFlags.day16CurrentSocialCircleCompleted,true);assert.equal(state.storyFlags.day17CurrentHealthRoutinePending,true);assert.equal(state.scenario.featureUnlocks.investment,undefined);assert.ok(state.scenario.unlockedActions.includes("current-social-circle"));assert.ok(state.scenario.unlockedActions.includes("best-friend-current-contact"));assert.ok(state.scenario.unlockedActions.includes("friend-group-consent"));assert.ok(state.scenario.introducedNpcIds.includes("best-friend"));assert.ok(state.scenario.profileUnlocks.includes("jihun-current"));
const restored=structuredClone(state);assert.equal(restored.storyFlags.day16RuntimeStage,3);assert.equal(getLockedDay16Segment(restored).at(-1).type,"sceneEnd");
console.log("✓ DAY 16 잠금 스토리·3단계 선택·현재 관계망/지훈 소개·저장 복원 PASS");
