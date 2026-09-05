import assert from 'node:assert/strict';
import test from 'node:test';
import {getDay21V4PlayableDeferred} from '../src/day21-v4-playable-deferred.mjs';
import {getDay21V4Options} from '../src/day21-v4-state-contract.mjs';
import {validateDay21V4SourceStep} from '../src/day21-v4-source-selection.mjs';
import {chooseDay21,day21State} from './day21-v4-fixture.mjs';

const assertSourced=steps=>{for(const step of steps)if(step.source)assert.equal(validateDay21V4SourceStep(step),true,`${step.type}:${step.text??step.actionLabel}`);};
const reachDeferred=(state)=>{chooseDay21(state);chooseDay21(state);const options=getDay21V4Options(state.storyFlags.day21V4);chooseDay21(state,options.length===1?0:2);};

test('deferred route completes its own choices without learning Haeun story',()=>{const s=day21State();reachDeferred(s);for(const number of [4,5,6,7,8]){const steps=getDay21V4PlayableDeferred(s.storyFlags.day21V4);assert.equal(steps.at(-1).choiceNumber,number);assert.equal(steps.at(-1).variant,'DEFERRED');assertSourced(steps);chooseDay21(s);}const ending=getDay21V4PlayableDeferred(s.storyFlags.day21V4);assert.equal(ending.at(-1).type,'chapterCompletionCue');assert.equal(ending.some(step=>/맛있었던 첫입|양말을 보고/.test(step.text??'')),false);assert.equal(s.storyFlags.day21V4.facts.heardHaeunStory,false);assert.equal(s.storyFlags.day21V4.facts.bookingConfirmed,false);assertSourced(ending);});

test('no-contact deferred route emits no messages to or from Haeun',()=>{const s=day21State({relationshipActive:false,contactAllowed:false,relationshipTone:'DIFFICULT',morningMode:'SOLO_MORNING',day20VisitMode:'SOLO',day20StayedOver:false});reachDeferred(s);while(s.storyFlags.day21V4.phase!=='ending'){const steps=getDay21V4PlayableDeferred(s.storyFlags.day21V4);assert.equal(steps.some(step=>step.type==='message'),false);chooseDay21(s);}const ending=getDay21V4PlayableDeferred(s.storyFlags.day21V4);assert.equal(ending.some(step=>step.type==='message'),false);assert.equal(ending.at(-1).type,'chapterCompletionCue');assertSourced(ending);});

test('promised-contact choices appear only when a real deferred reply exists',()=>{const none=day21State();reachDeferred(none);let options=getDay21V4Options(none.storyFlags.day21V4);assert.equal(options.some(option=>option.id.endsWith('_check_minho_date')),false);chooseDay21(none);chooseDay21(none);chooseDay21(none);options=getDay21V4Options(none.storyFlags.day21V4);assert.equal(options.some(option=>option.id.endsWith('_finish_promised_reply')),false);const promised=day21State({day19MinhoReply:'REPLY_TOMORROW'});reachDeferred(promised);options=getDay21V4Options(promised.storyFlags.day21V4);assert.equal(options.some(option=>option.id.endsWith('_check_minho_date')),true);});
