import {validateDay21V4} from './day21-v4-state-contract.mjs';
import {validateDay22V4} from './day22-v4-state-contract.mjs';
import {DAY23_V4_SOURCE_SCENES} from './day23-v4-source-registry.mjs';

export const DAY23_V4_SCHEMA = 'day23-notion-v4/1';
const clone=value=>JSON.parse(JSON.stringify(value));
const legacyKeys=['day23VerifyStrategy','day23ShareStrategy','day23FutureStrategy','day23RuntimeStage','day23CurrentFamilyContactCompleted','day23RuntimeComplete'];
const mainPhases=Object.freeze({morning_speed:1,morning_notice:2,remaining_time:3,favorite_moment:4,departure_record:5,souvenir:6,return_ride:7,home_imagination:8,relationship_intent:9,farewell_plan:10,home_arrival:11,small_share:12,photo_review:13,pending_contact:14,self_intent:14,dinner_call:15,wanted_presence:16,conversation_method:17});
const noTravelPhases=Object.freeze({no_travel_outing:3,no_travel_good:4,no_travel_record:5,no_travel_relationship:6,no_travel_contact:7,no_travel_tomorrow:8});
const mainSuffixes=Object.freeze({
  1:['breakfast_slow','sort_bag','trim_plan'],2:['familiar_space','home_comfort','another_morning'],3:['one_view','return_focus','separate_briefly'],
  4:['haeun_smile','solo_view','change_ok'],5:['landscape','faces','no_photo'],6:['small_item','photos_enough','return_wish'],
  7:['rest','one_photo','ask_home'],8:['ordinary_story','unpack','feel_empty'],9:['keep_meeting','discuss_more','home_comfort'],
  10:['arrival_line','evening_call','rest_later'],11:['unpack','water','food'],12:['share_haeun','tell_jihoon','keep_self'],
  13:['one_photo','next_time','leave_unsorted'],14:['align_relationship','name_uncertainty','tell_haeun_first'],
  15:['eat_call','after_meal','rest'],16:['smiling_face','beside_separate_tasks','speechless'],17:['meet','phone','schedule_together']
});
const selfIntentSuffixes=Object.freeze(['keep_meeting','future_talk','miss_you']);
const noTravelSuffixes=Object.freeze({3:['walk','meet_if_accepted','stay_home'],4:['meal_good','long_rest','not_choose'],5:['landscape','funny_line','no_record'],6:['ordinary_interest','relationship_talk','rest_contact'],7:['answer_one','name_delay','no_fake_problem'],8:['agreed_talk','own_schedule','rest_promise']});

function sourceChoice(number,variant){const found=DAY23_V4_SOURCE_SCENES.flatMap(scene=>scene.choices).find(choice=>choice.number===number&&choice.variant===variant);if(!found)throw new Error(`DAY23_SOURCE_CHOICE_MISSING:${variant}:${number}`);return found;}
function optionSet(number,variant,suffixes){return sourceChoice(number,variant).labels.map((label,index)=>Object.freeze({id:`day23_v4_c${number}_${variant.toLowerCase()}_${suffixes[index]}`,label}));}
function priorChoice(chapter,number){return chapter.choices.find(record=>record.kind==='choice'&&record.number===number)?.id??null;}
function pendingContacts(day21){if(day21.input.day19ContactHandling==='ANSWER_WITHOUT_FALSE_PROMISE')return [];return [...day21.input.day19PendingContacts];}
function deriveInput(state){
  const flags=state.storyFlags,day21=flags.day21V4,day22=flags.day22V4;
  const route=day22.facts.route;
  const relationshipActive=state.breakup==null&&state.ended!==true&&day22.input.relationshipActive;
  const contactAllowed=relationshipActive&&day22.input.contactAllowed;
  const morningMode=route==='BUSAN_TRIP'?(day22.input.sharedLodgingSpace?'BUSAN_SHARED':'BUSAN_SEPARATE'):route==='SEOUL_DAY'?'HOME_AFTER_SEOUL':'HOME_NO_TRAVEL';
  const contacts=pendingContacts(day21);
  const jihoonAvailable=state.scenario?.unlockedActions?.includes('past-contacts-index')===true||state.storyHistory?.some(record=>record.day===4)===true;
  return {route,morningMode,relationshipActive,contactAllowed,relationshipTone:day22.input.relationshipTone,sharedLodgingSpace:day22.input.sharedLodgingSpace,
    day20StayedOver:day21.input.day20StayedOver===true,day20FirstHug:day22.input.day20FirstHug===true,day20HeldHands:day22.input.day20HeldHands===true,
    day21TodayContact:day22.input.day21TodayContact,day22TodayContact:day22.facts.todayContact,
    day22PacePlan:day22.facts.pacePlan,day22SeparateMeeting:clone(day22.facts.separateMeeting),day22MealRecord:day22.facts.mealRecord,
    landscapePhotoExists:day22.facts.landscapePhotoExists===true,sharedPhotoKept:day22.facts.sharedPhotoKept===true,sharedPhotoDeleted:day22.facts.sharedPhotoDeleted===true,
    day22PhotoRecipient:day22.facts.photoRecipient??day22.facts.noTravelPhotoTarget??null,day22PhotoMessageSent:day22.facts.photoMessageSent===true,
    day22ExpectationPlan:day22.facts.expectationPlan,day22Reflection:day22.facts.reflection,day22DinnerPlan:day22.facts.dinnerPlan,
    day22SeoulReturnWords:day22.facts.seoulReturnWords,day22NoTravelTomorrow:day22.facts.noTravelTomorrow,
    pendingContacts:contacts,jihoonAvailable,
    source:{day20Schema:day21.input.source?.day20Schema??'day20-notion-v4/1',day21Schema:day21.schema,day22Schema:day22.schema,day22Choice17:priorChoice(day22,17),day22NoTravelChoice8:priorChoice(day22,8)}
  };
}
function initial(input){return {schema:DAY23_V4_SCHEMA,input:clone(input),choices:[],phase:'morning_speed',complete:false,facts:{
  morningSpeed:null,morningNotice:null,remainingTime:null,favoriteMoment:null,departureRecord:null,sharedPhotoToday:false,souvenirIntent:null,souvenirPurchase:null,
  returnRide:null,homeImagination:null,relationshipIntent:null,haeunRelationshipOutcome:null,farewellPlan:null,farewellContact:'NONE',homeArrival:null,
  smallShare:null,photoReview:null,pendingContactAction:null,selfIntent:null,dinnerCall:null,wantedPresence:null,conversationMethod:null,nextConversation:null,
  noTravelOuting:null,noTravelMeetingAccepted:null,noTravelGood:null,noTravelRecord:null,noTravelRelationship:null,noTravelContact:null,noTravelTomorrow:null
}};}

export function getDay23V4Entry(state){const flags=state?.storyFlags??{};if(flags.day23V4!=null)return {mode:validateDay23V4(flags.day23V4)?'V4':'INVALID_V4'};if(legacyKeys.some(key=>flags[key]!=null&&flags[key]!==false&&flags[key]!==0))return {mode:'LEGACY'};if(!validateDay21V4(flags.day21V4)||flags.day21V4.complete!==true||!validateDay22V4(flags.day22V4)||flags.day22V4.complete!==true||flags.day22V4Day23HookPending!==true)return {mode:'BLOCKED_PREREQUISITE'};return {mode:'V4_NEW',input:deriveInput(state)};}
export function beginDay23V4(state){const entry=getDay23V4Entry(state);if(entry.mode!=='V4_NEW')return entry;state.storyFlags.day23V4=initial(entry.input);return {mode:'V4'};}

export function getDay23V4Options(chapter){
  if(['ending','photo_resolution','souvenir_resolution','relationship_resolution','farewell_resolution','conversation_resolution','meeting_resolution'].includes(chapter?.phase))return [];
  if(chapter?.phase==='self_intent')return optionSet(14,'NO_PENDING_CONTACT',selfIntentSuffixes);
  if(chapter?.input?.route==='NO_TRAVEL'&&chapter.phase.startsWith('no_travel_')){
    const number=noTravelPhases[chapter.phase];let result=optionSet(number,'NO_TRAVEL',noTravelSuffixes[number]);
    if(number===3&&!chapter.input.contactAllowed)result=result.filter(option=>!option.id.endsWith('_meet_if_accepted'));
    if(number===6&&!chapter.input.contactAllowed)result=result.filter(option=>option.id.endsWith('_rest_contact'));
    return result;
  }
  const number=mainPhases[chapter?.phase];if(!number)throw new Error(`DAY23_INVALID_PHASE:${chapter?.phase}`);
  let result=optionSet(number,'MAIN',mainSuffixes[number]);
  if(number===5&&!(chapter.input.route==='BUSAN_TRIP'&&chapter.input.contactAllowed))result=result.filter(option=>!option.id.endsWith('_faces'));
  if(number===7&&!chapter.input.landscapePhotoExists&&!chapter.input.sharedPhotoKept&&!chapter.facts.sharedPhotoToday)result=result.filter(option=>!option.id.endsWith('_one_photo'));
  if(number===7&&!chapter.input.contactAllowed)result=result.filter(option=>!option.id.endsWith('_ask_home'));
  if(number===10&&!chapter.input.contactAllowed)result=result.filter(option=>option.id.endsWith('_rest_later'));
  if(number===12){if(!chapter.input.contactAllowed)result=result.filter(option=>!option.id.endsWith('_share_haeun'));if(!chapter.input.jihoonAvailable)result=result.filter(option=>!option.id.endsWith('_tell_jihoon'));}
  if(number===15&&!chapter.input.contactAllowed)result=result.filter(option=>option.id.endsWith('_rest'));
  return result;
}
function addChoice(chapter,number,variant,id){chapter.choices.push({kind:'choice',number,variant,phase:chapter.phase,id});}
function addResolution(chapter,resolution,payload){chapter.choices.push({kind:'resolution',resolution,phase:chapter.phase,...payload});}
function indexFor(id,suffixes){const index=suffixes.findIndex(suffix=>id.endsWith(`_${suffix}`));if(index<0)throw new Error(`DAY23_CHOICE_ID_INVALID:${id}`);return index;}
function reduceNoTravel(chapter,id){const number=noTravelPhases[chapter.phase],index=indexFor(id,noTravelSuffixes[number]),facts=chapter.facts;addChoice(chapter,number,'NO_TRAVEL',id);
  if(number===3){facts.noTravelOuting=['WALK','MEET_IF_ACCEPTED','STAY_HOME'][index];if(index===1){chapter.phase='meeting_resolution';return;}chapter.phase='no_travel_good';}
  if(number===4){facts.noTravelGood=['MEAL_GOOD','LONG_REST','NOT_CHOSEN'][index];chapter.phase='no_travel_record';}
  if(number===5){facts.noTravelRecord=['LANDSCAPE','FUNNY_LINE','NONE'][index];chapter.phase='no_travel_relationship';}
  if(number===6){facts.noTravelRelationship=['ORDINARY_INTEREST','RELATIONSHIP_TALK','REST_CONTACT'][index];chapter.phase='no_travel_contact';}
  if(number===7){facts.noTravelContact=['ANSWER_ONE','NAME_DELAY','NO_FAKE_PROBLEM'][index];chapter.phase='no_travel_tomorrow';}
  if(number===8){facts.noTravelTomorrow=['AGREED_TALK','OWN_SCHEDULE','REST_PROMISE'][index];chapter.phase='ending';}
}
function reduceMain(chapter,id){const phase=chapter.phase,number=mainPhases[phase],variant=phase==='self_intent'?'NO_PENDING_CONTACT':'MAIN',suffixes=phase==='self_intent'?selfIntentSuffixes:mainSuffixes[number],index=indexFor(id,suffixes),facts=chapter.facts;addChoice(chapter,number,variant,id);
  if(number===1){facts.morningSpeed=['BREAKFAST_SLOW','SORT_BAG','TRIM_PLAN'][index];chapter.phase='morning_notice';return;}
  if(number===2){facts.morningNotice=['FAMILIAR_SPACE','HOME_COMFORT','ANOTHER_MORNING'][index];chapter.phase=chapter.input.route==='NO_TRAVEL'?'no_travel_outing':'remaining_time';return;}
  if(number===3){facts.remainingTime=['ONE_VIEW','RETURN_FOCUS','SEPARATE_BRIEFLY'][index];chapter.phase='favorite_moment';return;}
  if(number===4){facts.favoriteMoment=['HAEUN_SMILE','SOLO_VIEW','CHANGE_OK'][index];chapter.phase='departure_record';return;}
  if(number===5){facts.departureRecord=['LANDSCAPE','FACES','NO_PHOTO'][index];if(index===1){chapter.phase='photo_resolution';return;}chapter.phase='souvenir';return;}
  if(number===6){facts.souvenirIntent=['SMALL_ITEM','PHOTOS_ENOUGH','RETURN_WISH'][index];if(index===0){chapter.phase='souvenir_resolution';return;}chapter.phase='return_ride';return;}
  if(number===7){facts.returnRide=['REST','ONE_PHOTO','ASK_HOME'][index];chapter.phase='home_imagination';return;}
  if(number===8){facts.homeImagination=['ORDINARY_STORY','UNPACK','FEEL_EMPTY'][index];chapter.phase='relationship_intent';return;}
  if(number===9){facts.relationshipIntent=['KEEP_MEETING','DISCUSS_MORE','HOME_COMFORT'][index];if(!chapter.input.contactAllowed){facts.haeunRelationshipOutcome='NOT_CONTACTED';chapter.phase='farewell_plan';return;}chapter.phase='relationship_resolution';return;}
  if(number===10){facts.farewellPlan=['ARRIVAL_LINE','EVENING_CALL','REST_LATER'][index];const priorHug=chapter.input.day20FirstHug||chapter.input.day21TodayContact==='HUG'||chapter.input.day22TodayContact==='HUG';if(chapter.input.route==='BUSAN_TRIP'&&chapter.input.relationshipTone==='CALM'&&priorHug&&chapter.facts.haeunRelationshipOutcome==='CONTINUE'){chapter.phase='farewell_resolution';return;}chapter.phase='home_arrival';return;}
  if(number===11){facts.homeArrival=['UNPACK','WATER','FOOD'][index];chapter.phase='small_share';return;}
  if(number===12){facts.smallShare=['SHARE_HAEUN','TELL_JIHOON','KEEP_SELF'][index];chapter.phase='photo_review';return;}
  if(number===13){facts.photoReview=['ONE_PHOTO','NEXT_TIME','LEAVE_UNSORTED'][index];chapter.phase=chapter.input.pendingContacts.length?'pending_contact':'self_intent';return;}
  if(number===14){if(variant==='NO_PENDING_CONTACT')facts.selfIntent=['KEEP_MEETING','FUTURE_TALK','MISS_YOU'][index];else facts.pendingContactAction=['ALIGN_RELATIONSHIP','NAME_UNCERTAINTY','TELL_HAEUN_FIRST'][index];chapter.phase='dinner_call';return;}
  if(number===15){facts.dinnerCall=['EAT_WHILE_CALLING','AFTER_MEAL','REST'][index];chapter.phase=index===2?'conversation_method':'wanted_presence';return;}
  if(number===16){facts.wantedPresence=['SMILING_FACE','BESIDE_SEPARATE_TASKS','SPEECHLESS'][index];chapter.phase='conversation_method';return;}
  if(number===17){facts.conversationMethod=['MEET','PHONE','SCHEDULE_TOGETHER'][index];chapter.phase='conversation_resolution';return;}
}
function reduceChoice(chapter,id){if(chapter.complete)throw new Error('DAY23_ALREADY_COMPLETE');const selected=getDay23V4Options(chapter).find(option=>option.id===id);if(!selected)throw new Error(`DAY23_CHOICE_UNAVAILABLE:${id}`);if(chapter.input.route==='NO_TRAVEL'&&chapter.phase.startsWith('no_travel_'))reduceNoTravel(chapter,id);else reduceMain(chapter,id);return chapter;}
function reducePhoto(chapter,response){if(chapter.phase!=='photo_resolution'||response?.type!=='haeunPhotoResponse'||typeof response.accepted!=='boolean')throw new Error('DAY23_INVALID_PHOTO_RESOLUTION');addResolution(chapter,'PHOTO',{accepted:response.accepted});chapter.facts.sharedPhotoToday=response.accepted;chapter.phase='souvenir';}
function reduceSouvenir(chapter,response){if(chapter.phase!=='souvenir_resolution'||response?.type!=='souvenirPurchaseResponse'||typeof response.purchased!=='boolean')throw new Error('DAY23_INVALID_SOUVENIR_RESOLUTION');if(response.purchased&&(typeof response.itemId!=='string'||!response.itemId||!Number.isFinite(response.cost)||response.cost<=0))throw new Error('DAY23_SOUVENIR_PURCHASE_INVALID');const purchase=response.purchased?{itemId:response.itemId,cost:response.cost}:null;addResolution(chapter,'SOUVENIR',{purchased:response.purchased,purchase});chapter.facts.souvenirPurchase=purchase;chapter.phase='return_ride';}
function reduceRelationship(chapter,response){if(chapter.phase!=='relationship_resolution'||response?.type!=='haeunRelationshipResponse'||!['CONTINUE','DISCUSS','UNSURE','DECLINE'].includes(response.outcome))throw new Error('DAY23_INVALID_RELATIONSHIP_RESOLUTION');addResolution(chapter,'RELATIONSHIP',{outcome:response.outcome});chapter.facts.haeunRelationshipOutcome=response.outcome;chapter.phase='farewell_plan';}
function reduceFarewell(chapter,response){if(chapter.phase!=='farewell_resolution'||response?.type!=='haeunFarewellContactResponse'||typeof response.accepted!=='boolean')throw new Error('DAY23_INVALID_FAREWELL_RESOLUTION');addResolution(chapter,'FAREWELL_CONTACT',{accepted:response.accepted});chapter.facts.farewellContact=response.accepted?'SHORT_HUG':'NONE';chapter.phase='home_arrival';}
function reduceMeeting(chapter,response){if(chapter.phase!=='meeting_resolution'||response?.type!=='haeunMeetingResponse'||typeof response.accepted!=='boolean')throw new Error('DAY23_INVALID_MEETING_RESOLUTION');addResolution(chapter,'MEETING',{accepted:response.accepted});chapter.facts.noTravelMeetingAccepted=response.accepted;chapter.phase='no_travel_good';}
function reduceConversation(chapter,response){if(chapter.phase!=='conversation_resolution'||response?.type!=='haeunConversationResponse'||typeof response.accepted!=='boolean')throw new Error('DAY23_INVALID_CONVERSATION_RESOLUTION');addResolution(chapter,'CONVERSATION',{accepted:response.accepted});chapter.facts.nextConversation=response.accepted?chapter.facts.conversationMethod:'NOT_AGREED';chapter.phase='ending';}

export function validateDay23V4(chapter){try{if(chapter?.schema!==DAY23_V4_SCHEMA||!Array.isArray(chapter.choices)||typeof chapter.complete!=='boolean')return false;const input=chapter.input;if(!['BUSAN_TRIP','SEOUL_DAY','NO_TRAVEL'].includes(input?.route)||!['BUSAN_SHARED','BUSAN_SEPARATE','HOME_AFTER_SEOUL','HOME_NO_TRAVEL'].includes(input?.morningMode)||!['CALM','DIFFICULT','QUIET'].includes(input?.relationshipTone))return false;for(const key of['relationshipActive','contactAllowed','sharedLodgingSpace','day20StayedOver','day20FirstHug','day20HeldHands','landscapePhotoExists','sharedPhotoKept','sharedPhotoDeleted','day22PhotoMessageSent','jihoonAvailable'])if(typeof input[key]!=='boolean')return false;if(!Array.isArray(input.pendingContacts)||new Set(input.pendingContacts).size!==input.pendingContacts.length||input.pendingContacts.some(contact=>!['YURI','SEOJIN','ARA'].includes(contact)))return false;if(input.source?.day20Schema!=='day20-notion-v4/1'||input.source?.day21Schema!=='day21-notion-v4/1'||input.source?.day22Schema!=='day22-notion-v4/1')return false;const expectedMorning=input.route==='BUSAN_TRIP'?(input.sharedLodgingSpace?'BUSAN_SHARED':'BUSAN_SEPARATE'):input.route==='SEOUL_DAY'?'HOME_AFTER_SEOUL':'HOME_NO_TRAVEL';if(input.morningMode!==expectedMorning||(!input.relationshipActive&&input.contactAllowed)||(input.route!=='BUSAN_TRIP'&&input.sharedLodgingSpace)||(input.sharedPhotoKept&&input.sharedPhotoDeleted))return false;const replay=initial(input);for(const record of chapter.choices){if(record.phase!==replay.phase)return false;if(record.kind==='choice')reduceChoice(replay,record.id);else if(record.kind==='resolution'&&record.resolution==='PHOTO')reducePhoto(replay,{type:'haeunPhotoResponse',accepted:record.accepted});else if(record.kind==='resolution'&&record.resolution==='SOUVENIR')reduceSouvenir(replay,{type:'souvenirPurchaseResponse',purchased:record.purchased,...(record.purchase??{})});else if(record.kind==='resolution'&&record.resolution==='RELATIONSHIP')reduceRelationship(replay,{type:'haeunRelationshipResponse',outcome:record.outcome});else if(record.kind==='resolution'&&record.resolution==='FAREWELL_CONTACT')reduceFarewell(replay,{type:'haeunFarewellContactResponse',accepted:record.accepted});else if(record.kind==='resolution'&&record.resolution==='MEETING')reduceMeeting(replay,{type:'haeunMeetingResponse',accepted:record.accepted});else if(record.kind==='resolution'&&record.resolution==='CONVERSATION')reduceConversation(replay,{type:'haeunConversationResponse',accepted:record.accepted});else return false;}if(chapter.complete&&replay.phase!=='ending')return false;replay.complete=chapter.complete;return JSON.stringify(replay)===JSON.stringify(chapter);}catch{return false;}}
export function applyDay23V4Choice(state,id){const chapter=state?.storyFlags?.day23V4;if(!validateDay23V4(chapter))throw new Error('DAY23_INVALID_SAVE');const next=reduceChoice(clone(chapter),id);state.storyFlags.day23V4=next;return clone(next);}
export function resolveDay23V4Photo(state,response){const chapter=state?.storyFlags?.day23V4;if(!validateDay23V4(chapter))throw new Error('DAY23_INVALID_SAVE');const next=clone(chapter);reducePhoto(next,response);state.storyFlags.day23V4=next;return clone(next);}
export function resolveDay23V4Souvenir(state,response){const chapter=state?.storyFlags?.day23V4;if(!validateDay23V4(chapter))throw new Error('DAY23_INVALID_SAVE');const next=clone(chapter);reduceSouvenir(next,response);state.storyFlags.day23V4=next;return clone(next);}
export function resolveDay23V4Relationship(state,response){const chapter=state?.storyFlags?.day23V4;if(!validateDay23V4(chapter))throw new Error('DAY23_INVALID_SAVE');const next=clone(chapter);reduceRelationship(next,response);state.storyFlags.day23V4=next;return clone(next);}
export function resolveDay23V4FarewellContact(state,response){const chapter=state?.storyFlags?.day23V4;if(!validateDay23V4(chapter))throw new Error('DAY23_INVALID_SAVE');const next=clone(chapter);reduceFarewell(next,response);state.storyFlags.day23V4=next;return clone(next);}
export function resolveDay23V4Meeting(state,response){const chapter=state?.storyFlags?.day23V4;if(!validateDay23V4(chapter))throw new Error('DAY23_INVALID_SAVE');const next=clone(chapter);reduceMeeting(next,response);state.storyFlags.day23V4=next;return clone(next);}
export function resolveDay23V4Conversation(state,response){const chapter=state?.storyFlags?.day23V4;if(!validateDay23V4(chapter))throw new Error('DAY23_INVALID_SAVE');const next=clone(chapter);reduceConversation(next,response);state.storyFlags.day23V4=next;return clone(next);}
export function completeDay23V4(state,cue){const chapter=state?.storyFlags?.day23V4;if(!validateDay23V4(chapter)||chapter.phase!=='ending'||cue?.type!=='chapterCompletionCue'||cue.day!==23||cue.finalSceneReached!==true)throw new Error('DAY23_INVALID_COMPLETION');if(chapter.complete)return clone(chapter);chapter.complete=true;state.storyFlags.day23V4Day24HookPending=true;state.storyFlags.day22V4Day23HookPending=false;return clone(chapter);}
