import {DAY9_V3_CHOICES,DAY9_V3_VERSION} from "./day9-v3-campaign-data.mjs";
import {DAY9_V3_PLAYABLE_SCRIPT_01_12} from "./day9-v3-playable-script-01-12.mjs";
import {DAY9_V3_PLAYABLE_SCRIPT_13_24} from "./day9-v3-playable-script-13-24.mjs";

const BANDS=new Set(["LOW","MID","HIGH","VERY_HIGH"]);
const CHECKPOINTS=Object.freeze([2,3,5,7,9,11,14,16,19,21,24]);
const choiceByOption=new Map(DAY9_V3_CHOICES.flatMap(choice=>choice.options.map(option=>[option.id,{choice,option}])));
const flagsOf=state=>state?.storyFlags??{};
const hasLegacy=flags=>flags.day9RuntimeComplete===true||flags.day9SecondOfficeAdaptationCompleted===true||flags.day9RuntimeStage!=null||flags.day9ScopeStrategy!=null||flags.day9PressureStrategy!=null||flags.day9DebriefStrategy!=null;
const playableByNumber=new Map([...DAY9_V3_PLAYABLE_SCRIPT_01_12,...DAY9_V3_PLAYABLE_SCRIPT_13_24].map(item=>[item.number,item]));
const selected=(scene,key)=>scene.branches.find(item=>item.key===key)?.steps??[];
const selectedFrom=(scene,flags,choiceNumber)=>selected(scene,flags[`day9V3Choice${choiceNumber}`]);

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
  if(choice.number===3)flags.day9V3PreFitStrategy=effects.preFit;
  if(choice.number===4){flags.day9V3PinkResponse=effects.pinkResponse;if(effects.distance)flags.day9V3DistanceRemaining=true;}
  if(choice.number===5)flags.day9V3GreenPreferenceRead=effects.greenRead;
  if(choice.number===6){flags.day9V3ScarfPurchase=effects.scarfPurchase;flags.day9V3ScarfIntent=effects.scarfIntent;flags.day9V3GreenPhotoExists=true;flags.day9V3GreenPhotoScope="REQUESTED_BY_HAEUN";}
  if(choice.number===7){flags.day9V3ScarfResponse=effects.scarfResponse;if(effects.distance)flags.day9V3DistanceRemaining=true;flags.day9V3ScarfState=flags.day9V3ScarfPurchase!=="PURCHASED_GIFT"?"UNPURCHASED":effects.scarfResponse==="PUSHED_WEAR"?"PROTAGONIST_OWNED":"EXCHANGE_PENDING";}
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

export function resolveDay9V3HaeunSelfPurchase(state,{purchased=false}={}){
  const flags=flagsOf(state);if(flags.day9V3GreenShirtState!=="HAEUN_SELF_PURCHASE_PENDING")return false;
  flags.day9V3GreenShirtState=purchased?"HAEUN_SELF_PURCHASED":"UNPURCHASED";return true;
}

export function getDay9V3PlayableScene(state,sceneNumber){
  const flags=flagsOf(state);if(flags.day9ScenarioVersion!==DAY9_V3_VERSION)throw new Error("DAY9_V3_NOT_STARTED");
  const scene=playableByNumber.get(sceneNumber);if(!scene)throw new Error("DAY9_V3_UNKNOWN_SCENE");
  const branches=[];
  const add=key=>branches.push(...selected(scene,key));
  if(sceneNumber===1){add(flags.day9V3UnresolvedKnownConflict?"unresolved":"comfortable");if(flags.day8V3RestBoundary===true)add("day8-rest");}
  if([2,3,5,7,9,11,13,15,18,20,21,23].includes(sceneNumber))branches.push(...selectedFrom(scene,flags,{2:1,3:2,5:3,7:4,9:5,11:6,13:7,15:8,18:9,20:1,21:10,23:11}[sceneNumber]));
  if(sceneNumber===12)add(flags.day9V3ScarfIntent==="ASK_FIRST"?"scarf-ask-first":flags.day9V3ScarfIntent==="BOUGHT_SECRET"?"scarf-bought-secret":"scarf-waited");
  if(sceneNumber===14)add(flags.day9V3ScarfResponse==="EXCHANGE_OR_PUT_DOWN"?"scarf-exchange":flags.day9V3ScarfResponse==="ADMIT_EMBARRASSED"?"scarf-embarrassed":"scarf-distance");
  if(sceneNumber===16)add(flags.day9V3RestRoute?"rest":"try-on");
  if(sceneNumber===17)add(flags.day9V3DistanceRemaining?"distance":"comfortable");
  if(sceneNumber===19){
    const greenOwned=["GIFT_ACCEPTED","HAEUN_SELF_PURCHASED"].includes(flags.day9V3GreenShirtState);
    if(flags.day9V3ScarfState==="EXCHANGED")add("scarf-exchanged");
    else if(flags.day9V3ScarfState==="PROTAGONIST_OWNED")add("scarf-owned");
    if(greenOwned)add("green-owned");
    if(!greenOwned&&!['EXCHANGED','PROTAGONIST_OWNED'].includes(flags.day9V3ScarfState))add("nothing-bought");
  }
  if(sceneNumber===22)add(flags.day9V3DistanceRemaining?"distance":["GIFT_ACCEPTED","HAEUN_SELF_PURCHASED"].includes(flags.day9V3GreenShirtState)?"green-owned":"green-unpurchased");
  if(sceneNumber===24)add(flags.day9V3DistanceRemaining?"distance":"comfortable");
  return Object.freeze({sceneId:scene.id,sceneNumber:scene.number,title:scene.title,checkpoint:flags.day9V3SceneCheckpoint??1,steps:Object.freeze([...scene.steps,...branches])});
}

export function validateDay9V3Runtime(){const state={money:100000,storyFlags:{}};beginDay9V3(state,{relationshipBand:"HIGH",priorLightContact:true});for(const choice of DAY9_V3_CHOICES)applyDay9V3Choice(state,choice.options[0].id);return state.storyFlags.day9V3Complete===true&&state.storyFlags.day9V3ChoiceIndex===11&&state.storyFlags.day9V3SceneCheckpoint===24&&state.storyFlags.day9V3MenuStatus==="UNDECIDED";}
