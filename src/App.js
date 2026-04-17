import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import './App.css';
import paper from './paper.jpg';
import UXUIDesign from './pages/UXUIDesign';
import CreativeWorks from './pages/CreativeWorks';
import SoftwareEngineering from './pages/SoftwareEngineering';
import WebDev from './pages/WebDev';
import Creative from './pages/Creative';
import Technical from './pages/Technical';
import ScrollPage from './pages/ScrollPage';
import { Navigate } from 'react-router-dom';

const NUM_PAPERS = 67;

function generateInitialPositions() {
  return Array.from({ length: NUM_PAPERS }, (_, i) => ({
    id: i,
    x: (Math.random() * 80) - 40,
    y: (Math.random() * 60) - 30,
    rotation: Math.random() * 60 - 30,
    zIndex: i,
    gone: false,
  }));
}

function createTypeSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(600, ctx.currentTime);
    gainNode.gain.setValueAtTime(0.03, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.04);
  } catch(e) {}
}

function TypedText({ text, delay = 0, className = '', onDone }) {
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
        <span className="caret" style={{ opacity: caretVisible ? 1 : 0 }}>|</span>
      )}
    </span>
  );
}

function Home() {
  const papersRef = useRef(generateInitialPositions());
  const paperEls = useRef({});
  const [, forceRender] = useState(0);
  const [phase, setPhase] = useState(1);
  const navigate = useNavigate();
  const hasClicked = useRef(false);

  function flyAwayThenNavigate(path) {
    papersRef.current = papersRef.current.map((p, i) => {
      const angle = (i / NUM_PAPERS) * 360;
      const rad = (angle * Math.PI) / 180;
      return { ...p, x: Math.cos(rad) * 150, y: Math.sin(rad) * 150 };
    });
    forceRender(n => n + 1);
    setTimeout(() => navigate(path), 800);
  }

  useEffect(() => {
    function handleClick(e) {
      if (hasClicked.current) return;
      hasClicked.current = true;

      const clickX = e.clientX;
      const clickY = e.clientY;

      papersRef.current.forEach((p) => {
        if (p.gone) return;
        const paperX = window.innerWidth / 2 + (p.x / 100) * window.innerWidth;
        const paperY = window.innerHeight / 2 + (p.y / 100) * window.innerHeight;
        const dx = paperX - clickX;
        const dy = paperY - clickY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const nx = distance > 0 ? dx / distance : Math.random() - 0.5;
        const ny = distance > 0 ? dy / distance : Math.random() - 0.5;
        const delay = (distance / window.innerWidth) * 0.6;
        const el = paperEls.current[p.id];
        if (!el) return;

        gsap.to(el, {
          rotation: p.rotation + (Math.random() * 40 - 20),
          duration: 0.2,
          delay,
          ease: 'power1.inOut',
          onComplete: () => {
            gsap.to(el, {
              x: nx * (window.innerWidth * 1.5),
              y: ny * (window.innerHeight * 1.5),
              rotation: p.rotation + (Math.random() * 720 - 360),
              duration: 0.7,
              ease: 'power2.in',
              onComplete: () => {
                papersRef.current = papersRef.current.map(paper =>
                  paper.id === p.id ? { ...paper, gone: true } : paper
                );
                const allGone = papersRef.current.every(paper => paper.gone);
                if (allGone) setPhase(2);
              }
            });
          }
        });
      });
    }

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="home" style={{ background: '#1a1a1a' }}>
      {phase === 2 && <HiIntro onNavigate={flyAwayThenNavigate} />}
      {phase === 1 && papersRef.current.map(p => {
        if (p.gone) return null;
        return (
          <div
            key={p.id}
            ref={el => paperEls.current[p.id] = el}
            className="paper"
            style={{
              transform: `translate(calc(-50% + ${p.x}vw), calc(-50% + ${p.y}vh)) rotate(${p.rotation}deg)`,
              zIndex: p.zIndex,
            }}
          />
        );
      })}
    </div>
  );
}

const NAME_STAGES = [
  { suffix: '(aelö)', bg: '#1C1C1C', textColor: 'white' },
  { suffix: 'allock', bg: '#CF3A24', textColor: 'white' },
  { suffix: 'alvin',  bg: '#FFF8E7', textColor: '#111' },
];

function HiIntro({ onNavigate }) {
  const [nameIndex, setNameIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [caretVisible, setCaretVisible] = useState(true);
  const [settled, setSettled] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const bgRef = useRef(null);
  const caretRef = useRef(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const currentStage = NAME_STAGES[nameIndex];

  useEffect(() => {
    if (!bgRef.current) return;
    gsap.to(bgRef.current, {
      backgroundColor: currentStage.bg,
      duration: 0.6,
      ease: 'power2.inOut',
    });
  }, [nameIndex]);
  
  useEffect(() => {
    function handleWheel() {
      if (!settled) return;
      window.location.href = '/scroll';
    }
    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }, [settled]);

  useEffect(() => {
    const blink = setInterval(() => setCaretVisible(v => !v), 530);
    return () => clearInterval(blink);
  }, []);

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

  function handleEnter() {
    if (transitioning) return;
    setTransitioning(true);

    // Caret grows and fills screen morphing into Phase 3 background
    const tl = gsap.timeline();
    tl.to(caretRef.current, {
      scaleX: 3,
      scaleY: 8,
      duration: 0.3,
      ease: 'power2.in',
    })
    .to(caretRef.current, {
      scaleX: 60,
      scaleY: 60,
      backgroundColor: '#000000',
      color: '#000000',
      duration: 0.5,
      ease: 'power3.in',
    })
    .to(containerRef.current, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        // Mount Phase3 by setting a state flag
        setTransitioning(false);
      }
    });
  }

  // Use transitioning as the gate to show Phase3
  const [showPhase3, setShowPhase3] = useState(false);

  function triggerPhase3() {
    if (showPhase3) return;
    setTransitioning(true);

    const tl = gsap.timeline({
      onComplete: () => setShowPhase3(true)
    });

    tl.to(caretRef.current, {
      scaleX: 4,
      scaleY: 10,
      duration: 0.25,
      ease: 'power2.in',
    })
    .to(caretRef.current, {
      scaleX: 80,
      scaleY: 80,
      color: '#000000',
      duration: 0.55,
      ease: 'power3.in',
    })
    .to(containerRef.current, {
      opacity: 0,
      duration: 0.2,
    });
  }

  if (showPhase3) return <Phase3 onNavigate={onNavigate} />;

  const labelColor = currentStage.textColor === 'white'
    ? 'rgba(255,255,255,0.5)'
    : 'rgba(0,0,0,0.4)';

  return (
    <div ref={bgRef} className="hi-intro" style={{ background: currentStage.bg }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }} />

      <div className="top-labels">
        <span className="label-name" style={{ color: labelColor }}>Malvin</span>
        <span className="label-name" style={{ color: labelColor }}>Boye</span>
      </div>

      <div className="main-text">
        <div className="hi-text" style={{ color: currentStage.textColor }}>Hi, I'm</div>
        <div className="m-text">
          <span className="m-green">M</span>
          <span className="m-rest" style={{ color: currentStage.textColor }}>
            {displayed}
            <span
              ref={caretRef}
              className="caret"
              style={{
                opacity: caretVisible ? 1 : 0,
                display: 'inline-block',
                transformOrigin: 'center center',
                color: currentStage.textColor === 'white' ? '#39ff14' : '#CF3A24',
              }}
            >|</span>
          </span>
        </div>
      </div>

      <div className="bottom-labels">
        <span className="label-circee" style={{ color: labelColor }}>Circée</span>
        <span className="label-name" style={{ color: labelColor }}>
          Malvin
          Boye
        </span>
        <span className="label-name" style={{ color: labelColor }}>Circée</span>
      </div>

    {settled && (
      <button
        className="immersive-btn"
        style={{
          borderColor: currentStage.textColor === 'white'
            ? 'rgba(255,255,255,0.4)'
            : 'rgba(0,0,0,0.3)',
        color: currentStage.textColor,
      }}
      onClick={triggerPhase3}
    >
      Immersion
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
  const totalItems = 4; // nav items count
  const navigate = useNavigate();

  useEffect(() => {
    if (!containerRef.current) return;
    gsap.fromTo(containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.8, ease: 'power2.inOut' }
    );
  }, []);

  // Start Ö bouncing after everything loaded
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

    // Ö flies up dragging the whole frame with it
    const tl = gsap.timeline({ onComplete: () => setShowPhase4(true) });
    tl.to(oRef.current, {
      y: -80,
      duration: 0.2,
      ease: 'power2.in',
    })
    .to(containerRef.current, {
      y: -window.innerHeight,
      duration: 0.7,
      ease: 'power3.in',
    });
  }

  const navItems = [
    { label: 'Youtube', top: '22%', left: '58%', delay: 200 },
    { label: 'Artist', top: '70%', left: '72%', delay: 600 },
    { label: 'Vlogger', top: '12%', left: '45%', delay: 1000 },
    { label: 'Creative', top: '28%', left: '48%', delay: 1400 },
    { label: 'Languages', top: '75%', left: '48%', delay: 1400 },
  ];

  if (showPhase4) return <Phase4 onNavigate={onNavigate} />;

  return (
    <div ref={containerRef} className="phase3">
      <div className="phase3-top-labels">
        <button className="back-btn" onClick={Home}>← back</button>
        <span className="label-name-dark">Malvin</span>
        <span className="label-name-dark">Boye</span>
      </div>

      <div className="phase3-main">
        <div className="hi-text-dark">Hi, I'm</div>
        <div className="m-text-dark">
          <span className="m-green">M</span>
          <span className="m-rest-dark">
            {'(ael'}
            <span ref={oRef} style={{ display: 'inline-block' }}>ö</span>
            {')'}
            <span className="caret" style={{ opacity: 0 }}>|</span>
          </span>
        </div>
      </div>

      {navItems.map((item, i) => (
        <div
          key={i}
          className="nav-float"
          style={{ top: item.top, left: item.left }}
        >
          <TypedText
            text={item.label}
            delay={item.delay}
            className="nav-label"
            onDone={handleItemLoaded}
          />
        </div>
      ))}

      <div className="bio-english">
        <TypedText
          text="trying his best to do everything creative wise. Whether that is through, words, photos, film, language"
          delay={800}
        />
      </div>

      <div className="bio-korean">
        <TypedText
          text="글, 사진, 영상, 그리고 언어를 통해 자신만의 창작 세계를 만들어가는 중입니다"
          delay={1200}
        />
      </div>

      <div className="phase3-bottom-labels">
        <span className="label-circee-dark">Circée</span>
        <span className="label-name-dark">Malvin</span>
        <span className="label-name-dark">Boye</span>
      </div>

      {allLoaded && (
        <button className="immersive-btn-dark" onClick={triggerPhase4}>
          Next Phase
        </button>
      )}
    </div>
  );
}

function TransitionScreen({ onDone }) {
  const ref = useRef(null);

  useEffect(() => {
    gsap.fromTo(ref.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5 }
    );
    const timer = setTimeout(() => {
      gsap.to(ref.current, {
        opacity: 0,
        duration: 0.5,
        onComplete: onDone
      });
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={ref} className="transition-screen">
      <div className="transition-top-left">
        <span>美術監督</span>
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
        <span>色彩設計</span>
        <span>Creative & Technical</span>
      </div>
      <div className="transition-bottom-right">
        <span>制作</span>
        <span>AU — Washington DC</span>
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
  const Navigate = useNavigate();

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
        <button className="back-btn" onClick={() => Navigate('/scroll')}>← back</button>
        <span className="p4-counter">1</span>
        <span className="p4-name">Malvin Boye</span>
      </div>

      <div className="phase4-main">
        <div className="p4-hi">Hi, I'm</div>
        <div className="p4-m-row">
          <span className="p4-m-green">M</span>
          <div
            className={`p4-nav-box ${box1Drawn ? 'drawn' : ''}`}
            onClick={() => handleNav('/creative')}
          >
            <span className="p4-box-text">allock</span>
            <span className="p4-box-label">Creative</span>
          </div>
        </div>

        <div
          className={`p4-nav-box p4-nav-box-2 ${box2Drawn ? 'drawn' : ''}`}
          onClick={() => handleNav('/technical')}
        >
          <span className="p4-box-text">Technical</span>
          <span className="p4-box-label">SWE + Web Dev</span>
        </div>
      </div>

      <div className="phase4-bottom">
        <span className="p4-layer">layer</span>
        <div className="p4-bottom-btns">
          <div className="p4-small-btn" />
          <div className="p4-small-btn" />
        </div>
        <span className="p4-name">Malvin Boye</span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scroll" element={<ScrollPage />} />
        <Route path="/uxui" element={<UXUIDesign />} />
        <Route path="/creative" element={<Creative />} />
        <Route path="/swe" element={<SoftwareEngineering />} />
        <Route path="/webdev" element={<WebDev />} />
        <Route path="/technical" element={<Technical />} />
      </Routes>
    </BrowserRouter>
  );
}