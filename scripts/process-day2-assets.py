from __future__ import annotations

from collections import deque
from pathlib import Path

from PIL import Image, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets" / "source-sheets" / "day2"

HAEUN_NAMES = [
    "haeun-day2-pose-support-offer-open-palm-2d.png",
    "haeun-day2-pose-forearm-support-2d.png",
    "haeun-day2-pose-paced-walk-beside-2d.png",
    "haeun-day2-pose-pack-and-present-2d.png",
    "haeun-day2-pose-safe-driving-2d.png",
    "haeun-day2-pose-key-handover-step-aside-2d.png",
    "haeun-day2-pose-photo-side-inspection-2d.png",
    "haeun-day2-pose-doorframe-permission-wait-2d.png",
    "haeun-day2-pose-departing-open-wave-2d.png",
]

POV_NAMES = [
    "pov-day2-gesture-bed-edge-prep-2d.png",
    "pov-day2-gesture-rail-grip-release-2d.png",
    "pov-day2-gesture-document-receive-2d.png",
    "pov-day2-gesture-key-inspect-unlock-2d.png",
    "pov-day2-gesture-family-photo-hold-2d.png",
    "pov-day2-gesture-couple-photo-turn-2d.png",
    "pov-day2-gesture-search-interactions-2d.png",
    "pov-day2-gesture-small-key-classify-2d.png",
    "pov-day2-gesture-three-column-note-2d.png",
    "pov-day2-gesture-spare-phone-contact-2d.png",
]


def grid_boxes(size: tuple[int, int], columns: int, rows: int):
    width, height = size
    xs = [round(index * width / columns) for index in range(columns + 1)]
    ys = [round(index * height / rows) for index in range(rows + 1)]
    for row in range(rows):
        for column in range(columns):
            yield xs[column], ys[row], xs[column + 1], ys[row + 1]


def crop_to_content(image: Image.Image, margin: int = 6) -> Image.Image:
    box = image.getchannel("A").getbbox()
    if not box:
        raise ValueError("sprite cell has no visible pixels")
    left, top, right, bottom = box
    return image.crop(
        (
            max(0, left - margin),
            max(0, top - margin),
            min(image.width, right + margin),
            min(image.height, bottom + margin),
        )
    )


def normalize_alpha(image: Image.Image) -> Image.Image:
    rgba = image.convert("RGBA")
    rgba.putalpha(
        rgba.getchannel("A").point(
            lambda value: 0 if value <= 8 else 255 if value >= 230 else round((value - 8) * 255 / 222)
        )
    )
    return rgba


def keep_largest_components(image: Image.Image, count: int = 1) -> Image.Image:
    width, height = image.size
    visible = bytearray(1 if value else 0 for value in image.getchannel("A").get_flattened_data())
    visited = bytearray(width * height)
    components: list[list[int]] = []
    for start in range(width * height):
        if not visible[start] or visited[start]:
            continue
        component: list[int] = []
        queue = deque([start])
        visited[start] = 1
        while queue:
            index = queue.popleft()
            component.append(index)
            x, y = index % width, index // width
            for nx, ny in (
                (x - 1, y - 1), (x, y - 1), (x + 1, y - 1),
                (x - 1, y), (x + 1, y),
                (x - 1, y + 1), (x, y + 1), (x + 1, y + 1),
            ):
                if 0 <= nx < width and 0 <= ny < height:
                    neighbor = ny * width + nx
                    if visible[neighbor] and not visited[neighbor]:
                        visited[neighbor] = 1
                        queue.append(neighbor)
        components.append(component)
    if not components:
        raise ValueError("sprite cell has no connected foreground")
    largest = sorted(components, key=len, reverse=True)[:count]
    mask = bytearray(width * height)
    for component in largest:
        for index in component:
            mask[index] = 255
    cleaned = image.copy()
    cleaned.putalpha(Image.frombytes("L", (width, height), bytes(mask)))
    return cleaned


def is_checker(pixel: tuple[int, int, int]) -> bool:
    low, high = min(pixel), max(pixel)
    return low >= 225 and high - low <= 8


def remove_baked_checker(image: Image.Image) -> Image.Image:
    rgb = image.convert("RGB")
    width, height = rgb.size
    pixels = rgb.load()
    background = bytearray(width * height)
    queue: deque[tuple[int, int]] = deque()

    def seed(x: int, y: int) -> None:
        index = y * width + x
        if background[index] or not is_checker(pixels[x, y]):
            return
        background[index] = 255
        queue.append((x, y))

    for x in range(width):
        seed(x, 0)
        seed(x, height - 1)
    for y in range(height):
        seed(0, y)
        seed(width - 1, y)
    while queue:
        x, y = queue.popleft()
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if 0 <= nx < width and 0 <= ny < height:
                seed(nx, ny)

    mask = Image.frombytes("L", (width, height), bytes(background)).filter(ImageFilter.MaxFilter(3))
    rgba = rgb.convert("RGBA")
    rgba.putalpha(mask.point(lambda value: 255 - value))
    return rgba


def save_cells(
    source: Image.Image,
    boxes,
    names: list[str],
    destination: Path,
    cleaner,
    keep_counts: dict[int, int],
    skip: set[int],
) -> list[Path | None]:
    outputs: list[Path | None] = [None] * len(names)
    destination.mkdir(parents=True, exist_ok=True)
    for index, (box, name) in enumerate(zip(boxes, names, strict=True)):
        if index in skip:
            continue
        cell = cleaner(source.crop(box))
        if index in keep_counts:
            cell = keep_largest_components(cell, keep_counts[index])
        cell = crop_to_content(cell)
        path = destination / name
        cell.save(path, optimize=True)
        outputs[index] = path
    return outputs


def verify_alpha(paths: list[Path]) -> None:
    for path in paths:
        image = Image.open(path)
        if image.mode != "RGBA":
            raise ValueError(f"{path}: expected RGBA, got {image.mode}")
        if image.getchannel("A").getextrema() != (0, 255):
            raise ValueError(f"{path}: incomplete alpha range")


def create_preview(paths: list[Path], columns: int, destination: Path, background_path: Path) -> None:
    cell_width, cell_height = 480, 270
    background = Image.open(background_path).convert("RGB").resize((cell_width, cell_height), Image.Resampling.LANCZOS)
    rows = (len(paths) + columns - 1) // columns
    preview = Image.new("RGB", (cell_width * columns, cell_height * rows))
    for index, path in enumerate(paths):
        cell = background.convert("RGBA")
        sprite = Image.open(path).convert("RGBA")
        scale = min(420 / sprite.width, 250 / sprite.height)
        sprite = sprite.resize((max(1, round(sprite.width * scale)), max(1, round(sprite.height * scale))), Image.Resampling.LANCZOS)
        x = (cell_width - sprite.width) // 2
        y = cell_height - sprite.height
        cell.alpha_composite(sprite, (x, y))
        preview.paste(cell.convert("RGB"), ((index % columns) * cell_width, (index // columns) * cell_height))
    destination.parent.mkdir(parents=True, exist_ok=True)
    preview.save(destination, optimize=True)


def process_standalone(source: Path, destination: Path, cleaner) -> Path:
    image = Image.open(source)
    cleaned = crop_to_content(cleaner(image))
    destination.parent.mkdir(parents=True, exist_ok=True)
    cleaned.save(destination, optimize=True)
    return destination


def create_mobile_crop_preview(paths: list[Path], columns: int, destination: Path) -> None:
    crop_width, crop_height = 270, 480
    rows = (len(paths) + columns - 1) // columns
    preview = Image.new("RGB", (crop_width * columns, crop_height * rows), (24, 24, 24))
    for index, path in enumerate(paths):
        image = Image.open(path).convert("RGB")
        target_ratio = 9 / 16
        if image.width / image.height > target_ratio:
            width = round(image.height * target_ratio)
            left = (image.width - width) // 2
            image = image.crop((left, 0, left + width, image.height))
        else:
            height = round(image.width / target_ratio)
            top = (image.height - height) // 2
            image = image.crop((0, top, image.width, top + height))
        image = image.resize((crop_width, crop_height), Image.Resampling.LANCZOS)
        preview.paste(image, ((index % columns) * crop_width, (index // columns) * crop_height))
    destination.parent.mkdir(parents=True, exist_ok=True)
    preview.save(destination, optimize=True)


def main() -> None:
    haeun_source = Image.open(SOURCE / "haeun-day2-poses-v2.png").convert("RGBA")
    haeun_paths = save_cells(
        haeun_source,
        grid_boxes(haeun_source.size, 3, 3),
        HAEUN_NAMES,
        ROOT / "assets" / "characters" / "day2" / "haeun" / "poses",
        normalize_alpha,
        {index: 1 for index in range(9)},
        {1, 4},
    )

    pov_source = Image.open(SOURCE / "pov-day2-gestures-v2.png").convert("RGB")
    pov_paths = save_cells(
        pov_source,
        grid_boxes(pov_source.size, 5, 2),
        POV_NAMES,
        ROOT / "assets" / "props" / "day2" / "pov",
        remove_baked_checker,
        {**{index: 1 for index in range(10)}, 6: 3},
        {0, 4},
    )

    haeun_paths[1] = process_standalone(
        SOURCE / "standalone" / "haeun-day2-forearm-support-v2.png",
        ROOT / "assets" / "characters" / "day2" / "haeun" / "poses" / "haeun-day2-pose-forearm-support-2d-v3.png",
        remove_baked_checker,
    )
    haeun_paths[4] = process_standalone(
        SOURCE / "standalone" / "haeun-day2-safe-driving-v2.png",
        ROOT / "assets" / "characters" / "day2" / "haeun" / "poses" / "haeun-day2-pose-safe-driving-2d-v3.png",
        remove_baked_checker,
    )
    pov_paths[0] = process_standalone(
        SOURCE / "standalone" / "pov-day2-bed-edge-prep-v2.png",
        ROOT / "assets" / "props" / "day2" / "pov" / "pov-day2-gesture-bed-edge-prep-2d-v3.png",
        remove_baked_checker,
    )
    pov_paths[4] = process_standalone(
        SOURCE / "pov-day2-family-photo-hold-v2.png",
        ROOT / "assets" / "props" / "day2" / "pov" / "pov-day2-gesture-family-photo-hold-2d-v2.png",
        normalize_alpha,
    )
    verify_alpha(haeun_paths + pov_paths)
    create_preview(
        haeun_paths,
        3,
        ROOT / "docs" / "day2" / "qa" / "day2-haeun-poses-composite.png",
        ROOT / "assets" / "backgrounds" / "day2" / "day2-home-entry-living-afternoon-v1.png",
    )
    create_preview(
        pov_paths,
        5,
        ROOT / "docs" / "day2" / "qa" / "day2-pov-gestures-composite.png",
        ROOT / "assets" / "backgrounds" / "day2" / "day2-protagonist-bedroom-afternoon-v2.png",
    )
    create_mobile_crop_preview(
        [
            ROOT / "assets" / "backgrounds" / "day2" / "day2-recovery-corridor-morning-v1.png",
            ROOT / "assets" / "backgrounds" / "day2" / "day2-hospital-lobby-day-v1.png",
            ROOT / "assets" / "backgrounds" / "day2" / "day2-hospital-exit-day-v1.png",
            ROOT / "assets" / "backgrounds" / "day2" / "day2-car-interior-day-v1.png",
            ROOT / "assets" / "backgrounds" / "day2" / "day2-home-exterior-afternoon-v1.png",
            ROOT / "assets" / "backgrounds" / "day2" / "day2-home-entry-living-afternoon-v1.png",
            ROOT / "assets" / "backgrounds" / "day2" / "day2-protagonist-bedroom-afternoon-v2.png",
        ],
        4,
        ROOT / "docs" / "day2" / "qa" / "day2-backgrounds-mobile-crop.png",
    )
    create_mobile_crop_preview(
        [
            ROOT / "assets" / "events" / "day2" / "cg-day2-home-threshold-v2.png",
            ROOT / "assets" / "events" / "day2" / "cg-day2-family-photo-v1.png",
            ROOT / "assets" / "events" / "day2" / "cg-day2-couple-photo-v1.png",
            ROOT / "assets" / "events" / "day2" / "cg-day2-three-column-resolve-v2.png",
        ],
        4,
        ROOT / "docs" / "day2" / "qa" / "day2-events-mobile-crop.png",
    )
    for path in haeun_paths + pov_paths:
        print(path.relative_to(ROOT))


if __name__ == "__main__":
    main()
