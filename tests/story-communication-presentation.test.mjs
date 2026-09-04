import test from 'node:test';
import assert from 'node:assert/strict';
import {getStoryCommunicationPresentation as mode} from '../src/story-communication-presentation.mjs';
test('call captions and message bubbles are mutually exclusive',()=>{
  assert.deepEqual(mode({type:'dialogue',speaker:'하은',device:'call'}),{message:false,call:true,side:'incoming',label:'통화 · 하은'});
  assert.deepEqual(mode({type:'message',sender:'나'}),{message:true,call:false,side:'outgoing',label:'문자 · 나'});
  assert.deepEqual(mode({type:'monologue',text:'생각'}),{message:false,call:false,side:'incoming',label:'대화'});
  assert.equal(mode({type:'dialogue',speaker:'하은'}).call,false);
});
