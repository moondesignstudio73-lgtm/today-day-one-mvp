import {DAY6_V3_SCENES} from "./day6-v3-campaign-data.mjs";
import {getMapLocationAsset} from "./map-location-assets.mjs";
import {STORY_OUTFIT_ASSETS} from "./story-outfit-assets.mjs?v=2";

const STANDARD_BACKGROUNDS=Object.freeze({
  home:"assets/backgrounds/morning-studio-2d.png",
  "small-cafe-outside":"assets/backgrounds/street/BG_RELATIONSHIP_STREET_DAY_001.png",
  street:"assets/backgrounds/street/BG_RELATIONSHIP_STREET_DAY_001.png",
  transit:getMapLocationAsset("dongsu-station"),
  "home-outside":"assets/backgrounds/day2/day2-home-exterior-afternoon-v1.png",
  "home-night":"assets/backgrounds/home/BG_HOME_NIGHT_001.webp"
});

const locationVisual=(scene)=>{
  if(scene.number===21)return {backgroundId:"yeonhui-station",backgroundUrl:getMapLocationAsset("yeonhui-station")};
  if(scene.number===23)return {backgroundId:"home-night",backgroundUrl:STANDARD_BACKGROUNDS["home-night"]};
  const mapUrl=getMapLocationAsset(scene.location);
  return {backgroundId:scene.location,backgroundUrl:mapUrl??STANDARD_BACKGROUNDS[scene.location]};
};
const expressionFor=(number)=>number<=7?"calm":number<=14?"smile":number===20?"calm":"smile";
const poseFor=(number)=>[1,2,7,16,23].includes(number)?"phone":"standing";
const cameraFor=(number)=>[2,4,7,12,16,18,20,23].includes(number)?"close-prop":[8,11,13,17,21].includes(number)?"wide":"medium";
const bgmFor=(number)=>number<=2?"daily":number<=10?"dateShopping":number<=16?"daily":number<=22?"dateShopping":"daily";
const sfxFor=(number)=>({1:["SFX_SPARE_PHONE_KEY"],4:["SFX_CUP_SET_DOWN"],7:["SFX_PHOTO_FRAME"],12:["SFX_CUP_SET_DOWN"],13:["SFX_AUTO_DOOR"],16:["SFX_PHOTO_FRAME"],18:["SFX_PENCIL_NOTE"],23:["SFX_SPARE_PHONE_KEY"]}[number]??[]);

export const DAY6_V3_PRESENTATION_SCENES=Object.freeze(Object.fromEntries(DAY6_V3_SCENES.map(scene=>{
  const visual=locationVisual(scene);
  return [scene.id,Object.freeze({
    ...visual,
    characterId:"girlfriend",
    characterAssetUrl:STORY_OUTFIT_ASSETS.day6,
    expressionId:expressionFor(scene.number),
    poseId:poseFor(scene.number),
    camera:cameraFor(scene.number),
    transition:scene.number===1||scene.number===23?"fade":scene.location===DAY6_V3_SCENES[scene.number-2]?.location?"cut":"crossfade",
    bgm:Object.freeze({category:bgmFor(scene.number),variant:0,volume:scene.number===23?0.055:0.065}),
    sfx:Object.freeze(sfxFor(scene.number)),
    assetStatus:"ready-reuse",
    sourceLocation:scene.location,
    waypointBackgroundIds:scene.number===13?Object.freeze(["dongsu-station","yeonhui-station"]):Object.freeze([])
  })];
})));

export function getDay6V3Presentation(sceneNumber){return DAY6_V3_PRESENTATION_SCENES[`D6V3_S${String(sceneNumber).padStart(2,"0")}`]??null;}

export function validateDay6V3PresentationData(){
  const values=Object.values(DAY6_V3_PRESENTATION_SCENES);
  return values.length===23&&values.every(view=>typeof view.backgroundUrl==="string"&&view.backgroundUrl.length>0&&view.characterId==="girlfriend"&&typeof view.characterAssetUrl==="string"&&view.assetStatus==="ready-reuse"&&["daily","dateShopping"].includes(view.bgm.category)&&view.bgm.volume>=0.05&&view.bgm.volume<=0.08);
}
