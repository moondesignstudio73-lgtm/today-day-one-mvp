import {beginDay22V4,completeDay22V4,getDay22V4Options,resolveDay22V4Contact,resolveDay22V4Photo,applyDay22V4Choice} from '../src/day22-v4-state-contract.mjs';
import {applyDay23V4Choice,getDay23V4Options} from '../src/day23-v4-state-contract.mjs';
import {completedDay21ForDay22} from './day22-v4-fixture.mjs';

const ensure=(value,message)=>{if(!value)throw new Error(message);};

export function completedDay22ForDay23(route,options={}){
  const state=completedDay21ForDay22(route,options);
  state.day=23;state.storyHistory??=[];state.scenario??={unlockedActions:[]};state.scenario.unlockedActions??=[];
  if(options.jihoon)state.scenario.unlockedActions.push('past-contacts-index');
  if(options.pendingContacts){state.storyFlags.day21V4.input.day19PendingContacts=[...options.pendingContacts];state.storyFlags.day21V4.input.day19ContactHandling='DEFERRED_UNRESOLVED';}
  if(route==='NO_TRAVEL'&&options.contactAvailableNoTravel){state.breakup=null;state.storyFlags.day21V4.input.relationshipActive=true;state.storyFlags.day21V4.input.contactAllowed=true;}
  beginDay22V4(state);
  while(state.storyFlags.day22V4.phase!=='ending'){
    const chapter=state.storyFlags.day22V4;
    if(chapter.phase==='photo_resolution'){resolveDay22V4Photo(state,{type:'haeunPhotoResponse',keepAccepted:options.keepPhoto!==false});continue;}
    if(chapter.phase==='contact_resolution'){resolveDay22V4Contact(state,{type:'haeunContactResponse',contact:chapter.facts.contactIntent,accepted:true});continue;}
    const available=getDay22V4Options(chapter),suffix=chapter.phase==='shared_photo'&&options.keepPhoto===false?'keep_if_mutual':undefined;
    const selected=suffix?available.find(option=>option.id.endsWith(`_${suffix}`)):available[0];ensure(selected,`DAY22 ${chapter.phase}`);applyDay22V4Choice(state,selected.id);
  }
  completeDay22V4(state,{type:'chapterCompletionCue',day:22,finalSceneReached:true});
  return state;
}

export function chooseDay23(state,suffix){const options=getDay23V4Options(state.storyFlags.day23V4);const selected=suffix?options.find(option=>option.id.endsWith(`_${suffix}`)):options[0];ensure(selected,`DAY23 ${state.storyFlags.day23V4.phase}:${suffix}`);return applyDay23V4Choice(state,selected.id);}
