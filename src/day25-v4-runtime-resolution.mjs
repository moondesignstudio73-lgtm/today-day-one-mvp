export function getDay25V4RuntimeResolution(state,step){
  const chapter=state?.storyFlags?.day25V4;
  if(step?.type==='haeunMealLocationCue'){
    const special=step.requested==='SPECIAL',fit=!special||chapter?.input?.currentMoney>=100000,accepted=chapter?.input?.relationshipActive===true&&fit;
    return {type:'haeunMealLocationResponse',accepted,costTimeFit:special&&accepted};
  }
  if(step?.type==='haeunFutureCue'){
    const proposal=chapter?.facts?.proposal;
    const outcome=proposal==='PREPARE_MARRIAGE'?(chapter?.input?.trustEligible?'PREPARE_MARRIAGE':'REDISCUSS'):proposal==='LONG_DATING'?(chapter?.input?.relationshipTone==='CALM'?'LONG_DATING':'REDISCUSS'):proposal==='FUTURES_DIFFER'?'END':'REDISCUSS';
    return {type:'haeunFutureResponse',outcome};
  }
  if(step?.type==='haeunContactCue')return {type:'haeunContactResponse',contact:step.contact,accepted:chapter?.facts?.relationshipContinues===true&&(step.contact!=='KISS'||chapter?.input?.trustEligible===true)};
  if(step?.type==='newMeetingCue')return {type:'newMeetingResponse',recipient:step.recipient,outcome:chapter?.facts?.newMeetingMessage==='SLOW_DOWN'?'RESCHEDULED':'ACCEPTED'};
  if(step?.type==='friendAvailabilityCue')return {type:'friendAvailabilityResponse',jihoonAvailable:chapter?.input?.jihoonKnown===true,soraAvailable:chapter?.input?.soraKnown===true};
  throw new Error('DAY25_RUNTIME_RESOLUTION_UNKNOWN');
}
