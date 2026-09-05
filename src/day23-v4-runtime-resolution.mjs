export const DAY23_V4_SOUVENIR_COST=3000;
export const DAY23_V4_SOUVENIR_ITEM='day23-small-postcard';

export function getDay23V4RuntimeResolution(state,step){
  const chapter=state?.storyFlags?.day23V4;
  if(step?.type==='photoConsentCue')return {type:'haeunPhotoResponse',accepted:chapter?.input?.contactAllowed===true&&chapter?.input?.relationshipTone!=='DIFFICULT'};
  if(step?.type==='souvenirPurchaseCue'){const purchased=chapter?.input?.route==='BUSAN_TRIP'&&Number.isFinite(state?.money)&&state.money>=DAY23_V4_SOUVENIR_COST;return purchased?{type:'souvenirPurchaseResponse',purchased:true,itemId:DAY23_V4_SOUVENIR_ITEM,cost:DAY23_V4_SOUVENIR_COST}:{type:'souvenirPurchaseResponse',purchased:false};}
  if(step?.type==='relationshipConsentCue'){const outcome=chapter?.input?.relationshipTone==='CALM'?'CONTINUE':chapter?.input?.relationshipTone==='QUIET'?'DISCUSS':'UNSURE';return {type:'haeunRelationshipResponse',outcome};}
  if(step?.type==='farewellContactConsentCue')return {type:'haeunFarewellContactResponse',accepted:chapter?.input?.contactAllowed===true&&chapter?.input?.relationshipTone==='CALM'};
  if(step?.type==='meetingConsentCue')return {type:'haeunMeetingResponse',accepted:chapter?.input?.contactAllowed===true&&chapter?.input?.relationshipTone==='CALM'};
  if(step?.type==='conversationConsentCue')return {type:'haeunConversationResponse',accepted:chapter?.input?.contactAllowed===true&&chapter?.facts?.haeunRelationshipOutcome!=='DECLINE'};
  throw new Error('DAY23_RUNTIME_RESOLUTION_UNKNOWN');
}
