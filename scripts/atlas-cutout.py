"""Cut Ingredient Atlas images out of their white studio background.

Uses rembg (U²-Net "isnet-general-use") so the food is matted as an object:
background and the photo's contact shadow are removed together — no
half-cut shadows, and white foods (tofu, quark, egg) stay fully opaque.
Output: trimmed, square, 256px WebP with alpha.

Usage: python scripts/atlas-cutout.py <in_dir> <out_dir>
Needs: pip install "rembg[cpu]" pillow   (downloads the model on first run)
"""
import sys
from pathlib import Path

from PIL import Image
from rembg import new_session, remove

SIZE = 256
PAD = 0.06


def cutout(path: Path, session) -> Image.Image:
    img = remove(Image.open(path).convert('RGB'), session=session)
    alpha = img.getchannel('A')
    box = alpha.point(lambda v: 255 if v > 16 else 0).getbbox() or (0, 0, *img.size)
    img = img.crop(box)
    side = int(max(img.size) * (1 + 2 * PAD))
    canvas = Image.new('RGBA', (side, side), (0, 0, 0, 0))
    canvas.paste(img, ((side - img.width) // 2, (side - img.height) // 2), img)
    return canvas.resize((SIZE, SIZE), Image.LANCZOS)


def main() -> None:
    src, dst = Path(sys.argv[1]), Path(sys.argv[2])
    dst.mkdir(parents=True, exist_ok=True)
    session = new_session('isnet-general-use')
    for f in sorted(src.glob('*.webp')):
        cutout(f, session).save(dst / f.name, 'WEBP', quality=88, method=6)
        print('ok', f.stem)


if __name__ == '__main__':
    main()
