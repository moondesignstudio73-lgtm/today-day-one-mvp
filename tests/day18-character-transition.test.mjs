import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const source=readFileSync(new URL('../game.js',import.meta.url),'utf8');
const start=source.indexOf('  if(step.backgroundId||step.backgroundUrl){',source.indexOf('function renderImmersiveStep()'));
const end=source.indexOf('  if (step.type === "transition")',start);
assert.ok(start>=0&&end>start);
const block=source.slice(start,end);

test('DAY18 NPC renderer honors directed jacket and base portraits without changing other days',()=>{
  const fn=source.slice(source.indexOf('function updateImmersiveCharacter('),source.indexOf('function syncOutfitCharacterMedia('));
  const image={dataset:{}},layer={},calls=[];
  const context={immersiveScene:{id:'day18',presentation:{characterId:'player-ex'},activeCharacterAssetUrl:'/jacket.png'},
    LOCKED_DAY1_SCENE_ID:'day1',LOCKED_DAY2_SCENE_ID:'day2',LOCKED_DAY18_SCENE_ID:'day18',
    $:id=>id==='#vnCharacter'?image:layer,getNpcSprite:()=>'/base.png',updateGiftVehicleLayer:()=>{},syncOutfitCharacterMedia:(...args)=>calls.push(args)};
  vm.createContext(context);vm.runInContext(fn,context);
  vm.runInContext('updateImmersiveCharacter()',context);assert.equal(image.src,'/jacket.png');assert.equal(calls.at(-1)[0],true);
  context.immersiveScene.activeCharacterAssetUrl='/base.png';vm.runInContext('updateImmersiveCharacter()',context);assert.equal(image.src,'/base.png');
  context.immersiveScene.id='day17';context.immersiveScene.activeCharacterAssetUrl='/jacket.png';vm.runInContext('updateImmersiveCharacter()',context);assert.equal(image.src,'/base.png');
});

test('DAY18 actual transition handler restores explicit actors after an empty scene',()=>{
  const image={hidden:true},video={hidden:true},calls=[];
  const context={step:{},immersiveScene:{id:'day18',presentation:{characterId:null}},state:{day:18},
    LOCKED_DAY1_SCENE_ID:'day1',LOCKED_DAY2_SCENE_ID:'day2',LOCKED_DAY18_SCENE_ID:'day18',
    $:id=>id==='#vnCharacter'?image:video,getBackgroundAsset:()=>'/background.png',
    applyScenePresentation:()=>{},resolveStoryAudioCue:()=>({sfxIds:[]}),
    sound:{applyStoryAudio:()=>{},playCue:()=>{}},
    updateImmersiveCharacter:expression=>{calls.push([context.immersiveScene.presentation.characterId,expression]);image.hidden=false;}};
  const apply=step=>{context.step={backgroundId:'test',...step};vm.runInNewContext(block,context);};
  apply({characterId:null}); assert.equal(image.hidden,true); assert.equal(calls.length,0);
  apply({characterId:'player-ex',characterAssetUrl:'/yuri.png',expressionId:'calm'});
  assert.equal(image.hidden,false); assert.deepEqual(calls.at(-1),['player-ex','calm']);
  assert.equal(context.immersiveScene.activeCharacterAssetUrl,'/yuri.png');
  apply({characterId:'girlfriend',characterAssetUrl:'/haeun.png'});
  assert.deepEqual(calls.at(-1),['girlfriend','calm']);
  apply({}); assert.equal(calls.length,2,'omitted character does not imply a new actor');
  apply({characterId:null}); assert.equal(image.hidden,true); assert.equal(video.hidden,true);
  context.immersiveScene.id='day17';apply({characterId:'player-ex'});
  assert.equal(calls.length,2,'other day renderers are unchanged');
});
