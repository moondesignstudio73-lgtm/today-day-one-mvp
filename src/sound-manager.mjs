import { getDay1AudioCue } from "./day1-audio-data.mjs";
import { getDay2AudioCue } from "./day2-audio-data.mjs";
import { getDay18AudioCue } from "./day18-audio-data.mjs";

export const SOUND_SETTING_KEY = "today-day-one.sound.v1";

export const SOUND_PRESETS = {
  select:{ frequency:520, endFrequency:620, duration:0.07, volume:0.035, wave:"sine" },
  confirm:{ frequency:440, endFrequency:720, duration:0.11, volume:0.045, wave:"sine" },
  alert:{ frequency:220, endFrequency:150, duration:0.18, volume:0.05, wave:"triangle" },
  success:{ frequency:660, endFrequency:990, duration:0.24, volume:0.055, wave:"sine" },
  choiceOpen:{frequency:480,endFrequency:560,duration:0.09,volume:0.025,wave:"sine"},
  save:{frequency:540,endFrequency:810,duration:0.16,volume:0.04,wave:"sine"},
  dayEnd:{frequency:392,endFrequency:784,duration:0.34,volume:0.045,wave:"sine"}
};

export const SCENE_SOUND_PRESETS = {
  morning:{ frequency:392, endFrequency:523, duration:0.7, volume:0.018, wave:"sine" },
  day:{ frequency:440, endFrequency:587, duration:0.65, volume:0.016, wave:"sine" },
  evening:{ frequency:330, endFrequency:440, duration:0.85, volume:0.018, wave:"triangle" },
  night:{ frequency:262, endFrequency:349, duration:1.0, volume:0.015, wave:"sine" }
};

export const BGM_TRACKS = {
  title:["assets/audio/bgm/title-1.mp3","assets/audio/bgm/title-2.mp3"],
  daily:["assets/audio/bgm/daily-1.mp3","assets/audio/bgm/daily-2.mp3"],
  theme:["assets/audio/bgm/theme-1.mp3","assets/audio/bgm/theme-2.mp3"],
  dateShopping:["assets/audio/bgm/date-shopping-1.mp3","assets/audio/bgm/date-shopping-2.mp3"],
  crisis:["assets/audio/bgm/relationship-crisis-1.mp3","assets/audio/bgm/relationship-crisis-2.mp3"],
  ending:["assets/audio/bgm/ending-1.mp3","assets/audio/bgm/ending-2.mp3"],
  schoolYouth:["assets/audio/bgm/daily-2.mp3","assets/audio/bgm/theme-1.mp3"]
};

export const SCENE_BGM_CATEGORIES = {
  morning:"daily",
  day:"daily",
  evening:"theme",
  night:"theme"
};

export function validateBgmTracks(tracks = BGM_TRACKS) {
  return ["title","daily","theme","dateShopping","crisis","ending"].every(category =>
    Array.isArray(tracks[category]) && tracks[category].length === 2 && tracks[category].every(source => typeof source === "string" && source.endsWith(".mp3"))
  );
}

export function getBgmTrack(category, variant = 0, tracks = BGM_TRACKS) {
  const playlist = tracks[category];
  if (!playlist?.length) return "";
  const index = Math.abs(Math.trunc(Number(variant) || 0)) % playlist.length;
  return playlist[index];
}

export function validateSoundPresets(presets = SOUND_PRESETS) {
  return ["select","confirm","alert","success"].every(id => {
    const preset = presets[id];
    return preset && Number.isFinite(preset.frequency) && Number.isFinite(preset.endFrequency) && Number.isFinite(preset.duration) && preset.duration > 0 && Number.isFinite(preset.volume) && preset.volume > 0 && typeof preset.wave === "string";
  });
}

export function validateSceneSoundPresets(presets = SCENE_SOUND_PRESETS) {
  return ["morning","day","evening","night"].every(id => {
    const preset = presets[id];
    return preset && Number.isFinite(preset.frequency) && Number.isFinite(preset.endFrequency) && preset.duration > 0 && preset.volume > 0;
  });
}

export class SoundManager {
  constructor({ storage = globalThis.localStorage, contextFactory, audioFactory, defaultEnabled = true, now = () => Date.now(), requestFrame = globalThis.requestAnimationFrame?.bind(globalThis), cancelFrame = globalThis.cancelAnimationFrame?.bind(globalThis) } = {}) {
    this.storage = storage;
    this.contextFactory = contextFactory ?? (() => {
      const AudioContextClass = globalThis.AudioContext ?? globalThis.webkitAudioContext;
      return AudioContextClass ? new AudioContextClass() : null;
    });
    this.audioFactory = audioFactory ?? (source => typeof globalThis.Audio === "function" ? new globalThis.Audio(source) : null);
    this.context = null;
    this.bgm = null;
    this.bgmSource = "";
    this.bgmTargetVolume = 0;
    this.bgmDuckRatio = 1;
    this.fadeTokens = new WeakMap();
    this.fadeFrames = new WeakMap();
    this.cueChannels = new Map();
    this.transientCues = new Set();
    this.activeAmbientId = null;
    this.lastCueAt = new Map();
    this.now = now;
    this.requestFrame = requestFrame;
    this.cancelFrame = cancelFrame;
    const savedSetting = this.storage?.getItem(SOUND_SETTING_KEY);
    this.enabled = savedSetting === null || savedSetting === undefined
      ? Boolean(defaultEnabled)
      : savedSetting === "on";
  }

  toggle(force) {
    this.enabled = typeof force === "boolean" ? force : !this.enabled;
    this.storage?.setItem(SOUND_SETTING_KEY,this.enabled ? "on" : "off");
    if (!this.enabled) this.resetStoryAudio();
    return this.enabled;
  }

  play(type) {
    if (!this.enabled || !SOUND_PRESETS[type]) return false;
    try {
      this.context ??= this.contextFactory();
      if (!this.context) return false;
      if (this.context.state === "suspended") this.context.resume?.();
      const preset = SOUND_PRESETS[type];
      const now = this.context.currentTime;
      const oscillator = this.context.createOscillator();
      const gain = this.context.createGain();
      oscillator.type = preset.wave;
      oscillator.frequency.setValueAtTime(preset.frequency,now);
      oscillator.frequency.exponentialRampToValueAtTime(preset.endFrequency,now+preset.duration);
      gain.gain.setValueAtTime(preset.volume,now);
      gain.gain.exponentialRampToValueAtTime(0.0001,now+preset.duration);
      oscillator.connect(gain);
      gain.connect(this.context.destination);
      oscillator.start(now);
      oscillator.stop(now+preset.duration);
      return true;
    } catch {
      return false;
    }
  }

  fadeAudio(audio,target,duration=0,onDone){
    if(!audio)return false;
    const to=Math.max(0,Math.min(1,Number(target)||0));
    const ms=Math.max(0,Number(duration)||0);
    if(!this.requestFrame||ms===0){audio.volume=to;onDone?.();return true;}
    const token=(this.fadeTokens.get(audio)??0)+1,start=this.now(),from=Number(audio.volume)||0;
    this.fadeTokens.set(audio,token);
    const prior=this.fadeFrames.get(audio);if(prior)this.cancelFrame?.(prior);
    const tick=()=>{if(token!==this.fadeTokens.get(audio))return;const progress=Math.min(1,(this.now()-start)/ms);audio.volume=from+(to-from)*progress;if(progress<1)this.fadeFrames.set(audio,this.requestFrame(tick));else{this.fadeFrames.delete(audio);onDone?.();}};
    this.fadeFrames.set(audio,this.requestFrame(tick));return true;
  }

  playBgm(category, variant = 0, { loop = true, volume = 0.22, fadeIn = 0, crossFade = 0 } = {}) {
    if (!this.enabled) return false;
    const source = getBgmTrack(category,variant);
    if (!source) return false;
    try {
      if (this.bgm && this.bgmSource === source) {
        this.bgmTargetVolume = Math.max(0,Math.min(1,Number(volume) || 0));
        this.fadeAudio(this.bgm,this.bgmTargetVolume*this.bgmDuckRatio,crossFade);
        if (this.bgm.paused) this.bgm.play()?.catch?.(()=>{});
        return true;
      }
      const previous=this.bgm;
      const audio = this.audioFactory(source);
      if (!audio) return false;
      audio.loop = loop;
      this.bgmTargetVolume = Math.max(0,Math.min(1,Number(volume) || 0));
      const transition=Math.max(Number(crossFade)||0,Number(fadeIn)||0);
      audio.volume = transition>0?0:this.bgmTargetVolume*this.bgmDuckRatio;
      audio.preload = "auto";
      this.bgm = audio;
      this.bgmSource = source;
      audio.play()?.catch?.(()=>{});
      if(previous&&previous!==audio)this.fadeAudio(previous,0,crossFade,()=>{try{previous.pause?.();}catch{}});
      this.fadeAudio(audio,this.bgmTargetVolume*this.bgmDuckRatio,transition);
      return true;
    } catch {
      this.bgm = null;
      this.bgmSource = "";
      return false;
    }
  }

  stopBgm(options={}) {
    const fadeOut=typeof options==="number"?options:Number(options?.fadeOut)||0;
    const audio=this.bgm;
    if(audio&&fadeOut>0)this.fadeAudio(audio,0,fadeOut,()=>{try{audio.pause?.();}catch{}});
    else try { audio?.pause?.(); } catch {}
    this.bgm = null;
    this.bgmSource = "";
    this.bgmTargetVolume=0;
    this.bgmDuckRatio=1;
  }

  playCue(cueId,{cooldownMs=120}={}) {
    if (!this.enabled) return false;
    const preset = getDay1AudioCue(cueId) ?? getDay2AudioCue(cueId) ?? getDay18AudioCue(cueId);
    if (!preset) return false;
    try {
      const now=this.now(),last=this.lastCueAt.get(cueId)??-Infinity;
      if(!preset.loop&&now-last<cooldownMs)return false;
      this.lastCueAt.set(cueId,now);
      const existing = this.cueChannels.get(cueId);
      if (existing && preset.loop) {
        if (existing.paused) existing.play()?.catch?.(()=>{});
        return true;
      }
      const audio = this.audioFactory(preset.source);
      if (!audio) return false;
      audio.loop = preset.loop;
      audio.volume = preset.volume;
      audio.preload = "auto";
      if (preset.loop) this.cueChannels.set(cueId,audio);
      else {this.transientCues.add(audio);audio.onended=()=>this.transientCues.delete(audio);}
      audio.play()?.catch?.(()=>{});
      return true;
    } catch {
      return false;
    }
  }

  stopCue(cueId) {
    const audio = this.cueChannels.get(cueId);
    if (!audio) return false;
    try { audio.pause?.(); } catch {}
    this.cueChannels.delete(cueId);
    if(this.activeAmbientId===cueId)this.activeAmbientId=null;
    return true;
  }

  stopAllCues() {
    for (const audio of this.cueChannels.values()) {
      try { audio.pause?.(); } catch {}
    }
    this.cueChannels.clear();
    this.stopTransientCues();
    this.activeAmbientId=null;
  }

  stopTransientCues(){for(const audio of this.transientCues){try{audio.pause?.();}catch{}}this.transientCues.clear();}

  setAmbient(cueId){
    if(cueId===this.activeAmbientId)return true;
    if(this.activeAmbientId)this.stopCue(this.activeAmbientId);
    this.activeAmbientId=null;
    if(!cueId)return true;
    const played=this.playCue(cueId,{cooldownMs:0});
    if(played)this.activeAmbientId=cueId;
    return played;
  }

  duckBgm(ratio=0.68,{duration=220}={}){this.bgmDuckRatio=Math.max(0.2,Math.min(1,Number(ratio)||0.68));if(this.bgm)this.fadeAudio(this.bgm,this.bgmTargetVolume*this.bgmDuckRatio,duration);}
  restoreBgm({duration=260}={}){this.bgmDuckRatio=1;if(this.bgm)this.fadeAudio(this.bgm,this.bgmTargetVolume,duration);}

  applyStoryAudio(cue={}){
    if(!this.enabled)return false;
    this.setAmbient(cue.ambientId??null);
    if(cue.silence){this.stopBgm({fadeOut:cue.fadeOutMs??900});return true;}
    return this.playBgm(cue.category,cue.variant,{volume:cue.volume,fadeIn:cue.fadeInMs,crossFade:cue.crossFadeMs});
  }

  resetStoryAudio(){
    this.stopBgm();this.stopAllCues();this.lastCueAt.clear();this.bgmDuckRatio=1;
  }

  playScene(scene, variant = 0) {
    if (!this.enabled || !SCENE_SOUND_PRESETS[scene]) return false;
    const preset = SCENE_SOUND_PRESETS[scene];
    SOUND_PRESETS.scene = preset;
    const cuePlayed = this.play("scene");
    delete SOUND_PRESETS.scene;
    const bgmPlayed = this.playBgm(SCENE_BGM_CATEGORIES[scene],variant);
    return cuePlayed || bgmPlayed;
  }
}
