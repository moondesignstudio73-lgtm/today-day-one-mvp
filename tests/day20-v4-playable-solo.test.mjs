import assert from 'node:assert/strict';
import test from 'node:test';
import {beginDay18V4,applyDay18V4Choice,completeDay18V4} from '../src/day18-v4-state-contract.mjs';
import {beginDay19V4,applyDay19V4Choice,completeDay19V4,getDay19V4Options} from '../src/day19-v4-state-contract.mjs';
import {applyDay20V4Choice,beginDay20V4,getDay20V4Options} from '../src/day20-v4-state-contract.mjs';
import {getDay20V4PlayableSolo} from '../src/day20-v4-playable-solo.mjs';
import {validateDay20V4SourceStep} from '../src/day20-v4-source-selection.mjs';

function state(){const s={breakup:null,ended:false,money:42000,storyFlags:{day17V4Completed:true,day17V4Day18HookPending:true,day17V4TomorrowPlan:'SOLO',day17V4Choice9:'day17_v4_life_solo',day17V4DinnerAgreement:{day:18,partner:'SOLO',status:'ACCEPTED',sourceChoiceId:'day17_v4_life_solo'},day16V4YuriEncountered:false,day16V4YuriContact:'ENDED_HERE',day16V4YuriInvitation:'NONE'}};beginDay18V4(s,{haeunContactAllowed:false});for(const key of['morning_solo','menu_familiar','solo_food','return_home','alone_stop','travel_life'])applyDay18V4Choice(s,`day18_v4_${key}`);completeDay18V4(s,{type:'chapterCompletionCue',day:18,finalSceneReached:true});beginDay19V4(s);while(s.storyFlags.day19V4.phase!=='ending')applyDay19V4Choice(s,getDay19V4Options(s.storyFlags.day19V4)[0].id);completeDay19V4(s,{type:'chapterCompletionCue',day:19,finalSceneReached:true});beginDay20V4(s);return s;}
const sourced=steps=>{for(const step of steps)if(['dialogue','message','monologue','stageAction'].includes(step.type))assert.equal(validateDay20V4SourceStep(step),true);};

test('solo C5 through C8 stays source-backed and ends without Haeun or intimacy',()=>{const s=state();for(const number of[5,6,7,8]){const options=getDay20V4Options(s.storyFlags.day20V4);applyDay20V4Choice(s,options[0].id);const steps=getDay20V4PlayableSolo(s.storyFlags.day20V4);sourced(steps);if(number<8)assert.equal(steps.at(-1).choiceNumber,number+1);else{assert.equal(steps.at(-1).type,'chapterCompletionCue');assert.equal(steps.some(step=>step.speaker==='하은'||step.sender==='하은'),false);}}assert.equal(s.storyFlags.day20V4.facts.firstHug,false);assert.equal(s.storyFlags.day20V4.facts.stayedOver,false);});

test('contact-blocked solo offers only rest and sends no invented message',()=>{const s=state();for(let i=0;i<3;i++)applyDay20V4Choice(s,getDay20V4Options(s.storyFlags.day20V4)[0].id);const options=getDay20V4Options(s.storyFlags.day20V4);assert.deepEqual(options.map(option=>option.label),['오늘은 푹 쉬자.']);applyDay20V4Choice(s,options[0].id);const steps=getDay20V4PlayableSolo(s.storyFlags.day20V4);assert.equal(steps.some(step=>step.type==='message'),false);sourced(steps);});
