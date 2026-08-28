import assert from "node:assert/strict";
import {createInitialState} from "../src/game-core.mjs";
import {createGirlfriendFromProfile} from "../src/girlfriend-manager.mjs";
import {SaveManager} from "../src/save-manager.mjs";
import {GAME_MODES} from "../src/scenario-state.mjs";
import {DAY6_V3_CHOICES} from "../src/day6-v3-campaign-data.mjs";
import {applyDay6V3Choice,beginDay6V3,getDay6V3Compatibility,getNextDay6V3Choice} from "../src/day6-v3-runtime.mjs";

const storage=()=>{const values=new Map();return {getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)}};
const create=()=>{const state=createInitialState(createGirlfriendFromProfile("haeun",()=>.5),()=>.5,{mode:GAME_MODES.MARRIAGE_30});state.day=6;state.storyFlags.day5RuntimeComplete=true;return state;};

const store=storage(),state=create();beginDay6V3(state,{relationshipBand:"HIGH"});
for(const choice of DAY6_V3_CHOICES.slice(0,10))applyDay6V3Choice(state,choice.options[choice.number%3].id);
assert.equal(state.storyFlags.day6V3SceneCheckpoint,21);assert.equal(state.storyFlags.day6V3ChoiceIndex,10);
const before=structuredClone(state.storyFlags);SaveManager.save(state,store);
const restored=SaveManager.load(store,GAME_MODES.MARRIAGE_30);assert.ok(restored);
for(const [key,value] of Object.entries(before))assert.deepEqual(restored.storyFlags[key],value,`restore ${key}`);
assert.equal(getNextDay6V3Choice(restored).number,11);
applyDay6V3Choice(restored,DAY6_V3_CHOICES[10].options[2].id);SaveManager.save(restored,store);
const completed=SaveManager.load(store,GAME_MODES.MARRIAGE_30);assert.equal(getDay6V3Compatibility(completed).complete,true);assert.equal(completed.storyFlags.day6V3SceneCheckpoint,23);assert.equal(completed.storyFlags.day7FirstPresentDatePending,true);

const legacy=create();legacy.storyFlags.day6RuntimeComplete=true;SaveManager.save(legacy,store);const legacyRestored=SaveManager.load(store,GAME_MODES.MARRIAGE_30);assert.deepEqual(getDay6V3Compatibility(legacyRestored),{mode:"V1_LEGACY",complete:true,checkpoint:null});
console.log("day6-v3-save-restore.test: all assertions passed");
