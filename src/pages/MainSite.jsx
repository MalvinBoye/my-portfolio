import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './MainSite.css';
import { css, GRAIN } from '../utils/cssString';
import figureMask from '../images/figure-mask.png';
import starsMask from '../images/stars-mask.png';
import stuff1c from '../images/stuff-1c.png';
import maableDashboard from '../images/maable-dashboard.png';
import dormdrop1 from '../images/dormdrop-1.png';
import bagJala from '../images/bag-jala.png';
import bagGracias from '../images/bag-gracias.png';
import petMeeks from '../images/pet-meeks.png';

// supabase — same backend/table the poster board has always used, so notes
// left by visitors on earlier versions of this page survive.
const SB_URL = 'https://xhqrmuqhpdbuaepkizxl.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhocXJtdXFocGRidWFlcGtpenhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxMjEwOTMsImV4cCI6MjA5MzY5NzA5M30.jIppdRIHFPB4I59PxhZWF4Kg-yqtptvejuFl9NNyfas';

async function dbFetch(path, options = {}) {
  const res = await fetch(`${SB_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      'apikey': SB_KEY,
      'Authorization': `Bearer ${SB_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
      ...options.headers,
    },
  });
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const seg = (v, a, b) => clamp01((v - a) / (b - a));

// Each act (#act1, #act2) is taller than its own zoom needs — the extra
// scroll is a deliberate pause where the "01/02" reveal sits on screen by
// itself before the next section arrives, instead of the two colliding the
// instant the zoom finishes. Total act height in vh; ZOOM_FRACTION is how
// much of that height the zoom itself consumes.
const ACT_VH = 320;
const ZOOM_FRACTION = 160 / ACT_VH;
// The reveal's whole lifecycle (fade in → hold → fade out) is timed against
// the act's FULL height, not just the zoom portion, and finishes fading out
// well before that height is exhausted — i.e. well before the next section's
// top can reach the viewport, not right as it does. The gap between
// REVEAL_OUT[1] and 1.0 is a dead-quiet buffer (nothing on screen but paper)
// that exists specifically to absorb real-world scroll/render timing slop —
// finishing the fade at the exact instant the next section arrives leaves
// zero margin for that, which is what let them still collide in practice.
const REVEAL_IN = [130 / ACT_VH, 150 / ACT_VH];
const REVEAL_OUT = [200 / ACT_VH, 230 / ACT_VH];

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ── live clock — HH:MM, 24h, America/New_York ──────────────────────────────
function useClock() {
  const [clock, setClock] = useState('');
  useEffect(() => {
    function tick() {
      setClock(new Date().toLocaleTimeString('en-US', {
        timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit', hour12: false,
      }));
    }
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, []);
  return clock;
}

// ── generic typewriter — cycles a word list at the given speeds ────────────
function useTypewriter(words, typeMs, holdMs, deleteMs) {
  const [text, setText] = useState(() => prefersReducedMotion() ? words[words.length - 1] : '');
  const wordsRef = useRef(words);
  wordsRef.current = words;
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let idx = 0;
    let timeout;
    function step(i = 0, deleting = false) {
      const word = wordsRef.current[idx];
      if (!deleting && i <= word.length) {
        setText(word.slice(0, i));
        timeout = setTimeout(() => step(i + 1, false), typeMs);
      } else if (!deleting) {
        timeout = setTimeout(() => step(word.length, true), holdMs);
      } else if (i > 0) {
        setText(word.slice(0, i - 1));
        timeout = setTimeout(() => step(i - 1, true), deleteMs);
      } else {
        idx = (idx + 1) % wordsRef.current.length;
        step(0, false);
      }
    }
    step(0, false);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeMs, holdMs, deleteMs]);
  return text;
}

const NAMES = ['Malvin', 'Mallock', 'Maelo'];
const NOW_LIST = [
  'learning Korean through cinema',
  "drawing things that don't exist yet",
  'building Maable, live on the web',
  'looking for the next good problem',
];

// ── canvas particle field sampled from a mask image's silhouette ───────────
// tiny 5x5 pixel-art marks each particle in a DotField renders as, once the
// scroll zoom makes them large enough to resolve — plus, slash, dot-pair,
// dashes, X, bar, C, minus, backslash, diamond.
const GLYPHS = [
  ['..1..', '..1..', '11111', '..1..', '..1..'],
  ['.....', '....1', '..11.', '.1...', '1....'],
  ['..1..', '.1.1.', '.1.1.', '..1..', '.....'],
  ['.....', '.111.', '.....', '.111.', '.....'],
  ['1...1', '.1.1.', '..1..', '.1.1.', '1...1'],
  ['..1..', '..1..', '..1..', '..1..', '..1..'],
  ['.111.', '1...1', '1....', '1...1', '.111.'],
  ['.....', '11111', '.....', '.....', '.....'],
  ['1....', '.1...', '..1..', '...1.', '....1'],
  ['..1..', '.111.', '11111', '.111.', '..1..'],
].map(rows => {
  const cells = [];
  rows.forEach((r, y) => r.split('').forEach((c, x) => { if (c === '1') cells.push(x, y); }));
  return cells;
});

// night mode swaps every particle from ink greyscale to a cream/cyan/gold
// trio (ABGR-packed, matching the Uint32Array pixel format both fields
// write into) — see DotField.setNight() / MorphField below.
const NIGHT_COLS = [
  (255 << 24) | (230 << 16) | (239 << 8) | 242,
  (255 << 24) | (78 << 16) | (193 << 8) | 242,
  (255 << 24) | (214 << 16) | (127 << 8) | 74,
];
function paintNight(col, n) {
  for (let i = 0; i < n; i++) {
    const r = Math.random();
    col[i] = r < 0.42 ? NIGHT_COLS[0] : (r < 0.72 ? NIGHT_COLS[1] : NIGHT_COLS[2]);
  }
}

class DotField {
  constructor(canvas, src, count) {
    this.cv = canvas;
    this.ctx = canvas.getContext('2d', { alpha: true });
    this.count = count;
    this.ready = false;
    this.ar = 1;
    this.t = 0;
    const img = new Image();
    img.onload = () => this.sample(img);
    img.src = src;
  }
  sample(img) {
    const SW = 260, SH = Math.max(1, Math.round(SW * img.height / img.width));
    this.ar = img.height / img.width;
    const off = document.createElement('canvas');
    off.width = SW; off.height = SH;
    const o = off.getContext('2d');
    o.drawImage(img, 0, 0, SW, SH);
    const a = o.getImageData(0, 0, SW, SH).data;
    const pts = [];
    for (let y = 0; y < SH; y++) for (let x = 0; x < SW; x++) if (a[(y * SW + x) * 4 + 3] > 120) pts.push(x / SW, y / SH);
    const n = this.count, u = new Float32Array(n), v = new Float32Array(n),
      jx = new Float32Array(n), jy = new Float32Array(n), g = new Uint32Array(n),
      ph = new Float32Array(n), ox = new Float32Array(n), oy = new Float32Array(n),
      vx = new Float32Array(n), vy = new Float32Array(n), mass = new Float32Array(n),
      gi = new Uint8Array(n);
    const m = pts.length / 2 || 1;
    for (let i = 0; i < n; i++) {
      const k = (Math.random() * m) | 0;
      u[i] = pts[k * 2] || 0.5; v[i] = pts[k * 2 + 1] || 0.5;
      jx[i] = Math.random() - 0.5; jy[i] = Math.random() - 0.5;
      ph[i] = Math.random() * 6.283;
      mass[i] = 0.55 + Math.random() * 0.9;
      gi[i] = (Math.random() * GLYPHS.length) | 0;
      const spark = Math.random() < 0.04;
      const lv = spark ? 190 + ((Math.random() * 55) | 0) : 34 + ((Math.random() * 108) | 0);
      g[i] = (255 << 24) | (lv << 16) | (lv << 8) | lv;
      ox[i] = 0; oy[i] = 0;
    }
    Object.assign(this, { u, v, jx, jy, g, ph, ox, oy, vx, vy, mass, gi, SW });
    this.ready = true;
    if (this._want) { this._night = null; this.setNight(true); }
  }
  setNight(v) {
    this._want = v;
    if (!this.ready || this._night === v) return;
    this._night = v;
    if (v) { this._day = this._day || this.g.slice(); paintNight(this.g, this.count); }
    else if (this._day) this.g.set(this._day);
  }
  blast(x, y) {
    if (!this.ready) return;
    const { u, v, ox, oy, vx, vy, mass } = this;
    const dpr = Math.min(1.25, window.devicePixelRatio || 1);
    const R = 300 * dpr, R2 = R * R, force = 46 * dpr;
    const cw = this.cv.width, ch = this.cv.height;
    const boxW = Math.min(ch * 0.44, cw * 0.62) * (1 + this._p * this._p * 13);
    const boxH = boxW * this.ar, cx = cw / 2, cy = ch / 2;
    for (let i = 0, n = this.count; i < n; i++) {
      const px = cx + (u[i] - 0.5) * boxW + ox[i], py = cy + (v[i] - 0.5) * boxH + oy[i];
      const dx = px - x, dy = py - y, d2 = dx * dx + dy * dy;
      if (d2 > R2) continue;
      const d = Math.sqrt(d2) || 0.01, f = 1 - d / R;
      const imp = (f * f * force) / mass[i];
      const spin = (Math.random() - 0.5) * 0.7;
      vx[i] += (dx / d) * imp + (-dy / d) * imp * spin;
      vy[i] += (dy / d) * imp + (dx / d) * imp * spin;
    }
  }
  draw(p, mx, my, alpha) {
    this._p = p;
    const cv = this.cv;
    if (alpha <= 0.002) { cv.style.opacity = '0'; return; }
    const dpr = Math.min(1.25, window.devicePixelRatio || 1);
    const cw = Math.max(1, Math.round(cv.clientWidth * dpr)), ch = Math.max(1, Math.round(cv.clientHeight * dpr));
    if (cv.width !== cw || cv.height !== ch) { cv.width = cw; cv.height = ch; this.buf = null; }
    cv.style.opacity = alpha.toFixed(3);
    if (!this.ready) return;
    if (!this.buf) { this.img = this.ctx.createImageData(cw, ch); this.buf = new Uint32Array(this.img.data.buffer); }
    const buf = this.buf; buf.fill(0);
    this.t += 0.016;
    const boxW = Math.min(ch * 0.44, cw * 0.62) * (1 + p * p * 13);
    const boxH = boxW * this.ar;
    const cx = cw / 2, cy = ch / 2;
    const cell = boxW / this.SW;
    const dot = Math.max(1, Math.min(5, Math.round(cell * 0.95)));
    const R = 72 * dpr, R2 = R * R, push = 13 * dpr;
    const { u, v, jx, jy, g, ph, ox, oy, vx, vy, mass, gi } = this;
    const s = dot < 2 ? 0 : Math.max(1, dot - 1);
    const span = s * 5;
    const hasM = mx > -9000;
    for (let i = 0, n = this.count; i < n; i++) {
      let x = cx + (u[i] - 0.5) * boxW + jx[i] * cell * 1.6;
      let y = cy + (v[i] - 0.5) * boxH + jy[i] * cell * 1.6;
      x += Math.sin(this.t * 0.8 + ph[i]) * 1.4 * dpr;
      y += Math.cos(this.t * 0.6 + ph[i]) * 1.4 * dpr;
      if (hasM) {
        const dx = x - mx, dy = y - my, d2 = dx * dx + dy * dy;
        if (d2 < R2 && d2 > 0.01) {
          const d = Math.sqrt(d2), f = (1 - d / R);
          vx[i] += (dx / d) * f * f * push / mass[i];
          vy[i] += (dy / d) * f * f * push / mass[i];
        }
      }
      vx[i] = vx[i] * 0.8 - ox[i] * 0.0045;
      vy[i] = vy[i] * 0.8 - oy[i] * 0.0045 + 0.05 * mass[i];
      ox[i] += vx[i]; oy[i] += vy[i];
      x += ox[i]; y += oy[i];
      const xi = x | 0, yi = y | 0;
      const col = g[i];
      if (!s) {
        if (xi < 0 || yi < 0 || xi >= cw || yi >= ch) continue;
        buf[yi * cw + xi] = col;
        continue;
      }
      if (xi < 0 || yi < 0 || xi >= cw - span || yi >= ch - span) continue;
      const cells = GLYPHS[gi[i]];
      for (let k = 0; k < cells.length; k += 2) {
        const bx = xi + cells[k] * s, by = yi + cells[k + 1] * s;
        for (let sy = 0; sy < s; sy++) {
          const row = (by + sy) * cw + bx;
          for (let sx = 0; sx < s; sx++) buf[row + sx] = col;
        }
      }
    }
    this.ctx.putImageData(this.img, 0, 0);
  }
}

// ── interactive quote-particle field for "art mode" ─────────────────────────
const QUOTE = ['EMBARRASSMENT', 'IS AN UNDEREXPLORED', 'EMOTION'];

class MorphField {
  constructor(canvas) {
    this.cv = canvas;
    this.ctx = canvas.getContext('2d');
    this.n = 42000;
    const n = this.n;
    this.px = new Float32Array(n); this.py = new Float32Array(n);
    this.vx = new Float32Array(n); this.vy = new Float32Array(n);
    this.tx = new Float32Array(n); this.ty = new Float32Array(n);
    this.mass = new Float32Array(n); this.col = new Uint32Array(n);
    for (let i = 0; i < n; i++) {
      this.mass[i] = 0.5 + Math.random() * 1.1;
      const r = Math.random();
      this.col[i] = r < 0.42 ? NIGHT_COLS[0] : (r < 0.72 ? NIGHT_COLS[1] : NIGHT_COLS[2]);
      this.px[i] = Math.random() * 900; this.py[i] = Math.random() * 500;
    }
    this.dpr = Math.min(1.3, window.devicePixelRatio || 1);
    this.tw = performance.now();
  }
  targets(cw, ch) {
    const off = document.createElement('canvas');
    off.width = cw; off.height = ch;
    const o = off.getContext('2d');
    o.fillStyle = '#000';
    o.textAlign = 'center';
    o.textBaseline = 'middle';
    const lines = QUOTE;
    let size = ch * 0.38;
    for (let guard = 0; guard < 80; guard++) {
      o.font = `700 ${size.toFixed(0)}px 'Cormorant Garamond', serif`;
      const w = Math.max(...lines.map(l => o.measureText(l).width));
      if (w < cw * 0.985 && size * lines.length * 0.86 < ch * 0.99) break;
      size *= 0.96;
    }
    o.font = `700 ${size.toFixed(0)}px 'Cormorant Garamond', serif`;
    const lh = size * 0.86;
    lines.forEach((l, k) => o.fillText(l, cw / 2, ch / 2 + (k - (lines.length - 1) / 2) * lh));
    const a = o.getImageData(0, 0, cw, ch).data;
    const pts = [];
    const step = Math.max(1, Math.round(Math.min(cw, ch) / 300));
    for (let y = 0; y < ch; y += step) for (let x = 0; x < cw; x += step) if (a[(y * cw + x) * 4 + 3] > 128) pts.push(x, y);
    if (!pts.length) return;
    const m = pts.length / 2;
    for (let i = 0; i < this.n; i++) {
      const k = (Math.random() * m) | 0;
      this.tx[i] = pts[k * 2] + (Math.random() - 0.5) * step * 1.4;
      this.ty[i] = pts[k * 2 + 1] + (Math.random() - 0.5) * step * 1.4;
    }
  }
  blast(x, y) {
    const R = 300 * this.dpr, R2 = R * R, force = 46 * this.dpr;
    for (let i = 0; i < this.n; i++) {
      const dx = this.px[i] - x, dy = this.py[i] - y, d2 = dx * dx + dy * dy;
      if (d2 > R2) continue;
      const d = Math.sqrt(d2) || 0.01, f = 1 - d / R, imp = f * f * 46 * this.dpr / this.mass[i];
      const spin = (Math.random() - 0.5) * 0.6;
      this.vx[i] += (dx / d) * imp + (-dy / d) * imp * spin;
      this.vy[i] += (dy / d) * imp + (dx / d) * imp * spin;
    }
    void force;
  }
  draw(mx, my) {
    const cv = this.cv, dpr = this.dpr;
    const cw = Math.max(1, Math.round(cv.clientWidth * dpr)), ch = Math.max(1, Math.round(cv.clientHeight * dpr));
    if (cv.width !== cw || cv.height !== ch) { cv.width = cw; cv.height = ch; this.buf = null; this.targets(cw, ch); }
    if (!this.buf) { this.img = this.ctx.createImageData(cw, ch); this.buf = new Uint32Array(this.img.data.buffer); }
    const buf = this.buf; buf.fill(0);
    const hasM = mx > -9000;
    const R = 72 * dpr, R2 = R * R, push = 13 * dpr;
    const { px, py, vx, vy, tx, ty, mass, col } = this;

    // periodic vortex — swirls the letterforms apart before they reassemble
    const now = performance.now();
    if (now - this.tw > 6500) {
      this.tw = now;
      const wx = Math.random() * cw, wy = Math.random() * ch;
      const VR = Math.max(cw, ch) * 0.55, VR2 = VR * VR;
      for (let i = 0; i < this.n; i++) {
        const dx = px[i] - wx, dy = py[i] - wy, d2 = dx * dx + dy * dy;
        if (d2 > VR2) continue;
        const d = Math.sqrt(d2) || 0.01, f = 1 - d / VR;
        const imp = f * f * 9 / mass[i];
        vx[i] += (-dy / d) * imp;
        vy[i] += (dx / d) * imp;
      }
    }

    for (let i = 0; i < this.n; i++) {
      let ax = (tx[i] - px[i]) * 0.006 / mass[i];
      let ay = (ty[i] - py[i]) * 0.006 / mass[i];
      if (hasM) {
        const dx = px[i] - mx, dy = py[i] - my, d2 = dx * dx + dy * dy;
        if (d2 < R2 && d2 > 0.01) {
          const d = Math.sqrt(d2), f = 1 - d / R;
          ax += (dx / d) * f * f * push / mass[i];
          ay += (dy / d) * f * f * push / mass[i];
        }
      }
      vx[i] = (vx[i] + ax) * 0.8;
      vy[i] = (vy[i] + ay) * 0.8 + 0.05 * mass[i];
      px[i] += vx[i]; py[i] += vy[i];
      const xi = px[i] | 0, yi = py[i] | 0;
      if (xi < 0 || yi < 0 || xi >= cw || yi >= ch) continue;
      buf[yi * cw + xi] = col[i];
    }
    this.ctx.putImageData(this.img, 0, 0);
  }
}

// ── poster board — three seed notes (client-only) + live Supabase notes ────
const SEED_NOTES = [
  { id: 'n1', content: "if you found this\nyou're curious enough\n— that's good", author: 'maelo', x: 58, y: 20, r: -6 },
  { id: 'n2', content: 'Tema → DC\nquite the journey', author: 'maelo', x: 20, y: 14, r: 3 },
  { id: 'n3', content: 'embarrassment is an\nunderexplored emotion', author: 'unknown', x: 40, y: 56, r: 5 },
];

function PosterNote({ id, content, author, x, y, r, onDragEnd }) {
  const ref = useRef(null);
  function onMouseDown(e) {
    e.preventDefault();
    const box = ref.current.parentElement.getBoundingClientRect();
    ref.current.style.zIndex = 50;
    function move(ev) {
      const nx = Math.min(84, clamp01(((ev.clientX - box.left) / box.width) - 0.06) * 100);
      const ny = Math.min(76, clamp01(((ev.clientY - box.top) / box.height) - 0.04) * 100);
      ref.current.style.left = nx + '%';
      ref.current.style.top = ny + '%';
      ref.current._pending = { x: nx, y: ny };
    }
    function up() {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
      if (ref.current._pending) onDragEnd(id, ref.current._pending.x, ref.current._pending.y);
    }
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  }
  return (
    <div ref={ref} onMouseDown={onMouseDown}
      style={{ position: 'absolute', left: x + '%', top: y + '%', transform: `rotate(${r}deg)`, width: 210, padding: 16, background: '#f7f5ef', borderRadius: 2, boxShadow: '0 6px 18px rgba(0,0,0,.4)', cursor: 'grab', userSelect: 'none' }}>
      <div style={{ font: "400 21px/1.35 'Caveat',cursive", color: '#201f1d', whiteSpace: 'pre-line' }}>{content}</div>
      <div style={{ font: '400 11px/1 ui-monospace,Menlo,monospace', letterSpacing: '.1em', color: 'rgba(32,31,29,.45)', paddingTop: 8 }}>— {author}</div>
    </div>
  );
}

function PosterBoard({ onClose }) {
  const [seedPos, setSeedPos] = useState({});
  const [notes, setNotes] = useState([]);
  const [draft, setDraft] = useState('');
  const [who, setWho] = useState('');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await dbFetch('notes?select=*&order=created_at.asc');
        setNotes(data || []);
      } catch { /* board still shows the seed notes */ }
    })();
  }, []);

  function seedDragEnd(id, x, y) { setSeedPos(p => ({ ...p, [id]: { x, y } })); }
  async function liveDragEnd(id, x, y) {
    setNotes(p => p.map(n => n.id === id ? { ...n, x, y } : n));
    try { await dbFetch(`notes?id=eq.${id}`, { method: 'PATCH', body: JSON.stringify({ x, y }) }); } catch { /* best effort */ }
  }
  async function addNote() {
    const content = draft.trim();
    if (!content || posting) return;
    setPosting(true);
    try {
      const note = { content, author: who.trim() || 'anon', x: 24 + Math.random() * 42, y: 20 + Math.random() * 42, rotation: Math.random() * 12 - 6 };
      const res = await dbFetch('notes', { method: 'POST', body: JSON.stringify(note) });
      if (res) setNotes(p => [...p, Array.isArray(res) ? res[0] : res]);
      setDraft(''); setWho('');
    } catch { /* leave draft in place so the visitor can retry */ }
    finally { setPosting(false); }
  }

  return (
    <div className="ms-board">
      <div className="ms-board-header">
        <span className="ms-board-title">POSTER_BOARD — LEAVE SOMETHING BEHIND</span>
        <span className="ms-board-close" onClick={onClose}>✕ ESC_</span>
      </div>
      <div className="ms-board-canvas">
        {SEED_NOTES.map(n => (
          <PosterNote key={n.id} {...{ ...n, ...(seedPos[n.id] || {}) }} onDragEnd={seedDragEnd} />
        ))}
        {notes.map(n => (
          <PosterNote key={n.id} id={n.id} content={n.content} author={n.author} x={n.x} y={n.y} r={n.rotation} onDragEnd={liveDragEnd} />
        ))}
      </div>
      <div className="ms-board-footer">
        <input className="ms-board-input" value={draft} onChange={e => setDraft(e.target.value)}
          placeholder="say something…" maxLength={200} onKeyDown={e => e.key === 'Enter' && addNote()} />
        <input className="ms-board-name" value={who} onChange={e => setWho(e.target.value)}
          placeholder="your name_" maxLength={40} onKeyDown={e => e.key === 'Enter' && addNote()} />
        <button className="ms-board-pin" onClick={addNote} disabled={!draft.trim() || posting}>
          {posting ? 'pinning…' : 'PIN IT_ →'}
        </button>
      </div>
    </div>
  );
}

// ── selected work — a stack of full-viewport sticky cards, each one covering
// the last as it scrolls into place ─────────────────────────────────────────
const WORK = [
  { title: 'Stuff', kicker: "a grocery app for a brain that wanders", studio: 'Personal — research → UI', cat: "Lists don't fail ADHD people because they're badly organised. They fail because opening one feels like being told off. Kraft paper, a cat with opinions, and a currency you earn by finishing.", year: '2026', href: '/work/stuff', kraft: true, cta: 'READ THE CASE STUDY ↗' },
  { title: 'Maable', kicker: 'productivity that pays you back', studio: 'Personal — design engineering', cat: 'Ten tools on one surface, XP as the exhaust of real work rather than a separate game, and a companion whose mood tracks your week. Live on the web.', year: '2026', href: '/work/maable', img: maableDashboard, cta: 'READ THE CASE STUDY ↗' },
  { title: 'DormDrop', kicker: 'campus delivery, minus the chaos', studio: 'Personal — UI/UX, frontend', cat: 'Ordering built around dorm reality: shared drop points, tiny windows between classes, and roommates who never split the bill.', year: '2024', href: '/work/dormdrop', img: dormdrop1, cta: 'READ THE CASE STUDY ↗' },
  { title: 'Connect', kicker: 'social, with a conscience', studio: 'Personal — full-stack', cat: 'A social product designed around what it costs the person using it — attention, comparison, time — rather than what it extracts from them.', year: '2026', href: '/work/connect', cta: 'READ THE CASE STUDY ↗' },
];

// derived per-item palette/layout — a kraft-paper treatment for the one item
// with no screenshot, a sepia photo treatment for the rest, both swapping to
// a near-black night variant; falls back to "IN PROGRESS" copy without a href
function workItemStyle(w, i, night) {
  const live = !!w.href;
  const onImage = !!w.img;
  const kraft = !!w.kraft && !night;
  const paper = kraft ? '#c7a878' : (night ? '#0f0e0c' : '#e9e5db');
  const fg = kraft ? '#2b2015' : (onImage ? '#f4f1e8' : (night ? '#f2efe6' : '#201f1d'));
  const soft = kraft ? 'rgba(43,32,21,.78)' : (onImage ? 'rgba(244,241,232,.76)' : (night ? 'rgba(242,239,230,.72)' : 'rgba(32,31,29,.7)'));
  const gold = kraft ? '#5c3d1b' : (onImage ? '#e9c680' : (night ? '#f2c14e' : '#8a6224'));
  return {
    live,
    num: '0' + (i + 1),
    tail: live ? w.year : w.year + ' · SOON',
    cta: w.cta || (live ? 'READ THE CASE STUDY ↗' : 'IN PROGRESS'),
    wrap: css(`position:sticky;top:0;display:block;height:100vh;text-decoration:none;z-index:${i + 2};${live ? 'cursor:pointer' : 'cursor:default'}`),
    card: css(`position:relative;height:100vh;overflow:hidden;background:${paper};box-shadow:0 -24px 60px rgba(20,19,15,${night ? '.6' : '.18'})`),
    // the no-image variant is built as a plain object rather than via css():
    // GRAIN is itself a `url("data:...;base64,...")` string, and css()'s
    // naive `.split(';')` would slice it in half at that embedded semicolon.
    bleed: onImage
      ? css(`position:absolute;inset:0;background:${paper} url("${w.img}") center/cover no-repeat;filter:sepia(.16) contrast(1.04) saturate(.85)`)
      : {
          position: 'absolute', inset: 0, background: paper,
          backgroundImage: `${GRAIN}, radial-gradient(120% 90% at 20% 12%, rgba(255,246,226,.5), rgba(120,84,42,.22) 70%)`,
          backgroundBlendMode: 'multiply, soft-light',
        },
    veil: onImage
      ? css('position:absolute;inset:0;background:linear-gradient(180deg,rgba(12,11,9,.62) 0%,rgba(12,11,9,.28) 40%,rgba(12,11,9,.78) 100%)')
      : css('position:absolute;inset:0'),
    body: css(`position:absolute;inset:0;z-index:2;display:grid;align-content:space-between;gap:clamp(16px,3vh,40px);padding:clamp(72px,10vh,130px) clamp(20px,5vw,64px) clamp(36px,6vh,72px);color:${fg}`),
    metaInk: { color: soft },
    titleStyle: css(`margin:0;font:300 clamp(52px,11vw,178px)/.86 'Cormorant Garamond',serif;letter-spacing:-.025em;text-transform:uppercase;color:${fg}`),
    italic: css(`font:400 italic clamp(19px,2.6vw,38px)/1.1 'Cormorant Garamond',serif;color:${gold}`),
    copy: css(`margin:0;font:400 clamp(15px,1.5vw,18px)/1.65 'Lora',serif;color:${soft};max-width:52ch;text-wrap:pretty`),
    ctaStyle: css(`font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.2em;color:${gold}`),
  };
}

const kicker = css("font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.22em;color:rgba(32,31,29,.5)");

export default function MainSite() {
  const typed = useTypewriter(NAMES, 95, 1800, 52);
  const now = useTypewriter(NOW_LIST, 46, 2400, 22);
  const clock = useClock();
  // Fixed once per mount — doesn't change mid-session, and reused to decide
  // whether #meTrack/#workTrack pin+pan at all or just lay out normally.
  const [reduced] = useState(prefersReducedMotion);

  const [artMode, setArtMode] = useState(false);
  // Grayscale mode — toggled by "People.", independent of artMode/night.
  const [bwMode, setBwMode] = useState(false);
  const [boardOpen, setBoardOpen] = useState(false);
  const [p1, setP1] = useState(0);
  const [p2, setP2] = useState(0);
  // Progress across the act's FULL height (zoom + pause together), unlike
  // p1/p2 which only track the zoom portion. Drives the reveal's fade
  // in/hold/fade-out — timed to finish entirely before the act's height is
  // exhausted, so it can't still be fading when the next section arrives.
  const [p1Full, setP1Full] = useState(0);
  const [p2Full, setP2Full] = useState(0);
  // Whether each act is anywhere near the viewport right now — gates the
  // hero copy / scroll cue / doodle canvas so they can't show while their
  // act is still a page-length away (zoom() alone can't tell "hasn't
  // started" apart from "nowhere close yet", since both clamp to 0).
  const [nearA, setNearA] = useState(true);
  const [nearB, setNearB] = useState(false);
  // Whether #meTrack's fixed rail plate should be mounted at all right now
  // — true for the entire span the tracking div covers the viewport, false
  // otherwise, so the plate appears/disappears exactly in step with its
  // tracking div instead of relying on sticky (see the .ms-stage comment in
  // MainSite.css). #work doesn't need this: its cards are plain
  // position:sticky, one-to-one with their own box, so native sticky just
  // works there — no oversized tracking div to sidestep.
  const [meActive, setMeActive] = useState(false);

  const fieldARef = useRef(null);
  const fieldBRef = useRef(null);
  const artFieldRef = useRef(null);
  const mouseRef = useRef({ x: -99999, y: -99999, rawX: 0, rawY: 0 });
  const rafRef = useRef(null);
  // mirror committed progress for the imperative rAF loop, and track the last
  // committed value so we only setState (and re-render) once it has moved
  // meaningfully — matches the threshold the original design gates on.
  const p1Ref = useRef(0);
  const p2Ref = useRef(0);
  const progressRef = useRef({ p1: 0, p2: 0, p1Full: 0, p2Full: 0, nearA: true, nearB: false, meActive: false });

  // scroll progress + rAF particle loop
  useEffect(() => {
    if (prefersReducedMotion()) {
      // Every act's progress goes straight to its end state so hero copy
      // and the work rail are simply present — no scroll-linked zoom to sit
      // through, no continuous particle animation, and the "01/02" reveals
      // (already-exited) and doodles (out of range) stay hidden rather than
      // lingering over content.
      // #meTrack/#workTrack render in normal static flow when reduced (see
      // the `reduced` render gate below) — no rail transform or pinning to
      // drive, so there's nothing else to do here.
      p1Ref.current = 1; p2Ref.current = 1;
      progressRef.current = { p1: 1, p2: 1, p1Full: 1, p2Full: 1, nearA: false, nearB: false };
      setP1(1); setP2(1); setP1Full(1); setP2Full(1); setNearA(false); setNearB(false);
      return;
    }
    // act1/act2 are plain (non-sticky) tracking divs, taller than the zoom
    // itself (see ZOOM_FRACTION) — the doodle is a position:fixed overlay,
    // not laid out inside them, so the extra scroll isn't "dead": it's a
    // deliberate pause where the reveal text sits on screen by itself
    // (canvas already faded, next section not yet arrived) before the
    // handoff, instead of the two colliding the instant the zoom finishes.
    function zoom(id, budgetFraction = 1) {
      const el = document.getElementById(id);
      if (!el) return 0;
      const r = el.getBoundingClientRect();
      return clamp01(-r.top / Math.max(1, r.height * budgetFraction));
    }
    // Is this act's doodle/cue anywhere near relevant yet? Without this,
    // "SCROLL IN_ / there's work in here too" (cueB) reads as `opacity:
    // clamp01(1 - p2*3.4)`, which is 1 whenever p2 is 0 — true both right
    // before act2 and, wrongly, for the entire page above it, since zoom()
    // clamps negative progress to 0 rather than distinguishing "hasn't
    // started" from "nowhere close yet". A small fixed lead-in (not a full
    // extra viewport-height — `r.top < window.innerHeight` fires a whole
    // screen early, which is what let the stars doodle appear while still
    // deep in #me's content) so it turns on just before the act's box
    // actually reaches the viewport, not a screen-length ahead of it.
    function near(id) {
      const el = document.getElementById(id);
      if (!el) return false;
      const r = el.getBoundingClientRect();
      return r.top < 80 && r.bottom > -80;
    }
    // #meTrack's fixed .ms-stage plate should be mounted for the track's
    // ENTIRE span (not just an 80px lead-in like near()) — it's the only
    // thing standing in for that whole tracking div's content, so it has to
    // cover it edge to edge with no gap on either side.
    function trackActive(id) {
      const el = document.getElementById(id);
      if (!el) return false;
      const r = el.getBoundingClientRect();
      return r.top <= 1 && r.bottom > 0;
    }
    // The rAF loop re-reads geometry every frame regardless, but scroll and
    // resize listeners also call this directly — on browsers that throttle
    // rAF during active/inertial scrolling (notably Safari), this is what
    // keeps progress from stalling mid-gesture. Matches the reference impl.
    function readProgress() {
      const next = {
        p1: zoom('act1', ZOOM_FRACTION), p2: zoom('act2', ZOOM_FRACTION),
        p1Full: zoom('act1', 1), p2Full: zoom('act2', 1), nearA: near('act1'), nearB: near('act2'),
        meActive: trackActive('meTrack'),
      };
      const prev = progressRef.current;
      if (Math.abs(next.p1 - prev.p1) > 0.0015) { progressRef.current.p1 = next.p1; p1Ref.current = next.p1; setP1(next.p1); }
      if (Math.abs(next.p2 - prev.p2) > 0.0015) { progressRef.current.p2 = next.p2; p2Ref.current = next.p2; setP2(next.p2); }
      if (Math.abs(next.p1Full - prev.p1Full) > 0.0015) { progressRef.current.p1Full = next.p1Full; setP1Full(next.p1Full); }
      if (Math.abs(next.p2Full - prev.p2Full) > 0.0015) { progressRef.current.p2Full = next.p2Full; setP2Full(next.p2Full); }
      if (next.nearA !== prev.nearA) { progressRef.current.nearA = next.nearA; setNearA(next.nearA); }
      if (next.nearB !== prev.nearB) { progressRef.current.nearB = next.nearB; setNearB(next.nearB); }
      if (next.meActive !== prev.meActive) { progressRef.current.meActive = next.meActive; setMeActive(next.meActive); }
    }
    readProgress();
    window.addEventListener('scroll', readProgress, { passive: true });
    window.addEventListener('resize', readProgress);

    function onMove(e) {
      const dpr = Math.min(1.25, window.devicePixelRatio || 1);
      mouseRef.current.x = e.clientX * dpr;
      mouseRef.current.y = e.clientY * dpr;
      mouseRef.current.rawX = e.clientX;
      mouseRef.current.rawY = e.clientY;
    }
    function onLeave() { mouseRef.current.x = -99999; mouseRef.current.y = -99999; }
    function onDown(e) {
      const dpr = Math.min(1.25, window.devicePixelRatio || 1);
      const x = e.clientX * dpr, y = e.clientY * dpr;
      const hit = (f, id) => {
        const el = document.getElementById(id);
        if (!f || !el) return;
        const r = el.getBoundingClientRect();
        if (r.bottom > 0 && r.top < window.innerHeight) f.blast(x, y);
      };
      hit(fieldARef.current, 'act1');
      hit(fieldBRef.current, 'act2');
      if (artFieldRef.current) {
        const cv = document.getElementById('artField');
        if (cv) {
          const r = cv.getBoundingClientRect();
          if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
            artFieldRef.current.blast((e.clientX - r.left) * artFieldRef.current.dpr, (e.clientY - r.top) * artFieldRef.current.dpr);
          }
        }
      }
    }
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseleave', onLeave);
    window.addEventListener('pointerdown', onDown);

    const fa = document.getElementById('fieldA'), fb = document.getElementById('fieldB');
    if (fa) fieldARef.current = new DotField(fa, figureMask, 24000);
    if (fb) fieldBRef.current = new DotField(fb, starsMask, 24000);

    // Drives the #meTrack horizontal rail: a tall tracking div (like
    // act1/act2) whose scroll progress gets mapped to a sideways
    // translate3d on its .ms-rail child, so vertical scroll reads as
    // horizontal panning once the track's fixed plate is mounted. `hold`
    // leaves a trailing pause at the last panel before the track ends,
    // mirroring the breathing room act1/act2 already have. #work no longer
    // uses this — its cards are plain stacked position:sticky now.
    function railProg(trackId) {
      const el = document.getElementById(trackId);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      if (span <= 0) return null;
      return clamp01(-r.top / span);
    }
    function drive(trackId, panels, hold) {
      const t = document.getElementById(trackId);
      if (!t) return null;
      const rail = t.querySelector('.ms-rail');
      if (!rail) return null;
      const p = railProg(trackId);
      if (p == null) return null;
      const q = clamp01(p / hold);
      rail.style.transform = `translate3d(${(-q * (panels - 1) * 100).toFixed(3)}vw,0,0)`;
      return q;
    }

    function loop() {
      rafRef.current = requestAnimationFrame(loop);
      try {
        readProgress();
        const vis = near; // same tight bounds — canvas and cue turn on together
        const qMe = drive('meTrack', 3, 0.84);
        if (qMe != null) {
          const idx = qMe < 0.34 ? 0 : (qMe < 0.68 ? 1 : 2);
          ['ms-hi1', 'ms-hi2', 'ms-hi3'].forEach((cls, k) => {
            document.querySelectorAll('#meTrack .' + cls).forEach(el => { el.style.opacity = k === idx ? '1' : '0.14'; });
          });
        }
        const ac = document.getElementById('artField');
        if (ac && !artFieldRef.current) artFieldRef.current = new MorphField(ac);
        if (!ac && artFieldRef.current) artFieldRef.current = null;
        if (artFieldRef.current && ac) {
          const r = ac.getBoundingClientRect();
          const m = mouseRef.current;
          const inside = m.x > -9000 && m.rawX >= r.left && m.rawX <= r.right && m.rawY >= r.top && m.rawY <= r.bottom;
          artFieldRef.current.draw(
            inside ? (m.rawX - r.left) * artFieldRef.current.dpr : -99999,
            inside ? (m.rawY - r.top) * artFieldRef.current.dpr : -99999
          );
        }
        const m = mouseRef.current;
        if (fieldARef.current) fieldARef.current.draw(p1Ref.current, m.x, m.y, vis('act1') ? 1 - seg(p1Ref.current, 0.86, 1) : 0);
        if (fieldBRef.current) fieldBRef.current.draw(p2Ref.current, m.x, m.y, vis('act2') ? 1 - seg(p2Ref.current, 0.86, 1) : 0);
      } catch (err) { console.error(err); }
    }
    loop();

    return () => {
      window.removeEventListener('scroll', readProgress);
      window.removeEventListener('resize', readProgress);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('pointerdown', onDown);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // art mode doubles as a site-wide dark theme — toggling it swaps both
  // doodle fields' particle colors (see DotField.setNight) along with the
  // CSS class that flips every panel to night colors.
  useEffect(() => {
    document.body.classList.toggle('night', artMode);
    if (fieldARef.current) fieldARef.current.setNight(artMode);
    if (fieldBRef.current) fieldBRef.current.setNight(artMode);
    return () => { document.body.classList.remove('night'); };
  }, [artMode]);

  // Independent grayscale toggle — "People." flips the whole page to
  // grayscale and (per the reference) pins the topbar while it's active.
  useEffect(() => {
    document.body.classList.toggle('bw', bwMode);
    return () => { document.body.classList.remove('bw'); };
  }, [bwMode]);

  useEffect(() => {
    let keys = '';
    function onKey(e) {
      if (e.key === 'Escape') { setBoardOpen(false); return; }
      if (e.key && e.key.length === 1) {
        keys = (keys + e.key.toLowerCase()).slice(-6);
        if (keys === 'poster') setBoardOpen(true);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // p1/p2 already clamp to 0 both "hasn't started" and "isn't close yet",
  // so hero/cue opacity alone can't tell those apart — nearA/nearB (real
  // geometry, not derived from p1/p2) gate whether these render at all.
  const heroStyle = css(`position:absolute;left:clamp(20px,5vw,64px);bottom:clamp(74px,12vh,120px);display:grid;gap:16px;max-width:min(90vw,560px);opacity:${(nearA ? clamp01(1 - p1 * 3.4) : 0).toFixed(3)};transform:translateY(${(p1 * -40).toFixed(1)}px);pointer-events:none`);
  const cueA = css(`position:absolute;right:clamp(20px,5vw,64px);bottom:clamp(74px,12vh,120px);width:max-content;display:grid;gap:8px;justify-items:end;text-align:right;white-space:nowrap;opacity:${(nearA ? clamp01(1 - p1 * 3.4) : 0).toFixed(3)}`);
  const cueB = css(`position:absolute;right:clamp(20px,5vw,64px);bottom:clamp(74px,12vh,120px);width:max-content;display:grid;gap:8px;justify-items:end;text-align:right;white-space:nowrap;opacity:${(nearB ? clamp01(1 - p2 * 3.4) : 0).toFixed(3)}`);
  // Fixed to the viewport (not laid out inside the doodle's own box) and
  // faded out by how far past the act we've scrolled, so the reveal hands
  // off to real content instead of leaving a blank gap behind it.
  const revealAIn = seg(p1Full, REVEAL_IN[0], REVEAL_IN[1]);
  const revealAOut = 1 - seg(p1Full, REVEAL_OUT[0], REVEAL_OUT[1]);
  const revealAOpacity = nearA ? revealAIn * revealAOut : 0;
  const revealA = css(`position:fixed;top:50%;left:50%;transform:translate(-50%,calc(-50% + ${(12 - revealAIn * 12).toFixed(1)}px));display:grid;gap:14px;justify-items:center;text-align:center;padding:0 6vw;opacity:${revealAOpacity.toFixed(3)};pointer-events:none;z-index:10`);
  const revealBIn = seg(p2Full, REVEAL_IN[0], REVEAL_IN[1]);
  const revealBOut = 1 - seg(p2Full, REVEAL_OUT[0], REVEAL_OUT[1]);
  const revealBOpacity = nearB ? revealBIn * revealBOut : 0;
  const revealB = css(`position:fixed;top:50%;left:50%;transform:translate(-50%,calc(-50% + ${(12 - revealBIn * 12).toFixed(1)}px));display:grid;gap:14px;justify-items:center;text-align:center;padding:0 6vw;opacity:${revealBOpacity.toFixed(3)};pointer-events:none;z-index:10`);
  const revealAVisible = revealAOpacity > 0.002;
  const revealBVisible = revealBOpacity > 0.002;

  return (
    <div className="main-site" style={{ background: '#efece4', backgroundImage: GRAIN, backgroundBlendMode: 'multiply' }}>

      {/* TOP BAR */}
      <div className="ms-topbar">
        <span>MALVIN MALLOCK BOYE — MAEHLO</span>
        <span className="ms-topbar-right">
          <a href="#me">ABOUT</a><a href="#work">WORK</a><a href="#say">CONTACT</a>
          <span style={{ color: '#c8402c' }}>●</span><span style={{ fontVariantNumeric: 'tabular-nums' }}>{clock}</span>
        </span>
      </div>

      {/* ACT 1 — HERO */}
      <div id="act1" style={{ position: 'relative', height: `${ACT_VH}vh` }}>
        <div className="ms-fixed-stage">
          <canvas id="fieldA" className="ms-field" />
          <div style={heroStyle}>
            <h1 style={css("margin:0;font:300 clamp(52px,8.4vw,124px)/.92 'Cormorant Garamond',serif;letter-spacing:-.02em")}>
              <span>{typed}</span><span className="ms-caret">_</span>
            </h1>
            <p style={css("margin:0;max-width:28ch;font:400 clamp(17px,1.7vw,21px)/1.5 'Lora',serif;color:rgba(32,31,29,.75);text-wrap:pretty")}>Designer and design engineer in Washington DC. I make things that feel like something.</p>
          </div>
          <div style={cueA}>
            <span style={css("font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.2em;color:rgba(32,31,29,.5)")}>SCROLL IN_</span>
          </div>
        </div>
      </div>

      {revealAVisible && (
        <div style={revealA}>
          <span style={css("font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.24em;color:rgba(32,31,29,.5)")}>01 — WHO YOU'D BE WORKING WITH</span>
          <span style={css("font:300 clamp(38px,7vw,96px)/1 'Cormorant Garamond',serif")}>a bit about me</span>
          <span style={css("font:400 20px/1 'Caveat',cursive;color:#8a6224")}>yay...i guess</span>
        </div>
      )}

      {/* ABOUT — a 420vh tracking div; while calm, its fixed .ms-stage plate
          pans sideways through Life/People/Art panels (driven by drive() in
          the scroll effect above), mounted only while meActive. Clicking
          "Art." swaps the whole track for a separate plate holding the
          interactive quote field, which also flips the site into night
          mode. Reduced-motion visitors get everything in normal static
          flow instead — see the `reduced` gate below and .ms-stage--static
          in MainSite.css. */}
      <div id="meTrack" style={{ position: 'relative', height: reduced ? 'auto' : '420vh' }}>
        {(reduced || meActive) && (!artMode ? (
          <section id="me" data-pane className={"ms-stage" + (reduced ? ' ms-stage--static' : '')} style={{ background: '#efece4', backgroundImage: GRAIN, backgroundBlendMode: 'multiply', padding: 'clamp(28px,4.4vh,58px) 0 clamp(10px,1.6vh,26px)', gap: 'clamp(10px,1.6vh,22px)' }}>
            <div style={css("display:flex;flex-wrap:wrap;align-items:baseline;gap:clamp(18px,5vw,64px);padding:0 clamp(20px,5vw,64px);font:300 clamp(36px,6.2vw,88px)/1 'Cormorant Garamond',serif")}>
              <span className="ms-hi1">Life.</span><span onClick={() => setBwMode(b => !b)} className="ms-hi2" style={css("cursor:pointer;border-bottom:1px dashed rgba(32,31,29,.32)")}>People.</span>
              <span onClick={() => setArtMode(true)} className="ms-hi3 ms-art-toggle">Art.</span>
            </div>

            <div className={"ms-rail" + (reduced ? ' ms-rail--static' : '')}>
              {/* LIFE */}
              <div style={css("display:grid;align-content:center;gap:clamp(16px,2.4vw,30px);padding:0 clamp(20px,5vw,64px);min-width:0")}>
                <div style={css("display:flex;flex-wrap:wrap;align-items:baseline;gap:14px")}>
                  <span style={kicker}>CURRENTLY</span>
                  <span style={css("font:400 clamp(17px,2vw,24px)/1.3 'Lora',serif;color:rgba(32,31,29,.86)")}>{now}<span className="ms-caret">_</span></span>
                </div>
                <div style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:clamp(22px,4vw,64px);padding-top:clamp(22px,3vw,38px);align-items:start")}>
                  <div style={{ display: 'grid', gap: 16 }}>
                    <span style={kicker}>ORIGIN</span>
                    <div style={css("display:flex;flex-wrap:wrap;align-items:baseline;gap:14px;font:300 clamp(26px,3.2vw,42px)/1.1 'Cormorant Garamond',serif")}>
                      <span>Tema, Ghana</span><span style={{ color: '#b68235' }}>→</span><span>Washington DC</span>
                    </div>
                    <p style={css("margin:0;font:400 17px/1.7 'Lora',serif;color:rgba(32,31,29,.84);max-width:40ch;text-wrap:pretty")}>Raised in a few different places; Tema would always be home. Drawing since three, a couple of instruments not long after. Art has been sitting next to me the whole time, occasionally paying rent.</p>
                  </div>
                  <div style={{ display: 'grid', gap: 16 }}>
                    <span style={kicker}>WHAT I ACTUALLY DO</span>
                    <p style={css("margin:0;font:400 clamp(19px,2vw,23px)/1.6 'Lora',serif;color:rgba(32,31,29,.86);max-width:40ch;text-wrap:pretty")}>I work at the edge of design and engineering — research, interface, motion, and the odd hand-drawn asset when a stock icon would be a lie.</p>
                    <p style={css("margin:0;font:400 17px/1.7 'Lora',serif;color:rgba(32,31,29,.78);max-width:40ch;text-wrap:pretty")}>Someone who loves people, loves new experiences, and loves being put outside his comfort zone for the smallest speck of knowledge.</p>
                  </div>
                </div>
              </div>

              {/* PEOPLE */}
              <div style={css("display:grid;align-content:center;gap:clamp(16px,2.4vw,30px);padding:0 clamp(20px,5vw,64px);min-width:0")}>
                <div style={{ display: 'grid', gap: 'clamp(14px,2vw,24px)' }}>
                  <div style={css("display:flex;flex-wrap:wrap;align-items:baseline;gap:18px;max-width:74ch")}>
                    <span style={kicker}>PEOPLE I LOOK UP TO</span>
                    <p style={css("margin:0;font:400 clamp(17px,1.7vw,20px)/1.5 'Lora',serif;color:rgba(32,31,29,.86);text-wrap:pretty")}>I steal from people constantly — let me preface I'm not talking about stealing their work but stealing their nerve.</p>
                  </div>
                  <div style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:clamp(16px,2.6vw,38px)")}>
                    {[
                      { name: 'Park Chan-wook', cat: 'FILM', body: "Every frame is composed like it's the only one. Taught me that beauty and discomfort can share a room." },
                      { name: 'Shinichiro Watanabe', cat: 'ANIMATION', body: 'Cowboy Bebop is why this site looks like this. Tone as a design system: jazz, melancholy, and jokes in the same episode.' },
                      { name: 'Virgil Abloh', cat: 'DESIGN', body: 'The 3% rule, and the permission to be a designer, an engineer and an artist without picking one.' },
                      { name: 'My parents', cat: 'TEMA → DC', body: 'Both strong-willed people who made it this far in life to give me a comfortable one — so that I get to do what I love. Everything else on this page is downstream of that.' },
                    ].map(person => (
                      <div key={person.name} style={{ display: 'grid', gap: 8 }}>
                        <span style={css("font:300 clamp(22px,2.4vw,32px)/1.05 'Cormorant Garamond',serif")}>{person.name}</span>
                        <span style={css("font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.18em;color:rgba(32,31,29,.5)")}>{person.cat}</span>
                        <p style={css("margin:0;font:400 15px/1.6 'Lora',serif;color:rgba(32,31,29,.8);text-wrap:pretty")}>{person.body}</p>
                      </div>
                    ))}
                  </div>
                  <p style={css("margin:0;font:400 19px/1.3 'Caveat',cursive;color:#8a6224")}>and everyone who has ever let me ask a stupid question — that's the whole list, really.</p>
                </div>
              </div>

              {/* ART (gallery) */}
              <div style={css("display:grid;align-content:center;gap:clamp(16px,2.4vw,30px);padding:0 clamp(20px,5vw,64px);min-width:0")}>
                <div style={{ display: 'grid', gap: 'clamp(14px,2vw,24px)' }}>
                  <div style={{ display: 'grid', gap: 12, maxWidth: '54ch' }}>
                    <span style={kicker}>THINGS I'VE DRAWN AND BUILT</span>
                    <p style={css("margin:0;font:400 clamp(16px,1.6vw,19px)/1.5 'Lora',serif;color:rgba(32,31,29,.86);text-wrap:pretty")}>No stock assets anywhere in my work — if it's in the interface, it came off my desk first. Click "Art." above to turn the lights off.</p>
                  </div>
                  <div style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:clamp(18px,3vw,36px)")}>
                    {[
                      { src: petMeeks, alt: 'Meeks the cat', caption: 'Meeks — the cat with opinions' },
                      { src: bagJala, alt: 'Jala bag', caption: 'bag skins for Stuff' },
                      { src: bagGracias, alt: 'Gracias bag', caption: 'gracias — the polite one' },
                      { src: stuff1c, alt: 'Stuff list screen', caption: 'Stuff, drawn end to end' },
                    ].map(item => (
                      <div key={item.caption} style={{ display: 'grid', gap: 9 }}>
                        <div style={{ background: '#f7f5ef', padding: 14, border: '1px solid rgba(32,31,29,.2)', borderRadius: 4 }}>
                          <img src={item.src} alt={item.alt} style={{ display: 'block', width: '100%', height: 'clamp(96px,11vh,150px)', objectFit: item.caption.startsWith('Stuff') ? 'cover' : 'contain', objectPosition: 'top', filter: 'sepia(.12)' }} />
                        </div>
                        <span style={css("font:400 19px/1.3 'Caveat',cursive;color:rgba(32,31,29,.6)")}>{item.caption}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section data-pane className={reduced ? 'ms-stage--static' : 'ms-stage'} style={{ gap: 'clamp(18px,2.6vw,34px)', padding: 'clamp(56px,8vw,92px) clamp(20px,5vw,64px)', background: '#efece4', backgroundImage: GRAIN, backgroundBlendMode: 'multiply' }}>
            <div style={css("display:flex;flex-wrap:wrap;align-items:baseline;gap:clamp(18px,5vw,64px);font:300 clamp(36px,6.2vw,88px)/1 'Cormorant Garamond',serif")}>
              <span style={{ opacity: 0.16 }}>Life.</span><span style={{ opacity: 0.16 }}>People.</span>
              <span onClick={() => setArtMode(false)} className="ms-art-toggle">Art.</span>
            </div>
            <div style={css("display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:14px")}>
              <span style={kicker}>MY FAVOURITE QUOTE — DRAG YOUR CURSOR THROUGH IT · CLICK TO BLOW IT APART</span>
              <span onClick={() => setArtMode(false)} className="ms-art-toggle" style={css("font:400 20px/1 'Caveat',cursive;color:#c8402c")}>click "Art." again to put me back together</span>
            </div>
            <div style={{ position: 'relative', height: 'clamp(360px,58vh,640px)', overflow: 'hidden' }}>
              <canvas id="artField" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }} />
            </div>
          </section>
        ))}
      </div>

      {/* ACT 2 — TRANSITION */}
      <div id="act2" style={{ position: 'relative', height: `${ACT_VH}vh`, borderTop: '1px solid rgba(32,31,29,.16)' }}>
        <div className="ms-fixed-stage">
          <canvas id="fieldB" className="ms-field" />
          <div style={cueB}>
            <span style={css("font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.2em;color:rgba(32,31,29,.5)")}>SCROLL IN_</span>
            <span style={css("font:400 19px/1 'Caveat',cursive;color:#8a6224")}>there's work in here too</span>
          </div>
        </div>
      </div>

      {revealBVisible && (
        <div style={revealB}>
          <span style={css("font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.24em;color:rgba(32,31,29,.5)")}>02 — SELECTED WORK</span>
          <span style={css("font:300 clamp(38px,7vw,96px)/1 'Cormorant Garamond',serif")}>now the work</span>
          <span style={css("font:400 20px/1 'Caveat',cursive;color:#8a6224")}>proceed....</span>
        </div>
      )}

      {/* WORK — a stack of full-viewport sticky cards. Each item is its own
          position:sticky;height:100vh box with an increasing z-index, so as
          you scroll, the next card slides up and covers the last one —
          plain native sticky, no oversized tracking div needed (unlike
          #meTrack) since each sticky box is exactly the size of its own
          content. */}
      <section id="work" data-pane style={{ position: 'relative', background: '#efece4', backgroundImage: GRAIN, backgroundBlendMode: 'multiply' }}>
        <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'grid', alignContent: 'center', justifyItems: 'center', gap: 16, textAlign: 'center', padding: '0 clamp(20px,5vw,64px)' }}>
          <span style={css("font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.24em;color:rgba(32,31,29,.5)")}>SELECTED WORK — 2024 → 2026</span>
          <h2 style={css("margin:0;font:300 clamp(46px,9vw,132px)/.92 'Cormorant Garamond',serif;letter-spacing:-.02em")}>some off my projects</h2>
          <span style={css("font:400 20px/1 'Caveat',cursive;color:#8a6224")}>you may continue scrolling&nbsp;</span>
        </div>

        {WORK.map((w, i) => {
          const s = workItemStyle(w, i, artMode);
          const content = (
            <div style={s.card}>
              <div style={s.bleed} />
              <div style={s.veil} />
              <div style={s.body}>
                <div style={css("display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:16px;font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.2em;font-variant-numeric:tabular-nums")}>
                  <span style={s.metaInk}>{s.num} — {w.studio}</span>
                  <span style={s.metaInk}>{s.tail}</span>
                </div>
                <div style={{ display: 'grid', gap: 'clamp(8px,1.4vh,18px)', maxWidth: 'min(94vw,1180px)' }}>
                  <h3 style={s.titleStyle}>{w.title}</h3>
                  <span style={s.italic}>{w.kicker}</span>
                </div>
                <p style={s.copy}>{w.cat}</p>
                <span style={s.ctaStyle}>{s.cta}</span>
              </div>
            </div>
          );
          return s.live ? (
            <Link key={w.title} to={w.href} style={s.wrap}>{content}</Link>
          ) : (
            <div key={w.title} style={s.wrap}>{content}</div>
          );
        })}
      </section>

      {/* CONTACT */}
      <section id="say" className="ms-say">
        <a href="mailto:malvinboye@gmail.com" style={css("font:300 clamp(30px,5.6vw,72px)/1 'Cormorant Garamond',serif;color:#201f1d;border-bottom:1px solid rgba(138,98,36,.55);padding-bottom:8px")}>malvinboye@gmail.com</a>
        <div style={css("display:flex;flex-wrap:wrap;gap:22px;font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.14em")}>
          <a href="https://youtube.com/@maehlo" target="_blank" rel="noopener noreferrer">YOUTUBE ↗</a>
          <a href="https://instagram.com/pseudo.sq" target="_blank" rel="noopener noreferrer">INSTAGRAM ↗</a>
          <a href="https://github.com/MalvinBoye" target="_blank" rel="noopener noreferrer">GITHUB ↗</a>
          <span style={css("font:400 19px/1 'Caveat',cursive;color:rgba(32,31,29,.5)")}>type "poster" anywhere</span>
        </div>
      </section>

      <footer className="ms-footer">
        <span>MAEHLO.COM · © 2026</span><span>SEE YOU SPACE COWBOY…</span>
      </footer>

      {boardOpen && <PosterBoard onClose={() => setBoardOpen(false)} />}
    </div>
  );
}
