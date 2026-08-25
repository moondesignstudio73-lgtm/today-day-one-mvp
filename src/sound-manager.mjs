import { getDay1AudioCue } from "./day1-audio-data.mjs";
import { getDay2AudioCue } from "./day2-audio-data.mjs";

export const SOUND_SETTING_KEY = "today-day-one.sound.v1";

export const SOUND_PRESETS = {
  select:{ frequency:520, endFrequency:620, duration:0.07, volume:0.035, wave:"sine" },
  confirm:{ frequency:440, endFrequency:720, duration:0.11, volume:0.045, wave:"sine" },
  alert:{ frequency:220, endFrequency:150, duration:0.18, volume:0.05, wave:"triangle" },
  success:{ frequency:660, endFrequency:990, duration:0.24, volume:0.055, wave:"sine" }
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
  constructor({ storage = globalThis.localStorage, contextFactory, audioFactory, defaultEnabled = true } = {}) {
    this.storage = storage;
    this.contextFactory = contextFactory ?? (() => {
      const AudioContextClass = globalThis.AudioContext ?? globalThis.webkitAudioContext;
      return AudioContextClass ? new AudioContextClass() : null;
    });
    this.audioFactory = audioFactory ?? (source => typeof globalThis.Audio === "function" ? new globalThis.Audio(source) : null);
    this.context = null;
    this.bgm = null;
    this.bgmSource = "";
    this.cueChannels = new Map();
    const savedSetting = this.storage?.getItem(SOUND_SETTING_KEY);
    this.enabled = savedSetting === null || savedSetting === undefined
      ? Boolean(defaultEnabled)
      : savedSetting === "on";
  }

  toggle(force) {
    this.enabled = typeof force === "boolean" ? force : !this.enabled;
    this.storage?.setItem(SOUND_SETTING_KEY,this.enabled ? "on" : "off");
    if (!this.enabled) { this.stopBgm(); this.stopAllCues(); }
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

  playBgm(category, variant = 0, { loop = true, volume = 0.22 } = {}) {
    if (!this.enabled) return false;
    const source = getBgmTrack(category,variant);
    if (!source) return false;
    try {
      if (this.bgm && this.bgmSource === source) {
        this.bgm.volume = Math.max(0,Math.min(1,Number(volume) || 0));
        if (this.bgm.paused) this.bgm.play()?.catch?.(()=>{});
        return true;
      }
      this.stopBgm();
      const audio = this.audioFactory(source);
      if (!audio) return false;
      audio.loop = loop;
      audio.volume = Math.max(0,Math.min(1,Number(volume) || 0));
      audio.preload = "auto";
      this.bgm = audio;
      this.bgmSource = source;
      audio.play()?.catch?.(()=>{});
      return true;
    } catch {
      this.bgm = null;
      this.bgmSource = "";
      return false;
    }
  }

  stopBgm() {
    try { this.bgm?.pause?.(); } catch {}
    this.bgm = null;
    this.bgmSource = "";
  }

  playCue(cueId) {
    if (!this.enabled) return false;
    const preset = getDay1AudioCue(cueId) ?? getDay2AudioCue(cueId);
    if (!preset) return false;
    try {
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
    return true;
  }

  stopAllCues() {
    for (const audio of this.cueChannels.values()) {
      try { audio.pause?.(); } catch {}
    }
    this.cueChannels.clear();
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
