import {DAY7_V3_CHOICES,DAY7_V3_VERSION} from "./day7-v3-campaign-data.mjs";
import {DAY7_V3_PLAYABLE_SCRIPT_01_07,DAY7_V3_PLAYABLE_SCRIPT_08_14} from "./day7-v3-playable-script.mjs";
import {DAY7_V3_PLAYABLE_SCRIPT_15_24} from "./day7-v3-late-playable-script.mjs";

const BANDS=new Set(["LOW","MID","HIGH","VERY_HIGH"]);
const CHECKPOINTS=Object.freeze([3,4,5,7,11,14,16,19,20,21,24]);
const SAVE_KEY_BY_CHOICE=Object.freeze({
  1:"day7V3PhotoState",2:"day7V3DateRoute",3:"day7V3MorningTime",4:"day7V3PhotoDisclosure",
  5:"day7V3AttentionPace",6:"day7V3ConversationLead",7:"day7V3DinnerScale",8:"day7V3CardResponse",
  9:"day7V3SeojinDistance",10:"day7V3ConversationExplanation",11:"day7V3CurrentContact"
});
const choiceByOption=new Map(DAY7_V3_CHOICES.flatMap(choice=>choice.options.map(option=>[option.id,choice])));
const playableByNumber=new Map([...DAY7_V3_PLAYABLE_SCRIPT_01_07,...DAY7_V3_PLAYABLE_SCRIPT_08_14,...DAY7_V3_PLAYABLE_SCRIPT_15_24].map(item=>[item.number,item]));

const flagsOf=state=>state?.storyFlags??{};
const hasLegacyDay7=flags=>flags.day7RuntimeComplete===true||flags.day7FirstPresentDateCompleted===true||flags.day7RuntimeStage!=null||flags.day7OpeningStrategy!=null||flags.day7RecoveryStrategy!=null||flags.day7MemoryStrategy!=null;

export function getDay7V3Compatibility(state){
  const flags=flagsOf(state);
  if(flags.day7V3Version===DAY7_V3_VERSION)return {mode:"V3",complete:flags.day7V3Complete===true,checkpoint:flags.day7V3SceneCheckpoint??1};
  if(hasLegacyDay7(flags))return {mode:"V1_LEGACY",complete:flags.day7RuntimeComplete===true||flags.day7FirstPresentDateCompleted===true,checkpoint:flags.day7RuntimeStage??null};
  return {mode:"V3_NEW",complete:false,checkpoint:1};
}

export function beginDay7V3(state,{relationshipBand="LOW",touchBoundary=false}={}){
  state.storyFlags??={};
  const compatibility=getDay7V3Compatibility(state);
  if(compatibility.mode==="V1_LEGACY")return compatibility;
  if(!BANDS.has(relationshipBand))throw new Error("DAY7_V3_RELATIONSHIP_BAND_REQUIRED");
  state.storyFlags.day7V3Version=DAY7_V3_VERSION;
  state.storyFlags.day7V3RelationshipBand=relationshipBand;
  state.storyFlags.day7V3TouchBoundary=touchBoundary===true;
  state.storyFlags.day7V3SceneCheckpoint??=1;
  state.storyFlags.day7V3ChoiceIndex??=0;
  state.storyFlags.day7V3SelectedChoiceIds??=[];
  return getDay7V3Compatibility(state);
}

export function getNextDay7V3Choice(state){
  return DAY7_V3_CHOICES[flagsOf(state).day7V3ChoiceIndex??0]??null;
}

const addBranch=(output,scene,key)=>{const found=scene.branches.find(branch=>branch.key===key);if(found)output.push(...found.steps);return Boolean(found);};
const selected=(flags,id)=>flags.day7V3SelectedChoiceIds?.includes(id)===true;
const selectedFrom=(flags,ids)=>ids.find(id=>selected(flags,id));

export function getDay7V3PlayableScene(state,sceneNumber){
  const flags=flagsOf(state);
  if(flags.day7V3Version!==DAY7_V3_VERSION)throw new Error("DAY7_V3_NOT_STARTED");
  const scene=playableByNumber.get(sceneNumber);if(!scene)throw new Error("DAY7_V3_UNKNOWN_SCENE");
  const route=selectedFrom(flags,["route-night-view","route-theme-park","route-book-dinner"]);
  const routeScene={"route-night-view":8,"route-theme-park":9,"route-book-dinner":10}[route];
  if(sceneNumber>=8&&sceneNumber<=10&&sceneNumber!==routeScene)return Object.freeze({sceneId:scene.id,sceneNumber,skipped:true,steps:Object.freeze([])});
  const output=[...scene.steps],band=flags.day7V3RelationshipBand??"LOW";
  const direct={2:["photo-send-now","photo-send-evening","photo-decline"],3:["route-night-view","route-theme-park","route-book-dinner"],4:["morning-rest","morning-song","morning-call-jihoon"],6:["disclose-photo","disclose-company-boundary","disclose-dismiss"],8:["pace-haeun-first","pace-separate-return","pace-alternate"],9:["pace-haeun-first","pace-separate-return","pace-alternate"],10:["pace-haeun-first","pace-separate-return","pace-alternate"],17:["card-tease-smile","card-mutual-next","card-admit-fear"]};
  if(direct[sceneNumber])addBranch(output,scene,selectedFrom(flags,direct[sceneNumber]));
  if(sceneNumber===5){const key=band==="LOW"?"relationship-LOW":band==="MID"?"relationship-MID":band==="HIGH"?"relationship-HIGH":flags.day6V3HandContactEstablished?"relationship-VERY_HIGH-CONTACT":"relationship-VERY_HIGH-NO_CONTACT";addBranch(output,scene,key);}
  if(sceneNumber===7)addBranch(output,scene,route);
  if(sceneNumber===11){addBranch(output,scene,selectedFrom(flags,["morning-rest","morning-song","morning-call-jihoon"]));addBranch(output,scene,"common");}
  if(sceneNumber===12)addBranch(output,scene,`photo-${flags.day7V3PhotoState}`);
  if(sceneNumber===13){if(selected(flags,"talk-my-confusion"))addBranch(output,scene,`talk-my-confusion-${flags.day7V3PhotoReceived?"photo-seen":"no-photo"}`);else addBranch(output,scene,selectedFrom(flags,["listen-to-haeun","admit-earlier-evasion"]));}
  if(sceneNumber===15){addBranch(output,scene,route);addBranch(output,scene,selectedFrom(flags,["dinner-full","dinner-light","dinner-independent"]));}
  if(sceneNumber===16)addBranch(output,scene,["LOW","MID"].includes(band)?"relationship-LOW_MID":"relationship-HIGH_PLUS");
  if(sceneNumber===18)addBranch(output,scene,selected(flags,"morning-song")?"morning-song":"morning-not-song");
  if(sceneNumber===19){addBranch(output,scene,`photo-${flags.day7V3PhotoState}`);addBranch(output,scene,selectedFrom(flags,["seojin-work-next","seojin-personal-interest","seojin-close-today"]));}
  if(sceneNumber===20){if(selected(flags,"explain-honestly"))addBranch(output,scene,selected(flags,"seojin-personal-interest")?"explain-honestly-personal":"explain-honestly-other");else if(selected(flags,"keep-private-now"))addBranch(output,scene,"keep-private-now");else addBranch(output,scene,selected(flags,"seojin-personal-interest")?"claim-work-only-lie":"claim-work-only-true");}
  if(sceneNumber===21){if(selected(flags,"contact-offer-hand"))addBranch(output,scene,flags.day7V3HandContactEstablished?`hand-${flags.day7V3HandOutcome}`:"hand-NO_CONTACT");else addBranch(output,scene,selectedFrom(flags,["contact-walk-beside","contact-talk-more"]));}
  if(sceneNumber===22){const cautious=band==="LOW"||flags.day7V3TrustLow||flags.day7V3LieRecorded;addBranch(output,scene,cautious?"goodbye-cautious":flags.day7V3HandContactEstablished&&band==="VERY_HIGH"?"goodbye-release-hand":band==="MID"?"goodbye-smile":"goodbye-lingering");}
  if(sceneNumber===23){addBranch(output,scene,route);const ending=flags.day7V3LieRecorded?"ending-lie":selected(flags,"keep-private-now")||selected(flags,"disclose-dismiss")?"ending-deferred":band==="LOW"?"ending-comfortable":"ending-warm";addBranch(output,scene,ending);addBranch(output,scene,"common");}
  if(sceneNumber===24){addBranch(output,scene,selected(flags,"morning-call-jihoon")?"jihoon-called":"jihoon-not-called");addBranch(output,scene,"common");}
  return Object.freeze({sceneId:scene.id,sceneNumber,skipped:false,checkpoint:flags.day7V3SceneCheckpoint??1,steps:Object.freeze(output)});
}

export function getAvailableDay7V3ChoiceOptions(state,choiceNumber=getNextDay7V3Choice(state)?.number){
  const choice=DAY7_V3_CHOICES[choiceNumber-1];
  if(!choice)return [];
  const selected=new Set(flagsOf(state).day7V3SelectedChoiceIds??[]);
  return choice.options.filter(option=>!option.effects.requires?.choiceId||selected.has(option.effects.requires.choiceId));
}

export function resolveDay7V3HandContact({choiceId,relationshipBand,touchBoundary=false,trustLow=false,lieRecorded=false,day6HandEstablished=false}){
  if(choiceId==="contact-walk-beside")return {established:false,outcome:"WALK_BESIDE"};
  if(choiceId==="contact-talk-more")return {established:false,outcome:"TALKED_MORE"};
  if(choiceId!=="contact-offer-hand")throw new Error("DAY7_V3_UNKNOWN_CONTACT_CHOICE");
  if(touchBoundary)return {established:false,outcome:"BOUNDARY_RESPECTED"};
  if(relationshipBand==="LOW"||trustLow||lieRecorded)return {established:false,outcome:"OFFERED_WITHOUT_CONTACT"};
  return {established:true,outcome:day6HandEstablished?"REESTABLISHED":"FIRST_ACCEPTED"};
}

export function applyDay7V3Choice(state,optionId){
  state.storyFlags??={};
  const flags=state.storyFlags;
  if(flags.day7V3Version!==DAY7_V3_VERSION)throw new Error("DAY7_V3_NOT_STARTED");
  const choice=choiceByOption.get(optionId);
  if(!choice)throw new Error("DAY7_V3_UNKNOWN_CHOICE");
  const expected=getNextDay7V3Choice(state);
  if(!expected||expected.number!==choice.number)throw new Error("DAY7_V3_OUT_OF_ORDER_CHOICE");
  if(!getAvailableDay7V3ChoiceOptions(state,choice.number).some(option=>option.id===optionId))throw new Error("DAY7_V3_UNAVAILABLE_CONDITIONAL_CHOICE");
  const option=choice.options.find(item=>item.id===optionId);
  flags[SAVE_KEY_BY_CHOICE[choice.number]]=Object.values(option.effects).find(value=>typeof value==="string"&&!Object.values(option.effects.requires??{}).includes(value))??optionId;
  flags.day7V3SelectedChoiceIds=[...(flags.day7V3SelectedChoiceIds??[]),optionId];
  flags.day7V3ChoiceIndex=choice.number;
  flags.day7V3SceneCheckpoint=CHECKPOINTS[choice.number-1];
  if(choice.number===1)flags.day7V3PhotoReceived=optionId==="photo-send-now";
  if(choice.number===4)flags.day7V3PhotoDisclosure=option.effects.disclosure;
  if(choice.number===9){
    flags.day7V3SeojinDistance=option.effects.distance;
    if(optionId==="seojin-personal-interest")flags.day7V3SeojinAffectionDelta=(flags.day7V3SeojinAffectionDelta??0)+1;
  }
  if(choice.number===10){
    flags.day7V3LieRecorded=optionId==="claim-work-only"&&flags.day7V3SeojinDistance==="PERSONAL_INTEREST";
  }
  if(choice.number===11){
    const result=resolveDay7V3HandContact({choiceId:optionId,relationshipBand:flags.day7V3RelationshipBand,touchBoundary:flags.day7V3TouchBoundary,trustLow:flags.day7V3TrustLow===true,lieRecorded:flags.day7V3LieRecorded===true,day6HandEstablished:flags.day6V3HandContactEstablished===true});
    flags.day7V3HandContactEstablished=result.established;
    flags.day7V3HandOutcome=result.outcome;
    if(flags.day7V3PhotoState==="DEFERRED")flags.day7V3PhotoReceived=true;
    flags.day7V3Complete=true;
    flags.day7FirstPresentDatePending=false;
    flags.day7FirstPresentDateCompleted=true;
    flags.day8JihoonInvitationPending=true;
  }
  return {choiceNumber:choice.number,nextChoice:getNextDay7V3Choice(state),checkpoint:flags.day7V3SceneCheckpoint,complete:flags.day7V3Complete===true};
}

export function validateDay7V3Runtime(){
  const state={storyFlags:{}};
  beginDay7V3(state,{relationshipBand:"HIGH"});
  for(const choice of DAY7_V3_CHOICES)applyDay7V3Choice(state,choice.options[0].id);
  return state.storyFlags.day7V3Complete===true&&state.storyFlags.day7V3ChoiceIndex===11&&state.storyFlags.day8JihoonInvitationPending===true;
}
