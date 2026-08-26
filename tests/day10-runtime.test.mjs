import assert from "node:assert/strict";
import { createInitialState } from "../src/game-core.mjs";
import { createGirlfriendFromProfile } from "../src/girlfriend-manager.mjs";
import { GAME_MODES } from "../src/scenario-state.mjs";
import { selectNextStoryScene } from "../src/story-manager.mjs";
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
  state.affection=31;state.trust=29;state.seojinAffection=7;state.seojinStatusInterest=13;
  return state;
}

assert.equal(selectNextStoryScene(makeState())?.id,"m30-day10-three-hour-work-rhythm");
assert.equal(validateLockedDay10Runtime(),true);
const expectedSceneBackgrounds=Object.values(DAY10_PRESENTATION_SCENES).map(scene=>scene.backgroundId);
const expectedSfx=new Set(Object.values(DAY10_PRESENTATION_SCENES).flatMap(scene=>scene.sfx));
let pathCount=0;

for(const rhythm of DAY10_RHYTHM_CHOICES)for(const lunch of DAY10_LUNCH_CHOICES)for(const debrief of DAY10_DEBRIEF_CHOICES){
  const state=makeState();
  const protectedMetrics={affection:state.affection,trust:state.trust,seojinAffection:state.seojinAffection,seojinStatusInterest:state.seojinStatusInterest};
  const allSteps=[];
  const stage0=getLockedDay10Segment(state,0);allSteps.push(...stage0);
  assert.equal(stage0.filter(step=>step.type==="choice").length,1);
  assert.deepEqual(applyLockedDay10ChoiceState(state,rhythm.id),{stage:1});
  let restored=JSON.parse(JSON.stringify(state));
  assert.equal(restored.storyFlags.day10RuntimeStage,1);
  assert.equal(getLockedDay10ResumePresentation(restored).characterId,rhythm.id==="work10_rhythm_task_milestones"?"female-coworker":"team-lead");

  const stage1=getLockedDay10Segment(restored,1);allSteps.push(...stage1);
  assert.ok(stage1.some(step=>step.text?.includes("현재 담당·마감·막힌 지점")),"DAY 9 범위 콜백이 유지되어야 한다");
  assert.ok(stage1.some(step=>step.characterId==="female-coworker"&&step.speaker==="윤서진"),"점심에서 윤서진 화자 컷이 연결되어야 한다");
  assert.deepEqual(applyLockedDay10ChoiceState(restored,lunch.id),{stage:2});
  restored=JSON.parse(JSON.stringify(restored));
  assert.equal(restored.storyFlags.day10RuntimeStage,2);
  assert.equal(getLockedDay10ResumePresentation(restored).characterId,lunch.id==="work10_lunch_one_question_each"?"office-best-male":"female-coworker");

  const stage2=getLockedDay10Segment(restored,2);allSteps.push(...stage2);
  assert.ok(stage2.some(step=>step.characterId==="team-lead"&&step.speaker==="팀장"),"마지막 블록에서 팀장 화자 컷이 연결되어야 한다");
  assert.deepEqual(applyLockedDay10ChoiceState(restored,debrief.id),{stage:3});
  restored=JSON.parse(JSON.stringify(restored));
  assert.equal(restored.storyFlags.day10RuntimeStage,3);
  assert.equal(restored.storyFlags.day10ThreeHourWorkRhythmCompleted,true);
  assert.equal(restored.storyFlags.day11CurrentLifePlanPending,true);
  assert.deepEqual({affection:restored.affection,trust:restored.trust,seojinAffection:restored.seojinAffection,seojinStatusInterest:restored.seojinStatusInterest},protectedMetrics,"DAY 10 선택은 관계 축을 임의 합산하거나 변경하지 않는다");

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
console.log("✓ DAY 10 27개 선택 경로·화자 연출·효과음·저장 복원 PASS");
