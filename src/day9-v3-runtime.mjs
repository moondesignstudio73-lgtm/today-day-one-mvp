import {DAY9_V3_CHOICES,DAY9_V3_VERSION} from "./day9-v3-campaign-data.mjs";

const BANDS=new Set(["LOW","MID","HIGH","VERY_HIGH"]);
const CHECKPOINTS=Object.freeze([2,4,7,9,10,12,14,16,19,21,24]);
const choiceByOption=new Map(DAY9_V3_CHOICES.flatMap(choice=>choice.options.map(option=>[option.id,{choice,option}])));
const flagsOf=state=>state?.storyFlags??{};
const hasLegacy=flags=>flags.day9RuntimeComplete===true||flags.day9SecondOfficeAdaptationCompleted===true||flags.day9RuntimeStage!=null||flags.day9ScopeStrategy!=null||flags.day9PressureStrategy!=null||flags.day9DebriefStrategy!=null;

export function getDay9V3Compatibility(state){
  const flags=flagsOf(state);
  if(flags.day9ScenarioVersion===DAY9_V3_VERSION)return {mode:"V3",complete:flags.day9V3Complete===true,checkpoint:flags.day9V3SceneCheckpoint??1};
  if(hasLegacy(flags))return {mode:"V1_LEGACY",complete:flags.day9RuntimeComplete===true||flags.day9SecondOfficeAdaptationCompleted===true,checkpoint:flags.day9RuntimeStage??null};
  return {mode:"V3_NEW",complete:false,checkpoint:1};
}

export function beginDay9V3(state,{relationshipBand="LOW",priorLightContact=false,unresolvedKnownConflict=false}={}){
  state.storyFlags??={};
  const compatibility=getDay9V3Compatibility(state);
  if(compatibility.mode==="V1_LEGACY")return compatibility;
  if(!BANDS.has(relationshipBand))throw new Error("DAY9_V3_RELATIONSHIP_BAND_REQUIRED");
  const flags=state.storyFlags;
  flags.day9ScenarioVersion=DAY9_V3_VERSION;
  flags.day9V3RelationshipBand=relationshipBand;
  flags.day9V3PriorLightContact=priorLightContact===true;
  flags.day9V3UnresolvedKnownConflict=unresolvedKnownConflict===true;
  flags.day9V3SceneCheckpoint??=1;
  flags.day9V3ChoiceIndex??=0;
  flags.day9V3SelectedChoiceIds??=[];
  flags.day9V3MenuStatus??="UNDECIDED";
  return getDay9V3Compatibility(state);
}

export const getNextDay9V3Choice=state=>flagsOf(state).day9V3Complete===true?null:DAY9_V3_CHOICES[flagsOf(state).day9V3ChoiceIndex??0]??null;

function updateDerived(state,choice,option){
  const flags=state.storyFlags,effects=option.effects;
  if(choice.number===1){flags.day9V3ShoppingRoute=effects.route;flags.day9V3FoodHallEligible=effects.route==="TOGETHER_FULL";}
  if(choice.number===2)flags.day9V3GiftIntent=effects.giftIntent;
  if(choice.number===3){flags.day9V3PinkResponse=effects.pinkResponse;if(effects.distance)flags.day9V3DistanceRemaining=true;}
  if(choice.number===4)flags.day9V3GreenPreferenceRead=effects.greenRead;
  if(choice.number===5){flags.day9V3GreenPhotoExists=effects.greenPhoto;flags.day9V3GreenPhotoScope=effects.photoScope;}
  if(choice.number===6)flags.day9V3ScarfPurchase=effects.scarfPurchase;
  if(choice.number===7){flags.day9V3ScarfResponse=effects.scarfResponse;if(effects.distance)flags.day9V3DistanceRemaining=true;flags.day9V3ScarfState=flags.day9V3ScarfPurchase!=="PURCHASED_GIFT"?"UNPURCHASED":effects.scarfResponse==="EXCHANGE"?"EXCHANGE_PENDING":"PROTAGONIST_OWNED";}
  if(choice.number===8){flags.day9V3PlayerTryOn=effects.playerTryOn;flags.day9V3RestRoute=effects.rest===true;flags.day9V3SleeveContactAllowed=effects.rest!==true&&flags.day9V3PriorLightContact===true&&flags.day9V3RelationshipBand!=="LOW"&&flags.day9V3DistanceRemaining!==true;}
  if(choice.number===9){
    flags.day9V3Checkout=effects.checkout;
    const enough=state.money==null||state.money>0;
    flags.day9V3GreenShirtState=effects.checkout==="OFFER_GREEN_GIFT"&&enough&&flags.day9V3DistanceRemaining!==true?"GIFT_OFFER_PENDING":effects.checkout==="EACH_BUYS_OWN"?"HAEUN_SELF_PURCHASE_PENDING":"UNPURCHASED";
    flags.day9V3PlayerClothingState=flags.day9V3RestRoute?"NOT_TRIED":flags.day9V3PlayerTryOn==="REST"?"NOT_TRIED":effects.checkout==="EACH_BUYS_OWN"&&enough?"PURCHASE_CONFIRM_PENDING":"TRIED_NOT_BOUGHT";
    if(flags.day9V3ScarfState==="EXCHANGE_PENDING")flags.day9V3ScarfState="EXCHANGED";
    flags.day9V3InsufficientFunds=effects.checkout!=="NO_NEW_PURCHASE"&&!enough;
  }
  if(choice.number===10)flags.day9V3MemoryChoice=effects.memory;
  if(choice.number===11){
    flags.day9V3DinnerStatus=effects.dinner==="CONFIRMED_IF_COMFORTABLE"&&!flags.day9V3DistanceRemaining&&!flags.day9V3UnresolvedKnownConflict?"CONFIRMED":"CONTACT_BEFORE_NOON";
    if(effects.dinner==="CONTACT_BEFORE_NOON")flags.day9V3DinnerStatus="CONTACT_BEFORE_NOON";
    if(effects.dinner==="DEFERRED")flags.day9V3DinnerStatus="DEFERRED";
    flags.day9V3MenuStatus="UNDECIDED";
    flags.day9V3Complete=true;
    flags.day9ClothingColorInvitationPending=false;
    flags.day10DinnerProposalPending=true;
  }
}

export function applyDay9V3Choice(state,optionId){
  state.storyFlags??={};
  if(state.storyFlags.day9ScenarioVersion!==DAY9_V3_VERSION)throw new Error("DAY9_V3_NOT_STARTED");
  const found=choiceByOption.get(optionId);if(!found)throw new Error("DAY9_V3_UNKNOWN_CHOICE");
  const expected=getNextDay9V3Choice(state);if(!expected||expected.number!==found.choice.number)throw new Error("DAY9_V3_OUT_OF_ORDER_CHOICE");
  state.storyFlags[`day9V3Choice${found.choice.number}`]=optionId;
  state.storyFlags.day9V3SelectedChoiceIds=[...state.storyFlags.day9V3SelectedChoiceIds,optionId];
  state.storyFlags.day9V3ChoiceIndex=found.choice.number;
  state.storyFlags.day9V3SceneCheckpoint=CHECKPOINTS[found.choice.number-1];
  updateDerived(state,found.choice,found.option);
  return {choiceNumber:found.choice.number,nextChoice:getNextDay9V3Choice(state),checkpoint:state.storyFlags.day9V3SceneCheckpoint,complete:state.storyFlags.day9V3Complete===true};
}

export function resolveDay9V3GreenGift(state,{accepted=false}={}){
  const flags=flagsOf(state);if(flags.day9V3GreenShirtState!=="GIFT_OFFER_PENDING")return false;
  flags.day9V3GreenShirtState=accepted?"GIFT_ACCEPTED":"UNPURCHASED";flags.day9V3GreenGiftAccepted=accepted===true;return true;
}

export function resolveDay9V3PlayerPurchase(state,{purchased=false}={}){
  const flags=flagsOf(state);if(flags.day9V3PlayerClothingState!=="PURCHASE_CONFIRM_PENDING")return false;
  flags.day9V3PlayerClothingState=purchased?"BOUGHT":"TRIED_NOT_BOUGHT";return true;
}

export function validateDay9V3Runtime(){const state={money:100000,storyFlags:{}};beginDay9V3(state,{relationshipBand:"HIGH",priorLightContact:true});for(const choice of DAY9_V3_CHOICES)applyDay9V3Choice(state,choice.options[0].id);return state.storyFlags.day9V3Complete===true&&state.storyFlags.day9V3ChoiceIndex===11&&state.storyFlags.day9V3SceneCheckpoint===24&&state.storyFlags.day9V3MenuStatus==="UNDECIDED";}
