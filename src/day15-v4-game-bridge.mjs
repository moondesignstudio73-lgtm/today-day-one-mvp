import {getDay15V4Compatibility,beginDay15V4} from "./day15-v4-state-contract.mjs";
import {applyDay15V4Choice,completeDay15V4,offerDay15V4PublicMaterial} from "./day15-v4-runtime.mjs";
import {getDay15V4ChoiceContinuation,getDay15V4ImmersiveSegment,getDay15V4ResumePresentation} from "./day15-v4-immersive-adapter.mjs";

const freeze=Object.freeze;

function assertV4(state){
  const compatibility=getDay15V4Compatibility(state);
  if(compatibility.mode!=="V4")throw new Error(`DAY15_V4_GAME_BRIDGE_REQUIRES_V4:${compatibility.mode}`);
  return compatibility;
}

function offerPublicMaterialAtCheckpoint(state){
  const flags=state.storyFlags;
  if(flags.day15V4SceneCheckpoint===22&&flags.day15V4Choice11!=null&&flags.day15V4HaeunLeft!==true&&flags.day15V4PublicMaterialOffered!==true)offerDay15V4PublicMaterial(state);
}

export function prepareDay15V4GameEntry(state,{relationshipBand="LOW",haeunCallsTonight=false}={}){
  let compatibility=getDay15V4Compatibility(state);
  if(compatibility.mode==="V4_NEW")compatibility=beginDay15V4(state,{relationshipBand,haeunCallsTonight});
  if(compatibility.mode==="V4"){
    offerPublicMaterialAtCheckpoint(state);
    compatibility=getDay15V4Compatibility(state);
  }
  return compatibility;
}

export function getDay15V4GameResumePresentation(state){
  assertV4(state);
  return getDay15V4ResumePresentation(state);
}

export function getDay15V4GameSegment(state){
  assertV4(state);
  return getDay15V4ImmersiveSegment(state).steps;
}

export function applyDay15V4GameChoice(state,choiceId){
  assertV4(state);
  const result=applyDay15V4Choice(state,choiceId);
  offerPublicMaterialAtCheckpoint(state);
  return freeze({result,steps:getDay15V4ChoiceContinuation(state,result.choiceNumber)});
}

export function completeDay15V4GameChapter(state,cue){
  const compatibility=assertV4(state);
  const sceneEnd=freeze({type:"sceneEnd",day:15,complete:true,nextHook:"day16-jihoon-contact-pending"});
  if(compatibility.complete===true)return sceneEnd;
  if(cue?.type!=="chapterCompletionCue"||cue.day!==15||cue.finalSceneReached!==true)throw new Error("DAY15_V4_GAME_COMPLETION_CUE_INVALID");
  const expectedCue=getDay15V4ImmersiveSegment(state).steps.at(-1);
  if(expectedCue?.type!=="chapterCompletionCue"||expectedCue.day!==15||expectedCue.finalSceneReached!==true)throw new Error("DAY15_V4_GAME_COMPLETION_STATE_INVALID");
  completeDay15V4(state,{finalSceneReached:true});
  return sceneEnd;
}

export {getDay15V4Compatibility};
