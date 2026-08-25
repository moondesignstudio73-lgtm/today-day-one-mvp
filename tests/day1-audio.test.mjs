import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DAY1_AUDIO_CUES, DAY1_BEAT_AUDIO, DAY1_BGM_CUES, validateDay1AudioData } from "../src/day1-audio-data.mjs";
import { SoundManager } from "../src/sound-manager.mjs";

assert.equal(validateDay1AudioData(),true);
assert.equal(Object.keys(DAY1_AUDIO_CUES).length,9);
assert.ok(Object.values(DAY1_BGM_CUES).every(cue=>cue.category===null||cue.category==="theme"));
assert.ok(!JSON.stringify(DAY1_BGM_CUES).includes("crisis"));
assert.deepEqual(DAY1_BEAT_AUDIO.S01_B02_FOCUS,["AMB_HOSPITAL_ROOM_DAY"]);
assert.deepEqual(DAY1_BEAT_AUDIO.S06_B07_END,["STOP_AMB_HOSPITAL_ROOM_DAY"]);

for (const cue of Object.values(DAY1_AUDIO_CUES)) {
  const file=readFileSync(new URL(`../${cue.source}`,import.meta.url));
  assert.equal(file.subarray(0,4).toString(),"RIFF",cue.source);
  assert.equal(file.subarray(8,12).toString(),"WAVE",cue.source);
  assert.ok(file.length>7000,cue.source);
}

const values=new Map([["today-day-one.sound.v1","on"]]);
const storage={getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value)};
const audios=[];
const manager=new SoundManager({storage,audioFactory:source=>{const audio={source,paused:true,loop:false,volume:0,playCalls:0,pauseCalls:0,play(){this.paused=false;this.playCalls+=1;return Promise.resolve();},pause(){this.paused=true;this.pauseCalls+=1;}};audios.push(audio);return audio;}});
assert.equal(manager.playCue("AMB_HOSPITAL_ROOM_DAY"),true);
assert.equal(audios[0].loop,true);
assert.equal(audios[0].volume,0.09);
assert.equal(manager.playCue("AMB_HOSPITAL_ROOM_DAY"),true);
assert.equal(audios.length,1);
assert.equal(manager.playCue("SFX_CUP_SET_DOWN"),true);
assert.equal(audios[1].loop,false);
assert.equal(manager.stopCue("AMB_HOSPITAL_ROOM_DAY"),true);
assert.equal(audios[0].pauseCalls,1);
assert.equal(manager.playBgm("theme",0,{volume:0.1}),true);
assert.equal(audios[2].volume,0.1);
assert.equal(manager.playBgm("theme",0,{volume:0.045}),true);
assert.equal(audios.length,3);
assert.equal(audios[2].volume,0.045);
manager.toggle(false);
assert.equal(audios[2].pauseCalls,1);

console.log("✓ DAY 1 BGM·SFX 매핑, WAV 에셋, 볼륨·루프·정지 계약 검증 통과");
