export const DAY2_AUDIO_CUES = Object.freeze({
  AMB_HOSPITAL_CORRIDOR_DAY:{source:"assets/audio/day2/amb-hospital-corridor-day.wav",volume:0.075,loop:true,role:"ambience"},
  AMB_HOSPITAL_LOBBY_DAY:{source:"assets/audio/day2/amb-hospital-lobby-day.wav",volume:0.08,loop:true,role:"ambience"},
  AMB_CAR_INTERIOR_DAY:{source:"assets/audio/day2/amb-car-interior-day.wav",volume:0.075,loop:true,role:"ambience"},
  AMB_HOME_QUIET_AFTERNOON:{source:"assets/audio/day2/amb-home-quiet-afternoon.wav",volume:0.065,loop:true,role:"ambience"},
  SFX_RAIL_GRIP_RELEASE:{source:"assets/audio/day2/rail-grip-release.wav",volume:0.14,loop:false,role:"recovery"},
  SFX_DOCUMENT_RECEIVE:{source:"assets/audio/day2/document-receive.wav",volume:0.13,loop:false,role:"prop"},
  SFX_BAG_ZIPPER:{source:"assets/audio/day2/bag-zipper.wav",volume:0.15,loop:false,role:"prop"},
  SFX_AUTO_DOOR:{source:"assets/audio/day2/auto-door.wav",volume:0.16,loop:false,role:"environment"},
  SFX_SEATBELT_CLICK:{source:"assets/audio/day2/seatbelt-click.wav",volume:0.16,loop:false,role:"safety"},
  SFX_TURN_SIGNAL:{source:"assets/audio/day2/turn-signal.wav",volume:0.11,loop:false,role:"vehicle"},
  SFX_HOME_KEY_UNLOCK:{source:"assets/audio/day2/home-key-unlock.wav",volume:0.17,loop:false,role:"prop"},
  SFX_LIGHT_SWITCH:{source:"assets/audio/day2/light-switch.wav",volume:0.12,loop:false,role:"prop"},
  SFX_PHOTO_FRAME:{source:"assets/audio/day2/photo-frame.wav",volume:0.12,loop:false,role:"prop"},
  SFX_DRAWER_OPEN:{source:"assets/audio/day2/drawer-open.wav",volume:0.13,loop:false,role:"prop"},
  SFX_PENCIL_NOTE:{source:"assets/audio/day2/pencil-note.wav",volume:0.1,loop:false,role:"prop"},
  SFX_SPARE_PHONE_KEY:{source:"assets/audio/day2/spare-phone-key.wav",volume:0.1,loop:false,role:"prop"},
  SFX_FRONT_DOOR_CLOSE:{source:"assets/audio/day2/front-door-close.wav",volume:0.16,loop:false,role:"environment"}
});

export const DAY2_BGM_CUES = Object.freeze({
  S01_CHOICE:{category:"daily",variant:0,volume:0.075,action:"play"},
  S02_STAND:{category:"daily",variant:0,volume:0.065,action:"adjust"},
  S05_EXIT:{category:"daily",variant:0,volume:0.085,action:"adjust"},
  S06_ROAD_FEAR:{category:"daily",variant:0,volume:0.06,action:"adjust"},
  S07_THRESHOLD:{category:"daily",variant:0,volume:0.07,action:"adjust"},
  S08_FAMILY_PHOTO:{category:"daily",variant:0,volume:0.05,action:"adjust"},
  S08_PHOTO_RELEASE:{category:"daily",variant:0,volume:0.075,action:"adjust"},
  S09_SMALL_KEY:{category:"daily",variant:0,volume:0.06,action:"adjust"},
  S10_THREE_COLUMNS:{category:"daily",variant:0,volume:0.07,action:"adjust"},
  S12_RESOLVE:{category:"daily",variant:0,volume:0.055,action:"adjust"},
  S12_END:{category:null,variant:0,volume:0,action:"stop"}
});

export const DAY2_BEAT_AUDIO = Object.freeze({
  S02_CORRIDOR:["AMB_HOSPITAL_CORRIDOR_DAY"],
  S02_RAIL:["SFX_RAIL_GRIP_RELEASE"],
  S03_DOCUMENT:["SFX_DOCUMENT_RECEIVE"],
  S04_PACK:["SFX_BAG_ZIPPER"],
  S05_LOBBY:["STOP_AMB_HOSPITAL_CORRIDOR_DAY","AMB_HOSPITAL_LOBBY_DAY"],
  S05_AUTO_DOOR:["SFX_AUTO_DOOR"],
  S06_ENTER:["STOP_AMB_HOSPITAL_LOBBY_DAY","AMB_CAR_INTERIOR_DAY","SFX_SEATBELT_CLICK"],
  S06_SIGNAL:["SFX_TURN_SIGNAL"],
  S07_ARRIVE:["STOP_AMB_CAR_INTERIOR_DAY"],
  S07_UNLOCK:["SFX_HOME_KEY_UNLOCK"],
  S07_LIGHT:["AMB_HOME_QUIET_AFTERNOON","SFX_LIGHT_SWITCH"],
  S08_FAMILY_PHOTO:["SFX_PHOTO_FRAME"],
  S08_COUPLE_PHOTO:["SFX_PHOTO_FRAME"],
  S09_DRAWER:["SFX_DRAWER_OPEN"],
  S10_NOTE:["SFX_PENCIL_NOTE"],
  S11_CONTACT:["SFX_SPARE_PHONE_KEY"],
  S12_DOOR:["SFX_FRONT_DOOR_CLOSE"],
  S12_END:["STOP_AMB_HOME_QUIET_AFTERNOON"]
});

export function validateDay2AudioData({cues=DAY2_AUDIO_CUES,bgm=DAY2_BGM_CUES,beats=DAY2_BEAT_AUDIO}={}) {
  const ids=Object.keys(cues);
  const cueOk=ids.length===17&&ids.every(id=>{const cue=cues[id];return typeof cue?.source==="string"&&cue.source.endsWith(".wav")&&cue.volume>0&&cue.volume<=0.2&&typeof cue.loop==="boolean"&&typeof cue.role==="string";});
  const bgmOk=Object.values(bgm).every(cue=>cue&&["play","adjust","stop"].includes(cue.action)&&(cue.category===null||cue.category==="daily")&&cue.volume>=0&&cue.volume<=0.1);
  const beatOk=Object.values(beats).flat().every(id=>id.startsWith("STOP_")?ids.includes(id.slice(5)):ids.includes(id));
  return cueOk&&bgmOk&&beatOk;
}

export function getDay2AudioCue(cueId){return DAY2_AUDIO_CUES[cueId]??null;}
