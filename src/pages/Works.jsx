import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Works.css';
import stuffImg from '../images/stuff-1c.png';
import maableImg from '../images/manageable-1.png';
import connectImg from '../images/connect-1.png';
import dormdropImg from '../images/dormdrop-1.png';

// ---------------------------------------------------------------------------
// Ported from the design handoff's Works.dc.html — the site plan of
// selected works, routed at /works. Five footprints laid out on a drafted
// plot; picking one (click, arrow keys, or clicking the water to call the
// koi over) reveals its plate in four hard focus steps (16 → 9 → 4 → sharp)
// and its title-block card. The five lily pads are trapdoors into the
// hidden folder stack.
//
// FLAG (kept verbatim, not fixed): in the source WORKS data, Connect and
// DormDrop each carry BOTH an `img` (a real plate photo) and a `slot`
// (an <image-slot> placeholder id). The template's two <sc-if> blocks are
// independent, so if both were live they'd render stacked. `img` is the
// real asset and is what's rendered here; `slot`/<image-slot> is a
// design-tool-only placeholder element (not part of the real build, same
// as elsewhere in this handoff) and isn't rendered, but the `slot` field
// itself is kept in WORKS below for fidelity to the source data.
// ---------------------------------------------------------------------------

const WORKS = [
  { name: 'Stuff', img: 'assets/stuff-1c.png', href: 'Stuff - case study.dc.html',
    lede: "A list for a brain that wanders — because opening one shouldn't feel like being told off.",
    meta: [['Role', 'Research, product, UI, illustration'], ['Timeline', '9 rounds · 2026'], ['Tools', 'Procreate, Figma, HTML/CSS']],
    at: [22, 26], shape: 'L' },
  { name: 'Maable', img: 'src/images/manageable-1.png', href: 'Maable - case study.dc.html',
    lede: 'Productivity that pays you back, instead of keeping a ledger of what you owe it.',
    meta: [['Role', 'Product, design engineering, front end'], ['Timeline', '2026 · live'], ['Tools', 'React, Vite, Supabase, Figma']],
    at: [70, 24], shape: 'court' },
  { name: 'Maehlo', art: 'pond', href: 'Maehlo - case study.dc.html',
    lede: 'This site. Koi, architecture plans and 90s pixels — a pond you can feed.',
    meta: [['Role', 'Design, motion, front end'], ['Type', 'Portfolio']],
    at: [47, 55], shape: 'round' },
  { name: 'Connect', slot: 'work-connect', img: 'src/images/connect-1.png', href: 'Connect - case study.dc.html',
    lede: 'A dating app built as a critique of dating apps, designed to succeed the moment you leave.',
    meta: [['Type', 'Case study'], ['Status', 'Built']],
    at: [78, 76], shape: 'pair' },
  { name: 'DormDrop', slot: 'work-dormdrop', img: 'src/images/dormdrop-1.png', href: 'DormDrop - case study.dc.html',
    lede: 'A student marketplace where every listing traces back to a verified student.',
    meta: [['Type', 'Case study'], ['Status', 'Built']],
    at: [21, 80], shape: 'bar' },
];
const N = WORKS.length;
const pad2 = (n) => String(n).padStart(2, '0');
const INK = '#141414';
const CELL = 4;

// prototype file → app route, per the handoff's route table. WORKS above
// stays verbatim (still points at the .dc.html filenames); only the
// link-rendering layer translates it, per the README's own instruction.
const HREF_MAP = {
  'Stuff - case study.dc.html': '/work/stuff',
  'Maable - case study.dc.html': '/work/maable',
  'Maehlo - case study.dc.html': '/work/maehlo',
  'Connect - case study.dc.html': '/work/connect',
  'DormDrop - case study.dc.html': '/work/dormdrop',
};

// WORKS' own `img` fields are the source prototype's file paths, kept
// verbatim in the data below; CRA needs the actual asset imported as a
// module instead, so the two are joined only at the point of rendering.
const IMG_MAP = {
  'assets/stuff-1c.png': stuffImg,
  'src/images/manageable-1.png': maableImg,
  'src/images/connect-1.png': connectImg,
  'src/images/dormdrop-1.png': dormdropImg,
};

// Footprints in plot units (1 unit ≈ a room). inside(x,y) + interior walls.
const SHAPES = {
  L: { w: 5, h: 4, inside: (x, y) => (y < 2 && x < 5) || (x < 2 && y < 4), walls: [['v', 2, 0, 2], ['v', 3.5, 0, 2]] },
  court: { w: 4.4, h: 4, inside: (x, y) => x < 4.4 && y < 4 && !(x > 1.3 && x < 3.1 && y > 1.2 && y < 2.8), walls: [['h', 0, 1.2, 1.3], ['h', 3.1, 2.8, 1.3]] },
  round: { w: 4, h: 4, inside: (x, y) => Math.hypot(x - 2, y - 2) < 2, walls: [['h', 0.4, 2, 3.2]] },
  pair: { w: 5.4, h: 3, inside: (x, y) => (x < 2.2 && y < 2.4) || (x > 3.2 && x < 5.4 && y > 0.6 && y < 3) || (x >= 2.2 && x <= 3.2 && y > 1.1 && y < 1.7), walls: [] },
  bar: { w: 6, h: 1.8, inside: (x, y) => x < 6 && y < 1.8, walls: [['v', 1.5, 0, 1.8], ['v', 3, 0, 1.8], ['v', 4.5, 0, 1.8]] },
};

// 3×5 pixel font (this page's own copy — a slightly different letter set
// than Thinking's, each prototype page owns its own constants in the source)
const F3 = {
  '0': ['XXX', 'X.X', 'X.X', 'X.X', 'XXX'], '1': ['.X.', 'XX.', '.X.', '.X.', 'XXX'], '2': ['XXX', '..X', 'XXX', 'X..', 'XXX'],
  '3': ['XXX', '..X', '.XX', '..X', 'XXX'], '4': ['X.X', 'X.X', 'XXX', '..X', '..X'], '5': ['XXX', 'X..', 'XXX', '..X', 'XXX'],
  '6': ['XXX', 'X..', 'XXX', 'X.X', 'XXX'], '7': ['XXX', '..X', '.X.', '.X.', '.X.'], '8': ['XXX', 'X.X', 'XXX', 'X.X', 'XXX'],
  '9': ['XXX', 'X.X', 'XXX', '..X', 'XXX'], ' ': ['...', '...', '...', '...', '...'], ':': ['...', '.X.', '...', '.X.', '...'],
  '-': ['...', '...', 'XXX', '...', '...'], '.': ['...', '...', '...', '...', '.X.'],
  A: ['.X.', 'X.X', 'XXX', 'X.X', 'X.X'], B: ['XX.', 'X.X', 'XX.', 'X.X', 'XX.'], C: ['.XX', 'X..', 'X..', 'X..', '.XX'],
  D: ['XX.', 'X.X', 'X.X', 'X.X', 'XX.'], E: ['XXX', 'X..', 'XX.', 'X..', 'XXX'], F: ['XXX', 'X..', 'XX.', 'X..', 'X..'],
  G: ['.XX', 'X..', 'X.X', 'X.X', '.XX'], H: ['X.X', 'X.X', 'XXX', 'X.X', 'X.X'], I: ['XXX', '.X.', '.X.', '.X.', 'XXX'],
  K: ['X.X', 'X.X', 'XX.', 'X.X', 'X.X'], L: ['X..', 'X..', 'X..', 'X..', 'XXX'], M: ['X.X', 'XXX', 'XXX', 'X.X', 'X.X'],
  N: ['X.X', 'XXX', 'XXX', 'XXX', 'X.X'], O: ['XXX', 'X.X', 'X.X', 'X.X', 'XXX'], P: ['XX.', 'X.X', 'XX.', 'X..', 'X..'],
  R: ['XX.', 'X.X', 'XX.', 'X.X', 'X.X'], S: ['.XX', 'X..', '.X.', '..X', 'XX.'], T: ['XXX', '.X.', '.X.', '.X.', '.X.'],
  U: ['X.X', 'X.X', 'X.X', 'X.X', 'XXX'], V: ['X.X', 'X.X', 'X.X', 'X.X', '.X.'], W: ['X.X', 'X.X', 'X.X', 'XXX', 'X.X'],
  Y: ['X.X', 'X.X', '.X.', '.X.', '.X.'],
};
function ptext(c, s, x, y) {
  for (const ch of s) {
    const g = F3[ch] || F3[' '];
    for (let r = 0; r < 5; r++) for (let q = 0; q < 3; q++) if (g[r][q] === 'X') c.fillRect(x + q, y + r, 1, 1);
    x += 4;
  }
}
const PADS = [[8, 50], [36, 16], [58, 84], [90, 44], [62, 40]];
const B4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const RAD = [1.5, 2.2, 2.5, 2.3, 1.9, 1.4, 1.0, 0.7];

// The plate's procedural art generator. Only "pond" is ever invoked by this
// page's WORKS data (Maehlo's plate); the other kinds are ported verbatim
// as a single self-contained function rather than trimmed, since they read
// as one general-purpose sprite generator rather than a separate unused
// subsystem (unlike the Home page's Board/WORKS-gallery dead code).
const ART_B = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const ART_F = { A: '010101111101101', B: '110101110101110', C: '011100100100011', D: '110101101101110', E: '111100110100111', F: '111100110100100', G: '011100101101011', H: '101101111101101', I: '111010010010111', K: '101101110101101', L: '100100100100111', M: '101111111101101', N: '110101101101101', O: '010101101101010', P: '110101110100100', R: '110101110101101', S: '011100010001110', T: '111010010010010', U: '101101101101111', W: '101101111111101', Y: '101101010010010', '0': '111101101101111', '1': '010110010010111', '2': '110001010100111', '3': '110001010001110', '4': '101101111001001', '5': '111100110001110', '→': '000010111010000', ' ': '000000000000000', '·': '000000010000000', '?': '110001010000010' };
const ART_K = ['X.......XXXX....', 'XX....XXXXXXXX..', '.XX.XXXooXXXXXX.', '..XXXXXooXXXXoX.', '.XX.XXXXXXoXXXX.', 'XX....XXXXXXXX..', 'X.......XXXX....'];
function drawArt(cv, kind) {
  const c = cv.getContext('2d'), W = 160, H = 90;
  const ink = (x, y, w = 1, hh = 1) => { c.fillStyle = '#141414'; c.fillRect(x, y, w, hh); };
  const paper = (x, y, w = 1, hh = 1) => { c.fillStyle = '#fff'; c.fillRect(x, y, w, hh); };
  const red = (x, y, w = 1, hh = 1) => { c.fillStyle = '#8b1a1a'; c.fillRect(x, y, w, hh); };
  const dith = (x0, y0, w, hh, lv) => { for (let y = y0; y < y0 + hh; y++) for (let x = x0; x < x0 + w; x++) if (ART_B[(y & 3) * 4 + (x & 3)] < lv) ink(x, y); };
  const box = (x, y, w, hh, fill = true) => { ink(x, y, w, 1); ink(x, y + hh - 1, w, 1); ink(x, y, 1, hh); ink(x + w - 1, y, 1, hh); if (fill) paper(x + 1, y + 1, w - 2, hh - 2); };
  const shadowBox = (x, y, w, hh) => { ink(x + 2, y + 2, w, hh); box(x, y, w, hh); };
  const text = (s, x, y, col = ink) => { for (const ch of s.toUpperCase()) { const g = ART_F[ch] || ART_F[' ']; for (let i = 0; i < 15; i++) if (g[i] === '1') col(x + (i % 3), y + ((i / 3) | 0)); x += 4; } };
  const koi = (x, y, flip = false, deep = false) => ART_K.forEach((r, ry) => [...r].forEach((ch, rx) => {
    if (ch === '.') return; const X = flip ? x + 15 - rx : x + rx, Y = y + ry;
    if (deep && ((X + Y) & 1)) return;
    if (ch === 'o') { paper(X, Y); return; } ink(X, Y);
  }));
  const pad = (cx, cy, r, notch = 0.6, fill = true) => {
    for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) {
      const d = Math.hypot(x, y); if (d > r + 0.3) continue;
      let a = Math.atan2(y, x) - notch; while (a > Math.PI) a -= Math.PI * 2; while (a < -Math.PI) a += Math.PI * 2;
      if (Math.abs(a) < 0.28 && d > 1) continue;
      const edge = d > r - 0.9; if (edge) ink(cx + x, cy + y); else if (fill) { paper(cx + x, cy + y); if ((x + y * 3) % 7 === 0 && d < r - 2) ink(cx + x, cy + y); }
    }
  };
  const ring = (cx, cy, r, gap = 2) => { const n = Math.ceil(r * 6); for (let i = 0; i < n; i += gap) { const a = i / n * Math.PI * 2; ink(Math.round(cx + Math.cos(a) * r), Math.round(cy + Math.sin(a) * r * 0.8)); } };
  const water = () => { for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (((x * 7 + y * 13) % 29 === 0) && ((x + y) & 1)) ink(x, y); };
  const dots = () => { for (let y = 5; y < H; y += 10) for (let x = 5; x < W; x += 10) ink(x, y); };
  const dim = (x0, x1, y, label) => { ink(x0, y, x1 - x0 + 1, 1); ink(x0, y - 2, 1, 5); ink(x1, y - 2, 1, 5); const w = label.length * 4; paper(((x0 + x1) >> 1) - (w >> 1) - 1, y - 3, w + 1, 7); text(label, ((x0 + x1) >> 1) - (w >> 1), y - 2); };
  paper(0, 0, W, H);

  if (kind === 'grid') {
    dots();
    shadowBox(18, 8, 124, 72);
    ink(19, 9, 122, 7); text('PORTFOLIO', 22, 10, paper); text('· · ·', 118, 10, paper);
    for (let r = 0; r < 2; r++) for (let q = 0; q < 3; q++) {
      const x = 26 + q * 38, y = 22 + r * 28; box(x, y, 32, 20); dith(x + 1, y + 1, 30, 18, 3 + ((q + r) % 3) * 3);
      ink(x, y + 22, 20, 1); ink(x, y + 24, 12, 1);
    }
    for (let i = 0; i < 14; i++) red(142 + (i & 1), 12 + i * 4, 1, 2);
    text('SKIM', 146, 70, red);
  }
  if (kind === 'idea') {
    dots();
    box(10, 12, 58, 58); dith(11, 13, 56, 56, 2);
    for (let i = 0; i < 3; i++) ring(39, 41, 10 + i * 7, 3);
    koi(30, 38); text('KOI', 30, 74);
    text('+', 76, 38);
    box(92, 12, 58, 58); ink(100, 22, 42, 1); ink(100, 22, 1, 38); ink(141, 22, 1, 38); ink(100, 59, 42, 1); ink(120, 22, 1, 20); ink(100, 42, 20, 1);
    for (let x = 102; x < 140; x += 3) ink(x, 44 + ((x >> 1) & 1));
    dim(100, 141, 16, '12M'); text('PLAN', 112, 74);
    ink(84, 76, 1, 1); text('+ PIXELS', 60, 82, red);
  }
  if (kind === 'pond') {
    water();
    pad(38, 30, 11, 0.4); pad(58, 40, 8, 2.4); pad(122, 58, 12, 4.1); pad(140, 22, 7, 1.2);
    ring(96, 34, 12, 2); ring(96, 34, 6, 2);
    koi(16, 56); koi(78, 64, true, true); koi(98, 20, true); koi(62, 12, false, true);
    for (let i = 0; i < 5; i++) ink(92 + (i * 3) % 9, 32 + (i * 2) % 5, 2, 2);
    box(96, 12, 22, 1, false); ink(118, 8, 1, 5); paper(102, 2, 36, 7); text('KOI 03', 104, 3);
  }
  if (kind === 'nav') {
    water();
    pad(40, 44, 16, 0.5);
    for (let i = 0; i < 44; i += 2) { const a = i / 44 * Math.PI * 2; red(Math.round(40 + Math.cos(a) * 20), Math.round(44 + Math.sin(a) * 20)); }
    paper(10, 72, 64, 8); text('→ ABOUT ME', 12, 73);
    ink(80, 0, 80, 90);
    for (let y = 0; y < 90; y++) for (let x = 72; x < 90; x++) if (ART_B[(y & 3) * 4 + (x & 3)] < (x - 72) * 0.9) ink(x, y);
    for (let x = 96; x < 152; x += 6) paper(x, 50, 2, 2);
    ART_K.forEach((r, ry) => [...r].forEach((ch, rx) => { if (ch === 'X') paper(100 + rx, 46 + ry); }));
    paper(96, 62, 56, 1); paper(96, 62, 1, 5); paper(151, 62, 1, 5); paper(97, 64, 20, 2);
    text('LOADING', 108, 72, paper);
    for (let y = 0; y < 90; y += 2) { c.fillStyle = 'rgba(255,255,255,.08)'; c.fillRect(80, y, 80, 1); }
  }
  if (kind === 'system') {
    dots();
    shadowBox(10, 8, 88, 70);
    box(14, 12, 40, 30); dith(15, 13, 38, 28, 5); text('A1', 16, 44);
    box(58, 12, 36, 14); text('SHEET', 60, 16); box(58, 30, 36, 12); text('1:50', 62, 34, red);
    ink(14, 50, 80, 1); for (let x = 14; x < 94; x += 2) ink(x, 54);
    text('VT323 · PIXELIFY', 14, 60); ink(14, 68, 50, 1); ink(14, 71, 34, 1);
    box(106, 8, 44, 70); ink(107, 9, 42, 8); text('DWG 05', 110, 11, paper);
    const rows = ['INK', 'PAPER', 'RED']; rows.forEach((s, i) => { text(s, 110, 24 + i * 12); if (i === 0) ink(138, 23, 8, 7); else if (i === 1) box(138, 35, 8, 7); else red(138, 47, 8, 7); });
    ink(110, 64, 36, 1); text('REV A', 110, 68);
  }
  if (kind === 'invert') {
    ink(0, 0, W, H);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (((x * 7 + y * 13) % 29 === 0) && ((x + y) & 1)) paper(x, y);
    c.save();
    const off = document.createElement('canvas'); off.width = W; off.height = H;
    drawArt(off, 'pond');
    const od = off.getContext('2d').getImageData(0, 0, W, H), p = od.data;
    for (let i = 0; i < p.length; i += 4) { p[i] = 255 - p[i]; p[i + 1] = 255 - p[i + 1]; p[i + 2] = 255 - p[i + 2]; }
    c.putImageData(od, 0, 0);
    c.restore();
    paper(6, 76, 62, 9); text('◑ INVERT', 8, 78);
  }
}

class Board {
  constructor(getState, setState) {
    this._getState = getState;
    this._setState = setState;
  }
  get state() { return this._getState(); }
  setState(patch) { this._setState(patch); }

  mount() {
    try { sessionStorage.setItem('mh-from', 'plan'); } catch (_) { /* private mode */ }
    try { this.setState({ inv: localStorage.getItem('mh-invert') === '1' }); } catch (_) { /* private mode */ }
    this.calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.koi = [this.mkKoi(40, 40, 1), this.mkKoi(120, 90, 0.7)];
    this.paintArt();
    this._artT = setTimeout(() => this.paintArt(), 300);
    this.rings = [];
    this._key = (e) => {
      if (e.target.closest && e.target.closest('input,textarea')) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); this.pick((this.state.sel + 1) % N); }
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); this.pick((this.state.sel + N - 1) % N); }
      else if (e.key === 'Enter' && !(e.target.closest && e.target.closest('a,button'))) {
        const w = WORKS[this.state.sel];
        if (w.href) this.navigate(HREF_MAP[w.href] || '/works');
      }
    };
    window.addEventListener('keydown', this._key);
    this._t0 = performance.now();
    this._iv = setInterval(() => this.tick(), 40);
    this.tick();
    this.reveal(0);
  }

  unmount() {
    clearInterval(this._iv);
    window.removeEventListener('keydown', this._key);
    clearTimeout(this._rv);
    clearTimeout(this._artT);
  }

  mkKoi(x, y, f) {
    const pts = [];
    for (let i = 0; i < 8; i++) pts.push([x - i * 1.7 * f, y]);
    return { x, y, a: 0, v: 0, f, pts, tgt: null, wt: 0, ph: Math.random() * 6 };
  }

  paintArt() { document.querySelectorAll('.plateArt').forEach((cv) => { if (cv.dataset.done) return; try { drawArt(cv, cv.dataset.art); cv.dataset.done = '1'; } catch (_) { /* not mounted yet */ } }); }

  pick(i) {
    if (i === this.state.sel) return;
    this.setState({ sel: i });
    this.reveal(i);
    const g = this.geo && this.geo[i];
    if (g) this.rings.push({ x: g.cx, y: g.cy, t: 0 });
  }

  // the plate comes into focus in four hard steps — 16, 9, 4, sharp
  reveal(i) {
    clearTimeout(this._rv);
    const steps = ['url(#px16) grayscale(1)', 'url(#px9) grayscale(1)', 'url(#px4) grayscale(.5)', 'none'];
    const run = (k) => {
      const box = document.querySelectorAll('#plate .plateImg')[i];
      if (box) {
        const img = box.querySelector('img[data-src]');
        if (img && !img.getAttribute('src')) img.src = img.dataset.src;
        box.style.filter = steps[k];
      }
      if (k < 3) this._rv = setTimeout(() => run(k + 1), 110);
    };
    run(this.calm ? 3 : 0);
  }

  layout(cw, ch) {
    const u = Math.max(4, Math.floor(Math.min(cw / 26, ch / 20)));
    this.u = u;
    this.geo = WORKS.map((w) => {
      const S = SHAPES[w.shape];
      const ox = Math.round(cw * w.at[0] / 100 - S.w * u / 2), oy = Math.round(ch * w.at[1] / 100 - S.h * u / 2);
      return { ox, oy, w: Math.round(S.w * u), h: Math.round(S.h * u), cx: ox + S.w * u / 2, cy: oy + S.h * u / 2 };
    });
    const btns = document.querySelectorAll('#plan .plot');
    btns.forEach((b, i) => {
      const g = this.geo[i]; if (!g) return;
      b.style.left = g.ox * CELL + 'px'; b.style.top = g.oy * CELL + 'px';
      b.style.width = g.w * CELL + 'px'; b.style.height = (g.h + 8) * CELL + 'px';
    });
  }

  tick() {
    const host = document.getElementById('plan'), cv = document.getElementById('planCv');
    if (!host || !cv) return;
    const W = host.clientWidth, H = host.clientHeight;
    if (!W || !H) return;
    const cw = Math.ceil(W / CELL), ch = Math.ceil(H / CELL);
    if (cv.width !== cw || cv.height !== ch || !this.geo) {
      cv.width = cw; cv.height = ch;
      cv.style.width = cw * CELL + 'px'; cv.style.height = ch * CELL + 'px';
      this.layout(cw, ch);
    }
    const t = (performance.now() - this._t0) / 1000, dt = 0.04;
    const c = cv.getContext('2d');
    c.clearRect(0, 0, cw, ch);
    c.fillStyle = INK;

    // water: a sparse ordered-dither shimmer that drifts
    const sh = this.calm ? 0 : Math.floor(t * 2);
    for (let y = 0; y < ch; y += 2) for (let x = (y >> 1) & 1; x < cw; x += 6) {
      if (B4[((y + sh) & 3) * 4 + ((x + sh) & 3)] === 0) c.fillRect(x, y, 1, 1);
    }

    // site furniture: border dims, north arrow, scale bar
    c.fillRect(3, ch - 6, cw - 6, 1); c.fillRect(3, ch - 8, 1, 5); c.fillRect(cw - 4, ch - 8, 1, 5);
    c.clearRect(Math.round(cw / 2) - 14, ch - 9, 28, 7); ptext(c, '48 000', Math.round(cw / 2) - 11, ch - 8);
    c.fillRect(5, 12, 1, ch - 24); c.fillRect(3, 12, 5, 1); c.fillRect(3, ch - 13, 5, 1);
    const nx = cw - 10, ny = 8;
    for (let r = 0; r < 7; r++) c.fillRect(nx - (r >> 1), ny + r, (r >> 1) * 2 + 1, 1);
    ptext(c, 'N', nx - 1, ny + 9);

    // pixel lily pads, decoration only
    // Each pad is a trapdoor to the stack. Hovered, it lifts and hatches.
    const padEls = document.querySelectorAll('#plan .padBtn');
    PADS.forEach(([px, py], i) => {
      const hov = this.hovPad === i;
      const x0 = cw * px / 100, y0 = ch * py / 100 + (this.calm ? 0 : Math.sin(t * 0.8 + i) * 0.6) - (hov ? 1 : 0), r = 4 + (i % 3) + (hov ? 1 : 0);
      const el = padEls[i];
      if (el) { el.style.left = (x0 - r - 1) * CELL + 'px'; el.style.top = (y0 - r - 1) * CELL + 'px'; el.style.width = el.style.height = (r * 2 + 3) * CELL + 'px'; }
      for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) {
        const d = Math.hypot(x, y); if (d > r) continue;
        if (x > 0 && Math.abs(y) < x * 0.35) continue;
        const edge = d > r - 1;
        c.fillStyle = edge || (hov && ((x + y + Math.floor(t * 6)) % 3 === 0)) ? INK : '#fff';
        c.fillRect(Math.round(x0 + x), Math.round(y0 + y), 1, 1);
      }
    });
    c.fillStyle = INK;

    // plots
    const sel = this.state.sel, u = this.u;
    WORKS.forEach((w, i) => {
      const S = SHAPES[w.shape], g = this.geo[i], on = i === sel, locked = !w.href;
      const ins = (x, y) => x >= 0 && y >= 0 && S.inside((x + 0.5) / u, (y + 0.5) / u);
      // shadow screen
      for (let y = 0; y < g.h + 2; y++) for (let x = 0; x < g.w + 2; x++) {
        if (!ins(x - 2, y - 2) || ins(x, y)) continue;
        if (((x + y) & 1) === 0) c.fillRect(g.ox + x, g.oy + y, 1, 1);
      }
      for (let y = 0; y < g.h; y++) for (let x = 0; x < g.w; x++) {
        if (!ins(x, y)) continue;
        const edge = !ins(x + 1, y) || !ins(x - 1, y) || !ins(x, y + 1) || !ins(x, y - 1);
        let ink;
        if (edge) ink = locked ? ((x + y) % 3 !== 0) : true;
        else if (on) ink = ((x + y + Math.floor(t * 6)) % 4) === 0;
        else if (locked) ink = (x - y) % 4 === 0;
        else ink = false;
        c.fillStyle = ink ? INK : '#fff';
        c.fillRect(g.ox + x, g.oy + y, 1, 1);
      }
      c.fillStyle = INK;
      S.walls.forEach(([o, a, b, len]) => {
        if (o === 'v') for (let k = 0; k < len * u; k++) { const X = Math.round(a * u), Y = Math.round(b * u + k); if (ins(X, Y)) c.fillRect(g.ox + X, g.oy + Y, 1, 1); }
        else for (let k = 0; k < len * u; k++) { const X = Math.round(a * u + k), Y = Math.round(b * u); if (ins(X, Y)) c.fillRect(g.ox + X, g.oy + Y, 1, 1); }
      });
      // label, and marching corner marks on the selected plot
      const lab = pad2(i + 1) + ' ' + w.name.toUpperCase();
      const lx = Math.round(g.ox + g.w / 2 - lab.length * 2), ly = g.oy + g.h + 3;
      c.fillStyle = '#fff'; c.fillRect(lx - 2, ly - 1, lab.length * 4 + 3, 7);
      c.fillStyle = INK; ptext(c, lab, lx, ly);
      if (on) {
        const m = 3 + (this.calm ? 0 : (Math.floor(t * 4) % 2)), L = 4;
        const X0 = g.ox - m, Y0 = g.oy - m, X1 = g.ox + g.w + m - 1, Y1 = g.oy + g.h + m - 1;
        c.fillRect(X0, Y0, L, 1); c.fillRect(X0, Y0, 1, L); c.fillRect(X1 - L + 1, Y0, L, 1); c.fillRect(X1, Y0, 1, L);
        c.fillRect(X0, Y1, L, 1); c.fillRect(X0, Y1 - L + 1, 1, L); c.fillRect(X1 - L + 1, Y1, L, 1); c.fillRect(X1, Y1 - L + 1, 1, L);
      }
    });

    // rings
    this.rings.forEach(r => { r.t += dt; });
    this.rings = this.rings.filter(r => r.t < 1.2);
    this.rings.forEach(r => {
      const rad = 3 + r.t * 26, n = Math.ceil(rad * 6), u2 = r.t / 1.2;
      for (let k = 0; k < n; k++) {
        const a = k / n * Math.PI * 2, x = Math.round(r.x + Math.cos(a) * rad), y = Math.round(r.y + Math.sin(a) * rad);
        if (B4[(y & 3) * 4 + (x & 3)] / 16 > u2) c.fillRect(x, y, 1, 1);
      }
    });

    // koi: the big one swims to the selected plot and circles it; the
    // juvenile wanders. Follow-the-leader spine, rasterised per cell.
    this.koi.forEach((k, idx) => {
      let tx, ty;
      if (idx === 0) {
        if (k.call) { tx = k.call[0]; ty = k.call[1]; if (Math.hypot(tx - k.x, ty - k.y) < 4) k.call = null; }
        else {
          const g = this.geo[sel], R = Math.max(g.w, g.h) * 0.5 + 9;
          const oa = t * 0.5; tx = g.cx + Math.cos(oa) * R; ty = g.cy + Math.sin(oa) * R * 0.8;
        }
      } else {
        k.wt -= dt;
        if (!k.tgt || k.wt <= 0) { k.tgt = [8 + Math.random() * (cw - 16), 8 + Math.random() * (ch - 16)]; k.wt = 5 + Math.random() * 5; }
        [tx, ty] = k.tgt;
      }
      const want = Math.atan2(ty - k.y, tx - k.x), d = Math.hypot(tx - k.x, ty - k.y);
      let da = want - k.a; while (da > Math.PI) da -= Math.PI * 2; while (da < -Math.PI) da += Math.PI * 2;
      k.a += Math.max(-2.4, Math.min(2.4, da * 3)) * dt;
      const vt = Math.min(idx === 0 ? 34 : 16, 6 + d * 1.2);
      k.v += (vt - k.v) * dt * 2;
      if (this.calm) k.v = 0;
      k.x += Math.cos(k.a) * k.v * dt; k.y += Math.sin(k.a) * k.v * dt;
      k.ph += dt * (4 + k.v * 0.25);
      const P = k.pts, sp = 1.7 * k.f;
      P[0] = [k.x + Math.sin(k.a) * Math.sin(k.ph) * 0.5, k.y - Math.cos(k.a) * Math.sin(k.ph) * 0.5];
      for (let s = 1; s < P.length; s++) {
        const dx = P[s][0] - P[s - 1][0], dy = P[s][1] - P[s - 1][1], dd = Math.hypot(dx, dy) || 1;
        P[s] = [P[s - 1][0] + dx / dd * sp, P[s - 1][1] + dy / dd * sp];
      }
      const inK = (x, y) => {
        for (let s = 0; s < P.length; s++) if (Math.hypot(x - P[s][0], y - P[s][1]) < RAD[s] * k.f) return s;
        return -1;
      };
      const minx = Math.floor(Math.min(...P.map(p => p[0])) - 4), maxx = Math.ceil(Math.max(...P.map(p => p[0])) + 4);
      const miny = Math.floor(Math.min(...P.map(p => p[1])) - 4), maxy = Math.ceil(Math.max(...P.map(p => p[1])) + 4);
      // tail fin: a small fork off the last vertebra
      const tl = P[P.length - 1], tp = P[P.length - 2], ta = Math.atan2(tl[1] - tp[1], tl[0] - tp[0]) + Math.sin(k.ph - 1.2) * 0.4;
      const fin = [];
      for (let q = 1; q <= 3; q++) for (const s of [-1, 1]) fin.push([Math.round(tl[0] + Math.cos(ta + s * 0.5) * q * k.f), Math.round(tl[1] + Math.sin(ta + s * 0.5) * q * k.f)]);
      for (let y = miny; y <= maxy; y++) for (let x = minx; x <= maxx; x++) {
        const s = inK(x + 0.5, y + 0.5);
        if (s < 0) {
          if (inK(x - 1.5, y - 1.5) >= 0 && ((x + y) & 1) === 0) { c.fillStyle = INK; c.fillRect(x, y, 1, 1); }
          continue;
        }
        const edge = inK(x + 1.5, y + 0.5) < 0 || inK(x - 0.5, y + 0.5) < 0 || inK(x + 0.5, y + 1.5) < 0 || inK(x + 0.5, y - 0.5) < 0;
        const patch = (idx === 0 ? (s === 1 || s === 2 || s === 5) : (s === 3 || s === 4)) && ((x * 3 + y) % 5 !== 0);
        c.fillStyle = edge || patch ? INK : '#fff';
        c.fillRect(x, y, 1, 1);
      }
      c.fillStyle = INK;
      fin.forEach(([x, y]) => c.fillRect(x, y, 1, 1));
      // eyes
      const e = P[0], ea = k.a;
      for (const s of [-1, 1]) c.fillRect(Math.round(e[0] + Math.cos(ea) * 0.6 - Math.sin(ea) * 1 * s * k.f), Math.round(e[1] + Math.sin(ea) * 0.6 + Math.cos(ea) * 1 * s * k.f), 1, 1);
    });
  }

  renderVals() {
    const i = this.state.sel, w = WORKS[i];
    return {
      plots: WORKS.map((x, j) => ({ aria: `Plot ${pad2(j + 1)}: ${x.name}${x.href ? '' : ' (locked)'}`, cur: j === i ? 'true' : 'false', pick: () => this.pick(j) })),
      pads: PADS.map((_, j) => ({ on: () => { this.hovPad = j; }, off: () => { if (this.hovPad === j) this.hovPad = -1; } })),
      plates: WORKS.map((x, j) => ({ show: j === i ? 'block' : 'none', img: x.img ? (IMG_MAP[x.img] || x.img) : '', alt: `${x.name} — key screen`, art: x.art || '' })),
      no: pad2(i + 1), total: pad2(N), name: w.name, lede: w.lede,
      meta: w.meta.map(([k, v]) => ({ k, v })),
      href: w.href ? (HREF_MAP[w.href] || '') : '', locked: !w.href,
      tag: w.href ? 'Open' : 'Under construction',
      tagBg: w.href ? '#141414' : '#fff', tagInk: w.href ? '#fff' : '#141414',
      prev: () => this.pick((i + N - 1) % N),
      next: () => this.pick((i + 1) % N),
      callKoi: (e) => {
        if (e.target.closest('.plot,.padBtn')) return;
        const r = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - r.left) / CELL, y = (e.clientY - r.top) / CELL;
        if (this.koi) this.koi[0].call = [x, y];
        this.rings.push({ x, y, t: 0 });
      },
      invLabel: this.state.inv ? '◐ light' : '◑ invert',
      invPressed: this.state.inv ? 'true' : 'false',
      toggleInvert: () => {
        const inv = !this.state.inv;
        try { localStorage.setItem('mh-invert', inv ? '1' : '0'); } catch (_) { /* private mode */ }
        window.dispatchEvent(new Event('mh-invert'));
        this.setState({ inv });
      },
    };
  }
}

export default function Works() {
  const [state, setState] = useState({ sel: 0, inv: false });
  const stateRef = useRef(state);
  stateRef.current = state;
  const navigate = useNavigate();
  const boardRef = useRef(null);
  if (boardRef.current === null) {
    boardRef.current = new Board(
      () => stateRef.current,
      (patch) => { stateRef.current = { ...stateRef.current, ...patch }; setState(stateRef.current); },
    );
  }
  const board = boardRef.current;
  board.navigate = navigate;

  useEffect(() => {
    board.mount();
    return () => board.unmount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // mirrors the source's componentDidUpdate: repaint any plate canvas that
  // hasn't been painted yet (each one paints once, then is marked done)
  useEffect(() => { board.paintArt(); });

  const rv = board.renderVals();
  const hoverInvert = (e) => { e.currentTarget.style.background = '#141414'; e.currentTarget.style.color = '#fff'; };
  const unhoverInvert = (e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#141414'; };
  const hoverGhost = (e) => { e.currentTarget.style.background = '#141414'; e.currentTarget.style.color = '#fff'; };
  const unhoverGhost = (e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#141414'; };
  const hoverCTA = (e) => { e.currentTarget.style.background = '#8b1a1a'; };
  const unhoverCTA = (e) => { e.currentTarget.style.background = '#141414'; };

  return (
    <div className="mh-works" style={{ minHeight: '100vh', display: 'grid', gridTemplateRows: 'auto 1fr auto', background: '#fff' }}>

      <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
        <defs>
          <filter id="px4" x="0" y="0" width="100%" height="100%">
            <feFlood x="2" y="2" width="1" height="1" />
            <feComposite width="4" height="4" />
            <feTile result="g" />
            <feComposite in="SourceGraphic" in2="g" operator="in" />
            <feMorphology operator="dilate" radius="2" />
          </filter>
          <filter id="px9" x="0" y="0" width="100%" height="100%">
            <feFlood x="4" y="4" width="1" height="1" />
            <feComposite width="9" height="9" />
            <feTile result="g" />
            <feComposite in="SourceGraphic" in2="g" operator="in" />
            <feMorphology operator="dilate" radius="4.5" />
          </filter>
          <filter id="px16" x="0" y="0" width="100%" height="100%">
            <feFlood x="8" y="8" width="1" height="1" />
            <feComposite width="16" height="16" />
            <feTile result="g" />
            <feComposite in="SourceGraphic" in2="g" operator="in" />
            <feMorphology operator="dilate" radius="8" />
          </filter>
        </defs>
      </svg>

      <header style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', gap: '10px 24px', padding: 'clamp(10px,1.8vh,18px) clamp(14px,2.4vw,36px)', borderBottom: '3px solid #141414' }}>
        <Link to="/" style={{ fontFamily: "'Pixelify Sans',monospace", fontWeight: 700, fontSize: 'clamp(20px,1.8vw,28px)', letterSpacing: '.06em' }}>MAEHLO</Link>
        <span style={{ fontSize: 'clamp(15px,1.15vw,19px)', letterSpacing: '.12em', textTransform: 'uppercase' }}>Selected works — site plan · dwg. 03</span>
        <nav style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 'clamp(12px,1.4vw,22px)', fontSize: 'clamp(16px,1.2vw,20px)', textTransform: 'uppercase' }}>
          <span style={{ color: '#8b1a1a' }}>→ Work</span>
          <Link to="/thinking">Thinking</Link>
          <Link to="/">Pond</Link>
          <Link to="/resume">Resume</Link>
          <button type="button" onClick={rv.toggleInvert} aria-pressed={rv.invPressed}
            style={{ fontFamily: 'inherit', fontSize: 'inherit', textTransform: 'uppercase', background: '#fff', color: '#141414', border: 0, cursor: 'pointer', padding: '0 8px', whiteSpace: 'nowrap', boxShadow: '0 -2px 0 0 #141414,0 2px 0 0 #141414,-2px 0 0 0 #141414,2px 0 0 0 #141414' }}
            onMouseEnter={hoverInvert} onMouseLeave={unhoverInvert}>{rv.invLabel}</button>
        </nav>
      </header>

      <main style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,420px),1fr))', gap: 'clamp(16px,2vw,32px)', padding: 'clamp(14px,2.4vh,28px) clamp(14px,2.4vw,36px)', alignItems: 'stretch' }}>

        <section aria-label="Site plan — pick a plot" style={{ position: 'relative', minHeight: 'clamp(380px,62vh,720px)', background: '#fff', boxShadow: '0 -3px 0 0 #141414,0 3px 0 0 #141414,-3px 0 0 0 #141414,3px 0 0 0 #141414' }}>
          <div id="plan" onClick={rv.callKoi} style={{ position: 'absolute', inset: 0, overflow: 'hidden', cursor: 'crosshair' }}>
            <canvas id="planCv" aria-hidden="true" style={{ position: 'absolute', left: 0, top: 0, imageRendering: 'pixelated' }} />
            {rv.plots.map((p, j) => (
              <button key={j} type="button" className="plot" onClick={p.pick} onMouseEnter={p.pick} onFocus={p.pick}
                aria-label={p.aria} aria-pressed={p.cur}
                style={{ position: 'absolute', left: 0, top: 0, width: 0, height: 0, background: 'none', border: 0, padding: 0, cursor: 'pointer' }} />
            ))}
            {rv.pads.map((pd, j) => (
              <Link key={j} className="padBtn" to="/works/stack" onMouseEnter={pd.on} onMouseLeave={pd.off} onFocus={pd.on} onBlur={pd.off}
                aria-label="A lily pad — something's under it"
                style={{ position: 'absolute', left: 0, top: 0, width: 0, height: 0, borderRadius: '50%', cursor: 'pointer' }} />
            ))}
          </div>
          <span style={{ position: 'absolute', left: 12, top: 10, zIndex: 2, background: '#fff', padding: '0 6px', fontSize: 'clamp(14px,1.05vw,17px)', letterSpacing: '.12em', textTransform: 'uppercase', pointerEvents: 'none' }}>Pond site · 5 plots · 1:200</span>
        </section>

        <section aria-live="polite" style={{ display: 'grid', gridTemplateRows: 'auto auto 1fr auto', alignContent: 'start', background: '#fff', boxShadow: '0 -3px 0 0 #141414,0 3px 0 0 #141414,-3px 0 0 0 #141414,3px 0 0 0 #141414,10px 10px 0 #141414' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, padding: '6px 14px', borderBottom: '3px solid #141414' }}>
            <span style={{ fontSize: 'clamp(15px,1.15vw,19px)', letterSpacing: '.14em', textTransform: 'uppercase', fontVariantNumeric: 'tabular-nums' }}>Plot {rv.no} / {rv.total}</span>
            <span style={{ padding: '0 8px', fontSize: 'clamp(14px,1.05vw,17px)', letterSpacing: '.12em', textTransform: 'uppercase', background: rv.tagBg, color: rv.tagInk, boxShadow: '0 -2px 0 0 #141414,0 2px 0 0 #141414,-2px 0 0 0 #141414,2px 0 0 0 #141414', whiteSpace: 'nowrap' }}>{rv.tag}</span>
          </div>

          <div style={{ padding: '14px 14px 0' }}>
            <div id="plate" style={{ position: 'relative', aspectRatio: '16/10', background: '#efeeea', overflow: 'hidden', boxShadow: '0 -2px 0 0 #141414,0 2px 0 0 #141414,-2px 0 0 0 #141414,2px 0 0 0 #141414' }}>
              {rv.plates.map((pl, j) => (
                <div key={j} className="plateImg" style={{ position: 'absolute', inset: 0, display: pl.show }}>
                  {pl.img && <img data-src={pl.img} alt={pl.alt} draggable={false} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />}
                  {pl.art && <canvas className="plateArt" data-art={pl.art} width="160" height="90" role="img" aria-label={pl.alt} style={{ display: 'block', width: '100%', height: '100%', background: '#fff', imageRendering: 'pixelated' }} />}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gap: 12, padding: '16px 14px', alignContent: 'start' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: "'Pixelify Sans',monospace", fontWeight: 700, fontSize: 'clamp(46px,5vw,84px)', lineHeight: .85, fontVariantNumeric: 'tabular-nums' }}>{rv.no}</span>
              <h1 style={{ margin: 0, fontFamily: "'Pixelify Sans',monospace", fontWeight: 500, fontSize: 'clamp(28px,2.6vw,44px)', lineHeight: 1 }}>{rv.name}</h1>
            </div>
            <p style={{ margin: 0, maxWidth: '52ch', fontSize: 'clamp(18px,1.4vw,23px)', lineHeight: 1.15, color: '#2a2926', textWrap: 'pretty' }}>{rv.lede}</p>
            <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: 'auto minmax(0,1fr)', columnGap: 18, rowGap: 4, fontSize: 'clamp(16px,1.2vw,20px)', lineHeight: 1.1, borderTop: '2px dashed #141414', paddingTop: 10 }}>
              {rv.meta.map((m, j) => (
                <React.Fragment key={j}>
                  <dt style={{ textTransform: 'uppercase', letterSpacing: '.1em', color: '#6d6a63' }}>{m.k}</dt>
                  <dd style={{ margin: 0 }}>{m.v}</dd>
                </React.Fragment>
              ))}
            </dl>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', padding: '12px 14px 16px', borderTop: '3px solid #141414' }}>
            {rv.href && (
              <Link to={rv.href} style={{ padding: '4px 14px', background: '#141414', color: '#fff', fontSize: 'clamp(17px,1.3vw,21px)', letterSpacing: '.12em', textTransform: 'uppercase', whiteSpace: 'nowrap', boxShadow: '0 -2px 0 0 #141414,0 2px 0 0 #141414,-2px 0 0 0 #141414,2px 0 0 0 #141414,5px 5px 0 #8b1a1a' }}
                onMouseEnter={hoverCTA} onMouseLeave={unhoverCTA}>▶ Enter case study</Link>
            )}
            {rv.locked && (
              <span style={{ padding: '4px 14px', color: '#6d6a63', fontSize: 'clamp(17px,1.3vw,21px)', letterSpacing: '.12em', textTransform: 'uppercase', whiteSpace: 'nowrap', boxShadow: '0 -2px 0 0 #9b9890,0 2px 0 0 #9b9890,-2px 0 0 0 #9b9890,2px 0 0 0 #9b9890' }}>▣ Locked — still building</span>
            )}
            <span style={{ flex: 1 }} />
            <button type="button" onClick={rv.prev} aria-label="Previous plot" style={{ width: 40, height: 36, background: '#fff', border: 0, cursor: 'pointer', fontFamily: 'inherit', fontSize: 22, boxShadow: '0 -2px 0 0 #141414,0 2px 0 0 #141414,-2px 0 0 0 #141414,2px 0 0 0 #141414' }}
              onMouseEnter={hoverGhost} onMouseLeave={unhoverGhost}>◀</button>
            <button type="button" onClick={rv.next} aria-label="Next plot" style={{ width: 40, height: 36, background: '#fff', border: 0, cursor: 'pointer', fontFamily: 'inherit', fontSize: 22, boxShadow: '0 -2px 0 0 #141414,0 2px 0 0 #141414,-2px 0 0 0 #141414,2px 0 0 0 #141414' }}
              onMouseEnter={hoverGhost} onMouseLeave={unhoverGhost}>▶</button>
          </div>
        </section>
      </main>

      <footer style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '8px 24px', padding: '8px clamp(14px,2.4vw,36px)', borderTop: '3px solid #141414', fontSize: 'clamp(15px,1.1vw,18px)', letterSpacing: '.12em', textTransform: 'uppercase' }}>
        <span>← → pick a plot · enter to open · click the water to call the koi · lift a lily pad</span>
        <span style={{ fontVariantNumeric: 'tabular-nums' }}>Maehlo · dwg. 03 · rev. a</span>
      </footer>
    </div>
  );
}
