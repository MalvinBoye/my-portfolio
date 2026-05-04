import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import './ScrollPage.css';

import manageable1 from '../images/manageable-1.png';
import manageable2 from '../images/manageable-2.png';
import manageable3 from '../images/manageable-3.png';
import dormdrop1 from '../images/dormdrop-1.png';
import dormdrop2 from '../images/dormdrop-2.png';
import dormdrop3 from '../images/dormdrop-3.png';
import connect1 from '../images/connect-1.png';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

// ─── SOUND ───────────────────────────────────────────────────────────────────
function createTypeSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = 'square';
    osc.frequency.setValueAtTime(900 + Math.random() * 200, ctx.currentTime);
    gain.gain.setValueAtTime(0.015, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.03);
  } catch (e) {}
}

// ─── TYPED TEXT ──────────────────────────────────────────────────────────────
function TypedText({ text, delay = 0, className = '', onDone, speed = 55 }) {
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
      {!done && <span className="sp-caret" style={{ opacity: caretVisible ? 1 : 0 }}>_</span>}
    </span>
  );
}

// ─── PROJECT DATA ─────────────────────────────────────────────────────────────
const ROLES = [
  {
    id: 'design-engineer',
    roleA: 'A',
    line1: 'Design',
    line2: 'Engineer',
    bg: '#111111',
    projects: [
      {
        id: 1,
        title: 'Manageable',
        subtitle: 'React · Canvas API · Motion',
        img: null,
        role: 'Interaction Design · Motion System · UI Lead',
        description: 'A unified ADHD-friendly productivity platform integrating notes, scheduling, and Canvas API for automated assignment tracking. Built motion-based UI and conducted user testing with 15 students — 90% reported improved clarity and reduced decision fatigue.',
        tools: ['React', 'Canvas API', 'Motion Design', 'Figma'],
        link: null,
        images: [],
      },
      {
        id: 2,
        title: 'DormDrop',
        subtitle: 'React · Node.js · UX',
        img: null,
        role: 'UX Flow Design · React Frontend · Information Architecture',
        description: 'A secure campus marketplace where AU students buy and sell goods using verified accounts. Led UX flow design, user journey mapping, and information architecture for posting, browsing, and messaging.',
        tools: ['React', 'Node.js', 'Figma', 'Git'],
        link: null,
        images: [],
      },
      {
        id: 3,
        title: 'EV Mart POS',
        subtitle: 'C/C++ · UX Research · UI',
        img: null,
        role: 'UX Research · UI Redesign · Deployment',
        description: 'Researched cashier pain points through user interviews and simplified task flows to reduce error rates. Redesigned key UI components improving checkout speed by 27%, deployed across 3 branches.',
        tools: ['C/C++', 'Figma', 'User Research'],
        link: null,
        images: [],
      },
    ]
  },
  {
    id: 'artist',
    roleA: 'An',
    line1: 'Artist',
    line2: '',
    bg: '#ffffff',
    projects: [
      {
        id: 4,
        title: 'Connect',
        subtitle: 'React · Full-Stack · Ethics',
        img: null,
        role: 'Solo Design + Development — Capstone',
        description: 'An ethical dating app built as a full-stack capstone (CSC-493/694) focused on intentional connection. Designed and developed end-to-end — from interaction design to deployment on Vercel.',
        tools: ['React', 'Node.js', 'Vercel', 'Figma'],
        link: 'https://connect-app-rho.vercel.app/',
        images: [],
      },
      {
        id: 5,
        title: 'Manageable',
        subtitle: 'Motion · ADHD Design · React',
        img: null,
        role: 'Motion System · Flashcard UI · Cognitive Design',
        description: 'A motion-first interface designed around cognitive ease. Every interaction is deliberate — the flashcard system, lock-in mode, and revision flow were built to reduce mental load, not add to it.',
        tools: ['React', 'GSAP', 'Motion Design', 'Figma'],
        link: null,
        images: [],
      },
      {
        id: 6,
        title: 'Kase',
        subtitle: 'AI · Language · UX',
        img: null,
        role: 'UX Design · Overlay UI · Information Architecture',
        description: 'An AI-driven language learning tool that surfaces contextual phrases from real videos to teach languages naturally. Created adaptive overlay UI increasing comprehension by 25% in pilot tests.',
        tools: ['Figma', 'React', 'AI Integration'],
        link: null,
        images: [],
      },
    ]
  },
  {
    id: 'uxui',
    roleA: 'A',
    line1: 'UI/UX',
    line2: 'Designer',
    bg: '#111111',
    projects: [
      {
        id: 7,
        title: 'Connect',
        subtitle: 'Ethical Design · Full-Stack',
        img: null,
        role: 'Product Design · UX · Frontend Engineering',
        description: 'Designed the full UX of an ethical dating app from scratch — interaction flows, visual system, and frontend implementation. Intentional connection over dopamine-driven engagement.',
        tools: ['React', 'Figma', 'Node.js'],
        link: 'https://connect-app-rho.vercel.app/',
        images: [],
      },
      {
        id: 8,
        title: 'DormDrop',
        subtitle: 'UX Flow · React · Auth',
        img: null,
        role: 'UX Flow Design · Frontend · Information Architecture',
        description: 'Designed and built the full UX for a campus commerce platform — from user journey mapping to React implementation with authentication and verified student accounts.',
        tools: ['React', 'Figma', 'Node.js', 'Git'],
        link: null,
        images: [],
      },
      {
        id: 9,
        title: 'Manageable',
        subtitle: 'Cognitive UX · Motion · React',
        img: null,
        role: 'Interaction Design · Motion System · User Testing',
        description: 'Led interaction design and motion system for an ADHD-friendly productivity platform. Conducted user testing with 15 students — 90% reported improved clarity, focus, and reduced decision fatigue.',
        tools: ['React', 'Canvas API', 'Figma', 'Motion Design'],
        link: null,
        images: [],
      },
    ]
  }
];

// ─── PROJECT OVERLAY ──────────────────────────────────────────────────────────
function ProjectOverlay({ project, onClose, isDark }) {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(overlayRef.current,
      { y: '100vh' },
      { y: '0vh', duration: 0.65, ease: 'power3.out' }
    );
    tl.fromTo(contentRef.current,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' },
      '-=0.25'
    );
  }, []);

  function handleClose() {
    gsap.to(overlayRef.current, {
      y: '100vh', duration: 0.55, ease: 'power3.in', onComplete: onClose
    });
  }

  const bg = isDark ? '#111111' : '#ffffff';
  const fg = isDark ? '#ffffff' : '#111111';
  const sub = isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.3)';
  const border = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

  return (
    <div ref={overlayRef} className="overlay" style={{ background: bg, color: fg }}>
      {/* Header */}
      <div className="overlay-header" style={{ borderBottomColor: border, background: bg }}>
        <span className="overlay-title" style={{ color: fg }}>{project.title}_</span>
        <button
          className="overlay-close"
          style={{ borderColor: border, color: sub }}
          onClick={handleClose}
        >
          ✕ close_
        </button>
      </div>

      <div ref={contentRef} className="overlay-body">
        {/* Images */}
        <div className="overlay-images">
          {project.images && project.images.length > 0
            ? project.images.map((img, i) => (
                <img key={i} src={img} alt={`${project.title} ${i + 1}`} className="overlay-img" />
              ))
            : (
              <div className="overlay-img-placeholder" style={{ background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)', color: sub }}>
                <span>{project.title}</span>
              </div>
            )
          }
        </div>

        {/* Info grid */}
        <div className="overlay-info">
          <div className="overlay-section">
            <p className="overlay-label" style={{ color: sub }}>role_</p>
            <p className="overlay-value" style={{ color: fg }}>{project.role}</p>
          </div>

          <div className="overlay-section">
            <p className="overlay-label" style={{ color: sub }}>about_</p>
            <p className="overlay-desc" style={{ color: isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.65)' }}>
              {project.description}
            </p>
          </div>

          <div className="overlay-section">
            <p className="overlay-label" style={{ color: sub }}>tools_</p>
            <div className="overlay-tools">
              {project.tools.map(tool => (
                <span key={tool} className="overlay-tool" style={{ borderColor: border, color: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.55)' }}>
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {project.link && (
            <div className="overlay-section">
              <p className="overlay-label" style={{ color: sub }}>live_</p>
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="overlay-link"
                style={{ color: fg, borderBottomColor: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }}
              >
                {project.link} ↗
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── V → A TRANSITION ────────────────────────────────────────────────────────
function VtoASection({ onComplete }) {
  const containerRef = useRef(null);
  const vRef = useRef(null);
  const aRef = useRef(null);
  const triggered = useRef(false);

  useEffect(() => {
    function onWheel() {
      if (triggered.current) return;
      triggered.current = true;
      const tl = gsap.timeline({ onComplete });
      tl.to(vRef.current, { y: 12, rotation: -12, duration: 0.18, ease: 'power1.inOut' })
        .to(vRef.current, { y: 44, rotation: -90, scaleX: 0.5, duration: 0.28, ease: 'power2.in' })
        .to(vRef.current, { y: 90, rotation: -180, scaleY: 0, opacity: 0, duration: 0.22, ease: 'power3.in' })
        .fromTo(aRef.current,
          { y: 55, scaleY: 0, opacity: 0, rotation: 14 },
          { y: 0, scaleY: 1, opacity: 1, rotation: 0, duration: 0.45, ease: 'power3.out' }
        )
        .to(containerRef.current, { y: -55, opacity: 0, duration: 0.45, delay: 0.25, ease: 'power2.in' });
    }
    window.addEventListener('wheel', onWheel, { once: true });
    return () => window.removeEventListener('wheel', onWheel);
  }, []);

  return (
    <div ref={containerRef} className="vta-container">
      <div className="vta-hi">Hi</div>
      <div className="vta-name-row">
        <span className="vta-m">M</span>
        <span className="vta-static">al</span>
        <span ref={vRef} className="vta-letter" style={{ transformOrigin: 'center bottom' }}>v</span>
        <span ref={aRef} className="vta-letter vta-a" style={{ position: 'absolute', transformOrigin: 'center bottom' }}>a</span>
        <span className="vta-static">in</span>
      </div>
    </div>
  );
}

// ─── PROJECT CARD ────────────────────────────────────────────────────────────
function ProjectCard({ project, index, sectionRef, onProjectClick, isDark }) {
  const cardRef = useRef(null);
  const blRef = useRef(null);
  const brRef = useRef(null);
  const navRef = useRef(null);

  const fg = isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.55)';
  const bracketColor = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)';

  useEffect(() => {
    if (!cardRef.current || !sectionRef.current) return;
    const s = 15 + index * 25;

    gsap.fromTo(cardRef.current,
      { y: '72vh', scale: 0.22, opacity: 0 },
      { y: '0vh', scale: 1, opacity: 1, ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: `${s}% top`, end: `${s + 16}% top`, scrub: 1.2 }
      }
    );

    gsap.to(cardRef.current, {
      scale: 0.72, y: '-28vh', opacity: 0, ease: 'none',
      scrollTrigger: { trigger: sectionRef.current, start: `${s + 20}% top`, end: `${s + 30}% top`, scrub: 1.2 }
    });

    [blRef, brRef].forEach((ref, ri) => {
      gsap.fromTo(ref.current,
        { opacity: 0, x: ri === 0 ? -22 : 22 },
        { opacity: 1, x: 0, ease: 'none',
          scrollTrigger: { trigger: sectionRef.current, start: `${s + 10}% top`, end: `${s + 16}% top`, scrub: 1 }
        }
      );
    });

    gsap.fromTo(navRef.current,
      { opacity: 0 },
      { opacity: 1, ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: `${s + 11}% top`, end: `${s + 16}% top`, scrub: 1 }
      }
    );
  }, [index]);

  return (
    <div className="card-scene">
      <div ref={navRef} className="card-nav">
        <span className="card-nav-title" style={{ color: fg }}>{project.title}_</span>
        <div className="card-nav-tags">
          {project.subtitle.split('·').map(t => (
            <span key={t} className="card-nav-tag" style={{ color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)' }}>
              {t.trim()}
            </span>
          ))}
        </div>
      </div>

      <div className="card-row">
        <span ref={blRef} className="card-bracket" style={{ color: bracketColor }}>(</span>
        <div ref={cardRef} className="project-card-float" onClick={() => onProjectClick(project)}>
          {project.img
            ? <img src={project.img} alt={project.title} className="card-img" />
            : (
              <div className="card-img-placeholder" style={{
                background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'
              }}>
                <span style={{ color: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)' }}>
                  {project.title}
                </span>
                <span className="card-placeholder-sub" style={{ color: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
                  {project.subtitle}
                </span>
              </div>
            )
          }
        </div>
        <span ref={brRef} className="card-bracket" style={{ color: bracketColor }}>)</span>
      </div>

      <div className="card-bottom">
        <span style={{ color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)' }}>•</span>
        <span className="card-index" style={{ color: isDark ? 'rgba(255,255,255,0.28)' : 'rgba(0,0,0,0.28)' }}>
          0{index + 1}
        </span>
        <span style={{ color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)' }}>•</span>
      </div>
    </div>
  );
}

// ─── ROLE SECTION ─────────────────────────────────────────────────────────────
function RoleSection({ role, onProjectClick }) {
  const sectionRef = useRef(null);
  const w1Ref = useRef(null);
  const w2Ref = useRef(null);
  const isDark = role.bg === '#111111';
  const fg = isDark ? '#ffffff' : '#111111';
  const sub = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.28)';

  useEffect(() => {
    if (!sectionRef.current) return;
    const trigger = { trigger: sectionRef.current, start: 'top top', end: '20% top', scrub: 1.5 };
    gsap.to(w1Ref.current, { x: '-34vw', rotation: -90, transformOrigin: 'center center', ease: 'none', scrollTrigger: trigger });
    if (w2Ref.current) {
      gsap.to(w2Ref.current, { x: '34vw', rotation: 90, transformOrigin: 'center center', ease: 'none', scrollTrigger: trigger });
    }
  }, []);

  return (
    <section ref={sectionRef} className="role-section" style={{ background: role.bg }}>
      {/* Sticky title */}
      <div className="role-title-block">
        <div className="role-a" style={{ color: fg }}>{role.roleA}</div>
        <div className="role-words">
          <span ref={w1Ref} className="role-word" style={{ color: fg }}>{role.line1}</span>
          {role.line2 && <span ref={w2Ref} className="role-word" style={{ color: fg }}>{role.line2}</span>}
        </div>
      </div>

      {/* Cards */}
      <div className="cards-zone">
        {role.projects.map((project, i) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={i}
            sectionRef={sectionRef}
            onProjectClick={onProjectClick}
            isDark={isDark}
          />
        ))}
      </div>

      {/* Bottom */}
      <div className="role-bottom" style={{ color: sub }}>
        <span>Malvin</span>
        <span>Boye</span>
      </div>
    </section>
  );
}

// ─── SCROLL PAGE ──────────────────────────────────────────────────────────────
export default function ScrollPage() {
  const [showVtoA, setShowVtoA] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [activeDark, setActiveDark] = useState(false);
  const smoothWrapperRef = useRef(null);
  const smoothContentRef = useRef(null);

  useEffect(() => {
    if (!showContent || !smoothWrapperRef.current || !smoothContentRef.current) return;
    const smoother = ScrollSmoother.create({
      wrapper: smoothWrapperRef.current,
      content: smoothContentRef.current,
      smooth: 1.8,
      effects: true,
    });
    return () => smoother.kill();
  }, [showContent]);

  function handleProjectClick(project, isDark) {
    setActiveProject(project);
    setActiveDark(isDark);
  }

  return (
    <div className="scroll-page">
      {showVtoA && (
        <VtoASection onComplete={() => { setShowVtoA(false); setShowContent(true); }} />
      )}

      {showContent && (
        <div ref={smoothWrapperRef} id="smooth-wrapper">
          <div ref={smoothContentRef} id="smooth-content">
            {ROLES.map(role => (
              <RoleSection
                key={role.id}
                role={role}
                onProjectClick={(p) => handleProjectClick(p, role.bg === '#111111')}
              />
            ))}
          </div>
        </div>
      )}

      {activeProject && (
        <ProjectOverlay
          project={activeProject}
          isDark={activeDark}
          onClose={() => setActiveProject(null)}
        />
      )}
    </div>
  );
}
