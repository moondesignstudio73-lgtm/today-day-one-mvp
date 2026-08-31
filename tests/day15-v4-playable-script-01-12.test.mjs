import assert from "node:assert/strict";
import test from "node:test";
import {DAY15_V4_PLAYABLE_SCRIPT_01_12,getDay15V4PlayableScene01To12,validateDay15V4PlayableScript01To12} from "../src/day15-v4-playable-script-01-12.mjs";

const textOf=scene=>scene.steps.map(step=>step.text??"").join("\n");
const state=flags=>({storyFlags:{day15V4GalleryInvitation:"INVITED",day15V4AttendanceRoute:"ATTEND",day15V4HaeunContactRoute:"IN_PERSON",...flags}});

test("SCENE 01-12 registry preserves source order, density and all first-seven choice gates",()=>{
  assert.equal(validateDay15V4PlayableScript01To12(),true);assert.equal(DAY15_V4_PLAYABLE_SCRIPT_01_12.length,12);
  const source=JSON.stringify(DAY15_V4_PLAYABLE_SCRIPT_01_12);
  for(const marker of ["전시가 아니라 면접","옷장한테는 진","지난번에도 그러셨어요","안 읽은 자료한테요","내가 본 게 네 눈에도 들어가서","그럼 하나만","누구를 만나지 말지는 네가 정하지 말고"])assert.match(source,new RegExp(marker));
});

test("attendance route observes Siwoo and never plays own-afternoon alternatives",()=>{
  const scene3=getDay15V4PlayableScene01To12(state(),3),scene5=getDay15V4PlayableScene01To12(state(),5),scene6=getDay15V4PlayableScene01To12(state(),6);
  assert.match(textOf(scene3),/시우입니다/);assert.match(textOf(scene5),/지난번에도/);assert.doesNotMatch(textOf(scene6),/종이에 작은 표시/);assert.equal(scene6.choiceAvailable,false);
});

test("own afternoon omits gallery-only scenes and exposes replacement choices 3-5",()=>{
  const own=state({day15V4AttendanceRoute:"OWN_AFTERNOON",day15V4HaeunContactRoute:"NO_CONTACT"});
  for(const number of [4,5,7,8,9,10,11,12])assert.equal(getDay15V4PlayableScene01To12(own,number).omitted,true);
  const scene6=getDay15V4PlayableScene01To12(own,6);assert.deepEqual(scene6.steps.filter(step=>step.type==="choiceCue").map(step=>step.choiceNumber),[3,4,5]);assert.match(textOf(scene6),/자기 앞의 종이|종이에 작은 표시/);
});

test("stored source choices replay only their own immediate reactions",()=>{
  const ask=state({day15V4Choice3:"day15_v4_gallery_ask"});const scene4=getDay15V4PlayableScene01To12(ask,4);
  assert.match(textOf(scene4),/그림이 작은 게 아니라 방이 큰/);assert.doesNotMatch(textOf(scene4),/알아들은 것처럼/);assert.equal(scene4.steps.filter(step=>step.type==="choiceCue").length,0);assert.equal(scene4.choiceAvailable,false);
  const control=state({day15V4Choice7:"day15_v4_conflict_control"});const scene12=getDay15V4PlayableScene01To12(control,12);
  assert.match(textOf(scene12),/누구를 만나지 말지는 네가 정하지 말고/);assert.doesNotMatch(textOf(scene12),/내가 없어도 잘하는 게 좋고/);
});

test("unresolved choices emit one cue and attendance cannot replay stale own-afternoon branches",()=>{
  const scene4=getDay15V4PlayableScene01To12(state(),4);assert.deepEqual(scene4.steps.filter(step=>step.type==="choiceCue").map(step=>step.choiceNumber),[3]);
  const stale=getDay15V4PlayableScene01To12(state({day15V4Choice3:"day15_v4_own_reread",day15V4Choice4:"day15_v4_own_write",day15V4Choice5:"day15_v4_own_eat"}),6);
  assert.doesNotMatch(textOf(stale),/한 번 더 소리|틀릴 수도 있는 말을|종이를 정리하고/);assert.deepEqual(stale.selectedBranches,["attend"]);
});

test("leave request has an explicit repaired exit reaction instead of masquerading as separate viewing",()=>{
  const leave=getDay15V4PlayableScene01To12(state({day15V4RestDecision:"LEAVE"}),10);assert.deepEqual(leave.selectedBranches,["leave"]);assert.match(textOf(leave),/먼저 나가자는 말을 거두고/);assert.doesNotMatch(textOf(leave),/처음에는 하은이 언제 나오는지/);
});

test("not-invited opening never invents an invitation",()=>{
  const own=state({day15V4GalleryInvitation:"NOT_INVITED",day15V4AttendanceRoute:"OWN_AFTERNOON",day15V4Choice1:"day15_v4_invitation_no_invite"});const scene=getDay15V4PlayableScene01To12(own,1);
  assert.match(textOf(scene),/함께 오라는 말은 없다/);assert.match(textOf(scene),/재밌게 보고 와/);assert.doesNotMatch(textOf(scene),/두 시에 입구에서 볼까/);
});
