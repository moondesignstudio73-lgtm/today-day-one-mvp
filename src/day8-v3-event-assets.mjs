export const DAY8_V3_EVENT_CG_ASSETS=Object.freeze({
  overfilledWaterGlass:"assets/events/day8-v3/cg-day8-v3-overfilled-water-glass-v1.png",
  movingDayPhotoPhone:"assets/events/day8-v3/cg-day8-v3-moving-day-photo-phone-pov-v1.png",
  publicCreditPhone:"assets/events/day8-v3/cg-day8-v3-public-credit-phone-pov-v1.png",
  liveHouseOffbeatClap:"assets/events/day8-v3/cg-day8-v3-live-house-offbeat-clap-v1.png"
});

export function getDay8V3EventCg(sceneNumber,state={}){
  const flags=state.storyFlags??state;
  if(sceneNumber===5)return DAY8_V3_EVENT_CG_ASSETS.overfilledWaterGlass;
  if(sceneNumber===6&&flags.day8V3JihoonPreparation==="prepare-one-photo"&&flags.day8V3PhotoRequested===true)return DAY8_V3_EVENT_CG_ASSETS.movingDayPhotoPhone;
  if(sceneNumber===12)return DAY8_V3_EVENT_CG_ASSETS.publicCreditPhone;
  if(sceneNumber===15&&flags.day8V3AfternoonRoute==="LIVE_HOUSE")return DAY8_V3_EVENT_CG_ASSETS.liveHouseOffbeatClap;
  return null;
}
