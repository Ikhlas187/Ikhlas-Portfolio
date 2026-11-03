# Conversion photo -> planche manga noir et blanc.
#
# Ce qui fait lire une planche comme du manga, dans l'ordre d'importance :
#   1. un trait encre franc et propre sur les contours
#   2. de grandes zones de blanc papier
#   3. de la trame (screentone) sur quelques zones seulement, pas partout
#   4. des noirs pleins dans les ombres profondes
# Donc la chaine SIMPLIFIE l'image avant de la tramer, au lieu de tramer
# chaque pixel de la photo.
#
# Tout est calcule a 2x la resolution de sortie pour que les points de trame
# restent nets quand la camera zoome dans la planche.

import sys
import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter, minimum_filter, median_filter


def load_gray(path, scale=2.0, crop=None):
    im = Image.open(path).convert("RGB")
    if crop:
        im = im.crop(crop)
    w, h = im.size
    im = im.resize((int(w * scale), int(h * scale)), Image.LANCZOS)
    a = np.asarray(im).astype(np.float32) / 255.0
    return 0.2126 * a[..., 0] + 0.7152 * a[..., 1] + 0.0722 * a[..., 2]


def normalize(g, lo=1.5, hi=98.5):
    a, b = np.percentile(g, lo), np.percentile(g, hi)
    if b - a < 1e-6:
        return g
    return np.clip((g - a) / (b - a), 0.0, 1.0)


def simplify(g, sigma=3.2, rounds=4, med=5):
    """Efface le detail photographique en gardant les contours francs, pour que
    les bandes de tons forment des aplats propres et pas du moucheté."""
    out = median_filter(g, size=med)
    for _ in range(rounds):
        blur = gaussian_filter(out, sigma)
        gy, gx = np.gradient(gaussian_filter(out, 1.5))
        mag = np.hypot(gx, gy)
        mag = mag / (mag.max() + 1e-6)
        keep = np.clip(mag * 9.0, 0.0, 1.0)  # 1 = contour, on garde l'original
        out = keep * out + (1.0 - keep) * blur
    return np.clip(out, 0.0, 1.0)


def ink(g, sigma=1.1, k=4.0, tau=0.985, eps=-0.012, phi=30.0, thicken=2):
    """Trait encre par difference de gaussiennes etendue, binarise puis
    legerement epaissi. 0 = encre, 1 = papier."""
    g1 = gaussian_filter(g, sigma)
    g2 = gaussian_filter(g, sigma * k)
    d = g1 - tau * g2
    soft = np.where(d >= eps, 1.0, 1.0 + np.tanh(phi * (d - eps)))
    hard = (soft > 0.55).astype(np.float32)
    if thicken > 1:
        hard = minimum_filter(hard, size=thicken)
    return hard


def screentone(shape, coverage, cell, angle=45.0):
    """Trame de points noirs orientee, densite constante. coverage = part de
    surface encree (0.25 = trame legere, 0.55 = trame dense)."""
    h, w = shape
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    a = np.deg2rad(angle)
    u = (xx * np.cos(a) + yy * np.sin(a)) / cell
    v = (-xx * np.sin(a) + yy * np.cos(a)) / cell
    dot = (np.cos(2 * np.pi * u) + np.cos(2 * np.pi * v)) * 0.25 + 0.5
    return np.where(dot < coverage, 0.0, 1.0).astype(np.float32)


def to_manga(src, out_path, scale=2.0, crop=None,
             bands=(0.20, 0.44, 0.70), coverage=(0.55, 0.26),
             cells=(9.0, 11.0), gamma=1.0, invert=False,
             rounds=4, sigma=3.2, thicken=2, phi=30.0):
    g = load_gray(src, scale=scale, crop=crop)
    g = normalize(g)
    g = simplify(g, sigma=sigma, rounds=rounds)
    g = np.clip(g ** gamma, 0.0, 1.0)

    lines = ink(g, thicken=thicken, phi=phi)

    black, dark, light = bands
    shape = g.shape
    tone = np.ones(shape, dtype=np.float32)                      # blanc papier
    tone = np.where(g < light, screentone(shape, coverage[1], cells[1]), tone)
    tone = np.where(g < dark, screentone(shape, coverage[0], cells[0]), tone)
    tone = np.where(g < black, 0.0, tone)                        # noir plein

    plate = np.minimum(tone, lines)
    if invert:
        plate = 1.0 - plate

    Image.fromarray((plate * 255).astype(np.uint8), mode="L").convert("RGB").save(
        out_path, quality=95, subsampling=0
    )
    print(f"{out_path.split('/')[-1]:20} {plate.shape[1]}x{plate.shape[0]}"
          f"  blanc={np.mean(plate > 0.9):.0%} encre={np.mean(plate < 0.1):.0%}")


if __name__ == "__main__":
    SRC, OUT = sys.argv[1], sys.argv[2]

    to_manga(
        f"{SRC}/WhatsApp Image 2026-07-23 at 13.06.31 (1).jpeg",
        f"{OUT}/plate-desk.jpg",
        bands=(0.16, 0.42, 0.68), coverage=(0.52, 0.24), cells=(14.0, 18.0),
        gamma=1.0,
    )

    to_manga(
        f"{SRC}/WhatsApp Image 2026-07-23 at 13.06.31.jpeg",
        f"{OUT}/plate-laptop.jpg",
        bands=(0.13, 0.40, 0.66), coverage=(0.50, 0.24), cells=(15.0, 19.0),
        gamma=0.85,
    )

    # Visage : cadrage large sur toute la tete + le pouce. Moins de lissage et
    # un trait plus epais, sinon les traits du visage disparaissent sous la trame.
    to_manga(
        f"{SRC}/WhatsApp Image 2026-07-23 at 12.51.51.jpeg",
        f"{OUT}/plate-face.jpg",
        scale=2.6, crop=(0, 250, 608, 850),
        bands=(0.13, 0.40, 0.72), coverage=(0.48, 0.20), cells=(12.0, 16.0),
        gamma=0.95, rounds=2, sigma=2.2, thicken=3, phi=40.0,
    )
