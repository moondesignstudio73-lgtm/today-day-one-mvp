import assert from "node:assert/strict";
import { createInitialState } from "../src/game-core.mjs";
import { createGirlfriendFromProfile } from "../src/girlfriend-manager.mjs";
import { GAME_MODES } from "../src/scenario-state.mjs";
import { selectNextStoryScene } from "../src/story-manager.mjs";
import { SaveManager } from "../src/save-manager.mjs";
import {
  DAY10_DEBRIEF_CHOICES, DAY10_LUNCH_CHOICES, DAY10_RHYTHM_CHOICES,
  applyLockedDay10ChoiceState, getLockedDay10ResumePresentation,
  getLockedDay10Segment, validateLockedDay10Runtime
} from "../src/day10-campaign-runtime.mjs";
import { DAY10_PRESENTATION_SCENES } from "../src/day10-presentation-data.mjs";

function makeState(){
  const state=createInitialState(createGirlfriendFromProfile("haeun",()=>.5),()=>.5,{mode:GAME_MODES.MARRIAGE_30});
  state.day=10;
  state.storyHistory=[{sceneId:"m30-day9-second-office-adaptation",choiceId:"office9_debrief_write_protocol",day:9,response:"완료"}];
  state.storyFlags={day10ThreeHourWorkRhythmPending:true,day9ScopeStrategy:"office9_scope_current_queue",day9PressureStrategy:"office9_pressure_route_questions",day9DebriefStrategy:"office9_debrief_write_protocol"};
  state.scenario.introducedNpcIds.push("female-coworker","team-lead","office-best-male");
  state.affection=31;state.trust=29;state.scenario.seojinAffection=7;state.scenario.seojinStatusInterest=13;
  return state;
}
const storage=()=>{const data=new Map();return {getItem:key=>data.get(key)??null,setItem:(key,value)=>data.set(key,value),removeItem:key=>data.delete(key)};};
const roundTrip=state=>{const store=storage();SaveManager.save(state,store);return SaveManager.load(store,GAME_MODES.MARRIAGE_30);};

assert.equal(selectNextStoryScene(makeState())?.id,"m30-day10-three-hour-work-rhythm");
assert.equal(validateLockedDay10Runtime(),true);
const expectedSceneBackgrounds=Object.values(DAY10_PRESENTATION_SCENES).map(scene=>scene.backgroundId);
const expectedSfx=new Set(Object.values(DAY10_PRESENTATION_SCENES).flatMap(scene=>scene.sfx));
let pathCount=0;

for(const rhythm of DAY10_RHYTHM_CHOICES)for(const lunch of DAY10_LUNCH_CHOICES)for(const debrief of DAY10_DEBRIEF_CHOICES){
  const state=makeState();
  const protectedMetrics={affection:state.affection,trust:state.trust,seojinAffection:state.scenario.seojinAffection,seojinStatusInterest:state.scenario.seojinStatusInterest};
  const allSteps=[];
  const stage0=getLockedDay10Segment(state,0);allSteps.push(...stage0);
  assert.equal(stage0.filter(step=>step.type==="choice").length,1);
  assert.deepEqual(applyLockedDay10ChoiceState(state,rhythm.id),{stage:1});
  let restored=roundTrip(state);assert.ok(restored);
  assert.equal(restored.storyFlags.day10RuntimeStage,1);
  assert.equal(getLockedDay10ResumePresentation(restored).characterId,rhythm.id==="work10_rhythm_task_milestones"?"female-coworker":"team-lead");

  const stage1=getLockedDay10Segment(restored,1);allSteps.push(...stage1);
  assert.ok(stage1.some(step=>step.text?.includes("현재 담당·마감·막힌 지점")),"DAY 9 범위 콜백이 유지되어야 한다");
  assert.ok(stage1.some(step=>step.characterId==="female-coworker"&&step.speaker==="윤서진"),"점심에서 윤서진 화자 컷이 연결되어야 한다");
  assert.deepEqual(applyLockedDay10ChoiceState(restored,lunch.id),{stage:2});
  restored=roundTrip(restored);assert.ok(restored);
  assert.equal(restored.storyFlags.day10RuntimeStage,2);
  assert.equal(getLockedDay10ResumePresentation(restored).characterId,lunch.id==="work10_lunch_one_question_each"?"office-best-male":"female-coworker");

  const stage2=getLockedDay10Segment(restored,2);allSteps.push(...stage2);
  assert.ok(stage2.some(step=>step.characterId==="team-lead"&&step.speaker==="팀장"),"마지막 블록에서 팀장 화자 컷이 연결되어야 한다");
  assert.deepEqual(applyLockedDay10ChoiceState(restored,debrief.id),{stage:3});
  restored=roundTrip(restored);assert.ok(restored);
  assert.equal(restored.storyFlags.day10RuntimeStage,3);
  assert.equal(restored.storyFlags.day10ThreeHourWorkRhythmCompleted,true);
  assert.equal(restored.storyFlags.day11CurrentLifePlanPending,true);
  assert.deepEqual({affection:restored.affection,trust:restored.trust,seojinAffection:restored.scenario.seojinAffection,seojinStatusInterest:restored.scenario.seojinStatusInterest},protectedMetrics,"DAY 10 선택은 관계 축을 임의 합산하거나 변경하지 않는다");

  const stage3=getLockedDay10Segment(restored,3);allSteps.push(...stage3);
  assert.equal(stage3.at(-1).type,"sceneEnd");
  assert.equal(getLockedDay10ResumePresentation(restored).characterId,"girlfriend");
  for(const backgroundId of expectedSceneBackgrounds)assert.ok(allSteps.some(step=>step.type==="transition"&&step.backgroundId===backgroundId),`필수 배경 ${backgroundId} 전환 누락`);
  const usedSfx=new Set(allSteps.filter(step=>step.type==="sfx").map(step=>step.sfxId));
  for(const sfxId of expectedSfx)assert.ok(usedSfx.has(sfxId),`필수 효과음 ${sfxId} 누락`);
  assert.ok(restored.scenario.unlockedActions.includes("three-hour-work-rhythm"));
  assert.ok(restored.scenario.unlockedActions.includes("current-coworker-lunch-record"));
  assert.ok(restored.scenario.unlockedActions.includes("separate-work-recovery-social"));
  assert.ok(restored.scenario.clues.includes("three-hour-work-rhythm-record"));
  assert.ok(restored.scenario.followUpHooks.includes("day11-current-life-plan"));
  pathCount+=1;
}

assert.equal(pathCount,27);

for(const [flag,id,phrase] of [
  ["day9ScopeStrategy","office9_scope_current_queue","현재 담당·마감·막힌 지점"],
  ["day9ScopeStrategy","office9_scope_shadow_handoff","실제 인계 한 건"],
  ["day9ScopeStrategy","office9_scope_compare_decisions","달라진 전제"],
  ["day9PressureStrategy","office9_pressure_route_questions","목적·근거·위험"],
  ["day9PressureStrategy","office9_pressure_observe_annotate","빠진 조건만 주석"],
  ["day9PressureStrategy","office9_pressure_reversible_task","되돌릴 수 있는 출처 확인"],
  ["day9DebriefStrategy","office9_debrief_name_limits","막힘과 불편"],
  ["day9DebriefStrategy","office9_debrief_write_protocol","자료 주인 확인"],
  ["day9DebriefStrategy","office9_debrief_targeted_feedback","업무 판단 한 가지"]
]){
  const callbackState=makeState();callbackState.storyFlags[flag]=id;
  assert.ok(JSON.stringify(getLockedDay10Segment(callbackState,1)).includes(phrase),`${id} 콜백 누락`);
}

const completeText=JSON.stringify([0,1,2,3].flatMap(stage=>getLockedDay10Segment({...makeState(),storyFlags:{...makeState().storyFlags,day10RhythmStrategy:"work10_rhythm_fixed_blocks",day10LunchStrategy:"work10_lunch_current_roles",day10DebriefStrategy:"work10_debrief_separate_scores"}},stage)));
for(const forbidden of ["가짜 하은","진짜 하은","사고는 고의","트럭 충돌","의미심장한 미소","묘한 표정","D-20","D-21"])assert.ok(!completeText.includes(forbidden),`DAY 10 조기 공개 금지: ${forbidden}`);

const freeState=createInitialState(createGirlfriendFromProfile("haeun",()=>.5),()=>.5,{mode:GAME_MODES.FREE_ROMANCE});freeState.day=10;freeState.storyFlags.day10ThreeHourWorkRhythmPending=true;
assert.notEqual(selectNextStoryScene(freeState)?.id,"m30-day10-three-hour-work-rhythm");
console.log("✓ DAY 10 27개 선택 경로·실제 SaveManager 복원·DAY 9 9콜백·스포일러 차단·화자 연출 PASS");
