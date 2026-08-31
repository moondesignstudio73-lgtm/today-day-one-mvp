import assert from "node:assert/strict";
import test from "node:test";
import {DAY15_V4_RESOLVER_01_12_META,getDay15V4ResolvedScene01To12} from "../src/day15-v4-playable-resolver-01-12.mjs";

const state=flags=>({storyFlags:{day15V4GalleryInvitation:"INVITED",day15V4AttendanceRoute:"ATTEND",day15V4HaeunContactRoute:"IN_PERSON",day15V4SelectedChoiceIds:[],...flags}});
const textOf=scene=>scene.steps.map(step=>step.text??"").join("\n");

test("front resolver owns exact source without mutating its registry",()=>{
  assert.deepEqual(DAY15_V4_RESOLVER_01_12_META,{source:"RAW_DAY15_V4_SCRIPT_01_12",sourceMutation:false,routeResolvedScenes:[1,2,3,4,6,7,9,10,11,12],attendanceCommonScenes:[5,8],multiChoiceScene:6,status:"route-resolved"});
});

test("scene 1 selects invitation text and exactly one choice reaction",()=>{
  const attend=textOf(getDay15V4ResolvedScene01To12(state({day15V4Choice1:"day15_v4_invitation_attend",day15V4SelectedChoiceIds:["day15_v4_invitation_attend"]}),1));
  assert.match(attend,/두 시에 입구에서 볼까|면접 오는 표정/);assert.doesNotMatch(attend,/함께 오라는 말은 없다|끝나고 연락할게|일정은 그대로/);
  const noInvite=textOf(getDay15V4ResolvedScene01To12(state({day15V4GalleryInvitation:"NOT_INVITED",day15V4AttendanceRoute:"OWN_AFTERNOON",day15V4HaeunContactRoute:"NO_CONTACT",day15V4Choice1:"day15_v4_invitation_no_invite",day15V4SelectedChoiceIds:["day15_v4_invitation_no_invite"]}),1));
  assert.match(noInvite,/함께 오라는 말은 없다|두 가지가 자기에게는 쉽게 나란히|재밌게 보고 와/);assert.doesNotMatch(noInvite,/두 시에 입구에서 볼까|면접 오는 표정/);
});

test("scene 2 preserves the exact own-afternoon clothing close only on that route",()=>{
  const own=textOf(getDay15V4ResolvedScene01To12(state({day15V4AttendanceRoute:"OWN_AFTERNOON",day15V4HaeunContactRoute:"NO_CONTACT",day15V4Choice2:"day15_v4_outfit_admit_self_conscious",day15V4SelectedChoiceIds:["day15_v4_outfit_admit_self_conscious"]}),2));
  assert.match(own,/옷장한테는 진 것 같은데|누군가에게 보여 주려고 옷을 고르지 않아도/);
  const attend=textOf(getDay15V4ResolvedScene01To12(state({day15V4Choice2:"day15_v4_outfit_comfort",day15V4SelectedChoiceIds:["day15_v4_outfit_comfort"]}),2));
  assert.match(attend,/어깨가 덜 당긴다/);assert.doesNotMatch(attend,/누군가에게 보여 주려고/);
});

test("attendance emits only gallery scenes and exact choice reactions",()=>{
  const scene3=textOf(getDay15V4ResolvedScene01To12(state(),3));assert.match(scene3,/시우입니다|누구를 선택했다는 표시도 아닌/);assert.doesNotMatch(scene3,/아직 한 줄도 읽지 않았다/);
  const scene4=textOf(getDay15V4ResolvedScene01To12(state({day15V4Choice3:"day15_v4_gallery_observe",day15V4SelectedChoiceIds:["day15_v4_gallery_observe"]}),4));assert.match(scene4,/전시장 첫 방은 생각보다 조용하다|자기 속도로 한쪽 끝까지/);assert.doesNotMatch(scene4,/그림이 작은 게 아니라 방이 큰|고개만 한 번 더/);
  const scene7=textOf(getDay15V4ResolvedScene01To12(state({day15V4Choice4:"day15_v4_view_share_perception",day15V4SelectedChoiceIds:["day15_v4_view_share_perception"]}),7));assert.match(scene7,/같은 그림에서 다른 곳을 보고 있었다/);assert.doesNotMatch(scene7,/좋다고 하라는 뜻은 아니야|질문부터 다시 해/);
});

test("own-afternoon scene 6 preserves source order and exposes only the next choice",()=>{
  const flags={day15V4AttendanceRoute:"OWN_AFTERNOON",day15V4HaeunContactRoute:"NO_CONTACT",day15V4Choice3:"day15_v4_own_stop",day15V4Choice4:"day15_v4_own_write",day15V4SelectedChoiceIds:["day15_v4_own_stop","day15_v4_own_write"]};
  const scene=getDay15V4ResolvedScene01To12(state(flags),6),text=textOf(scene);
  assert.match(text,/그녀가 지금 무엇을 하고 있는지 모르면서도|틀릴 수도 있는 말을 적었다/);assert.doesNotMatch(text,/아\. 여기서 놓쳤네|한쪽이 즐겁다고 다른 쪽의 시간이 틀린/);assert.equal(scene.steps.at(-1).type,"choiceCue");assert.equal(scene.steps.at(-1).choiceNumber,5);assert.deepEqual(Object.keys(scene.choiceReactionStepsByNumber),["3","4"]);
  assert.deepEqual(scene.selectedChoiceIds,["day15_v4_own_stop","day15_v4_own_write"]);
  assert.throws(()=>getDay15V4ResolvedScene01To12(state({day15V4AttendanceRoute:"OWN_AFTERNOON",day15V4HaeunContactRoute:"NO_CONTACT",day15V4Choice4:"day15_v4_own_write",day15V4SelectedChoiceIds:["day15_v4_own_write"]}),6),/OWN_CHOICES_OUT_OF_ORDER/);
});

test("scene 9 and 10 keep the selected viewing pace without inventing a repair",()=>{
  const leave9=textOf(getDay15V4ResolvedScene01To12(state({day15V4Choice5:"day15_v4_rest_leave",day15V4RestDecision:"LEAVE",day15V4SelectedChoiceIds:["day15_v4_rest_leave"]}),9));assert.match(leave9,/시간 재면서 보고 싶진 않은데|미안하다고 하고 기다릴 수도/);assert.doesNotMatch(leave9,/좋아\. 나 여기 조금만/);
  const leave10=textOf(getDay15V4ResolvedScene01To12(state({day15V4RestDecision:"LEAVE"}),10));assert.match(leave10,/표정이 생각보다 굳어 있다|다리가 조금 피곤하다/);assert.doesNotMatch(leave10,/먼저 나가자는 말을 거두고|내가 본 게 네 눈에도/);
  const together=textOf(getDay15V4ResolvedScene01To12(state({day15V4RestDecision:"TOGETHER"}),10));assert.match(together,/내가 본 게 네 눈에도 들어가서/);assert.doesNotMatch(together,/표정이 생각보다 굳어 있다/);
});

test("scene 11 and 12 replay one exact response and retain omitted source details",()=>{
  const cafe=textOf(getDay15V4ResolvedScene01To12(state({day15V4Choice6:"day15_v4_cafe_window",day15V4SelectedChoiceIds:["day15_v4_cafe_window"]}),11));assert.match(cafe,/커튼 그림자 얼굴에 나온다|돌려줄게/);assert.doesNotMatch(cafe,/오늘 얘기는 나중에/);
  const control=textOf(getDay15V4ResolvedScene01To12(state({day15V4Choice7:"day15_v4_conflict_control",day15V4SelectedChoiceIds:["day15_v4_conflict_control"]}),12));assert.match(control,/누구도 두 사람의 대답을 기다리고 있지 않다|자기 불안을 그녀가 좁아져서 해결해 주길/);assert.doesNotMatch(control,/어느 순간에|내가 잘하는 데 네가 꼭 필요해야/);
});

test("inactive and corrupt routes fail closed",()=>{
  const own=state({day15V4AttendanceRoute:"OWN_AFTERNOON",day15V4HaeunContactRoute:"NO_CONTACT"});for(const number of [4,5,7,8,9,10,11,12]){const scene=getDay15V4ResolvedScene01To12(own,number);assert.equal(scene.omitted,true);assert.equal(scene.active,false);assert.deepEqual(scene.selectedChoiceIds,[]);}
  assert.throws(()=>getDay15V4ResolvedScene01To12(state({day15V4Choice3:"day15_v4_own_reread"}),4),/CHOICE_ROUTE_INVALID/);
  assert.throws(()=>getDay15V4ResolvedScene01To12(state({day15V4Choice1:"day15_v4_invitation_attend",day15V4SelectedChoiceIds:["day15_v4_invitation_own_time"]}),1),/CHOICE_MIRROR/);
  assert.throws(()=>getDay15V4ResolvedScene01To12(state({day15V4RestDecision:"UNKNOWN"}),10),/REST_DECISION_INVALID/);
});

test("attendance-common scenes are explicit and active only on the attendance route",()=>{
  for(const number of DAY15_V4_RESOLVER_01_12_META.attendanceCommonScenes){
    assert.equal(getDay15V4ResolvedScene01To12(state(),number).active,true);
    assert.equal(getDay15V4ResolvedScene01To12(state({day15V4AttendanceRoute:"OWN_AFTERNOON",day15V4HaeunContactRoute:"NO_CONTACT"}),number).active,false);
  }
});
