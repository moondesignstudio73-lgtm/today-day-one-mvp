import {DAY14_V4_CHOICES,DAY14_V4_VERSION} from "./day14-v4-campaign-data.mjs";
import {getDay14V4Compatibility,isDay14V4HandContactEligible} from "./day14-v4-state-contract.mjs";
import {getDay14V4PlayableScene01To11} from "./day14-v4-playable-script-01-11.mjs";
import {getDay14V4PlayableScene12To22} from "./day14-v4-playable-script-12-22.mjs";

const f=Object.freeze;
const CHECKPOINTS=f([3,4,6,9,10,13,18,19,20,21]);
const variantOptions=choice=>Object.values(choice.variants??{}).flatMap(value=>Array.isArray(value)?value:[]);
const allOptions=choice=>[...choice.options,...variantOptions(choice)];
const optionIndex=new Map(DAY14_V4_CHOICES.flatMap(choice=>allOptions(choice).map(option=>[option.id,{choice,option}])));
const flagsOf=state=>state?.storyFlags??{};

function choiceAvailable(choice,flags){
  if([3,4].includes(choice.number))return flags.day14V4OutingRoute==="FLORA";
  if(choice.number===10&&flags.day14V4ContactRestActive===true)return false;
  return true;
}

export function getDay14V4AvailableOptions(state,choiceNumber){
  const flags=flagsOf(state),choice=DAY14_V4_CHOICES.find(item=>item.number===choiceNumber);
  if(!choice||!choiceAvailable(choice,flags))return f([]);
  let options=choice.options;
  if(choiceNumber===4&&!flags.day14V4CanAffordFlower)options=choice.variants.insufficientFundsOptions;
  if(choiceNumber===5&&flags.day14V4PurchaseOutcome!=="GIFT_FLOWER")options=choice.variants.withoutGiftOptions;
  if(choiceNumber===6&&flags.day14V4InteractionRoute==="FULL_REST")options=choice.variants.fullRestOptions;
  if(choiceNumber===7&&flags.day14V4InteractionRoute!=="IN_PERSON")options=choice.variants.noMeetingOptions;
  if(choiceNumber===9&&flags.day14V4NariMet!==true)options=choice.variants.noNariOptions;
  if(choiceNumber===10)options=options.filter(option=>option.id!=="day14_night_thanks_for_talking"||flags.day14V4HaeunWorkStoryHeard===true).filter(option=>option.id!=="day14_night_flower_home"||["SELF_FLOWER","GIFT_FLOWER"].includes(flags.day14V4PurchaseOutcome)||flags.day14V4FlowerPhotoTaken===true);
  return f([...options]);
}

export function getNextDay14V4Choice(state){
  const flags=flagsOf(state);if(getDay14V4Compatibility(state).mode!=="V4"||flags.day14V4Completed===true)return null;
  const selected=new Set(flags.day14V4SelectedChoiceIds??[]);
  for(const choice of DAY14_V4_CHOICES){if(!choiceAvailable(choice,flags))continue;if(!allOptions(choice).some(option=>selected.has(option.id)))return f({...choice,options:getDay14V4AvailableOptions(state,choice.number)});}
  return null;
}

function resolveMeeting(flags,proposal){
  flags.day14V4MeetingProposal=proposal;
  if(proposal==="REST_TODAY"){flags.day14V4MeetingConsent="REST_REQUESTED";flags.day14V4Choice5Reaction="day14_invite_rest_today";flags.day14V4ContactRestActive=true;}
  else if(proposal==="SHOW_PREPARED"){flags.day14V4MeetingConsent="DECLINED";flags.day14V4Choice5Reaction="day14_invite_show_prepared";flags.day14V4ContactRestActive=true;}
  else if(flags.day14V4HaeunMeetingAvailability==="AVAILABLE"){flags.day14V4MeetingConsent="ACCEPTED";flags.day14V4Choice5Reaction="day14_invite_sit_without_demand";}
  else{flags.day14V4MeetingConsent="DECLINED";flags.day14V4Choice5Reaction=proposal==="SIT_WITHOUT_DEMAND"?"day14_invite_sit_declined":"day14_invite_direct_without_gift";}
  if(flags.day14V4MeetingConsent==="ACCEPTED"){flags.day14V4InteractionRoute="IN_PERSON";flags.day14V4ContactRestActive=false;}
  else if(flags.day14V4HaeunCallsLater===true){flags.day14V4InteractionRoute="PHONE";flags.day14V4ContactRestActive=false;}
  else flags.day14V4InteractionRoute="FULL_REST";
}

function applyEffects(flags,choice,option){
  for(const [key,value] of Object.entries(option.effects??{}))flags[`day14V4${key[0].toUpperCase()}${key.slice(1)}`]=value;
  if(choice.number===1&&option.id==="day14_wait_ask_need")flags.day14V4ContactRestActive=true;
  if(choice.number===2){if(flags.day14V4OutingRoute==="FLORA"){flags.day14V4NariMet=true;flags.day14V4NariNameKnown=true;}else{flags.day14V4NariMet=false;flags.day14V4NariNameKnown=false;flags.day14V4NariCardObtained=false;flags.day14V4FlowerPhotoTaken=false;flags.day14V4PurchaseOutcome="NO_PURCHASE";flags.day14V4FlowerOwner=null;}}
  if(choice.number===3&&option.id==="day14_place_haeun_later")flags.day14V4FlowerPhotoTaken=true;
  if(choice.number===4){flags.day14V4NariCardObtained=["SELF_FLOWER","GIFT_FLOWER"].includes(flags.day14V4PurchaseOutcome);if(flags.day14V4PurchaseOutcome==="PHOTO_ONLY")flags.day14V4FlowerPhotoTaken=true;}
  if(choice.number===5)resolveMeeting(flags,option.effects.meetingProposal);
  if(choice.number===6)flags.day14V4HaeunWorkStoryHeard=flags.day14V4InteractionRoute!=="FULL_REST";
  if(choice.number===7){flags.day14V4HaeunInitiatedHand=flags.day14V4InteractionRoute==="IN_PERSON"&&["WALK_TO_STATION","MORE_TOGETHER"].includes(flags.day14V4RemainingTime)&&flags.day14V4PriorHandContact===true&&flags.day14V4UnresolvedContactBoundary!==true;flags.day14V4HandContactEstablished=isDay14V4HandContactEligible({priorHandContact:flags.day14V4PriorHandContact,unresolvedContactBoundary:flags.day14V4UnresolvedContactBoundary,haeunInitiatedHand:flags.day14V4HaeunInitiatedHand});}
  if(choice.number===8){flags.day14V4AteDinner=flags.day14V4RoomClosing==="STOP_AND_EAT";flags.day14V4RoomPhotoTaken=flags.day14V4RoomClosing==="FLOWER_VISIBLE";}
  if(choice.number===9&&flags.day14V4NariMet!==true)flags.day14V4NariInterest="NOT_MET";
}

function finishDay14V4(flags,{checkpoint=22}={}){
  flags.day14V4Completed=true;flags.day14V4RuntimeStage=3;flags.day14V4SceneCheckpoint=checkpoint;flags.day14FlowerDeskPlanPending=false;flags.day15GalleryPlanPending=true;
  flags.day14V4HaeunNariIntroduced=flags.day14V4InteractionRoute==="IN_PERSON"&&flags.day14V4NariMet===true;
  flags.day14V4ExhibitionInvitation=flags.day14V4ExhibitionInviteEligible===true&&flags.day14V4MeetingProposal!=="SHOW_PREPARED"&&flags.day14V4UnresolvedContactBoundary!==true?"INVITED":"NOT_INVITED";
}

export function applyDay14V4Choice(state,optionId){
  const flags=flagsOf(state);if(getDay14V4Compatibility(state).mode!=="V4")throw new Error("DAY14_V4_NOT_ACTIVE");
  const found=optionIndex.get(optionId);if(!found)throw new Error(`UNKNOWN_DAY14_V4_OPTION_${optionId}`);
  const next=getNextDay14V4Choice(state);if(!next||next.number!==found.choice.number)throw new Error(`DAY14_V4_CHOICE_OUT_OF_ORDER_${optionId}`);
  if(!getDay14V4AvailableOptions(state,found.choice.number).some(option=>option.id===optionId))throw new Error(`DAY14_V4_OPTION_UNAVAILABLE_${optionId}`);
  flags.day14V4SelectedChoiceIds=[...(flags.day14V4SelectedChoiceIds??[]),optionId];flags[`day14V4Choice${found.choice.number}`]=optionId;flags.day14V4ChoiceIndex=found.choice.number;applyEffects(flags,found.choice,found.option);flags.day14V4SceneCheckpoint=CHECKPOINTS[found.choice.number-1];flags.day14V4RuntimeStage=found.choice.number<5?1:found.choice.number<8?2:3;
  while(true){const skipped=DAY14_V4_CHOICES.find(choice=>choice.number===flags.day14V4ChoiceIndex+1&&!choiceAvailable(choice,flags));if(!skipped)break;flags.day14V4ChoiceIndex=skipped.number;flags.day14V4SceneCheckpoint=CHECKPOINTS[skipped.number-1];}
  if(!getNextDay14V4Choice(state)){let checkpoint=21;if(flags.day14V4ContactRestActive===true){flags.day14V4NightMessage="NO_MESSAGE";flags.day14V4Choice10="day14_night_no_message";flags.day14V4SelectedChoiceIds=[...flags.day14V4SelectedChoiceIds,"day14_night_no_message"];flags.day14V4ChoiceIndex=10;checkpoint=20;}finishDay14V4(flags,{checkpoint});}
  return f({choiceNumber:found.choice.number,nextChoiceNumber:getNextDay14V4Choice(state)?.number??null,checkpoint:flags.day14V4SceneCheckpoint,complete:flags.day14V4Completed===true});
}

export function getDay14V4PlayableScene(state,sceneNumber){
  if(!Number.isInteger(sceneNumber)||sceneNumber<1||sceneNumber>22)throw new Error(`UNKNOWN_DAY14_V4_SCENE_${sceneNumber}`);
  if(sceneNumber<=11)return getDay14V4PlayableScene01To11(state,sceneNumber);
  const scene=getDay14V4PlayableScene12To22(state,sceneNumber);
  if(sceneNumber!==17)return scene;
  const contact=getDay14V4PlayableScene12To22(state,17.1);
  return f({...scene,selectedBranches:f([...scene.selectedBranches,...contact.selectedBranches]),steps:f([...scene.steps,...contact.steps])});
}

export function validateDay14V4RuntimeState(state){
  const flags=flagsOf(state);return flags.day14V4Version===DAY14_V4_VERSION&&Array.isArray(flags.day14V4SelectedChoiceIds)&&flags.day14V4NariPrivateContact===false&&!(flags.day14V4HandContactEstablished===true&&!isDay14V4HandContactEligible({priorHandContact:flags.day14V4PriorHandContact,unresolvedContactBoundary:flags.day14V4UnresolvedContactBoundary,haeunInitiatedHand:flags.day14V4HaeunInitiatedHand}));
}
