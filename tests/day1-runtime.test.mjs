import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { createInitialState } from "../src/game-core.mjs";
import { createGirlfriendFromProfile } from "../src/girlfriend-manager.mjs";
import { SaveManager } from "../src/save-manager.mjs";
import { GAME_MODES } from "../src/scenario-state.mjs";
import { getStoryScene, resolveStoryChoice, selectNextStoryScene } from "../src/story-manager.mjs";
import { DAY1_CONTACT_CHOICES, DAY1_QUESTION_CHOICES, LOCKED_DAY1_SCENE_ID, applyLockedDay1ChoiceState, getLockedDay1Segment, validateLockedDay1Runtime } from "../src/day1-campaign-runtime.mjs";

const storage=()=>{const values=new Map();return {getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)}};
const create=()=>createInitialState(createGirlfriendFromProfile("haeun",()=>0.5),()=>0.5,{mode:GAME_MODES.MARRIAGE_30});

assert.equal(validateLockedDay1Runtime(),true);
assert.equal(DAY1_CONTACT_CHOICES.length,3);
assert.equal(DAY1_QUESTION_CHOICES.length,3);

for(const [contact,legacy] of [["contact_boundary","set-boundary"],["contact_acceptance","accept-support"],["identity_first","controlled-help"]]){
  for(const question of DAY1_QUESTION_CHOICES.map(choice=>choice.id)){
    const state=create();
    const scene=selectNextStoryScene(state);
    assert.equal(scene.id,LOCKED_DAY1_SCENE_ID);
    const first=getLockedDay1Segment(state,0);
    assert.deepEqual(first.at(-1).options.map(choice=>choice.id),DAY1_CONTACT_CHOICES.map(choice=>choice.id));
    assert.equal(applyLockedDay1ChoiceState(state,contact).legacyChoiceId,legacy);
    const middle=getLockedDay1Segment(state,1);
    assert.deepEqual(middle.at(-1).options.map(choice=>choice.id),DAY1_QUESTION_CHOICES.map(choice=>choice.id));
    const resolution=applyLockedDay1ChoiceState(state,question);
    assert.equal(resolution.legacyChoiceId,legacy);
    assert.ok(resolveStoryChoice(state,scene.id,resolution.legacyChoiceId));
    const ending=getLockedDay1Segment(state,2);
    assert.equal(ending.at(-1).type,"sceneEnd");
    assert.ok(ending.some(step=>step.type==="cgShow"&&step.source.includes("thirty-day-resolve")));
    assert.equal(state.storyFlags.day1ContactStrategy,contact);
    assert.equal(state.storyFlags.day1QuestionStrategy,question);
    assert.equal(state.storyHistory[0].choiceId,legacy);
    assert.equal(selectNextStoryScene(state),null);
    const store=storage();SaveManager.save(state,store);const loaded=SaveManager.load(store);
    assert.equal(loaded.storyFlags.day1ContactStrategy,contact);
    assert.equal(loaded.storyFlags.day1QuestionStrategy,question);
  }
}

const assetState=create();applyLockedDay1ChoiceState(assetState,"contact_boundary");applyLockedDay1ChoiceState(assetState,"family_question_first");
const all=[...getLockedDay1Segment(assetState,0),...getLockedDay1Segment(assetState,1),...getLockedDay1Segment(assetState,2)];
for(const step of all){if(step.source)assert.equal(existsSync(new URL(`../${step.source}`,import.meta.url)),true,step.source);if(step.assetUrl)assert.equal(existsSync(new URL(`../${step.assetUrl}`,import.meta.url)),true,step.assetUrl);}
assert.ok(all.filter(step=>step.type==="dialogue").length>=60);
assert.equal(getStoryScene(LOCKED_DAY1_SCENE_ID).window[0],1);

console.log("✓ DAY 1 잠금 시나리오 3×3 선택, 콜백, 저장 복원, 에셋 연결 검증 통과");
