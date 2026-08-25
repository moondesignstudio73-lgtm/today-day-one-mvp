"""Generate deterministic, subtle DAY 1 hospital ambience and prop SFX."""

from __future__ import annotations

import math
import random
import struct
import wave
from pathlib import Path

RATE = 22_050
ROOT = Path(__file__).resolve().parents[1] / "assets" / "audio" / "day1"
RNG = random.Random(3001)


def envelope(t: float, duration: float, attack: float = 0.02, release: float = 0.12) -> float:
    return min(1.0, t / max(attack, 1e-6), (duration - t) / max(release, 1e-6)) if 0 <= t <= duration else 0.0


def tone(freq: float, duration: float, amp: float, *, decay: float = 0.0) -> list[float]:
    values = []
    for i in range(int(RATE * duration)):
        t = i / RATE
        level = amp * envelope(t, duration) * (math.exp(-decay * t) if decay else 1.0)
        values.append(level * math.sin(2 * math.pi * freq * t))
    return values


def noise(duration: float, amp: float, smooth: float = 0.9) -> list[float]:
    values, previous = [], 0.0
    for i in range(int(RATE * duration)):
        previous = smooth * previous + (1 - smooth) * RNG.uniform(-1, 1)
        values.append(amp * previous * envelope(i / RATE, duration, 0.03, 0.08))
    return values


def mix(duration: float, clips: list[tuple[float, list[float]]]) -> list[float]:
    output = [0.0] * int(RATE * duration)
    for start, clip in clips:
        offset = int(start * RATE)
        for index, value in enumerate(clip):
            if offset + index < len(output):
                output[offset + index] += value
    peak = max((abs(value) for value in output), default=1.0)
    scale = min(1.0, 0.82 / max(peak, 1e-6))
    return [value * scale for value in output]


def write(name: str, samples: list[float]) -> None:
    ROOT.mkdir(parents=True, exist_ok=True)
    with wave.open(str(ROOT / name), "wb") as target:
        target.setparams((1, 2, RATE, 0, "NONE", "not compressed"))
        target.writeframes(b"".join(struct.pack("<h", max(-32767, min(32767, int(value * 32767)))) for value in samples))


def impact(freq: float, duration: float, amp: float) -> list[float]:
    return mix(duration, [(0, tone(freq, duration, amp, decay=14)), (0, noise(duration, amp * 0.45, 0.82))])


def main() -> None:
    ambience = noise(18.0, 0.09, 0.992)
    for i, value in enumerate(ambience):
        t = i / RATE
        ambience[i] = value + 0.018 * math.sin(2 * math.pi * 58 * t) + 0.008 * math.sin(2 * math.pi * 116 * t)
    write("amb-hospital-room-day.wav", mix(18.0, [(0, ambience), (5.5, impact(72, 1.8, 0.055)), (13.2, impact(68, 1.5, 0.045))]))
    write("cart-distant.wav", mix(2.3, [(0, noise(2.3, 0.16, 0.96)), (0.2, tone(67, 1.9, 0.09)), (0.7, impact(440, 0.12, 0.08)), (1.45, impact(520, 0.1, 0.06))]))
    write("phone-soft-drop.wav", mix(0.45, [(0.04, impact(105, 0.32, 0.28)), (0.07, impact(1150, 0.09, 0.11))]))
    steps = [(time, impact(82 + index * 4, 0.22, 0.2 - index * 0.015)) for index, time in enumerate((0.12, 0.58, 1.02, 1.43))]
    write("footsteps-approach.wav", mix(1.9, steps))
    write("door-open.wav", mix(0.9, [(0, noise(0.78, 0.16, 0.96)), (0.04, impact(920, 0.1, 0.09)), (0.72, impact(130, 0.15, 0.1))]))
    write("door-close.wav", mix(0.65, [(0.18, impact(92, 0.38, 0.25)), (0.21, impact(780, 0.1, 0.08))]))
    write("medical-light.wav", mix(0.24, [(0.02, impact(1250, 0.07, 0.1)), (0.07, impact(320, 0.12, 0.06))]))
    write("cup-set-down.wav", mix(0.38, [(0.04, impact(820, 0.1, 0.09)), (0.06, impact(170, 0.24, 0.11))]))
    write("phone-screen-off.wav", mix(0.16, [(0.02, impact(1450, 0.06, 0.07)), (0.04, tone(520, 0.1, 0.035, decay=18))]))


if __name__ == "__main__":
    main()
