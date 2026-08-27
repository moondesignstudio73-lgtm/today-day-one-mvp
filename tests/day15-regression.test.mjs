import assert from "node:assert/strict";
import { createInitialState } from "../src/game-core.mjs";
import { createGirlfriendFromProfile } from "../src/girlfriend-manager.mjs";
import { GAME_MODES } from "../src/scenario-state.mjs";
import { SaveManager } from "../src/save-manager.mjs";
import { resolveStoryChoice,selectNextStoryScene } from "../src/story-manager.mjs";
import { DAY15_ACTIVITY_CHOICES,DAY15_CHANGE_CHOICES,DAY15_PRIVACY_CHOICES,applyLockedDay15ChoiceState,getLockedDay15ResumePresentation,getLockedDay15Segment } from "../src/day15-campaign-runtime.mjs";

const storage=()=>{const values=new Map();return {getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)}};
const state=createInitialState(createGirlfriendFromProfile("haeun",()=>.5),()=>.5,{mode:GAME_MODES.MARRIAGE_30});
state.day=15;state.affection=47;state.trust=43;state.health=72;state.energy=68;state.stress=38;state.confidence=37;
state.scenario.haeunAffection=22;state.scenario.haeunTrust=31;state.scenario.seojinAffection=13;state.scenario.seojinStatusInterest=21;state.scenario.featureUnlocks={finance:true,shop:true};
state.storyHistory=[{sceneId:"m30-day14-current-choice-spending",choiceId:"spend14_consent_no_surprise",day:14,response:"완료"}];
state.storyFlags={day15CurrentLeisureDatePending:true,day11ScheduleNoteMismatch:"unverified",day14PastPreferenceRecommendation:"unverified",day14LaneStrategy:"spend14_lane_personal",day14PurchaseStrategy:"spend14_purchase_wait_compare",day14ConsentStrategy:"spend14_consent_no_surprise"};
assert.equal(selectNextStoryScene(state)?.id,"m30-day15-current-leisure-date");

const protectedState={seojinAffection:state.scenario.seojinAffection,seojinStatusInterest:state.scenario.seojinStatusInterest,day11:state.storyFlags.day11ScheduleNoteMismatch,day14:state.storyFlags.day14PastPreferenceRecommendation,lane:state.storyFlags.day14LaneStrategy,purchase:state.storyFlags.day14PurchaseStrategy,consent:state.storyFlags.day14ConsentStrategy,finance:state.scenario.featureUnlocks.finance,shop:state.scenario.featureUnlocks.shop,truth:state.scenario.truthRevealed,final:state.scenario.finalChoiceUnlocked,profiles:[...state.scenario.profileUnlocks]};
for(const [choice,stage,background] of [[DAY15_ACTIVITY_CHOICES[2],1,"day7-bookshop-day"],[DAY15_CHANGE_CHOICES[1],2,"neighborhood-cafe-day"],[DAY15_PRIVACY_CHOICES[2],3,"neighborhood-cafe-day"]]){
  assert.deepEqual(applyLockedDay15ChoiceState(state,choice.id),{stage});
  const store=storage();SaveManager.save(state,store);const restored=SaveManager.load(store,GAME_MODES.MARRIAGE_30);assert.ok(restored);Object.assign(state,restored);
  assert.equal(state.storyFlags.day15RuntimeStage,stage);assert.equal(getLockedDay15ResumePresentation(state).backgroundId,background);
}
assert.deepEqual({seojinAffection:state.scenario.seojinAffection,seojinStatusInterest:state.scenario.seojinStatusInterest,day11:state.storyFlags.day11ScheduleNoteMismatch,day14:state.storyFlags.day14PastPreferenceRecommendation,lane:state.storyFlags.day14LaneStrategy,purchase:state.storyFlags.day14PurchaseStrategy,consent:state.storyFlags.day14ConsentStrategy,finance:state.scenario.featureUnlocks.finance,shop:state.scenario.featureUnlocks.shop,truth:state.scenario.truthRevealed,final:state.scenario.finalChoiceUnlocked,profiles:state.scenario.profileUnlocks},protectedState);
assert.equal(state.storyFlags.day15LeisureReservationVisitLabel,"unverified");assert.equal(state.storyFlags.day15CurrentLeisureDatePending,false);assert.equal(state.storyFlags.day15CurrentLeisureDateCompleted,true);assert.equal(state.storyFlags.day15CurrentLeisureMemory,true);assert.equal(state.storyFlags.day15PrivateDateRecord,true);assert.equal(state.storyFlags.day16CurrentSocialCirclePending,true);
assert.deepEqual(state.scenario.clues.filter(id=>id.includes("leisure")),["leisure-reservation-label-mismatch","current-leisure-date-record"]);assert.deepEqual(state.scenario.unlockedActions.filter(id=>["current-leisure-date","date-change-boundary","private-date-record"].includes(id)),["current-leisure-date","date-change-boundary","private-date-record"]);assert.equal(state.scenario.followUpHooks.filter(id=>id==="day16-current-social-circle").length,1);

const resolved=resolveStoryChoice(state,"m30-day15-current-leisure-date",DAY15_PRIVACY_CHOICES[2].id);assert.ok(resolved);assert.equal(resolveStoryChoice(state,"m30-day15-current-leisure-date",DAY15_PRIVACY_CHOICES[2].id),null);assert.equal(state.storyHistory.filter(record=>record.sceneId==="m30-day15-current-leisure-date").length,1);
const finalStore=storage();SaveManager.save(state,finalStore);const final=SaveManager.load(finalStore,GAME_MODES.MARRIAGE_30);assert.ok(final);final.day=16;assert.equal(selectNextStoryScene(final)?.id,"m30-day16-current-social-circle");

const legacy=createInitialState(createGirlfriendFromProfile("haeun",()=>.5),()=>.5,{mode:GAME_MODES.MARRIAGE_30});legacy.day=15;legacy.storyHistory=[{sceneId:"m30-day14-current-choice-spending",choiceId:"spend14_consent_ask_first",day:14,response:"완료"}];legacy.storyFlags={day15CurrentLeisureDatePending:true};const legacyStore=storage();SaveManager.save(legacy,legacyStore);const migrated=SaveManager.load(legacyStore,GAME_MODES.MARRIAGE_30);assert.ok(migrated);assert.equal(migrated.storyFlags.day15ActivityStrategy,undefined);assert.equal(migrated.storyFlags.day15RuntimeStage,undefined);assert.equal(getLockedDay15Segment(migrated).filter(step=>step.type==="choice").length,1);assert.equal(getLockedDay15ResumePresentation(migrated).backgroundId,"home-morning");

const free=createInitialState(createGirlfriendFromProfile("haeun",()=>.5),()=>.5,{mode:GAME_MODES.FREE_ROMANCE});free.day=15;free.storyHistory=[{sceneId:"m30-day14-current-choice-spending",choiceId:"spend14_consent_ask_first",day:14,response:"완료"}];assert.notEqual(selectNextStoryScene(free)?.id,"m30-day15-current-leisure-date");
const narrativeState={storyFlags:{day14LaneStrategy:"spend14_lane_personal",day14PurchaseStrategy:"spend14_purchase_wait_compare",day14ConsentStrategy:"spend14_consent_no_surprise",day15ActivityStrategy:"leisure15_activity_low_sensory",day15ChangeStrategy:"leisure15_change_switch",day15PrivacyStrategy:"leisure15_privacy_no_location"}};
const playerText=[0,1,2,3].flatMap(stage=>getLockedDay15Segment(narrativeState,stage)).filter(step=>["dialogue","narration"].includes(step.type)).map(step=>step.text).join("\n");
for(const forbidden of ["가짜 하은","진짜 하은","사고는 고의","범인","하은의 거짓말","의미심장한 미소","공기가 달라졌다"])assert.equal(playerText.includes(forbidden),false,`forbidden spoiler/trope: ${forbidden}`);

console.log("✓ DAY 14→15→16 도달·최종 선택 단일 기록·레거시 저장·스포일러/프로필/금융/윤서진 경계 회귀 PASS");
