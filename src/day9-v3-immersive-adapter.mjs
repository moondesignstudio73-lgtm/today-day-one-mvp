import {DAY9_V3_CHOICES} from "./day9-v3-campaign-data.mjs";
import {getDay9V3PlayableScene,getNextDay9V3Choice} from "./day9-v3-runtime.mjs";
import {getDay9V3Presentation} from "./day9-v3-presentation-data.mjs";

const CHOICE_SCENES=Object.freeze(Object.fromEntries(DAY9_V3_CHOICES.map(choice=>[choice.number,choice.scene-1])));
const choiceSceneFor=number=>CHOICE_SCENES[number];

const convertStep=step=>Object.freeze(step.type==="dialogue"?{
  type:"dialogue",speaker:step.speaker,text:step.text
}:step.type==="message"?{
  type:"message",sender:step.sender,text:step.text,device:"phone"
}:step.type==="sceneEnd"?{
  type:"sceneBoundary"
}:{type:"narration",text:step.text,sourceType:step.type});

export function getDay9V3ImmersiveScene(state,sceneNumber){
  const playable=getDay9V3PlayableScene(state,sceneNumber);
  const presentation=getDay9V3Presentation(sceneNumber,state);
  if(!presentation)throw new Error("DAY9_V3_PRESENTATION_MISSING");
  const steps=[Object.freeze({
    type:"transition",sceneId:playable.sceneId,sceneNumber,label:`SCENE ${String(sceneNumber).padStart(2,"0")}`,
    style:presentation.transition,camera:presentation.camera,backgroundUrl:presentation.backgroundUrl,
    bgmId:presentation.bgm.category,bgm:presentation.bgm,safeArea:presentation.safeArea
  }),...presentation.sfx.map(sfxId=>Object.freeze({type:"sfx",sfxId}))];
  if(presentation.eventCgUrl)steps.push(Object.freeze({type:"cgShow",source:presentation.eventCgUrl,duration:2400,fit:"contain",objectPosition:presentation.safeArea.objectPosition,safeArea:presentation.safeArea}));
  else if(presentation.characterId)steps.push(Object.freeze({type:"characterEnter",characterId:presentation.characterId,assetUrl:presentation.characterAssetUrl,positionPreset:"right-safe"}));
  else steps.push(Object.freeze({type:"ambientHold",backgroundUrl:presentation.backgroundUrl,duration:700}));
  steps.push(...playable.steps.filter(step=>step.type!=="sceneEnd").map(convertStep));
  const nextChoice=getNextDay9V3Choice(state);
  const unresolved=nextChoice&&choiceSceneFor(nextChoice.number)===sceneNumber;
  if(unresolved)steps.push(Object.freeze({type:"choice",choiceNumber:nextChoice.number,choiceKey:`day9V3Choice${nextChoice.number}`,prompt:nextChoice.title,options:nextChoice.options}));
  return Object.freeze({...playable,presentation,hasUnresolvedChoice:Boolean(unresolved),steps:Object.freeze(steps)});
}

export function getDay9V3ImmersiveSegment(state,{startScene=state?.storyFlags?.day9V3SceneCheckpoint??1,endScene=24}={}){
  if(!Number.isInteger(startScene)||startScene<1||startScene>24)throw new Error("DAY9_V3_INVALID_START_SCENE");
  if(!Number.isInteger(endScene)||endScene<startScene||endScene>24)throw new Error("DAY9_V3_INVALID_END_SCENE");
  const scenes=[];
  for(let sceneNumber=startScene;sceneNumber<=endScene;sceneNumber+=1){
    const scene=getDay9V3ImmersiveScene(state,sceneNumber);scenes.push(scene);
    if(scene.hasUnresolvedChoice)break;
  }
  const awaitingChoice=scenes.at(-1)?.hasUnresolvedChoice===true;
  const steps=scenes.flatMap(scene=>scene.steps);
  if(!awaitingChoice&&scenes.at(-1)?.sceneNumber===24)steps.push(Object.freeze({type:"sceneEnd",day:9,complete:state.storyFlags?.day9V3Complete===true,nextHook:"day10-dinner-contact-before-shopping"}));
  return Object.freeze({startScene,stopScene:scenes.at(-1)?.sceneNumber??startScene,awaitingChoice,scenes:Object.freeze(scenes),steps:Object.freeze(steps)});
}

export function getDay9V3ChoiceContinuation(state,choiceNumber){
  const choice=DAY9_V3_CHOICES[choiceNumber-1];
  const selectedId=state?.storyFlags?.[`day9V3Choice${choiceNumber}`];
  if(!choice||!selectedId||!choice.options.some(option=>option.id===selectedId))throw new Error("DAY9_V3_CHOICE_NOT_APPLIED");
  const reactionSceneNumber=choice.scene;
  const selected=getDay9V3PlayableScene(state,reactionSceneNumber).steps;
  const before=structuredClone(state);
  delete before.storyFlags[`day9V3Choice${choiceNumber}`];
  before.storyFlags.day9V3SelectedChoiceIds=(before.storyFlags.day9V3SelectedChoiceIds??[]).filter(id=>id!==selectedId);
  const base=getDay9V3PlayableScene(before,reactionSceneNumber).steps;
  const reaction=selected.slice(base.length).filter(step=>step.type!=="sceneEnd").map(convertStep);
  const checkpoint=state.storyFlags.day9V3SceneCheckpoint;
  const following=getDay9V3ImmersiveSegment(state,{startScene:checkpoint}).steps;
  return Object.freeze(checkpoint>reactionSceneNumber?[...reaction,...following]:following);
}

export function validateDay9V3ImmersiveAdapter(state){
  return Array.from({length:24},(_,i)=>getDay9V3ImmersiveScene(state,i+1)).every(scene=>scene.steps[0]?.type==="transition"&&scene.presentation.backgroundUrl&&scene.steps.some(step=>["characterEnter","cgShow","ambientHold"].includes(step.type)));
}
