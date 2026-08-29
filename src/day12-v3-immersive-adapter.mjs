import {DAY12_V3_CHOICES} from "./day12-v3-campaign-data.mjs";
import {DAY12_V3_PLAYABLE_SCRIPT_01_12,getDay12V3PlayableScene01To12} from "./day12-v3-playable-script-01-12.mjs";
import {DAY12_V3_PLAYABLE_SCRIPT_13_24,getDay12V3PlayableScene13To24} from "./day12-v3-playable-script-13-24.mjs";
import {getNextDay12V3Choice} from "./day12-v3-runtime.mjs";
import {getDay12V3Presentation} from "./day12-v3-presentation-data.mjs";

const playable=(state,number)=>number<=12?getDay12V3PlayableScene01To12(state,number):getDay12V3PlayableScene13To24(state,number);
const rawScene=number=>number<=12?DAY12_V3_PLAYABLE_SCRIPT_01_12[number-1]:DAY12_V3_PLAYABLE_SCRIPT_13_24[number-13];
const convertStep=step=>Object.freeze(step.type==="dialogue"?{type:"dialogue",speaker:step.speaker,text:step.text}:step.type==="message"?{type:"message",sender:step.sender,text:step.text,device:"phone"}:step.type==="stageDirection"?{type:"stageDirection",text:step.text}:step.type==="note"?{type:"message",sender:"메모",text:step.text,device:"note"}:step.type==="choiceCue"?{type:"choiceCue",choiceId:step.choiceId,choiceNumber:step.choiceNumber}:{type:"narration",text:step.text,sourceType:step.type});

function backgroundIdFor(number){
  if(number===1||number>=21)return "day12-home-bedroom";
  if(number===2||number===19)return "office-elevator";
  if((number>=3&&number<=10)||number===18)return "office-meeting";
  if(number===11)return "office-pantry";
  if(number>=12&&number<=17)return "day12-building-lunch";
  return "office-lobby";
}

export function getDay12V3ResumePresentation(state){
  const sceneNumber=state?.storyFlags?.day12V3SceneCheckpoint??1,presentation=getDay12V3Presentation(sceneNumber);
  return Object.freeze({...presentation,backgroundId:backgroundIdFor(sceneNumber),expressionId:sceneNumber>=20?"calm":"neutral",poseId:sceneNumber>=20?"phone":"standing"});
}

export function getDay12V3ImmersiveScene(state,sceneNumber){
  if(!Number.isInteger(sceneNumber)||sceneNumber<1||sceneNumber>24)throw new Error("DAY12_V3_INVALID_SCENE");
  const script=playable(state,sceneNumber),presentation=getDay12V3Presentation(sceneNumber),backgroundId=backgroundIdFor(sceneNumber);
  const steps=[Object.freeze({type:"transition",sceneId:script.id,sceneNumber,label:`SCENE ${String(sceneNumber).padStart(2,"0")}`,style:presentation.transition,backgroundId,backgroundUrl:presentation.backgroundUrl,characterId:presentation.characterId,characterAssetUrl:presentation.characterAssetUrl,bgmId:presentation.bgm.category,bgm:presentation.bgm,safeArea:presentation.safeArea}),...presentation.sfx.map(sfxId=>Object.freeze({type:"sfx",sfxId}))];
  if(presentation.eventCgUrl){steps.push(Object.freeze({type:"cgShow",source:presentation.eventCgUrl,duration:2400,fit:"contain",objectPosition:presentation.safeArea.objectPosition,safeArea:presentation.safeArea}));if(presentation.characterId)steps.push(Object.freeze({type:"characterEnter",characterId:presentation.characterId,assetUrl:presentation.characterAssetUrl,stage:Object.freeze({positionPreset:"right"})}));else steps.push(Object.freeze({type:"ambientHold",backgroundUrl:presentation.backgroundUrl,duration:80}));}
  else if(presentation.characterId)steps.push(Object.freeze({type:"characterEnter",characterId:presentation.characterId,assetUrl:presentation.characterAssetUrl,stage:Object.freeze({positionPreset:"right"})}));
  else steps.push(Object.freeze({type:"ambientHold",backgroundUrl:presentation.backgroundUrl,duration:650}));
  steps.push(...script.steps.map(convertStep));
  const next=getNextDay12V3Choice(state),unresolved=next?.sceneNumber===sceneNumber;
  if(unresolved)steps.push(Object.freeze({type:"choice",choiceNumber:next.number,choiceKey:`day12V3Choice${next.number}`,prompt:next.title,options:next.options}));
  return Object.freeze({...script,backgroundId,presentation,hasUnresolvedChoice:Boolean(unresolved),steps:Object.freeze(steps)});
}

export function getDay12V3ImmersiveSegment(state,{startScene=state?.storyFlags?.day12V3SceneCheckpoint??1,endScene=24}={}){
  if(!Number.isInteger(startScene)||startScene<1||startScene>24)throw new Error("DAY12_V3_INVALID_START_SCENE");
  if(!Number.isInteger(endScene)||endScene<startScene||endScene>24)throw new Error("DAY12_V3_INVALID_END_SCENE");
  const scenes=[];
  for(let number=startScene;number<=endScene;number+=1){const scene=getDay12V3ImmersiveScene(state,number);scenes.push(scene);if(scene.hasUnresolvedChoice)break;}
  const awaitingChoice=scenes.at(-1)?.hasUnresolvedChoice===true,steps=scenes.flatMap(scene=>scene.steps);
  if(!awaitingChoice&&scenes.at(-1)?.number===24)steps.push(Object.freeze({type:"sceneEnd",day:12,complete:state?.storyFlags?.day12V3Completed===true,nextHook:"day13-outside-view-plan"}));
  return Object.freeze({startScene,stopScene:scenes.at(-1)?.number??startScene,awaitingChoice,scenes:Object.freeze(scenes),steps:Object.freeze(steps)});
}

export function getDay12V3ChoiceContinuation(state,choiceNumber){
  const choice=DAY12_V3_CHOICES[choiceNumber-1];if(!choice)throw new Error("DAY12_V3_UNKNOWN_CONTINUATION");
  const selectedId=state?.storyFlags?.[`day12V3Choice${choiceNumber}`];if(!selectedId||!choice.options.some(option=>option.id===selectedId))throw new Error("DAY12_V3_CHOICE_NOT_APPLIED");
  const checkpoint=state?.storyFlags?.day12V3SceneCheckpoint??Math.min(24,choice.sceneNumber+1);
  if(checkpoint===choice.sceneNumber)return getDay12V3ImmersiveSegment(state,{startScene:checkpoint}).steps;
  const selected=playable(state,choice.sceneNumber),raw=rawScene(choice.sceneNumber),branchStepCount=Math.max(0,selected.steps.length-raw.steps.length);
  const rendered=getDay12V3ImmersiveScene(state,choice.sceneNumber),reaction=branchStepCount?rendered.steps.slice(-branchStepCount):[];
  const following=getDay12V3ImmersiveSegment(state,{startScene:checkpoint}).steps;
  return Object.freeze([...reaction,...following]);
}

export function validateDay12V3ImmersiveAdapter(state){return Array.from({length:24},(_,index)=>getDay12V3ImmersiveScene(state,index+1)).every(scene=>scene.steps[0]?.type==="transition"&&scene.backgroundId&&scene.presentation.backgroundUrl);}

export const DAY12_V3_IMMERSIVE_CHOICE_COUNT=DAY12_V3_CHOICES.length;
