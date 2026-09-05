export function getDay21V4RuntimeResolution(state,step){
  const chapter=state?.storyFlags?.day21V4;
  if(step?.type==='contactConsentCue'){
    if(!['HUG','HAND'].includes(step.contact))throw new Error('DAY21_RUNTIME_CONTACT_INVALID');
    return {type:'haeunContactResponse',contact:step.contact,accepted:chapter?.input?.contactAllowed===true&&chapter?.input?.relationshipTone==='CALM'};
  }
  if(step?.type==='lodgingConsentCue')return {type:'haeunLodgingResponse',accepted:chapter?.input?.contactAllowed===true&&chapter?.input?.relationshipTone==='CALM'};
  if(step?.type==='travelConfirmationCue'){
    const quote=state?.storyFlags?.day21V4TravelQuote;
    if(!quote)return {type:'travelConfirmation',confirmed:false,dateConfirmed:false,transportConfirmed:false,budgetConfirmed:false,lodgingConfirmed:false,mutualConsent:false};
    const overnight=step.overnight===true,confirmed=typeof quote.quoteId==='string'&&quote.quoteId.length>0&&Number.isFinite(quote.playerCost)&&quote.playerCost>0&&quote.dateConfirmed===true&&quote.transportConfirmed===true&&quote.budgetConfirmed===true&&quote.mutualConsent===true&&(!overnight||quote.lodgingConfirmed===true);
    return {type:'travelConfirmation',confirmed,dateConfirmed:quote.dateConfirmed===true,transportConfirmed:quote.transportConfirmed===true,budgetConfirmed:quote.budgetConfirmed===true,lodgingConfirmed:quote.lodgingConfirmed===true,mutualConsent:quote.mutualConsent===true,...(confirmed?{quoteId:quote.quoteId,playerCost:quote.playerCost}:{})};
  }
  throw new Error('DAY21_RUNTIME_RESOLUTION_UNKNOWN');
}
