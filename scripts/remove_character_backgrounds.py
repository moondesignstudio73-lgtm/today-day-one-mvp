from __future__ import annotations

import argparse
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
ASSET_PATTERNS = (
    "assets/heroines/*/outfits/*.webp",
    "assets/heroines/yuna/expressions/*.webp",
    "assets/characters/girlfriend-standing-keyed.png",
)


def character_assets() -> list[Path]:
    return sorted({path for pattern in ASSET_PATTERNS for path in ROOT.glob(pattern)})


def has_useful_alpha(image: Image.Image) -> bool:
    if "A" not in image.getbands():
        return False
    alpha = np.asarray(image.getchannel("A"), dtype=np.uint8)
    return float(np.count_nonzero(alpha < 16)) / alpha.size >= 0.01


def background_candidate(rgb: np.ndarray) -> np.ndarray:
    border = np.concatenate((rgb[0, :, :], rgb[-1, :, :], rgb[:, 0, :], rgb[:, -1, :]), axis=0)
    median = np.median(border, axis=0)
    if median[1] > median[0] + 80 and median[1] > median[2] + 80:
        red = rgb[:, :, 0].astype(np.int16)
        green = rgb[:, :, 1].astype(np.int16)
        blue = rgb[:, :, 2].astype(np.int16)
        candidate = (green >= 140) & ((green - red) >= 55) & ((green - blue) >= 55)
        return candidate & smooth_region(rgb)
    brightest = rgb.max(axis=2).astype(np.int16)
    darkest = rgb.min(axis=2).astype(np.int16)
    candidate = (darkest >= 175) & ((brightest - darkest) <= 22)
    return candidate & smooth_region(rgb)


def smooth_region(rgb: np.ndarray, threshold: int = 18) -> np.ndarray:
    colors = rgb.astype(np.int16)
    height, width = colors.shape[:2]
    strongest_edge = np.zeros((height, width), dtype=np.int16)
    for dy, dx in ((-1, 0), (1, 0), (0, -1), (0, 1)):
        shifted = np.roll(colors, (dy, dx), axis=(0, 1))
        difference = np.abs(colors - shifted).max(axis=2)
        if dy == -1:
            difference[-1, :] = 0
        elif dy == 1:
            difference[0, :] = 0
        if dx == -1:
            difference[:, -1] = 0
        elif dx == 1:
            difference[:, 0] = 0
        strongest_edge = np.maximum(strongest_edge, difference)
    return strongest_edge <= threshold


def connected_border_background(candidate: np.ndarray) -> np.ndarray:
    height, width = candidate.shape
    background = np.zeros_like(candidate, dtype=bool)
    queue: deque[tuple[int, int]] = deque()

    for x in range(width):
        if candidate[0, x]:
            queue.append((0, x))
        if candidate[height - 1, x]:
            queue.append((height - 1, x))
    for y in range(height):
        if candidate[y, 0]:
            queue.append((y, 0))
        if candidate[y, width - 1]:
            queue.append((y, width - 1))

    while queue:
        y, x = queue.popleft()
        if background[y, x] or not candidate[y, x]:
            continue
        background[y, x] = True
        if y:
            queue.append((y - 1, x))
        if y + 1 < height:
            queue.append((y + 1, x))
        if x:
            queue.append((y, x - 1))
        if x + 1 < width:
            queue.append((y, x + 1))
    adjacent = np.zeros_like(background)
    adjacent[1:, :] |= background[:-1, :]
    adjacent[:-1, :] |= background[1:, :]
    adjacent[:, 1:] |= background[:, :-1]
    adjacent[:, :-1] |= background[:, 1:]
    return background | (candidate & adjacent)


def largest_connected_subject(foreground: np.ndarray) -> np.ndarray:
    height, width = foreground.shape
    visited = np.zeros_like(foreground, dtype=bool)
    largest: list[tuple[int, int]] = []
    for start_y, start_x in zip(*np.nonzero(foreground)):
        if visited[start_y, start_x]:
            continue
        component: list[tuple[int, int]] = []
        queue: deque[tuple[int, int]] = deque([(int(start_y), int(start_x))])
        visited[start_y, start_x] = True
        while queue:
            y, x = queue.popleft()
            component.append((y, x))
            for next_y, next_x in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
                if 0 <= next_y < height and 0 <= next_x < width and foreground[next_y, next_x] and not visited[next_y, next_x]:
                    visited[next_y, next_x] = True
                    queue.append((next_y, next_x))
        if len(component) > len(largest):
            largest = component
    subject = np.zeros_like(foreground, dtype=bool)
    if largest:
        ys, xs = zip(*largest)
        subject[np.asarray(ys), np.asarray(xs)] = True
    return subject


def bleed_edge_colors(rgb: np.ndarray, foreground: np.ndarray, steps: int = 3) -> np.ndarray:
    result = rgb.astype(np.float32).copy()
    filled = foreground.copy()
    height, width = foreground.shape
    for _ in range(steps):
        sums = np.zeros_like(result)
        counts = np.zeros((height, width), dtype=np.float32)
        for dy, dx in ((-1, 0), (1, 0), (0, -1), (0, 1)):
            shifted_filled = np.roll(filled, (dy, dx), axis=(0, 1))
            shifted_rgb = np.roll(result, (dy, dx), axis=(0, 1))
            if dy == -1:
                shifted_filled[-1, :] = False
            elif dy == 1:
                shifted_filled[0, :] = False
            if dx == -1:
                shifted_filled[:, -1] = False
            elif dx == 1:
                shifted_filled[:, 0] = False
            sums += shifted_rgb * shifted_filled[..., None]
            counts += shifted_filled
        expand = (~filled) & (counts > 0)
        result[expand] = sums[expand] / counts[expand, None]
        filled |= expand
    return np.clip(result, 0, 255).astype(np.uint8)


def remove_background(source: Path, destination: Path) -> tuple[float, float]:
    with Image.open(source) as opened:
        image = opened.convert("RGBA")
    rgba = np.asarray(image, dtype=np.uint8).copy()
    background = connected_border_background(background_candidate(rgba[:, :, :3]))
    foreground = largest_connected_subject(~background)
    background = ~foreground
    ratio = float(np.count_nonzero(background)) / background.size
    if not 0.15 <= ratio <= 0.90:
        raise ValueError(f"unsafe background coverage {ratio:.1%}: {source}")

    rgba[:, :, :3] = bleed_edge_colors(rgba[:, :, :3], foreground)
    hard_alpha = Image.fromarray(np.where(foreground, 255, 0).astype(np.uint8), "L")
    alpha = hard_alpha.filter(ImageFilter.GaussianBlur(radius=0.65))
    alpha_values = np.asarray(alpha, dtype=np.uint8)
    alpha_values = np.where(alpha_values < 12, 0, np.where(alpha_values > 243, 255, alpha_values)).astype(np.uint8)
    rgba[:, :, 3] = alpha_values

    destination.parent.mkdir(parents=True, exist_ok=True)
    output = Image.fromarray(rgba, "RGBA")
    if destination.suffix.lower() == ".webp":
        output.save(destination, "WEBP", lossless=True, method=6, exact=True)
    else:
        output.save(destination, optimize=True)
    transparent = float(np.count_nonzero(alpha_values < 16)) / alpha_values.size
    return ratio, transparent


def main() -> None:
    parser = argparse.ArgumentParser(description="Remove connected neutral backgrounds from production character assets.")
    parser.add_argument("--write", action="store_true", help="Overwrite production assets after validation.")
    parser.add_argument("--output-dir", type=Path, help="Write a non-destructive preview tree here.")
    parser.add_argument("--match", help="Process only asset paths containing this text.")
    args = parser.parse_args()
    if not args.write and args.output_dir is None:
        parser.error("choose --write or --output-dir")

    processed = 0
    skipped = 0
    sources = character_assets()
    if args.match:
        sources = [source for source in sources if args.match in source.as_posix()]
    for source in sources:
        with Image.open(source) as image:
            if has_useful_alpha(image):
                skipped += 1
                continue
        destination = source if args.write else args.output_dir / source.relative_to(ROOT)
        ratio, transparent = remove_background(source, destination)
        processed += 1
        print(f"{source.relative_to(ROOT).as_posix()} background={ratio:.1%} transparent={transparent:.1%}")
    print(f"processed={processed} skipped={skipped}")


if __name__ == "__main__":
    main()
