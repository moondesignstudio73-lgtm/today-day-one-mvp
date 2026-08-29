const HOME_MORNING="assets/backgrounds/morning-studio-2d.png";
const HOME_BEDROOM="assets/backgrounds/day2/day2-protagonist-bedroom-afternoon-v2.png";
const HOME_ENTRY="assets/backgrounds/day2/day2-home-entry-living-afternoon-v1.png";
const NEIGHBORHOOD="assets/backgrounds/street/BG_RELATIONSHIP_STREET_DAY_001.png";
const SEONGSU_STATION="assets/backgrounds/map-locations/031_seongsu-station.png";
const RUNNING_PARK="assets/backgrounds/map-locations/035_running-park.png";
const PROTEIN_CAFE="assets/backgrounds/map-locations/036_protein-cafe.png";

export const DAY13_V3_ARA_REFERENCE_ASSET=Object.freeze({
  path:"assets/heroines/ara/outfits/01.webp",status:"reference-only",
  reason:"승인된 적갈색 단발·데님 재킷·러스트 후드·카고 팬츠 정체성 기준이지만 저해상도 불투명 배경이라 런타임 확대 스프라이트로 사용하지 않는다."
});

export const DAY13_V3_REQUIRED_NEW_ASSETS=Object.freeze({
  araPhotoWalkSprite:Object.freeze({path:"assets/characters/day13/ara-day13-photo-walk-casual-2d-v1.png",kind:"character-sprite",required:"887x1774 RGBA minimum",status:"ready-new",reason:"DAY 1~2와 같은 결정적 체크무늬 제거 후처리로 적갈색 단발·데님 재킷·러스트 후드·카고 팬츠·카메라 전신을 실제 투명 레이어로 유지한다."}),
  imperfectPhotoPov:Object.freeze({path:"assets/events/day13-v3/cg-day13-v3-imperfect-photo-phone-pov-v1.png",kind:"event-cg",required:"1672x941 RGB",status:"ready-new",reason:"빛을 찍으려다 쓰레기통과 잘린 나무가 함께 들어온 실제 촬영 행동을 휴대전화·손·공원 원근으로 보여 준다."}),
  araFirstMeetingWide:Object.freeze({path:"assets/events/day13-v3/cg-day13-v3-ara-first-meeting-wide-v1.png",kind:"event-cg",required:"1672x941 RGB",status:"ready-new",reason:"서울숲 실제 방문 경로에서만 아라가 낮은 각도로 나뭇잎을 찍고 주인공에게 비켜 달라고 먼저 말하는 등장 행동을 한 프레임에 고정한다."}),
  missedBirdPov:Object.freeze({path:"assets/events/day13-v3/cg-day13-v3-missed-bird-empty-path-pov-v1.png",kind:"event-cg",required:"1671x941 RGB native (16:9 tolerance)",status:"ready-new",reason:"셔터 전에 날아간 새와 빈 길을 휴대전화 화면·손·실제 공원 배경 안에서 보여 주며 새를 사진에 되살리지 않는다."}),
  portraitConsentPov:Object.freeze({path:"assets/events/day13-v3/cg-day13-v3-portrait-consent-camera-pov-v1.png",kind:"event-cg",required:"1672x941 RGB",status:"ready-new",reason:"초상 수락 경로에서만 아라가 카메라를 들고 주인공의 현재 모습을 정면 강요 없이 담는 동의 후 행동을 보여 준다."}),
  portraitReviewPov:Object.freeze({path:"assets/events/day13-v3/cg-day13-v3-portrait-review-camera-pov-v1.png",kind:"event-cg",required:"1671x941 RGB native (16:9 tolerance)",status:"ready-new",reason:"카메라 후면의 눈 감은 첫 사진과 웃음을 참은 두 번째 사진을 아라의 손과 함께 보여 주되 정확한 UI 문자는 런타임으로 분리한다."}),
  photoTransferConsentPov:Object.freeze({path:"assets/events/day13-v3/cg-day13-v3-photo-transfer-consent-pov-v1.png",kind:"event-cg",required:"1671x941 RGB native (16:9 tolerance)",status:"ready-new",reason:"전송할 한 장과 공개 게시 권한을 분리하는 SCENE 19 선택을 두 휴대전화/카메라와 손의 거리로 보여 준다."}),
  haeunDebriefPhonePov:Object.freeze({path:"assets/events/day13-v3/cg-day13-v3-haeun-photo-debrief-phone-pov-v1.png",kind:"event-cg",required:"1672x941 RGB",status:"ready-new",reason:"하은이 물리적으로 등장하지 않는 귀가 보고를 실제 보낸 풍경 사진과 메시지 UI 안전 영역으로 전달한다."}),
  haeunDeskPhotoPov:Object.freeze({path:"assets/events/day13-v3/cg-day13-v3-haeun-desk-photo-phone-pov-v1.png",kind:"event-cg",required:"1671x941 RGB native (16:9 tolerance)",status:"ready-new",reason:"하은이 먼저 보낸 책상·작은 메모·빈 컵 사진을 휴대전화 속에 보여 주어 새 인연 뒤에도 하은의 생활과 주체성을 화면에 남긴다."}),
  endingCurrentFacePov:Object.freeze({path:"assets/events/day13-v3/cg-day13-v3-ending-current-face-phone-pov-v1.png",kind:"event-cg",required:"1672x941 RGB",status:"ready-new",reason:"실제로 초상 또는 셀프 사진을 남긴 경로만 현재 얼굴을 보는 결말을 표시한다."}),
  endingSceneryPov:Object.freeze({path:"assets/events/day13-v3/cg-day13-v3-ending-scenery-phone-pov-v1.png",kind:"event-cg",required:"1672x941 RGB",status:"ready-new",reason:"얼굴 촬영을 거절한 서울숲 경로에서 빈 길을 보는 동등한 결말을 제공하며 집 경로는 기존 창가 물컵 연출을 유지한다."})
});

const backgroundFor=number=>{
  if(number<=2||number>=21)return HOME_BEDROOM;
  if(number===3||number===20)return HOME_ENTRY;
  if(number===17||number===18||number===19)return PROTEIN_CAFE;
  if(number>=4&&number<=16)return RUNNING_PARK;
  return HOME_MORNING;
};

const branchBackgroundsFor=number=>{
  if(number>=4&&number<=19)return Object.freeze({
    SEOUL_FOREST:number>=17?PROTEIN_CAFE:RUNNING_PARK,
    NEIGHBORHOOD:NEIGHBORHOOD,
    HOME:HOME_BEDROOM,
    EARLY_EXIT:HOME_BEDROOM
  });
  if(number===20)return Object.freeze({SEOUL_FOREST:SEONGSU_STATION,NEIGHBORHOOD:HOME_ENTRY,HOME:HOME_BEDROOM,EARLY_EXIT:HOME_BEDROOM});
  return Object.freeze({});
};

const requiredAssetFor=number=>({
  1:"imperfectPhotoPov",2:"imperfectPhotoPov",4:"imperfectPhotoPov",5:"araFirstMeetingWide",6:"araPhotoWalkSprite",
  7:"araPhotoWalkSprite",8:"imperfectPhotoPov",9:"missedBirdPov",10:"araPhotoWalkSprite",11:"araPhotoWalkSprite",
  12:"araPhotoWalkSprite",13:"portraitConsentPov",14:"portraitReviewPov",15:"araPhotoWalkSprite",16:"araPhotoWalkSprite",
  17:"araPhotoWalkSprite",18:"araPhotoWalkSprite",19:"photoTransferConsentPov",21:"haeunDebriefPhonePov",
  22:"haeunDebriefPhonePov",23:"haeunDeskPhotoPov",24:"endingCurrentFacePov"
}[number]??null);

const eventCgFor=(number,requiredAsset)=>{
  const asset=requiredAsset?DAY13_V3_REQUIRED_NEW_ASSETS[requiredAsset]:null;
  return asset?.kind==="event-cg"&&asset.status!=="production-required"?asset.path:null;
};

const sfxFor=number=>Object.freeze(({
  1:["SFX_SPARE_PHONE_KEY"],3:["SFX_BAG_ZIPPER"],4:["SFX_FOOTSTEP_APPROACH"],5:["SFX_FOOTSTEP_APPROACH"],
  10:["SFX_FOOTSTEP_APPROACH"],13:[],17:["SFX_SPARE_PHONE_KEY","SFX_CUP_SET_DOWN"],
  18:["SFX_CUP_SET_DOWN"],19:["SFX_SPARE_PHONE_KEY"],20:["SFX_AUTO_DOOR"],21:["SFX_SPARE_PHONE_KEY"],
  22:["SFX_PHONE_SCREEN_OFF"],23:["SFX_SPARE_PHONE_KEY"],24:["SFX_PHONE_SCREEN_OFF"]
}[number]??[]));

const characterFor=number=>number>=5&&number<=19?Object.freeze({
  characterId:"ara",characterAssetUrl:DAY13_V3_REQUIRED_NEW_ASSETS.araPhotoWalkSprite.path,characterAssetRequirement:"araPhotoWalkSprite",
  conditional:"outingRoute === SEOUL_FOREST && araMet && !araEarlyExitAfterScene10"
}):Object.freeze({characterId:null,characterAssetUrl:null,characterAssetRequirement:null,conditional:null});

const sceneSpec=number=>{
  const requiredAsset=requiredAssetFor(number),character=characterFor(number);
  const asset=requiredAsset?DAY13_V3_REQUIRED_NEW_ASSETS[requiredAsset]:null;
  return Object.freeze({
    sceneNumber:number,backgroundUrl:backgroundFor(number),branchBackgroundUrls:branchBackgroundsFor(number),...character,
    requiredAsset,eventCgUrl:eventCgFor(number,requiredAsset),
    branchEventCgUrls:number===24?Object.freeze({portrait:DAY13_V3_REQUIRED_NEW_ASSETS.endingCurrentFacePov.path,scenery:DAY13_V3_REQUIRED_NEW_ASSETS.endingSceneryPov.path}):Object.freeze({}),
    shotMode:asset?.kind==="event-cg"?"event-cg-safe":asset?.kind==="character-sprite"?"sprite-over-background-safe":"wide-location-safe",
    transition:[1,3,4,5,9,13,17,20,21,23,24].includes(number)?"fade":"crossfade",
    camera:[5,9,13,14,19,21,23,24].includes(number)?"action-object-center":"wide-to-medium",
    bgm:Object.freeze({category:number>=21?"theme":"daily",variant:number>=21?1:0,volume:[9,13,14,19,22,24].includes(number)?0.05:0.06}),
    sfx:sfxFor(number),safeArea:Object.freeze({desktop:"center-80",mobile:"center-60",objectPosition:"50% 42%"}),
    assetStatus:asset?.status??"ready-reuse"
  });
};

export const DAY13_V3_PRESENTATION_SCENES=Object.freeze(Object.fromEntries(
  Array.from({length:24},(_,index)=>index+1).map(number=>[`D13V3_S${String(number).padStart(2,"0")}`,sceneSpec(number)])
));

export const DAY13_V3_READY_REUSE_ASSETS=Object.freeze({
  homeMorning:HOME_MORNING,homeBedroom:HOME_BEDROOM,homeEntry:HOME_ENTRY,neighborhood:NEIGHBORHOOD,
  seongsuStation:SEONGSU_STATION,runningPark:RUNNING_PARK,proteinCafe:PROTEIN_CAFE
});

export function getDay13V3Presentation(sceneNumber){
  return DAY13_V3_PRESENTATION_SCENES[`D13V3_S${String(sceneNumber).padStart(2,"0")}`]??null;
}

export function validateDay13V3PresentationAudit(){
  const allowedBgm=new Set(["daily","theme"]);
  const allowedSfx=new Set(["SFX_SPARE_PHONE_KEY","SFX_BAG_ZIPPER","SFX_FOOTSTEP_APPROACH","SFX_CUP_SET_DOWN","SFX_AUTO_DOOR","SFX_PHONE_SCREEN_OFF"]);
  const scenes=Object.values(DAY13_V3_PRESENTATION_SCENES);
  return scenes.length===24&&Object.keys(DAY13_V3_REQUIRED_NEW_ASSETS).length===11&&scenes.every((scene,index)=>
    scene.sceneNumber===index+1&&scene.backgroundUrl&&allowedBgm.has(scene.bgm.category)&&scene.bgm.volume>=0.05&&scene.bgm.volume<=0.06&&
    scene.safeArea.mobile==="center-60"&&["ready-reuse","ready-new","production-required"].includes(scene.assetStatus)&&scene.sfx.every(id=>allowedSfx.has(id))
  );
}
