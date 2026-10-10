"""Phone-card loops for VectorShield and LavaRise from the screenshot sets in src/assets/work.
Usage: python3 scripts/readme-media/phones.py <outdir>"""
import glob, os, sys
from PIL import Image, ImageDraw, ImageFont
from fontTools.ttLib import TTFont

OUT = sys.argv[1]
os.makedirs(OUT, exist_ok=True)
A = 'src/assets/work'
PAPER, INK, LINE = (18, 16, 16), (241, 236, 227), (52, 49, 46)
CW, CH, SW, PAD, TOP = 420, 812, 320, 50, 76
HOLD_MS, FADE_N, FADE_MS = 2400, 10, 55

# Pillow needs a TTF; the site ships Plex Mono as woff2, so decompress it once.
src = glob.glob('node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2')[0]
ttf = os.path.join(OUT, 'PlexMono-500.ttf')
f = TTFont(src); f.flavor = None; f.save(ttf)
font = ImageFont.truetype(ttf, 15)


def card(screen_path, icon_path, name):
    im = Image.new('RGB', (CW, CH), PAPER)
    dr = ImageDraw.Draw(im)
    icon = Image.open(icon_path).convert('RGBA').resize((28, 28), Image.LANCZOS)
    m = Image.new('L', (28, 28), 0)
    ImageDraw.Draw(m).rounded_rectangle((0, 0, 27, 27), radius=7, fill=255)
    im.paste(icon, (PAD, 24), m)
    dr.text((PAD + 40, 24 + 14), name, font=font, fill=INK, anchor='lm')
    scr = Image.open(screen_path).convert('RGB')
    sh = round(scr.height * SW / scr.width)
    scr = scr.resize((SW, sh), Image.LANCZOS)
    mask = Image.new('L', (SW, sh), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, SW - 1, sh - 1), radius=24, fill=255)
    im.paste(scr, (PAD, TOP), mask)
    dr.rounded_rectangle((PAD - 1, TOP - 1, PAD + SW, TOP + sh), radius=25, outline=LINE, width=1)
    return im


SETS = {
    'vectorshield': ('vectorshield-icon.webp', 'VectorShield',
                     ['vectorshield-meds.webp', 'vectorshield-medication.webp', 'vectorshield-restaurants.webp']),
    'lavarise': ('lavarise-icon.webp', 'LavaRise',
                 ['lavarise-lava.webp', 'lavarise-grapple.webp', 'lavarise-chapters.webp']),
}
for slug, (icon, name, screens) in SETS.items():
    cards = [card(f'{A}/{s}', f'{A}/{icon}', name) for s in screens]
    frames, durs = [], []
    for i, c in enumerate(cards):
        frames.append(c); durs.append(HOLD_MS)
        nxt = cards[(i + 1) % len(cards)]
        for k in range(1, FADE_N + 1):
            frames.append(Image.blend(c, nxt, k / (FADE_N + 1))); durs.append(FADE_MS)
    mosaic = Image.new('RGB', (CW, CH * len(cards)))
    for i, c in enumerate(cards):
        mosaic.paste(c, (0, CH * i))
    pal = mosaic.quantize(colors=255, method=Image.Quantize.MEDIANCUT)
    q = [fr.quantize(palette=pal, dither=Image.Dither.NONE) for fr in frames]
    path = os.path.join(OUT, f'{slug}.gif')
    q[0].save(path, save_all=True, append_images=q[1:], duration=durs, loop=0, optimize=True)
    print(path, round(os.path.getsize(path) / 1024), 'KB', len(q), 'frames')
