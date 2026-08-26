import assert from "node:assert/strict";
import { createInitialState } from "../src/game-core.mjs";
import { createGirlfriendFromProfile } from "../src/girlfriend-manager.mjs";
import { GAME_MODES } from "../src/scenario-state.mjs";
import { selectNextStoryScene } from "../src/story-manager.mjs";
import { SaveManager } from "../src/save-manager.mjs";
import {
  DAY11_ANCHOR_CHOICES,DAY11_CONFLICT_CHOICES,DAY11_SHARE_CHOICES,
  applyLockedDay11ChoiceState,getLockedDay11ResumePresentation,getLockedDay11Segment,validateLockedDay11Runtime
} from "../src/day11-campaign-runtime.mjs";
import { DAY11_PRESENTATION_SCENES } from "../src/day11-presentation-data.mjs";

function makeState(){
  const state=createInitialState(createGirlfriendFromProfile("haeun",()=>.5),()=>.5,{mode:GAME_MODES.MARRIAGE_30});
  state.day=11;
  state.storyHistory=[{sceneId:"m30-day10-three-hour-work-rhythm",choiceId:"work10_debrief_separate_scores",day:10,response:"완료"}];
  state.storyFlags={day11CurrentLifePlanPending:true,day10RhythmStrategy:"work10_rhythm_fixed_blocks",day10LunchStrategy:"work10_lunch_current_roles",day10DebriefStrategy:"work10_debrief_separate_scores"};
  state.affection=36;state.trust=34;state.scenario.seojinAffection=7;state.scenario.seojinStatusInterest=13;
  return state;
}
const storage=()=>{const data=new Map();return {getItem:key=>data.get(key)??null,setItem:(key,value)=>data.set(key,value),removeItem:key=>data.delete(key)};};
const roundTrip=state=>{const store=storage();SaveManager.save(state,store);return SaveManager.load(store,GAME_MODES.MARRIAGE_30);};

assert.equal(selectNextStoryScene(makeState())?.id,"m30-day11-current-life-plan");
assert.equal(validateLockedDay11Runtime(),true);
const expectedBackgrounds=new Set(Object.values(DAY11_PRESENTATION_SCENES).map(scene=>scene.backgroundId));
const expectedSfx=new Set(Object.values(DAY11_PRESENTATION_SCENES).flatMap(scene=>scene.sfx));
let pathCount=0;

for(const anchor of DAY11_ANCHOR_CHOICES)for(const conflict of DAY11_CONFLICT_CHOICES)for(const share of DAY11_SHARE_CHOICES){
  let state=makeState();
  const protectedState={affection:state.affection,trust:state.trust,seojinAffection:state.scenario.seojinAffection,seojinStatusInterest:state.scenario.seojinStatusInterest,day10RhythmStrategy:state.storyFlags.day10RhythmStrategy,day10LunchStrategy:state.storyFlags.day10LunchStrategy,day10DebriefStrategy:state.storyFlags.day10DebriefStrategy};
  const allSteps=[];
  const stage0=getLockedDay11Segment(state,0);allSteps.push(...stage0);
  assert.equal(stage0.filter(step=>step.type==="choice").length,1);
  assert.ok(JSON.stringify(stage0).includes("목요일 재활"));assert.ok(JSON.stringify(stage0).includes("금요일 외래"));
  assert.deepEqual(applyLockedDay11ChoiceState(state,anchor.id),{stage:1});
  state=roundTrip(state);assert.ok(state);assert.equal(state.storyFlags.day11RuntimeStage,1);
  assert.equal(state.storyFlags.day11ScheduleNoteMismatch,"unverified");assert.ok(state.scenario.clues.includes("day11-schedule-note-mismatch"));
  assert.equal(getLockedDay11ResumePresentation(state).backgroundId,"neighborhood-street-day");
  const stage1=getLockedDay11Segment(state,1);allSteps.push(...stage1);
  assert.deepEqual(applyLockedDay11ChoiceState(state,conflict.id),{stage:2});
  state=roundTrip(state);assert.ok(state);assert.equal(state.storyFlags.day11RuntimeStage,2);
  assert.equal(getLockedDay11ResumePresentation(state).backgroundId,"neighborhood-park-day");
  const stage2=getLockedDay11Segment(state,2);allSteps.push(...stage2);
  assert.deepEqual(applyLockedDay11ChoiceState(state,share.id),{stage:3});
  state=roundTrip(state);assert.ok(state);assert.equal(state.storyFlags.day11RuntimeStage,3);
  assert.equal(state.storyFlags.day11CurrentLifePlanCompleted,true);assert.equal(state.storyFlags.day12CurrentAccountReviewPending,true);
  assert.deepEqual({affection:state.affection,trust:state.trust,seojinAffection:state.scenario.seojinAffection,seojinStatusInterest:state.scenario.seojinStatusInterest,day10RhythmStrategy:state.storyFlags.day10RhythmStrategy,day10LunchStrategy:state.storyFlags.day10LunchStrategy,day10DebriefStrategy:state.storyFlags.day10DebriefStrategy},protectedState);
  const stage3=getLockedDay11Segment(state,3);allSteps.push(...stage3);assert.equal(stage3.at(-1).type,"sceneEnd");
  assert.equal(getLockedDay11ResumePresentation(state).characterId,"girlfriend");
  for(const backgroundId of expectedBackgrounds)assert.ok(allSteps.some(step=>step.type==="transition"&&step.backgroundId===backgroundId),`배경 연결 누락: ${backgroundId}`);
  const usedSfx=new Set(allSteps.filter(step=>step.type==="sfx").map(step=>step.sfxId));for(const id of expectedSfx)assert.ok(usedSfx.has(id),`SFX 연결 누락: ${id}`);
  assert.ok(allSteps.filter(step=>step.type==="transition").every(step=>step.bgmId==="daily"));
  for(const id of ["current-week-anchor","schedule-conflict-rule","shared-calendar-boundary","protected-buffer-time"])assert.ok(state.scenario.unlockedActions.includes(id),id);
  for(const id of ["day11-schedule-note-mismatch","current-week-plan-record"])assert.ok(state.scenario.clues.includes(id),id);
  assert.ok(state.scenario.followUpHooks.includes("day12-current-account-review"));
  for(const key of ["clues","unlockedActions","followUpHooks"])assert.equal(new Set(state.scenario[key]).size,state.scenario[key].length,`${key} 중복`);
  pathCount+=1;
}
assert.equal(pathCount,27);

for(const [flag,id,phrase,stage] of [
  ["day10RhythmStrategy","work10_rhythm_fixed_blocks","45분 업무·10분 휴식·45분 업무",0],
  ["day10RhythmStrategy","work10_rhythm_symptom_check","증상·집중도 확인표",0],
  ["day10RhythmStrategy","work10_rhythm_task_milestones","되돌릴 수 있는 세 작업",0],
  ["day10LunchStrategy","work10_lunch_current_roles","현재 역할과 최근 바뀐 일",1],
  ["day10LunchStrategy","work10_lunch_one_question_each","서로 다른 질문 하나씩",1],
  ["day10LunchStrategy","work10_lunch_quiet_recovery","식사·복약·조용한 휴식",1],
  ["day10DebriefStrategy","work10_debrief_keep_rhythm","확대 없이 다음 주 후보",3],
  ["day10DebriefStrategy","work10_debrief_adjust_one_block","한 블록만 줄이고",3],
  ["day10DebriefStrategy","work10_debrief_separate_scores","업무 결과·회복 상태·동료 관계",3]
]){
  const state=makeState();state.storyFlags[flag]=id;
  assert.ok(JSON.stringify(getLockedDay11Segment(state,stage)).includes(phrase),`${id} 콜백 누락`);
}

const completeText=JSON.stringify([0,1,2,3].flatMap(stage=>getLockedDay11Segment({...makeState(),storyFlags:{...makeState().storyFlags,day11AnchorStrategy:"life11_anchor_recovery",day11ConflictStrategy:"life11_conflict_owner_decides",day11ShareStrategy:"life11_share_changes_only"}},stage)));
for(const forbidden of ["가짜 하은","진짜 하은","사고는 고의","범인","하은의 거짓말","의미심장한 미소","묘한 표정"])assert.ok(!completeText.includes(forbidden),`조기 공개 금지: ${forbidden}`);
assert.ok(completeText.includes("변경됐을 수도 있고 다른 주 메모일 수도 있어"));
const freeState=createInitialState(createGirlfriendFromProfile("haeun",()=>.5),()=>.5,{mode:GAME_MODES.FREE_ROMANCE});freeState.day=11;freeState.storyFlags.day11CurrentLifePlanPending=true;
assert.notEqual(selectNextStoryScene(freeState)?.id,"m30-day11-current-life-plan");
console.log("✓ DAY 11 27개 선택 경로·SaveManager 단계 복원·ready 연출/SFX·DAY 10 9콜백·미확인 단서·스포일러 차단 PASS");
