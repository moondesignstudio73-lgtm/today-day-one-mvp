export function getDay20V4RuntimeResolution(chapter,step){
  if(step?.type==='haeunContactResolution'){
    if(!['HUG','HAND'].includes(step.contact))throw new Error('DAY20_RUNTIME_CONTACT_INVALID');
    return {type:'haeunContactResponse',contact:step.contact,accepted:true};
  }
  if(step?.type==='haeunStayResolution'){
    const prepared=chapter?.facts?.eveningExtension==='MUTUAL_MORE_TIME'&&chapter?.facts?.nextInvitation==='MUTUAL_SIMILAR_EVENING';
    return {type:'haeunStayResponse',accepted:prepared,prepared,sleepingPlan:'SEPARATE_BEDDING'};
  }
  throw new Error('DAY20_RUNTIME_RESOLUTION_UNKNOWN');
}
