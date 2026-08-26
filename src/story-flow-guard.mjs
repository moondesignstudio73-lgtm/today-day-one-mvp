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
