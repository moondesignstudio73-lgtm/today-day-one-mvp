import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createInitialState} from "../src/game-core.mjs";
import {createGirlfriendFromProfile} from "../src/girlfriend-manager.mjs";
import {GAME_MODES} from "../src/scenario-state.mjs";
import {SaveManager} from "../src/save-manager.mjs";
import {EventRuntimeManager} from "../src/event-runtime-manager.mjs";
import {DAY2_CONTACT_CHOICES,DAY2_HOME_CHOICES,DAY2_KEY_CHOICES,DAY2_MARRIAGE_CHOICES,DAY2_PHOTO_CHOICES,DAY2_SEARCH_CHOICES,DAY2_TRAVEL_CHOICES,applyLockedDay2ChoiceState,getLockedDay2Segment,normalizeDay2StoryFlags,validateLockedDay2StateMachine} from "../src/day2-campaign-runtime.mjs";
import {STORY_UI_STATES,deriveStoryUiState,getStoryUiInvariantViolations} from "../src/story-flow-guard.mjs";

const storage=()=>{const values=new Map();return {getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)};};
const createStoryState=()=>{const value=createInitialState(createGirlfriendFromProfile("haeun",()=>.5),()=>.5,{mode:GAME_MODES.MARRIAGE_30});value.day=2;value.phase=0;value.storyFlags={accident_interest:true,family_question_first:false,recovery_focus:false};normalizeDay2StoryFlags(value);return value;};
const roundTrip=value=>{const target=storage();SaveManager.save(value,target);const loaded=SaveManager.load(target,GAME_MODES.MARRIAGE_30);assert.ok(loaded,"story state should restore");return loaded;};
const routes=[
  [0,0,0,0,[0,1,2],0],[1,1,1,1,[1,3,4],1],[2,2,2,2,[4,0,3],2],[0,1,2,1,[2,3,0],1],[1,2,0,2,[4,1,2],0],
  [2,0,1,0,[3,2,1],2],[0,2,2,2,[0,4,2],0],[1,0,0,1,[2,4,3],1],[2,1,1,0,[1,0,4],2],[1,2,2,1,[3,1,0],0]
];

assert.equal(validateLockedDay2StateMachine(),true);
for(const [marriage,home,travel,photo,searches,contact] of routes){
  let state=createStoryState();
  for(const id of [DAY2_MARRIAGE_CHOICES[marriage].id,DAY2_HOME_CHOICES[home].id,DAY2_TRAVEL_CHOICES[travel].id,DAY2_PHOTO_CHOICES[photo].id]){const result=applyLockedDay2ChoiceState(state,id);assert.ok(result,id);assert.equal(getLockedDay2Segment(state,result.stage).at(-1).type,"choice");state=roundTrip(state);}
  for(const index of searches){const id=DAY2_SEARCH_CHOICES[index].id,result=applyLockedDay2ChoiceState(state,id);assert.ok(result,id);state=roundTrip(state);if(result.stage==="key"){const key=applyLockedDay2ChoiceState(state,DAY2_KEY_CHOICES[0].id);assert.ok(key);state=roundTrip(state);}}
  assert.equal(state.storyFlags.day2RoomSearches.length,3);
  assert.equal(state.storyFlags.day2RuntimeStage,5);
  const ending=applyLockedDay2ChoiceState(state,DAY2_CONTACT_CHOICES[contact].id);assert.equal(ending.stage,6);state=roundTrip(state);
  assert.equal(getLockedDay2Segment(state).at(-1).type,"sceneEnd");
}

const runtime=new EventRuntimeManager({timeoutMs:5});
runtime.start({id:"day2-rapid-choice"},100);runtime.markAssets("READY");runtime.transition("TRANSITIONING",{},101);runtime.transition("PLAYING",{},102);assert.equal(runtime.waitForInput("choice",{},103),true);
assert.equal(runtime.input.snapshot(103).locked,false);assert.equal(runtime.selectChoice("one"),true);for(let i=0;i<20;i++)assert.equal(runtime.selectChoice("one"),false,"rapid duplicate choice must be ignored");assert.equal(runtime.resumePlaying({},104),true);assert.equal(runtime.waitForInput("dialogue",{},105),true);assert.equal(runtime.input.snapshot(105).locked,false);
runtime.transition("PLAYING",{},106);runtime.input.lock("day2-rapid-choice","orphan",106);const recovered=runtime.watchdog(112);assert.equal(recovered.code,"EVENT_INPUT_LOCK_TIMEOUT");assert.equal(runtime.input.snapshot(112).locked,false);

assert.equal(deriveStoryUiState({runtimeState:"WAITING_CHOICE",stepType:"choice",exploration:true}),STORY_UI_STATES.EXPLORATION);
assert.equal(deriveStoryUiState({runtimeState:"PLAYING",stepType:"freeAction",freeActionStatus:"ACTIVE"}),STORY_UI_STATES.FREE_ACTION);
assert.deepEqual(getStoryUiInvariantViolations({storyMode:true,storyState:STORY_UI_STATES.DIALOGUE,actionGridVisible:true,nextButtonVisible:true}),["FREE_ACTION_GRID_VISIBLE_IN_STORY_MODE"]);
assert.deepEqual(getStoryUiInvariantViolations({storyMode:false,storyChoiceVisible:true}),["STORY_LAYER_VISIBLE_IN_FREE_MODE"]);

const modeStore=storage(),story=createStoryState(),free=createInitialState(createGirlfriendFromProfile("haeun",()=>.5),()=>.5,{mode:GAME_MODES.FREE_ROMANCE});SaveManager.save(story,modeStore);SaveManager.save(free,modeStore);assert.equal(SaveManager.load(modeStore,GAME_MODES.MARRIAGE_30).scenario.enabled,true);assert.equal(SaveManager.load(modeStore,GAME_MODES.FREE_ROMANCE).scenario.enabled,false);

const source=readFileSync(new URL("../game.js",import.meta.url),"utf8");
assert.match(source,/if\(storyCampaign\)\{if\(state\.phase===3&&isDay1HospitalNight\(\)\)renderDay1HospitalNight\(\);else renderStoryCampaignStandby\(\);return;\}/,"story render must return before the generic action-grid renderer");
assert.match(source,/classList\.toggle\("hidden",state\.scenario\?\.enabled===true\)/,"scene completion must keep generic controls hidden in Story Mode");
assert.match(source,/조사 \$\{day2SearchCount\} \/ 3/,"DAY 2 exploration must explain its completion rule");
assert.match(source,/eventRuntime\.waitForInput\("choice"/,"choice entry must use the recoverable runtime transition");
assert.match(source,/state\?\.storyFreeAction&&immersiveScene&&/,"initial story render must not read a missing free-action status");
assert.equal((source.match(/\$\("#storyChoiceLayer"\)\.addEventListener\("click"/g)??[]).length,1,"choice click delegation listener must be singleton");
assert.equal((source.match(/\$\("#storyChoiceLayer"\)\.addEventListener\("keydown"/g)??[]).length,1,"choice keyboard delegation listener must be singleton");
console.log("day2-story-flow-structural.test: 10 routes, save/load, rapid input, watchdog, mode/UI invariants PASS");
