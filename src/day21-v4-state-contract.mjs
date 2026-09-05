import {validateDay20V4} from './day20-v4-state-contract.mjs';
import {DAY21_V4_SOURCE_SCENES} from './day21-v4-source-registry.mjs';

export const DAY21_V4_SCHEMA = 'day21-notion-v4/1';
const clone = value => JSON.parse(JSON.stringify(value));
const legacyKeys = ['day21ScopeStrategy','day21BreakStrategy','day21ExitStrategy','day21RuntimeStage','day21CurrentFullWorkdayCompleted','day21RuntimeComplete'];
const mainPhases = Object.freeze({morning:1,breakfast:2,venue:3,listen_start:4,afternoon:5,staying:6,more_story:7,feelings:8,openness:9,contact:10,dinner:11,travel:12,lodging:13,prepare:14,bag:15,final:16});
const deferredPhases = Object.freeze({deferred_reflect:4,deferred_explain:5,deferred_tomorrow:6,deferred_task:7,deferred_goodnight:8});
const suffixes = Object.freeze({
  1:['slow_breakfast','check_schedules','ask_later'],2:['bring_water','eat_slowly','rest_after'],3:['park','phone','defer'],
  4:['hear_more','her_limit','no_right_question'],5:['hear_success','not_all_me','apologize'],6:['thank_you','choose_now','pause'],
  7:['one_more_story','speak_to_today','hold_what_heard'],8:['thanks_and_love','hard_to_separate','not_debt'],
  9:['act_consistently','think_then_talk','leave_uncertainty'],10:['hug','hold_hands','walk_apart'],
  11:['eat_nearby','eat_separately','talk_travel'],12:['busan','seoul','rest_separately'],
  13:['separate_spaces','shared_room_wish','day_trip'],14:['pack_own','report_change','stop_preparing'],
  15:['remove_one_outfit','review_maybe_item','keep_essentials'],16:['heard_you','will_not_avoid','rest_today']
});
const deferredSuffixes = Object.freeze({
  4:['reflect_reason','check_minho_date','eat_first'],5:['fear_bad_listener','mind_too_busy','name_avoidance'],
  6:['defer_travel','solo_nearby','short_walk_if_mutual'],7:['put_one_thing_away','finish_promised_reply','rest_enough'],
  8:['rest_today','talk_when_possible','check_my_mind']
});

function previousChoiceId(chapter, number) {
  return chapter.choices.find(choice => choice.kind === 'choice' && choice.number === number)?.id ?? null;
}
function sourceChoice(number, variant) {
  const choice = DAY21_V4_SOURCE_SCENES.flatMap(scene => scene.choices).find(item => item.number === number && item.variant === variant);
  if (!choice) throw new Error(`DAY21_SOURCE_CHOICE_MISSING:${variant}:${number}`);
  return choice;
}
function options(number, variant) {
  const choice = sourceChoice(number, variant), list = variant === 'DEFERRED' ? deferredSuffixes[number] : suffixes[number];
  return choice.labels.map((label,index) => Object.freeze({id:`day21_v4_c${number}_${variant.toLowerCase()}_${list[index]}`,label}));
}
function deriveInput(state) {
  const day20 = state.storyFlags.day20V4, day19 = state.storyFlags.day19V4;
  const relationshipActive = state.breakup == null && state.ended !== true && day20.input.relationshipActive;
  const contactAllowed = relationshipActive && day20.input.contactAllowed;
  const morningMode = day20.facts.stayedOver ? 'STAYED_MORNING' : day20.input.visitMode === 'FACE_TO_FACE' ? 'MESSAGE_MORNING' : 'SOLO_MORNING';
  return {
    relationshipActive, contactAllowed, relationshipTone:day20.input.relationshipTone, morningMode,
    day20VisitMode:day20.input.visitMode, day20StayedOver:day20.facts.stayedOver,
    day20SleepingPlan:day20.facts.sleepingPlan?.arrangement ?? null, day20CupChoice:day20.facts.cupChoice,
    day20BorrowedClothes:day20.facts.borrowedClothes === true, day20FirstHug:day20.facts.firstHug === true,
    day20HeldHands:day20.facts.heldHands === true, day20SatSideBySide:day20.facts.satSideBySide === true,
    day20EveningExtension:day20.facts.eveningExtension, day20NextInvitation:day20.facts.nextInvitation,
    day20DisclosureRoute:day20.facts.disclosureRoute, day20NightEnd:day20.facts.nightEnd,
    day19TravelCandidate:day19?.facts?.travelCandidate ?? null,
    day19ReservationStatus:day19?.facts?.reservationStatus ?? 'NOT_RESERVED',
    day19BudgetMode:day19?.facts?.budgetMode ?? null, day19ScheduleTrim:day19?.facts?.scheduleTrim ?? null,
    day19PendingContacts:[...(day19?.input?.pendingContacts ?? [])], day19ContactHandling:day19?.facts?.contactHandling ?? null,
    day19MinhoReply:day19?.facts?.minhoReply ?? null,
    source:{day20Schema:day20.schema,day20Choice13:previousChoiceId(day20,13),day20Choice14:previousChoiceId(day20,14)}
  };
}
function initial(input) {
  return {schema:DAY21_V4_SCHEMA,input:clone(input),choices:[],phase:'morning',complete:false,facts:{
    morningChoice:null,breakfastChoice:null,conversationMode:null,conversationAccepted:false,heardHaeunStory:false,
    heardLunchStory:false,heardWorkStory:false,heardAngerStory:false,heardSocksStory:false,listeningApproach:null,
    afternoonResponse:null,stayingResponse:null,storyContinuation:null,feelingStatement:null,opennessPlan:null,
    contactIntent:null,todayContact:null,dinnerPlan:null,travelDiscussion:false,travelIntent:null,travelResult:null,
    lodgingRequest:null,lodgingAgreement:null,travelChecks:null,bookingConfirmed:false,travelPaymentMade:false,
    preparationPlan:null,bagPlan:null,finalMessage:null,deferredReflection:null,deferredExplanation:null,
    deferredTomorrow:null,deferredTask:null,deferredGoodnight:null
  }};
}

export function getDay21V4Entry(state) {
  const flags=state?.storyFlags??{};
  if(flags.day21V4!=null)return {mode:validateDay21V4(flags.day21V4)?'V4':'INVALID_V4'};
  if(legacyKeys.some(key=>flags[key]!=null&&flags[key]!==false&&flags[key]!==0))return {mode:'LEGACY'};
  if(!validateDay20V4(flags.day20V4)||flags.day20V4.complete!==true||flags.day20V4Day21HookPending!==true)return {mode:'BLOCKED_PREREQUISITE'};
  return {mode:'V4_NEW',input:deriveInput(state)};
}
export function beginDay21V4(state){const entry=getDay21V4Entry(state);if(entry.mode!=='V4_NEW')return entry;state.storyFlags.day21V4=initial(entry.input);return {mode:'V4'};}

export function getDay21V4Options(chapter) {
  if(['ending','contact_resolution','lodging_resolution','travel_resolution'].includes(chapter?.phase))return [];
  if(deferredPhases[chapter?.phase])return options(deferredPhases[chapter.phase],'DEFERRED');
  const number=mainPhases[chapter?.phase];if(!number)throw new Error(`DAY21_INVALID_PHASE:${chapter?.phase}`);
  let result=options(number,'FACE_TO_FACE');
  if(number===3&&!chapter.input.contactAllowed)result=result.filter(option=>option.id.endsWith('_defer'));
  if(number===12&&chapter.input.day19TravelCandidate!=='BUSAN_NIGHT')result=result.filter(option=>!option.id.endsWith('_busan'));
  return result;
}
function addChoice(chapter,number,variant,id){chapter.choices.push({kind:'choice',number,variant,phase:chapter.phase,id});}
function reduceDeferred(chapter,id) {
  const number=deferredPhases[chapter.phase], index=deferredSuffixes[number].findIndex(suffix=>id.endsWith(`_${suffix}`));
  addChoice(chapter,number,'DEFERRED',id);
  if(number===4){chapter.facts.deferredReflection=['REASON','MINHO_DATE','EAT_FIRST'][index];chapter.phase='deferred_explain';}
  if(number===5){chapter.facts.deferredExplanation=['FEAR_BAD_LISTENER','MIND_BUSY','NAME_AVOIDANCE'][index];chapter.phase='deferred_tomorrow';}
  if(number===6){chapter.facts.deferredTomorrow=['TRAVEL_DEFERRED','SOLO_NEARBY','SHORT_WALK_IF_MUTUAL'][index];chapter.phase='deferred_task';}
  if(number===7){chapter.facts.deferredTask=['PUT_AWAY','PROMISED_REPLY','REST'][index];chapter.phase='deferred_goodnight';}
  if(number===8){chapter.facts.deferredGoodnight=['REST_TODAY','TALK_WHEN_POSSIBLE','CHECK_MY_MIND'][index];chapter.phase='ending';}
}
function reduceChoice(chapter,id){
  if(chapter.complete)throw new Error('DAY21_ALREADY_COMPLETE');
  const selected=getDay21V4Options(chapter).find(option=>option.id===id);if(!selected)throw new Error(`DAY21_CHOICE_UNAVAILABLE:${id}`);
  if(deferredPhases[chapter.phase]){reduceDeferred(chapter,id);return chapter;}
  const number=mainPhases[chapter.phase], index=suffixes[number].findIndex(suffix=>id.endsWith(`_${suffix}`)), facts=chapter.facts;
  addChoice(chapter,number,'FACE_TO_FACE',id);
  switch(chapter.phase){
    case'morning':facts.morningChoice=['SLOW_BREAKFAST','CHECK_SCHEDULES','ASK_LATER'][index];chapter.phase='breakfast';break;
    case'breakfast':facts.breakfastChoice=['BRING_WATER','EAT_SLOWLY','REST_AFTER'][index];chapter.phase='venue';break;
    case'venue':facts.conversationMode=['PARK','PHONE','DEFERRED'][index];facts.conversationAccepted=index<2&&chapter.input.contactAllowed;chapter.phase=index===2?'deferred_reflect':'listen_start';break;
    case'listen_start':facts.listeningApproach=['HEAR_MORE','HER_LIMIT','NO_RIGHT_QUESTION'][index];facts.heardHaeunStory=true;facts.heardLunchStory=true;facts.heardWorkStory=true;facts.heardAngerStory=true;facts.heardSocksStory=true;chapter.phase='afternoon';break;
    case'afternoon':facts.afternoonResponse=['HEAR_SUCCESS','NOT_ALL_ME','APOLOGIZE'][index];chapter.phase='staying';break;
    case'staying':facts.stayingResponse=['THANK_YOU','CHOOSE_NOW','PAUSE'][index];chapter.phase='more_story';break;
    case'more_story':facts.storyContinuation=['ONE_MORE_STORY','SPEAK_TO_TODAY','HOLD_WHAT_HEARD'][index];chapter.phase='feelings';break;
    case'feelings':facts.feelingStatement=['THANKS_AND_LOVE','HARD_TO_SEPARATE','NOT_DEBT'][index];chapter.phase='openness';break;
    case'openness':facts.opennessPlan=['ACT_CONSISTENTLY','THINK_THEN_TALK','LEAVE_UNCERTAINTY'][index];chapter.phase='contact';break;
    case'contact':facts.contactIntent=['HUG','HAND','DISTANCE'][index];if(index<2&&facts.conversationMode==='PARK')chapter.phase='contact_resolution';else{facts.todayContact='NONE';chapter.phase='dinner';}break;
    case'dinner':facts.dinnerPlan=['EAT_NEARBY','EAT_SEPARATELY','TALK_TRAVEL'][index];facts.travelDiscussion=index===2;chapter.phase=index===2?'travel':'prepare';break;
    case'travel':facts.travelIntent=['BUSAN','SEOUL_DAY','REST_SEPARATELY'][index];if(index===0)chapter.phase='lodging';else{facts.travelResult=index===1?'SEOUL_DAY':'REST_SEPARATELY';chapter.phase='lodging';}break;
    case'lodging':facts.lodgingRequest=['SEPARATE_SPACES','SHARED_ROOM_WISH','DAY_TRIP'][index];if(facts.travelIntent==='BUSAN'){if(index===1)chapter.phase='lodging_resolution';else chapter.phase='travel_resolution';}else{facts.lodgingAgreement='NOT_APPLICABLE';chapter.phase='prepare';}break;
    case'prepare':facts.preparationPlan=['PACK_OWN','REPORT_CHANGE','STOP_PREPARING'][index];chapter.phase='bag';break;
    case'bag':facts.bagPlan=['REMOVE_ONE_OUTFIT','REVIEW_MAYBE_ITEM','KEEP_ESSENTIALS'][index];chapter.phase='final';break;
    case'final':facts.finalMessage=['HEARD_YOU','WILL_NOT_AVOID','REST_TODAY'][index];chapter.phase='ending';break;
    default:throw new Error(`DAY21_INVALID_PHASE:${chapter.phase}`);
  }return chapter;
}
function addResolution(chapter,resolution,payload){chapter.choices.push({kind:'resolution',resolution,phase:chapter.phase,...payload});}
function reduceContact(chapter,response){
  if(chapter.phase!=='contact_resolution'||response?.type!=='haeunContactResponse'||typeof response.accepted!=='boolean')throw new Error('DAY21_INVALID_CONTACT_RESOLUTION');
  const contact=chapter.facts.contactIntent;if(!['HUG','HAND'].includes(contact)||response.contact!==contact)throw new Error('DAY21_CONTACT_RESOLUTION_MISMATCH');
  addResolution(chapter,'CONTACT',{contact,accepted:response.accepted});chapter.facts.todayContact=response.accepted?contact:'NONE';chapter.phase='dinner';
}
function reduceLodging(chapter,response){
  if(chapter.phase!=='lodging_resolution'||response?.type!=='haeunLodgingResponse'||typeof response.accepted!=='boolean')throw new Error('DAY21_INVALID_LODGING_RESOLUTION');
  addResolution(chapter,'LODGING',{accepted:response.accepted});chapter.facts.lodgingAgreement=response.accepted?'SHARED_ROOM_AGREED':'SEPARATE_SPACES';chapter.phase='travel_resolution';
}
function reduceTravel(chapter,response){
  if(chapter.phase!=='travel_resolution'||response?.type!=='travelConfirmation'||typeof response.confirmed!=='boolean')throw new Error('DAY21_INVALID_TRAVEL_RESOLUTION');
  const overnight=chapter.facts.lodgingRequest!=='DAY_TRIP';
  const checks={date:response.dateConfirmed===true,transport:response.transportConfirmed===true,budget:response.budgetConfirmed===true,lodging:response.lodgingConfirmed===true,mutual:response.mutualConsent===true};
  if(response.confirmed&&(!checks.date||!checks.transport||!checks.budget||!checks.mutual||(overnight&&!checks.lodging)))throw new Error('DAY21_TRAVEL_REQUIRES_ALL_CHECKS');
  addResolution(chapter,'TRAVEL',{confirmed:response.confirmed,checks});chapter.facts.travelChecks=checks;chapter.facts.bookingConfirmed=response.confirmed;chapter.facts.travelPaymentMade=response.confirmed;
  chapter.facts.travelResult=response.confirmed?(overnight?'BUSAN_CONFIRMED':'BUSAN_DAY_TRIP'):'DEFERRED';chapter.phase='prepare';
}

export function validateDay21V4(chapter){try{
  if(chapter?.schema!==DAY21_V4_SCHEMA||!Array.isArray(chapter.choices)||typeof chapter.complete!=='boolean')return false;
  const input=chapter.input;if(!['STAYED_MORNING','MESSAGE_MORNING','SOLO_MORNING'].includes(input?.morningMode)||!['CALM','DIFFICULT','QUIET'].includes(input?.relationshipTone))return false;
  for(const key of['relationshipActive','contactAllowed','day20StayedOver','day20BorrowedClothes','day20FirstHug','day20HeldHands','day20SatSideBySide'])if(typeof input[key]!=='boolean')return false;
  if((!input.relationshipActive&&input.contactAllowed)||(input.day20StayedOver!==(input.morningMode==='STAYED_MORNING'))||input.day19ReservationStatus==='CONFIRMED'||!Array.isArray(input.day19PendingContacts))return false;
  const replay=initial(input);for(const record of chapter.choices){if(record.phase!==replay.phase)return false;if(record.kind==='choice')reduceChoice(replay,record.id);else if(record.kind==='resolution'&&record.resolution==='CONTACT')reduceContact(replay,{type:'haeunContactResponse',contact:record.contact,accepted:record.accepted});else if(record.kind==='resolution'&&record.resolution==='LODGING')reduceLodging(replay,{type:'haeunLodgingResponse',accepted:record.accepted});else if(record.kind==='resolution'&&record.resolution==='TRAVEL')reduceTravel(replay,{type:'travelConfirmation',confirmed:record.confirmed,dateConfirmed:record.checks.date,transportConfirmed:record.checks.transport,budgetConfirmed:record.checks.budget,lodgingConfirmed:record.checks.lodging,mutualConsent:record.checks.mutual});else return false;}
  if(chapter.complete&&replay.phase!=='ending')return false;replay.complete=chapter.complete;return JSON.stringify(replay)===JSON.stringify(chapter);
}catch{return false;}}
export function applyDay21V4Choice(state,id){const chapter=state?.storyFlags?.day21V4;if(!validateDay21V4(chapter))throw new Error('DAY21_INVALID_SAVE');const next=reduceChoice(clone(chapter),id);state.storyFlags.day21V4=next;return clone(next);}
export function resolveDay21V4Contact(state,response){const chapter=state?.storyFlags?.day21V4;if(!validateDay21V4(chapter))throw new Error('DAY21_INVALID_SAVE');const next=clone(chapter);reduceContact(next,response);state.storyFlags.day21V4=next;return clone(next);}
export function resolveDay21V4Lodging(state,response){const chapter=state?.storyFlags?.day21V4;if(!validateDay21V4(chapter))throw new Error('DAY21_INVALID_SAVE');const next=clone(chapter);reduceLodging(next,response);state.storyFlags.day21V4=next;return clone(next);}
export function resolveDay21V4Travel(state,response){const chapter=state?.storyFlags?.day21V4;if(!validateDay21V4(chapter))throw new Error('DAY21_INVALID_SAVE');const next=clone(chapter);reduceTravel(next,response);state.storyFlags.day21V4=next;return clone(next);}
export function completeDay21V4(state,cue){const chapter=state?.storyFlags?.day21V4;if(!validateDay21V4(chapter)||chapter.phase!=='ending'||cue?.type!=='chapterCompletionCue'||cue.day!==21||cue.finalSceneReached!==true)throw new Error('DAY21_INVALID_COMPLETION');if(chapter.complete)return clone(chapter);chapter.complete=true;state.storyFlags.day21V4Day22HookPending=true;state.storyFlags.day20V4Day21HookPending=false;return clone(chapter);}
