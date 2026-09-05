import assert from 'node:assert/strict';
import test from 'node:test';
import {beginDay18V4,applyDay18V4Choice,completeDay18V4} from '../src/day18-v4-state-contract.mjs';
import {beginDay19V4,applyDay19V4Choice,completeDay19V4,getDay19V4Options} from '../src/day19-v4-state-contract.mjs';
import {getDay20V4Options} from '../src/day20-v4-state-contract.mjs';
import {applyDay20V4GameChoice,applyDay20V4GameResolution,completeDay20V4GameChapter,getDay20V4GameSegment,prepareDay20V4GameEntry} from '../src/day20-v4-game-bridge.mjs';
import {getDay20V4RuntimeResolution} from '../src/day20-v4-runtime-resolution.mjs';

function prior(shared=true,discussionPending=false){
  const partner=shared?'HAEUN':'SOLO',s={day:20,money:42000,breakup:null,ended:false,storyHistory:[],pendingStoryId:'m30-day20-current-shared-meal',storyFlags:{day17V4Completed:true,day17V4Day18HookPending:true,day17V4TomorrowPlan:partner,day17V4Choice9:shared?'day17_v4_life_haeun':'day17_v4_life_solo',day17V4DinnerAgreement:{day:18,partner,status:'ACCEPTED',sourceChoiceId:shared?'day17_v4_life_haeun':'day17_v4_life_solo'},day16V4YuriEncountered:false,day16V4YuriContact:'ENDED_HERE',day16V4YuriInvitation:'NONE'}};
  beginDay18V4(s,shared?{}:{haeunContactAllowed:false});
  for(const key of shared?['morning_keep','disclose_together','menu_each','topic_good','close_home','night_good','calm_trip','travel_near']:['morning_solo','menu_familiar','solo_food','return_home','alone_stop','travel_life'])applyDay18V4Choice(s,`day18_v4_${key}`);
  completeDay18V4(s,{type:'chapterCompletionCue',day:18,finalSceneReached:true});beginDay19V4(s);
  while(s.storyFlags.day19V4.phase!=='ending'){
    const phase=s.storyFlags.day19V4.phase,options=getDay19V4Options(s.storyFlags.day19V4),index=shared&&phase==='dinner'?options.findIndex(option=>option.id.endsWith('_tomorrow_home')):0;
    applyDay19V4Choice(s,options[Math.max(0,index)].id);
  }
  if(discussionPending)s.storyFlags.day19V4.input.day18DiscussionPending=true;
  completeDay19V4(s,{type:'chapterCompletionCue',day:19,finalSceneReached:true});return s;
}

const suffixByRoute=Object.freeze({
  face:{closeness:'current_distance',night_end:'end_here'},
  short:{preparation:'short_tea'},
  conflict:{dinner:'disclose'},
  stay:{extension:'stay_longer',closeness:'current_distance',next_evening:'another_evening',night_end:'offer_stay'},
  leave:{closeness:'current_distance',night_end:'end_here'}
});

function play(route){
  const s=prior(route!=='solo',route==='conflict');prepareDay20V4GameEntry(s);const segments=[...getDay20V4GameSegment(s)];let guard=0;
  while(s.storyFlags.day20V4.phase!=='ending'){
    assert.ok(guard++<24,`${route}: loop`);const chapter=s.storyFlags.day20V4,phase=chapter.phase;
    if(phase==='contact_resolution'||phase==='stay_resolution'){
      const step=getDay20V4GameSegment(s).at(-1),packet=applyDay20V4GameResolution(s,getDay20V4RuntimeResolution(chapter,step));segments.push(...packet.steps);continue;
    }
    const options=getDay20V4Options(chapter),suffix=suffixByRoute[route]?.[phase];
    const selected=suffix?options.find(option=>option.id.endsWith(`_${suffix}`)):options[0];assert.ok(selected,`${route}:${phase}:${suffix}`);
    segments.push(...applyDay20V4GameChoice(s,selected.id).steps);
  }
  const final=getDay20V4GameSegment(s);segments.push(...final);completeDay20V4GameChapter(s,final.at(-1));return {s,segments};
}

for(const route of ['face','short','solo','conflict','stay','leave'])test(`DAY20 ${route} bridge route completes without invented cross-route facts`,()=>{
  const {s,segments}=play(route),chapter=s.storyFlags.day20V4,scenes=new Set(segments.filter(step=>step.type==='transition').map(step=>step.sceneNumber));
  assert.equal(chapter.complete,true);assert.equal(s.storyFlags.day20RuntimeComplete,true);assert.equal(s.storyHistory.filter(record=>record.sceneId==='m30-day20-current-shared-meal').length,1);
  assert.equal(segments.some(step=>/Boundary$/.test(step.type)),false);assert.equal(segments.some(step=>/DAY19에서|이 경로|선택 회수|내부 메모/.test(step.text??'')),false);
  if(route==='solo'){assert.equal(chapter.input.visitMode,'SOLO');assert.equal(segments.some(step=>step.speaker==='하은'||step.sender==='하은'),false);assert.equal(chapter.facts.firstHug,false);assert.equal(chapter.facts.stayedOver,false);assert.ok(scenes.has(23));}
  if(route==='short'){assert.equal(chapter.facts.preparation,'SHORT_TEA');assert.equal([...scenes].some(number=>number>=12&&number<=18),false);assert.equal(chapter.facts.stayedOver,false);}
  if(route==='conflict'){assert.ok(scenes.has(19));assert.ok(scenes.has(21));assert.equal([...scenes].some(number=>number>=12&&number<=18),false);assert.equal(chapter.facts.stayedOver,false);}
  if(route==='stay'){assert.equal(chapter.facts.stayedOver,true);assert.equal(chapter.facts.sleepingPlan.arrangement,'SEPARATE_BEDDING');assert.ok(scenes.has(22));assert.equal(scenes.has(21),false);}
  if(['face','leave'].includes(route)){assert.equal(chapter.facts.stayedOver,false);assert.ok(scenes.has(21));assert.equal(scenes.has(22),false);}
});
