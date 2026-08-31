import {DAY15_V4_CHOICES,DAY15_V4_CHOICE_IDS} from "./day15-v4-campaign-data.mjs";
import {getDay15V4Compatibility,isDay15V4ShoulderContactEligible} from "./day15-v4-state-contract.mjs";

const freeze=Object.freeze;
const flagsOf=state=>state?.storyFlags??{};
const choiceByNumber=new Map(DAY15_V4_CHOICES.map(item=>[item.number,item]));
const fieldFor=number=>`day15V4Choice${number}`;
const selected=(flags,number)=>typeof flags[fieldFor(number)]==="string";
const conversationRoute=flags=>flags.day15V4HaeunContactRoute==="IN_PERSON"||flags.day15V4HaeunContactRoute==="PHONE";

function assertV4(state){
  const flags=state?.storyFlags??{},historyIds=Array.isArray(flags.day15V4SelectedChoiceIds)?flags.day15V4SelectedChoiceIds:[];
  for(let number=1;number<=12;number++){
    const id=flags[fieldFor(number)],historyId=historyIds.find(candidate=>DAY15_V4_CHOICE_IDS.get(candidate)===number);
    if((id==null)!=(historyId==null)||id!=null&&(id!==historyId||DAY15_V4_CHOICE_IDS.get(id)!==number))throw new Error(`DAY15_V4_CHOICE_MIRROR_CORRUPT:${number}`);
  }
  const compatibility=getDay15V4Compatibility(state);
  if(compatibility.mode!=="V4")throw new Error(`DAY15_V4_RUNTIME_REQUIRES_V4:${compatibility.mode}`);
  return flags;
}

function atomically(flags,operation){
  const before={...flags,day15V4SelectedChoiceIds:[...flags.day15V4SelectedChoiceIds]};
  try{return operation();}
  catch(error){for(const key of Object.keys(flags))delete flags[key];Object.assign(flags,before);throw error;}
}

function optionsFor(flags,number){
  const contract=choiceByNumber.get(number);
  if(number===1&&flags.day15V4GalleryInvitation==="NOT_INVITED")return contract.variants.notInvitedOptions;
  if(number>=3&&number<=5&&flags.day15V4AttendanceRoute==="OWN_AFTERNOON")return contract.variants.ownAfternoonOptions;
  if(number===8&&!flags.day15V4SeojinCallbackAvailable&&!flags.day15V4AraCallbackAvailable)return contract.variants.withoutPersonalCallbackOptions;
  if(number===11&&flags.day15V4ConflictStrategy!=="CONTROL"&&flags.day15V4RestDecision!=="LEAVE"&&flags.day15V4ControlContinued!==true)return contract.variants.withoutApologyOptions;
  return contract.options;
}

export function getDay15V4ActiveChoiceNumbers(state){
  const flags=assertV4(state),numbers=[1,2,3,4,5];
  if(flags.day15V4AttendanceRoute==="ATTEND")numbers.push(6);
  if(conversationRoute(flags))numbers.push(7,8,9);
  if(flags.day15V4AttendanceRoute==="ATTEND"&&flags.day15V4HaeunLeft!==true)numbers.push(10);
  if(conversationRoute(flags)&&flags.day15V4HaeunLeft!==true)numbers.push(11);
  if(flags.day15V4PublicMaterialOffered===true&&flags.day15V4HaeunLeft!==true)numbers.push(12);
  return freeze(numbers);
}

export function getNextDay15V4ChoiceNumber(state){
  const flags=assertV4(state);
  if(flags.day15V4Completed===true)return null;
  for(const number of [1,2,3,4,5])if(!selected(flags,number))return number;
  if(flags.day15V4AttendanceRoute==="ATTEND"&&!selected(flags,6))return 6;
  if(!conversationRoute(flags))return null;
  for(const number of [7,8,9])if(!selected(flags,number))return number;
  if(flags.day15V4HaeunLeft===true)return null;
  if(flags.day15V4AttendanceRoute==="ATTEND"&&!selected(flags,10))return 10;
  if(!selected(flags,11))return 11;
  if(flags.day15V4PublicMaterialOffered===true&&!selected(flags,12))return 12;
  return null;
}

export function getNextDay15V4Choice(state){
  const number=getNextDay15V4ChoiceNumber(state);
  if(number==null)return null;
  const flags=flagsOf(state),contract=choiceByNumber.get(number);
  return freeze({...contract,options:freeze([...optionsFor(flags,number)])});
}

function applyEffects(flags,effects){
  for(const [key,value] of Object.entries(effects))flags[`day15V4${key[0].toUpperCase()}${key.slice(1)}`]=value;
}

function setObservedKnowledge(flags,number){
  if(flags.day15V4AttendanceRoute!=="ATTEND")return;
  if(number===3){
    if(flags.day15V4SiwooNameSource!=="PRIOR_DAY11")flags.day15V4SiwooNameSource="DIRECTLY_OBSERVED";
    for(const key of ["day15V4SiwooAppearanceSource","day15V4SiwooRoleSource","day15V4SiwooProfessionalBehaviorSource","day15V4ArtworkDiscussionSource"])flags[key]="DIRECTLY_OBSERVED";
  }
  if(number===4){
    flags.day15V4SiwooDirectionMistakeSource="DIRECTLY_OBSERVED";
    flags.day15V4LastTimePhraseSource="DIRECTLY_OBSERVED";
  }
}

function setPhoneKnowledge(flags){
  if(flags.day15V4HaeunContactRoute!=="PHONE")return;
  if(flags.day15V4SiwooNameSource==="UNKNOWN")flags.day15V4SiwooNameSource="TOLD_BY_HAEUN";
  for(const key of ["day15V4SiwooProfessionalBehaviorSource","day15V4SiwooDirectionMistakeSource","day15V4ArtworkDiscussionSource"])flags[key]="TOLD_BY_HAEUN";
}

function checkpointAfter(flags,number){
  if(number===1)return 2;
  if(number===2)return 3;
  if(number===3)return flags.day15V4AttendanceRoute==="ATTEND"?5:6;
  if(number===4)return flags.day15V4AttendanceRoute==="ATTEND"?8:6;
  if(number===5)return flags.day15V4AttendanceRoute==="ATTEND"?10:(flags.day15V4HaeunContactRoute==="PHONE"?18:19);
  if(number===6)return flags.day15V4HaeunContactRoute==="IN_PERSON"?12:(flags.day15V4HaeunContactRoute==="PHONE"?18:19);
  if(number===7)return 13;
  if(number===8)return 16;
  if(number===9)return flags.day15V4HaeunLeft===true?19:(flags.day15V4AttendanceRoute==="ATTEND"?17:20);
  if(number===10)return 20;
  if(number===11)return 22;
  return 23;
}

function resolveRouteAfterChoice(flags,number){
  if(number===1){
    if(flags.day15V4AttendanceRoute==null)flags.day15V4AttendanceRoute="ATTEND";
    if(flags.day15V4AttendanceRoute==="ATTEND")flags.day15V4HaeunContactRoute="IN_PERSON";
  }
  if(number===5&&flags.day15V4AttendanceRoute==="OWN_AFTERNOON"){
    flags.day15V4HaeunContactRoute=flags.day15V4HaeunCallsTonight?"PHONE":"NO_CONTACT";
    flags.day15V4CafeRoute="NOT_APPLICABLE";
  }
  if(number===6){
    flags.day15V4HaeunContactRoute=flags.day15V4CafeRoute==="GO_HOME"?(flags.day15V4HaeunCallsTonight?"PHONE":"NO_CONTACT"):"IN_PERSON";
  }
  if(number===7)setPhoneKnowledge(flags);
  if(number===9){
    if(flags.day15V4ControlContinued!==true){flags.day15V4ControlContinued=false;flags.day15V4HaeunLeft=false;}
    flags.day15V4ReturnWalk=flags.day15V4HaeunLeft===true?"NOT_APPLICABLE":flags.day15V4HaeunContactRoute==="IN_PERSON"?(flags.day15V4BoundaryResolved===true?"CLOSE_PACE":"DISTANT_PACE"):"SEPARATE_HOMES";
    flags.day15V4ShoulderContactOccurred=isDay15V4ShoulderContactEligible(flags);
  }
}

export function applyDay15V4Choice(state,optionId){
  const flags=assertV4(state),number=getNextDay15V4ChoiceNumber(state);
  if(number==null)throw new Error("DAY15_V4_NO_ACTIVE_CHOICE");
  const option=optionsFor(flags,number).find(entry=>entry.id===optionId);
  if(!option)throw new Error(`DAY15_V4_OPTION_UNAVAILABLE:${optionId}`);
  return atomically(flags,()=>{
    applyEffects(flags,option.effects);
    flags[fieldFor(number)]=option.id;
    flags.day15V4SelectedChoiceIds.push(option.id);
    flags.day15V4ChoiceIndex=number;
    setObservedKnowledge(flags,number);
    resolveRouteAfterChoice(flags,number);
    flags.day15V4SceneCheckpoint=checkpointAfter(flags,number);
    flags.day15V4RuntimeStage=number<=6?1:number<=10?2:3;
    if(getDay15V4Compatibility(state).mode!=="V4")throw new Error("DAY15_V4_CHOICE_PRODUCED_INVALID_STATE");
    return freeze({choiceNumber:number,optionId,nextChoiceNumber:getNextDay15V4ChoiceNumber(state),checkpoint:flags.day15V4SceneCheckpoint});
  });
}

export function offerDay15V4PublicMaterial(state){
  const flags=assertV4(state);
  if(!selected(flags,11)||!conversationRoute(flags)||flags.day15V4HaeunLeft===true||flags.day15V4Completed===true)throw new Error("DAY15_V4_PUBLIC_MATERIAL_NOT_AVAILABLE");
  if(flags.day15V4PublicMaterialOffered===true)return getNextDay15V4Choice(state);
  flags.day15V4PublicMaterialOffered=true;
  flags.day15V4SceneCheckpoint=22;
  return getNextDay15V4Choice(state);
}

export function completeDay15V4(state,{finalSceneReached=false}={}){
  const flags=assertV4(state),next=getNextDay15V4ChoiceNumber(state);
  if(next!=null)throw new Error(`DAY15_V4_CHOICES_INCOMPLETE:${next}`);
  if(finalSceneReached!==true)throw new Error("DAY15_V4_FINAL_SCENE_NOT_REACHED");
  return atomically(flags,()=>{
    flags.day15V4Completed=true;
    flags.day15V4RuntimeStage=4;
    flags.day15V4SceneCheckpoint=24;
    flags.day15V4JihoonMessagePending=true;
    flags.day16JihoonContactHookPending=true;
    flags.day15GalleryPlanPending=false;
    if(getDay15V4Compatibility(state).mode!=="V4")throw new Error("DAY15_V4_COMPLETION_PRODUCED_INVALID_STATE");
    return getDay15V4Compatibility(state);
  });
}
