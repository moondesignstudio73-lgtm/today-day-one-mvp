import assert from "node:assert/strict";
import {DAY4_V3_MORNING_CHOICES,DAY4_V3_CONTACT_CHOICES,DAY4_V3_FIRST_QUESTION_CHOICES,DAY4_V3_DISCLOSURE_CHOICES,DAY4_V3_TASTE_CHOICES,DAY4_V3_OLD_DRINK_CHOICES,DAY4_V3_HAEUN_PAST_CHOICES,DAY4_V3_PRE_ACCIDENT_CHOICES,DAY4_V3_PAYMENT_CHOICES,DAY4_V3_REFLECTION_CHOICES,getDay4RelationshipTier,getDay4V3MorningSegment,getDay4V3PhotoSegment,getDay4V3FirstCallSegment,getDay4V3MeetingSetupSegment,getDay4V3DisclosureReaction,getDay4V3CafeArrivalSegment,getDay4V3TasteReaction,getDay4V3OldDrinkReaction,getDay4V3PhotoMemoriesSegment,getDay4V3HaeunPastReaction,getDay4V3PreAccidentPreamble,getDay4V3PreAccidentReaction,getDay4V3BondAndPaymentSegment,getDay4V3PaymentReaction,getDay4V3FarewellSegment,getDay4V3EndingSegment,applyDay4V3OpeningChoiceState} from "../src/day4-v3-campaign-data.mjs";

const base=()=>({affection:400,trust:350,storyFlags:{},storyHistory:[]});
assert.equal(DAY4_V3_MORNING_CHOICES.length,3);
assert.equal(DAY4_V3_CONTACT_CHOICES.length,3);
assert.equal(getDay4RelationshipTier({affection:0,trust:0}),"LOW");
assert.equal(getDay4RelationshipTier({affection:400,trust:350}),"MID");
assert.equal(getDay4RelationshipTier({affection:700,trust:600}),"HIGH");
assert.match(JSON.stringify(getDay4V3MorningSegment(base())),/08:17/);
assert.match(JSON.stringify(getDay4V3MorningSegment(base())),/cg-day4-morning-message-pov-v1/);

for(const id of DAY4_V3_MORNING_CHOICES.map(x=>x.id)){
  const state=base(),before={affection:state.affection,trust:state.trust};
  assert.deepEqual(applyDay4V3OpeningChoiceState(state,id),{stage:1});
  const text=JSON.stringify(getDay4V3PhotoSegment(state));
  assert.match(text,id==="morning_awake_plain"?/그 말 이제 안믿음/:id==="morning_flirt"?/뻔뻔해졌네/:/네 여자친구/);
  assert.ok(state.affection>=before.affection&&state.trust>=before.trust);
}

for(const choiceId of ["inspect-system-first","set-up-together","seal-until-home"]){
  const state=base();state.storyHistory=[{sceneId:"m30-day3-discharge-phone",choiceId}];
  const text=JSON.stringify(getDay4V3PhotoSegment(state));
  assert.match(text,new RegExp(choiceId));
  assert.match(text,/비밀번호 화면/);assert.match(text,/교통카드/);assert.match(text,/볼링장 영수증/);
}
assert.match(JSON.stringify(getDay4V3PhotoSegment({affection:700,trust:600,storyFlags:{},storyHistory:[]})),/아직도 좀 신기해서/);
assert.match(JSON.stringify(getDay4V3PhotoSegment(base())),/cg-day4-group-photo-back-pov-v1/);

for(const id of DAY4_V3_CONTACT_CHOICES.map(x=>x.id)){
  const state=base();const beforeTrust=state.trust;
  assert.deepEqual(applyDay4V3OpeningChoiceState(state,id),{stage:2});
  assert.equal(state.storyFlags.jihoon_contacted,true);
  assert.equal(state.storyFlags.day4ContactStrategy,id);
  if(id==="contact_haeun_crosscheck")assert.equal(state.trust,beforeTrust+1);
}

for(const id of DAY4_V3_CONTACT_CHOICES.map(x=>x.id)){
  const state=base();state.storyFlags.day4ContactStrategy=id;
  const text=JSON.stringify(getDay4V3FirstCallSegment(state));
  assert.match(text,id==="contact_direct_call"?/너 진짜 깨어났어/:id==="contact_written_proof"?/친구한테 안녕하세요/:/그러니까 직접 알아봐/);
}
for(const id of DAY4_V3_FIRST_QUESTION_CHOICES.map(x=>x.id)){
  const state=base();assert.deepEqual(applyDay4V3OpeningChoiceState(state,id),{stage:3});
  const text=JSON.stringify(getDay4V3MeetingSetupSegment(state));
  assert.match(text,id==="identity_self"?/약속 같은 건/:id==="identity_haeun"?/여자친구니까/:/만나서 얘기하자/);
  assert.match(text,/역 앞 카페/);assert.match(text,/DAY 6/);
}
for(const id of DAY4_V3_DISCLOSURE_CHOICES.map(x=>x.id)){
  const state=base(),trust=state.trust;assert.deepEqual(applyDay4V3OpeningChoiceState(state,id),{stage:4});
  const text=JSON.stringify(getDay4V3DisclosureReaction(state));
  assert.match(text,id==="disclose_tell"?/재밌게 놀다 와/:id==="disclose_ask_permission"?/허락을 받아/:/보고할 필요/);
  if(id==="disclose_silent")assert.equal(state.storyFlags.day4HaeunDisclosurePending,true);
  else assert.equal(state.trust,trust+2);
}
assert.match(JSON.stringify(getDay4V3CafeArrivalSegment(base())),/cg-day4-jihoon-stopped-hug-v1/);
assert.match(JSON.stringify(getDay4V3CafeArrivalSegment(base())),/접촉 전에 멈췄다/);
for(const id of DAY4_V3_TASTE_CHOICES.map(x=>x.id)){
  const state=base();applyDay4V3OpeningChoiceState(state,id);const text=JSON.stringify(getDay4V3TasteReaction(state));
  assert.match(text,id==="taste_current"?/누구 하나가 틀렸다고/:id==="taste_old_order"?/아이스 아메리카노/:/남이 정해주는 거/);
}
for(const id of DAY4_V3_OLD_DRINK_CHOICES.map(x=>x.id)){
  const state=base();assert.deepEqual(applyDay4V3OpeningChoiceState(state,id),{stage:6});
  const text=JSON.stringify(getDay4V3OldDrinkReaction(state));assert.match(text,id==="old_drink_good"?/몸이 기억/:id==="old_drink_bad"?/다시 좋아해야/:/다시 알아가야/);
}
assert.match(JSON.stringify(getDay4V3PhotoMemoriesSegment(base())),/cg-day4-table-phone-photo-pov-v1/);
assert.match(JSON.stringify(getDay4V3PhotoMemoriesSegment(base())),/둘 다 나였을/);
for(const id of DAY4_V3_HAEUN_PAST_CHOICES.map(x=>x.id)){
  const state=base();assert.deepEqual(applyDay4V3OpeningChoiceState(state,id),{stage:7});
  const text=JSON.stringify(getDay4V3HaeunPastReaction(state));assert.match(text,id==="haeun_past_love"?/표정부터 달라/:id==="haeun_past_conflict"?/연애 상담/:/말할 때는 진짜/);
  assert.match(JSON.stringify(getDay4V3PreAccidentPreamble(state)),/추측과 사실을 구분/);
}
for(const id of DAY4_V3_PRE_ACCIDENT_CHOICES.map(x=>x.id)){
  const state=base();assert.deepEqual(applyDay4V3OpeningChoiceState(state,id),{stage:8});const text=JSON.stringify(getDay4V3PreAccidentReaction(state));
  assert.match(text,id==="accident_last_contact"?/예전 폰/:id==="accident_behavior"?/나도 모르겠다는/:/내 추측까지/);
}
assert.match(JSON.stringify(getDay4V3BondAndPaymentSegment(base())),/cg-day4-payment-card-receipt-pov-v1/);
for(const id of DAY4_V3_PAYMENT_CHOICES.map(x=>x.id)){
  const state={...base(),money:10000};assert.deepEqual(applyDay4V3OpeningChoiceState(state,id),{stage:9});const text=JSON.stringify(getDay4V3PaymentReaction(state));
  assert.match(text,id==="payment_self"?/부자 됐냐/:id==="payment_jihoon"?/1년 기다렸는데/:/지금은 이게 편해/);
  assert.ok(state.money>=0);
}
assert.match(JSON.stringify(getDay4V3FarewellSegment(base())),/다시 친구가 되는 법/);
for(const id of DAY4_V3_REFLECTION_CHOICES.map(x=>x.id)){
  const state=base();assert.deepEqual(applyDay4V3OpeningChoiceState(state,id),{stage:10});const text=JSON.stringify(getDay4V3EndingSegment(state));
  assert.match(text,id==="reflection_good"?/다시 시작하면/:id==="reflection_strange"?/친구끼리는/:/둘 다 너였을/);
  assert.equal(state.storyFlags.friend_system_unlocked,true);assert.equal(state.storyFlags.past_contacts_index,true);assert.equal(state.storyFlags.day5_minho_hook,true);
  assert.match(text,/FRIEND SYSTEM UNLOCKED/);assert.match(text,/복귀 절차와 현재 팀 상황/);
}

const all=JSON.stringify([getDay4V3MorningSegment(base()),getDay4V3PhotoSegment(base()),getDay4V3FirstCallSegment(base()),getDay4V3MeetingSetupSegment(base()),getDay4V3CafeArrivalSegment(base()),getDay4V3PhotoMemoriesSegment(base()),getDay4V3PreAccidentPreamble(base())]);
for(const forbidden of ["사고는 고의","범인은","윤서진과 연애","하은이 거짓말"])assert.doesNotMatch(all,new RegExp(forbidden));
console.log("DAY 4 V3 opening data tests passed");
