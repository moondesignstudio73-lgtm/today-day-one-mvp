import assert from "node:assert/strict";
import {existsSync,readFileSync} from "node:fs";
import {BACKGROUND_ASSETS} from "../src/assets/asset-manifest.mjs";
import {DAY2_AUDIO_CUES,validateDay2AudioData} from "../src/day2-audio-data.mjs";
import {DAY2_CONTACT_CHOICES,DAY2_KEY_CHOICES,DAY2_MARRIAGE_CHOICES,DAY2_PHOTO_CHOICES,DAY2_SEARCH_CHOICES,DAY2_TRAVEL_CHOICES,applyLockedDay2ChoiceState,getLockedDay2Segment,validateLockedDay2Runtime} from "../src/day2-campaign-runtime.mjs";

assert.equal(validateLockedDay2Runtime(),true);
assert.equal(validateDay2AudioData(),true);
for(const id of ["day2-hospital-bedside","day2-recovery-corridor","day2-hospital-lobby","day2-hospital-exit","day2-car-interior","day2-home-exterior","day2-home-entry","day2-bedroom"])assert.ok(BACKGROUND_ASSETS[id],id);
for(const cue of Object.values(DAY2_AUDIO_CUES))assert.ok(existsSync(new URL(`../${cue.source}`,import.meta.url)),cue.source);

const state={storyFlags:{contact_boundary:true,family_question_first:true,accident_interest:true},scenario:{enabled:true,investigation:0,memoryRecovery:0,haeunAffection:0,haeunTrust:0,homeSearchCount:0}};
for(const id of ["marriage_pause","set_home_boundary","ask_record_boundary","photo_observation","room_desk_checked","pc_interest","unclassified_key_found","key_log_only","contact_familiar"]){const result=applyLockedDay2ChoiceState(state,id);assert.ok(result,id);assert.ok(getLockedDay2Segment(state,result.stage).length>0,id);}
assert.equal(state.storyFlags.day2RuntimeStage,6);
assert.deepEqual(state.storyFlags.day2RoomSearches,["room_desk_checked","pc_interest","unclassified_key_found"]);
assert.equal(state.storyFlags.unclassified_key_found,true);
assert.equal(state.storyFlags.haeun_contact_unlocked,true);
assert.ok(state.scenario.homeSearchCount>=3);
assert.equal(applyLockedDay2ChoiceState(state,"room_desk_checked"),null,"duplicate search must be rejected");
assert.equal(DAY2_MARRIAGE_CHOICES.length,3);
assert.equal(DAY2_TRAVEL_CHOICES.length,3);
assert.equal(DAY2_PHOTO_CHOICES.length,3);
assert.equal(DAY2_SEARCH_CHOICES.length,5);
assert.equal(DAY2_KEY_CHOICES.length,2);
assert.equal(DAY2_CONTACT_CHOICES.length,3);
assert.ok(!JSON.stringify(getLockedDay2Segment(state,6)).includes("D-29"));
const scriptedAssets=[0,1,2,3,4,"key",5,6].flatMap(stage=>getLockedDay2Segment(state,stage)).flatMap(step=>[step.assetUrl,step.source].filter(Boolean));
for(const source of scriptedAssets)assert.ok(existsSync(new URL(`../${source}`,import.meta.url)),source);
const game=readFileSync(new URL("../game.js",import.meta.url),"utf8");
assert.match(game,/LOCKED_DAY2_SCENE_ID/);
assert.match(game,/DAY1_BGM_CUES\[step\.bgmCue\]\?\?DAY2_BGM_CUES/);
assert.match(game,/getLockedDay2Segment\(state/);
assert.match(game,/eventsUnlocked\|\|isCampaignPrologueStory\(nextStory\?\.id\)\?nextStory:null/,"DAY 2 campaign story must remain reachable before the regular event unlock day");
assert.match(game,/state\.pendingStoryId&&!state\.eventRuntime\?\.activeEvent/,"loading an active DAY 2 checkpoint must not queue a duplicate story session");
console.log("✓ DAY 2 잠금 시나리오 12 Scene·선택·탐색·에셋·오디오 런타임 검증 통과");
