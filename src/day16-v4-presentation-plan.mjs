import {getDay16V4ActiveSceneNumbers,resolveDay16V4Scene} from "./day16-v4-branch-resolver.mjs";
import {getNextDay16V4Choice} from "./day16-v4-runtime.mjs";
import {getDay16V4Compatibility} from "./day16-v4-state-contract.mjs";
import {getDay16V4PlayerFacingSceneSteps} from "./day16-v4-scene-steps.mjs";

const f=Object.freeze;

function assertV4(state){
  const compatibility=getDay16V4Compatibility(state);
  if(compatibility.mode!=="V4")throw new Error(`DAY16_V4_PRESENTATION_REQUIRES_V4:${compatibility.mode}`);
  return state.storyFlags;
}

export function getDay16V4SceneEnvelope(state,sceneNumber,context={}){
  assertV4(state);
  const resolved=resolveDay16V4Scene(state,sceneNumber,context);
  if(resolved.status!=="ACTIVE")return f({status:resolved.status,sceneNumber});
  const next=getNextDay16V4Choice(state,context),unresolved=next?.number===resolved.choice?.number;
  const playerFacing=getDay16V4PlayerFacingSceneSteps(state,sceneNumber,context);
  return f({
    status:"ACTIVE",
    number:sceneNumber,
    id:resolved.source.id,
    title:resolved.source.title,
    variant:resolved.variant,
    sourceMarkdown:resolved.source.sourceMarkdown,
    sourceRole:"verbatim-authority; route-superset; not-directly-renderable",
    playerFacingSteps:playerFacing.steps,
    playerFacingSourceRole:playerFacing.sourceRole,
    unresolvedChoice:unresolved?next:null
  });
}

export function getDay16V4PresentationPlan(state,{startScene=state?.storyFlags?.day16V4SceneCheckpoint??1,...context}={}){
  const flags=assertV4(state),checkpoint=flags.day16V4SceneCheckpoint;
  if(!Number.isInteger(startScene)||startScene<1||startScene>24)throw new Error("DAY16_V4_PRESENTATION_START_INVALID");
  if(startScene!==checkpoint)throw new Error(`DAY16_V4_PRESENTATION_CHECKPOINT_MISMATCH:${startScene}:${checkpoint}`);
  const active=getDay16V4ActiveSceneNumbers(state);
  if(!active.includes(startScene))throw new Error(`DAY16_V4_PRESENTATION_CHECKPOINT_UNREACHABLE:${startScene}`);
  const numbers=active.filter(number=>number>=startScene),scenes=[];
  for(const number of numbers){
    const envelope=getDay16V4SceneEnvelope(state,number,context);
    if(envelope.status!=="ACTIVE")continue;
    scenes.push(envelope);
    if(envelope.unresolvedChoice)break;
  }
  if(scenes.length===0)throw new Error(`DAY16_V4_PRESENTATION_NO_REACHABLE_SCENE:${startScene}`);
  const awaitingChoice=scenes.at(-1).unresolvedChoice!=null,reachedFinal=!awaitingChoice&&scenes.at(-1).number===24;
  return f({
    startScene,
    stopScene:scenes.at(-1).number,
    awaitingChoice,
    reachedFinal,
    completionCue:reachedFinal&&flags.day16V4Completed!==true?f({type:"chapterCompletionCue",day:16,finalSceneReached:true}):null,
    sceneEnd:reachedFinal&&flags.day16V4Completed===true?f({type:"sceneEnd",day:16,complete:true,nextHook:"day17-body-check-pending"}):null,
    scenes:f(scenes)
  });
}
