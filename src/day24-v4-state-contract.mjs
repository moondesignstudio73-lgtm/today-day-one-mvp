import {validateDay21V4} from './day21-v4-state-contract.mjs';
import {validateDay22V4} from './day22-v4-state-contract.mjs';
import {DAY23_V4_SCHEMA,validateDay23V4} from './day23-v4-state-contract.mjs';
import {DAY24_V4_SOURCE_SCENES} from './day24-v4-source-registry.mjs';

export const DAY24_V4_SCHEMA='day24-notion-v4/1';
const clone=value=>JSON.parse(JSON.stringify(value));
const legacyKeys=['day24ReasonStrategy','day24ConditionStrategy','day24ConsentStrategy','day24RuntimeStage','day24CurrentCommitmentCheckCompleted','day24RuntimeComplete'];
const choicePhases=Object.freeze({start_words:[1,'COMMON'],waiting:[2,'COMMON'],current_feeling:[3,'COMMON'],feeling_explanation:[4,'COMMON'],waiting_answer:[5,'COMMON'],relationship_proposal:[6,'COMMON'],short_time:[7,'COMMON'],contact_expectation:[8,'COMMON'],relation_statement:[10,'PENDING_RELATIONSHIP'],no_pending_home:[9,'NO_PENDING_CONTACT'],no_pending_evening:[10,'NO_PENDING_CONTACT'],continue_evening:[11,'CONTINUE'],empty_evening:[11,'DEFER_OR_END'],friend_talk:[12,'JIHOON'],new_meeting:[13,'NEW_MEETING'],future_talk:[14,'CONTINUE'],self_night:[15,'COMMON']});
const suffixes=Object.freeze({
  start_words:['listen','answer','phone_first'],waiting:['one_sentence','eat','name_fear'],current_feeling:['continue','unsure','end'],
  feeling_explanation:['other_person','not_other','afraid'],waiting_answer:['no_obligation','set_time','fear_loss'],relationship_proposal:['exclusive_continue','need_time','break_up'],
  short_time:['walk','rest','add_more'],contact_expectation:['clear_no_romance','relationship_ended','relationship_active'],
  relation_statement:['correct','stop_meeting','alone_lie'],no_pending_home:['small_action','rest','leave_unknown'],no_pending_evening:['familiar_food','simple_home','friend_greeting'],
  continue_evening:['thank','ask_good','rest'],empty_evening:['alone','jihoon','keep_photo'],friend_talk:['afraid','relieved_guilt','other_topic'],
  new_meeting:['slow','expect_difference','postpone'],future_talk:['tomorrow_meal','schedule','not_ready'],self_night:['wash_rest','one_task','leave_messages']
});
const contactSuffixes=Object.freeze({YURI:['today_yuri','share_self','stop_here'],SEOJIN:['coworker','personal_interest','no_answer'],ARA:['photo_exchange','personal_interest','correct_only']});

function sourceChoice(number,variant){const found=DAY24_V4_SOURCE_SCENES.flatMap(scene=>scene.choices).find(choice=>choice.number===number&&choice.variant===variant);if(!found)throw new Error(`DAY24_SOURCE_CHOICE_MISSING:${variant}:${number}`);return found;}
function optionSet(number,variant,keys){return sourceChoice(number,variant).labels.map((label,index)=>Object.freeze({id:`day24_v4_c${number}_${variant.toLowerCase()}_${keys[index]}`,label}));}
function pendingContacts(day23){if(day23.facts.pendingContactAction==='ALIGN_RELATIONSHIP')return [];return [...day23.input.pendingContacts];}
function priorConversation(day23){if(['MEET','PHONE','SCHEDULE_TOGETHER'].includes(day23.facts.nextConversation))return {status:'AGREED',method:day23.facts.nextConversation};if(day23.facts.noTravelTomorrow==='AGREED_TALK')return {status:'AGREED',method:'SCHEDULE_TOGETHER'};return {status:'NOT_AGREED',method:null};}
function deriveInput(state){const flags=state.storyFlags,day21=flags.day21V4,day22=flags.day22V4,day23=flags.day23V4;const relationshipActive=state.breakup==null&&state.ended!==true&&day23.input.relationshipActive;const contactAllowed=relationshipActive&&day23.input.contactAllowed;return {
  relationshipActive,contactAllowed,relationshipTone:day23.input.relationshipTone,priorRelationshipIntent:day23.facts.relationshipIntent??day23.facts.noTravelRelationship,
  priorHaeunOutcome:day23.facts.haeunRelationshipOutcome,priorConversation:priorConversation(day23),pendingContacts:pendingContacts(day23),priorContactHandling:day23.facts.pendingContactAction,
  jihoonAvailable:day23.input.jihoonAvailable,day23Route:day23.input.route,sharedPhotoExists:day23.facts.sharedPhotoToday||day23.input.sharedPhotoKept,
  sharedPhotoDeleted:day23.input.sharedPhotoDeleted,day23FarewellContact:day23.facts.farewellContact,day23SmallShare:day23.facts.smallShare,
  source:{day21Schema:day21.schema,day22Schema:day22.schema,day23Schema:day23.schema,day23Route:day23.input.route,day23Choice17:day23.choices.find(record=>record.kind==='choice'&&record.number===17)?.id??null}
};}
function initial(input){return {schema:DAY24_V4_SCHEMA,input:clone(input),choices:[],phase:'start_words',complete:false,facts:{
  startWords:null,waitingPlan:null,conversationMode:null,conversationAccepted:null,initialFeeling:null,reasonDisclosure:null,waitingBoundary:null,relationshipProposal:null,
  haeunRelationshipOutcome:null,shortTime:null,contactCleanup:null,contactRecipient:null,contactDirection:null,otherContactResponse:null,newMeetingAccepted:false,
  relationshipStatusStatement:null,relationshipStatusLie:null,noPendingHome:null,noPendingEvening:null,eveningPlan:null,friendTalk:null,newMeetingPlan:null,futureTalkPlan:null,
  futureTalkAccepted:false,futureTalkTime:null,selfNight:null,day25Route:null
}};}

export function getDay24V4Entry(state){const flags=state?.storyFlags??{};if(flags.day24V4!=null)return {mode:validateDay24V4(flags.day24V4)?'V4':'INVALID_V4'};if(legacyKeys.some(key=>flags[key]!=null&&flags[key]!==false&&flags[key]!==0))return {mode:'LEGACY'};if(!validateDay21V4(flags.day21V4)||flags.day21V4.complete!==true||!validateDay22V4(flags.day22V4)||flags.day22V4.complete!==true||!validateDay23V4(flags.day23V4)||flags.day23V4.complete!==true||flags.day23V4Day24HookPending!==true)return {mode:'BLOCKED_PREREQUISITE'};return {mode:'V4_NEW',input:deriveInput(state)};}
export function beginDay24V4(state){const entry=getDay24V4Entry(state);if(entry.mode!=='V4_NEW')return entry;state.storyFlags.day24V4=initial(entry.input);return {mode:'V4'};}

function relationshipEnded(chapter){return chapter.input.relationshipActive===false||chapter.facts.haeunRelationshipOutcome==='END';}
function afterConversation(chapter){chapter.phase=chapter.input.pendingContacts.length?'contact_expectation':'no_pending_home';}
function afterContact(chapter){chapter.phase=chapter.facts.haeunRelationshipOutcome==='CONTINUE'?'continue_evening':'empty_evening';}
function afterEmptyEvening(chapter){if(relationshipEnded(chapter)&&chapter.facts.newMeetingAccepted)chapter.phase='new_meeting';else chapter.phase='self_night';}
export function getDay24V4Options(chapter){
  if(['conversation_resolution','relationship_resolution','contact_resolution','lie_resolution','future_resolution','ending'].includes(chapter?.phase))return [];
  if(chapter?.phase==='contact_path'){const recipient=chapter.facts.contactRecipient;if(!contactSuffixes[recipient])throw new Error(`DAY24_CONTACT_RECIPIENT_INVALID:${recipient}`);return optionSet(9,recipient,contactSuffixes[recipient]);}
  const spec=choicePhases[chapter?.phase];if(!spec)throw new Error(`DAY24_INVALID_PHASE:${chapter?.phase}`);let result=optionSet(spec[0],spec[1],suffixes[chapter.phase]);
  if(chapter.phase==='short_time'&&(chapter.facts.haeunRelationshipOutcome!=='CONTINUE'||chapter.facts.conversationMode!=='MEET'))result=result.filter(option=>!option.id.endsWith('_walk'));
  if(chapter.phase==='contact_expectation'){if(!relationshipEnded(chapter))result=result.filter(option=>!option.id.endsWith('_relationship_ended'));else result=result.filter(option=>!option.id.endsWith('_relationship_active'));}
  if(chapter.phase==='empty_evening'&&!chapter.input.jihoonAvailable)result=result.filter(option=>!option.id.endsWith('_jihoon'));
  return result;
}
function addChoice(chapter,number,variant,id){chapter.choices.push({kind:'choice',number,variant,phase:chapter.phase,id});}
function addResolution(chapter,resolution,payload){chapter.choices.push({kind:'resolution',resolution,phase:chapter.phase,...payload});}
function indexFor(id,keys){const index=keys.findIndex(key=>id.endsWith(`_${key}`));if(index<0)throw new Error(`DAY24_CHOICE_ID_INVALID:${id}`);return index;}
function reduceChoice(chapter,id){if(chapter.complete)throw new Error('DAY24_ALREADY_COMPLETE');const option=getDay24V4Options(chapter).find(item=>item.id===id);if(!option)throw new Error(`DAY24_CHOICE_UNAVAILABLE:${id}`);const phase=chapter.phase,facts=chapter.facts;
  if(phase==='contact_path'){const recipient=facts.contactRecipient,index=indexFor(id,contactSuffixes[recipient]);addChoice(chapter,9,recipient,id);facts.contactDirection=recipient==='YURI'?['LISTEN_TODAY','SHARE_SELF','STOP_HERE'][index]:recipient==='SEOJIN'?['COWORKER','PERSONAL_INTEREST','NO_MORE_ANSWER'][index]:['PHOTO_EXCHANGE','PERSONAL_INTEREST','CORRECT_ONLY'][index];const romantic=facts.contactDirection==='PERSONAL_INTEREST';chapter.phase=romantic&&!relationshipEnded(chapter)?'relation_statement':'contact_resolution';return chapter;}
  const [number,variant]=choicePhases[phase],index=indexFor(id,suffixes[phase]);addChoice(chapter,number,variant,id);
  if(phase==='start_words'){facts.startWords=['LISTEN','OWN_ANSWER','PHONE_FIRST'][index];chapter.phase='waiting';}
  else if(phase==='waiting'){facts.waitingPlan=['ONE_SENTENCE','EAT','NAME_FEAR'][index];chapter.phase=chapter.input.relationshipActive&&chapter.input.contactAllowed?'conversation_resolution':chapter.input.pendingContacts.length?'contact_expectation':'no_pending_home';}
  else if(phase==='current_feeling'){facts.initialFeeling=['CONTINUE','UNSURE','END'][index];chapter.phase='feeling_explanation';}
  else if(phase==='feeling_explanation'){facts.reasonDisclosure=['OTHER_PERSON','NOT_OTHER','AFRAID'][index];chapter.phase='waiting_answer';}
  else if(phase==='waiting_answer'){facts.waitingBoundary=['NO_OBLIGATION','SET_TIME','FEAR_LOSS'][index];chapter.phase='relationship_proposal';}
  else if(phase==='relationship_proposal'){facts.relationshipProposal=['EXCLUSIVE_CONTINUE','NEED_TIME','BREAK_UP'][index];chapter.phase='relationship_resolution';}
  else if(phase==='short_time'){facts.shortTime=['WALK','REST','ADD_MORE'][index];afterConversation(chapter);}
  else if(phase==='contact_expectation'){facts.contactCleanup=['CLEAR_NO_ROMANCE','RELATIONSHIP_ENDED','RELATIONSHIP_ACTIVE'][index];facts.contactRecipient=chapter.input.pendingContacts[0];chapter.phase='contact_path';}
  else if(phase==='relation_statement'){facts.relationshipStatusStatement=['CORRECT','STOP_MEETING','ALONE'][index];if(index===2)chapter.phase='lie_resolution';else chapter.phase='contact_resolution';}
  else if(phase==='no_pending_home'){facts.noPendingHome=['SMALL_ACTION','REST','LEAVE_UNKNOWN'][index];chapter.phase='no_pending_evening';}
  else if(phase==='no_pending_evening'){facts.noPendingEvening=['FAMILIAR_FOOD','SIMPLE_HOME','FRIEND_GREETING'][index];afterContact(chapter);}
  else if(phase==='continue_evening'){facts.eveningPlan=['THANK','ASK_GOOD','REST'][index];chapter.phase='future_talk';}
  else if(phase==='empty_evening'){facts.eveningPlan=['ALONE','JIHOON','KEEP_PHOTO'][index];if(index===1&&chapter.input.jihoonAvailable)chapter.phase='friend_talk';else afterEmptyEvening(chapter);}
  else if(phase==='friend_talk'){facts.friendTalk=['AFRAID','RELIEVED_GUILT','OTHER_TOPIC'][index];afterEmptyEvening(chapter);}
  else if(phase==='new_meeting'){facts.newMeetingPlan=['SLOW','EXPECT_DIFFERENCE','POSTPONE'][index];chapter.phase='self_night';}
  else if(phase==='future_talk'){facts.futureTalkPlan=['TOMORROW_MEAL','SCHEDULE','NOT_READY'][index];chapter.phase='future_resolution';}
  else if(phase==='self_night'){facts.selfNight=['WASH_REST','ONE_TASK','LEAVE_MESSAGES'][index];facts.day25Route=facts.haeunRelationshipOutcome==='CONTINUE'&&facts.futureTalkAccepted?'HAEUN_FUTURE':facts.haeunRelationshipOutcome==='DEFER'?'DEFERRED_RELATIONSHIP':relationshipEnded(chapter)?'RELATIONSHIP_ENDED':'NO_CONVERSATION';chapter.phase='ending';}
  return chapter;
}
function reduceConversation(chapter,response){if(chapter.phase!=='conversation_resolution'||response?.type!=='haeunConversationResponse'||typeof response.accepted!=='boolean')throw new Error('DAY24_INVALID_CONVERSATION_RESOLUTION');if(response.accepted&&!['MEET','PHONE'].includes(response.mode))throw new Error('DAY24_CONVERSATION_MODE_INVALID');addResolution(chapter,'CONVERSATION',{accepted:response.accepted,mode:response.accepted?response.mode:'DECLINED_TODAY'});chapter.facts.conversationAccepted=response.accepted;chapter.facts.conversationMode=response.accepted?response.mode:'DECLINED_TODAY';chapter.phase=response.accepted?'current_feeling':chapter.input.pendingContacts.length?'contact_expectation':'no_pending_home';}
function reduceRelationship(chapter,response){if(chapter.phase!=='relationship_resolution'||response?.type!=='haeunRelationshipResponse'||!['CONTINUE','DEFER','END'].includes(response.outcome))throw new Error('DAY24_INVALID_RELATIONSHIP_RESOLUTION');addResolution(chapter,'RELATIONSHIP',{outcome:response.outcome});chapter.facts.haeunRelationshipOutcome=response.outcome;chapter.phase='short_time';}
function reduceContact(chapter,response){if(chapter.phase!=='contact_resolution'||response?.type!=='otherContactResponse'||!['ACKNOWLEDGED','ACCEPT_MEETING','DECLINE','THINK'].includes(response.outcome))throw new Error('DAY24_INVALID_CONTACT_RESOLUTION');addResolution(chapter,'CONTACT',{recipient:chapter.facts.contactRecipient,outcome:response.outcome});chapter.facts.otherContactResponse=response.outcome;chapter.facts.newMeetingAccepted=relationshipEnded(chapter)&&response.outcome==='ACCEPT_MEETING';afterContact(chapter);}
function reduceLie(chapter,response){if(chapter.phase!=='lie_resolution'||response?.type!=='relationshipStatusClarification'||typeof response.corrected!=='boolean')throw new Error('DAY24_INVALID_LIE_RESOLUTION');addResolution(chapter,'LIE',{recipient:chapter.facts.contactRecipient,corrected:response.corrected});chapter.facts.relationshipStatusLie=response.corrected?null:{recipient:chapter.facts.contactRecipient,statement:'SINGLE',truth:'RELATIONSHIP_NOT_ENDED',corrected:false};chapter.phase='contact_resolution';}
function reduceFuture(chapter,response){if(chapter.phase!=='future_resolution'||response?.type!=='haeunFutureTalkResponse'||typeof response.accepted!=='boolean'||(response.accepted&&response.time!=null&&typeof response.time!=='string'))throw new Error('DAY24_INVALID_FUTURE_RESOLUTION');addResolution(chapter,'FUTURE',{accepted:response.accepted,time:response.accepted?response.time??null:null});chapter.facts.futureTalkAccepted=response.accepted;chapter.facts.futureTalkTime=response.accepted?response.time??null:null;chapter.phase='self_night';}

export function validateDay24V4(chapter){try{
  if(chapter?.schema!==DAY24_V4_SCHEMA||!Array.isArray(chapter.choices)||typeof chapter.complete!=='boolean')return false;
  const input=chapter.input;
  if(!['CALM','DIFFICULT','QUIET'].includes(input?.relationshipTone)||!['BUSAN_TRIP','SEOUL_DAY','NO_TRAVEL'].includes(input?.day23Route))return false;
  for(const key of['relationshipActive','contactAllowed','jihoonAvailable','sharedPhotoExists','sharedPhotoDeleted'])if(typeof input[key]!=='boolean')return false;
  if(!Array.isArray(input.pendingContacts)||new Set(input.pendingContacts).size!==input.pendingContacts.length||input.pendingContacts.some(item=>!['YURI','SEOJIN','ARA'].includes(item)))return false;
  if(input.source?.day21Schema!=='day21-notion-v4/1'||input.source?.day22Schema!=='day22-notion-v4/1'||input.source?.day23Schema!==DAY23_V4_SCHEMA||input.source?.day23Route!==input.day23Route)return false;
  if(!['AGREED','NOT_AGREED'].includes(input.priorConversation?.status)||(input.priorConversation.status==='AGREED')!==['MEET','PHONE','SCHEDULE_TOGETHER'].includes(input.priorConversation.method))return false;
  if(!input.relationshipActive&&input.contactAllowed)return false;
  const replay=initial(input);
  for(const record of chapter.choices){if(record.phase!==replay.phase)return false;if(record.kind==='choice')reduceChoice(replay,record.id);else if(record.kind==='resolution'&&record.resolution==='CONVERSATION')reduceConversation(replay,{type:'haeunConversationResponse',accepted:record.accepted,mode:record.mode});else if(record.kind==='resolution'&&record.resolution==='RELATIONSHIP')reduceRelationship(replay,{type:'haeunRelationshipResponse',outcome:record.outcome});else if(record.kind==='resolution'&&record.resolution==='CONTACT')reduceContact(replay,{type:'otherContactResponse',outcome:record.outcome});else if(record.kind==='resolution'&&record.resolution==='LIE')reduceLie(replay,{type:'relationshipStatusClarification',corrected:record.corrected});else if(record.kind==='resolution'&&record.resolution==='FUTURE')reduceFuture(replay,{type:'haeunFutureTalkResponse',accepted:record.accepted,time:record.time});else return false;}
  if(chapter.complete&&replay.phase!=='ending')return false;replay.complete=chapter.complete;return JSON.stringify(replay)===JSON.stringify(chapter);
}catch{return false;}}
function mutate(state,fn,payload){const chapter=state?.storyFlags?.day24V4;if(!validateDay24V4(chapter))throw new Error('DAY24_INVALID_SAVE');const next=clone(chapter);fn(next,payload);state.storyFlags.day24V4=next;return clone(next);}
export const applyDay24V4Choice=(state,id)=>mutate(state,reduceChoice,id);
export const resolveDay24V4Conversation=(state,response)=>mutate(state,reduceConversation,response);
export const resolveDay24V4Relationship=(state,response)=>mutate(state,reduceRelationship,response);
export const resolveDay24V4Contact=(state,response)=>mutate(state,reduceContact,response);
export const resolveDay24V4Lie=(state,response)=>mutate(state,reduceLie,response);
export const resolveDay24V4Future=(state,response)=>mutate(state,reduceFuture,response);
export function completeDay24V4(state,cue){const chapter=state?.storyFlags?.day24V4;if(!validateDay24V4(chapter)||chapter.phase!=='ending'||cue?.type!=='chapterCompletionCue'||cue.day!==24||cue.finalSceneReached!==true)throw new Error('DAY24_INVALID_COMPLETION');if(chapter.complete)return clone(chapter);chapter.complete=true;state.storyFlags.day24V4Day25HookPending=true;state.storyFlags.day23V4Day24HookPending=false;return clone(chapter);}
