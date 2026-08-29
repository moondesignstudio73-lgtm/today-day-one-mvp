import {getMapLocationAsset} from "./map-location-assets.mjs";

const HOME_DAY="assets/backgrounds/day2/day2-protagonist-bedroom-afternoon-v2.png";
const HOME_NIGHT="assets/backgrounds/day4/day4-home-night-consistent-v1.png";
const FLOWER_CAFE=getMapLocationAsset("flower-cafe");
const BAKERY=getMapLocationAsset("yeonhui-bakery");
const SMALL_CAFE=getMapLocationAsset("small-cafe");
const YEONHUI_STATION=getMapLocationAsset("yeonhui-station");
const HAEUN="assets/characters/story-outfits/haeun-day9-gray-blue-shirt-2d-v1.png";
const SORA="assets/characters/day11/sora-day11-cafe-casual-2d-v4.png";

export const DAY11_V3_REQUIRED_NEW_ASSETS=Object.freeze({
  soraSprite:Object.freeze({path:SORA,kind:"rgba-sprite",minimum:"1024x1536",status:"ready-new",reason:"서류·업무 소품 없이 빈손으로 친구를 만나는 생활복 전신 소라; 실제 RGBA와 검은 배경 프린지 QA 통과"}),
  bakeryChoicePov:Object.freeze({path:"assets/events/day11-v3/cg-day11-v3-bakery-choice-pov-v1.png",kind:"event-cg",required:"1672x941",status:"ready-new",reason:"빵을 선물로 포장하지 않고 자기 몫/먼저 묻기/기다리기를 선택하는 손 행동"}),
  cafeThreeShot:Object.freeze({path:"assets/events/day11-v3/cg-day11-v3-haeun-sora-cafe-three-shot-v1.png",kind:"event-cg",required:"1672x941",status:"ready-new",reason:"하은·소라·주인공 POV가 같은 카페 원근 안에서 대면하고 하은의 현재 목소리를 직접 듣는 핵심 장면"}),
  cakeBoundary:Object.freeze({path:"assets/events/day11-v3/cg-day11-v3-cake-trip-boundary-v1.png",kind:"event-cg",required:"1672x941",status:"ready-new",reason:"비뚤게 나눈 케이크와 취소된 여행 이야기를 소품·손동작으로 보여 주는 감정 전환"}),
  siwooMessagePov:Object.freeze({path:"assets/events/day11-v3/cg-day11-v3-siwoo-exhibition-message-pov-v1.png",kind:"event-cg",required:"1672x941",status:"ready-new",reason:"시우의 전시 일정 알림만 보여 주고 동행·사적 관계를 확정하지 않는 휴대전화 POV"}),
  shoulderLean:Object.freeze({path:"assets/events/day11-v3/cg-day11-v3-shoulder-lean-bench-v1.png",kind:"event-cg",required:"1672x941",status:"ready-new",reason:"하은이 먼저 어깨를 기울이는 조건부 친밀 행동을 강제 접촉 없이 표현"}),
  cakePhotoPov:Object.freeze({path:"assets/events/day11-v3/cg-day11-v3-cake-photo-message-pov-v1.png",kind:"event-cg",required:"1672x941",status:"ready-new",reason:"DAY 11 종료의 비뚤게 잘린 케이크 사진과 질문을 외우지 않는 현재형 콜백"})
});

const sceneSpec=number=>{
  const night=number>=20;
  const backgroundUrl=number<=3?HOME_DAY:number===4?BAKERY:number<=19?FLOWER_CAFE:number<=22?YEONHUI_STATION:HOME_NIGHT;
  const sfx=({1:["SFX_SPARE_PHONE_KEY"],2:["SFX_BAG_ZIPPER"],3:["SFX_PENCIL_NOTE"],4:["SFX_DOCUMENT_RECEIVE"],5:["SFX_AUTO_DOOR","SFX_CHAIR_MOVE"],6:["SFX_CUP_SET_DOWN"],11:["SFX_CUP_SET_DOWN"],13:["SFX_DOCUMENT_RECEIVE"],16:["SFX_CHAIR_MOVE"],19:["SFX_SPARE_PHONE_KEY"],20:["SFX_FOOTSTEP_APPROACH"],22:["SFX_FOOTSTEP_APPROACH"],23:["SFX_PENCIL_NOTE"],24:["SFX_SPARE_PHONE_KEY"]}[number]??[]);
  const requiredAsset=number===4?"bakeryChoicePov":number>=5&&number<=10?"cafeThreeShot":number>=11&&number<=15?"cakeBoundary":number===19?"siwooMessagePov":number===22?"shoulderLean":number===24?"cakePhotoPov":null;
  const asset=requiredAsset?DAY11_V3_REQUIRED_NEW_ASSETS[requiredAsset]:null;
  const eventCgUrl=asset?.status==="ready-new"?asset.path:null;
  return Object.freeze({sceneNumber:number,backgroundUrl,characterId:number>=5&&number<=22?"girlfriend":null,characterAssetUrl:number>=5&&number<=22?HAEUN:null,secondaryCharacterId:number>=16&&number<=18?"sora-day11":null,secondaryCharacterAssetUrl:number>=16&&number<=18?SORA:null,eventCgUrl,requiredAsset,camera:requiredAsset?"event-cg-safe":"medium-safe",transition:[1,4,5,11,19,20,23,24].includes(number)?"fade":"crossfade",bgm:Object.freeze({category:night?"theme":"daily",variant:night?1:0,volume:[11,12,17,19,22].includes(number)?0.05:0.06}),sfx:Object.freeze(sfx),safeArea:Object.freeze({desktop:"center-80",mobile:"center-60",objectPosition:"50% 44%"}),assetStatus:asset?.status??"ready-reuse"});
};

export const DAY11_V3_PRESENTATION_SCENES=Object.freeze(Object.fromEntries(Array.from({length:24},(_,index)=>index+1).map(number=>[`D11V3_S${String(number).padStart(2,"0")}`,sceneSpec(number)])));

export function getDay11V3Presentation(sceneNumber,state={}){
  const base=DAY11_V3_PRESENTATION_SCENES[`D11V3_S${String(sceneNumber).padStart(2,"0")}`];if(!base)return null;
  const flags=state.storyFlags??state,attending=flags.day11V3AttendedSoraMeeting===true;
  let backgroundUrl=base.backgroundUrl,characterId=base.characterId,characterAssetUrl=base.characterAssetUrl,secondaryCharacterId=base.secondaryCharacterId,secondaryCharacterAssetUrl=base.secondaryCharacterAssetUrl,eventCgUrl=base.eventCgUrl,requiredAsset=base.requiredAsset;
  if(!attending&&sceneNumber>=4&&sceneNumber<=15)backgroundUrl=SMALL_CAFE;
  if(!attending&&sceneNumber>=5){characterId=null;characterAssetUrl=null;secondaryCharacterId=null;secondaryCharacterAssetUrl=null;}
  if(!attending&&[4,5,6,7,8,9,10,11,12,13,14,15].includes(sceneNumber)){requiredAsset=null;eventCgUrl=null;}
  if(!attending&&sceneNumber===19){requiredAsset=null;eventCgUrl=null;}
  if(sceneNumber===22&&(!attending||flags.day11V3ShoulderLeanOccurred!==true))requiredAsset=null;
  if(sceneNumber===24&&(flags.day11V3RelationshipBand==="LOW"||flags.day11V3UnresolvedConflict===true))requiredAsset=null;
  if(!requiredAsset)eventCgUrl=null;
  const asset=requiredAsset?DAY11_V3_REQUIRED_NEW_ASSETS[requiredAsset]:null;
  return Object.freeze({...base,backgroundUrl,characterId,characterAssetUrl,secondaryCharacterId,secondaryCharacterAssetUrl,eventCgUrl,requiredAsset,assetStatus:asset?.status??"ready-reuse"});
}

export function validateDay11V3PresentationAudit(){
  const all=Object.values(DAY11_V3_PRESENTATION_SCENES),allowedBgm=new Set(["daily","theme"]);
  return all.length===24&&all.every((scene,index)=>scene.sceneNumber===index+1&&scene.backgroundUrl&&allowedBgm.has(scene.bgm.category)&&scene.bgm.volume>=0.05&&scene.bgm.volume<=0.06&&scene.safeArea.mobile==="center-60"&&["ready-reuse","ready-new","production-required"].includes(scene.assetStatus));
}

export const DAY11_V3_READY_REUSE_ASSETS=Object.freeze({homeDay:HOME_DAY,homeNight:HOME_NIGHT,flowerCafe:FLOWER_CAFE,bakery:BAKERY,smallCafe:SMALL_CAFE,yeonhuiStation:YEONHUI_STATION,haeun:HAEUN});
