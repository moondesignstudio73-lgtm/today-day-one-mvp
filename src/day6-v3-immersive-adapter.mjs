import {DAY6_V3_CHOICES} from "./day6-v3-campaign-data.mjs";
import {getDay6V3PlayableScene} from "./day6-v3-runtime.mjs";
import {getDay6V3Presentation} from "./day6-v3-presentation-data.mjs";
import {projectAuthoredStoryStep} from "./story-player-facing-policy.mjs";

const CHOICE_SCENE_BY_NUMBER=Object.freeze({1:1,2:2,3:4,4:7,5:10,6:12,7:15,8:16,9:18,10:20,11:22});
const choiceByScene=new Map(DAY6_V3_CHOICES.map(choice=>[CHOICE_SCENE_BY_NUMBER[choice.number],choice]));

const convertScriptStep=(step,presentation)=>projectAuthoredStoryStep(step,{expressionId:presentation.expressionId});

export function getDay6V3ImmersiveScene(state,sceneNumber){
  const playable=getDay6V3PlayableScene(state,sceneNumber);
  const presentation=getDay6V3Presentation(sceneNumber);
  if(!presentation)throw new Error("DAY6_V3_PRESENTATION_MISSING");
  const steps=[Object.freeze({
    type:"transition",sceneId:playable.sceneId,sceneNumber,label:`SCENE ${String(sceneNumber).padStart(2,"0")}`,
    style:presentation.transition,camera:presentation.camera,
    backgroundId:presentation.backgroundId,backgroundUrl:presentation.backgroundUrl,
    bgmId:presentation.bgm.category,bgm:presentation.bgm
  }),...presentation.sfx.map(sfxId=>Object.freeze({type:"sfx",sfxId})),Object.freeze({
    type:"characterEnter",characterId:presentation.characterId,
    assetUrl:presentation.characterAssetUrl,expressionId:presentation.expressionId,
    poseId:presentation.poseId
  }),...playable.steps.map(step=>convertScriptStep(step,presentation))];
  const choice=choiceByScene.get(sceneNumber);
  const unresolved=choice&&!state.storyFlags?.[choice.saveKey];
  if(unresolved)steps.push(Object.freeze({
    type:"choice",choiceNumber:choice.number,choiceKey:choice.key,prompt:choice.prompt,
    saveKey:choice.saveKey,options:choice.options
  }));
  return Object.freeze({...playable,presentation,hasUnresolvedChoice:Boolean(unresolved),steps:Object.freeze(steps)});
}

export function getDay6V3ImmersiveSegment(state,{startScene=state?.storyFlags?.day6V3SceneCheckpoint??1,endScene=23}={}){
  if(!Number.isInteger(startScene)||startScene<1||startScene>23)throw new Error("DAY6_V3_INVALID_START_SCENE");
  if(!Number.isInteger(endScene)||endScene<startScene||endScene>23)throw new Error("DAY6_V3_INVALID_END_SCENE");
  const scenes=[];
  for(let sceneNumber=startScene;sceneNumber<=endScene;sceneNumber+=1){
    const scene=getDay6V3ImmersiveScene(state,sceneNumber);
    scenes.push(scene);
    if(scene.hasUnresolvedChoice)break;
  }
  const awaitingChoice=scenes.at(-1)?.hasUnresolvedChoice===true;
  const steps=scenes.flatMap(scene=>scene.steps);
  if(!awaitingChoice&&scenes.at(-1)?.sceneNumber===23)steps.push(Object.freeze({type:"sceneEnd",day:6,complete:state.storyFlags?.day6V3Complete===true}));
  return Object.freeze({startScene,stopScene:scenes.at(-1)?.sceneNumber??startScene,awaitingChoice,scenes:Object.freeze(scenes),steps:Object.freeze(steps)});
}

export function getDay6V3ChoiceContinuation(state,choiceNumber){
  const choice=DAY6_V3_CHOICES[choiceNumber-1];
  const sceneNumber=CHOICE_SCENE_BY_NUMBER[choiceNumber];
  if(!choice||!state?.storyFlags?.[choice.saveKey])throw new Error("DAY6_V3_CHOICE_NOT_APPLIED");
  const selected=getDay6V3PlayableScene(state,sceneNumber).steps;
  const withoutChoice=structuredClone(state);
  delete withoutChoice.storyFlags[choice.saveKey];
  const base=getDay6V3PlayableScene(withoutChoice,sceneNumber).steps;
  const reaction=selected.slice(base.length).map(step=>convertScriptStep(step,getDay6V3Presentation(sceneNumber)));
  const following=getDay6V3ImmersiveSegment(state,{startScene:state.storyFlags.day6V3SceneCheckpoint}).steps;
  return Object.freeze([...reaction,...following]);
}

export function validateDay6V3ImmersiveAdapter(state){
  return Array.from({length:23},(_,index)=>getDay6V3ImmersiveScene(state,index+1)).every(scene=>
    scene.steps[0].type==="transition"&&scene.steps.some(step=>step.type==="characterEnter")&&scene.presentation.backgroundUrl
  );
}
