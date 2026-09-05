import {validateDay19V4} from './day19-v4-state-contract.mjs';
import {DAY20_V4_SOURCE_SCENES} from './day20-v4-source-registry.mjs';

export const DAY20_V4_SCHEMA = 'day20-notion-v4/1';
const clone = value => JSON.parse(JSON.stringify(value));
const legacyKeys = ['day20MenuStrategy','day20CostStrategy','day20FinishStrategy','day20RuntimeStage','day20CurrentSharedMealCompleted','day20RuntimeComplete'];
const facePhases = Object.freeze({preparation:1,request:2,cup:3,kitchen:4,dinner:5,quiet:6,shared_screen:7,extension:8,clothes:9,closeness:10,next_evening:11,song:12,night_end:13,sleeping:14});
const soloPhases = Object.freeze({solo_story:5,solo_time:6,solo_tomorrow:7,solo_contact:8});
const suffixes = Object.freeze({1:['simple_food','cook_together','short_tea'],2:['own_food','one_needed_item','just_come'],3:['fits_hand','my_cup','reserve_cup'],4:['split_roles','switch_roles','use_what_exists'],5:['small_story','eat_quietly','disclose'],6:['sit','music','name_worry'],7:['separate_screens','ask_shared_part','notice_presence'],8:['tea','stay_longer','leave_if_tired'],9:['looks_comfortable','change_too','not_guest'],10:['hug','hold_hands','current_distance'],11:['another_evening','side_by_side','check_pace'],12:['room_feels_different','remember_laugh','another_song'],13:['end_here','talk_a_little','offer_stay'],14:['see_tomorrow','remember_comfort','independent_morning']});
const soloSuffixes = Object.freeze({5:['tell_jihoon','light_check_in','keep_for_self'],6:['one_song','few_pages','lie_down'],7:['prepare_food','hang_clothes','rest'],8:['ask_next_time','rest_today','leave_one_story']});

function previousChoiceId(chapter, number) { return chapter.choices.find(choice => (choice.kind == null || choice.kind === 'choice') && choice.number === number)?.id ?? null; }
function sourceChoice(number, variant) {
  const choice = DAY20_V4_SOURCE_SCENES.flatMap(scene => scene.choices).find(item => item.number === number && item.variant === variant);
  if (!choice) throw new Error(`DAY20_SOURCE_CHOICE_MISSING:${variant}:${number}`);
  return choice;
}
function options(number, variant) {
  const choice = sourceChoice(number, variant), list = variant === 'SOLO' ? soloSuffixes[number] : suffixes[number];
  return choice.labels.map((label,index) => Object.freeze({id:`day20_v4_c${number}_${variant.toLowerCase()}_${list[index]}`,label}));
}
function deriveInput(state) {
  const day19 = state.storyFlags.day19V4, mealAccepted = day19.facts.tomorrowMeal === 'ACCEPTED';
  const relationshipActive = state.breakup == null && state.ended !== true && day19.input.relationshipActive;
  const contactAllowed = relationshipActive && day19.input.contactAllowed;
  const visitMode = mealAccepted && contactAllowed ? 'FACE_TO_FACE' : 'SOLO';
  return {visitMode,relationshipActive,contactAllowed,invitation:{status:visitMode === 'FACE_TO_FACE'?'ACCEPTED':'NONE',sourceChoiceId:visitMode === 'FACE_TO_FACE'?previousChoiceId(day19,13):null},day19TomorrowMeal:day19.facts.tomorrowMeal,day19TomorrowTable:day19.facts.tomorrowTable,cupConversationExperienced:day19.facts.tomorrowTable === 'CUPS_TOGETHER',sharedTravelConversationExperienced:day19.input.sharedPlanningEligible === true,relationshipTone:day19.input.relationshipTone,day18DiscussionPending:day19.input.day18DiscussionPending,source:{day19Schema:day19.schema,day19Choice13:previousChoiceId(day19,13),day19Choice14:previousChoiceId(day19,14)}};
}
function initial(input) {
  return {schema:DAY20_V4_SCHEMA,input:clone(input),choices:[],phase:'preparation',complete:false,facts:{visitMode:input.visitMode,preparation:null,broughtItem:null,requestedItem:null,cupChoice:null,kitchenPlan:null,dinnerConversation:null,disclosureRoute:null,quietTime:null,sharedScreenContent:null,eveningExtension:null,borrowedClothes:false,comfortResponse:null,closenessChoice:null,firstHug:false,satSideBySide:false,heldHands:false,nextInvitation:null,songResponse:null,nightEnd:null,stayedOver:false,sleepingPlan:null,soloStory:null,soloTime:null,soloTomorrow:null,soloNextContact:null}};
}

export function getDay20V4Entry(state) {
  const flags=state?.storyFlags??{};
  if(flags.day20V4!=null)return {mode:validateDay20V4(flags.day20V4)?'V4':'INVALID_V4'};
  if(legacyKeys.some(key=>flags[key]!=null&&flags[key]!==false&&flags[key]!==0))return {mode:'LEGACY'};
  if(!validateDay19V4(flags.day19V4)||flags.day19V4.complete!==true||flags.day19V4Day20HookPending!==true)return {mode:'BLOCKED_PREREQUISITE'};
  return {mode:'V4_NEW',input:deriveInput(state)};
}
export function beginDay20V4(state){const entry=getDay20V4Entry(state);if(entry.mode!=='V4_NEW')return entry;state.storyFlags.day20V4=initial(entry.input);return {mode:'V4'};}

export function getDay20V4Options(chapter) {
  if(['ending','contact_resolution','stay_resolution'].includes(chapter?.phase))return [];
  if(chapter?.input?.visitMode==='SOLO'){
    if(chapter.phase==='preparation')return options(1,'FACE_TO_FACE');
    if(chapter.phase==='request')return options(2,'FACE_TO_FACE');
    if(chapter.phase==='cup')return options(3,'FACE_TO_FACE');
    const number=soloPhases[chapter.phase];if(!number)throw new Error(`DAY20_INVALID_SOLO_PHASE:${chapter?.phase}`);
    const result=options(number,'SOLO');return number===8&&!chapter.input.contactAllowed?result.filter(option=>option.id.endsWith('_rest_today')):result;
  }
  if(chapter?.phase==='conflict')return options(10,'CONFLICT');
  const number=facePhases[chapter?.phase];if(!number)throw new Error(`DAY20_INVALID_FACE_PHASE:${chapter?.phase}`);
  let result=options(number,'FACE_TO_FACE');
  if(number===5&&!chapter.input.day18DiscussionPending)result=result.filter(option=>!option.id.endsWith('_disclose'));
  if(number===13&&chapter.facts.preparation==='SHORT_TEA')result=result.filter(option=>option.id.endsWith('_end_here'));
  return result;
}
function addChoice(chapter,number,variant,id){chapter.choices.push({kind:'choice',number,variant,phase:chapter.phase,id});}
function reduceChoice(chapter,id){
  if(chapter.complete)throw new Error('DAY20_ALREADY_COMPLETE');const selected=getDay20V4Options(chapter).find(option=>option.id===id);if(!selected)throw new Error(`DAY20_CHOICE_UNAVAILABLE:${id}`);const facts=chapter.facts;
  if(chapter.input.visitMode==='SOLO'&&soloPhases[chapter.phase]){const number=soloPhases[chapter.phase],index=soloSuffixes[number].findIndex(suffix=>id.endsWith(`_${suffix}`));addChoice(chapter,number,'SOLO',id);if(number===5){facts.soloStory=['JIHOON','HAEUN_CHECK_IN','KEEP_PRIVATE'][index];chapter.phase='solo_time';}if(number===6){facts.soloTime=['ONE_SONG','FEW_PAGES','LIE_DOWN'][index];chapter.phase='solo_tomorrow';}if(number===7){facts.soloTomorrow=['PREPARE_FOOD','HANG_CLOTHES','REST'][index];chapter.phase='solo_contact';}if(number===8){facts.soloNextContact=['ASK_NEXT_TIME','REST_TODAY','LEAVE_ONE_STORY'][index];chapter.phase='ending';}return chapter;}
  const number=facePhases[chapter.phase]??10,variant=chapter.phase==='conflict'?'CONFLICT':'FACE_TO_FACE',index=suffixes[number].findIndex(suffix=>id.endsWith(`_${suffix}`));addChoice(chapter,number,variant,id);
  switch(chapter.phase){
    case'preparation':facts.preparation=['SIMPLE_FOOD','COOK_TOGETHER','SHORT_TEA'][index];chapter.phase='request';break;
    case'request':facts.requestedItem=['HAEUN_OWN_FOOD','ONE_NEEDED_ITEM','NONE'][index];chapter.phase='cup';break;
    case'cup':facts.cupChoice=['HAND_FIT','OWN_PREFERENCE','NO_PERMANENT_CUP'][index];chapter.phase=chapter.input.visitMode==='SOLO'?'solo_story':facts.preparation==='SHORT_TEA'?'night_end':'kitchen';break;
    case'kitchen':facts.kitchenPlan=['SPLIT_ROLES','SWITCH_ROLES','USE_WHAT_EXISTS'][index];chapter.phase='dinner';break;
    case'dinner':facts.dinnerConversation=['SMALL_STORY','EAT_QUIETLY','DISCLOSURE'][index];if(index===2){facts.disclosureRoute='DISCLOSED_EXISTING_FACTS';chapter.phase='conflict';}else chapter.phase='quiet';break;
    case'conflict':facts.disclosureRoute=['STOP_FOR_TODAY','ANSWER_ACTUAL_FACTS','NAME_FEAR_WITHOUT_CONTROL'][index];facts.nightEnd='LEAVE_AFTER_CONFLICT';chapter.phase='ending';break;
    case'quiet':facts.quietTime=['SIT','MUSIC','NAME_OVERFUNCTIONING'][index];chapter.phase='shared_screen';break;
    case'shared_screen':facts.sharedScreenContent=['SEPARATE','REQUESTED_SHARED_PART_ONLY','PRESENCE_NOTICED'][index];chapter.phase='extension';break;
    case'extension':facts.eveningExtension=['TEA_IF_WANTED','MUTUAL_MORE_TIME','LEAVE_IF_TIRED'][index];chapter.phase='clothes';break;
    case'clothes':facts.comfortResponse=['GIVE_SPACE','CHANGE_SEPARATELY','PRIVACY_REMAINS'][index];chapter.phase='closeness';break;
    case'closeness':facts.closenessChoice=['HUG_REQUESTED','HAND_REQUESTED','CURRENT_DISTANCE'][index];if(index<2)chapter.phase='contact_resolution';else{facts.satSideBySide=true;chapter.phase='next_evening';}break;
    case'next_evening':facts.nextInvitation=['MUTUAL_SIMILAR_EVENING','SIDE_BY_SIDE_DESIRED','PACE_OPEN'][index];chapter.phase='song';break;
    case'song':facts.songResponse=['ROOM_CHANGED','REMEMBER_LAUGH','ANOTHER_SONG_WITH_LIMIT'][index];chapter.phase='night_end';break;
    case'night_end':facts.nightEnd=['END_HERE','SHORT_EXTENSION','STAY_OFFERED'][index];chapter.phase=index===2?'stay_resolution':'ending';break;
    case'sleeping':facts.sleepingPlan={...facts.sleepingPlan,lastWords:['SEE_TOMORROW','REMEMBER_COMFORT','INDEPENDENT_MORNING'][index]};chapter.phase='ending';break;
    default:throw new Error(`DAY20_INVALID_PHASE:${chapter.phase}`);
  }return chapter;
}
function addResolution(chapter,resolution,payload){chapter.choices.push({kind:'resolution',resolution,phase:chapter.phase,...payload});}
function reduceContact(chapter,response){if(chapter.phase!=='contact_resolution'||response?.type!=='haeunContactResponse'||typeof response.accepted!=='boolean')throw new Error('DAY20_INVALID_CONTACT_RESOLUTION');const contact=chapter.facts.closenessChoice==='HUG_REQUESTED'?'HUG':chapter.facts.closenessChoice==='HAND_REQUESTED'?'HAND':null;if(!contact||response.contact!==contact)throw new Error('DAY20_CONTACT_RESOLUTION_MISMATCH');addResolution(chapter,'CONTACT',{contact,accepted:response.accepted});if(response.accepted&&contact==='HUG')chapter.facts.firstHug=true;if(response.accepted&&contact==='HAND')chapter.facts.heldHands=true;chapter.facts.satSideBySide=true;chapter.phase='next_evening';}
function reduceStay(chapter,response){if(chapter.phase!=='stay_resolution'||response?.type!=='haeunStayResponse'||typeof response.accepted!=='boolean')throw new Error('DAY20_INVALID_STAY_RESOLUTION');if(response.accepted&&(!response.prepared||!['SEPARATE_BEDDING','AGREED_SHARED_ROOM'].includes(response.sleepingPlan)))throw new Error('DAY20_STAY_REQUIRES_PREPARATION');addResolution(chapter,'STAY',{accepted:response.accepted,prepared:response.prepared===true,sleepingPlan:response.accepted?response.sleepingPlan:null});chapter.facts.stayedOver=response.accepted;chapter.facts.sleepingPlan=response.accepted?{arrangement:response.sleepingPlan}:null;chapter.facts.nightEnd=response.accepted?'STAY_ACCEPTED':'STAY_DECLINED_LEAVE';chapter.phase=response.accepted?'sleeping':'ending';}

export function validateDay20V4(chapter){try{if(chapter?.schema!==DAY20_V4_SCHEMA||!Array.isArray(chapter.choices)||typeof chapter.complete!=='boolean')return false;const input=chapter.input;if(!['FACE_TO_FACE','SOLO'].includes(input?.visitMode)||!['CALM','DIFFICULT','QUIET'].includes(input?.relationshipTone))return false;for(const key of['relationshipActive','contactAllowed','cupConversationExperienced','sharedTravelConversationExperienced','day18DiscussionPending'])if(typeof input[key]!=='boolean')return false;if((!input.relationshipActive&&input.contactAllowed)||(input.visitMode==='FACE_TO_FACE'&&(!input.contactAllowed||input.invitation?.status!=='ACCEPTED'))||(input.visitMode==='SOLO'&&input.invitation?.status!=='NONE'))return false;const replay=initial(input);for(const record of chapter.choices){if(record.phase!==replay.phase)return false;if(record.kind==='choice')reduceChoice(replay,record.id);else if(record.kind==='resolution'&&record.resolution==='CONTACT')reduceContact(replay,{type:'haeunContactResponse',contact:record.contact,accepted:record.accepted});else if(record.kind==='resolution'&&record.resolution==='STAY')reduceStay(replay,{type:'haeunStayResponse',accepted:record.accepted,prepared:record.prepared,sleepingPlan:record.sleepingPlan});else return false;}if(chapter.complete&&replay.phase!=='ending')return false;replay.complete=chapter.complete;return JSON.stringify(replay)===JSON.stringify(chapter);}catch{return false;}}
export function applyDay20V4Choice(state,id){const chapter=state?.storyFlags?.day20V4;if(!validateDay20V4(chapter))throw new Error('DAY20_INVALID_SAVE');const next=reduceChoice(clone(chapter),id);state.storyFlags.day20V4=next;return clone(next);}
export function resolveDay20V4Contact(state,response){const chapter=state?.storyFlags?.day20V4;if(!validateDay20V4(chapter))throw new Error('DAY20_INVALID_SAVE');const next=clone(chapter);reduceContact(next,response);state.storyFlags.day20V4=next;return clone(next);}
export function resolveDay20V4Stay(state,response){const chapter=state?.storyFlags?.day20V4;if(!validateDay20V4(chapter))throw new Error('DAY20_INVALID_SAVE');const next=clone(chapter);reduceStay(next,response);state.storyFlags.day20V4=next;return clone(next);}
export function completeDay20V4(state,cue){const chapter=state?.storyFlags?.day20V4;if(!validateDay20V4(chapter)||chapter.phase!=='ending'||cue?.type!=='chapterCompletionCue'||cue.day!==20||cue.finalSceneReached!==true)throw new Error('DAY20_INVALID_COMPLETION');if(chapter.complete)return clone(chapter);chapter.complete=true;state.storyFlags.day20V4Day21HookPending=true;state.storyFlags.day19V4Day20HookPending=false;return clone(chapter);}
