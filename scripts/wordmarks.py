"""Outline the site's wordmarks from the Fraunces variable font so they render anywhere.
Run: python3 scripts/wordmarks.py
"""
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
import uharfbuzz as hb, io

SRC = 'node_modules/@fontsource-variable/fraunces/files/fraunces-latin-full-normal.woff2'
AXES = {'wght': 400, 'opsz': 144, 'SOFT': 40, 'WONK': 1}

font = TTFont(SRC)
font.flavor = None
inst = instantiateVariableFont(font, AXES, inplace=False)
buf = io.BytesIO(); inst.save(buf); data = buf.getvalue()
face = hb.Face(data); hbfont = hb.Font(face)
upem = inst['head'].unitsPerEm
glyphset = inst.getGlyphSet()
order = inst.getGlyphOrder()
asc, desc = inst['hhea'].ascent, inst['hhea'].descent

def wordmark(text, out, size=200, tracking=-0.02):
    s = size / upem
    b = hb.Buffer(); b.add_str(text); b.guess_segment_properties()
    hb.shape(hbfont, b, {'kern': True, 'liga': True})
    x = 0.0; parts = []
    for info, pos in zip(b.glyph_infos, b.glyph_positions):
        name = order[info.codepoint]
        pen = SVGPathPen(glyphset)
        tp = TransformPen(pen, (s, 0, 0, -s, x + pos.x_offset * s, -pos.y_offset * s))
        glyphset[name].draw(tp)
        d = pen.getCommands()
        if d: parts.append(d)
        x += pos.x_advance * s + tracking * size
    W = round(x - tracking * size); top = -asc * s; H = round((asc - desc) * s)
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 {top:.1f} {W} {H}" width="{W}" height="{H}" role="img" aria-label="{text}">\n'
           f'  <path fill="currentColor" d="{" ".join(parts)}"/>\n</svg>\n')
    open(out, 'w').write(svg); print(out, f'{W}x{H}', f'{len(svg)//1024}KB')

wordmark('half-stache', 'public/brand/wordmark-half-stache.svg')
wordmark('Hutchware', 'public/brand/wordmark-hutchware.svg')
wordmark('Sam Hutcherson', 'public/brand/wordmark-sam-hutcherson.svg')


# Explicit-color variants, so a file opened on its own or dropped on a page reads correctly
# without relying on currentColor: paper on dark, ink on light, red for Hutchware.
import pathlib as _pathlib
_B = _pathlib.Path('public/brand')
for _name, (_dark, _light) in {'half-stache': ('#f1ece3', '#15120f'), 'sam-hutcherson': ('#f1ece3', '#15120f'), 'hutchware': ('#e8503f', '#c0271c')}.items():
    _src = (_B / f'wordmark-{_name}.svg').read_text()
    (_B / f'wordmark-{_name}-on-dark.svg').write_text(_src.replace('fill="currentColor"', f'fill="{_dark}"'))
    (_B / f'wordmark-{_name}-on-light.svg').write_text(_src.replace('fill="currentColor"', f'fill="{_light}"'))
