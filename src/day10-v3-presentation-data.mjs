const HOME_DAY="assets/backgrounds/day2/day2-protagonist-bedroom-afternoon-v2.png";
const MARKET="assets/backgrounds/day6/day6-neighborhood-market-day-v1.png";
const HOME_NIGHT="assets/backgrounds/day4/day4-home-night-consistent-v1.png";
const HAEUN="assets/characters/story-outfits/haeun-day9-gray-blue-shirt-2d-v1.png";
const MEAL_CG="assets/events/locations/haeun-home-meal-01.png";

const backgroundFor=number=>number<=4?HOME_DAY:number===5?MARKET:number<=12?HOME_DAY:HOME_NIGHT;
const characterFor=number=>number===2||number>=13?"girlfriend":null;
const eventCgFor=number=>number>=17&&number<=20?MEAL_CG:null;
const sfxFor=number=>({1:["SFX_PENCIL_NOTE"],2:["SFX_SPARE_PHONE_KEY"],5:["SFX_AUTO_DOOR"],6:["SFX_BAG_ZIPPER"],9:["SFX_PAN_SIZZLE"],13:["SFX_DOORBELL"],16:["SFX_CHAIR_MOVE"],20:["SFX_DISH_WASH"],23:["SFX_HOME_KEY_UNLOCK"],24:["SFX_PENCIL_NOTE"]}[number]??[]);

export const DAY10_V3_PRESENTATION_SCENES=Object.freeze(Object.fromEntries(Array.from({length:24},(_,index)=>index+1).map(number=>{
  const eventCgUrl=eventCgFor(number),night=number>=13;
  return [`D10V3_S${String(number).padStart(2,"0")}`,Object.freeze({
    sceneNumber:number,backgroundUrl:backgroundFor(number),characterId:characterFor(number),characterAssetUrl:characterFor(number)?HAEUN:null,eventCgUrl,
    camera:eventCgUrl?"event-cg-safe":"medium-safe",transition:[1,5,7,13,20,24].includes(number)?"fade":"crossfade",
    bgm:Object.freeze({category:night?"daily":"daily",variant:night?1:0,volume:[14,15,16].includes(number)?0.05:0.06}),
    sfx:Object.freeze(sfxFor(number)),safeArea:Object.freeze({desktop:"center-80",mobile:"center-60",objectPosition:"50% 46%"}),assetStatus:"ready-reuse"
  })];
})));

export function getDay10V3Presentation(sceneNumber,state={}){
  const base=DAY10_V3_PRESENTATION_SCENES[`D10V3_S${String(sceneNumber).padStart(2,"0")}`];if(!base)return null;
  const flags=state.storyFlags??state;
  let eventCgUrl=base.eventCgUrl,characterId=base.characterId,characterAssetUrl=base.characterAssetUrl;
  if(sceneNumber>=17&&sceneNumber<=20&&(flags.day10V3DinnerAgreement!=="SHARED_AT_SEVEN"||flags.day10V3Departure==="HAEUN_LEAVES"))eventCgUrl=null;
  if(sceneNumber>=17&&flags.day10V3Departure==="HAEUN_LEAVES"){characterId=null;characterAssetUrl=null;}
  return Object.freeze({...base,eventCgUrl,characterId,characterAssetUrl});
}

export function validateDay10V3PresentationAudit(){
  const all=Object.values(DAY10_V3_PRESENTATION_SCENES);
  return all.length===24&&all.every((scene,index)=>scene.sceneNumber===index+1&&scene.backgroundUrl&&scene.assetStatus==="ready-reuse"&&scene.safeArea.mobile==="center-60"&&scene.bgm.volume>=0.05&&scene.bgm.volume<=0.06);
}

export const DAY10_V3_READY_ASSETS=Object.freeze({homeDay:HOME_DAY,market:MARKET,homeNight:HOME_NIGHT,haeun:HAEUN,mealCg:MEAL_CG});
