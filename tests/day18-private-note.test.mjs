import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const source=readFileSync(new URL('../game.js',import.meta.url),'utf8');
const start=source.indexOf('  if(step.type==="privateNote"){');
const end=source.indexOf('  if(step.type==="phoneCallCue")',start);
assert.ok(start>=0&&end>start);
test('private note uses a separate escaped document and ordinary story input without adding dialogue history',()=>{
  for(const lines of [['<말>'],[]]) {
    const note={setAttribute:()=>{}},attrs={},calls=[];
    const stage={append:n=>calls.push(n),classList:{add:c=>calls.push(c)},setAttribute:(k,v)=>attrs[k]=v};
    const context={step:{type:'privateNote',lines},document:{createElement:()=>note},$:()=>stage,
      finishDialogueTyping:()=>{},setStoryMessagePresentation:s=>assert.equal(s,null),
      escapeHtml:s=>s.replaceAll('<','&lt;').replaceAll('>','&gt;'),
      immersiveScene:{index:3},eventRuntime:{active:{sceneId:'day18'},waitForInput:t=>{calls.push(t);return true;}},
      persistEventRuntime:()=>calls.push('persist'),scheduleAutoAdvance:()=>calls.push('auto')};
    vm.runInNewContext(`(()=>{${source.slice(start,end)}})()`,context);
    assert.equal(note.className,'story-private-note');
    assert.equal(attrs['aria-label'],'메모 읽고 닫기');
    assert.ok(calls.includes('dialogue'));
    assert.match(note.innerHTML,lines.length?/&lt;말&gt;/:/아직 적은 말이 없다/);
    assert.doesNotMatch(note.innerHTML,/<말>/);
  }
  assert.match(source,/querySelector\("\.story-private-note"\)\?\.remove\(\)/);
  assert.match(source,/classList\.remove\("private-note-active"\)/);
});

test('normal advance, skipped presentation and scene end all clear the private note idempotently',()=>{
  const begin=source.indexOf('function clearStoryPrivateNote(){');
  const stop=source.indexOf('function setStoryMessagePresentation',begin);
  assert.ok(begin>=0&&stop>begin);
  let exists=true,removed=0,label='메모 읽고 닫기';
  const classes=new Set(['private-note-active','other-ui']);
  const stage={querySelector:()=>exists?{remove:()=>{exists=false;removed++;}}:null,
    classList:{contains:c=>classes.has(c),remove:c=>classes.delete(c)},
    setAttribute:(k,v)=>{if(k==='aria-label')label=v;}};
  vm.runInNewContext(`${source.slice(begin,stop)}clearStoryPrivateNote();clearStoryPrivateNote();`,{$:()=>stage});
  assert.equal(exists,false);assert.equal(removed,1);assert.equal(label,'대화 전체 표시');
  assert.deepEqual([...classes],['other-ui']);
  assert.match(source,/function renderImmersiveStep\(\)\s*\{\s*if \(!immersiveScene\) return;\s*clearStoryPrivateNote\(\)/);
  assert.match(source,/function setStoryMessagePresentation\(step\)\{\s*clearStoryPrivateNote\(\)/);
  assert.match(source,/function finishImmersiveScene\(\)\s*\{\s*clearStoryPrivateNote\(\)/);
});
