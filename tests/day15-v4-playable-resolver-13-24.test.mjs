import assert from "node:assert/strict";
import test from "node:test";
import {DAY15_V4_RESOLVER_13_24_META,getDay15V4ResolvedScene13To24} from "../src/day15-v4-playable-resolver-13-24.mjs";

const state=flags=>({storyFlags:{day15V4AttendanceRoute:"ATTEND",day15V4GalleryInvitation:"INVITED",day15V4HaeunContactRoute:"IN_PERSON",day15V4HaeunLeft:false,day15V4Day14CallbackRoute:"TALKED_TOGETHER",day15V4ReturnWalk:"CLOSE_PACE",day15V4ShoulderContactOccurred:true,day15V4SelectedChoiceIds:[],...flags}});
const textOf=scene=>scene.steps.map(step=>step.text??"").join("\n");

test("resolver identifies exact-source ownership without mutating the source registry",()=>{
  assert.deepEqual(DAY15_V4_RESOLVER_13_24_META,{source:"RAW_DAY15_V4_SCRIPT_13_24",sourceMutation:false,routeResolvedScenes:[14,15,16,17,18,20,21,22,24],commonScenes:[13,19,23],status:"route-resolved"});
});

test("scene 14 selects exactly one Day 14 callback",()=>{
  const cases=[["TALKED_TOGETHER","안 고쳐 줘서 좋았어","어제는 혼자 있고 싶었고"],["RESTED_SEPARATELY","어제는 혼자 있고 싶었고","안 고쳐 줘서 좋았어"],["PRESSURED","준비한 게 있다고 해서","안 고쳐 줘서 좋았어"]];
  for(const [route,present,absent] of cases){const text=textOf(getDay15V4ResolvedScene13To24(state({day15V4Day14CallbackRoute:route}),14));assert.match(text,new RegExp(present));assert.doesNotMatch(text,new RegExp(absent));}
});

test("scene 15 selects callback prelude and only the stored choice 8 reaction",()=>{
  const selected=getDay15V4ResolvedScene13To24(state({day15V4SeojinCallbackAvailable:true,day15V4Choice8:"day15_v4_reciprocity_admit_fear",day15V4SelectedChoiceIds:["day15_v4_reciprocity_admit_fear"]}),15),text=textOf(selected);
  assert.match(text,/서진에게 회사 밖에서도/);assert.match(text,/누가 나한테 편한지까지/);assert.doesNotMatch(text,/비교할 이름 대신|그 얘기는 오늘 전시랑 따로/);assert.equal(selected.choiceAvailable,false);
  const open=getDay15V4ResolvedScene13To24(state({}),15);assert.equal(open.steps.at(-1).type,"choiceCue");assert.equal(open.steps.at(-1).choiceNumber,8);
});

test("scene 16 and 17 replay one stored reaction and never the alternatives",()=>{
  const boundary=textOf(getDay15V4ResolvedScene13To24(state({day15V4Choice9:"day15_v4_boundary_continue_control",day15V4SelectedChoiceIds:["day15_v4_boundary_continue_control"]}),16));
  assert.match(boundary,/나는 먼저 갈게/);assert.doesNotMatch(boundary,/그걸 다시 보고 싶었어|다 괜찮아졌다고/);
  const perception=textOf(getDay15V4ResolvedScene13To24(state({day15V4Choice10:"day15_v4_perception_not_sure",day15V4SelectedChoiceIds:["day15_v4_perception_not_sure"]}),17));
  assert.match(perception,/나도 말로 하니까 좀 달라/);assert.doesNotMatch(perception,/지금은 내 손밖에|그럼 다음엔 나도 그림 볼게/);
});

test("scene 18 does not promise a joint visit on a distance-preserving phone route",()=>{
  const close=textOf(getDay15V4ResolvedScene13To24(state({day15V4AttendanceRoute:"OWN_AFTERNOON",day15V4HaeunContactRoute:"PHONE"}),18));assert.match(close,/그럼 다음에는 같이 볼까/);assert.doesNotMatch(close,/전시 자체는 네가 봐도/);
  const distant=textOf(getDay15V4ResolvedScene13To24(state({day15V4AttendanceRoute:"OWN_AFTERNOON",day15V4HaeunContactRoute:"PHONE",day13V3HaeunNeedsSpace:true}),18));assert.match(distant,/전시 자체는 네가 봐도/);assert.doesNotMatch(distant,/그럼 다음에는 같이 볼까/);
});

test("scene 20 selects one return route and gates shoulder contact",()=>{
  const close=textOf(getDay15V4ResolvedScene13To24(state({}),20));assert.match(close,/어깨가 잠깐 닿는다/);assert.doesNotMatch(close,/가방을 자기 앞쪽으로|넌 오늘 뭐가 제일 남았어/);
  const noTouch=textOf(getDay15V4ResolvedScene13To24(state({day15V4ShoulderContactOccurred:false}),20));assert.doesNotMatch(noTouch,/어깨가 잠깐 닿는다|어깨를 감싸|같은 속도로 걷는다/);assert.match(noTouch,/카페에서 나와 역까지 걷는다|다음엔 말부터 해 볼게/);
  const phone=textOf(getDay15V4ResolvedScene13To24(state({day15V4AttendanceRoute:"OWN_AFTERNOON",day15V4HaeunContactRoute:"PHONE",day15V4ReturnWalk:"SEPARATE_HOMES"}),20));assert.match(phone,/넌 오늘 뭐가 제일 남았어/);assert.doesNotMatch(phone,/역 입구|어깨가 잠깐/);
});

test("scene 21 and 22 replay only their stored closing/material reactions",()=>{
  const closing=textOf(getDay15V4ResolvedScene13To24(state({day15V4Choice11:"day15_v4_closing_apologize",day15V4SelectedChoiceIds:["day15_v4_closing_apologize"]}),21));assert.match(closing,/바로 괜찮다고 하라는 뜻은 아니야/);assert.doesNotMatch(closing,/모르는 것도 같이 얘기하자|네가 먼저 얘기/);
  const material=textOf(getDay15V4ResolvedScene13To24(state({day15V4PublicMaterialOffered:true,day15V4Choice12:"day15_v4_material_read_tomorrow",day15V4SelectedChoiceIds:["day15_v4_material_read_tomorrow"]}),22));assert.match(material,/숙제 아니야/);assert.doesNotMatch(material,/정답지가 아니라|내가 뭘 봤는지 먼저/);
  const thanks=getDay15V4ResolvedScene13To24(state({day15V4Choice11:"day15_v4_closing_thanks",day15V4SelectedChoiceIds:["day15_v4_closing_thanks"]}),21);assert.equal(thanks.steps.length,1);assert.equal(thanks.steps[0].type,"choiceSelection");
});

test("scene 24 selects only route-valid closing memories",()=>{
  const attend=textOf(getDay15V4ResolvedScene13To24(state({}),24));assert.match(attend,/오늘 네가 가리킨 선|능숙한 시우와 서툰 자신/);assert.doesNotMatch(attend,/직접 보지 않은 그림|그가 어떤 사람이었는지 알 수 없었다/);
  const phone=textOf(getDay15V4ResolvedScene13To24(state({day15V4AttendanceRoute:"OWN_AFTERNOON",day15V4HaeunContactRoute:"PHONE",day15V4ReturnWalk:"SEPARATE_HOMES"}),24));assert.match(phone,/직접 보지 않은 그림/);assert.doesNotMatch(phone,/오늘 네가 가리킨 선|능숙한 시우와 서툰 자신/);
  const noContact=textOf(getDay15V4ResolvedScene13To24(state({day15V4AttendanceRoute:"OWN_AFTERNOON",day15V4HaeunContactRoute:"NO_CONTACT",day15V4ReturnWalk:"NOT_APPLICABLE"}),24));assert.match(noContact,/빈 다음 줄|그가 어떤 사람이었는지 알 수 없었다/);assert.doesNotMatch(noContact,/오늘 네가 가리킨 선|직접 보지 않은 그림/);
});

test("inactive late scenes emit no playable steps",()=>{
  const omitted=getDay15V4ResolvedScene13To24(state({day15V4AttendanceRoute:"OWN_AFTERNOON",day15V4HaeunContactRoute:"NO_CONTACT",day15V4ReturnWalk:"NOT_APPLICABLE"}),18);assert.equal(omitted.omitted,true);assert.deepEqual(omitted.steps,[]);
});

test("invalid callbacks, return routes, choices and contradictory endings fail closed",()=>{
  assert.throws(()=>getDay15V4ResolvedScene13To24(state({day15V4Day14CallbackRoute:"UNKNOWN"}),14),/CALLBACK_ROUTE_INVALID/);
  assert.throws(()=>getDay15V4ResolvedScene13To24(state({day15V4ReturnWalk:"UNKNOWN"}),20),/RETURN_WALK_INVALID/);
  assert.throws(()=>getDay15V4ResolvedScene13To24(state({day15V4Choice8:"missing"}),15),/RESOLVER_CHOICE_INVALID/);
  assert.throws(()=>getDay15V4ResolvedScene13To24(state({day15V4AttendanceRoute:"OWN_AFTERNOON",day15V4HaeunContactRoute:"IN_PERSON"}),24),/ENDING_ROUTE_CONTRADICTION/);
});

test("attended phone ending never claims the exhibition was unseen",()=>{
  const text=textOf(getDay15V4ResolvedScene13To24(state({day15V4AttendanceRoute:"ATTEND",day15V4HaeunContactRoute:"PHONE",day15V4ReturnWalk:"SEPARATE_HOMES"}),24));
  assert.match(text,/능숙한 시우와 서툰 자신/);assert.doesNotMatch(text,/직접 보지 않은 그림/);
});
