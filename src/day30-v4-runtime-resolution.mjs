export function getDay30V4RuntimeResolution(state,step){const chapter=state?.storyFlags?.day30V4;
  if(step?.type==='day30MeetingCue'){const target=step.target,same=target===chapter?.input?.meetingCandidate,active=target==='HAEUN'?['CONTINUE','CONTINUING','KNOW_AGAIN'].includes(chapter?.input?.relationshipState)&&chapter?.input?.contactAllowed:chapter?.input?.relationshipState==='NEW_RELATIONSHIP'&&chapter?.input?.newRelationship===target;const outcome=same&&active&&chapter?.facts?.meetingPlan!=='SOLO'?'ACCEPTED':'DECLINED';return {type:'day30MeetingResponse',target,outcome,location:chapter?.input?.meetingLocation??'OUTSIDE'};}
  throw new Error('DAY30_RUNTIME_RESOLUTION_UNKNOWN');
}
