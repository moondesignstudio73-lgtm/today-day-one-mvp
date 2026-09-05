export function getDay24V4RuntimeResolution(state,step){
  const chapter=state?.storyFlags?.day24V4;
  if(step?.type==='haeunConversationCue'){
    if(chapter?.input?.contactAllowed!==true)return {type:'haeunConversationResponse',accepted:false};
    const method=chapter.input.priorConversation?.method;
    return {type:'haeunConversationResponse',accepted:true,mode:method==='PHONE'?'PHONE':'MEET'};
  }
  if(step?.type==='haeunRelationshipCue'){
    const proposal=chapter?.facts?.relationshipProposal;
    const outcome=proposal==='BREAK_UP'?'END':proposal==='NEED_TIME'?'DEFER':chapter?.input?.relationshipTone==='CALM'?'CONTINUE':'DEFER';
    return {type:'haeunRelationshipResponse',outcome};
  }
  if(step?.type==='relationshipStatusClarificationCue')return {type:'relationshipStatusClarification',corrected:false};
  if(step?.type==='otherContactResponseCue')return {type:'otherContactResponse',outcome:step.allowMeeting===true?'ACCEPT_MEETING':'ACKNOWLEDGED'};
  if(step?.type==='haeunFutureTalkCue'){
    const accepted=chapter?.input?.contactAllowed===true&&chapter?.facts?.haeunRelationshipOutcome==='CONTINUE';
    const time=accepted?(chapter.facts.futureTalkPlan==='TOMORROW_MEAL'?'내일 저녁':chapter.facts.futureTalkPlan==='SCHEDULE'?'서로 가능한 때':null):null;
    return {type:'haeunFutureTalkResponse',accepted,time};
  }
  throw new Error('DAY24_RUNTIME_RESOLUTION_UNKNOWN');
}
