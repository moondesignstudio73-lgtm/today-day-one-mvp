import {DAY11_V3_CHOICES,DAY11_V3_SCENARIO_ID,DAY11_V3_VERSION} from "./day11-v3-campaign-data.mjs";

const BANDS=new Set(["LOW","MID","HIGH","VERY_HIGH"]);
const CHECKPOINTS=Object.freeze([1,2,4,6,9,12,15,17,19,21,23]);
const choiceByOption=new Map(DAY11_V3_CHOICES.flatMap(choice=>choice.options.map(option=>[option.id,{choice,option}])));
const flagsOf=state=>state?.storyFlags??{};
const hasLegacy=flags=>flags.day11RuntimeStage!=null||flags.day11CurrentLifePlanPending===true||flags.day11CurrentLifePlanCompleted===true||flags.day11AnchorStrategy!=null||flags.day11ConflictStrategy!=null||flags.day11ShareStrategy!=null;
const attended=flags=>flags.day11V3Invited===true&&flags.day11V3Choice1!=="day11_leave_friends_alone";
const normalizedBand=band=>band==="VERY_HIGH"?"HIGH":band;

function addCollection(state,key,...ids){
  if(!state.scenario?.enabled||!Array.isArray(state.scenario[key]))return;
  state.scenario[key]=[...new Set([...state.scenario[key],...ids])];
}

function normalizeV3(flags){
  flags.day11V3SceneCheckpoint??=1;flags.day11V3SelectedChoiceIds??=[];flags.day11V3ChoiceIndex??=0;
  flags.day11V3AttendedSoraMeeting??=false;flags.day11V3PlayerDeclined??=false;flags.day11V3TripDisclosed??=false;
  flags.day11V3HeardSiwooName??=false;flags.day11V3ExhibitionInterest??=false;flags.day11V3CompanionUndecided??=true;flags.day11V3ShoulderLeanOccurred??=false;
  flags.day11V3WorkVisitTime??="10:00";flags.day11V3WorkVisitMaxHours??=3;flags.day11V3WorkIncludesLunch??=true;
}

export function getDay11V3Compatibility(state){
  const flags=flagsOf(state);
  if(flags.day11ScenarioVersion===DAY11_V3_VERSION)return {mode:"V3",complete:flags.day11V3Complete===true,checkpoint:flags.day11V3SceneCheckpoint??1};
  if(hasLegacy(flags))return {mode:"V1_LEGACY",complete:flags.day11CurrentLifePlanCompleted===true,checkpoint:flags.day11RuntimeStage??0};
  return {mode:"V3_NEW",complete:false,checkpoint:1};
}

export function beginDay11V3(state,{relationshipBand="LOW",haeunConsent=null,soraConsent=null,outfitOwned=null,priorNaturalContact=null,unresolvedConflict=null}={}){
  state.storyFlags??={};const compatibility=getDay11V3Compatibility(state);if(compatibility.mode==="V1_LEGACY")return compatibility;
  if(!BANDS.has(relationshipBand))throw new Error("DAY11_V3_RELATIONSHIP_BAND_REQUIRED");
  const flags=state.storyFlags;
  if(compatibility.mode==="V3"){
    normalizeV3(flags);return getDay11V3Compatibility(state);
  }
  flags.day11ScenarioVersion=DAY11_V3_VERSION;flags.day11V3ScenarioId=DAY11_V3_SCENARIO_ID;flags.day11V3RelationshipBand=normalizedBand(relationshipBand);
  flags.day11V3HaeunConsent=haeunConsent==null?flags.day10V3HaeunAgreesToSoraGreeting===true:haeunConsent===true;
  flags.day11V3SoraConsent=soraConsent==null?flags.day10V3SoraConsents===true:soraConsent===true;
  flags.day11V3Invited=flags.day11V3HaeunConsent&&flags.day11V3SoraConsent;
  flags.day11V3OutfitOwned=outfitOwned==null?(flags.day10V3GreenShirtOwned===true||flags.day9V3PurchasedOutfit===true):outfitOwned===true;
  flags.day11V3PriorNaturalContact=priorNaturalContact==null?(flags.day10V3PriorHandHold===true||flags.day10V3FarewellTouchAllowed===true):priorNaturalContact===true;
  flags.day11V3UnresolvedConflict=unresolvedConflict==null?(flags.day10V3Departure==="HAEUN_LEAVES"||(flags.day10V3Conflict===true&&flags.day10V3RepairStrategy!=="ACKNOWLEDGE_HER_TIME")):unresolvedConflict===true;
  normalizeV3(flags);flags.day11V3CompanionUndecided=true;flags.day11V3Complete=false;
  return getDay11V3Compatibility(state);
}

function availableChoices(flags){
  return attended(flags)?DAY11_V3_CHOICES:DAY11_V3_CHOICES.filter(choice=>choice.number!==4&&choice.number!==5);
}

export function getNextDay11V3Choice(state){
  const flags=flagsOf(state);if(flags.day11V3Complete===true)return null;
  const selected=new Set(flags.day11V3SelectedChoiceIds??[]);
  return availableChoices(flags).find(choice=>choice.options.every(option=>!selected.has(option.id)))??null;
}

function changeStat(state,key,amount){if(Number.isFinite(state[key]))state[key]+=amount;}

function updateDerived(state,choice,option){
  const flags=state.storyFlags,effects=option.effects;
  if(choice.number===1){
    flags.day11V3AttendanceIntent=effects.attendanceIntent;flags.day11V3PlayerDeclined=effects.attendanceIntent==="DECLINE_FOR_PRIVATE_TIME";
    flags.day11V3AttendedSoraMeeting=attended(flags);flags.day11V3EvaluationAnxietyAdmitted=effects.attendanceIntent==="ATTEND_AND_ADMIT_ANXIETY";
    if(flags.day11V3PlayerDeclined)changeStat(state,"trust",1);
  }
  if(choice.number===2){
    flags.day11V3OutfitStrategy=effects.outfitStrategy;
    flags.day11V3HaeunPreferredOutfitWorn=effects.outfitStrategy==="HAEUN_PREFERENCE_IF_OWNED"&&flags.day11V3OutfitOwned===true;
    flags.day11V3OutfitPurchasedToday=false;
  }
  if(choice.number===3){flags.day11V3WaitingStrategy=effects.waitingStrategy;flags.day11V3FirstHourRespected=true;flags.day11V3SharedBreadPurchased=false;}
  if(choice.number===4)flags.day11V3KnowledgeStrategy=effects.knowledgeStrategy;
  if(choice.number===5){
    flags.day11V3EvaluationStrategy=effects.evaluationStrategy;
    if(effects.evaluationStrategy==="MAKE_ROOM_TO_SPEAK")changeStat(state,"trust",1);
    if(effects.evaluationStrategy==="PERFORM_FOR_SORA"){changeStat(state,"trust",-1);flags.day11V3EvaluationPressure=true;}
  }
  if(choice.number===6){
    flags.day11V3TripResponse=effects.tripResponse;flags.day11V3TripDisclosed=true;flags.day11V3SoraTripFirstIntent=true;
    addCollection(state,"clues","day11-haeun-cancelled-sora-trip");
    if(effects.tripResponse==="ASK_CURRENT_WISH")changeStat(state,"trust",1);
  }
  if(choice.number===7)flags.day11V3FriendConversation=effects.friendConversation;
  if(choice.number===8){
    flags.day11V3DirectQuestion=effects.directQuestion;flags.day11V3AskedHaeunDirectly=true;
    flags.day11V3EvaluationShift=effects.directQuestion==="HAEUN_PRESENT_FEELING"?"PRESENT_FEELING":effects.directQuestion==="ADMIT_EVALUATION_DEPENDENCE"?"OWNED_ANXIETY":"OWNED_ALLY_SEEKING";
    changeStat(state,"trust",effects.directQuestion==="HAEUN_PRESENT_FEELING"?2:1);
  }
  if(choice.number===9){
    flags.day11V3SiwooResponse=effects.siwooResponse;flags.day11V3HeardSiwooName=true;flags.day11V3ExhibitionInterest=true;flags.day11V3CompanionUndecided=true;
    flags.day11V3JealousyPressure=effects.siwooResponse==="ASK_COMPANION_FROM_ANXIETY"?"DIRECT_QUESTION":effects.siwooResponse==="SUPPORT_WITHOUT_CLAIM"?"RESPECTED_AUTONOMY":"CURIOUS";
    addCollection(state,"clues","day11-siwoo-exhibition-schedule");
    if(effects.siwooResponse==="SUPPORT_WITHOUT_CLAIM")changeStat(state,"trust",1);
  }
  if(choice.number===10){
    flags.day11V3ClosingTime=effects.closingTime;flags.day11V3AdditionalTime=effects.closingTime!=="END_WITH_BOUNDARY";
    const contactEligible=flags.day11V3AttendedSoraMeeting===true&&flags.day11V3RelationshipBand==="HIGH"&&flags.day11V3PriorNaturalContact===true&&flags.day11V3UnresolvedConflict!==true&&flags.day11V3AdditionalTime===true;
    flags.day11V3ShoulderLeanOccurred=contactEligible;flags.day11V3HaeunInitiatedShoulderLean=contactEligible;
    if(effects.closingTime==="DISCLOSE_PRESENT_AFFECTION")changeStat(state,"affection",1);
  }
  if(choice.number===11){
    flags.day11V3WorkPreparation=effects.workPreparation;flags.day11V3PreparedQuestion=effects.workPreparation==="ASK_WHEN_UNKNOWN";
    flags.day11V3WorkVisitTime="10:00";flags.day11V3WorkVisitMaxHours=3;flags.day11V3WorkIncludesLunch=true;
    flags.day11V3Complete=true;flags.day11V3SceneCheckpoint=24;flags.day11SoraMeetingPending=false;flags.day12CompanyAdaptationVisitPending=true;
    addCollection(state,"unlockedActions","haeun-independent-time-respected");
    if(flags.day11V3AttendedSoraMeeting)addCollection(state,"unlockedActions","sora-greeting-completed");
    addCollection(state,"followUpHooks","day12-company-adaptation-visit");
  }
}

export function applyDay11V3Choice(state,optionId){
  state.storyFlags??={};const flags=state.storyFlags;if(flags.day11ScenarioVersion!==DAY11_V3_VERSION)throw new Error("DAY11_V3_NOT_STARTED");
  const found=choiceByOption.get(optionId);if(!found)throw new Error("DAY11_V3_UNKNOWN_CHOICE");
  const expected=getNextDay11V3Choice(state);if(!expected||expected.number!==found.choice.number)throw new Error("DAY11_V3_OUT_OF_ORDER_CHOICE");
  if((found.choice.number===4||found.choice.number===5)&&!attended(flags))throw new Error("DAY11_V3_ATTENDING_ONLY_CHOICE");
  flags[`day11V3Choice${found.choice.number}`]=optionId;flags.day11V3SelectedChoiceIds=[...flags.day11V3SelectedChoiceIds,optionId];flags.day11V3ChoiceIndex=found.choice.number;flags.day11V3SceneCheckpoint=CHECKPOINTS[found.choice.number-1];
  updateDerived(state,found.choice,found.option);
  return {choiceNumber:found.choice.number,nextChoice:getNextDay11V3Choice(state),checkpoint:flags.day11V3SceneCheckpoint,complete:flags.day11V3Complete===true};
}

export function getDay11V3RestoreContract(state){
  const flags=flagsOf(state);if(flags.day11ScenarioVersion!==DAY11_V3_VERSION)return getDay11V3Compatibility(state);
  return Object.freeze({mode:"V3",complete:flags.day11V3Complete===true,checkpoint:flags.day11V3SceneCheckpoint??1,nextChoiceNumber:getNextDay11V3Choice(state)?.number??null,invited:flags.day11V3Invited===true,attended:flags.day11V3AttendedSoraMeeting===true,playerDeclined:flags.day11V3PlayerDeclined===true,tripDisclosed:flags.day11V3TripDisclosed===true,heardSiwoo:flags.day11V3HeardSiwooName===true,companionUndecided:flags.day11V3CompanionUndecided===true,shoulderLean:flags.day11V3ShoulderLeanOccurred===true,workVisit:Object.freeze({time:flags.day11V3WorkVisitTime,maxHours:flags.day11V3WorkVisitMaxHours,includesLunch:flags.day11V3WorkIncludesLunch,preparedQuestion:flags.day11V3PreparedQuestion===true})});
}

export function validateDay11V3Runtime(){
  const state={affection:30,trust:30,storyFlags:{},scenario:{enabled:true,clues:[],unlockedActions:[],followUpHooks:[]}};
  beginDay11V3(state,{relationshipBand:"HIGH",haeunConsent:true,soraConsent:true,priorNaturalContact:true});
  for(const choice of DAY11_V3_CHOICES)applyDay11V3Choice(state,choice.options[0].id);
  return state.storyFlags.day11V3Complete===true&&state.storyFlags.day11V3ChoiceIndex===11&&state.storyFlags.day11V3SceneCheckpoint===24&&state.storyFlags.day11V3AttendedSoraMeeting===true;
}
