import test from "node:test";
import assert from "node:assert/strict";
import {DAY9_V3_CHOICES} from "../src/day9-v3-campaign-data.mjs";
import {getDay9V3ChoiceContinuation,getDay9V3ImmersiveScene,getDay9V3ImmersiveSegment,validateDay9V3ImmersiveAdapter} from "../src/day9-v3-immersive-adapter.mjs";
import {applyDay9V3Choice,beginDay9V3} from "../src/day9-v3-runtime.mjs";
import {settleDay9V3Transactions} from "../src/day9-v3-transaction-adapter.mjs";

const apply=(state,ids)=>ids.forEach(id=>applyDay9V3Choice(state,id));

test("fresh DAY 9 V3 stops at choice 1 and restores the next checkpoint exactly",()=>{
  const state={money:100000,storyFlags:{}};beginDay9V3(state,{relationshipBand:"MID"});
  const first=getDay9V3ImmersiveSegment(state);assert.equal(first.stopScene,1);assert.equal(first.awaitingChoice,true);assert.equal(first.steps.at(-1).choiceNumber,1);
  applyDay9V3Choice(state,"shopping9_together_short");const restored=JSON.parse(JSON.stringify(state));
  const resumed=getDay9V3ImmersiveSegment(restored);assert.equal(resumed.startScene,2);assert.equal(resumed.stopScene,2);assert.equal(resumed.steps.at(-1).choiceNumber,2);
  assert.ok(resumed.steps.some(step=>step.type==="message"&&/짧게 만나고 싶어/.test(step.text)));
});

test("comfortable route presents conditional CG, contact-safe character, and transaction result",()=>{
  const state={money:200000,inventory:[],economyLedger:[],girlfriendEquipment:{},storyFlags:{}};beginDay9V3(state,{relationshipBand:"HIGH",priorLightContact:true});
  apply(state,["shopping9_together_full","gift9_say_intent_first","fit9_ask_green_preference","fit9_admit_not_listening","green9_like_her_smile","scarf9_buy_secret","scarf9_exchange_or_put_down","player9_try_her_top","checkout9_offer_green_gift"]);
  settleDay9V3Transactions(state,{greenGiftAccepted:true});
  const fitting=getDay9V3ImmersiveScene(state,16);assert.ok(fitting.steps.some(step=>step.type==="cgShow"&&/player-fitting-sleeve/.test(step.source)));
  const checkout=getDay9V3ImmersiveScene(state,19);assert.ok(checkout.steps.some(step=>step.type==="cgShow"&&/exchange-green-receipt/.test(step.source)));
  const food=getDay9V3ImmersiveScene(state,20);assert.match(food.presentation.backgroundUrl,/department-food/);
});

test("LOW rest route excludes sleeve contact and survives JSON restoration",()=>{
  const state={money:100000,inventory:[],economyLedger:[],girlfriendEquipment:{},storyFlags:{}};beginDay9V3(state,{relationshipBand:"LOW",priorLightContact:true});
  apply(state,["shopping9_together_short","gift9_secret_after_looking","fit9_confident_recommendation","fit9_push_special_day","green9_decide_buy_now","scarf9_buy_secret","scarf9_push_wear_once","player9_rest_bench"]);
  const restored=JSON.parse(JSON.stringify(state));const scene=getDay9V3ImmersiveScene(restored,16);
  assert.ok(scene.steps.some(step=>step.type==="cgShow"&&/rest-zipper-bench/.test(step.source)));assert.equal(restored.storyFlags.day9V3SleeveContactAllowed,false);
  assert.ok(!scene.steps.some(step=>/소매 끝을 한 번 정리/.test(step.text??"")));
});

test("choice continuation emits the stored reaction once and reaches the next unresolved choice",()=>{
  const state={money:100000,storyFlags:{}};beginDay9V3(state,{relationshipBand:"HIGH"});applyDay9V3Choice(state,"shopping9_each_then_meet");
  const continuation=getDay9V3ChoiceContinuation(state,1);assert.ok(continuation.some(step=>step.type==="message"&&/각자 조금 보다가 만나자/.test(step.text)));
  assert.equal(continuation.filter(step=>/각자 조금 보다가 만나자/.test(step.text??"")).length,1);
  assert.equal(continuation.at(-1).choiceNumber,2);
});

test("completed route validates 24 scenes and emits only the DAY 10 contact hook",()=>{
  const state={money:200000,storyFlags:{}};beginDay9V3(state,{relationshipBand:"HIGH",priorLightContact:true});for(const choice of DAY9_V3_CHOICES)applyDay9V3Choice(state,choice.options[0].id);
  assert.equal(validateDay9V3ImmersiveAdapter(state),true);const restored=JSON.parse(JSON.stringify(state));const ending=getDay9V3ImmersiveSegment(restored,{startScene:24});
  assert.equal(ending.steps.at(-1).type,"sceneEnd");assert.equal(ending.steps.at(-1).nextHook,"day10-dinner-contact-before-shopping");assert.equal(ending.steps.at(-1).complete,true);
  assert.doesNotMatch(JSON.stringify(ending),/윤서진|전 여자친구|가짜 하은|MBTI/);
});
