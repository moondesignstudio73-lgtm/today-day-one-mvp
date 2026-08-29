import {DAY13_V3_CHOICES,DAY13_V3_SCENARIO_ID,DAY13_V3_VERSION} from "./day13-v3-campaign-data.mjs";
import {getDay13V3PlayableScene01To12} from "./day13-v3-playable-script-01-12.mjs";
import {getDay13V3PlayableScene13To24} from "./day13-v3-playable-script-13-24.mjs";

const BANDS=new Set(["LOW","MID","HIGH","VERY_HIGH"]);
const choiceByOption=new Map(DAY13_V3_CHOICES.flatMap(choice=>choice.options.map(option=>[option.id,{choice,option}])));
const flagsOf=state=>state?.storyFlags??{};
const hasLegacy=flags=>flags.day13RuntimeStage!=null||flags.day13CurrentHouseholdBudgetPending===true||flags.day13CurrentHouseholdBudgetCompleted===true||flags.day13BaseStrategy!=null||flags.day13ReviewStrategy!=null;
const addCollection=(state,key,...ids)=>{if(!state.scenario?.enabled||!Array.isArray(state.scenario[key]))return;state.scenario[key]=[...new Set([...state.scenario[key],...ids])];};

function normalize(flags){
  flags.day13V3RuntimeStage??=0;flags.day13V3SceneCheckpoint??=1;flags.day13V3SelectedChoiceIds??=[];flags.day13V3ChoiceIndex??=0;flags.day13V3Completed??=false;
  flags.day13V3AraMet??=false;flags.day13V3AraEarlyExit??=false;flags.day13V3AraPhysicallyPresent??=false;flags.day13V3PortraitExists??=false;
  flags.day13V3PublicPostPermission??=false;flags.day13V3HaeunDisclosureMismatch??=false;flags.day13V3HaeunNeedsSpace??=false;
  flags.day13V3FlowerInterest??=false;flags.day13V3FloraInvitation??=false;
}

export function getDay13V3Compatibility(state){
  const flags=flagsOf(state);
  if(flags.day13ScenarioVersion===DAY13_V3_VERSION)return Object.freeze({mode:"V3",complete:flags.day13V3Completed===true,checkpoint:flags.day13V3SceneCheckpoint??1});
  if(hasLegacy(flags))return Object.freeze({mode:"V1_LEGACY",complete:flags.day13CurrentHouseholdBudgetCompleted===true,checkpoint:flags.day13RuntimeStage??0});
  return Object.freeze({mode:"V3_NEW",complete:false,checkpoint:1});
}

export function beginDay13V3(state,{relationshipBand="LOW"}={}){
  state.storyFlags??={};const compatibility=getDay13V3Compatibility(state);if(compatibility.mode==="V1_LEGACY")return compatibility;
  if(!BANDS.has(relationshipBand))throw new Error("DAY13_V3_RELATIONSHIP_BAND_REQUIRED");
  const flags=state.storyFlags;if(compatibility.mode==="V3"){normalize(flags);return getDay13V3Compatibility(state);}
  flags.day13ScenarioVersion=DAY13_V3_VERSION;flags.day13V3ScenarioId=DAY13_V3_SCENARIO_ID;flags.day13V3RelationshipBand=relationshipBand==="VERY_HIGH"?"HIGH":relationshipBand;
  flags.day13V3PreservedSeojinAffection=Number.isFinite(state.scenario?.seojinAffection)?state.scenario.seojinAffection:0;
  flags.day13V3PreservedSeojinStatusInterest=Number.isFinite(state.scenario?.seojinStatusInterest)?state.scenario.seojinStatusInterest:0;
  flags.day13V3PreservedDay12DisclosureState=flags.day12V3DisclosureMismatch??flags.day12V3HaeunFinalDisclosure??"NONE";
  normalize(flags);return getDay13V3Compatibility(state);
}

const choiceAvailable=(choice,flags)=>{
  if(choice.number===3)return flags.day13V3AraMet===true;
  if(choice.number===8)return flags.day13V3AraMet===true&&flags.day13V3AraEarlyExit!==true;
  if(choice.number===9)return flags.day13V3AraPhysicallyPresent===true;
  if(choice.number===12)return flags.day13V3AraMet===true&&flags.day13V3HaeunReport==="TELL_ARA";
  return true;
};
const optionsFor=(choice,flags)=>choice.number===11&&flags.day13V3AraMet!==true?choice.options.filter(option=>option.id!=="day13_tell_ara_meeting"):choice.options;
export function getNextDay13V3Choice(state){
  const flags=flagsOf(state);if(flags.day13V3Completed===true)return null;const selected=new Set(flags.day13V3SelectedChoiceIds??[]);
  const choice=DAY13_V3_CHOICES.find(item=>choiceAvailable(item,flags)&&item.options.every(option=>!selected.has(option.id)));
  return choice?Object.freeze({...choice,options:Object.freeze(optionsFor(choice,flags))}):null;
}

function updateDerived(state,choice,option){
  const flags=state.storyFlags,effects=option.effects;
  if(choice.number===1){flags.day13V3OutingRoute=effects.outingRoute;flags.day13V3AraMet=effects.araEncounterEligible===true;flags.day13V3AraPhysicallyPresent=effects.araEncounterEligible===true;}
  if(choice.number===2)flags.day13V3PhotoIntention=effects.photoIntention;
  if(choice.number===3)flags.day13V3AraSelfIntroduction=effects.araSelfIntroduction;
  if(choice.number===4)flags.day13V3PhotoStrategy=effects.photoStrategy;
  if(choice.number===5){flags.day13V3PaceStrategy=effects.paceStrategy;flags.day13V3AraEarlyExit=effects.araEarlyExit===true;flags.day13V3AraPhysicallyPresent=flags.day13V3AraMet===true&&!flags.day13V3AraEarlyExit;}
  if(choice.number===6){flags.day13V3PortraitConsent=effects.portraitConsent;flags.day13V3PortraitExists=effects.portraitExists===true;}
  if(choice.number===7)flags.day13V3WorkIntroduction=effects.workIntroduction;
  if(choice.number===8){flags.day13V3AraContinuation=effects.araContinuation;flags.day13V3AraPhysicallyPresent=effects.araContinuation!=="END_NOW";}
  if(choice.number===9)flags.day13V3HaeunIntroductionToAra=effects.haeunIntroductionToAra;
  if(choice.number===10){flags.day13V3PhotoContact=effects.photoContact;flags.day13V3PublicPostPermission=false;}
  if(choice.number===11)flags.day13V3HaeunReport=effects.haeunReport;
  if(choice.number===12){flags.day13V3ComfortExplanation=effects.comfortExplanation;flags.day13V3HaeunNeedsSpace=effects.haeunNeedsSpace===true;}
  const extended=flags.day13V3AraPhysicallyPresent===true&&(flags.day13V3AraContinuation==="ASK_PHOTO_CONTACT"||flags.day13V3PhotoContact==="OCCASIONAL_EXCHANGE");
  flags.day13V3HaeunDisclosureMismatch=(flags.day13V3HaeunReport==="MOSTLY_ALONE"&&extended)||(flags.day13V3ComfortExplanation==="PASSING"&&extended);
}

const checkpointFor=(choiceNumber,flags)=>{
  if(choiceNumber===1)return 2;if(choiceNumber===2)return flags.day13V3AraMet?6:8;if(choiceNumber===3)return 8;if(choiceNumber===4)return 10;
  if(choiceNumber===5)return 13;if(choiceNumber===6)return 15;if(choiceNumber===7)return 17;if(choiceNumber===8)return 18;if(choiceNumber===9)return 19;
  if(choiceNumber===10)return 21;if(choiceNumber===11)return 22;return 24;
};
function finishIfReady(state){
  const flags=state.storyFlags;if(getNextDay13V3Choice(state))return;
  flags.day13V3Completed=true;flags.day13V3SceneCheckpoint=24;flags.day13OutsideViewPlanPending=false;flags.day14FlowerDeskPlanPending=true;
  flags.day13V3Day22Callback=flags.day13V3AraMet?(flags.day13V3AraEarlyExit?"ARA_EARLY_EXIT":"ARA_MET"):"NO_ARA";
  flags.day13V3FlowerInterest=true;flags.day13V3FloraInvitation=!flags.day13V3HaeunNeedsSpace&&!flags.day13V3HaeunDisclosureMismatch;
  addCollection(state,"followUpHooks","day14-flower-desk-plan");
}

export function applyDay13V3Choice(state,optionId){
  state.storyFlags??={};const flags=state.storyFlags;if(flags.day13ScenarioVersion!==DAY13_V3_VERSION)throw new Error("DAY13_V3_NOT_STARTED");
  const found=choiceByOption.get(optionId);if(!found)throw new Error("DAY13_V3_UNKNOWN_CHOICE");const expected=getNextDay13V3Choice(state);
  if(!expected||expected.number!==found.choice.number||!expected.options.some(option=>option.id===optionId))throw new Error("DAY13_V3_OUT_OF_ORDER_CHOICE");
  flags[`day13V3Choice${found.choice.number}`]=optionId;flags.day13V3SelectedChoiceIds=[...flags.day13V3SelectedChoiceIds,optionId];
  flags.day13V3ChoiceIndex=found.choice.number;flags.day13V3RuntimeStage=found.choice.number;updateDerived(state,found.choice,found.option);
  flags.day13V3SceneCheckpoint=checkpointFor(found.choice.number,flags);finishIfReady(state);
  return Object.freeze({choiceNumber:found.choice.number,nextChoiceNumber:getNextDay13V3Choice(state)?.number??null,checkpoint:flags.day13V3SceneCheckpoint,complete:flags.day13V3Completed===true});
}

export function getDay13V3PlayableScene(state,sceneNumber){
  if(flagsOf(state).day13ScenarioVersion!==DAY13_V3_VERSION)throw new Error("DAY13_V3_NOT_STARTED");
  if(sceneNumber<1||sceneNumber>24)throw new Error(`UNKNOWN_DAY13_V3_SCENE_${sceneNumber}`);
  return sceneNumber<=12?getDay13V3PlayableScene01To12(state,sceneNumber):getDay13V3PlayableScene13To24(state,sceneNumber);
}

export function getDay13V3RestoreContract(state){
  const flags=flagsOf(state);if(flags.day13ScenarioVersion!==DAY13_V3_VERSION)return getDay13V3Compatibility(state);
  return Object.freeze({mode:"V3",complete:flags.day13V3Completed===true,checkpoint:flags.day13V3SceneCheckpoint??1,nextChoiceNumber:getNextDay13V3Choice(state)?.number??null,
    selectedChoiceIds:Object.freeze([...(flags.day13V3SelectedChoiceIds??[])]),outingRoute:flags.day13V3OutingRoute??null,araMet:flags.day13V3AraMet===true,araEarlyExit:flags.day13V3AraEarlyExit===true,
    araPhysicallyPresent:flags.day13V3AraPhysicallyPresent===true,portraitConsent:flags.day13V3PortraitConsent??null,portraitExists:flags.day13V3PortraitExists===true,
    photoContact:flags.day13V3PhotoContact??null,publicPostPermission:flags.day13V3PublicPostPermission===true,haeunReport:flags.day13V3HaeunReport??null,
    comfortExplanation:flags.day13V3ComfortExplanation??null,haeunDisclosureMismatch:flags.day13V3HaeunDisclosureMismatch===true,haeunNeedsSpace:flags.day13V3HaeunNeedsSpace===true,
    day22Callback:flags.day13V3Day22Callback??null,flowerInterest:flags.day13V3FlowerInterest===true,floraInvitation:flags.day13V3FloraInvitation===true,
    preservedSeojinAffection:flags.day13V3PreservedSeojinAffection,preservedSeojinStatusInterest:flags.day13V3PreservedSeojinStatusInterest});
}

export function validateDay13V3Runtime(){
  const state={storyFlags:{},scenario:{enabled:true,seojinAffection:7,seojinStatusInterest:13,followUpHooks:[]}};beginDay13V3(state,{relationshipBand:"MID"});
  while(getNextDay13V3Choice(state))applyDay13V3Choice(state,getNextDay13V3Choice(state).options[0].id);
  return state.storyFlags.day13V3Completed===true&&state.storyFlags.day13V3SceneCheckpoint===24&&state.storyFlags.day13V3PreservedSeojinAffection===7&&state.storyFlags.day13V3PreservedSeojinStatusInterest===13;
}
