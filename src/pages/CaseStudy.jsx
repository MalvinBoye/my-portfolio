import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './CaseStudy.css';
import stuff1c from '../images/stuff-1c.png';
import stuff3a from '../images/stuff-3a.png';
import stuff4a from '../images/stuff-4a.png';
import bagJala from '../images/bag-jala.png';
import petMeeks from '../images/pet-meeks.png';
import bagGracias from '../images/bag-gracias.png';
import maableHome from '../images/maable-home.webp';
import maableCompanion from '../images/maable-companion.webp';
import maableOverdue from '../images/maable-overdue.webp';
import maableMenu from '../images/maable-menu.webp';
import maableKoreanNotes from '../images/maable-korean-notes.webp';
import maableMoodboard from '../images/maable-moodboard.webp';
import connect1 from '../images/connect-1.png';
import dormdrop1 from '../images/dormdrop-1.png';
import dormdrop2 from '../images/dormdrop-2.png';
import maeloSubtitle from '../images/maelo-subtitle.webp';
import maeloFcpx from '../images/maelo-fcpx.webp';
import maeloThumbHouse from '../images/maelo-thumb-house.webp';
import maeloThumbStudy from '../images/maelo-thumb-study.webp';
import dormdrop3 from '../images/dormdrop-3.png';

// ---------------------------------------------------------------------------
// Ported from the design handoff's shared case-study template — the same
// markup and Component class appear (byte-for-byte, confirmed by diffing
// all six prototype files) in Stuff/Maable/Maehlo/Connect/DormDrop/Maelo,
// differing only in CASE_ID and their own entry in a CASES data object.
// Per the README: "Build one CaseStudy component and feed it that data."
//
// The CASES object below merges the six prototypes' own entries (verified
// identical everywhere the same entry was duplicated across files — e.g.
// Stuff's own "stuff" entry matches the copy embedded in Connect's file
// byte-for-byte). Maehlo's plate art is procedural (drawArt); Maelo's
// (the secret YouTube study) has no images at all — the source renders
// <image-slot> placeholders there, which is a design-tool-only element
// (not ported, same convention as elsewhere in this handoff); rendered here
// as an empty, correctly sized frame with the placeholder text as written.
// ---------------------------------------------------------------------------

// prototype file → app route. CASES' own href/cta/next fields keep the
// source's .dc.html filenames verbatim; only the link-rendering layer
// translates them, per the README's instruction.
const HREF_MAP = {
  'Maehlo.dc.html': '/',
  'Works.dc.html': '/works',
  'Works Stack.dc.html': '/works/stack',
  'Thinking.dc.html': '/thinking',
  'Stuff - case study.dc.html': '/work/stuff',
  'Maable - case study.dc.html': '/work/maable',
  'Maehlo - case study.dc.html': '/work/maehlo',
  'Connect - case study.dc.html': '/work/connect',
  'DormDrop - case study.dc.html': '/work/dormdrop',
  'EvMart - case study.dc.html': '/work/ev-mart',
};
const toRoute = (dcHref) => HREF_MAP[dcHref] || dcHref;

// WORKS'/CASES' own `img` fields are the source prototype's own file-path
// strings, kept verbatim; joined to the actual imported asset (or, for the
// already-public Connect stills, a root-relative public URL) only at the
// point of rendering.
const IMG_MAP = {
  'assets/stuff-1c.png': stuff1c,
  'assets/stuff-3a.png': stuff3a,
  'assets/stuff-4a.png': stuff4a,
  'assets/bag-jala.png': bagJala,
  'assets/pet-meeks.png': petMeeks,
  'assets/bag-gracias.png': bagGracias,
  'src/images/maable-home.webp': maableHome,
  'src/images/maable-companion.webp': maableCompanion,
  'src/images/maable-overdue.webp': maableOverdue,
  'src/images/maable-menu.webp': maableMenu,
  'src/images/maable-korean-notes.webp': maableKoreanNotes,
  'src/images/maable-moodboard.webp': maableMoodboard,
  'src/images/connect-1.png': connect1,
  'public/case/connect/connect-splash.png': '/case/connect/connect-splash.png',
  'public/case/connect/connect-transparency.png': '/case/connect/connect-transparency.png',
  'public/case/connect/connect-partners.png': '/case/connect/connect-partners.png',
  'public/case/connect/connect-messages.png': '/case/connect/connect-messages.png',
  'public/case/connect/connect-cap.png': '/case/connect/connect-cap.png',
  'src/images/dormdrop-1.png': dormdrop1,
  'src/images/dormdrop-2.png': dormdrop2,
  'src/images/dormdrop-3.png': dormdrop3,
  // Maelo's own stills — real photos supplied for the secret study, not
  // from the handoff (which uses empty <image-slot> placeholders here).
  'src/images/maelo-subtitle.webp': maeloSubtitle,
  'src/images/maelo-fcpx.webp': maeloFcpx,
  'src/images/maelo-thumb-house.webp': maeloThumbHouse,
  'src/images/maelo-thumb-study.webp': maeloThumbStudy,
};

const pad2 = (n) => String(n).padStart(2, '0');
const KOI_DN = [
  '...XXX...', '..XXXXX..', '.XXoXoXX.', '.XXXXXXX.', 'XXXooXXXX', 'XXXooXXXX', '.XXXXXXX.', '.XXoooXX.',
  '..XXXXX..', '..XXXXX..', '...XXX...', '...XXX...', '..XX.XX..', '.XX...XX.', '.X.....X.',
];

// Maehlo's plate art, drawn cell by cell on a 160×90 sheet: pure ink on
// paper, tone only as ordered dither, same vocabulary as the pond itself.
// Only ever invoked with the Maehlo case's own chapter `art` values.
const AB = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
// V is not in the source's version of this font (never needed by the
// ported plates); added here — 3x5, same shape convention as the rest —
// since EV Mart's own new plates need it for "EV MART".
// 6/7/8/9 are not in the source's version of this font (never needed by
// the ported plates, which only ever draw 0-5); added here, in the same
// loose style as the existing digits, since EV Mart's and Maelo's new
// plates need the full range.
const FONT = { A: '010101111101101', B: '110101110101110', C: '011100100100011', D: '110101101101110', E: '111100110100111', F: '111100110100100', G: '011100101101011', H: '101101111101101', I: '111010010010111', K: '101101110101101', L: '100100100100111', M: '101111111101101', N: '110101101101101', O: '010101101101010', P: '110101110100100', R: '110101110101101', S: '011100010001110', T: '111010010010010', U: '101101101101111', V: '101101101101010', W: '101101111111101', Y: '101101010010010', '0': '111101101101111', '1': '010110010010111', '2': '110001010100111', '3': '110001010001110', '4': '101101111001001', '5': '111100110001110', '6': '110100111101111', '7': '111001001010010', '8': '111101111101111', '9': '111101111001111', '→': '000010111010000', ' ': '000000000000000', '·': '000000010000000', '?': '110001010000010' };
const KOI_R = ['X.......XXXX....', 'XX....XXXXXXXX..', '.XX.XXXooXXXXXX.', '..XXXXXooXXXXoX.', '.XX.XXXXXXoXXXX.', 'XX....XXXXXXXX..', 'X.......XXXX....'];
function drawArt(cv, kind) {
  const c = cv.getContext('2d'), W = 160, H = 90;
  const ink = (x, y, w = 1, hh = 1) => { c.fillStyle = '#141414'; c.fillRect(x, y, w, hh); };
  const paper = (x, y, w = 1, hh = 1) => { c.fillStyle = '#fff'; c.fillRect(x, y, w, hh); };
  const red = (x, y, w = 1, hh = 1) => { c.fillStyle = '#8b1a1a'; c.fillRect(x, y, w, hh); };
  const dith = (x0, y0, w, hh, lv) => { for (let y = y0; y < y0 + hh; y++) for (let x = x0; x < x0 + w; x++) if (AB[(y & 3) * 4 + (x & 3)] < lv) ink(x, y); };
  const box = (x, y, w, hh, fill = true) => { ink(x, y, w, 1); ink(x, y + hh - 1, w, 1); ink(x, y, 1, hh); ink(x + w - 1, y, 1, hh); if (fill) paper(x + 1, y + 1, w - 2, hh - 2); };
  const shadowBox = (x, y, w, hh) => { ink(x + 2, y + 2, w, hh); box(x, y, w, hh); };
  const text = (s, x, y, col = ink) => { for (const ch of s.toUpperCase()) { const g = FONT[ch] || FONT[' ']; for (let i = 0; i < 15; i++) if (g[i] === '1') col(x + (i % 3), y + ((i / 3) | 0)); x += 4; } };
  const koi = (x, y, flip = false, deep = false) => KOI_R.forEach((r, ry) => [...r].forEach((ch, rx) => {
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
    for (let y = 0; y < 90; y++) for (let x = 72; x < 90; x++) if (AB[(y & 3) * 4 + (x & 3)] < (x - 72) * 0.9) ink(x, y);
    for (let x = 96; x < 152; x += 6) paper(x, 50, 2, 2);
    KOI_R.forEach((r, ry) => [...r].forEach((ch, rx) => { if (ch === 'X') paper(100 + rx, 46 + ry); }));
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
  // EV Mart's plates — new pixel art, not from the handoff (EV Mart isn't
  // part of the original design), drawn in the same ink/paper/red/dither
  // vocabulary as everything above so it reads as part of the same system.
  if (kind === 'evTill') {
    dots();
    const x = 46, y = 16, w = 76, h = 52;
    shadowBox(x, y, w, h);
    box(x + 6, y + 6, 64, 24); dith(x + 7, y + 7, 62, 22, 4);
    text('TOTAL', x + 10, y + 10, ink);
    text('12.50', x + 10, y + 18, red);
    for (let i = 0; i < 4; i++) { const bw = i === 0 ? 22 : 12; box(x + 6 + (i === 0 ? 0 : 22 + (i - 1) * 14), y + 34, bw, 12); }
    ink(x + 50, y - 12, 18, 12);
    for (let ry = 0; ry < 3; ry++) paper(x + 52, y - 10 + ry * 3, 14, 1);
    text('EV MART', x - 4, y + h + 8);
  }
  if (kind === 'evFlow') {
    dots();
    box(8, 10, 66, 66); text('BEFORE', 12, 14);
    for (let r = 0; r < 4; r++) box(14, 26 + r * 12, 54, 9);
    box(86, 10, 66, 66); text('AFTER', 90, 14);
    ink(92, 28, 54, 16); paper(93, 29, 52, 14); text('CONFIRM', 96, 34, red);
    for (let r = 0; r < 2; r++) box(92, 48 + r * 12, 54, 9);
    dim(8, 152, 82, 'HIERARCHY');
  }
  // Maelo's "hurdles" plate — new pixel art, not from the handoff: an
  // iPhone in a transparent case with polaroids tucked behind it, same
  // ink/paper/dither vocabulary as everything else.
  if (kind === 'iphone') {
    dots();
    const pol = (x, y) => { box(x, y, 24, 30); dith(x + 2, y + 2, 20, 18, 4); };
    pol(8, 26); pol(128, 18);
    const px = 54, py = 6, pw = 46, ph = 78;
    for (let yy = py - 3; yy < py + ph + 3; yy += 3) { ink(px - 3, yy, 1, 1); ink(px + pw + 2, yy, 1, 1); }
    for (let xx = px - 3; xx < px + pw + 3; xx += 3) { ink(xx, py - 3, 1, 1); ink(xx, py + ph + 2, 1, 1); }
    box(px, py, pw, ph);
    box(px + 4, py + 4, 18, 18);
    ring(px + 9, py + 10, 4, 2); ring(px + 17, py + 10, 4, 2); ring(px + 9, py + 18, 3, 2);
    ink(px - 1, py + 20, 1, 8); ink(px + pw, py + 16, 1, 10); ink(px + pw, py + 30, 1, 10);
    text('16', px + pw - 14, py + ph - 10, red);
  }
}

// The five case studies' entries, copied verbatim from each prototype's own
// CASES[CASE_ID] block (the duplicate copies embedded in other files were
// diffed byte-for-byte against these and are identical, so it's safe to
// take one canonical copy of each rather than guessing between them).
const CASES = {
  stuff: {
    kicker: 'Case 01 — ADHD grocery app',
    title: 'Stuff',
    lede: "A shopping list for a mind that wanders, because opening one shouldn't feel like being told off.",
    intro: 'Lists don\'t fail people with wandering minds because they\'re badly organised. They fail because opening one feels like being told off. Stuff is a grocery list made of kraft paper and handwriting, with a cat who has opinions and a currency you only earn by finishing the shop. The design is complete; the build comes next.',
    tags: ['In progress', 'ADHD', 'Research', 'UI', 'Illustration'],
    meta: [['Role', 'Research, product, UI, illustration'], ['Timeline', '9 rounds · ~40 screens · 2026'], ['Tools', 'Procreate, Figma, HTML/CSS'], ['Team', 'Solo, every drawing my own']],
    verdict: 'A list people actually finish, because finishing is the only thing it rewards.',
    receipts: [
      ['9', 'rounds of options', 'Each round was a set of alternatives side by side, rather than one screen polished over and over.'],
      ['3', 'dead ends kept', 'A category-first list, a streak counter, and a cat that nagged you by notification.'],
      ['0', 'stock assets', 'The bags, pets and marks are all hand-drawn. An off-the-shelf icon set would have made it just another productivity app.'],
    ],
    cta: ['Open the working file ↗', 'Stuff - design work frame.dc.html'],
    next: ['Next — Maable →', 'Maable - case study.dc.html'],
    chapters: [
      { step: 'Problem', head: 'The list feels like a chore before it\'s a tool', img: 'assets/stuff-1c.png', caption: 'seven items, four of them already in the fridge',
        paras: ['Every grocery app I looked at treats the list as a database: rows, quantities and tidy categories. That works if the difficult part is remembering. For a wandering mind, the difficult part is opening the app in the first place.',
          'So people end up with two systems: a notes app they actually use, and a grocery app they downloaded once. The second is where good intentions quietly go to die.'],
        why: "I started with my own behaviour. I never lost a list; I simply never opened it. So the thing to design against wasn't forgetting. It was that small flinch just before you open the app." },
      { step: 'Goal', head: 'Make it feel like a scrap of paper you already trust', img: 'assets/stuff-3a.png', caption: 'nothing that looks like a form',
        paras: ['I held one rule the whole way through: it must never feel like a productivity tool. Nothing that looks like a form, nothing that keeps score against you, and something in the interface that is clearly on your side.',
          "If it ever started to feel like homework, I'd got it wrong."],
        why: 'Setting one rule early gave every later decision a test. Does this look like a form? Does it keep score? If so, it goes, however clever it might be.' },
      { step: 'Challenge', head: "Warmth that doesn't cost you speed", img: 'assets/bag-jala.png', caption: 'handwriting is slower to scan, so it has to earn its place',
        paras: ['Hand-drawn warmth works against usability. Handwriting is slower to read than a system font, illustration takes up space a list needs, and texture can make a phone screen feel heavy when you\'re standing in a shop.',
          "The reward loop was the other difficulty. Most gamified apps reward you for opening them, which is the one behaviour that shouldn't need rewarding."],
        why: 'Warmth had to justify itself. Every drawn element was weighed against the quick glance you get in a supermarket aisle, and if it slowed that glance down, it didn\'t stay.' },
      { step: 'Process', head: 'Nine rounds, with the dead ends kept', img: 'assets/stuff-4a.png', caption: 'rounds of options, side by side',
        paras: ['I worked in rounds, each one a set of options rather than a single refined screen: the first list, the kraft-and-scribble visual language, the shop, the first run, sharing, and the payoff for finishing.',
          'Three dead ends stayed in the file on purpose. Each one records a rule I only understood by breaking it.'],
        why: 'Putting options side by side forces a real comparison, whereas a single refined screen only invites more polish. I keep the dead ends because that\'s where the rules actually came from.' },
      { step: 'Impact', head: 'Notes rather than quantities. Shika rather than streaks.', img: 'assets/pet-meeks.png', caption: '"a lot of cheese" is the real unit',
        paras: ['Three decisions carry the product. Notes under each item instead of quantities, because "a lot of cheese" is how people actually shop. A single field and no forms, so adding something takes one gesture.',
          'And shika, a currency you only earn by completing a shop, which you spend on bags, pets and skins. Meeks the cat interrupts you inside the app, never by notification.'],
        why: 'Each decision removes a reason not to open it: no quantity to fill in, no form to face, no streak to lose. The reward only arrives once the real job is done.' },
      { step: 'Reflection', head: "What I'd do differently", img: 'assets/bag-gracias.png', caption: 'five interviews, not five screens',
        paras: ["I designed for a mind like mine and then had to test that instinct against other people's. Next time, I'd start with five interviews rather than five screens. The cat is either the best decision in the project or one setting away from being condescending, and I can't judge that from the inside.",
          "I'd also cut a round. Round four exists because I was avoiding a decision, not because the work needed it."],
        why: "Designing for yourself is a good place to start and a poor place to finish. Curiosity got me to the idea; other people are how I'll find out whether it holds up." },
    ],
  },
  maable: {
    kicker: 'Case 02 — gamified productivity',
    title: 'Maable',
    lede: 'Productivity that gives something back, rather than keeping score against you.',
    intro: "A to-do list is really just a ledger of debt. It grows while you rest and never says thank you. Maable puts ten tools on one surface and turns your own work into XP, so the reward comes when you finish, not guilt when you open the app. It's live, built with Kimberly Galdamez Salazar and Yuri Son.",
    tags: ['Live', 'Productivity', 'Design engineering', 'Front end'],
    meta: [['Role', 'Product, design engineering, front end'], ['Timeline', '2026, live at maable-web.vercel.app'], ['Tools', 'React, Vite, Supabase, Figma'], ['Team', 'Kimberly Galdamez Salazar, Yuri Son']],
    verdict: "Ten tools on one surface, with XP that's a by-product of the work, not the point of it.",
    receipts: [
      ['10', 'tools, one surface', 'Tasks, habits, notes, flashcards, a timer, a journal, breathwork, a moodboard, games and now-playing.'],
      ['5', 'life areas', 'Career, student, hobbies, a reading corner, and feeling lazy. Rest days count towards the same total.'],
      ['0', 'paid skins', 'Every skin is unlocked with XP. Selling them would have undermined the whole loop.'],
    ],
    cta: ['Visit the live site ↗', 'https://maable-web.vercel.app/'],
    next: ['Next — Stuff →', 'Stuff - case study.dc.html'],
    chapters: [
      { step: 'Problem', head: 'Task apps punish you. Games reward you.', img: 'src/images/maable-overdue.webp', caption: 'a scoreboard that stays in the red',
        paras: ['A to-do list is a ledger of debt. It grows while you rest, never says thank you, and the scoreboard stays in the red.',
          'Meanwhile the tools are scattered — a timer in one tab, notes in another, a journal in a third. Every switch is a chance to wander off.'],
        why: 'Games worked out how to bring people back a long time ago. I wanted to borrow the reward, not the guilt.' },
      { step: 'Goal', head: 'One surface, and a reason to come back', img: 'src/images/maable-home.webp', caption: 'everything on one screen, nothing to switch to',
        paras: ["Put everything in one place, so there's no need to switch. Reward people when they finish, not when they open the app. Give it a stake in your week that isn't a push notification.",
          'The standard I set: a bad day should still feel manageable. A good day should visibly count for something.'],
        why: 'For a wandering mind, every tab switch is an exit. One surface removes the ways out.' },
      { step: 'Challenge', head: 'Ten tools without ten times the clutter', img: 'src/images/maable-menu.webp', caption: 'ten tools, one menu, still legible',
        paras: ["Ten tools is a lot to fit on one screen without it turning into a control panel.",
          'The companion was trickier still. A mascot that reacts to your mood can tip into guilt quite easily, and where that line sits is different for everyone.'],
        why: 'Curiosity wants everything at once. Focus wants almost nothing. The job was letting both live in the same app.' },
      { step: 'Process', head: 'Four decisions the whole product rests on', img: 'src/images/maable-companion.webp', caption: 'a companion with a mood, not a mascot',
        paras: ["XP as a by-product. Tasks, habits, notes and breathing sessions all earn XP towards a level. Because the reward comes from the work itself, it can't be gamed.",
          'A companion with a mood, not a mascot. Focus Mode, which strips the app back to five tools with one click. And skins you earn, never buy.'],
        why: "If the reward were the whole point, people would find a way to farm it. As a by-product, the only way to earn it is to do the work." },
      { step: 'Impact', head: 'Shipped and in use', img: 'src/images/maable-moodboard.webp', caption: 'a moodboard, one of the ten tools, in daily use',
        paras: ["Maable is live and free to start, with Focus Mode and the Companion both in production. Five areas of life hold it together — even feeling lazy, since rest days count too.",
          'Design and build were the same job here, which is the whole case for design engineering. I tuned the mood curve and the Focus Mode transition in the browser, not in a mock-up.'],
        why: "Building it myself meant the feel got decided in the real material. You can't tell how a mood curve feels from a static frame." },
      { step: 'Reflection', head: "What I'm keeping an eye on", img: 'src/images/maable-korean-notes.webp', caption: 'notes, still being used weeks in',
        paras: ["Whether XP still means something in week three. Sign-ups are easy; the honest test is whether people come back once the novelty's worn off.",
          'And whether ten tools stay coherent. Focus Mode is the release valve — if it ever became the default view, that would tell me the rest needs pruning.'],
        why: 'Novelty gets a curious mind through the door. Week three is when I find out whether there was anything behind it.' },
    ],
  },
  maehlo: {
    kicker: 'Case 03 — this website',
    title: 'Maehlo',
    lede: 'A portfolio you can feed: koi, architectural drawings and 90s pixels, all on one pond.',
    intro: "Most portfolios are a grid of thumbnails you scroll past in seconds. I wanted mine to hold the attention of people with minds like mine, the kind that wander and want to poke at things. So I built it around two things I'm genuinely curious about, koi and architecture, then roughed it up with pixel art so it never felt too polished.",
    tags: ['Live', 'Portfolio', 'Interaction', 'Motion', 'Front end'],
    meta: [['Role', 'Concept, design, motion, front end'], ['Timeline', '2026 · many, many rounds'], ['Tools', 'Figma, HTML/CSS, canvas, React'], ['Team', 'Solo']],
    verdict: 'A site that rewards curiosity: the more you play with it, the more it gives back.',
    receipts: [
      ['12', 'koi, simulated', "Each fish is a live physics simulation, not an animation: it swims, glides, collides and competes for food."],
      ['1', 'screen, no scroll', 'The home page is the pond. Navigation lives on the lily pads, not in a menu.'],
      ['?', 'hidden things', 'A secret stack, a secret folder, and a mini-me who gives in if you scroll long enough.'],
    ],
    cta: ['Back to the pond →', 'Maehlo.dc.html'],
    next: ['Next — Stuff →', 'Stuff - case study.dc.html'],
    chapters: [
      { step: 'Problem', head: 'Portfolios are built to be skimmed', art: 'grid', caption: 'a grid of thumbnails, gone in seconds',
        paras: ["The standard portfolio is a hero line, a grid of projects and a contact link. It's efficient, but it's also forgettable, and for a restless mind it's something to skim rather than explore.",
          'My earlier site had the same issue in a different outfit. It was dark and dramatic, but it was still a sequence you scrolled through and left.'],
        why: "I design for people who wander, so the site had to be somewhere worth wandering. If it only works when someone reads it top to bottom, I've already lost them." },
      { step: 'Idea', head: 'Two obsessions, and something to rough them up', art: 'idea', caption: 'koi + architecture + pixels',
        paras: ["I'd been oddly fixated on koi fish, and I've always loved architecture, so I put the two together: a pond drawn as a set of plans, with dimension lines, north arrows and survey marks labelling everything alive.",
          "Architecture on its own felt too polished, so I needed something to push against it. That became black-and-white 90s pixel art: dithered shadows, blocky ripples, and pads that glitch into pixels."],
        why: 'This is exactly how my thinking works. I take whatever has my curiosity at the time and design around it, then look for the thing that stops it being too neat.' },
      { step: 'Pond', head: 'Koi that behave like koi', art: 'pond', caption: 'a spine, a steering system, and a lot of tuning',
        paras: ['Each koi is a chain of vertebrae driven from the head, with every segment dragged along behind the last, so the body bends naturally into its turns. They swim in bursts and glide, can only move in the direction they\'re facing, and slow down against fluid drag.',
          'They collide, sit at different depths, swim off the edge and loop back in. Drop food and they race straight for it, gulp it, then scatter. Lily pads rock when a fish passes quickly underneath.'],
        why: "Real fish are what makes people stay. If the movement felt canned, the whole idea would fall apart, so I rebuilt the swimming from scratch more than once until it felt right." },
      { step: 'Navigation', head: 'The lily pads are the menu', art: 'nav', caption: 'a pixel koi eats the loading bar',
        paras: ["There's no navigation bar on the home page. Three labelled lily pads lead to my thought process, my selected works and an about page. Click one and the screen dissolves into dithered pixels while a little koi eats its way along a row of pellets as the loading bar.",
          "The page doesn't scroll, so a mini version of me stands in the corner and spins when you try. Keep going, and he eventually gives up the hidden stack."],
        why: 'Every bit of navigation is also a small reward. Finding your way around should feel like discovering something, not operating a menu.' },
      { step: 'System', head: 'One drawing language across every page', art: 'system', caption: 'sheets, title blocks and pixel frames',
        paras: ['Every page is a drawing sheet: a dot grid, title blocks, sheet numbers and scale notes. Frames are hard pixel borders with offset shadows, the type is VT323 and Pixelify Sans, and red is used sparingly for things that matter.',
          'Photos arrive as coarse grey mosaics and sharpen as you reach them. Invert mode turns the entire site into a blueprint-style negative, but leaves photographs true.'],
        why: 'A strict system is what allows the playful parts to feel intentional rather than random. Strict rules underneath give the play on top its freedom.' },
      { step: 'Reflection', head: "What I'd keep an eye on", art: 'invert', caption: 'delight versus clarity',
        paras: ['The risk with a site like this is that the play gets in the way of the work. Recruiters are busy, so every page still has a plain route to the projects, the résumé and my contact details.',
          "Next, I'd like to test it with a handful of people who've never seen it, to find out how quickly they work out that the lily pads are doors."],
        why: 'Curiosity gets people through the door, but clarity is what gets them to the work. The site has to manage both.' },
    ],
  },
  connect: {
    kicker: 'Case 05 — CS capstone',
    title: 'Connect',
    lede: 'A dating app built as a critique of dating apps, designed to succeed the moment you leave.',
    intro: "Most dating apps are built to keep you swiping, not to help you meet someone. For my computer science capstone I catalogued the dark patterns behind that, over forty of them, then designed and built an app that inverts them one by one: transparent scoring, a hard daily cap, deliberate friction before connecting, and a single flat price. It's live.",
    tags: ['Live', 'Capstone', 'Full stack', 'Ethical design', 'Research'],
    meta: [['Role', 'Solo design and full-stack development'], ['Timeline', '2026 · CS capstone'], ['Tools', 'React, TypeScript, Supabase, Figma'], ['Brand', 'Circée']],
    verdict: 'Five profiles a day, every point of the score shown, and nothing you can pay to skip the queue.',
    receipts: [
      ['40+', 'dark patterns', 'Documented across existing apps, then designed against one at a time.'],
      ['5', 'profiles a day', "A hard cap tracked in the database, so reloading or clearing storage doesn't reset it."],
      ['7', 'scoring signals', 'A 0–100 match score with the arithmetic visible to the person it\'s about.'],
    ],
    cta: ['Try it live ↗', 'https://connect-app-rho.vercel.app/'],
    next: ['Next — DormDrop →', 'DormDrop - case study.dc.html'],
    chapters: [
      { step: 'Problem', head: 'Apps rewarded for keeping you single', img: 'src/images/connect-1.png', caption: "Circée's mark, and a promise: intentional connection, not infinite scroll",
        paras: ["Infinite scroll doesn't reward finding someone; it rewards never stopping. The interface has no reason to let you leave satisfied.",
          "Matching algorithms are kept opaque on purpose, and when you can't see why you matched, it's hard to trust that you did. Boosts and paid visibility then turn attention into a line item, so spending money beats matching well."],
        why: 'A wandering mind is exactly who infinite scroll is designed to catch. I wanted to see what happens when an app is on your side instead: when the goal is getting you off it.' },
      { step: 'Goal', head: 'Succeed when people leave', img: 'public/case/connect/connect-splash.png', caption: 'intention is chosen at the door, not two screens in',
        paras: ['The question I held onto: what would a dating app look like if it were built to succeed the moment people leave, rather than the moment they open it again?',
          'That meant choosing your intention at the very start, since it decides who you see, and putting everything that shapes a match where you can read it.'],
        why: 'Transparency is one of the things I care about most in design. If the app makes a judgement about you, you should be able to read its working.' },
      { step: 'Scoring', head: 'Every point on the table', img: 'public/case/connect/connect-transparency.png', caption: 'four scattered cards became one ledger, because the claim is "here\'s the arithmetic"',
        paras: ['Profiles are scored from 0 to 100 across seven signals: interests (30, using a 27-category adjacency graph), age range (15), mutual signals (15), recency (15), profile completeness (10), response rate (10) and relationship readiness (5).',
          "Shared intention and gender preference act as hard filters before any scoring happens. They're a yes or a no, not points, and the ledger names them as gates."],
        why: "Showing the arithmetic changes the relationship. You stop wondering what the app thinks of you, and you can see that effort, like replying and filling in a profile, is what gets rewarded." },
      { step: 'Friction', head: 'Five a day, and a pause before connecting', img: 'public/case/connect/connect-partners.png', caption: 'the daily cap as five marks you watch being spent',
        paras: ["The cap is five profiles a day, shown as five marks you spend. It's tracked through a database function, not held in the page, so it can't be reset by reloading.",
          'Before you connect, one reflective question appears. The way out is labelled "not yet" rather than "go back", because walking away is a legitimate answer.'],
        why: 'Friction usually gets designed out. Here it\'s the point: a moment to think is what separates a choice from a reflex.' },
      { step: 'Build', head: 'Decisions that only show up in the schema', img: 'public/case/connect/connect-messages.png', caption: 'the move-offline nudge lives inside the conversation',
        paras: ['Connecting writes a swipe; matches are created on the server when both people connect, never directly by the client. Five tables run with row-level security, and each conversation subscribes to a live change feed, so messages appear instantly without polling.',
          "The redesign pass kept the flow, the cap and the seven signals exactly as shipped, and reworked hierarchy: what's visible without a tap, what stops competing for attention, and where the copy stops explaining itself twice."],
        why: "Designing and building it myself meant the ethics weren't just copy on a screen. The cap, the scoring and the match rules live in the actual system." },
      { step: 'Reflection', head: "What I'd change", img: 'public/case/connect/connect-cap.png', caption: 'the limit names itself plainly instead of apologising',
        paras: ['The interest matching is more naive than I\'d like. It\'s keyword extraction on free text, so "used to love hiking, over it now" still scores as a hiking match. Next time I\'d use structured signals with some sentiment attached.',
          "The cap taught me something too. Raising it from five to fifteen for a demo showed that five was the right number ethically, but the product hadn't yet earned the trust to hold that line under pressure."],
        why: "Good intentions are easy to write down and harder to defend when there's pressure to show more. That's the lesson I'm taking into everything I make next." },
    ],
  },
  dormdrop: {
    kicker: 'Case 04 — campus marketplace',
    title: 'DormDrop',
    lede: 'A student marketplace where you can trust the person two floors up, because they\'ve been verified.',
    intro: "Buying a stranger's old textbook is normal. Buying it from someone who lives two floors up needs a different kind of trust. DormDrop is a marketplace for American University students only: sign-up is gated behind a verified .edu email, browsing is split into categories, and every conversation stays inside the app.",
    tags: ['Built', 'Team project', 'UX', 'Front end', 'Marketplace'],
    meta: [['Role', 'UX flows, information architecture, React front end'], ['Timeline', '2024'], ['Tools', 'React, Figma'], ['Team', 'Alpha Diallo, Andrew Darfoor · American University']],
    verdict: 'Every listing traces back to a real, accountable student, and the safeguards never leave the app.',
    receipts: [
      ['1', 'gate: .edu', 'Sign-up requires a student email, so accountability comes built in.'],
      ['5', 'categories', 'Textbooks, electronics, dorm essentials, clothes and stationery, instead of one endless feed.'],
      ['3', 'person team', 'I led the UX and information architecture and built the React front end.'],
    ],
    cta: ['Back to selected works →', 'Works.dc.html'],
    next: ['Next — EV Mart →', 'EvMart - case study.dc.html'],
    chapters: [
      { step: 'Problem', head: 'Open marketplaces run on blind trust', img: 'src/images/dormdrop-1.png', caption: 'one line of truth: American University students only',
        paras: ['With open sign-up, anyone could list anything, and there was no reputation system standing in for real accountability.',
          'Once a buyer and seller started messaging, nothing kept the conversation on the platform. Deals moved to text messages, and every safeguard went with them.'],
        why: "Trust is a design problem before it's a feature. If people don't feel safe, no amount of good interface will get them to meet a stranger." },
      { step: 'Goal', head: 'A marketplace people actually trust', img: 'src/images/dormdrop-2.png', caption: 'inside the gate: a verified-students-only badge',
        paras: ['The aim was simple: make every listing traceable to a real student, make things easy to find, and keep conversations where the protections are.',
          'A marketplace only works if the people on it trust each other, so trust shaped every flow, from posting to browsing to messaging.'],
        why: "I started with who's on the other side of the listing. Once that's answered, most of the anxiety about buying second-hand disappears." },
      { step: 'Challenge', head: "Browsing that doesn't wear you out", img: 'src/images/dormdrop-3.png', caption: "a fridge and a statistics textbook shouldn't share one long scroll",
        paras: ['One long, undifferentiated feed made browsing a chore. The harder something is to find, the sooner people give up looking.',
          'The other challenge was keeping people in the app without trapping them: messaging had to be good enough that nobody felt the need to move to text.'],
        why: "For a wandering mind, an endless mixed feed is where you lose the thing you came for. Categories give browsing a shape." },
      { step: 'Process', head: 'Mapping the whole journey first', img: 'src/images/dormdrop-1.png', caption: 'posting, browsing and messaging as one journey',
        paras: ['I led the UX flow design, user journey mapping and information architecture across posting, browsing and messaging, before anything was built.',
          'Then I built the React front end and worked with the team on API integration, real-time messaging and the filtering system that makes the marketplace searchable rather than just scrollable.'],
        why: 'Mapping the journey as a whole stopped us building three separate features. It meant the trust safeguards followed the user through every step.' },
      { step: 'Impact', head: 'What shipped', img: 'src/images/dormdrop-2.png', caption: 'verified, filtered and kept in-platform',
        paras: ["Verified .edu sign-up, so every listing traces back to an accountable person. Category filtering, so browsing narrows instead of going on forever. And in-platform messaging, so the safeguards stay with the conversation.",
          "It's fully responsive as well, so you don't need a native app to buy someone's old mini-fridge."],
        why: 'Each feature answers one of the problems we found. Nothing was added just because marketplaces usually have it.' },
      { step: 'Reflection', head: "What I'd do next", img: 'src/images/dormdrop-3.png', caption: 'trust, then reputation',
        paras: ['Verification solves who someone is, but not how reliable they are. Next, I\'d explore a light reputation layer, built from completed sales rather than star ratings, so trust can grow over time.',
          "I'd also run proper sessions with students on moving day, when the marketplace matters most, to see where the flows hold up under real pressure."],
        why: 'Working in a team of three taught me to design for handover as much as for users. Clear flows made it far easier for everyone to build the same thing.' },
    ],
  },
  // EV Mart isn't part of the original design handoff — it's an older
  // case study, rebuilt into this template on request. Facts (role, scope,
  // timeline, results) are carried over unchanged from the old page; only
  // the voice, structure and art are new, matching the rest of this site.
  evmart: {
    kicker: 'Case 06 — retail POS redesign',
    title: 'EV Mart',
    lede: 'A checkout screen redesigned on-site, so three branches of cashiers stopped fighting the till and started trusting it.',
    intro: "Three branches, one shared point-of-sale interface, and cashiers who'd learned to work around it rather than with it. The till buried its most-used actions behind a flat hierarchy, added a confirmation to nearly every action until confirming became a reflex instead of a check, and let errors read exactly like successes. I spent shifts standing at the counter in Accra watching cashiers work around all three, then redesigned what could ship without touching the C/C++ system underneath. It's live across all three branches.",
    tags: ['Deployed', 'Retail', 'UX research', 'UI', 'Systems'],
    meta: [['Role', 'UX research, UI redesign, deployment lead'], ['Timeline', '2022 · Donfox Systems, Accra'], ['Tools', 'On-site research, existing C/C++ POS'], ['Team', 'Solo, three branches'], ['Supervisor', 'Vincent Togbor, senior developer']],
    verdict: 'A till that stopped fighting the people using it, redesigned around what they actually did at the counter.',
    receipts: [
      ['27%', 'faster checkout', 'Measured across all three deployed branches, not a lab number.'],
      ['0', 'rollbacks', 'Every change shipped inside the existing system, so nothing needed reverting.'],
      ['6', 'cashiers, zero escalations', 'Onboarded onto the new screens without a single support ticket after launch.'],
    ],
    cta: ['Talk to me about this ↗', 'mailto:malvinboye@gmail.com'],
    next: ['Next — Stuff →', 'Stuff - case study.dc.html'],
    chapters: [
      { step: 'Problem', head: 'Three tills, the same fight every shift', art: 'evTill', caption: 'the same button, hesitated over, every till',
        paras: ["EV Mart runs three branches through one shared point-of-sale screen, and every cashier I watched fought the same three things: buttons that never told you which one mattered, a confirmation on almost every tap, and errors that looked exactly like successes.",
          "None of that showed up in a support ticket. It showed up in a queue, in a cashier's shoulders, in the half-second hesitation before the same button every single time."],
        why: "Nobody files a ticket for a screen that's merely annoying. You only find that kind of problem by standing where the problem actually happens." },
      { step: 'Research', head: 'Standing at the counter, not reading the logs', art: 'evTill', caption: 'a real rush, three branches, no ticket queue involved',
        paras: ["I spent shifts at the counter in Accra, watching real transactions during a real rush, then asked cashiers what they'd change. Three answers kept repeating: fix the buttons, cut the confirmations, make errors look like errors.",
          'The system itself gave no signal any of this was wrong. Checkout completed either way — slow and confirmed to death, or fast — and it logged the same.'],
        why: "If the system can't tell you something's broken, you have to go find out for yourself. That's true of software, and it's true of most things I design for." },
      { step: 'Constraint', head: "A system I could redress, not rebuild", art: 'evFlow', caption: 'before and after, inside the same hierarchy',
        paras: ["The till ran on an existing C/C++ point-of-sale system I wasn't going to replace mid-shift across three branches. Everything had to ship as a change inside what already existed.",
          "That ruled out most of the obvious fixes. I worked with the screens that were already there, restructuring them just enough to tell the truth about what mattered."],
        why: 'Constraints like this are usually where I do my best work. A blank canvas invites everything; a working system you can\'t break only lets through the changes that actually earn their place.' },
      { step: 'Redesign', head: 'Hierarchy, fewer confirmations, real errors', caption: 'the confirmation that survived the cut, and the ones that didn\'t',
        paras: ['Three changes carried the whole project. Primary actions got real visual priority, so the right button became the obvious one. Redundant confirmations were cut back to the ones that actually needed a second thought.',
          'And errors stopped reading like successes. Different colour, different weight, different wording, so a mistake actually looked like one.'],
        why: "Each change removes a place where habit was doing the thinking. A cashier's attention is a resource too, and the old screen spent it on the wrong things." },
      { step: 'Impact', head: '27% faster, and nothing to roll back', caption: 'measured across real shifts',
        paras: ['Checkout got 27% faster across all three deployed branches, measured against real shifts. Six cashiers onboarded onto the new screens with zero support escalations.',
          'Nothing shipped needed a rollback. Every change was scoped tightly enough to work inside the live system from day one.'],
        why: "Shipping inside someone else's live system raises the bar for what counts as done. On a system people are relying on that day, it has to go out clean." },
      { step: 'Reflection', head: "What I'd still change", caption: 'a short list, on purpose',
        paras: ["I'd like real usage data next time — a week of logged taps would tell me which confirmation cuts actually mattered and which just felt good to remove.",
          "And I'd push for a proper error log a manager could actually read, something the C/C++ constraint kept off the table this time."],
        why: "Working inside someone else's system taught me to separate what I'd do with more time from what the project actually needed. Most of what's left is worth returning to eventually." },
    ],
  },
  maelo: {
    kicker: 'Case ?? — the secret folder',
    title: '마앨로 Maelo',
    lede: 'A creative outlet I made for myself, which slowly became something I share.',
    intro: "Studying a STEM subject at university is rigid by design, and somewhere along the way I lost the places where I used to just make things. So I started filming my days and editing them, often with no intention of uploading. It was simply somewhere to be creative. Then I noticed the languages I study in my spare time were slipping, Korean especially, so I started making the videos in both Korean and English. That was the beginning of Maelo.",
    tags: ['Ongoing', 'Video', 'Storytelling', 'Editing', 'Bilingual'],
    meta: [['Role', 'Everything: filming, editing, sound, thumbnails'], ['Timeline', 'Started early last year · weekly since 2026'], ['Tools', 'Final Cut Pro, Canva, Pinterest, music'], ['Channel', '@Maehlo']],
    verdict: 'Posting in public keeps me honest. It pushes me to do better, be better and keep refining my taste.',
    receipts: [
      ['2', 'languages per video', 'Korean and English side by side, so every edit doubles as practice.'],
      ['1', 'person crew', 'Idea, filming, edit, sound, thumbnail and upload. Nobody to hand off to, so no excuses.'],
      ['~1', 'video a week', 'Two uploads in the first year. This year it\'s roughly weekly, with the odd break when life needs it.'],
    ],
    cta: ['Watch on YouTube ↗', 'https://www.youtube.com/@Maehlo'],
    next: ['Next — Stuff →', 'Stuff - case study.dc.html'],
    chapters: [
      { step: 'Why', head: 'University left very little room to make things', img: 'src/images/maelo-thumb-study.webp', caption: 'somewhere to make things without a mark scheme',
        paras: ['Before university I had plenty of creative outlets, places where I could simply be myself. A STEM degree replaced most of them with problem sets, where there\'s one right answer and a rubric to meet.',
          "So I began filming my days and cutting them together, usually without uploading anything. It wasn't meant to be content. It was the one part of my week that nobody was marking."],
        why: 'It\'s the same instinct behind everything I design: follow whatever I\'m curious about. In this case, that was the simple pleasure of making something without a brief.' },
      { step: 'Spark', head: 'Losing my Korean is what made it public', img: 'src/images/maelo-subtitle.webp', caption: 'two languages on one timeline',
        paras: ['I study languages in my spare time, and I noticed my Korean starting to fade. Studying on my own wasn\'t enough to keep it; I needed to be using it every week.',
          'So the videos became bilingual. Scripts, voiceovers and captions are all in a mix of Korean and English, and that\'s where the name 마앨로 Maelo comes from.'],
        why: 'I attached a habit I kept dropping to something I already enjoyed. If I want to post, I have to practise. It\'s the same idea behind the XP in Maable.' },
      { step: 'Channel', head: 'A student, a designer, and simply me', img: 'src/images/maelo-thumb-house.webp', caption: "no niche, and that's deliberate",
        paras: ["Maelo is where I document my life as a student and a designer: days at university, the things I'm making, and working things out as I go. There's no gimmick, and that's intentional.",
          'The person I have in mind is someone rather like me. Curious, a little scattered, and only a small push away from making something of their own.'],
        why: "A wandering mind doesn't need a flawless creator to look up to. It helps far more to watch an ordinary person actually begin. The lack of polish is rather the point." },
      { step: 'Craft', head: 'How a video comes together', img: 'src/images/maelo-fcpx.webp', caption: 'pinterest → filming → final cut → canva',
        paras: ['It starts with a mood. A Pinterest board sets the look before I film anything. I shoot across the week, edit in Final Cut Pro, choose music that carries the pace, and put the thumbnail and titles together in Canva.',
          "Editing is where my design background shows. Pacing is really about managing attention: I can see exactly where a viewer is likely to drift, and that's where I cut."],
        why: 'Editing has taught me more about attention than any UX article. The timeline shows you, second by second, where someone stops caring.' },
      { step: 'Hurdles', head: 'What I actually find difficult', art: 'iphone', caption: 'consistency is most of it',
        paras: ['Consistency, above all. Two uploads in a year is what happens when the only deadline is one you set yourself. Coming back meant treating uploads as a routine rather than waiting to feel inspired, and I now post most weeks. I still take breaks when I need them; I\'d rather step away for a week than put out something I don\'t care about.',
          'There\'s also filming in public and being comfortable on camera, writing in two languages without it turning into a lesson, and keeping it enjoyable so it stays an outlet rather than becoming another assignment.'],
        why: 'The editing was never the hard part; turning up was. Realising that changed how I plan. A series of small, repeatable videos beats one perfect one that never gets finished.' },
      { step: 'Payoff', head: 'What it says about how I work', video: '/uploads/maelo-plate6.mp4', caption: 'self-directed, and made in public',
        paras: ['Every video is a small project from start to finish: concept, art direction, filming, editing, sound, packaging and publishing. The feedback is public, and retention graphs are brutally honest.',
          'It also keeps my taste moving. The pacing, type and framing I try out in a vlog tend to find their way into my interfaces, and the other way round.'],
        why: 'Accountability is really what I get out of it. Knowing someone might watch pushes me to do better, and I hope it nudges someone else into starting something of their own.' },
    ],
  },
};

// rev. 2: context, principles and pipeline sit above the key decisions, and
// only the chapters listed in `keep` are shown, so each study stays short.
// The six handoff entries are verbatim from the prototype's EXTRA object;
// `evmart` isn't in the handoff (EV Mart was added later), so its entry is
// written in the same shape. Two deliberate deviations from the handoff:
// Maable's "Brief" row said "designed and built solo", which contradicts
// the team credit added since (Kimberly Galdamez Salazar, Yuri Son).
const EXTRA = {
  stuff: {
    outcome: "A grocery list designed to be finished rather than merely opened: nine rounds, around forty screens and not a single stock asset.",
    metricsLabel: "By the numbers",
    context: [["Who", "Minds that wander, starting with mine"], ["Moment", "The second before a shop, when you either open the list or don't"], ["Constraint", "Quick enough to scan in a supermarket aisle"], ["Status", "Design complete; build next"]],
    principles: [
      ["Nothing that looks like a form", "No quantities, no fields and no settings to face. Notes such as “a lot of cheese” are the real unit."],
      ["Reward finishing, never keep score", "No streaks to lose. Shika are only earned once the shop is actually done."],
      ["Warmth has to earn its place", "Every drawn element is tested against a quick glance in the aisle. If it slows that glance down, it goes."],
    ],
    pipeline: [],
    keep: [2, 3, 4, 5],
  },
  maable: {
    outcome: "Live and in use: ten tools on one surface, where the only way to earn XP is to do the actual work.",
    metricsLabel: "By the numbers",
    context: [["Who", "Minds that switch tabs and never come back"], ["Problem", "To-do lists grow when you rest and never say thank you"], ["Brief", "Self-initiated, built with Kimberly Galdamez Salazar and Yuri Son"], ["Status", "Live at maable-web.vercel.app"]],
    principles: [
      ["XP is a by-product, never the point", "If the reward is the goal, people game it. If it falls out of real work, there's nothing to game."],
      ["One surface, no exits", "Every tab switch is a way out for a wandering mind, so all ten tools live in the same place."],
      ["Rest counts", "Feeling lazy is one of the five life areas. Rest days add to the same total as work."],
      ["Nothing for sale", "Every skin is unlocked with XP. Selling them would undermine the loop they belong to."],
    ],
    pipeline: [["Figma", "Flows and the XP loop"], ["React + Vite", "The single surface and ten tools"], ["Supabase", "Accounts, tasks, habits and XP"], ["Vercel", "Deployed and live"]],
    keep: [2, 3, 4, 5],
  },
  maehlo: {
    outcome: "A portfolio people play with: twelve simulated koi on one screen, where the lily pads are the menu.",
    metricsLabel: "By the numbers",
    context: [["Who", "Recruiters, and people with minds like mine"], ["Problem", "Portfolios are skimmed in seconds"], ["Constraint", "The work still has to be easy to reach"], ["Status", "Live"]],
    principles: [
      ["Every click is a small reward", "Navigation doubles as discovery: pads warp you through, and hidden things reward poking about."],
      ["Strict system, playful surface", "Sheets, title blocks and pixel frames repeat on every page, so the play reads as intentional."],
      ["Rough up the polish", "Architecture alone felt too neat, so 90s pixels and dithering take the edge off it."],
    ],
    pipeline: [["Sprites as text", "Koi, pads and mini-me drawn as character grids"], ["Canvas simulation", "IK spine, steering, drag and collisions"], ["1-bit dither", "4×4 Bayer matrix, black and white only"], ["Pixel upscale", "Rendered small, scaled with crisp edges"], ["DOM overlay", "Labels and door pads track the simulation"]],
    keep: [1, 2, 3, 5],
  },
  connect: {
    outcome: "Shipped and live: a dating app that stops at five profiles a day and shows every point of your match score.",
    metricsLabel: "By the numbers",
    context: [["Who", "People worn out by endless swiping"], ["Brief", "Computer science capstone, 2026"], ["Research", "40+ dark patterns catalogued first"], ["Status", "Live"]],
    principles: [
      ["Show the arithmetic", "If the app judges you, you can read its working: seven signals, every point on the table."],
      ["Friction is a feature", "A daily cap and a reflective pause turn a reflex into a choice."],
      ["Success is leaving", "The app wins when you meet someone and stop needing it."],
      ["Nothing to boost", "One flat price. Money can't buy a better place in the queue."],
    ],
    pipeline: [["React + TypeScript", "Client and the scoring ledger"], ["Supabase Postgres", "Five tables, row-level security"], ["Server-side matching", "A match is only created when both people connect"], ["Database cap", "Five a day, immune to reloads"], ["Realtime feed", "Messages arrive without polling"]],
    keep: [2, 3, 4, 5],
  },
  dormdrop: {
    outcome: "A campus marketplace where every listing traces back to a verified American University student.",
    metricsLabel: "By the numbers",
    context: [["Who", "American University students"], ["Problem", "Open marketplaces run on blind trust, and deals drift off to text"], ["Team", "Three people; I led UX and the front end"], ["Year", "2024"]],
    principles: [
      ["Trust before features", "Verification comes first, because nobody meets a stranger they can't trust."],
      ["Browsing needs a shape", "Five categories rather than one endless feed, so you find what you came for."],
      ["Keep the safeguards in the conversation", "Messaging good enough that nobody feels the need to move to text."],
    ],
    pipeline: [[".edu gate", "Sign-up verified by student email"], ["React front end", "Responsive, no native app needed"], ["API + filters", "Category filtering and search"], ["In-app messaging", "Real-time, on the platform"]],
    keep: [2, 3, 4, 5],
  },
  maelo: {
    outcome: "From two uploads in a year to roughly one a week, in two languages, made by one person.",
    metricsLabel: "By the numbers",
    context: [["Who", "People like me, a small push away from making something"], ["Why", "A creative outlet that university left no room for"], ["Spark", "My Korean was slipping, so the videos became bilingual"], ["Status", "Ongoing, roughly weekly"]],
    principles: [
      ["Make it without a brief", "It started as the one part of my week nobody was marking."],
      ["Tie a habit to something I enjoy", "If I want to post, I have to practise my Korean."],
      ["Cut where attention drifts", "Pacing is attention management. The timeline shows where people stop caring."],
    ],
    pipeline: [["Pinterest", "A mood board sets the look"], ["Film", "Shot across the week"], ["Final Cut Pro", "Edit, pace and sound"], ["Music", "Carries the rhythm"], ["Canva", "Thumbnail and titles"], ["Upload", "Roughly weekly"]],
    keep: [2, 3, 4, 5],
  },
  // Not from the handoff — written to match. Facts come from the existing
  // EV Mart copy; there's no pipeline to show, so it's left empty (the
  // section only renders when non-empty, same as Stuff).
  evmart: {
    outcome: "Live across three branches: a point-of-sale screen redesigned on the shop floor, and 27% faster at the till.",
    metricsLabel: "By the numbers",
    context: [["Who", "Cashiers at three EV Mart branches in Accra"], ["Problem", "No clear hierarchy, a confirmation on nearly every tap, and errors that looked like successes"], ["Constraint", "An existing C/C++ system that had to stay live"], ["Status", "Deployed"]],
    principles: [
      ["Watch the counter first", "Shifts spent beside the cashiers showed problems no support ticket ever would."],
      ["Make the right button obvious", "Primary actions get clear visual priority, so nobody has to memorise where to look."],
      ["Errors should look like errors", "Colour, weight and wording all change, so a mistake gets noticed before the drawer fails to balance."],
    ],
    pipeline: [],
    keep: [2, 3, 4, 5],
  },
};
Object.keys(EXTRA).forEach((id) => {
  const C0 = CASES[id], X = EXTRA[id];
  if (C0 && X) { Object.assign(C0, X); C0.chapters = C0.chapters.filter((_, i) => X.keep.includes(i)); }
});
const navList = (id) => {
  const C = CASES[id];
  return [{ label: 'Overview', id: 'cs-top' }, { label: 'Context', id: 'cs-ctx' }, { label: 'Principles', id: 'cs-pr' },
    ...(C.pipeline && C.pipeline.length ? [{ label: 'Pipeline', id: 'cs-pl' }] : []),
    ...C.chapters.map((c, i) => ({ label: c.step, id: 'cs-' + (i + 1) }))];
};

class Board {
  constructor(getState, setState, caseId) {
    this._getState = getState;
    this._setState = setState;
    this.caseId = caseId;
  }
  get state() { return this._getState(); }
  setState(patch) { this._setState(patch); }

  // Where did you come in from? Referrer first, then the last index page
  // visited this session; the site plan is the default door. Adapted from
  // the source's own .dc.html-filename referrer regexes to this app's real
  // route paths, since the referrer can never contain a .dc.html filename
  // once these are real routes — the fallback order and default are kept
  // identical.
  whereFrom() {
    const r = document.referrer || '';
    try {
      const path = new URL(r).pathname;
      if (path === '/works/stack') return 'stack';
      if (path === '/works') return 'plan';
      if (path === '/thinking') return 'thinking';
    } catch (_) { /* no/invalid referrer */ }
    try { const s = sessionStorage.getItem('mh-from'); if (s) return s; } catch (_) { /* private mode */ }
    return 'plan';
  }

  mount() {
    this.setState({ from: this.whereFrom() });
    try { this.setState({ inv: localStorage.getItem('mh-invert') === '1' }); } catch (_) { /* private mode */ }
    this.calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.kp = 0;
    this._on = () => this.onScroll();
    this._rs = () => { this.setState({ wide: window.innerWidth >= 900 }); this.onScroll(); };
    window.addEventListener('scroll', this._on, { passive: true });
    window.addEventListener('resize', this._rs);
    this._rs();
    this._iv = setInterval(() => this.frame(), 40);
    this.paintArt();
    this._artT = setTimeout(() => this.paintArt(), 300);
    this.initChapterVid();
  }

  unmount() {
    window.removeEventListener('scroll', this._on);
    window.removeEventListener('resize', this._rs);
    clearInterval(this._iv);
    clearTimeout(this._artT);
    cancelAnimationFrame(this._vraf);
  }

  // Only meaningful for the Maehlo case (its chapters carry `art`, not
  // `img`); a harmless no-op elsewhere since no .cs-art canvases exist.
  paintArt() { document.querySelectorAll('.cs-art').forEach((cv) => { try { drawArt(cv, cv.dataset.art); } catch (_) { /* not mounted yet */ } }); }

  // Only meaningful for Maelo's "Payoff" chapter (the one chapter with a
  // `video`) — a harmless no-op elsewhere since no .cs-vid exists. Same
  // technique as About's portrait-video glitch (loop in colour, drop into
  // a 1-bit ordered-dithered pixel feed for a moment), just a shorter,
  // simpler cycle: every 4s instead of every ~10s.
  initChapterVid() {
    const v = document.querySelector('.cs-vid'), cv = document.querySelector('.cs-vidpx');
    if (!v || !cv) return;
    v.muted = true; v.loop = true; v.autoplay = true; v.playsInline = true;
    v.addEventListener('ended', () => { v.currentTime = 0; v.play().catch(() => {}); });
    try { v.play().catch(() => {}); } catch (_) { /* autoplay blocked */ }
    if (this.calm) return;
    const src = document.createElement('canvas'), sc = src.getContext('2d', { willReadFrequently: true });
    const c = cv.getContext('2d');
    const PERIOD = 4, DUR = 1.5;
    const t0 = performance.now() / 1000 - 1;
    const tick = () => {
      if (!document.body.contains(cv)) return; // torn down (route changed)
      const t = (performance.now() / 1000 - t0) % PERIOD;
      const on = t < DUR && v.readyState >= 2;
      if (!on) { cv.style.opacity = '0'; this._vraf = requestAnimationFrame(tick); return; }
      const u = t / DUR;
      const cols = u < 0.12 || u > 0.88 ? 20 : 38;
      const r = cv.getBoundingClientRect(), ar = r.height / Math.max(1, r.width);
      const w = cols, hh = Math.max(1, Math.round(cols * ar));
      if (src.width !== w || src.height !== hh) { src.width = w; src.height = hh; cv.width = w; cv.height = hh; }
      const vw = v.videoWidth, vh = v.videoHeight;
      if (vw && vh) {
        const vr = vh / vw;
        let sx = 0, sy = 0, sw = vw, sh = vh;
        if (vr > ar) { sh = vw * ar; sy = (vh - sh) / 2; } else { sw = vh / ar; sx = (vw - sw) / 2; }
        sc.drawImage(v, sx, sy, sw, sh, 0, 0, w, hh);
        const d = sc.getImageData(0, 0, w, hh), p = d.data, out = c.createImageData(w, hh), o = out.data;
        const tear = Math.random() < 0.35 ? Math.floor(Math.random() * hh) : -1, tearN = 1 + Math.floor(Math.random() * 3), shift = Math.round((Math.random() - 0.5) * 6);
        for (let y = 0; y < hh; y++) for (let x = 0; x < w; x++) {
          const xs = tear >= 0 && y >= tear && y < tear + tearN ? Math.min(w - 1, Math.max(0, x + shift)) : x;
          const i = (y * w + xs) * 4, L = (0.3 * p[i] + 0.59 * p[i + 1] + 0.11 * p[i + 2]) / 255;
          const lum = Math.min(1, Math.max(0, (L - 0.5) * 1.35 + 0.5));
          const on1 = lum > (AB[(y & 3) * 4 + (x & 3)] + 0.5) / 16, j = (y * w + x) * 4, val = on1 ? 250 : 20;
          o[j] = o[j + 1] = o[j + 2] = val; o[j + 3] = 255;
        }
        c.putImageData(out, 0, 0);
      }
      cv.style.opacity = '1';
      this._vraf = requestAnimationFrame(tick);
    };
    this._vraf = requestAnimationFrame(tick);
  }

  // Which sheet is on the desk, and develop any plate that's come into view:
  // it resolves in three hard steps from a coarse grey mosaic to the photo
  // (or, for Maehlo's canvases / Maelo's empty frames, the same filter
  // sweep over whatever's in the plate).
  onScroll() {
    const ids = navList(this.caseId).map(n => n.id);
    const line = window.innerHeight * 0.35;
    let act = 0;
    ids.forEach((id, i) => { const el = document.getElementById(id); if (el && el.getBoundingClientRect().top < line) act = i; });
    if (act !== this.state.act) this.setState({ act });
    document.querySelectorAll('.cs-plate').forEach((pl) => {
      if (pl.dataset.dev) return;
      const r = pl.getBoundingClientRect();
      if (r.top > window.innerHeight * 0.9 || r.bottom < 0) return;
      pl.dataset.dev = '1';
      if (this.calm) { pl.style.filter = 'none'; return; }
      const st = ['url(#cpx14) grayscale(1)', 'url(#cpx6) grayscale(.5)', 'none'];
      st.forEach((f, k) => setTimeout(() => { pl.style.filter = f; }, 120 * (k + 1)));
    });
    const doc = document.documentElement;
    this.prog = Math.max(0, Math.min(1, window.scrollY / Math.max(1, doc.scrollHeight - window.innerHeight)));
  }

  // The rail koi swims down a dotted channel with your scroll.
  frame() {
    const cv = document.getElementById('railKoi');
    if (!cv) return;
    const H = Math.max(40, Math.round(cv.getBoundingClientRect().height / 2));
    if (cv.height !== H) { cv.height = H; this.onScroll(); }
    const c = cv.getContext('2d');
    c.clearRect(0, 0, cv.width, H);
    c.fillStyle = '#141414';
    for (let y = 1; y < H; y += 3) c.fillRect(5, y, 1, 1);
    const tgt = (this.prog || 0) * (H - KOI_DN.length);
    this.kp += (tgt - this.kp) * 0.25;
    const t = performance.now() / 1000;
    const y0 = Math.round(this.kp), wig = this.calm ? 0 : Math.round(Math.sin(t * 6) * 0.6);
    KOI_DN.forEach((row, r) => {
      const sway = r > 9 ? wig : 0;
      [...row].forEach((ch, q) => {
        if (ch === '.') return;
        c.fillStyle = ch === 'o' ? '#8b1a1a' : '#141414';
        c.fillRect(1 + q + sway, y0 + r, 1, 1);
      });
    });
    c.fillStyle = '#fff';
    c.fillRect(3, y0 + 2, 1, 1); c.fillRect(7, y0 + 2, 1, 1);
  }

  renderVals() {
    const C = CASES[this.caseId], act = this.state.act;
    const navItems = navList(this.caseId);
    return {
      wide: this.state.wide,
      nav: navItems.map((n, i) => ({
        label: n.label, href: '#' + n.id, cur: i === act ? 'true' : 'false',
        color: i === act ? '#141414' : '#6d6a63', fill: i === act ? '#141414' : '#fff',
        go: (e) => { e.preventDefault(); const el = document.getElementById(n.id); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 20, behavior: this.calm ? 'auto' : 'smooth' }); },
      })),
      backLabel: { stack: '← Return to the stack', thinking: '← Return to my thinking', plan: '← Return to the site plan' }[this.state.from] || '← Return to the site plan',
      backHref: toRoute({ stack: 'Works Stack.dc.html', thinking: 'Thinking.dc.html', plan: 'Works.dc.html' }[this.state.from] || 'Works.dc.html'),
      kicker: C.kicker, title: C.title, intro: C.intro,
      outcome: C.outcome || C.verdict, metricsLabel: C.metricsLabel || 'By the numbers',
      context: (C.context || []).map(([k, v]) => ({ k, v })),
      principles: (C.principles || []).map(([t, b], i) => ({ t, b, no: pad2(i + 1) })),
      hasPipeline: !!(C.pipeline && C.pipeline.length),
      pipeline: (C.pipeline || []).map(([t, b], i, a) => ({ t, b, no: pad2(i + 1), arrow: i < a.length - 1 ? '→' : '■' })),
      meta: C.meta.map(([k, v]) => ({ k, v })),
      tags: C.tags.map((l, i) => ({ label: l, bg: i === 0 ? '#141414' : '#fff', ink: i === 0 ? '#fff' : '#141414' })),
      receipts: C.receipts.map(([figure, label, note]) => ({ figure, label, note })),
      chapters: C.chapters.map((c, i) => ({
        ...c, id: 'cs-' + (i + 1), no: pad2(i + 1), label: pad2(i + 1) + ' ' + c.step,
        alt: `${C.title} — ${c.caption}`, paras: c.paras.map(t => ({ t })),
        imgSrc: c.img ? (IMG_MAP[c.img] || c.img) : '',
        hasPlate: !!(c.art || c.video || c.img || c.ph),
      })),
      ctaLabel: C.cta[0], ctaHref: toRoute(C.cta[1]),
      ctaKind: C.cta[1].startsWith('http') ? 'external' : C.cta[1].startsWith('mailto:') ? 'mailto' : 'internal',
      nextLabel: C.next[0], nextHref: toRoute(C.next[1]),
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

export default function CaseStudy({ caseId }) {
  const [state, setState] = useState({ act: 0, inv: false, wide: true, from: 'plan' });
  const stateRef = useRef(state);
  stateRef.current = state;
  const location = useLocation();
  const boardRef = useRef(null);
  if (boardRef.current === null || boardRef.current.caseId !== caseId) {
    boardRef.current = new Board(
      () => stateRef.current,
      (patch) => { stateRef.current = { ...stateRef.current, ...patch }; setState(stateRef.current); },
      caseId,
    );
  }
  const board = boardRef.current;

  useEffect(() => {
    board.mount();
    return () => board.unmount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseId, location.pathname]);

  const rv = board.renderVals();
  const hoverInvert = (e) => { e.currentTarget.style.background = '#141414'; e.currentTarget.style.color = '#fff'; };
  const unhoverInvert = (e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#141414'; };
  const hoverCTA = (e) => { e.currentTarget.style.background = '#8b1a1a'; };
  const unhoverCTA = (e) => { e.currentTarget.style.background = '#141414'; };

  return (
    <div className="mh-case" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', minHeight: '100vh', background: '#fff', backgroundImage: 'radial-gradient(#141414 1px,transparent 1.2px)', backgroundSize: '40px 40px', backgroundPosition: '20px 20px' }}>

      <aside style={{ flex: '0 0 clamp(250px,24vw,340px)', position: rv.wide ? 'sticky' : 'relative', top: 0, height: rv.wide ? '100vh' : 'auto', overflow: 'auto', boxSizing: 'border-box', display: 'grid', alignContent: 'start', gap: 22, padding: 'clamp(26px,5vh,56px) clamp(18px,2.4vw,36px)', background: '#fff', borderRight: '3px solid #141414' }}>
        <div style={{ display: 'grid', gap: 10 }}>
          <Link to="/" style={{ fontFamily: "'Pixelify Sans',monospace", fontWeight: 600, fontSize: 'clamp(40px,3.6vw,58px)', lineHeight: .92, letterSpacing: '-.01em' }}>Malvin<br />Boye<span style={{ color: '#8b1a1a' }}>■</span></Link>
          <span style={{ fontSize: 'clamp(19px,1.4vw,22px)', lineHeight: 1.1, color: '#4a4842' }}>"I care about design that feels like something."</span>
        </div>
        <div style={{ display: 'grid', gap: 2, fontSize: 'clamp(16px,1.15vw,19px)', letterSpacing: '.12em', textTransform: 'uppercase', lineHeight: 1.2 }}>
          <span>@maehlo</span>
          <span style={{ color: '#4a4842' }}>Designer · design engineer</span>
          <span style={{ color: '#4a4842' }}>Washington, DC</span>
        </div>

        <nav aria-label="Sections" style={{ position: 'relative', display: 'grid', gridTemplateColumns: '22px 1fr', columnGap: 12 }}>
          <canvas id="railKoi" aria-hidden="true" width="11" height="200" style={{ gridRow: '1 / span 12', width: 22, height: '100%', imageRendering: 'pixelated' }} />
          <div style={{ display: 'grid', gap: 8 }}>
            {rv.nav.map((n, i) => (
              <a key={i} href={n.href} onClick={n.go} aria-current={n.cur} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 'clamp(17px,1.25vw,20px)', letterSpacing: '.14em', textTransform: 'uppercase', color: n.color }}>
                <span aria-hidden="true" style={{ width: 9, height: 9, flex: 'none', background: n.fill, boxShadow: '0 0 0 2px #141414' }} />{n.label}
              </a>
            ))}
          </div>
        </nav>

        <div style={{ display: 'grid', gap: 6, borderTop: '3px solid #141414', paddingTop: 16, fontSize: 'clamp(16px,1.15vw,19px)', letterSpacing: '.12em', textTransform: 'uppercase' }}>
          <Link to="/works">Selected works</Link>
          <Link to="/">The pond</Link>
          <Link to="/resume">Resume</Link>
          <a href="https://www.linkedin.com/in/malvin-m-boye/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
          <a href="mailto:malvinboye@gmail.com" style={{ textTransform: 'none', letterSpacing: '.06em' }}>malvinboye@gmail.com</a>
          <button type="button" onClick={rv.toggleInvert} aria-pressed={rv.invPressed}
            style={{ justifySelf: 'start', marginTop: 8, fontFamily: 'inherit', fontSize: 'inherit', letterSpacing: 'inherit', textTransform: 'uppercase', background: '#fff', color: '#141414', border: 0, cursor: 'pointer', padding: '0 8px', whiteSpace: 'nowrap', boxShadow: '0 -2px 0 0 #141414,0 2px 0 0 #141414,-2px 0 0 0 #141414,2px 0 0 0 #141414' }}
            onMouseEnter={hoverInvert} onMouseLeave={unhoverInvert}>{rv.invLabel}</button>
        </div>
      </aside>

      <main style={{ flex: '1 1 560px', minWidth: 0, padding: 'clamp(26px,5vh,56px) clamp(18px,4vw,64px) 80px', display: 'grid', gap: 'clamp(40px,7vh,80px)', maxWidth: 1100 }}>

        <header id="cs-top" style={{ display: 'grid', gap: 'clamp(20px,3vh,32px)' }}>
          <Link to={rv.backHref} style={{ justifySelf: 'start', background: '#fff', padding: '0 6px', fontSize: 'clamp(16px,1.2vw,19px)', letterSpacing: '.16em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{rv.backLabel}</Link>

          <div role="table" aria-label="Project title block" style={{ background: '#fff', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,200px),1fr))', boxShadow: '0 -3px 0 0 #141414,0 3px 0 0 #141414,-3px 0 0 0 #141414,3px 0 0 0 #141414,10px 10px 0 #141414' }}>
            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap', padding: '6px 16px', background: '#141414', color: '#fff', fontSize: 'clamp(15px,1.1vw,18px)', letterSpacing: '.16em', textTransform: 'uppercase' }}>
              <span>{rv.kicker}</span><span style={{ fontVariantNumeric: 'tabular-nums' }}>Sheet 00 · rev. b</span>
            </div>
            {rv.meta.map((m, j) => (
              <div key={j} role="row" style={{ display: 'grid', gap: 4, padding: '14px 16px', borderRight: '2px solid #141414', borderBottom: '2px solid #141414', margin: '0 -2px -2px 0' }}>
                <span role="rowheader" style={{ fontSize: 'clamp(14px,1vw,16px)', letterSpacing: '.18em', textTransform: 'uppercase', color: '#6d6a63' }}>{m.k}</span>
                <span role="cell" style={{ fontSize: 'clamp(20px,1.5vw,24px)', lineHeight: 1.05 }}>{m.v}</span>
              </div>
            ))}
          </div>

          <h1 style={{ margin: 0, fontFamily: "'Pixelify Sans',monospace", fontWeight: 600, fontSize: 'clamp(76px,10vw,160px)', lineHeight: .85, letterSpacing: '-.02em', background: '#fff', justifySelf: 'start', paddingRight: 10 }}>{rv.title}</h1>
          <div style={{ display: 'grid', gap: 6, justifySelf: 'start', maxWidth: '46ch', background: '#fff', padding: '14px 18px', boxShadow: '0 -3px 0 0 #8b1a1a,0 3px 0 0 #8b1a1a,-3px 0 0 0 #8b1a1a,3px 0 0 0 #8b1a1a' }}>
            <span style={{ fontSize: 'clamp(15px,1.1vw,18px)', letterSpacing: '.18em', textTransform: 'uppercase', color: '#8b1a1a' }}>▶ Outcome</span>
            <p style={{ margin: 0, fontFamily: "'Pixelify Sans',monospace", fontSize: 'clamp(24px,2.2vw,36px)', lineHeight: 1.1, textWrap: 'pretty' }}>{rv.outcome}</p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {rv.tags.map((t, j) => (
              <span key={j} style={{ padding: '1px 10px', background: t.bg, color: t.ink, fontSize: 'clamp(15px,1.1vw,18px)', letterSpacing: '.14em', textTransform: 'uppercase', boxShadow: '0 -2px 0 0 #141414,0 2px 0 0 #141414,-2px 0 0 0 #141414,2px 0 0 0 #141414' }}>{t.label}</span>
            ))}
          </div>
        </header>

        <section style={{ display: 'grid', gap: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 'clamp(16px,1.2vw,19px)', letterSpacing: '.18em', textTransform: 'uppercase' }}>
            <span style={{ background: '#141414', color: '#fff', padding: '0 8px' }}>{rv.metricsLabel}</span>
            <span aria-hidden="true" style={{ flex: 1, height: 0, borderTop: '2px dashed #141414' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,210px),1fr))', gap: 18 }}>
            {rv.receipts.map((r, j) => (
              <div key={j} style={{ background: '#fff', padding: '14px 16px', display: 'grid', gap: 6, alignContent: 'start', boxShadow: '0 -2px 0 0 #141414,0 2px 0 0 #141414,-2px 0 0 0 #141414,2px 0 0 0 #141414' }}>
                <span style={{ fontFamily: "'Pixelify Sans',monospace", fontWeight: 700, fontSize: 'clamp(46px,4.4vw,72px)', lineHeight: .85 }}>{r.figure}</span>
                <span style={{ fontSize: 'clamp(17px,1.25vw,20px)', letterSpacing: '.14em', textTransform: 'uppercase' }}>{r.label}</span>
                <span style={{ fontSize: 'clamp(18px,1.3vw,21px)', lineHeight: 1.15, color: '#3a3833', textWrap: 'pretty' }}>{r.note}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="cs-ctx" style={{ display: 'grid', gap: 18, scrollMarginTop: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 'clamp(16px,1.2vw,19px)', letterSpacing: '.18em', textTransform: 'uppercase' }}>
            <span style={{ background: '#141414', color: '#fff', padding: '0 8px' }}>Sheet C</span>
            <span style={{ background: '#fff', padding: '0 6px' }}>Context</span>
            <span aria-hidden="true" style={{ flex: 1, height: 0, borderTop: '2px dashed #141414' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,300px),1fr))', gap: 'clamp(20px,3vw,40px)', alignItems: 'start' }}>
            <p style={{ margin: 0, background: '#fff', fontSize: 'clamp(20px,1.5vw,24px)', lineHeight: 1.25, color: '#1f1e1c', textWrap: 'pretty' }}>{rv.intro}</p>
            <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: 'auto minmax(0,1fr)', background: '#fff', boxShadow: '0 -3px 0 0 #141414,0 3px 0 0 #141414,-3px 0 0 0 #141414,3px 0 0 0 #141414' }}>
              {rv.context.map((x, j) => (
                <React.Fragment key={j}>
                  <dt style={{ padding: '8px 14px', borderBottom: '2px solid #141414', borderRight: '2px solid #141414', fontSize: 'clamp(14px,1vw,16px)', letterSpacing: '.16em', textTransform: 'uppercase', color: '#6d6a63', whiteSpace: 'nowrap' }}>{x.k}</dt>
                  <dd style={{ margin: 0, padding: '8px 14px', borderBottom: '2px solid #141414', fontSize: 'clamp(19px,1.4vw,22px)', lineHeight: 1.1 }}>{x.v}</dd>
                </React.Fragment>
              ))}
            </dl>
          </div>
        </section>

        <section id="cs-pr" style={{ display: 'grid', gap: 18, scrollMarginTop: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 'clamp(16px,1.2vw,19px)', letterSpacing: '.18em', textTransform: 'uppercase' }}>
            <span style={{ background: '#141414', color: '#fff', padding: '0 8px' }}>Sheet P</span>
            <span style={{ background: '#fff', padding: '0 6px' }}>Design principles</span>
            <span aria-hidden="true" style={{ flex: 1, height: 0, borderTop: '2px dashed #141414' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,230px),1fr))', gap: 18 }}>
            {rv.principles.map((p) => (
              <div key={p.no} style={{ background: '#fff', padding: '14px 16px 16px', display: 'grid', gap: 8, alignContent: 'start', boxShadow: '0 -2px 0 0 #141414,0 2px 0 0 #141414,-2px 0 0 0 #141414,2px 0 0 0 #141414,6px 6px 0 #141414' }}>
                <span style={{ fontSize: 'clamp(15px,1.1vw,17px)', letterSpacing: '.16em', textTransform: 'uppercase', color: '#6d6a63', fontVariantNumeric: 'tabular-nums' }}>Rule {p.no}</span>
                <span style={{ fontFamily: "'Pixelify Sans',monospace", fontWeight: 500, fontSize: 'clamp(22px,1.8vw,28px)', lineHeight: 1.02, textWrap: 'balance' }}>{p.t}</span>
                <span style={{ fontSize: 'clamp(18px,1.3vw,21px)', lineHeight: 1.15, color: '#3a3833', textWrap: 'pretty' }}>{p.b}</span>
              </div>
            ))}
          </div>
        </section>

        {rv.hasPipeline && (
          <section id="cs-pl" style={{ display: 'grid', gap: 18, scrollMarginTop: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 'clamp(16px,1.2vw,19px)', letterSpacing: '.18em', textTransform: 'uppercase' }}>
              <span style={{ background: '#141414', color: '#fff', padding: '0 8px' }}>Sheet T</span>
              <span style={{ background: '#fff', padding: '0 6px' }}>Technical pipeline</span>
              <span aria-hidden="true" style={{ flex: 1, height: 0, borderTop: '2px dashed #141414' }} />
            </div>
            <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,160px),1fr))', gap: 14 }}>
              {rv.pipeline.map((s) => (
                <li key={s.no} style={{ background: '#fff', display: 'grid', alignContent: 'start', boxShadow: '0 -2px 0 0 #141414,0 2px 0 0 #141414,-2px 0 0 0 #141414,2px 0 0 0 #141414' }}>
                  <span style={{ display: 'flex', justifyContent: 'space-between', gap: 8, padding: '3px 10px', background: '#141414', color: '#fff', fontSize: 15, letterSpacing: '.16em', fontVariantNumeric: 'tabular-nums' }}>
                    <span>{s.no}</span><span aria-hidden="true">{s.arrow}</span>
                  </span>
                  <span style={{ padding: '10px 12px 2px', fontFamily: "'Pixelify Sans',monospace", fontSize: 'clamp(19px,1.5vw,23px)', lineHeight: 1.05 }}>{s.t}</span>
                  <span style={{ padding: '0 12px 12px', fontSize: 'clamp(17px,1.2vw,19px)', lineHeight: 1.12, color: '#3a3833', textWrap: 'pretty' }}>{s.b}</span>
                </li>
              ))}
            </ol>
          </section>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 'clamp(16px,1.2vw,19px)', letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: 'calc(-1 * clamp(20px,4vh,50px))' }}>
          <span style={{ background: '#8b1a1a', color: '#fff', padding: '0 8px' }}>Key decisions</span>
          <span aria-hidden="true" style={{ flex: 1, height: 0, borderTop: '2px dashed #8b1a1a' }} />
        </div>

        {rv.chapters.map((c) => (
          <article key={c.id} id={c.id} className="cs-sheet" style={{ display: 'grid', gap: 18, scrollMarginTop: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 'clamp(16px,1.2vw,19px)', letterSpacing: '.18em', textTransform: 'uppercase' }}>
              <span style={{ background: '#141414', color: '#fff', padding: '0 8px', fontVariantNumeric: 'tabular-nums' }}>Sheet {c.no}</span>
              <span style={{ background: '#fff', padding: '0 6px' }}>{c.step}</span>
              <span aria-hidden="true" style={{ flex: 1, height: 0, borderTop: '2px dashed #141414' }} />
            </div>
            <h2 style={{ margin: 0, fontFamily: "'Pixelify Sans',monospace", fontWeight: 500, fontSize: 'clamp(34px,3.6vw,58px)', lineHeight: 1, textWrap: 'balance', background: '#fff', justifySelf: 'start', paddingRight: 8 }}>{c.head}</h2>

            <div style={{ display: 'grid', gridTemplateColumns: c.hasPlate ? 'repeat(auto-fit,minmax(min(100%,300px),1fr))' : 'minmax(0,1fr)', gap: 'clamp(20px,3vw,40px)', alignItems: 'start' }}>
              <div style={{ display: 'grid', gap: 14, background: '#fff', maxWidth: c.hasPlate ? 'none' : '62ch' }}>
                {c.paras.map((p, j) => (
                  <p key={j} style={{ margin: 0, fontSize: 'clamp(20px,1.5vw,24px)', lineHeight: 1.25, color: '#1f1e1c', textWrap: 'pretty' }}>{p.t}</p>
                ))}
                <aside style={{ position: 'relative', marginTop: 6, padding: '12px 14px 12px 16px', border: '2px dashed #8b1a1a', color: '#5e1111', display: 'grid', gap: 4 }}>
                  <span style={{ fontSize: 'clamp(15px,1.1vw,17px)', letterSpacing: '.18em', textTransform: 'uppercase', color: '#8b1a1a' }}>✎ my thinking</span>
                  <span style={{ fontSize: 'clamp(19px,1.4vw,22px)', lineHeight: 1.2, textWrap: 'pretty' }}>{c.why}</span>
                </aside>
              </div>

              {c.hasPlate && (
              <figure style={{ margin: 0, display: 'grid', gap: 8 }}>
                <div aria-hidden="true" style={{ position: 'relative', height: 14 }}>
                  <span style={{ position: 'absolute', left: 0, right: 0, top: 7, borderTop: '1px solid #141414' }} />
                  <span style={{ position: 'absolute', left: 0, top: 2, height: 11, borderLeft: '1px solid #141414' }} />
                  <span style={{ position: 'absolute', right: 0, top: 2, height: 11, borderLeft: '1px solid #141414' }} />
                  <span style={{ position: 'absolute', left: '50%', top: 0, transform: 'translateX(-50%)', background: '#fff', padding: '0 8px', fontSize: 15, letterSpacing: '.14em', lineHeight: '14px' }}>PLATE {c.no}</span>
                </div>
                <div className="cs-plate" style={{ position: 'relative', aspectRatio: c.art ? '16/9' : '4/3', background: '#efeeea', overflow: 'hidden', filter: 'url(#cpx28) grayscale(1)', boxShadow: '0 -3px 0 0 #141414,0 3px 0 0 #141414,-3px 0 0 0 #141414,3px 0 0 0 #141414,8px 8px 0 #141414' }}>
                  {c.art && (
                    <canvas className="cs-art" data-art={c.art} width="160" height="90" role="img" aria-label={c.alt} style={{ display: 'block', width: '100%', height: '100%', background: '#fff', imageRendering: 'pixelated' }} />
                  )}
                  {!c.art && c.video && (
                    // Loops in colour; every 4s it drops into a 1-bit
                    // dithered pixel feed for a moment, same technique as
                    // About's portrait-video glitch, just a shorter cycle.
                    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                      <video className="cs-vid" src={c.video} autoPlay muted loop playsInline style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }} />
                      <canvas className="cs-vidpx" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, imageRendering: 'pixelated' }} />
                    </div>
                  )}
                  {!c.art && !c.video && c.imgSrc && (
                    <img src={c.imgSrc} alt={c.alt} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  )}
                  {!c.art && !c.video && !c.imgSrc && (
                    // Only reached if a chapter has none of art/video/img —
                    // an empty, correctly sized frame with placeholder text.
                    <div role="img" aria-label={c.alt} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 16, color: '#6d6a63', fontSize: 'clamp(15px,1.1vw,18px)', letterSpacing: '.06em' }}>{c.ph}</div>
                  )}
                </div>
                <figcaption style={{ display: 'flex', gap: 10, justifyContent: 'space-between', background: '#fff', fontSize: 'clamp(16px,1.15vw,18px)', letterSpacing: '.08em', marginTop: 6 }}>
                  <span style={{ textTransform: 'uppercase', whiteSpace: 'nowrap' }}>fig. {c.no}.1</span><span style={{ textAlign: 'right', textWrap: 'pretty' }}>{c.caption}</span>
                </figcaption>
              </figure>
              )}
            </div>
          </article>
        ))}

        <footer style={{ display: 'flex', flexWrap: 'wrap', gap: 18, alignItems: 'center', justifyContent: 'space-between', borderTop: '3px solid #141414', paddingTop: 22 }}>
          {rv.ctaKind === 'internal' ? (
            <Link to={rv.ctaHref} style={{ padding: '6px 16px', background: '#141414', color: '#fff', fontSize: 'clamp(18px,1.35vw,22px)', letterSpacing: '.14em', textTransform: 'uppercase', boxShadow: '0 -2px 0 0 #141414,0 2px 0 0 #141414,-2px 0 0 0 #141414,2px 0 0 0 #141414,6px 6px 0 #8b1a1a' }}
              onMouseEnter={hoverCTA} onMouseLeave={unhoverCTA}>{rv.ctaLabel}</Link>
          ) : (
            <a href={rv.ctaHref} {...(rv.ctaKind === 'external' ? { target: '_blank', rel: 'noopener noreferrer' } : {})} style={{ padding: '6px 16px', background: '#141414', color: '#fff', fontSize: 'clamp(18px,1.35vw,22px)', letterSpacing: '.14em', textTransform: 'uppercase', boxShadow: '0 -2px 0 0 #141414,0 2px 0 0 #141414,-2px 0 0 0 #141414,2px 0 0 0 #141414,6px 6px 0 #8b1a1a' }}
              onMouseEnter={hoverCTA} onMouseLeave={unhoverCTA}>{rv.ctaLabel}</a>
          )}
          <Link to={rv.nextHref} style={{ background: '#fff', padding: '0 6px', fontFamily: "'Pixelify Sans',monospace", fontSize: 'clamp(22px,2vw,32px)' }}>{rv.nextLabel}</Link>
        </footer>
      </main>

      <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
        <defs>
          <filter id="cpx6" x="0" y="0" width="100%" height="100%">
            <feFlood x="3" y="3" width="1" height="1" />
            <feComposite width="6" height="6" />
            <feTile result="g" />
            <feComposite in="SourceGraphic" in2="g" operator="in" />
            <feMorphology operator="dilate" radius="3" />
          </filter>
          <filter id="cpx14" x="0" y="0" width="100%" height="100%">
            <feFlood x="7" y="7" width="1" height="1" />
            <feComposite width="14" height="14" />
            <feTile result="g" />
            <feComposite in="SourceGraphic" in2="g" operator="in" />
            <feMorphology operator="dilate" radius="7" />
          </filter>
          <filter id="cpx28" x="0" y="0" width="100%" height="100%">
            <feFlood x="14" y="14" width="1" height="1" />
            <feComposite width="28" height="28" />
            <feTile result="g" />
            <feComposite in="SourceGraphic" in2="g" operator="in" />
            <feMorphology operator="dilate" radius="14" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}
