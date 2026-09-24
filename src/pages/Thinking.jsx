import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './Thinking.css';

// ---------------------------------------------------------------------------
// Ported from the design handoff's Thinking.dc.html — "My Brain", the
// pond-plan connection board. Twelve lily-pad nodes; pick two and a pixel
// koi swims the route between them, leaving a circulation line and (if the
// pair connects) a keynote tag in the title block. Canvas/simulation code is
// moved near-verbatim per the handoff's porting guidance; only the
// componentDidMount/WillUnmount/state plumbing is adapted to hooks.
// ---------------------------------------------------------------------------

const NODES = [
  { id: 'mind', label: 'A wandering mind', g: '🌀', x: 50, y: 50, r: 10 },
  { id: 'chalk', label: 'Crayons & chalk', g: '🖍', x: 17, y: 19, r: 6 },
  { id: 'child', label: 'Childlike aesthetic', g: '🧸', x: 39, y: 15, r: 6 },
  { id: 'org', label: 'Organisation', g: '🗂', x: 64, y: 17, r: 7 },
  { id: 'edu', label: 'Education', g: '🎓', x: 85, y: 25, r: 6 },
  { id: 'trans', label: 'Transparency', g: '👁', x: 73, y: 45, r: 6 },
  { id: 'prod', label: 'Productivity', g: '⏱', x: 87, y: 60, r: 7 },
  { id: 'mus', label: 'Music', g: '🎵', x: 74, y: 80, r: 6 },
  { id: 'art', label: 'Art', g: '🎨', x: 51, y: 83, r: 7 },
  { id: 'rel', label: 'Relationship', g: '🤝', x: 28, y: 80, r: 6 },
  { id: 'soc', label: 'Sociability', g: '💬', x: 13, y: 63, r: 6 },
  { id: 'a11y', label: 'Accessibility', g: '♿', x: 25, y: 41, r: 6 },
];
const TOTAL = NODES.length * (NODES.length - 1) / 2;
const key = (a, b) => [a, b].sort().join('+');

const ANSWERS = {
  'mind+org': { t: 'Stuff', p: 'STUFF', b: "A wandering mind needs a system that forgives it. Stuff is organisation built for a mind that drifts: it holds the context, so you don't have to hold everything yourself.", href: 'Stuff - case study.dc.html', cta: 'Open the Stuff case study' },
  'edu+mus': { t: 'Maable', p: 'MAABLE', b: "Learning an instrument falls apart on the days you don't turn up. Maable is built around coming back rather than never missing: rhythm over streaks, and returning over guilt.", href: 'Maable - case study.dc.html', cta: 'Open the Maable case study' },
  'art+mind': { t: 'This portfolio', p: 'MAEHLO', b: "I've been oddly fixated on koi lately, and I've always loved architecture, so I designed around both. Architecture on its own felt too polished, so I brought in pixels and 90s game energy to rough it up.", href: 'Maehlo - case study.dc.html', cta: 'Open the Maehlo case study' },
  'mind+prod': { t: 'Productivity for minds that wander', b: 'Most tools assume steady, even focus. Minds like mine work in bursts, drift off and come back. I design for the burst and the return, not for the ideal day.' },
  'edu+mind': { t: 'Curiosity is the curriculum', b: "A wandering mind learns fastest when it's chasing something it genuinely cares about. So I start with the interest and build the lesson around it, not the other way round." },
  'child+mind': { t: 'Play holds attention', b: "A childlike aesthetic isn't about being childish. It lowers the stakes, and when the stakes are low, curiosity is free to roam." },
  'chalk+child': { t: 'Nothing in chalk is final', b: 'A crayon or chalk mark invites another go. I want interfaces to feel just as forgiving: try it, rub it out, and try again.' },
  'chalk+edu': { t: 'The blackboard', b: "The classroom's oldest interface is still one of its best. It's large, shared, visible to everyone, and wiped clean every day." },
  'art+chalk': { t: 'Rough on purpose', b: 'A crayon line does the same job as the pixels on this site. It works against polish, so the work feels as though a person made it.' },
  'a11y+mind': { t: 'Designing for the brain I have', b: "What I need, fewer choices, visible state and a forgiving undo, isn't an edge case. Build those in and the product becomes calmer for everyone." },
  'a11y+trans': { t: 'Show the state', b: 'The most accessible thing an interface can do is tell you where you are and what just happened. Hidden state is the first thing a wandering mind loses track of.' },
  'org+trans': { t: 'Organisation you can see', b: "If a system hides its structure, it's hard to trust. The best organisation is readable at a glance, like looking down at a plan." },
  'prod+trans': { t: 'No hidden progress', b: "Show what's been done, not just what's due. Seeing your progress is what brings a drifting mind back." },
  'rel+soc': { t: 'People come back for people', b: 'Features might get an app opened once. What brings you back is knowing someone else is there too.' },
  'rel+trans': { t: 'Trust you can read', b: 'Relationships, with people or with products, depend on knowing what the other side is doing. Transparency is how a tool earns its place in your day.' },
  'mus+soc': { t: 'Playing together', b: 'Music is the most social thing I do. Playing with other people teaches you to listen before you add anything of your own.' },
  'art+mus': { t: 'The same muscle', b: 'Composing a picture and composing a song ask the same question: what comes next, and what can I leave out?' },
  'child+edu': { t: 'Learning should feel like play', b: 'Things made for children are designed around curiosity first. Most tools for adults seem to have forgotten that along the way.' },
  'org+prod': { t: 'A list with opinions', b: "Every productivity app is really a list with opinions. Getting a single item right, what it is, when it matters and who it's for, is harder than all the interface around it." },
  'a11y+edu': { t: 'Everyone in the room', b: "If a lesson only works for one kind of attention, it isn't finished yet." },
  'mus+prod': { t: 'Tempo as a timer', b: "A metronome is the kindest productivity tool there is. It doesn't judge you; it simply keeps time until you fall back in." },
  'art+child': { t: 'Drawing before I knew better', b: 'The drawings I made before I learnt the rules were the bravest ones. I try to design from there first, and bring the rules in afterwards.' },
};
const OPEN_NOTE = [
  "Nothing yet. I haven't spent enough time with these two together.",
  "No line yet. I can sense one, but I'd only be making it up.",
  'Blank for now. Worth returning to once I\'ve made something with both.',
  "Nothing here. Some pairs simply don't owe each other anything.",
];

// prototype file → app route, per the handoff's route table. ANSWERS above
// stays verbatim (still points at the .dc.html filenames); only the
// link-rendering layer translates it, per the README's own instruction.
const HREF_MAP = {
  'Stuff - case study.dc.html': '/work/stuff',
  'Maable - case study.dc.html': '/work/maable',
  'Maehlo - case study.dc.html': '/work/maehlo',
};

const PX = 4;
const INK = '#141414', GREY = '#9b978f', LIGHT = '#dad7d0', WHITE = '#ffffff', PINK = '#efdcdc', PINK2 = '#dcbcbc';
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const LILY = ['....X.X....', '...XoXoX...', '.X.XoooX.X.', 'XoXXoooXXoX', '.XoooyoooX.', '..XoyoyoX..', '...XXXXX...'];
const LILY_ON = [3, 7, 9];
const KOI = [
  ['X.......XXXX....', 'XX....XXXXXXXX..', '.XX.XXXooXXXXXX.', '..XXXXXXoooXX.XX', '.XX.XXXXooXXXXX.', 'XX....XXXXXXXX..', 'X.......XXXX....'],
  ['........XXXX....', 'X.....XXXXXXXX..', 'XXX.XXXooXXXXX..', '.XXXXXXXoooXX...', 'XXX.XXXXooXXXX..', 'X.....XXXXXXXX..', '........XXXX....'],
];
const FISH_R = [2.0, 2.5, 2.5, 2.2, 1.8, 1.4, 1.0, 0.7];

const F3 = {
  '0': ['XXX', 'X.X', 'X.X', 'X.X', 'XXX'], '1': ['.X.', 'XX.', '.X.', '.X.', 'XXX'], '2': ['XXX', '..X', 'XXX', 'X..', 'XXX'],
  '3': ['XXX', '..X', '.XX', '..X', 'XXX'], '4': ['X.X', 'X.X', 'XXX', '..X', '..X'], '5': ['XXX', 'X..', 'XXX', '..X', 'XXX'],
  '6': ['XXX', 'X..', 'XXX', 'X.X', 'XXX'], '7': ['XXX', '..X', '.X.', '.X.', '.X.'], '8': ['XXX', 'X.X', 'XXX', 'X.X', 'XXX'],
  '9': ['XXX', 'X.X', 'XXX', '..X', 'XXX'], ' ': ['...', '...', '...', '...', '...'], ':': ['...', '.X.', '...', '.X.', '...'],
  '-': ['...', '...', 'XXX', '...', '...'], '?': ['XXX', '..X', '.X.', '...', '.X.'],
  A: ['.X.', 'X.X', 'XXX', 'X.X', 'X.X'], B: ['XX.', 'X.X', 'XX.', 'X.X', 'XX.'], C: ['.XX', 'X..', 'X..', 'X..', '.XX'],
  D: ['XX.', 'X.X', 'X.X', 'X.X', 'XX.'], E: ['XXX', 'X..', 'XX.', 'X..', 'XXX'], F: ['XXX', 'X..', 'XX.', 'X..', 'X..'],
  G: ['.XX', 'X..', 'X.X', 'X.X', '.XX'], H: ['X.X', 'X.X', 'XXX', 'X.X', 'X.X'], I: ['XXX', '.X.', '.X.', '.X.', 'XXX'],
  L: ['X..', 'X..', 'X..', 'X..', 'XXX'], M: ['X.X', 'XXX', 'XXX', 'X.X', 'X.X'], N: ['X.X', 'XXX', 'XXX', 'XXX', 'X.X'],
  O: ['XXX', 'X.X', 'X.X', 'X.X', 'XXX'], P: ['XX.', 'X.X', 'XX.', 'X..', 'X..'], R: ['XX.', 'X.X', 'XX.', 'X.X', 'X.X'],
  S: ['.XX', 'X..', '.X.', '..X', 'XX.'], T: ['XXX', '.X.', '.X.', '.X.', '.X.'], W: ['X.X', 'X.X', 'X.X', 'XXX', 'X.X'],
};
function ptext(c, s, x, y) {
  for (const ch of s) {
    const g = F3[ch] || F3[' '];
    for (let r = 0; r < 5; r++) for (let q = 0; q < 3; q++) if (g[r][q] === 'X') c.fillRect(x + q, y + r, 1, 1);
    x += 4;
  }
}
const wrapA = (a) => { while (a > Math.PI) a -= Math.PI * 2; while (a < -Math.PI) a += Math.PI * 2; return a; };
const ease = (u) => u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;

class Board {
  constructor(getState, setState) {
    this._getState = getState;
    this._setState = setState;
  }
  get state() { return this._getState(); }
  setState(patch) { this._setState(patch); }

  mount() {
    try { sessionStorage.setItem('mh-from', 'thinking'); } catch (_) { /* private mode */ }
    this.calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.off = document.createElement('canvas');
    this.off.width = 128; this.off.height = 72;
    this.t0 = performance.now();
    this.rings = [];
    this.trip = null;
    this.amb = null;
    this.hover = null;
    this._iv = setInterval(() => { this.frame(); this.detail(); }, 50);
    this._mv = (e) => {
      const f = document.getElementById('field');
      if (!f) return;
      const r = f.getBoundingClientRect();
      this.mouse = [(e.clientX - r.left) / PX, (e.clientY - r.top) / PX];
    };
    this._dn = (e) => {
      const f = document.getElementById('field');
      if (!f || !f.contains(e.target)) return;
      const r = f.getBoundingClientRect();
      this.rings.push({ x: (e.clientX - r.left) / PX, y: (e.clientY - r.top) / PX, t: 0, r1: 14 });
    };
    this._key = (e) => { if (e.key === 'Escape' && this.state.sel != null) this.setState({ sel: null }); };
    window.addEventListener('pointermove', this._mv, { passive: true });
    window.addEventListener('pointerdown', this._dn);
    window.addEventListener('keydown', this._key);
    let inv = false;
    try { inv = localStorage.getItem('mh-invert') === '1'; } catch (_) { /* private mode */ }
    if (inv !== this.state.inv) this.setState({ inv });
    this.enter();
  }

  unmount() {
    clearInterval(this._iv);
    window.removeEventListener('pointermove', this._mv);
    window.removeEventListener('pointerdown', this._dn);
    window.removeEventListener('keydown', this._key);
  }

  // page-enter pixel dissolve-in, opposite of the pond's door-warp dissolve-out
  enter() {
    const cv = document.getElementById('enterPix');
    if (!cv) return;
    if (this.calm) { cv.style.display = 'none'; return; }
    const P = 8, cw = Math.ceil(window.innerWidth / P), ch = Math.ceil(window.innerHeight / P);
    cv.width = cw; cv.height = ch;
    cv.style.width = cw * P + 'px'; cv.style.height = ch * P + 'px';
    const c = cv.getContext('2d'), t0 = performance.now();
    const iv = setInterval(() => {
      const u = (performance.now() - t0) / 600;
      c.clearRect(0, 0, cw, ch);
      c.fillStyle = WHITE;
      for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) {
        if ((BAYER[(y & 3) * 4 + (x & 3)] / 16) * 0.6 + (y / ch) * 0.4 >= u) c.fillRect(x, y, 1, 1);
      }
      if (u >= 1) { clearInterval(iv); cv.style.display = 'none'; }
    }, 33);
  }

  // --- the plan ------------------------------------------------------------
  pondN(x, y) {
    const dx = (x - this.pcx) / this.prx, dy = (y - this.pcy) / this.pry;
    const th = Math.atan2(dy, dx);
    const base = Math.pow(dx * dx * dx * dx + dy * dy * dy * dy, 0.25);
    return base / (1 + 0.035 * Math.sin(3 * th + 0.6) + 0.025 * Math.sin(5 * th + 2));
  }

  // Everything that never moves is drawn once per size into a sheet:
  // hatched ground, the pond's edge and coping, structural gridlines with
  // their bubbles, a dimension string, north arrow and the drawing title.
  build() {
    const f = document.getElementById('field'), cv = document.getElementById('fieldCv');
    if (!f || !cv) return false;
    const w = f.clientWidth, h = f.clientHeight;
    if (!w || !h) return false;
    const cw = Math.ceil(w / PX), ch = Math.ceil(h / PX);
    if (this.cw === cw && this.ch === ch && this.sheet && cv.width === cw) return true;
    this.cw = cw; this.ch = ch;
    cv.width = cw; cv.height = ch;
    cv.style.width = cw * PX + 'px'; cv.style.height = ch * PX + 'px';
    this.pcx = cw * 0.5; this.pcy = ch * 0.5; this.prx = cw * 0.47; this.pry = ch * 0.44;
    const s = this.sheet = document.createElement('canvas');
    s.width = cw; s.height = ch;
    const c = s.getContext('2d');
    c.fillStyle = WHITE; c.fillRect(0, 0, cw, ch);
    const N = new Float32Array(cw * ch);
    for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) N[y * cw + x] = this.pondN(x + 0.5, y + 0.5);
    this.N = N;
    const band = 1.3 / Math.min(this.prx, this.pry);
    for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) {
      const n = N[y * cw + x];
      if (n >= 1) {
        const out = (x > 0 && N[y * cw + x - 1] < 1) || (x < cw - 1 && N[y * cw + x + 1] < 1) ||
          (y > 0 && N[(y - 1) * cw + x] < 1) || (y < ch - 1 && N[(y + 1) * cw + x] < 1);
        if (out) { c.fillStyle = INK; c.fillRect(x, y, 1, 1); continue; }
        if (n >= 1.04 && n < 1.04 + band && ((x + y) & 3) < 2) { c.fillStyle = INK; c.fillRect(x, y, 1, 1); continue; }
        if (n >= 1.04 + band && (x - y + 6000) % 6 === 0) { c.fillStyle = LIGHT; c.fillRect(x, y, 1, 1); }
      } else if (x % 8 === 4 && y % 8 === 4) { c.fillStyle = LIGHT; c.fillRect(x, y, 1, 1); }
    }
    // structural gridlines A–F along the top, 1–4 down the side
    const cols = 'ABCDEF', rows = '1234';
    for (let i = 0; i < cols.length; i++) {
      const gx = Math.round(cw * (i + 1) / (cols.length + 1));
      c.fillStyle = LIGHT;
      for (let y = 12; y < ch - 10; y += 3) c.fillRect(gx, y, 1, 1);
      this.bubble(c, gx, 6, cols[i]);
    }
    for (let j = 0; j < rows.length; j++) {
      const gy = Math.round(ch * (j + 1) / (rows.length + 1));
      c.fillStyle = LIGHT;
      for (let x = 12; x < cw - 10; x += 3) c.fillRect(x, gy, 1, 1);
      this.bubble(c, 6, gy, rows[j]);
    }
    c.fillStyle = INK;
    const hy = ch - 4, hx0 = Math.round(cw * 0.12), hx1 = Math.round(cw * 0.88);
    c.fillRect(hx0, hy, hx1 - hx0, 1); c.fillRect(hx0, hy - 2, 1, 5); c.fillRect(hx1, hy - 2, 1, 5);
    const lab = '12 000', lx = Math.round((hx0 + hx1) / 2 - 12);
    c.fillStyle = WHITE; c.fillRect(lx - 2, hy - 3, 27, 7);
    c.fillStyle = INK; ptext(c, lab, lx, hy - 2);
    const nx = cw - 9, ny = 14;
    for (let r = 0; r < 8; r++) c.fillRect(nx - Math.floor(r / 2), ny + r, Math.floor(r / 2) * 2 + 1, 1);
    ptext(c, 'N', nx - 1, ny + 10);
    ptext(c, 'POND PLAN - HOW THE PARTS CONNECT', 14, ch - 13);
    return true;
  }

  bubble(c, x, y, ch) {
    for (let yy = -3; yy <= 3; yy++) for (let xx = -3; xx <= 3; xx++) {
      const d = xx * xx + yy * yy;
      if (d <= 12) { c.fillStyle = d >= 6 ? INK : WHITE; c.fillRect(x + xx, y + yy, 1, 1); }
    }
    c.fillStyle = INK; ptext(c, ch, x - 1, y - 2);
  }

  node(i, t) {
    const n = NODES[i];
    const dx = this.calm ? 0 : Math.sin(t * 0.4 + i * 1.3) * 0.6, dy = this.calm ? 0 : Math.cos(t * 0.33 + i) * 0.6;
    return [this.cw * n.x / 100 + dx, this.ch * n.y / 100 + dy];
  }

  ctrl(a, b) {
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    let nx = -(b[1] - a[1]) / L, ny = (b[0] - a[0]) / L;
    // bow away from the pond's centre so routes read as separate lines
    if ((mx + nx - this.pcx) ** 2 + (my + ny - this.pcy) ** 2 < (mx - this.pcx) ** 2 + (my - this.pcy) ** 2) { nx = -nx; ny = -ny; }
    return [mx + nx * L * 0.16, my + ny * L * 0.16, L];
  }

  bez(a, k, b, t) {
    const u = 1 - t;
    return [u * u * a[0] + 2 * u * t * k[0] + t * t * b[0], u * u * a[1] + 2 * u * t * k[1] + t * t * b[1]];
  }

  disc(c, cx, cy, r, col) {
    c.fillStyle = col;
    for (let y = Math.floor(cy - r); y <= Math.ceil(cy + r); y++) for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x++) {
      if ((x + 0.5 - cx) ** 2 + (y + 0.5 - cy) ** 2 <= r * r) c.fillRect(x, y, 1, 1);
    }
  }

  fish(c, pts) {
    const n = Math.min(pts.length, FISH_R.length);
    for (let i = n - 1; i >= 0; i--) this.disc(c, pts[i][0], pts[i][1], FISH_R[i] + 1, INK);
    for (let i = n - 1; i >= 0; i--) this.disc(c, pts[i][0], pts[i][1], FISH_R[i], WHITE);
    if (n > 2) this.disc(c, pts[2][0], pts[2][1], 1.1, INK);
    if (n > 5) this.disc(c, pts[5][0], pts[5][1], 0.7, INK);
    const e = pts[n - 1], p = pts[n - 2] || e;
    const ax = e[0] - p[0], ay = e[1] - p[1], l = Math.hypot(ax, ay) || 1;
    const ux = ax / l, uy = ay / l;
    c.fillStyle = INK;
    for (const s of [1, -1]) {
      c.fillRect(Math.round(e[0] + ux * 1.5 - uy * s * 1.6), Math.round(e[1] + uy * 1.5 + ux * s * 1.6), 1, 1);
      c.fillRect(Math.round(e[0] + ux * 2.5 - uy * s * 2.4), Math.round(e[1] + uy * 2.5 + ux * s * 2.4), 1, 1);
    }
  }

  pad(c, i, p, t) {
    const n = NODES[i], r = n.r, rot = i * 0.9 + (this.calm ? 0 : Math.sin(t * 0.2 + i) * 0.08);
    const ca = Math.cos(-rot), sa = Math.sin(-rot);
    const inside = (x, y) => {
      const dx = x - p[0], dy = y - p[1], d = Math.hypot(dx, dy);
      if (d > r) return false;
      const lx = dx * ca - dy * sa, ly = dx * sa + dy * ca;
      return !(lx > 0 && Math.abs(Math.atan2(ly, lx)) < 0.3 && d > r * 0.12);
    };
    const x0 = Math.floor(p[0] - r - 4), x1 = Math.ceil(p[0] + r + 4), y0 = Math.floor(p[1] - r - 4), y1 = Math.ceil(p[1] + r + 5);
    const sel = this.state.sel === i, hov = this.hover === i;
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      const cx = x + 0.5, cy = y + 0.5;
      if (inside(cx, cy)) {
        const edge = !inside(cx + 1, cy) || !inside(cx - 1, cy) || !inside(cx, cy + 1) || !inside(cx, cy - 1);
        const dx = cx - p[0], dy = cy - p[1], d = Math.hypot(dx, dy);
        const ang = Math.atan2(dx * sa + dy * ca, dx * ca - dy * sa);
        const vein = d > r * 0.25 && d < r * 0.82 && ((x + y) & 1) === 0 &&
          Math.abs(((ang + 0.3 + Math.PI * 2) % (Math.PI / 3)) - Math.PI / 6) < 0.1;
        const hub = i === 0 && Math.abs(d - r * 0.55) < 0.6 && ((x + y) & 1) === 0;
        c.fillStyle = edge || vein || hub ? INK : (sel ? '#f3f1ec' : WHITE);
        c.fillRect(x, y, 1, 1);
      } else {
        const d = Math.hypot(cx - p[0], cy - p[1]);
        if ((sel || hov) && Math.abs(d - (r + 2.5)) < 0.55) {
          const on = sel ? (Math.floor(t * 4) % 2 === 0 || this.calm) : ((x + y) & 1) === 0;
          if (on) { c.fillStyle = INK; c.fillRect(x, y, 1, 1); }
        } else if (inside(cx - 1.5, cy - 2) && BAYER[(y & 3) * 4 + (x & 3)] < 4) {
          c.fillStyle = INK; c.fillRect(x, y, 1, 1);
        }
      }
    }
    if (LILY_ON.includes(i)) {
      const fx = Math.round(p[0] + Math.cos(i) * r * 0.35) - 5, fy = Math.round(p[1] + Math.sin(i) * r * 0.35) - 4;
      for (let rr = 0; rr < LILY.length; rr++) for (let q = 0; q < LILY[rr].length; q++) {
        const k = LILY[rr][q];
        if (k === '.') continue;
        c.fillStyle = k === 'o' ? WHITE : INK;
        c.fillRect(fx + q, fy + rr, 1, 1);
      }
    }
  }

  frame() {
    if (!this.build()) return;
    const cv = document.getElementById('fieldCv');
    if (!cv) return;
    const c = cv.getContext('2d');
    const t = this.calm ? 0 : (performance.now() - this.t0) / 1000, dt = 0.05;
    c.drawImage(this.sheet, 0, 0);
    const P = NODES.map((_, i) => this.node(i, t));

    // surface rings: clicks, gulps and the odd drip, dithered as they fade
    if (!this.calm && Math.random() < 0.02) {
      let x, y, g = 0;
      do { x = Math.random() * this.cw; y = Math.random() * this.ch; g++; } while (this.N[Math.floor(y) * this.cw + Math.floor(x)] > 0.9 && g < 20);
      this.rings.push({ x, y, t: 0, r1: 8 });
    }
    this.rings.forEach(r => { r.t += dt; });
    this.rings = this.rings.filter(r => r.t < 1.6);
    for (const r of this.rings) {
      const u = r.t / 1.6, rad = 1 + r.r1 * (1 - Math.pow(1 - u, 2.2)), s = (1 - u) * (1 - u);
      c.fillStyle = INK;
      const steps = Math.max(12, Math.round(rad * 6.3));
      for (let k2 = 0; k2 < steps; k2++) {
        const a = k2 / steps * Math.PI * 2, x = Math.round(r.x + Math.cos(a) * rad), y = Math.round(r.y + Math.sin(a) * rad);
        if (BAYER[(y & 3) * 4 + (x & 3)] / 16 < s) c.fillRect(x, y, 1, 1);
      }
    }

    // routes
    const trip = this.trip;
    let tripT = 0;
    if (trip) {
      const u = Math.min(1, (performance.now() - trip.t0) / 1000 / trip.dur);
      tripT = trip.ans ? ease(u) : (u < 0.5 ? 0.46 * ease(u * 2) : 0.46 * (1 - ease((u - 0.5) * 2)));
      trip.u = u;
    }
    this.state.made.forEach((m) => {
      const a = P[m.a], b = P[m.b], [kx, ky, L] = this.ctrl(a, b), k = [kx, ky];
      const ra = NODES[m.a].r + 2, rb = NODES[m.b].r + 2;
      const live = trip && trip.k === m.k && trip.u < 1;
      const steps = Math.ceil(L * 1.3);
      for (let s = 0; s <= steps; s++) {
        const tt = s / steps, q = this.bez(a, k, b, tt);
        if (Math.hypot(q[0] - a[0], q[1] - a[1]) < ra || Math.hypot(q[0] - b[0], q[1] - b[1]) < rb) continue;
        const x = Math.round(q[0]), y = Math.round(q[1]);
        if (live && m.ans && tt > tripT) {
          if (s % 5 === 0) { c.fillStyle = INK; c.fillRect(x, y, 2, 2); }
          continue;
        }
        if (m.ans) { if (s % 2 === 0) { c.fillStyle = INK; c.fillRect(x, y, 1, 1); } }
        else if (Math.floor(s / 3) % 2 === 0 && Math.abs(tt - 0.5) > 0.07) { c.fillStyle = GREY; c.fillRect(x, y, 1, 1); }
      }
      if (live && m.ans && tripT < 0.9) return;
      if (m.ans) {
        const h = this.bez(a, k, b, 0.84), h2 = this.bez(a, k, b, 0.8);
        const dx = h[0] - h2[0], dy = h[1] - h2[1], l = Math.hypot(dx, dy) || 1, ux = dx / l, uy = dy / l;
        c.fillStyle = INK;
        for (let j = 1; j <= 2; j++) {
          c.fillRect(Math.round(h[0] - ux * j - uy * j), Math.round(h[1] - uy * j + ux * j), 1, 1);
          c.fillRect(Math.round(h[0] - ux * j + uy * j), Math.round(h[1] - uy * j - ux * j), 1, 1);
        }
      }
      const mid = this.bez(a, k, b, 0.5), bx = Math.round(mid[0]) - 5, by = Math.round(mid[1]) - 4;
      c.fillStyle = m.ans ? INK : GREY; c.fillRect(bx, by, 11, 9);
      c.fillStyle = WHITE; c.fillRect(bx + 1, by + 1, 9, 7);
      c.fillStyle = m.ans ? INK : GREY;
      ptext(c, m.ans ? String(m.n).padStart(2, '0') : '?', m.ans ? bx + 2 : bx + 4, by + 2);
    });

    // the cursor route while one pad is picked
    if (this.state.sel != null && this.mouse && !this.calm) {
      const a = P[this.state.sel], b = this.mouse, L = Math.hypot(b[0] - a[0], b[1] - a[1]);
      c.fillStyle = INK;
      for (let s = NODES[this.state.sel].r + 3; s < L; s += 1) {
        if (Math.floor(s / 2) % 2) continue;
        c.fillRect(Math.round(a[0] + (b[0] - a[0]) * s / L), Math.round(a[1] + (b[1] - a[1]) * s / L), 1, 1);
      }
    }

    // a resident koi cruising the pond, under the pads
    if (!this.amb) this.amb = { x: this.cw * 0.3, y: this.ch * 0.6, a: 0.4, hist: [] };
    const A = this.amb;
    if (!this.calm) {
      A.a += (Math.sin(t * 0.37) * 0.5 + Math.sin(t * 0.13 + 1) * 0.35) * dt;
      if (this.pondN(A.x, A.y) > 0.8) A.a += wrapA(Math.atan2(this.pcy - A.y, this.pcx - A.x) - A.a) * 1.6 * dt;
      A.x += Math.cos(A.a) * 6 * dt; A.y += Math.sin(A.a) * 6 * dt;
    }
    A.hist.unshift([A.x, A.y]);
    if (A.hist.length > 60) A.hist.pop();
    const body = [A.hist[0]];
    let acc = 0;
    for (let i = 1; i < A.hist.length && body.length < FISH_R.length; i++) {
      acc += Math.hypot(A.hist[i][0] - A.hist[i - 1][0], A.hist[i][1] - A.hist[i - 1][1]);
      if (acc >= 1.4) { body.push(A.hist[i]); acc = 0; }
    }
    if (body.length < 2) body.push([A.x - Math.cos(A.a) * 1.4, A.y - Math.sin(A.a) * 1.4]);
    this.fish(c, body);

    // the traveller: head at the route position, body sampled behind it
    if (trip && trip.u < 1) {
      const a = P[trip.a], b = P[trip.b], [kx, ky, L] = this.ctrl(a, b), k = [kx, ky];
      const back = trip.ans || trip.u < 0.5 ? -1 : 1, d = 1.5 / L, pts = [];
      for (let j = 0; j < FISH_R.length; j++) pts.push(this.bez(a, k, b, Math.max(0, Math.min(1, tripT + back * j * d))));
      this.fish(c, pts);
    } else if (trip && !trip.done) {
      trip.done = true;
      const b = P[trip.b];
      if (trip.ans) { this.rings.push({ x: b[0], y: b[1], t: 0, r1: 12 }); this.rings.push({ x: b[0], y: b[1], t: 0.3, r1: 20 }); }
    }

    P.forEach((p, i) => this.pad(c, i, p, t));
  }

  // --- detail 1: the pixel stage in the title block -------------------------
  glyph(c, text, cx, cy, size, ink) {
    const o = this.off, g = o.getContext('2d', { willReadFrequently: true });
    g.clearRect(0, 0, o.width, o.height);
    g.font = `${size}px "Pixelify Sans", "Segoe UI Emoji", "Apple Color Emoji", monospace`;
    g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#000';
    g.fillText(text, cx, cy);
    const img = g.getImageData(0, 0, o.width, o.height), a = img.data;
    const inkRGB = ink === INK ? [20, 20, 20] : [150, 130, 130];
    for (let i = 0; i < a.length; i += 4) {
      if (a[i + 3] < 110) { a[i + 3] = 0; continue; }
      const lum = (a[i] * 0.3 + a[i + 1] * 0.59 + a[i + 2] * 0.11) / 255;
      const rgb = lum < 0.62 ? inkRGB : [255, 255, 255];
      a[i] = rgb[0]; a[i + 1] = rgb[1]; a[i + 2] = rgb[2]; a[i + 3] = 255;
    }
    g.putImageData(img, 0, 0);
    c.drawImage(o, 0, 0);
  }

  ground(c, W, H, t, scroll) {
    c.fillStyle = PINK; c.fillRect(0, 0, W, H);
    c.fillStyle = PINK2;
    const off = Math.floor(scroll ? t * 6 : 0);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (BAYER[(y & 3) * 4 + ((x + off) & 3)] < 2) c.fillRect(x, y, 1, 1);
  }

  sprite(c, rows, x, y, map) {
    for (let r = 0; r < rows.length; r++) for (let q = 0; q < rows[r].length; q++) {
      const col = map[rows[r][q]];
      if (col) { c.fillStyle = col; c.fillRect(x + q, y + r, 1, 1); }
    }
  }

  detail() {
    const cv = document.getElementById('detailCv');
    if (!cv) return;
    const c = cv.getContext('2d'), W = 128, H = 72;
    const t = this.calm ? 0 : (performance.now() - this.t0) / 1000;
    const card = this.state.card;
    if (!card) {
      this.ground(c, W, H, t, false);
      const x = Math.round(((t * 14) % (W + 24)) - 16), y = Math.round(H * 0.56 + Math.sin(t * 2) * 2);
      c.fillStyle = INK;
      for (let px = 4; px < W; px += 5) if (px > x + 16 || px < x - 40) c.fillRect(px, y + 3, 1, 1);
      this.sprite(c, KOI[Math.floor(t * 6) % 2], x, y, { X: WHITE, o: INK });
      this.glyph(c, 'PICK TWO', W / 2, H * 0.26, 14, INK);
      return;
    }
    if (card.ans && card.ans.p) {
      this.ground(c, W, H, t, true);
      c.fillStyle = WHITE;
      for (let i = 0; i < 3; i++) {
        const cx = Math.round(((i * 53 - t * 8) % (W + 30) + W + 30) % (W + 30) - 20), cy = 8 + i * 7;
        c.fillRect(cx, cy, 14, 3); c.fillRect(cx + 3, cy - 2, 7, 2);
      }
      const floor = Math.round(H * 0.86);
      c.fillStyle = INK; c.fillRect(0, floor, W, 1);
      const hop = Math.abs(Math.sin(t * 3.2)), squash = hop < 0.14 ? 1 - (0.14 - hop) * 1.4 : 1;
      const fw = Math.round(50 / Math.sqrt(squash)), fh = Math.round(28 * squash);
      const fx = Math.round(W / 2 - fw / 2), fy = Math.round(floor - fh - hop * 9);
      c.fillStyle = PINK2;
      const sw = Math.round(fw * (1 - hop * 0.45));
      c.fillRect(Math.round(W / 2 - sw / 2), floor + 2, sw, 2);
      c.fillStyle = INK; c.fillRect(fx, fy - 5, 18, 6); c.fillRect(fx - 1, fy - 1, fw + 2, fh + 2);
      c.fillStyle = WHITE; c.fillRect(fx + 1, fy - 4, 16, 5); c.fillRect(fx, fy, fw, fh);
      c.fillStyle = INK; c.fillRect(fx, fy + 5, fw, 1);
      this.glyph(c, card.ans.p, W / 2, fy + 13, 10, INK);
      for (let i = 0; i < 2; i++) c.fillRect(fx + 8, fy + 20 + i * 4, fw - 16 - i * 10, 1);
      return;
    }
    this.ground(c, W, H, t, false);
    const [ga, gb] = card.glyphs, ink = card.ans ? INK : '#968282';
    this.glyph(c, ga, W * 0.24, H * 0.48 + Math.sin(t * 2.4) * 2, 24, ink);
    this.glyph(c, gb, W * 0.76, H * 0.48 + Math.sin(t * 2.4 + 1.6) * 2, 24, ink);
    const x0 = Math.round(W * 0.37), x1 = Math.round(W * 0.63), wy = Math.round(H * 0.48);
    if (card.ans) {
      c.fillStyle = INK;
      for (let x = x0; x <= x1; x += 3) c.fillRect(x, wy, 1, 1);
      c.fillRect(Math.round(x0 + ((t * 20) % (x1 - x0))) - 1, wy - 1, 3, 3);
    } else {
      c.fillStyle = '#968282';
      for (let x = x0; x <= x1; x += 3) if (Math.abs(x - W / 2) > 7) c.fillRect(x, wy, 1, 1);
      if (Math.floor(t * 2) % 2 === 0 || this.calm) this.glyph(c, '?', W / 2, wy, 14, INK);
    }
  }

  // --- the game --------------------------------------------------------------
  cardFor(m) {
    const a = NODES[m.a], b = NODES[m.b];
    return { k: m.k, pair: `${a.label} × ${b.label}`, ans: m.ans, glyphs: [a.g, b.g], note: OPEN_NOTE[(m.a + m.b) % OPEN_NOTE.length] };
  }

  pick(i) {
    const sel = this.state.sel;
    if (sel === i) { this.setState({ sel: null }); return; }
    if (sel == null) { this.setState({ sel: i }); return; }
    const k = key(NODES[sel].id, NODES[i].id), ans = ANSWERS[k] || null;
    let made = this.state.made, m = made.find(x => x.k === k);
    if (!m) {
      m = { k, a: sel, b: i, ans, n: ans ? made.filter(x => x.ans).length + 1 : 0 };
      made = [...made, m];
    }
    if (this.cw) {
      const a = this.node(sel, 0), b = this.node(i, 0), L = Math.hypot(b[0] - a[0], b[1] - a[1]);
      this.trip = this.calm ? null : { k, a: sel, b: i, ans: !!ans, t0: performance.now(), dur: Math.max(1.1, L / 34) * (ans ? 1 : 1.3) };
    }
    this.setState({ sel: null, made, card: this.cardFor(m) });
  }

  renderVals() {
    const { sel, made, card } = this.state;
    const open = made.filter(m => !m.ans).map(m => ({ text: `${NODES[m.a].label} × ${NODES[m.b].label}` }));
    const keys = made.filter(m => m.ans).map(m => ({
      num: String(m.n).padStart(2, '0'),
      text: `${m.ans.t} — ${NODES[m.a].label} × ${NODES[m.b].label}`,
      open: () => this.setState({ card: this.cardFor(m) }),
    }));
    return {
      invLabel: this.state.inv ? '◐ light' : '◑ invert',
      invPressed: this.state.inv ? 'true' : 'false',
      toggleInvert: () => {
        const inv = !this.state.inv;
        try { localStorage.setItem('mh-invert', inv ? '1' : '0'); } catch (_) { /* private mode */ }
        window.dispatchEvent(new Event('mh-invert'));
        this.setState({ inv });
      },
      nodes: NODES.map((n, i) => {
        const on = sel === i;
        return {
          i: String(i), label: n.label, num: 'N' + String(i).padStart(2, '0'),
          x: n.x, y: n.y, d: (n.r * 2 + 2) * PX, fs: i === 0 ? '20px' : '16px',
          pressed: on ? 'true' : 'false',
          lbg: on ? INK : WHITE, lfg: on ? WHITE : INK,
          pick: (e) => { if (e) e.stopPropagation(); this.pick(i); },
          enter: () => { this.hover = i; },
          leave: () => { if (this.hover === i) this.hover = null; },
        };
      }),
      score: `${String(made.length).padStart(2, '0')}/${TOTAL}`,
      keynotes: keys, noKeys: keys.length === 0,
      openPairs: open, noneOpen: open.length === 0,
      hint: sel == null ? 'click a pad, then another' : `${NODES[sel].label} → pick a second pad · esc to cancel`,
      clear: () => { this.trip = null; this.setState({ sel: null, made: [], card: null }); },
      stageTag: card ? (card.ans ? (card.ans.p ? 'PRODUCT' : 'CONNECTED') : 'NO LINE YET') : 'WAITING',
      kicker: card ? card.pair : 'Result',
      title: card ? (card.ans ? card.ans.t : 'No line yet') : 'Pick two pads',
      titleColor: card && !card.ans ? '#6d6a63' : INK,
      body: card ? (card.ans ? card.ans.b : card.note)
        : "Every pad is something I'm curious about. Pick two and a koi swims the route between them — if there's a line, I'll tell you what runs along it.",
      href: card && card.ans && card.ans.href ? card.ans.href : '',
      cta: card && card.ans && card.ans.cta ? card.ans.cta : '',
    };
  }
}

export default function Thinking() {
  const [state, setState] = useState({ sel: null, made: [], card: null, inv: false });
  const stateRef = useRef(state);
  stateRef.current = state;
  const boardRef = useRef(null);
  if (boardRef.current === null) {
    boardRef.current = new Board(
      () => stateRef.current,
      (patch) => { stateRef.current = { ...stateRef.current, ...patch }; setState(stateRef.current); },
    );
  }
  const board = boardRef.current;

  useEffect(() => {
    board.mount();
    return () => board.unmount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rv = board.renderVals();
  const linkStyle = { border: 0 };
  const hoverInvert = (e) => { e.currentTarget.style.background = '#141414'; e.currentTarget.style.color = '#fff'; };
  const unhoverInvert = (e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#141414'; };

  return (
    <div className="mh-think" style={{ minHeight: '100vh', display: 'grid', gridTemplateRows: 'auto 1fr', background: '#fff' }}>

      <header style={{ position: 'sticky', top: 0, zIndex: 30, display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', gap: '10px 24px', padding: 'clamp(10px,1.8vh,18px) clamp(14px,2.4vw,36px)', background: '#fff', borderBottom: '3px solid #141414', fontFamily: "'VT323',ui-monospace,monospace" }}>
        <Link to="/" style={{ fontFamily: "'Pixelify Sans',monospace", fontWeight: 700, fontSize: 'clamp(20px,1.8vw,28px)', letterSpacing: '.06em', border: 0 }}>MAEHLO</Link>
        <span style={{ fontSize: 'clamp(15px,1.15vw,19px)', letterSpacing: '.12em', textTransform: 'uppercase' }}>Thinking — how the parts connect · dwg. 02</span>
        <nav style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 'clamp(12px,1.4vw,22px)', fontSize: 'clamp(16px,1.2vw,20px)', textTransform: 'uppercase' }}>
          <Link to="/about" style={linkStyle}>About</Link>
          <Link to="/works" style={linkStyle}>Works</Link>
          <span style={{ color: '#8b1a1a' }}>→ Thinking</span>
          <Link to="/" style={linkStyle}>Pond</Link>
          <Link to="/resume" style={linkStyle}>Resume</Link>
          <button type="button" onClick={rv.toggleInvert} aria-pressed={rv.invPressed}
            style={{ fontFamily: 'inherit', fontSize: 'inherit', textTransform: 'uppercase', background: '#fff', color: '#141414', border: 0, padding: '0 8px', whiteSpace: 'nowrap', boxShadow: '0 -2px 0 0 #141414,0 2px 0 0 #141414,-2px 0 0 0 #141414,2px 0 0 0 #141414' }}
            onMouseEnter={hoverInvert} onMouseLeave={unhoverInvert}>{rv.invLabel}</button>
        </nav>
      </header>

      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 'clamp(18px,2vw,30px)', padding: 'clamp(14px,2vh,22px) clamp(18px,2vw,30px) clamp(20px,3vh,34px)' }}>

        <section style={{ flex: '1 1 560px', minWidth: 0, border: '1px solid #141414', outline: '1px solid #141414', outlineOffset: -6, padding: 6 }}>
          <div id="field" style={{ position: 'relative', height: 'max(540px, calc(100vh - 110px))', overflow: 'hidden', background: '#fff' }}>
            <canvas id="fieldCv" aria-hidden="true" style={{ position: 'absolute', left: 0, top: 0, imageRendering: 'pixelated' }} />
            {rv.nodes.map((n) => (
              <button key={n.i} type="button" onClick={n.pick} onPointerEnter={n.enter} onPointerLeave={n.leave}
                aria-pressed={n.pressed} aria-label={n.label}
                style={{ position: 'absolute', left: n.x + '%', top: n.y + '%', width: n.d, height: n.d, transform: 'translate(-50%,-50%)', borderRadius: '50%', background: 'transparent', border: 0, padding: 0, zIndex: 2, font: 'inherit', color: 'inherit' }}>
                <span style={{ position: 'absolute', left: '50%', top: '100%', transform: 'translate(-50%,7px)', whiteSpace: 'nowrap', fontFamily: "'VT323',monospace", fontSize: n.fs, letterSpacing: '.08em', textTransform: 'uppercase', padding: '0 6px', lineHeight: 1.15, display: 'flex', gap: 6, alignItems: 'baseline', background: n.lbg, color: n.lfg, boxShadow: '0 -2px 0 0 #141414,0 2px 0 0 #141414,-2px 0 0 0 #141414,2px 0 0 0 #141414' }}>
                  <span>{n.label}</span><span style={{ opacity: .55, fontSize: '.8em' }}>{n.num}</span>
                </span>
              </button>
            ))}
          </div>
        </section>

        <aside aria-live="polite" style={{ flex: '0 1 420px', minWidth: 'min(100%,320px)', display: 'grid', background: '#fff', margin: '4px 14px 14px 4px', boxShadow: '0 -4px 0 0 #141414,0 4px 0 0 #141414,-4px 0 0 0 #141414,4px 0 0 0 #141414,12px 12px 0 #141414' }}>

          <div style={{ display: 'grid', gap: 4, padding: '14px 16px', borderBottom: '1.5px solid #141414' }}>
            <span style={{ fontFamily: "'VT323',monospace", fontSize: 15, letterSpacing: '.18em', color: '#5c5a55' }}>PROJECT</span>
            <span style={{ fontSize: 'clamp(30px,2.8vw,44px)', lineHeight: 1, fontWeight: 500 }}>My Brain</span>
            <span style={{ fontFamily: "'VT323',monospace", fontSize: 18, color: '#3c3a36' }}>A plan of how the parts connect</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', borderBottom: '1.5px solid #141414' }}>
            <div style={{ display: 'grid', gap: 2, padding: '8px 12px', borderRight: '1.5px solid #141414' }}>
              <span style={{ fontFamily: "'VT323',monospace", fontSize: 14, letterSpacing: '.16em', color: '#5c5a55' }}>DWG</span>
              <span style={{ fontFamily: "'VT323',monospace", fontSize: 22 }}>02</span>
            </div>
            <div style={{ display: 'grid', gap: 2, padding: '8px 12px', borderRight: '1.5px solid #141414' }}>
              <span style={{ fontFamily: "'VT323',monospace", fontSize: 14, letterSpacing: '.16em', color: '#5c5a55' }}>SCALE</span>
              <span style={{ fontFamily: "'VT323',monospace", fontSize: 22, whiteSpace: 'nowrap' }}>1 : MIND</span>
            </div>
            <div style={{ display: 'grid', gap: 2, padding: '8px 12px' }}>
              <span style={{ fontFamily: "'VT323',monospace", fontSize: 14, letterSpacing: '.16em', color: '#5c5a55' }}>SCORE</span>
              <span style={{ fontFamily: "'VT323',monospace", fontSize: 22, fontVariantNumeric: 'tabular-nums' }}>{rv.score}</span>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 8, padding: '12px 16px', borderBottom: '1.5px solid #141414' }}>
            <span style={{ fontFamily: "'VT323',monospace", fontSize: 15, letterSpacing: '.18em', color: '#5c5a55' }}>DETAIL 1 — {rv.stageTag}</span>
            <div style={{ position: 'relative', aspectRatio: '16/9', background: '#efdcdc', boxShadow: '0 -3px 0 0 #141414,0 3px 0 0 #141414,-3px 0 0 0 #141414,3px 0 0 0 #141414', margin: 3 }}>
              <canvas id="detailCv" width="128" height="72" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', imageRendering: 'pixelated' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gap: 8, padding: '14px 16px', borderBottom: '1.5px solid #141414' }}>
            <span style={{ fontFamily: "'VT323',monospace", fontSize: 15, letterSpacing: '.18em', color: '#5c5a55', textTransform: 'uppercase' }}>{rv.kicker}</span>
            <span style={{ fontSize: 'clamp(22px,2vw,30px)', lineHeight: 1.12, fontWeight: 500, color: rv.titleColor, textWrap: 'balance' }}>{rv.title}</span>
            <p style={{ margin: 0, fontFamily: "'VT323',monospace", fontSize: 'clamp(19px,1.4vw,22px)', lineHeight: 1.22, color: '#2a2926', textWrap: 'pretty' }}>{rv.body}</p>
            {rv.href && (
              <Link to={HREF_MAP[rv.href] || '/'} style={{ justifySelf: 'start', marginTop: 2, fontSize: 15 }}>{rv.cta} →</Link>
            )}
          </div>

          <div style={{ display: 'grid', gap: 8, padding: '14px 16px', borderBottom: '1.5px solid #141414' }}>
            <span style={{ fontFamily: "'VT323',monospace", fontSize: 15, letterSpacing: '.18em', color: '#5c5a55' }}>GENERAL NOTES</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto minmax(0,1fr)', gap: '8px 10px', fontFamily: "'VT323',monospace", fontSize: 'clamp(17px,1.25vw,20px)', lineHeight: 1.22, color: '#2a2926' }}>
              <span>1.</span><span style={{ textWrap: 'pretty' }}>Almost everything I design is made for people with minds like mine. It gets called TikTok brain, a short attention span or ADHD, but what these share is a mind that wanders: a curious one that wants to learn as much as it can in whatever time it has.</span>
              <span>2.</span><span style={{ textWrap: 'pretty' }}>So I take whatever I'm most curious about at the time, and I design around it.</span>
              <span>3.</span><span style={{ textWrap: 'pretty' }}>The question I keep asking is what I can make that keeps people curious and engaged. The ideas below look miles apart, but somehow they connect.</span>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 6, padding: '14px 16px', borderBottom: '1.5px solid #141414' }}>
            <span style={{ fontFamily: "'VT323',monospace", fontSize: 15, letterSpacing: '.18em', color: '#5c5a55' }}>KEYNOTES</span>
            {rv.noKeys && <span style={{ fontFamily: "'VT323',monospace", fontSize: 18, color: '#6d6a63' }}>Nothing yet. Pick two pads on the plan.</span>}
            {rv.keynotes.map((k) => (
              <button key={k.num} type="button" onClick={k.open}
                style={{ display: 'grid', gridTemplateColumns: 'auto minmax(0,1fr)', gap: 10, alignItems: 'baseline', textAlign: 'left', background: 'transparent', border: 0, padding: '2px 0', fontFamily: "'VT323',monospace", fontSize: 18, color: '#141414' }}
                onMouseEnter={hoverInvert} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#141414'; }}>
                <span style={{ padding: '0 4px', boxShadow: '0 -1px 0 0 currentColor,0 1px 0 0 currentColor,-1px 0 0 0 currentColor,1px 0 0 0 currentColor' }}>{k.num}</span>
                <span>{k.text}</span>
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gap: 6, padding: '14px 16px', borderBottom: '1.5px solid #141414' }}>
            <span style={{ fontFamily: "'VT323',monospace", fontSize: 15, letterSpacing: '.18em', color: '#5c5a55' }}>OPEN ITEMS — NOT CONNECTED (YET)</span>
            {rv.noneOpen && <span style={{ fontFamily: "'VT323',monospace", fontSize: 18, color: '#6d6a63' }}>Nothing open yet. Try a pair that doesn't connect.</span>}
            {rv.openPairs.map((p, idx) => (
              <span key={idx} style={{ fontFamily: "'VT323',monospace", fontSize: 18, color: '#5c5a55', borderTop: '1px dashed #b9b6ae', paddingTop: 3 }}>{p.text}</span>
            ))}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '12px 16px' }}>
            <span style={{ fontFamily: "'VT323',monospace", fontSize: 16, color: '#5c5a55' }}>{rv.hint}</span>
            <button type="button" onClick={rv.clear}
              style={{ fontFamily: 'inherit', fontSize: 14, background: '#fff', color: '#141414', border: 0, padding: '4px 12px', boxShadow: '0 -3px 0 0 #141414,0 3px 0 0 #141414,-3px 0 0 0 #141414,3px 0 0 0 #141414,5px 5px 0 #141414' }}
              onMouseEnter={hoverInvert} onMouseLeave={unhoverInvert}>Reset the plan</button>
          </div>
        </aside>
      </div>
      <canvas id="enterPix" aria-hidden="true" style={{ position: 'fixed', left: 0, top: 0, zIndex: 80, pointerEvents: 'none', imageRendering: 'pixelated' }} />
    </div>
  );
}
