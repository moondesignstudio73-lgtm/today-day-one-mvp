import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {DAY9_SCOPE_CHOICES,DAY9_PRESSURE_CHOICES,DAY9_DEBRIEF_CHOICES,applyLockedDay9ChoiceState,getLockedDay9LegacyChoice,getLockedDay9ResumePresentation,getLockedDay9Segment,validateLockedDay9Runtime} from "../src/day9-campaign-runtime.mjs";
import {createScenarioState,validateScenarioState} from "../src/scenario-state.mjs";
import {getStoryScene,selectNextStoryScene} from "../src/story-manager.mjs";

function stateFor(){
  const scenario=createScenarioState("marriage-in-30-days");
  scenario.haeunAffection=20;scenario.haeunTrust=35;scenario.coworkerRelation=8;scenario.seojinAffection=7;scenario.seojinStatusInterest=11;
  scenario.followUpHooks=["day9-second-office-adaptation"];
  return {gameMode:"marriage-in-30-days",day:9,work:20,confidence:28,stress:9,storyFlags:{day5ReturnStrategy:"set-return-boundary",day5SeojinStrategy:"seojin_present_boundary",day8CheckInStrategy:"errand8_change_only_checkin",day8PurchaseStrategy:"errand8_compare_labels",day8ShareStrategy:"errand8_explain_decision_log",day8IndependentErrandCompleted:true,day9SecondOfficeAdaptationPending:true},storyHistory:[{day:8,sceneId:"m30-day8-independent-errand",choiceId:"errand8_explain_decision_log",response:"완료"}],partner:{heroineId:"haeun"},scenario};
}

assert.equal(validateLockedDay9Runtime(),true);
assert.deepEqual([DAY9_SCOPE_CHOICES.length,DAY9_PRESSURE_CHOICES.length,DAY9_DEBRIEF_CHOICES.length],[3,3,3]);
const shell=getStoryScene("m30-day9-second-office-adaptation");
assert.ok(shell);assert.equal(shell.choices.length,3);assert.equal(selectNextStoryScene(stateFor()).id,shell.id);

const stages=["office9_scope_current_queue","office9_pressure_route_questions","office9_debrief_write_protocol"];
const resumes=["office-day","neighborhood-street-day","neighborhood-street-day"];
let sample=stateFor();
for(const [index,id] of stages.entries()){
  assert.deepEqual(applyLockedDay9ChoiceState(sample,id),{stage:index+1});
  sample=JSON.parse(JSON.stringify(sample));
  assert.equal(sample.storyFlags.day9RuntimeStage,index+1);
  assert.equal(getLockedDay9ResumePresentation(sample).backgroundId,resumes[index]);
  assert.ok(getLockedDay9Segment(sample,index+1).length>0);
  assert.equal(validateScenarioState(sample.gameMode,sample.scenario),true);
}
assert.equal(getLockedDay9LegacyChoice(sample),"office9_debrief_write_protocol");

const scopeBudget={office9_scope_current_queue:{work:2,stress:0,coworker:0,a:0,s:2,map:"current_queue"},office9_scope_shadow_handoff:{work:0,stress:0,coworker:2,a:2,s:0,map:"shadow_handoff"},office9_scope_compare_decisions:{work:0,stress:1,coworker:0,a:0,s:3,map:"bounded_comparison"}};
const pressureBudget={office9_pressure_route_questions:{work:2,confidence:0,coworker:0,a:0,s:3,protocol:"route_questions"},office9_pressure_observe_annotate:{work:0,confidence:0,coworker:2,a:2,s:0,protocol:"observe_annotate"},office9_pressure_reversible_task:{work:0,confidence:3,coworker:0,a:1,s:1,protocol:"reversible_task"}};
const debriefBudget={office9_debrief_name_limits:{coworker:0,a:3,s:0,debrief:"named_limits"},office9_debrief_write_protocol:{coworker:0,a:0,s:3,debrief:"work_protocol"},office9_debrief_targeted_feedback:{coworker:2,a:1,s:1,debrief:"targeted_feedback"}};

let paths=0;
for(const scope of DAY9_SCOPE_CHOICES)for(const pressure of DAY9_PRESSURE_CHOICES)for(const debrief of DAY9_DEBRIEF_CHOICES){
  let state=stateFor();const base={work:state.work,confidence:state.confidence,stress:state.stress,coworker:state.scenario.coworkerRelation,a:state.scenario.seojinAffection,s:state.scenario.seojinStatusInterest,profiles:[...state.scenario.profileUnlocks],day5:state.storyFlags.day5ReturnStrategy,day8:state.storyFlags.day8ShareStrategy};
  applyLockedDay9ChoiceState(state,scope.id);state=structuredClone(state);applyLockedDay9ChoiceState(state,pressure.id);state=structuredClone(state);applyLockedDay9ChoiceState(state,debrief.id);state=structuredClone(state);
  const x=scopeBudget[scope.id],y=pressureBudget[pressure.id],z=debriefBudget[debrief.id];
  assert.equal(state.work,base.work+x.work+y.work);assert.equal(state.confidence,base.confidence+y.confidence);assert.equal(state.stress,base.stress+x.stress);
  assert.equal(state.scenario.coworkerRelation,base.coworker+x.coworker+y.coworker+z.coworker);
  assert.equal(state.scenario.seojinAffection,base.a+x.a+y.a+z.a);assert.equal(state.scenario.seojinStatusInterest,base.s+x.s+y.s+z.s);
  assert.equal(state.storyFlags.current_scope_map,x.map);assert.equal(state.storyFlags.bounded_decision_protocol,y.protocol);assert.equal(state.storyFlags.office_return_debrief,z.debrief);
  assert.equal(state.storyFlags.day5ReturnStrategy,base.day5);assert.equal(state.storyFlags.day8ShareStrategy,base.day8);assert.deepEqual(state.scenario.profileUnlocks,base.profiles);
  assert.equal(state.storyFlags.day9SecondOfficeAdaptationPending,false);assert.equal(state.storyFlags.day9SecondOfficeAdaptationCompleted,true);assert.equal(state.storyFlags.day10ThreeHourWorkRhythmPending,true);
  for(const id of [scope.id,pressure.id,debrief.id])assert.equal(state.storyFlags[id],true,id);
  for(const id of ["current_scope_map","bounded_decision_protocol","office_return_debrief"])assert.equal(state.scenario.clues.filter(value=>value===id).length,1,id);
  for(const id of ["bounded-office-contribution","review-current-queue","current-coworker-lunch"])assert.equal(state.scenario.unlockedActions.filter(value=>value===id).length,1,id);
  assert.equal(state.scenario.followUpHooks.filter(value=>value==="day10-three-hour-work-rhythm").length,1);
  assert.equal(validateScenarioState(state.gameMode,state.scenario),true);assert.deepEqual(JSON.parse(JSON.stringify(state)),state);paths++;
}
assert.equal(paths,27);

for(const [key,value,phrase] of [["day5ReturnStrategy","request-current-briefing","현재 파일부터"],["day5SeojinStrategy","seojin_current_intent","무엇을 기대하는지"],["day8CheckInStrategy","errand8_timed_checkin","도착하고 나올 때"],["day8PurchaseStrategy","errand8_buy_small_test","90분만 시험"],["day8ShareStrategy","errand8_sort_receipt_together","완료·보류"]]){const state=stateFor();state.storyFlags[key]=value;assert.ok(JSON.stringify(getLockedDay9Segment(state,0)).includes(phrase),`${key} callback`);}
const affection=stateFor();affection.scenario.seojinAffection=20;affection.scenario.seojinStatusInterest=5;
const status=stateFor();status.scenario.seojinAffection=5;status.scenario.seojinStatusInterest=20;
assert.ok(JSON.stringify(getLockedDay9Segment(affection,2)).includes("상태부터 물을게요"));
assert.ok(JSON.stringify(getLockedDay9Segment(status,2)).includes("업무부터 볼게요"));

const allText=JSON.stringify([0,1,2,3].flatMap(stage=>getLockedDay9Segment({...sample,storyFlags:{...sample.storyFlags,day9RuntimeStage:stage}},stage)));
for(const required of ["현재 책임자부터 표시","급한 건 사실입니다","도움과 승인 권한을 분리","성과 말고 상태부터","오늘의 나는 종료합니다"])assert.ok(allText.includes(required),required);
for(const forbidden of ["가짜 하은","D-29","트럭 충돌","하은이 사고에 동승","의미심장한 미소","사내 음모"])assert.ok(!allText.includes(forbidden),forbidden);

const game=readFileSync(new URL("../game.js",import.meta.url),"utf8");
for(const pattern of [/LOCKED_DAY9_SCENE_ID/,/applyLockedDay9ChoiceState\(state,choiceId\)/,/getLockedDay9LegacyChoice\(state\)/,/day9Prompts/,/getLockedDay9ResumePresentation/])assert.match(game,pattern);
console.log("✓ DAY 9 8 Scene·27경로·DAY 5/8 콜백·서진 양축 분리·JSON 저장 복원 런타임 PASS");
