import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const source=readFileSync(new URL('../game.js',import.meta.url),'utf8');
const start=source.indexOf('  if(step.type==="phoneCallCue"){');
const end=source.indexOf('  if(step.type==="itemShow")',start);
assert.ok(start>=0&&end>start);
const handler=`(()=>{${source.slice(start,end)}})()`;
const roomStart=source.indexOf('  if(step.type==="roomActionCue"||step.type==="storyActionCue"||step.type==="finalFadeCue"){');
const roomEnd=source.indexOf('  if(step.type==="itemShow")',roomStart);
assert.ok(roomStart>=0&&roomEnd>roomStart);
const roomHandler=`(()=>{${source.slice(roomStart,roomEnd)}})()`;
const clearStart=source.indexOf('function clearStoryActionPresentation(){');
const clearEnd=source.indexOf('\nfunction setStoryMessagePresentation',clearStart);
assert.ok(clearStart>=0&&clearEnd>clearStart);
const clearHandler=`(${source.slice(clearStart,clearEnd)})()`;

test('actual phone cue handler clears stale speech without writing dialogue or history',()=>{
  for(const status of ['silence','grip-shift','ended']) {
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
    assert.equal(attributes['aria-label'],status==='ended'?'통화 종료':status==='grip-shift'?'통화 중 · 휴대전화를 다른 손으로 옮김':'통화 중 · 잠시 침묵');
    assert.equal(calls[0],'finish');
    assert.equal(calls.at(-1),status==='grip-shift'?650:1200,'existing queue owns input locking and cancellation');
    assert.equal(classes.size,0);
    assert.equal(status==='ended'?calls[1]===null:calls[1].device==='call',true);
  }
  assert.match(source,/delete stage\.dataset\.callCue/);
  const css=readFileSync(new URL('../styles.css',import.meta.url),'utf8');
  assert.match(css,/data-call-cue="grip-shift"/);
  assert.match(css,/@keyframes day18-phone-grip-shift/);
  assert.match(css,/prefers-reduced-motion:reduce/);
  assert.ok(start<source.indexOf('if(isInternalStoryStep(step)||!isPlayerFacingStoryStep(step))'));
});

test('room, scene actions and final fade are visual cues, not dialogue or history entries',()=>{
  for(const step of [
    {type:'roomActionCue',status:'desk-reset',actionLabel:'컵을 제자리에 두고 의자를 밀어 넣음',duration:1000},
    {type:'storyActionCue',status:'cup-square',actionLabel:'주인공이 컵을 식탁에 바로 놓음',duration:650},
    {type:'finalFadeCue',actionLabel:'방의 불빛이 천천히 어두워짐',duration:1400}
  ]) {
    const attributes={},classes=new Set(['narration-mode','is-typing']);
    const node={textContent:'stale',classList:{add:(...names)=>names.forEach(n=>classes.add(n)),remove:(...names)=>names.forEach(n=>classes.delete(n))}};
    const stage={dataset:{},classList:node.classList,querySelector:()=>({setAttribute:(k,v)=>attributes[k]=v})};
    const title={...node},sceneText={...node},calls=[];
    vm.runInNewContext(roomHandler,{step,$:id=>id==='#visualNovelStage'?stage:id==='#sceneTitle'?title:sceneText,
      finishDialogueTyping:()=>calls.push('finish'),setStoryMessagePresentation:value=>calls.push(value),queueSceneStep:delay=>calls.push(delay)});
    assert.equal(sceneText.textContent,'');
    assert.equal(title.textContent,'');
    assert.equal(attributes['aria-label'],step.actionLabel);
    const datasetKey=step.type==='finalFadeCue'?'finalFade':step.type==='roomActionCue'?'roomAction':'storyAction';
    assert.equal(stage.dataset[datasetKey],step.type==='finalFadeCue'?'active':step.status);
    assert.deepEqual(calls,['finish',null,step.duration]);
    assert.equal(classes.has('narration-mode'),false);
    assert.equal(classes.has('is-typing'),false);
  }
  const css=readFileSync(new URL('../styles.css',import.meta.url),'utf8');
  for(const status of ['phone-close','wardrobe-check','desk-reset','sleep-ready','alarm-set','entry-shoes','wardrobe-hang','fridge-check']) assert.match(css,new RegExp(`data-room-action="${status}"`));
  for(const status of ['crosswalk-wait','crosswalk-cross','ride-wait','yuri-napkin-fold','haeun-napkin-fold','cup-square','yuri-gaze-lower','yuri-hand-stop','haeun-expression-soften','meal-decision-pause','napkin-pull','phone-smile','yuri-outerwear-close']) assert.match(css,new RegExp(`data-story-action="${status}"`));
  assert.match(css,/data-final-fade="active"/);
  assert.match(source,/delete alarmStage\.dataset\.roomAction;delete alarmStage\.dataset\.storyAction;delete alarmStage\.dataset\.finalFade/);
});

test('opening a choice clears the preceding action cue and its accessible label',()=>{
  const stageAttributes={'aria-label':'이전 알람 행동'};
  const dialogueAttributes={'aria-label':'주인공이 컵을 식탁에 바로 놓음'};
  const makeAttributes=attributes=>({
    removeAttribute:key=>delete attributes[key]
  });
  const stage={
    dataset:{callCue:'silence',roomAction:'desk-reset',storyAction:'cup-square',finalFade:'active'},
    ...makeAttributes(stageAttributes),
    querySelector:()=>makeAttributes(dialogueAttributes)
  };
  vm.runInNewContext(clearHandler,{$:()=>stage});
  assert.deepEqual({...stage.dataset},{});
  assert.equal('aria-label' in stageAttributes,false);
  assert.equal('aria-label' in dialogueAttributes,false);

  const choiceStart=source.indexOf('function renderImmersiveChoices(options=[]) {');
  const layerSetup=source.indexOf('  const layer=$("#storyChoiceLayer");',choiceStart);
  const cleanup=source.indexOf('  clearStoryActionPresentation();',choiceStart);
  assert.ok(choiceStart>=0&&cleanup>choiceStart&&cleanup<layerSetup,'choice cleanup runs before the choice layer is opened');
});
