import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
import {getLockedDay18Segment} from "../src/day18-campaign-runtime.mjs";
import {createStorySceneSequence} from "../src/story-scene-controller.mjs";
import {isDevelopmentStyleNarration,isInternalStoryStep,isPlayerFacingStoryStep,projectAuthoredStoryStep} from "../src/story-player-facing-policy.mjs";
import {createInitialState} from "../src/game-core.mjs";
import {createGirlfriendFromProfile} from "../src/girlfriend-manager.mjs";
import {GAME_MODES} from "../src/scenario-state.mjs";
import {selectNextStoryScene} from "../src/story-manager.mjs";

test("only explicit player-facing text types may reach the dialogue renderer",()=>{
  for(const type of ["stage","stageAction","stageDirection","section","metadata","designNote","devNote","continuityNote","implementationNote","testNote","flag","stateMutation","choiceCue","sceneBoundary"]){
    const step={type,text:"화면에 나오면 안 되는 문장"};
    assert.equal(isInternalStoryStep(step),true,type);
    assert.equal(isPlayerFacingStoryStep(step),false,type);
  }
  assert.equal(isPlayerFacingStoryStep({type:"dialogue",speaker:"하은",text:"잠깐."}),true);
  assert.equal(isPlayerFacingStoryStep({type:"monologue",text:"약은 여기였지."}),true);
});

test("authoring projection never converts actions or unknown metadata into narration",()=>{
  assert.deepEqual(projectAuthoredStoryStep({type:"action",text:"하은이 서랍을 연다."}),{type:"stageAction",action:"하은이 서랍을 연다.",sourceType:"action"});
  assert.deepEqual(projectAuthoredStoryStep({type:"stageDirection",text:"[배경 전환]"}),{type:"stageAction",action:"[배경 전환]",sourceType:"stageDirection"});
  assert.deepEqual(projectAuthoredStoryStep({type:"designNote",text:"이 장면의 목적은 경계를 보여주는 것이다."}),{type:"metadata",sourceType:"designNote"});
  assert.deepEqual(projectAuthoredStoryStep({type:"narration",text:"식탁 위에 약봉투가 놓여 있었다."}),{type:"narration",text:"식탁 위에 약봉투가 놓여 있었다."});
});

test("development-style continuity and state prose is rejected as narration",()=>{
  for(const text of [
    "DAY 17에 준비한 집 안전 목록은 다음과 같다.",
    "이 장면의 목적은 두 사람의 생활 차이를 보여주는 것이다.",
    "이 선택은 haeun_affection +1을 발생시킨다.",
    "다음 DAY 연결 목표를 준비한다.",
    "관계 수치가 추가로 반영됐다.",
    "DAY REPORT · 다음 장면에 필요한 상태를 정리한다.",
    "두 사람은 이런저런 이야기를 나눴다."
  ]){
    assert.equal(isDevelopmentStyleNarration(text),true,text);
    assert.equal(isPlayerFacingStoryStep({type:"narration",text}),false,text);
  }
});

test("DAY 18 opening presents an acted scene instead of the continuity note",()=>{
  const state={storyFlags:{}},steps=getLockedDay18Segment(state,0),text=JSON.stringify(steps);
  assert.equal(text.includes("DAY 17에 준비한 집 안전 목록"),false);
  assert.ok(text.includes("하은이 식탁 위의 약봉투를 집어 든다."));
  assert.equal(steps.find(step=>step.action?.includes("약봉투"))?.type,"stageAction");
  assert.ok(text.includes("이거 계속 여기 둘 거야?"));
  assert.ok(steps.filter(step=>step.type==="dialogue").length>=8);
  assert.equal(steps.at(-1).type,"choice");
});

test("DAY 18 cannot recall DAY 17 unless the player actually completed DAY 17",()=>{
  const state=createInitialState(createGirlfriendFromProfile("haeun",()=>.5),()=>.5,{mode:GAME_MODES.MARRIAGE_30});
  state.day=18;
  state.storyFlags.day18CurrentHomeSafetyPending=true;
  assert.notEqual(selectNextStoryScene(state)?.id,"m30-day18-current-home-safety");
  state.storyHistory.push({sceneId:"m30-day17-current-health-routine",choiceId:"health17_data_private_summary",day:17,response:"완료"});
  assert.equal(selectNextStoryScene(state)?.id,"m30-day18-current-home-safety");
});

test("all legacy DAY runtimes contain no numbered continuity prose in dialogue or narration calls",()=>{
  const numberedContinuity=/(?:n|d)\([^\r\n]*DAY\s+\d+(?:에|에서|의|처럼|기록)/;
  const developerProse=/DAY REPORT|이 장면의 목적|이 선택.*(?:영향|발생)|다음 DAY.*(?:연결|준비)|관계 수치|두 사람은 이런저런/;
  for(let day=1;day<=30;day+=1){
    const url=new URL(`../src/day${day}-campaign-runtime.mjs`,import.meta.url);
    let source="";
    try{source=readFileSync(url,"utf8");}catch{continue;}
    assert.doesNotMatch(source,numberedContinuity,`DAY ${day} numbered continuity`);
    assert.doesNotMatch(source,developerProse,`DAY ${day} developer prose`);
  }
});

test("renderer skips internal steps and generic reactions expose no relationship math",()=>{
  const game=readFileSync(new URL("../game.js",import.meta.url),"utf8");
  const controller=readFileSync(new URL("../src/story-scene-controller.mjs",import.meta.url),"utf8");
  assert.match(game,/isInternalStoryStep\(step\)\|\|!isPlayerFacingStoryStep\(step\)/);
  assert.doesNotMatch(game,/step\.type==="stageDirection"\|\|step\.type==="section"/);
  assert.doesNotMatch(controller,/관계 수치에 추가로 반영됐다/);
  assert.doesNotMatch(controller,/선택의 의미는 숫자가 아니라/);
});

test("generic story metadata message is not promoted to player narration",()=>{
  const scene={window:[18],arc:"테스트",speaker:"하은",message:"이 장면의 목적은 상태 플래그를 연결하는 것이다.",question:"지금 뭘 할까?",choices:[]};
  const presentation={characterId:"girlfriend",expressionId:"calm",animationId:"idle"};
  const steps=createStorySceneSequence(scene,presentation,[]);
  assert.equal(JSON.stringify(steps).includes(scene.message),false);
  const explicit=createStorySceneSequence({...scene,playerFacingNarration:"식탁 위에 약봉투가 놓여 있었다."},presentation,[]);
  assert.ok(JSON.stringify(explicit).includes("식탁 위에 약봉투가 놓여 있었다."));
});

test("DAY 6-14 adapters share the typed projection instead of narration fallback",()=>{
  for(const name of ["day6-v3-immersive-adapter.mjs","day7-v3-immersive-adapter.mjs","day8-v3-immersive-adapter.mjs","day9-v3-immersive-adapter.mjs","day10-v3-immersive-adapter.mjs","day11-v3-immersive-adapter.mjs","day12-v3-immersive-adapter.mjs","day13-v3-immersive-adapter.mjs","day14-v4-immersive-adapter.mjs"]){
    const source=readFileSync(new URL(`../src/${name}`,import.meta.url),"utf8");
    assert.match(source,/projectAuthoredStoryStep/);
    assert.doesNotMatch(source,/sourceType:step\.type\}\)/);
  }
});
