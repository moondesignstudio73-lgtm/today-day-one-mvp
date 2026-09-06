import {beginDay23V4,completeDay23V4,getDay23V4Options,resolveDay23V4Conversation,resolveDay23V4FarewellContact,resolveDay23V4Meeting,resolveDay23V4Photo,resolveDay23V4Relationship,resolveDay23V4Souvenir,applyDay23V4Choice} from '../src/day23-v4-state-contract.mjs';
import {completedDay22ForDay23} from './day23-v4-fixture.mjs';

const ensure=(value,message)=>{if(!value)throw new Error(message);};

export function completedDay23ForDay24(route='SEOUL_DAY',options={}){
  const state=completedDay22ForDay23(route,options);beginDay23V4(state);let guard=0;
  while(state.storyFlags.day23V4.phase!=='ending'){
    ensure(guard++<40,'DAY23 fixture guard');const chapter=state.storyFlags.day23V4;
    if(chapter.phase==='photo_resolution'){resolveDay23V4Photo(state,{type:'haeunPhotoResponse',accepted:options.photo!==false});continue;}
    if(chapter.phase==='souvenir_resolution'){resolveDay23V4Souvenir(state,{type:'souvenirPurchaseResponse',purchased:false});continue;}
    if(chapter.phase==='relationship_resolution'){resolveDay23V4Relationship(state,{type:'haeunRelationshipResponse',outcome:options.day23Relationship??'CONTINUE'});continue;}
    if(chapter.phase==='farewell_resolution'){resolveDay23V4FarewellContact(state,{type:'haeunFarewellContactResponse',accepted:false});continue;}
    if(chapter.phase==='meeting_resolution'){resolveDay23V4Meeting(state,{type:'haeunMeetingResponse',accepted:options.meeting!==false});continue;}
    if(chapter.phase==='conversation_resolution'){resolveDay23V4Conversation(state,{type:'haeunConversationResponse',accepted:options.conversation!==false});continue;}
    const available=getDay23V4Options(chapter);let selected;
    if(chapter.phase==='pending_contact')selected=available.find(item=>item.id.endsWith(options.clearPending?'_align_relationship':'_name_uncertainty'));
    else if(chapter.phase==='conversation_method'&&options.conversationMethod)selected=available.find(item=>item.id.endsWith(`_${options.conversationMethod.toLowerCase()}`));
    else selected=available[0];
    ensure(selected,`DAY23 fixture ${chapter.phase}`);applyDay23V4Choice(state,selected.id);
  }
  completeDay23V4(state,{type:'chapterCompletionCue',day:23,finalSceneReached:true});state.day=24;return state;
}
