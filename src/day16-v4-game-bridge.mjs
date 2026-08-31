import {getDay16V4Compatibility,beginDay16V4} from "./day16-v4-state-contract.mjs";
import {applyDay16V4Choice,completeDay16V4} from "./day16-v4-runtime.mjs";
import {getDay16V4ChoiceContinuation,getDay16V4ImmersiveSegment,getDay16V4ResumePresentation} from "./day16-v4-immersive-adapter.mjs";

const f=Object.freeze;
const BLOCKED_ENDED_RELATIONSHIP_OPTION="day16_v4_current_name_haeun";

export function getDay16V4GameContext(state){
  return f({allowMorningNoContact:true,haeunRelationshipActive:state?.breakup==null&&state?.ended!==true});
}

function assertV4(state){
  const compatibility=getDay16V4Compatibility(state);
  if(compatibility.mode!=="V4")throw new Error(`DAY16_V4_GAME_BRIDGE_REQUIRES_V4:${compatibility.mode}`);
  return compatibility;
}

export function prepareDay16V4GameEntry(state){
  const compatibility=getDay16V4Compatibility(state);
  return compatibility.mode==="V4_NEW"?beginDay16V4(state):compatibility;
}

export function getDay16V4GameResumePresentation(state){assertV4(state);return getDay16V4ResumePresentation(state);}
export function getDay16V4GameSegment(state){assertV4(state);return getDay16V4ImmersiveSegment(state,getDay16V4GameContext(state));}

export function applyDay16V4GameChoice(state,choiceId){
  assertV4(state);
  const context=getDay16V4GameContext(state);
  if(context.haeunRelationshipActive!==true&&choiceId===BLOCKED_ENDED_RELATIONSHIP_OPTION)throw new Error("DAY16_V4_SOURCE_LOCKED:CHOICE6_ENDED_RELATIONSHIP_REACTION");
  const runtimeContext=choiceId==="day16_v4_contact_ask_next"?{...context,yuriAcceptedContact:true}:context;
  const result=applyDay16V4Choice(state,choiceId,runtimeContext);
  return f({result,steps:getDay16V4ChoiceContinuation(state,result.choiceNumber,runtimeContext)});
}

export function completeDay16V4GameChapter(state,cue){
  const compatibility=assertV4(state),sceneEnd=f({type:"sceneEnd",day:16,complete:true,nextHook:"day17-body-check-pending"});
  if(compatibility.complete===true)return sceneEnd;
  if(cue?.type!=="chapterCompletionCue"||cue.day!==16||cue.finalSceneReached!==true)throw new Error("DAY16_V4_GAME_COMPLETION_CUE_INVALID");
  const expected=getDay16V4ImmersiveSegment(state,getDay16V4GameContext(state)).at(-1);
  if(expected?.type!=="chapterCompletionCue"||expected.day!==16||expected.finalSceneReached!==true)throw new Error("DAY16_V4_GAME_COMPLETION_STATE_INVALID");
  completeDay16V4(state,{finalSceneReached:true});
  return sceneEnd;
}

export {getDay16V4Compatibility};
