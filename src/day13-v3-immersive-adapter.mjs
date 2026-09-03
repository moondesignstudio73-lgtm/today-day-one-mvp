import {DAY13_V3_CHOICES} from "./day13-v3-campaign-data.mjs";
import {DAY13_V3_PLAYABLE_SCRIPT_01_12,getDay13V3PlayableScene01To12} from "./day13-v3-playable-script-01-12.mjs";
import {DAY13_V3_PLAYABLE_SCRIPT_13_24,getDay13V3PlayableScene13To24} from "./day13-v3-playable-script-13-24.mjs";
import {getNextDay13V3Choice} from "./day13-v3-runtime.mjs";
import {DAY13_V3_REQUIRED_NEW_ASSETS,getDay13V3Presentation} from "./day13-v3-presentation-data.mjs";
import {projectAuthoredStoryStep} from "./story-player-facing-policy.mjs";

const playable=(state,number)=>number<=12?getDay13V3PlayableScene01To12(state,number):getDay13V3PlayableScene13To24(state,number);
const rawScene=number=>number<=12?DAY13_V3_PLAYABLE_SCRIPT_01_12[number-1]:DAY13_V3_PLAYABLE_SCRIPT_13_24[number-13];
const convertStep=step=>projectAuthoredStoryStep(step);
const routeOf=flags=>flags.day13V3OutingRoute??"HOME";
const backgroundFor=(presentation,flags)=>{
  const branch=presentation.branchBackgroundUrls??{},route=routeOf(flags);
  if(flags.day13V3AraEarlyExit&&branch.EARLY_EXIT)return branch.EARLY_EXIT;
  return branch[route]??presentation.backgroundUrl;
};
const eventCgFor=(presentation,sceneNumber,flags)=>{
  if(sceneNumber===24)return flags.day13V3PortraitExists?presentation.branchEventCgUrls.portrait:presentation.branchEventCgUrls.scenery;
  if([5,13,14,19].includes(sceneNumber)&&flags.day13V3AraMet!==true)return null;
  if(sceneNumber===13&&flags.day13V3PortraitExists!==true)return null;
  if(sceneNumber===14&&(flags.day13V3PortraitExists!==true||flags.day13V3AraEarlyExit===true))return null;
  if(sceneNumber===19&&flags.day13V3AraPhysicallyPresent!==true)return null;
  return presentation.eventCgUrl;
};

export function getDay13V3ResumePresentation(state){
  const sceneNumber=state?.storyFlags?.day13V3SceneCheckpoint??1,presentation=getDay13V3Presentation(sceneNumber),flags=state?.storyFlags??{};
  return Object.freeze({...presentation,backgroundUrl:backgroundFor(presentation,flags),eventCgUrl:eventCgFor(presentation,sceneNumber,flags)});
}

export function getDay13V3ImmersiveScene(state,sceneNumber){
  if(!Number.isInteger(sceneNumber)||sceneNumber<1||sceneNumber>24)throw new Error("DAY13_V3_INVALID_SCENE");
  const script=playable(state,sceneNumber),presentation=getDay13V3Presentation(sceneNumber),flags=state?.storyFlags??{},backgroundUrl=backgroundFor(presentation,flags),eventCgUrl=eventCgFor(presentation,sceneNumber,flags);
  if(script.omitted)return Object.freeze({...script,backgroundUrl,presentation,eventCgUrl,hasUnresolvedChoice:false,steps:Object.freeze([])});
  const sprite=DAY13_V3_REQUIRED_NEW_ASSETS.araPhotoWalkSprite;
  const characterVisible=presentation.characterId==="ara"&&flags.day13V3AraMet===true&&flags.day13V3AraEarlyExit!==true&&sprite.status==="ready-new";
  const steps=[Object.freeze({type:"transition",sceneId:script.id,sceneNumber,label:`SCENE ${String(sceneNumber).padStart(2,"0")}`,style:presentation.transition,backgroundUrl,characterId:characterVisible?"ara":null,characterAssetUrl:characterVisible?sprite.path:null,bgmId:presentation.bgm.category,bgm:presentation.bgm,safeArea:presentation.safeArea}),...presentation.sfx.map(sfxId=>Object.freeze({type:"sfx",sfxId}))];
  if(eventCgUrl)steps.push(Object.freeze({type:"cgShow",source:eventCgUrl,duration:2400,fit:"contain",objectPosition:presentation.safeArea.objectPosition,safeArea:presentation.safeArea}));
  else if(characterVisible)steps.push(Object.freeze({type:"characterEnter",characterId:"ara",assetUrl:sprite.path,stage:Object.freeze({positionPreset:"right"})}));
  else steps.push(Object.freeze({type:"ambientHold",backgroundUrl,duration:650}));
  steps.push(...script.steps.map(convertStep));
  const next=getNextDay13V3Choice(state),unresolved=next?.sceneNumber===sceneNumber&&script.choiceAvailable!==false;
  if(unresolved)steps.push(Object.freeze({type:"choice",choiceNumber:next.number,choiceKey:`day13V3Choice${next.number}`,prompt:next.title,options:next.options}));
  return Object.freeze({...script,backgroundUrl,presentation,eventCgUrl,hasUnresolvedChoice:Boolean(unresolved),steps:Object.freeze(steps)});
}

export function getDay13V3ImmersiveSegment(state,{startScene=state?.storyFlags?.day13V3SceneCheckpoint??1,endScene=24}={}){
  if(!Number.isInteger(startScene)||startScene<1||startScene>24)throw new Error("DAY13_V3_INVALID_START_SCENE");
  if(!Number.isInteger(endScene)||endScene<startScene||endScene>24)throw new Error("DAY13_V3_INVALID_END_SCENE");
  const scenes=[];for(let number=startScene;number<=endScene;number+=1){const scene=getDay13V3ImmersiveScene(state,number);if(scene.omitted)continue;scenes.push(scene);if(scene.hasUnresolvedChoice)break;}
  const awaitingChoice=scenes.at(-1)?.hasUnresolvedChoice===true,steps=scenes.flatMap(scene=>scene.steps);
  if(!awaitingChoice&&scenes.at(-1)?.number===24)steps.push(Object.freeze({type:"sceneEnd",day:13,complete:state?.storyFlags?.day13V3Completed===true,nextHook:"day14-flower-desk-plan"}));
  return Object.freeze({startScene,stopScene:scenes.at(-1)?.number??startScene,awaitingChoice,scenes:Object.freeze(scenes),steps:Object.freeze(steps)});
}

export function getDay13V3ChoiceContinuation(state,choiceNumber){
  const choice=DAY13_V3_CHOICES[choiceNumber-1];if(!choice)throw new Error("DAY13_V3_UNKNOWN_CONTINUATION");
  const selectedId=state?.storyFlags?.[`day13V3Choice${choiceNumber}`];if(!selectedId||!choice.options.some(option=>option.id===selectedId))throw new Error("DAY13_V3_CHOICE_NOT_APPLIED");
  const checkpoint=state?.storyFlags?.day13V3SceneCheckpoint??Math.min(24,choice.sceneNumber+1);
  const selected=playable(state,choice.sceneNumber),raw=rawScene(choice.sceneNumber),branchStepCount=Math.max(0,selected.steps.length-raw.steps.length);
  const rendered=getDay13V3ImmersiveScene(state,choice.sceneNumber),reaction=branchStepCount?rendered.steps.slice(-branchStepCount):[];
  return Object.freeze([...reaction,...getDay13V3ImmersiveSegment(state,{startScene:checkpoint}).steps]);
}

export function validateDay13V3ImmersiveAdapter(state){return Array.from({length:24},(_,index)=>getDay13V3ImmersiveScene(state,index+1)).every(scene=>scene.omitted||scene.steps[0]?.type==="transition");}
export const DAY13_V3_IMMERSIVE_CHOICE_COUNT=DAY13_V3_CHOICES.length;
