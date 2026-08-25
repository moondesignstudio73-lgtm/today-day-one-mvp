from __future__ import annotations

from collections import deque
from pathlib import Path

from PIL import Image, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets" / "source-sheets" / "day1"


HAEUN_EXPRESSIONS = [
    "haeun-expression-resting-tired-2d.png",
    "haeun-expression-startled-relief-2d.png",
    "haeun-expression-teary-relief-2d.png",
    "haeun-expression-apologetic-worried-2d.png",
    "haeun-expression-calm-attentive-2d.png",
    "haeun-expression-warm-playful-2d.png",
    "haeun-expression-soft-vulnerable-2d.png",
    "haeun-expression-gentle-resolve-2d.png",
]

HAEUN_POSES = [
    "haeun-pose-seated-dozing-2d.png",
    "haeun-pose-rise-and-pause-2d.png",
    "haeun-pose-careful-embrace-2d.png",
    "haeun-pose-step-back-open-2d.png",
    "haeun-pose-seated-no-contact-2d.png",
    "haeun-pose-standing-bedside-restraint-2d.png",
    "haeun-pose-cup-assist-open-palm-2d.png",
    "haeun-pose-light-banter-2d.png",
    "haeun-pose-calendar-resolve-2d.png",
]

MEDICAL_STAFF = [
    "doctor-bedside-assessment-2d.png",
    "doctor-record-and-explain-2d.png",
    "doctor-explain-open-hands-2d.png",
    "nurse-vitals-check-2d.png",
    "nurse-safety-guidance-2d.png",
    "nurse-swallow-assessment-2d.png",
]


def grid_boxes(
    size: tuple[int, int],
    columns: int,
    rows: int,
    x_edges: list[int] | None = None,
    y_edges: list[int] | None = None,
):
    width, height = size
    x_edges = x_edges or [round(column * width / columns) for column in range(columns + 1)]
    y_edges = y_edges or [round(row * height / rows) for row in range(rows + 1)]
    for row in range(rows):
        for column in range(columns):
            yield (
                x_edges[column],
                y_edges[row],
                x_edges[column + 1],
                y_edges[row + 1],
            )


def is_checker_background(pixel: tuple[int, int, int]) -> bool:
    low = min(pixel)
    high = max(pixel)
    return low >= 225 and high - low <= 6


def fill_enclosed_transparency(alpha: Image.Image, close_bottom: bool) -> Image.Image:
    width, height = alpha.size
    foreground = bytearray(255 if value else 0 for value in alpha.get_flattened_data())
    if close_bottom:
        for y in range(height - 1, -1, -1):
            candidates = [x for x in range(width) if foreground[y * width + x]]
            if len(candidates) >= 8:
                left, right = min(candidates), max(candidates)
                for x in range(left, right + 1):
                    foreground[y * width + x] = 255
                break

    external = bytearray(width * height)
    queue: deque[tuple[int, int]] = deque()

    def seed(x: int, y: int) -> None:
        index = y * width + x
        if foreground[index] or external[index]:
            return
        external[index] = 255
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

    filled = bytearray(width * height)
    for index in range(width * height):
        filled[index] = 0 if external[index] else 255
    return Image.frombytes("L", (width, height), bytes(filled))


def remove_baked_checker(image: Image.Image, close_bottom: bool) -> Image.Image:
    rgb = image.convert("RGB")
    width, height = rgb.size
    pixels = rgb.load()
    background = bytearray(width * height)
    queue: deque[tuple[int, int]] = deque()

    def seed(x: int, y: int) -> None:
        index = y * width + x
        if background[index] or not is_checker_background(pixels[x, y]):
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

    background_mask = Image.frombytes("L", (width, height), bytes(background))
    background_mask = background_mask.filter(ImageFilter.MaxFilter(3))
    alpha = background_mask.point(lambda value: 255 - value)
    alpha = fill_enclosed_transparency(alpha, close_bottom)
    rgba = rgb.convert("RGBA")
    rgba.putalpha(alpha)
    return rgba


def normalize_generated_alpha(image: Image.Image) -> Image.Image:
    rgba = image.convert("RGBA")
    source_alpha = rgba.getchannel("A")

    def normalize(value: int) -> int:
        if value <= 24:
            return 0
        if value >= 200:
            return 255
        return round((value - 24) * 255 / 176)

    rgba.putalpha(source_alpha.point(normalize))
    return rgba


def crop_to_content(image: Image.Image, margin: int = 8) -> Image.Image:
    alpha = image.getchannel("A")
    box = alpha.getbbox()
    if not box:
        raise ValueError("sprite cell has no visible pixels")
    left, top, right, bottom = box
    left = max(0, left - margin)
    top = max(0, top - margin)
    right = min(image.width, right + margin)
    bottom = min(image.height, bottom + margin)
    return image.crop((left, top, right, bottom))


def keep_largest_component(image: Image.Image) -> Image.Image:
    width, height = image.size
    alpha = image.getchannel("A")
    visible = bytearray(1 if value else 0 for value in alpha.get_flattened_data())
    visited = bytearray(width * height)
    largest: list[int] = []
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
        if len(component) > len(largest):
            largest = component
    if not largest:
        raise ValueError("sprite cell has no connected foreground")
    mask = bytearray(width * height)
    for index in largest:
        mask[index] = 255
    cleaned = image.copy()
    cleaned.putalpha(Image.frombytes("L", (width, height), bytes(mask)))
    return cleaned


def save_sheet(cells: list[Image.Image], columns: int, destination: Path) -> None:
    rows = (len(cells) + columns - 1) // columns
    cell_width = max(cell.width for cell in cells)
    cell_height = max(cell.height for cell in cells)
    sheet = Image.new("RGBA", (cell_width * columns, cell_height * rows), (0, 0, 0, 0))
    for index, cell in enumerate(cells):
        x = (index % columns) * cell_width + (cell_width - cell.width) // 2
        y = (index // columns) * cell_height + (cell_height - cell.height)
        sheet.alpha_composite(cell, (x, y))
    destination.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(destination, optimize=True)


def process_checker_sheet(
    source_name: str,
    columns: int,
    rows: int,
    names: list[str],
    output_directory: Path,
    clean_sheet_name: str,
    close_bottom: bool,
    x_edges: list[int] | None = None,
    y_edges: list[int] | None = None,
    custom_boxes: list[tuple[int, int, int, int]] | None = None,
) -> list[Path]:
    source = Image.open(SOURCE / source_name).convert("RGB")
    cells: list[Image.Image] = []
    outputs: list[Path] = []
    boxes = custom_boxes or list(
        grid_boxes(source.size, columns, rows, x_edges=x_edges, y_edges=y_edges)
    )
    for box, name in zip(boxes, names, strict=True):
        cell = remove_baked_checker(source.crop(box), close_bottom)
        cell = crop_to_content(keep_largest_component(cell))
        destination = output_directory / name
        destination.parent.mkdir(parents=True, exist_ok=True)
        cell.save(destination, optimize=True)
        cells.append(cell)
        outputs.append(destination)
    save_sheet(cells, columns, SOURCE / clean_sheet_name)
    return outputs + [SOURCE / clean_sheet_name]


def process_medical_staff() -> list[Path]:
    source = Image.open(SOURCE / "medical-staff-day1-poses-v1.png").convert("RGBA")
    cells: list[Image.Image] = []
    outputs: list[Path] = []
    output_directory = ROOT / "assets" / "npcs" / "day1"
    for box, name in zip(grid_boxes(source.size, 3, 2), MEDICAL_STAFF, strict=True):
        cell = crop_to_content(normalize_generated_alpha(source.crop(box)))
        destination = output_directory / name
        destination.parent.mkdir(parents=True, exist_ok=True)
        cell.save(destination, optimize=True)
        cells.append(cell)
        outputs.append(destination)
    clean_sheet = SOURCE / "medical-staff-day1-poses-clean-v2.png"
    save_sheet(cells, 3, clean_sheet)
    return outputs + [clean_sheet]


def verify_alpha(paths: list[Path]) -> None:
    for path in paths:
        image = Image.open(path)
        if image.mode != "RGBA":
            raise ValueError(f"{path}: expected RGBA, got {image.mode}")
        extrema = image.getchannel("A").getextrema()
        if extrema != (0, 255):
            raise ValueError(f"{path}: expected alpha extrema (0, 255), got {extrema}")


def create_composite_preview(
    sprite_paths: list[Path], columns: int, destination: Path
) -> None:
    cell_size = (480, 270)
    background = Image.open(
        ROOT / "assets" / "backgrounds" / "hospital" / "day1-hospital-bedside-day-v1.png"
    ).convert("RGB").resize(cell_size, Image.Resampling.LANCZOS)
    rows = (len(sprite_paths) + columns - 1) // columns
    preview = Image.new("RGB", (cell_size[0] * columns, cell_size[1] * rows))
    for index, path in enumerate(sprite_paths):
        cell = background.copy().convert("RGBA")
        sprite = Image.open(path).convert("RGBA")
        scale = min(300 / sprite.width, 250 / sprite.height)
        sprite = sprite.resize(
            (max(1, round(sprite.width * scale)), max(1, round(sprite.height * scale))),
            Image.Resampling.LANCZOS,
        )
        x = (cell_size[0] - sprite.width) // 2
        y = cell_size[1] - sprite.height
        cell.alpha_composite(sprite, (x, y))
        preview.paste(cell.convert("RGB"), ((index % columns) * cell_size[0], (index // columns) * cell_size[1]))
    destination.parent.mkdir(parents=True, exist_ok=True)
    preview.save(destination, optimize=True)


def main() -> None:
    outputs: list[Path] = []
    outputs += process_checker_sheet(
        "haeun-day1-expressions-v1.png",
        4,
        2,
        HAEUN_EXPRESSIONS,
        ROOT / "assets" / "characters" / "day1" / "haeun" / "expressions",
        "haeun-day1-expressions-clean-v2.png",
        close_bottom=True,
    )
    outputs += process_checker_sheet(
        "haeun-day1-poses-v1.png",
        3,
        3,
        HAEUN_POSES,
        ROOT / "assets" / "characters" / "day1" / "haeun" / "poses",
        "haeun-day1-poses-clean-v2.png",
        close_bottom=False,
        custom_boxes=[
            (0, 0, 350, 500),
            (300, 0, 700, 500),
            (600, 0, 1024, 500),
            (0, 480, 350, 985),
            (300, 480, 680, 985),
            (590, 480, 1024, 985),
            (0, 960, 360, 1536),
            (290, 960, 700, 1536),
            (590, 960, 1024, 1536),
        ],
    )
    outputs += process_medical_staff()
    verify_alpha(outputs)
    expression_paths = [
        ROOT / "assets" / "characters" / "day1" / "haeun" / "expressions" / name
        for name in HAEUN_EXPRESSIONS
    ]
    pose_paths = [
        ROOT / "assets" / "characters" / "day1" / "haeun" / "poses" / name
        for name in HAEUN_POSES
    ]
    staff_paths = [ROOT / "assets" / "npcs" / "day1" / name for name in MEDICAL_STAFF]
    create_composite_preview(
        expression_paths, 4, ROOT / "docs" / "day1" / "qa" / "day1-haeun-expressions-composite.png"
    )
    create_composite_preview(
        pose_paths, 3, ROOT / "docs" / "day1" / "qa" / "day1-haeun-poses-composite.png"
    )
    create_composite_preview(
        staff_paths, 3, ROOT / "docs" / "day1" / "qa" / "day1-medical-staff-composite.png"
    )
    for path in outputs:
        print(path.relative_to(ROOT))


if __name__ == "__main__":
    main()
