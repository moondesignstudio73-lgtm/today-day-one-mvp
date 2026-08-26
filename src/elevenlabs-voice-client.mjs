let activeUtterance=null;

export function stopVoicePlayback(){
  if(typeof speechSynthesis!=="undefined")speechSynthesis.cancel();
  activeUtterance=null;
}

export async function speakWithElevenLabs(text,{lang="ko-KR",rate=1,pitch=1,volume=0.9}={}){
  const content=String(text??"").trim();
  if(!content||typeof speechSynthesis==="undefined"||typeof SpeechSynthesisUtterance==="undefined")return {ok:false,reason:"voice-unavailable"};
  stopVoicePlayback();
  const utterance=new SpeechSynthesisUtterance(content);
  utterance.lang=lang;utterance.rate=rate;utterance.pitch=pitch;utterance.volume=volume;
  const koreanVoice=speechSynthesis.getVoices().find(voice=>voice.lang?.toLowerCase().startsWith("ko"));
  if(koreanVoice)utterance.voice=koreanVoice;
  activeUtterance=utterance;
  utterance.addEventListener("end",()=>{if(activeUtterance===utterance)activeUtterance=null;},{once:true});
  utterance.addEventListener("error",()=>{if(activeUtterance===utterance)activeUtterance=null;},{once:true});
  speechSynthesis.speak(utterance);
  return {ok:true,provider:"browser-speech"};
}
