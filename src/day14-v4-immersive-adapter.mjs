import {DAY14_V4_CHOICES} from "./day14-v4-campaign-data.mjs";
import {DAY14_V4_PLAYABLE_SCRIPT_01_11,getDay14V4PlayableScene01To11} from "./day14-v4-playable-script-01-11.mjs";
import {DAY14_V4_PLAYABLE_SCRIPT_12_22,getDay14V4PlayableScene12To22} from "./day14-v4-playable-script-12-22.mjs";
import {getNextDay14V4Choice} from "./day14-v4-runtime.mjs";
import {getDay14V4ClosingDeskCg,getDay14V4Presentation} from "./day14-v4-presentation-data.mjs";
import {projectAuthoredStoryStep} from "./story-player-facing-policy.mjs";

const playable=(state,number)=>number<=11?getDay14V4PlayableScene01To11(state,number):getDay14V4PlayableScene12To22(state,number);
const rawScene=number=>number<=11?DAY14_V4_PLAYABLE_SCRIPT_01_11.find(scene=>scene.number===number):DAY14_V4_PLAYABLE_SCRIPT_12_22.find(scene=>scene.number===number);
const convertStep=step=>projectAuthoredStoryStep(step);
const backgroundFor=(presentation,flags)=>{
  const branch=presentation.branchBackgroundUrls??{};
  if(flags.day14V4InteractionRoute&&branch[flags.day14V4InteractionRoute])return branch[flags.day14V4InteractionRoute];
  if(flags.day14V4OutingRoute&&branch[flags.day14V4OutingRoute])return branch[flags.day14V4OutingRoute];
  return presentation.backgroundUrl;
};
const eventCgFor=(presentation,sceneNumber,flags)=>{
  if([18,20,22].includes(sceneNumber))return getDay14V4ClosingDeskCg(flags);
  if(sceneNumber===1&&flags.day14V4Day13DeskPhotoReceived!==true)return null;
  if(sceneNumber===4&&flags.day14V4OutingRoute!=="FLORA")return null;
  if(sceneNumber===7&&flags.day14V4OutingRoute!=="FLORA")return null;
  if(sceneNumber===8&&(flags.day14V4OutingRoute!=="FLORA"||flags.day14V4PurchaseOutcome!=="GIFT_FLOWER"))return null;
  if(sceneNumber===10&&(flags.day14V4OutingRoute!=="FLORA"||flags.day14V4InteractionRoute!=="IN_PERSON"||flags.day14V4PurchaseOutcome!=="GIFT_FLOWER"))return null;
  if(sceneNumber===15&&(flags.day14V4OutingRoute!=="FLORA"||flags.day14V4NariMet!==true||flags.day14V4InteractionRoute!=="IN_PERSON"))return null;
  if(sceneNumber===17&&(flags.day14V4InteractionRoute!=="IN_PERSON"||!["WALK_TO_STATION","MORE_TOGETHER"].includes(flags.day14V4RemainingTime)||flags.day14V4PriorHandContact!==true||flags.day14V4UnresolvedContactBoundary===true||flags.day14V4HaeunInitiatedHand!==true||flags.day14V4HandContactEstablished!==true))return null;
  return presentation.eventCgUrl;
};

export function getDay14V4ResumePresentation(state){const number=state?.storyFlags?.day14V4SceneCheckpoint??1,presentation=getDay14V4Presentation(number),flags=state?.storyFlags??{},backgroundUrl=backgroundFor(presentation,flags),backgroundId=backgroundUrl.includes("020_flower-cafe")?"flower-cafe":backgroundUrl.includes("018_yeonhui-station")?"yeonhui-station":"home-afternoon";return Object.freeze({...presentation,backgroundId,backgroundUrl,eventCgUrl:eventCgFor(presentation,number,flags)});}

export function getDay14V4ImmersiveScene(state,sceneNumber){
  if(!Number.isInteger(sceneNumber)||sceneNumber<1||sceneNumber>22)throw new Error("DAY14_V4_INVALID_SCENE");
  const script=playable(state,sceneNumber),presentation=getDay14V4Presentation(sceneNumber),flags=state?.storyFlags??{},backgroundUrl=backgroundFor(presentation,flags),eventCgUrl=eventCgFor(presentation,sceneNumber,flags);
  if(script.omitted)return Object.freeze({...script,backgroundUrl,eventCgUrl,presentation,hasUnresolvedChoice:false,steps:Object.freeze([])});
  const steps=[Object.freeze({type:"transition",sceneId:script.id,sceneNumber,label:`SCENE ${String(sceneNumber).padStart(2,"0")}`,style:presentation.transition,backgroundUrl,characterId:null,characterAssetUrl:null,bgmId:presentation.bgm.category,bgm:presentation.bgm,safeArea:presentation.safeArea}),...presentation.sfx.map(sfxId=>Object.freeze({type:"sfx",sfxId})),Object.freeze({type:"ambientHold",backgroundUrl,duration:650}),...script.steps.map(convertStep)];
  const presentationIndex=steps.findIndex(step=>step.type==="ambientHold");
  if(eventCgUrl)steps.splice(presentationIndex,1,Object.freeze({type:"cgShow",source:eventCgUrl,duration:2400,fit:"contain",objectPosition:presentation.safeArea.objectPosition,safeArea:presentation.safeArea}));
  const next=getNextDay14V4Choice(state),unresolved=next?.sceneNumber===sceneNumber&&script.choiceAvailable!==false;
  if(unresolved)steps.push(Object.freeze({type:"choice",choiceNumber:next.number,choiceKey:`day14V4Choice${next.number}`,prompt:next.title,options:next.options}));
  return Object.freeze({...script,backgroundUrl,eventCgUrl,presentation,hasUnresolvedChoice:Boolean(unresolved),steps:Object.freeze(steps)});
}

export function getDay14V4ImmersiveSegment(state,{startScene=state?.storyFlags?.day14V4SceneCheckpoint??1,endScene=22}={}){
  if(!Number.isInteger(startScene)||startScene<1||startScene>22)throw new Error("DAY14_V4_INVALID_START_SCENE");
  if(!Number.isInteger(endScene)||endScene<startScene||endScene>22)throw new Error("DAY14_V4_INVALID_END_SCENE");
  const scenes=[];for(let number=startScene;number<=endScene;number+=1){const scene=getDay14V4ImmersiveScene(state,number);if(scene.omitted)continue;scenes.push(scene);if(scene.hasUnresolvedChoice)break;}
  const awaitingChoice=scenes.at(-1)?.hasUnresolvedChoice===true,steps=scenes.flatMap(scene=>scene.steps);
  if(!awaitingChoice&&scenes.at(-1)?.number===22)steps.push(Object.freeze({type:"sceneEnd",day:14,complete:state?.storyFlags?.day14V4Completed===true,nextHook:"day15-gallery-plan-pending"}));
  return Object.freeze({startScene,stopScene:scenes.at(-1)?.number??startScene,awaitingChoice,scenes:Object.freeze(scenes),steps:Object.freeze(steps)});
}

export function getDay14V4ChoiceContinuation(state,choiceNumber){
  const choice=DAY14_V4_CHOICES[choiceNumber-1];if(!choice)throw new Error("DAY14_V4_UNKNOWN_CONTINUATION");
  const selectedId=state?.storyFlags?.[`day14V4Choice${choiceNumber}`];if(!selectedId)throw new Error("DAY14_V4_CHOICE_NOT_APPLIED");
  const selected=playable(state,choice.sceneNumber),raw=rawScene(choice.sceneNumber),branchStepCount=Math.max(0,selected.steps.length-(raw?.steps?.length??0));
  const rendered=getDay14V4ImmersiveScene(state,choice.sceneNumber),reaction=branchStepCount?rendered.steps.slice(-branchStepCount):[];
  const postChoiceCg=[4,7].includes(choiceNumber)?rendered.steps.filter(step=>step.type==="cgShow"):[];
  return Object.freeze([...postChoiceCg,...reaction,...getDay14V4ImmersiveSegment(state,{startScene:state?.storyFlags?.day14V4SceneCheckpoint??Math.min(22,choice.sceneNumber+1)}).steps]);
}

export function validateDay14V4ImmersiveAdapter(state){return Array.from({length:22},(_,index)=>getDay14V4ImmersiveScene(state,index+1)).every(scene=>scene.omitted||scene.steps[0]?.type==="transition");}
export const DAY14_V4_IMMERSIVE_CHOICE_COUNT=DAY14_V4_CHOICES.length;
