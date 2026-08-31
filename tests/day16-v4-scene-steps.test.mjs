import test from "node:test";
import assert from "node:assert/strict";
import {beginDay16V4} from "../src/day16-v4-state-contract.mjs";
import {applyDay16V4Choice} from "../src/day16-v4-runtime.mjs";
import {getDay16V4PlayerFacingSceneSteps} from "../src/day16-v4-scene-steps.mjs";
import {resolveDay16V4Scene} from "../src/day16-v4-branch-resolver.mjs";
import {DAY16_V4_EXACT_SOURCE_VARIANTS} from "../src/day16-v4-source-variants.mjs";

const fresh=()=>{const state={storyFlags:{day15V4Version:"NOTION_V4",day15V4Completed:true,day16JihoonContactHookPending:true}};beginDay16V4(state);return state;};
const choose=(state,id,context)=>applyDay16V4Choice(state,id,context);
const text=value=>value.steps.map(step=>step.text).join("\n");
const noSections=value=>assert.equal(value.steps.some(step=>step.type==="section"),false);
const enterCafe=(route="solo",greeting="talk")=>{const state=fresh();choose(state,route==="jihoon"?"day16_v4_time_jihoon_short":"day16_v4_time_solo_cafe");choose(state,"day16_v4_morning_own_time");choose(state,`day16_v4_greeting_${greeting}`);return state;};
const reachChoice6=(past="as_much_as_yuri",morning="own_time")=>{const state=fresh();choose(state,"day16_v4_time_solo_cafe");choose(state,`day16_v4_morning_${morning}`,morning==="no_contact"?{allowMorningNoContact:true}:undefined);choose(state,"day16_v4_greeting_talk");choose(state,`day16_v4_past_${past}`);choose(state,"day16_v4_starting_points_difficult");return state;};
const disclose=(intent="unknown")=>{const state=reachChoice6();choose(state,"day16_v4_current_return_to_book");choose(state,"day16_v4_contact_ask_next",{yuriAcceptedContact:true});choose(state,"day16_v4_reflection_record_words");choose(state,"day16_v4_evening_disclose_yuri");choose(state,`day16_v4_intent_${intent}`);return state;};

test("scene 3 and 4 select Jihoon or solo cafe prose without cross-route leakage",()=>{
  const jihoon=enterCafe("jihoon"),solo=enterCafe("solo");
  const j3=getDay16V4PlayerFacingSceneSteps(jihoon,3),s3=getDay16V4PlayerFacingSceneSteps(solo,3);
  assert.match(text(j3),/다 마신 걸 알고 친 거야/);assert.doesNotMatch(text(j3),/혼자 들른 날에는/);
  assert.match(text(s3),/혼자 들른 날에는/);assert.doesNotMatch(text(s3),/다 마신 걸 알고 친 거야/);
  assert.match(text(getDay16V4PlayerFacingSceneSteps(jihoon,4)),/지훈이 동석한 날에는/);
  assert.doesNotMatch(text(getDay16V4PlayerFacingSceneSteps(solo,4)),/지훈이 동석한 날에는/);
});

test("projected steps are exact registry references and choice bodies stay excluded",()=>{
  const state=reachChoice6(),source=resolveDay16V4Scene(state,10).source;
  const projected=getDay16V4PlayerFacingSceneSteps(state,10);
  assert.deepEqual(projected.steps.map(step=>source.steps.indexOf(step)),[0,1,2,3,4,5,6,7,8,9]);
  for(const step of projected.steps)assert.equal(source.steps.includes(step),true);
  assert.doesNotMatch(text(projected),/첫 답에|두 번째에는|세 번째에는|모든 걸 처음으로/);
  const opening=fresh(),scene1=getDay16V4PlayerFacingSceneSteps(opening,1);
  assert.doesNotMatch(text(scene1),/밥은 먹고 와|마주쳐도 내 몫|그럼 쉬어/);
});

test("scenes 8 and 9 select one authored conversation-depth section",()=>{
  const past=reachChoice6(),current=reachChoice6("not_today");
  assert.match(text(getDay16V4PlayerFacingSceneSteps(past,8)),/그때는 말 안 해도 아는 줄 알았거든/);
  assert.doesNotMatch(text(getDay16V4PlayerFacingSceneSteps(past,8)),/책 고르는 실력/);
  assert.match(text(getDay16V4PlayerFacingSceneSteps(current,9)),/책갈피를 꺼낸다/);
  assert.doesNotMatch(text(getDay16V4PlayerFacingSceneSteps(current,9)),/나쁜 사람이라고 하면/);
  const currentScene10=getDay16V4PlayerFacingSceneSteps(current,10);
  assert.deepEqual(currentScene10.steps,DAY16_V4_EXACT_SOURCE_VARIANTS.scene10CurrentConversation.steps);
  assert.equal(text(currentScene10),"네가 내 이름 부른 게 낯설었어요\n나는 익숙해서 불렀어");
  assert.doesNotMatch(text(currentScene10),/처음 듣는 얘기|너한테는 그렇겠지|너를 탓하는 말/);
  assert.match(DAY16_V4_EXACT_SOURCE_VARIANTS.scene10CurrentConversation.sourceExcerpt,/과거를 안 들은 길은/);
});

test("scene 13 removes only the alert and relationship claims that are false",()=>{
  const active=reachChoice6(),silent=reachChoice6("as_much_as_yuri","no_contact");
  const value=getDay16V4PlayerFacingSceneSteps(active,13,{haeunRelationshipActive:true});noSections(value);assert.match(text(value),/하은의 일상적인 답장/);
  const ended=getDay16V4PlayerFacingSceneSteps(active,13,{haeunRelationshipActive:false});assert.match(text(ended),/하은의 일상적인 답장/);assert.doesNotMatch(text(ended),/지금 만나는 사람/);
  const noContact=getDay16V4PlayerFacingSceneSteps(silent,13,{haeunRelationshipActive:true});assert.equal(text(noContact),"지금 만나는 사람의 이름을 말하면 이 대화의 모양이 달라질 것 같다.");
  const silentEnded=getDay16V4PlayerFacingSceneSteps(silent,13,{haeunRelationshipActive:false});assert.deepEqual(silentEnded.steps,[]);
});

test("scene 16 and 17 retain only the actual companion route",()=>{
  const jihoon=enterCafe("jihoon","overwhelmed"),solo=enterCafe("solo","overwhelmed");
  assert.match(text(getDay16V4PlayerFacingSceneSteps(jihoon,16)),/너는 알고 있었어/);assert.doesNotMatch(text(getDay16V4PlayerFacingSceneSteps(jihoon,16)),/유리가 앉았던 의자/);
  assert.match(text(getDay16V4PlayerFacingSceneSteps(solo,17)),/혼자 걷는 길|카페를 나와/);assert.doesNotMatch(text(getDay16V4PlayerFacingSceneSteps(solo,17)),/내가 연애를 잘했어/);
});

test("home evening scenes never invent Yuri",()=>{
  const state=fresh();for(const id of ["day16_v4_time_home_rest","day16_v4_morning_own_time","day16_v4_photo_current_first","day16_v4_evening_home_rest"])choose(state,id);
  for(const number of [19,21,22,24]){const value=getDay16V4PlayerFacingSceneSteps(state,number);noSections(value);assert.doesNotMatch(text(value),/유리/);}
  assert.match(text(getDay16V4PlayerFacingSceneSteps(state,21)),/뭐 먹었어/);
  assert.match(text(getDay16V4PlayerFacingSceneSteps(state,24)),/오래된 사진 폴더를 닫는다/);
});

test("disclosed scene 21 follows the stored intent while undisclosed cafe skips it",()=>{
  const unknown=disclose("unknown"),bounded=disclose("end_here");
  assert.match(text(getDay16V4PlayerFacingSceneSteps(unknown,21)),/내가 편한 건 다른 얘기/);assert.doesNotMatch(text(getDay16V4PlayerFacingSceneSteps(unknown,21)),/먼저 말해 준 걸/);
  assert.match(text(getDay16V4PlayerFacingSceneSteps(bounded,21)),/먼저 말해 준 걸/);assert.doesNotMatch(text(getDay16V4PlayerFacingSceneSteps(bounded,21)),/내가 편한 건 다른 얘기/);
  const hidden=enterCafe("solo","overwhelmed");choose(hidden,"day16_v4_reflection_eat_first");choose(hidden,"day16_v4_evening_solo_cafe");
  assert.deepEqual(getDay16V4PlayerFacingSceneSteps(hidden,21),{status:"SKIPPED",sceneNumber:21});
});

test("scenes 22 and 23 separate contact, invitation and no-promise endings",()=>{
  const shared=reachChoice6();choose(shared,"day16_v4_current_return_to_book");choose(shared,"day16_v4_contact_ask_next",{yuriAcceptedContact:true});
  assert.match(text(getDay16V4PlayerFacingSceneSteps(shared,22)),/모레 저녁은 잠깐 돼/);
  choose(shared,"day16_v4_reflection_record_words");choose(shared,"day16_v4_evening_organize_then_tell");choose(shared,"day16_v4_invite_decline");
  assert.match(text(getDay16V4PlayerFacingSceneSteps(shared,23)),/운동 상담이나 짧은 산책/);assert.doesNotMatch(text(getDay16V4PlayerFacingSceneSteps(shared,23)),/허락하면 괜찮아지는 일/);
  const pending=disclose("end_here");choose(pending,"day16_v4_invite_accept_intent");
  assert.match(text(getDay16V4PlayerFacingSceneSteps(pending,23)),/마음이 바뀌었다면/);assert.doesNotMatch(text(getDay16V4PlayerFacingSceneSteps(pending,23)),/몸 보고 정해/);
});
