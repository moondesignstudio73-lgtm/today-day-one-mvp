export function getDay28V4RuntimeResolution(state,step){const chapter=state?.storyFlags?.day28V4;
  if(step?.type==='day28MeetingCue')return {type:'day28MeetingResponse',target:step.target,outcome:'ACCEPTED',method:chapter?.facts?.morningPlan==='SHORT'&&chapter?.input?.currentEnergy<30?'CALL':'IN_PERSON'};
  if(step?.type==='day28RelationshipCue'){const wish=chapter?.facts?.relationshipWish,outcome=wish==='END_WELL'?'END':wish==='KNOW_AGAIN'?'KNOW_AGAIN':'CONTINUE';return {type:'day28RelationshipResponse',outcome,contactAllowed:outcome!=='END'};}
  if(step?.type==='day28ContactCue'){const outcome=step.contact==='KISS'&&!chapter?.input?.trustForIntimacy?'DECLINED':'ACCEPTED';return {type:'day28ContactResponse',contact:step.contact,outcome};}
  if(step?.type==='day28HomeInvitationCue')return {type:'day28HomeInvitationResponse',accepted:false,location:'OUTSIDE'};
  if(step?.type==='day28NextMeetingCue')return {type:'day28NextMeetingResponse',outcome:'DEFERRED'};
  if(step?.type==='day28NewRelationshipCue')return {type:'day28NewRelationshipResponse',recipient:step.recipient,outcome:'NEED_TIME'};
  throw new Error('DAY28_RUNTIME_RESOLUTION_UNKNOWN');
}
