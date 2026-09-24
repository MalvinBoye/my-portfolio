import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './About.css';

// ---------------------------------------------------------------------------
// Ported from the design handoff's About.dc.html — the player-profile page,
// routed at /about. A looping portrait video that drops into a 1-bit
// dithered glitch feed every ~10s, a pixel mini-me sprite, a name-swap
// every 15s, a stat sheet and bio, side-quest cards, an inventory, a save
// point, and a cursor-following pixel koi. Canvas/video code is moved
// near-verbatim per the handoff's porting guidance.
// ---------------------------------------------------------------------------

const ROWS = [
  '........K.KK.KK.K.......', '.......KhKhhKhhKhK......', '......KhhhhhhhhhhhK.....', '.....KhhKhhhhhKhhhhK....',
  '.....KhhhhhhhhhhhhhK....', '....KhhSShhSShhSShhhK...', '....KhSSSSSSSSSSSSShK...', '....KSSSSSSSSSSSSSSSK...',
  '....KSSSKSSSSSSKSSSSK...', '...KKSSSSSSSSSSSSSSSKK..', '..KSKSSSSSSKKSSSSSSSKSK.', '..KSKSSSSSKSSKSSSSSSKSK.',
  '...KKSSSSSSKKSSSSSSSKK..', '....KSSSSSSSSSSSSSSSK...', '....KSSSSSSKKKSSSSSSK...', '.....KSSSSSSSSSSSSSK....',
  '......KKSSSSSSSSSKK.....', '........KKKKKKKKK.......', '..........KSSK..........', '.........KKSSKK.........',
  '........KOOKKOOK........', '.......KOOOOOOOOK.......', '......KOOOOOOOOOOK......', '......KooooooooooK......',
  '.....KOOOOOOOOOOOOK.....', '.....KOKOOOOOOOOKOK.....', '....KOOKooooooooKOOK....', '....KKKKKKKKKKKKKKKK....',
];
const SW = 24, SH = 28;
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const BASE = [0, 0.2, 0.62, 0.34, 0.94, 0.52];
const grid = ROWS.map(r => [...r].map(ch => 'KhSkOo'.indexOf(ch)));
function shadeBW(g) {
  const out = [];
  for (let y = 0; y < SH; y++) for (let x = 0; x < SW; x++) {
    const k = g[y][x];
    if (k < 0) { out.push(-1); continue; }
    if (k === 0) { out.push(0); continue; }
    const head = y <= 17, cx = 12, cy = head ? 9.5 : y <= 19 ? 18 : 30, rx = head ? 8 : 9, ry = head ? 9 : 12;
    const nx = (x + 0.5 - cx) / rx, ny = (y + 0.5 - cy) / ry;
    const lum = Math.max(0, Math.min(1, 0.55 - (nx * 0.6 + ny * 0.7) * 0.5));
    let v = Math.max(0, Math.min(1, BASE[k] + (lum - 0.55) * 0.9));
    if (k !== 1 && ((x > 0 && g[y][x - 1] === 0) || (y > 0 && g[y - 1][x] === 0)) && nx < 0.1 && ny < 0.3) v = 1;
    if (k === 2 && head) {
      let near = false;
      for (let dy = -1; dy <= 1 && !near; dy++) for (let dx = -1; dx <= 1; dx++) {
        const X = x + dx, Y = y + dy;
        if (X >= 6 && X <= 17 && Y >= 7 && Y <= 15 && g[Y][X] === 0) { near = true; break; }
      }
      v = near ? 1 : (nx > 0.62 || ny > 0.7) ? 0.45 : 1;
    }
    out.push(v > (BAYER[(y & 3) * 4 + (x & 3)] + 0.5) / 16 ? 1 : 0);
  }
  return out;
}

// Only what's already known about Malvin — the rest is his to fill in.
const SHEET = [
  ['Class', 'Designer · design engineer'],
  ['From', 'Tema'],
  ['Based', 'Washington, DC'],
  ['Mind', 'Wandering, curious, easily obsessed'],
  ['Obsessed with', 'Koi fish, architecture, 90s pixels'],
  ['Handle', '@maehlo'],
];
const BIO = [
  "Most of what I make is for people with minds like mine. Mainstream media calls it TikTok brain, a short attention span, ADHD. To me it's just a mind that wanders — curious, and trying to learn as much as it can in whatever time it has.",
  "So I design around whatever has my curiosity at the moment. Right now that's koi fish and architecture, roughed up with pixels so nothing gets too polished. That's this whole site.",
  'I design and I build. Research, UI, illustration, front end — I like owning the whole thing, from the first sketch to the version that\'s live.',
];
const QUESTS = [
  { title: 'Drawing', tag: 'daily', line: "It's where my mind settles. Most of my layouts begin as a page of lines that don't go anywhere in particular." },
  { title: 'Piano & drums', tag: 'practice', line: 'Rhythm gives me something to come back to when my attention drifts, and it\'s taught me a great deal about pacing.' },
  { title: 'Making videos', tag: 'editing', line: "Editing shows you exactly where attention drops. I've learnt more about holding someone's interest on a timeline than anywhere else." },
  { title: 'Korean cinema', tag: 'watchlist', line: "Holding a shot until it feels uncomfortable, then cutting hard. It's a trick I borrow constantly." },
  { title: 'Koi & architecture', tag: 'current obsession', line: "The two things this entire site is built around, and the reason there's a pond on the home page." },
];
const TOOLS = [
  ['Figma', 'screens, systems'], ['Procreate', 'every drawing'], ['HTML / CSS', 'the real material'], ['React', 'apps that ship'],
  ['Vite', 'fast builds'], ['Supabase', 'data + auth'], ['Premiere-ish', 'video edits'], ['A notebook', 'always first'],
];
const pad2 = (n) => String(n).padStart(2, '0');
const KCELL = 4, KRAD = [1.5, 2.2, 2.5, 2.3, 1.9, 1.4, 1.0, 0.7];

class Board {
  constructor(getState, setState) {
    this._getState = getState;
    this._setState = setState;
  }
  get state() { return this._getState(); }
  setState(patch) { this._setState(patch); }

  mount() {
    try { this.setState({ inv: localStorage.getItem('mh-invert') === '1' }); } catch (_) { /* private mode */ }
    this.calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.paintSprite();
    this._on = () => this.develop();
    window.addEventListener('scroll', this._on, { passive: true });
    window.addEventListener('resize', this._on);
    this.develop();
    this._t = setTimeout(() => { this.develop(); this.paintSprite(); }, 300);
    if (!this.calm) this.initKoi();
    this.initVidGlitch();
    this.initNameSwap();
  }

  unmount() {
    window.removeEventListener('scroll', this._on);
    window.removeEventListener('resize', this._on);
    clearTimeout(this._t);
    cancelAnimationFrame(this._kraf);
    cancelAnimationFrame(this._vraf);
    clearInterval(this._nameIv);
    if (this._kmove) window.removeEventListener('pointermove', this._kmove);
    if (this._kfit) window.removeEventListener('resize', this._kfit);
  }

  // Every 15s the name swaps between the full name and the alias, breaking
  // into pixels on the way through (coarse → fine → sharp).
  initNameSwap() {
    const el = document.getElementById('abName');
    if (!el) return;
    const names = ['Malvin<br>Mallock Boye', 'Maelo'];
    let k = 0;
    const swap = () => {
      k = 1 - k;
      if (this.calm) { el.innerHTML = names[k]; return; }
      const st = ['url(#apx6)', 'url(#apx12)', 'SWAP', 'url(#apx12)', 'url(#apx6)', 'none'];
      st.forEach((f, i) => setTimeout(() => {
        if (f === 'SWAP') { el.innerHTML = names[k]; return; }
        el.style.filter = f === 'none' ? '' : f;
      }, i * 90));
    };
    this._nameIv = setInterval(swap, 15000);
  }

  // The portrait video plays in colour, then every ~10s drops into a 1-bit
  // pixel feed for 3 seconds: sampled small, ordered-dithered to pure black
  // and white, with the grid stepping coarse → fine → coarse and the odd
  // torn row, like a 90s capture card losing sync.
  initVidGlitch() {
    const v = document.getElementById('abVid'), cv = document.getElementById('abVidPx');
    if (!v || !cv) return;
    v.muted = true; v.loop = true; v.autoplay = true; v.playsInline = true;
    v.addEventListener('ended', () => { v.currentTime = 0; v.play().catch(() => {}); });
    try { v.play().catch(() => {}); } catch (_) { /* autoplay blocked */ }
    if (this.calm) return;
    const src = document.createElement('canvas'), sc = src.getContext('2d', { willReadFrequently: true });
    const c = cv.getContext('2d');
    const PERIOD = 10, DUR = 3;
    const t0 = performance.now() / 1000 - 4;
    const tick = () => {
      const t = (performance.now() / 1000 - t0) % PERIOD;
      const on = t < DUR && v.readyState >= 2;
      if (!on) { cv.style.opacity = '0'; this._vraf = requestAnimationFrame(tick); return; }
      const u = t / DUR;
      const cols = u < 0.08 || u > 0.92 ? 18 : u < 0.2 || u > 0.8 ? 32 : 54;
      const r = cv.getBoundingClientRect(), ar = r.height / Math.max(1, r.width);
      const w = cols, hh = Math.max(1, Math.round(cols * ar));
      if (src.width !== w || src.height !== hh) { src.width = w; src.height = hh; cv.width = w; cv.height = hh; }
      const vw = v.videoWidth, vh = v.videoHeight, vr = vh / vw;
      let sx = 0, sy = 0, sw = vw, sh = vh;
      if (vr > ar) { sh = vw * ar; sy = (vh - sh) / 2; } else { sw = vh / ar; sx = (vw - sw) / 2; }
      sc.drawImage(v, sx, sy, sw, sh, 0, 0, w, hh);
      const d = sc.getImageData(0, 0, w, hh), p = d.data, out = c.createImageData(w, hh), o = out.data;
      const tear = Math.random() < 0.35 ? Math.floor(Math.random() * hh) : -1, tearN = 1 + Math.floor(Math.random() * 3), shift = Math.round((Math.random() - 0.5) * 6);
      for (let y = 0; y < hh; y++) for (let x = 0; x < w; x++) {
        const xs = tear >= 0 && y >= tear && y < tear + tearN ? Math.min(w - 1, Math.max(0, x + shift)) : x;
        const i = (y * w + xs) * 4, L = (0.3 * p[i] + 0.59 * p[i + 1] + 0.11 * p[i + 2]) / 255;
        const lum = Math.min(1, Math.max(0, (L - 0.5) * 1.35 + 0.5));
        const on1 = lum > (BAYER[(y & 3) * 4 + (x & 3)] + 0.5) / 16, j = (y * w + x) * 4, val = on1 ? 250 : 20;
        o[j] = o[j + 1] = o[j + 2] = val; o[j + 3] = 255;
      }
      c.putImageData(out, 0, 0);
      cv.style.opacity = '1';
      this._vraf = requestAnimationFrame(tick);
    };
    this._vraf = requestAnimationFrame(tick);
  }

  // A little pixel koi that tails the cursor like a pet — same follow-the-
  // leader spine as the site plan's koi. It keeps a polite distance, then
  // lazily circles when you stop.
  initKoi() {
    const cv = document.getElementById('abKoi');
    if (!cv) return;
    const c = cv.getContext('2d');
    const fit = () => { cv.width = Math.ceil(window.innerWidth / KCELL); cv.height = Math.ceil(window.innerHeight / KCELL); cv.style.width = cv.width * KCELL + 'px'; cv.style.height = cv.height * KCELL + 'px'; };
    fit(); this._kfit = fit; window.addEventListener('resize', fit);
    const f = 1.1, sp = 1.7 * f;
    const k = { x: 30, y: cv.height - 20, a: -0.6, v: 0, ph: 0, pts: [] };
    for (let i = 0; i < 8; i++) k.pts.push([k.x - i * sp, k.y]);
    let mx = null, my = null, still = 0;
    this._kmove = (e) => { mx = e.clientX / KCELL; my = e.clientY / KCELL; still = 0; };
    window.addEventListener('pointermove', this._kmove, { passive: true });
    let last = performance.now();
    const step = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now; still += dt;
      let tx = mx ?? cv.width * 0.2, ty = my ?? cv.height * 0.8;
      const dCur = Math.hypot(tx - k.x, ty - k.y);
      if (still > 0.6 || dCur < 7) { const oa = now / 1000 * 1.1; tx += Math.cos(oa) * 9; ty += Math.sin(oa) * 7; }
      const want = Math.atan2(ty - k.y, tx - k.x), d = Math.hypot(tx - k.x, ty - k.y);
      let da = want - k.a; while (da > Math.PI) da -= Math.PI * 2; while (da < -Math.PI) da += Math.PI * 2;
      k.a += Math.max(-3, Math.min(3, da * 3.5)) * dt;
      const vt = Math.min(60, 5 + d * 1.6);
      k.v += (vt - k.v) * dt * 2.2;
      k.x += Math.cos(k.a) * k.v * dt; k.y += Math.sin(k.a) * k.v * dt;
      k.ph += dt * (4 + k.v * 0.22);
      const P = k.pts;
      P[0] = [k.x + Math.sin(k.a) * Math.sin(k.ph) * 0.5, k.y - Math.cos(k.a) * Math.sin(k.ph) * 0.5];
      for (let s = 1; s < P.length; s++) {
        const dx = P[s][0] - P[s - 1][0], dy = P[s][1] - P[s - 1][1], dd = Math.hypot(dx, dy) || 1;
        P[s] = [P[s - 1][0] + dx / dd * sp, P[s - 1][1] + dy / dd * sp];
      }
      c.clearRect(0, 0, cv.width, cv.height);
      const inK = (x, y) => { for (let s = 0; s < P.length; s++) if (Math.hypot(x - P[s][0], y - P[s][1]) < KRAD[s] * f) return s; return -1; };
      const minx = Math.floor(Math.min(...P.map(p => p[0])) - 4), maxx = Math.ceil(Math.max(...P.map(p => p[0])) + 4);
      const miny = Math.floor(Math.min(...P.map(p => p[1])) - 4), maxy = Math.ceil(Math.max(...P.map(p => p[1])) + 4);
      for (let y = miny; y <= maxy; y++) for (let x = minx; x <= maxx; x++) {
        const s = inK(x + 0.5, y + 0.5);
        if (s < 0) { if (inK(x - 1.5, y - 1.5) >= 0 && ((x + y) & 1) === 0) { c.fillStyle = '#141414'; c.fillRect(x, y, 1, 1); } continue; }
        const edge = inK(x + 1.5, y + 0.5) < 0 || inK(x - 0.5, y + 0.5) < 0 || inK(x + 0.5, y + 1.5) < 0 || inK(x + 0.5, y - 0.5) < 0;
        const patch = (s === 1 || s === 2 || s === 5) && ((x * 3 + y) % 5 !== 0);
        c.fillStyle = edge || patch ? '#141414' : '#fff';
        c.fillRect(x, y, 1, 1);
      }
      c.fillStyle = '#141414';
      const tl = P[P.length - 1], tp = P[P.length - 2], ta = Math.atan2(tl[1] - tp[1], tl[0] - tp[0]) + Math.sin(k.ph - 1.2) * 0.4;
      for (let q = 1; q <= 3; q++) for (const s of [-1, 1]) c.fillRect(Math.round(tl[0] + Math.cos(ta + s * 0.5) * q * f), Math.round(tl[1] + Math.sin(ta + s * 0.5) * q * f), 1, 1);
      const e = P[0];
      for (const s of [-1, 1]) c.fillRect(Math.round(e[0] + Math.cos(k.a) * 0.6 - Math.sin(k.a) * s * f), Math.round(e[1] + Math.sin(k.a) * 0.6 + Math.cos(k.a) * s * f), 1, 1);
      this._kraf = requestAnimationFrame(step);
    };
    this._kraf = requestAnimationFrame(step);
  }

  paintSprite() {
    const cv = document.getElementById('abSprite');
    if (!cv) return;
    const c = cv.getContext('2d'), bw = shadeBW(grid);
    c.clearRect(0, 0, cv.width, cv.height);
    c.fillStyle = '#141414';
    grid.forEach((r, y) => r.forEach((k, x) => { if (k >= 0) { c.fillRect(x + 1, y + 1, 1, 1); c.fillRect(x + 2, y + 1, 1, 1); } }));
    grid.forEach((r, y) => r.forEach((k, x) => { if (k >= 0) { c.fillStyle = bw[y * SW + x] ? '#fafaf8' : '#141414'; c.fillRect(x, y, 1, 1); } }));
  }

  // photos arrive as coarse grey mosaics and develop in three hard steps
  develop() {
    document.querySelectorAll('.ab-plate').forEach((pl) => {
      if (pl.dataset.dev) return;
      const r = pl.getBoundingClientRect();
      if (r.top > window.innerHeight * 0.92 || r.bottom < 0) return;
      pl.dataset.dev = '1';
      if (this.calm) { pl.style.filter = 'none'; return; }
      ['url(#apx12) grayscale(1)', 'url(#apx6) grayscale(.5)', 'none'].forEach((f, k) => setTimeout(() => { pl.style.filter = f; }, 130 * (k + 1)));
    });
  }

  renderVals() {
    return {
      sheet: SHEET.map(([k, v]) => ({ k, v })),
      bio: BIO.map(t => ({ t })),
      quests: QUESTS.map((q, i) => ({ ...q, no: pad2(i + 1) })),
      tools: TOOLS.map(([name, use], i) => ({ name, use, no: pad2(i + 1) })),
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

export default function About() {
  const [state, setState] = useState({ inv: false });
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
  const hoverInvert = (e) => { e.currentTarget.style.background = '#141414'; e.currentTarget.style.color = '#fff'; };
  const unhoverInvert = (e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#141414'; };
  const hoverRed = (e) => { e.currentTarget.style.background = '#8b1a1a'; e.currentTarget.style.color = '#fff'; };
  const unhoverRed = (e) => { e.currentTarget.style.background = '#141414'; e.currentTarget.style.color = '#fff'; };
  const hoverGhost = (e) => { e.currentTarget.style.background = '#141414'; e.currentTarget.style.color = '#fff'; };
  const unhoverGhost = (e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#141414'; };
  const hoverQuest = (e) => { e.currentTarget.style.transform = 'translate(-3px,-3px)'; e.currentTarget.style.boxShadow = '0 -3px 0 0 #141414,0 3px 0 0 #141414,-3px 0 0 0 #141414,3px 0 0 0 #141414,11px 11px 0 #141414'; };
  const unhoverQuest = (e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 -3px 0 0 #141414,0 3px 0 0 #141414,-3px 0 0 0 #141414,3px 0 0 0 #141414,8px 8px 0 #141414'; };
  const hoverTool = (e) => { e.currentTarget.style.background = '#141414'; e.currentTarget.style.color = '#fff'; };
  const unhoverTool = (e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#141414'; };

  return (
    <div className="mh-about" style={{ minHeight: '100vh', background: '#fff', backgroundImage: 'radial-gradient(#141414 1px,transparent 1.2px)', backgroundSize: '40px 40px', backgroundPosition: '20px 20px' }}>

      <header style={{ position: 'sticky', top: 0, zIndex: 30, display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', gap: '10px 24px', padding: 'clamp(10px,1.8vh,18px) clamp(14px,2.4vw,36px)', background: '#fff', borderBottom: '3px solid #141414' }}>
        <Link to="/" style={{ fontFamily: "'Pixelify Sans',monospace", fontWeight: 700, fontSize: 'clamp(20px,1.8vw,28px)', letterSpacing: '.06em' }}>MAEHLO</Link>
        <span style={{ fontSize: 'clamp(15px,1.15vw,19px)', letterSpacing: '.12em', textTransform: 'uppercase' }}>About — player profile · dwg. 05</span>
        <nav style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 'clamp(12px,1.4vw,22px)', fontSize: 'clamp(16px,1.2vw,20px)', textTransform: 'uppercase' }}>
          <span style={{ color: '#8b1a1a' }}>→ About</span>
          <Link to="/works">Works</Link>
          <Link to="/thinking">Thinking</Link>
          <Link to="/">Pond</Link>
          <Link to="/resume">Resume</Link>
          <button type="button" onClick={rv.toggleInvert} aria-pressed={rv.invPressed}
            style={{ fontFamily: 'inherit', fontSize: 'inherit', textTransform: 'uppercase', background: '#fff', color: '#141414', border: 0, cursor: 'pointer', padding: '0 8px', whiteSpace: 'nowrap', boxShadow: '0 -2px 0 0 #141414,0 2px 0 0 #141414,-2px 0 0 0 #141414,2px 0 0 0 #141414' }}
            onMouseEnter={hoverInvert} onMouseLeave={unhoverInvert}>{rv.invLabel}</button>
        </nav>
      </header>

      <main style={{ maxWidth: 1240, margin: '0 auto', padding: 'clamp(24px,5vh,56px) clamp(14px,3vw,44px) 80px', display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 'clamp(56px,9vh,110px)' }}>

        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,340px),1fr))', gap: 'clamp(24px,4vw,56px)', alignItems: 'start' }}>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 18, minWidth: 0 }}>
            <div style={{ background: '#fff', boxShadow: '0 -3px 0 0 #141414,0 3px 0 0 #141414,-3px 0 0 0 #141414,3px 0 0 0 #141414,10px 10px 0 #141414' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '5px 14px', background: '#141414', color: '#fff', fontSize: 'clamp(15px,1.1vw,18px)', letterSpacing: '.16em', textTransform: 'uppercase' }}>
                <span>Player 01</span><span>Video · loop</span>
              </div>
              <div className="ab-plate" style={{ aspectRatio: '4/5', filter: 'url(#apx24) grayscale(1)' }}>
                <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#141414' }}>
                  <video id="abVid" src="/uploads/IMG_4722.mp4" autoPlay muted loop playsInline aria-label="Video portrait of Malvin" style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }} />
                  <canvas id="abVidPx" className="ab-vidpx" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, imageRendering: 'pixelated' }} />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '6px 14px', borderTop: '3px solid #141414', fontSize: 'clamp(16px,1.15vw,19px)', letterSpacing: '.06em' }}>
                <span style={{ textTransform: 'uppercase', letterSpacing: '.14em', whiteSpace: 'nowrap' }}>fig. 00</span>
                <span style={{ textAlign: 'right', textWrap: 'pretty' }}>random video of me in formal wear (007) in my gallery</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'end', gap: 18, background: '#fff', justifySelf: 'start', padding: '12px 14px', boxShadow: '0 -2px 0 0 #141414,0 2px 0 0 #141414,-2px 0 0 0 #141414,2px 0 0 0 #141414' }}>
              <canvas id="abSprite" width="27" height="30" role="img" aria-label="Pixel sprite of Malvin" style={{ width: 81, height: 90, imageRendering: 'pixelated' }} />
              <div style={{ display: 'grid', gap: 2, fontSize: 'clamp(16px,1.15vw,19px)', letterSpacing: '.1em', textTransform: 'uppercase' }}>
                <span>fig. a — sprite</span>
                <span style={{ color: '#6d6a63' }}>scale 1:12 · 24 × 28</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 22, alignContent: 'start', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 'clamp(16px,1.2vw,19px)', letterSpacing: '.18em', textTransform: 'uppercase' }}>
              <span style={{ background: '#141414', color: '#fff', padding: '0 8px' }}>Sheet A1</span>
              <span style={{ background: '#fff', padding: '0 6px' }}>Character</span>
              <span aria-hidden="true" style={{ flex: 1, borderTop: '2px dashed #141414' }} />
            </div>
            <h1 style={{ margin: 0, fontFamily: "'Pixelify Sans',monospace", fontWeight: 600, fontSize: 'clamp(52px,6.4vw,104px)', lineHeight: .88, letterSpacing: '-.01em', background: '#fff', justifySelf: 'start', paddingRight: 10 }}>
              <span id="abName" aria-live="off" style={{ display: 'inline-block' }}>Malvin<br />Mallock Boye</span><span style={{ color: '#8b1a1a' }}>■</span>
            </h1>
            <p style={{ margin: 0, maxWidth: '34ch', background: '#fff', fontSize: 'clamp(24px,2vw,32px)', lineHeight: 1.1, textWrap: 'pretty' }}>I design and build for the wandering mind — mine included.</p>

            <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: 'auto minmax(0,1fr)', background: '#fff', boxShadow: '0 -3px 0 0 #141414,0 3px 0 0 #141414,-3px 0 0 0 #141414,3px 0 0 0 #141414' }}>
              {rv.sheet.map((s, j) => (
                <React.Fragment key={j}>
                  <dt style={{ padding: '7px 14px', borderBottom: '2px solid #141414', borderRight: '2px solid #141414', fontSize: 'clamp(15px,1.1vw,18px)', letterSpacing: '.16em', textTransform: 'uppercase', color: '#6d6a63', whiteSpace: 'nowrap' }}>{s.k}</dt>
                  <dd style={{ margin: 0, padding: '7px 14px', borderBottom: '2px solid #141414', fontSize: 'clamp(20px,1.5vw,24px)', lineHeight: 1.1 }}>{s.v}</dd>
                </React.Fragment>
              ))}
            </dl>

            <div style={{ display: 'grid', gap: 14, maxWidth: '62ch', background: '#fff', padding: '4px 0' }}>
              {rv.bio.map((b, j) => (
                <p key={j} style={{ margin: 0, fontSize: 'clamp(20px,1.5vw,24px)', lineHeight: 1.25, color: '#1f1e1c', textWrap: 'pretty' }}>{b.t}</p>
              ))}
            </div>
          </div>
        </section>

        <section style={{ display: 'grid', gap: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 'clamp(16px,1.2vw,19px)', letterSpacing: '.18em', textTransform: 'uppercase' }}>
            <span style={{ background: '#141414', color: '#fff', padding: '0 8px' }}>Sheet A2</span>
            <span style={{ background: '#fff', padding: '0 6px' }}>Side quests</span>
            <span aria-hidden="true" style={{ flex: 1, borderTop: '2px dashed #141414' }} />
          </div>
          <h2 style={{ margin: 0, fontFamily: "'Pixelify Sans',monospace", fontWeight: 500, fontSize: 'clamp(34px,3.6vw,58px)', lineHeight: 1, background: '#fff', justifySelf: 'start', paddingRight: 8 }}>What I do when I'm not designing</h2>
          <p style={{ margin: 0, maxWidth: '58ch', background: '#fff', justifySelf: 'start', fontSize: 'clamp(20px,1.5vw,24px)', lineHeight: 1.2, textWrap: 'pretty' }}>Every one of these ends up in the work sooner or later. That's kind of the point.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,260px),1fr))', gap: 26 }}>
            {rv.quests.map((q) => (
              <article key={q.no} style={{ background: '#fff', display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', minWidth: 0, boxShadow: '0 -3px 0 0 #141414,0 3px 0 0 #141414,-3px 0 0 0 #141414,3px 0 0 0 #141414,8px 8px 0 #141414', transition: 'transform .12s steps(3),box-shadow .12s steps(3)' }}
                onMouseEnter={hoverQuest} onMouseLeave={unhoverQuest}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: '4px 12px', borderBottom: '3px solid #141414', fontSize: 'clamp(15px,1.05vw,17px)', letterSpacing: '.14em', textTransform: 'uppercase' }}>
                  <span>Quest {q.no}</span><span style={{ color: '#6d6a63' }}>{q.tag}</span>
                </div>
                <div style={{ display: 'grid', gap: 8, padding: '14px 14px 18px' }}>
                  <h3 style={{ margin: 0, fontFamily: "'Pixelify Sans',monospace", fontWeight: 500, fontSize: 'clamp(22px,1.8vw,28px)', lineHeight: 1 }}>{q.title}</h3>
                  <p style={{ margin: 0, fontSize: 'clamp(18px,1.3vw,21px)', lineHeight: 1.15, color: '#2a2926', textWrap: 'pretty' }}>{q.line}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section style={{ display: 'grid', gap: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 'clamp(16px,1.2vw,19px)', letterSpacing: '.18em', textTransform: 'uppercase' }}>
            <span style={{ background: '#141414', color: '#fff', padding: '0 8px' }}>Sheet A3</span>
            <span style={{ background: '#fff', padding: '0 6px' }}>Inventory</span>
            <span aria-hidden="true" style={{ flex: 1, borderTop: '2px dashed #141414' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 14 }}>
            {rv.tools.map((t) => (
              <div key={t.no} style={{ display: 'grid', gap: 2, background: '#fff', padding: '10px 12px', boxShadow: '0 -2px 0 0 #141414,0 2px 0 0 #141414,-2px 0 0 0 #141414,2px 0 0 0 #141414' }}
                onMouseEnter={hoverTool} onMouseLeave={unhoverTool}>
                <span style={{ fontSize: 15, letterSpacing: '.14em', textTransform: 'uppercase', opacity: .65 }}>slot {t.no}</span>
                <span style={{ fontFamily: "'Pixelify Sans',monospace", fontSize: 'clamp(19px,1.4vw,22px)', lineHeight: 1.05 }}>{t.name}</span>
                <span style={{ fontSize: 17, lineHeight: 1.05 }}>{t.use}</span>
              </div>
            ))}
          </div>
        </section>

        <section style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr)', gap: 18, background: '#fff', padding: 'clamp(18px,2.4vw,30px)', boxShadow: '0 -3px 0 0 #8b1a1a,0 3px 0 0 #8b1a1a,-3px 0 0 0 #8b1a1a,3px 0 0 0 #8b1a1a' }}>
          <span style={{ fontSize: 'clamp(16px,1.2vw,19px)', letterSpacing: '.18em', textTransform: 'uppercase', color: '#8b1a1a' }}>▣ Save point</span>
          <h2 style={{ margin: 0, fontFamily: "'Pixelify Sans',monospace", fontWeight: 500, fontSize: 'clamp(30px,3vw,48px)', lineHeight: 1, textWrap: 'balance' }}>Got something that makes people curious? Let's make it.</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center' }}>
            <a href="mailto:malvinboye@gmail.com" style={{ padding: '5px 14px', background: '#141414', color: '#fff', fontSize: 'clamp(18px,1.35vw,22px)', letterSpacing: '.08em', boxShadow: '0 -2px 0 0 #141414,0 2px 0 0 #141414,-2px 0 0 0 #141414,2px 0 0 0 #141414,5px 5px 0 #8b1a1a' }}
              onMouseEnter={hoverRed} onMouseLeave={unhoverRed}>malvinboye@gmail.com</a>
            <Link to="/resume" style={{ padding: '5px 14px', background: '#fff', fontSize: 'clamp(18px,1.35vw,22px)', letterSpacing: '.12em', textTransform: 'uppercase', boxShadow: '0 -2px 0 0 #141414,0 2px 0 0 #141414,-2px 0 0 0 #141414,2px 0 0 0 #141414' }}
              onMouseEnter={hoverGhost} onMouseLeave={unhoverGhost}>Resume</Link>
            <a href="https://www.linkedin.com/in/malvin-m-boye/" target="_blank" rel="noopener noreferrer" style={{ padding: '5px 14px', background: '#fff', fontSize: 'clamp(18px,1.35vw,22px)', letterSpacing: '.12em', textTransform: 'uppercase', boxShadow: '0 -2px 0 0 #141414,0 2px 0 0 #141414,-2px 0 0 0 #141414,2px 0 0 0 #141414' }}
              onMouseEnter={hoverGhost} onMouseLeave={unhoverGhost}>LinkedIn ↗</a>
            <Link to="/" style={{ marginLeft: 'auto', fontSize: 'clamp(18px,1.35vw,22px)', letterSpacing: '.12em', textTransform: 'uppercase' }}>← back to the pond</Link>
          </div>
        </section>

        <footer style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '8px 24px', background: '#fff', padding: '8px 12px', borderTop: '3px solid #141414', fontSize: 'clamp(15px,1.1vw,18px)', letterSpacing: '.12em', textTransform: 'uppercase', fontVariantNumeric: 'tabular-nums' }}>
          <span>Maehlo — player profile</span><span>scale 1:1 · dwg. 05 · rev. a</span>
        </footer>
      </main>

      <canvas id="abKoi" aria-hidden="true" style={{ position: 'fixed', left: 0, top: 0, zIndex: 40, pointerEvents: 'none', imageRendering: 'pixelated' }} />

      <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
        <defs>
          <filter id="apx6" x="0" y="0" width="100%" height="100%">
            <feFlood x="3" y="3" width="1" height="1" />
            <feComposite width="6" height="6" />
            <feTile result="g" />
            <feComposite in="SourceGraphic" in2="g" operator="in" />
            <feMorphology operator="dilate" radius="3" />
          </filter>
          <filter id="apx12" x="0" y="0" width="100%" height="100%">
            <feFlood x="6" y="6" width="1" height="1" />
            <feComposite width="12" height="12" />
            <feTile result="g" />
            <feComposite in="SourceGraphic" in2="g" operator="in" />
            <feMorphology operator="dilate" radius="6" />
          </filter>
          <filter id="apx24" x="0" y="0" width="100%" height="100%">
            <feFlood x="12" y="12" width="1" height="1" />
            <feComposite width="24" height="24" />
            <feTile result="g" />
            <feComposite in="SourceGraphic" in2="g" operator="in" />
            <feMorphology operator="dilate" radius="12" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}
