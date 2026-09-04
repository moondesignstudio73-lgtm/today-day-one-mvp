import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createInitialState } from "../src/game-core.mjs";
import { createGirlfriendFromProfile } from "../src/girlfriend-manager.mjs";
import { GAME_MODES } from "../src/scenario-state.mjs";
import { SaveManager } from "../src/save-manager.mjs";
import { resolveStoryChoice,selectNextStoryScene } from "../src/story-manager.mjs";
import { DAY16_CONTACT_CHOICES,DAY16_MEETING_CHOICES,DAY16_SHARING_CHOICES,applyLockedDay16ChoiceState,getLockedDay16ResumePresentation,getLockedDay16Segment } from "../src/day16-campaign-runtime.mjs";

const storage=()=>{const values=new Map();return {getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)}};
const roundTrip=state=>{const store=storage();SaveManager.save(state,store);return SaveManager.load(store,GAME_MODES.MARRIAGE_30)};
const state=createInitialState(createGirlfriendFromProfile("haeun",()=>.5),()=>.5,{mode:GAME_MODES.MARRIAGE_30});
state.day=16;state.affection=48;state.trust=44;state.health=71;state.energy=66;state.stress=37;state.confidence=39;
state.scenario.haeunAffection=24;state.scenario.haeunTrust=33;state.scenario.seojinAffection=14;state.scenario.seojinStatusInterest=22;state.scenario.featureUnlocks={finance:true,shop:true};
state.storyHistory=[{sceneId:"m30-day15-current-leisure-date",choiceId:"leisure15_privacy_no_location",day:15,response:"완료"}];
state.storyFlags={day16CurrentSocialCirclePending:true,day15ActivityStrategy:"leisure15_activity_low_sensory",day15ChangeStrategy:"leisure15_change_end",day15PrivacyStrategy:"leisure15_privacy_no_location",day4ContactStrategy:"contact_written_proof",day4IdentityFocus:"identity_present_boundary",day4AccidentQuestion:"accident_last_verified_contact",day4SharingStrategy:"sharing_compare_then_disclose",day11ScheduleNoteMismatch:"unverified",day14PastPreferenceRecommendation:"unverified",day15LeisureReservationVisitLabel:"unverified"};
assert.equal(selectNextStoryScene(state)?.id,"m30-day16-current-social-circle");

const protectedState={seojinAffection:state.scenario.seojinAffection,seojinStatusInterest:state.scenario.seojinStatusInterest,day11:state.storyFlags.day11ScheduleNoteMismatch,day14:state.storyFlags.day14PastPreferenceRecommendation,day15:state.storyFlags.day15LeisureReservationVisitLabel,finance:state.scenario.featureUnlocks.finance,shop:state.scenario.featureUnlocks.shop,truth:state.scenario.truthRevealed,final:state.scenario.finalChoiceUnlocked,profiles:[...state.scenario.profileUnlocks]};
let current=state;
for(const [option,stage,background,character] of [[DAY16_CONTACT_CHOICES[1],1,"neighborhood-cafe-day","best-friend"],[DAY16_MEETING_CHOICES[2],2,"home-morning","girlfriend"],[DAY16_SHARING_CHOICES[2],3,"home-morning","girlfriend"]]){
  assert.deepEqual(applyLockedDay16ChoiceState(current,option.id),{stage});
  assert.deepEqual(applyLockedDay16ChoiceState(current,option.id),{stage});
  current=roundTrip(current);assert.ok(current);assert.equal(current.storyFlags.day16RuntimeStage,stage);const resume=getLockedDay16ResumePresentation(current);assert.equal(resume.backgroundId,background);assert.equal(resume.characterId,character);
}
assert.deepEqual({seojinAffection:current.scenario.seojinAffection,seojinStatusInterest:current.scenario.seojinStatusInterest,day11:current.storyFlags.day11ScheduleNoteMismatch,day14:current.storyFlags.day14PastPreferenceRecommendation,day15:current.storyFlags.day15LeisureReservationVisitLabel,finance:current.scenario.featureUnlocks.finance,shop:current.scenario.featureUnlocks.shop,truth:current.scenario.truthRevealed,final:current.scenario.finalChoiceUnlocked,profiles:current.scenario.profileUnlocks.filter(id=>id!=="jihun-current")},protectedState);
assert.equal(current.storyFlags.jihunWrittenIntroStored,true);assert.equal(current.storyFlags.friendGroupAccess,false);assert.equal(current.storyFlags.unconditionalExit,true);assert.equal(current.storyFlags.followupAutoPromise,false);assert.equal(current.storyFlags.thirdPartyShareConsent,"perPerson");assert.equal(current.storyFlags.statusBroadcast,false);
assert.equal(current.storyFlags.day16CurrentSocialCirclePending,false);assert.equal(current.storyFlags.day16CurrentSocialCircleCompleted,true);assert.equal(current.storyFlags.day17CurrentHealthRoutinePending,true);assert.equal(current.scenario.followUpHooks.filter(id=>id==="day17-current-health-routine").length,1);assert.equal(current.scenario.clues.filter(id=>id==="current-social-circle-record").length,1);assert.equal(current.scenario.introducedNpcIds.filter(id=>id==="best-friend").length,1);

const resolved=resolveStoryChoice(current,"m30-day16-current-social-circle",DAY16_SHARING_CHOICES[2].id);assert.ok(resolved);assert.equal(resolveStoryChoice(current,"m30-day16-current-social-circle",DAY16_SHARING_CHOICES[2].id),null);assert.equal(current.storyHistory.filter(record=>record.sceneId==="m30-day16-current-social-circle").length,1);
const final=roundTrip(current);final.day=17;assert.equal(selectNextStoryScene(final)?.id,"m30-day17-current-health-routine");

const legacy=createInitialState(createGirlfriendFromProfile("haeun",()=>.5),()=>.5,{mode:GAME_MODES.MARRIAGE_30});legacy.day=16;legacy.storyHistory=[{sceneId:"m30-day15-current-leisure-date",choiceId:"leisure15_privacy_private_note",day:15,response:"완료"}];legacy.storyFlags={day16CurrentSocialCirclePending:true};const migrated=roundTrip(legacy);assert.ok(migrated);assert.equal(migrated.storyFlags.day16RuntimeStage,undefined);assert.equal(getLockedDay16Segment(migrated).filter(step=>step.type==="choice").length,1);assert.equal(getLockedDay16ResumePresentation(migrated).backgroundId,"home-morning");
const free=createInitialState(createGirlfriendFromProfile("haeun",()=>.5),()=>.5,{mode:GAME_MODES.FREE_ROMANCE});free.day=16;free.storyHistory=[{sceneId:"m30-day15-current-leisure-date",choiceId:"leisure15_privacy_private_note",day:15,response:"완료"}];assert.notEqual(selectNextStoryScene(free)?.id,"m30-day16-current-social-circle");

const narrative={storyFlags:{day15ActivityStrategy:"leisure15_activity_low_sensory",day15ChangeStrategy:"leisure15_change_end",day15PrivacyStrategy:"leisure15_privacy_no_location",day4ContactStrategy:"contact_written_proof",day4IdentityFocus:"identity_present_boundary",day4AccidentQuestion:"accident_last_verified_contact",day4SharingStrategy:"sharing_compare_then_disclose",day16ContactStrategy:"social16_contact_written_intro",day16MeetingStrategy:"social16_meeting_exit_anytime",day16SharingStrategy:"social16_sharing_ask_each_person"}};
const playerText=[0,1,2,3].flatMap(stage=>getLockedDay16Segment(narrative,stage)).filter(step=>["dialogue","narration"].includes(step.type)).map(step=>step.text).join("\n");for(const forbidden of ["가짜 하은","진짜 하은","사고는 고의","범인","하은의 거짓말","의미심장한 미소","공기가 달라졌다"])assert.equal(playerText.includes(forbidden),false,`forbidden spoiler/trope: ${forbidden}`);
const gameSource=readFileSync(new URL("../game.js",import.meta.url),"utf8"),html=readFileSync(new URL("../index.html",import.meta.url),"utf8");assert.match(gameSource,/day16-campaign-runtime\.mjs\?v=2/);assert.match(html,/game\.js\?v=193/);
console.log("✓ DAY 15→16→17 도달·최종 선택 단일 기록·레거시 저장·스포일러/프로필/금융/윤서진 경계 회귀 PASS");
