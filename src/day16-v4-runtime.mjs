import {DAY16_V4_CHOICE_IDS,getDay16V4Compatibility} from "./day16-v4-state-contract.mjs";
import {resolveDay16V4Scene} from "./day16-v4-branch-resolver.mjs";

const f=Object.freeze;
const fieldFor=number=>`day16V4Choice${number}`;
const flagsOf=state=>state?.storyFlags??{};
const selected=(flags,number)=>typeof flags[fieldFor(number)]==="string";
const cafe=route=>route==="JIHOON_CAFE"||route==="SOLO_CAFE";
const conversation=depth=>depth==="PRESENT_ONLY"||depth==="PAST_LIMITED";
const sceneForChoice=(flags,number)=>number===8?(flags.day16V4DayRoute==="HOME"?18:17):({1:1,2:2,3:5,4:7,5:10,6:13,7:15,9:19,10:20,11:22,12:23})[number];

function assertV4(state){
  const flags=flagsOf(state),history=Array.isArray(flags.day16V4SelectedChoiceIds)?flags.day16V4SelectedChoiceIds:[];
  for(let number=1;number<=12;number++){
    const id=flags[fieldFor(number)],historyId=history.find(candidate=>DAY16_V4_CHOICE_IDS.get(candidate)===number);
    if((id==null)!=(historyId==null)||id!=null&&(id!==historyId||DAY16_V4_CHOICE_IDS.get(id)!==number))throw new Error(`DAY16_V4_CHOICE_MIRROR_CORRUPT:${number}`);
  }
  const compatibility=getDay16V4Compatibility(state);
  if(compatibility.mode!=="V4")throw new Error(`DAY16_V4_RUNTIME_REQUIRES_V4:${compatibility.mode}`);
  return flags;
}

function atomically(flags,operation){
  const before={...flags,day16V4SelectedChoiceIds:[...flags.day16V4SelectedChoiceIds]};
  try{return operation();}
  catch(error){for(const key of Object.keys(flags))delete flags[key];Object.assign(flags,before);throw error;}
}

export function getDay16V4ActiveChoiceNumbers(state){
  const flags=assertV4(state),numbers=[1];
  if(flags.day16V4DayRoute==null)return f(numbers);
  numbers.push(2);
  if(flags.day16V4DayRoute==="HOME")return f([...numbers,8,9]);
  if(!cafe(flags.day16V4DayRoute))return f([]);
  numbers.push(3);
  if(conversation(flags.day16V4ConversationDepth))numbers.push(4,5,6,7);
  numbers.push(8,9);
  if(flags.day16V4EveningDisclosure==="DISCLOSED_YURI"&&flags.day16V4HaeunYuriKnowledge!=="UNKNOWN")numbers.push(10);
  if(flags.day16V4YuriContact==="SHARED")numbers.push(11);
  if(flags.day16V4YuriInvitation==="ACCEPT_INTENT"||flags.day16V4YuriInvitation==="ANSWER_TOMORROW")numbers.push(12);
  return f(numbers);
}

export function getNextDay16V4ChoiceNumber(state){
  const flags=assertV4(state);
  if(flags.day16V4Completed===true)return null;
  for(const number of getDay16V4ActiveChoiceNumbers(state))if(!selected(flags,number))return number;
  return null;
}

export function getNextDay16V4Choice(state,context={}){
  const number=getNextDay16V4ChoiceNumber(state);
  if(number==null)return null;
  const flags=flagsOf(state),resolved=resolveDay16V4Scene(flags,sceneForChoice(flags,number),context);
  if(resolved.status!=="ACTIVE"||resolved.choice?.number!==number)throw new Error(`DAY16_V4_CHOICE_SOURCE_UNAVAILABLE:${number}`);
  return resolved.choice;
}

function checkpointAfter(flags,number){
  if(number===1)return 2;
  if(number===2)return flags.day16V4DayRoute==="HOME"?18:3;
  if(number===3)return flags.day16V4ConversationDepth==="GREETING_ONLY"?16:6;
  if(number===4)return 8;
  if(number===5)return 11;
  if(number===6)return 14;
  if(number===7)return 16;
  if(number===8)return 19;
  if(number===9)return flags.day16V4EveningDisclosure==="DISCLOSED_YURI"?20:flags.day16V4DayRoute==="HOME"?21:22;
  if(number===10)return 21;
  if(number===11)return flags.day16V4YuriInvitation==="ACCEPT_INTENT"||flags.day16V4YuriInvitation==="ANSWER_TOMORROW"?23:24;
  return 24;
}

export function getDay16V4CheckpointAfterChoice(state,number){
  const flags=assertV4(state);
  if(!Number.isInteger(number)||number<1||number>12)throw new Error("DAY16_V4_CHECKPOINT_CHOICE_INVALID");
  if(!selected(flags,number))throw new Error(`DAY16_V4_CHECKPOINT_CHOICE_UNRESOLVED:${number}`);
  return checkpointAfter(flags,number);
}

function applyChoiceEffects(flags,number,id,context){
  if(number===1){
    flags.day16V4DayRoute=id.endsWith("jihoon_short")?"JIHOON_CAFE":id.endsWith("solo_cafe")?"SOLO_CAFE":"HOME";
    flags.day16V4JihoonPresent=flags.day16V4DayRoute==="JIHOON_CAFE";
  }
  if(number===2)flags.day16V4MorningContact=id.endsWith("tell_jihoon")?"TELL_JIHOON":id.endsWith("own_time")?"OWN_TIME":"NO_CONTACT";
  if(number===3){
    flags.day16V4YuriEncountered=true;flags.day16V4YuriNameKnown=true;flags.day16V4YuriIdentitySource="DIRECTLY_TOLD_BY_YURI";
    flags.day16V4ConversationDepth=id.endsWith("overwhelmed")?"GREETING_ONLY":"PRESENT_ONLY";
    flags.day16V4YuriContact=id.endsWith("overwhelmed")?"ENDED_HERE":"NOT_SURE";
  }
  if(number===4){
    flags.day16V4ConversationDepth=id.endsWith("as_much_as_yuri")?"PAST_LIMITED":"PRESENT_ONLY";
    flags.day16V4YuriWorkSource="DIRECTLY_TOLD_BY_YURI";
  }
  if(number===5)flags.day16V4DifferentStartingPointAcknowledged=id.endsWith("acknowledge");
  if(number===6)flags.day16V4HaeunRelationshipDisclosure=id.endsWith("current_name_haeun")?(context.haeunRelationshipActive===true?"NAMED_GIRLFRIEND":"WITHHELD"):id.endsWith("someone_close")?"CLOSE_PERSON":"WITHHELD";
  if(number===7){
    if(id.endsWith("ask_next")){
      if(typeof context.yuriAcceptedContact!=="boolean")throw new Error("DAY16_V4_CONTACT_RESPONSE_REQUIRED");
      flags.day16V4YuriContact=context.yuriAcceptedContact?"SHARED":"ENDED_HERE";
    }else flags.day16V4YuriContact=id.endsWith("end_here")?"ENDED_HERE":"NOT_SURE";
  }
  if(number===8&&flags.day16V4DayRoute==="JIHOON_CAFE")flags.day16V4JihoonYuriKnowledgeSource="DIRECTLY_TOLD_BY_JIHOON";
  if(number===9){
    if(id.endsWith("disclose_yuri")){
      flags.day16V4EveningDisclosure="DISCLOSED_YURI";
      flags.day16V4HaeunYuriKnowledge=flags.day16V4YuriContact==="SHARED"?"CONTACT_SHARED":flags.day16V4ConversationDepth==="GREETING_ONLY"?"ENCOUNTER_ONLY":"LIMITED_CONVERSATION";
    }else if(id.endsWith("organize_then_tell"))flags.day16V4EveningDisclosure="DEFERRED_WITH_DEADLINE";
    else flags.day16V4EveningDisclosure=flags.day16V4DayRoute==="HOME"?"NO_YURI_FACT":"OMITTED_YURI";
  }
  if(number===10)flags.day16V4IntentToYuri=id.endsWith("curious_not_restart")?"CURIOUS_NOT_ROMANCE":id.endsWith("unknown")?"UNKNOWN":"END_HERE";
  if(number===11)flags.day16V4YuriInvitation=id.endsWith("accept_intent")?"ACCEPT_INTENT":id.endsWith("decline")?"DECLINED":"ANSWER_TOMORROW";
  if(number===12)flags.day16V4FinalHaeunUpdate=id.endsWith("tell_update")?"TOLD":id.endsWith("tell_tomorrow")?"DEFERRED":"SILENT";
}

export function applyDay16V4Choice(state,optionId,context={}){
  const flags=assertV4(state),number=getNextDay16V4ChoiceNumber(state);
  if(number==null)throw new Error("DAY16_V4_NO_ACTIVE_CHOICE");
  const choice=getNextDay16V4Choice(state,context),option=choice.options.find(entry=>entry.id===optionId);
  if(!option)throw new Error(`DAY16_V4_OPTION_UNAVAILABLE:${optionId}`);
  return atomically(flags,()=>{
    applyChoiceEffects(flags,number,option.id,context);
    flags[fieldFor(number)]=option.id;flags.day16V4SelectedChoiceIds.push(option.id);flags.day16V4ChoiceIndex=number;
    flags.day16V4SceneCheckpoint=checkpointAfter(flags,number);flags.day16V4RuntimeStage=number<=2?1:number<=7?2:3;
    if(getDay16V4Compatibility(state).mode!=="V4")throw new Error("DAY16_V4_CHOICE_PRODUCED_INVALID_STATE");
    return f({choiceNumber:number,optionId:option.id,nextChoiceNumber:getNextDay16V4ChoiceNumber(state),checkpoint:flags.day16V4SceneCheckpoint});
  });
}

export function completeDay16V4(state,{finalSceneReached=false}={}){
  const flags=assertV4(state),next=getNextDay16V4ChoiceNumber(state);
  if(next!=null)throw new Error(`DAY16_V4_CHOICES_INCOMPLETE:${next}`);
  if(finalSceneReached!==true)throw new Error("DAY16_V4_FINAL_SCENE_NOT_REACHED");
  return atomically(flags,()=>{
    flags.day16V4Completed=true;flags.day16V4RuntimeStage=4;flags.day16V4SceneCheckpoint=24;
    flags.day16V4Day17BodyHookPending=true;flags.day16JihoonContactHookPending=false;
    if(getDay16V4Compatibility(state).mode!=="V4")throw new Error("DAY16_V4_COMPLETION_PRODUCED_INVALID_STATE");
    return getDay16V4Compatibility(state);
  });
}
