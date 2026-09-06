export function getDay26V4RuntimeResolution(state,step){
  const chapter=state?.storyFlags?.day26V4;
  if(step?.type==='attendanceChangeCue')return {type:'attendanceChangeResponse',accepted:true};
  if(step?.type==='jihoonMealCue')return {type:'jihoonMealResponse',accepted:chapter?.input?.jihoonKnown===true};
  if(step?.type==='newMeetingIntentCue'){
    const outcome=chapter?.facts?.newMeaning==='ROMANCE'?'NEED_TIME':chapter?.facts?.newMeaning==='FRIEND'?'DISTANCE':'RECIPROCATE';
    return {type:'newMeetingIntentResponse',recipient:step.recipient,outcome};
  }
  if(step?.type==='newMeetingTruthCue'){
    const outcome=chapter?.facts?.newLieAnswer==='ENDED'?'CONTINUE':'END_TODAY';
    return {type:'newMeetingTruthResponse',recipient:step.recipient,outcome};
  }
  if(step?.type==='newMeetingNextCue'){
    const outcome=chapter?.facts?.newMeaningResponse==='DISTANCE'?'DECLINED':step.recipient==='YURI'?'ACCEPTED':'DEFERRED';
    return {type:'newMeetingNextResponse',recipient:step.recipient,outcome};
  }
  throw new Error('DAY26_RUNTIME_RESOLUTION_UNKNOWN');
}
