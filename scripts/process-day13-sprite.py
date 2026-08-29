#!/usr/bin/env python3
"""Build DAY 13 Ara's RGBA sprite from the approved baked-checker source.

This intentionally reuses the deterministic checker-removal implementation
from ``process-day2-assets.py``.  It does not call any image-generation API.
"""

from __future__ import annotations

import argparse
import importlib.util
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
DAY2_PROCESSOR = ROOT / "scripts" / "process-day2-assets.py"
DEFAULT_SOURCE = (
    ROOT
    / "assets"
    / "source-sheets"
    / "day13"
    / "ara-day13-photo-walk-casual-checker-v1.png"
)
DEFAULT_OUTPUT = (
    ROOT
    / "assets"
    / "characters"
    / "day13"
    / "ara-day13-photo-walk-casual-2d-v1.png"
)
MINIMUM_SIZE = (887, 1774)


def load_day2_processor():
    spec = importlib.util.spec_from_file_location("day2_asset_processor", DAY2_PROCESSOR)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"cannot load {DAY2_PROCESSOR}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def validate_sprite(image: Image.Image) -> None:
    if image.mode != "RGBA":
        raise ValueError(f"expected RGBA, got {image.mode}")
    if image.width < MINIMUM_SIZE[0] or image.height < MINIMUM_SIZE[1]:
        raise ValueError(f"expected at least {MINIMUM_SIZE}, got {image.size}")
    alpha = image.getchannel("A")
    if alpha.getextrema() != (0, 255):
        raise ValueError(f"expected alpha extrema (0, 255), got {alpha.getextrema()}")
    corners = (
        alpha.getpixel((0, 0)),
        alpha.getpixel((image.width - 1, 0)),
        alpha.getpixel((0, image.height - 1)),
        alpha.getpixel((image.width - 1, image.height - 1)),
    )
    if corners != (0, 0, 0, 0):
        raise ValueError(f"expected transparent corners, got {corners}")
    opaque = sum(1 for value in alpha.get_flattened_data() if value == 255)
    if opaque < image.width * image.height // 5:
        raise ValueError(f"foreground is unexpectedly sparse: {opaque} opaque pixels")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Convert the approved DAY 13 baked-checker source into an RGBA sprite."
    )
    parser.add_argument("--source", type=Path, default=DEFAULT_SOURCE)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--force", action="store_true", help="allow replacing an existing output")
    args = parser.parse_args()

    if not args.source.is_file():
        raise FileNotFoundError(args.source)
    if args.output.exists() and not args.force:
        raise FileExistsError(f"refusing to overwrite {args.output}; pass --force explicitly")

    processor = load_day2_processor()
    source = Image.open(args.source).convert("RGB")
    sprite = processor.remove_baked_checker(source)
    sprite = processor.keep_largest_components(sprite, count=1)
    validate_sprite(sprite)

    args.output.parent.mkdir(parents=True, exist_ok=True)
    sprite.save(args.output, optimize=True)
    try:
        display_path = args.output.resolve().relative_to(ROOT)
    except ValueError:
        display_path = args.output.resolve()
    print(f"saved {display_path} {sprite.size} {sprite.mode}")


if __name__ == "__main__":
    main()
