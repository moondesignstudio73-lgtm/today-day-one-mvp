import {DAY10_V3_CHOICES,DAY10_V3_FOLLOW_UP_CHOICE} from "./day10-v3-campaign-data.mjs";
import {DAY10_V3_PLAYABLE_SCRIPT_01_12,getDay10V3PlayableScene01To12} from "./day10-v3-playable-script-01-12.mjs";
import {DAY10_V3_PLAYABLE_SCRIPT_13_24,getDay10V3PlayableScene13To24} from "./day10-v3-playable-script-13-24.mjs";
import {getNextDay10V3Choice} from "./day10-v3-runtime.mjs";
import {getDay10V3Presentation} from "./day10-v3-presentation-data.mjs";

const playable=(state,number)=>number<=12?getDay10V3PlayableScene01To12(state,number):getDay10V3PlayableScene13To24(state,number);
const convertStep=step=>Object.freeze(step.type==="dialogue"?{type:"dialogue",speaker:step.speaker,text:step.text}:step.type==="message"?{type:"message",sender:step.sender,text:step.text,device:"phone"}:step.type==="stageDirection"?{type:"stageDirection",text:step.text}:step.type==="choiceCue"?{type:"choiceCue",choiceId:step.choiceId}:{type:"narration",text:step.text,sourceType:step.type});

export function getDay10V3ImmersiveScene(state,sceneNumber){
  const script=playable(state,sceneNumber),presentation=getDay10V3Presentation(sceneNumber,state);if(!presentation)throw new Error("DAY10_V3_PRESENTATION_MISSING");
  const steps=[Object.freeze({type:"transition",sceneId:script.id,sceneNumber,label:`SCENE ${String(sceneNumber).padStart(2,"0")}`,style:presentation.transition,camera:presentation.camera,backgroundUrl:presentation.backgroundUrl,bgmId:presentation.bgm.category,bgm:presentation.bgm,safeArea:presentation.safeArea}),...presentation.sfx.map(sfxId=>Object.freeze({type:"sfx",sfxId}))];
  if(presentation.eventCgUrl)steps.push(Object.freeze({type:"cgShow",source:presentation.eventCgUrl,duration:2400,fit:"contain",objectPosition:presentation.safeArea.objectPosition,safeArea:presentation.safeArea}));
  else if(presentation.characterId)steps.push(Object.freeze({type:"characterEnter",characterId:presentation.characterId,assetUrl:presentation.characterAssetUrl,positionPreset:"right-safe"}));
  else steps.push(Object.freeze({type:"ambientHold",backgroundUrl:presentation.backgroundUrl,duration:700}));
  steps.push(...script.steps.map(convertStep));
  const next=getNextDay10V3Choice(state),unresolved=next&&(next===DAY10_V3_FOLLOW_UP_CHOICE?sceneNumber===16:next.sceneNumber===sceneNumber);
  if(unresolved)steps.push(Object.freeze({type:"choice",choiceNumber:next.number??"FOLLOW_UP",choiceKey:next===DAY10_V3_FOLLOW_UP_CHOICE?"day10V3FollowUpChoice":`day10V3Choice${next.number}`,prompt:next.title,options:next.options}));
  return Object.freeze({...script,presentation,hasUnresolvedChoice:Boolean(unresolved),steps:Object.freeze(steps)});
}

export function getDay10V3ImmersiveSegment(state,{startScene=state?.storyFlags?.day10V3SceneCheckpoint??1,endScene=24}={}){
  if(!Number.isInteger(startScene)||startScene<1||startScene>24)throw new Error("DAY10_V3_INVALID_START_SCENE");
  if(!Number.isInteger(endScene)||endScene<startScene||endScene>24)throw new Error("DAY10_V3_INVALID_END_SCENE");
  const scenes=[];for(let number=startScene;number<=endScene;number+=1){const scene=getDay10V3ImmersiveScene(state,number);scenes.push(scene);if(scene.hasUnresolvedChoice)break;}
  const awaitingChoice=scenes.at(-1)?.hasUnresolvedChoice===true,steps=scenes.flatMap(scene=>scene.steps);
  if(!awaitingChoice&&scenes.at(-1)?.number===24)steps.push(Object.freeze({type:"sceneEnd",day:10,complete:state?.storyFlags?.day10V3Complete===true,nextHook:"day11-sora-private-meeting"}));
  return Object.freeze({startScene,stopScene:scenes.at(-1)?.number??startScene,awaitingChoice,scenes:Object.freeze(scenes),steps:Object.freeze(steps)});
}

export function validateDay10V3ImmersiveAdapter(state){return Array.from({length:24},(_,index)=>getDay10V3ImmersiveScene(state,index+1)).every(scene=>scene.steps[0]?.type==="transition"&&scene.presentation.backgroundUrl&&scene.steps.some(step=>["characterEnter","cgShow","ambientHold"].includes(step.type)));}

export function getDay10V3ChoiceContinuation(state,choiceNumber){
  const followUp=choiceNumber==="FOLLOW_UP",choice=followUp?DAY10_V3_FOLLOW_UP_CHOICE:DAY10_V3_CHOICES[choiceNumber-1];if(!choice)throw new Error("DAY10_V3_UNKNOWN_CONTINUATION");
  const selectedId=followUp?state?.storyFlags?.day10V3FollowUpChoice:state?.storyFlags?.[`day10V3Choice${choiceNumber}`];if(!selectedId||!choice.options.some(option=>option.id===selectedId))throw new Error("DAY10_V3_CHOICE_NOT_APPLIED");
  const sceneNumber=choice.sceneNumber,selected=playable(state,sceneNumber),raw=sceneNumber<=12?DAY10_V3_PLAYABLE_SCRIPT_01_12[sceneNumber-1]:DAY10_V3_PLAYABLE_SCRIPT_13_24[sceneNumber-13];
  const branchStepCount=Math.max(0,selected.steps.length-raw.steps.length),rendered=getDay10V3ImmersiveScene(state,sceneNumber),reaction=branchStepCount?rendered.steps.slice(-branchStepCount):[],following=sceneNumber<24?getDay10V3ImmersiveSegment(state,{startScene:sceneNumber+1}).steps:[];
  return Object.freeze([...reaction,...following]);
}

export const DAY10_V3_IMMERSIVE_CHOICE_COUNT=DAY10_V3_CHOICES.length+1;
