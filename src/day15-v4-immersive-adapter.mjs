import {DAY15_V4_CHOICES,DAY15_V4_CHOICE_IDS} from "./day15-v4-campaign-data.mjs";
import {getDay15V4ResolvedScene01To12} from "./day15-v4-playable-resolver-01-12.mjs";
import {getDay15V4ResolvedScene13To24} from "./day15-v4-playable-resolver-13-24.mjs";
import {getNextDay15V4Choice} from "./day15-v4-runtime.mjs";
import {getDay15V4EventCg,getDay15V4Presentation,validateDay15V4PresentationData} from "./day15-v4-presentation-data.mjs";

const f=Object.freeze;
const playable=(state,number)=>number<=12?getDay15V4ResolvedScene01To12(state,number):getDay15V4ResolvedScene13To24(state,number);
function convertStep(step){
  if(!step||typeof step.type!=="string")throw new Error("DAY15_V4_PRESENTATION_STEP_INVALID");
  if(step.type==="choiceCue"){if(!Number.isInteger(step.choiceNumber))throw new Error("DAY15_V4_PRESENTATION_CHOICE_CUE_INVALID");return f({type:"choiceCue",choiceNumber:step.choiceNumber});}
  if(step.type==="choiceSelection"){if(!Number.isInteger(step.choiceNumber)||typeof step.choiceId!=="string")throw new Error("DAY15_V4_PRESENTATION_CHOICE_SELECTION_INVALID");return f({type:"choiceSelection",choiceNumber:step.choiceNumber,choiceId:step.choiceId});}
  if(typeof step.text!=="string"||step.text.length===0)throw new Error(`DAY15_V4_PRESENTATION_TEXT_MISSING:${step.type}`);
  if(step.type==="dialogue"){if(typeof step.speaker!=="string")throw new Error("DAY15_V4_PRESENTATION_SPEAKER_MISSING");return f({type:"dialogue",speaker:step.speaker,text:step.text});}
  if(step.type==="message"){if(typeof step.sender!=="string")throw new Error("DAY15_V4_PRESENTATION_SENDER_MISSING");return f({type:"message",sender:step.sender,text:step.text,device:"phone"});}
  if(["stageDirection","narration","section"].includes(step.type))return f({type:step.type,text:step.text});
  throw new Error(`DAY15_V4_PRESENTATION_STEP_UNSUPPORTED:${step.type}`);
}
const choiceSceneNumber=(flags,number)=>flags.day15V4AttendanceRoute==="OWN_AFTERNOON"&&number>=3&&number<=5?6:DAY15_V4_CHOICES[number-1].sceneNumber;
const routeSequence=(state,startScene)=>{const flags=state?.storyFlags??{},next=getNextDay15V4Choice(state)?.number;if(startScene===18){if(flags.day15V4HaeunContactRoute!=="PHONE"||next!==7)throw new Error("DAY15_V4_PHONE_DETOUR_STATE_INVALID");return f([18,12,13,14,15,16,17,20,21,22,23,24]);}if(startScene===19){if(flags.day15V4HaeunContactRoute!=="NO_CONTACT"&&flags.day15V4HaeunLeft!==true)throw new Error("DAY15_V4_NO_CONTACT_DETOUR_STATE_INVALID");return f([19,23,24]);}return f(Array.from({length:25-startScene},(_,index)=>startScene+index));};

export function getDay15V4ResumePresentation(state){const sceneNumber=state?.storyFlags?.day15V4SceneCheckpoint??1;if(!Number.isInteger(sceneNumber)||sceneNumber<1||sceneNumber>24)throw new Error("DAY15_V4_RESUME_CHECKPOINT_INVALID");const presentation=getDay15V4Presentation(sceneNumber),eventCgUrl=getDay15V4EventCg(state,sceneNumber);return f({...presentation,eventCgUrl,expressionId:sceneNumber>=19?"calm":"smile",poseId:[1,18,22,23].includes(sceneNumber)?"phone":"standing"});}

export function getDay15V4ImmersiveScene(state,sceneNumber){
  if(!Number.isInteger(sceneNumber)||sceneNumber<1||sceneNumber>24)throw new Error("DAY15_V4_INVALID_SCENE");
  const script=playable(state,sceneNumber),basePresentation=getDay15V4Presentation(sceneNumber),eventCgUrl=getDay15V4EventCg(state,sceneNumber),presentation=f({...basePresentation,eventCgUrl});
  if(script.omitted)return f({...script,eventCgUrl:null,presentation:f({...presentation,eventCgUrl:null}),hasUnresolvedChoice:false,steps:f([])});
  const cueIndices=script.steps.map((step,index)=>step.type==="choiceCue"?index:-1).filter(index=>index>=0);
  if(cueIndices.length>1||cueIndices.length===1&&cueIndices[0]!==script.steps.length-1)throw new Error(`DAY15_V4_CHOICE_CUE_NOT_TERMINAL:${sceneNumber}`);
  const steps=[f({type:"transition",sceneId:script.id,sceneNumber,label:`SCENE ${String(sceneNumber).padStart(2,"0")}`,style:presentation.transition,backgroundId:presentation.backgroundId,backgroundUrl:presentation.backgroundUrl,characterId:eventCgUrl?null:presentation.characterId,characterAssetUrl:eventCgUrl?null:presentation.characterAssetUrl,bgmId:presentation.bgm.category,bgm:presentation.bgm,safeArea:presentation.safeArea}),...presentation.sfx.map(sfxId=>f({type:"sfx",sfxId}))];
  if(eventCgUrl){steps.push(f({type:"cgShow",source:eventCgUrl,duration:2400,fit:"contain",objectPosition:presentation.safeArea.objectPosition,safeArea:presentation.safeArea}));if(presentation.characterId)steps.push(f({type:"characterEnter",characterId:presentation.characterId,assetUrl:presentation.characterAssetUrl,stage:f({positionPreset:"right"})}));}
  else if(presentation.characterId)steps.push(f({type:"characterEnter",characterId:presentation.characterId,assetUrl:presentation.characterAssetUrl,stage:f({positionPreset:"right"})}));else steps.push(f({type:"ambientHold",backgroundUrl:presentation.backgroundUrl,duration:650}));
  steps.push(...script.steps.filter(step=>step.type!=="choiceCue").map(convertStep));
  const next=getNextDay15V4Choice(state),unresolved=next!=null&&script.steps.some(step=>step.type==="choiceCue"&&step.choiceNumber===next.number);
  if(unresolved)steps.push(f({type:"choice",choiceNumber:next.number,choiceKey:`day15V4Choice${next.number}`,prompt:next.title,options:next.options}));
  return f({...script,eventCgUrl,presentation,hasUnresolvedChoice:unresolved,steps:f(steps)});
}

export function getDay15V4ImmersiveSegment(state,{startScene=state?.storyFlags?.day15V4SceneCheckpoint??1}={}){
  if(!Number.isInteger(startScene)||startScene<1||startScene>24)throw new Error("DAY15_V4_INVALID_START_SCENE");
  const checkpoint=state?.storyFlags?.day15V4SceneCheckpoint??1;if(startScene!==checkpoint)throw new Error(`DAY15_V4_START_CHECKPOINT_MISMATCH:${startScene}:${checkpoint}`);
  const scenes=[];for(const number of routeSequence(state,startScene)){let scene=getDay15V4ImmersiveScene(state,number);if(scene.omitted)continue;
    const next=getNextDay15V4Choice(state);if(number===6&&startScene===6&&[4,5].includes(next?.number)){const choice=scene.steps.findLast(step=>step.type==="choice");if(!choice)throw new Error(`DAY15_V4_RESUME_CHOICE_MISSING:${next.number}`);const scaffolding=scene.steps.filter(step=>["transition","sfx","characterEnter","ambientHold"].includes(step.type));scene=f({...scene,steps:f([...scaffolding,choice])});}
    scenes.push(scene);if(scene.hasUnresolvedChoice)break;}
  const awaitingChoice=scenes.at(-1)?.hasUnresolvedChoice===true,steps=scenes.flatMap(scene=>scene.steps);
  if(!awaitingChoice&&scenes.at(-1)?.number===24)steps.push(state?.storyFlags?.day15V4Completed===true?f({type:"sceneEnd",day:15,complete:true,nextHook:"day16-jihoon-contact-pending"}):f({type:"chapterCompletionCue",day:15,finalSceneReached:true}));
  return f({startScene,stopScene:scenes.at(-1)?.number??startScene,awaitingChoice,scenes:f(scenes),steps:f(steps)});
}

function frontReaction(state,number){
  const sceneNumber=choiceSceneNumber(state.storyFlags,number),id=state.storyFlags[`day15V4Choice${number}`];
  if(DAY15_V4_CHOICE_IDS.get(id)!==number)throw new Error(`DAY15_V4_REACTION_CHOICE_INVALID:${number}:${id}`);
  const scene=getDay15V4ResolvedScene01To12(state,sceneNumber);
  if(scene.omitted||!scene.selectedChoiceIds.includes(id))throw new Error(`DAY15_V4_REACTION_MISSING:${number}:${id}`);
  const reaction=sceneNumber===6?scene.choiceReactionStepsByNumber[number]:scene.choiceReactionSteps;
  if(!Array.isArray(reaction)||reaction.length===0)throw new Error(`DAY15_V4_REACTION_MISSING:${number}:${id}`);
  return reaction;
}
export function getDay15V4ChoiceContinuation(state,choiceNumber){
  const choice=DAY15_V4_CHOICES[choiceNumber-1];if(!choice)throw new Error("DAY15_V4_UNKNOWN_CONTINUATION");
  const selectedId=state?.storyFlags?.[`day15V4Choice${choiceNumber}`];if(!selectedId)throw new Error("DAY15_V4_CHOICE_NOT_APPLIED");
  if(state.storyFlags.day15V4ChoiceIndex!==choiceNumber)throw new Error(`DAY15_V4_CONTINUATION_STALE:${choiceNumber}:${state.storyFlags.day15V4ChoiceIndex}`);
  const sceneNumber=choiceSceneNumber(state.storyFlags,choiceNumber),lateScene=sceneNumber<=12?null:getDay15V4ResolvedScene13To24(state,sceneNumber),reaction=sceneNumber<=12?frontReaction(state,choiceNumber):lateScene.choiceReactionSteps;
  if(lateScene&&(lateScene.omitted||lateScene.selectedChoiceId!==selectedId)||!Array.isArray(reaction)||reaction.length===0)throw new Error(`DAY15_V4_REACTION_MISSING:${choiceNumber}:${selectedId}`);
  const converted=reaction.map(convertStep),checkpoint=state.storyFlags.day15V4SceneCheckpoint;
  if(checkpoint===sceneNumber){const current=getDay15V4ImmersiveScene(state,sceneNumber),nextChoice=current.steps.findLast(step=>step.type==="choice");return f([...converted,...(nextChoice?[nextChoice]:[])]);}
  return f([...converted,...getDay15V4ImmersiveSegment(state,{startScene:checkpoint}).steps]);
}

export function validateDay15V4ImmersiveAdapter(state){const segment=getDay15V4ImmersiveSegment(state);return validateDay15V4PresentationData()&&segment.steps[0]?.type==="transition"&&segment.scenes.length>0;}
export const DAY15_V4_IMMERSIVE_CHOICE_COUNT=DAY15_V4_CHOICES.length;
