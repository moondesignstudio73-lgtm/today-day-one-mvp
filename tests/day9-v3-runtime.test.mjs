import assert from "node:assert/strict";
import {DAY9_V3_CHOICES,validateDay9V3CampaignData} from "../src/day9-v3-campaign-data.mjs";
import {applyDay9V3Choice,beginDay9V3,getDay9V3Compatibility,getNextDay9V3Choice,resolveDay9V3GreenGift,resolveDay9V3PlayerPurchase,validateDay9V3Runtime} from "../src/day9-v3-runtime.mjs";

assert.equal(validateDay9V3CampaignData(),true);assert.equal(validateDay9V3Runtime(),true);
assert.deepEqual(getDay9V3Compatibility({storyFlags:{day9SecondOfficeAdaptationCompleted:true,day9RuntimeStage:3}}),{mode:"V1_LEGACY",complete:true,checkpoint:3});
assert.deepEqual(beginDay9V3({storyFlags:{day9ScopeStrategy:"legacy"}}),{mode:"V1_LEGACY",complete:false,checkpoint:null});

const state={money:100000,storyFlags:{day9ClothingColorInvitationPending:true,seojinAffection:8,seojinStatusInterest:13}};
beginDay9V3(state,{relationshipBand:"HIGH",priorLightContact:true});assert.equal(getNextDay9V3Choice(state).number,1);
assert.throws(()=>applyDay9V3Choice(state,"dinner9_defer_and_ask_again"),/OUT_OF_ORDER/);
for(const choice of DAY9_V3_CHOICES){const result=applyDay9V3Choice(state,choice.options[0].id),restored=JSON.parse(JSON.stringify(state));assert.deepEqual(restored,state);assert.equal(getNextDay9V3Choice(restored)?.number??null,result.nextChoice?.number??null);}
assert.equal(state.storyFlags.day9V3Complete,true);assert.equal(state.storyFlags.day9V3SceneCheckpoint,24);assert.equal(state.storyFlags.day9V3SelectedChoiceIds.length,11);assert.equal(new Set(state.storyFlags.day9V3SelectedChoiceIds).size,11);
assert.equal(state.storyFlags.day9V3FoodHallEligible,true);assert.equal(state.storyFlags.day9V3SleeveContactAllowed,true);assert.equal(state.storyFlags.day9V3GreenShirtState,"GIFT_OFFER_PENDING");assert.equal(resolveDay9V3GreenGift(state,{accepted:true}),true);assert.equal(state.storyFlags.day9V3GreenShirtState,"GIFT_ACCEPTED");
assert.equal(state.storyFlags.day9V3DinnerStatus,"CONFIRMED");assert.equal(state.storyFlags.day9V3MenuStatus,"UNDECIDED");assert.equal(state.storyFlags.seojinAffection,8);assert.equal(state.storyFlags.seojinStatusInterest,13);

const low={money:0,storyFlags:{}};beginDay9V3(low,{relationshipBand:"LOW"});
for(const id of ["shopping9_together_short","gift9_secret_after_looking","fit9_confident_recommendation","fit9_push_special_day","green9_decide_buy_now","scarf9_buy_secret","scarf9_push_wear_once","player9_choose_my_top","checkout9_offer_green_gift","memory9_words_only","dinner9_set_time_together"])applyDay9V3Choice(low,id);
assert.equal(low.storyFlags.day9V3FoodHallEligible,false);assert.equal(low.storyFlags.day9V3DistanceRemaining,true);assert.equal(low.storyFlags.day9V3SleeveContactAllowed,false);assert.equal(low.storyFlags.day9V3InsufficientFunds,true);assert.equal(low.storyFlags.day9V3GreenShirtState,"UNPURCHASED");assert.equal(low.storyFlags.day9V3PlayerClothingState,"TRIED_NOT_BOUGHT");assert.equal(low.storyFlags.day9V3DinnerStatus,"CONTACT_BEFORE_NOON");assert.equal(low.storyFlags.day9V3GreenPhotoExists,true);

const rest={money:50000,storyFlags:{}};beginDay9V3(rest,{relationshipBand:"MID",priorLightContact:true});
for(const id of ["shopping9_each_then_meet","gift9_observe_before_offer","fit9_say_my_preference","fit9_ask_wearing_comfort","green9_like_her_smile","scarf9_buy_secret","scarf9_exchange_or_put_down","player9_rest_bench","checkout9_leave_then_decide","memory9_haeun_picks_photo","dinner9_defer_and_ask_again"])applyDay9V3Choice(rest,id);
assert.equal(rest.storyFlags.day9V3RestRoute,true);assert.equal(rest.storyFlags.day9V3PlayerClothingState,"NOT_TRIED");assert.equal(rest.storyFlags.day9V3ScarfState,"EXCHANGED");assert.equal(rest.storyFlags.day9V3DinnerStatus,"DEFERRED");assert.equal(resolveDay9V3PlayerPurchase(rest,{purchased:true}),false);

const player={money:1000,storyFlags:{}};beginDay9V3(player);for(const id of ["shopping9_together_full","gift9_say_intent_first","fit9_ask_green_preference","fit9_admit_not_listening","green9_keep_my_taste_understand","scarf9_wait_my_desire","scarf9_admit_embarrassed","player9_try_her_top","checkout9_each_buys_own","memory9_photo_together","dinner9_contact_before_noon"])applyDay9V3Choice(player,id);
assert.equal(player.storyFlags.day9V3PlayerClothingState,"PURCHASE_CONFIRM_PENDING");assert.equal(resolveDay9V3PlayerPurchase(player,{purchased:false}),true);assert.equal(player.storyFlags.day9V3PlayerClothingState,"TRIED_NOT_BOUGHT");

assert.throws(()=>beginDay9V3({storyFlags:{}},{relationshipBand:"INVALID"}),/RELATIONSHIP_BAND/);assert.throws(()=>applyDay9V3Choice({storyFlags:{}},"shopping9_together_full"),/NOT_STARTED/);
console.log("day9-v3-runtime.test: all assertions passed");
