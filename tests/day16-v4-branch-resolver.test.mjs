import test from "node:test";
import assert from "node:assert/strict";
import {getDay16V4ActiveSceneNumbers,resolveDay16V4Scene} from "../src/day16-v4-branch-resolver.mjs";

const flags=(route,depth="NONE",extra={})=>({day16V4DayRoute:route,day16V4ConversationDepth:depth,day16V4EveningDisclosure:"NO_YURI_FACT",day16V4YuriContact:"NOT_APPLICABLE",day16V4YuriInvitation:"NONE",...extra});

test("route matrix preserves cafe joins and the shorter home path",()=>{
  assert.deepEqual(getDay16V4ActiveSceneNumbers(flags(null)),[1]);
  assert.deepEqual(getDay16V4ActiveSceneNumbers(flags("HOME")),[1,2,18,19,21,22,23,24]);
  assert.deepEqual(getDay16V4ActiveSceneNumbers(flags("SOLO_CAFE","GREETING_ONLY")),[1,2,3,4,5,16,17,19,22,23,24]);
  assert.deepEqual(getDay16V4ActiveSceneNumbers(flags("JIHOON_CAFE","PAST_LIMITED")),[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,19,22,23,24]);
  assert.deepEqual(getDay16V4ActiveSceneNumbers(flags("JIHOON_CAFE","PAST_LIMITED",{day16V4EveningDisclosure:"DISCLOSED_YURI",day16V4HaeunYuriKnowledge:"LIMITED_CONVERSATION"})),[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,19,20,21,22,23,24]);
});

test("choice 8 moves exactly once and choice 9 follows the actual route",()=>{
  const home=flags("HOME"),solo=flags("SOLO_CAFE","PRESENT_ONLY"),jihoon=flags("JIHOON_CAFE","PAST_LIMITED");
  assert.equal(resolveDay16V4Scene(home,18).choice.number,8);
  assert.equal(resolveDay16V4Scene(home,17).status,"SKIPPED");
  assert.equal(resolveDay16V4Scene(solo,17).choice.number,8);
  assert.equal(resolveDay16V4Scene(solo,18).status,"SKIPPED");
  assert.equal(resolveDay16V4Scene(home,19).choice.options.at(-1).label,"오늘 집에서 쉬었어.");
  assert.equal(resolveDay16V4Scene(home,19).choice.options.length,1);
  assert.equal(resolveDay16V4Scene(solo,19).choice.options.at(-1).label,"혼자 카페 다녀왔어.");
  assert.equal(resolveDay16V4Scene(jihoon,19).choice.options.at(-1).label,"지훈만 잠깐 만났어.");
});

test("conditional choices 10 to 12 fail closed",()=>{
  const base=flags("SOLO_CAFE","PRESENT_ONLY");
  assert.equal(resolveDay16V4Scene(base,20).status,"SKIPPED");
  assert.equal(resolveDay16V4Scene(base,22).choice,null);
  assert.equal(resolveDay16V4Scene(base,23).choice,null);
  assert.equal(resolveDay16V4Scene({...base,day16V4EveningDisclosure:"DISCLOSED_YURI"},20).status,"SKIPPED");
  assert.equal(resolveDay16V4Scene({...base,day16V4EveningDisclosure:"DISCLOSED_YURI",day16V4HaeunYuriKnowledge:"ENCOUNTER_ONLY"},20).choice.number,10);
  assert.equal(resolveDay16V4Scene({...base,day16V4YuriContact:"SHARED"},22).choice.number,11);
  assert.equal(resolveDay16V4Scene({...base,day16V4YuriContact:"SHARED",day16V4YuriInvitation:"DECLINED"},23).choice,null);
  assert.equal(resolveDay16V4Scene({...base,day16V4YuriContact:"SHARED",day16V4YuriInvitation:"ANSWER_TOMORROW"},23).choice.number,12);
});

test("morning no-contact and current relationship wording require explicit context",()=>{
  const state=flags("JIHOON_CAFE","PRESENT_ONLY");
  assert.equal(resolveDay16V4Scene(state,2).choice.options.length,2);
  assert.equal(resolveDay16V4Scene(state,2,{allowMorningNoContact:true}).choice.options.length,3);
  assert.equal(resolveDay16V4Scene(state,13).choice.options[0].label,"지금은 연애를 다시 생각하는 중");
  assert.equal(resolveDay16V4Scene(state,13,{haeunRelationshipActive:true}).choice.options[0].label,"지금 만나는 사람이 있어요. 하은이라고.");
});

test("resolver returns the immutable exact source object and blocks unknown scenes",()=>{
  const resolved=resolveDay16V4Scene(flags("HOME"),18);
  assert.equal(Object.isFrozen(resolved.source),true);
  assert.match(resolved.source.sourceMarkdown,/^## SCENE 18/);
  assert.deepEqual(resolveDay16V4Scene(flags("HOME"),25),{status:"BLOCKED_UNKNOWN_SCENE",sceneNumber:25});
});

test("source-authored button labels remain byte-equal to the exact registry",()=>{
  const sourceOptions=scene=>[...scene.source.sourceMarkdown.matchAll(/^- \*\*(?:“)?(.+?)(?:”)?\*\*$/gm)].map(match=>match[1]);
  const cafe=flags("JIHOON_CAFE","PAST_LIMITED",{day16V4EveningDisclosure:"DISCLOSED_YURI",day16V4HaeunYuriKnowledge:"CONTACT_SHARED",day16V4YuriContact:"SHARED",day16V4YuriInvitation:"ANSWER_TOMORROW"});
  for(const [scene,context] of [[1,{}],[2,{allowMorningNoContact:true}],[5,{}],[7,{}],[10,{}],[13,{haeunRelationshipActive:true}],[15,{}],[17,{}],[20,{}],[22,{}],[23,{}]]){
    const resolved=resolveDay16V4Scene(cafe,scene,context);
    assert.deepEqual(resolved.choice.options.map(item=>item.label),sourceOptions(resolved),`SCENE ${scene} exact labels`);
  }
  const home=resolveDay16V4Scene(flags("HOME"),18);
  assert.deepEqual(home.choice.options.map(item=>item.label),sourceOptions(home),"SCENE 18 exact labels");
  const evening=resolveDay16V4Scene(cafe,19);
  assert.deepEqual(evening.choice.options.slice(0,2).map(item=>item.label),sourceOptions(evening).slice(0,2),"SCENE 19 common labels");
});
