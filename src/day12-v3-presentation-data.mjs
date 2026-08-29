const HOME_DAY="assets/backgrounds/day2/day2-protagonist-bedroom-afternoon-v2.png";
const HOME_ENTRY="assets/backgrounds/day2/day2-home-entry-living-afternoon-v1.png";
const OFFICE_LOBBY="assets/backgrounds/day5/day5-office-lobby-gate-day-v1.png";
const OFFICE_ELEVATOR="assets/backgrounds/day5/day5-office-elevator-lobby-day-v1.png";
const OFFICE_PANTRY="assets/backgrounds/day5/day5-office-pantry-day-v1.png";
const OFFICE_MEETING="assets/backgrounds/day5/day5-office-small-meeting-room-day-v1.png";
const MINHO="assets/npcs/office-best-male.png";
const SEOJIN="assets/npcs/female-coworker-clean.png";
const TEAM_LEAD="assets/npcs/team-lead.png";

export const DAY12_V3_REQUIRED_NEW_ASSETS=Object.freeze({
  trainingCompletionPov:Object.freeze({path:"assets/events/day12-v3/cg-day12-v3-training-completion-pov-v1.png",kind:"event-cg",required:"1672x941",status:"ready-new",reason:"큰 확인 패널과 작은 최종 버튼 사이에서 주인공이 실제로 멈추는 SCENE 05~07 핵심 오해를 손·화면 POV로 보여 준다. 정확한 한국어 문구는 런타임 UI로 렌더한다."}),
  mixedNotesCirclePov:Object.freeze({path:"assets/events/day12-v3/cg-day12-v3-mixed-notes-circle-pov-v1.png",kind:"event-cg",required:"1672x941",status:"ready-new",reason:"옛 설명과 현재 설명이 섞인 종이, 주인공이 멈춘 지점의 삐뚤어진 동그라미, 서진이 옆에 남겨 둔 메모를 한 장면에 묶는다."}),
  wrongCanVendingPov:Object.freeze({path:"assets/events/day12-v3/cg-day12-v3-wrong-can-vending-pov-v1.png",kind:"event-cg",required:"1672x941",status:"ready-new",reason:"민호가 잘못 누른 버튼과 다른 캔을 든 순간을 보여 주어 업무 오해가 생활 농담과 긴장 완화로 바뀌는 행동 장면을 보존한다."}),
  buildingLunchInterior:Object.freeze({path:"assets/backgrounds/day12-v3/day12-building-lunch-interior-day-v1.png",kind:"dedicated-background",required:"1672x941",status:"ready-new",reason:"카페나 팬트리로 대체하지 않고 세 사람이 건물 안에서 점심을 먹는 원고의 장소와 생활 리듬을 고정한다."}),
  scallionLunchThreeShot:Object.freeze({path:"assets/events/day12-v3/cg-day12-v3-scallion-lunch-three-shot-v1.png",kind:"event-cg",required:"1672x941",status:"ready-new",reason:"서진이 자기 그릇의 큰 파를 골라내고 민호가 반응하는 현재형 생활 정보를 같은 원근 안의 손·음식·세 사람으로 보여 준다."}),
  verifiedSheetHandoffPov:Object.freeze({path:"assets/events/day12-v3/cg-day12-v3-verified-sheet-handoff-pov-v1.png",kind:"event-cg",required:"1672x941",status:"ready-new",reason:"서진이 주인공에게 검토용 예시 종이를 건네는 현재의 신뢰를 기존 DAY 5 두 폴더 장면과 혼동하지 않도록 별도 손 인계 구도로 표현한다."}),
  haeunDisclosurePhonePov:Object.freeze({path:"assets/events/day12-v3/cg-day12-v3-haeun-disclosure-phone-pov-v1.png",kind:"event-cg",required:"1672x941",status:"ready-new",reason:"점심을 먹었다는 보고와 서진 이름의 공개·보류·불일치를 하은의 물리적 등장 없이 손에 든 휴대전화와 런타임 메시지 UI로 전달한다."}),
  endingDeskCluesPov:Object.freeze({path:"assets/events/day12-v3/cg-day12-v3-ending-desk-clues-pov-v1.png",kind:"event-cg",required:"1672x941",status:"ready-new",reason:"구겨진 질문 메모, 씻어 둔 물병, 검토용 예시 종이를 나란히 놓아 오늘의 현재 행동과 DAY 13 계획을 한 프레임에 남긴다."})
});

const backgroundFor=number=>{
  if(number===1||number>=21)return HOME_DAY;
  if(number===2||number===19)return OFFICE_ELEVATOR;
  if((number>=3&&number<=10)||number===18)return OFFICE_MEETING;
  if(number===11)return OFFICE_PANTRY;
  if(number>=12&&number<=17)return DAY12_V3_REQUIRED_NEW_ASSETS.buildingLunchInterior.path;
  return OFFICE_LOBBY;
};

const requiredAssetFor=number=>{
  if(number>=5&&number<=7)return "trainingCompletionPov";
  if(number>=8&&number<=9)return "mixedNotesCirclePov";
  if(number===11)return "wrongCanVendingPov";
  if([12,14,15,16,17].includes(number))return "buildingLunchInterior";
  if(number===13)return "scallionLunchThreeShot";
  if(number===19)return "verifiedSheetHandoffPov";
  if(number>=20&&number<=22)return "haeunDisclosurePhonePov";
  if(number>=23)return "endingDeskCluesPov";
  return null;
};

const characterFor=number=>{
  if([2,11,14,19].includes(number))return Object.freeze({characterId:"office-best-male",characterAssetUrl:MINHO});
  if([4,18].includes(number))return Object.freeze({characterId:"team-lead",characterAssetUrl:TEAM_LEAD});
  if((number>=3&&number<=10)||(number>=12&&number<=17))return Object.freeze({characterId:"female-coworker",characterAssetUrl:SEOJIN});
  return Object.freeze({characterId:null,characterAssetUrl:null});
};

const sfxFor=number=>Object.freeze(({
  1:["SFX_BAG_ZIPPER","SFX_SPARE_PHONE_KEY"],2:["SFX_AUTO_DOOR"],4:["SFX_CHAIR_MOVE","SFX_DOCUMENT_RECEIVE"],
  5:["SFX_DOCUMENT_RECEIVE"],7:["SFX_SPARE_PHONE_KEY"],8:["SFX_DOCUMENT_RECEIVE"],9:["SFX_PENCIL_NOTE"],
  10:["SFX_CHAIR_MOVE"],11:["SFX_CUP_SET_DOWN"],12:["SFX_CHAIR_MOVE"],13:["SFX_CUP_SET_DOWN"],
  18:["SFX_DOCUMENT_RECEIVE"],19:["SFX_DOCUMENT_RECEIVE","SFX_AUTO_DOOR"],20:["SFX_SPARE_PHONE_KEY"],
  21:["SFX_PHONE_SCREEN_OFF"],22:["SFX_SPARE_PHONE_KEY"],23:["SFX_PENCIL_NOTE"],24:["SFX_PHONE_SCREEN_OFF"]
}[number]??[]));

const sceneSpec=number=>{
  const requiredAsset=requiredAssetFor(number),asset=requiredAsset?DAY12_V3_REQUIRED_NEW_ASSETS[requiredAsset]:null,character=characterFor(number);
  return Object.freeze({
    sceneNumber:number,backgroundUrl:backgroundFor(number),...character,requiredAsset,
    eventCgUrl:asset?.kind==="event-cg"&&asset.status!=="production-required"?asset.path:null,
    shotMode:asset?.kind==="event-cg"?"event-cg-safe":asset?.kind==="dedicated-background"?"dedicated-background-safe":"medium-safe",
    transition:[1,2,4,7,11,12,18,19,20,23,24].includes(number)?"fade":"crossfade",
    bgm:Object.freeze({category:number>=20?"theme":"daily",variant:number>=20?1:0,volume:[6,7,9,15,17,21,22].includes(number)?0.05:0.06}),
    sfx:sfxFor(number),safeArea:Object.freeze({desktop:"center-80",mobile:"center-60",objectPosition:"50% 44%"}),
    assetStatus:asset?.status??"ready-reuse"
  });
};

export const DAY12_V3_PRESENTATION_SCENES=Object.freeze(Object.fromEntries(
  Array.from({length:24},(_,index)=>index+1).map(number=>[`D12V3_S${String(number).padStart(2,"0")}`,sceneSpec(number)])
));

export function getDay12V3Presentation(sceneNumber){
  return DAY12_V3_PRESENTATION_SCENES[`D12V3_S${String(sceneNumber).padStart(2,"0")}`]??null;
}

export function validateDay12V3PresentationAudit(){
  const allowedBgm=new Set(["daily","theme"]);
  const allowedSfx=new Set(["SFX_BAG_ZIPPER","SFX_SPARE_PHONE_KEY","SFX_AUTO_DOOR","SFX_CHAIR_MOVE","SFX_DOCUMENT_RECEIVE","SFX_PENCIL_NOTE","SFX_CUP_SET_DOWN","SFX_PHONE_SCREEN_OFF"]);
  const scenes=Object.values(DAY12_V3_PRESENTATION_SCENES);
  return scenes.length===24&&scenes.every((scene,index)=>scene.sceneNumber===index+1&&scene.backgroundUrl&&
    allowedBgm.has(scene.bgm.category)&&scene.bgm.volume>=0.05&&scene.bgm.volume<=0.06&&scene.safeArea.mobile==="center-60"&&
    ["ready-reuse","ready-new","production-required"].includes(scene.assetStatus)&&scene.sfx.every(id=>allowedSfx.has(id)));
}

export const DAY12_V3_READY_REUSE_ASSETS=Object.freeze({
  homeDay:HOME_DAY,homeEntry:HOME_ENTRY,officeLobby:OFFICE_LOBBY,officeElevator:OFFICE_ELEVATOR,
  officePantry:OFFICE_PANTRY,officeMeeting:OFFICE_MEETING,minho:MINHO,seojin:SEOJIN,teamLead:TEAM_LEAD
});
