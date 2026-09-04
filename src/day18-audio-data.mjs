export const DAY18_AUDIO_CUES=Object.freeze({
  SFX_DAY18_PHONE_ALARM:{source:'assets/audio/day18/phone-alarm-loop.wav',volume:0.11,loop:true,role:'alarm'}
});

export function getDay18AudioCue(cueId){return DAY18_AUDIO_CUES[cueId]??null;}

export function validateDay18AudioData(cues=DAY18_AUDIO_CUES){
  const entries=Object.entries(cues);
  return entries.length===1&&entries.every(([id,cue])=>id==='SFX_DAY18_PHONE_ALARM'&&cue?.source.endsWith('.wav')&&cue.volume>0&&cue.volume<=0.12&&cue.loop===true&&cue.role==='alarm');
}

