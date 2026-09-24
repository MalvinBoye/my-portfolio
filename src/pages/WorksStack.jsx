import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './WorksStack.css';

// ---------------------------------------------------------------------------
// Ported from the design handoff's "Works Stack.dc.html" — the hidden
// infinite folder loop under a lily pad, routed at /works/stack. Scroll is
// virtual and unbounded: wheel/drag push a target position, only nine
// folders around the playhead exist in the DOM at once (recycled and
// redrawn as they come back around), each rendered in 3D perspective.
// A deterministic hash decides, per slot, whether a folder is secretly the
// red YouTube folder instead of the next real project — same odds and
// cooldown as the source, so the loop is stable across visits/scrollback.
// ---------------------------------------------------------------------------

const WORKS = [
  { name: 'Stuff', href: 'Stuff - case study.dc.html', motif: 'list',
    lede: "A list for a brain that wanders — because opening one shouldn't feel like being told off.",
    meta: [['Role', 'Research, product, UI, illustration'], ['Timeline', '9 rounds · 2026'], ['Tools', 'Procreate, Figma, HTML/CSS']] },
  { name: 'Maable', href: 'Maable - case study.dc.html', motif: 'xp',
    lede: 'Productivity that pays you back, instead of keeping a ledger of what you owe it.',
    meta: [['Role', 'Product, design engineering, front end'], ['Timeline', '2026 · live'], ['Tools', 'React, Vite, Supabase, Figma']] },
  { name: 'Maehlo', href: 'Maehlo - case study.dc.html', motif: 'koi',
    lede: 'This site. Koi, architecture plans and 90s pixels — a pond you can feed.',
    meta: [['Role', 'Design, motion, front end'], ['Type', 'Portfolio']] },
  { name: 'Connect', motif: 'link', href: 'Connect - case study.dc.html',
    lede: 'A dating app built as a critique of dating apps, designed to succeed the moment you leave.', meta: [['Role', 'Solo design, full stack'], ['Status', 'Live']] },
  { name: 'DormDrop', motif: 'box', href: 'DormDrop - case study.dc.html',
    lede: 'A student marketplace where every listing traces back to a verified student.', meta: [['Role', 'UX, front end'], ['Team', '3 people']] },
];
const YT = { name: 'YouTube', motif: 'play', yt: true,
  lede: 'The secret folder. Where I talk about making videos — process, edits, and everything behind the channel.',
  meta: [['Type', 'Channel'], ['Topic', 'Making videos'], ['Found', 'By scrolling long enough']] };
const N = WORKS.length;
const pad2 = (n) => String(n).padStart(2, '0');
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const mod = (a, n) => ((a % n) + n) % n;
const INK = '#141414', RED = '#8b1a1a';
// The page inverts as a whole in dark mode; the secret folder's red is
// pre-negated so it lands back on true red after the flip.
const inv = () => document.documentElement.getAttribute('data-inv') === '1';
const redNow = () => inv() ? '#74e5e5' : RED;
const POOL = 9;

// prototype file → app route, per the handoff's route table. WORKS/YT stay
// verbatim; only the link-rendering layer translates the href.
const HREF_MAP = {
  'Stuff - case study.dc.html': '/work/stuff',
  'Maable - case study.dc.html': '/work/maable',
  'Maehlo - case study.dc.html': '/work/maehlo',
  'Connect - case study.dc.html': '/work/connect',
  'DormDrop - case study.dc.html': '/work/dormdrop',
  'Maelo - YouTube study.dc.html': '/work/maelo',
};

// Deterministic per-slot dice, so the loop is stable when you scroll back:
// roughly one slot in nine hides the YouTube folder, never two in a row,
// never in the first handful.
function hash(i) { let x = Math.imul(i ^ 0x9e3779b9, 0x85ebca6b); x ^= x >>> 13; x = Math.imul(x, 0xc2b2ae35); x ^= x >>> 16; return (x >>> 0) / 4294967296; }
// ~1 in 45 folders, never in the first two loops, never twice within 20.
const YT_P = 0.022, YT_MIN = 16, YT_GAP = 20;
function ytRaw(i) { return i > YT_MIN && hash(i) < YT_P; }
function isYT(i) { if (!ytRaw(i)) return false; for (let k = i - 1; k >= Math.max(0, i - YT_GAP); k--) if (ytRaw(k)) return false; return true; }
function workAt(i) {
  if (isYT(i)) return { w: YT, n: -1 };
  let yts = 0;
  for (let k = YT_MIN; k < i; k++) if (isYT(k)) yts++;
  const n = mod(i - yts, N);
  return { w: WORKS[n], n };
}

const F3 = {
  '0': ['XXX', 'X.X', 'X.X', 'X.X', 'XXX'], '1': ['.X.', 'XX.', '.X.', '.X.', 'XXX'], '2': ['XXX', '..X', 'XXX', 'X..', 'XXX'],
  '3': ['XXX', '..X', '.XX', '..X', 'XXX'], '4': ['X.X', 'X.X', 'XXX', '..X', '..X'], '5': ['XXX', 'X..', 'XXX', '..X', 'XXX'],
  '6': ['XXX', 'X..', 'XXX', 'X.X', 'XXX'], '7': ['XXX', '..X', '.X.', '.X.', '.X.'], '8': ['XXX', 'X.X', 'XXX', 'X.X', 'XXX'],
  '9': ['XXX', 'X.X', 'XXX', '..X', 'XXX'], ' ': ['...', '...', '...', '...', '...'], '?': ['XXX', '..X', '.X.', '...', '.X.'],
  A: ['.X.', 'X.X', 'XXX', 'X.X', 'X.X'], B: ['XX.', 'X.X', 'XX.', 'X.X', 'XX.'], C: ['.XX', 'X..', 'X..', 'X..', '.XX'],
  D: ['XX.', 'X.X', 'X.X', 'X.X', 'XX.'], E: ['XXX', 'X..', 'XX.', 'X..', 'XXX'], F: ['XXX', 'X..', 'XX.', 'X..', 'X..'],
  H: ['X.X', 'X.X', 'XXX', 'X.X', 'X.X'], I: ['XXX', '.X.', '.X.', '.X.', 'XXX'], K: ['X.X', 'X.X', 'XX.', 'X.X', 'X.X'],
  L: ['X..', 'X..', 'X..', 'X..', 'XXX'], M: ['X.X', 'XXX', 'XXX', 'X.X', 'X.X'], N: ['X.X', 'XXX', 'XXX', 'XXX', 'X.X'],
  O: ['XXX', 'X.X', 'X.X', 'X.X', 'XXX'], P: ['XX.', 'X.X', 'XX.', 'X..', 'X..'], R: ['XX.', 'X.X', 'XX.', 'X.X', 'X.X'],
  S: ['.XX', 'X..', '.X.', '..X', 'XX.'], T: ['XXX', '.X.', '.X.', '.X.', '.X.'], U: ['X.X', 'X.X', 'X.X', 'X.X', 'XXX'],
  W: ['X.X', 'X.X', 'X.X', 'XXX', 'X.X'], Y: ['X.X', 'X.X', '.X.', '.X.', '.X.'],
};
function ptext(c, s, x, y, sc) {
  sc = sc || 1;
  for (const ch of s) {
    const g = F3[ch] || F3[' '];
    for (let r = 0; r < 5; r++) for (let q = 0; q < 3; q++) if (g[r][q] === 'X') c.fillRect(x + q * sc, y + r * sc, sc, sc);
    x += 4 * sc;
  }
}

// A folder, 80×60 cells: back sheet peeking out, tab, body, a label plate
// with the project name, and a motif stamped on the front.
function drawFolder(cv, w, idx) {
  const W = 80, H = 60;
  if (cv.width !== W) { cv.width = W; cv.height = H; }
  const c = cv.getContext('2d');
  c.clearRect(0, 0, W, H);
  const ink = w.yt ? RED : INK;
  const rect = (x, y, ww, hh, fill) => { c.fillStyle = ink; c.fillRect(x, y, ww, hh); c.fillStyle = fill; c.fillRect(x + 1, y + 1, ww - 2, hh - 2); };
  // dither shadow
  c.fillStyle = INK;
  for (let y = 12; y < 58; y++) for (let x = 6; x < 78; x++) if (((x + y) & 1) === 0 && (x > 74 || y > 54)) c.fillRect(x, y, 1, 1);
  // papers
  rect(10, 4, 50, 14, '#fff');
  for (let y = 7; y < 16; y += 2) { c.fillStyle = ink; c.fillRect(14, y, 20 + ((y + idx) % 3) * 8, 1); }
  rect(16, 2, 44, 10, '#fff');
  // tab + body
  rect(3, 8, 26, 8, w.yt ? RED : '#fff');
  rect(3, 13, 72, 42, w.yt ? RED : '#fff');
  // fold line
  c.fillStyle = w.yt ? '#fff' : ink;
  for (let x = 5; x < 73; x += 2) c.fillRect(x, 18, 1, 1);
  // label plate
  const name = w.name.toUpperCase();
  const lw = name.length * 4 + 7;
  rect(8, 41, Math.max(lw, 22), 10, '#fff');
  c.fillStyle = ink; ptext(c, name, 12, 44);
  // motif
  c.fillStyle = w.yt ? '#fff' : ink;
  const M = w.motif;
  if (M === 'list') { for (let r = 0; r < 3; r++) { c.fillRect(46, 22 + r * 6, 4, 4); c.fillStyle = w.yt ? RED : '#fff'; if (r < 2) c.fillRect(47, 23 + r * 6, 2, 2); c.fillStyle = ink; c.fillRect(52, 23 + r * 6, 16 - r * 3, 1); } }
  if (M === 'xp') { c.fillRect(44, 24, 26, 1); c.fillRect(44, 30, 26, 1); c.fillRect(44, 24, 1, 7); c.fillRect(69, 24, 1, 7); for (let x = 46; x < 62; x += 2) c.fillRect(x, 26, 1, 3); ptext(c, 'XP', 52, 33); }
  if (M === 'koi') { [[46, 28], [48, 27], [50, 27], [52, 27], [54, 28], [56, 28], [58, 29], [60, 28], [62, 27], [62, 30], [48, 29], [50, 29], [52, 29], [54, 29], [56, 29]].forEach(([x, y]) => c.fillRect(x, y, 2, 2)); c.fillStyle = '#fff'; c.fillRect(47, 28, 1, 1); }
  if (M === 'link') { c.fillRect(46, 24, 7, 7); c.fillRect(61, 30, 7, 7); c.fillStyle = '#fff'; c.fillRect(47, 25, 5, 5); c.fillRect(62, 31, 5, 5); c.fillStyle = ink; for (let k = 0; k < 9; k++) c.fillRect(53 + k, 30 + Math.round(k * 0.4), 1, 1); }
  if (M === 'box') { c.fillRect(48, 26, 16, 1); c.fillRect(48, 37, 16, 1); c.fillRect(48, 26, 1, 12); c.fillRect(63, 26, 1, 12); c.fillRect(48, 30, 16, 1); for (let k = 0; k < 5; k++) { c.fillRect(56 - k, 20 + k, 1, 1); c.fillRect(56 + k, 20 + k, 1, 1); } c.fillRect(56, 16, 1, 9); }
  if (M === 'play') {
    c.fillStyle = '#fff'; c.fillRect(44, 22, 26, 16); c.fillStyle = RED;
    for (let r = 0; r < 9; r++) c.fillRect(54, 26 + r, Math.min(r, 8 - r) + 1, 1);
    c.fillStyle = '#fff'; ptext(c, '?', 70, 42);
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
    // The source is a standalone page that locks html/body scroll for its
    // whole lifetime (`html,body{overflow:hidden}`); here that has to be
    // scoped to this route's mount/unmount instead, since a permanent global
    // rule would leak into every other page once this route had been
    // visited once. Without it, a wheel event over #stk (which itself never
    // scrolls — it's position:fixed) would bubble and scroll the real page
    // underneath, on top of the virtual stack scroll.
    this._prevHtmlOverflow = document.documentElement.style.overflow;
    this._prevBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    this._invRe = () => this.setState({}); // forceUpdate-equivalent: re-renders so redNow() is re-read
    window.addEventListener('mh-invert', this._invRe);
    window.addEventListener('storage', this._invRe);
    try { sessionStorage.setItem('mh-from', 'stack'); } catch (_) { /* private mode */ }
    try { this.setState({ inv: localStorage.getItem('mh-invert') === '1' }); } catch (_) { /* private mode */ }
    this.p = 0; this.tgt = 0; this.idle = 0;
    this.els = [...document.querySelectorAll('#stkStage .fd')];
    this.els.forEach((el) => {
      el.addEventListener('click', () => {
        const idx = +el.dataset.idx;
        if (idx === Math.round(this.p)) { const { w } = workAt(idx); const h = this.hrefOf(w); if (h) this.navigate(h); }
        else this.tgt = idx;
      });
    });
    this._key = (e) => {
      if (['ArrowDown', 'ArrowRight', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); this.tgt = Math.round(this.tgt) + 1; this.idle = 0.3; }
      if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); this.tgt = Math.round(this.tgt) - 1; this.idle = 0.3; }
      if (e.key === 'Enter') { const { w } = workAt(Math.round(this.p)); const h = this.hrefOf(w); if (h) this.navigate(h); }
    };
    window.addEventListener('keydown', this._key);
    this._mv = (e) => { if (this.drag == null) return; const dy = e.clientY - this.drag; this.drag = e.clientY; this.tgt -= dy / (window.innerHeight * 0.6); this.idle = 0; };
    this._up = () => { this.drag = null; };
    window.addEventListener('pointermove', this._mv);
    window.addEventListener('pointerup', this._up);
    this.grid();
    this._gr = () => this.grid();
    window.addEventListener('resize', this._gr);
    this._iv = setInterval(() => this.tick(), 16);
    this.tick();
  }

  unmount() {
    document.documentElement.style.overflow = this._prevHtmlOverflow;
    document.body.style.overflow = this._prevBodyOverflow;
    clearInterval(this._iv);
    window.removeEventListener('mh-invert', this._invRe);
    window.removeEventListener('storage', this._invRe);
    window.removeEventListener('keydown', this._key);
    window.removeEventListener('pointermove', this._mv);
    window.removeEventListener('pointerup', this._up);
    window.removeEventListener('resize', this._gr);
  }

  hrefOf(w) { return w.yt ? 'Maelo - YouTube study.dc.html' : (w.href || ''); }
  navigate(dcHref) { const to = HREF_MAP[dcHref]; if (to && this._navigateFn) this._navigateFn(to); }

  // Scroll is virtual and unbounded. Wheel and drag push a target; when the
  // input goes quiet the target settles onto the nearest folder, which is
  // the dwell. Only the nine folders around the playhead exist in the DOM —
  // they're recycled and redrawn as they come round again.
  tick() {
    const dt = 0.016;
    this.idle += dt;
    if (this.idle > 0.16 && this.drag == null) this.tgt += (Math.round(this.tgt) - this.tgt) * Math.min(1, dt * 9);
    this.p += (this.tgt - this.p) * Math.min(1, dt * 7);
    const vw = window.innerWidth || 1200, vh = window.innerHeight || 800;
    const base = Math.floor(this.p) - 3;
    const cw = (this.els[0] && this.els[0].offsetWidth) || 300, ch = (this.els[0] && this.els[0].offsetHeight) || 250;
    const sx = Math.max(vw * 0.27, cw * 1.08), sy = Math.max(vh * 0.38, ch * 1.1);
    this.els.forEach((el, k) => {
      const idx = base + mod(k - base, POOL);
      if (+el.dataset.idx !== idx || el.dataset.drawn !== '1') {
        el.dataset.idx = idx; el.dataset.drawn = '1';
        const { w, n } = workAt(idx);
        const cv = el.querySelector('.fdCv');
        drawFolder(cv, w, idx);
        cv.setAttribute('data-yt', w.yt ? '1' : '');
        el.querySelector('.fdNo').textContent = w.yt ? 'fig. ??' : 'fig. ' + pad2(n + 1);
        el.querySelector('.fdName').textContent = w.name;
      }
      const o = idx - this.p, s = Math.min(1, Math.abs(o)), sg = o >= 0 ? 1 : -1;
      const x = o >= 0 ? o * sx : o * Math.max(vw * 0.16, cw * 0.8);
      const y = o >= 0 ? -o * sy : -o * Math.max(vh * 0.42, ch * 1.1);
      const z = o >= 0 ? -o * 320 : -o * 60;
      el.style.transform = `translate(-50%,-50%) translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,${z.toFixed(1)}px) `
        + `rotateX(${(46 * s).toFixed(2)}deg) rotateY(${(-16 * s * sg).toFixed(2)}deg) rotateZ(${(-12 * s).toFixed(2)}deg)`;
      const a = Math.abs(o);
      el.style.zIndex = String(100 - Math.round(a * 10) - (o < 0 ? 5 : 0));
      el.style.opacity = o < 0 ? String(Math.round(clamp(1 - (a - 0.15) / 0.45, 0, 1) * 4) / 4)
        : a > 3.2 ? '0' : a > 2.4 ? (1 - (a - 2.4) / 0.8).toFixed(2) : '1';
      const inn = el.querySelector('.fdIn');
      inn.style.filter = a < 0.35 ? 'none' : a < 1.2 ? 'url(#px9)' : 'url(#px16)';
    });
    const cur = Math.round(this.p);
    const info = Math.round(clamp(1 - (Math.abs(this.p - cur) - 0.08) / 0.2, 0, 1) * 4) / 4;
    const box = document.getElementById('stkInfo');
    if (box) box.style.opacity = String(info);
    if (cur !== this.state.i) this.setState({ i: cur });
  }

  grid() {
    const cv = document.getElementById('stkGrid');
    if (!cv || !window.innerWidth) return;
    const PX = 4, cw = Math.ceil(window.innerWidth / PX), ch = Math.ceil(window.innerHeight / PX);
    cv.width = cw; cv.height = ch;
    cv.style.width = cw * PX + 'px'; cv.style.height = ch * PX + 'px';
    const c = cv.getContext('2d');
    c.fillStyle = INK;
    for (let y = 5; y < ch; y += 10) for (let x = 5; x < cw; x += 10) c.fillRect(x, y, 1, 1);
    const cx = cw / 2, cy = ch * 0.48;
    for (let t = -1; t <= 1; t += 0.004) if (Math.floor((t + 1) * 125) % 3 !== 0) c.fillRect(Math.round(cx + t * cw * 0.55), Math.round(cy - t * ch * 0.8), 1, 1);
  }

  renderVals() {
    const i = this.state.i, { w, n } = workAt(i);
    const loop = Math.floor(i / N) + 1;
    return {
      pool: new Array(POOL).fill(0),
      meta: w.meta.map(([k, v]) => ({ k, v })),
      activeNo: w.yt ? '??' : pad2(n + 1),
      noColor: w.yt ? redNow() : INK,
      activeName: w.yt ? 'You found the YouTube folder' : w.name,
      activeLede: w.lede,
      activeHref: this.hrefOf(w),
      activeCta: w.yt ? 'Open the secret study →' : 'Open case study →',
      ctaShadow: w.yt ? redNow() : INK,
      activeSoon: !this.hrefOf(w),
      countTxt: w.yt ? '?? / ??' : `loop ${pad2(Math.max(1, loop))} · ${pad2(n + 1)} / ${pad2(N)}`,
      index: WORKS.map((x, j) => ({
        name: x.name, cur: !w.yt && j === n ? 'true' : 'false',
        color: !w.yt && j === n ? INK : '#a8a59d', pip: !w.yt && j === n ? INK : '#fff',
        go: () => { const d = mod(j - n, N); this.tgt = Math.round(this.p) + (w.yt ? d || N : d); this.idle = 0.3; },
      })),
      onWheel: (e) => { this.tgt += e.deltaY / 900; this.idle = 0; },
      onDown: (e) => { if (e.target.closest('a,button')) return; this.drag = e.clientY; },
    };
  }
}

export default function WorksStack() {
  const [state, setState] = useState({ i: 0, inv: false });
  const stateRef = useRef(state);
  stateRef.current = state;
  const navigate = useNavigate();
  const boardRef = useRef(null);
  if (boardRef.current === null) {
    boardRef.current = new Board(
      () => stateRef.current,
      (patch) => { stateRef.current = { ...stateRef.current, ...patch }; setState({ ...stateRef.current }); },
    );
  }
  const board = boardRef.current;
  board._navigateFn = navigate;

  useEffect(() => {
    board.mount();
    return () => board.unmount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rv = board.renderVals();
  const hoverGhost = (e) => { e.currentTarget.style.background = '#141414'; e.currentTarget.style.color = '#fff'; };
  const unhoverGhost = (e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#141414'; };

  return (
    <div className="mh-stack">
      <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
        <defs>
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

      <div id="stk" onWheel={rv.onWheel} onPointerDown={rv.onDown}
        style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#fff', touchAction: 'none', userSelect: 'none', overscrollBehavior: 'none' }}>

        <canvas id="stkGrid" aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: .35, imageRendering: 'pixelated' }} />

        <aside style={{ position: 'absolute', left: 0, top: 0, bottom: 0, zIndex: 20, width: 'clamp(150px,17vw,250px)', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 'clamp(10px,1.2vw,18px)', padding: 'clamp(14px,2.4vh,26px) 0 clamp(14px,2.4vh,26px) clamp(12px,1.4vw,22px)', pointerEvents: 'none' }}>
          <span style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontFamily: "'Pixelify Sans',monospace", fontWeight: 700, fontSize: 'clamp(26px,2.6vw,42px)', letterSpacing: '.06em', lineHeight: 1, alignSelf: 'start' }}>MAEHLO</span>
          <nav style={{ display: 'grid', gap: 3, alignContent: 'start', pointerEvents: 'auto', fontSize: 'clamp(16px,1.3vw,21px)', lineHeight: 1.05, textTransform: 'uppercase' }}>
            <Link to="/works">← Site plan</Link>
            <Link to="/thinking">Thinking</Link>
            <Link to="/">Pond</Link>
            <Link to="/resume">Resume</Link>
          </nav>
        </aside>

        <div style={{ position: 'absolute', left: 'clamp(170px,19vw,280px)', right: 'clamp(14px,2.4vw,36px)', top: 'clamp(14px,2.4vh,26px)', zIndex: 30, display: 'flex', justifyContent: 'space-between', gap: 16, fontSize: 'clamp(14px,1.05vw,17px)', textTransform: 'uppercase', letterSpacing: '.08em', pointerEvents: 'none' }}>
          <span style={{ background: '#fff', padding: '0 6px' }}>Under the lily pad · the stack</span>
          <span style={{ fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', background: '#fff', padding: '0 6px' }}>{rv.countTxt}</span>
        </div>

        <div id="stkStage" style={{ position: 'absolute', inset: 0, zIndex: 5, perspective: '1500px', perspectiveOrigin: '50% 42%' }}>
          {rv.pool.map((_, k) => (
            <figure key={k} className="fd" style={{ position: 'absolute', left: '50%', top: '48%', margin: 0, width: 'clamp(240px,28vw,480px)', cursor: 'pointer', willChange: 'transform', transformOrigin: '50% 50%', opacity: 0 }}>
              <div className="fdIn">
                <canvas className="fdCv" style={{ display: 'block', width: '100%', height: 'auto', imageRendering: 'pixelated' }} />
              </div>
              <figcaption style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginTop: 6, fontSize: 'clamp(13px,1vw,16px)', letterSpacing: '.1em', textTransform: 'uppercase' }}>
                <span className="fdNo" /><span className="fdName" />
              </figcaption>
            </figure>
          ))}
        </div>

        <div id="stkInfo" style={{ position: 'absolute', inset: 0, zIndex: 15, pointerEvents: 'none' }}>
          <dl style={{ position: 'absolute', left: 'clamp(170px,19vw,280px)', top: '44%', margin: 0, display: 'grid', gridTemplateColumns: 'auto minmax(0,1fr)', columnGap: 'clamp(12px,1.4vw,24px)', rowGap: 10, width: 'min(300px,calc(50vw - max(120px,14vw) - clamp(170px,19vw,280px) - 36px))', fontSize: 'clamp(15px,1.15vw,19px)', lineHeight: 1.1 }}>
            {rv.meta.map((m, j) => (
              <React.Fragment key={j}>
                <dt style={{ textTransform: 'uppercase', letterSpacing: '.08em', color: '#6d6a63' }}>{m.k}</dt>
                <dd style={{ margin: 0, textWrap: 'pretty' }}>{m.v}</dd>
              </React.Fragment>
            ))}
          </dl>

          <span style={{ position: 'absolute', left: 'clamp(160px,18vw,270px)', bottom: 'clamp(8px,1.4vh,18px)', fontFamily: "'Pixelify Sans',monospace", fontWeight: 700, fontSize: 'clamp(90px,11vw,190px)', lineHeight: .8, letterSpacing: '-.02em', fontVariantNumeric: 'tabular-nums', color: rv.noColor }}>{rv.activeNo}</span>

          <div style={{ position: 'absolute', left: 'clamp(330px,34vw,560px)', bottom: 'clamp(18px,3.4vh,40px)', display: 'grid', gap: 6, maxWidth: '36ch', pointerEvents: 'auto' }}>
            <span style={{ fontFamily: "'Pixelify Sans',monospace", fontSize: 'clamp(20px,1.8vw,30px)', lineHeight: 1 }}>{rv.activeName}</span>
            <span style={{ fontSize: 'clamp(15px,1.15vw,19px)', lineHeight: 1.15, color: '#3a3833', textWrap: 'pretty' }}>{rv.activeLede}</span>
            {rv.activeHref && (
              <Link to={HREF_MAP[rv.activeHref] || '/works'}
                style={{ justifySelf: 'start', marginTop: 4, padding: '2px 10px', fontSize: 'clamp(14px,1.05vw,17px)', textTransform: 'uppercase', letterSpacing: '.1em', whiteSpace: 'nowrap', boxShadow: `0 -2px 0 0 #141414,0 2px 0 0 #141414,-2px 0 0 0 #141414,2px 0 0 0 #141414,5px 5px 0 ${rv.ctaShadow}`, background: '#fff' }}
                onMouseEnter={hoverGhost} onMouseLeave={unhoverGhost}>{rv.activeCta}</Link>
            )}
            {rv.activeSoon && (
              <span style={{ justifySelf: 'start', marginTop: 4, padding: '2px 10px', fontSize: 'clamp(14px,1.05vw,17px)', textTransform: 'uppercase', letterSpacing: '.1em', color: '#6d6a63', whiteSpace: 'nowrap', boxShadow: '0 -2px 0 0 #9b9890,0 2px 0 0 #9b9890,-2px 0 0 0 #9b9890,2px 0 0 0 #9b9890' }}>Case study loading…</span>
            )}
          </div>
        </div>

        <ol style={{ position: 'absolute', right: 'clamp(14px,2.4vw,36px)', top: '50%', transform: 'translateY(-50%)', zIndex: 16, margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 'clamp(12px,2.2vh,22px)', justifyItems: 'end', textAlign: 'right' }}>
          {rv.index.map((x, j) => (
            <li key={j} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button type="button" onClick={x.go} aria-current={x.cur}
                style={{ background: 'none', border: 0, padding: 0, cursor: 'pointer', fontFamily: "'Pixelify Sans',monospace", fontSize: 'clamp(15px,1.25vw,20px)', letterSpacing: '.06em', textTransform: 'uppercase', color: x.color }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#141414'; }} onMouseLeave={(e) => { e.currentTarget.style.color = x.color; }}>{x.name}</button>
              <span aria-hidden="true" style={{ width: 8, height: 8, background: x.pip, boxShadow: '0 0 0 1px #141414' }} />
            </li>
          ))}
        </ol>

        <span style={{ position: 'absolute', right: 'clamp(14px,2.4vw,36px)', bottom: 'clamp(14px,2.4vh,26px)', zIndex: 16, fontSize: 'clamp(14px,1.05vw,17px)', letterSpacing: '.12em', textTransform: 'uppercase', pointerEvents: 'none' }}>scroll forever ↓</span>
      </div>
    </div>
  );
}
