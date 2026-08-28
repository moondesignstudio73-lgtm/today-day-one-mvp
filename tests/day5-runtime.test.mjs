import assert from "node:assert/strict";
import {existsSync,readFileSync} from "node:fs";
import {
  DAY5_ENTRY_CHOICES,DAY5_RETURN_CHOICES,DAY5_SEOJIN_CHOICES,DAY5_WORK_CHOICES,
  applyLockedDay5ChoiceState,getLockedDay5LegacyChoice,getLockedDay5ResumePresentation,getLockedDay5Segment,validateLockedDay5Runtime
} from "../src/day5-campaign-runtime.mjs";
import {createScenarioState,validateScenarioState} from "../src/scenario-state.mjs";

function stateFor(){return {gameMode:"marriage-in-30-days",storyFlags:{day4SharingStrategy:"sharing_transparent"},storyHistory:[{day:4,sceneId:"m30-day4-arrive-home",choiceId:"map-home-basics"}],scenario:createScenarioState("marriage-in-30-days")};}

assert.equal(validateLockedDay5Runtime(),true,"locked DAY 5 runtime contract");
assert.deepEqual([DAY5_ENTRY_CHOICES.length,DAY5_SEOJIN_CHOICES.length,DAY5_WORK_CHOICES.length,DAY5_RETURN_CHOICES.length],[3,3,3,3]);
assert.deepEqual(DAY5_RETURN_CHOICES.map(item=>item.id),["request-current-briefing","rebuild-social-context","set-return-boundary"],"legacy final choice IDs");

const state=stateFor();
const path=["entry_current_facts","seojin_role_history","work_bounded_review","set-return-boundary"];
for(const [index,id] of path.entries()){
  const result=applyLockedDay5ChoiceState(state,id);
  assert.deepEqual(result,{stage:index+1},id);
  assert.ok(getLockedDay5Segment(state,result.stage).length>0,id);
  const restored=structuredClone(state);
  assert.equal(restored.storyFlags.day5RuntimeStage,index+1,"save restoration stage");
  assert.deepEqual(getLockedDay5ResumePresentation(restored),getLockedDay5ResumePresentation(state));
  assert.equal(validateScenarioState(restored.gameMode,restored.scenario),true);
}
assert.equal(getLockedDay5LegacyChoice(state),"set-return-boundary");
assert.equal(state.storyFlags.day5ReturnPlanReady,true);
assert.ok(state.scenario.profileUnlocks.includes("seojin-basic"));
assert.ok(state.scenario.unlockedActions.includes("day5-work-trial"));
assert.ok(state.scenario.followUpHooks.includes("day6-life-restart"));
assert.equal(state.storyFlags.day5ScenarioVersion,2);
assert.equal(state.storyFlags.day5_entry_strategy,"current_facts");
assert.equal(state.storyFlags.day5_seojin_strategy,"role_history");
assert.equal(state.storyFlags.day5_work_trial,"bounded_review");
assert.equal(state.storyFlags.day5_return_strategy,"set-return-boundary");
for(const flag of ["day5_haeun_boundary_respected","day5_current_authority_verified","day5_seojin_basic_unlocked","day5_pre_accident_work_habit_verified","day5_minho_provenance_respected","day5_work_return_plan_saved","day5_haeun_autonomy_trust","day6_life_restart_pending"])assert.equal(state.storyFlags[flag],true,flag);
assert.deepEqual(state.storyFlags.day5ChoiceEffectsApplied,Object.fromEntries(path.map(id=>[id,true])));
for(const action of ["planned-work-return","review-current-work"])assert.ok(state.scenario.unlockedActions.includes(action),action);

const roleHistory=stateFor();
applyLockedDay5ChoiceState(roleHistory,"seojin_role_history");
assert.equal(roleHistory.scenario.seojinAffection,0,"role history must not change affection");
assert.equal(roleHistory.scenario.seojinStatusInterest,3,"role history changes status interest");
const currentIntent=stateFor();
applyLockedDay5ChoiceState(currentIntent,"seojin_current_intent");
assert.equal(currentIntent.scenario.seojinAffection,3,"current intent changes affection");
assert.equal(currentIntent.scenario.seojinStatusInterest,0,"current intent must not change status interest");
const presentBoundary=stateFor();
applyLockedDay5ChoiceState(presentBoundary,"seojin_present_boundary");
assert.equal(presentBoundary.scenario.seojinAffection,1);
assert.equal(presentBoundary.scenario.seojinStatusInterest,1);

const idempotent=stateFor();
applyLockedDay5ChoiceState(idempotent,"seojin_current_intent");
applyLockedDay5ChoiceState(idempotent,"seojin_current_intent");
assert.equal(idempotent.scenario.seojinAffection,3,"restored choice effect must not be applied twice");

const bounded=stateFor();bounded.work=5;bounded.energy=10;
applyLockedDay5ChoiceState(bounded,"work_bounded_review");
assert.deepEqual([bounded.work,bounded.energy],[8,8],"bounded review applies exact work/energy cost");

const lowText=JSON.stringify(getLockedDay5Segment(stateFor(),0));
const midState=stateFor();midState.scenario.haeunAffection=4;midState.scenario.haeunTrust=4;
const highState=stateFor();highState.scenario.haeunAffection=8;highState.scenario.haeunTrust=8;
assert.ok(lowText.includes("거울 오른쪽 봐"));
assert.ok(JSON.stringify(getLockedDay5Segment(midState,0)).includes("합의안 통과"));
assert.ok(JSON.stringify(getLockedDay5Segment(highState,0)).includes("고맙다는 말도 천천히"));

for(const [choices,key] of [[DAY5_ENTRY_CHOICES,"day5EntryStrategy"],[DAY5_SEOJIN_CHOICES,"day5SeojinStrategy"],[DAY5_WORK_CHOICES,"day5WorkTrial"],[DAY5_RETURN_CHOICES,"day5ReturnStrategy"]]){
  for(const item of choices){const branch=stateFor();assert.ok(applyLockedDay5ChoiceState(branch,item.id),item.id);assert.equal(branch.storyFlags[key],item.id);}
}

const allText=JSON.stringify([0,1,2,3,4].flatMap(stage=>getLockedDay5Segment(state,stage)));
const allSteps=[0,1,2,3,4].flatMap(stage=>getLockedDay5Segment(state,stage));
const expectedCg=[
  "assets/events/day5/cg-day5-tie-boundary-pov-v1.png",
  "assets/events/day5/cg-day5-desk-two-folders-pov-v1.png",
  "assets/events/day5/cg-day5-work-trial-timer-pov-v1.png",
  "assets/events/day5/cg-day5-bench-fried-rice-phone-pov-v1.png"
];
assert.deepEqual(allSteps.filter(step=>step.type==="cgShow").map(step=>step.source),expectedCg,"four dedicated event CGs are wired in scene order");
for(const source of expectedCg)assert.equal(existsSync(new URL(`../${source}`,import.meta.url)),true,source);
for(const backgroundId of ["day5-office-lobby-gate-day","day5-office-elevator-lobby-day","day5-office-pantry-day","day5-office-small-meeting-room-day"]){
  assert.ok(allSteps.some(step=>step.type==="transition"&&step.backgroundId===backgroundId),backgroundId);
}
assert.deepEqual([0,1,2,3,4].map(day5RuntimeStage=>getLockedDay5ResumePresentation({storyFlags:{day5RuntimeStage}}).sceneKey),["S01_HOME_PREP","S03_COWORKER_REUNION","S06_WORK_TRIAL","S07_RETURN_PLAN","S08_DAY_END"]);
assert.equal(getLockedDay5ResumePresentation({storyFlags:{day5RuntimeStage:1}}).characterAssetUrl,undefined,"NPC resume must not reuse Haeun outfit");
assert.equal(getLockedDay5ResumePresentation({storyFlags:{day5RuntimeStage:4}}).cgAssetPath,expectedCg[3]);
for(const forbidden of ["가짜 하은","D-29","트럭 충돌","하은이 사고에 동승"])assert.ok(!allText.includes(forbidden),forbidden);
for(const required of ["확인된 사실","민호","윤서진","판단을 빌리는 연습","임시 예비폰","연기가 먼저 증거를 제출","지훈은 사고 전 마지막 만남","출처 없이 제 감정","생활 안전 앱 업데이트: 오늘은 성공","서로 다른 세 폴더","DAY REPORT"])assert.ok(allText.includes(required),required);

const game=readFileSync(new URL("../game.js",import.meta.url),"utf8");
assert.match(game,/LOCKED_DAY5_SCENE_ID/);
assert.match(readFileSync(new URL("../src/day5-campaign-runtime.mjs",import.meta.url),"utf8"),/introducedNpcIds","female-coworker","team-lead","office-best-male/);
assert.match(game,/applyLockedDay5ChoiceState\(state,choiceId\)/);
assert.match(game,/getLockedDay5LegacyChoice\(state\)/);
assert.match(game,/day5Prompts/);
assert.match(game,/applySkippedScenePresentation\(choiceIndex\)/,"SKIP must apply the last scene presentation before a choice");
console.log("✓ DAY 5 잠금 시나리오 8 Scene·4단계 선택·양축 분리·저장 복원 검증 통과");
