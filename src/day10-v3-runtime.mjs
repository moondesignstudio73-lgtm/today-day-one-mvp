import {DAY10_V3_CHOICES,DAY10_V3_FOLLOW_UP_CHOICE,DAY10_V3_SCENES,DAY10_V3_VERSION} from "./day10-v3-campaign-data.mjs";

const BANDS=new Set(["LOW","MID","HIGH","VERY_HIGH"]);
const CHECKPOINTS=Object.freeze([2,4,5,6,8,10,12,15,19,20,24]);
const choiceByOption=new Map(DAY10_V3_CHOICES.flatMap(choice=>choice.options.map(option=>[option.id,{choice,option}])));
const followUpByOption=new Map(DAY10_V3_FOLLOW_UP_CHOICE.options.map(option=>[option.id,option]));
const flagsOf=state=>state?.storyFlags??{};
const hasLegacy=flags=>flags.day10RuntimeComplete===true||flags.day10ThreeHourWorkRhythmCompleted===true||flags.day10RuntimeStage!=null||flags.day10RhythmStrategy!=null||flags.day10LunchStrategy!=null||flags.day10DebriefStrategy!=null;

export function getDay10V3Compatibility(state){
  const flags=flagsOf(state);
  if(flags.day10ScenarioVersion===DAY10_V3_VERSION)return {mode:"V3",complete:flags.day10V3Complete===true,checkpoint:flags.day10V3SceneCheckpoint??1};
  if(hasLegacy(flags))return {mode:"V1_LEGACY",complete:flags.day10RuntimeComplete===true||flags.day10ThreeHourWorkRhythmCompleted===true,checkpoint:flags.day10RuntimeStage??null};
  return {mode:"V3_NEW",complete:false,checkpoint:1};
}

export function beginDay10V3(state,{relationshipBand="LOW",haeunAvailableForDinner=true,greenShirtOwned=false,greenShirtWornToday=false,day9TopTriedOn=false,priorHandHold=false}={}){
  state.storyFlags??={};
  const compatibility=getDay10V3Compatibility(state);if(compatibility.mode==="V1_LEGACY")return compatibility;
  if(!BANDS.has(relationshipBand))throw new Error("DAY10_V3_RELATIONSHIP_BAND_REQUIRED");
  const flags=state.storyFlags;
  flags.day10ScenarioVersion=DAY10_V3_VERSION;flags.day10V3RelationshipBand=relationshipBand;flags.day10V3HaeunAvailableForDinner=haeunAvailableForDinner===true;
  flags.day10V3PriorDinnerStatus??=flags.day9V3DinnerStatus??"DEFERRED";flags.day10V3GreenShirtOwned=greenShirtOwned===true;flags.day10V3GreenShirtWornToday=greenShirtOwned===true&&greenShirtWornToday===true;
  flags.day10V3Day9TopTriedOn=day9TopTriedOn===true;flags.day10V3PriorHandHold=priorHandHold===true;flags.day10V3SceneCheckpoint??=1;flags.day10V3ChoiceIndex??=0;flags.day10V3SelectedChoiceIds??=[];
  flags.day10V3ShoppingSpend??=0;flags.day10V3PlatePurchased??=false;flags.day10V3AdditionalDecorPurchased??=false;flags.day10V3SoraInvitationStatus??="PRIVATE_MEETING";
  return getDay10V3Compatibility(state);
}

export function getNextDay10V3Choice(state){
  const flags=flagsOf(state);if(flags.day10V3Complete===true)return null;
  if(flags.day10V3FollowUpRequired===true&&flags.day10V3FollowUpResolved!==true)return DAY10_V3_FOLLOW_UP_CHOICE;
  return DAY10_V3_CHOICES[flags.day10V3ChoiceIndex??0]??null;
}

function updateDerived(state,choice,option){
  const flags=state.storyFlags,effects=option.effects;
  if(choice.number===1)flags.day10V3DinnerAgreement=effects.agreement;
  if(choice.number===2){flags.day10V3Menu=effects.menu;flags.day10V3MealSource=effects.mealSource;flags.day10V3GimbapVillageRoute=effects.mealSource==="TAKEOUT";}
  if(choice.number===3)flags.day10V3SpendIntent=effects.spendIntent;
  if(choice.number===4){flags.day10V3WorkBoundary=effects.workBoundary;flags.day10V3WorkPerformed=false;}
  if(choice.number===5)flags.day10V3PrepReport=effects.prepReport;
  if(choice.number===6)flags.day10V3RemakeDecision=effects.remake;
  if(choice.number===7){
    flags.day10V3TimingStrategy=effects.timing;
    const shared=flags.day10V3DinnerAgreement==="SHARED_AT_SEVEN";
    const materiallyIncomplete=flags.day10V3PrepReport==="FALSE_NEARLY_DONE"||flags.day10V3RemakeDecision==="START_OVER";
    flags.day10V3TruthfulTiming=effects.timing!=="SAY_SOON"||!materiallyIncomplete;
    flags.day10V3FinishTogether=shared&&effects.timing==="ASK_TO_FINISH_TOGETHER";
    flags.day10V3AdvanceChangeAgreed=shared&&materiallyIncomplete&&(effects.timing==="TRUTHFUL_ESTIMATE"||effects.timing==="ASK_TO_FINISH_TOGETHER");
    flags.day10V3ActualWait=shared&&materiallyIncomplete&&effects.timing==="SAY_SOON";
    flags.day10V3Conflict=flags.day10V3ActualWait===true&&flags.day10V3TruthfulTiming===false;
  }
  if(choice.number===8){
    flags.day10V3RepairStrategy=effects.repair;
    flags.day10V3FollowUpRequired=flags.day10V3Conflict===true&&effects.repair==="SEEK_INTENT_VALIDATION";
    if(!flags.day10V3FollowUpRequired){flags.day10V3FollowUpResolved=true;flags.day10V3Departure="STAYS";}
  }
  if(choice.number===9)flags.day10V3MeaningStatement=effects.meaning;
  if(choice.number===10)flags.day10V3CleanupStrategy=effects.cleanup;
  if(choice.number===11){
    flags.day10V3SoraRequest=effects.sora;flags.day10V3Complete=true;flags.day10DinnerProposalPending=false;
    const comfortable=!flags.day10V3Conflict||flags.day10V3RepairStrategy==="ACKNOWLEDGE_HER_TIME"||flags.day10V3Departure==="STAYS_AWKWARDLY";
    flags.day10V3CurrentComfort=comfortable&&flags.day10V3Departure!=="HAEUN_LEAVES"&&flags.day10V3RelationshipBand!=="LOW";
    flags.day10V3FarewellTouchAllowed=flags.day10V3PriorHandHold===true&&flags.day10V3CurrentComfort===true;
    flags.day10V3GreenShirtCallback=flags.day10V3GreenShirtOwned===true&&flags.day10V3GreenShirtWornToday===true;
    flags.day10V3SleeveCallback=flags.day10V3GreenShirtCallback?"GREEN_SHIRT":flags.day10V3Day9TopTriedOn?"SLEEVE_TRY_ON":"ZIPPER";
    flags.day11SoraMeetingPending=true;
  }
}

export function applyDay10V3Choice(state,optionId){
  state.storyFlags??={};const flags=state.storyFlags;if(flags.day10ScenarioVersion!==DAY10_V3_VERSION)throw new Error("DAY10_V3_NOT_STARTED");
  const found=choiceByOption.get(optionId);if(!found)throw new Error("DAY10_V3_UNKNOWN_CHOICE");
  const expected=getNextDay10V3Choice(state);if(!expected||expected.number!==found.choice.number)throw new Error("DAY10_V3_OUT_OF_ORDER_CHOICE");
  if(found.choice.number===1&&found.option.effects.agreement==="SHARED_AT_SEVEN"&&flags.day10V3HaeunAvailableForDinner!==true)throw new Error("DAY10_V3_HAEUN_DECLINED_SHARED_DINNER");
  flags[`day10V3Choice${found.choice.number}`]=optionId;flags.day10V3SelectedChoiceIds=[...flags.day10V3SelectedChoiceIds,optionId];flags.day10V3ChoiceIndex=found.choice.number;flags.day10V3SceneCheckpoint=CHECKPOINTS[found.choice.number-1];
  updateDerived(state,found.choice,found.option);
  return {choiceNumber:found.choice.number,nextChoice:getNextDay10V3Choice(state),checkpoint:flags.day10V3SceneCheckpoint,complete:flags.day10V3Complete===true};
}

export function applyDay10V3FollowUpChoice(state,optionId){
  const flags=flagsOf(state);if(flags.day10ScenarioVersion!==DAY10_V3_VERSION)throw new Error("DAY10_V3_NOT_STARTED");
  if(flags.day10V3FollowUpRequired!==true||flags.day10V3FollowUpResolved===true)throw new Error("DAY10_V3_FOLLOW_UP_NOT_AVAILABLE");
  const option=followUpByOption.get(optionId);if(!option)throw new Error("DAY10_V3_UNKNOWN_FOLLOW_UP");
  flags.day10V3FollowUpChoice=optionId;flags.day10V3FollowUpResolved=true;flags.day10V3FollowUpRequired=false;flags.day10V3Departure=option.effects.departure;flags.day10V3SceneCheckpoint=16;
  return {nextChoice:getNextDay10V3Choice(state),departure:flags.day10V3Departure};
}

export function resolveDay10V3ShoppingSpend(state,{platePurchased=false,additionalDecorPurchased=false,amount=0}={}){
  const flags=flagsOf(state);if(flags.day10ScenarioVersion!==DAY10_V3_VERSION)throw new Error("DAY10_V3_NOT_STARTED");
  if((flags.day10V3ChoiceIndex??0)<3)throw new Error("DAY10_V3_SPEND_NOT_AVAILABLE");
  if(!Number.isFinite(amount)||amount<0)throw new Error("DAY10_V3_INVALID_SPEND");
  const balance=Number.isFinite(state.money)?state.money:0;if(amount>balance)return {applied:false,reason:"INSUFFICIENT_FUNDS"};
  if(flags.day10V3SpendIntent==="FOOD_FIRST"&&(platePurchased||additionalDecorPurchased))return {applied:false,reason:"CHOICE_FORBIDS_EXTRA"};
  if(flags.day10V3SpendIntent==="ONE_PLATE_IF_AFFORDABLE"&&additionalDecorPurchased)return {applied:false,reason:"CHOICE_FORBIDS_DECOR"};
  state.money=balance-amount;flags.day10V3ShoppingSpend=amount;flags.day10V3PlatePurchased=platePurchased===true;flags.day10V3AdditionalDecorPurchased=additionalDecorPurchased===true;return {applied:true,balance:state.money};
}

export function resolveDay10V3SoraInvitation(state,{haeunAgrees=false,soraConsents=false}={}){
  const flags=flagsOf(state);if(flags.day10V3Complete!==true)return false;
  const eligible=flags.day10V3SoraRequest==="ASK_RESPECTFULLY"&&flags.day10V3CurrentComfort===true&&flags.day10V3Departure!=="HAEUN_LEAVES";
  flags.day10V3HaeunAgreesToSoraGreeting=eligible&&haeunAgrees===true;flags.day10V3SoraConsents=flags.day10V3HaeunAgreesToSoraGreeting&&soraConsents===true;flags.day10V3SoraInvitationStatus=flags.day10V3SoraConsents?"INVITED_TO_FLORA":"PRIVATE_MEETING";return true;
}

export function getDay10V3SceneMetadata(sceneNumber){const scene=DAY10_V3_SCENES[sceneNumber-1];if(!scene)throw new Error("DAY10_V3_UNKNOWN_SCENE");return scene;}

export function validateDay10V3Runtime(){const state={money:100000,storyFlags:{day9V3DinnerStatus:"CONTACT_BEFORE_NOON"}};beginDay10V3(state,{relationshipBand:"HIGH",priorHandHold:true});for(const choice of DAY10_V3_CHOICES)applyDay10V3Choice(state,choice.options[0].id);return state.storyFlags.day10V3Complete===true&&state.storyFlags.day10V3ChoiceIndex===11&&state.storyFlags.day10V3SceneCheckpoint===24&&state.storyFlags.day10V3WorkPerformed===false;}
