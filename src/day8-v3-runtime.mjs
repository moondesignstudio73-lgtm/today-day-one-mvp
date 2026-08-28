import {DAY8_V3_CHOICES,DAY8_V3_VERSION} from "./day8-v3-campaign-data.mjs";
import {DAY8_V3_PLAYABLE_SCRIPT_01_14} from "./day8-v3-playable-script.mjs";
import {DAY8_V3_PLAYABLE_SCRIPT_15_24} from "./day8-v3-late-playable-script.mjs";

const BANDS=new Set(["LOW","MID","HIGH","VERY_HIGH"]);
const CHECKPOINTS=Object.freeze([2,4,6,9,11,15,17,18,20,24]);
const SAVE_KEY_BY_CHOICE=Object.freeze({
  1:"day8V3ContactPlan",2:"day8V3JihoonPreparation",3:"day8V3MealChoice",4:"day8V3WithdrawalResponse",5:"day8V3ListeningStrategy",
  6:"day8V3AfternoonRoute",7:"day8V3HaeunContactChoice",8:"day8V3ScheduleChangeChoice",9:"day8V3LateRecoveryResponse",10:"day8V3PrivacyDebriefChoice"
});
const choiceByOption=new Map(DAY8_V3_CHOICES.flatMap(choice=>choice.options.map(option=>[option.id,choice])));
const playableByNumber=new Map([...DAY8_V3_PLAYABLE_SCRIPT_01_14,...DAY8_V3_PLAYABLE_SCRIPT_15_24].map(item=>[item.number,item]));
const flagsOf=state=>state?.storyFlags??{};
const hasLegacyDay8=flags=>flags.day8RuntimeComplete===true||flags.day8IndependentErrandCompleted===true||flags.day8RuntimeStage!=null||flags.day8OpeningStrategy!=null||flags.day8ErrandStrategy!=null||flags.day8RecoveryStrategy!=null;

export function getDay8V3Compatibility(state){
  const flags=flagsOf(state);
  if(flags.day8ScenarioVersion===DAY8_V3_VERSION)return {mode:"V3",complete:flags.day8V3Complete===true,checkpoint:flags.day8V3SceneCheckpoint??1};
  if(hasLegacyDay8(flags))return {mode:"V1_LEGACY",complete:flags.day8RuntimeComplete===true||flags.day8IndependentErrandCompleted===true,checkpoint:flags.day8RuntimeStage??null};
  return {mode:"V3_NEW",complete:false,checkpoint:1};
}

export function beginDay8V3(state,{relationshipBand="LOW",priorHandContact=false}={}){
  state.storyFlags??={};
  const compatibility=getDay8V3Compatibility(state);
  if(compatibility.mode==="V1_LEGACY")return compatibility;
  if(!BANDS.has(relationshipBand))throw new Error("DAY8_V3_RELATIONSHIP_BAND_REQUIRED");
  const flags=state.storyFlags;
  flags.day8ScenarioVersion=DAY8_V3_VERSION;
  flags.day8V3RelationshipBand=relationshipBand;
  flags.day8V3PriorHandContact=priorHandContact===true;
  flags.day8V3SceneCheckpoint??=1;
  flags.day8V3ChoiceIndex??=0;
  flags.day8V3SelectedChoiceIds??=[];
  return getDay8V3Compatibility(state);
}

export function getNextDay8V3Choice(state){
  const flags=flagsOf(state);
  if(flags.day8V3Complete===true)return null;
  return DAY8_V3_CHOICES[flags.day8V3ChoiceIndex??0]??null;
}

const addBranch=(output,scene,key)=>{const found=scene.branches.find(branch=>branch.key===key);if(found)output.push(...found.steps);return Boolean(found);};
const selected=(flags,id)=>flags.day8V3SelectedChoiceIds?.includes(id)===true;
const selectedFrom=(flags,ids)=>ids.find(id=>selected(flags,id));

export function getDay8V3PlayableScene(state,sceneNumber){
  const flags=flagsOf(state);
  if(flags.day8ScenarioVersion!==DAY8_V3_VERSION)throw new Error("DAY8_V3_NOT_STARTED");
  const scene=playableByNumber.get(sceneNumber);if(!scene)throw new Error("DAY8_V3_UNKNOWN_SCENE");
  if(flags.day8V3RestBoundary===true&&[20,21,22].includes(sceneNumber))return Object.freeze({sceneId:scene.id,sceneNumber,skipped:true,steps:Object.freeze([])});
  const output=[...scene.steps],band=flags.day8V3RelationshipBand??"LOW";
  const direct={1:["contact-evening-call","contact-friend-then-rest","contact-ask-haeun-first"],3:["prepare-one-photo","prepare-your-present","prepare-nothing"],5:["meal-jjajang","meal-share-tangsuyuk","meal-jjamppong"],6:["prepare-one-photo","prepare-your-present","prepare-nothing"],8:["withdrawal-leave-space","withdrawal-check-now","withdrawal-invite-unknown"],10:["listen-without-fixing","listen-for-good-reason","offer-concrete-help"],14:["route-live-house","route-quiet-cafe","route-home-rest"],15:["route-live-house","route-quiet-cafe","route-home-rest"],16:["haeun-ask-film","haeun-no-pressure-thought","haeun-stay-present"],17:["route-live-house","route-quiet-cafe","route-home-rest"],18:["schedule-warn-early","schedule-keep-time","schedule-explain-later"],19:["late-honest-long-talk","late-apologize-wanted-more","late-false-transit","late-rest-tomorrow"],21:["debrief-public-credit","debrief-private-boundary","debrief-friend-again"],23:["listen-without-fixing","listen-for-good-reason","offer-concrete-help"]};
  if(direct[sceneNumber]&&!(sceneNumber===23&&flags.day8V3RestBoundary))addBranch(output,scene,selectedFrom(flags,direct[sceneNumber]));
  if(sceneNumber===2){addBranch(output,scene,`relationship-${band==="VERY_HIGH"?"HIGH":band}`);addBranch(output,scene,selectedFrom(flags,["contact-evening-call","contact-friend-then-rest"]));if(flags.day7V3UnresolvedContact===true)addBranch(output,scene,"day7-unresolved-contact");}
  if(sceneNumber===8)addBranch(output,scene,"common");
  if(sceneNumber===20)addBranch(output,scene,flags.day8V3CallAppointment&&flags.day8V3ActualLate&&flags.day8V3ScheduleNotice!=="EARLY_NOTICE"?"waited":"comfortable");
  if(sceneNumber===22){const key=flags.day8V3RestBoundary?"rest-boundary":band==="VERY_HIGH"?(flags.day8V3PriorHandContact?"relationship-VERY_HIGH-CONTACT":"relationship-VERY_HIGH-NO_CONTACT"):`relationship-${band}`;addBranch(output,scene,key);}
  if(sceneNumber===23&&flags.day8V3RestBoundary)addBranch(output,scene,"rest-boundary");
  if(sceneNumber===24){addBranch(output,scene,flags.day8V3RestBoundary?"next-morning":flags.day8V3ActualLate&&flags.day8V3ScheduleNotice!=="EARLY_NOTICE"?"deferred":"invitation");addBranch(output,scene,"common");}
  return Object.freeze({sceneId:scene.id,sceneNumber,skipped:false,checkpoint:flags.day8V3SceneCheckpoint??1,steps:Object.freeze(output)});
}

function updateDerived(flags,choiceNumber,optionId,effects){
  if(choiceNumber===1)flags.day8V3CallAppointment=effects.callAppointment??null;
  if(choiceNumber===2){flags.day8V3PhotoRequested=effects.photoRequested===true;flags.day8V3PresentFirst=effects.presentFirst===true;}
  if(choiceNumber===4)flags.day8V3DisclosureOpening=effects.response;
  if(choiceNumber===5)flags.day8V3JihoonDisclosureDepth=effects.listening==="NO_FIX"?"DEEP":effects.listening==="MEANING"?"MEDIUM":"PRACTICAL";
  if(choiceNumber===6){flags.day8V3RestRoute=effects.restRoute===true;flags.day8V3AfternoonRoute=effects.route;}
  if(choiceNumber===7)flags.day8V3HaeunContactChoice=effects.contact;
  if(choiceNumber===8){flags.day8V3ScheduleNotice=effects.schedule;flags.day8V3ActualLate=flags.day8V3RestRoute?false:effects.schedule!=="KEEP_TIME";}
  if(choiceNumber===9){
    flags.day8V3ExplanationTruth=effects.truth;
    flags.day8V3ExplanationHonest=effects.truth!=="FALSE_TRANSIT";
    flags.day8V3LieRecorded=effects.truth==="FALSE_TRANSIT";
    flags.day8V3RestBoundary=effects.truth==="REST_BOUNDARY";
    if(flags.day8V3RestBoundary){flags.day8V3Complete=true;flags.day8JihoonInvitationPending=false;flags.day9ClothingColorInvitationPending=true;}
  }
  if(choiceNumber===10){
    flags.day8V3PublicCreditSeen=effects.privacy==="PUBLIC_CREDIT";
    flags.day8V3PrivateWorkProtected=effects.privacy!=="PUBLIC_CREDIT";
    flags.day8V3DebriefPrivacy=effects.privacy;
    flags.day8V3Complete=true;
    flags.day8JihoonInvitationPending=false;
    flags.day9ClothingColorInvitationPending=true;
  }
}

export function applyDay8V3Choice(state,optionId){
  state.storyFlags??={};
  const flags=state.storyFlags;
  if(flags.day8ScenarioVersion!==DAY8_V3_VERSION)throw new Error("DAY8_V3_NOT_STARTED");
  const choice=choiceByOption.get(optionId);
  if(!choice)throw new Error("DAY8_V3_UNKNOWN_CHOICE");
  const expected=getNextDay8V3Choice(state);
  if(!expected||expected.number!==choice.number)throw new Error("DAY8_V3_OUT_OF_ORDER_CHOICE");
  const option=choice.options.find(item=>item.id===optionId);
  flags[SAVE_KEY_BY_CHOICE[choice.number]]=optionId;
  flags.day8V3SelectedChoiceIds=[...(flags.day8V3SelectedChoiceIds??[]),optionId];
  flags.day8V3ChoiceIndex=choice.number;
  flags.day8V3SceneCheckpoint=CHECKPOINTS[choice.number-1];
  updateDerived(flags,choice.number,optionId,option.effects);
  return {choiceNumber:choice.number,nextChoice:getNextDay8V3Choice(state),checkpoint:flags.day8V3SceneCheckpoint,complete:flags.day8V3Complete===true};
}

export function validateDay8V3Runtime(){
  const state={storyFlags:{}};
  beginDay8V3(state,{relationshipBand:"HIGH",priorHandContact:true});
  for(const choice of DAY8_V3_CHOICES)applyDay8V3Choice(state,choice.options[0].id);
  const flags=state.storyFlags;
  return flags.day8V3Complete===true&&flags.day8V3ChoiceIndex===10&&flags.day8V3SceneCheckpoint===24&&flags.day9ClothingColorInvitationPending===true;
}
