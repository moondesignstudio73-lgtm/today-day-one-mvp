import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {DAY2_AUDIO_CUES,DAY2_BEAT_AUDIO,DAY2_BGM_CUES,validateDay2AudioData} from "../src/day2-audio-data.mjs";
import {SoundManager} from "../src/sound-manager.mjs";

assert.equal(validateDay2AudioData(),true);
assert.equal(Object.keys(DAY2_AUDIO_CUES).length,17);
assert.ok(Object.values(DAY2_BGM_CUES).every(c=>c.category===null||c.category==="daily"));
assert.ok(!JSON.stringify(DAY2_BGM_CUES).match(/crisis|ending/i));
assert.deepEqual(DAY2_BEAT_AUDIO.S06_ENTER,["STOP_AMB_HOSPITAL_LOBBY_DAY","AMB_CAR_INTERIOR_DAY","SFX_SEATBELT_CLICK"]);
assert.deepEqual(DAY2_BEAT_AUDIO.S12_END,["STOP_AMB_HOME_QUIET_AFTERNOON"]);

for(const cue of Object.values(DAY2_AUDIO_CUES)){
  const file=readFileSync(new URL(`../${cue.source}`,import.meta.url));
  assert.equal(file.subarray(0,4).toString(),"RIFF",cue.source);
  assert.equal(file.subarray(8,12).toString(),"WAVE",cue.source);
  assert.ok(file.length>6000,cue.source);
}

const values=new Map([["today-day-one.sound.v1","on"]]);
const storage={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v)};
const audios=[];
const manager=new SoundManager({storage,audioFactory:source=>{const a={source,paused:true,loop:false,volume:0,playCalls:0,pauseCalls:0,play(){this.paused=false;this.playCalls++;return Promise.resolve();},pause(){this.paused=true;this.pauseCalls++;}};audios.push(a);return a;}});
assert.equal(manager.playCue("AMB_CAR_INTERIOR_DAY"),true);
assert.equal(manager.playCue("AMB_CAR_INTERIOR_DAY"),true);
assert.equal(audios.length,1);
assert.equal(audios[0].loop,true);
assert.equal(manager.stopCue("AMB_CAR_INTERIOR_DAY"),true);
assert.equal(manager.playCue("SFX_HOME_KEY_UNLOCK"),true);
assert.equal(audios[1].volume,0.17);
manager.toggle(false);
assert.equal(manager.enabled,false);
console.log("✓ DAY 2 BGM·SFX 매핑, WAV 에셋, 볼륨·루프·정지 계약 검증 통과");
