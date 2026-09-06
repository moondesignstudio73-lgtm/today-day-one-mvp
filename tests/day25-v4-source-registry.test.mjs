import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import {DAY25_V4_SOURCE_PAGE_ID,DAY25_V4_SOURCE_SCENES,DAY25_V4_SOURCE_SHA256} from '../src/day25-v4-source-registry.mjs';
import {day25V4SourceRef,validateDay25V4SourceStep} from '../src/day25-v4-source-selection.mjs';

test('DAY25 registry preserves 24 scenes and all route-specific choice blocks',()=>{
  assert.equal(DAY25_V4_SOURCE_PAGE_ID,'3c9c31f0-29a6-81c0-93a3-d109c07f6995');
  assert.deepEqual(DAY25_V4_SOURCE_SCENES.map(scene=>scene.number),Array.from({length:24},(_,index)=>index+1));
  const choices=DAY25_V4_SOURCE_SCENES.flatMap(scene=>scene.choices);
  assert.equal(choices.length,20);
  assert.equal(choices.every(choice=>choice.labels.length===(choice.variant==='HAEUN_FUTURE'&&choice.number===10?4:3)),true);
  assert.deepEqual(choices.filter(choice=>choice.variant==='COMMON_OPENING').map(choice=>choice.number),[1,2,3]);
  assert.deepEqual(choices.filter(choice=>choice.variant==='HAEUN_FUTURE').map(choice=>choice.number),[4,5,6,7,8,9,10,11,12,13]);
  assert.deepEqual(choices.filter(choice=>choice.variant==='SOLO_FUTURE').map(choice=>choice.number),[4,5,6]);
  assert.deepEqual(choices.filter(choice=>choice.variant==='NEW_MEETING').map(choice=>choice.number),[7]);
  assert.deepEqual(choices.filter(choice=>choice.variant==='HAEUN_SOCIAL').map(choice=>choice.number),[14,15,16]);
  assert.equal(choices.find(choice=>choice.variant==='HAEUN_FUTURE'&&choice.number===10).labels.length,4);
  const raw=readFileSync(new URL('../docs/scenarios/DAY25_SCENARIO_V4_NOTION.md',import.meta.url),'utf8').replace(/\r\n/g,'\n');
  assert.equal(createHash('sha256').update(raw).digest('hex'),DAY25_V4_SOURCE_SHA256);
});

test('DAY25 source references reject invented narration',()=>{
  const exact='**하은** “통장 화면을 지금 다 보여 달라는 건 아니야. 우리가 같이 책임질 수 있는 게 뭔지는 같이 알아야 할 것 같아.”';
  const source=day25V4SourceRef(8,exact);
  assert.equal(validateDay25V4SourceStep({type:'dialogue',source}),true);
  assert.throws(()=>day25V4SourceRef(8,'DAY24 플래그를 확인한다.'),/DAY25_SOURCE_LINE_MISSING/);
});
