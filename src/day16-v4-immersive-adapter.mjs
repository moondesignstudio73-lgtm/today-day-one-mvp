import {composeDay16V4Continuation} from "./day16-v4-continuation.mjs";
import {getDay16V4PresentationPlan} from "./day16-v4-presentation-plan.mjs";
import {getDay16V4Presentation,validateDay16V4PresentationData} from "./day16-v4-presentation-data.mjs";

const f=Object.freeze;

function convertStep(step){
  if(!step||typeof step.type!=="string")throw new Error("DAY16_V4_IMMERSIVE_STEP_INVALID");
  if(typeof step.text!=="string"||step.text.length===0)throw new Error(`DAY16_V4_IMMERSIVE_TEXT_MISSING:${step.type}`);
  if(step.type==="dialogue"){
    if(typeof step.speaker!=="string"||step.speaker.length===0)throw new Error("DAY16_V4_IMMERSIVE_SPEAKER_MISSING");
    return f({type:"dialogue",speaker:step.speaker,text:step.text});
  }
  if(step.type==="narration")return f({type:"narration",text:step.text});
  if(step.type==="stageDirection")return f({type:"stageDirection",text:step.text});
  throw new Error(`DAY16_V4_IMMERSIVE_STEP_UNSUPPORTED:${step.type}`);
}

function transition(sceneNumber,title){
  const presentation=getDay16V4Presentation(sceneNumber);
  return f({type:"transition",sceneId:`day16-v4-scene-${sceneNumber}`,sceneNumber,label:`SCENE ${String(sceneNumber).padStart(2,"0")} · ${title}`,style:presentation.transition,backgroundId:presentation.backgroundId,characterId:null,characterAssetUrl:null,bgmId:presentation.bgm.category,bgm:presentation.bgm,safeArea:presentation.safeArea});
}

function sceneSteps(scene,context){
  const steps=[transition(scene.number,scene.title),...scene.playerFacingSteps.map(convertStep)];
  if(scene.unresolvedChoice){
    const options=scene.unresolvedChoice.number===6&&context.haeunRelationshipActive!==true?scene.unresolvedChoice.options.filter(option=>option.id!=="day16_v4_current_name_haeun"):scene.unresolvedChoice.options;
    if(options.length===0)throw new Error(`DAY16_V4_IMMERSIVE_CHOICE_SOURCE_LOCKED:${scene.unresolvedChoice.number}`);
    steps.push(f({type:"choice",choiceNumber:scene.unresolvedChoice.number,choiceKey:`day16V4Choice${scene.unresolvedChoice.number}`,prompt:scene.title,options:f([...options])}));
  }
  return steps;
}

function planSteps(plan,context){
  const steps=plan.scenes.flatMap(scene=>sceneSteps(scene,context));
  if(plan.completionCue)steps.push(plan.completionCue);
  if(plan.sceneEnd)steps.push(plan.sceneEnd);
  return f(steps);
}

export function getDay16V4ResumePresentation(state){
  return getDay16V4Presentation(state?.storyFlags?.day16V4SceneCheckpoint??1);
}

export function getDay16V4ImmersiveSegment(state,context={}){
  return planSteps(getDay16V4PresentationPlan(state,context),context);
}

export function getDay16V4ChoiceContinuation(state,choiceNumber,context={}){
  const continuation=composeDay16V4Continuation(state,{...context,afterChoiceNumber:choiceNumber});
  return f([...continuation.reaction.steps.map(convertStep),...planSteps(continuation.plan,context)]);
}

export function validateDay16V4ImmersiveAdapter(state,context={}){
  const steps=getDay16V4ImmersiveSegment(state,context);
  return validateDay16V4PresentationData()&&steps[0]?.type==="transition"&&["choice","chapterCompletionCue","sceneEnd"].includes(steps.at(-1)?.type);
}
