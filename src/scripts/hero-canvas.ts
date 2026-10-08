// Hero background: a slow two-tone current drawn by a WebGL2 fragment shader.
// Paper, a faint ink wash, and bands of the half-stache red that bend around the pointer.
// Pauses when off-screen or the tab is hidden. With prefers-reduced-motion it draws one still frame.

const VERT = `#version 300 es
in vec2 a;
void main() { gl_Position = vec4(a, 0.0, 1.0); }`;

const FRAG = `#version 300 es
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
}`;

type RGB = [number, number, number];

function hexToRgb(hex: string, fallback: RGB): RGB {
  const m = hex.trim().match(/^#([0-9a-f]{6})$/i);
  if (!m) return fallback;
  const n = parseInt(m[1], 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function readColors() {
  const cs = getComputedStyle(document.documentElement);
  const get = (name: string, fb: RGB) => hexToRgb(cs.getPropertyValue(name), fb);
  return {
    paper: get('--paper', [0.957, 0.937, 0.902]),
    ink: get('--ink', [0.082, 0.07, 0.059]),
    red: get('--red', [0.753, 0.153, 0.11]),
  };
}

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.warn('hero shader:', gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

export function mountHero(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, powerPreference: 'low-power' });
  if (!gl) return;

  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  const prog = gl.createProgram();
  if (!vs || !fs || !prog) return;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'a');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const u = {
    res: gl.getUniformLocation(prog, 'u_res'),
    time: gl.getUniformLocation(prog, 'u_time'),
    ptr: gl.getUniformLocation(prog, 'u_ptr'),
    ptrK: gl.getUniformLocation(prog, 'u_ptrK'),
    paper: gl.getUniformLocation(prog, 'u_paper'),
    ink: gl.getUniformLocation(prog, 'u_ink'),
    red: gl.getUniformLocation(prog, 'u_red'),
  };

  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const dark = matchMedia('(prefers-color-scheme: dark)');
  let colors = readColors();
  // The field is soft by design, so it is rendered at reduced resolution and upscaled by CSS.
  // That keeps the fragment cost low on integrated GPUs and phones.
  const dpr = Math.max(0.5, Math.min(window.devicePixelRatio || 1, 1.5) * 0.6);
  const FRAME_MS = 1000 / 30; // 30 fps is plenty for a slow current
  const STILL = 37; // the time value used for the single still frame

  // Pointer state in canvas pixels, origin bottom-left to match gl_FragCoord. Starts far away.
  let tx = -1e4, ty = -1e4, px = -1e4, py = -1e4, k = 0, tk = 0;
  const host = canvas.parentElement ?? canvas;
  host.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    tx = (e.clientX - r.left) * dpr;
    ty = (r.height - (e.clientY - r.top)) * dpr;
    tk = 1;
  }, { passive: true });
  host.addEventListener('pointerleave', () => { tk = 0; });

  function resize() {
    const W = Math.round(canvas.clientWidth * dpr);
    const H = Math.round(canvas.clientHeight * dpr);
    if (canvas.width !== W || canvas.height !== H) {
      canvas.width = W;
      canvas.height = H;
      gl!.viewport(0, 0, W, H);
    }
  }

  function draw(t: number) {
    resize();
    gl!.uniform2f(u.res, canvas.width, canvas.height);
    gl!.uniform1f(u.time, t);
    gl!.uniform2f(u.ptr, px, py);
    gl!.uniform1f(u.ptrK, k);
    gl!.uniform3fv(u.paper, colors.paper);
    gl!.uniform3fv(u.ink, colors.ink);
    gl!.uniform3fv(u.red, colors.red);
    gl!.drawArrays(gl!.TRIANGLES, 0, 3);
  }

  let visible = true;
  let raf = 0;
  let last = 0;
  const t0 = performance.now();

  function frame(now: number) {
    raf = 0;
    if (!visible || document.hidden || reduce.matches) return;
    if (now - last < FRAME_MS) { raf = requestAnimationFrame(frame); return; }
    last = now;
    px += (tx - px) * 0.08;
    py += (ty - py) * 0.08;
    k += (tk - k) * 0.05;
    draw((now - t0) / 1000 + STILL);
    raf = requestAnimationFrame(frame);
  }

  function wake() {
    if (reduce.matches) { draw(STILL); return; }
    if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame);
  }

  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; wake(); }, { threshold: 0 }).observe(canvas);
  document.addEventListener('visibilitychange', wake);
  window.addEventListener('resize', () => { if (reduce.matches) draw(STILL); }, { passive: true });
  dark.addEventListener('change', () => { colors = readColors(); if (reduce.matches) draw(STILL); });
  reduce.addEventListener('change', wake);

  wake();
}
