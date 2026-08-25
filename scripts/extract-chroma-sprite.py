#!/usr/bin/env python3
"""Convert an ImageGen green-screen character render into a transparent sprite."""

from __future__ import annotations

import argparse
from pathlib import Path
from statistics import median

from PIL import Image


def extract(input_path: Path, output_path: Path) -> None:
    source = Image.open(input_path).convert("RGB")
    pixels = source.load()
    alpha = Image.new("L", source.size)
    alpha_pixels = alpha.load()

    border = []
    inset = min(8, source.width // 4, source.height // 4)
    for x in range(source.width):
        for y in (*range(inset), *range(source.height - inset, source.height)):
            border.append(pixels[x, y])
    for y in range(inset, source.height - inset):
        for x in (*range(inset), *range(source.width - inset, source.width)):
            border.append(pixels[x, y])
    background = tuple(int(median(channel)) for channel in zip(*border))
    background_dominance = background[1] - max(background[0], background[2])

    for y in range(source.height):
        for x in range(source.width):
            red, green, blue = pixels[x, y]
            dominance = green - max(red, blue)
            if green < 70 or dominance <= 5:
                opacity_ratio = 1.0
            else:
                opacity_ratio = (background_dominance - dominance) / (
                    background_dominance - 5.0
                )
                opacity_ratio = max(0.0, min(1.0, opacity_ratio))
            if opacity_ratio < 0.025:
                opacity_ratio = 0.0
            elif opacity_ratio > 0.985:
                opacity_ratio = 1.0
            opacity = int(round(255.0 * opacity_ratio))
            alpha_pixels[x, y] = opacity

            # Unmix the matte color from partially transparent edge pixels.
            if 0.025 <= opacity_ratio < 0.985:
                foreground = tuple(
                    int(
                        round(
                            max(
                                0.0,
                                min(
                                    255.0,
                                    (channel - (1.0 - opacity_ratio) * bg_channel)
                                    / opacity_ratio,
                                ),
                            )
                        )
                    )
                    for channel, bg_channel in zip(
                        (red, green, blue), background
                    )
                )
                pixels[x, y] = foreground
    rgba = source.convert("RGBA")
    rgba.putalpha(alpha)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    rgba.save(output_path, optimize=True)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("input", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()
    extract(args.input, args.output)


if __name__ == "__main__":
    main()
