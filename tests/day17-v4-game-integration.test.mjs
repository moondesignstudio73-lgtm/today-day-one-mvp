import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
import {applyDay17V4GameChoice,completeDay17V4GameChapter,getDay17V4Compatibility,getDay17V4GameSegment,prepareDay17V4GameEntry,validateDay17V4State} from "../src/day17-v4-game-bridge.mjs";
import {BACKGROUND_ASSETS} from "../src/assets/asset-manifest.mjs";

const fresh=(extra={})=>({storyFlags:{day16V4Version:"NOTION_V4",day16V4Completed:true,day16V4Day17BodyHookPending:true,day16V4YuriEncountered:true,day16V4YuriContact:"SHARED",day16V4YuriInvitation:"ANSWER_TOMORROW",day16V4HaeunYuriKnowledge:"LIMITED_CONVERSATION"},breakup:null,ended:false,...extra});
const pick=(state,id)=>applyDay17V4GameChoice(state,id).steps;

test("DAY 17 V4 meeting route plays twelve authored choices through DAY END",()=>{
  const state=fresh();assert.equal(prepareDay17V4GameEntry(state).mode,"V4");
  let steps;
  for(const id of ["day17_v4_size_gym","day17_v4_meet_ask","day17_v4_goal_fatigue","day17_v4_rush_compare","day17_v4_drink_new","day17_v4_fear_same","day17_v4_help_carry","day17_v4_rest_like","day17_v4_yuri_short","day17_v4_tell_meeting","day17_v4_tomorrow_body","day17_v4_night_moment"])steps=pick(state,id);
  assert.equal(state.storyFlags.day17V4SelectedChoiceIds.length,12);
  assert.equal(validateDay17V4State(state),true);
  assert.equal(steps.at(-2).type,"chapterCompletionCue");
  assert.deepEqual(completeDay17V4GameChapter(state,steps.at(-2)),{type:"sceneEnd",day:17,complete:true,nextHook:"day18-yuri-trust-pending"});
  assert.equal(getDay17V4Compatibility(state).complete,true);
  assert.equal(state.storyFlags.day17V4Day18HookPending,true);
});

test("solo route skips meeting-only choices and never invents Yuri contact",()=>{
  const state=fresh();state.storyFlags.day16V4YuriContact="ENDED_HERE";state.storyFlags.day16V4YuriInvitation="NONE";prepareDay17V4GameEntry(state);
  let steps,all=[...getDay17V4GameSegment(state)];
  for(const id of ["day17_v4_size_home","day17_v4_meet_solo","day17_v4_goal_info","day17_v4_solo_nothing","day17_v4_self_enough","day17_v4_life_solo","day17_v4_tell_life_plan","day17_v4_tomorrow_emotion","day17_v4_night_rest"]){steps=pick(state,id);all.push(...steps);}
  assert.equal(state.storyFlags.day17V4Choice4,undefined);assert.equal(state.storyFlags.day17V4Choice6,undefined);
  const played=JSON.stringify(all);assert.equal(played.includes("유리에게서 메시지가"),false);
  assert.equal(played.includes('"speaker":"담당자"'),false,"home route must not invent a gym staff reply");
  assert.ok(played.includes("휴대폰 화면을 끄고 달력의 빈 저녁 칸을 보았다."));
  assert.equal(played.includes("연락처를 나누지 않았거나"),false,"author branch conditions are not player dialogue");
  assert.equal(steps.at(-2).type,"chapterCompletionCue");
});

test("walk meeting route preserves route truth and full-scene dialogue density",()=>{
  const state=fresh(),all=[];prepareDay17V4GameEntry(state);all.push(...getDay17V4GameSegment(state));
  for(const id of ["day17_v4_size_walk","day17_v4_meet_ask","day17_v4_goal_compare","day17_v4_rush_compare","day17_v4_drink_familiar","day17_v4_fear_same","day17_v4_help_rest","day17_v4_rest_more","day17_v4_yuri_short","day17_v4_tell_meeting","day17_v4_tomorrow_logistics","day17_v4_night_moment"])all.push(...pick(state,id));
  const played=JSON.stringify(all),dialogues=all.filter(step=>step.type==="dialogue").length,narration=all.filter(step=>step.type==="narration").length;
  assert.ok(played.includes("정한 데까지만 걷고 왔어."));
  assert.equal(played.includes("설명만 듣고 나왔어."),false,"walk route must not claim a gym consultation");
  assert.ok(dialogues>=50,`expected dense V4 dialogue, got ${dialogues}`);
  assert.ok(narration>=45,`expected dense V4 narration, got ${narration}`);
});

test("resume returns the exact next unresolved choice and every background resolves",()=>{
  const state=fresh();prepareDay17V4GameEntry(state);pick(state,"day17_v4_size_walk");pick(state,"day17_v4_meet_ask");
  const segment=getDay17V4GameSegment(state);assert.equal(segment.at(-1).choiceNumber,3);
  for(const step of segment.filter(item=>item.type==="transition"))assert.ok(BACKGROUND_ASSETS[step.backgroundId],step.backgroundId);
});

test("legacy and blocked saves remain outside V4",()=>{
  assert.equal(prepareDay17V4GameEntry({storyFlags:{day17DataStrategy:"legacy"}}).mode,"V1_LEGACY");
  assert.equal(prepareDay17V4GameEntry({storyFlags:{}}).mode,"BLOCKED_PREREQUISITE");
});

test("game controller wires DAY 17 V4 entry, resume, choices and completion",()=>{
  const game=readFileSync(new URL("../game.js",import.meta.url),"utf8");
  for(const token of ["prepareDay17V4GameEntry(state)","getDay17V4GameResumePresentation(state)","getDay17V4GameSegment(state)","applyDay17V4GameChoice(state,choiceId)","completeDay17V4GameChapter(state,step)"])assert.ok(game.includes(token),token);
  assert.match(game,/getDay17V4Compatibility\(state\)\.mode==="V1_LEGACY"&&state\.storyFlags\?\.day17RuntimeComplete/);
});
