#!/usr/bin/env python3
"""Convert an ImageGen green-screen character render into a transparent sprite."""

from __future__ import annotations

import argparse
from collections import deque
from pathlib import Path
from statistics import median

from PIL import Image


def keep_largest_silhouette(alpha: Image.Image, threshold: int = 24) -> Image.Image:
    """Remove detached chroma-screen speckles while preserving the sprite edge."""

    width, height = alpha.size
    values = alpha.tobytes()
    candidates = bytearray(value >= threshold for value in values)
    visited = bytearray(width * height)
    largest: list[int] = []

    for start in range(width * height):
        if not candidates[start] or visited[start]:
            continue
        visited[start] = 1
        component: list[int] = []
        queue = deque([start])
        while queue:
            index = queue.popleft()
            component.append(index)
            x = index % width
            y = index // width
            for ny in range(max(0, y - 1), min(height, y + 2)):
                row = ny * width
                for nx in range(max(0, x - 1), min(width, x + 2)):
                    neighbor = row + nx
                    if candidates[neighbor] and not visited[neighbor]:
                        visited[neighbor] = 1
                        queue.append(neighbor)
        if len(component) > len(largest):
            largest = component

    keep = bytearray(width * height)
    for index in largest:
        keep[index] = values[index]
    return Image.frombytes("L", alpha.size, bytes(keep))


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
    alpha = keep_largest_silhouette(alpha)
    rgba = source.convert("RGBA")
    rgba.putalpha(alpha)
    transparent = Image.new("RGBA", rgba.size, (0, 0, 0, 0))
    rgba = Image.composite(rgba, transparent, alpha)
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
