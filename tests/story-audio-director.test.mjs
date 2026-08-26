import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {DAY_STORY_AUDIO,STORY_AUDIO_PROFILES,getDaySoundCueSheet,getStoryAmbientId,resolveStoryAudioCue,validateStoryAudioDirector} from "../src/story-audio-director.mjs";
import {SoundManager} from "../src/sound-manager.mjs";

assert.equal(validateStoryAudioDirector(),true);
assert.equal(Object.keys(DAY_STORY_AUDIO).length,30);
assert.equal(getDaySoundCueSheet().length,30);
assert.ok(new Set(Object.values(DAY_STORY_AUDIO).map(cue=>cue.profile)).size>=9);
assert.equal(resolveStoryAudioCue({day:7,label:"첫 현재형 데이트"}).profileId,"romance_soft");
assert.equal(resolveStoryAudioCue({day:4,label:"사고 사진과 과거의 흔적"}).profileId,"memory_medium");
assert.equal(resolveStoryAudioCue({day:1,label:"사고 기억의 단편"}).profileId,"memory_major");
assert.equal(resolveStoryAudioCue({day:23,label:"과거 가족 사진"}).profileId,"memory_minor");
assert.equal(resolveStoryAudioCue({day:1,label:"부모님의 장례"}).profileId,"sad");
assert.equal(resolveStoryAudioCue({day:30,label:"DAY 30 END"}).profileId,"ending_day");
assert.equal(getStoryAmbientId("home-morning"),"AMB_HOME_QUIET_AFTERNOON");
assert.equal(getStoryAmbientId("neighborhood-cafe-day"),null);
assert.deepEqual(resolveStoryAudioCue({day:13,label:"현재 예산표 확인"}).sfxIds,["SFX_PENCIL_NOTE"]);
assert.deepEqual(resolveStoryAudioCue({day:10,label:"현재 예산표 확인"}).sfxIds,[],"DAY 1~12 명시 SFX와 자동 SFX를 중복하지 않음");
for(const cue of getDaySoundCueSheet()){assert.ok(cue.volume<=0.08);assert.ok(cue.fadeInMs>=800);assert.ok(cue.crossFadeMs>=1000);}

let clock=1000;
const audios=[];
const manager=new SoundManager({storage:{getItem:()=>"on",setItem(){}},now:()=>clock,audioFactory:source=>{const audio={source,paused:true,volume:0,loop:false,playCalls:0,pauseCalls:0,play(){this.paused=false;this.playCalls++;return Promise.resolve();},pause(){this.paused=true;this.pauseCalls++;}};audios.push(audio);return audio;}});
assert.equal(manager.applyStoryAudio(resolveStoryAudioCue({day:11,backgroundId:"home-morning"})),true);
assert.equal(manager.activeAmbientId,"AMB_HOME_QUIET_AFTERNOON");
assert.equal(manager.bgmTargetVolume,STORY_AUDIO_PROFILES.normal_daily.volume);
manager.duckBgm(0.6,{duration:0});assert.equal(manager.bgm.volume,manager.bgmTargetVolume*0.6);
manager.restoreBgm({duration:0});assert.equal(manager.bgm.volume,manager.bgmTargetVolume);
assert.equal(manager.playCue("SFX_CUP_SET_DOWN"),true);
assert.equal(manager.playCue("SFX_CUP_SET_DOWN"),false,"빠른 클릭의 동일 SFX는 쿨다운으로 차단");
clock+=121;assert.equal(manager.playCue("SFX_CUP_SET_DOWN"),true);
manager.applyStoryAudio(resolveStoryAudioCue({day:11,backgroundId:"neighborhood-cafe-day"}));
assert.equal(manager.activeAmbientId,null,"장소 변경 시 이전 집 앰비언트 정지");
manager.resetStoryAudio();assert.equal(manager.bgm,null);assert.equal(manager.cueChannels.size,0);

const game=readFileSync(new URL("../game.js",import.meta.url),"utf8");
for(const marker of ["sound.applyStoryAudio(resolveStoryAudioCue","sound.duckBgm(choiceCue.choiceDuck","sound.stopTransientCues()","sound.resetStoryAudio()","sound.play(\"save\")"])assert.ok(game.includes(marker),marker);
const sheet=readFileSync(new URL("../docs/audio/STORY_MODE_SOUND_CUE_SHEET.md",import.meta.url),"utf8");
for(let day=1;day<=30;day++)assert.ok(sheet.includes(`| ${day} |`),`DAY ${day} cue sheet`);
for(const marker of ["memory_minor","memory_medium","memory_major","저작권이 불분명한 외부 파일 추가 없음","120ms 쿨다운"])assert.ok(sheet.includes(marker),marker);
console.log("✓ DAY 1~30 오디오 디렉터·페이드·선택지 덕킹·앰비언트 정리·SFX 폭주 방지 PASS");
