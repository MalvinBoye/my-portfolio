import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

// ---------------------------------------------------------------------------
// Ported from the design handoff's Maehlo.dc.html — "the pond", Malvin's
// home page. Per the handoff README this is an exact rebuild: copy, numbers,
// and behaviour are all taken verbatim from the source's logic class.
// Canvas/simulation code is moved as-is rather than rewritten into React
// state, exactly as the README recommends — the Pond class below still
// queries the DOM directly and writes transforms every frame, the same way
// the source's DCLogic component did.
//
// Dead code intentionally NOT ported (per the README): the old Thinking-
// board constants (TNODES/TANS/TOPEN_NOTE) and class, the WORKS gallery
// (video-scrubbed walk-in/throw cast, folder frame, NOW_LIST/clock/typing)
// — none of it is referenced by anything the source actually renders on
// this page (no #work, #tboard elements exist in its markup). The pond,
// mini-me, feed tin, name-card glitch, intro animation, invert mode and
// door-warp transition are the only things Maehlo.dc.html renders, and are
// the only things ported here.
// ---------------------------------------------------------------------------

const c01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const seg = (v, a, b) => c01((v - a) / (b - a));
const TAU = Math.PI * 2;
const wrapAng = (a) => { while (a > Math.PI) a -= TAU; while (a < -Math.PI) a += TAU; return a; };

// The wireframe's own annotations, kept as part of the design: the page
// labels its own construction. x/y are % of the hero; each carries a leader
// line to the thing it names. A label either FOLLOWS something alive (it
// trails its subject at a fixed offset) or is pinned to a static box.
const MARKS = [
  { text: 'koi fish', t: 'koi', i: 0, off: [165, -155], box: false },
  { text: 'lily pads', t: 'pad', span: [0, 1], off: [140, -85] },
  { text: '→ My thought process', t: 'pad', i: 6, off: [150, -72] },
  { text: '→ Selected works', t: 'pad', i: 7, off: [-40, -96] },
  { text: '→ About me', t: 'pad', i: 2, off: [-20, -92] },
  { text: 'Name', t: 'el', el: '#nameBox', off: [0, -92], box: false },
  { text: 'My why', t: 'el', el: '#tagBox', off: [0, 0], beside: 22, box: false },
];

// Lily pads: a disc with a wedge cut out, drifting on the surface.
const PADS = [
  { x: 43.5, y: 24.6, d: 7.2, r: 12 },
  { x: 46.4, y: 30.3, d: 6.7, r: -48 },
  { x: 20.8, y: 46.6, d: 5.8, r: 130 },
  { x: 26.3, y: 48.6, d: 6.9, r: 205 },
  { x: 16.0, y: 53.7, d: 6.7, r: 62 },
  { x: 53.3, y: 47.5, d: 6.3, r: 285 },
  { x: 78.3, y: 40.1, d: 6.9, r: 158 },
  { x: 51.4, y: 70.2, d: 6.9, r: 24 },
  { x: 99.2, y: 18.3, d: 7.6, r: 240 },
  { x: 98.9, y: 79.3, d: 6.7, r: 96 },
  { x: 73.8, y: 96.2, d: 7.6, r: 312 },
  { x: 2.1, y: 87.5, d: 7.2, r: 176 },
];

// Pads that are doors. Index into PADS.
const PAD_LINKS = {
  6: { href: '/thinking', title: 'My thought process' },
  7: { href: '/works', title: 'Selected works' },
  2: { href: '/about', title: 'About me' },
};

// The koi are not a drawing that gets moved — they are built every frame from
// a spine of 11 vertebrae. A sine wave travels head→tail along that spine and
// the outline is skinned over it, so the body genuinely bends into its turns.
const SPINE = 11;
// half-width of each vertebra as a fraction of body length
const GIRTH = [0.030, 0.050, 0.061, 0.062, 0.058, 0.051, 0.043, 0.035, 0.026, 0.018, 0.010];

// Black and white only. Volume comes from an ordered-dither light ramp (lit
// from the top-left, each part shaded as a rounded form) plus a hard 2-cell
// extrusion drawn behind the silhouette — it reads as a little voxel figure.
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const BASE = [0, 0.2, 0.62, 0.34, 0.94, 0.52];
function shadeBW(g) {
  const H = g.length, W = g[0].length, out = [];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const k = g[y][x];
    if (k < 0) { out.push(-1); continue; }
    if (k === 0) { out.push(0); continue; }
    const head = y <= 17, cx = 12, cy = head ? 9.5 : y <= 19 ? 18 : 30, rx = head ? 8 : 9, ry = head ? 9 : 12;
    const nx = (x + 0.5 - cx) / rx, ny = (y + 0.5 - cy) / ry;
    const lum = Math.max(0, Math.min(1, 0.55 - (nx * 0.6 + ny * 0.7) * 0.5));
    let v = Math.max(0, Math.min(1, BASE[k] + (lum - 0.55) * 0.9));
    const rim = k !== 1 && ((x > 0 && g[y][x - 1] === 0) || (y > 0 && g[y - 1][x] === 0)) && nx < 0.1 && ny < 0.3;
    if (rim) v = 1;
    // the face stays clean paper: only a crescent of shadow on the far side,
    // and never next to an eye, the nose or the mouth
    if (k === 2 && head) {
      let nearFeature = false;
      for (let dy = -1; dy <= 1 && !nearFeature; dy++) for (let dx = -1; dx <= 1; dx++) {
        const X = x + dx, Y = y + dy;
        if (X >= 6 && X <= 17 && Y >= 7 && Y <= 15 && g[Y][X] === 0) { nearFeature = true; break; }
      }
      v = nearFeature ? 1 : (nx > 0.62 || ny > 0.7) ? 0.45 : 1;
    }
    out.push(v > (BAYER[(y & 3) * 4 + (x & 3)] + 0.5) / 16 ? 1 : 0);
  }
  return out;
}

// 90s loader sprite: a koi in 16×7 cells, two frames — tail flick and chomp.
// X = body, o = marking, . = empty
const WARP_KOI = [
  ['X.......XXXX....',
    'XX....XXXXXXXX..',
    '.XX.XXXooXXXXXX.',
    '..XXXXXXoooXX.XX',
    '.XX.XXXXooXXXXX.',
    'XX....XXXXXXXX..',
    'X.......XXXX....'],
  ['........XXXX....',
    'X.....XXXXXXXX..',
    'XXX.XXXooXXXXX..',
    '.XXXXXXXoooXX...',
    'XXX.XXXXooXXXX..',
    'X.....XXXXXXXX..',
    '........XXXX....'],
];

// Rings are stroked in a green marker whose brightness is the ring's current
// strength; the threshold pass turns that into ordered-dither density.
function drawRings(c, list, PX) {
  c.lineWidth = PX * 1.2;
  for (const r of list) {
    const u = r.t / r.dur;
    if (u >= 1) continue;
    const rad = 3 + r.r1 * (1 - Math.pow(1 - u, 2.4));
    const s = Math.min(1, r.alpha * 2.2 * (1 - u) * (1 - u) * (0.55 + r.w0 * 0.25));
    if (s < 0.04) continue;
    c.strokeStyle = `rgb(0,${Math.round(s * 255)},0)`;
    c.beginPath(); c.arc(r.x, r.y, rad, 0, Math.PI * 2); c.stroke();
  }
}

// Same crush as the koi canvas, for rings only.
function crushRings(c, cw, ch) {
  const img = c.getImageData(0, 0, cw, ch), a = img.data;
  const B = BAYER;
  for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) {
    const o = (y * cw + x) * 4;
    if (a[o + 3] < 90) { a[o + 3] = 0; continue; }
    const th = (B[(y & 3) * 4 + (x & 3)] + 0.5) / 16;
    if (a[o + 1] / 255 < th) { a[o + 3] = 0; continue; }
    a[o] = a[o + 1] = a[o + 2] = 20; a[o + 3] = 255;
  }
  c.putImageData(img, 0, 0);
}

// Catmull-Rom through the points, emitted as cubic beziers — a hand-drawn
// curve rather than a polygon.
function smooth(pts, close) {
  if (pts.length < 2) return '';
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || pts[i + 1];
    d += `C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)},`
      + `${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)},`
      + `${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return close ? d + 'Z' : d;
}

// Each koi keeps the heading it had in the Figma frame and swims a slow,
// uneven loop around it — a pond circuit, not an orbit. Three adults and
// four juveniles. `f` scales body length; the small ones are quicker and
// turn tighter, as they do. `d` is how deep the fish holds in the water
// column: 0 sits just under the surface, 1 cruises near the floor.
const KOI = [
  { x: 15.1, y: 27.7, r: -4, f: 1.0, p: 0, d: 0.06 },
  { x: 91.0, y: 43.1, r: 96, f: 0.92, p: 1, d: 0.52 },
  { x: 65.3, y: 63.3, r: 183, f: 1.06, p: 2, d: 0.22 },
  { x: 38.0, y: 74.0, r: 40, f: 0.46, p: 1, d: 0.78 },
  { x: 72.0, y: 20.0, r: 210, f: 0.40, p: 2, d: 0.34 },
  { x: 24.0, y: 58.0, r: 300, f: 0.5, p: 0, d: 0.66 },
  { x: 84.0, y: 78.0, r: 130, f: 0.38, p: 1, d: 0.14 },
  { x: 50.0, y: 40.0, r: 70, f: 0.85, p: 0, d: 0.4 },
  { x: 10.0, y: 82.0, r: 20, f: 0.44, p: 2, d: 0.28 },
  { x: 60.0, y: 90.0, r: 250, f: 0.36, p: 0, d: 0.58 },
  { x: 95.0, y: 15.0, r: 160, f: 0.72, p: 1, d: 0.74 },
  { x: 30.0, y: 12.0, r: 330, f: 0.42, p: 1, d: 0.46 },
];

// Pixel lily flowers: X ink outline, o white petal, y ink stamen
const LILY = [
  '....X.X....',
  '...XoXoX...',
  '.X.XoooX.X.',
  'XoXXoooXXoX',
  '.XoooyoooX.',
  '..XoyoyoX..',
  '...XXXXX...',
];
const LILY_ON = [1, 4, 8, 10];

// Three markings, described as spine ranges rather than drawn shapes, so they
// bend with the body like the rest of it.
const PATCH = [
  [[1, 5, 0.72], [7, 9, 0.6]],
  [[0, 3, 0.66], [5, 8, 0.7]],
  [[2, 4, 0.78], [6, 10, 0.55]],
];

// ---------------------------------------------------------------------------
// The pond. A koi does not travel on a path — it sculls, glides, banks into
// the turn and coasts. So this is a small steering simulation rather than a
// set of keyframes: thrust pulses drive speed, wander plus wall- and
// neighbour-avoidance drive heading, and the pads are floating bodies that
// get shoved by the wake of anything that swims past. Labels are part of the
// simulation too — each one trails its subject and keeps its leader attached.
// It writes transforms straight to the DOM; React renders the cast once.
// ---------------------------------------------------------------------------
class Pond {
  constructor(root) {
    this.root = root;
    this.lbls = [...root.querySelectorAll('.lbl')];
    this.ldrs = [...root.querySelectorAll('.ldr')];
    this.padEls = [...root.querySelectorAll('.pad')];
    this.koiEls = [...root.querySelectorAll('.koiG')];
    this.parts = this.koiEls.map(g => ({
      body: [...g.querySelectorAll('.kbody')],
      tail: [...g.querySelectorAll('.ktail')],
      fins: [...g.querySelectorAll('.kfins')],
      patch: g.querySelector('.kpatch'),
      patch2: g.querySelector('.kpatch2'),
      spine: g.querySelector('.kspine'),
      eyeL: g.querySelector('.kL'),
      eyeR: g.querySelector('.kR'),
      sh: g.querySelector('.ksh'),
    }));
    this.cripEls = [...document.querySelectorAll('.crip')];
    this.clicks = [];
    this.lines = root.querySelector('#pondLines');
    this.boxEls = [...root.querySelectorAll('.tbox')];
    this.pelEls = [...root.querySelectorAll('.pellet')];
    this.ripEls = [...root.querySelectorAll('.ripple')];
    this.pot = root.querySelector('#feedPot');
    this.hand = document.getElementById('feedHand');
    this.pellets = [];
    this.ripples = [];
    this.armed = false;
    this.measure();
    this.koi = this.koiEls.map((_, i) => {
      const k = KOI[i] || { x: 50, y: 50, r: 0, f: 0.5, p: 0 };
      return {
        x: this.W * k.x / 100, y: this.H * k.y / 100,
        a: (k.r - 90) * Math.PI / 180, v: 20, ph: i * 2.1, wob: i * 1.7, bank: 0, thrust: 0,
        cyc: i * 0.4, hunt: 0, rest: 0, turnS: 0, f: k.f, patch: PATCH[k.p % 3],
        tgt: null, tgtT: 1 + i * 1.7, glide: 0, d0: k.d == null ? 0.4 : k.d, dph: i * 1.9, depth: k.d || 0,
      };
    });
    // deepest first, so shallower fish paint over the ones below them
    const layer = root.querySelector('#koiLayer');
    if (layer) {
      this.koi.map((k, i) => [k.d0, this.koiEls[i]]).sort((a, b) => b[0] - a[0])
        .forEach(([, el]) => layer.appendChild(el));
    }
    // the IK chain starts laid out straight behind each head
    this.koi.forEach((k, i) => {
      const S = this.kh * k.f, sg = S * 0.074;
      k.S = S;
      k.pts = [];
      for (let s = 0; s < SPINE; s++) {
        k.pts.push([k.x - Math.cos(k.a) * sg * s, k.y - Math.sin(k.a) * sg * s]);
      }
    });
    this.pads = this.padEls.map((_, i) => {
      const d = PADS[i] || { x: 50, y: 50, r: 0 };
      return {
        x: this.W * d.x / 100, y: this.H * d.y / 100, vx: 0, vy: 0,
        rot: d.r, spin: (i % 2 ? 1 : -1) * (1.6 + (i % 3)), bob: i * 0.8,
      };
    });
    window.__mhPond = this;
    if (!window.__mhPadWired) {
      window.__mhPadWired = true;
      const hitPad = (p, cx, cy) => {
        const r = p.root.getBoundingClientRect(), x = cx - r.left, y = cy - r.top;
        for (const k in PAD_LINKS) {
          const pd = p.pads[k], def = PADS[k];
          if (!pd || !def) continue;
          const rad = p.W * def.d / 200 * 1.05;
          if (Math.hypot(x - pd.x, y - pd.y) < rad) return +k;
        }
        return -1;
      };
      // coming back from the destination restores the page from bfcache with
      // the final flash frame still up — tear the warp down on every show
      window.addEventListener('pageshow', () => {
        const p = window.__mhPond;
        if (p) p.endWarp();
      });
      window.addEventListener('pointermove', (e) => {
        const p = window.__mhPond;
        if (!p || p.armed || p.warping) return;
        const hk = hitPad(p, e.clientX, e.clientY);
        p.hovDoor = hk;
        p.root.style.cursor = hk >= 0 || (e.target.closest && e.target.closest('.lbl[data-door]')) ? 'pointer' : '';
      }, { passive: true });
      window.addEventListener('pointerdown', (e) => {
        const p = window.__mhPond;
        if (!p || p.armed || p.warping) return;
        let k = hitPad(p, e.clientX, e.clientY);
        const lb = e.target.closest && e.target.closest('.lbl[data-door]');
        if (lb) k = +lb.dataset.door;
        if (k < 0) return;
        p.startWarp(PAD_LINKS[k], e.clientX, e.clientY);
      });
    }
    if (!window.__mhFeedWired) {
      window.__mhFeedWired = true;
      // The whole page is a sheet of water: the pointer drags through it and
      // leaves a trail of small rings behind the hand.
      window.addEventListener('pointermove', (e) => {
        const p = window.__mhPond;
        if (!p) return;
        if (p.armed && p.hand) p.hand.style.transform = `translate3d(${e.clientX}px,${e.clientY}px,0) translate(-50%,-50%)`;
        const last = p._mv || (p._mv = [e.clientX, e.clientY]);
        const dx = e.clientX - last[0], dy = e.clientY - last[1], d = Math.hypot(dx, dy);
        if (d < 26) return;
        p._mv = [e.clientX, e.clientY];
        p.sheet(e.clientX, e.clientY, 22 + Math.min(70, d * 1.6), 0.85, 1, 0.2);
      }, { passive: true });
      // A second click throws the handful. Anywhere off the water just puts
      // the pot back down.
      window.addEventListener('pointerdown', (e) => {
        const p = window.__mhPond;
        if (!p || !p.armed) return;
        if (p.pot && p.pot.contains(e.target)) return;
        const r = p.root.getBoundingClientRect();
        p.scatter(e.clientX - r.left, e.clientY - r.top);
        p.disarm();
      });
      window.addEventListener('keydown', (e) => {
        const p = window.__mhPond;
        if (p && p.armed && e.key === 'Escape') p.disarm();
      });
      // every click anywhere rings the surface — inside the pond it is a real
      // ripple in pond space, elsewhere a viewport-space one over the page
      window.addEventListener('pointerdown', (e) => {
        const p = window.__mhPond;
        if (!p) return;
        const r = p.root.getBoundingClientRect();
        const x = e.clientX - r.left, y = e.clientY - r.top;
        if (x >= 0 && y >= 0 && x <= r.width && y <= r.height) p.ping(x, y, 0.8);
        p.sheet(e.clientX, e.clientY, 150, 1.5, 2.2, 0.42);
        p.sheet(e.clientX, e.clientY, 58, 0.7, 1.2, 0.3);
      });
    }
  }

  arm() {
    this.armed = true;
    this._potOpen = 1;
    const fh = this.root.querySelector('#feedPot .fhint'); if (fh) fh.textContent = 'click the water · esc';
    this.root.style.cursor = 'crosshair';
    if (this.hand) this.hand.style.setProperty('opacity', '1', 'important');
  }

  disarm() {
    this.armed = false;
    const fh = this.root.querySelector('#feedPot .fhint'); if (fh) fh.textContent = '▶ feed the koi';
    this.root.style.cursor = '';
    if (this.hand) this.hand.style.setProperty('opacity', '0', 'important');
    if (this.pot) this.pot.style.opacity = '1';
  }

  scatter(x, y) {
    if (x < 0 || y < 0 || x > this.W || y > this.H) return;
    const n = 6 + Math.floor(Math.random() * 4);
    for (let i = 0; i < n && this.pellets.length < 24; i++) {
      const a = Math.random() * TAU, d = Math.random() * 36;
      this.pellets.push({
        x: x + Math.cos(a) * d, y: y + Math.sin(a) * d,
        vx: Math.cos(a) * 30, vy: Math.sin(a) * 30, life: 0,
      });
    }
    this.ping(x, y, 1);
  }

  // One primitive for every disturbance: a ring that expands, thins and
  // fades. Food drops, wakes and gulps differ only in their numbers.
  ring(x, y, r1, dur, w0, alpha, wake) {
    if (this.ripples.length >= 30) {
      const w = this.ripples.findIndex(r => r.wake);
      if (w < 0) return;
      this.ripples.splice(w, 1);
    }
    this.ripples.push({ x, y, r1, dur, w0, alpha, wake: !!wake, t: 0 });
  }

  // the page-wide surface layer, in viewport space
  sheet(x, y, r1, dur, w0, alpha) {
    this.clicks.push({ x, y, r1, dur, w0, alpha, t: 0 });
    if (this.clicks.length > 40) this.clicks.shift();
  }

  ping(x, y, s) {
    this.ring(x, y, 60 + 90 * s, 0.7 + 0.9 * s, 0.8 + 1.4 * s, 0.5);
    if (s > 0.7) this.ring(x, y, 34 * s, 0.45, 2, 0.42);
  }

  // Skins the spine: a travelling sine sets each vertebra's angle, the
  // outline is stitched over the resulting points, and the fins hang off the
  // segments they belong to — caudal lagging furthest behind the wave.
  drawKoi(k, i, dt) {
    const P = this.parts[i];
    if (!P) return;
    const S = k.S, sg = S * 0.074;
    const spd = Math.min(1, k.v / 150);
    const eff = Math.min(1, k.thrust);
    k.hov = (k.hov || 0) + dt * (2.2 + (1 - spd) * 3.2);
    if (!k.pts) {
      k.pts = [];
      for (let s = 0; s < SPINE; s++) k.pts.push([k.x - Math.cos(k.a) * sg * s, k.y - Math.sin(k.a) * sg * s]);
    }

    const beat = Math.sin(k.ph * 2);
    const sway = S * (0.012 + spd * 0.03) * (0.35 + eff);
    const pt = k.pts, ang = new Array(SPINE);
    pt[0][0] = k.x - Math.sin(k.a) * beat * sway;
    pt[0][1] = k.y + Math.cos(k.a) * beat * sway;
    ang[0] = k.a;
    for (let s = 1; s < SPINE; s++) {
      let a = Math.atan2(pt[s][1] - pt[s - 1][1], pt[s][0] - pt[s - 1][0]);
      const back = ang[s - 1] + Math.PI, lim = 0.4;
      const rel = wrapAng(a - back);
      if (rel > lim) a = back + lim; else if (rel < -lim) a = back - lim;
      pt[s][0] = pt[s - 1][0] + Math.cos(a) * sg;
      pt[s][1] = pt[s - 1][1] + Math.sin(a) * sg;
      ang[s] = a + Math.PI;
    }
    const le = SPINE - 1;
    const nrm = ang.map(a => [-Math.sin(a), Math.cos(a)]);
    const rim = (s, m) => {
      const r = GIRTH[s] * S * m;
      return [[pt[s][0] + nrm[s][0] * r, pt[s][1] + nrm[s][1] * r],
        [pt[s][0] - nrm[s][0] * r, pt[s][1] - nrm[s][1] * r]];
    };
    const L = [], R = [];
    for (let s = 0; s < SPINE; s++) { const e = rim(s, 1); L.push(e[0]); R.push(e[1]); }
    const nose = [pt[0][0] + Math.cos(ang[0]) * S * 0.05, pt[0][1] + Math.sin(ang[0]) * S * 0.05];
    const tip = pt[SPINE - 1];
    const bodyD = smooth([nose, ...L, tip, ...R.slice().reverse()], true);

    const ta = ang[le] + Math.sin(k.ph * 2 - 1.35) * (0.16 + spd * 0.2) * (0.35 + eff);
    const TL = sg * 3.4, spread = 0.46;
    const root = [tip[0] + Math.cos(ang[le]) * sg * 0.35, tip[1] + Math.sin(ang[le]) * sg * 0.35];
    const back = (a, d) => [tip[0] - Math.cos(a) * d, tip[1] - Math.sin(a) * d];
    const f2 = (p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
    const tailD = `M${f2(root)}`
      + `Q${f2(back(ta - 0.34, TL * 0.55))} ${f2(back(ta - spread, TL))}`
      + `Q${f2(back(ta, TL * 0.52))} ${f2(back(ta + spread, TL))}`
      + `Q${f2(back(ta + 0.34, TL * 0.55))} ${f2(root)}Z`;

    let finD = '';
    for (const side of [1, -1]) {
      const s = 2, r = GIRTH[s] * S * 0.9;
      const base = [pt[s][0] + nrm[s][0] * r * side, pt[s][1] + nrm[s][1] * r * side];
      const sweep = 0.95 + Math.sin(k.hov + (side > 0 ? 0 : 1.35)) * (0.14 + (1 - spd) * 0.44)
        - eff * 0.2;
      const fa = ang[s] + Math.PI - side * sweep, FL = sg * 2.1;
      const ftip = [base[0] + Math.cos(fa) * FL, base[1] + Math.sin(fa) * FL];
      const bow = [base[0] + Math.cos(fa - side * 0.7) * FL * 0.6, base[1] + Math.sin(fa - side * 0.7) * FL * 0.6];
      const bow2 = [base[0] + Math.cos(fa + side * 0.45) * FL * 0.5, base[1] + Math.sin(fa + side * 0.45) * FL * 0.5];
      finD += `M${base[0].toFixed(1)} ${base[1].toFixed(1)}`
        + `Q${bow[0].toFixed(1)} ${bow[1].toFixed(1)} ${ftip[0].toFixed(1)} ${ftip[1].toFixed(1)}`
        + `Q${bow2[0].toFixed(1)} ${bow2[1].toFixed(1)} ${base[0].toFixed(1)} ${base[1].toFixed(1)}Z`;
    }
    const dorsal = smooth(pt.slice(1, 8), false);

    const blob = ([a, b, m]) => {
      const up = [], dn = [];
      for (let s = a; s <= b; s++) { const e = rim(s, m); up.push(e[0]); dn.push(e[1]); }
      return smooth([...up, ...dn.reverse()], true);
    };

    P.body.forEach(el => el.setAttribute('d', bodyD));
    P.tail.forEach(el => el.setAttribute('d', tailD));
    P.fins.forEach(el => el.setAttribute('d', finD));
    if (P.patch) P.patch.setAttribute('d', blob(k.patch[0]));
    if (P.patch2) P.patch2.setAttribute('d', blob(k.patch[1]));
    if (P.spine) P.spine.setAttribute('d', dorsal);
    const er = GIRTH[0] * S * 1.15, ey = S * 0.012;
    if (P.eyeL) {
      P.eyeL.setAttribute('r', Math.max(1.4, S * 0.014).toFixed(1));
      P.eyeL.setAttribute('cx', (pt[0][0] + nrm[0][0] * er + Math.cos(ang[0]) * ey).toFixed(1));
      P.eyeL.setAttribute('cy', (pt[0][1] + nrm[0][1] * er + Math.sin(ang[0]) * ey).toFixed(1));
    }
    k.draw = {
      bodyD, tailD, finD, p1: blob(k.patch[0]), p2: blob(k.patch[1]),
      eyes: [[pt[0][0] + nrm[0][0] * er + Math.cos(ang[0]) * ey, pt[0][1] + nrm[0][1] * er + Math.sin(ang[0]) * ey],
        [pt[0][0] - nrm[0][0] * er + Math.cos(ang[0]) * ey, pt[0][1] - nrm[0][1] * er + Math.sin(ang[0]) * ey]],
      sx: S * 0.045, sy: S * 0.07,
    };
    if (P.eyeR) {
      P.eyeR.setAttribute('r', Math.max(1.4, S * 0.014).toFixed(1));
      P.eyeR.setAttribute('cx', (pt[0][0] - nrm[0][0] * er + Math.cos(ang[0]) * ey).toFixed(1));
      P.eyeR.setAttribute('cy', (pt[0][1] - nrm[0][1] * er + Math.sin(ang[0]) * ey).toFixed(1));
    }
    k.wk = (k.wk || 0) - dt;
    if (k.wk <= 0 && (k.hunt > 0 || k.v > 110)) {
      k.wk = 0.3;
      this.ring(k.x, k.y, S * 0.2, 0.7, 1, 0.26, true);
    }
    const dep = k.depth || 0;
    this.koiEls[i].style.opacity = (1 - dep * 0.5).toFixed(3);
    if (P.sh) P.sh.setAttribute('transform',
      `translate(${(S * 0.045 * (1 - dep * 0.7)).toFixed(1)},${(S * 0.07 * (1 - dep * 0.7)).toFixed(1)})`);
  }

  // Arcade render: the procedural koi are rasterised into a canvas at 1/5
  // resolution, then crushed to pure black and white.
  renderPix(W, H) {
    const cv = this.pix || (this.pix = this.root.querySelector('#koiPix'));
    if (!cv) return;
    const PX = 4, cw = Math.ceil(W / PX), ch = Math.ceil(H / PX);
    if (cv.width !== cw || cv.height !== ch) {
      cv.width = cw; cv.height = ch;
      cv.style.width = cw * PX + 'px'; cv.style.height = ch * PX + 'px';
    }
    const c = cv.getContext('2d', { willReadFrequently: true });
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.clearRect(0, 0, cw, ch);
    c.setTransform(1 / PX, 0, 0, 1 / PX, 0, 0);
    c.lineJoin = 'round';
    const order = this.koi.filter(k => k.draw).sort((a, b) => b.depth - a.depth);
    drawRings(c, this.ripples, PX);
    c.fillStyle = 'rgb(255,0,0)';
    for (const k of order) {
      const d = k.draw, dep = k.depth || 0;
      c.save();
      c.translate(d.sx * (1 - dep * 0.7), d.sy * (1 - dep * 0.7));
      c.fill(new Path2D(d.bodyD)); c.fill(new Path2D(d.tailD)); c.fill(new Path2D(d.finD));
      c.restore();
    }
    for (const k of order) {
      const d = k.draw, dep = k.depth || 0;
      const ink = dep > 0.6 ? 'rgb(0,0,255)' : '#000';
      const paths = [d.finD, d.tailD, d.bodyD].map(s => new Path2D(s));
      c.lineWidth = PX * 2;
      c.strokeStyle = ink;
      for (const p of paths) c.stroke(p);
      c.fillStyle = '#fff';
      for (const p of paths) c.fill(p);
      c.fillStyle = ink;
      c.fill(new Path2D(d.p1)); c.fill(new Path2D(d.p2));
      for (const e of d.eyes) c.fillRect(e[0] - PX * 0.7, e[1] - PX * 0.7, PX * 1.4, PX * 1.4);
    }
    const img = c.getImageData(0, 0, cw, ch), a = img.data;
    const B = BAYER;
    for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) {
      const o = (y * cw + x) * 4;
      if (a[o + 3] < 128) { a[o + 3] = 0; continue; }
      const th = (B[(y & 3) * 4 + (x & 3)] + 0.5) / 16;
      const r = a[o], gg = a[o + 1], bb = a[o + 2];
      let on;
      if (gg - r > 60 && gg - bb > 60) {
        if (gg / 255 < th) { a[o + 3] = 0; continue; }
        on = true;
      } else if (r - gg > 90 && r - bb > 90) {
        if (th > 0.26) { a[o + 3] = 0; continue; }
        on = true;
      } else if (bb - r > 90) {
        on = ((x + y) & 1) === 0;
      } else on = (r * 0.3 + gg * 0.59 + bb * 0.11) < 128;
      const v = on ? 20 : 255;
      a[o] = a[o + 1] = a[o + 2] = v; a[o + 3] = 255;
    }
    c.putImageData(img, 0, 0);
  }

  // The door animation: the screen dissolves to black in ordered-dither
  // pixels spreading from the pad, a pixel koi chomps its way along a row of
  // pellets as the loading bar, the frame flashes, and we're through.
  startWarp(link, ox, oy) {
    const box = document.getElementById('warp');
    const cv = document.getElementById('warpPix');
    if (!box || !cv) { window.location.href = link.href; return; }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this._navigate(link.href);
      return;
    }
    this.warping = true;
    this.root.style.cursor = '';
    const PX = 8, cw = Math.ceil(window.innerWidth / PX), ch = Math.ceil(window.innerHeight / PX);
    cv.width = cw; cv.height = ch;
    cv.style.width = cw * PX + 'px'; cv.style.height = ch * PX + 'px';
    box.style.display = 'block';
    box.style.pointerEvents = 'auto';
    const txt = document.getElementById('warpText');
    const ttl = document.getElementById('warpTitle');
    const pct = document.getElementById('warpPct');
    if (ttl) ttl.textContent = link.title;
    const c = cv.getContext('2d');
    const B = BAYER;
    const gx = ox / PX, gy = oy / PX, far = Math.hypot(Math.max(gx, cw - gx), Math.max(gy, ch - gy));
    const INK = '#141414', LIT = '#f4f4f0';
    const barY = Math.round(ch * 0.58), x0 = Math.round(cw * 0.18), x1 = Math.round(cw * 0.82);
    const t0 = performance.now();
    const tick = () => {
      const t = (performance.now() - t0) / 1000;
      c.fillStyle = INK;
      if (t < 0.7) {
        const u = t / 0.7;
        c.clearRect(0, 0, cw, ch);
        for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) {
          const v = Math.hypot(x - gx, y - gy) / far * 0.72 + (B[(y & 3) * 4 + (x & 3)] / 16) * 0.28;
          if (v < u) c.fillRect(x, y, 1, 1);
        }
        return;
      }
      c.fillRect(0, 0, cw, ch);
      const u = Math.min(1, (t - 0.7) / 1.9);
      if (txt) txt.style.opacity = '1';
      if (pct) pct.textContent = 'LOADING ' + String(Math.floor(u * 100)).padStart(2, '0') + '%';
      const head = x0 + (x1 - x0 + 16) * u;
      c.fillStyle = LIT;
      for (let x = x0; x <= x1; x += 3) if (x > head - 1) c.fillRect(x, barY + 3, 1, 1);
      const fr = WARP_KOI[Math.floor(t * 9) % 2];
      const sx = Math.round(head - 16), sy = barY + Math.round(Math.sin(t * 11) * 0.6);
      for (let r = 0; r < fr.length; r++) for (let q = 0; q < fr[r].length; q++) {
        const ch2 = fr[r][q];
        if (ch2 === '.') continue;
        c.fillStyle = ch2 === 'o' ? INK : LIT;
        c.fillRect(sx + q, sy + r, 1, 1);
      }
      c.fillStyle = LIT;
      for (let b = 0; b < 4; b++) {
        const bt = (t * 1.4 + b * 0.27) % 1;
        c.fillRect(sx - 2 - b * 3, sy - 1 - Math.round(bt * 7), 1, 1);
      }
      c.fillStyle = 'rgba(0,0,0,.35)';
      for (let y = 0; y < ch; y += 2) c.fillRect(0, y, cw, 1);
      if (t > 2.6) {
        c.fillStyle = LIT; c.fillRect(0, 0, cw, ch);
        if (txt) txt.style.opacity = '0';
      }
      if (t > 2.78) {
        clearInterval(this._warpI);
        this._navigate(link.href);
      }
    };
    tick();
    this._warpI = setInterval(tick, 33);
  }

  endWarp() {
    if (this._warpI) { clearInterval(this._warpI); this._warpI = null; }
    this.warping = false;
    const box = document.getElementById('warp');
    if (box) { box.style.display = 'none'; box.style.pointerEvents = 'none'; }
    const txt = document.getElementById('warpText');
    if (txt) txt.style.opacity = '0';
    const cv = document.getElementById('warpPix');
    if (cv) { const c = cv.getContext('2d'); c.clearRect(0, 0, cv.width, cv.height); }
  }

  pixVis(pd) {
    const t = pd.pixT || 0;
    if (t <= 0) return 0;
    return Math.max(0, Math.min(1, (3.2 - t) / 0.35, t / 0.45));
  }

  // Pixel pads are rasterised cell-by-cell (no anti-aliasing to crush): a
  // disc with its notch, a one-cell outline, dotted veins and a dot-screen
  // shadow. The flowers ride their pads always, pixelated or not.
  renderPads() {
    const cv = this.padCv || (this.padCv = this.root.querySelector('#padPixCv'));
    if (!cv) return;
    const W = this.W, H = this.H, PX = 4, cw = Math.ceil(W / PX), ch = Math.ceil(H / PX);
    if (cv.width !== cw || cv.height !== ch) {
      cv.width = cw; cv.height = ch;
      cv.style.width = cw * PX + 'px'; cv.style.height = ch * PX + 'px';
    }
    const c = cv.getContext('2d');
    c.clearRect(0, 0, cw, ch);
    const B = BAYER;
    const INK = '#141414';
    this.pads.forEach((p, i) => {
      const def = PADS[i];
      if (!def) return;
      const d0 = W * def.d / 100, r = d0 / 2;
      const bob = Math.sin(p.bob) * (2.2 + (p.rock || 0) * 9);
      const cx = p.x, cy = p.y + bob;
      const scr = this.pixVis(p);
      const door = PAD_LINKS[i] != null, hovD = door && this.hovDoor === i;
      {
        const a = -(p.rot || 0) * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a);
        const inside = (px, py) => {
          const dx = px - cx, dy = py - cy, dd = Math.hypot(dx, dy);
          if (dd > r) return false;
          const lx = dx * ca - dy * sa, ly = dx * sa + dy * ca;
          return !(lx > 0 && Math.abs(Math.atan2(ly, lx)) < 0.26 && dd > r * 0.08);
        };
        const x0 = Math.max(0, Math.floor((cx - r) / PX) - 2), x1 = Math.min(cw - 1, Math.ceil((cx + r) / PX) + 3);
        const y0 = Math.max(0, Math.floor((cy - r) / PX) - 2), y1 = Math.min(ch - 1, Math.ceil((cy + r) / PX) + 4);
        const sx = d0 * 0.07, sy = d0 * 0.1;
        for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
          const b = B[(y & 3) * 4 + (x & 3)] / 16;
          if (scr > 0 && Math.random() < scr * 0.35) { if (Math.random() < 0.5) continue; c.fillStyle = INK; c.fillRect(x + (Math.random() < 0.5 ? 1 : -1), y, 1, 1); continue; }
          const px = x * PX + PX / 2, py = y * PX + PX / 2;
          if (inside(px, py)) {
            const edge = !inside(px + PX, py) || !inside(px - PX, py) || !inside(px, py + PX) || !inside(px, py - PX);
            const dx = px - cx, dy = py - cy, dd = Math.hypot(dx, dy);
            const ang = Math.atan2(dx * sa + dy * ca, dx * ca - dy * sa);
            const vein = dd > r * 0.22 && dd < r * 0.84 && ((x + y) & 1) === 0 &&
              Math.abs(((ang + 0.26 + Math.PI * 2) % (Math.PI / 3)) - Math.PI / 6) < 0.09;
            c.fillStyle = edge || vein ? INK : '#fff';
            c.fillRect(x, y, 1, 1);
          } else if (inside(px - sx, py - sy) && b < 0.25) {
            c.fillStyle = INK;
            c.fillRect(x, y, 1, 1);
          }
        }
      }
      if (door) {
        const rr = r / PX + (hovD ? 3 : 4), n = Math.ceil(rr * 7), tt = performance.now() / (hovD ? 90 : 220);
        c.fillStyle = '#8b1a1a';
        for (let k2 = 0; k2 < n; k2++) {
          if ((k2 + Math.floor(tt)) % 3 === 0) continue;
          const an = k2 / n * Math.PI * 2;
          c.fillRect(Math.round(cx / PX + Math.cos(an) * rr), Math.round(cy / PX + Math.sin(an) * rr), 1, 1);
        }
      }
      if (LILY_ON.includes(i)) {
        const fx = Math.round((cx + Math.cos(i * 1.7) * r * 0.25) / PX) - 5;
        const fy = Math.round((cy + Math.sin(i * 1.7) * r * 0.25) / PX) - 4 + (Math.sin(p.bob * 1.3) > 0.6 ? -1 : 0);
        for (let rr = 0; rr < LILY.length; rr++) for (let q = 0; q < LILY[rr].length; q++) {
          const k = LILY[rr][q];
          if (k === '.') continue;
          c.fillStyle = k === 'o' ? '#fff' : INK;
          c.fillRect(fx + q, fy + rr, 1, 1);
        }
        c.fillStyle = INK;
        for (let q = 1; q < 10; q += 2) c.fillRect(fx + q + 1, fy + LILY.length + 1, 1, 1);
      }
    });
  }

  renderSheet() {
    const cv = this.sheetCv || (this.sheetCv = document.getElementById('sheetPix'));
    if (!cv) return;
    const PX = 4, cw = Math.ceil(window.innerWidth / PX), ch = Math.ceil(window.innerHeight / PX);
    if (cv.width !== cw || cv.height !== ch) {
      cv.width = cw; cv.height = ch;
      cv.style.width = cw * PX + 'px'; cv.style.height = ch * PX + 'px';
    }
    const c = cv.getContext('2d', { willReadFrequently: true });
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.clearRect(0, 0, cw, ch);
    if (!this.clicks.length) return;
    c.setTransform(1 / PX, 0, 0, 1 / PX, 0, 0);
    drawRings(c, this.clicks, PX);
    c.setTransform(1, 0, 0, 1, 0, 0);
    crushRings(c, cw, ch);
  }

  // The pond's glitch runs on a 15s cycle: while it fires, the pads drop
  // into coarse black-and-white pixels, and the name card swaps between the
  // full name and the alias, breaking through pixels as it goes.
  padGlitch() {
    const T = performance.now() / 1000, g = T % 15, slot = Math.floor(T / 15) % 2;
    const calm = this._calmQ ?? (this._calmQ = window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    let f = '';
    if (!calm && g < 0.6) f = g < 0.12 || g >= 0.48 ? 'url(#txtPix)' : 'url(#padPix)';
    const showAlias = !calm && g < 0.3 ? 1 - slot : slot;
    if (showAlias !== this._nameK) {
      this._nameK = showAlias;
      const nt = this.root.querySelector('#nameTxt');
      if (nt) nt.innerHTML = showAlias ? 'Maelo' : 'Malvin<br>Mallock Boye';
    }
    if (f !== this._txtF) {
      this._txtF = f;
      const el = this.root.querySelector('#nameBox');
      if (el) el.style.filter = f;
      const tg = this.root.querySelector('#tagBox');
      if (tg) tg.style.filter = '';
    }
    this.padEls.forEach((el) => {
      const op = '0';
      if (el._op === op) return;
      el._op = op;
      el.style.filter = '';
      el.style.opacity = op;
    });
    this.renderPads();
  }

  measure() {
    this.W = this.root.clientWidth || 1200;
    this.H = this.root.clientHeight || 800;
    if (this.lines) this.lines.setAttribute('viewBox', `0 0 ${this.W} ${this.H}`);
    this.kh = Math.max(150, Math.min(340, this.H * 0.34));
    this.kw = this.kh * 200 / 470;
  }

  step(dt, t) {
    if (this.root.clientWidth !== this.W || this.root.clientHeight !== this.H) this.measure();
    const W = this.W, H = this.H, kh = this.kh;

    this.koi.forEach((k, i) => {
      k.depth = c01(k.d0 + Math.sin(t * 0.09 + k.dph) * 0.1 - k.hunt * 0.25 - (k.dash > 0 ? 0.15 : 0));
      const S = kh * k.f * (1 - k.depth * 0.2);
      k.S = S;
      k.glide = Math.max(0, k.glide - dt);
      k.ph += dt * (2.3 + i * 0.16) * (1 + k.hunt * 1.3 + (k.dash > 0 ? 1.1 : 0)) / Math.sqrt(k.f) * TAU * 0.25;
      k.cyc += dt * (0.15 + i * 0.022);
      const burst = Math.pow(Math.max(0, Math.sin(k.cyc * TAU)), 0.7);
      k.dash = Math.max(0, (k.dash || 0) - dt);
      const dash = k.dash > 0 ? 1 : 0;
      const thrust = (Math.pow(Math.max(0, Math.sin(k.ph)), 2) + (k.hunt + dash) * 0.35)
        * (0.18 + burst * 0.95 + (k.hunt + dash) * 1.1) * (k.glide > 0 && !dash ? 0.22 : 1);
      k.thrust = thrust;
      const K = 372 * (0.72 + k.f * 0.4) * (1 + k.hunt * 2.1 + dash * 1.8);
      const drag = 0.02 * k.v * k.v + 0.9 * k.v;
      k.v = Math.max(0, Math.min(340, k.v + (thrust * K - drag) * dt));

      k.wob += dt * (0.5 + i * 0.13);
      let turn = Math.sin(k.wob) * 0.3 + Math.sin(k.wob * 2.3 + i) * 0.14;

      let near = 0;
      for (const o of this.koi) if (o !== k && Math.hypot(o.x - k.x, o.y - k.y) < S * 1.15) near++;
      k.tgtT -= dt;
      if (k.tgtT <= 0) {
        if (near >= 3 && !k.hunt) {
          const side = Math.floor(Math.random() * 4), m = S * 1.5;
          k.tgt = side === 0 ? [-m, Math.random() * H] : side === 1 ? [W + m, Math.random() * H]
            : side === 2 ? [Math.random() * W, -m] : [Math.random() * W, H + m];
          k.tgtT = 5 + Math.random() * 4;
          k.tgtOut = true;
        } else {
          k.tgtOut = false;
          k.tgt = [W * (0.08 + Math.random() * 0.84), H * (0.1 + Math.random() * 0.8)];
          k.tgtT = 7 + Math.random() * 9;
        }
      }
      if (k.tgt) {
        const gx = k.tgt[0] - k.x, gy = k.tgt[1] - k.y;
        if (Math.hypot(gx, gy) < S * 0.45) {
          k.tgt = null; k.tgtOut = false; k.glide = 1.6 + Math.random() * 2.6;
        } else turn += wrapAng(Math.atan2(gy, gx) - k.a) * 0.62;
      }

      const out = Math.max(0, -k.x, k.x - W, -k.y, k.y - H);
      if (out > 0 && !k.tgtOut) {
        const home = Math.atan2(H * 0.5 - k.y, W * 0.5 - k.x);
        turn += wrapAng(home - k.a) * Math.min(1.1, 0.3 + out / (S * 1.4));
      }

      for (let j = 0; j < this.koi.length; j++) {
        if (j === i) continue;
        const o = this.koi[j], dx = k.x - o.x, dy = k.y - o.y, d = Math.hypot(dx, dy);
        const R = S * 0.75;
        if (d < R && d > 0.01) turn += wrapAng(Math.atan2(dy, dx) - k.a) * 1.1 * (1 - d / R);
      }

      k.rest = Math.max(0, k.rest - dt);
      k.hunt = 0;
      if (this.pellets.length && k.rest <= 0) {
        let best = null, bd = 1e9;
        for (const p of this.pellets) {
          const d = Math.hypot(p.x - k.x, p.y - k.y);
          if (d < bd) { bd = d; best = p; }
        }
        if (best) {
          k.hunt = 1;
          turn = wrapAng(Math.atan2(best.y - k.y, best.x - k.x) - k.a) * 5.2;
          k.tgt = null; k.tgtOut = false; k.glide = 0;
          if (bd < S * 0.16) {
            this.pellets = this.pellets.filter(p => p !== best);
            this.ring(k.x, k.y, S * 0.34, 0.5, 2.2, 0.55);
            this.ring(k.x, k.y, S * 0.72, 0.95, 1.2, 0.3);
            k.dash = 0.9;
            const away = Math.atan2(k.y - best.y, k.x - best.x)
              + (Math.random() < 0.5 ? -1 : 1) * (0.3 + Math.random() * 0.5);
            k.a = away;
            k.tgt = [k.x + Math.cos(away) * S * 6, k.y + Math.sin(away) * S * 6];
            k.tgtOut = false;
            k.tgtT = 6 + Math.random() * 4;
            k.rest = 2.4 + Math.random() * 2;
            k.hunt = 0;
          }
        }
      }

      turn = Math.max(-1.2, Math.min(1.2, turn));
      k.turnS += (turn - k.turnS) * Math.min(1, dt * (k.hunt ? 6 : 2.4));
      k.a += k.turnS * dt;
      k.bank += (k.turnS * 15 - k.bank) * Math.min(1, dt * 3);
      k.x += Math.cos(k.a) * k.v * dt;
      k.y += Math.sin(k.a) * k.v * dt;
      const far = S * 2 + Math.max(W, H) * 0.35;
      k.x = Math.max(-far, Math.min(W + far, k.x));
      k.y = Math.max(-far, Math.min(H + far, k.y));
      this.drawKoi(k, i, dt);
    });

    // Rigid bodies, not ghosts: head and midbody are solid discs with mass,
    // so fish bump, slide along each other and jostle when they pack in
    // around a pellet.
    const SAMP = [0, 2, 4, 6, 8];
    const discs = (k) => {
      const S = k.S || kh;
      if (!k.pts) return [[k.x, k.y, S * 0.08]];
      return SAMP.map(s => [k.pts[s][0], k.pts[s][1], Math.max(S * 0.05, GIRTH[s] * S * 1.45)]);
    };
    const shove = (k, dx, dy) => {
      k.x += dx; k.y += dy;
      if (k.pts) for (const p of k.pts) { p[0] += dx; p[1] += dy; }
    };
    for (let pass = 0; pass < 2; pass++) {
      for (let i = 0; i < this.koi.length; i++) {
        const a = this.koi[i], da = discs(a), ma = (a.S || kh) * (a.S || kh);
        for (let j = i + 1; j < this.koi.length; j++) {
          const b = this.koi[j], db = discs(b), mb = (b.S || kh) * (b.S || kh);
          if (Math.abs(a.depth - b.depth) > 0.3) continue;
          for (const ca of da) for (const cb of db) {
            const dx = cb[0] - ca[0], dy = cb[1] - ca[1], d = Math.hypot(dx, dy), min = ca[2] + cb[2];
            if (d >= min || d < 1e-4) continue;
            const nx = dx / d, ny = dy / d, push = min - d, tot = ma + mb;
            shove(a, -nx * push * (mb / tot), -ny * push * (mb / tot));
            shove(b, nx * push * (ma / tot), ny * push * (ma / tot));
            if (pass) continue;
            const hit = Math.min(1, push / min * 3);
            a.v *= 1 - 0.28 * hit; b.v *= 1 - 0.28 * hit;
            a.a += wrapAng(Math.atan2(-ny, -nx) - a.a) * 0.12 * hit;
            b.a += wrapAng(Math.atan2(ny, nx) - b.a) * 0.12 * hit;
          }
        }
      }
    }

    this.pads.forEach((p, i) => {
      const d0 = W * (PADS[i] ? PADS[i].d : 6) / 100, r = d0 / 2;
      p.bob += dt * 0.6;
      p.vx += Math.cos(t * 0.05 + i) * 2.4 * dt;
      p.vy += Math.sin(t * 0.043 + i * 1.7) * 1.8 * dt;
      for (const k of this.koi) {
        const dx = p.x - k.x, dy = p.y - k.y, d = Math.hypot(dx, dy), R = (k.S || kh) * 0.62;
        if (d < R && d > 0.01) {
          const f = (1 - d / R) * (5 + k.thrust * 14 + k.v * 0.06) * (1 - k.depth * 0.8) * dt;
          p.vx += dx / d * f; p.vy += dy / d * f;
          p.spin += (dx - dy) * 0.0006 * f;
          p.bob += f * 0.05;
        }
        if (d < R * 0.5) p.pixT = 3.2;
        const fast = Math.max(0, k.v - 85) / 140;
        const RR = R * 1.35;
        if (fast > 0 && d < RR && d > 0.01) {
          const w = (1 - d / RR) * Math.min(1, fast) * (1 - k.depth * 0.65);
          p.rock = Math.min(1.2, (p.rock || 0) + w * dt * 7);
          p.vx += dx / d * w * 95 * dt;
          p.vy += dy / d * w * 95 * dt;
          p.spin += (dx * Math.sin(k.a) - dy * Math.cos(k.a)) * 0.0022 * w;
          p.rt = (p.rt || 0) - dt;
          if (p.rt <= 0 && w > 0.35) { p.rt = 0.5; this.ring(p.x, p.y, d0 * 0.9, 0.9, 1.1, 0.3, true); }
        }
      }
      const damp = Math.pow(0.5, dt * 1.3);
      p.vx *= damp; p.vy *= damp;
      p.x += p.vx * dt; p.y += p.vy * dt;
      const lim = r * 0.75;
      if (p.x < -lim) { p.x = -lim; p.vx = Math.abs(p.vx) * 0.5; }
      if (p.x > W + lim) { p.x = W + lim; p.vx = -Math.abs(p.vx) * 0.5; }
      if (p.y < -lim) { p.y = -lim; p.vy = Math.abs(p.vy) * 0.5; }
      if (p.y > H + lim) { p.y = H + lim; p.vy = -Math.abs(p.vy) * 0.5; }
      p.rot += p.spin * dt;
      p.rock = (p.rock || 0) * Math.pow(0.5, dt * 1.1);
      p.pixT = Math.max(0, (p.pixT || 0) - dt);
      const bobY = Math.sin(p.bob) * (2.2 + p.rock * 9);
      const wob = Math.sin(p.bob * 3.1) * p.rock * 7;
      const el = this.padEls[i];
      el.style.width = d0 + 'px'; el.style.height = d0 + 'px';
      el.style.transform = `translate3d(${(p.x - r).toFixed(1)}px,${(p.y - r + bobY).toFixed(1)}px,0) `
        + `rotate(${(p.rot + wob).toFixed(1)}deg) `
        + `scale(${(1 + p.rock * 0.04).toFixed(3)},${(1 - p.rock * 0.11).toFixed(3)})`;
      el.children[0].style.transform = `translate(${(d0 * 0.07 + p.rock * 4).toFixed(1)}px,`
        + `${(d0 * 0.1 + bobY * 0.6 + p.rock * 6).toFixed(1)}px)`;
    });

    this.renderPix(W, H);
    this.renderSheet();
    this.padGlitch();

    this.pellets.forEach(p => {
      p.life += dt;
      p.vx += Math.cos(t * 0.05 + p.y * 0.01) * 3 * dt;
      p.vy += Math.sin(t * 0.043 + p.x * 0.01) * 2 * dt;
      const d = Math.pow(0.5, dt * 2.2);
      p.vx *= d; p.vy *= d;
      p.x += p.vx * dt; p.y += p.vy * dt;
    });
    this.pellets = this.pellets.filter(p => p.life < 30);
    this.pelEls.forEach((el, i) => {
      const p = this.pellets[i];
      if (!p) { el.style.opacity = '0'; return; }
      el.style.opacity = (0.92 * (1 - seg(p.life, 24, 30))).toFixed(3);
      el.style.transform = `translate3d(${p.x.toFixed(1)}px,${p.y.toFixed(1)}px,0) translate(-50%,-50%)`;
    });

    this.ripples.forEach(r => { r.t += dt; });
    this.ripples = this.ripples.filter(r => r.t < r.dur);
    this.ripEls.forEach((el, i) => {
      const r = this.ripples[i];
      if (!r) { el.style.opacity = '0'; return; }
      const u = r.t / r.dur, ez = 1 - Math.pow(1 - u, 2.4);
      const rad = 3 + r.r1 * ez;
      el.style.width = el.style.height = (rad * 2).toFixed(1) + 'px';
      el.style.borderWidth = Math.max(0.35, r.w0 * (1 - u * 0.88)).toFixed(2) + 'px';
      el.style.opacity = (r.alpha * (1 - u) * (1 - u)).toFixed(3);
      el.style.transform = `translate3d(${r.x.toFixed(1)}px,${r.y.toFixed(1)}px,0) translate(-50%,-50%)`;
    });

    this.clicks.forEach(c => { c.t += dt; });
    this.clicks = this.clicks.filter(c => c.t < c.dur);
    this.cripEls.forEach((el, i) => {
      const c = this.clicks[i];
      if (!c) { el.style.opacity = '0'; return; }
      const u = c.t / c.dur, ez = 1 - Math.pow(1 - u, 2.4);
      const rad = 3 + c.r1 * ez;
      el.style.width = el.style.height = (rad * 2).toFixed(1) + 'px';
      el.style.borderWidth = Math.max(0.35, c.w0 * (1 - u * 0.88)).toFixed(2) + 'px';
      el.style.opacity = (c.alpha * (1 - u) * (1 - u)).toFixed(3);
      el.style.transform = `translate3d(${c.x.toFixed(1)}px,${c.y.toFixed(1)}px,0) translate(-50%,-50%)`;
    });

    const rp = this.root.getBoundingClientRect();
    MARKS.forEach((L, i) => {
      const lb = this.lbls[i], ln = this.ldrs[i], bx = this.boxEls[i];
      if (!lb || !ln) return;
      if (L.t === 'pad' && PAD_LINKS[L.i] && !lb.dataset.door) {
        lb.dataset.door = L.i;
        lb.style.background = '#141414'; lb.style.color = '#fff'; lb.style.cursor = 'pointer';
        lb.style.boxShadow = '0 -2px 0 0 #141414,0 2px 0 0 #141414,-2px 0 0 0 #141414,2px 0 0 0 #141414,4px 4px 0 #8b1a1a';
      }
      let tx, ty, bw, bh, brot = 0;
      if (L.t === 'koi') {
        const k = this.koi[L.i]; if (!k) return;
        const S = k.S || kh;
        const gone = k.x < -S || k.x > W + S || k.y < -S || k.y > H + S;
        lb.style.opacity = ln.style.opacity = gone ? '0' : '1';
        if (bx) bx.style.opacity = gone ? '0' : '1';
        if (gone) return;
        tx = k.x - Math.cos(k.a) * S * 0.36; ty = k.y - Math.sin(k.a) * S * 0.36;
        bw = S * 0.34; bh = S * 1.02;
        brot = k.a * 180 / Math.PI + 90;
      } else if (L.t === 'pad' && L.span) {
        const a = this.pads[L.span[0]], b = this.pads[L.span[1]];
        if (!a || !b) return;
        const pd = W * 0.042;
        tx = (a.x + b.x) / 2; ty = (a.y + b.y) / 2;
        bw = Math.abs(a.x - b.x) + pd * 2; bh = Math.abs(a.y - b.y) + pd * 2;
      } else if (L.t === 'pad') {
        const p = this.pads[L.i]; if (!p) return;
        const d0 = W * (PADS[L.i] ? PADS[L.i].d : 6) / 100;
        tx = p.x; ty = p.y; bw = d0 * 1.22; bh = d0 * 1.22;
      } else {
        const box = this.root.querySelector(L.el);
        if (!box) return;
        const rb = box.getBoundingClientRect();
        tx = rb.left - rp.left + rb.width * 0.5;
        ty = rb.top - rp.top + rb.height * 0.5;
        bw = rb.width; bh = rb.height;
      }
      if (bx) {
        if (L.box === false) bx.style.opacity = '0';
        else {
          bx.style.opacity = '1';
          bx.style.width = bw.toFixed(1) + 'px';
          bx.style.height = bh.toFixed(1) + 'px';
          bx.style.transform = `translate3d(${(tx - bw / 2).toFixed(1)}px,${(ty - bh / 2).toFixed(1)}px,0) `
            + `rotate(${brot.toFixed(2)}deg)`;
        }
      }
      const wx = L.beside != null && bw ? tx + bw / 2 + L.beside + (lb.offsetWidth || 80) / 2 : tx + L.off[0];
      const wy = ty + L.off[1];
      if (!L._p) L._p = [wx, wy];
      const e = Math.min(1, dt * 1.6);
      L._p[0] += (wx - L._p[0]) * e; L._p[1] += (wy - L._p[1]) * e;
      const hw = (lb.offsetWidth || 150) / 2 + 8;
      const lx = Math.max(hw, Math.min(W - hw, L._p[0]));
      const ly = Math.max(46, Math.min(H - 46, L._p[1]));
      lb.style.transform = `translate3d(${lx.toFixed(1)}px,${ly.toFixed(1)}px,0) translate(-50%,-50%)`;
      const w2 = Math.max(8, lb.offsetWidth / 2), h2 = Math.max(6, lb.offsetHeight / 2);
      const dx = tx - lx, dy = ty - ly;
      const m1 = Math.max(1e-3, Math.abs(dx) / w2, Math.abs(dy) / h2);
      const bw2 = Math.max(6, (bw || 20) / 2), bh2 = Math.max(6, (bh || 20) / 2);
      const m2 = Math.max(1, Math.abs(dx) / bw2, Math.abs(dy) / bh2);
      ln.setAttribute('x1', (lx + dx / m1).toFixed(1));
      ln.setAttribute('y1', (ly + dy / m1).toFixed(1));
      ln.setAttribute('x2', (tx - dx / m2).toFixed(1));
      ln.setAttribute('y2', (ty - dy / m2).toFixed(1));
    });
  }
}

// A hot reload swaps the class on the live instance without re-rendering, so
// the driver lives at module scope and finds the instance through window; a
// generation counter retires the previous eval's loop. This also correctly
// retires the old driver on a real remount (leaving "/" and coming back).
window.__mhGen = (window.__mhGen || 0) + 1;
const MY_GEN = window.__mhGen;
let lastTick = 0;
function driver(ts) {
  if (window.__mhGen !== MY_GEN) return;
  requestAnimationFrame(driver);
  const inst = window.__mhInstance;
  if (!inst) return;
  try {
    inst.ensureRunning();
    if (ts - lastTick > 1000) { lastTick = ts; inst.tick(); }
    inst.frame();
  } catch (err) { console.error(err); }
}
requestAnimationFrame(driver);

// The React-facing controller — everything componentDidMount/WillUnmount
// used to do on the DCLogic class, ported to be driven by a useEffect
// instead. NOW_LIST/clock/typing state from the source is not ported: it's
// never rendered anywhere in this page's markup (dead code per the README).
class MhController {
  applyInvert(inv) {
    const h = document.documentElement;
    h.setAttribute('data-inv', inv ? '1' : '');
    h.style.filter = inv ? 'invert(1)' : '';
    h.style.background = inv ? '#fff' : '';
  }

  // Mini-me stands on his own lily pad. The home page never scrolls, so a
  // scroll gesture becomes energy: he flips like a coin, a gauge fills, he
  // gets dizzy, and his lines escalate. Keep going and he gives up the
  // hidden stack.
  initMini() {
    if (this._miniOn) return;
    const cv = document.getElementById('miniCv');
    if (!cv) return;
    this._miniOn = true;
    const ROWS = ['........K.KK.KK.K.......',
      '.......KhKhhKhhKhK......',
      '......KhhhhhhhhhhhK.....',
      '.....KhhKhhhhhKhhhhK....',
      '.....KhhhhhhhhhhhhhK....',
      '....KhhSShhSShhSShhhK...',
      '....KhSSSSSSSSSSSSShK...',
      '....KSSSSSSSSSSSSSSSK...',
      '....KSSSKSSSSSSKSSSSK...',
      '...KKSSSSSSSSSSSSSSSKK..',
      '..KSKSSSSSSKKSSSSSSSKSK.',
      '..KSKSSSSSKSSKSSSSSSKSK.',
      '...KKSSSSSSKKSSSSSSSKK..',
      '....KSSSSSSSSSSSSSSSK...',
      '....KSSSSSSKKKSSSSSSK...',
      '.....KSSSSSSSSSSSSSK....',
      '......KKSSSSSSSSSKK.....',
      '........KKKKKKKKK.......',
      '..........KSSK..........',
      '.........KKSSKK.........',
      '........KOOKKOOK........',
      '.......KOOOOOOOOK.......',
      '......KOOOOOOOOOOK......',
      '......KooooooooooK......',
      '.....KOOOOOOOOOOOOK.....',
      '.....KOKOOOOOOOOKOK.....',
      '....KOOKooooooooKOOK....',
      '....KKKKKKKKKKKKKKKK....'];
    const SW = 24, SH = 28;
    const KEYS = 'KhSkOo', PAL = [[20, 20, 20], [43, 31, 22], [154, 106, 64], [107, 69, 38], [240, 165, 92], [199, 125, 58]];
    const grid = ROWS.map(r => [...r].map(ch => KEYS.indexOf(ch)));
    const flat = (g) => g.flat();
    const EYES = [[8, 8], [15, 8]];
    const blink = grid.map(r => r.slice()); EYES.forEach(([x, y]) => { blink[y][x] = 0; blink[y][x - 1] = 0; blink[y][x + 1] = 0; });
    const dizzy = grid.map(r => r.slice()); EYES.forEach(([x, y]) => { [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]].forEach(([dx, dy]) => { dizzy[y + dy][x + dx] = 0; }); dizzy[y][x - 1] = 2; dizzy[y][x + 1] = 2; });
    const back = grid.map((r, y) => r.map((k, x) => {
      if (k < 0) return -1;
      const edge = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => { const X = x + dx, Y = y + dy; return X < 0 || Y < 0 || X >= SW || Y >= SH || grid[Y][X] < 0; });
      if (edge) return 0;
      if (y <= 13) return (x + y) % 5 === 0 ? 0 : 1;
      if (y <= 18) return 2;
      return (y === 23 || y === 26) ? 5 : 4;
    }));
    this._front = shadeBW(grid); this._back = shadeBW(back); this._blink = shadeBW(blink); this._dizzyF = shadeBW(dizzy);
    this._sil = flat(grid).map(k => k >= 0);
    PAL.length = 0; PAL.push([20, 20, 20], [250, 250, 248]);

    this._mAng = 0; this._mVel = 0; this._mGauge = 0; this._mIdle = 9; this._mDizzy = 0; this._mLvl = -1;
    const kick = (v) => {
      this._mVel += v; this._mIdle = 0;
      if (this._mGauge >= 12) return;
      const gain = Math.min(0.25, Math.abs(v) / 3000) * Math.max(0.12, 1 - this._mGauge / 13.5);
      this._mGauge = Math.min(12, this._mGauge + gain);
    };
    this._mWheel = (e) => kick(Math.max(-900, Math.min(900, e.deltaY * 2.2)));
    this._mTouchY = null;
    this._mTs = (e) => { this._mTouchY = e.touches[0].clientY; };
    this._mTm = (e) => { if (this._mTouchY == null) return; const y = e.touches[0].clientY; kick((this._mTouchY - y) * 14); this._mTouchY = y; };
    this._mKey = (e) => { if (['ArrowDown', 'PageDown', ' ', 'ArrowUp', 'PageUp'].includes(e.key) && !(e.target.closest && e.target.closest('input,textarea,button,a'))) kick(e.key.includes('Up') ? -500 : 500); };
    window.addEventListener('wheel', this._mWheel, { passive: true });
    window.addEventListener('touchstart', this._mTs, { passive: true });
    window.addEventListener('touchmove', this._mTm, { passive: true });
    window.addEventListener('keydown', this._mKey);

    const LINES = [
      'nothing below —<br>the pond is the page',
      'still nothing<br>down there.',
      "you're persistent.<br>i respect that.",
      "don't stop.<br>almost…",
      'fine. there\'s a<br><a href="/works/stack" style="pointer-events:auto;color:#8b1a1a;border-bottom:2px solid #8b1a1a">hidden stack →</a>',
    ];
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const say = document.getElementById('miniSay');
    const c = cv.getContext('2d');
    const put = (x, y, col) => { c.fillStyle = col; c.fillRect(x, y, 1, 1); };
    const rgb = (p) => `rgb(${p[0]},${p[1]},${p[2]})`;
    this._mLast = performance.now();
    this._mIv = setInterval(() => {
      const nowT = performance.now(), dt = Math.min(0.1, (nowT - this._mLast) / 1000), T = nowT / 1000;
      this._mLast = nowT;
      if (calm) { this._mVel = 0; this._mAng = 0; }
      this._mVel *= Math.pow(0.5, dt * 2.2);
      this._mAng += this._mVel * dt;
      if (Math.abs(this._mVel) < 40) {
        const home = Math.round(this._mAng / 360) * 360;
        this._mAng += (home - this._mAng) * Math.min(1, dt * 6);
        this._mVel *= 0.8;
      }
      this._mIdle += dt;
      if (this._mGauge >= 12) { if (this._mIdle > 2.5) this._mGauge = Math.max(0, this._mGauge - dt * 0.35); }
      else this._mGauge = Math.max(0, this._mGauge - dt * (this._mIdle > 0.35 ? 3.2 : 0.9));
      this._mDizzy += ((this._mGauge > 7 ? 1 : 0) - this._mDizzy) * Math.min(1, dt * 3);

      const lvl = this._mIdle > 3.2 && this._mGauge < 12 ? -1 : this._mGauge >= 12 ? 4 : this._mGauge > 10 ? 3 : this._mGauge > 7 ? 2 : this._mGauge > 3.5 ? 1 : 0;
      if (lvl !== this._mLvl && say) {
        this._mLvl = lvl;
        if (lvl >= 0) say.innerHTML = LINES[lvl];
        say.style.pointerEvents = lvl === 4 ? 'auto' : 'none';
      }
      if (say) say.style.opacity = lvl < 0 ? '0' : '1';

      c.clearRect(0, 0, cv.width, cv.height);
      const pcx = 17, pcy = 41, bob = calm ? 0 : Math.round(Math.sin(T * 1.6) * 0.5);
      for (let y = -3; y <= 3; y++) for (let x = -14; x <= 14; x++) {
        const d = (x / 14) ** 2 + (y / 3) ** 2;
        if (d > 1) continue;
        if (x > 5 && y < 0 && y > -2) continue;
        put(pcx + x, pcy + y + bob, d > 0.62 ? '#141414' : '#fff');
      }
      for (let x = -12; x <= 12; x += 2) put(pcx + x, pcy + 4 + bob, '#141414');
      const cs = Math.cos(this._mAng * Math.PI / 180);
      const sx = Math.max(0, Math.round(Math.abs(cs) * 8) / 8);
      const hop = Math.abs(this._mVel) > 200 ? -2 : (!calm && this._mIdle > 6 && Math.floor(T * 1.5) % 7 === 0 ? -1 : 0);
      const ox = 17, oy = 11 + hop + bob;
      const blinking = !calm && (T % 4.3) < 0.14;
      const spr = cs < 0 ? this._back : this._mDizzy > 0.5 ? this._dizzyF : blinking ? this._blink : this._front;
      if (spr) {
        if (sx === 0) { for (let y = 1; y < SH; y++) { put(ox - 1, oy + y, '#141414'); put(ox, oy + y, ((y & 1) ? '#fafaf8' : '#141414')); put(ox + 1, oy + y, '#141414'); } }
        else {
          const w = Math.max(2, Math.round(SW * sx));
          const ex = cs >= 0 ? 2 : -2;
          for (let dx = 0; dx < w; dx++) {
            let sxi = Math.floor(dx / w * SW);
            if (cs < 0) sxi = SW - 1 - sxi;
            for (let y = 0; y < SH; y++) if (this._sil[y * SW + sxi]) {
              put(ox - Math.floor(w / 2) + dx + ex, oy + y + 1, '#141414');
              put(ox - Math.floor(w / 2) + dx + ex / 2, oy + y + 1, '#141414');
            }
          }
          for (let dx = 0; dx < w; dx++) {
            let sxi = Math.floor(dx / w * SW);
            if (cs < 0) sxi = SW - 1 - sxi;
            for (let y = 0; y < SH; y++) {
              const k = spr[y * SW + sxi];
              if (k >= 0) put(ox - Math.floor(w / 2) + dx, oy + y, rgb(PAL[k]));
            }
          }
        }
      }
      if (this._mDizzy > 0.2) {
        for (let s = 0; s < 3; s++) {
          const an = T * 5 + s * 2.09, sx2 = Math.round(ox + Math.cos(an) * 11), sy2 = Math.round(oy + 1 + Math.sin(an) * 2.5);
          const col = s === 0 ? '#8b1a1a' : '#141414';
          put(sx2, sy2, col); put(sx2 - 1, sy2, col); put(sx2 + 1, sy2, col); put(sx2, sy2 - 1, col); put(sx2, sy2 + 1, col);
        }
      }
      const gx = 40, gy = 6;
      for (let s = 0; s < 12; s++) {
        const y = gy + (11 - s) * 3, on = s < Math.floor(this._mGauge);
        const col = on ? (this._mGauge >= 12 ? ((Math.floor(T * 6) % 2) ? '#8b1a1a' : '#141414') : '#141414') : null;
        put(gx - 1, y, '#141414'); put(gx + 2, y, '#141414'); put(gx - 1, y + 1, '#141414'); put(gx + 2, y + 1, '#141414');
        if (col) { put(gx, y, col); put(gx + 1, y, col); put(gx, y + 1, col); put(gx + 1, y + 1, col); }
      }
      put(gx - 1, gy - 1, '#141414'); put(gx, gy - 1, '#141414'); put(gx + 1, gy - 1, '#141414'); put(gx + 2, gy - 1, '#141414');
      put(gx - 1, gy + 35, '#141414'); put(gx, gy + 35, '#141414'); put(gx + 1, gy + 35, '#141414'); put(gx + 2, gy + 35, '#141414');
    }, 33);
  }

  // The feed tin: a pixel item sprite. Tin body with a light edge and a
  // dithered shade side, a black label band carrying "KOI" and a tiny koi, a
  // lid that rattles on hover and flips open while you're holding food.
  initPot() {
    if (this._potOn) return;
    const cv = document.getElementById('potCv'), hc = document.getElementById('handCv');
    if (!cv) return;
    this._potOn = true;
    const pot = document.getElementById('feedPot');
    let hov = false;
    if (pot) { pot.addEventListener('pointerenter', () => { hov = true; }); pot.addEventListener('pointerleave', () => { hov = false; }); }
    const B = BAYER;
    const F = { K: ['X.X', 'X.X', 'XX.', 'X.X', 'X.X'], O: ['XXX', 'X.X', 'X.X', 'X.X', 'XXX'], I: ['XXX', '.X.', '.X.', '.X.', 'XXX'] };
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let open = 0;
    const draw = () => {
      const T = performance.now() / 1000, P = window.__mhPond, armed = !!(P && P.armed);
      open += ((armed ? 1 : 0) - open) * 0.35;
      const c = cv.getContext('2d');
      c.clearRect(0, 0, 30, 34);
      const ink = (x, y, w = 1, hh = 1) => { c.fillStyle = '#141414'; c.fillRect(x, y, w, hh); };
      const paper = (x, y, w = 1, hh = 1) => { c.fillStyle = '#fafaf8'; c.fillRect(x, y, w, hh); };
      const hop = !calm && hov && !armed ? (Math.floor(T * 8) % 2 ? -1 : 0) : 0;
      const X0 = 4, X1 = 25, top = 10 + hop, bot = 31 + hop;
      for (let y = top + 1; y <= bot + 1; y++) ink(X1 + 1, y, 2, 1);
      ink(X0 + 2, bot + 1, X1 - X0 + 1, 1);
      for (let y = top; y <= bot; y++) for (let x = X0; x <= X1; x++) {
        const edge = x === X0 || x === X1 || y === bot;
        if (edge) { ink(x, y); continue; }
        const shade = x > X1 - 6 && B[(y & 3) * 4 + (x & 3)] < (x > X1 - 3 ? 9 : 5);
        (shade ? ink : paper)(x, y);
      }
      for (let y = top + 1; y < bot; y++) paper(X0 + 1, y);
      const L0 = top + 5, L1 = top + 15;
      ink(X0 + 1, L0, X1 - X0 - 1, L1 - L0);
      let tx = X0 + 4;
      for (const ch of 'KOI') { F[ch].forEach((r, ry) => [...r].forEach((v, rx) => { if (v === 'X') paper(tx + rx, L0 + 2 + ry); })); tx += 4; }
      [[0, 1], [1, 0], [2, 0], [3, 0], [4, 1], [5, 1], [6, 0], [6, 2], [1, 2], [2, 2], [3, 2], [4, 1]].forEach(([dx, dy]) => paper(X0 + 4 + dx, L0 + 8 + dy - 1));
      for (let x = X0 + 1; x < X1; x += 2) ink(x, top + 2);
      const lift = Math.round(open * 6), tip = Math.round(open * 4), rat = !calm && hov && !armed ? (Math.floor(T * 14) % 3) - 1 : 0;
      const ly = top - 3 - lift;
      for (let x = X0 - 1; x <= X1 + 1; x++) {
        const y = ly + Math.round((x - X0) / (X1 - X0) * -tip * 0.5) + (x === X0 - 1 || x === X1 + 1 ? 1 : 0);
        ink(x + rat, y); ink(x + rat, y + 2); if (x === X0 - 1 || x === X1 + 1) ink(x + rat, y + 1); else paper(x + rat, y + 1);
      }
      ink(Math.round((X0 + X1) / 2) - 2 + rat, ly - 2 - Math.round(tip * 0.25), 4, 2);
      if (open > 0.3) for (let k = 0; k < 7; k++) ink(X0 + 3 + ((k * 5) % 17), top + ((k * 3) % 2), 2, 1);
      ink(X0 - 3, bot, 2, 1); ink(X1 + 4, bot - 1, 1, 1); ink(X1 + 3, bot + 1, 2, 1);

      if (hc && armed) {
        const g = hc.getContext('2d');
        g.clearRect(0, 0, 16, 16);
        const j = calm ? 0 : Math.floor(T * 10) % 2;
        g.fillStyle = '#141414';
        [[5, 5], [8, 4], [10, 7], [6, 8], [9, 10], [4, 10], [11, 11]].forEach(([x, y], i) => g.fillRect(x + ((i + j) % 2 ? 0 : 0), y + ((i + j) % 3 === 0 ? j : 0), 2, 2));
        for (let a = 0; a < 20; a++) { if (a % 2) continue; const an = a / 20 * Math.PI * 2; g.fillRect(Math.round(7.5 + Math.cos(an) * 7), Math.round(7.5 + Math.sin(an) * 7), 1, 1); }
      }
    };
    draw();
    this._potIv = setInterval(draw, 50);
  }

  // Opening titles, once per session: a pixel koi swims across the sheet
  // leaving MAEHLO written in its wake, dives into the O, the O rings like a
  // pond, and the ring opens into a portal onto the home page.
  initIntro() {
    if (this._introOn) return;
    this._introOn = true;
    let seen = false;
    try { seen = sessionStorage.getItem('mh-intro') === '1' && !/[?&]intro/.test(window.location.search); sessionStorage.setItem('mh-intro', '1'); } catch (_) { /* private mode, etc — just play it */ }
    if (seen || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const PX = 6, cw = Math.ceil(window.innerWidth / PX), ch = Math.ceil(window.innerHeight / PX);
    const cv = document.createElement('canvas');
    cv.width = cw; cv.height = ch;
    cv.setAttribute('aria-hidden', 'true');
    cv.style.cssText = 'position:fixed;left:0;top:0;width:' + cw * PX + 'px;height:' + ch * PX + 'px;z-index:9999;image-rendering:pixelated;image-rendering:crisp-edges;cursor:pointer';
    const hint = document.createElement('span');
    hint.textContent = 'click to skip';
    hint.style.cssText = "position:fixed;right:18px;bottom:14px;z-index:10000;font:18px/1 'VT323',monospace;letter-spacing:.14em;text-transform:uppercase;color:#141414;background:#fff;padding:1px 6px;pointer-events:none";
    document.body.appendChild(cv); document.body.appendChild(hint);
    const c = cv.getContext('2d');
    const B = BAYER;
    const GL = {
      M: ['10001', '11011', '10101', '10101', '10001', '10001', '10001'], A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
      E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'], H: ['10001', '10001', '10001', '11111', '10001', '10001', '10001'],
      L: ['10000', '10000', '10000', '10000', '10000', '10000', '11111'], O: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
    };
    const word = 'MAEHLO', s = Math.max(2, Math.floor(cw * 0.62 / 35));
    const wx = Math.round((cw - 35 * s) / 2), wy = Math.round(ch / 2 - 3.5 * s);
    const Ox = wx + 30 * s + 2.5 * s, Oy = wy + 3.5 * s;
    const RAD = [1.5, 2.2, 2.5, 2.3, 1.9, 1.4, 1.0, 0.7], k = s * 0.85, sg = s * 1.25;
    const x0 = -12 * sg, T_ARR = 2.5, T_RIP = 2.55, T_OPEN = 3.7, T_END = 4.7;
    const yAt = (x) => { const u = Math.min(1, Math.max(0, (x - wx) / (Ox - wx))), a = 1 - u * u * u; return Oy + Math.sin(x / (s * 3.2)) * s * 2.6 * a; };
    const headX = (t) => { const u = Math.min(1, t / T_ARR); const e = u < 0.85 ? u / 0.85 * 0.9 : 0.9 + (u - 0.85) / 0.15 * 0.1; return x0 + (Ox - x0) * e + Math.max(0, t - T_ARR) * sg * 7; };
    const t0 = performance.now();
    let skipAt = null;
    const skip = () => { if (skipAt == null) skipAt = (performance.now() - t0) / 1000; };
    cv.addEventListener('click', skip);
    const onKey = () => skip();
    window.addEventListener('keydown', onKey, { once: true });
    const ink = (x, y, w = 1, hh = 1) => { c.fillStyle = '#141414'; c.fillRect(x, y, w, hh); };
    const paper = (x, y, w = 1, hh = 1) => { c.fillStyle = '#fff'; c.fillRect(x, y, w, hh); };
    const disc = (cx, cy, r, fn) => { const R2 = Math.ceil(r); for (let y = -R2; y <= R2; y++) for (let x = -R2; x <= R2; x++) if (x * x + y * y <= r * r) fn(Math.round(cx + x), Math.round(cy + y)); };
    const done = () => { cv.remove(); hint.remove(); window.removeEventListener('keydown', onKey); };
    const frame = () => {
      let t = (performance.now() - t0) / 1000;
      if (skipAt != null) t = Math.max(t, T_OPEN + (t - skipAt) * 1.5);
      if (t >= T_END) { done(); return; }
      c.globalCompositeOperation = 'source-over';
      paper(0, 0, cw, ch);
      for (let y = 0; y < ch; y += 1) for (let x = (y * 7) % 11; x < cw; x += 11) if (((x * 3 + y * 5 + Math.floor(t * 2)) % 17) === 0) ink(x, y);
      const hx = headX(t);
      [...word].forEach((ch2, li) => GL[ch2].forEach((row, ry) => [...row].forEach((v, rx) => {
        if (v !== '1') return;
        const X = wx + (li * 6 + rx) * s, Y = wy + ry * s, lag = hx - (X + s) - sg * 2;
        if (lag <= 0) return;
        const lv = Math.min(16, lag / (sg * 3) * 16);
        for (let yy = 0; yy < s; yy++) for (let xx = 0; xx < s; xx++) if (B[((Y + yy) & 3) * 4 + ((X + xx) & 3)] < lv) ink(X + xx, Y + yy);
      })));
      if (t < T_ARR + 0.8) {
        const pts = RAD.map((_, i) => { const x = hx - i * sg; return [x, yAt(x)]; });
        const vis = pts.map(([x]) => x < Ox - s * 0.5);
        pts.forEach(([x, y], i) => { if (vis[i]) disc(x, y, RAD[i] * k + 1, ink); });
        pts.forEach(([x, y], i) => { if (!vis[i]) return; disc(x, y, RAD[i] * k, (X, Y) => { if ((i === 2 || i === 3 || i === 5) && ((X * 3 + Y) % 4 !== 0)) ink(X, Y); else paper(X, Y); }); });
        const tl = pts[7], tp = pts[6];
        if (vis[7]) { const a = Math.atan2(tl[1] - tp[1], tl[0] - tp[0]) + Math.sin(t * 14) * 0.45; for (let q = 1; q <= 3 * k; q++) for (const sgn of [-1, 1]) ink(Math.round(tl[0] + Math.cos(a + sgn * 0.5) * q), Math.round(tl[1] + Math.sin(a + sgn * 0.5) * q)); }
        if (vis[0]) { const [ex, ey] = pts[0], a = Math.atan2(ey - pts[1][1], ex - pts[1][0]); for (const sgn of [-1, 1]) ink(Math.round(ex + Math.cos(a) * k * 0.6 - Math.sin(a) * k * sgn), Math.round(ey + Math.sin(a) * k * 0.6 + Math.cos(a) * k * sgn)); }
      }
      if (t > T_RIP) for (let j = 0; j < 4; j++) {
        const u = t - T_RIP - j * 0.22; if (u <= 0) continue;
        const r = s * 3 + u * s * 9, lv = Math.max(0, 16 - u * 9);
        if (lv <= 0) continue;
        const n = Math.ceil(r * 7);
        for (let q = 0; q < n; q++) { const a = q / n * Math.PI * 2, X = Math.round(Ox + Math.cos(a) * r), Y = Math.round(Oy + Math.sin(a) * r * 0.82); if (B[(Y & 3) * 4 + (X & 3)] < lv) ink(X, Y); }
      }
      if (t > T_ARR && t < T_ARR + 0.45) { const u = (t - T_ARR) / 0.45; for (let q = 0; q < 8; q++) { const a = q / 8 * Math.PI * 2; ink(Math.round(Ox + Math.cos(a) * s * (1 + u * 3)), Math.round(Oy - s * u * 2 + Math.sin(a) * s * (1 + u * 2))); } }
      if (t > T_OPEN) {
        const u = (t - T_OPEN) / (T_END - T_OPEN), e = u * u * (3 - 2 * u);
        const r = s * 2 + e * Math.hypot(cw, ch);
        cv.style.pointerEvents = 'none';
        disc(Ox, Oy, r + 1.5, ink);
        c.globalCompositeOperation = 'destination-out';
        disc(Ox, Oy, r, (X, Y) => { c.fillRect(X, Y, 1, 1); });
        c.globalCompositeOperation = 'source-over';
        hint.style.opacity = '0';
      }
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  mount(navigate) {
    this._navigateFn = navigate;
    this.initIntro();
    this.initPot();
    this.initMini();
    let inv = false;
    try { inv = localStorage.getItem('mh-invert') === '1'; } catch (_) { /* private mode */ }
    this._invSet = inv;
    this.applyInvert(inv);
    this.ensureRunning();
  }

  ensureRunning() {
    window.__mhInstance = this;
    if (this._listening) return;
    this._listening = true;
    this._read = () => { try { this.frame(); } catch (e) { console.error(e); } };
    // Three independent drivers, because each one has failed on its own at
    // some point on this page: rAF is suspended whenever the frame is
    // backgrounded or throttled, scroll events don't fire in every
    // embedding, and a resize alone never advances the story.
    window.addEventListener('resize', this._read);
    window.addEventListener('scroll', this._read, { passive: true });
    this._poll = setInterval(this._read, 33);
    this._read();
  }

  // clock/typing state is never rendered on this page (see the file header
  // note) — kept as a harmless no-op so the module-scope driver's call site
  // stays a verbatim port rather than a special case.
  tick() {}

  frame() {
    try {
      const now = performance.now() / 1000;
      const dt = Math.min(0.06, Math.max(0.001, now - (this._pt == null ? now - 0.033 : this._pt)));
      this._pt = now;
      if (!this._pond) {
        const root = document.getElementById('pond');
        if (root && root.querySelectorAll('.koiG').length === KOI.length) this._pond = new Pond(root);
      }
      if (this._pond) this._pond.step(dt, now);
    } catch (e) { console.error(e); }
  }

  // door-warp target: react-router navigation instead of a hard reload,
  // since this is a client-routed SPA rather than the prototype's separate
  // static pages. Set by Pond via window.__mhPond._navigate.
  navigate(href) {
    if (this._navigateFn) this._navigateFn(href);
    else window.location.href = href;
  }

  unmount() {
    clearInterval(this._mIv);
    clearInterval(this._potIv);
    window.removeEventListener('wheel', this._mWheel);
    window.removeEventListener('touchstart', this._mTs);
    window.removeEventListener('touchmove', this._mTm);
    window.removeEventListener('keydown', this._mKey);
    if (window.__mhInstance === this) window.__mhInstance = null;
    // stop the Pond's window-level pad/feed listeners from touching a torn-
    // down pond — they already guard on `window.__mhPond` being falsy, this
    // is just clearing the singleton they check.
    window.__mhPond = null;
    this._listening = false;
    clearInterval(this._poll);
    window.removeEventListener('resize', this._read);
    window.removeEventListener('scroll', this._read);
  }
}

export default function Home() {
  const [inv, setInv] = useState(() => {
    try { return localStorage.getItem('mh-invert') === '1'; } catch (_) { return false; }
  });
  const ctrlRef = useRef(null);
  if (ctrlRef.current === null) ctrlRef.current = new MhController();

  useEffect(() => {
    const ctrl = ctrlRef.current;
    // Pond.startWarp needs somewhere to navigate through react-router rather
    // than a hard reload — hand it a navigate function via the controller.
    Pond.prototype._navigate = (href) => ctrl.navigate(href);
    ctrl.mount();
    return () => ctrl.unmount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggleInvert(e) {
    if (e) e.stopPropagation();
    const next = !inv;
    try { localStorage.setItem('mh-invert', next ? '1' : '0'); } catch (_) { /* private mode */ }
    window.dispatchEvent(new Event('mh-invert'));
    ctrlRef.current.applyInvert(next);
    setInv(next);
  }

  function armFeed() {
    const p = window.__mhPond;
    if (p) p.armed ? p.disarm() : p.arm();
  }
  function armFeedKey(e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    armFeed();
  }

  return (
    <div className="mh-root">
      <svg aria-hidden="true" focusable="false" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
        <defs>
          <g id="padShape">
            <path d="M50 50 L70.2 8.7 A46 46 0 1 0 84.2 19.2 Z" fill="#fff" stroke="#1a1a18" strokeWidth="1.6" />
            <path d="M50 50 L20 20" stroke="#1a1a18" strokeWidth="1" opacity=".16" />
            <path d="M50 50 L11 58" stroke="#1a1a18" strokeWidth="1" opacity=".16" />
            <path d="M50 50 L58 93" stroke="#1a1a18" strokeWidth="1" opacity=".16" />
          </g>
          <filter id="inkEdge" x="-25%" y="-25%" width="150%" height="150%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" seed="5" result="ie" />
            <feDisplacementMap in="SourceGraphic" in2="ie" scale="6" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>

        <filter id="txtPix" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feFlood x="2" y="2" width="1" height="1" />
          <feComposite width="4" height="4" />
          <feTile result="grid" />
          <feComposite in="SourceGraphic" in2="grid" operator="in" />
          <feMorphology operator="dilate" radius="2" />
          <feComponentTransfer>
            <feFuncA type="discrete" tableValues="0 1" />
          </feComponentTransfer>
        </filter>
        <filter id="padPix" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feFlood x="3" y="3" width="1" height="1" />
          <feComposite width="7" height="7" />
          <feTile result="grid" />
          <feComposite in="SourceGraphic" in2="grid" operator="in" />
          <feMorphology operator="dilate" radius="3.5" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncR type="discrete" tableValues="0.08 1" />
            <feFuncG type="discrete" tableValues="0.08 1" />
            <feFuncB type="discrete" tableValues="0.08 1" />
            <feFuncA type="discrete" tableValues="0 1" />
          </feComponentTransfer>
        </filter>
      </svg>

      <div className="deco" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 60, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 20, padding: 'clamp(7px,1.1vh,13px) clamp(14px,1.9vw,28px)', background: '#fff', borderTop: '1px solid #1a1a18', borderBottom: '1px solid #1a1a18' }}>
        <span style={{ fontSize: 'clamp(15px,1.3vw,20px)', whiteSpace: 'nowrap', color: '#1a1a18' }}>Malvin Mallock Boye – Maehlo</span>
        <span style={{ display: 'flex', alignItems: 'baseline', gap: 'clamp(10px,1.4vw,22px)' }}>
          <Link to="/about" style={{ fontSize: 'clamp(15px,1.3vw,20px)', color: '#1a1a18' }}>About</Link>
          <Link to="/works" style={{ fontSize: 'clamp(15px,1.3vw,20px)', color: '#1a1a18' }}>Works</Link>
          <Link to="/thinking" style={{ fontSize: 'clamp(15px,1.3vw,20px)', color: '#1a1a18' }}>Thinking</Link>
          <button type="button" onClick={toggleInvert} aria-pressed={inv ? 'true' : 'false'}
            style={{ border: '1px solid #1a1a18', background: '#fff', color: '#1a1a18', cursor: 'pointer', padding: '1px 10px', fontFamily: 'inherit', fontSize: 'clamp(10px,1vw,15px)', letterSpacing: '.06em', whiteSpace: 'nowrap' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#8a6224'; e.currentTarget.style.color = '#8a6224'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#1a1a18'; e.currentTarget.style.color = '#1a1a18'; }}
          >{inv ? '◐ light' : '◑ invert'}</button>
          <Link to="/resume" style={{ fontSize: 'clamp(15px,1.3vw,20px)', color: '#1a1a18' }}>Resume</Link>
        </span>
      </div>

      <div id="mini" style={{ position: 'fixed', left: 'clamp(14px,2.4vw,36px)', top: 'clamp(58px,9vh,84px)', zIndex: 55, display: 'grid', gridTemplateColumns: 'auto auto', alignItems: 'start', gap: 12, pointerEvents: 'none' }}>
        <canvas id="miniCv" role="img" aria-label="Pixel Malvin on a lily pad — the pond is the whole page" width="44" height="46"
          style={{ display: 'block', width: 'clamp(84px,7.4vw,124px)', height: 'auto', imageRendering: 'pixelated' }} />
        <div id="miniSay" aria-live="polite" style={{ opacity: 0, marginTop: 10, background: '#fff', padding: '4px 10px', fontFamily: "'VT323',monospace", fontSize: 'clamp(16px,1.25vw,20px)', lineHeight: 1.05, whiteSpace: 'nowrap', boxShadow: '0 -2px 0 0 #141414,0 2px 0 0 #141414,-2px 0 0 0 #141414,2px 0 0 0 #141414,4px 4px 0 #141414' }} />
      </div>

      <section className="pond deco" id="pond" aria-label="A pond of koi — Malvin Mallock Boye">

        <svg id="pondLines" aria-hidden="true" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 4 }}>
          {MARKS.map((_, i) => <line key={i} className="ldr" x1="0" y1="0" x2="0" y2="0" stroke="#1a1a18" strokeWidth="1" />)}
        </svg>

        <div className="dim" style={{ left: '14%', right: '6%', top: '13.5%', height: 1 }}>
          <span className="rule" />
          <span className="tick" style={{ left: 0 }} />
          <span className="tick" style={{ right: 0 }} />
          <span className="val">12 000</span>
        </div>
        <div className="dim v" style={{ left: '3.4%', top: '32%', bottom: '24%', width: 1 }}>
          <span className="rule" />
          <span className="tick" style={{ top: 0 }} />
          <span className="tick" style={{ bottom: 0 }} />
          <span className="val">7 400</span>
        </div>
        <span className="xreg" style={{ left: '30%', top: '36%' }} />
        <span className="xreg" style={{ left: '62%', top: '68%' }} />
        <span className="xreg" style={{ left: '86%', top: '30%' }} />

        <div aria-hidden="true" style={{ position: 'absolute', right: 'clamp(14px,2.4vw,36px)', bottom: 'clamp(14px,3vh,38px)', zIndex: 7, border: '1px solid #1a1a18', background: '#fff', display: 'grid' }}>
          <span style={{ padding: '4px 12px', borderBottom: '1px solid #1a1a18', fontSize: 'clamp(14px,1.1vw,18px)', letterSpacing: '.14em', textTransform: 'uppercase' }}>Maehlo — pond, plan</span>
          <span style={{ padding: '4px 12px', borderBottom: '1px solid #1a1a18', fontSize: 'clamp(14px,1.05vw,17px)', letterSpacing: '.06em', whiteSpace: 'nowrap' }}><span style={{ color: '#8b1a1a' }}>■</span> marked pads are doors — click one</span>
          <span style={{ display: 'flex', gap: 'clamp(10px,1.4vw,22px)', padding: '5px 12px', whiteSpace: 'nowrap', fontSize: 'clamp(13px,1vw,16px)', letterSpacing: '.08em', fontVariantNumeric: 'tabular-nums', color: '#4a4842' }}>
            <span style={{ whiteSpace: 'nowrap' }}>scale 1:50</span><span style={{ whiteSpace: 'nowrap' }}>dwg. 01</span><span style={{ whiteSpace: 'nowrap' }}>rev. c</span>
          </span>
        </div>

        <div aria-hidden="true" style={{ position: 'absolute', right: 'clamp(14px,2.4vw,36px)', bottom: 'clamp(150px,24vh,200px)', zIndex: 7, display: 'grid', gap: 5, justifyItems: 'center', opacity: .7 }}>
          <svg viewBox="0 0 24 34" style={{ width: 'clamp(15px,1.5vw,22px)', height: 'auto' }} aria-hidden="true">
            <path d="M12 1 L19 26 L12 21 L5 26 Z" fill="none" stroke="#1a1a18" strokeWidth="1.2" strokeLinejoin="round" />
            <path d="M12 1 L12 21 L5 26 Z" fill="#1a1a18" />
          </svg>
          <span style={{ fontSize: 'clamp(8px,.75vw,11px)', letterSpacing: '.2em' }}>N</span>
        </div>

        {MARKS.map((_, i) => (
          <span key={i} className="tbox" aria-hidden="true">
            <span style={{ position: 'absolute', left: -2, top: -2, width: 8, height: 8, borderLeft: '1.5px solid #1a1a18', borderTop: '1.5px solid #1a1a18' }} />
            <span style={{ position: 'absolute', right: -2, bottom: -2, width: 8, height: 8, borderRight: '1.5px solid #1a1a18', borderBottom: '1.5px solid #1a1a18' }} />
          </span>
        ))}

        {Array.from({ length: 24 }).map((_, i) => <span key={i} className="pellet" aria-hidden="true" />)}
        {Array.from({ length: 30 }).map((_, i) => <span key={i} className="ripple" aria-hidden="true" />)}

        <div id="feedPot" onClick={armFeed} onKeyDown={armFeedKey} role="button" tabIndex={0} aria-label="Feed the koi — pick up a handful, then click the water"
          style={{ position: 'absolute', left: 'clamp(340px,37vw,620px)', bottom: 'clamp(14px,3vh,38px)', zIndex: 8, display: 'grid', gridTemplateColumns: 'auto auto', alignItems: 'end', gap: 10, cursor: 'pointer' }}>
          <canvas id="potCv" width="30" height="34" aria-hidden="true" style={{ width: 'clamp(56px,5.2vw,92px)', height: 'auto', imageRendering: 'pixelated' }} />
          <span className="fhint" style={{ fontFamily: "'VT323',monospace", fontSize: 'clamp(15px,1.2vw,19px)', letterSpacing: '.1em', textTransform: 'uppercase', whiteSpace: 'nowrap', background: '#fff', padding: '1px 8px', boxShadow: '0 -2px 0 0 #141414,0 2px 0 0 #141414,-2px 0 0 0 #141414,2px 0 0 0 #141414,4px 4px 0 #141414' }}>▶ feed the koi</span>
        </div>

        {PADS.map((_, i) => (
          <div key={i} className="swim pad">
            <div className="sh"><svg viewBox="0 0 100 100" aria-hidden="true"><use href="#padShape" /></svg></div>
            <div className="bd"><svg viewBox="0 0 100 100" aria-hidden="true" style={{ filter: 'url(#inkEdge)' }}><use href="#padShape" /></svg></div>
          </div>
        ))}
        <canvas id="padPixCv" aria-hidden="true" style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none', zIndex: 5, imageRendering: 'pixelated' }} />

        <canvas id="koiPix" aria-hidden="true" style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none', zIndex: 3, imageRendering: 'pixelated' }} />
        <svg id="koiLayer" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none', zIndex: 3, visibility: 'hidden' }}>
          {KOI.map((_, i) => (
            <g className="koiG" key={i}>
              <g className="ksh">
                <path className="kfins" fill="#000" />
                <path className="ktail" fill="#000" />
                <path className="kbody" fill="#000" />
              </g>
              <g className="kbd">
                <path className="kfins" fill="#f4f3ef" stroke="#1b1a18" strokeWidth="1.1" strokeLinejoin="round" opacity=".92" />
                <path className="ktail" fill="#f4f3ef" stroke="#1b1a18" strokeWidth="1.1" strokeLinejoin="round" opacity=".92" />
                <path className="kbody" fill="#f1f0ec" stroke="#1b1a18" strokeWidth="1.4" />
                <path className="kpatch" fill="#1b1a18" opacity=".88" />
                <path className="kpatch2" fill="#1b1a18" opacity=".72" />
                <path className="kspine" fill="none" stroke="#1b1a18" strokeWidth="1" opacity=".3" strokeLinecap="round" />
                <circle className="keye kL" r="2.4" fill="#1b1a18" />
                <circle className="keye kR" r="2.4" fill="#1b1a18" />
              </g>
            </g>
          ))}
        </svg>

        {/* nameStyle/taglineStyle from the source are static in this build
            (no Tweaks-panel props are wired up), so they're inlined here as
            a plain style object instead of computed CSS strings. */}
        <div style={{ position: 'absolute', left: '2.1%', top: '61.5%', zIndex: 5, width: '32.7%', transformOrigin: '0 0', transform: 'scale(1.000)' }}>
          <div id="nameBox" style={{ background: '#fff', padding: 'clamp(9px,1.3vw,20px) clamp(13px,1.8vw,26px)', width: 'max-content', maxWidth: '100%', boxSizing: 'border-box', boxShadow: '0 -3px 0 0 #141414,0 3px 0 0 #141414,-3px 0 0 0 #141414,3px 0 0 0 #141414,8px 8px 0 #141414' }}>
            <h1 style={{ margin: 0, fontFamily: "'Pixelify Sans',monospace", fontSize: 'clamp(24px,3vw,50px)', fontWeight: 600, lineHeight: .98, color: '#141414', whiteSpace: 'nowrap' }}>
              <span><span id="nameTxt">Malvin<br />Mallock Boye</span><span style={{ color: '#8b1a1a' }}>■</span></span>
            </h1>
          </div>
          <div id="tagBox" style={{ margin: '10px 0 0 28%', width: '72%', padding: 'clamp(8px,1.2vw,17px) clamp(10px,1.4vw,21px)', border: '1px solid #1a1a18', background: '#fff' }}>
            <p style={{ margin: 0, fontFamily: "'VT323',monospace", fontSize: 'clamp(18px,1.7vw,28px)', lineHeight: 1.08, color: '#141414', textWrap: 'pretty' }}>Design engineer — I design and build for the wandering mind.</p>
          </div>
        </div>

        {MARKS.map((a, i) => <span key={i} className="lbl">{a.text}</span>)}

      </section>

      <canvas id="sheetPix" aria-hidden="true" style={{ position: 'fixed', left: 0, top: 0, zIndex: 65, pointerEvents: 'none', imageRendering: 'pixelated' }} />
      {Array.from({ length: 40 }).map((_, i) => <span key={i} className="crip" aria-hidden="true" />)}

      <div id="feedHand" aria-hidden="true" style={{ position: 'fixed', left: 0, top: 0, zIndex: 70, opacity: 0, pointerEvents: 'none' }}>
        <canvas id="handCv" width="16" height="16" style={{ display: 'block', width: 48, height: 48, imageRendering: 'pixelated' }} />
      </div>

      <div id="warp" aria-hidden="true" style={{ position: 'fixed', inset: 0, zIndex: 90, pointerEvents: 'none', display: 'none' }}>
        <canvas id="warpPix" style={{ position: 'absolute', left: 0, top: 0, imageRendering: 'pixelated' }} />
        <div id="warpText" style={{ position: 'absolute', left: 0, right: 0, top: '34%', display: 'grid', justifyItems: 'center', gap: 14, fontFamily: "'VT323',ui-monospace,monospace", color: '#f4f4f0', opacity: 0 }}>
          <span id="warpTitle" style={{ fontSize: 'clamp(28px,4.4vw,64px)', letterSpacing: '.08em', textTransform: 'uppercase', lineHeight: 1 }} />
          <span id="warpPct" style={{ fontSize: 'clamp(18px,2vw,28px)', letterSpacing: '.2em' }}>LOADING 00%</span>
        </div>
      </div>
    </div>
  );
}
