import assert from 'node:assert/strict';
import test from 'node:test';
import {createInitialState} from '../src/game-core.mjs';
import {createGirlfriendFromProfile} from '../src/girlfriend-manager.mjs';
import {GAME_MODES} from '../src/scenario-state.mjs';
import {SaveManager} from '../src/save-manager.mjs';
import {applyDay23V4GameChoice,applyDay23V4GameResolution,completeDay23V4GameChapter,getDay23V4GameCompatibility,getDay23V4GameResumePresentation,getDay23V4GameSegment,isDay23V4ResolutionStep,prepareDay23V4GameEntry} from '../src/day23-v4-game-bridge.mjs';
import {getDay23V4RuntimeResolution} from '../src/day23-v4-runtime-resolution.mjs';
import {getDay23V4Options} from '../src/day23-v4-state-contract.mjs';
import {completedDay22ForDay23} from './day23-v4-fixture.mjs';

function state(route='BUSAN_TRIP',options={}){const value=completedDay22ForDay23(route,options);value.money=100000;value.economyLedger=[];value.storyHistory=[];return value;}
const choose=(state,index=0)=>applyDay23V4GameChoice(state,getDay23V4Options(state.storyFlags.day23V4)[index].id);
function finish(state){let guard=0;while(state.storyFlags.day23V4.phase!=='ending'){assert.ok(guard++<40);const steps=getDay23V4GameSegment(state),cue=steps.find(isDay23V4ResolutionStep);if(cue)applyDay23V4GameResolution(state,getDay23V4RuntimeResolution(state,cue));else choose(state);}return getDay23V4GameSegment(state);}
function storage(){const data=new Map();return {setItem:(key,value)=>data.set(key,value),getItem:key=>data.get(key)??null,removeItem:key=>data.delete(key)};}

test('bridge preserves legacy entry and starts V4 only from verified DAY22 history',()=>{
  const fresh=state();assert.equal(getDay23V4GameCompatibility(fresh).mode,'V4_NEW');assert.equal(prepareDay23V4GameEntry(fresh).mode,'V4');assert.equal(getDay23V4GameSegment(fresh).at(-1).choiceNumber,1);
  const legacy={storyFlags:{day22RuntimeComplete:true,day23RuntimeStage:1}};assert.equal(getDay23V4GameCompatibility(legacy).mode,'LEGACY');assert.equal(legacy.storyFlags.day23V4,undefined);
});

test('Busan bridge stitches every playable, resolves current responses, and charges one souvenir once',()=>{
  const s=state();prepareDay23V4GameEntry(s);const before=s.money,all=[];let guard=0;
  while(s.storyFlags.day23V4.phase!=='ending'){
    assert.ok(guard++<40);const steps=getDay23V4GameSegment(s);all.push(...steps);const cue=steps.find(isDay23V4ResolutionStep);const packet=cue?applyDay23V4GameResolution(s,getDay23V4RuntimeResolution(s,cue)):choose(s);
    assert.equal(packet.steps.some(step=>/Boundary$/.test(step.type)),false);for(const transition of packet.steps.filter(step=>step.type==='transition')){assert.ok(transition.backgroundUrl);assert.ok(transition.storyClock);}
  }
  const final=getDay23V4GameSegment(s);all.push(...final);assert.ok(final.some(step=>step.type==='transition'&&step.sceneNumber===24));assert.equal(final.at(-1).type,'chapterCompletionCue');assert.equal(s.money,before-3000);assert.equal(s.economyLedger.filter(entry=>entry.label==='DAY 23 작은 여행 기념품').length,1);assert.deepEqual(s.storyFlags.day23V4SouvenirPurchase,{day:23,itemId:'day23-small-postcard',cost:3000,ledgerIndex:0});assert.doesNotThrow(()=>getDay23V4GameResumePresentation(s));
});

test('Seoul and no-travel bridge presentation never creates Busan lodging or absent characters',()=>{
  for(const route of ['SEOUL_DAY','NO_TRAVEL']){const s=state(route);prepareDay23V4GameEntry(s);const all=[];let guard=0;while(s.storyFlags.day23V4.phase!=='ending'){assert.ok(guard++<40);const steps=getDay23V4GameSegment(s);all.push(...steps);const cue=steps.find(isDay23V4ResolutionStep);if(cue)applyDay23V4GameResolution(s,getDay23V4RuntimeResolution(s,cue));else choose(s);}all.push(...getDay23V4GameSegment(s));const rendered=all.map(step=>`${step.backgroundId??''} ${step.speaker??step.sender??''} ${step.text??''}`).join('\n');assert.doesNotMatch(rendered,/day22-busan-lodging|숙소 물건은 가져가면|가방을 거의 비웠/);if(route==='NO_TRAVEL'){assert.equal(all.some(step=>step.type==='transition'&&step.characterId),false);assert.doesNotMatch(rendered,/하은|day22-busan-station/);}assert.equal(s.money,100000);assert.equal(s.economyLedger.length,0);}
});

test('resolution and purchase failures restore chapter, money, ledger, and purchase atomically',()=>{
  const s=state();prepareDay23V4GameEntry(s);while(s.storyFlags.day23V4.phase!=='souvenir_resolution'){const steps=getDay23V4GameSegment(s),cue=steps.find(isDay23V4ResolutionStep);if(cue)applyDay23V4GameResolution(s,getDay23V4RuntimeResolution(s,cue));else choose(s);}
  const before={chapter:structuredClone(s.storyFlags.day23V4),money:s.money,ledger:structuredClone(s.economyLedger)};assert.throws(()=>applyDay23V4GameResolution(s,{type:'souvenirPurchaseResponse',purchased:true,itemId:'fake-expensive',cost:s.money+1}),/BUDGET_CHANGED/);assert.deepEqual(s.storyFlags.day23V4,before.chapter);assert.equal(s.money,before.money);assert.deepEqual(s.economyLedger,before.ledger);assert.equal(s.storyFlags.day23V4SouvenirPurchase,undefined);
});

test('completion records route history once, opens DAY24 once, and suppresses legacy Free Action state',()=>{
  const s=state('NO_TRAVEL');prepareDay23V4GameEntry(s);const cue=finish(s).at(-1);completeDay23V4GameChapter(s,cue);completeDay23V4GameChapter(s,cue);assert.equal(s.storyFlags.day23V4.complete,true);assert.equal(s.storyFlags.day22V4Day23HookPending,false);assert.equal(s.storyFlags.day23V4Day24HookPending,true);assert.equal(s.storyHistory.length,1);assert.equal(s.storyHistory[0].scenarioId,'day23-notion-v4');assert.equal(s.storyHistory[0].route,'NO_TRAVEL');assert.equal(s.storyFlags.day23RuntimeComplete,true);assert.equal(s.pendingStoryId,null);assert.equal(s.storyFlags.day23FreeActionComplete,undefined);
});

test('SaveManager round-trip preserves a mid-DAY23 checkpoint and resume presentation',()=>{
  const s=state('SEOUL_DAY');prepareDay23V4GameEntry(s);for(let index=0;index<7;index++){const steps=getDay23V4GameSegment(s),cue=steps.find(isDay23V4ResolutionStep);if(cue)applyDay23V4GameResolution(s,getDay23V4RuntimeResolution(s,cue));else choose(s);}const expected=getDay23V4GameSegment(s),store=storage(),shell=createInitialState(createGirlfriendFromProfile('haeun',()=>.5),()=>.5,{mode:GAME_MODES.MARRIAGE_30});Object.assign(shell,s);SaveManager.save(shell,store);const loaded=SaveManager.load(store,GAME_MODES.MARRIAGE_30);assert.deepEqual(loaded.storyFlags.day23V4,s.storyFlags.day23V4);assert.deepEqual(getDay23V4GameSegment(loaded),expected);assert.deepEqual(getDay23V4GameResumePresentation(loaded),getDay23V4GameResumePresentation(s));
});

test('runtime resolutions stay route, relationship, consent, and budget constrained',()=>{
  const busan=state();prepareDay23V4GameEntry(busan);assert.equal(getDay23V4RuntimeResolution(busan,{type:'souvenirPurchaseCue'}).purchased,true);busan.money=0;assert.deepEqual(getDay23V4RuntimeResolution(busan,{type:'souvenirPurchaseCue'}),{type:'souvenirPurchaseResponse',purchased:false});assert.equal(getDay23V4RuntimeResolution(busan,{type:'relationshipConsentCue'}).outcome,'CONTINUE');assert.equal(getDay23V4RuntimeResolution(busan,{type:'farewellContactConsentCue'}).accepted,true);
  const solo=state('NO_TRAVEL');prepareDay23V4GameEntry(solo);assert.equal(getDay23V4RuntimeResolution(solo,{type:'meetingConsentCue'}).accepted,false);assert.equal(getDay23V4RuntimeResolution(solo,{type:'conversationConsentCue'}).accepted,false);assert.throws(()=>getDay23V4RuntimeResolution(solo,{type:'unknown'}),/UNKNOWN/);
});
