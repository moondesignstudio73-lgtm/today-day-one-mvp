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
  constructor({ storage = globalThis.localStorage, contextFactory } = {}) {
    this.storage = storage;
    this.contextFactory = contextFactory ?? (() => {
      const AudioContextClass = globalThis.AudioContext ?? globalThis.webkitAudioContext;
      return AudioContextClass ? new AudioContextClass() : null;
    });
    this.context = null;
    this.enabled = this.storage?.getItem(SOUND_SETTING_KEY) === "on";
  }

  toggle(force) {
    this.enabled = typeof force === "boolean" ? force : !this.enabled;
    this.storage?.setItem(SOUND_SETTING_KEY,this.enabled ? "on" : "off");
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

  playScene(scene) {
    if (!this.enabled || !SCENE_SOUND_PRESETS[scene]) return false;
    const preset = SCENE_SOUND_PRESETS[scene];
    SOUND_PRESETS.scene = preset;
    const played = this.play("scene");
    delete SOUND_PRESETS.scene;
    return played;
  }
}
