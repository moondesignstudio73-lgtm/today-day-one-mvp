import {mkdirSync,writeFileSync} from 'node:fs';
import {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const sampleRate=44100,duration=1.2,samples=Math.round(sampleRate*duration),dataBytes=samples*2;
const output=fileURLToPath(new URL('../assets/audio/day18/phone-alarm-loop.wav',import.meta.url));
const wav=Buffer.alloc(44+dataBytes);
wav.write('RIFF',0);wav.writeUInt32LE(36+dataBytes,4);wav.write('WAVE',8);wav.write('fmt ',12);
wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);wav.writeUInt32LE(sampleRate,24);
wav.writeUInt32LE(sampleRate*2,28);wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(dataBytes,40);
const tone=(time,start,length,frequency)=>{
  const local=time-start;if(local<0||local>length)return 0;
  const edge=Math.min(1,local/0.012,(length-local)/0.025);
  return Math.sin(2*Math.PI*frequency*local)*Math.max(0,edge);
};
for(let i=0;i<samples;i++){
  const t=i/sampleRate;
  const signal=0.28*(tone(t,0.08,0.22,880)+0.38*tone(t,0.08,0.22,1320)+tone(t,0.43,0.22,880)+0.38*tone(t,0.43,0.22,1320));
  wav.writeInt16LE(Math.round(Math.max(-1,Math.min(1,signal))*32767),44+i*2);
}
mkdirSync(dirname(output),{recursive:true});
writeFileSync(output,wav);
