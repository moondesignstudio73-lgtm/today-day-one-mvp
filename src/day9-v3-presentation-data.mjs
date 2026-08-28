import {getMapLocationAsset} from "./map-location-assets.mjs";
import {DAY8_V3_EVENT_CG_ASSETS} from "./day8-v3-event-assets.mjs";

const HOME_DAY="assets/backgrounds/day2/day2-protagonist-bedroom-afternoon-v2.png",HOME_NIGHT="assets/backgrounds/day4/day4-home-night-consistent-v1.png";
const STATION=getMapLocationAsset("myeongdong-station"),MALL=getMapLocationAsset("fashion-mall"),FOOD=getMapLocationAsset("department-food");
export const DAY9_V3_PLANNED_ASSETS=Object.freeze({
  haeun:"assets/characters/story-outfits/haeun-day9-gray-blue-shirt-2d-v1.png",
  hangerChoice:"assets/events/day9-v3/cg-day9-v3-two-hangers-choice-pov-v1.png",pinkFit:"assets/events/day9-v3/cg-day9-v3-pink-fit-discomfort-v1.png",greenFit:"assets/events/day9-v3/cg-day9-v3-green-pocket-fit-v1.png",scarfReceipt:"assets/events/day9-v3/cg-day9-v3-scarf-receipt-pov-v1.png",scarfBoundary:"assets/events/day9-v3/cg-day9-v3-scarf-boundary-v1.png",playerSleeve:"assets/events/day9-v3/cg-day9-v3-player-fitting-sleeve-v1.png",restZipper:"assets/events/day9-v3/cg-day9-v3-rest-zipper-bench-v1.png",checkout:"assets/events/day9-v3/cg-day9-v3-exchange-green-receipt-pov-v1.png"
});
const bg=n=>n<=3?HOME_DAY:n===4?STATION:n<=19?MALL:n<=23?STATION:HOME_NIGHT;
const cg=n=>({1:DAY8_V3_EVENT_CG_ASSETS.existingClothesPhotoPhone,5:DAY9_V3_PLANNED_ASSETS.hangerChoice,6:DAY9_V3_PLANNED_ASSETS.pinkFit,7:DAY9_V3_PLANNED_ASSETS.pinkFit,8:DAY9_V3_PLANNED_ASSETS.greenFit,9:DAY9_V3_PLANNED_ASSETS.greenFit,11:DAY9_V3_PLANNED_ASSETS.scarfReceipt,12:DAY9_V3_PLANNED_ASSETS.scarfBoundary,13:DAY9_V3_PLANNED_ASSETS.scarfBoundary,14:DAY9_V3_PLANNED_ASSETS.scarfBoundary,16:DAY9_V3_PLANNED_ASSETS.playerSleeve,19:DAY9_V3_PLANNED_ASSETS.checkout}[n]??null);
const sfx=n=>({1:["SFX_SPARE_PHONE_KEY"],4:["SFX_AUTO_DOOR"],7:["SFX_PHOTO_FRAME"],8:["SFX_PHOTO_FRAME"],11:["SFX_DOCUMENT_RECEIVE"],14:["SFX_DOCUMENT_RECEIVE"],16:["SFX_BAG_ZIPPER"],19:["SFX_DOCUMENT_RECEIVE"],20:["SFX_CUP_SET_DOWN"],21:["SFX_PHOTO_FRAME"],23:["SFX_SPARE_PHONE_KEY"],24:["SFX_HOME_KEY_UNLOCK","SFX_PENCIL_NOTE"]}[n]??[]);
export const DAY9_V3_PRESENTATION_SCENES=Object.freeze(Object.fromEntries(Array.from({length:24},(_,i)=>i+1).map(n=>[`D9V3_S${String(n).padStart(2,"0")}`,Object.freeze({sceneNumber:n,backgroundUrl:bg(n),characterId:n>=4&&n<=23?"girlfriend":null,characterAssetUrl:n>=4&&n<=23?DAY9_V3_PLANNED_ASSETS.haeun:null,eventCgUrl:cg(n),camera:cg(n)?"event-cg-safe":"medium-safe",transition:[1,4,20,24].includes(n)?"fade":"crossfade",bgm:Object.freeze({category:n>=4&&n<=21?"dateShopping":"daily",variant:0,volume:[12,13,14].includes(n)?0.05:0.06}),sfx:Object.freeze(sfx(n)),safeArea:Object.freeze({desktop:"center-80",mobile:"center-60",objectPosition:"50% 50%"}),assetStatus:[5,8,9,11].includes(n)?"ready-new":n===1||[2,3,10,15,17,18,20,21,22,23,24].includes(n)?"ready-reuse":"needs-production"})])));

export function getDay9V3Presentation(sceneNumber,state={}){
  const base=DAY9_V3_PRESENTATION_SCENES[`D9V3_S${String(sceneNumber).padStart(2,"0")}`];if(!base)return null;const flags=state.storyFlags??state;
  let backgroundUrl=base.backgroundUrl,eventCgUrl=base.eventCgUrl;
  if([20,21].includes(sceneNumber)&&flags.day9V3ShoppingRoute==="TOGETHER_FULL")backgroundUrl=FOOD;
  if(sceneNumber===16&&flags.day9V3RestRoute)eventCgUrl=DAY9_V3_PLANNED_ASSETS.restZipper;
  if(sceneNumber===11&&flags.day9V3ScarfPurchase!=="PURCHASED_GIFT")eventCgUrl=null;
  if(sceneNumber===19&&!flags.day9V3TransactionsSettled)eventCgUrl=null;
  return Object.freeze({...base,backgroundUrl,eventCgUrl});
}

export function validateDay9V3PresentationAudit(){const all=Object.values(DAY9_V3_PRESENTATION_SCENES);return all.length===24&&all.every((v,i)=>v.sceneNumber===i+1&&v.backgroundUrl&&["daily","dateShopping"].includes(v.bgm.category)&&v.bgm.volume>=0.05&&v.bgm.volume<=0.06&&v.safeArea.mobile==="center-60")&&all.filter(v=>v.assetStatus==="needs-production").length===8;}

export const DAY9_V3_READY_BACKGROUNDS=Object.freeze({station:STATION,mall:MALL,food:FOOD,homeDay:HOME_DAY,homeNight:HOME_NIGHT});
