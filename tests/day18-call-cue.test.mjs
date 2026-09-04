import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const source=readFileSync(new URL('../game.js',import.meta.url),'utf8');
const start=source.indexOf('  if(step.type==="phoneCallCue"){');
const end=source.indexOf('  if(step.type==="itemShow")',start);
assert.ok(start>=0&&end>start);
const handler=`(()=>{${source.slice(start,end)}})()`;

test('actual phone cue handler clears stale speech without writing dialogue or history',()=>{
  for(const status of ['silence','ended']) {
    const attributes={},classes=new Set(['narration-mode','is-typing','hidden']);
    const node={textContent:'old speech',classList:{remove:(...names)=>names.forEach(n=>classes.delete(n))}};
    const stage={dataset:{},classList:node.classList,querySelector:()=>({setAttribute:(k,v)=>attributes[k]=v})};
    const title={...node},text={...node},calls=[];
    const context={step:{type:'phoneCallCue',status,speaker:'하은'},
      $:id=>id==='#visualNovelStage'?stage:id==='#sceneTitle'?title:text,
      finishDialogueTyping:()=>calls.push('finish'),setStoryMessagePresentation:s=>calls.push(s),
      queueSceneStep:delay=>calls.push(delay)};
    vm.runInNewContext(handler,context);
    assert.equal(text.textContent,'');
    assert.equal(title.textContent,status==='ended'?'통화 종료':'하은');
    assert.equal(stage.dataset.callCue,status);
    assert.equal(attributes['aria-label'],status==='ended'?'통화 종료':'통화 중 · 잠시 침묵');
    assert.equal(calls[0],'finish');
    assert.equal(calls.at(-1),1200,'existing queue owns input locking and cancellation');
    assert.equal(classes.size,0);
    assert.equal(status==='ended'?calls[1]===null:calls[1].device==='call',true);
  }
  assert.match(source,/delete stage\.dataset\.callCue/);
  assert.ok(start<source.indexOf('if(isInternalStoryStep(step)||!isPlayerFacingStoryStep(step))'));
});
