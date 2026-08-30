import assert from "node:assert/strict";
import {beginDay14V4,getDay14V4RestoreContract} from "../src/day14-v4-state-contract.mjs";
import {DAY14_V4_PLAYABLE_SCRIPT_01_11,validateDay14V4PlayableScript01To11} from "../src/day14-v4-playable-script-01-11.mjs";
import {DAY14_V4_PLAYABLE_SCRIPT_12_22,validateDay14V4PlayableScript12To22} from "../src/day14-v4-playable-script-12-22.mjs";
import {applyDay14V4Choice,getDay14V4AvailableOptions,getDay14V4PlayableScene,getNextDay14V4Choice,validateDay14V4RuntimeState} from "../src/day14-v4-runtime.mjs";

const fresh=options=>{const state={storyFlags:{day13ScenarioVersion:"NOTION_V3",day13V3Completed:true,day14FlowerDeskPlanPending:true,seojinAffection:17,seojinStatusInterest:4,araTrust:6}};beginDay14V4(state,options);return state;};
const roundTrip=state=>JSON.parse(JSON.stringify(state));
const textOf=scene=>scene.steps.map(step=>step.text??"").join("\n");

assert.equal(validateDay14V4PlayableScript01To11(),true);assert.equal(validateDay14V4PlayableScript12To22(),true);
assert.equal(DAY14_V4_PLAYABLE_SCRIPT_01_11.length,11);assert.equal(DAY14_V4_PLAYABLE_SCRIPT_12_22.filter(scene=>Number.isInteger(scene.number)).length,11);
assert.match(JSON.stringify(DAY14_V4_PLAYABLE_SCRIPT_01_11),/내 건 내가 나중에 고를게/);
assert.match(JSON.stringify(DAY14_V4_PLAYABLE_SCRIPT_12_22),/안 좋아져도 같이 있을 수 있잖아/);

let state=fresh({relationshipBand:"HIGH",priorHandContact:true,unresolvedContactBoundary:false,canAffordFlower:true,haeunMeetingAvailability:"AVAILABLE",exhibitionInviteEligible:true});
for(const id of ["day14_wait_own_work","day14_flower_for_room","day14_place_my_room","day14_take_gift_flower","day14_invite_sit_without_demand","day14_listen_allow_upset","day14_time_walk_station","day14_room_make_flower_visible","day14_nari_talk_more","day14_night_thanks_for_talking"]){state=roundTrip(state);applyDay14V4Choice(state,id);assert.equal(validateDay14V4RuntimeState(state),true);}
assert.equal(state.storyFlags.day14V4Completed,true);assert.equal(state.storyFlags.day14V4NariMet,true);assert.equal(state.storyFlags.day14V4HaeunWorkStoryHeard,true);assert.equal(state.storyFlags.day14V4HandContactEstablished,true);assert.equal(state.storyFlags.day14V4ExhibitionInvitation,"INVITED");assert.equal(state.storyFlags.day15GalleryPlanPending,true);
assert.equal(state.storyFlags.seojinAffection,17);assert.equal(state.storyFlags.seojinStatusInterest,4);assert.equal(state.storyFlags.araTrust,6);
assert.match(textOf(getDay14V4PlayableScene(state,17)),/자기 손을 내민다/);assert.equal(getDay14V4RestoreContract(state).checkpoint,21);

state=fresh({relationshipBand:"LOW",priorHandContact:false,unresolvedContactBoundary:false,haeunMeetingAvailability:"UNAVAILABLE",haeunCallsLater:false,exhibitionInviteEligible:false});
applyDay14V4Choice(state,"day14_wait_ask_need");assert.equal(state.storyFlags.day14V4ChoiceIndex,1);assert.equal(state.storyFlags.day14V4SceneCheckpoint,3);applyDay14V4Choice(state,"day14_stay_home_clear_space");
assert.equal(getNextDay14V4Choice(state).number,5);assert.deepEqual(getDay14V4AvailableOptions(state,5).map(option=>option.id),["day14_invite_sit_without_demand","day14_invite_rest_today","day14_invite_direct_without_gift"]);
for(const id of ["day14_invite_rest_today","day14_reflect_my_day","day14_time_eat_my_dinner","day14_room_stop_and_eat","day14_no_nari_cleanup_enough"]){state=roundTrip(state);applyDay14V4Choice(state,id);}
assert.equal(state.storyFlags.day14V4Completed,true);assert.equal(state.storyFlags.day14V4SelectedChoiceIds.length,8);assert.equal(state.storyFlags.day14V4SelectedChoiceIds.at(-1),"day14_night_no_message");assert.equal(state.storyFlags.day14V4InteractionRoute,"FULL_REST");assert.equal(state.storyFlags.day14V4HaeunWorkStoryHeard,false);assert.equal(state.storyFlags.day14V4NariMet,false);assert.equal(state.storyFlags.day14V4HandContactEstablished,false);assert.equal(state.storyFlags.day14V4NightMessage,"NO_MESSAGE");assert.equal(state.storyFlags.day14V4ExhibitionInvitation,"NOT_INVITED");
assert.equal(state.storyFlags.day14V4SceneCheckpoint,20);
for(const sceneNumber of [5,6,7,8,13,15,16])assert.equal(getDay14V4PlayableScene(state,sceneNumber).omitted,true);
assert.match(textOf(getDay14V4PlayableScene(state,12)),/시작하면 끝까지 해야 할 것 같아/);assert.doesNotMatch(textOf(getDay14V4PlayableScene(state,17)),/자기 손을 내민다/);assert.match(textOf(getDay14V4PlayableScene(state,20)),/연락 휴식 요청/);

state=fresh({canAffordFlower:false,haeunMeetingAvailability:"AVAILABLE"});applyDay14V4Choice(state,"day14_wait_flower_solo");applyDay14V4Choice(state,"day14_flower_discuss_later");applyDay14V4Choice(state,"day14_place_haeun_later");
assert.deepEqual(getDay14V4AvailableOptions(state,4).map(option=>option.id),["day14_take_photo_only","day14_take_no_purchase"]);
assert.throws(()=>applyDay14V4Choice(state,"day14_take_gift_flower"),/UNAVAILABLE/);

state=fresh({haeunMeetingAvailability:"AVAILABLE"});applyDay14V4Choice(state,"day14_wait_ask_need");applyDay14V4Choice(state,"day14_stay_home_clear_space");applyDay14V4Choice(state,"day14_invite_sit_without_demand");assert.equal(state.storyFlags.day14V4InteractionRoute,"IN_PERSON");assert.equal(state.storyFlags.day14V4ContactRestActive,false);

assert.throws(()=>getDay14V4PlayableScene(state,17.1),/UNKNOWN_DAY14_V4_SCENE/);
console.log("day14-v4-playable-runtime.test: all assertions passed");
