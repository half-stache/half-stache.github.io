"""Assemble out/hero.gif from out/hero-frames: a seamless loop by crossfading the tail into the head.
Usage: python3 scripts/readme-media/hero-assemble.py <outdir>"""
import glob, os, sys
from PIL import Image
out = sys.argv[1]
SIZE, N_OUT, N_FADE, COLORS, DUR_MS = (1000, 334), 56, 10, 160, 90
files = sorted(glob.glob(os.path.join(out, 'hero-frames', 'f*.png')))
assert len(files) >= N_OUT + N_FADE, f'need {N_OUT + N_FADE} frames, have {len(files)}'
cap = [Image.open(f).convert('RGB').resize(SIZE, Image.LANCZOS) for f in files[:N_OUT + N_FADE]]
frames = [Image.blend(cap[N_OUT + i], cap[i], (i + 1) / (N_FADE + 1)) if i < N_FADE else cap[i] for i in range(N_OUT)]
# one palette for every frame so nothing shimmers; no dither, the field is soft and dark
mosaic = Image.new('RGB', (SIZE[0], SIZE[1] * 6))
for k, idx in enumerate(list(range(0, N_OUT, max(1, N_OUT // 6)))[:6]):
    mosaic.paste(frames[idx], (0, SIZE[1] * k))
pal = mosaic.quantize(colors=COLORS, method=Image.Quantize.MEDIANCUT)
q = [f.quantize(palette=pal, dither=Image.Dither.NONE) for f in frames]
path = os.path.join(out, 'hero.gif')
q[0].save(path, save_all=True, append_images=q[1:], duration=DUR_MS, loop=0, optimize=True)
print(path, round(os.path.getsize(path) / 1024), 'KB', len(q), 'frames')
