export const DAY16_V4_VERSION="NOTION_V4";
export const DAY16_V4_SCENARIO_ID="m30-day16-forgotten-name-v4";

export const DAY16_V4_CHOICE_IDS=new Map(Object.entries({
  day16_v4_time_jihoon_short:1,day16_v4_time_solo_cafe:1,day16_v4_time_home_rest:1,
  day16_v4_morning_tell_jihoon:2,day16_v4_morning_own_time:2,day16_v4_morning_no_contact:2,
  day16_v4_greeting_apologize:3,day16_v4_greeting_talk:3,day16_v4_greeting_overwhelmed:3,
  day16_v4_past_as_much_as_yuri:4,day16_v4_past_why_ended:4,day16_v4_past_not_today:4,
  day16_v4_starting_points_acknowledge:5,day16_v4_starting_points_difficult:5,day16_v4_starting_points_restart:5,
  day16_v4_current_name_haeun:6,day16_v4_current_someone_close:6,day16_v4_current_return_to_book:6,
  day16_v4_contact_ask_next:7,day16_v4_contact_end_here:7,day16_v4_contact_not_sure:7,
  day16_v4_reflection_record_words:8,day16_v4_reflection_today_self:8,day16_v4_reflection_eat_first:8,
  day16_v4_photo_mark_one:8,day16_v4_photo_current_first:8,day16_v4_photo_other_task:8,
  day16_v4_evening_disclose_yuri:9,day16_v4_evening_organize_then_tell:9,
  day16_v4_evening_jihoon_only:9,day16_v4_evening_solo_cafe:9,day16_v4_evening_home_rest:9,
  day16_v4_intent_curious_not_restart:10,day16_v4_intent_unknown:10,day16_v4_intent_end_here:10,
  day16_v4_invite_accept_intent:11,day16_v4_invite_decline:11,day16_v4_invite_answer_tomorrow:11,
  day16_v4_final_tell_update:12,day16_v4_final_tell_tomorrow:12,day16_v4_final_silent:12
}));

const DAY_ROUTES=new Set([null,"JIHOON_CAFE","SOLO_CAFE","HOME"]);
const MORNING_CONTACTS=new Set([null,"TELL_JIHOON","OWN_TIME","NO_CONTACT"]);
const DEPTHS=new Set(["NONE","GREETING_ONLY","PRESENT_ONLY","PAST_LIMITED"]);
const RELATION_DISCLOSURES=new Set(["NOT_APPLICABLE","NAMED_GIRLFRIEND","CLOSE_PERSON","WITHHELD"]);
const CONTACTS=new Set(["NOT_APPLICABLE","SHARED","ENDED_HERE","NOT_SURE"]);
const EVENING_DISCLOSURES=new Set(["NO_YURI_FACT","DISCLOSED_YURI","DEFERRED_WITH_DEADLINE","OMITTED_YURI"]);
const HAEUN_KNOWLEDGE=new Set(["UNKNOWN","ENCOUNTER_ONLY","LIMITED_CONVERSATION","CONTACT_SHARED"]);
const INTENTS=new Set(["NOT_APPLICABLE","CURIOUS_NOT_ROMANCE","UNKNOWN","END_HERE"]);
const INVITATIONS=new Set(["NONE","ACCEPT_INTENT","DECLINED","ANSWER_TOMORROW"]);
const FINAL_UPDATES=new Set(["NOT_APPLICABLE","TOLD","DEFERRED","SILENT"]);
const SOURCES=new Set(["UNKNOWN","DIRECTLY_TOLD_BY_YURI","DIRECTLY_TOLD_BY_JIHOON"]);
const flagsOf=state=>state?.storyFlags??{};
const hasLegacy=flags=>(Number.isInteger(flags.day16RuntimeStage)&&flags.day16RuntimeStage>0)||flags.day16ContactStrategy!=null||flags.day16MeetingStrategy!=null||flags.day16SharingStrategy!=null||flags.day16CurrentSocialCirclePending===true||flags.day16CurrentSocialCircleCompleted===true;
const hasV4Progress=flags=>Object.keys(flags).some(key=>key.startsWith("day16V4"));
const v4Prerequisite=flags=>flags.day15V4Version==="NOTION_V4"&&flags.day15V4Completed===true&&flags.day16JihoonContactHookPending===true;

const choiceNumber=id=>DAY16_V4_CHOICE_IDS.get(id)??null;

function activeChoiceNumbers(flags){
  const active=[1];
  if(flags.day16V4DayRoute==null)return active;
  active.push(2);
  if(flags.day16V4DayRoute==="HOME")return [...active,8,9];
  if(flags.day16V4DayRoute!=="JIHOON_CAFE"&&flags.day16V4DayRoute!=="SOLO_CAFE")return active;
  active.push(3);
  if(flags.day16V4ConversationDepth!=="GREETING_ONLY"&&flags.day16V4ConversationDepth!=="NONE")active.push(4,5,6,7);
  active.push(8,9);
  if(flags.day16V4EveningDisclosure==="DISCLOSED_YURI"&&flags.day16V4HaeunYuriKnowledge!=="UNKNOWN")active.push(10);
  if(flags.day16V4YuriContact==="SHARED")active.push(11);
  if(flags.day16V4YuriInvitation==="ACCEPT_INTENT"||flags.day16V4YuriInvitation==="ANSWER_TOMORROW")active.push(12);
  return active;
}

function validateChoiceHistory(flags){
  if(!Number.isInteger(flags.day16V4ChoiceIndex)||flags.day16V4ChoiceIndex<0||flags.day16V4ChoiceIndex>12)return false;
  if(!Array.isArray(flags.day16V4SelectedChoiceIds)||new Set(flags.day16V4SelectedChoiceIds).size!==flags.day16V4SelectedChoiceIds.length)return false;
  const numbers=flags.day16V4SelectedChoiceIds.map(choiceNumber);
  if(numbers.some(number=>number==null)||new Set(numbers).size!==numbers.length||numbers.some((number,index)=>index>0&&number<numbers[index-1]))return false;
  const active=activeChoiceNumbers(flags);
  if(numbers.some((number,index)=>number!==active[index]))return false;
  if((numbers.at(-1)??0)!==flags.day16V4ChoiceIndex)return false;
  for(let number=1;number<=12;number++){
    const history=flags.day16V4SelectedChoiceIds.find(id=>choiceNumber(id)===number),mirror=flags[`day16V4Choice${number}`];
    if((history==null)!=(mirror==null)||history!=null&&history!==mirror)return false;
  }
  return true;
}

function validateRouteImplications(flags){
  const choice=number=>flags[`day16V4Choice${number}`];
  if(flags.day16V4DayRoute==="HOME"){
    if(flags.day16V4JihoonPresent||flags.day16V4YuriEncountered||flags.day16V4YuriNameKnown||flags.day16V4ConversationDepth!=="NONE"||flags.day16V4YuriContact!=="NOT_APPLICABLE"||flags.day16V4YuriInvitation!=="NONE")return false;
    if(flags.day16V4YuriIdentitySource!=="UNKNOWN"||flags.day16V4YuriWorkSource!=="UNKNOWN"||[3,4,5,6,7,10,11,12].some(number=>choice(number)!=null))return false;
    if(choice(8)!=null&&!choice(8).startsWith("day16_v4_photo_"))return false;
    if(choice(9)!=null&&choice(9)!=="day16_v4_evening_home_rest")return false;
  }
  if(flags.day16V4DayRoute==="JIHOON_CAFE"&&flags.day16V4JihoonPresent!==true)return false;
  if(flags.day16V4DayRoute!=="JIHOON_CAFE"&&flags.day16V4JihoonPresent!==false)return false;
  if(flags.day16V4DayRoute==="SOLO_CAFE"||flags.day16V4DayRoute==="JIHOON_CAFE"){
    if(choice(8)!=null&&!choice(8).startsWith("day16_v4_reflection_"))return false;
    if(choice(9)==="day16_v4_evening_home_rest")return false;
    if(flags.day16V4DayRoute==="JIHOON_CAFE"&&choice(9)==="day16_v4_evening_solo_cafe")return false;
    if(flags.day16V4DayRoute==="SOLO_CAFE"&&choice(9)==="day16_v4_evening_jihoon_only")return false;
  }
  if(![null,true,false].includes(flags.day16V4DifferentStartingPointAcknowledged))return false;
  if(flags.day16V4YuriEncountered!==true&&(flags.day16V4YuriNameKnown!==false||flags.day16V4ConversationDepth!=="NONE"||flags.day16V4YuriContact!=="NOT_APPLICABLE"||flags.day16V4YuriInvitation!=="NONE"||flags.day16V4YuriIdentitySource!=="UNKNOWN"||flags.day16V4YuriWorkSource!=="UNKNOWN"||flags.day16V4DifferentStartingPointAcknowledged!==null))return false;
  if(flags.day16V4YuriEncountered===true&&!new Set(["JIHOON_CAFE","SOLO_CAFE"]).has(flags.day16V4DayRoute))return false;
  if(flags.day16V4YuriNameKnown!==true&&flags.day16V4YuriIdentitySource!=="UNKNOWN")return false;
  if(flags.day16V4YuriNameKnown===true&&flags.day16V4YuriIdentitySource!=="DIRECTLY_TOLD_BY_YURI")return false;
  if(flags.day16V4YuriWorkSource!=="UNKNOWN"&&flags.day16V4YuriWorkSource!=="DIRECTLY_TOLD_BY_YURI")return false;
  if(flags.day16V4ConversationDepth==="GREETING_ONLY"&&[4,5,6,7].some(number=>choice(number)!=null))return false;
  if(flags.day16V4YuriContact!=="SHARED"&&(flags.day16V4YuriInvitation!=="NONE"||choice(11)!=null||choice(12)!=null))return false;
  if(!new Set(["ACCEPT_INTENT","ANSWER_TOMORROW"]).has(flags.day16V4YuriInvitation)&&choice(12)!=null)return false;
  if(flags.day16V4YuriInvitation!=="NONE"&&flags.day16V4YuriContact!=="SHARED")return false;
  if(flags.day16V4JihoonYuriKnowledgeSource==="DIRECTLY_TOLD_BY_JIHOON"&&flags.day16V4DayRoute!=="JIHOON_CAFE")return false;
  if(flags.day16V4EveningDisclosure==="OMITTED_YURI"&&flags.day16V4HaeunYuriKnowledge!=="UNKNOWN")return false;
  if(flags.day16V4EveningDisclosure==="DISCLOSED_YURI"&&flags.day16V4HaeunYuriKnowledge==="UNKNOWN")return false;
  if(flags.day16V4HaeunYuriKnowledge!=="UNKNOWN"&&flags.day16V4EveningDisclosure!=="DISCLOSED_YURI")return false;
  if(flags.day16V4BreakupCauseStatus!=="UNKNOWN"||flags.day16V4GenericYuriEventSuppressed!==true)return false;
  return true;
}

function endingChoiceFrontier(flags){
  if(!new Set(["JIHOON_CAFE","SOLO_CAFE","HOME"]).has(flags.day16V4DayRoute)||!new Set(["TELL_JIHOON","OWN_TIME","NO_CONTACT"]).has(flags.day16V4MorningContact))return false;
  const choice=number=>flags[`day16V4Choice${number}`],active=new Set(activeChoiceNumbers(flags));
  for(let number=1;number<=12;number++)if(active.has(number)!=(choice(number)!=null))return false;
  return flags.day16V4SelectedChoiceIds.length===active.size;
}

function validateV4(flags){
  if(flags.day16V4Version!==DAY16_V4_VERSION||flags.day16V4ScenarioId!==DAY16_V4_SCENARIO_ID)return false;
  if(!Number.isInteger(flags.day16V4RuntimeStage)||flags.day16V4RuntimeStage<0)return false;
  if(!Number.isInteger(flags.day16V4SceneCheckpoint)||flags.day16V4SceneCheckpoint<1||flags.day16V4SceneCheckpoint>24)return false;
  if(!validateChoiceHistory(flags)||!DAY_ROUTES.has(flags.day16V4DayRoute)||!MORNING_CONTACTS.has(flags.day16V4MorningContact)||!DEPTHS.has(flags.day16V4ConversationDepth))return false;
  if(!RELATION_DISCLOSURES.has(flags.day16V4HaeunRelationshipDisclosure)||!CONTACTS.has(flags.day16V4YuriContact)||!EVENING_DISCLOSURES.has(flags.day16V4EveningDisclosure)||!HAEUN_KNOWLEDGE.has(flags.day16V4HaeunYuriKnowledge))return false;
  if(!INTENTS.has(flags.day16V4IntentToYuri)||!INVITATIONS.has(flags.day16V4YuriInvitation)||!FINAL_UPDATES.has(flags.day16V4FinalHaeunUpdate))return false;
  for(const key of ["day16V4YuriIdentitySource","day16V4YuriWorkSource","day16V4JihoonYuriKnowledgeSource"]){if(!SOURCES.has(flags[key]))return false;}
  if(flags.day16V4YuriIdentitySource==="DIRECTLY_TOLD_BY_JIHOON"||flags.day16V4YuriWorkSource==="DIRECTLY_TOLD_BY_JIHOON"||flags.day16V4JihoonYuriKnowledgeSource==="DIRECTLY_TOLD_BY_YURI")return false;
  if(typeof flags.day16V4JihoonPresent!=="boolean"||typeof flags.day16V4YuriEncountered!=="boolean"||typeof flags.day16V4YuriNameKnown!=="boolean")return false;
  if(!validateRouteImplications(flags))return false;
  if(flags.day16V4Completed===true&&(flags.day16V4SceneCheckpoint!==24||flags.day16V4Day17BodyHookPending!==true||flags.day16JihoonContactHookPending!==false||!endingChoiceFrontier(flags)))return false;
  if(flags.day16V4Completed!==true&&(flags.day16V4Day17BodyHookPending!==false||flags.day16JihoonContactHookPending!==true))return false;
  return true;
}

export function getDay16V4Compatibility(state){
  const flags=flagsOf(state),legacy=hasLegacy(flags),v4=hasV4Progress(flags);
  if(legacy&&v4)return Object.freeze({mode:"BLOCKED_CORRUPT",complete:false,checkpoint:null});
  if(v4){
    if(!validateV4(flags))return Object.freeze({mode:"BLOCKED_CORRUPT",complete:false,checkpoint:null});
    return Object.freeze({mode:"V4",complete:flags.day16V4Completed===true,checkpoint:flags.day16V4SceneCheckpoint});
  }
  if(legacy)return Object.freeze({mode:"V1_LEGACY",complete:flags.day16CurrentSocialCircleCompleted===true,checkpoint:flags.day16RuntimeStage??0});
  if(v4Prerequisite(flags))return Object.freeze({mode:"V4_NEW",complete:false,checkpoint:1});
  return Object.freeze({mode:"BLOCKED_PREREQUISITE",complete:false,checkpoint:null});
}

export function beginDay16V4(state){
  state.storyFlags??={};
  const compatibility=getDay16V4Compatibility(state);
  if(compatibility.mode==="V4")return compatibility;
  if(compatibility.mode!=="V4_NEW")return compatibility;
  const flags=state.storyFlags;
  Object.assign(flags,{
    day16V4Version:DAY16_V4_VERSION,day16V4ScenarioId:DAY16_V4_SCENARIO_ID,day16V4RuntimeStage:0,day16V4SceneCheckpoint:1,day16V4ChoiceIndex:0,day16V4SelectedChoiceIds:[],day16V4Completed:false,
    day16V4DayRoute:null,day16V4MorningContact:null,day16V4JihoonPresent:false,
    day16V4YuriEncountered:false,day16V4YuriNameKnown:false,day16V4ConversationDepth:"NONE",day16V4DifferentStartingPointAcknowledged:null,
    day16V4HaeunRelationshipDisclosure:"NOT_APPLICABLE",day16V4YuriContact:"NOT_APPLICABLE",day16V4EveningDisclosure:"NO_YURI_FACT",day16V4HaeunYuriKnowledge:"UNKNOWN",day16V4IntentToYuri:"NOT_APPLICABLE",day16V4YuriInvitation:"NONE",day16V4FinalHaeunUpdate:"NOT_APPLICABLE",
    day16V4YuriIdentitySource:"UNKNOWN",day16V4YuriWorkSource:"UNKNOWN",day16V4JihoonYuriKnowledgeSource:"UNKNOWN",day16V4BreakupCauseStatus:"UNKNOWN",
    day16V4GenericYuriEventSuppressed:true,day16V4Day17BodyHookPending:false
  });
  return getDay16V4Compatibility(state);
}

export function getDay16V4RestoreContract(state){
  const flags=flagsOf(state),compatibility=getDay16V4Compatibility(state);
  if(compatibility.mode!=="V4")return compatibility;
  return Object.freeze({mode:"V4",complete:flags.day16V4Completed===true,checkpoint:flags.day16V4SceneCheckpoint,choiceIndex:flags.day16V4ChoiceIndex,selectedChoiceIds:Object.freeze([...flags.day16V4SelectedChoiceIds]),dayRoute:flags.day16V4DayRoute,morningContact:flags.day16V4MorningContact,jihoonPresent:flags.day16V4JihoonPresent,yuriEncountered:flags.day16V4YuriEncountered,yuriNameKnown:flags.day16V4YuriNameKnown,conversationDepth:flags.day16V4ConversationDepth,yuriContact:flags.day16V4YuriContact,eveningDisclosure:flags.day16V4EveningDisclosure,haeunYuriKnowledge:flags.day16V4HaeunYuriKnowledge,yuriInvitation:flags.day16V4YuriInvitation,finalHaeunUpdate:flags.day16V4FinalHaeunUpdate,knowledgeSources:Object.freeze({identity:flags.day16V4YuriIdentitySource,work:flags.day16V4YuriWorkSource,jihoon:flags.day16V4JihoonYuriKnowledgeSource,breakupCause:flags.day16V4BreakupCauseStatus})});
}
