import assert from 'node:assert/strict';
import test from 'node:test';
import {createInitialState} from '../src/game-core.mjs';
import {createGirlfriendFromProfile} from '../src/girlfriend-manager.mjs';
import {GAME_MODES} from '../src/scenario-state.mjs';
import {SaveManager} from '../src/save-manager.mjs';
import {readFileSync} from 'node:fs';
import {day28CallFixture,day28FriendlyFixture,day28NewMeetingFixture,day28SoloFixture} from './day28-v4-playable-fixture.mjs';
import {getDay28V4Options} from '../src/day28-v4-state-contract.mjs';
import {applyDay28V4GameChoice,applyDay28V4GameResolution,completeDay28V4GameChapter,getDay28V4GameCompatibility,getDay28V4GameResumePresentation,getDay28V4GameSegment,isDay28V4ResolutionStep} from '../src/day28-v4-game-bridge.mjs';
import {getDay28V4RuntimeResolution} from '../src/day28-v4-runtime-resolution.mjs';

const choose=state=>applyDay28V4GameChoice(state,getDay28V4Options(state.storyFlags.day28V4)[0].id);
function finish(state){const all=[];let guard=0;while(state.storyFlags.day28V4.phase!=='ending'){assert.ok(guard++<70,state.storyFlags.day28V4.phase);const steps=getDay28V4GameSegment(state);all.push(...steps);const cue=steps.find(isDay28V4ResolutionStep);if(cue)all.push(...applyDay28V4GameResolution(state,getDay28V4RuntimeResolution(state,cue)).steps);else all.push(...choose(state).steps);}all.push(...getDay28V4GameSegment(state));return all;}
const storage=()=>{const data=new Map();return {setItem:(key,value)=>data.set(key,value),getItem:key=>data.get(key)??null,removeItem:key=>data.delete(key)};};

test('Story session startup restores the V4 presentation instead of overwriting it with the rehearsal',()=>{
  const source=readFileSync(new URL('../game.js',import.meta.url),'utf8');
  const resumeLine=source.split('\n').find(line=>line.includes('if(session.id===LOCKED_DAY28_SCENE_ID)'));
  assert.ok(resumeLine);
  assert.match(resumeLine,/getDay28ResumePresentation\(state\)/);
  assert.doesNotMatch(resumeLine,/getLockedDay28ResumePresentation\(state\)/);
  assert.match(resumeLine,/resumeVisual\.backgroundUrl\?\?getBackgroundAsset/);
  assert.match(resumeLine,/activeCharacterAssetUrl=resumeVisual\.characterAssetUrl\?\?null/);
});

test('bridge maps every friendly transition and preserves legacy compatibility',()=>{const state=day28FriendlyFixture();assert.equal(getDay28V4GameCompatibility(state).mode,'V4');const all=finish(state);for(const number of [1,2,3,4,5,6,7,8,11,12,13,14,16,22,23,24])assert.ok(all.some(step=>step.type==='transition'&&step.sceneNumber===number),`scene ${number}`);for(const step of all.filter(step=>step.type==='transition')){assert.ok(step.backgroundUrl);assert.ok(step.storyClock);}const legacy={storyFlags:{day27RuntimeComplete:true,day28RuntimeStage:1}};assert.equal(getDay28V4GameCompatibility(legacy).mode,'LEGACY');});

test('solo and new-person routes stay separate in the game adapter',()=>{const solo=day28SoloFixture(),soloSteps=finish(solo),soloScenes=new Set(soloSteps.filter(step=>step.type==='transition').map(step=>step.sceneNumber));assert.deepEqual([...soloScenes],[1,20,21,23,24]);assert.equal(soloSteps.some(isDay28V4ResolutionStep),false);const newer=day28NewMeetingFixture(),newSteps=finish(newer),newScenes=new Set(newSteps.filter(step=>step.type==='transition').map(step=>step.sceneNumber));assert.ok(newScenes.has(17));assert.equal(newScenes.has(2),false);assert.doesNotMatch(JSON.stringify(newSteps),/유리|서진/);});

test('resolution failure restores the replay-locked chapter atomically',()=>{const state=day28FriendlyFixture();choose(state);const before=structuredClone(state.storyFlags.day28V4);assert.throws(()=>applyDay28V4GameResolution(state,{type:'day28ContactResponse',contact:'KISS',outcome:'ACCEPTED'}),/INVALID_CONTACT|UNKNOWN_RESOLUTION/);assert.deepEqual(state.storyFlags.day28V4,before);});

test('mid-day save round-trip preserves exact segment and presentation',()=>{const state=day28FriendlyFixture();for(let index=0;index<7;index++){const steps=getDay28V4GameSegment(state),cue=steps.find(isDay28V4ResolutionStep);if(cue)applyDay28V4GameResolution(state,getDay28V4RuntimeResolution(state,cue));else choose(state);}const expected=getDay28V4GameSegment(state),store=storage(),shell=createInitialState(createGirlfriendFromProfile('haeun',()=>.5),()=>.5,{mode:GAME_MODES.MARRIAGE_30});Object.assign(shell,state);SaveManager.save(shell,store);const loaded=SaveManager.load(store,GAME_MODES.MARRIAGE_30);assert.deepEqual(loaded.storyFlags.day28V4,state.storyFlags.day28V4);assert.deepEqual(getDay28V4GameSegment(loaded),expected);assert.deepEqual(getDay28V4GameResumePresentation(loaded),getDay28V4GameResumePresentation(state));});

test('friendly evening checkpoints resume at the authored place, clock, and visible person',()=>{
  let state=day28FriendlyFixture();
  const pick=suffix=>{const options=getDay28V4Options(state.storyFlags.day28V4),option=suffix?options.find(item=>item.id.endsWith(`_${suffix}`)):options[0];assert.ok(option,`${state.storyFlags.day28V4.phase}:${suffix}`);applyDay28V4GameChoice(state,option.id);};
  const restore=expected=>{const store=storage(),shell=createInitialState(createGirlfriendFromProfile('haeun',()=>.5),()=>.5,{mode:GAME_MODES.MARRIAGE_30});Object.assign(shell,state);SaveManager.save(shell,store);state=SaveManager.load(store,GAME_MODES.MARRIAGE_30);assert.deepEqual(getDay28V4GameResumePresentation(state),expected);};
  pick('usual');applyDay28V4GameResolution(state,{type:'day28MeetingResponse',target:'HAEUN',outcome:'ACCEPTED',method:'IN_PERSON'});
  for(const suffix of ['thanks',null,'miss_too','say_cannot','sit','just_funny','continue_lovers'])pick(suffix);
  applyDay28V4GameResolution(state,{type:'day28RelationshipResponse',outcome:'CONTINUE',contactAllowed:true});
  pick('change_words');pick('hand');applyDay28V4GameResolution(state,{type:'day28ContactResponse',contact:'HAND',outcome:'ACCEPTED'});pick('stay');
  restore({backgroundId:'neighborhood-park-day',backgroundUrl:'assets/backgrounds/map-locations/035_running-park.png',characterId:'girlfriend',characterAssetUrl:'assets/characters/story-outfits/haeun-day12-oatmeal-cardigan-2d-v1.png',expressionId:'calm',poseId:'standing',timeOfDay:'evening',storyClock:'19:00',storyLocation:'memory-park'});
  pick('ask_hurt');
  restore({backgroundId:'neighborhood-park-day',backgroundUrl:'assets/backgrounds/map-locations/035_running-park.png',characterId:'girlfriend',characterAssetUrl:'assets/characters/story-outfits/haeun-day12-oatmeal-cardigan-2d-v1.png',expressionId:'calm',poseId:'standing',timeOfDay:'evening',storyClock:'19:00',storyLocation:'memory-park'});
  applyDay28V4GameResolution(state,{type:'day28HomeInvitationResponse',accepted:true,location:'PLAYER_HOME'});
  restore({backgroundId:'home-evening',backgroundUrl:'assets/backgrounds/home/BG_HOME_NIGHT_001.webp',characterId:'girlfriend',characterAssetUrl:'assets/characters/story-outfits/haeun-day12-oatmeal-cardigan-2d-v1.png',expressionId:'calm',poseId:'standing',timeOfDay:'evening',storyClock:'19:00',storyLocation:'home'});
  pick('brief_stay');
  restore({backgroundId:'home-evening',backgroundUrl:'assets/backgrounds/home/BG_HOME_NIGHT_001.webp',characterId:'girlfriend',characterAssetUrl:'assets/characters/story-outfits/haeun-day12-oatmeal-cardigan-2d-v1.png',expressionId:'calm',poseId:'standing',timeOfDay:'evening',storyClock:'19:00',storyLocation:'home'});
  pick('next_when_possible');
  restore({backgroundId:'home-evening',backgroundUrl:'assets/backgrounds/home/BG_HOME_NIGHT_001.webp',characterId:'girlfriend',characterAssetUrl:'assets/characters/story-outfits/haeun-day12-oatmeal-cardigan-2d-v1.png',expressionId:'calm',poseId:'standing',timeOfDay:'evening',storyClock:'19:00',storyLocation:'home'});
  applyDay28V4GameResolution(state,{type:'day28NextMeetingResponse',outcome:'ACCEPTED'});
  restore({backgroundId:'home-night',backgroundUrl:'assets/backgrounds/home/BG_HOME_NIGHT_001.webp',characterId:'girlfriend',characterAssetUrl:'assets/characters/story-outfits/haeun-day12-oatmeal-cardigan-2d-v1.png',expressionId:'calm',poseId:'standing',timeOfDay:'night',storyClock:'22:00',storyLocation:'home'});
});

test('solo cafe and home checkpoints do not change location on save resume',()=>{
  let state=day28SoloFixture();
  const roundTrip=()=>{const store=storage(),shell=createInitialState(createGirlfriendFromProfile('haeun',()=>.5),()=>.5,{mode:GAME_MODES.MARRIAGE_30});Object.assign(shell,state);SaveManager.save(shell,store);state=SaveManager.load(store,GAME_MODES.MARRIAGE_30);return getDay28V4GameResumePresentation(state);};
  choose(state);assert.deepEqual(roundTrip(),{backgroundId:'small-cafe',backgroundUrl:'assets/backgrounds/map-locations/004_small-cafe.png',characterId:null,characterAssetUrl:null,expressionId:'calm',poseId:'standing',timeOfDay:'afternoon',storyClock:'17:00',storyLocation:'cafe'});
  choose(state);assert.deepEqual(roundTrip(),{backgroundId:'small-cafe',backgroundUrl:'assets/backgrounds/map-locations/004_small-cafe.png',characterId:null,characterAssetUrl:null,expressionId:'calm',poseId:'standing',timeOfDay:'afternoon',storyClock:'17:00',storyLocation:'cafe'});
  choose(state);assert.deepEqual(roundTrip(),{backgroundId:'home-evening',backgroundUrl:'assets/backgrounds/home/BG_HOME_NIGHT_001.webp',characterId:null,characterAssetUrl:null,expressionId:'calm',poseId:'standing',timeOfDay:'evening',storyClock:'19:00',storyLocation:'home'});
});

test('completion records one DAY28 history and opens only DAY29 hook',()=>{const state=day28FriendlyFixture();state.storyHistory=[];const cue=finish(state).at(-1);completeDay28V4GameChapter(state,cue);completeDay28V4GameChapter(state,cue);assert.equal(state.storyHistory.length,1);assert.equal(state.storyHistory[0].scenarioId,'day28-notion-v4');assert.equal(state.storyFlags.day28V4.complete,true);assert.equal(state.storyFlags.day28V4Day29HookPending,true);assert.equal(state.storyFlags.day28RuntimeComplete,true);assert.equal(state.storyFlags.day28FreeActionComplete,undefined);});

test('main game wires DAY28 V4 entry, choices, resolutions, completion, and Story/Free exclusion',()=>{const source=readFileSync(new URL('../game.js',import.meta.url),'utf8'),html=readFileSync(new URL('../index.html',import.meta.url),'utf8');assert.match(source,/day28-v4-game-bridge\.mjs\?v=9/);assert.match(source,/day28-v4-runtime-resolution\.mjs\?v=3/);assert.match(source,/if\(day28V4\)prepareDay28V4GameEntry\(state\)/);assert.match(source,/applyDay28V4GameChoice\(state,choiceId\)/);assert.match(source,/getDay28V4RuntimeResolution\(state,step\)/);assert.match(source,/applyDay28V4GameResolution\(state,response\)/);assert.match(source,/step\.day===28\?completeDay28V4GameChapter/);assert.match(source,/isDay28V4ResolutionStep\(step\)/);assert.match(source,/lockedDay28&&!day28V4\?28/);assert.match(source,/completedSession\?\.id===LOCKED_DAY28_SCENE_ID&&!state\.storyFlags\?\.day28V4/);assert.match(source,/!\(lockedDay28&&day28V4\)/);assert.ok(Number(html.match(/game\.js\?v=(\d+)/)?.[1])>=286);});

test('browser QA harness offers four semantic DAY28 routes and preserves every user save slot',()=>{const html=readFileSync(new URL('./day28-v4-browser-entry.html',import.meta.url),'utf8'),game=readFileSync(new URL('../game.js',import.meta.url),'utf8');for(const route of ['friendly','neutral','distant','mixed'])assert.match(html,new RegExp(`data-route="${route}"`));for(const marker of ['day28FriendlyFixture','day28CallFixture','day28SoloFixture','day28NewMeetingFixture','day28-v4-qa-save-backup','SaveManager.keyForMode(GAME_MODES.MARRIAGE_30)','SaveManager.keyForMode(GAME_MODES.FREE_ROMANCE)','테스트 전 저장을 복원했습니다'])assert.ok(html.includes(marker),marker);assert.match(html,/pendingStoryId='m30-day28-current-ceremony-rehearsal'/);assert.match(game,/let autoMode = false;/);assert.doesNotMatch(html,/skipButton|\.click\([^)]*SKIP/i);});

test('neutral browser fixture reaches the authored CALL resolution without mutating the friendly fixture',()=>{const neutral=day28CallFixture(),friendly=day28FriendlyFixture();assert.equal(neutral.storyFlags.day28V4.input.currentEnergy,20);assert.notEqual(friendly.storyFlags.day28V4.input.currentEnergy,20);const option=getDay28V4Options(neutral.storyFlags.day28V4).find(item=>item.id.endsWith('_short'));assert.ok(option);applyDay28V4GameChoice(neutral,option.id);const cue=getDay28V4GameSegment(neutral).find(isDay28V4ResolutionStep),response=getDay28V4RuntimeResolution(neutral,cue);assert.equal(response.method,'CALL');assert.equal(response.outcome,'ACCEPTED');});
