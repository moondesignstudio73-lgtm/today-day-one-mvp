export const DAY8_V3_EVENT_CG_ASSETS=Object.freeze({
  overfilledWaterGlass:"assets/events/day8-v3/cg-day8-v3-overfilled-water-glass-v1.png",
  movingDayPhotoPhone:"assets/events/day8-v3/cg-day8-v3-moving-day-photo-phone-pov-v1.png"
});

export function getDay8V3EventCg(sceneNumber,state={}){
  const flags=state.storyFlags??state;
  if(sceneNumber===5)return DAY8_V3_EVENT_CG_ASSETS.overfilledWaterGlass;
  if(sceneNumber===6&&flags.day8V3JihoonPreparation==="prepare-one-photo"&&flags.day8V3PhotoRequested===true)return DAY8_V3_EVENT_CG_ASSETS.movingDayPhotoPhone;
  return null;
}
