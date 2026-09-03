import {DAY7_V3_CHOICES} from "./day7-v3-campaign-data.mjs";
import {getAvailableDay7V3ChoiceOptions,getDay7V3PlayableScene,getNextDay7V3Choice} from "./day7-v3-runtime.mjs";
import {getDay7V3Presentation} from "./day7-v3-presentation-data.mjs";
import {projectAuthoredStoryStep} from "./story-player-facing-policy.mjs";

const STATIC_CHOICE_SCENES=Object.freeze({1:2,2:3,3:4,4:6,6:13,7:15,8:17,9:19,10:20,11:21});
const routeChoiceScene=route=>({"night-view":8,"theme-park":9,"book-and-dinner":10}[route]??8);
const choiceSceneFor=(choiceNumber,state)=>choiceNumber===5?routeChoiceScene(state?.storyFlags?.day7V3DateRoute):STATIC_CHOICE_SCENES[choiceNumber];

const convertScriptStep=(step,presentation)=>projectAuthoredStoryStep(step,{expressionId:presentation.expressionId});

export function getDay7V3ImmersiveScene(state,sceneNumber){
  const playable=getDay7V3PlayableScene(state,sceneNumber);
  const presentation=getDay7V3Presentation(sceneNumber,state);
  if(!presentation)throw new Error("DAY7_V3_PRESENTATION_MISSING");
  if(playable.skipped)return Object.freeze({...playable,presentation,hasUnresolvedChoice:false,steps:Object.freeze([])});
  const steps=[Object.freeze({
    type:"transition",sceneId:playable.sceneId,sceneNumber,label:`SCENE ${String(sceneNumber).padStart(2,"0")}`,
    style:presentation.transition,camera:presentation.camera,backgroundId:presentation.backgroundId,
    backgroundUrl:presentation.backgroundUrl,bgmId:presentation.bgm.category,bgm:presentation.bgm,
    safeArea:presentation.safeArea
  }),...presentation.sfx.map(sfxId=>Object.freeze({type:"sfx",sfxId}))];
  if(presentation.eventCgUrl)steps.push(Object.freeze({type:"cgShow",source:presentation.eventCgUrl,duration:2400,fit:"contain",objectPosition:presentation.safeArea.objectPosition,safeArea:presentation.safeArea}));
  else steps.push(Object.freeze({type:"characterEnter",characterId:presentation.characterId,assetUrl:presentation.characterAssetUrl,expressionId:presentation.expressionId,poseId:presentation.poseId,positionPreset:"right-safe"}));
  steps.push(...playable.steps.map(step=>convertScriptStep(step,presentation)));
  const nextChoice=getNextDay7V3Choice(state);
  const unresolved=nextChoice&&choiceSceneFor(nextChoice.number,state)===sceneNumber;
  if(unresolved)steps.push(Object.freeze({
    type:"choice",choiceNumber:nextChoice.number,choiceKey:nextChoice.key,prompt:nextChoice.prompt,
    options:Object.freeze(getAvailableDay7V3ChoiceOptions(state,nextChoice.number))
  }));
  return Object.freeze({...playable,presentation,hasUnresolvedChoice:Boolean(unresolved),steps:Object.freeze(steps)});
}

export function getDay7V3ImmersiveSegment(state,{startScene=state?.storyFlags?.day7V3SceneCheckpoint??1,endScene=24}={}){
  if(!Number.isInteger(startScene)||startScene<1||startScene>24)throw new Error("DAY7_V3_INVALID_START_SCENE");
  if(!Number.isInteger(endScene)||endScene<startScene||endScene>24)throw new Error("DAY7_V3_INVALID_END_SCENE");
  const scenes=[];
  for(let sceneNumber=startScene;sceneNumber<=endScene;sceneNumber+=1){
    const scene=getDay7V3ImmersiveScene(state,sceneNumber);
    if(scene.skipped)continue;
    scenes.push(scene);
    if(scene.hasUnresolvedChoice)break;
  }
  const awaitingChoice=scenes.at(-1)?.hasUnresolvedChoice===true;
  const steps=scenes.flatMap(scene=>scene.steps);
  if(!awaitingChoice&&scenes.at(-1)?.sceneNumber===24)steps.push(Object.freeze({type:"sceneEnd",day:7,complete:state.storyFlags?.day7V3Complete===true,nextHook:"day8-jihoon-invitation"}));
  return Object.freeze({startScene,stopScene:scenes.at(-1)?.sceneNumber??startScene,awaitingChoice,scenes:Object.freeze(scenes),steps:Object.freeze(steps)});
}

export function getDay7V3ChoiceContinuation(state,choiceNumber){
  const choice=DAY7_V3_CHOICES[choiceNumber-1];
  const flags=state?.storyFlags;
  const selectedId=flags?.day7V3SelectedChoiceIds?.find(id=>choice?.options.some(option=>option.id===id));
  if(!choice||!selectedId)throw new Error("DAY7_V3_CHOICE_NOT_APPLIED");
  const sceneNumber=choiceSceneFor(choiceNumber,state);
  const selected=getDay7V3PlayableScene(state,sceneNumber).steps;
  const before=structuredClone(state);
  before.storyFlags.day7V3SelectedChoiceIds=before.storyFlags.day7V3SelectedChoiceIds.filter(id=>id!==selectedId);
  const base=getDay7V3PlayableScene(before,sceneNumber).steps;
  const presentation=getDay7V3Presentation(sceneNumber,state);
  const reaction=selected.slice(base.length).map(step=>convertScriptStep(step,presentation));
  const following=getDay7V3ImmersiveSegment(state,{startScene:state.storyFlags.day7V3SceneCheckpoint}).steps;
  return Object.freeze([...reaction,...following]);
}

export function validateDay7V3ImmersiveAdapter(state){
  return Array.from({length:24},(_,i)=>getDay7V3ImmersiveScene(state,i+1)).every(scene=>scene.skipped||(
    scene.steps[0]?.type==="transition"&&scene.presentation.backgroundUrl&&scene.steps.some(step=>["characterEnter","cgShow"].includes(step.type))
  ));
}
