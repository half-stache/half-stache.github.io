"""Riverstock release wave as an SVG with SMIL timing, plus the water temperature at the wave.

One loop is one month. The wave's travel times are the model's estimated hours to each access point.
Water temperature is measured at two USGS sensors only, the dam tailwater (mile 0.34) and Dewey
(mile 29.5); the monthly means come from docs/17 in the Riverstock repo (46,765 paired hours,
2021-02-05 to 2026-08-22). Between the two sensors the value is a straight-line interpolation, which is
what the reach service draws too, and it is labelled as such.
Usage: python3 scripts/readme-media/riverstock.py <outdir>"""
import math, os, sys

OUT = sys.argv[1]
os.makedirs(OUT, exist_ok=True)

POINTS = [(0, 'Greers Ferry Dam', 0), (5.5, 'Cow Shoals', 2.3), (10, 'Winkley Bridge', 4.1), (15.9, 'Lobo Landing', 6.5),
          (19.3, 'Mossy Shoal', 7.9), (24, 'Pangburn', 9.8), (29, 'Ramsey Access', 11.9)]
# (month, dam sensor mile 0.34 degF, Dewey mile 29.5 degF, gain over 29 mi degF), measured monthly means,
# docs/17 section 5. The gain is the doc's own column (converted from degC there), not a difference of rounded degF.
MONTHS = [('January', 49.0, 45.9, -3.2), ('February', 46.7, 47.4, 0.7), ('March', 46.7, 51.8, 5.1), ('April', 48.7, 56.5, 7.8),
          ('May', 48.9, 56.6, 7.7), ('June', 50.0, 60.3, 10.3), ('July', 51.0, 60.2, 9.2), ('August', 51.8, 61.2, 9.5),
          ('September', 52.2, 63.4, 11.2), ('October', 52.2, 59.6, 7.4), ('November', 51.7, 54.2, 2.5), ('December', 50.8, 48.8, -2.0)]
START = 7  # the first loop shows August, then the months run on from there
ORDER = MONTHS[START:] + MONTHS[:START]
DAM_MILE, DEWEY_MILE = 0.34, 29.5
D = 15.0            # seconds per loop, one second per hour of travel, then a rest
TOTAL = D * 12      # the month cycle

W, H, x0, x1, yR = 800, 384, 40, 760, 200
x = lambda mi: x0 + (mi / 29) * (x1 - x0)
RED, INK, INK2, INK3, PAPER, LINE = '#e8503f', '#f1ece3', '#aca49a', '#6f6860', '#121010', 'rgba(241,236,227,0.22)'
FONT = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'


def temp_at(mile, dam, dewey):
    if mile <= DAM_MILE:
        return dam
    if mile >= DEWEY_MILE:
        return dewey
    return dam + (dewey - dam) * (mile - DAM_MILE) / (DEWEY_MILE - DAM_MILE)


# The river line, and where along its length each access point sits (animateMotion wants fractions).
segs = []
p0 = (x0, yR); p1 = (x(4), yR - 22); p2 = (x(8), yR + 26); p3 = (x(12), yR + 4); segs.append((p0, p1, p2, p3))
p0 = p3; p1 = (2 * p0[0] - p2[0], 2 * p0[1] - p2[1]); p2 = (x(20), yR - 24); p3 = (x(24), yR + 6); segs.append((p0, p1, p2, p3))
p0 = p3; p1 = (2 * p0[0] - p2[0], 2 * p0[1] - p2[1]); p2 = (x(28), yR + 18); p3 = (x1, yR - 6); segs.append((p0, p1, p2, p3))
d = f"M{x0},{yR} C{x(4)},{yR - 22} {x(8)},{yR + 26} {x(12)},{yR + 4} S{x(20)},{yR - 24} {x(24)},{yR + 6} S{x(28)},{yR + 18} {x1},{yR - 6}"


def bez(s, t):
    (a, b, c, e) = s; u = 1 - t
    return (u ** 3 * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t ** 3 * e[0],
            u ** 3 * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t ** 3 * e[1])


samples, L, prev = [], 0.0, segs[0][0]
for s in segs:
    for k in range(1, 401):
        p = bez(s, k / 400); L += math.hypot(p[0] - prev[0], p[1] - prev[1]); samples.append((L, p[0])); prev = p


def frac_at_x(xt):
    for (l, px) in samples:
        if px >= xt:
            return l / L
    return 1.0


fr = [frac_at_x(x(mi)) for (mi, _, _) in POINTS]
kp = ';'.join(f'{f:.4f}' for f in fr) + f';{fr[-1]:.4f}'
kt = ';'.join(f'{h / D:.4f}' for (_, _, h) in POINTS) + ';1'


def shown(start, end, total):
    """A discrete opacity animation: visible from start to end seconds, over a cycle of total seconds."""
    a, b = start / total, end / total
    if start <= 0 and end >= total:
        return ''
    if start <= 0:
        return f'<animate attributeName="opacity" values="1;0;0" keyTimes="0;{b:.5f};1" calcMode="discrete" dur="{total}s" repeatCount="indefinite"/>'
    if end >= total:
        return f'<animate attributeName="opacity" values="0;1;1" keyTimes="0;{a:.5f};1" calcMode="discrete" dur="{total}s" repeatCount="indefinite"/>'
    return f'<animate attributeName="opacity" values="0;1;0;0" keyTimes="0;{a:.5f};{b:.5f};1" calcMode="discrete" dur="{total}s" repeatCount="indefinite"/>'


o = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img" '
     f'aria-label="A release wave travelling down the Little Red River from Greers Ferry Dam to Ramsey Access, arriving at each '
     f'access point at the hour the Riverstock model estimates, with the water temperature at the wave for each month of the year: '
     f'measured at the dam and at Dewey, interpolated between" font-family="{FONT}" font-size="12">',
     f'<rect width="{W}" height="{H}" fill="{PAPER}"/>',
     f'<text x="{x0}" y="28" fill="{INK2}" letter-spacing="1">RELEASE WAVE DOWN THE LITTLE RED RIVER</text>',
     f'<text x="{x1}" y="28" fill="{INK2}" text-anchor="end" letter-spacing="1">HOURS AFTER RELEASE</text>']

# Hour counter, one number at a time, per loop.
for k in range(13):
    o.append(f'<text x="{x1}" y="60" fill="{INK}" text-anchor="end" font-size="28" opacity="0">{k}{shown(k, k + 1 if k < 12 else D, D)}</text>')

# Month line and the temperature at the wave. One loop per month.
for m, (name, dam, dewey, gain) in enumerate(ORDER):
    t0 = m * D
    sign = '+' if gain >= 0 else '-'
    label = f'{name.upper()} MEANS · DAM {dam:.1f} °F · DEWEY {dewey:.1f} °F · {sign}{abs(gain):.1f} °F OVER 29 MI'
    o.append(f'<text x="{x0}" y="60" fill="{INK2}" letter-spacing="1" opacity="0">{label}{shown(t0, t0 + D, TOTAL)}</text>')
    for i, (mi, _, h) in enumerate(POINTS):
        t_on = t0 + h
        t_off = t0 + (POINTS[i + 1][2] if i + 1 < len(POINTS) else D)
        val = temp_at(mi, dam, dewey)
        o.append(f'<text x="{x0}" y="92" fill="{INK}" font-size="28" opacity="0">{val:.1f} °F{shown(t_on, t_off, TOTAL)}</text>')
o.append(f'<text x="{x0 + 132}" y="92" fill="{INK2}" opacity="0">at the wave, measured at the dam sensor{shown(0, POINTS[1][2], D)}</text>')
o.append(f'<text x="{x0 + 132}" y="92" fill="{INK2}" opacity="0">at the wave, interpolated{shown(POINTS[1][2], D, D)}</text>')

# The river, the trace that grows behind the wave, and the access points.
o.append(f'<path d="{d}" fill="none" stroke="{LINE}" stroke-width="2.5" stroke-linecap="round"/>')
o.append(f'<path d="{d}" fill="none" stroke="{RED}" stroke-width="2.5" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1">'
         f'<animate attributeName="stroke-dashoffset" values="{";".join(f"{1 - f:.4f}" for f in fr)};{1 - fr[-1]:.4f};1" '
         f'keyTimes="{kt.rsplit(";", 1)[0]};{13.5 / D:.4f};1" calcMode="linear" dur="{D}s" repeatCount="indefinite"/></path>')
for i, (mi, name, h) in enumerate(POINTS):
    px = x(mi); up = i % 2 == 0; ly = yR - 62 if up else yR + 62
    anchor = 'start' if i == 0 else ('end' if i == len(POINTS) - 1 else 'middle')
    o.append(f'<line x1="{px:.1f}" y1="{yR}" x2="{px:.1f}" y2="{ly + 14 if up else ly - 24}" stroke="{LINE}" stroke-width="1"/>')
    t_on, t_peak, t_off = h / D, (h + 0.25) / D, (h + 1.2) / D
    if i == 0:
        anims = (f'<animate attributeName="r" values="9;4.5;4.5" keyTimes="0;{0.25 / D:.4f};1" dur="{D}s" repeatCount="indefinite"/>'
                 f'<animate attributeName="fill" values="{RED};{PAPER};{PAPER}" keyTimes="0;{1.2 / D:.4f};1" dur="{D}s" repeatCount="indefinite"/>'
                 f'<animate attributeName="stroke" values="{RED};{INK};{INK}" keyTimes="0;{1.2 / D:.4f};1" dur="{D}s" repeatCount="indefinite"/>')
    else:
        anims = (f'<animate attributeName="r" values="4.5;4.5;9;4.5;4.5" keyTimes="0;{t_on:.4f};{t_peak:.4f};{t_off:.4f};1" dur="{D}s" repeatCount="indefinite"/>'
                 f'<animate attributeName="fill" values="{PAPER};{PAPER};{RED};{PAPER};{PAPER}" keyTimes="0;{t_on:.4f};{t_peak:.4f};{t_off:.4f};1" dur="{D}s" repeatCount="indefinite"/>'
                 f'<animate attributeName="stroke" values="{INK};{INK};{RED};{INK};{INK}" keyTimes="0;{t_on:.4f};{t_peak:.4f};{t_off:.4f};1" dur="{D}s" repeatCount="indefinite"/>')
    o.append(f'<circle cx="{px:.1f}" cy="{yR}" r="4.5" fill="{PAPER}" stroke="{INK}" stroke-width="1.5">{anims}</circle>')
    o.append(f'<text x="{px:.1f}" y="{ly}" text-anchor="{anchor}" fill="{INK}">{name}</text>')
    sub = 'mile 0' if i == 0 else f'{h} h · mi {mi}'
    o.append(f'<text x="{px:.1f}" y="{ly + 16}" text-anchor="{anchor}" fill="{INK2}">{sub}</text>')
    for m, (_, dam, dewey, _gain) in enumerate(ORDER):
        val = temp_at(mi, dam, dewey)
        o.append(f'<text x="{px:.1f}" y="{ly + 32}" text-anchor="{anchor}" fill="{INK if i == 0 else INK2}" opacity="0">{val:.1f} °F{shown(m * D, (m + 1) * D, TOTAL)}</text>')

# The pulse itself.
o.append(f'<g opacity="0"><animate attributeName="opacity" values="0;1;1;0;0" keyTimes="0;{0.3 / D:.4f};{11.9 / D:.4f};{13 / D:.4f};1" dur="{D}s" repeatCount="indefinite"/>')
for r, op in ((16, 0.25), (6, 1)):
    o.append(f'<circle r="{r}" fill="{RED}" opacity="{op}"><animateMotion dur="{D}s" repeatCount="indefinite" calcMode="linear" keyPoints="{kp}" keyTimes="{kt}"><mpath href="#river"/></animateMotion></circle>')
o.append('</g>')
o.append(f'<path id="river" d="{d}" fill="none" stroke="none"/>')
NOTES = [
    'Water temperature: USGS sensors at the dam tailwater (mile 0.34) and at Dewey (mile 29.5),',
    'monthly means over 46,765 paired hours, 2021 to 2026. Between the two a straight line, as the',
    'reach service draws it. The gradient reverses in winter: Dewey runs colder than the dam.',
    'Travel times are model estimates. Ramsey measured: 12 h median over 121 events, not the folk figure of 8 h.',
]
for n, line in enumerate(NOTES):
    o.append(f'<text x="{x0}" y="{H - 62 + 15 * n}" fill="{INK3}" font-size="11">{line}</text>')
o.append('</svg>')
svg = '\n'.join(o)
path = os.path.join(OUT, 'riverstock.svg')
open(path, 'w').write(svg)
print(path, len(svg.encode()), 'bytes;', len(o), 'elements')
for name, dam, dewey, _gain in ORDER[:3]:
    print(name, [f'{temp_at(mi, dam, dewey):.1f}' for (mi, _, _) in POINTS])
