import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
import {applyDay16V4GameChoice,completeDay16V4GameChapter,getDay16V4Compatibility,getDay16V4GameContext,getDay16V4GameResumePresentation,getDay16V4GameSegment,prepareDay16V4GameEntry} from "../src/day16-v4-game-bridge.mjs";
import {validateDay16V4ImmersiveAdapter} from "../src/day16-v4-immersive-adapter.mjs";

const fresh=(extra={})=>({storyFlags:{day15V4Version:"NOTION_V4",day15V4Completed:true,day16JihoonContactHookPending:true},breakup:null,ended:false,...extra});
const choose=(state,id)=>applyDay16V4GameChoice(state,id).steps;

test("new entry, resume and full authored cafe route use the V4 game bridge",()=>{
  const state=fresh();
  assert.equal(prepareDay16V4GameEntry(state).mode,"V4");
  assert.equal(getDay16V4GameResumePresentation(state).sceneNumber,1);
  assert.equal(getDay16V4GameSegment(state).at(-1).choiceNumber,1);
  let ending;
  for(const id of [
    "day16_v4_time_solo_cafe","day16_v4_morning_no_contact","day16_v4_greeting_talk",
    "day16_v4_past_not_today","day16_v4_starting_points_difficult","day16_v4_current_someone_close",
    "day16_v4_contact_ask_next","day16_v4_reflection_today_self","day16_v4_evening_disclose_yuri",
    "day16_v4_intent_curious_not_restart","day16_v4_invite_accept_intent","day16_v4_final_tell_update"
  ])ending=choose(state,id);
  const cue=ending.at(-1);
  assert.deepEqual(cue,{type:"chapterCompletionCue",day:16,finalSceneReached:true});
  const sceneEnd={type:"sceneEnd",day:16,complete:true,nextHook:"day17-body-check-pending"};
  assert.deepEqual(completeDay16V4GameChapter(state,cue),sceneEnd);
  assert.deepEqual(completeDay16V4GameChapter(state,cue),sceneEnd);
  assert.equal(getDay16V4Compatibility(state).complete,true);
  assert.equal(validateDay16V4ImmersiveAdapter(state,getDay16V4GameContext(state)),true);
  assert.deepEqual(getDay16V4GameSegment(state).at(-1),sceneEnd);
});

test("home route reaches the exact ending without Yuri choices",()=>{
  const state=fresh();prepareDay16V4GameEntry(state);
  let ending;
  for(const id of ["day16_v4_time_home_rest","day16_v4_morning_own_time","day16_v4_photo_current_first","day16_v4_evening_home_rest"])ending=choose(state,id);
  assert.equal(ending.at(-1).type,"chapterCompletionCue");
  assert.equal(JSON.stringify(ending).includes("유리에게서 메시지가 온다"),false);
});

test("missing ended-relationship reaction is locked only at the game surface",()=>{
  const state=fresh({ended:true,breakup:{day:15}});prepareDay16V4GameEntry(state);
  for(const id of ["day16_v4_time_solo_cafe","day16_v4_morning_own_time","day16_v4_greeting_talk","day16_v4_past_not_today","day16_v4_starting_points_acknowledge"])choose(state,id);
  const context=getDay16V4GameContext(state),choice=getDay16V4GameSegment(state).at(-1);
  assert.equal(context.haeunRelationshipActive,false);
  assert.equal(choice.choiceNumber,6);
  assert.deepEqual(choice.options.map(option=>option.id),["day16_v4_current_someone_close","day16_v4_current_return_to_book"]);
  assert.throws(()=>applyDay16V4GameChoice(state,"day16_v4_current_name_haeun"),/SOURCE_LOCKED/);
  assert.equal(choose(state,"day16_v4_current_return_to_book").some(step=>step.type==="dialogue"),true);
});

test("blocked and legacy saves are not mutated",()=>{
  for(const state of [{storyFlags:{}},{storyFlags:{day16RuntimeStage:1,day16ContactStrategy:"legacy"}}]){
    const before=JSON.stringify(state),mode=prepareDay16V4GameEntry(state).mode;
    assert.ok(["BLOCKED_PREREQUISITE","V1_LEGACY"].includes(mode));
    assert.equal(JSON.stringify(state),before);
  }
});

test("game.js routes DAY 16 V4 entry, choice, resume and completion",()=>{
  const game=readFileSync(new URL("../game.js",import.meta.url),"utf8");
  assert.match(game,/prepareDay16V4GameEntry\(state\)/);
  assert.match(game,/getDay16V4GameResumePresentation\(currentState\)/);
  assert.match(game,/getDay16V4GameSegment\(currentState\)/);
  assert.match(game,/applyDay16V4GameChoice\(state,choiceId\)/);
  assert.match(game,/completeDay16V4GameChapter\(state,step\)/);
  assert.match(game,/day16SharingStrategy\|\|state\.storyFlags\?\.day16V4Completed/);
  assert.match(game,/getDay16V4Compatibility\(state\)\.mode==="V1_LEGACY"&&state\.storyFlags\?\.day16RuntimeComplete/);
});
