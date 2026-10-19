"""Generates the editorial placeholder imagery used by the Dawn portfolio.

Everything is produced procedurally so the repository carries no third-party
image assets. Output is duotone (ink/paper) with film grain, matching the
monochrome art direction of the reference design.
"""
from __future__ import annotations

import math
import os
import random

from PIL import Image, ImageDraw, ImageFilter, ImageChops

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public", "img")
os.makedirs(OUT, exist_ok=True)

INK = (31, 31, 31)
PAPER = (237, 237, 237)
SLATE = (50, 57, 71)
INDIGO = (58, 53, 84)
SAND = (176, 158, 132)


def lerp(a, b, t):
    return tuple(int(round(a[i] + (b[i] - a[i]) * t)) for i in range(3))


def fast_grain(size, amount=18, seed=0, scale=2):
    """Cheap grain: small noise image scaled up with nearest neighbour."""
    rnd = random.Random(seed)
    w, h = max(2, size[0] // scale), max(2, size[1] // scale)
    noise = Image.new("L", (w, h))
    px = noise.load()
    for y in range(h):
        for x in range(w):
            px[x, y] = 128 + rnd.randint(-amount, amount)
    return noise.resize(size, Image.NEAREST)


def duotone(gray, dark=INK, light=PAPER):
    """Map an L-mode image onto a two-colour ramp."""
    lut_r, lut_g, lut_b = [], [], []
    for i in range(256):
        t = i / 255
        c = lerp(dark, light, t)
        lut_r.append(c[0])
        lut_g.append(c[1])
        lut_b.append(c[2])
    return Image.merge("RGB", (gray.point(lut_r), gray.point(lut_g), gray.point(lut_b)))


def radial(size, center, radius, invert=False, power=1.6):
    w, h = size
    mask = Image.new("L", (w, h))
    px = mask.load()
    cx, cy = center
    for y in range(h):
        for x in range(w):
            d = math.hypot(x - cx, y - cy) / radius
            v = max(0.0, 1.0 - d) ** power
            px[x, y] = int(255 * (v if not invert else 1 - v))
    return mask


def linear_gradient(size, angle=90, invert=False):
    w, h = size
    img = Image.new("L", (w, h))
    px = img.load()
    rad = math.radians(angle)
    dx, dy = math.cos(rad), math.sin(rad)
    denom = abs(dx) * w + abs(dy) * h
    for y in range(h):
        for x in range(w):
            t = (x * dx + y * dy) / denom
            t = min(1.0, max(0.0, t))
            px[x, y] = int(255 * (1 - t if invert else t))
    return img


def silhouette(size, scale=1.0, dx=0.0, dy=0.0):
    """Head-and-shoulders silhouette used as the portrait motif."""
    w, h = size
    m = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(m)
    cx = w * (0.5 + dx)
    head_r = w * 0.20 * scale
    head_cy = h * (0.36 + dy)
    d.ellipse([cx - head_r, head_cy - head_r * 1.18, cx + head_r, head_cy + head_r * 1.18], fill=255)
    neck_w = head_r * 0.55
    d.rectangle([cx - neck_w, head_cy + head_r * 0.8, cx + neck_w, head_cy + head_r * 1.6], fill=255)
    shoulder_w = head_r * 2.6
    shoulder_top = head_cy + head_r * 1.35
    d.ellipse([cx - shoulder_w, shoulder_top, cx + shoulder_w, shoulder_top + shoulder_w * 1.35], fill=255)
    d.rectangle([cx - shoulder_w, shoulder_top + shoulder_w * 0.6, cx + shoulder_w, h + 10], fill=255)
    return m.filter(ImageFilter.GaussianBlur(w * 0.012))


def add_grain(img, amount=16, seed=0):
    g = fast_grain(img.size, amount, seed)
    return ImageChops.overlay(img, Image.merge("RGB", (g, g, g)))


def stretch(gray, lo=0.02, hi=0.98):
    """Rescale an L image so its 2nd-98th percentile spans the full range.

    Compositing steps (multiply/screen) tend to crush the histogram toward
    black; without this the duotone ramp has almost nothing to work with.
    """
    hist = gray.histogram()
    total = sum(hist)
    acc = 0
    mn, mx = 0, 255
    for i, c in enumerate(hist):
        acc += c
        if acc >= total * lo:
            mn = i
            break
    acc = 0
    for i, c in enumerate(hist):
        acc += c
        if acc >= total * hi:
            mx = i
            break
    if mx <= mn:
        return gray
    scale = 255 / (mx - mn)
    return gray.point(lambda i: int(max(0, min(255, (i - mn) * scale))))


def vignette(img, strength=0.55):
    w, h = img.size
    v = radial((w, h), (w / 2, h / 2), max(w, h) * 0.78, invert=True, power=1.3)
    v = v.point(lambda i: int(255 - (255 - i) * strength))
    black = Image.new("RGB", (w, h), INK)
    return Image.composite(img, black, v)


def portrait(path, seed=3, tone=INDIGO, size=(900, 1200), glow=(0.5, 0.42)):
    """Luminous backdrop with a dark head-and-shoulders figure reading against it."""
    w, h = size
    bg = linear_gradient(size, angle=70, invert=True)
    glowm = radial(size, (w * glow[0], h * glow[1]), max(w, h) * 0.6, power=2.0)
    bg = ImageChops.screen(bg, glowm).point(lambda i: int(120 + i * 0.52))
    bright = duotone(bg, INK, lerp(PAPER, tone, 0.3))

    mask = silhouette(size, scale=1.0, dx=0.02, dy=0.03)
    mask = mask.point(lambda i: 255 if i > 110 else int(i * 2.3))
    figure = duotone(bg.point(lambda i: int(28 + i * 0.2)), INK, lerp(tone, INK, 0.35))
    comp = Image.composite(figure, bright, mask)

    img = add_grain(comp, 14, seed)
    vignette(img, 0.42).save(path, quality=88, optimize=True)
    print("wrote", path)


def stripes(path, seed=11, tone=SLATE, size=(900, 1200), count=46, angle=18):
    w, h = size
    g = linear_gradient(size, angle=angle + 90)
    m = Image.new("L", (w, h))
    d = ImageDraw.Draw(m)
    rad = math.radians(angle)
    step = max(w, h) / count
    for i in range(-count, count * 2):
        off = i * step
        d.line([(-w, off), (w * 2, off - math.tan(rad) * w * 3)],
               fill=255 if i % 2 == 0 else 70, width=int(step * 0.55))
    m = m.filter(ImageFilter.GaussianBlur(1.4))
    comp = stretch(ImageChops.multiply(g, m))
    img = duotone(comp, INK, lerp(PAPER, tone, 0.6))
    add_grain(img, 14, seed).save(path, quality=88, optimize=True)
    print("wrote", path)


def halftone(path, seed=21, tone=INDIGO, size=(900, 1200), step=22):
    w, h = size
    g = linear_gradient(size, angle=115, invert=True)
    m = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(m)
    for y in range(0, h + step, step):
        for x in range(0, w + step, step):
            t = g.getpixel((min(x, w - 1), min(y, h - 1))) / 255
            r = max(0.6, t * step * 0.46)
            d.ellipse([x - r, y - r, x + r, y + r], fill=255)
    comp = stretch(ImageChops.multiply(g, m))
    img = duotone(comp, INK, lerp(PAPER, tone, 0.5))
    add_grain(img, 13, seed).save(path, quality=88, optimize=True)
    print("wrote", path)


def blobs(path, seed=31, tone=SAND, size=(900, 1200)):
    w, h = size
    rnd = random.Random(seed)
    canvas = Image.new("L", (w, h), 0)
    for _ in range(9):
        cx, cy = rnd.uniform(0.1, 0.9) * w, rnd.uniform(0.1, 0.9) * h
        r = rnd.uniform(0.18, 0.46) * w
        layer = Image.new("L", (w, h), 0)
        ImageDraw.Draw(layer).ellipse([cx - r, cy - r, cx + r, cy + r], fill=rnd.randint(70, 210))
        canvas = ImageChops.screen(canvas, layer)
    canvas = canvas.filter(ImageFilter.GaussianBlur(w * 0.02))
    # Push the blob field toward the extremes so the cards keep their punch.
    canvas = canvas.point(lambda i: int(255 / (1 + math.exp(-(i - 128) / 26))))
    base = linear_gradient(size, angle=60, invert=True).point(lambda i: int(i * 0.7))
    comp = stretch(ImageChops.screen(base, canvas))
    img = duotone(comp, INK, lerp(PAPER, tone, 0.45))
    vignette(add_grain(img, 16, seed), 0.42).save(path, quality=88, optimize=True)
    print("wrote", path)


def grid_card(path, seed=41, tone=SLATE, size=(900, 1200)):
    w, h = size
    m = Image.new("L", (w, h), 215)
    d = ImageDraw.Draw(m)
    for x in range(0, w, 60):
        d.line([(x, 0), (x, h)], fill=95, width=3)
    for y in range(0, h, 60):
        d.line([(0, y), (w, y)], fill=95, width=3)
    d.ellipse([w * 0.2, h * 0.28, w * 0.8, h * 0.72], fill=235)
    glow = radial(size, (w * 0.5, h * 0.45), max(w, h) * 0.7, power=1.4)
    comp = stretch(ImageChops.multiply(m, glow.point(lambda i: int(90 + i * 0.65))))
    img = duotone(comp, INK, lerp(PAPER, tone, 0.6))
    add_grain(img, 15, seed).save(path, quality=88, optimize=True)
    print("wrote", path)


if __name__ == "__main__":
    portrait(os.path.join(OUT, "hero-portrait.jpg"), seed=3, tone=INDIGO, glow=(0.52, 0.4))
    portrait(os.path.join(OUT, "portrait-card.jpg"), seed=8, tone=SLATE, size=(900, 1150), glow=(0.48, 0.42))
    portrait(os.path.join(OUT, "portrait-square.jpg"), seed=12, tone=SLATE, size=(700, 900), glow=(0.52, 0.4))
    stripes(os.path.join(OUT, "g1.jpg"), seed=11, tone=SLATE, angle=18)
    halftone(os.path.join(OUT, "g2.jpg"), seed=21, tone=INDIGO)
    portrait(os.path.join(OUT, "g3.jpg"), seed=23, tone=SLATE, glow=(0.46, 0.38))
    blobs(os.path.join(OUT, "g4.jpg"), seed=31, tone=SAND)
    grid_card(os.path.join(OUT, "g5.jpg"), seed=41, tone=SLATE)
    stripes(os.path.join(OUT, "g6.jpg"), seed=61, tone=INDIGO, angle=-32, count=64)
    halftone(os.path.join(OUT, "g7.jpg"), seed=71, tone=SAND, step=30)
    blobs(os.path.join(OUT, "g8.jpg"), seed=81, tone=INDIGO)
    print("done")
