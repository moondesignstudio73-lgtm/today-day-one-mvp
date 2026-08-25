"""Generate deterministic, restrained DAY 2 ambience and foley WAV files."""
from __future__ import annotations
import math, random, struct, wave
from pathlib import Path

RATE=22_050
ROOT=Path(__file__).resolve().parents[1]/"assets"/"audio"/"day2"
RNG=random.Random(3002)

def env(t,d,a=.02,r=.08): return max(0.0,min(1.0,t/max(a,1e-6),(d-t)/max(r,1e-6)))
def tone(freq,d,amp,decay=0):
    return [amp*env(i/RATE,d)*math.exp(-decay*i/RATE)*math.sin(2*math.pi*freq*i/RATE) for i in range(int(RATE*d))]
def noise(d,amp,smooth=.9):
    out=[]; prev=0.0
    for i in range(int(RATE*d)):
        prev=smooth*prev+(1-smooth)*RNG.uniform(-1,1); out.append(amp*prev*env(i/RATE,d,.03,.08))
    return out
def mix(d,clips):
    out=[0.0]*int(RATE*d)
    for start,clip in clips:
        off=int(start*RATE)
        for i,v in enumerate(clip):
            if off+i<len(out): out[off+i]+=v
    peak=max((abs(v) for v in out),default=1); scale=min(1,.8/max(peak,1e-6))
    return [v*scale for v in out]
def hit(freq,d=.25,amp=.18): return mix(d,[(0,tone(freq,d,amp,12)),(0,noise(d,amp*.35,.84))])
def write(name,samples):
    ROOT.mkdir(parents=True,exist_ok=True)
    with wave.open(str(ROOT/name),"wb") as f:
        f.setparams((1,2,RATE,0,"NONE","not compressed")); f.writeframes(b"".join(struct.pack("<h",max(-32767,min(32767,int(v*32767)))) for v in samples))
def ambience(name,base,events):
    d=14.0; bed=noise(d,.055,.994)
    for i in range(len(bed)): bed[i]+=0.012*math.sin(2*math.pi*base*i/RATE)
    write(name,mix(d,[(0,bed),*events]))

def main():
    ambience("amb-hospital-corridor-day.wav",55,[(4.2,hit(76,.8,.045)),(10.1,hit(82,.7,.04))])
    ambience("amb-hospital-lobby-day.wav",62,[(3.0,noise(1.5,.035,.97)),(9.0,noise(1.2,.03,.97))])
    ambience("amb-car-interior-day.wav",48,[(0,noise(14,.04,.996))])
    ambience("amb-home-quiet-afternoon.wav",50,[(5.5,tone(880,.12,.018,8)),(11.0,noise(.6,.018,.98))])
    write("rail-grip-release.wav",mix(.45,[(.02,hit(180,.2,.13)),(.22,hit(420,.12,.06))]))
    write("document-receive.wav",mix(.65,[(0,noise(.5,.12,.82)),(.36,hit(210,.18,.07))]))
    write("bag-zipper.wav",mix(.75,[(0,noise(.7,.18,.72)),(.62,hit(760,.1,.07))]))
    write("auto-door.wav",mix(1.1,[(0,noise(.9,.13,.97)),(.05,tone(95,.85,.06,1.2))]))
    write("seatbelt-click.wav",mix(.3,[(.04,hit(310,.18,.18)),(.07,hit(1250,.08,.08))]))
    write("turn-signal.wav",mix(1.15,[(.08,hit(1050,.08,.08)),(.62,hit(1050,.08,.08))]))
    write("home-key-unlock.wav",mix(1.0,[(.08,hit(920,.1,.07)),(.35,hit(820,.1,.06)),(.68,hit(240,.24,.18))]))
    write("light-switch.wav",mix(.22,[(.03,hit(980,.1,.1)),(.06,hit(260,.12,.06))]))
    write("photo-frame.wav",mix(.42,[(.03,hit(720,.1,.07)),(.08,hit(150,.28,.09))]))
    write("drawer-open.wav",mix(.7,[(0,noise(.55,.14,.96)),(.5,hit(150,.16,.08))]))
    write("pencil-note.wav",mix(1.2,[(.05,noise(.95,.1,.72)),(.98,hit(360,.12,.045))]))
    write("spare-phone-key.wav",mix(.38,[(.04,tone(980,.08,.055,10)),(.2,tone(1120,.08,.05,10))]))
    write("front-door-close.wav",mix(.7,[(.18,hit(88,.4,.2)),(.22,hit(620,.1,.06))]))
if __name__=="__main__": main()
