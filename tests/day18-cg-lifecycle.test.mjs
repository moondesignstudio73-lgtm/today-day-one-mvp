import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {resolveStoryCgAsset} from '../src/story-cg-asset-policy.mjs';

const source=readFileSync(new URL('../game.js',import.meta.url),'utf8');
const cgStart=source.indexOf('  if(step.type==="cgShow"){');
const cgEnd=source.indexOf('  if (step.type === "expressionChange")',cgStart);
const skipStart=source.indexOf('function skipImmersiveScene(event)');
function functionEnd(text,start){let depth=0,opened=false;for(let i=start;i<text.length;i+=1){if(text[i]==='{'){depth+=1;opened=true;}else if(text[i]==='}'&&opened&&--depth===0)return i+1;}return -1;}
const skipEnd=functionEnd(source,skipStart);
assert.ok(cgStart>=0&&cgEnd>cgStart&&skipStart>=0&&skipEnd>skipStart);

test('CG skip cancels its timer, releases the input owner and reaches the next choice',()=>{
  const layer={hidden:true,style:{}},timers=new Map(),locks=new Set(),calls=[];
  const choice={type:'choice',options:[{id:'next'}]};
  const context={step:{type:'cgShow',source:'test.png',duration:2600},sceneAdvanceTimer:null,
    immersiveScene:{id:'day18',sequence:[{type:'cgShow'},choice],presentation:{}},
    $:()=>layer,sound:{stopTransientCues(){},restoreBgm(){}},
    eventRuntime:{active:{sceneId:'day18'},input:{lock:id=>locks.add(id),unlock:id=>locks.delete(id)},
      waitForInput:kind=>{calls.push(kind);return true;},setProgress(){}},
    setTimeout:fn=>{timers.set(1,fn);return 1;},clearTimeout:id=>timers.delete(id),
    renderImmersiveStep:()=>calls.push('advance'),applySkippedScenePresentation:()=>calls.push('presentation'),
    persistEventRuntime(){},renderImmersiveChoices:()=>calls.push('choices')};
  Object.assign(context,{resolveStoryCgAsset,document:{baseURI:'https://example.test/game/index.html'}});
  vm.createContext(context);
  vm.runInContext(`(()=>{${source.slice(cgStart,cgEnd)}})()`,context);
  assert.equal(layer.hidden,false);assert.equal(locks.has('day18'),true);assert.equal(timers.size,1);
  vm.runInContext(`${source.slice(skipStart,skipEnd)};skipImmersiveScene({stopPropagation(){}});`,context);
  assert.equal(layer.hidden,true);assert.equal(locks.size,0);assert.equal(timers.size,0);
  assert.equal(context.sceneAdvanceTimer,null);assert.equal(context.immersiveScene.currentStep,choice);
  assert.deepEqual(calls,['presentation','choice','choices']);
});

test('CG automatic end clears itself and cannot advance a different scene',()=>{
  for(const sameScene of [true,false]) {
    const layer={style:{}},calls=[];let callback;
    const context={step:{type:'cgShow',source:'test.png'},sceneAdvanceTimer:null,immersiveScene:{id:'day18'},$:()=>layer,
      eventRuntime:{input:{lock(){},unlock:id=>calls.push(id)}},clearTimeout(){},setTimeout:fn=>{callback=fn;return 1;},
      renderImmersiveStep:()=>calls.push('advance')};
    Object.assign(context,{resolveStoryCgAsset,document:{baseURI:'https://example.test/game/index.html'}});
    vm.createContext(context);vm.runInContext(`(()=>{${source.slice(cgStart,cgEnd)}})()`,context);
    if(!sameScene)context.immersiveScene={id:'day19'};
    callback();
    assert.equal(layer.hidden,true);assert.equal(context.sceneAdvanceTimer,null);
    assert.deepEqual(calls,sameScene?['day18','advance']:['day18']);
  }
});
