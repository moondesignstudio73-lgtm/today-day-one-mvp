import {DAY8_V3_SCENES} from "./day8-v3-campaign-data.mjs";
import {getMapLocationAsset} from "./map-location-assets.mjs";
import {getDay8V3EventCg} from "./day8-v3-event-assets.mjs";

const HOME_MORNING="assets/backgrounds/day4/day4-bedroom-morning-v1.png";
const HOME_EXTERIOR="assets/backgrounds/day2/day2-home-exterior-afternoon-v1.png";
const STREET="assets/backgrounds/street/BG_RELATIONSHIP_STREET_DAY_001.png";
const HOME_NIGHT="assets/backgrounds/day4/day4-home-night-consistent-v1.png";
const JIHOON=Object.freeze({
  warm:"assets/characters/day4/jihoon-day4-warm-tease-v1.png",
  serious:"assets/characters/day4/jihoon-day4-serious-testimony-v1.png",
  cautious:"assets/characters/day4/jihoon-day4-cautious-greeting-v1.png"
});
const ROUTE=Object.freeze({
  LIVE_HOUSE:getMapLocationAsset("live-house"),
  CAFE:getMapLocationAsset("small-cafe"),
  HOME:HOME_NIGHT
});
const backgroundFor=n=>n<=3?HOME_MORNING:n===4?HOME_EXTERIOR:n<=10?getMapLocationAsset("china-diner"):n<=14?STREET:n<=17?STREET:HOME_NIGHT;
const sfxFor=n=>({1:["SFX_SPARE_PHONE_KEY"],4:["SFX_AUTO_DOOR"],5:["SFX_CUP_SET_DOWN"],6:["SFX_PHONE_SCREEN_OFF"],12:["SFX_SPARE_PHONE_KEY"],18:["SFX_HOME_KEY_UNLOCK"],24:["SFX_SPARE_PHONE_KEY"]}[n]??[]);
const jihoonAssetFor=n=>n<=7?JIHOON.warm:n<=12?JIHOON.serious:JIHOON.cautious;

export const DAY8_V3_PRESENTATION_SCENES=Object.freeze(Object.fromEntries(DAY8_V3_SCENES.map(scene=>[scene.id,Object.freeze({
  sceneNumber:scene.number,
  backgroundId:`day8-v3-scene-${scene.number}`,
  backgroundUrl:backgroundFor(scene.number),
  characterId:scene.number>=4&&scene.number<=17?"jihoon":null,
  characterAssetUrl:scene.number>=4&&scene.number<=17?jihoonAssetFor(scene.number):null,
  expressionId:scene.number>=8&&scene.number<=12?"serious":"warm",
  poseId:"standing",
  camera:[5,6,12,15,24].includes(scene.number)?"event-cg-safe":"medium-safe",
  transition:[1,4,15,18,24].includes(scene.number)?"fade":"crossfade",
  bgm:Object.freeze({category:scene.number>=4&&scene.number<=17?"dateShopping":"daily",variant:0,volume:0.06}),
  sfx:Object.freeze(sfxFor(scene.number)),
  safeArea:Object.freeze({desktop:"center-80",mobile:"center-60",objectPosition:"50% 50%"}),
  assetStatus:"ready-v3"
})])));

export function getDay8V3Presentation(sceneNumber,state={}){
  const base=DAY8_V3_PRESENTATION_SCENES[`D8V3_S${String(sceneNumber).padStart(2,"0")}`];
  if(!base)return null;
  const flags=state.storyFlags??state;
  const route=flags.day8V3AfternoonRoute;
  const routed=sceneNumber>=15&&sceneNumber<=17&&ROUTE[route];
  return Object.freeze({...base,
    backgroundId:routed?`day8-v3-route-${route.toLowerCase()}`:base.backgroundId,
    backgroundUrl:routed||base.backgroundUrl,
    characterId:route==="HOME"&&sceneNumber>=15&&sceneNumber<=17?null:base.characterId,
    characterAssetUrl:route==="HOME"&&sceneNumber>=15&&sceneNumber<=17?null:base.characterAssetUrl,
    eventCgUrl:getDay8V3EventCg(sceneNumber,state)
  });
}

export function validateDay8V3PresentationData(){
  const values=Object.values(DAY8_V3_PRESENTATION_SCENES);
  return values.length===24&&values.every(view=>typeof view.backgroundUrl==="string"&&view.assetStatus==="ready-v3"&&["daily","dateShopping"].includes(view.bgm.category)&&view.bgm.volume>=0.05&&view.bgm.volume<=0.08&&(view.characterId===null||typeof view.characterAssetUrl==="string"));
}

export const DAY8_V3_ROUTE_BACKGROUNDS=ROUTE;
