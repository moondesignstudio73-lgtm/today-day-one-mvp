import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createInitialState} from "../src/game-core.mjs";
import {createGirlfriendFromProfile} from "../src/girlfriend-manager.mjs";
import {GAME_MODES} from "../src/scenario-state.mjs";
import {SaveManager} from "../src/save-manager.mjs";
import {applyLockedDay4ChoiceState,getLockedDay4Segment} from "../src/day4-campaign-runtime.mjs";

const storage=()=>{const values=new Map();return {getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)}};
const routes=[
  ["morning_awake_plain","contact_direct_call","identity_self","disclose_tell","taste_current","haeun_past_love","accident_last_contact","payment_self","reflection_good"],
  ["morning_flirt","contact_written_proof","identity_haeun","disclose_ask_permission","taste_old_order","old_drink_good","haeun_past_conflict","accident_behavior","payment_jihoon","reflection_strange"],
  ["morning_who_are_you","contact_haeun_crosscheck","identity_accident","disclose_silent","taste_old_order","old_drink_unsure","haeun_past_marriage","accident_haeun_problem","payment_split","reflection_curious"],
  ["morning_flirt","contact_direct_call","identity_self","disclose_tell","taste_old_order","old_drink_bad","haeun_past_love","accident_behavior","payment_split","reflection_good"],
  ["morning_awake_plain","contact_written_proof","identity_accident","disclose_silent","taste_new_menu","haeun_past_conflict","accident_last_contact","payment_jihoon","reflection_curious"]
];
for(const [routeIndex,route] of routes.entries()){
  let state=createInitialState(createGirlfriendFromProfile("haeun",()=>.5),()=>.5,{mode:GAME_MODES.MARRIAGE_30});state.day=4;state.money=50000;
  const day3Choice=["inspect-system-first","set-up-together","seal-until-home"][routeIndex%3];state.storyHistory=[{sceneId:"m30-day3-discharge-phone",choiceId:day3Choice,day:3,response:"완료"}];
  let expectedStage=0;
  for(const id of route){const result=applyLockedDay4ChoiceState(state,id);assert.ok(result.stage>=expectedStage,id);expectedStage=result.stage;const store=storage();SaveManager.save(state,store);state=SaveManager.load(store,GAME_MODES.MARRIAGE_30);assert.ok(state);assert.equal(state.storyFlags.day4RuntimeStage,expectedStage);assert.ok(getLockedDay4Segment(state).length>0);}
  assert.equal(expectedStage,10);
  assert.equal(state.storyFlags.friend_system_unlocked,true);assert.equal(state.storyFlags.day5_minho_hook,true);assert.equal(state.storyHistory[0].choiceId,day3Choice);
}
const free=createInitialState(createGirlfriendFromProfile("haeun",()=>.5),()=>.5,{mode:GAME_MODES.FREE_ROMANCE});
assert.equal(free.storyFlags.day4RuntimeVersion,undefined);assert.equal(free.storyFlags.friend_system_unlocked,undefined);
const css=readFileSync(new URL("../styles.css",import.meta.url),"utf8");
assert.match(css,/@media\(max-width:760px\)[\s\S]*campaign-story-mode[\s\S]*grid-template-rows:34px 40px/);
assert.match(css,/height:calc\(100dvh - 92px\)/);
console.log("✓ DAY 4 V3 전체 전략 대표 조합·DAY 3 콜백·DAY 5 훅·SaveManager 왕복 PASS");
