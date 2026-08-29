import {DAY11_V3_CHOICES} from "./day11-v3-campaign-data.mjs";
import {DAY11_V3_PLAYABLE_SCRIPT_01_12,getDay11V3PlayableScene01To12} from "./day11-v3-playable-script-01-12.mjs";
import {DAY11_V3_PLAYABLE_SCRIPT_13_24,getDay11V3PlayableScene13To24} from "./day11-v3-playable-script-13-24.mjs";
import {getNextDay11V3Choice} from "./day11-v3-runtime.mjs";
import {getDay11V3Presentation} from "./day11-v3-presentation-data.mjs";

const playable=(state,number)=>number<=12?getDay11V3PlayableScene01To12(state,number):getDay11V3PlayableScene13To24(state,number);
const rawScene=number=>number<=12?DAY11_V3_PLAYABLE_SCRIPT_01_12[number-1]:DAY11_V3_PLAYABLE_SCRIPT_13_24[number-13];
const convertStep=step=>Object.freeze(step.type==="dialogue"?{type:"dialogue",speaker:step.speaker,text:step.text}:step.type==="message"?{type:"message",sender:step.sender,text:step.text,device:"phone"}:step.type==="stageDirection"?{type:"stageDirection",text:step.text}:step.type==="note"?{type:"message",sender:"메모",text:step.text,device:"note"}:step.type==="choiceCue"?{type:"choiceCue",choiceId:step.choiceId}:{type:"narration",text:step.text,sourceType:step.type});

function routeOf(state){return state?.storyFlags?.day11V3AttendedSoraMeeting===true?"ATTENDING":"NON_ATTENDANCE";}
function backgroundFor(state,number){
  const attending=routeOf(state)==="ATTENDING";
  if(number<=3)return "home-morning";
  if(number===4)return attending?"yeonhui-bakery":"small-cafe";
  if(number<=19)return attending?"flower-cafe":number<=15?"small-cafe":"home-night";
  if(number<=22)return attending?"yeonhui-station":"home-night";
  return "home-night";
}

export function getDay11V3ResumePresentation(state){
  const sceneNumber=state?.storyFlags?.day11V3SceneCheckpoint??1;
  const presentation=getDay11V3Presentation(sceneNumber,state);
  return Object.freeze({...presentation,backgroundId:backgroundFor(state,sceneNumber),expressionId:sceneNumber>=19?"calm":"smile",poseId:sceneNumber>=19?"phone":"standing"});
}

export function getDay11V3ImmersiveScene(state,sceneNumber){
  if(!Number.isInteger(sceneNumber)||sceneNumber<1||sceneNumber>24)throw new Error("DAY11_V3_INVALID_SCENE");
  const script=playable(state,sceneNumber),backgroundId=backgroundFor(state,sceneNumber),presentation=getDay11V3Presentation(sceneNumber,state);
  const steps=[Object.freeze({type:"transition",sceneId:script.id,sceneNumber,label:`SCENE ${String(sceneNumber).padStart(2,"0")}`,style:presentation.transition,backgroundId,backgroundUrl:presentation.backgroundUrl,bgmId:presentation.bgm.category,bgm:presentation.bgm,safeArea:presentation.safeArea}),...presentation.sfx.map(sfxId=>Object.freeze({type:"sfx",sfxId}))];
  if(presentation.eventCgUrl)steps.push(Object.freeze({type:"cgShow",source:presentation.eventCgUrl,duration:2400,fit:"contain",objectPosition:presentation.safeArea.objectPosition,safeArea:presentation.safeArea}));
  else if(presentation.characterId){
    steps.push(Object.freeze({type:"characterEnter",characterId:presentation.characterId,assetUrl:presentation.characterAssetUrl,stage:Object.freeze({positionPreset:"right"})}));
    if(presentation.secondaryCharacterId)steps.push(Object.freeze({type:"itemShow",layer:"npcFront",characterId:presentation.secondaryCharacterId,source:presentation.secondaryCharacterAssetUrl,stage:Object.freeze({positionPreset:"left",depth:"normal"})}));
  }
  else steps.push(Object.freeze({type:"ambientHold",backgroundUrl:presentation.backgroundUrl,duration:650}));
  if(!presentation.secondaryCharacterId)steps.push(Object.freeze({type:"itemShow",layer:"npcFront",source:null}));
  steps.push(...script.steps.map(convertStep));
  const next=getNextDay11V3Choice(state),unresolved=next?.sceneNumber===sceneNumber;
  if(unresolved)steps.push(Object.freeze({type:"choice",choiceNumber:next.number,choiceKey:`day11V3Choice${next.number}`,prompt:next.title,options:next.options}));
  return Object.freeze({...script,route:routeOf(state),backgroundId,presentation,hasUnresolvedChoice:Boolean(unresolved),steps:Object.freeze(steps)});
}

export function getDay11V3ImmersiveSegment(state,{startScene=state?.storyFlags?.day11V3SceneCheckpoint??1,endScene=24}={}){
  if(!Number.isInteger(startScene)||startScene<1||startScene>24)throw new Error("DAY11_V3_INVALID_START_SCENE");
  if(!Number.isInteger(endScene)||endScene<startScene||endScene>24)throw new Error("DAY11_V3_INVALID_END_SCENE");
  const scenes=[];
  for(let number=startScene;number<=endScene;number+=1){const scene=getDay11V3ImmersiveScene(state,number);if(scene.skipped===true)continue;scenes.push(scene);if(scene.hasUnresolvedChoice)break;}
  const awaitingChoice=scenes.at(-1)?.hasUnresolvedChoice===true,steps=scenes.flatMap(scene=>scene.steps);
  if(!awaitingChoice&&scenes.at(-1)?.number===24)steps.push(Object.freeze({type:"sceneEnd",day:11,complete:state?.storyFlags?.day11V3Complete===true,nextHook:"day12-company-adaptation-visit"}));
  return Object.freeze({startScene,stopScene:scenes.at(-1)?.number??startScene,awaitingChoice,scenes:Object.freeze(scenes),steps:Object.freeze(steps)});
}

export function getDay11V3ChoiceContinuation(state,choiceNumber){
  const choice=DAY11_V3_CHOICES[choiceNumber-1];if(!choice)throw new Error("DAY11_V3_UNKNOWN_CONTINUATION");
  const selectedId=state?.storyFlags?.[`day11V3Choice${choiceNumber}`];if(!selectedId||!choice.options.some(option=>option.id===selectedId))throw new Error("DAY11_V3_CHOICE_NOT_APPLIED");
  const selected=playable(state,choice.sceneNumber),raw=rawScene(choice.sceneNumber),branchStepCount=Math.max(0,selected.steps.length-raw.steps.length);
  const rendered=getDay11V3ImmersiveScene(state,choice.sceneNumber),reaction=branchStepCount?rendered.steps.slice(-branchStepCount):[];
  const following=choice.sceneNumber<24?getDay11V3ImmersiveSegment(state,{startScene:choice.sceneNumber+1}).steps:[];
  return Object.freeze([...reaction,...following]);
}

export function validateDay11V3ImmersiveAdapter(state){return Array.from({length:24},(_,index)=>getDay11V3ImmersiveScene(state,index+1)).every(scene=>scene.steps[0]?.type==="transition"&&scene.backgroundId);}

export const DAY11_V3_IMMERSIVE_CHOICE_COUNT=DAY11_V3_CHOICES.length;
