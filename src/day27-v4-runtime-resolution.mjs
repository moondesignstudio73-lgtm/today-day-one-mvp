export function getDay27V4RuntimeResolution(state,step){const chapter=state?.storyFlags?.day27V4;
  if(step?.type==='day27ConversationCue'){const method=chapter?.input?.currentEnergy<30?'CALL':step.target==='HAEUN'?'IN_PERSON':'CALL';return {type:'day27ConversationResponse',target:step.target,outcome:'ACCEPTED',method};}
  if(step?.type==='day27TruthRecipientCue'){const outcome=chapter?.facts?.truthAnswer==='ADMIT_LIE'||chapter?.facts?.truthAnswer==='INTENDED_END'?'CONTINUE':'END_TODAY';return {type:'day27TruthRecipientResponse',recipient:step.recipient,outcome};}
  if(step?.type==='day27HaeunListeningCue'){const outcome=chapter?.facts?.haeunDisclosure==='HIDE'?'DEFER':'LISTEN';return {type:'day27HaeunListeningResponse',outcome};}
  if(step?.type==='day27RelationshipCue'){const end=chapter?.facts?.conversationEnd==='END_RELATIONSHIP',hard=chapter?.facts?.wish==='BLAME_MEMORY'||chapter?.facts?.memoryResponse==='USE_GOOD_MEMORY';return {type:'day27RelationshipResponse',outcome:end?'END':hard?'PAUSE':'CONTINUE',contactAllowed:!end&&!hard};}
  if(step?.type==='day27JihoonCue')return {type:'day27JihoonResponse',available:chapter?.input?.jihoonKnown===true};
  if(step?.type==='day27NextTalkCue')return {type:'day27NextTalkResponse',outcome:chapter?.facts?.nextTalk==='SHORT_MEETING'?'ACCEPTED':'DEFERRED'};
  throw new Error('DAY27_RUNTIME_RESOLUTION_UNKNOWN');
}
