import assert from 'node:assert/strict';
import test from 'node:test';
import {applyDay25V4Choice,beginDay25V4,getDay25V4Options} from '../src/day25-v4-state-contract.mjs';
import {getDay25V4PlayableFuture} from '../src/day25-v4-playable-future.mjs';
import {validateDay25V4SourceStep} from '../src/day25-v4-source-selection.mjs';
import {day25ContinuedFixture} from './day25-v4-playable-fixture.mjs';
const choose=(state,suffix)=>{const options=getDay25V4Options(state.storyFlags.day25V4),selected=suffix?options.find(option=>option.id.endsWith(`_${suffix}`)):options[0];assert.ok(selected,`${state.storyFlags.day25V4.phase}:${suffix}`);applyDay25V4Choice(state,selected.id);};
const sourced=steps=>{for(const step of steps)if(['dialogue','message','monologue','playerNarration','stageAction'].includes(step.type))assert.equal(validateDay25V4SourceStep(step),true,`${step.type}:${step.text??step.description}`);};
function enter(){const state=day25ContinuedFixture();beginDay25V4(state);choose(state);choose(state);choose(state);return state;}

test('SCENE04-10 exposes C4-C9 in order with exact source-backed reactions',()=>{const state=enter();for(const [phase,number,suffix] of [['future_position',4,'question'],['home',5,'alone_time'],['listening',6,'name_hurt'],['money',7,'stable'],['work',8,'busy_home'],['pace',9,'schedule']]){assert.equal(state.storyFlags.day25V4.phase,phase);const steps=getDay25V4PlayableFuture(state.storyFlags.day25V4);sourced(steps);assert.equal(steps.at(-1).choiceNumber,number);choose(state,suffix);}const boundary=getDay25V4PlayableFuture(state.storyFlags.day25V4);sourced(boundary);assert.equal(boundary.at(-1).nextScene,11);assert.match(JSON.stringify(boundary),/기다릴 수 있는 것/);});

test('money scene displays frozen current figures without changing them or inventing future income',()=>{const state=enter();choose(state);choose(state);choose(state);let steps=getDay25V4PlayableFuture(state.storyFlags.day25V4);sourced(steps);const joined=JSON.stringify(steps);assert.match(joined,/730000/);assert.match(joined,/42000/);assert.doesNotMatch(joined,/앞으로 벌면 해결|대출 승인|공동 통장/);assert.equal(state.money,730000);});

test('each prior choice reaction is projected once, not duplicated at a scene boundary',()=>{const state=enter();choose(state);let steps=getDay25V4PlayableFuture(state.storyFlags.day25V4);sourced(steps);assert.equal(steps.filter(step=>step.text==='하은은 어느 대답에도 바로 맞장구치지 않았다.').length,1);choose(state,'alone_time');steps=getDay25V4PlayableFuture(state.storyFlags.day25V4);sourced(steps);assert.equal(steps.filter(step=>step.text==='나도 필요할 것 같아.').length,1);});
