function e(e,t){let n=e.trim().match(/^#([0-9a-f]{6})$/i);if(!n)return t;let r=parseInt(n[1],16);return[(r>>16&255)/255,(r>>8&255)/255,(r&255)/255]}function t(){let t=getComputedStyle(document.documentElement),n=(n,r)=>e(t.getPropertyValue(n),r);return{paper:n(`--paper`,[.957,.937,.902]),ink:n(`--ink`,[.082,.07,.059]),red:n(`--red`,[.753,.153,.11])}}function n(e,t,n){let r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(console.warn(`hero shader:`,e.getShaderInfoLog(r)),e.deleteShader(r),null)):null}function r(e){let r=e.getContext(`webgl2`,{antialias:!1,alpha:!1,powerPreference:`low-power`});if(!r)return;let i=n(r,r.VERTEX_SHADER,`#version 300 es
in vec2 a;
void main() { gl_Position = vec4(a, 0.0, 1.0); }`),a=n(r,r.FRAGMENT_SHADER,`#version 300 es
precision highp float;
out vec4 o;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_ptr;
uniform float u_ptrK;
uniform vec3 u_paper;
uniform vec3 u_ink;
uniform vec3 u_red;

float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i), b = hash(i + vec2(1, 0)), c = hash(i + vec2(0, 1)), d = hash(i + vec2(1, 1));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = m * p; a *= 0.5; }
  return v;
}
void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;
  float t = u_time * 0.05;
  vec2 pp = (u_ptr - 0.5 * u_res) / u_res.y;
  vec2 d = uv - pp;
  float r = length(d);
  vec2 push = (d / (r + 1e-3)) * u_ptrK * 0.28 * exp(-r * r * 7.0);
  vec2 p = uv * 1.4 + push + vec2(t * 0.6, 0.0);
  vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, 1.3) - t * 0.7));
  vec2 s = vec2(fbm(p + 2.6 * q + vec2(1.7, 9.2) + t * 0.4), fbm(p + 2.6 * q + vec2(8.3, 2.8) - t * 0.3));
  float f = fbm(p + 2.2 * s);
  float band = smoothstep(0.44, 0.50, f) - smoothstep(0.54, 0.62, f);
  float wash = smoothstep(0.30, 0.80, f);
  float vy = gl_FragCoord.y / u_res.y;
  float mask = smoothstep(0.06, 0.42, vy);
  vec3 col = mix(u_paper, u_ink, wash * 0.09 * mask);
  col = mix(col, u_red, band * 0.42 * mask);
  o = vec4(col, 1.0);
}`),o=r.createProgram();if(!i||!a||!o||(r.attachShader(o,i),r.attachShader(o,a),r.linkProgram(o),!r.getProgramParameter(o,r.LINK_STATUS)))return;r.useProgram(o);let s=r.createBuffer();r.bindBuffer(r.ARRAY_BUFFER,s),r.bufferData(r.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),r.STATIC_DRAW);let c=r.getAttribLocation(o,`a`);r.enableVertexAttribArray(c),r.vertexAttribPointer(c,2,r.FLOAT,!1,0,0);let l={res:r.getUniformLocation(o,`u_res`),time:r.getUniformLocation(o,`u_time`),ptr:r.getUniformLocation(o,`u_ptr`),ptrK:r.getUniformLocation(o,`u_ptrK`),paper:r.getUniformLocation(o,`u_paper`),ink:r.getUniformLocation(o,`u_ink`),red:r.getUniformLocation(o,`u_red`)},u=matchMedia(`(prefers-reduced-motion: reduce)`),d=matchMedia(`(prefers-color-scheme: dark)`),f=t(),p=Math.max(.5,Math.min(window.devicePixelRatio||1,1.5)*.6),m=-1e4,h=-1e4,g=-1e4,_=-1e4,v=0,y=0,b=e.parentElement??e;b.addEventListener(`pointermove`,t=>{let n=e.getBoundingClientRect();m=(t.clientX-n.left)*p,h=(n.height-(t.clientY-n.top))*p,y=1},{passive:!0}),b.addEventListener(`pointerleave`,()=>{y=0});function x(){let t=Math.round(e.clientWidth*p),n=Math.round(e.clientHeight*p);(e.width!==t||e.height!==n)&&(e.width=t,e.height=n,r.viewport(0,0,t,n))}function S(t){x(),r.uniform2f(l.res,e.width,e.height),r.uniform1f(l.time,t),r.uniform2f(l.ptr,g,_),r.uniform1f(l.ptrK,v),r.uniform3fv(l.paper,f.paper),r.uniform3fv(l.ink,f.ink),r.uniform3fv(l.red,f.red),r.drawArrays(r.TRIANGLES,0,3)}let C=!0,w=0,T=0,E=performance.now();function D(e){w=0,!(!C||document.hidden||u.matches)&&(e-T<33.333333333333336||(T=e,g+=(m-g)*.08,_+=(h-_)*.08,v+=(y-v)*.05,S((e-E)/1e3+37)),w=requestAnimationFrame(D))}function O(){u.matches?S(37):!w&&C&&!document.hidden&&(w=requestAnimationFrame(D))}new IntersectionObserver(([e])=>{C=e.isIntersecting,O()},{threshold:0}).observe(e),document.addEventListener(`visibilitychange`,O),window.addEventListener(`resize`,()=>{u.matches&&S(37)},{passive:!0}),d.addEventListener(`change`,()=>{f=t(),u.matches&&S(37)}),u.addEventListener(`change`,O),O()}var i=document.getElementById(`hero-canvas`);i&&r(i);