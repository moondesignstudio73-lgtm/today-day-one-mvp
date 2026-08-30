import {DAY14_V4_SCENARIO_ID,DAY14_V4_VERSION} from "./day14-v4-campaign-data.mjs";

const BANDS=new Set(["LOW","MID","HIGH","VERY_HIGH"]);
const flagsOf=state=>state?.storyFlags??{};
const hasLegacy=flags=>flags.day14RuntimeStage!=null||flags.day14LaneStrategy!=null||flags.day14PurchaseStrategy!=null||flags.day14ConsentStrategy!=null||flags.day14CurrentChoiceSpendingPending===true||flags.day14CurrentChoiceSpendingCompleted===true;
const v4Prerequisite=flags=>flags.day13ScenarioVersion==="NOTION_V3"&&flags.day13V3Completed===true&&flags.day14FlowerDeskPlanPending===true;

export function getDay14V4Compatibility(state){
  const flags=flagsOf(state);
  if(flags.day14V4Version===DAY14_V4_VERSION)return Object.freeze({mode:"V4",complete:flags.day14V4Completed===true,checkpoint:flags.day14V4SceneCheckpoint??1});
  if(hasLegacy(flags))return Object.freeze({mode:"V1_LEGACY",complete:flags.day14CurrentChoiceSpendingCompleted===true,checkpoint:flags.day14RuntimeStage??0});
  if(v4Prerequisite(flags))return Object.freeze({mode:"V4_NEW",complete:false,checkpoint:1});
  return Object.freeze({mode:"BLOCKED_PREREQUISITE",complete:false,checkpoint:null});
}

export function beginDay14V4(state,{relationshipBand="LOW",priorHandContact=false,unresolvedContactBoundary=false,day13DeskPhotoReceived=null,day13FlowerMessageReceived=null,canAffordFlower=true,haeunMeetingAvailability="AVAILABLE",haeunCallsLater=false,exhibitionInviteEligible=true}={}){
  state.storyFlags??={};const compatibility=getDay14V4Compatibility(state);
  if(compatibility.mode==="V1_LEGACY"||compatibility.mode==="BLOCKED_PREREQUISITE")return compatibility;
  if(!BANDS.has(relationshipBand))throw new Error("DAY14_V4_RELATIONSHIP_BAND_REQUIRED");
  if(!new Set(["AVAILABLE","UNAVAILABLE"]).has(haeunMeetingAvailability))throw new Error("DAY14_V4_MEETING_AVAILABILITY_REQUIRED");
  const flags=state.storyFlags;
  flags.day14V4Version=DAY14_V4_VERSION;flags.day14V4ScenarioId=DAY14_V4_SCENARIO_ID;flags.day14V4RuntimeStage??=0;flags.day14V4SceneCheckpoint??=1;flags.day14V4ChoiceIndex??=0;flags.day14V4SelectedChoiceIds??=[];flags.day14V4Completed??=false;
  flags.day14V4RelationshipBand=relationshipBand==="VERY_HIGH"?"HIGH":relationshipBand;flags.day14V4PriorHandContact=priorHandContact===true;flags.day14V4UnresolvedContactBoundary=unresolvedContactBoundary===true;
  flags.day14V4Day13DeskPhotoReceived=day13DeskPhotoReceived;flags.day14V4Day13FlowerMessageReceived=day13FlowerMessageReceived;
  flags.day14V4CanAffordFlower=canAffordFlower===true;flags.day14V4HaeunMeetingAvailability=haeunMeetingAvailability;flags.day14V4HaeunCallsLater=haeunCallsLater===true;flags.day14V4ExhibitionInviteEligible=exhibitionInviteEligible===true;
  flags.day14V4ContactRestActive??=false;flags.day14V4Choice5Reaction??=null;flags.day14V4StatedOwner??=null;
  flags.day14V4NariPrivateContact=false;
  for(const key of ["day14V4WaitingStrategy","day14V4OutingRoute","day14V4FlowerPurpose","day14V4NariMet","day14V4NariNameKnown","day14V4NariCardObtained","day14V4FlowerPhotoTaken","day14V4PurchaseOutcome","day14V4FlowerOwner","day14V4MeetingProposal","day14V4MeetingConsent","day14V4InteractionRoute","day14V4HaeunWorkStoryHeard","day14V4HaeunNariIntroduced","day14V4HaeunInitiatedHand","day14V4HandContactEstablished","day14V4RoomClosing","day14V4AteDinner","day14V4RoomPhotoTaken","day14V4NariInterest","day14V4NightMessage","day14V4ExhibitionInvitation"]){if(!(key in flags))flags[key]=null;}
  return getDay14V4Compatibility(state);
}

export function isDay14V4HandContactEligible({priorHandContact=false,unresolvedContactBoundary=false,haeunInitiatedHand=false}={}){
  return priorHandContact===true&&unresolvedContactBoundary!==true&&haeunInitiatedHand===true;
}

export function getDay14V4RestoreContract(state){
  const flags=flagsOf(state),compatibility=getDay14V4Compatibility(state);if(compatibility.mode!=="V4")return compatibility;
  return Object.freeze({mode:"V4",complete:flags.day14V4Completed===true,checkpoint:flags.day14V4SceneCheckpoint??1,choiceIndex:flags.day14V4ChoiceIndex??0,selectedChoiceIds:Object.freeze([...(flags.day14V4SelectedChoiceIds??[])]),outingRoute:flags.day14V4OutingRoute??null,purchaseOutcome:flags.day14V4PurchaseOutcome??null,interactionRoute:flags.day14V4InteractionRoute??null,nariMet:flags.day14V4NariMet,haeunWorkStoryHeard:flags.day14V4HaeunWorkStoryHeard,handContactEstablished:flags.day14V4HandContactEstablished,nightMessage:flags.day14V4NightMessage??null,exhibitionInvitation:flags.day14V4ExhibitionInvitation??null});
}
