/**
 * Every figure on the site is the same N points in a different arrangement.
 * Each generator here returns a Float32Array of N * 4 floats: x, y, z, tint.
 * tint 0 is ivory, 1 is the accent, and -1 marks ambient dust.
 *
 * Shapes live in a roughly [-1, 1] box; the engine scales and places them.
 */

const rnd = Math.random;
const J = 0.006; // softening jitter on every sampled point
const jit = () => (rnd() - 0.5) * J;

// --- primitives: each returns [weight, sampler] -------------------------

const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

function line(a, b, t = 0, den = 1) {
  return [
    dist(a, b) * den,
    () => {
      const r = rnd();
      return [
        a[0] + (b[0] - a[0]) * r,
        a[1] + (b[1] - a[1]) * r,
        a[2] + (b[2] - a[2]) * r,
        t,
      ];
    },
  ];
}

// Parallelogram from origin o along edge vectors u and v.
function quad(o, u, v, t = 0, den = 0.5) {
  const area = Math.hypot(...u) * Math.hypot(...v);
  return [
    area * den,
    () => {
      const r = rnd();
      const s = rnd();
      return [
        o[0] + u[0] * r + v[0] * s,
        o[1] + u[1] * r + v[1] * s,
        o[2] + u[2] * r + v[2] * s,
        t,
      ];
    },
  ];
}

function curve(weight, fn) {
  return [weight, () => fn(rnd())];
}

// Closed loop through a list of corners.
function loop(pts, t = 0, den = 1) {
  return pts.map((p, i) => line(p, pts[(i + 1) % pts.length], t, den));
}

function fill(N, prims, { dust = 0.07, spread = [6.5, 4.2, 5] } = {}) {
  const out = new Float32Array(N * 4);
  const nDust = Math.floor(N * dust);
  const n = N - nDust;
  const total = prims.reduce((s, p) => s + p[0], 0);
  let k = 0;
  prims.forEach((p, pi) => {
    let c = pi === prims.length - 1 ? n - k : Math.round((n * p[0]) / total);
    c = Math.max(0, Math.min(c, n - k));
    for (let j = 0; j < c; j++) {
      const v = p[1]();
      out[k * 4] = v[0] + jit();
      out[k * 4 + 1] = v[1] + jit();
      out[k * 4 + 2] = v[2] + jit();
      out[k * 4 + 3] = v[3];
      k++;
    }
  });
  for (; k < N; k++) {
    out[k * 4] = (rnd() - 0.5) * spread[0];
    out[k * 4 + 1] = (rnd() - 0.5) * spread[1];
    out[k * 4 + 2] = (rnd() - 0.5) * spread[2];
    out[k * 4 + 3] = -1;
  }
  return out;
}

// --- text: sample filled glyph pixels from a 2D canvas -------------------

function text(N, lines, { italic = false, accentLast = false } = {}) {
  const size = 220;
  const lead = size * 0.92;
  const font = `${italic ? 'italic ' : ''}400 ${size}px "Instrument Serif", Georgia, serif`;
  const c = document.createElement('canvas');
  const ctx = c.getContext('2d', { willReadFrequently: true });
  ctx.font = font;
  const widths = lines.map((l) => ctx.measureText(l).width);
  const w = Math.ceil(Math.max(...widths)) + 80;
  const h = Math.ceil(lead * lines.length + size * 0.5);
  c.width = w;
  c.height = h;
  ctx.font = font;
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#fff';
  const lastX = [];
  lines.forEach((l, i) => {
    const x = (w - widths[i]) / 2;
    ctx.fillText(l, x, size * 0.95 + i * lead);
    lastX.push(x + widths[i] - ctx.measureText(l.slice(-1)).width);
  });
  const px = ctx.getImageData(0, 0, w, h).data;
  const cells = [];
  let minY = h;
  let maxY = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (px[(y * w + x) * 4 + 3] > 120) {
        cells.push(x, y);
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  const count = cells.length / 2;
  const half = w / 2;
  const midY = (minY + maxY) / 2;
  const lastLineTop = size * 0.95 + (lines.length - 1) * lead - size;
  const prim = [
    1,
    () => {
      const i = Math.floor(rnd() * count) * 2;
      const x = cells[i] + rnd();
      const y = cells[i + 1] + rnd();
      const isLast =
        accentLast && x >= lastX[lines.length - 1] - 2 && y > lastLineTop;
      return [
        (x - half) / half,
        -(y - midY) / half,
        (rnd() - 0.5) * 0.05,
        isLast ? 1 : 0,
      ];
    },
  ];
  const data = fill(N, [prim], { dust: 0.09, spread: [5, 5, 6] });
  return { data, h: (maxY - minY) / 2 / half };
}

// --- figures -------------------------------------------------------------

// The Hopf fibration: circles in S3, stereographically projected. Any two
// of these circles are linked exactly once.
function hopf(N) {
  const rings = [
    [0.5, 6, 0],
    [0.9, 9, 1],
    [1.2, 12, 0],
    [1.45, 14, 0],
  ];
  const prims = rings.map(([theta, fibers, t]) => {
    const a = Math.cos(theta / 2);
    const b = Math.sin(theta / 2);
    return curve(fibers, () => {
      const phi = (Math.floor(rnd() * fibers) / fibers) * Math.PI * 2;
      // Rejection-sample so points are even along each projected circle
      // instead of bunching where the projection compresses it.
      let s;
      let k;
      do {
        s = rnd() * Math.PI * 2;
        k = 1 / (1 - b * Math.sin(s + phi));
      } while (rnd() > k * (1 - b));
      const S = 0.5;
      // y is the axis of the nested tori; tip it toward the viewer.
      const x = a * Math.cos(s) * k * S;
      const y = b * Math.cos(s + phi) * k * S;
      const z = a * Math.sin(s) * k * S;
      return [x, y * 0.82 - z * 0.57, y * 0.57 + z * 0.82, t];
    });
  });
  return fill(N, prims);
}

// An opened envelope with a checklist coming out of it.
function envelope(N) {
  const zf = 0.07;
  const prims = [
    ...loop(
      [
        [-0.9, -0.95, zf],
        [0.9, -0.95, zf],
        [0.9, 0.02, zf],
        [-0.9, 0.02, zf],
      ],
      0,
      1.6
    ),
    line([-0.9, 0.02, zf], [0, -0.48, zf], 0, 1.1),
    line([0.9, 0.02, zf], [0, -0.48, zf], 0, 1.1),
    line([-0.9, -0.95, zf], [-0.2, -0.37, zf], 0, 0.8),
    line([0.9, -0.95, zf], [0.2, -0.37, zf], 0, 0.8),
    quad([-0.9, -0.95, zf], [1.8, 0, 0], [0, 0.97, 0], 0, 0.22),
    // the flap, folded open behind the sheet
    line([-0.9, 0.02, zf], [0, 0.62, -0.22], 0, 0.7),
    line([0.9, 0.02, zf], [0, 0.62, -0.22], 0, 0.7),
    // the sheet
    line([-0.66, 0.02, -0.03], [-0.66, 1.05, -0.03], 0, 1.3),
    line([0.66, 0.02, -0.03], [0.66, 1.05, -0.03], 0, 1.3),
    line([-0.66, 1.05, -0.03], [0.66, 1.05, -0.03], 0, 1.3),
    quad([-0.66, 0.02, -0.03], [1.32, 0, 0], [0, 1.03, 0], 0, 0.12),
  ];
  const rows = [
    [0.86, 0.42, true],
    [0.66, 0.2, true],
    [0.46, 0.5, false],
    [0.26, 0.05, false],
  ];
  rows.forEach(([y, end, done]) => {
    const b = 0.055;
    const x = -0.48;
    prims.push(
      ...loop(
        [
          [x - b, y - b, -0.03],
          [x + b, y - b, -0.03],
          [x + b, y + b, -0.03],
          [x - b, y + b, -0.03],
        ],
        1,
        2.4
      ),
      line([-0.34, y, -0.03], [end, y, -0.03], 0, 2)
    );
    if (done) {
      prims.push(
        line([x - 0.035, y, -0.03], [x - 0.008, y - 0.032, -0.03], 1, 4),
        line([x - 0.008, y - 0.032, -0.03], [x + 0.06, y + 0.06, -0.03], 1, 4)
      );
    }
  });
  return fill(N, prims);
}

// A loaded barbell, with the path the bar travelled traced at each end.
function barbell(N) {
  const Y = 0.28;
  const tube = (x0, x1, r, den) => [
    (x1 - x0) * (0.4 + r * 6) * den,
    () => {
      const a = rnd() * Math.PI * 2;
      return [x0 + (x1 - x0) * rnd(), Y + r * Math.cos(a), r * Math.sin(a), 0];
    },
  ];
  const ringAt = (x, r, den) => [
    r * 6.28 * den,
    () => {
      const a = rnd() * Math.PI * 2;
      return [x, Y + r * Math.cos(a), r * Math.sin(a), 0];
    },
  ];
  const discAt = (x, r, den) => [
    r * r * 3.14 * den,
    () => {
      const a = rnd() * Math.PI * 2;
      const q = r * Math.sqrt(rnd());
      return [x, Y + q * Math.cos(a), q * Math.sin(a), 0];
    },
  ];
  const prims = [tube(-1.3, 1.3, 0.02, 2.2)];
  for (const s of [-1, 1]) {
    const plate = (x, r, th) => {
      const a = s * x;
      const b = s * (x + th);
      prims.push(
        tube(Math.min(a, b), Math.max(a, b), r, 0.25),
        ringAt(a, r, 1.2),
        ringAt(b, r, 1.2),
        ringAt(a, r * 0.8, 0.5),
        ringAt(b, r * 0.8, 0.5),
        ringAt(a, r * 0.3, 0.6),
        ringAt(b, r * 0.3, 0.6),
        discAt(a, r, 0.12),
        discAt(b, r, 0.12)
      );
    };
    plate(0.74, 0.46, 0.07);
    plate(0.84, 0.46, 0.07);
    plate(0.94, 0.34, 0.05);
    plate(1.02, 0.12, 0.06);
    prims.push(tube(Math.min(s * 0.7, s * 1.3), Math.max(s * 0.7, s * 1.3), 0.05, 0.6));
    // bar path: a slightly looping vertical trace down to the floor
    prims.push(
      curve(1.5, (r) => {
        const y = Y - r * 1.2;
        return [s * 1.34, y, 0.1 * Math.sin(r * Math.PI) + 0.03 * Math.sin(r * 9), 1];
      }),
      curve(1.1, (r) => {
        const y = Y - r * 1.2;
        return [s * 1.34, y, -0.05 * Math.sin(r * Math.PI), 1];
      })
    );
  }
  // platform
  const F = Y - 1.2;
  prims.push(
    ...loop(
      [
        [-1.45, F, -0.6],
        [1.45, F, -0.6],
        [1.45, F, 0.6],
        [-1.45, F, 0.6],
      ],
      0,
      0.5
    ),
    quad([-1.45, F, -0.6], [2.9, 0, 0], [0, 0, 1.2], 0, 0.08)
  );
  return fill(N, prims);
}

// A structural model of a building with three bays flagged.
function building(N) {
  const xs = [-0.6, -0.2, 0.2, 0.6];
  const zs = [-0.45, 0, 0.45];
  const ys = [-1, -0.6, -0.2, 0.2, 0.6, 1];
  const prims = [];
  for (const x of xs) for (const z of zs) prims.push(line([x, -1, z], [x, 1, z], 0, 1));
  ys.forEach((y) => {
    for (const x of xs) prims.push(line([x, y, zs[0]], [x, y, zs[2]], 0, 0.8));
    for (const z of zs) prims.push(line([xs[0], y, z], [xs[3], y, z], 0, 0.8));
    prims.push(quad([xs[0], y, zs[0]], [1.2, 0, 0], [0, 0, 0.9], 0, 0.3));
  });
  // site grid
  for (let i = -3; i <= 3; i++) {
    prims.push(
      line([i * 0.4, -1, -1.1], [i * 0.4, -1, 1.1], 0, 0.14),
      line([-1.2, -1, i * 0.36], [1.2, -1, i * 0.36], 0, 0.14)
    );
  }
  // flagged bays: [x index, z index, floor]
  for (const [ix, iz, f] of [
    [0, 1, 1],
    [2, 0, 3],
    [1, 1, 4],
  ]) {
    const x0 = xs[ix];
    const x1 = xs[ix + 1];
    const z0 = zs[iz];
    const z1 = zs[iz + 1];
    const y0 = ys[f];
    const y1 = ys[f + 1];
    for (const y of [y0, y1]) {
      prims.push(
        ...loop(
          [
            [x0, y, z0],
            [x1, y, z0],
            [x1, y, z1],
            [x0, y, z1],
          ],
          1,
          2.2
        )
      );
    }
    for (const x of [x0, x1])
      for (const z of [z0, z1]) prims.push(line([x, y0, z], [x, y1, z], 1, 2.2));
    prims.push([
      0.5,
      () => [x0 + (x1 - x0) * rnd(), y0 + (y1 - y0) * rnd(), z0 + (z1 - z0) * rnd(), 1],
    ]);
  }
  return fill(N, prims);
}

// An open book, with a voice rising off the page.
function book(N) {
  const tilt = 1.02;
  const ct = Math.cos(tilt);
  const st = Math.sin(tilt);
  const D = 0.66;
  const P = (s, u, v, lift = 0, t = 0) => {
    const x = s * u * 0.98;
    const y = 0.15 * Math.pow(Math.sin(u * Math.PI), 0.8) * (1 - 0.35 * u) + lift;
    return [x, y * ct - v * st - 0.3, y * st + v * ct, t];
  };
  const prims = [];
  for (const s of [-1, 1]) {
    prims.push(
      curve(1.3, (r) => P(s, r, -D)),
      curve(1.3, (r) => P(s, r, D)),
      curve(1.5, (r) => P(s, 1, (r * 2 - 1) * D)),
      curve(0.9, (r) => P(s, 0, (r * 2 - 1) * D)),
      curve(0.9, () => P(s, rnd(), (rnd() * 2 - 1) * D))
    );
    for (let k = 1; k <= 3; k++) {
      prims.push(
        curve(0.5, (r) => P(s, 1 + k * 0.012, (r * 2 - 1) * D, -k * 0.022)),
        curve(0.4, (r) => P(s, r * (1 + k * 0.012), D, -k * 0.022))
      );
    }
    // lines of type; the last line of each page stops short
    for (let i = 0; i < 12; i++) {
      const v = -D + 0.12 + i * 0.1;
      const end = i === 11 ? 0.5 : 0.9;
      prims.push(curve(0.75, (r) => P(s, 0.13 + r * (end - 0.13), v)));
    }
  }
  // the voice
  for (let k = 0; k < 3; k++) {
    prims.push(
      curve(1.6 - k * 0.3, (r) => {
        const x = (r * 2 - 1) * 0.95;
        const env = Math.exp(-x * x * 2.6);
        return [
          x,
          0.74 + k * 0.035 + (0.2 - k * 0.05) * env * Math.sin(x * (30 + k * 9) + k * 2),
          -0.25 - k * 0.12,
          1,
        ];
      })
    );
  }
  return fill(N, prims);
}

// 1,500 emails: a 50 by 30 sheet, one square per email.
function emails(N) {
  const cols = 50;
  const rows = 30;
  const pitch = 0.054;
  const side = 0.03;
  const lit = new Uint8Array(cols * rows);
  for (let i = 0; i < lit.length; i++) lit[i] = rnd() < 0.3 ? 1 : 0;
  let j = 0;
  const prim = [
    1,
    () => {
      const cell = j++ % (cols * rows);
      const cx = ((cell % cols) - (cols - 1) / 2) * pitch;
      const cy = (Math.floor(cell / cols) - (rows - 1) / 2) * pitch;
      const x = cx + (rnd() - 0.5) * side;
      const y = cy + (rnd() - 0.5) * side;
      const z = 0.16 * Math.sin(cx * 2.6 + cy * 1.9) + 0.08 * Math.cos(cy * 4.2 - cx);
      return [x, y, z + (lit[cell] ? 0.03 : 0), lit[cell]];
    },
  ];
  return fill(N, [prim]);
}

/**
 * Builds every arrangement. `portrait` breaks the name onto two lines.
 * Returns a map of name -> { data, h?, kind }.
 */
export function makeShapes(N, portrait) {
  const name = text(N, portrait ? ['Paul', 'Tomasheski'] : ['Paul Tomasheski']);
  const hello = text(N, ['hello.'], { italic: true, accentLast: true });
  return {
    name: { ...name, kind: 'text' },
    hopf: { data: hopf(N), kind: 'spin' },
    envelope: { data: envelope(N), kind: 'sway' },
    barbell: { data: barbell(N), kind: 'spin', fit: 0.8 },
    building: { data: building(N), kind: 'spin', fit: 0.95 },
    book: { data: book(N), kind: 'sway' },
    emails: { data: emails(N), kind: 'sway', fit: 0.74 },
    hello: { ...hello, kind: 'text' },
  };
}
