import assert from 'node:assert/strict';
import test from 'node:test';
import {existsSync,readFileSync} from 'node:fs';
import {DAY18_AUDIO_CUES,validateDay18AudioData} from '../src/day18-audio-data.mjs';
import {SoundManager} from '../src/sound-manager.mjs';
import {beginDay18V4} from '../src/day18-v4-state-contract.mjs';
import {getDay18V4PlayableSegment} from '../src/day18-v4-playable-script.mjs';

function fresh(){const state={storyFlags:{day17V4Completed:true,day17V4Day18HookPending:true,day17V4TomorrowPlan:'SOLO',day17V4DinnerAgreement:{day:18,partner:'SOLO',status:'NONE',sourceChoiceId:null}}};beginDay18V4(state);return state;}

test('DAY18 morning alarm waits for a player action before the toe movement',()=>{
  const steps=getDay18V4PlayableSegment(fresh().storyFlags.day18V4);
  const at=steps.findIndex(step=>step.type==='alarmAction');
  assert.ok(at>=0);
  assert.deepEqual(steps[at],{type:'alarmAction',source:'assets/events/day18-v4/morning-alarm-off-v1.png',fit:'contain',sfxId:'SFX_DAY18_PHONE_ALARM',actionLabel:'눌러서 알람 끄기'});
  assert.deepEqual(steps.slice(at+1,at+4).map(step=>step.source?.split('/').at(-1)),['morning-feet-rest-v1.png','morning-feet-flex-v1.png','morning-feet-rest-v1.png']);
  assert.equal(steps.some(step=>step.type==='cgShow'&&step.source?.includes('morning-alarm-off')),false);
});

test('DAY18 alarm has a dedicated looping wav and the renderer stops it on action and SKIP',()=>{
  assert.equal(validateDay18AudioData(),true);
  const cue=DAY18_AUDIO_CUES.SFX_DAY18_PHONE_ALARM;
  assert.ok(existsSync(new URL(`../${cue.source}`,import.meta.url)));
  const audios=[];
  const manager=new SoundManager({storage:{getItem:()=> 'on',setItem(){}},audioFactory:source=>{const audio={source,paused:true,loop:false,volume:0,play(){this.paused=false;return Promise.resolve();},pause(){this.paused=true;}};audios.push(audio);return audio;}});
  assert.equal(manager.playCue('SFX_DAY18_PHONE_ALARM',{cooldownMs:0}),true);
  assert.equal(audios.at(-1).loop,true);
  assert.equal(manager.stopCue('SFX_DAY18_PHONE_ALARM'),true);
  assert.equal(audios.at(-1).paused,true);
  const game=readFileSync(new URL('../game.js',import.meta.url),'utf8');
  for(const marker of ['step.type==="alarmAction"','sound.playCue(step.sfxId,{cooldownMs:0})','sound.stopCue(immersiveScene.currentStep.sfxId)','delete alarmStage.dataset.alarmAction'])assert.ok(game.includes(marker),marker);
});
