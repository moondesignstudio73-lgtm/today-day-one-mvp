import assert from "node:assert/strict";
import fs from "node:fs";
import {createHash} from "node:crypto";
import {beginDay14V4} from "../src/day14-v4-state-contract.mjs";
import {applyDay14V4Choice} from "../src/day14-v4-runtime.mjs";
import {getDay14V4ChoiceContinuation,getDay14V4ImmersiveScene,getDay14V4ImmersiveSegment,getDay14V4ResumePresentation,validateDay14V4ImmersiveAdapter} from "../src/day14-v4-immersive-adapter.mjs";
import {DAY14_V4_IMAGE_REQUIREMENTS,getDay14V4Presentation,validateDay14V4PresentationAudit} from "../src/day14-v4-presentation-data.mjs";

const fresh=options=>{const state={money:50000,storyFlags:{day13ScenarioVersion:"NOTION_V3",day13V3Completed:true,day14FlowerDeskPlanPending:true}};beginDay14V4(state,options);return state;};
const choose=(state,id)=>{const result=applyDay14V4Choice(state,id);return getDay14V4ChoiceContinuation(state,result.choiceNumber);};

let state=fresh({relationshipBand:"HIGH",priorHandContact:true,day13DeskPhotoReceived:true,haeunMeetingAvailability:"AVAILABLE",haeunCallsLater:true});
assert.equal(validateDay14V4PresentationAudit(),true);assert.equal(validateDay14V4ImmersiveAdapter(state),true);
assert.equal(getDay14V4ImmersiveScene(state,7).eventCgUrl,null);
assert.match(getDay14V4ImmersiveScene(state,1).eventCgUrl,/haeun-desk-photo-phone-pov/);assert.ok(getDay14V4ImmersiveScene(state,1).steps.some(step=>step.type==="cgShow"));
let segment=getDay14V4ImmersiveSegment(state);assert.equal(segment.awaitingChoice,true);assert.equal(segment.stopScene,2);assert.equal(segment.steps.at(-1).type,"choice");
let continuation=choose(state,"day14_wait_own_work");assert.ok(continuation.some(step=>step.text?.includes("오후에 내가 연락")));assert.equal(state.storyFlags.day14V4SceneCheckpoint,3);
choose(state,"day14_flower_for_room");choose(state,"day14_place_my_room");const giftContinuation=choose(state,"day14_take_gift_flower");assert.match(giftContinuation.find(step=>step.type==="cgShow")?.source??"",/flower-ribbon-handoff-pov/);assert.equal(giftContinuation.filter(step=>step.type==="cgShow"&&/flower-ribbon-handoff-pov/.test(step.source)).length,1);choose(state,"day14_invite_sit_without_demand");
assert.match(getDay14V4ImmersiveScene(state,4).eventCgUrl,/nari-first-meeting-wide/);assert.ok(getDay14V4ImmersiveScene(state,4).steps.some(step=>step.type==="cgShow"));
const scene7=getDay14V4ImmersiveScene(state,7),scene7CgSteps=scene7.steps.filter(step=>step.type==="cgShow");
assert.match(scene7.eventCgUrl,/nari-broken-stem-bottle/);assert.equal(scene7CgSteps.length,1);assert.equal(scene7.steps.some(step=>step.type==="ambientHold"),false);
assert.deepEqual({duration:scene7CgSteps[0].duration,fit:scene7CgSteps[0].fit,objectPosition:scene7CgSteps[0].objectPosition},{duration:2400,fit:"contain",objectPosition:"50% 42%"});
assert.ok(scene7.steps.findIndex(step=>step.type==="cgShow")>scene7.steps.findLastIndex(step=>step.type==="sfx"));
assert.match(getDay14V4Presentation(7).eventCgUrl,/nari-broken-stem-bottle/);assert.equal(DAY14_V4_IMAGE_REQUIREMENTS.nariBrokenStemBottleInteraction.status,"ready-new");
const scene7Asset=fs.readFileSync(new URL(`../${DAY14_V4_IMAGE_REQUIREMENTS.nariBrokenStemBottleInteraction.url}`,import.meta.url));
assert.equal(createHash("sha256").update(scene7Asset).digest("hex"),"756740fdc96bd7ff2e1e9cf1fe60c0db424ef8c40642be2de9adecff2784449e");
const scene8=getDay14V4ImmersiveScene(state,8),scene8CgSteps=scene8.steps.filter(step=>step.type==="cgShow");
assert.match(scene8.eventCgUrl,/flower-ribbon-handoff-pov/);assert.equal(scene8CgSteps.length,1);assert.equal(scene8.steps.some(step=>step.type==="ambientHold"),false);
assert.deepEqual({duration:scene8CgSteps[0].duration,fit:scene8CgSteps[0].fit,objectPosition:scene8CgSteps[0].objectPosition},{duration:2400,fit:"contain",objectPosition:"50% 42%"});
assert.ok(scene8.steps.findIndex(step=>step.type==="cgShow")>scene8.steps.findLastIndex(step=>step.type==="sfx"));
assert.match(getDay14V4Presentation(8).eventCgUrl,/flower-ribbon-handoff-pov/);assert.equal(DAY14_V4_IMAGE_REQUIREMENTS.flowerRibbonHandoffPov.status,"ready-new");
const scene8Asset=fs.readFileSync(new URL(`../${DAY14_V4_IMAGE_REQUIREMENTS.flowerRibbonHandoffPov.url}`,import.meta.url));
assert.equal(createHash("sha256").update(scene8Asset).digest("hex"),"e0c23ae0dc3c2186c86eb2df39c635a6c2ff2d6ce4d83efe0b781e9eb4a1937b");
const scene10=getDay14V4ImmersiveScene(state,10),scene10CgSteps=scene10.steps.filter(step=>step.type==="cgShow");
assert.match(scene10.eventCgUrl,/haeun-flower-not-received-wide/);assert.equal(scene10CgSteps.length,1);assert.equal(scene10.steps.some(step=>step.type==="ambientHold"),false);
assert.deepEqual({duration:scene10CgSteps[0].duration,fit:scene10CgSteps[0].fit,objectPosition:scene10CgSteps[0].objectPosition},{duration:2400,fit:"contain",objectPosition:"50% 42%"});
assert.ok(scene10.steps.findIndex(step=>step.type==="cgShow")>scene10.steps.findLastIndex(step=>step.type==="sfx"));
assert.match(getDay14V4Presentation(10).eventCgUrl,/haeun-flower-not-received-wide/);assert.equal(DAY14_V4_IMAGE_REQUIREMENTS.haeunFlowerNotReceivedWide.status,"ready-new");assert.equal(DAY14_V4_IMAGE_REQUIREMENTS.haeunFlowerNotReceivedWide.conditional,"day14V4OutingRoute=FLORA AND day14V4InteractionRoute=IN_PERSON AND day14V4PurchaseOutcome=GIFT_FLOWER");
const scene10Asset=fs.readFileSync(new URL(`../${DAY14_V4_IMAGE_REQUIREMENTS.haeunFlowerNotReceivedWide.url}`,import.meta.url));
assert.equal(createHash("sha256").update(scene10Asset).digest("hex"),"70ea28eec5b8468337f7e831f709147d0314e44210785fc64022a732cceb96e0");
const restored=JSON.parse(JSON.stringify(state)),resume=getDay14V4ResumePresentation(restored);assert.equal(resume.sceneNumber,10);assert.match(resume.backgroundUrl,/020_flower-cafe/);
assert.equal(getDay14V4ImmersiveSegment(restored).startScene,10);
choose(state,"day14_listen_allow_upset");
const scene15=getDay14V4ImmersiveScene(state,15),scene15CgSteps=scene15.steps.filter(step=>step.type==="cgShow");
assert.match(scene15.eventCgUrl,/nari-haeun-tilted-bottle-wide/);assert.equal(scene15CgSteps.length,1);assert.equal(scene15.steps.some(step=>step.type==="ambientHold"),false);
assert.deepEqual({duration:scene15CgSteps[0].duration,fit:scene15CgSteps[0].fit,objectPosition:scene15CgSteps[0].objectPosition},{duration:2400,fit:"contain",objectPosition:"50% 42%"});
assert.ok(scene15.steps.findIndex(step=>step.type==="cgShow")>scene15.steps.findLastIndex(step=>step.type==="sfx"));
assert.match(getDay14V4Presentation(15).eventCgUrl,/nari-haeun-tilted-bottle-wide/);assert.equal(DAY14_V4_IMAGE_REQUIREMENTS.nariHaeunTiltedBottleWide.status,"ready-new");assert.equal(DAY14_V4_IMAGE_REQUIREMENTS.nariHaeunTiltedBottleWide.conditional,"day14V4OutingRoute=FLORA AND day14V4NariMet=true AND day14V4InteractionRoute=IN_PERSON");
const scene15Asset=fs.readFileSync(new URL(`../${DAY14_V4_IMAGE_REQUIREMENTS.nariHaeunTiltedBottleWide.url}`,import.meta.url));
assert.equal(createHash("sha256").update(scene15Asset).digest("hex"),"6449a9f616cfb062ef36573158dfb98e0c5d690493ca0516d1d4eb70abfef54b");
assert.equal(scene15Asset.subarray(1,4).toString(),"PNG");assert.equal(scene15Asset.readUInt32BE(16),1672);assert.equal(scene15Asset.readUInt32BE(20),941);assert.equal(scene15Asset[25],2);
const missingNari=JSON.parse(JSON.stringify(state));missingNari.storyFlags.day14V4NariMet=false;
assert.equal(getDay14V4ImmersiveScene(missingNari,15).eventCgUrl,null);assert.equal(getDay14V4ImmersiveScene(missingNari,15).steps.some(step=>step.type==="cgShow"),false);
const phoneNari=JSON.parse(JSON.stringify(state));phoneNari.storyFlags.day14V4InteractionRoute="PHONE";
assert.equal(getDay14V4ImmersiveScene(phoneNari,15).eventCgUrl,null);assert.equal(getDay14V4ImmersiveScene(phoneNari,15).steps.some(step=>step.type==="cgShow"),false);
const handContinuation=choose(state,"day14_time_walk_station");assert.match(handContinuation.find(step=>step.type==="cgShow")?.source??"",/yeonhui-hand-contact-wide/);assert.equal(handContinuation.filter(step=>step.type==="cgShow"&&/yeonhui-hand-contact-wide/.test(step.source)).length,1);
const scene17=getDay14V4ImmersiveScene(state,17),scene17CgSteps=scene17.steps.filter(step=>step.type==="cgShow");
assert.match(scene17.eventCgUrl,/yeonhui-hand-contact-wide/);assert.equal(scene17CgSteps.length,1);assert.equal(scene17.steps.some(step=>step.type==="ambientHold"),false);
assert.deepEqual({duration:scene17CgSteps[0].duration,fit:scene17CgSteps[0].fit,objectPosition:scene17CgSteps[0].objectPosition},{duration:2400,fit:"contain",objectPosition:"50% 42%"});const scene17CgIndex=scene17.steps.findIndex(step=>step.type==="cgShow");assert.deepEqual(scene17.steps[scene17CgIndex-1],{type:"sfx",sfxId:"SFX_FOOTSTEP_APPROACH"});
assert.match(getDay14V4Presentation(17).eventCgUrl,/yeonhui-hand-contact-wide/);assert.equal(DAY14_V4_IMAGE_REQUIREMENTS.yeonhuiHandContactWide.status,"ready-new");assert.match(DAY14_V4_IMAGE_REQUIREMENTS.yeonhuiHandContactWide.conditional,/day14V4HandContactEstablished=true/);
const scene17Asset=fs.readFileSync(new URL(`../${DAY14_V4_IMAGE_REQUIREMENTS.yeonhuiHandContactWide.url}`,import.meta.url));assert.equal(createHash("sha256").update(scene17Asset).digest("hex"),"98819fcb30b75e5200d4432950cb13e8af66e3bb539388c8602345495a7e05dd");
assert.equal(scene17Asset.subarray(1,4).toString(),"PNG");assert.equal(scene17Asset.readUInt32BE(16),1672);assert.equal(scene17Asset.readUInt32BE(20),941);assert.equal(scene17Asset[25],2);
for(const mutate of [flags=>{flags.day14V4InteractionRoute="PHONE";},flags=>{flags.day14V4PriorHandContact=false;},flags=>{flags.day14V4UnresolvedContactBoundary=true;},flags=>{flags.day14V4HaeunInitiatedHand=false;},flags=>{flags.day14V4RemainingTime="HERE_GOODBYE";}]){const invalid=JSON.parse(JSON.stringify(state));mutate(invalid.storyFlags);assert.equal(getDay14V4ImmersiveScene(invalid,17).eventCgUrl,null);assert.equal(getDay14V4ImmersiveScene(invalid,17).steps.some(step=>step.type==="cgShow"),false);}
const purchaseIndependent=JSON.parse(JSON.stringify(state));purchaseIndependent.storyFlags.day14V4PurchaseOutcome="PHOTO_ONLY";assert.match(getDay14V4ImmersiveScene(purchaseIndependent,17).eventCgUrl,/yeonhui-hand-contact-wide/);
const flowerDesk18=getDay14V4ImmersiveScene(state,18);assert.match(flowerDesk18.eventCgUrl,/desk-flower-bottle-pov/);assert.equal(flowerDesk18.steps.filter(step=>step.type==="cgShow").length,1);assert.equal(flowerDesk18.steps.some(step=>step.type==="ambientHold"),false);
choose(state,"day14_room_make_flower_visible");choose(state,"day14_nari_talk_more");for(const sceneNumber of [20,22])assert.match(getDay14V4ImmersiveScene(state,sceneNumber).eventCgUrl,/desk-flower-bottle-pov/);
assert.equal(DAY14_V4_IMAGE_REQUIREMENTS.deskFlowerOrEmptyPov.status,"ready-new");const closingUrls=DAY14_V4_IMAGE_REQUIREMENTS.deskFlowerOrEmptyPov.urls;const flowerDeskAsset=fs.readFileSync(new URL(`../${closingUrls.flower}`,import.meta.url)),emptyDeskAsset=fs.readFileSync(new URL(`../${closingUrls.empty}`,import.meta.url));assert.equal(createHash("sha256").update(flowerDeskAsset).digest("hex"),"617c36b24d0e3f89879c99a52856be6792668f652a910c6bd628c5f9e17f19c8");assert.equal(createHash("sha256").update(emptyDeskAsset).digest("hex"),"3b689a0a4574dbdb16e03de8b077e748a5a04cfd9989fa90995fbb451d52b3cc");for(const asset of [flowerDeskAsset,emptyDeskAsset]){assert.equal(asset.subarray(1,4).toString(),"PNG");assert.equal(asset.readUInt32BE(16),1672);assert.equal(asset.readUInt32BE(20),941);assert.equal(asset[25],2);}
const unknownClosing=JSON.parse(JSON.stringify(state));unknownClosing.storyFlags.day14V4PurchaseOutcome=null;assert.equal(getDay14V4ImmersiveScene(unknownClosing,18).eventCgUrl,null);
assert.equal(getDay14V4ImmersiveScene(unknownClosing,18).steps.filter(step=>step.type==="ambientHold").length,1);for(const [outcome,pattern] of [["SELF_FLOWER",/desk-flower-bottle-pov/],["PHOTO_ONLY",/desk-empty-space-pov/],["NO_PURCHASE",/desk-empty-space-pov/],["INSUFFICIENT_FUNDS",/desk-empty-space-pov/]]){const route=JSON.parse(JSON.stringify(state));route.storyFlags.day14V4PurchaseOutcome=outcome;assert.match(getDay14V4ImmersiveScene(route,18).eventCgUrl,pattern);}
continuation=choose(state,"day14_night_thanks_for_talking");
assert.equal(state.storyFlags.day14V4Completed,true);assert.ok(continuation.some(step=>step.type==="sceneEnd"&&step.day===14&&step.complete===true));assert.equal(continuation.at(-1).nextHook,"day15-gallery-plan-pending");
const completedRestore=JSON.parse(JSON.stringify(state)),completedSegment=getDay14V4ImmersiveSegment(completedRestore);assert.equal(completedSegment.startScene,21);assert.ok(completedSegment.steps.some(step=>step.type==="sceneEnd"&&step.complete===true));

state=fresh({relationshipBand:"LOW",haeunMeetingAvailability:"UNAVAILABLE",haeunCallsLater:false,exhibitionInviteEligible:false});state.storyFlags.day14V4Day13DeskPhotoReceived=false;assert.equal(getDay14V4ImmersiveScene(state,1).eventCgUrl,null);
for(const id of ["day14_wait_ask_need","day14_stay_home_clear_space","day14_invite_rest_today","day14_reflect_my_day","day14_time_eat_my_dinner"])choose(state,id);
const emptyDesk18=getDay14V4ImmersiveScene(state,18);assert.match(emptyDesk18.eventCgUrl,/desk-empty-space-pov/);assert.equal(emptyDesk18.steps.filter(step=>step.type==="cgShow").length,1);assert.equal(emptyDesk18.steps.some(step=>step.type==="ambientHold"),false);
for(const id of ["day14_room_stop_and_eat","day14_no_nari_cleanup_enough"])choose(state,id);
assert.equal(getDay14V4ImmersiveScene(state,4).eventCgUrl,null);
assert.equal(getDay14V4ImmersiveScene(state,7).eventCgUrl,null);assert.equal(getDay14V4ImmersiveScene(state,7).steps.some(step=>step.type==="cgShow"),false);
assert.equal(getDay14V4ImmersiveScene(state,8).eventCgUrl,null);assert.equal(getDay14V4ImmersiveScene(state,8).steps.some(step=>step.type==="cgShow"),false);
const malformedHome=JSON.parse(JSON.stringify(state));malformedHome.storyFlags.day14V4PurchaseOutcome="GIFT_FLOWER";malformedHome.storyFlags.day14V4InteractionRoute="IN_PERSON";
malformedHome.storyFlags.day14V4NariMet=true;
assert.equal(getDay14V4ImmersiveScene(malformedHome,8).eventCgUrl,null);assert.equal(getDay14V4ImmersiveScene(malformedHome,8).steps.some(step=>step.type==="cgShow"),false);assert.equal(getDay14V4ImmersiveScene(malformedHome,10).eventCgUrl,null);assert.equal(getDay14V4ImmersiveScene(malformedHome,10).steps.some(step=>step.type==="cgShow"),false);assert.equal(getDay14V4ImmersiveScene(malformedHome,15).eventCgUrl,null);assert.equal(getDay14V4ImmersiveScene(malformedHome,15).steps.some(step=>step.type==="cgShow"),false);
assert.equal(state.storyFlags.day14V4Completed,true);assert.equal(state.storyFlags.day14V4SceneCheckpoint,20);assert.equal(getDay14V4ImmersiveScene(state,15).omitted,true);assert.equal(getDay14V4ImmersiveScene(state,16).omitted,true);

segment=getDay14V4ImmersiveSegment(state);assert.equal(segment.startScene,20);assert.ok(segment.steps.some(step=>step.text?.includes("연락 휴식 요청")));assert.ok(segment.steps.some(step=>step.type==="sceneEnd"));assert.equal(segment.steps.some(step=>step.type==="characterEnter"),false);
for(const sceneNumber of [20,22])assert.match(getDay14V4ImmersiveScene(state,sceneNumber).eventCgUrl,/desk-empty-space-pov/);

state=fresh({relationshipBand:"MID",haeunMeetingAvailability:"AVAILABLE"});
choose(state,"day14_wait_own_work");choose(state,"day14_flower_for_room");choose(state,"day14_place_my_room");choose(state,"day14_take_self_flower");
choose(state,"day14_invite_sit_without_demand");assert.equal(state.storyFlags.day14V4PurchaseOutcome,"SELF_FLOWER");assert.equal(state.storyFlags.day14V4InteractionRoute,"IN_PERSON");assert.equal(getDay14V4ImmersiveScene(state,8).eventCgUrl,null);assert.equal(getDay14V4ImmersiveScene(state,8).steps.some(step=>step.type==="cgShow"),false);assert.equal(getDay14V4ImmersiveScene(state,10).eventCgUrl,null);assert.equal(getDay14V4ImmersiveScene(state,10).steps.some(step=>step.type==="cgShow"),false);assert.match(getDay14V4ImmersiveScene(state,15).eventCgUrl,/nari-haeun-tilted-bottle-wide/);

const game=fs.readFileSync(new URL("../game.js",import.meta.url),"utf8");
assert.match(game,/beginDay14V4\(state,/);assert.match(game,/getDay14V4ImmersiveSegment\(state\)\.steps/);assert.match(game,/getDay14V4ChoiceContinuation\(state,result\.choiceNumber\)/);assert.match(game,/getDay14V4Compatibility\(state\)\.mode==="V1_LEGACY"&&state\.storyFlags\?\.day14RuntimeComplete/);
assert.match(game,/if\(day14Blocked\)\{toast\("DAY 13 V3 완료 기록과 꽃 계획을 확인한 뒤 DAY 14를 시작할 수 있습니다\."\);return;\}/);
console.log("day14-v4-immersive-adapter.test: all assertions passed");
