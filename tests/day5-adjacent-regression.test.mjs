import assert from "node:assert/strict";
import { createInitialState } from "../src/game-core.mjs";
import { createGirlfriendFromProfile } from "../src/girlfriend-manager.mjs";
import { SaveManager } from "../src/save-manager.mjs";
import { GAME_MODES } from "../src/scenario-state.mjs";
import { applyLockedDay5CheckpointState, applyLockedDay5ChoiceState } from "../src/day5-campaign-runtime.mjs";
import { getLockedDay6Segment } from "../src/day6-campaign-runtime.mjs";
import { selectNextStoryScene, resolveStoryChoice } from "../src/story-manager.mjs";
import { prepareCampaignDayAdvance } from "../src/story-flow-guard.mjs";
import { beginStoryFreeAction, completeStoryFreeAction, resolveStoryFreeAction } from "../src/story-free-action-manager.mjs";

const storage=()=>{const values=new Map();return {getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)}};
const create=mode=>{const state=createInitialState(createGirlfriendFromProfile("haeun",()=>.5),()=>.5,{mode});state.day=5;return state;};
const day4Record={sceneId:"m30-day4-arrive-home",arc:"집이라는 증거",choiceId:"cross-check-digital-address",day:4,response:"완료"};

const blocked=create(GAME_MODES.MARRIAGE_30);
assert.equal(selectNextStoryScene(blocked),null,"DAY 4 기록 없이는 DAY 5에 진입할 수 없다");
blocked.storyHistory.push(day4Record);
assert.equal(selectNextStoryScene(blocked)?.id,"m30-day5-work-return");

const freeMode=create(GAME_MODES.FREE_ROMANCE);
freeMode.storyHistory.push(day4Record);
assert.notEqual(selectNextStoryScene(freeMode)?.id,"m30-day5-work-return","자유 연애 모드에는 캠페인 DAY 5를 노출하지 않는다");

const state=blocked;
applyLockedDay5ChoiceState(state,"entry_current_facts");
applyLockedDay5CheckpointState(state,"after-introductions");
applyLockedDay5ChoiceState(state,"seojin_current_intent");
applyLockedDay5ChoiceState(state,"work_pair_check");
applyLockedDay5ChoiceState(state,"set-return-boundary");
applyLockedDay5CheckpointState(state,"before-day-report");
assert.equal(state.storyFlags.day5_haeun_autonomy_trust,true);
assert.equal(state.storyFlags.day6_life_restart_pending,true);
assert.ok(state.scenario.seojinAffection>0&&state.scenario.seojinStatusInterest>0,"서진의 두 상태 축은 독립 누적된다");

assert.ok(resolveStoryChoice(state,"m30-day5-work-return","set-return-boundary"));
state.storyFlags.day5RuntimeComplete=true;
assert.equal(prepareCampaignDayAdvance(state,"m30-day5-work-return"),5,"기록된 DAY 5는 한 번만 전환 가능하다");
assert.equal(state.day,6);
assert.equal(selectNextStoryScene(state)?.id,"m30-day6-neighborhood");
assert.equal(prepareCampaignDayAdvance(state,"m30-day5-work-return"),null,"DAY 5 중복 전환을 막는다");
assert.equal(getLockedDay6Segment(state,0)[0].type,"transition","기존 DAY 6 런타임 진입점이 유효하다");

const store=storage();SaveManager.save(state,store);const loaded=SaveManager.load(store);
assert.equal(loaded.day,6);assert.equal(selectNextStoryScene(loaded)?.id,"m30-day6-neighborhood");
assert.equal(loaded.storyFlags.day5_haeun_autonomy_trust,true);assert.equal(loaded.storyFlags.day6_life_restart_pending,true);
assert.equal(loaded.scenario.seojinAffection,state.scenario.seojinAffection);assert.equal(loaded.scenario.seojinStatusInterest,state.scenario.seojinStatusInterest);

const freeAction=create(GAME_MODES.MARRIAGE_30);freeAction.storyHistory.push(day4Record);
applyLockedDay5ChoiceState(freeAction,"entry_current_facts");applyLockedDay5CheckpointState(freeAction,"after-introductions");applyLockedDay5ChoiceState(freeAction,"seojin_role_history");applyLockedDay5ChoiceState(freeAction,"work_observe_only");applyLockedDay5ChoiceState(freeAction,"set-return-boundary");applyLockedDay5CheckpointState(freeAction,"before-day-report");
resolveStoryChoice(freeAction,"m30-day5-work-return","set-return-boundary");freeAction.storyFlags.day5RuntimeComplete=true;
beginStoryFreeAction(freeAction,"day5-office-evening");const result=resolveStoryFreeAction(freeAction,"leave-office-on-time",{random:()=>.99});
assert.equal(result.status,"REPORT");assert.equal(completeStoryFreeAction(freeAction),true);assert.equal(freeAction.storyFlags.day5FreeActionComplete,true);
assert.equal(prepareCampaignDayAdvance(freeAction,"m30-day5-work-return"),5);assert.equal(selectNextStoryScene(freeAction)?.id,"m30-day6-neighborhood");

console.log("day5-adjacent-regression.test: DAY 4→5 gating, DAY 5 free action/save, single DAY 6 reachability PASS");
