import {DAY6_V3_CHOICES,DAY6_V3_VERSION} from "./day6-v3-campaign-data.mjs";
import {DAY6_V3_PLAYABLE_SCRIPT_01_07,DAY6_V3_PLAYABLE_SCRIPT_08_14} from "./day6-v3-playable-script.mjs";
import {DAY6_V3_PLAYABLE_SCRIPT_15_23} from "./day6-v3-late-playable-script.mjs";

const BANDS=new Set(["LOW","MID","HIGH","VERY_HIGH"]);
const choiceByOption=new Map(DAY6_V3_CHOICES.flatMap(choice=>choice.options.map(option=>[option.id,choice])));
const choiceByKey=new Map(DAY6_V3_CHOICES.map(choice=>[choice.key,choice]));
const playableSceneByNumber=new Map([...DAY6_V3_PLAYABLE_SCRIPT_01_07,...DAY6_V3_PLAYABLE_SCRIPT_08_14,...DAY6_V3_PLAYABLE_SCRIPT_15_23].map(scene=>[scene.number,scene]));

const savedChoice=(flags,key)=>{
  const choice=choiceByKey.get(key);
  return choice?flags[choice.saveKey]:null;
};
const appendBranch=(output,scene,key)=>{
  const found=scene.branches.find(branch=>(branch.key??branch.choiceId)===key);
  if(!found)return false;
  output.push(...found.steps,...(found.after??[]));
  return true;
};

export function getDay6V3PlayableScene(state,sceneNumber){
  const flags=state?.storyFlags??{};
  if(flags.day6V3Version!==DAY6_V3_VERSION)throw new Error("DAY6_V3_NOT_STARTED");
  const scene=playableSceneByNumber.get(sceneNumber);
  if(!scene)throw new Error("DAY6_V3_UNKNOWN_SCENE");
  const output=[...scene.steps];
  const band=flags.day6V3RelationshipBand??"LOW";
  const handChoice=savedChoice(flags,"hand");
  const contact=flags.day6V3HandContactEstablished===true;
  const choiceKeyByScene=new Map([[1,"invitation"],[2,"outfit"],[3,"outfit"],[4,"drink"],[7,"cafe-photo"],[10,"repair"],[12,"lunch"],[15,"music"],[16,"current-photo"],[18,"card"],[19,"lunch"],[21,"drink"],[22,"day-name"]]);
  const choiceKey=choiceKeyByScene.get(sceneNumber);
  if(choiceKey){
    const optionId=savedChoice(flags,choiceKey);
    if(optionId)appendBranch(output,scene,optionId);
  }
  if(sceneNumber===9){
    const drink=savedChoice(flags,"drink");
    if(drink)appendBranch(output,scene,drink);
    appendBranch(output,scene,`relationship-${band}`);
  }
  if(sceneNumber===15)appendBranch(output,scene,`relationship-${band}`);
  if(sceneNumber===19)appendBranch(output,scene,"common");
  if(sceneNumber===20){
    appendBranch(output,scene,band==="LOW"?"relationship-LOW":"relationship-MID_PLUS");
    if(handChoice==="hand-keep-walking")appendBranch(output,scene,"hand-keep-walking");
    else if(handChoice){
      appendBranch(output,scene,`${handChoice}-${contact?"CONTACT":"NO_CONTACT"}`);
      if(contact)appendBranch(output,scene,band==="VERY_HIGH"?"contact-VERY_HIGH":"contact-MID_HIGH");
    }
  }
  if(sceneNumber===21)appendBranch(output,scene,"common");
  if(sceneNumber===22){
    const goodbyeKey=band==="LOW"?"goodbye-LOW":band==="MID"?"goodbye-MID":band==="VERY_HIGH"&&contact?"goodbye-VERY_HIGH-CONTACT":contact?"goodbye-HIGH-CONTACT":"goodbye-HIGH-NO_CONTACT";
    appendBranch(output,scene,goodbyeKey);
  }
  if(sceneNumber===23){
    const messageKey=band==="LOW"?"message-LOW":band==="MID"?"message-MID":band==="HIGH"?"message-HIGH":contact?"message-VERY_HIGH-CONTACT":"message-VERY_HIGH-NO_CONTACT";
    appendBranch(output,scene,messageKey);
    appendBranch(output,scene,"ending");
  }
  return Object.freeze({sceneId:scene.id,sceneNumber,checkpoint:flags.day6V3SceneCheckpoint??1,steps:Object.freeze(output)});
}

export function getDay6V3Compatibility(state){
  const flags=state?.storyFlags??{};
  if(flags.day6V3Version===DAY6_V3_VERSION)return {mode:"V3",complete:flags.day6V3Complete===true,checkpoint:flags.day6V3SceneCheckpoint??1};
  if(flags.day6RuntimeComplete===true)return {mode:"V1_LEGACY",complete:true,checkpoint:null};
  return {mode:"V3_NEW",complete:false,checkpoint:1};
}

export function beginDay6V3(state,{relationshipBand="LOW",touchBoundary=false}={}){
  state.storyFlags??={};
  if(state.storyFlags.day6RuntimeComplete===true&&state.storyFlags.day6V3Version!==DAY6_V3_VERSION)return getDay6V3Compatibility(state);
  if(!BANDS.has(relationshipBand))throw new Error("DAY6_V3_RELATIONSHIP_BAND_REQUIRED");
  state.storyFlags.day6V3Version=DAY6_V3_VERSION;
  state.storyFlags.day6V3RelationshipBand=relationshipBand;
  state.storyFlags.day6V3TouchBoundary=touchBoundary===true;
  state.storyFlags.day6V3SceneCheckpoint??=1;
  state.storyFlags.day6V3ChoiceIndex??=0;
  return getDay6V3Compatibility(state);
}

export function getNextDay6V3Choice(state){
  const index=state?.storyFlags?.day6V3ChoiceIndex??0;
  return DAY6_V3_CHOICES[index]??null;
}

export function resolveDay6V3HandContact({choiceId,relationshipBand,touchBoundary=false}){
  if(choiceId==="hand-keep-walking")return {established:false,outcome:"WALK_TOGETHER"};
  if(touchBoundary||relationshipBand==="LOW")return {established:false,outcome:choiceId==="hand-ask"?"ASKED_AND_WAITED":"OFFERED_WITHOUT_CONTACT"};
  return {established:true,outcome:choiceId==="hand-ask"?"ASKED_AND_ACCEPTED":"OFFERED_AND_MET"};
}

export function applyDay6V3Choice(state,optionId){
  state.storyFlags??={};
  if(state.storyFlags.day6V3Version!==DAY6_V3_VERSION)throw new Error("DAY6_V3_NOT_STARTED");
  const choice=choiceByOption.get(optionId);
  if(!choice)throw new Error("DAY6_V3_UNKNOWN_CHOICE");
  const expected=getNextDay6V3Choice(state);
  if(!expected||expected.number!==choice.number)throw new Error("DAY6_V3_OUT_OF_ORDER_CHOICE");
  state.storyFlags[choice.saveKey]=optionId;
  state.storyFlags.day6V3ChoiceIndex=choice.number;
  state.storyFlags.day6V3SceneCheckpoint=[1,2,3,5,8,11,13,16,17,19,21,23][choice.number];
  if(choice.key==="cafe-photo")state.storyFlags.day6V3CafePhotoTaken=optionId==="photo-compare-past";
  if(choice.key==="current-photo")state.storyFlags.day6V3CurrentPhotoVariant=optionId;
  if(choice.key==="hand"){
    const result=resolveDay6V3HandContact({choiceId:optionId,relationshipBand:state.storyFlags.day6V3RelationshipBand,touchBoundary:state.storyFlags.day6V3TouchBoundary});
    state.storyFlags.day6V3HandContactEstablished=result.established;
    state.storyFlags.day6V3HandOutcome=result.outcome;
  }
  if(choice.key==="day-name"){
    state.storyFlags.day6V3Complete=true;
    state.storyFlags.day6RuntimeComplete=true;
    state.storyFlags.day6FirstPresentDatePlanned=true;
    state.storyFlags.day7FirstPresentDatePending=true;
    state.storyFlags.day6CurrentLifeRadiusSaved=true;
    state.storyFlags.day6CurrentTasteSaved=true;
  }
  return {choiceNumber:choice.number,nextChoice:getNextDay6V3Choice(state),checkpoint:state.storyFlags.day6V3SceneCheckpoint,complete:state.storyFlags.day6V3Complete===true};
}

export function validateDay6V3Runtime(){
  const state={storyFlags:{}};
  beginDay6V3(state,{relationshipBand:"HIGH"});
  for(const choice of DAY6_V3_CHOICES)applyDay6V3Choice(state,choice.options[0].id);
  return state.storyFlags.day6V3Complete===true&&state.storyFlags.day6V3ChoiceIndex===11&&state.storyFlags.day6V3HandContactEstablished===true;
}
