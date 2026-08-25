import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createInitialState } from "../src/game-core.mjs";
import { createGirlfriendFromProfile } from "../src/girlfriend-manager.mjs";
import { SaveManager } from "../src/save-manager.mjs";
import { GAME_MODES } from "../src/scenario-state.mjs";
import { resolveStoryChoice } from "../src/story-manager.mjs";
import {
  DAY1_CONTACT_CHOICES,
  DAY1_QUESTION_CHOICES,
  LOCKED_DAY1_SCENE_ID,
  applyLockedDay1ChoiceState,
  getLockedDay1Segment
} from "../src/day1-campaign-runtime.mjs";

const createState=()=>createInitialState(createGirlfriendFromProfile("haeun",()=>0.5),()=>0.5,{mode:GAME_MODES.MARRIAGE_30});
const makeStorage=()=>{const values=new Map();return {getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)}};
const textOf=sequence=>sequence.filter(step=>step.text).map(step=>step.text).join("\n");
const forbidden=["트럭과 충돌","하은도 차에 타고","나를 감쌌","가짜 하은"];

const routeResults=[];
for(const contact of DAY1_CONTACT_CHOICES){
  for(const question of DAY1_QUESTION_CHOICES){
    let state=createState();
    const opening=getLockedDay1Segment(state,0);
    assert.equal(opening.at(-1).type,"choice");
    const contactResult=applyLockedDay1ChoiceState(state,contact.id);

    // 첫 선택 직후 저장한 데이터도 같은 전략과 다음 선택 지점을 복원해야 한다.
    const firstStore=makeStorage();SaveManager.save(state,firstStore);state=SaveManager.load(firstStore);
    assert.equal(state.storyFlags.day1ContactStrategy,contact.id);
    const middle=getLockedDay1Segment(state,1);
    assert.equal(middle.at(-1).type,"choice");
    assert.deepEqual(middle.at(-1).options.map(option=>option.id),DAY1_QUESTION_CHOICES.map(option=>option.id));

    applyLockedDay1ChoiceState(state,question.id);
    const secondStore=makeStorage();SaveManager.save(state,secondStore);state=SaveManager.load(secondStore);
    assert.equal(state.storyFlags.day1QuestionStrategy,question.id);
    const ending=getLockedDay1Segment(state,2);
    assert.equal(ending.at(-1).type,"sceneEnd");
    assert.ok(resolveStoryChoice(state,LOCKED_DAY1_SCENE_ID,contactResult.legacyChoiceId));

    const full=[...opening,...middle,...ending];
    const script=textOf(full);
    forbidden.forEach(fragment=>assert.equal(script.includes(fragment),false,`${contact.id}/${question.id}: ${fragment}`));
    assert.ok(full.filter(step=>step.type==="dialogue").length>=60);
    assert.equal(full.filter(step=>step.type==="choice").length,2);
    assert.equal(full.filter(step=>step.type==="cgShow").length,3);
    assert.ok(full.some(step=>step.type==="sfx"&&step.sfxId));
    assert.ok(full.some(step=>step.bgmCue));
    assert.match(script,/지금의 내가 다시 판단해야 해/);
    assert.match(script,/나부터/);
    routeResults.push(`${contact.id} × ${question.id}`);
  }
}

assert.equal(routeResults.length,9);

// 자동 진행 큐와 CG가 노출되는 동안 중복 클릭으로 순서가 앞당겨지지 않아야 한다.
const gameSource=readFileSync(new URL("../game.js",import.meta.url),"utf8");
assert.match(gameSource,/eventRuntime\.input\.lock\(owner,"StoryCg"\)/);
assert.match(gameSource,/eventRuntime\.input\.lock\(owner,"StoryAutoCue"\)/);
assert.match(gameSource,/eventRuntime\.input\.snapshot\(\)\.locked/);
assert.match(gameSource,/if\(immersiveScene\?\.id===owner\)renderImmersiveStep\(\)/);
assert.match(gameSource,/function skipImmersiveScene[\s\S]*?eventRuntime\.input\.unlock\(immersiveScene\.id\)/);
assert.match(gameSource,/event\.target\.closest\?\.\("\[data-immersive-choice\]"\)\)return/);
assert.match(gameSource,/storyChoiceLayer"\)\.addEventListener\("keydown"[\s\S]*?chooseImmersiveOption\(button\.dataset\.immersiveChoice\)/);

console.log(`✓ DAY 1 실제 플레이 QA 계약: ${routeResults.length}개 경로, 중간 저장 2지점, CG·오디오·입력 잠금 통과`);
