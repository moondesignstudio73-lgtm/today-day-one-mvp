import {validateDay25V4} from './day25-v4-state-contract.mjs?v=2';
import {validateDay26V4} from './day26-v4-state-contract.mjs';
import {DAY27_V4_SCHEMA,validateDay27V4} from './day27-v4-state-contract.mjs';

export const DAY28_V4_SCHEMA='day28-notion-v4/1';
const clone=value=>JSON.parse(JSON.stringify(value));
const sealInput=input=>{let hash=2166136261;for(const char of JSON.stringify(input)){hash^=char.charCodeAt(0);hash=Math.imul(hash,16777619);}return (hash>>>0).toString(16).padStart(8,'0');};
const legacyKeys=['day28RouteStrategy','day28SignalStrategy','day28AdaptStrategy','day28RuntimeStage','day28CurrentCeremonyRehearsalCompleted','day28RuntimeComplete'];
const people=['HAEUN','YURI','SEOJIN','ARA'];

function deriveInput(state){
  const flags=state.storyFlags,day25=flags.day25V4,day26=flags.day26V4,day27=flags.day27V4,handoff=clone(day27.facts.day28Handoff);
  const actualConversation=day27.facts.conversationOutcome==null?null:{target:day27.input.conversationTarget,outcome:day27.facts.conversationOutcome,method:day27.facts.conversationMethod};
  const nextTalk=day27.facts.nextTalk==null?null:{request:day27.facts.nextTalk,response:day27.facts.nextTalkResponse};
  const acceptedConversation=actualConversation?.outcome==='ACCEPTED';
  const acceptedNext=nextTalk?.response==='ACCEPTED';
  const relationshipContinues=handoff.relationshipContinues===true;
  const haeunMeetingEligible=relationshipContinues&&handoff.contactAllowed===true&&((acceptedConversation&&actualConversation.target==='HAEUN')||acceptedNext);
  const priorNew=day26.input.newMeeting;
  const newMeeting=priorNew==null?null:{recipient:priorNew.recipient,intentResponse:day26.facts.newMeaningResponse,nextResponse:day26.facts.newNextResponse,truthResponse:day26.facts.newLieResponse,lieCorrected:day27.facts.lieCorrected===true,lieRepeated:day27.facts.lieRepeated===true};
  const newMeetingEligible=!relationshipContinues&&newMeeting!=null&&newMeeting.intentResponse==='RECIPROCATE'&&newMeeting.nextResponse==='ACCEPTED'&&newMeeting.lieCorrected&&!newMeeting.lieRepeated;
  return {
    relationshipContinues,contactAllowed:handoff.contactAllowed===true,respectDistance:handoff.respectDistance===true,haeunFutureOutcome:day25.facts.haeunFutureOutcome,
    priorContact:day25.facts.currentContact??'NONE',priorKissOccurred:day25.facts.kissOccurred===true,actualConversation,nextTalk,haeunMeetingEligible,newMeeting,newMeetingEligible,
    publicCorrectionDone:handoff.publicCorrectionDone===true,jihoonKnown:day27.input.jihoonKnown===true,jihoonAvailable:day27.facts.jihoonAvailable===true,
    entrustedBelongings:[],priorHomeInvitation:false,sharedRelationshipScope:null,currentEnergy:Number.isFinite(state.energy)?Number(state.energy):70,currentStress:Number.isFinite(state.stress)?Number(state.stress):20,currentMoney:Number(state.money)||0,
    source:{day25Schema:day25.schema,day25InputSeal:day25.inputSeal,day26Schema:day26.schema,day26InputSeal:day26.inputSeal,day27Schema:day27.schema,day27InputSeal:day27.inputSeal,day27Handoff:handoff}
  };
}

function inputValid(input){
  if(typeof input?.relationshipContinues!=='boolean'||typeof input.contactAllowed!=='boolean'||typeof input.respectDistance!=='boolean'||typeof input.priorKissOccurred!=='boolean'||typeof input.haeunMeetingEligible!=='boolean'||typeof input.newMeetingEligible!=='boolean'||typeof input.publicCorrectionDone!=='boolean'||typeof input.jihoonKnown!=='boolean'||typeof input.jihoonAvailable!=='boolean'||typeof input.priorHomeInvitation!=='boolean')return false;
  if(!Number.isFinite(input.currentEnergy)||!Number.isFinite(input.currentStress)||!Number.isFinite(input.currentMoney)||!Array.isArray(input.entrustedBelongings))return false;
  if(input.source?.day25Schema!=='day25-notion-v4/1'||typeof input.source.day25InputSeal!=='string'||input.source.day26Schema!=='day26-notion-v4/1'||typeof input.source.day26InputSeal!=='string'||input.source.day27Schema!==DAY27_V4_SCHEMA||typeof input.source.day27InputSeal!=='string')return false;
  if(input.contactAllowed&&!input.relationshipContinues)return false;
  if(input.actualConversation!=null&&(!people.includes(input.actualConversation.target)||!['ACCEPTED','DEFERRED','DECLINED'].includes(input.actualConversation.outcome)||!['CALL','IN_PERSON'].includes(input.actualConversation.method)))return false;
  if(input.nextTalk!=null&&(!['SHORT_MEETING','WAIT_REQUESTED','ONLY_LOGISTICS'].includes(input.nextTalk.request)||input.nextTalk.response!=null&&!['ACCEPTED','DEFERRED','DECLINED'].includes(input.nextTalk.response)))return false;
  const expectedHaeun=input.relationshipContinues&&input.contactAllowed&&((input.actualConversation?.target==='HAEUN'&&input.actualConversation.outcome==='ACCEPTED')||input.nextTalk?.response==='ACCEPTED');
  if(input.haeunMeetingEligible!==expectedHaeun)return false;
  if(input.newMeeting!=null&&(!['YURI','SEOJIN','ARA'].includes(input.newMeeting.recipient)||input.newMeeting.intentResponse!=null&&!['RECIPROCATE','NEED_TIME','DISTANCE'].includes(input.newMeeting.intentResponse)||input.newMeeting.nextResponse!=null&&!['ACCEPTED','DEFERRED','DECLINED'].includes(input.newMeeting.nextResponse)))return false;
  const expectedNew=!input.relationshipContinues&&input.newMeeting!=null&&input.newMeeting.intentResponse==='RECIPROCATE'&&input.newMeeting.nextResponse==='ACCEPTED'&&input.newMeeting.lieCorrected===true&&input.newMeeting.lieRepeated!==true;
  if(input.newMeetingEligible!==expectedNew||input.haeunMeetingEligible&&input.newMeetingEligible)return false;
  if(input.priorKissOccurred&&input.priorContact!=='KISS')return false;
  if(input.entrustedBelongings.length||input.priorHomeInvitation||input.sharedRelationshipScope!=null)return false;
  return JSON.stringify(input.source.day27Handoff)===JSON.stringify({relationshipContinues:input.relationshipContinues,contactAllowed:input.contactAllowed,conversationTarget:input.actualConversation?.target??null,lieCorrected:input.newMeeting?.lieCorrected??input.source.day27Handoff.lieCorrected,lieRepeated:input.newMeeting?.lieRepeated??input.source.day27Handoff.lieRepeated,publicCorrectionDone:input.publicCorrectionDone,nextTalk:input.nextTalk?.request??null,nextTalkResponse:input.nextTalk?.response??null,respectDistance:input.respectDistance});
}

function initial(input){const frozen=clone(input);return {schema:DAY28_V4_SCHEMA,input:frozen,inputSeal:sealInput(frozen),choices:[],phase:'morning',complete:false,facts:{morningPlan:null,route:null,meetingOutcome:null,relationshipWish:null,relationshipResponse:null,relationshipState:input.relationshipContinues?'CONTINUING':'SINGLE',currentContact:null,homeInvitation:null,homeInvitationResponse:null,breakupWords:null,belongingsPlan:null,newRelationshipResponse:null,socialScope:null,soloPlans:[],nightPlan:null,day29Handoff:null}};}

export function getDay28V4Entry(state){const flags=state?.storyFlags??{};if(flags.day28V4!=null)return {mode:validateDay28V4(flags.day28V4)?'V4':'INVALID_V4'};if(legacyKeys.some(key=>flags[key]!=null&&flags[key]!==false&&flags[key]!==0))return {mode:'LEGACY'};if(!validateDay25V4(flags.day25V4)||flags.day25V4.complete!==true||!validateDay26V4(flags.day26V4)||flags.day26V4.complete!==true||!validateDay27V4(flags.day27V4)||flags.day27V4.complete!==true||flags.day27V4Day28HookPending!==true)return {mode:'BLOCKED_PREREQUISITE'};const input=deriveInput(state);return inputValid(input)?{mode:'V4_NEW',input}:{mode:'BLOCKED_PREREQUISITE'};}
export function beginDay28V4(state){const entry=getDay28V4Entry(state);if(entry.mode!=='V4_NEW')return entry;state.storyFlags.day28V4=initial(entry.input);return {mode:'V4'};}
export function validateDay28V4(chapter){try{return chapter?.schema===DAY28_V4_SCHEMA&&inputValid(chapter.input)&&chapter.inputSeal===sealInput(chapter.input)&&Array.isArray(chapter.choices)&&chapter.choices.length===0&&chapter.phase==='morning'&&chapter.complete===false&&JSON.stringify(chapter)===JSON.stringify(initial(chapter.input));}catch{return false;}}
