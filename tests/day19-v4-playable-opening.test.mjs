import assert from 'node:assert/strict';
import test from 'node:test';
import {beginDay18V4, applyDay18V4Choice, completeDay18V4} from '../src/day18-v4-state-contract.mjs';
import {applyDay19V4Choice, beginDay19V4, getDay19V4Options} from '../src/day19-v4-state-contract.mjs';
import {getDay19V4PlayableOpening} from '../src/day19-v4-playable-opening.mjs';
import {validateDay19V4SourceStep} from '../src/day19-v4-source-selection.mjs';

const d18 = (state, key) => applyDay18V4Choice(state, `day18_v4_${key}`);
function fresh(contact = true, entertainmentBudget = false) {
  const appointment = contact ? 'HAEUN' : 'SOLO';
  const state = {money:42000, breakup:null, ended:false, storyFlags:{
    day17V4Completed:true,day17V4Day18HookPending:true,day17V4TomorrowPlan:appointment,
    day17V4Choice9:contact?'day17_v4_life_haeun':'day17_v4_life_solo',
    day17V4DinnerAgreement:{day:18,partner:appointment,status:'ACCEPTED',sourceChoiceId:'day17_v4_life_haeun'},
    day16V4YuriEncountered:false,day16V4YuriContact:'ENDED_HERE',day16V4YuriInvitation:'NONE',
    day19EntertainmentBudgetReserved:entertainmentBudget}};
  beginDay18V4(state,contact?{}:{haeunContactAllowed:false});
  for(const key of contact?['morning_keep','disclose_together','menu_each','topic_good','close_home','night_good','calm_trip','travel_near']:
    ['morning_solo','menu_familiar','solo_food','return_home','alone_stop','travel_life'])d18(state,key);
  completeDay18V4(state,{type:'chapterCompletionCue',day:18,finalSceneReached:true});
  beginDay19V4(state);return state;
}

function assertOwned(steps) {
  for(const step of steps) {
    if(['dialogue','message','monologue','stageAction'].includes(step.type))
      assert.equal(validateDay19V4SourceStep(step),true,`${step.type}: ${step.text??step.actionLabel}`);
  }
  assert.equal(steps.some(step=>step.type==='narration'||step.type==='sourceNote'),false);
  const visible=steps.filter(step=>typeof step.text==='string').map(step=>step.text).join('\n');
  assert.doesNotMatch(visible,/INTERNAL|플레이어 비노출|실제 연락|경로라면|SCENARIO V4/);
}

test('opening begins with source-owned SCENE 01 and exact choice 1',()=>{
  const state=fresh(),before=JSON.stringify(state.storyFlags.day19V4);
  const steps=getDay19V4PlayableOpening(state.storyFlags.day19V4);
  assert.equal(steps[0].type,'sceneDirection');assert.equal(steps[0].number,1);
  assert.deepEqual(steps.at(-1).options.map(option=>option.label),[
    '내가 지금 쓸 수 있는 돈부터 보자.','하은이 생각한 하루부터 물어보자.','일단 멋진 계획을 하나 만들어 보고 싶어.']);
  assertOwned(steps);assert.equal(JSON.stringify(state.storyFlags.day19V4),before);
});

test('all C1 and C2 reactions are exact-source owned and reach the next authored choice',()=>{
  for(const contact of [true,false]) {
    const base=fresh(contact), first=getDay19V4Options(base.storyFlags.day19V4);
    assert.equal(first.some(option=>option.id.endsWith('_ask_haeun')),contact);
    for(const option of first) {
      const state=structuredClone(base);applyDay19V4Choice(state,option.id);
      let steps=getDay19V4PlayableOpening(state.storyFlags.day19V4);assertOwned(steps);
      assert.equal(steps.find(step=>step.type==='sceneDirection')?.number,2);
      assert.equal(steps.at(-1).choiceNumber,2);
      for(const scope of getDay19V4Options(state.storyFlags.day19V4)) {
        const branch=structuredClone(state);applyDay19V4Choice(branch,scope.id);
        steps=getDay19V4PlayableOpening(branch.storyFlags.day19V4);assertOwned(steps);
        assert.deepEqual(steps.filter(step=>step.type==='sceneDirection').map(step=>step.number),[3,4]);
        assert.equal(steps.at(-1).choiceNumber,3);
      }
    }
  }
});

test('C3 never renders winnings and all three branches reach Minho choice 4',()=>{
  for(const budget of [false,true]) {
    const base=fresh(true,budget);
    applyDay19V4Choice(base,getDay19V4Options(base.storyFlags.day19V4)[0].id);
    applyDay19V4Choice(base,getDay19V4Options(base.storyFlags.day19V4)[0].id);
    for(const option of getDay19V4Options(base.storyFlags.day19V4)) {
      const state=structuredClone(base);applyDay19V4Choice(state,option.id);
      const steps=getDay19V4PlayableOpening(state.storyFlags.day19V4),text=steps.map(step=>step.text??'').join('\n');
      assertOwned(steps);assert.equal(steps.find(step=>step.type==='sceneDirection')?.number,5);
      assert.equal(steps.at(-1).choiceNumber,4);assert.doesNotMatch(text,/당첨됐|상금|수익이 생/);
      assert.equal(state.storyFlags.day19V4.facts.travelPaymentMade,false);
      assert.equal(state.storyFlags.day19V4.facts.lotteryWinningsCounted,false);
    }
  }
});

test('all C4 reactions end at a pure opening boundary without inventing paid work',()=>{
  const base=fresh();
  for(let number=1;number<=3;number++)applyDay19V4Choice(base,getDay19V4Options(base.storyFlags.day19V4)[0].id);
  for(const option of getDay19V4Options(base.storyFlags.day19V4)) {
    const state=structuredClone(base),before=state.money;applyDay19V4Choice(state,option.id);
    const chapter=structuredClone(state.storyFlags.day19V4),steps=getDay19V4PlayableOpening(state.storyFlags.day19V4);
    assertOwned(steps);assert.deepEqual(steps.at(-1),{type:'openingBoundary',nextScene:6});
    assert.equal(state.storyFlags.day19V4.facts.paidWorkConfirmed,false);assert.equal(state.money,before);
    assert.deepEqual(getDay19V4PlayableOpening(structuredClone(chapter)),steps);
  }
});

test('source ownership fails closed for a non-existent or altered line',async()=>{
  const {day19V4SourceRef}=await import('../src/day19-v4-source-selection.mjs');
  assert.throws(()=>day19V4SourceRef(1,'없는 문장'),/SOURCE_LINE_MISSING/);
  assert.throws(()=>day19V4SourceRef(25,'없는 장면'),/SOURCE_SCENE_MISSING/);
});
