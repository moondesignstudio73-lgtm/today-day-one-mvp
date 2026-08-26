export function isStoryRecorded(state,sceneId){return Boolean(sceneId&&(state.storyHistory??[]).some(record=>record.sceneId===sceneId));}

export function isStoryFreeActionResume(state,sceneId){return Boolean(sceneId&&state.storyFreeAction?.storySceneId===sceneId&&state.storyFreeAction.status!=="COMPLETE");}

export function shouldClaimStoryPending(state,sceneId){return !isStoryRecorded(state,sceneId)&&!isStoryFreeActionResume(state,sceneId);}

export function reconcileCompletedStoryFreeAction(state,sceneId=state.pendingStoryId){
  const complete=state.storyFreeAction?.status==="COMPLETE"&&state.storyFreeAction.storySceneId===sceneId;
  if(!complete||!isStoryRecorded(state,sceneId)||state.pendingStoryId!==sceneId)return false;
  state.pendingStoryId=null;return true;
}

export function prepareCampaignDayAdvance(state,sceneId){
  const match=String(sceneId??"").match(/^m30-day(\d+)-/),completedDay=Number(match?.[1]);
  if(!Number.isInteger(completedDay)||completedDay!==state.day||!isStoryRecorded(state,sceneId))return null;
  state.pendingStoryId=null;state.day=completedDay+1;state.phase=0;state.selected=null;return completedDay;
}

export const STORY_UI_STATES=Object.freeze({IDLE:"STORY_IDLE",DIALOGUE:"STORY_DIALOGUE",CHOICE:"STORY_CHOICE",EXPLORATION:"STORY_EXPLORATION",TRANSITION:"STORY_TRANSITION",FREE_ACTION:"STORY_FREE_ACTION",DAY_END:"STORY_DAY_END"});

export function deriveStoryUiState({runtimeState="IDLE",stepType=null,exploration=false,freeActionStatus=null}={}){
  if(freeActionStatus&&freeActionStatus!=="COMPLETE")return STORY_UI_STATES.FREE_ACTION;
  if(stepType==="freeAction")return STORY_UI_STATES.FREE_ACTION;
  if(stepType==="sceneEnd")return STORY_UI_STATES.DAY_END;
  if(stepType==="choice")return exploration?STORY_UI_STATES.EXPLORATION:STORY_UI_STATES.CHOICE;
  if(runtimeState==="TRANSITIONING"||stepType==="transition")return STORY_UI_STATES.TRANSITION;
  if(["WAITING_DIALOGUE","PLAYING","RESOLVING"].includes(runtimeState))return STORY_UI_STATES.DIALOGUE;
  return STORY_UI_STATES.IDLE;
}

export function getStoryUiInvariantViolations({storyMode=false,storyState=STORY_UI_STATES.IDLE,sharedEventChoiceActive=false,actionGridVisible=false,nextButtonVisible=false,storyChoiceVisible=false,storyFreeActionVisible=false}={}){
  const violations=[];
  if(storyMode&&(actionGridVisible||nextButtonVisible))violations.push("FREE_ACTION_GRID_VISIBLE_IN_STORY_MODE");
  if(storyMode&&storyChoiceVisible&&![STORY_UI_STATES.CHOICE,STORY_UI_STATES.EXPLORATION].includes(storyState))violations.push("STORY_CHOICE_VISIBLE_OUTSIDE_CHOICE");
  if(storyMode&&storyFreeActionVisible&&storyState!==STORY_UI_STATES.FREE_ACTION)violations.push("STORY_FREE_ACTION_VISIBLE_OUTSIDE_WINDOW");
  if(!storyMode&&storyChoiceVisible&&!sharedEventChoiceActive)violations.push("STORY_CHOICE_VISIBLE_WITHOUT_FREE_EVENT");
  if(!storyMode&&storyFreeActionVisible)violations.push("STORY_FREE_ACTION_VISIBLE_IN_FREE_MODE");
  return violations;
}
