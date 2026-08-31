import {getDay16V4ChoiceReaction} from "./day16-v4-choice-reactions.mjs";
import {getDay16V4PresentationPlan} from "./day16-v4-presentation-plan.mjs";
import {getDay16V4CheckpointAfterChoice} from "./day16-v4-runtime.mjs";
import {getDay16V4Compatibility} from "./day16-v4-state-contract.mjs";

const f=Object.freeze;

function assertV4(state){
  const compatibility=getDay16V4Compatibility(state);
  if(compatibility.mode!=="V4")throw new Error(`DAY16_V4_CONTINUATION_REQUIRES_V4:${compatibility.mode}`);
  return state.storyFlags;
}

export function composeDay16V4Continuation(state,{afterChoiceNumber,...context}={}){
  const flags=assertV4(state);
  if(!Number.isInteger(afterChoiceNumber)||afterChoiceNumber<1||afterChoiceNumber>12)throw new Error("DAY16_V4_CONTINUATION_CHOICE_INVALID");
  if(flags.day16V4ChoiceIndex!==afterChoiceNumber)throw new Error(`DAY16_V4_CONTINUATION_NOT_LATEST_CHOICE:${afterChoiceNumber}:${flags.day16V4ChoiceIndex}`);
  const checkpoint=getDay16V4CheckpointAfterChoice(state,afterChoiceNumber);
  if(flags.day16V4SceneCheckpoint!==checkpoint)throw new Error(`DAY16_V4_CONTINUATION_CHECKPOINT_MISMATCH:${flags.day16V4SceneCheckpoint}:${checkpoint}`);
  const reaction=getDay16V4ChoiceReaction(state,afterChoiceNumber);
  const plan=getDay16V4PresentationPlan(state,{...context,startScene:checkpoint});
  const sequence=f([
    f({type:"choiceReaction",sceneNumber:reaction.sourceSceneNumber,optionId:reaction.optionId,steps:reaction.steps}),
    ...plan.scenes.map(scene=>f({type:"sceneEnvelope",sceneNumber:scene.number,envelope:scene}))
  ]);
  return f({
    afterChoiceNumber,
    optionId:reaction.optionId,
    checkpoint,
    sequenceRole:"exact-selected-reaction-then-safe-scene-envelopes; render-envelope-playerFacingSteps-only",
    reaction,
    plan,
    sequence
  });
}
