import {DAY7_V3_SCENES} from "./day7-v3-campaign-data.mjs";
import {getMapLocationAsset} from "./map-location-assets.mjs";
import {STORY_OUTFIT_ASSETS} from "./story-outfit-assets.mjs?v=2";

const HOME="assets/backgrounds/morning-studio-2d.png";
const HOME_NIGHT="assets/backgrounds/home/BG_HOME_NIGHT_001.webp";
const STREET="assets/backgrounds/street/BG_RELATIONSHIP_STREET_DAY_001.png";
const HOME_EXTERIOR="assets/backgrounds/day2/day2-home-exterior-afternoon-v1.png";
const CG=Object.freeze({
  company:"assets/events/day7/cg-day7-company-photo-phone-pov-v1.png",
  card:"assets/events/day7/cg-day7-card-front-back-pov-v1.png",
  hand:"assets/events/day7/cg-day7-hand-offer-consent-pov-v1.png"
});
const ROUTE=Object.freeze({
  "night-view":Object.freeze({7:"namsan-station",8:"k-tower",11:"sky-observatory",12:"sky-observatory",13:"sky-observatory",14:"sky-observatory",15:"tower-restaurant",16:"tower-restaurant",17:"tower-restaurant",18:"tower-restaurant",19:"love-terrace",20:"love-terrace",21:"love-terrace"}),
  "theme-park":Object.freeze({7:"jamsil-station",9:"dream-castle",11:"roller-coaster",12:"ferris-wheel",13:"carousel",14:"lake-promenade",15:"gimbap-village",16:"gimbap-village",17:"gimbap-village",18:"gimbap-village",19:"lake-promenade",20:"lake-promenade",21:"lake-promenade"}),
  "book-and-dinner":Object.freeze({7:"myeongdong-station",10:"central-department",11:"central-department",12:"central-department",13:"central-department",14:"central-department",15:"department-food",16:"department-food",17:"department-food",18:"department-food",19:"myeongdong-station",20:"myeongdong-station",21:"myeongdong-station"})
});
const fallbackFor=n=>n<=5?HOME:n===6?STREET:n===22?HOME_EXTERIOR:n>=23?HOME_NIGHT:STREET;
const sfxFor=n=>({1:["SFX_SPARE_PHONE_KEY"],2:["SFX_SPARE_PHONE_KEY"],4:["SFX_PHONE_SCREEN_OFF"],5:["SFX_BAG_ZIPPER"],6:["SFX_SPARE_PHONE_KEY"],7:["SFX_AUTO_DOOR"],11:["SFX_CUP_SET_DOWN"],15:["SFX_AUTO_DOOR"],16:["SFX_CUP_SET_DOWN"],17:["SFX_DOCUMENT_RECEIVE"],18:["SFX_PENCIL_NOTE"],19:["SFX_SPARE_PHONE_KEY"],21:["SFX_FOOTSTEP_APPROACH"],22:["SFX_HOME_KEY_UNLOCK"],23:["SFX_PHONE_SCREEN_OFF"],24:["SFX_SPARE_PHONE_KEY"]}[n]??[]);
const cameraFor=n=>[2,12,17,18,19,21].includes(n)?"event-cg-safe":[7,8,9,10,15,22].includes(n)?"wide-safe":"medium-safe";
const bgmFor=n=>n<=6?"daily":n<=18?"dateShopping":"daily";

export const DAY7_V3_PRESENTATION_SCENES=Object.freeze(Object.fromEntries(DAY7_V3_SCENES.map(scene=>[scene.id,Object.freeze({
  sceneNumber:scene.number,
  backgroundId:`day7-v3-scene-${scene.number}`,
  backgroundUrl:fallbackFor(scene.number),
  routeBackgroundIds:Object.freeze(Object.fromEntries(Object.entries(ROUTE).filter(([,map])=>map[scene.number]).map(([route,map])=>[route,map[scene.number]]))),
  routeBackgroundUrls:Object.freeze(Object.fromEntries(Object.entries(ROUTE).filter(([,map])=>map[scene.number]).map(([route,map])=>[route,getMapLocationAsset(map[scene.number])]))),
  characterId:"girlfriend",
  characterAssetUrl:STORY_OUTFIT_ASSETS.day7,
  expressionId:[12,13,14,19,20].includes(scene.number)?"calm":"smile",
  poseId:[1,2,6,19,23,24].includes(scene.number)?"phone":"standing",
  camera:cameraFor(scene.number),
  transition:[1,23,24].includes(scene.number)?"fade":"crossfade",
  bgm:Object.freeze({category:bgmFor(scene.number),variant:0,volume:[19,20].includes(scene.number)?0.055:0.065}),
  sfx:Object.freeze(sfxFor(scene.number)),
  eventCgUrl:scene.number===17?CG.card:scene.number===21?CG.hand:null,
  conditionalEventCg:scene.number===2?Object.freeze({photoState:"RECEIVED_NOW",url:CG.company}):scene.number===12?Object.freeze({photoState:"RECEIVED_NOW",url:CG.company}):scene.number===19?Object.freeze({photoStates:Object.freeze(["RECEIVED_NOW","DEFERRED"]),url:CG.company}):null,
  safeArea:Object.freeze({desktop:"center-80",mobile:"center-60",objectPosition:"50% 50%"}),
  assetStatus:"ready-v3"
})])));

export function getDay7V3Presentation(sceneNumber,state={}){
  const base=DAY7_V3_PRESENTATION_SCENES[`D7V3_S${String(sceneNumber).padStart(2,"0")}`];
  if(!base)return null;
  const flags=state.storyFlags??state;
  const route=flags.day7V3DateRoute;
  const backgroundUrl=base.routeBackgroundUrls[route]??base.backgroundUrl;
  const backgroundId=base.routeBackgroundIds[route]??base.backgroundId;
  const photoState=flags.day7V3PhotoState;
  const conditional=base.conditionalEventCg;
  const eventCgUrl=base.eventCgUrl??(conditional&&(conditional.photoState===photoState||conditional.photoStates?.includes(photoState))?conditional.url:null);
  return Object.freeze({...base,backgroundId,backgroundUrl,eventCgUrl});
}

export function validateDay7V3PresentationData(){
  const values=Object.values(DAY7_V3_PRESENTATION_SCENES);
  return values.length===24&&values.every(view=>typeof view.backgroundUrl==="string"&&typeof view.characterAssetUrl==="string"&&view.assetStatus==="ready-v3"&&["daily","dateShopping"].includes(view.bgm.category)&&view.bgm.volume>=0.05&&view.bgm.volume<=0.08&&Object.values(view.routeBackgroundUrls).every(Boolean));
}

export const DAY7_V3_EVENT_CG_ASSETS=CG;
