import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import './App.css';
import UXUIDesign from './pages/UXUIDesign';
import CreativeWorks from './pages/CreativeWorks';
import SoftwareEngineering from './pages/SoftwareEngineering';
import WebDev from './pages/WebDev';
import Creative from './pages/Creative';
import Technical from './pages/Technical';
import ScrollPage from './pages/ScrollPage';

// Typewriter sound
function createTypeSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(800, ctx.currentTime);
    gainNode.gain.setValueAtTime(0.02, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.03);
  } catch(e) {}
}

// Reusable typed text component
function TypedText({ text, delay = 0, className = '', onDone, caretChar = '_' }) {
  const [displayed, setDisplayed] = useState('');
  const [caretVisible, setCaretVisible] = useState(true);
  const [done, setDone] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const start = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(start);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const typing = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      createTypeSound();
      i++;
      if (i >= text.length) {
        clearInterval(typing);
        setDone(true);
        if (onDone) onDone();
      }
    }, 60);
    return () => clearInterval(typing);
  }, [started, text]);

  useEffect(() => {
    if (done) return;
    const blink = setInterval(() => setCaretVisible(v => !v), 530);
    return () => clearInterval(blink);
  }, [done]);

  return (
    <span className={className}>
      {displayed}
      {!done && (
        <span className="caret" style={{ opacity: caretVisible ? 1 : 0 }}>
          {caretChar}
        </span>
      )}
    </span>
  );
}

// Phase 1 — scattered text fragments
const FRAGMENTS = [
  { text: '28.6°N, 77.2°E', x: '8%', y: '12%', rotation: -2, font: 'space-mono', size: '11px' },
  { text: 'Malvin Mallock Boye', x: '60%', y: '8%', rotation: 1, font: 'playfair', size: '13px' },
  { text: 'American University', x: '75%', y: '18%', rotation: -1, font: 'courier', size: '10px' },
  { text: 'B.S. Computer Science', x: '5%', y: '32%', rotation: 2, font: 'courier', size: '10px' },
  { text: '2024—2026', x: '82%', y: '45%', rotation: -3, font: 'space-mono', size: '11px' },
  { text: 'Design Engineer', x: '15%', y: '55%', rotation: 1, font: 'playfair', size: '22px' },
  { text: 'Accra, Ghana', x: '70%', y: '62%', rotation: -1, font: 'courier', size: '10px' },
  { text: '(202) 899-0644', x: '40%', y: '72%', rotation: 2, font: 'space-mono', size: '10px' },
  { text: 'UI/UX Designer', x: '8%', y: '80%', rotation: -2, font: 'playfair', size: '18px' },
  { text: 'mb8198a@american.edu', x: '55%', y: '85%', rotation: 1, font: 'courier', size: '10px' },
  { text: 'React · GSAP · Figma', x: '25%', y: '22%', rotation: -1, font: 'space-mono', size: '11px' },
  { text: 'Artist', x: '88%', y: '30%', rotation: 3, font: 'playfair', size: '28px' },
  { text: 'Washington DC', x: '45%', y: '40%', rotation: -2, font: 'courier', size: '10px' },
  { text: '38.9°N, 77.0°W', x: '20%', y: '90%', rotation: 1, font: 'space-mono', size: '11px' },
  { text: 'Creative Systems', x: '65%', y: '92%', rotation: -1, font: 'playfair', size: '14px' },
  { text: '2022—', x: '90%', y: '78%', rotation: 2, font: 'space-mono', size: '11px' },
];

function Phase1({ onComplete }) {
  const containerRef = useRef(null);
  const fragmentRefs = useRef([]);
  const hasClicked = useRef(false);

  useEffect(() => {
    // Fragments fade in staggered on load
    fragmentRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.fromTo(el,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.6, delay: i * 0.08, ease: 'power2.out' }
      );
    });
  }, []);

  function handleClick() {
    if (hasClicked.current) return;
    hasClicked.current = true;

    // All fragments collapse to center then fade
    const tl = gsap.timeline({ onComplete });
    fragmentRefs.current.forEach((el, i) => {
      if (!el) return;
      tl.to(el, {
        x: '50vw',
        y: '50vh',
        opacity: 0,
        scale: 0.3,
        duration: 0.5,
        ease: 'power3.in',
        delay: i * 0.02,
      }, 0);
    });
    tl.to(containerRef.current, {
      opacity: 0,
      duration: 0.3,
    }, 0.4);
  }

  const fontMap = {
    'space-mono': "'Space Mono', monospace",
    'playfair': "'Playfair Display', serif",
    'courier': "'Courier Prime', monospace",
  };

  return (
    <div ref={containerRef} className="phase1" onClick={handleClick}>
      {FRAGMENTS.map((f, i) => (
        <div
          key={i}
          ref={el => fragmentRefs.current[i] = el}
          className="fragment"
          style={{
            left: f.x,
            top: f.y,
            transform: `rotate(${f.rotation}deg)`,
            fontFamily: fontMap[f.font],
            fontSize: f.size,
          }}
        >
          {f.text}
        </div>
      ))}
      <div className="phase1-hint">click anywhere_</div>
    </div>
  );
}

// Name stages — black and white
const NAME_STAGES = [
  { suffix: '(aelö)', bg: '#ffffff', textColor: '#111' },
  { suffix: 'allock', bg: '#111111', textColor: '#ffffff' },
  { suffix: 'alvin',  bg: '#ffffff', textColor: '#111' },
];

function HiIntro({ onNavigate }) {
  const [nameIndex, setNameIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [caretVisible, setCaretVisible] = useState(true);
  const [settled, setSettled] = useState(false);
  const [showPhase3, setShowPhase3] = useState(false);
  const bgRef = useRef(null);
  const caretRef = useRef(null);

  const currentStage = NAME_STAGES[nameIndex];

  useEffect(() => {
    if (!bgRef.current) return;
    gsap.to(bgRef.current, {
      backgroundColor: currentStage.bg,
      duration: 0.5,
      ease: 'power2.inOut',
    });
  }, [nameIndex]);

  useEffect(() => {
    const blink = setInterval(() => setCaretVisible(v => !v), 530);
    return () => clearInterval(blink);
  }, []);

  // Scroll triggers phase 3
  useEffect(() => {
    if (!settled) return;
    function handleWheel() { window.location.href = '/scroll'; }
    window.addEventListener('wheel', handleWheel, { once: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [settled]);

  useEffect(() => {
    const currentName = currentStage.suffix;
    let i = 0;
    setDisplayed('');

    const typing = setInterval(() => {
      setDisplayed(currentName.slice(0, i + 1));
      createTypeSound();
      i++;
      if (i >= currentName.length) {
        clearInterval(typing);
        if (nameIndex < NAME_STAGES.length - 1) {
          setTimeout(() => {
            let deleteI = currentName.length;
            const deleting = setInterval(() => {
              setDisplayed(currentName.slice(0, deleteI - 1));
              createTypeSound();
              deleteI--;
              if (deleteI <= 0) {
                clearInterval(deleting);
                setNameIndex(n => n + 1);
              }
            }, 60);
          }, 800);
        } else {
          setSettled(true);
        }
      }
    }, 100);

    return () => clearInterval(typing);
  }, [nameIndex]);

  function triggerPhase3() {
    if (showPhase3) return;
    const tl = gsap.timeline({ onComplete: () => setShowPhase3(true) });
    tl.to(caretRef.current, {
      scaleX: 4,
      scaleY: 10,
      duration: 0.25,
      ease: 'power2.in',
    })
    .to(caretRef.current, {
      scaleX: 80,
      scaleY: 80,
      color: '#111',
      duration: 0.55,
      ease: 'power3.in',
    })
    .to(bgRef.current, { opacity: 0, duration: 0.2 });
  }

  if (showPhase3) return <Phase3 onNavigate={onNavigate} />;

  const labelColor = currentStage.textColor === '#ffffff'
    ? 'rgba(255,255,255,0.4)'
    : 'rgba(0,0,0,0.35)';

  return (
    <div ref={bgRef} className="hi-intro" style={{ background: currentStage.bg }}>
      <div className="top-labels">
        <span className="label-name" style={{ color: labelColor, fontFamily: "'Space Mono', monospace" }}>Malvin</span>
        <span className="label-name" style={{ color: labelColor, fontFamily: "'Space Mono', monospace" }}>Boye</span>
      </div>

      <div className="main-text">
        <div className="hi-text" style={{ color: currentStage.textColor }}>Hi</div>
        <div className="m-text">
          <span className="m-initial" style={{ color: currentStage.textColor }}>M</span>
          <span className="m-rest" style={{ color: currentStage.textColor }}>
            {displayed}
            <span
              ref={caretRef}
              className="caret"
              style={{
                opacity: caretVisible ? 1 : 0,
                display: 'inline-block',
                transformOrigin: 'center center',
                color: currentStage.textColor,
              }}
            >_</span>
          </span>
        </div>
      </div>

      <div className="bottom-labels">
        <span className="label-circee" style={{ color: labelColor, fontFamily: "'Space Mono', monospace" }}>Circée</span>
        <span className="label-name" style={{ color: labelColor, fontFamily: "'Space Mono', monospace" }}>Malvin</span>
        <span className="label-name" style={{ color: labelColor, fontFamily: "'Space Mono', monospace" }}>Boye</span>
      </div>

      {settled && (
        <button
          className="immersive-btn"
          style={{
            borderColor: labelColor,
            color: currentStage.textColor,
            fontFamily: "'Space Mono', monospace",
          }}
          onClick={triggerPhase3}
        >
          enter_
        </button>
      )}
    </div>
  );
}

function Phase3({ onNavigate }) {
  const [showPhase4, setShowPhase4] = useState(false);
  const containerRef = useRef(null);
  const oRef = useRef(null);
  const [allLoaded, setAllLoaded] = useState(false);
  const loadedCount = useRef(0);
  const totalItems = 4;

  useEffect(() => {
    if (!containerRef.current) return;
    gsap.fromTo(containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.8, ease: 'power2.inOut' }
    );
  }, []);

  useEffect(() => {
    if (!allLoaded || !oRef.current) return;
    gsap.to(oRef.current, {
      y: -18,
      duration: 0.4,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1,
    });
  }, [allLoaded]);

  function handleItemLoaded() {
    loadedCount.current += 1;
    if (loadedCount.current >= totalItems) {
      setTimeout(() => setAllLoaded(true), 400);
    }
  }

  function triggerPhase4() {
    if (!oRef.current || !containerRef.current) return;
    const tl = gsap.timeline({ onComplete: () => setShowPhase4(true) });
    tl.to(oRef.current, { y: -80, duration: 0.2, ease: 'power2.in' })
      .to(containerRef.current, { y: -window.innerHeight, duration: 0.7, ease: 'power3.in' });
  }

  const navItems = [
    { label: 'Youtube', top: '22%', left: '38%', delay: 200 },
    { label: 'artist', top: '32%', left: '32%', delay: 600 },
    { label: 'vlogger', top: '42%', left: '35%', delay: 1000 },
    { label: 'Creative', top: '28%', left: '48%', delay: 1400 },
  ];

  if (showPhase4) return <Phase4 onNavigate={onNavigate} />;

  return (
    <div ref={containerRef} className="phase3">
      <div className="phase3-top-labels">
        <span className="label-name-dark">Malvin</span>
        <span className="label-name-dark">Boye</span>
      </div>

      <div className="phase3-main">
        <div className="hi-text-dark">Hi</div>
        <div className="m-text-dark">
          <span className="m-initial-dark">M</span>
          <span className="m-rest-dark">
            {'(ael'}
            <span ref={oRef} style={{ display: 'inline-block' }}>ö</span>
            {')'}
          </span>
        </div>
      </div>

      {navItems.map((item, i) => (
        <div key={i} className="nav-float" style={{ top: item.top, left: item.left }}>
          <TypedText
            text={item.label}
            delay={item.delay}
            className="nav-label"
            onDone={handleItemLoaded}
            caretChar="_"
          />
        </div>
      ))}

      <div className="bio-english">
        <TypedText
          text="trying his best to do everything creative wise. Whether that is through, words, photos, film, language"
          delay={800}
          caretChar="_"
        />
      </div>

      <div className="bio-korean">
        <TypedText
          text="글, 사진, 영상, 그리고 언어를 통해 자신만의 창작 세계를 만들어가는 중입니다"
          delay={1200}
          caretChar="_"
        />
      </div>

      <div className="phase3-bottom-labels">
        <span className="label-circee-dark">Circée</span>
        <span className="label-name-dark">Malvin</span>
        <span className="label-name-dark">Boye</span>
      </div>

      {allLoaded && (
        <button className="immersive-btn-dark" onClick={triggerPhase4}>
          enter_
        </button>
      )}
    </div>
  );
}

function TransitionScreen({ onDone }) {
  const ref = useRef(null);

  useEffect(() => {
    gsap.fromTo(ref.current, { opacity: 0 }, { opacity: 1, duration: 0.4 });
    const timer = setTimeout(() => {
      gsap.to(ref.current, { opacity: 0, duration: 0.4, onComplete: onDone });
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={ref} className="transition-screen">
      <div className="transition-top-left">
        <span>設計者</span>
        <span>Malvin Boye</span>
      </div>
      <div className="transition-top-right">
        <span>演出</span>
        <span>Circée</span>
      </div>
      <div className="transition-center">
        <div className="transition-cross">
          <div className="cross-h" />
          <div className="cross-v" />
        </div>
      </div>
      <div className="transition-bottom-left">
        <span>制作</span>
        <span>Washington DC</span>
      </div>
      <div className="transition-bottom-right">
        <span>2024—2026</span>
        <span>AU · maehlo.com</span>
      </div>
    </div>
  );
}

function Phase4({ onNavigate }) {
  const [showTransition, setShowTransition] = useState(false);
  const [transitionDest, setTransitionDest] = useState(null);
  const [box1Drawn, setBox1Drawn] = useState(false);
  const [box2Drawn, setBox2Drawn] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const t1 = setTimeout(() => setBox1Drawn(true), 600);
    const t2 = setTimeout(() => setBox2Drawn(true), 1400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    gsap.fromTo(containerRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    );
  }, []);

  function handleNav(path) {
    setTransitionDest(path);
    setShowTransition(true);
  }

  if (showTransition) {
    return <TransitionScreen onDone={() => onNavigate(transitionDest)} />;
  }

  return (
    <div ref={containerRef} className="phase4">
      <div className="phase4-top">
        <span className="p4-counter">01</span>
        <span className="p4-name">Malvin Boye</span>
      </div>

      <div className="phase4-main">
        <div className="p4-hi">Hi</div>
        <div className="p4-m-row">
          <span className="p4-m-initial">M</span>
          <div
            className={`p4-nav-box ${box1Drawn ? 'drawn' : ''}`}
            onClick={() => handleNav('/creative')}
          >
            <span className="p4-box-text">allock</span>
            <span className="p4-box-label">Creative Work_</span>
          </div>
        </div>

        <div
          className={`p4-nav-box p4-nav-box-2 ${box2Drawn ? 'drawn' : ''}`}
          onClick={() => handleNav('/technical')}
        >
          <span className="p4-box-text">Technical</span>
          <span className="p4-box-label">SWE + Web Dev_</span>
        </div>
      </div>

      <div className="phase4-bottom">
        <span className="p4-layer">layer_01</span>
        <div className="p4-bottom-btns">
          <div className="p4-small-btn" />
          <div className="p4-small-btn" />
        </div>
        <span className="p4-name">Malvin Boye</span>
      </div>
    </div>
  );
}

function Home() {
  const [phase, setPhase] = useState(1);
  const navigate = useNavigate();

  function flyAwayThenNavigate(path) {
    navigate(path);
  }

  return (
    <div className="home">
      {phase === 1 && <Phase1 onComplete={() => setPhase(2)} />}
      {phase === 2 && <HiIntro onNavigate={flyAwayThenNavigate} />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/uxui" element={<UXUIDesign />} />
        <Route path="/creative" element={<Creative />} />
        <Route path="/swe" element={<SoftwareEngineering />} />
        <Route path="/webdev" element={<WebDev />} />
        <Route path="/technical" element={<Technical />} />
        <Route path="/scroll" element={<ScrollPage />} />
      </Routes>
    </BrowserRouter>
  );
}