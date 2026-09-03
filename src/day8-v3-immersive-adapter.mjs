import {DAY8_V3_CHOICES} from "./day8-v3-campaign-data.mjs";
import {getDay8V3PlayableScene,getNextDay8V3Choice} from "./day8-v3-runtime.mjs";
import {getDay8V3Presentation} from "./day8-v3-presentation-data.mjs";
import {projectAuthoredStoryStep} from "./story-player-facing-policy.mjs";

const CHOICE_SCENES=Object.freeze({1:1,2:3,3:5,4:8,5:10,6:14,7:16,8:18,9:19,10:21});
const choiceSceneFor=number=>CHOICE_SCENES[number];
const convertStep=(step,presentation)=>projectAuthoredStoryStep(step,{expressionId:presentation.expressionId});

export function getDay8V3ImmersiveScene(state,sceneNumber){
  const playable=getDay8V3PlayableScene(state,sceneNumber);
  const presentation=getDay8V3Presentation(sceneNumber,state);
  if(!presentation)throw new Error("DAY8_V3_PRESENTATION_MISSING");
  if(playable.skipped)return Object.freeze({...playable,presentation,hasUnresolvedChoice:false,steps:Object.freeze([])});
  const steps=[Object.freeze({
    type:"transition",sceneId:playable.sceneId,sceneNumber,label:`SCENE ${String(sceneNumber).padStart(2,"0")}`,
    style:presentation.transition,camera:presentation.camera,backgroundId:presentation.backgroundId,
    backgroundUrl:presentation.backgroundUrl,bgmId:presentation.bgm.category,bgm:presentation.bgm,safeArea:presentation.safeArea
  }),...presentation.sfx.map(sfxId=>Object.freeze({type:"sfx",sfxId}))];
  if(presentation.eventCgUrl)steps.push(Object.freeze({type:"cgShow",source:presentation.eventCgUrl,duration:2400,fit:"contain",objectPosition:presentation.safeArea.objectPosition,safeArea:presentation.safeArea}));
  else if(presentation.characterId)steps.push(Object.freeze({type:"characterEnter",characterId:presentation.characterId,assetUrl:presentation.characterAssetUrl,expressionId:presentation.expressionId,poseId:presentation.poseId,positionPreset:"right-safe"}));
  else steps.push(Object.freeze({type:"ambientHold",backgroundId:presentation.backgroundId,duration:700}));
  steps.push(...playable.steps.map(step=>convertStep(step,presentation)));
  const nextChoice=getNextDay8V3Choice(state);
  const unresolved=nextChoice&&choiceSceneFor(nextChoice.number)===sceneNumber;
  if(unresolved)steps.push(Object.freeze({type:"choice",choiceNumber:nextChoice.number,choiceKey:nextChoice.key,prompt:nextChoice.prompt,options:nextChoice.options}));
  return Object.freeze({...playable,presentation,hasUnresolvedChoice:Boolean(unresolved),steps:Object.freeze(steps)});
}

export function getDay8V3ImmersiveSegment(state,{startScene=state?.storyFlags?.day8V3SceneCheckpoint??1,endScene=24}={}){
  if(!Number.isInteger(startScene)||startScene<1||startScene>24)throw new Error("DAY8_V3_INVALID_START_SCENE");
  if(!Number.isInteger(endScene)||endScene<startScene||endScene>24)throw new Error("DAY8_V3_INVALID_END_SCENE");
  const scenes=[];
  for(let sceneNumber=startScene;sceneNumber<=endScene;sceneNumber+=1){
    const scene=getDay8V3ImmersiveScene(state,sceneNumber);
    if(scene.skipped)continue;
    scenes.push(scene);
    if(scene.hasUnresolvedChoice)break;
  }
  const awaitingChoice=scenes.at(-1)?.hasUnresolvedChoice===true;
  const steps=scenes.flatMap(scene=>scene.steps);
  if(!awaitingChoice&&scenes.at(-1)?.sceneNumber===24)steps.push(Object.freeze({type:"sceneEnd",day:8,complete:state.storyFlags?.day8V3Complete===true,nextHook:"day9-clothing-color-invitation"}));
  return Object.freeze({startScene,stopScene:scenes.at(-1)?.sceneNumber??startScene,awaitingChoice,scenes:Object.freeze(scenes),steps:Object.freeze(steps)});
}

export function getDay8V3ChoiceContinuation(state,choiceNumber){
  const choice=DAY8_V3_CHOICES[choiceNumber-1];
  const selectedId=state?.storyFlags?.day8V3SelectedChoiceIds?.find(id=>choice?.options.some(option=>option.id===id));
  if(!choice||!selectedId)throw new Error("DAY8_V3_CHOICE_NOT_APPLIED");
  const sceneNumber=choiceSceneFor(choiceNumber);
  const selected=getDay8V3PlayableScene(state,sceneNumber).steps;
  const before=structuredClone(state);
  before.storyFlags.day8V3SelectedChoiceIds=before.storyFlags.day8V3SelectedChoiceIds.filter(id=>id!==selectedId);
  const base=getDay8V3PlayableScene(before,sceneNumber).steps;
  const presentation=getDay8V3Presentation(sceneNumber,state);
  const reaction=selected.slice(base.length).map(step=>convertStep(step,presentation));
  const following=getDay8V3ImmersiveSegment(state,{startScene:state.storyFlags.day8V3SceneCheckpoint}).steps;
  return Object.freeze([...reaction,...following]);
}

export function validateDay8V3ImmersiveAdapter(state){
  return Array.from({length:24},(_,i)=>getDay8V3ImmersiveScene(state,i+1)).every(scene=>scene.skipped||(scene.steps[0]?.type==="transition"&&scene.presentation.backgroundUrl&&scene.steps.some(step=>["characterEnter","cgShow","ambientHold"].includes(step.type))));
}
