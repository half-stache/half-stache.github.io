"""Riverstock release-wave animation as an SVG with SMIL timing from the model's hours.
Usage: python3 scripts/readme-media/riverstock.py <outdir>"""
# Riverstock: a release wave travelling down the Little Red River, timed by the model's hours.
import math
import sys
OUT=sys.argv[1]
points=[(0,'Greers Ferry Dam',0),(5.5,'Cow Shoals',2.3),(10,'Winkley Bridge',4.1),(15.9,'Lobo Landing',6.5),(19.3,'Mossy Shoal',7.9),(24,'Pangburn',9.8),(29,'Ramsey Access',11.9)]
W,H,x0,x1,yR=800,300,40,760,150
x=lambda mi: x0+(mi/29)*(x1-x0)
segs=[]
p0=(x0,yR); p1=(x(4),yR-22); p2=(x(8),yR+26); p3=(x(12),yR+4); segs.append((p0,p1,p2,p3))
p0=p3; p1=(2*p0[0]-p2[0],2*p0[1]-p2[1]); p2=(x(20),yR-24); p3=(x(24),yR+6); segs.append((p0,p1,p2,p3))
p0=p3; p1=(2*p0[0]-p2[0],2*p0[1]-p2[1]); p2=(x(28),yR+18); p3=(x1,yR-6); segs.append((p0,p1,p2,p3))
d=f"M{x0},{yR} C{x(4)},{yR-22} {x(8)},{yR+26} {x(12)},{yR+4} S{x(20)},{yR-24} {x(24)},{yR+6} S{x(28)},{yR+18} {x1},{yR-6}"
def bez(s,t):
    (a,b,c,e)=s; u=1-t
    return (u**3*a[0]+3*u*u*t*b[0]+3*u*t*t*c[0]+t**3*e[0], u**3*a[1]+3*u*u*t*b[1]+3*u*t*t*c[1]+t**3*e[1])
samples=[]; L=0; prev=segs[0][0]
for s in segs:
    for k in range(1,401):
        p=bez(s,k/400); L+=math.hypot(p[0]-prev[0],p[1]-prev[1]); samples.append((L,p[0],p[1])); prev=p
total=L
def frac_at_x(xt):
    for (l,px,py) in samples:
        if px>=xt: return l/total
    return 1.0
D=15.0  # seconds per loop: one second per hour, then a short rest
red,ink,ink2,ink3,paper,line='#e8503f','#f1ece3','#aca49a','#6f6860','#121010','rgba(241,236,227,0.22)'
font='ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'
fr=[frac_at_x(x(mi)) for (mi,_,_) in points]
kp=';'.join(f'{f:.4f}' for f in fr)+f';{fr[-1]:.4f}'
kt=';'.join(f'{h/D:.4f}' for (_,_,h) in points)+';1'
o=[]
o.append(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img" aria-label="A release wave travelling down the Little Red River from Greers Ferry Dam to Ramsey Access, arriving at each access point at the hour the Riverstock model estimates" font-family="{font}" font-size="12">')
o.append(f'<rect width="{W}" height="{H}" fill="{paper}"/>')
o.append(f'<text x="{x0}" y="28" fill="{ink2}" letter-spacing="1">RELEASE WAVE DOWN THE LITTLE RED RIVER</text>')
o.append(f'<text x="{x1}" y="28" fill="{ink2}" text-anchor="end" letter-spacing="1">HOURS AFTER RELEASE</text>')
# hour counter, one number at a time
for k in range(13):
    if k==0: anim=f'<animate attributeName="opacity" values="1;0;0" keyTimes="0;{1/D:.4f};1" calcMode="discrete" dur="{D}s" repeatCount="indefinite"/>'
    elif k==12: anim=f'<animate attributeName="opacity" values="0;1;1" keyTimes="0;{12/D:.4f};1" calcMode="discrete" dur="{D}s" repeatCount="indefinite"/>'
    else: anim=f'<animate attributeName="opacity" values="0;1;0;0" keyTimes="0;{k/D:.4f};{(k+1)/D:.4f};1" calcMode="discrete" dur="{D}s" repeatCount="indefinite"/>'
    o.append(f'<text x="{x1}" y="60" fill="{ink}" text-anchor="end" font-size="28" opacity="0">{k}{anim}</text>')
o.append(f'<path d="{d}" fill="none" stroke="{line}" stroke-width="2.5" stroke-linecap="round"/>')
# the wave: a red trace that grows along the river behind the pulse
o.append(f'<path d="{d}" fill="none" stroke="{red}" stroke-width="2.5" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1">')
o.append(f'<animate attributeName="stroke-dashoffset" values="{";".join(f"{1-f:.4f}" for f in fr)};{1-fr[-1]:.4f};1" keyTimes="{kt.rsplit(";",1)[0]};{13.5/D:.4f};1" calcMode="linear" dur="{D}s" repeatCount="indefinite"/>')
o.append('</path>')
for i,(mi,name,h) in enumerate(points):
    px=x(mi); up=i%2==0; ly=yR-48 if up else yR+62
    anchor='start' if i==0 else ('end' if i==len(points)-1 else 'middle')
    o.append(f'<line x1="{px:.1f}" y1="{yR}" x2="{px:.1f}" y2="{ly+14 if up else ly-24}" stroke="{line}" stroke-width="1"/>')
    t_on=h/D; t_peak=(h+0.25)/D; t_off=(h+1.2)/D
    if i==0:
        ranim=f'<animate attributeName="r" values="9;4.5;4.5" keyTimes="0;{0.25/D:.4f};1" dur="{D}s" repeatCount="indefinite"/>'
        fanim=f'<animate attributeName="fill" values="{red};{paper};{paper}" keyTimes="0;{1.2/D:.4f};1" dur="{D}s" repeatCount="indefinite"/>'
        sanim=f'<animate attributeName="stroke" values="{red};{ink};{ink}" keyTimes="0;{1.2/D:.4f};1" dur="{D}s" repeatCount="indefinite"/>'
    else:
        ranim=f'<animate attributeName="r" values="4.5;4.5;9;4.5;4.5" keyTimes="0;{t_on:.4f};{t_peak:.4f};{t_off:.4f};1" dur="{D}s" repeatCount="indefinite"/>'
        fanim=f'<animate attributeName="fill" values="{paper};{paper};{red};{paper};{paper}" keyTimes="0;{t_on:.4f};{t_peak:.4f};{t_off:.4f};1" dur="{D}s" repeatCount="indefinite"/>'
        sanim=f'<animate attributeName="stroke" values="{ink};{ink};{red};{ink};{ink}" keyTimes="0;{t_on:.4f};{t_peak:.4f};{t_off:.4f};1" dur="{D}s" repeatCount="indefinite"/>'
    o.append(f'<circle cx="{px:.1f}" cy="{yR}" r="4.5" fill="{paper}" stroke="{ink}" stroke-width="1.5">{ranim}{fanim}{sanim}</circle>')
    o.append(f'<text x="{px:.1f}" y="{ly}" text-anchor="{anchor}" fill="{ink}">{name}</text>')
    sub='mile 0' if i==0 else f'{h} h · mi {mi}'
    o.append(f'<text x="{px:.1f}" y="{ly+16}" text-anchor="{anchor}" fill="{ink2}">{sub}</text>')
# the pulse itself
o.append(f'<g opacity="0"><animate attributeName="opacity" values="0;1;1;0;0" keyTimes="0;{0.3/D:.4f};{11.9/D:.4f};{13/D:.4f};1" dur="{D}s" repeatCount="indefinite"/>')
o.append(f'<circle r="16" fill="{red}" opacity="0.25"><animateMotion dur="{D}s" repeatCount="indefinite" calcMode="linear" keyPoints="{kp}" keyTimes="{kt}"><mpath href="#river"/></animateMotion></circle>')
o.append(f'<circle r="6" fill="{red}"><animateMotion dur="{D}s" repeatCount="indefinite" calcMode="linear" keyPoints="{kp}" keyTimes="{kt}"><mpath href="#river"/></animateMotion></circle>')
o.append('</g>')
o.append(f'<path id="river" d="{d}" fill="none" stroke="none"/>')
o.append(f'<text x="{x0}" y="{H-16}" fill="{ink3}">Model estimates. Ramsey measured: 12 h median over 121 events, not the folk figure of 8 h.</text>')
o.append('</svg>')
svg='\n'.join(o)
import os; os.makedirs(OUT, exist_ok=True); open(os.path.join(OUT,'riverstock.svg'),'w').write(svg)
print('riverstock.svg', len(svg.encode()), 'bytes; fractions', [round(f,3) for f in fr])
