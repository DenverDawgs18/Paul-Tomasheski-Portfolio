import { makeShapes } from './shapes.js';

/**
 * The field: one buffer of points, drawn in one call, morphed between
 * arrangements by scroll position. No libraries; plain WebGL 1.
 */

const FOV = (35 * Math.PI) / 180;
const CAM = 5;
const F = 1 / Math.tan(FOV / 2);
const VIEW_H = (2 * CAM) / F; // world height visible at z = 0

const VERT = `
precision highp float;
attribute vec4 aA;
attribute vec4 aB;
attribute vec4 aR;
uniform float uMix, uTime, uIntro, uSwirl, uAspect, uSize, uRx, uHover, uShockT;
uniform vec4 uTA, uTB;      // x, y, scale, rotY
uniform vec2 uMouse, uShock;
varying float vAlpha;
varying float vTint;

vec3 place(vec3 p, vec4 T) {
  float c = cos(T.w), s = sin(T.w);
  p = vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z);
  float cx = cos(uRx), sx = sin(uRx);
  p = vec3(p.x, cx * p.y - sx * p.z, sx * p.y + cx * p.z);
  return p * T.z + vec3(T.xy, 0.0);
}

void main() {
  // each point leaves on its own schedule
  float t = clamp((uMix - aR.x * 0.45) / 0.55, 0.0, 1.0);
  t = t * t * (3.0 - 2.0 * t);

  vec3 p = mix(place(aA.xyz, uTA), place(aB.xyz, uTB), t);

  // in transit, the cloud winds up around its own axis and breathes out
  float bump = sin(t * 3.14159265) * uSwirl;
  vec3 c = vec3(mix(uTA.xy, uTB.xy, t), 0.0);
  vec3 q = p - c;
  float ang = bump * (1.0 + aR.y * 2.6);
  float ca = cos(ang), sa = sin(ang);
  q = vec3(ca * q.x + sa * q.z, q.y + bump * (aR.w - 0.5) * 1.3, -sa * q.x + ca * q.z);
  q *= 1.0 + bump * (0.25 + aR.z * 0.9);
  p = c + q;

  // idle shimmer
  p += 0.011 * vec3(
    sin(uTime * 0.7 + aR.y * 40.0),
    cos(uTime * 0.6 + aR.z * 40.0),
    sin(uTime * 0.5 + aR.w * 40.0));

  // arrival: the points start as a loose cloud and settle
  vec3 far = (aR.yzw - 0.5) * vec3(10.0, 6.5, 9.0);
  float it = clamp(uIntro * 1.7 - aR.x * 0.7, 0.0, 1.0);
  it = 1.0 - pow(1.0 - it, 3.0);
  p = mix(far, p, it);

  float w = ${CAM.toFixed(1)} - p.z;
  vec2 ndc = vec2(p.x * ${F.toFixed(5)} / uAspect, p.y * ${F.toFixed(5)}) / w;
  vec2 asp = vec2(uAspect, 1.0);

  // the pointer pushes points aside
  vec2 d = (ndc - uMouse) * asp;
  float dl = length(d);
  ndc += (d / (dl + 1e-4)) / asp * exp(-dl * dl / 0.022) * uHover * 0.11 * (0.35 + aR.z);

  // a click sends a ring through the field
  vec2 ds = (ndc - uShock) * asp;
  float l = length(ds);
  float ring = exp(-pow(l - uShockT * 2.4, 2.0) / 0.012) * (1.0 - uShockT);
  ndc += (ds / (l + 1e-4)) / asp * ring * 0.16;

  gl_Position = vec4(ndc, 0.0, 1.0);

  float tint = mix(aA.w, aB.w, t);
  float dust = step(tint, -0.5);
  float coc = abs(p.z) * 0.55 + dust * 0.4;
  gl_PointSize = max(uSize * (0.7 + aR.w * 0.8) * (1.0 + coc * 2.4 + dust * 1.5) / w, 1.2);
  vAlpha = (0.46 - dust * 0.22) / (1.0 + coc * coc * 7.0 + dust * 1.2) * min(it * 1.5, 1.0);
  vTint = max(max(tint, 0.0), bump * 0.4 * aR.y);
}`;

const FRAG = `
precision mediump float;
varying float vAlpha;
varying float vTint;
void main() {
  float r = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.1, r) * vAlpha;
  vec3 col = mix(vec3(0.97, 0.93, 0.85), vec3(1.0, 0.33, 0.14), vTint);
  gl_FragColor = vec4(col * a, 1.0);
}`;

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(s));
  }
  return s;
}

/** Where the reader is, as a fractional scene index. */
export function measure(sections) {
  const y = window.scrollY + window.innerHeight / 2;
  const mid = (el) => el.offsetTop + el.offsetHeight / 2;
  const last = sections.length - 1;
  if (y <= mid(sections[0])) return 0;
  for (let i = 0; i < last; i++) {
    const a = mid(sections[i]);
    const b = mid(sections[i + 1]);
    if (y < b) return i + (y - a) / (b - a);
  }
  return last;
}

export async function createField(canvas, sections, { reduced = false } = {}) {
  const gl = canvas.getContext('webgl', {
    antialias: false,
    alpha: false,
    powerPreference: 'high-performance',
  });
  if (!gl) return null;

  const small = Math.min(window.innerWidth, window.innerHeight) < 700;
  const N = small ? 32000 : 60000;

  const prog = gl.createProgram();
  gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);

  const U = {};
  for (const n of [
    'uMix', 'uTime', 'uIntro', 'uSwirl', 'uAspect', 'uSize', 'uRx',
    'uHover', 'uShockT', 'uTA', 'uTB', 'uMouse', 'uShock',
  ]) {
    U[n] = gl.getUniformLocation(prog, n);
  }
  const loc = {
    aA: gl.getAttribLocation(prog, 'aA'),
    aB: gl.getAttribLocation(prog, 'aB'),
    aR: gl.getAttribLocation(prog, 'aR'),
  };

  const seeds = new Float32Array(N * 4);
  for (let i = 0; i < seeds.length; i++) seeds[i] = Math.random();
  const seedBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, seedBuf);
  gl.bufferData(gl.ARRAY_BUFFER, seeds, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(loc.aR);
  gl.vertexAttribPointer(loc.aR, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(loc.aA);
  gl.enableVertexAttribArray(loc.aB);

  gl.disable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE);
  gl.clearColor(0.035, 0.033, 0.03, 1);

  // The name is set in Instrument Serif; wait for it so the glyphs sampled
  // are the right ones.
  try {
    await Promise.all([
      document.fonts.load('400 220px "Instrument Serif"'),
      document.fonts.load('italic 400 220px "Instrument Serif"'),
    ]);
  } catch {
    /* fall back to whatever serif is there */
  }

  const scenes = sections.map((el) => ({
    key: el.dataset.shape,
    side: el.dataset.side || 'center',
  }));

  let W = 1;
  let H = 1;
  let aspect = 1;
  let portrait = false;
  let shapes = null;
  const buffers = {};

  function buildShapes() {
    shapes = makeShapes(N, portrait);
    for (const [key, s] of Object.entries(shapes)) {
      if (!buffers[key]) buffers[key] = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers[key]);
      gl.bufferData(gl.ARRAY_BUFFER, s.data, gl.STATIC_DRAW);
    }
    bound = -1;
  }

  let bound = -1;
  function bind(i) {
    if (bound === i) return;
    bound = i;
    const j = Math.min(i + 1, scenes.length - 1);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers[scenes[i].key]);
    gl.vertexAttribPointer(loc.aA, 4, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers[scenes[j].key]);
    gl.vertexAttribPointer(loc.aB, 4, gl.FLOAT, false, 0, 0);
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
    aspect = W / H;
    gl.uniform1f(U.uAspect, aspect);
    // world size -> pixels; slightly larger points when there are fewer
    gl.uniform1f(U.uSize, 0.0062 * (small ? 0.85 : 1) * F * (canvas.height / 2));
    const p = aspect < 0.9;
    if (p !== portrait || !shapes) {
      portrait = p;
      buildShapes();
    }
  }

  // Where a scene's figure sits, and how large.
  function placement(i, time, mx) {
    const sc = scenes[i];
    const s = shapes[sc.key];
    const vw = VIEW_H * aspect;
    let x = 0;
    let y = 0;
    let scale;
    if (s.kind === 'text') {
      const hero = i === 0;
      scale = Math.min(vw * (portrait ? 0.43 : 0.4), (VIEW_H * (hero ? 0.2 : 0.13)) / s.h);
      y = VIEW_H * (hero ? 0.07 : portrait ? 0.25 : 0.22);
    } else if (portrait) {
      scale = Math.min(vw * 0.36, VIEW_H * 0.125) * (s.fit || 1);
      y = VIEW_H * 0.3;
    } else {
      scale = Math.min(vw * 0.2, VIEW_H * 0.31) * (s.fit || 1);
      x = vw * 0.23 * (sc.side === 'left' ? 1 : -1);
    }
    let ry = mx * 0.35;
    if (!reduced) {
      if (s.kind === 'spin') ry += time * 0.22 + i;
      else if (s.kind === 'sway') ry += Math.sin(time * 0.45 + i) * 0.5;
      else ry += Math.sin(time * 0.3) * 0.1;
    } else if (s.kind !== 'text') {
      ry += 0.5;
    }
    return [x, y, scale, ry];
  }

  // --- input ---
  const mouse = { x: 0, y: 0, tx: 0, ty: 0, hover: 0, thover: 0 };
  let shock = { x: 0, y: 0, t0: -10 };
  const toNdc = (e) => [(e.clientX / W) * 2 - 1, -((e.clientY / H) * 2 - 1)];
  const onMove = (e) => {
    [mouse.tx, mouse.ty] = toNdc(e);
    mouse.thover = e.pointerType === 'touch' ? 0 : 1;
  };
  const onLeave = () => {
    mouse.thover = 0;
  };
  const onDown = (e) => {
    if (reduced) return;
    const [x, y] = toNdc(e);
    shock = { x, y, t0: performance.now() / 1000 };
  };
  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('pointerdown', onDown, { passive: true });
  document.documentElement.addEventListener('pointerleave', onLeave);
  window.addEventListener('resize', resize);

  resize();

  let progress = measure(sections);
  let raf = 0;
  let last = performance.now();
  const start = last;
  let visible = true;
  const onVis = () => {
    visible = !document.hidden;
    if (visible) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  };
  document.addEventListener('visibilitychange', onVis);

  function frame(now) {
    if (!visible) return;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    const time = (now - start) / 1000;
    const k = 1 - Math.exp(-dt * 7);

    const target = measure(sections);
    progress += (target - progress) * (reduced ? 1 : k);
    mouse.x += (mouse.tx - mouse.x) * k;
    mouse.y += (mouse.ty - mouse.y) * k;
    mouse.hover += (mouse.thover - mouse.hover) * k * 0.6;

    const i = Math.min(Math.floor(progress), scenes.length - 1);
    const f = progress - i;
    // hold each figure while its section is centred, morph in between
    const m = Math.min(Math.max((f - 0.18) / 0.64, 0), 1);
    bind(i);

    const j = Math.min(i + 1, scenes.length - 1);
    gl.uniform4fv(U.uTA, placement(i, time, mouse.x));
    gl.uniform4fv(U.uTB, placement(j, time, mouse.x));
    gl.uniform1f(U.uMix, m);
    gl.uniform1f(U.uTime, reduced ? 0 : time);
    gl.uniform1f(U.uIntro, reduced ? 1 : Math.min(time / 2.6, 1));
    gl.uniform1f(U.uSwirl, reduced ? 0 : 1);
    gl.uniform1f(U.uRx, -mouse.y * 0.18);
    gl.uniform1f(U.uHover, reduced ? 0 : mouse.hover);
    gl.uniform2f(U.uMouse, mouse.x, mouse.y);
    gl.uniform2f(U.uShock, shock.x, shock.y);
    gl.uniform1f(U.uShockT, Math.min((now / 1000 - shock.t0) / 1.4, 1));

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, N);
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);

  return {
    count: N,
    destroy() {
      cancelAnimationFrame(raf);
      visible = false;
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVis);
    },
  };
}
