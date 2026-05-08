import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './MainSite.css';

gsap.registerPlugin(ScrollTrigger);

// supabase
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

// audio feedback for typing
function typeClick() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.connect(g); g.connect(ctx.destination);
    osc.type = 'square';
    osc.frequency.setValueAtTime(700 + Math.random() * 200, ctx.currentTime);
    g.gain.setValueAtTime(0.012, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
    osc.start(); osc.stop(ctx.currentTime + 0.03);
  } catch (e) {}
}

// mechanical page transition using a sliding curtain effect
function usePageTransition() {
  const curtainRef = useRef(null);

  useEffect(() => {
    if (curtainRef.current) {
      gsap.fromTo(curtainRef.current,
        { x: '0%' },
        { x: '100%', duration: 0.7, ease: 'power3.inOut' }
      );
    }
  }, []);

  function transitionTo(callback) {
    if (!curtainRef.current) { callback(); return; }
    gsap.fromTo(curtainRef.current,
      { x: '-100%' },
      { x: '0%', duration: 0.55, ease: 'power3.inOut', onComplete: callback }
    );
  }

  const Curtain = () => (
    <div ref={curtainRef} style={{
      position: 'fixed', top: 0, left: 0,
      width: '100vw', height: '100vh',
      background: '#111', zIndex: 9999,
      transform: 'translateX(-100%)',
      pointerEvents: 'none',
    }} />
  );

  return { transitionTo, Curtain };
}

// live clock
function LiveClock() {
  const [time, setTime] = useState('');
  useEffect(() => {
    function update() {
      setTime(new Date().toLocaleTimeString('en-US', {
        timeZone: 'America/New_York',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
      }));
    }
    update();
    const iv = setInterval(update, 1000);
    return () => clearInterval(iv);
  }, []);
  return <span>{time}</span>;
}

// scroll reveal hook using GSAP
function useReveal(ref, options = {}) {
  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(ref.current,
      { opacity: 0, y: options.y ?? 40 },
      {
        opacity: 1, y: 0,
        duration: options.duration ?? 0.8,
        ease: options.ease ?? 'power2.out',
        scrollTrigger: {
          trigger: ref.current,
          start: options.start ?? 'top 82%',
          toggleActions: 'play none none none',
        }
      }
    );
  }, []);
}

// marguee component for interests section
function Marquee({ items, dark }) {
  return (
    <div className={`marquee-wrap ${dark ? 'marquee-dark' : ''}`}>
      <div className="marquee-track">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="marquee-item">
            {item}<span className="marquee-dot">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// typewriter hero component with user interaction to trigger the poster board
const NAMES = ['Malvin', 'Mallock', 'Maelo'];

function TypewriterHero({ onPosterTrigger }) {
  const [nameIndex, setNameIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [caretVisible, setCaretVisible] = useState(true);
  const [userTyping, setUserTyping] = useState(false);
  const [userText, setUserText] = useState('');
  const [settled, setSettled] = useState(false);
  const animRef = useRef(null);
  const deleteRef = useRef(null);
  const heroRef = useRef(null);

  // Hero entrance
  useEffect(() => {
    if (!heroRef.current) return;
    gsap.fromTo(heroRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', delay: 0.1 }
    );
  }, []);

  useEffect(() => {
    const b = setInterval(() => setCaretVisible(v => !v), 530);
    return () => clearInterval(b);
  }, []);

  useEffect(() => {
    function onKey(e) {
      if (e.metaKey || e.ctrlKey || e.altKey || e.key === 'Escape' || e.key === 'Tab') return;
      if (!userTyping) {
        clearInterval(animRef.current);
        clearInterval(deleteRef.current);
        setUserTyping(true);
        setDisplayed('');
        setSettled(false);
      }
      if (e.key === 'Backspace') { setUserText(p => p.slice(0, -1)); return; }
      if (e.key === 'Enter') {
        if (userText.toLowerCase().trim() === 'poster') onPosterTrigger();
        else setSettled(true);
        return;
      }
      if (e.key.length === 1) { typeClick(); setUserText(p => p + e.key); }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [userTyping, userText, onPosterTrigger]);

  useEffect(() => {
    if (userTyping) setDisplayed(userText);
  }, [userText, userTyping]);

  useEffect(() => {
    if (userTyping) return;
    const name = NAMES[nameIndex];
    let i = 0; setDisplayed('');
    animRef.current = setInterval(() => {
      setDisplayed(name.slice(0, i + 1));
      typeClick(); i++;
      if (i >= name.length) {
        clearInterval(animRef.current);
        if (nameIndex < NAMES.length - 1) {
          setTimeout(() => {
            let d = name.length;
            deleteRef.current = setInterval(() => {
              setDisplayed(name.slice(0, d - 1));
              typeClick(); d--;
              if (d <= 0) { clearInterval(deleteRef.current); setNameIndex(n => n + 1); }
            }, 55);
          }, 1100);
        } else setSettled(true);
      }
    }, 95);
    return () => { clearInterval(animRef.current); clearInterval(deleteRef.current); };
  }, [nameIndex, userTyping]);

  return (
    <section className="hero-section">
      <div ref={heroRef} className="hero-inner" style={{ opacity: 0 }}>
        <div className="hero-greeting">
          <span className="hero-hi">Hi, I'm </span>
          <span className="hero-name-type">
            {displayed}
            <span className="hero-caret" style={{ opacity: caretVisible ? 1 : 0 }}>_</span>
          </span>
          <span className="hero-boye"> Boye</span>
        </div>
        {(userTyping || settled) && (
          <div className="hero-hint">
            {userTyping
              ? "— type freely · type 'poster' + enter for something_"
              : '— click anywhere and type something_'
            }
          </div>
        )}
        <div className="hero-sub">
          <span className="hero-tag">Design Engineer</span>
          <span className="hero-tag">Artist</span>
          <span className="hero-tag">Creative</span>
        </div>
      </div>
      <div className="hero-scroll-hint">scroll_</div>
    </section>
  );
}

//sticky note board
const EASTER_EGGS = [
  { id: 'eg-gh', type: 'sticker', content: '🇬🇭', label: 'Ghana', x: 8,  y: 12, rotation: -8,  size: 'lg' },
  { id: 'eg-kr', type: 'sticker', content: '🇰🇷', label: '한국',   x: 82, y: 8,  rotation: 6,   size: 'lg' },
  { id: 'eg-gb', type: 'sticker', content: '🇬🇧', label: 'UK',     x: 55, y: 72, rotation: -4,  size: 'md' },
  { id: 'eg-us', type: 'sticker', content: '🇺🇸', label: 'DC',     x: 18, y: 68, rotation: 5,   size: 'md' },
  { id: 'eg-n1', type: 'prewritten', content: "if you found this\nyou're curious enough\n— that's good", x: 72, y: 35, rotation: -6, bg: '#F5F2EC' },
  { id: 'eg-n2', type: 'prewritten', content: 'Tema → DC\nquite the journey',                           x: 35, y: 15, rotation: 3,  bg: '#fff'    },
  { id: 'eg-n3', type: 'prewritten', content: '글씨를 쓰다\n그림을 그리다\n음악을 만들다',               x: 6,  y: 38, rotation: -3, bg: '#fff'    },
];

function StickyNote({ note, onDragEnd }) {
  const ref = useRef(null);
  const drag = useRef(null);

  function onMouseDown(e) {
    e.preventDefault();
    drag.current = { startX: e.clientX, startY: e.clientY, origX: note.x, origY: note.y };
    ref.current.style.zIndex = 1000;

    function onMove(e) {
      if (!drag.current) return;
      const dx = ((e.clientX - drag.current.startX) / window.innerWidth) * 100;
      const dy = ((e.clientY - drag.current.startY) / window.innerHeight) * 100;
      ref.current.style.left = Math.max(0, Math.min(88, drag.current.origX + dx)) + '%';
      ref.current.style.top  = Math.max(0, Math.min(82, drag.current.origY + dy)) + '%';
    }
    function onUp(e) {
      if (!drag.current) return;
      const dx = ((e.clientX - drag.current.startX) / window.innerWidth) * 100;
      const dy = ((e.clientY - drag.current.startY) / window.innerHeight) * 100;
      onDragEnd(note.id,
        Math.max(0, Math.min(88, drag.current.origX + dx)),
        Math.max(0, Math.min(82, drag.current.origY + dy))
      );
      ref.current.style.zIndex = 10;
      drag.current = null;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    }
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }

  if (note.type === 'sticker') {
    return (
      <div ref={ref} className={`sticker sticker-${note.size}`}
        style={{ left: note.x + '%', top: note.y + '%', transform: `rotate(${note.rotation}deg)` }}
        onMouseDown={onMouseDown}>
        <span className="sticker-flag">{note.content}</span>
        <span className="sticker-label">{note.label}</span>
      </div>
    );
  }
  return (
    <div ref={ref}
      className={`sticky-note ${note.type === 'prewritten' ? 'prewritten' : ''}`}
      style={{ left: note.x + '%', top: note.y + '%', transform: `rotate(${note.rotation || 0}deg)`, background: note.bg || '#fff' }}
      onMouseDown={onMouseDown}>
      <div className="note-content">{note.content}</div>
      {note.author && <div className="note-author">— {note.author}</div>}
    </div>
  );
}

function StickyBoard({ onClose }) {
  const boardRef = useRef(null);
  const [notes, setNotes] = useState([]);
  const [eggPos, setEggPos] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [msg, setMsg] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    gsap.fromTo(boardRef.current,
      { x: '100%' },
      { x: '0%', duration: 0.6, ease: 'power3.out' }
    );
    function onKey(e) { if (e.key === 'Escape') handleClose(); }
    window.addEventListener('keydown', onKey);
    loadNotes();
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  async function loadNotes() {
    try {
      setLoading(true);
      const data = await dbFetch('notes?select=*&order=created_at.asc');
      setNotes(data || []);
    } catch { setErr('could not load notes_'); }
    finally { setLoading(false); }
  }

  function handleClose() {
    gsap.to(boardRef.current, { x: '100%', duration: 0.5, ease: 'power3.in', onComplete: onClose });
  }

  async function addNote() {
    if (!msg.trim() || !name.trim()) return;
    setPosting(true);
    try {
      const note = {
        content: msg.trim(), author: name.trim(),
        x: 20 + Math.random() * 45, y: 20 + Math.random() * 45,
        rotation: Math.random() * 16 - 8,
        bg: Math.random() > 0.5 ? '#ffffff' : '#F5F2EC',
      };
      const res = await dbFetch('notes', { method: 'POST', body: JSON.stringify(note) });
      if (res) setNotes(p => [...p, Array.isArray(res) ? res[0] : res]);
      setMsg(''); setName(''); setShowForm(false);
    } catch { setErr('could not post — try again_'); }
    finally { setPosting(false); }
  }

  async function handleDragEnd(id, x, y) {
    if (EASTER_EGGS.find(e => e.id === id)) {
      setEggPos(p => ({ ...p, [id]: { x, y } }));
      return;
    }
    setNotes(p => p.map(n => n.id === id ? { ...n, x, y } : n));
    try { await dbFetch(`notes?id=eq.${id}`, { method: 'PATCH', body: JSON.stringify({ x, y }) }); } catch {}
  }

  const eggs = EASTER_EGGS.map(e => ({ ...e, ...(eggPos[e.id] || {}) }));

  return (
    <div ref={boardRef} className="board-overlay" style={{ transform: 'translateX(100%)' }}>
      <div className="board-header">
        <div className="board-header-left">
          <span className="board-title">poster_board</span>
          <span className="board-sub">a public wall · leave something behind</span>
        </div>
        <div className="board-header-right">
          <span className="board-count">{notes.length} notes_</span>
          <button className="board-add-btn" onClick={() => setShowForm(s => !s)}>
            {showForm ? '× cancel_' : '+ add note_'}
          </button>
          <button className="board-close" onClick={handleClose}>✕ esc_</button>
        </div>
      </div>

      {showForm && (
        <div className="board-form">
          <div className="board-form-inner">
            {err && <div className="board-error">{err}</div>}
            <textarea className="board-form-msg" placeholder="say something..."
              value={msg} onChange={e => setMsg(e.target.value)} maxLength={200} autoFocus rows={4} />
            <div className="board-form-bottom">
              <input className="board-form-name" placeholder="your name_"
                value={name} onChange={e => setName(e.target.value)} maxLength={40}
                onKeyDown={e => e.key === 'Enter' && addNote()} />
              <button className="board-form-submit" onClick={addNote}
                disabled={!msg.trim() || !name.trim() || posting}>
                {posting ? 'posting...' : 'post it_ →'}
              </button>
            </div>
            <div className="board-form-hint">visible to everyone · drag to place after posting</div>
          </div>
        </div>
      )}

      <div className="board-canvas">
        <div className="board-grid" />
        {loading && <div className="board-loading">loading notes_</div>}
        {eggs.map(n => <StickyNote key={n.id} note={n} onDragEnd={handleDragEnd} />)}
        {notes.map(n => <StickyNote key={n.id} note={n} onDragEnd={handleDragEnd} />)}
        <div className="board-corner board-corner-tl">maehlo · poster board</div>
        <div className="board-corner board-corner-tr">drag to rearrange_</div>
        <div className="board-corner board-corner-bl">38.9°N 77.0°W</div>
        <div className="board-corner board-corner-br">Tema → DC</div>
      </div>

      <div className="board-footer">
        <span>shared public board · supabase_</span>
        <span>malvinboye@gmail.com</span>
        <span>esc to close_</span>
      </div>
    </div>
  );
}

//cursor media that follows the mouse and shows project images on hover
function CursorMedia({ img, visible }) {
  const ref = useRef(null);
  const mouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const pos   = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const raf   = useRef(null);

  useEffect(() => {
    function onMove(e) { mouse.current = { x: e.clientX, y: e.clientY }; }
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useEffect(() => {
    function loop() {
      pos.current.x += (mouse.current.x - pos.current.x) * 0.1;
      pos.current.y += (mouse.current.y - pos.current.y) * 0.1;
      if (ref.current) {
        ref.current.style.left = pos.current.x + 'px';
        ref.current.style.top  = pos.current.y + 'px';
      }
      raf.current = requestAnimationFrame(loop);
    }
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  useEffect(() => {
    if (!ref.current) return;
    gsap.to(ref.current, { opacity: visible ? 1 : 0, scale: visible ? 1 : 0.88, duration: visible ? 0.3 : 0.18 });
  }, [visible]);

  return (
    <div ref={ref} className="cursor-media">
      {img ? <img src={img} alt="" className="cursor-media-img" /> : <div className="cursor-media-placeholder" />}
    </div>
  );
}

// featured projects list on the main page
const FEATURED = [
  { id: '001', title: 'Manageable', category: 'Design Engineering · Product', year: '2025', img: null },
  { id: '002', title: 'DormDrop',   category: 'UI/UX · Frontend',             year: '2024', img: null },
  { id: '003', title: 'Connect',    category: 'Full-Stack · Ethical Design',  year: '2026', img: null },
  { id: '004', title: 'EV Mart POS',category: 'UX Research · Systems',        year: '2022', img: null },
  { id: '005', title: 'Kase',       category: 'AI · Language · UX',           year: '2024', img: null },
];

function FeaturedProjects({ onNavigate }) {
  const [hovered, setHovered] = useState(null);
  const headerRef = useRef(null);
  useReveal(headerRef, { y: 24, duration: 0.6 });

  const hoveredProject = FEATURED.find(p => p.id === hovered);

  return (
    <section className="featured-section">
      <CursorMedia img={hoveredProject?.img} visible={!!hovered} />

      <div className="featured-header" ref={headerRef} style={{ opacity: 0 }}>
        <span className="featured-label">selected work_</span>
        <button className="featured-all" onClick={onNavigate}>view all →</button>
      </div>

      <ul className="featured-list">
        {FEATURED.map((p, i) => {
          const rowRef = useRef(null);
          useEffect(() => {
            if (!rowRef.current) return;
            gsap.fromTo(rowRef.current,
              { opacity: 0, x: -18 },
              { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out',
                scrollTrigger: { trigger: rowRef.current, start: 'top 88%' } }
            );
          }, []);
          return (
            <li key={p.id} ref={rowRef}
              className={`featured-row ${hovered === p.id ? 'hovered' : ''}`}
              style={{ opacity: 0 }}
              onMouseEnter={() => setHovered(p.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={onNavigate}>
              <span className="f-id">{p.id}</span>
              <span className="f-title">{p.title}</span>
              <span className="f-category">{p.category}</span>
              <span className="f-year">{p.year}</span>
              <span className="f-arrow">→</span>
              <div className="f-line" />
            </li>
          );
        })}
      </ul>
    </section>
  );
}

// main site component that brings everything together
export default function MainSite() {
  const navigate = useNavigate();
  const [showBoard, setShowBoard] = useState(false);
  const { transitionTo, Curtain } = usePageTransition();

  const handlePosterTrigger = useCallback(() => setShowBoard(true), []);
  function goToProjects() { transitionTo(() => navigate('/projects')); }

  // Section refs for scroll reveal
  const statementRef  = useRef(null);
  const originRef     = useRef(null);
  const bioRef        = useRef(null);
  const interestsRef  = useRef(null);
  const langRef       = useRef(null);
  const quoteRef      = useRef(null);
  const ytRef         = useRef(null);
  const contactRef    = useRef(null);

  useReveal(statementRef,  { y: 50, duration: 1 });
  useReveal(originRef,     { y: 30 });
  useReveal(bioRef,        { y: 30, duration: 0.9 });
  useReveal(interestsRef,  { y: 40 });
  useReveal(langRef,       { y: 30 });
  useReveal(quoteRef,      { y: 60, duration: 1.1 });
  useReveal(ytRef,         { y: 30 });
  useReveal(contactRef,    { y: 40 });

  return (
    <div className="main-site">
      <Curtain />
      {showBoard && <StickyBoard onClose={() => setShowBoard(false)} />}

      {/* TOP BAR */}
      <header className="top-bar">
        <div className="top-bar-left">
          <span className="top-dot">●</span>
          <span>Washington, DC</span>
          <span><LiveClock /></span>
          <span className="top-coords">38.9°N 77.0°W</span>
        </div>
        <nav className="top-nav">
          <button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>about_</button>
          <button onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}>work_</button>
          <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>contact_</button>
        </nav>
      </header>

      {/* HERO */}
      <TypewriterHero onPosterTrigger={handlePosterTrigger} />

      {/* STATEMENT */}
      <section className="statement-section" id="about">
        <div ref={statementRef} className="statement-text" style={{ opacity: 0 }}>
          <span className="statement-line">Life.</span>
          <span className="statement-line">People.</span>
          <span className="statement-line">Art.</span>
        </div>
        <p className="statement-sub">— me and my interest in a nutshell</p>
      </section>

      {/* ORIGIN */}
      <section className="origin-section">
        <div ref={originRef} className="origin-inner" style={{ opacity: 0 }}>
          <div className="origin-label">origin_</div>
          <div className="origin-text">
            <span className="origin-place">Tema, Ghana</span>
            <span className="origin-arrow">→</span>
            <span className="origin-place">Washington DC</span>
          </div>
          <p className="origin-sub">Raised in different places. Tema would always be home.</p>
        </div>
      </section>

      {/* BIO */}
      <section className="bio-section">
        <div ref={bioRef} className="bio-inner" style={{ opacity: 0 }}>
          <div className="bio-num">01_</div>
          <div className="bio-content">
            <p className="bio-text">Someone who loves people, loves new experiences, and loves being put outside of his comfort zone to get to know even smallest spec of knowledge.</p>
            <p className="bio-text">I love to call myself a creative....started drawing around age three and got into playing a couple instruments around that time. Art is just something that has been with me from the beginning.</p>
            <p className="bio-text">Now building things that sit at the edge of design and engineering. Making work that feels like something rather than just functioning.</p>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div ref={interestsRef} style={{ opacity: 0 }}>
        <Marquee dark items={['Drawing','Poetry','Music','Piano','Drums','Film','Videography','Cinematography','Languages','Korean Cinema','Architecture','Motion Design']} />
      </div>

      {/* LANGUAGE */}
      <section className="lang-section">
        <div ref={langRef} className="lang-inner" style={{ opacity: 0 }}>
          <div className="lang-label">languages_</div>
          <div className="lang-list">
            <div className="lang-item">
              <span className="lang-name">English</span>
              <span className="lang-note">native</span>
            </div>
            <div className="lang-item">
              <span className="lang-name">한국어</span>
              <span className="lang-note">fluent(conversational) — self-taught through cinema</span>
            </div>
            <div className="lang-item">
              <span className="lang-name">Spanish, French</span>
              <span className="lang-note">fluency---- yeah still in progress on these ones</span>
            </div>
          </div>
          <p className="lang-story">Funny enough took french basically my entire life, but cant speak it to save my life</p>
        </div>
      </section>

      {/* QUOTE */}
      <section className="quote-section">
        <div ref={quoteRef} className="quote-inner" style={{ opacity: 0 }}>
          <div className="quote-mark">"</div>
          <p className="quote-text">Embarrassment is an underexplored emotion.</p>
          <div className="quote-attr">—unknown(my favourite quote)</div>
        </div>
      </section>

      {/* YOUTUBE */}
      <section className="yt-section">
        <div ref={ytRef} className="yt-inner" style={{ opacity: 0 }}>
          <div className="yt-label">youtube_</div>
          <div className="yt-content">
            <p className="yt-desc">A public gallery. Life and progress documented with a twist. Everything is spoken in a language I recently found myself immersed in.</p>
            <a href="https://youtube.com/@maehlo" target="_blank" rel="noopener noreferrer" className="yt-link">youtube.com/@maehlo ↗</a>
          </div>
        </div>
      </section>

      {/* WORK */}
      <section id="work" className="work-section">
        <FeaturedProjects onNavigate={goToProjects} />
      </section>

      {/* CONTACT */}
      <section id="contact" className="contact-section">
        <div ref={contactRef} className="contact-inner" style={{ opacity: 0 }}>
          <div className="contact-label">let's talk_</div>
          <a href="mailto:malvinboye@gmail.com" className="contact-email">malvinboye@gmail.com</a>
          <div className="contact-links">
            <a href="https://youtube.com/@maehlo" target="_blank" rel="noopener noreferrer">YouTube ↗</a>
            <a href="https://instagram.com/pseudo.sq" target="_blank" rel="noopener noreferrer">Instagram ↗</a>
            <a href="https://github.com/MalvinBoye" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
          </div>
          <p className="contact-note">Open to internships, collaborations, and interesting problems. Based in Washington DC.</p>
        </div>
        <div className="contact-footer">
          <span>Malvin Boye © 2026</span>
          <span>Circée · maehlo.com</span>
          <span>38.9°N 77.0°W</span>
        </div>
      </section>
    </div>
  );
}
