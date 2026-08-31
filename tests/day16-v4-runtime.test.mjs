import test from "node:test";
import assert from "node:assert/strict";
import {beginDay16V4,getDay16V4Compatibility,getDay16V4RestoreContract} from "../src/day16-v4-state-contract.mjs";
import {applyDay16V4Choice,completeDay16V4,getDay16V4ActiveChoiceNumbers,getNextDay16V4Choice} from "../src/day16-v4-runtime.mjs";

const fresh=()=>({storyFlags:{day15V4Version:"NOTION_V4",day15V4Completed:true,day16JihoonContactHookPending:true}});
const choose=(state,...items)=>items.forEach(item=>Array.isArray(item)?applyDay16V4Choice(state,item[0],item[1]):applyDay16V4Choice(state,item));

test("home route records only choices 1, 2, 8 and 9 and cannot invent Yuri",()=>{
  const state=fresh();beginDay16V4(state);
  choose(state,"day16_v4_time_home_rest","day16_v4_morning_own_time","day16_v4_photo_current_first","day16_v4_evening_home_rest");
  assert.deepEqual(getDay16V4ActiveChoiceNumbers(state),[1,2,8,9]);
  assert.equal(state.storyFlags.day16V4YuriEncountered,false);
  assert.equal(state.storyFlags.day16V4HaeunYuriKnowledge,"UNKNOWN");
  assert.throws(()=>completeDay16V4(state),/FINAL_SCENE_NOT_REACHED/);
  completeDay16V4(state,{finalSceneReached:true});
  assert.equal(state.storyFlags.day16V4Day17BodyHookPending,true);
  assert.equal(state.storyFlags.day16JihoonContactHookPending,false);
  assert.equal(getDay16V4RestoreContract(JSON.parse(JSON.stringify(state))).selectedChoiceIds.length,4);
});

test("greeting-only cafe route skips conversation and later invitation choices",()=>{
  const state=fresh();beginDay16V4(state);
  choose(state,"day16_v4_time_solo_cafe","day16_v4_morning_own_time","day16_v4_greeting_overwhelmed","day16_v4_reflection_eat_first","day16_v4_evening_solo_cafe");
  assert.deepEqual(getDay16V4ActiveChoiceNumbers(state),[1,2,3,8,9]);
  assert.equal(state.storyFlags.day16V4ConversationDepth,"GREETING_ONLY");
  assert.equal(state.storyFlags.day16V4EveningDisclosure,"OMITTED_YURI");
  completeDay16V4(state,{finalSceneReached:true});
});

test("full conversation requires Yuri's explicit contact response and preserves bounded knowledge",()=>{
  const state=fresh();beginDay16V4(state);
  choose(state,"day16_v4_time_jihoon_short",["day16_v4_morning_no_contact",{allowMorningNoContact:true}],"day16_v4_greeting_talk","day16_v4_past_as_much_as_yuri","day16_v4_starting_points_acknowledge",["day16_v4_current_name_haeun",{haeunRelationshipActive:true}]);
  assert.throws(()=>applyDay16V4Choice(state,"day16_v4_contact_ask_next"),/CONTACT_RESPONSE_REQUIRED/);
  applyDay16V4Choice(state,"day16_v4_contact_ask_next",{yuriAcceptedContact:true});
  choose(state,"day16_v4_reflection_record_words","day16_v4_evening_disclose_yuri","day16_v4_intent_curious_not_restart","day16_v4_invite_answer_tomorrow","day16_v4_final_tell_tomorrow");
  assert.equal(state.storyFlags.day16V4YuriWorkSource,"DIRECTLY_TOLD_BY_YURI");
  assert.equal(state.storyFlags.day16V4JihoonYuriKnowledgeSource,"DIRECTLY_TOLD_BY_JIHOON");
  assert.equal(state.storyFlags.day16V4HaeunYuriKnowledge,"CONTACT_SHARED");
  assert.equal(state.storyFlags.day16V4YuriInvitation,"ANSWER_TOMORROW");
  assert.equal(state.storyFlags.day16V4FinalHaeunUpdate,"DEFERRED");
  completeDay16V4(state,{finalSceneReached:true});
  assert.equal(getDay16V4Compatibility(state).complete,true);
});

test("ended relationship wording never stores a named current girlfriend",()=>{
  const state=fresh();beginDay16V4(state);
  choose(state,"day16_v4_time_solo_cafe","day16_v4_morning_own_time","day16_v4_greeting_apologize","day16_v4_past_not_today","day16_v4_starting_points_difficult",["day16_v4_current_name_haeun",{haeunRelationshipActive:false}],"day16_v4_contact_end_here","day16_v4_reflection_today_self","day16_v4_evening_organize_then_tell");
  assert.equal(state.storyFlags.day16V4HaeunRelationshipDisclosure,"WITHHELD");
  assert.equal(state.storyFlags.day16V4EveningDisclosure,"DEFERRED_WITH_DEADLINE");
  completeDay16V4(state,{finalSceneReached:true});
});

test("runtime rejects unavailable, out-of-order and corrupt choices atomically",()=>{
  const state=fresh();beginDay16V4(state);
  assert.throws(()=>applyDay16V4Choice(state,"day16_v4_greeting_talk"),/OPTION_UNAVAILABLE/);
  applyDay16V4Choice(state,"day16_v4_time_home_rest");
  const before=JSON.stringify(state);
  assert.throws(()=>applyDay16V4Choice(state,"day16_v4_morning_no_contact"),/OPTION_UNAVAILABLE/);
  assert.equal(JSON.stringify(state),before);
  state.storyFlags.day16V4Choice1="day16_v4_time_solo_cafe";
  assert.throws(()=>getNextDay16V4Choice(state),/CHOICE_MIRROR_CORRUPT:1/);
});
