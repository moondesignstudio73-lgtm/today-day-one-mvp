import assert from "node:assert/strict";
import { createInitialState } from "../src/game-core.mjs";
import { createGirlfriendFromProfile } from "../src/girlfriend-manager.mjs";
import { GAME_MODES } from "../src/scenario-state.mjs";
import { SaveManager } from "../src/save-manager.mjs";
import { resolveStoryChoice,selectNextStoryScene } from "../src/story-manager.mjs";
import { DAY14_LANE_CHOICES,DAY14_PURCHASE_CHOICES,DAY14_CONSENT_CHOICES,applyLockedDay14ChoiceState,getLockedDay14ResumePresentation,getLockedDay14Segment } from "../src/day14-campaign-runtime.mjs";

const storage=()=>{const values=new Map();return {getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)}};
const state=createInitialState(createGirlfriendFromProfile("haeun",()=>.5),()=>.5,{mode:GAME_MODES.MARRIAGE_30});
state.day=14;state.affection=42;state.trust=39;state.scenario.seojinAffection=11;state.scenario.seojinStatusInterest=18;state.scenario.featureUnlocks={finance:true};
state.storyHistory=[{sceneId:"m30-day13-current-household-budget",choiceId:"budget13_review_weekly_changes",day:13,response:"완료"}];
state.storyFlags={day14CurrentChoiceSpendingPending:true,day11ScheduleNoteMismatch:"unverified",day13BaseStrategy:"budget13_base_protected_buffer",day13ContributionStrategy:"budget13_contribution_capacity_review",day13ReviewStrategy:"budget13_review_weekly_changes"};
assert.equal(selectNextStoryScene(state)?.id,"m30-day14-current-choice-spending");

const protectedState={affection:state.affection,trust:state.trust,seojinAffection:state.scenario.seojinAffection,seojinStatusInterest:state.scenario.seojinStatusInterest,day11:state.storyFlags.day11ScheduleNoteMismatch,base:state.storyFlags.day13BaseStrategy,contribution:state.storyFlags.day13ContributionStrategy,review:state.storyFlags.day13ReviewStrategy};
for(const [choice,stage,background] of [[DAY14_LANE_CHOICES[2],1,"day8-household-store-day"],[DAY14_PURCHASE_CHOICES[1],2,"neighborhood-cafe-day"],[DAY14_CONSENT_CHOICES[2],3,"home-morning"]]){
  assert.deepEqual(applyLockedDay14ChoiceState(state,choice.id),{stage});
  const store=storage();SaveManager.save(state,store);const restored=SaveManager.load(store,GAME_MODES.MARRIAGE_30);assert.ok(restored);Object.assign(state,restored);
  assert.equal(state.storyFlags.day14RuntimeStage,stage);assert.equal(getLockedDay14ResumePresentation(state).backgroundId,background);
}
assert.deepEqual({affection:state.affection,trust:state.trust,seojinAffection:state.scenario.seojinAffection,seojinStatusInterest:state.scenario.seojinStatusInterest,day11:state.storyFlags.day11ScheduleNoteMismatch,base:state.storyFlags.day13BaseStrategy,contribution:state.storyFlags.day13ContributionStrategy,review:state.storyFlags.day13ReviewStrategy},protectedState);
assert.equal(state.storyFlags.day14PastPreferenceRecommendation,"unverified");assert.equal(state.scenario.truthRevealed,false);assert.equal(state.scenario.finalChoiceUnlocked,false);assert.deepEqual(state.scenario.profileUnlocks,[]);
assert.equal(state.scenario.featureUnlocks.finance,true);assert.equal(state.scenario.featureUnlocks.shop,true);assert.equal(state.scenario.featureUnlocks.investment,undefined);

const resolved=resolveStoryChoice(state,"m30-day14-current-choice-spending",DAY14_CONSENT_CHOICES[2].id);assert.ok(resolved);assert.equal(resolveStoryChoice(state,"m30-day14-current-choice-spending",DAY14_CONSENT_CHOICES[2].id),null);assert.equal(state.storyHistory.filter(record=>record.sceneId==="m30-day14-current-choice-spending").length,1);
const finalStore=storage();SaveManager.save(state,finalStore);const final=SaveManager.load(finalStore,GAME_MODES.MARRIAGE_30);assert.ok(final);final.day=15;assert.equal(selectNextStoryScene(final)?.id,"m30-day15-current-leisure-date");

const legacy=createInitialState(createGirlfriendFromProfile("haeun",()=>.5),()=>.5,{mode:GAME_MODES.MARRIAGE_30});legacy.day=14;legacy.storyHistory=[{sceneId:"m30-day13-current-household-budget",choiceId:"budget13_review_totals_only",day:13,response:"완료"}];legacy.storyFlags={day14CurrentChoiceSpendingPending:true};const legacyStore=storage();SaveManager.save(legacy,legacyStore);const migrated=SaveManager.load(legacyStore,GAME_MODES.MARRIAGE_30);assert.ok(migrated);assert.equal(migrated.storyFlags.day14LaneStrategy,undefined);assert.equal(migrated.storyFlags.day14RuntimeStage,undefined);assert.equal(getLockedDay14Segment(migrated).filter(step=>step.type==="choice").length,1);assert.equal(getLockedDay14ResumePresentation(migrated).backgroundId,"home-morning");

console.log("✓ DAY 13→14→15 도달·최종 선택 기록·레거시 저장·프로필/금융/윤서진 경계 회귀 PASS");
