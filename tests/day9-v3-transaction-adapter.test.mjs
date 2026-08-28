import test from "node:test";import assert from "node:assert/strict";
import {applyDay9V3Choice,beginDay9V3} from "../src/day9-v3-runtime.mjs";
import {DAY9_V3_CHOICES} from "../src/day9-v3-campaign-data.mjs";
import {DAY9_V3_ITEM_IDS,equipDay9V3GreenShirt,settleDay9V3Transactions} from "../src/day9-v3-transaction-adapter.mjs";
const choose=(state,ids)=>ids.forEach(id=>applyDay9V3Choice(state,id));
const base=money=>({day:9,money,inventory:[],economyLedger:[],girlfriendEquipment:{},storyFlags:{}});

test("accepted green gift and scarf exchange charge once each and do not auto-equip",()=>{
 const state=base(200000);beginDay9V3(state,{relationshipBand:"HIGH"});choose(state,["shopping9_together_full","gift9_say_intent_first","fit9_ask_green_preference","fit9_admit_not_listening","green9_like_her_smile","scarf9_buy_secret","scarf9_exchange_or_put_down","player9_try_her_top","checkout9_offer_green_gift","memory9_photo_together","dinner9_set_time_together"]);
 const result=settleDay9V3Transactions(state,{greenGiftAccepted:true});assert.deepEqual(result,{scarf:"EXCHANGED_NO_NEW_CHARGE",green:"GIFT_ACCEPTED",playerTop:"UNCHANGED"});
 assert.equal(state.money,120000);assert.equal(state.inventory.length,2);assert.equal(state.inventory.some(item=>item.itemId===DAY9_V3_ITEM_IDS.socks),true);const green=state.inventory.find(item=>item.itemId===DAY9_V3_ITEM_IDS.green);assert.equal(green.owner,"girlfriend");assert.equal(green.equipped,false);assert.equal(state.economyLedger.filter(entry=>entry.amount<0).length,2);
 assert.equal(equipDay9V3GreenShirt(state),true);assert.equal(green.equipped,true);const restored=JSON.parse(JSON.stringify(state));assert.deepEqual(restored,state);
});

test("self purchase never spends player money and player clothing purchase remains unequipped",()=>{
 const state=base(100000);beginDay9V3(state);choose(state,["shopping9_each_then_meet","gift9_observe_before_offer","fit9_say_my_preference","fit9_ask_wearing_comfort","green9_keep_my_taste_understand","scarf9_wait_my_desire","scarf9_admit_embarrassed","player9_choose_my_top","checkout9_each_buys_own","memory9_haeun_picks_photo","dinner9_contact_before_noon"]);
 const result=settleDay9V3Transactions(state,{haeunSelfPurchase:true,playerPurchase:true});assert.equal(result.green,"HAEUN_SELF_PURCHASED");assert.equal(result.playerTop,"BOUGHT_NOT_EQUIPPED");assert.equal(state.money,45000);assert.equal(state.inventory.find(item=>item.itemId===DAY9_V3_ITEM_IDS.green).source,"campaign-day9-self");assert.equal(state.inventory.find(item=>item.itemId===DAY9_V3_ITEM_IDS.playerTop).equipped,false);
});

test("insufficient funds create no ownership, debt, or automatic asset sale",()=>{
 const state=base(10000);beginDay9V3(state,{relationshipBand:"HIGH"});choose(state,["shopping9_together_full","gift9_say_intent_first","fit9_say_my_preference","fit9_ask_wearing_comfort","green9_like_her_smile","scarf9_buy_secret","scarf9_exchange_or_put_down","player9_choose_my_top","checkout9_offer_green_gift","memory9_haeun_picks_photo","dinner9_set_time_together"]);
 const result=settleDay9V3Transactions(state,{greenGiftAccepted:true,playerPurchase:true});assert.equal(result.scarf,"INSUFFICIENT_FUNDS");assert.equal(result.green,"INSUFFICIENT_FUNDS");assert.equal(state.money,10000);assert.equal(state.inventory.length,0);assert.equal(state.storyFlags.day9V3GreenShirtState,"UNPURCHASED");assert.equal(equipDay9V3GreenShirt(state),false);
});

test("adapter is idempotent and rejects legacy state",()=>{const state=base(200000);beginDay9V3(state);for(const choice of DAY9_V3_CHOICES)applyDay9V3Choice(state,choice.options.at(-1).id);settleDay9V3Transactions(state);const snapshot=JSON.stringify(state);settleDay9V3Transactions(state);assert.equal(JSON.stringify(state),snapshot);assert.throws(()=>settleDay9V3Transactions({storyFlags:{}}),/DAY9_V3_NOT_STARTED/);});
