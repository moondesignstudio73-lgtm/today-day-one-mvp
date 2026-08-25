from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
HAEUN = ROOT / "assets" / "characters" / "day2" / "haeun" / "poses"
POV = ROOT / "assets" / "props" / "day2" / "pov"

HAEUN_LOW_RES = (
    "haeun-day2-pose-support-offer-open-palm-2d.png",
    "haeun-day2-pose-paced-walk-beside-2d.png",
    "haeun-day2-pose-pack-and-present-2d.png",
    "haeun-day2-pose-key-handover-step-aside-2d.png",
    "haeun-day2-pose-photo-side-inspection-2d.png",
    "haeun-day2-pose-doorframe-permission-wait-2d.png",
    "haeun-day2-pose-departing-open-wave-2d.png",
)

POV_LOW_RES = (
    "pov-day2-gesture-rail-grip-release-2d.png",
    "pov-day2-gesture-document-receive-2d.png",
    "pov-day2-gesture-key-inspect-unlock-2d.png",
    "pov-day2-gesture-couple-photo-turn-2d.png",
    "pov-day2-gesture-search-interactions-2d.png",
    "pov-day2-gesture-small-key-classify-2d.png",
    "pov-day2-gesture-three-column-note-2d.png",
    "pov-day2-gesture-spare-phone-contact-2d.png",
)


def hq_path(source: Path) -> Path:
    return source.with_name(f"{source.stem}-hq-v2.png")


def resize_premultiplied(source: Path, target_height: int) -> Path:
    image = Image.open(source).convert("RGBA")
    scale = target_height / image.height
    target_size = (round(image.width * scale), target_height)

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
        ImageFilter.UnsharpMask(radius=0.8, percent=70, threshold=3)
    )
    sharpened.putalpha(output.getchannel("A"))
    destination = hq_path(source)
    sharpened.save(destination, optimize=True)
    return destination


def verify(source: Path, destination: Path, target_height: int) -> None:
    before = Image.open(source).convert("RGBA")
    after = Image.open(destination).convert("RGBA")
    if after.height != target_height:
        raise ValueError(f"{destination}: expected height {target_height}, got {after.height}")
    if after.width / after.height != before.width / before.height:
        if abs(after.width / after.height - before.width / before.height) > 0.002:
            raise ValueError(f"{destination}: aspect ratio changed")
    if after.getchannel("A").getextrema() != (0, 255):
        raise ValueError(f"{destination}: incomplete alpha range")


def main() -> None:
    jobs = [*((HAEUN / name, 1200) for name in HAEUN_LOW_RES)]
    jobs.extend((POV / name, 960) for name in POV_LOW_RES)
    for source, target_height in jobs:
        destination = resize_premultiplied(source, target_height)
        verify(source, destination, target_height)
        print(f"{destination.relative_to(ROOT)} ({Image.open(destination).size[0]}x{target_height})")


if __name__ == "__main__":
    main()
