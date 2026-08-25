export const DAY1_AUDIO_CUES = Object.freeze({
  AMB_HOSPITAL_ROOM_DAY:{ source:"assets/audio/day1/amb-hospital-room-day.wav", volume:0.09, loop:true, role:"ambience" },
  SFX_CART_DISTANT:{ source:"assets/audio/day1/cart-distant.wav", volume:0.18, loop:false, role:"environment" },
  SFX_PHONE_SOFT_DROP:{ source:"assets/audio/day1/phone-soft-drop.wav", volume:0.24, loop:false, role:"prop" },
  SFX_FOOTSTEP_APPROACH:{ source:"assets/audio/day1/footsteps-approach.wav", volume:0.2, loop:false, role:"environment" },
  SFX_DOOR_OPEN:{ source:"assets/audio/day1/door-open.wav", volume:0.2, loop:false, role:"environment" },
  SFX_DOOR_CLOSE:{ source:"assets/audio/day1/door-close.wav", volume:0.18, loop:false, role:"environment" },
  SFX_MEDICAL_LIGHT:{ source:"assets/audio/day1/medical-light.wav", volume:0.16, loop:false, role:"medical" },
  SFX_CUP_SET_DOWN:{ source:"assets/audio/day1/cup-set-down.wav", volume:0.17, loop:false, role:"prop" },
  SFX_PHONE_SCREEN_OFF:{ source:"assets/audio/day1/phone-screen-off.wav", volume:0.12, loop:false, role:"prop" }
});

export const DAY1_BGM_CUES = Object.freeze({
  S01_B01_BLACK:{ category:null, variant:0, volume:0, action:"silence" },
  S01_B02_FOCUS:{ category:"theme", variant:0, volume:0.1, action:"play" },
  S03_B03_ONE_YEAR:{ category:"theme", variant:0, volume:0.065, action:"adjust" },
  S04_B01_DOOR_CLOSE:{ category:"theme", variant:0, volume:0.055, action:"adjust" },
  S05_B03_PERMISSION:{ category:"theme", variant:0, volume:0.085, action:"adjust" },
  S06_B02_SHIFT:{ category:"theme", variant:0, volume:0.065, action:"adjust" },
  S06_B04_REVEAL:{ category:"theme", variant:0, volume:0.045, action:"adjust" },
  S06_B06_RESOLVE:{ category:"theme", variant:0, volume:0.085, action:"adjust" },
  S06_B07_END:{ category:null, variant:0, volume:0, action:"stop" }
});

export const DAY1_BEAT_AUDIO = Object.freeze({
  S01_B01_BLACK:["SFX_CART_DISTANT"],
  S01_B02_FOCUS:["AMB_HOSPITAL_ROOM_DAY"],
  S01_B03_EYE_CONTACT:["SFX_PHONE_SOFT_DROP"],
  S02_B05_FOOTSTEP:["SFX_FOOTSTEP_APPROACH"],
  S03_B01_ENTER:["SFX_DOOR_OPEN"],
  S03_B02_EXAM:["SFX_MEDICAL_LIGHT"],
  S04_B01_DOOR_CLOSE:["SFX_DOOR_CLOSE"],
  S05_B05_RELEASE:["SFX_CUP_SET_DOWN"],
  S06_B06_RESOLVE:["SFX_PHONE_SCREEN_OFF"],
  S06_B07_END:["STOP_AMB_HOSPITAL_ROOM_DAY"]
});

export function validateDay1AudioData({ cues=DAY1_AUDIO_CUES, bgm=DAY1_BGM_CUES, beats=DAY1_BEAT_AUDIO } = {}) {
  const cueIds = Object.keys(cues);
  const validCues = cueIds.length === 9 && cueIds.every(id => {
    const cue = cues[id];
    return cue && typeof cue.source === "string" && cue.source.endsWith(".wav") && cue.volume > 0 && cue.volume <= 0.3 && typeof cue.loop === "boolean" && typeof cue.role === "string";
  });
  const validBgm = Object.values(bgm).every(cue => cue && ["silence","play","adjust","stop"].includes(cue.action) && (cue.category === null || cue.category === "theme") && cue.volume >= 0 && cue.volume <= 0.12);
  const validBeats = Object.values(beats).flat().every(id => id.startsWith("STOP_") ? cueIds.includes(id.slice(5)) : cueIds.includes(id));
  return validCues && validBgm && validBeats;
}

export function getDay1AudioCue(cueId) {
  return DAY1_AUDIO_CUES[cueId] ?? null;
}
