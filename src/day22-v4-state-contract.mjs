import {validateDay21V4} from './day21-v4-state-contract.mjs';
import {DAY22_V4_SOURCE_SCENES} from './day22-v4-source-registry.mjs';

export const DAY22_V4_SCHEMA = 'day22-notion-v4/1';
const clone=value=>JSON.parse(JSON.stringify(value));
const legacyKeys=['day22RestStrategy','day22ContactStrategy','day22ActivityStrategy','day22RuntimeStage','day22CurrentRecoveryDayCompleted','day22RuntimeComplete'];
const travelPhases=Object.freeze({baggage:1,movement:2,first_plan:3,meal_record:4,pace:5,photo_share:6,cafe:7,shared_photo:8,expectations:9,mutual_plan:10,rest_order:11,unwind:12,presence:13,contact:14,reflection:15,dinner:16,seoul_return:17});
const noTravelPhases=Object.freeze({no_travel_day:3,no_travel_meal:4,no_travel_photo:5,no_travel_contact:6,no_travel_evening:7,no_travel_tomorrow:8});
const travelSuffixes=Object.freeze({
  1:['remove_now','carry_own','trim_route'],2:['watch_together','separate_music','close_eyes'],3:['eat_first','one_nearby','rest_more'],
  4:['keep_in_progress','just_eat','ask_taste'],5:['separate_briefly','sit_together','name_tired'],6:['album_only','show_haeun','send_exchange'],
  7:['take_available_seat','wait_with_limit','name_disappointment'],8:['keep_if_mutual','retake_once','stop_photos'],
  9:['count_good','name_disappointment','trim_tomorrow'],10:['tired_not_ruin','wanted_approval','say_current_wants'],
  11:['haeun_prepare_first','rest_separately','name_my_fatigue'],12:['water_and_rest','prepare_myself','like_relaxed_face'],
  13:['be_here_together','check_one_thing','rest_is_hard'],14:['hug','hold_hands','rest_as_is'],
  15:['said_needs','wanted_to_be_good','not_all_together'],16:['eat_nearby','eat_simple','eat_light'],
  17:['choose_photo_tomorrow','rest_separately','say_unsaid']
});
const noTravelSuffixes=Object.freeze({3:['walk_nearby','small_home_task','rest'],4:['familiar_food','try_one_new','eat_home_food'],5:['album_only','send_haeun','send_exchange'],6:['ask_haeun_day','say_rested','name_disappointment'],7:['prepare_clothes','answer_one_contact','stop_planning'],8:['talk_again','rest_tomorrow','repeat_one_good_thing']});

function sourceChoice(number,variant){const found=DAY22_V4_SOURCE_SCENES.flatMap(scene=>scene.choices).find(choice=>choice.number===number&&choice.variant===variant);if(!found)throw new Error(`DAY22_SOURCE_CHOICE_MISSING:${variant}:${number}`);return found;}
function options(number,variant){const choice=sourceChoice(number,variant),suffixes=variant==='NO_TRAVEL'?noTravelSuffixes:travelSuffixes;return choice.labels.map((label,index)=>Object.freeze({id:`day22_v4_c${number}_${variant.toLowerCase()}_${suffixes[number][index]}`,label}));}
function priorChoice(chapter,number){return chapter.choices.find(item=>item.kind==='choice'&&item.number===number)?.id??null;}
function checksValid(checks){return checks?.date===true&&checks.transport===true&&checks.budget===true&&checks.mutual===true&&checks.lodging===true;}
function purchaseValid(purchase){return purchase?.day===21&&typeof purchase.quoteId==='string'&&purchase.quoteId.length>0&&Number.isFinite(purchase.playerCost)&&purchase.playerCost>0&&purchase.partnerCostIncluded===false;}
function deriveInput(state){
  const flags=state.storyFlags,day21=flags.day21V4,purchase=flags.day21V4TravelPurchase??null;
  const relationshipActive=state.breakup==null&&state.ended!==true&&day21.input.relationshipActive;
  const contactAllowed=relationshipActive&&day21.input.contactAllowed;
  const validBusan=day21.facts.travelResult==='BUSAN_CONFIRMED'&&day21.facts.bookingConfirmed===true&&day21.facts.travelPaymentMade===true&&checksValid(day21.facts.travelChecks)&&purchaseValid(purchase);
  const route=validBusan?'BUSAN_TRIP':day21.facts.travelResult==='SEOUL_DAY'&&relationshipActive?'SEOUL_DAY':'NO_TRAVEL';
  const araPhotoExchange=flags.day13V3AraMet===true&&flags.day13V3AraEarlyExit!==true&&(flags.day13V3AraContinuation==='ASK_PHOTO_CONTACT'||flags.day13V3PhotoContact==='OCCASIONAL_EXCHANGE');
  return {route,relationshipActive,contactAllowed,relationshipTone:day21.input.relationshipTone,companion:route==='NO_TRAVEL'?'NONE':'HAEUN',
    day21TravelResult:day21.facts.travelResult,day21TravelDiscussion:day21.facts.travelDiscussion===true,day21TravelChecks:clone(day21.facts.travelChecks),
    day21BookingConfirmed:day21.facts.bookingConfirmed===true,day21TravelPaymentMade:day21.facts.travelPaymentMade===true,
    day21TravelPurchase:validBusan?clone(purchase):null,day21LodgingAgreement:day21.facts.lodgingAgreement,sharedLodgingSpace:validBusan&&day21.facts.lodgingAgreement==='SHARED_ROOM_AGREED',day21TodayContact:day21.facts.todayContact,
    day20FirstHug:day21.input.day20FirstHug===true,day20HeldHands:day21.input.day20HeldHands===true,day20StayedOver:day21.input.day20StayedOver===true,
    araPhotoExchange,source:{day21Schema:day21.schema,day21Choice16:priorChoice(day21,16),day21DeferredChoice8:priorChoice(day21,8)}};
}
function initial(input){return {schema:DAY22_V4_SCHEMA,input:clone(input),choices:[],phase:input.route==='NO_TRAVEL'?'no_travel_day':'baggage',complete:false,facts:{
  route:input.route,baggagePlan:null,movementPlan:null,firstPlan:null,mealRecord:null,pacePlan:null,separateMeeting:null,landscapePhotoExists:false,
  photoRecipient:null,photoMessageSent:false,cafeVisited:false,cafePlan:null,sharedPhotoPlan:null,sharedPhotoKept:false,sharedPhotoDeleted:false,
  expectationPlan:null,mutualPlan:null,restOrder:null,unwindPlan:null,presencePlan:null,contactIntent:null,todayContact:null,reflection:null,
  dinnerPlan:null,seoulReturnWords:null,noTravelDay:null,noTravelMeal:null,noTravelPhotoTarget:null,noTravelContact:null,noTravelEvening:null,noTravelTomorrow:null
}};}

export function getDay22V4Entry(state){const flags=state?.storyFlags??{};if(flags.day22V4!=null)return {mode:validateDay22V4(flags.day22V4)?'V4':'INVALID_V4'};if(legacyKeys.some(key=>flags[key]!=null&&flags[key]!==false&&flags[key]!==0))return {mode:'LEGACY'};if(!validateDay21V4(flags.day21V4)||flags.day21V4.complete!==true||flags.day21V4Day22HookPending!==true)return {mode:'BLOCKED_PREREQUISITE'};return {mode:'V4_NEW',input:deriveInput(state)};}
export function beginDay22V4(state){const entry=getDay22V4Entry(state);if(entry.mode!=='V4_NEW')return entry;state.storyFlags.day22V4=initial(entry.input);return {mode:'V4'};}

export function getDay22V4Options(chapter){
  if(['ending','photo_resolution','contact_resolution'].includes(chapter?.phase))return [];
  const variant=chapter.input.route==='NO_TRAVEL'?'NO_TRAVEL':'TRAVEL';const phases=variant==='NO_TRAVEL'?noTravelPhases:travelPhases;const number=phases[chapter.phase];if(!number)throw new Error(`DAY22_INVALID_PHASE:${chapter?.phase}`);
  let result=options(number,variant);
  if(variant==='TRAVEL'&&number===6&&!chapter.input.araPhotoExchange)result=result.filter(option=>!option.id.endsWith('_send_exchange'));
  if(variant==='TRAVEL'&&number===12&&!chapter.input.sharedLodgingSpace)result=result.filter(option=>!option.id.endsWith('_like_relaxed_face'));
  if(variant==='TRAVEL'&&number===14&&!chapter.input.sharedLodgingSpace)result=result.filter(option=>option.id.endsWith('_rest_as_is'));
  if(variant==='NO_TRAVEL'&&number===5){if(!chapter.input.contactAllowed)result=result.filter(option=>!option.id.endsWith('_send_haeun'));if(!chapter.input.araPhotoExchange)result=result.filter(option=>!option.id.endsWith('_send_exchange'));}
  return result;
}
function addChoice(chapter,number,variant,id){chapter.choices.push({kind:'choice',number,variant,phase:chapter.phase,id});}
function reduceNoTravel(chapter,id){const number=noTravelPhases[chapter.phase],index=noTravelSuffixes[number].findIndex(suffix=>id.endsWith(`_${suffix}`)),facts=chapter.facts;addChoice(chapter,number,'NO_TRAVEL',id);
  if(number===3){facts.noTravelDay=['WALK_NEARBY','SMALL_HOME_TASK','REST'][index];chapter.phase='no_travel_meal';}
  if(number===4){facts.noTravelMeal=['FAMILIAR','ONE_NEW','HOME_FOOD'][index];chapter.phase='no_travel_photo';}
  if(number===5){facts.noTravelPhotoTarget=['ALBUM','HAEUN','EXCHANGE_CONTACT'][index];facts.photoMessageSent=false;chapter.phase=chapter.input.contactAllowed?'no_travel_contact':'no_travel_evening';}
  if(number===6){facts.noTravelContact=['ASK_DAY','SAY_RESTED','NAME_DISAPPOINTMENT'][index];chapter.phase='no_travel_evening';}
  if(number===7){facts.noTravelEvening=['PREPARE_CLOTHES','ANSWER_ONE_CONTACT','STOP_PLANNING'][index];chapter.phase='no_travel_tomorrow';}
  if(number===8){facts.noTravelTomorrow=['TALK_AGAIN','REST_TOMORROW','REPEAT_GOOD'][index];chapter.phase='ending';}
}
function reduceTravel(chapter,id){const number=travelPhases[chapter.phase],index=travelSuffixes[number].findIndex(suffix=>id.endsWith(`_${suffix}`)),facts=chapter.facts;addChoice(chapter,number,'TRAVEL',id);
  const next={1:'movement',2:'first_plan',3:'meal_record',4:'pace',5:'photo_share',6:'cafe',7:'shared_photo',8:'expectations',9:'mutual_plan',10:'rest_order',11:'unwind',12:'presence',13:'contact',15:'dinner'};
  if(number===1)facts.baggagePlan=['REMOVE_NOW','CARRY_OWN','TRIM_ROUTE'][index];
  if(number===2)facts.movementPlan=['WATCH_TOGETHER','SEPARATE_MUSIC','CLOSE_EYES'][index];
  if(number===3)facts.firstPlan=['EAT_FIRST','ONE_NEARBY','REST_MORE'][index];
  if(number===4)facts.mealRecord=['IN_PROGRESS_PHOTO','NO_PHOTO','ASK_TASTE'][index];
  if(number===5){facts.pacePlan=['SEPARATE_BRIEFLY','SIT_TOGETHER','NAME_TIRED'][index];if(index===0)facts.separateMeeting={place:'AGREED_EASY_TO_FIND',time:'AGREED',contactAvailable:chapter.input.contactAllowed,reunited:false};}
  if(number===6){if(facts.separateMeeting)facts.separateMeeting.reunited=true;facts.landscapePhotoExists=true;facts.photoRecipient=['ALBUM','HAEUN','EXCHANGE_CONTACT'][index];facts.photoMessageSent=index>0;}
  if(number===7){facts.cafeVisited=true;facts.cafePlan=['TAKE_AVAILABLE','WAIT_WITH_LIMIT','NAME_DISAPPOINTMENT'][index];}
  if(number===8){facts.sharedPhotoPlan=['KEEP_IF_MUTUAL','RETAKE_ONCE','STOP'][index];if(index<2){chapter.phase='photo_resolution';return;}facts.sharedPhotoKept=false;facts.sharedPhotoDeleted=true;chapter.phase='expectations';return;}
  if(number===9)facts.expectationPlan=['COUNT_GOOD','NAME_DISAPPOINTMENT','TRIM_TOMORROW'][index];
  if(number===10)facts.mutualPlan=['TIRED_NOT_RUIN','WANTED_APPROVAL','SAY_CURRENT_WANTS'][index];
  if(number===11)facts.restOrder=['HAEUN_PREPARE_FIRST','REST_SEPARATELY','NAME_MY_FATIGUE'][index];
  if(number===12)facts.unwindPlan=['WATER_AND_REST','PREPARE_MYSELF','LIKE_RELAXED_FACE'][index];
  if(number===13)facts.presencePlan=['BE_HERE_TOGETHER','CHECK_ONE_THING','REST_IS_HARD'][index];
  if(number===14){facts.contactIntent=['HUG','HAND','REST'][index];if(index<2){chapter.phase='contact_resolution';return;}facts.todayContact='NONE';chapter.phase='reflection';return;}
  if(number===15)facts.reflection=['SAID_NEEDS','WANTED_TO_BE_GOOD','NOT_ALL_TOGETHER'][index];
  if(number===16){facts.dinnerPlan=['EAT_NEARBY','EAT_SIMPLE','EAT_LIGHT'][index];chapter.phase=chapter.input.route==='SEOUL_DAY'?'seoul_return':'ending';return;}
  if(number===17){facts.seoulReturnWords=['CHOOSE_PHOTO_TOMORROW','REST_SEPARATELY','SAY_UNSAID'][index];chapter.phase='ending';return;}
  chapter.phase=next[number];
}
function reduceChoice(chapter,id){if(chapter.complete)throw new Error('DAY22_ALREADY_COMPLETE');const selected=getDay22V4Options(chapter).find(option=>option.id===id);if(!selected)throw new Error(`DAY22_CHOICE_UNAVAILABLE:${id}`);if(chapter.input.route==='NO_TRAVEL')reduceNoTravel(chapter,id);else reduceTravel(chapter,id);return chapter;}
function addResolution(chapter,resolution,payload){chapter.choices.push({kind:'resolution',resolution,phase:chapter.phase,...payload});}
function reducePhoto(chapter,response){if(chapter.phase!=='photo_resolution'||response?.type!=='haeunPhotoResponse'||typeof response.keepAccepted!=='boolean')throw new Error('DAY22_INVALID_PHOTO_RESOLUTION');addResolution(chapter,'PHOTO',{keepAccepted:response.keepAccepted});chapter.facts.sharedPhotoKept=response.keepAccepted;chapter.facts.sharedPhotoDeleted=!response.keepAccepted;chapter.phase='expectations';}
function reduceContact(chapter,response){if(chapter.phase!=='contact_resolution'||response?.type!=='haeunContactResponse'||typeof response.accepted!=='boolean')throw new Error('DAY22_INVALID_CONTACT_RESOLUTION');const contact=chapter.facts.contactIntent;if(!['HUG','HAND'].includes(contact)||response.contact!==contact)throw new Error('DAY22_CONTACT_RESOLUTION_MISMATCH');addResolution(chapter,'CONTACT',{contact,accepted:response.accepted});chapter.facts.todayContact=response.accepted?contact:'NONE';chapter.phase='reflection';}

export function validateDay22V4(chapter){try{if(chapter?.schema!==DAY22_V4_SCHEMA||!Array.isArray(chapter.choices)||typeof chapter.complete!=='boolean')return false;const input=chapter.input;if(!['BUSAN_TRIP','SEOUL_DAY','NO_TRAVEL'].includes(input?.route)||!['CALM','DIFFICULT','QUIET'].includes(input?.relationshipTone))return false;for(const key of['relationshipActive','contactAllowed','day21TravelDiscussion','day21BookingConfirmed','day21TravelPaymentMade','sharedLodgingSpace','day20FirstHug','day20HeldHands','day20StayedOver','araPhotoExchange'])if(typeof input[key]!=='boolean')return false;const travelRoute=input.route!=='NO_TRAVEL',expectedShared=input.route==='BUSAN_TRIP'&&input.day21LodgingAgreement==='SHARED_ROOM_AGREED';if((!input.relationshipActive&&input.contactAllowed)||input.sharedLodgingSpace!==expectedShared||(travelRoute&&(!input.relationshipActive||!input.contactAllowed||input.companion!=='HAEUN'))||(input.route==='BUSAN_TRIP'&&(!checksValid(input.day21TravelChecks)||!purchaseValid(input.day21TravelPurchase)||input.day21TravelResult!=='BUSAN_CONFIRMED'||!input.day21BookingConfirmed||!input.day21TravelPaymentMade))||(input.route==='SEOUL_DAY'&&(input.day21TravelResult!=='SEOUL_DAY'||input.day21TravelPurchase!==null))||(input.route==='NO_TRAVEL'&&(input.companion!=='NONE'||input.day21TravelPurchase!==null)))return false;const replay=initial(input);for(const record of chapter.choices){if(record.phase!==replay.phase)return false;if(record.kind==='choice')reduceChoice(replay,record.id);else if(record.kind==='resolution'&&record.resolution==='PHOTO')reducePhoto(replay,{type:'haeunPhotoResponse',keepAccepted:record.keepAccepted});else if(record.kind==='resolution'&&record.resolution==='CONTACT')reduceContact(replay,{type:'haeunContactResponse',contact:record.contact,accepted:record.accepted});else return false;}if(chapter.complete&&replay.phase!=='ending')return false;replay.complete=chapter.complete;return JSON.stringify(replay)===JSON.stringify(chapter);}catch{return false;}}
export function applyDay22V4Choice(state,id){const chapter=state?.storyFlags?.day22V4;if(!validateDay22V4(chapter))throw new Error('DAY22_INVALID_SAVE');const next=reduceChoice(clone(chapter),id);state.storyFlags.day22V4=next;return clone(next);}
export function resolveDay22V4Photo(state,response){const chapter=state?.storyFlags?.day22V4;if(!validateDay22V4(chapter))throw new Error('DAY22_INVALID_SAVE');const next=clone(chapter);reducePhoto(next,response);state.storyFlags.day22V4=next;return clone(next);}
export function resolveDay22V4Contact(state,response){const chapter=state?.storyFlags?.day22V4;if(!validateDay22V4(chapter))throw new Error('DAY22_INVALID_SAVE');const next=clone(chapter);reduceContact(next,response);state.storyFlags.day22V4=next;return clone(next);}
export function completeDay22V4(state,cue){const chapter=state?.storyFlags?.day22V4;if(!validateDay22V4(chapter)||chapter.phase!=='ending'||cue?.type!=='chapterCompletionCue'||cue.day!==22||cue.finalSceneReached!==true)throw new Error('DAY22_INVALID_COMPLETION');if(chapter.complete)return clone(chapter);chapter.complete=true;state.storyFlags.day22V4Day23HookPending=true;state.storyFlags.day21V4Day22HookPending=false;return clone(chapter);}
