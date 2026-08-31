import test from "node:test";
import assert from "node:assert/strict";
import {beginDay16V4} from "../src/day16-v4-state-contract.mjs";
import {applyDay16V4Choice} from "../src/day16-v4-runtime.mjs";
import {getDay16V4ChoiceReaction} from "../src/day16-v4-choice-reactions.mjs";

const fresh=()=>{const state={storyFlags:{day15V4Version:"NOTION_V4",day15V4Completed:true,day16JihoonContactHookPending:true}};beginDay16V4(state);return state;};
const choose=(state,id,context)=>applyDay16V4Choice(state,id,context);
const text=reaction=>reaction.steps.map(step=>step.text).join("\n");

test("choice 1 returns only the selected exact Jihoon reply",()=>{
  const state=fresh();choose(state,"day16_v4_time_solo_cafe");const value=text(getDay16V4ChoiceReaction(state,1));
  assert.match(value,/마주쳐도 내 몫 주문 안 해 놔/);assert.doesNotMatch(value,/밥은 먹고 와|그럼 쉬어/);
});

test("unknown and cross-choice option IDs fail before suffix projection",()=>{
  const state=fresh();choose(state,"day16_v4_time_solo_cafe");
  state.storyFlags.day16V4Choice1="fabricated_solo_cafe";state.storyFlags.day16V4SelectedChoiceIds[0]="fabricated_solo_cafe";
  assert.throws(()=>getDay16V4ChoiceReaction(state,1),/REACTION_REQUIRES_V4:BLOCKED_CORRUPT/);
  const crossed=fresh();choose(crossed,"day16_v4_time_solo_cafe");crossed.storyFlags.day16V4Choice1="day16_v4_greeting_overwhelmed";crossed.storyFlags.day16V4SelectedChoiceIds[0]="day16_v4_greeting_overwhelmed";
  assert.throws(()=>getDay16V4ChoiceReaction(crossed,1),/REACTION_REQUIRES_V4:BLOCKED_CORRUPT/);
});

test("choice 2 separates morning contact from an authorized no-contact boundary",()=>{
  const contacted=fresh();choose(contacted,"day16_v4_time_solo_cafe");choose(contacted,"day16_v4_morning_own_time");
  assert.match(text(getDay16V4ChoiceReaction(contacted,2)),/하은은 자기 오전 이야기를 짧게 답한다/);assert.doesNotMatch(text(getDay16V4ChoiceReaction(contacted,2)),/대화창을 닫는다/);
  const silent=fresh();choose(silent,"day16_v4_time_solo_cafe");choose(silent,"day16_v4_morning_no_contact",{allowMorningNoContact:true});
  assert.match(text(getDay16V4ChoiceReaction(silent,2)),/대화창을 닫는다/);assert.doesNotMatch(text(getDay16V4ChoiceReaction(silent,2)),/자기 오전 이야기를 짧게 답한다/);
});

test("choice 3 apology, talk and refusal never share reactions",()=>{
  for(const [id,want,forbidden] of [["day16_v4_greeting_apologize","그걸 네가 고른 건 아니잖아","오래는 못 있어"],["day16_v4_greeting_talk","오래는 못 있어","잘 지내"],["day16_v4_greeting_overwhelmed","그런 뜻으로 안 들을게","그걸 네가 고른 건 아니잖아"]]){
    const state=fresh();choose(state,"day16_v4_time_solo_cafe");choose(state,"day16_v4_morning_own_time");choose(state,id);const value=text(getDay16V4ChoiceReaction(state,3));assert.match(value,new RegExp(want));assert.doesNotMatch(value,new RegExp(forbidden));
  }
});

test("choices 4 and 5 keep only the selected reply before the shared emotional landing",()=>{
  const state=fresh();for(const id of ["day16_v4_time_solo_cafe","day16_v4_morning_own_time","day16_v4_greeting_talk"])choose(state,id);
  choose(state,"day16_v4_past_why_ended");const past=text(getDay16V4ChoiceReaction(state,4));assert.match(past,/지금 여기서는 말하고 싶지 않아/);assert.doesNotMatch(past,/좋았던 날도 있었다|예전의 우리 말고/);
  choose(state,"day16_v4_starting_points_difficult");const start=text(getDay16V4ChoiceReaction(state,5));assert.match(start,/그럼 잠깐 쉬자/);assert.match(start,/아까보다는 조금 덜/);assert.doesNotMatch(start,/모든 걸 처음으로 돌리고 싶지는 않아|그 말이 하고 싶었나 봐/);
});

test("choice 7 respects Yuri's explicit contact response",()=>{
  for(const [accepted,want,forbidden] of [[true,"둘은 연락 방법을 나눈다","오늘은 여기까지만 하고 싶어"],[false,"오늘은 여기까지만 하고 싶어","둘은 연락 방법을 나눈다"]]){
    const state=fresh();for(const id of ["day16_v4_time_solo_cafe","day16_v4_morning_own_time","day16_v4_greeting_talk","day16_v4_past_not_today","day16_v4_starting_points_difficult","day16_v4_current_return_to_book"])choose(state,id);choose(state,"day16_v4_contact_ask_next",{yuriAcceptedContact:accepted});const value=text(getDay16V4ChoiceReaction(state,7));assert.match(value,new RegExp(want));assert.doesNotMatch(value,new RegExp(forbidden));
  }
});

test("home choice 8 and 9 expose no cafe or Yuri branch text",()=>{
  const state=fresh();choose(state,"day16_v4_time_home_rest");choose(state,"day16_v4_morning_own_time");choose(state,"day16_v4_photo_current_first");
  assert.equal(text(getDay16V4ChoiceReaction(state,8)),"오늘 사진을 모으면 익숙한 얼굴이 아니라 자기가 본 장소가 먼저 눈에 들어온다.");
  choose(state,"day16_v4_evening_home_rest");const value=text(getDay16V4ChoiceReaction(state,9));assert.match(value,/오늘 사진 보다가 좀 이상했어/);assert.doesNotMatch(value,/유리|지훈만/);
});

test("choices 10 to 12 project only their selected exact consequences",()=>{
  const state=fresh();
  for(const [id,context] of [["day16_v4_time_solo_cafe"],["day16_v4_morning_own_time"],["day16_v4_greeting_talk"],["day16_v4_past_not_today"],["day16_v4_starting_points_difficult"],["day16_v4_current_return_to_book"],["day16_v4_contact_ask_next",{yuriAcceptedContact:true}],["day16_v4_reflection_record_words"],["day16_v4_evening_disclose_yuri"],["day16_v4_intent_unknown"],["day16_v4_invite_answer_tomorrow"],["day16_v4_final_tell_tomorrow"]])choose(state,id,context);
  assert.match(text(getDay16V4ChoiceReaction(state,10)),/바로 아무렇지 않다고는 못 하겠어/);assert.doesNotMatch(text(getDay16V4ChoiceReaction(state,10)),/같은 뜻으로 듣고 있어/);
  assert.match(text(getDay16V4ChoiceReaction(state,11)),/내일까지만 알려 줘/);assert.doesNotMatch(text(getDay16V4ChoiceReaction(state,11)),/잘 지내/);
  assert.match(text(getDay16V4ChoiceReaction(state,12)),/나도 오늘 답을 기다리지는 않을게/);assert.doesNotMatch(text(getDay16V4ChoiceReaction(state,12)),/허락하면 괜찮아지는 일/);
});

test("ended relationship variant fails closed instead of using girlfriend prose",()=>{
  const state=fresh();for(const id of ["day16_v4_time_solo_cafe","day16_v4_morning_own_time","day16_v4_greeting_talk","day16_v4_past_not_today","day16_v4_starting_points_difficult"])choose(state,id);
  choose(state,"day16_v4_current_name_haeun",{haeunRelationshipActive:false});assert.throws(()=>getDay16V4ChoiceReaction(state,6),/SOURCE_VARIANT_UNAVAILABLE:CHOICE6_ENDED_RELATIONSHIP/);
});
