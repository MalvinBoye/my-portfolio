import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import './App.css';
import ScrollPage from './pages/ScrollPage';
import Creative from './pages/Creative';
import Technical from './pages/Technical';

// ─── AUDIO ───────────────────────────────────────────────────────────────────
function createTypeSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'square';
    osc.frequency.setValueAtTime(900 + Math.random() * 200, ctx.currentTime);
    gain.gain.setValueAtTime(0.015, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.03);
  } catch (e) {}
}

// ─── TYPED TEXT ──────────────────────────────────────────────────────────────
function TypedText({ text, delay = 0, className = '', onDone, speed = 60 }) {
  const [displayed, setDisplayed] = useState('');
  const [caretVisible, setCaretVisible] = useState(true);
  const [done, setDone] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      createTypeSound();
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
        if (onDone) onDone();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [started, text, speed]);

  useEffect(() => {
    if (done) return;
    const blink = setInterval(() => setCaretVisible(v => !v), 530);
    return () => clearInterval(blink);
  }, [done]);

  return (
    <span className={className}>
      {displayed}
      {!done && <span className="caret" style={{ opacity: caretVisible ? 1 : 0 }}>_</span>}
    </span>
  );
}

// ─── PHASE 1 — SCATTERED FRAGMENTS ───────────────────────────────────────────
const FRAGMENTS = [
  { text: '28.6°N, 77.2°E', x: '7%',  y: '11%', r: -2,  font: 'mono',   size: '10px', w: 400 },
  { text: 'Malvin Mallock Boye',        x: '58%', y: '7%',  r: 1,   font: 'serif',  size: '13px', w: 300 },
  { text: 'American University · DC',   x: '72%', y: '19%', r: -1,  font: 'mono',   size: '10px', w: 400 },
  { text: 'B.S. Computer Science',      x: '4%',  y: '31%', r: 2,   font: 'mono',   size: '10px', w: 400 },
  { text: '2024 — 2026',                x: '80%', y: '44%', r: -3,  font: 'mono',   size: '11px', w: 700 },
  { text: 'Design',                     x: '12%', y: '52%', r: 1,   font: 'serif',  size: '52px', w: 400 },
  { text: 'Engineer',                   x: '14%', y: '67%', r: 1,   font: 'serif',  size: '52px', w: 300 },
  { text: 'Accra, Ghana',               x: '68%', y: '61%', r: -1,  font: 'mono',   size: '10px', w: 400 },
  { text: '(202) 899-0644',             x: '38%', y: '73%', r: 2,   font: 'mono',   size: '10px', w: 400 },
  { text: 'UI/UX',                      x: '6%',  y: '82%', r: -2,  font: 'serif',  size: '40px', w: 400 },
  { text: 'Designer',                   x: '6%',  y: '90%', r: -1,  font: 'serif',  size: '40px', w: 300 },
  { text: 'mb8198a@american.edu',       x: '52%', y: '87%', r: 1,   font: 'mono',   size: '10px', w: 400 },
  { text: 'React · GSAP · Figma',       x: '23%', y: '21%', r: -1,  font: 'mono',   size: '10px', w: 400 },
  { text: 'Artist',                     x: '85%', y: '29%', r: 3,   font: 'serif',  size: '44px', w: 400 },
  { text: 'Washington DC',              x: '42%', y: '39%', r: -2,  font: 'mono',   size: '10px', w: 400 },
  { text: '38.9°N, 77.0°W',            x: '18%', y: '93%', r: 1,   font: 'mono',   size: '10px', w: 400 },
  { text: 'Creative Systems',           x: '62%', y: '94%', r: -1,  font: 'serif',  size: '14px', w: 300 },
  { text: 'IB Diploma · 5.0/7.0',      x: '48%', y: '16%', r: 2,   font: 'mono',   size: '10px', w: 400 },
  { text: 'Motion Design',             x: '78%', y: '80%', r: -2,  font: 'serif',  size: '16px', w: 300 },
  { text: '↓',                          x: '50%', y: '50%', r: 0,   font: 'serif',  size: '80px', w: 100 },
];

function Phase1({ onComplete }) {
  const containerRef = useRef(null);
  const fragRefs = useRef([]);
  const hasClicked = useRef(false);

  useEffect(() => {
    fragRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.fromTo(el,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.5, delay: i * 0.06, ease: 'power2.out' }
      );
    });
  }, []);

  function handleClick() {
    if (hasClicked.current) return;
    hasClicked.current = true;
    const tl = gsap.timeline({ onComplete });
    fragRefs.current.forEach((el, i) => {
      if (!el) return;
      const angle = (i / FRAGMENTS.length) * Math.PI * 2;
      tl.to(el, {
        x: Math.cos(angle) * window.innerWidth * 0.6,
        y: Math.sin(angle) * window.innerHeight * 0.6,
        opacity: 0,
        scale: 0,
        duration: 0.6,
        ease: 'power3.in',
        delay: i * 0.015,
      }, 0);
    });
    tl.to(containerRef.current, { opacity: 0, duration: 0.3 }, 0.5);
  }

  const fontMap = {
    mono: "'Space Mono', monospace",
    serif: "'Playfair Display', serif",
  };

  return (
    <div ref={containerRef} className="phase1" onClick={handleClick}>
      {FRAGMENTS.map((f, i) => (
        <div
          key={i}
          ref={el => fragRefs.current[i] = el}
          className="fragment"
          style={{
            left: f.x, top: f.y,
            transform: `rotate(${f.r}deg)`,
            fontFamily: fontMap[f.font],
            fontSize: f.size,
            fontWeight: f.w,
          }}
        >
          {f.text}
        </div>
      ))}
      <div className="phase1-hint">— click anywhere to begin</div>
    </div>
  );
}

// ─── NAME STAGES ─────────────────────────────────────────────────────────────
const NAME_STAGES = [
  { suffix: '(aelö)', bg: '#ffffff', fg: '#111111' },
  { suffix: 'allock', bg: '#111111', fg: '#ffffff' },
  { suffix: 'alvin',  bg: '#ffffff', fg: '#111111' },
];

// ─── PHASE 2 — HI INTRO ──────────────────────────────────────────────────────
function HiIntro({ onNavigate }) {
  const [nameIndex, setNameIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [caretVisible, setCaretVisible] = useState(true);
  const [settled, setSettled] = useState(false);
  const [showPhase3, setShowPhase3] = useState(false);
  const bgRef = useRef(null);
  const caretRef = useRef(null);
  const stage = NAME_STAGES[nameIndex];

  // Background color transition
  useEffect(() => {
    if (!bgRef.current) return;
    gsap.to(bgRef.current, { backgroundColor: stage.bg, duration: 0.5, ease: 'power2.inOut' });
  }, [nameIndex]);

  // Caret blink
  useEffect(() => {
    const b = setInterval(() => setCaretVisible(v => !v), 530);
    return () => clearInterval(b);
  }, []);

  // Scroll → scroll journey
  useEffect(() => {
    if (!settled) return;
    function onWheel() { window.location.href = '/scroll'; }
    window.addEventListener('wheel', onWheel, { once: true });
    return () => window.removeEventListener('wheel', onWheel);
  }, [settled]);

  // Typing cycle
  useEffect(() => {
    const name = stage.suffix;
    let i = 0;
    setDisplayed('');
    const typing = setInterval(() => {
      setDisplayed(name.slice(0, i + 1));
      createTypeSound();
      i++;
      if (i >= name.length) {
        clearInterval(typing);
        if (nameIndex < NAME_STAGES.length - 1) {
          setTimeout(() => {
            let d = name.length;
            const deleting = setInterval(() => {
              setDisplayed(name.slice(0, d - 1));
              createTypeSound();
              d--;
              if (d <= 0) { clearInterval(deleting); setNameIndex(n => n + 1); }
            }, 55);
          }, 900);
        } else {
          setSettled(true);
        }
      }
    }, 95);
    return () => clearInterval(typing);
  }, [nameIndex]);

  function triggerPhase3() {
    if (showPhase3) return;
    const tl = gsap.timeline({ onComplete: () => setShowPhase3(true) });
    tl.to(caretRef.current, { scaleX: 4, scaleY: 10, duration: 0.2, ease: 'power2.in' })
      .to(caretRef.current, { scaleX: 90, scaleY: 90, duration: 0.5, ease: 'power3.in' })
      .to(bgRef.current, { opacity: 0, duration: 0.2 });
  }

  if (showPhase3) return <Phase3 onNavigate={onNavigate} />;

  const sub = stage.fg === '#ffffff' ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.3)';

  return (
    <div ref={bgRef} className="hi-intro" style={{ background: stage.bg }}>
      {/* Top */}
      <div className="p2-top">
        <span style={{ color: sub }}>Malvin</span>
        <span style={{ color: sub }}>Boye</span>
      </div>

      {/* Main */}
      <div className="p2-main">
        <div className="p2-hi" style={{ color: stage.fg }}>Hi</div>
        <div className="p2-m-row">
          <span className="p2-m" style={{ color: stage.fg }}>M</span>
          <span className="p2-rest" style={{ color: stage.fg }}>
            {displayed}
            <span
              ref={caretRef}
              style={{
                display: 'inline-block',
                transformOrigin: 'center center',
                opacity: caretVisible ? 1 : 0,
                color: stage.fg,
                fontFamily: "'Space Mono', monospace",
              }}
            >_</span>
          </span>
        </div>
      </div>

      {/* Bottom */}
      <div className="p2-bottom">
        <span style={{ color: sub, fontStyle: 'italic' }}>Circée</span>
        <span style={{ color: sub }}>Malvin</span>
        <span style={{ color: sub }}>Boye</span>
      </div>

      {/* Enter button */}
      {settled && (
        <button
          className="enter-btn"
          style={{ borderColor: sub, color: stage.fg }}
          onClick={triggerPhase3}
        >
          enter_
        </button>
      )}
    </div>
  );
}

// ─── PHASE 3 — BLACK CINEMATIC ────────────────────────────────────────────────
function Phase3({ onNavigate }) {
  const [showPhase4, setShowPhase4] = useState(false);
  const containerRef = useRef(null);
  const oRef = useRef(null);
  const [allLoaded, setAllLoaded] = useState(false);
  const loadedCount = useRef(0);
  const TOTAL = 4;

  useEffect(() => {
    gsap.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'power2.out' });
  }, []);

  useEffect(() => {
    if (!allLoaded || !oRef.current) return;
    gsap.to(oRef.current, { y: -16, duration: 0.38, ease: 'power1.inOut', yoyo: true, repeat: -1 });
  }, [allLoaded]);

  function onItemDone() {
    loadedCount.current += 1;
    if (loadedCount.current >= TOTAL) setTimeout(() => setAllLoaded(true), 300);
  }

  function triggerPhase4() {
    const tl = gsap.timeline({ onComplete: () => setShowPhase4(true) });
    tl.to(oRef.current, { y: -100, duration: 0.18, ease: 'power2.in' })
      .to(containerRef.current, { y: -window.innerHeight, duration: 0.65, ease: 'power3.in' });
  }

  const navItems = [
    { label: 'youtube', top: '22%', left: '38%', delay: 300 },
    { label: 'artist',  top: '31%', left: '32%', delay: 700 },
    { label: 'vlogger', top: '41%', left: '35%', delay: 1100 },
    { label: 'creator', top: '27%', left: '48%', delay: 1500 },
  ];

  if (showPhase4) return <Phase4 onNavigate={onNavigate} />;

  return (
    <div ref={containerRef} className="phase3">
      <div className="p3-top">
        <span>Malvin</span>
        <span>Boye</span>
      </div>

      <div className="p3-main">
        <div className="p3-hi">Hi</div>
        <div className="p3-m-row">
          <span className="p3-m">M</span>
          <span className="p3-rest">
            {'(ael'}
            <span ref={oRef} style={{ display: 'inline-block' }}>ö</span>
            {')'}
          </span>
        </div>
      </div>

      {navItems.map((item, i) => (
        <div key={i} className="nav-float" style={{ top: item.top, left: item.left }}>
          <TypedText text={item.label} delay={item.delay} className="nav-label" onDone={onItemDone} />
        </div>
      ))}

      <div className="bio-en">
        <TypedText
          text="trying his best to do everything creative wise. whether that is through words, photos, film, language_"
          delay={900}
          speed={40}
        />
      </div>

      <div className="bio-kr">
        <TypedText
          text="글, 사진, 영상, 그리고 언어를 통해 자신만의 창작 세계를 만들어가는 중입니다"
          delay={1400}
          speed={55}
        />
      </div>

      <div className="p3-bottom">
        <span style={{ fontStyle: 'italic' }}>Circée</span>
        <span>Malvin</span>
        <span>Boye</span>
      </div>

      {allLoaded && (
        <button className="enter-btn-dark" onClick={triggerPhase4}>enter_</button>
      )}
    </div>
  );
}

// ─── TRANSITION SCREEN ────────────────────────────────────────────────────────
function TransitionScreen({ onDone }) {
  const ref = useRef(null);
  useEffect(() => {
    gsap.fromTo(ref.current, { opacity: 0 }, { opacity: 1, duration: 0.4 });
    const t = setTimeout(() => gsap.to(ref.current, { opacity: 0, duration: 0.4, onComplete: onDone }), 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div ref={ref} className="transition-screen">
      <div className="tr-tl"><span>設計者</span><span>Malvin Boye</span></div>
      <div className="tr-tr"><span>演出</span><span>Circée</span></div>
      <div className="tr-center">
        <div className="tr-cross"><div className="cross-h" /><div className="cross-v" /></div>
      </div>
      <div className="tr-bl"><span>制作</span><span>Washington DC</span></div>
      <div className="tr-br"><span>2024—2026</span><span>maehlo.com</span></div>
    </div>
  );
}

// ─── PHASE 4 — NAVIGATION ─────────────────────────────────────────────────────
function Phase4({ onNavigate }) {
  const [showTr, setShowTr] = useState(false);
  const [dest, setDest] = useState(null);
  const [b1, setB1] = useState(false);
  const [b2, setB2] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const t1 = setTimeout(() => setB1(true), 600);
    const t2 = setTimeout(() => setB2(true), 1400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    gsap.fromTo(ref.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' });
  }, []);

  function go(path) { setDest(path); setShowTr(true); }

  if (showTr) return <TransitionScreen onDone={() => onNavigate(dest)} />;

  return (
    <div ref={ref} className="phase4">
      <div className="p4-top">
        <span className="p4-counter">01_</span>
        <span className="p4-name">Malvin Boye</span>
      </div>

      <div className="p4-main">
        <div className="p4-hi">Hi</div>
        <div className="p4-m-row">
          <span className="p4-m">M</span>
          <div className={`p4-box ${b1 ? 'drawn' : ''}`} onClick={() => go('/creative')}>
            <span className="p4-box-text">allock</span>
            <span className="p4-box-label">Creative Work_</span>
          </div>
        </div>
        <div className={`p4-box p4-box-2 ${b2 ? 'drawn' : ''}`} onClick={() => go('/technical')}>
          <span className="p4-box-text">Technical</span>
          <span className="p4-box-label">SWE + Web Dev_</span>
        </div>
      </div>

      <div className="p4-bottom">
        <span className="p4-layer">layer_01</span>
        <div className="p4-dots"><div className="p4-dot" /><div className="p4-dot" /></div>
        <span className="p4-name">Malvin Boye</span>
      </div>
    </div>
  );
}

// ─── HOME ─────────────────────────────────────────────────────────────────────
function Home() {
  const [phase, setPhase] = useState(1);
  const navigate = useNavigate();
  return (
    <div className="home">
      {phase === 1 && <Phase1 onComplete={() => setPhase(2)} />}
      {phase === 2 && <HiIntro onNavigate={p => navigate(p)} />}
    </div>
  );
}

// ─── LANDING PAGES ────────────────────────────────────────────────────────────
function PageShell({ title, sub }) {
  const navigate = useNavigate();
  return (
    <div className="page-shell">
      <button className="back-btn" onClick={() => navigate('/')}>← back_</button>
      <div className="page-title">{title}</div>
      <div className="page-sub">{sub}</div>
    </div>
  );
}

function CreativePage() {
  return <PageShell title="Creative Work_" sub="UX/UI Design · Art Direction · Creative Systems" />;
}

function TechnicalPage() {
  return <PageShell title="Technical_" sub="Software Engineering · Web Development · Systems" />;
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/creative" element={<CreativePage />} />
        <Route path="/technical" element={<TechnicalPage />} />
        <Route path="/scroll" element={<ScrollPage />} />
      </Routes>
    </BrowserRouter>
  );
}
