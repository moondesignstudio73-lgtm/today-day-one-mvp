import {DAY12_V3_CHOICES,DAY12_V3_SCENARIO_ID,DAY12_V3_VERSION} from "./day12-v3-campaign-data.mjs";
import {getDay12V3PlayableScene01To12} from "./day12-v3-playable-script-01-12.mjs";
import {getDay12V3PlayableScene13To24} from "./day12-v3-playable-script-13-24.mjs";

const BANDS=new Set(["LOW","MID","HIGH","VERY_HIGH"]);
const NEXT_CHECKPOINTS=Object.freeze({1:2,2:5,3:7,4:9,5:11,6:13,7:16,8:17,9:18,10:19,11:21,12:22,13:22,14:24});
const choiceByOption=new Map(DAY12_V3_CHOICES.flatMap(choice=>choice.options.map(option=>[option.id,{choice,option}])));
const flagsOf=state=>state?.storyFlags??{};
const hasLegacy=flags=>flags.day12RuntimeStage!=null||flags.day12CurrentAccountReviewPending===true||flags.day12CurrentAccountReviewCompleted===true||flags.day12VerifyStrategy!=null||flags.day12ExpenseStrategy!=null||flags.day12AccessStrategy!=null;

function addCollection(state,key,...ids){if(!state.scenario?.enabled||!Array.isArray(state.scenario[key]))return;state.scenario[key]=[...new Set([...state.scenario[key],...ids])];}
function changeScenarioStat(state,key,amount){if(!state.scenario||!Number.isFinite(amount))return;state.scenario[key]=Number.isFinite(state.scenario[key])?state.scenario[key]+amount:amount;}
function normalize(flags){flags.day12V3RuntimeStage??=0;flags.day12V3SceneCheckpoint??=1;flags.day12V3SelectedChoiceIds??=[];flags.day12V3ChoiceIndex??=0;flags.day12V3Completed??=false;flags.day12V3ObservedCompletionGap??=false;flags.day12V3MinhoOwnedCorrection??=false;flags.day12V3ContributionRecorded??=false;flags.day12V3PersonalConversation??=false;flags.day12V3PersonalInvitation??=false;flags.day12V3DisclosureMismatch??="NONE";flags.day12V3HaeunNeedsSpace??=false;flags.day12V3WorkVisitTime??="10:00";flags.day12V3WorkVisitMaxHours??=3;flags.day12V3WorkIncludesLunch??=true;}

export function getDay12V3Compatibility(state){const flags=flagsOf(state);if(flags.day12ScenarioVersion===DAY12_V3_VERSION)return Object.freeze({mode:"V3",complete:flags.day12V3Completed===true,checkpoint:flags.day12V3SceneCheckpoint??1});if(hasLegacy(flags))return Object.freeze({mode:"V1_LEGACY",complete:flags.day12CurrentAccountReviewCompleted===true,checkpoint:flags.day12RuntimeStage??0});return Object.freeze({mode:"V3_NEW",complete:false,checkpoint:1});}

export function beginDay12V3(state,{relationshipBand="LOW",priorSeojinPhoto=null,priorSeojinPersonalInterest=null,unresolvedConflict=null}={}){
  state.storyFlags??={};const compatibility=getDay12V3Compatibility(state);if(compatibility.mode==="V1_LEGACY")return compatibility;if(!BANDS.has(relationshipBand))throw new Error("DAY12_V3_RELATIONSHIP_BAND_REQUIRED");const flags=state.storyFlags;if(compatibility.mode==="V3"){normalize(flags);return getDay12V3Compatibility(state);}
  flags.day12ScenarioVersion=DAY12_V3_VERSION;flags.day12V3ScenarioId=DAY12_V3_SCENARIO_ID;flags.day12V3RelationshipBand=relationshipBand==="VERY_HIGH"?"HIGH":relationshipBand;
  flags.day12V3PriorSeojinPhoto=priorSeojinPhoto==null?(flags.day7V3SeojinPhotoReceived===true||flags.day7SeojinPhotoReceived===true):priorSeojinPhoto===true;
  flags.day12V3PriorSeojinPersonalInterest=priorSeojinPersonalInterest==null?(flags.day7V3SeojinPersonalInterest===true||flags.day7SeojinPersonalInterest===true):priorSeojinPersonalInterest===true;
  flags.day12V3UnresolvedConflict=unresolvedConflict==null?Boolean(flags.day11V3UnresolvedConflict||flags.day10V3Conflict):unresolvedConflict===true;
  normalize(flags);return getDay12V3Compatibility(state);
}

const needsIntentFollowUp=flags=>flags.day12V3Choice9==="day12_invite_outside_work"&&flags.day12V3Choice12==="day12_disclose_remaining_conversation";
function availableChoices(flags){return DAY12_V3_CHOICES.filter(choice=>choice.number!==13||needsIntentFollowUp(flags));}
export function getNextDay12V3Choice(state){const flags=flagsOf(state);if(flags.day12V3Completed===true)return null;const selected=new Set(flags.day12V3SelectedChoiceIds??[]);return availableChoices(flags).find(choice=>choice.options.every(option=>!selected.has(option.id)))??null;}

function updateDerived(state,choice,option){const flags=state.storyFlags,effects=option.effects;
  if(Number.isFinite(effects.seojinAffectionDelta))changeScenarioStat(state,"seojinAffection",effects.seojinAffectionDelta);
  if(Number.isFinite(effects.seojinStatusInterestDelta))changeScenarioStat(state,"seojinStatusInterest",effects.seojinStatusInterestDelta);
  if(choice.number===1)flags.day12V3DepartureDisclosure=effects.departureDisclosure;
  if(choice.number===2)flags.day12V3WorkEntry=effects.workEntry;
  if(choice.number===3){flags.day12V3AnswerCorrection=effects.answerCorrection;flags.day12V3ObservedCompletionGap=true;addCollection(state,"clues","day12-training-screen-completion-gap");}
  if(choice.number===4){flags.day12V3MinhoResponse=effects.minhoResponse;flags.day12V3MinhoOwnedCorrection=true;}
  if(choice.number===5)flags.day12V3WorkStop=effects.workStop;
  if(choice.number===6)flags.day12V3LunchStrategy=effects.lunchStrategy;
  if(choice.number===7)flags.day12V3WorkFeeling=effects.workFeeling;
  if(choice.number===8){flags.day12V3PersonalConversation=effects.personalConversation==="ASK_SEOJIN";flags.day12V3PersonalConversationStrategy=effects.personalConversation;}
  if(choice.number===9){flags.day12V3SeojinDistance=effects.seojinDistance;flags.day12V3PersonalInvitation=effects.seojinDistance==="PERSONAL_INVITATION";flags.day12V3SeojinReply=flags.day12V3PersonalInvitation?(flags.day12V3PersonalConversation&&flags.day12V3PriorSeojinPersonalInterest?"ACCEPTED_IN_PRINCIPLE":"DEFERRED"):"NONE";}
  if(choice.number===10){flags.day12V3CreditStrategy=effects.creditStrategy;flags.day12V3ContributionRecorded=true;addCollection(state,"unlockedActions","day12-current-observation-contribution");}
  if(choice.number===11)flags.day12V3HaeunFirstDisclosure=effects.haeunFirstDisclosure;
  if(choice.number===12){flags.day12V3HaeunFinalDisclosure=effects.haeunFinalDisclosure;const invited=flags.day12V3PersonalInvitation===true;if(invited&&effects.haeunFinalDisclosure==="CLAIM_ONLY_WORK")flags.day12V3DisclosureMismatch=flags.day12V3HaeunFirstDisclosure==="SEOJIN_CONVERSATION"?"EXPLICIT_CONTRADICTION":"CONCEALED_MISMATCH";else flags.day12V3DisclosureMismatch="NONE";}
  if(choice.number===13){flags.day12V3SeojinIntent=effects.seojinIntent;flags.day12V3HaeunNeedsSpace=effects.seojinIntent==="SPARK";flags.day12V3PausePersonalPlan=effects.pausePersonalPlan===true;}
  if(choice.number===14){flags.day12V3Day13Plan=effects.day13Plan;flags.day12V3Completed=true;flags.day12V3RuntimeStage=14;flags.day12V3SceneCheckpoint=24;flags.day12CompanyAdaptationVisitPending=false;flags.day13OutsideViewPlanPending=true;addCollection(state,"followUpHooks","day13-outside-view-plan");}
}

export function applyDay12V3Choice(state,optionId){state.storyFlags??={};const flags=state.storyFlags;if(flags.day12ScenarioVersion!==DAY12_V3_VERSION)throw new Error("DAY12_V3_NOT_STARTED");const found=choiceByOption.get(optionId);if(!found)throw new Error("DAY12_V3_UNKNOWN_CHOICE");const expected=getNextDay12V3Choice(state);if(!expected||expected.number!==found.choice.number)throw new Error("DAY12_V3_OUT_OF_ORDER_CHOICE");flags[`day12V3Choice${found.choice.number}`]=optionId;flags.day12V3SelectedChoiceIds=[...flags.day12V3SelectedChoiceIds,optionId];flags.day12V3ChoiceIndex=found.choice.number;flags.day12V3RuntimeStage=found.choice.number;flags.day12V3SceneCheckpoint=NEXT_CHECKPOINTS[found.choice.number];updateDerived(state,found.choice,found.option);if(found.choice.number===12&&needsIntentFollowUp(flags))flags.day12V3SceneCheckpoint=21;return Object.freeze({choiceNumber:found.choice.number,nextChoiceNumber:getNextDay12V3Choice(state)?.number??null,checkpoint:flags.day12V3SceneCheckpoint,complete:flags.day12V3Completed===true});}

export function getDay12V3PlayableScene(state,sceneNumber){if(flagsOf(state).day12ScenarioVersion!==DAY12_V3_VERSION)throw new Error("DAY12_V3_NOT_STARTED");if(sceneNumber<1||sceneNumber>24)throw new Error(`UNKNOWN_DAY12_V3_SCENE_${sceneNumber}`);return sceneNumber<=12?getDay12V3PlayableScene01To12(state,sceneNumber):getDay12V3PlayableScene13To24(state,sceneNumber);}

export function getDay12V3RestoreContract(state){const flags=flagsOf(state);if(flags.day12ScenarioVersion!==DAY12_V3_VERSION)return getDay12V3Compatibility(state);return Object.freeze({mode:"V3",complete:flags.day12V3Completed===true,checkpoint:flags.day12V3SceneCheckpoint??1,nextChoiceNumber:getNextDay12V3Choice(state)?.number??null,selectedChoiceIds:Object.freeze([...(flags.day12V3SelectedChoiceIds??[])]),workVisit:Object.freeze({time:flags.day12V3WorkVisitTime,maxHours:flags.day12V3WorkVisitMaxHours,includesLunch:flags.day12V3WorkIncludesLunch}),observedCompletionGap:flags.day12V3ObservedCompletionGap===true,minhoOwnedCorrection:flags.day12V3MinhoOwnedCorrection===true,contributionRecorded:flags.day12V3ContributionRecorded===true,personalConversation:flags.day12V3PersonalConversation===true,personalInvitation:flags.day12V3PersonalInvitation===true,seojinReply:flags.day12V3SeojinReply??"NONE",haeunFirstDisclosure:flags.day12V3HaeunFirstDisclosure??null,haeunFinalDisclosure:flags.day12V3HaeunFinalDisclosure??null,disclosureMismatch:flags.day12V3DisclosureMismatch??"NONE",seojinIntent:flags.day12V3SeojinIntent??null,haeunNeedsSpace:flags.day12V3HaeunNeedsSpace===true,day13Plan:flags.day12V3Day13Plan??null});}

export function validateDay12V3Runtime(){const state={storyFlags:{},scenario:{enabled:true,seojinAffection:0,seojinStatusInterest:0,clues:[],unlockedActions:[],followUpHooks:[]}};beginDay12V3(state,{relationshipBand:"MID",priorSeojinPhoto:true,priorSeojinPersonalInterest:true});while(getNextDay12V3Choice(state)){const choice=getNextDay12V3Choice(state);applyDay12V3Choice(state,choice.options[0].id);}return state.storyFlags.day12V3Completed===true&&state.storyFlags.day12V3ChoiceIndex===14&&state.storyFlags.day12V3SceneCheckpoint===24&&state.storyFlags.day12V3ContributionRecorded===true;}
