import test from "node:test";
import assert from "node:assert/strict";
import {DAY9_V3_CHOICES} from "../src/day9-v3-campaign-data.mjs";
import {applyDay9V3Choice,beginDay9V3,getDay9V3PlayableScene,resolveDay9V3GreenGift} from "../src/day9-v3-runtime.mjs";

const text=scene=>scene.steps.map(step=>step.text??"").join(" ");
const choose=(state,ids)=>ids.forEach(id=>applyDay9V3Choice(state,id));

test("DAY 9 V3 replays the comfortable purchase path and survives JSON restore",()=>{
  const state={money:100000,storyFlags:{day8V3RestBoundary:true}};
  beginDay9V3(state,{relationshipBand:"HIGH",priorLightContact:true});
  choose(state,["shopping9_together_full","gift9_say_intent_first","fit9_ask_green_preference","fit9_admit_not_listening","green9_like_her_smile","scarf9_buy_secret","scarf9_exchange_or_put_down","player9_try_her_top","checkout9_offer_green_gift","memory9_photo_together","dinner9_set_time_together"]);
  assert.equal(resolveDay9V3GreenGift(state,{accepted:true}),true);
  const scenes=Array.from({length:24},(_,index)=>getDay9V3PlayableScene(state,index+1));
  assert.deepEqual(scenes.map(scene=>scene.sceneId),Array.from({length:24},(_,index)=>`D9V3_S${String(index+1).padStart(2,"0")}`));
  assert.match(text(scenes[0]),/없었던 통화 기억을 만들지 않는다/);
  assert.match(text(scenes[11]),/샀어\?/);assert.match(text(scenes[13]),/영수증과 택/);
  assert.match(text(scenes[15]),/오른쪽이 야근/);assert.match(text(scenes[16]),/면접 보던 때/);
  assert.match(text(scenes[18]),/먼저 교환한다/);assert.match(text(scenes[18]),/포장과 영수증/);
  assert.match(text(scenes[19]),/푸드홀/);assert.match(text(scenes[20]),/광고 아니야/);
  assert.match(text(scenes[21]),/다음에 입고 올게/);assert.match(text(scenes[23]),/다음에도 같이 쇼핑 가능/);
  const restored=JSON.parse(JSON.stringify(state));
  assert.deepEqual(Array.from({length:24},(_,index)=>getDay9V3PlayableScene(restored,index+1)),scenes);
});

test("DAY 9 V3 keeps the pressured rest route distant without comfortable reactions",()=>{
  const state={money:100000,storyFlags:{}};beginDay9V3(state,{relationshipBand:"LOW"});
  choose(state,["shopping9_together_short","gift9_secret_after_looking","fit9_confident_recommendation","fit9_push_special_day","green9_decide_buy_now","scarf9_buy_secret","scarf9_push_wear_once","player9_rest_bench","checkout9_leave_then_decide","memory9_words_only","dinner9_defer_and_ask_again"]);
  assert.match(text(getDay9V3PlayableScene(state,14)),/바로 웃지는 않는다/);
  assert.match(text(getDay9V3PlayableScene(state,16)),/물병/);
  assert.match(text(getDay9V3PlayableScene(state,17)),/마음은 즉시 처음으로 돌아가지 않는다/);
  assert.match(text(getDay9V3PlayableScene(state,20)),/약속한 시간이/);
  assert.match(text(getDay9V3PlayableScene(state,21)),/오른쪽 소매 야근/);
  assert.match(text(getDay9V3PlayableScene(state,22)),/고맙다는 말을 먼저/);
  assert.doesNotMatch(text(getDay9V3PlayableScene(state,24)),/다음에도 같이 쇼핑 가능/);
});

test("DAY 9 V3 scene player rejects inactive and unknown scenes",()=>{
  assert.throws(()=>getDay9V3PlayableScene({storyFlags:{}},1),/DAY9_V3_NOT_STARTED/);
  const state={storyFlags:{}};beginDay9V3(state);
  assert.throws(()=>getDay9V3PlayableScene(state,25),/DAY9_V3_UNKNOWN_SCENE/);
  assert.equal(DAY9_V3_CHOICES.length,11);
});
