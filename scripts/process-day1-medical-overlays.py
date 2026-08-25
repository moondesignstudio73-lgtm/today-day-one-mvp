from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
NPC = ROOT / "assets" / "npcs" / "day1"
HQ = NPC / "hq"
SOURCES = (
    "doctor-bedside-assessment-2d.png",
    "doctor-explain-open-hands-2d.png",
    "doctor-record-and-explain-2d.png",
    "nurse-vitals-check-2d.png",
    "nurse-safety-guidance-2d.png",
    "nurse-swallow-assessment-2d.png",
)
TARGET_HEIGHT = 1536


def destination_for(source: Path) -> Path:
    return HQ / source.name


def resize_premultiplied(source: Path) -> Path:
    image = Image.open(source).convert("RGBA")
    target_size = (round(image.width * TARGET_HEIGHT / image.height), TARGET_HEIGHT)
    rgba = np.asarray(image, dtype=np.float32) / 255.0
    alpha = rgba[..., 3]
    premultiplied = rgba[..., :3] * alpha[..., None]
    resized_alpha = np.asarray(
        Image.fromarray(alpha, mode="F").resize(target_size, Image.Resampling.LANCZOS),
        dtype=np.float32,
    )
    resized_channels = [
        np.asarray(
            Image.fromarray(premultiplied[..., channel], mode="F").resize(
                target_size, Image.Resampling.LANCZOS
            ),
            dtype=np.float32,
        )
        for channel in range(3)
    ]
    resized_premultiplied = np.stack(resized_channels, axis=-1)
    safe_alpha = np.maximum(resized_alpha, 1 / 255)
    resized_rgb = np.where(
        resized_alpha[..., None] > 1 / 255,
        resized_premultiplied / safe_alpha[..., None],
        0,
    )
    result = np.concatenate(
        (np.clip(resized_rgb, 0, 1), np.clip(resized_alpha[..., None], 0, 1)), axis=-1
    )
    output = Image.fromarray(np.round(result * 255).astype(np.uint8), mode="RGBA")
    sharpened = output.convert("RGB").filter(
        ImageFilter.UnsharpMask(radius=0.9, percent=75, threshold=3)
    )
    sharpened.putalpha(output.getchannel("A"))
    destination = destination_for(source)
    sharpened.save(destination, optimize=True)
    return destination


def verify(source: Path, destination: Path) -> None:
    before = Image.open(source).convert("RGBA")
    after = Image.open(destination).convert("RGBA")
    if after.height != TARGET_HEIGHT:
        raise ValueError(f"{destination}: expected {TARGET_HEIGHT}px height")
    if abs(after.width / after.height - before.width / before.height) > 0.002:
        raise ValueError(f"{destination}: aspect ratio changed")
    if after.getchannel("A").getextrema() != (0, 255):
        raise ValueError(f"{destination}: transparent alpha was not preserved")


def main() -> None:
    HQ.mkdir(parents=True, exist_ok=True)
    for name in SOURCES:
        source = NPC / name
        destination = resize_premultiplied(source)
        verify(source, destination)
        print(f"{destination.relative_to(ROOT)} ({Image.open(destination).size[0]}x{TARGET_HEIGHT})")


if __name__ == "__main__":
    main()
