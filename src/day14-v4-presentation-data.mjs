const HOME_BEDROOM="assets/backgrounds/day2/day2-protagonist-bedroom-afternoon-v2.png";
const HOME_ENTRY="assets/backgrounds/day2/day2-home-entry-living-afternoon-v1.png";
const FLORA_CAFE="assets/backgrounds/map-locations/020_flower-cafe.png";
const YEONHUI_STATION="assets/backgrounds/map-locations/018_yeonhui-station.png";
const HAEUN_DESK_PHONE="assets/events/day13-v3/cg-day13-v3-haeun-desk-photo-phone-pov-v1.png";
const NARI_FIRST_MEETING="assets/events/day14-v4/cg-day14-v4-nari-first-meeting-wide-v1.png";
const NARI_BROKEN_STEM_BOTTLE="assets/events/day14-v4/cg-day14-v4-nari-broken-stem-bottle-v1.png";
const FLOWER_RIBBON_HANDOFF="assets/events/day14-v4/cg-day14-v4-flower-ribbon-handoff-pov-v1.png";
const HAEUN_FLOWER_NOT_RECEIVED="assets/events/day14-v4/cg-day14-v4-haeun-flower-not-received-wide-v1.png";
const NARI_HAEUN_TILTED_BOTTLE="assets/events/day14-v4/cg-day14-v4-nari-haeun-tilted-bottle-wide-v1.png";
const YEONHUI_HAND_CONTACT="assets/events/day14-v4/cg-day14-v4-yeonhui-hand-contact-wide-v1.png";
const DESK_FLOWER_BOTTLE="assets/events/day14-v4/cg-day14-v4-desk-flower-bottle-pov-v1.png";
const DESK_EMPTY_SPACE="assets/events/day14-v4/cg-day14-v4-desk-empty-space-pov-v1.png";

const backgroundFor=number=>number<=3||number>=18?HOME_BEDROOM:number===17?YEONHUI_STATION:FLORA_CAFE;
const backgroundIdFor=number=>number<=3||number>=18?"home-afternoon":number===17?"yeonhui-station":"flower-cafe";
const branchBackgroundsFor=number=>number>=4&&number<=17?Object.freeze({FLORA:FLORA_CAFE,HOME:HOME_BEDROOM,IN_PERSON:number===17?YEONHUI_STATION:FLORA_CAFE,PHONE:HOME_BEDROOM,FULL_REST:HOME_BEDROOM}):Object.freeze({});
const eventCgFor=number=>number===1?HAEUN_DESK_PHONE:number===4?NARI_FIRST_MEETING:number===7?NARI_BROKEN_STEM_BOTTLE:number===8?FLOWER_RIBBON_HANDOFF:number===10?HAEUN_FLOWER_NOT_RECEIVED:number===15?NARI_HAEUN_TILTED_BOTTLE:number===17?YEONHUI_HAND_CONTACT:null;
const sfxFor=number=>Object.freeze(({
  1:["SFX_SPARE_PHONE_KEY"],2:["SFX_PHONE_SCREEN_OFF"],4:["SFX_FOOTSTEP_APPROACH"],7:["SFX_BAG_ZIPPER"],
  9:["SFX_SPARE_PHONE_KEY"],11:["SFX_CUP_SET_DOWN"],12:["SFX_CUP_SET_DOWN"],17:["SFX_FOOTSTEP_APPROACH"],
  18:["SFX_CUP_SET_DOWN"],20:["SFX_SPARE_PHONE_KEY"],21:["SFX_SPARE_PHONE_KEY"],22:["SFX_PHONE_SCREEN_OFF"]
}[number]??[]));

const sceneSpec=number=>Object.freeze({
  sceneNumber:number,backgroundId:backgroundIdFor(number),backgroundUrl:backgroundFor(number),branchBackgroundUrls:branchBackgroundsFor(number),eventCgUrl:eventCgFor(number),
  characterId:null,characterAssetUrl:null,shotMode:"wide-location-safe",transition:[1,4,9,12,17,18,20,22].includes(number)?"fade":"crossfade",
  camera:[1,4,7,9,12,17,18,20,21,22].includes(number)?"action-object-center":"wide-to-medium",
  bgm:Object.freeze({category:number>=18?"theme":"daily",variant:number>=18?1:0,volume:0.05}),sfx:sfxFor(number),
  safeArea:Object.freeze({desktop:"center-80",mobile:"center-60",objectPosition:"50% 42%"}),assetStatus:eventCgFor(number)?number===1?"ready-reuse":"ready-new":"ready-background-only",
  imageGate:eventCgFor(number)?"pass-original-resolution":"production-required"
});

export const DAY14_V4_PRESENTATION_SCENES=Object.freeze(Object.fromEntries(Array.from({length:22},(_,index)=>index+1).map(number=>[`D14V4_S${String(number).padStart(2,"0")}`,sceneSpec(number)])));
export const DAY14_V4_READY_REUSE_ASSETS=Object.freeze({homeBedroom:HOME_BEDROOM,homeEntry:HOME_ENTRY,floraCafe:FLORA_CAFE,yeonhuiStation:YEONHUI_STATION});
export const DAY14_V4_IMAGE_REQUIREMENTS=Object.freeze({
  haeunDeskPhonePov:Object.freeze({sceneNumbers:Object.freeze([1]),url:HAEUN_DESK_PHONE,status:"ready-reuse"}),
  nariFirstMeetingWide:Object.freeze({sceneNumbers:Object.freeze([4]),url:NARI_FIRST_MEETING,status:"ready-new"}),
  nariBrokenStemBottleInteraction:Object.freeze({sceneNumbers:Object.freeze([7]),url:NARI_BROKEN_STEM_BOTTLE,status:"ready-new",conditional:"day14V4OutingRoute=FLORA"}),
  flowerRibbonHandoffPov:Object.freeze({sceneNumbers:Object.freeze([8]),url:FLOWER_RIBBON_HANDOFF,status:"ready-new",conditional:"day14V4PurchaseOutcome=GIFT_FLOWER"}),
  haeunFlowerNotReceivedWide:Object.freeze({sceneNumbers:Object.freeze([10]),url:HAEUN_FLOWER_NOT_RECEIVED,status:"ready-new",conditional:"day14V4OutingRoute=FLORA AND day14V4InteractionRoute=IN_PERSON AND day14V4PurchaseOutcome=GIFT_FLOWER"}),
  nariHaeunTiltedBottleWide:Object.freeze({sceneNumbers:Object.freeze([15]),url:NARI_HAEUN_TILTED_BOTTLE,status:"ready-new",conditional:"day14V4OutingRoute=FLORA AND day14V4NariMet=true AND day14V4InteractionRoute=IN_PERSON"}),
  yeonhuiHandContactWide:Object.freeze({sceneNumbers:Object.freeze([17]),url:YEONHUI_HAND_CONTACT,status:"ready-new",conditional:"day14V4InteractionRoute=IN_PERSON AND day14V4RemainingTime in WALK_TO_STATION|MORE_TOGETHER AND day14V4PriorHandContact=true AND day14V4UnresolvedContactBoundary!=true AND day14V4HaeunInitiatedHand=true AND day14V4HandContactEstablished=true"}),
  deskFlowerOrEmptyPov:Object.freeze({sceneNumbers:Object.freeze([18,20,22]),urls:Object.freeze({flower:DESK_FLOWER_BOTTLE,empty:DESK_EMPTY_SPACE}),url:null,status:"ready-new",conditional:"flower variant for SELF_FLOWER|GIFT_FLOWER; empty variant for PHOTO_ONLY|NO_PURCHASE|INSUFFICIENT_FUNDS; unknown state renders no CG"})
});
export function getDay14V4ClosingDeskCg(flags={}){const outcome=flags.day14V4PurchaseOutcome;if(["SELF_FLOWER","GIFT_FLOWER"].includes(outcome))return DESK_FLOWER_BOTTLE;if(["PHOTO_ONLY","NO_PURCHASE","INSUFFICIENT_FUNDS"].includes(outcome))return DESK_EMPTY_SPACE;return null;}
export function getDay14V4Presentation(sceneNumber){return DAY14_V4_PRESENTATION_SCENES[`D14V4_S${String(sceneNumber).padStart(2,"0")}`]??null;}
export function validateDay14V4PresentationAudit(){
  const allowedSfx=new Set(["SFX_SPARE_PHONE_KEY","SFX_PHONE_SCREEN_OFF","SFX_FOOTSTEP_APPROACH","SFX_BAG_ZIPPER","SFX_CUP_SET_DOWN"]),scenes=Object.values(DAY14_V4_PRESENTATION_SCENES);
  return scenes.length===22&&scenes.every((scene,index)=>scene.sceneNumber===index+1&&scene.backgroundUrl&&scene.safeArea.mobile==="center-60"&&scene.sfx.every(id=>allowedSfx.has(id)))&&scenes[0].eventCgUrl===HAEUN_DESK_PHONE&&scenes[3].eventCgUrl===NARI_FIRST_MEETING&&scenes[6].eventCgUrl===NARI_BROKEN_STEM_BOTTLE&&scenes[7].eventCgUrl===FLOWER_RIBBON_HANDOFF&&scenes[9].eventCgUrl===HAEUN_FLOWER_NOT_RECEIVED&&scenes[14].eventCgUrl===NARI_HAEUN_TILTED_BOTTLE&&scenes[16].eventCgUrl===YEONHUI_HAND_CONTACT;
}
