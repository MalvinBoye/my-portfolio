import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './MainSite.css';
import { css, GRAIN } from '../utils/cssString';
import bagJala from '../images/bag-jala.png';
import maableDashboard from '../images/maable-dashboard.png';
import dormdrop1 from '../images/dormdrop-1.png';
import connect1 from '../images/connect-1.png';

// supabase — same backend/table the poster board has always used, so notes
// left by visitors on the previous design survive this redesign.
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

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// live clock — HH:MM:SS, 24h, America/New_York
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

// marquee — duplicated list, CSS transform loop, paused under reduced motion
const MARQUEE_ITEMS = ['Drawing', 'Poetry', 'Music', 'Piano', 'Drums', 'Film', 'Videography', 'Cinematography', 'Languages', 'Korean Cinema', 'Architecture', 'Motion Design'];

function Marquee() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="ms-marquee">
      <div className="ms-marquee-track">
        {items.map((t, i) => (
          <span key={i} className="ms-marquee-item">{t}<span className="ms-marquee-dot">·</span></span>
        ))}
      </div>
    </div>
  );
}

// typewriter hero name — Malvin → Mallock → Maelo
const NAMES = ['Malvin', 'Mallock', 'Maelo'];

function useTypewriter() {
  const [typed, setTyped] = useState(() => prefersReducedMotion() ? NAMES[NAMES.length - 1] : '');
  const nameIndex = useRef(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    function step(i = 0, deleting = false) {
      const name = NAMES[nameIndex.current];
      if (!deleting && i <= name.length) {
        setTyped(name.slice(0, i));
        timeoutRef.current = setTimeout(() => step(i + 1, false), 95);
      } else if (!deleting) {
        timeoutRef.current = setTimeout(() => step(name.length, true), 1400);
      } else if (i > 0) {
        setTyped(name.slice(0, i - 1));
        timeoutRef.current = setTimeout(() => step(i - 1, true), 52);
      } else {
        nameIndex.current = (nameIndex.current + 1) % NAMES.length;
        step(0, false);
      }
    }
    step(0, false);
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return typed;
}

// poster board — four decorative seed notes (client-only, matches the
// handoff's SEED array) plus live public notes backed by Supabase.
const SEED_NOTES = [
  { id: 'n1', content: "if you found this\nyou're curious enough\n— that's good", author: 'maelo', x: 62, y: 18, r: -6 },
  { id: 'n2', content: 'Tema → DC\nquite the journey', author: 'maelo', x: 20, y: 12, r: 3 },
  { id: 'n3', content: '글씨를 쓰다\n그림을 그리다\n음악을 만들다', author: 'maelo', x: 8, y: 52, r: -3 },
  { id: 'n4', content: 'embarrassment is an\nunderexplored emotion', author: 'unknown', x: 44, y: 58, r: 5 },
];

function PosterNote({ id, content, author, x, y, r, onDragEnd }) {
  const ref = useRef(null);

  function onMouseDown(e) {
    e.preventDefault();
    const box = ref.current.parentElement.getBoundingClientRect();
    ref.current.style.zIndex = 50;
    function move(ev) {
      const nx = Math.max(0, Math.min(84, ((ev.clientX - box.left) / box.width) * 100 - 6));
      const ny = Math.max(0, Math.min(76, ((ev.clientY - box.top) / box.height) * 100 - 4));
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

  function seedDragEnd(id, x, y) {
    setSeedPos(p => ({ ...p, [id]: { x, y } }));
  }

  async function liveDragEnd(id, x, y) {
    setNotes(p => p.map(n => n.id === id ? { ...n, x, y } : n));
    try { await dbFetch(`notes?id=eq.${id}`, { method: 'PATCH', body: JSON.stringify({ x, y }) }); } catch { /* best effort */ }
  }

  async function addNote() {
    const content = draft.trim();
    if (!content || posting) return;
    setPosting(true);
    try {
      const note = {
        content, author: who.trim() || 'anon',
        x: 24 + Math.random() * 42, y: 20 + Math.random() * 42,
        rotation: Math.random() * 12 - 6,
      };
      const res = await dbFetch('notes', { method: 'POST', body: JSON.stringify(note) });
      if (res) setNotes(p => [...p, Array.isArray(res) ? res[0] : res]);
      setDraft(''); setWho('');
    } catch { /* leave draft in place so the visitor can retry */ }
    finally { setPosting(false); }
  }

  return (
    <div className="ms-board">
      <div className="ms-board-header">
        <span className="ms-board-title">POSTER_BOARD — A PUBLIC WALL · LEAVE SOMETHING BEHIND</span>
        <span className="ms-board-close" onClick={onClose}>✕ ESC_</span>
      </div>
      <div className="ms-board-canvas">
        {SEED_NOTES.map(n => (
          <PosterNote key={n.id} {...{ ...n, ...(seedPos[n.id] || {}) }} onDragEnd={seedDragEnd} />
        ))}
        {notes.map(n => (
          <PosterNote key={n.id} id={n.id} content={n.content} author={n.author} x={n.x} y={n.y} r={n.rotation} onDragEnd={liveDragEnd} />
        ))}
        <div className="ms-board-corner">TEMA → DC · DRAG TO REARRANGE_</div>
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

// selected work
const WORK = [
  { id: '001', title: 'Stuff', cat: 'ADHD grocery app · research → UI → the whole file', year: '2026', href: '/work/stuff', img: bagJala, cap: 'a grocery app for a brain that wanders' },
  { id: '002', title: 'Maable', cat: 'Design Engineering · Product · live', year: '2026', href: '/work/maable', img: maableDashboard, cap: 'productivity that pays you back' },
  { id: '003', title: 'DormDrop', cat: 'UI/UX · Frontend', year: '2024', href: null, img: dormdrop1, cap: 'campus delivery, minus the chaos' },
  { id: '004', title: 'Connect', cat: 'Full-Stack · Ethical Design', year: '2026', href: null, img: connect1, cap: 'social, with a conscience' },
  { id: '005', title: 'EV Mart POS', cat: 'UX Research · Systems', year: '2022', href: '/work/ev-mart', img: null, cap: 'a till that cashiers stopped cursing at' },
];

const kicker = css("font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.24em;color:rgba(32,31,29,.5)");
const kickerDark = css("font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.24em;color:#b68235");

export default function MainSite() {
  const [boardOpen, setBoardOpen] = useState(false);
  const [hoverId, setHoverId] = useState(null);
  const typed = useTypewriter();
  const keysRef = useRef('');

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') { setBoardOpen(false); return; }
      if (e.key && e.key.length === 1) {
        keysRef.current = (keysRef.current + e.key.toLowerCase()).slice(-6);
        if (keysRef.current === 'poster') setBoardOpen(true);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const hovered = WORK.find(p => p.id === hoverId);

  return (
    <div className="main-site" style={{ position: 'relative', minHeight: '100vh', background: '#efece4', backgroundImage: GRAIN, backgroundBlendMode: 'multiply' }}>

      {/* TOP BAR */}
      <div className="ms-topbar">
        <div className="ms-topbar-left">
          <span style={{ color: '#c8402c' }}>●</span><span>WASHINGTON, DC</span><span><LiveClock /></span>
          <span className="ms-topbar-coords">38.9°N 77.0°W</span>
        </div>
        <div className="ms-topbar-right">
          <a href="#about">about_</a><a href="#work">work_</a><a href="#contact">contact_</a>
        </div>
      </div>

      {/* HERO */}
      <section style={css("min-height:100vh;display:grid;grid-template-columns:1fr;align-content:center;gap:0;padding:120px 7vw 60px;position:relative")}>
        <div style={css("display:flex;align-items:baseline;gap:14px;font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.22em;color:rgba(32,31,29,.5);text-transform:uppercase")}>
          <span>Session #01</span><span style={{ flex: 1, height: 1, background: 'rgba(32,31,29,.2)' }}></span><span>see you space cowboy…</span>
        </div>
        <h1 style={css("margin:26px 0 0;font:300 clamp(58px,10.5vw,148px)/.92 'Cormorant Garamond',serif;letter-spacing:-.015em")}>
          <span style={css("display:block;font:400 clamp(16px,1.6vw,20px)/1 'Lora',serif;letter-spacing:.02em;color:rgba(32,31,29,.6);margin-bottom:14px")}>Hi, I'm</span>
          <span>{typed}</span><span className="ms-caret">_</span>
          <span style={{ display: 'block', color: 'rgba(32,31,29,.42)' }}>Boye</span>
        </h1>
        <div style={css("display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-top:34px")}>
          <span style={css("font:400 12px/1 ui-monospace,Menlo,monospace;letter-spacing:.14em;text-transform:uppercase;padding:8px 12px;border:1px solid rgba(32,31,29,.28);border-radius:4px")}>Design Engineer</span>
          <span style={css("font:400 12px/1 ui-monospace,Menlo,monospace;letter-spacing:.14em;text-transform:uppercase;padding:8px 12px;border:1px solid rgba(32,31,29,.28);border-radius:4px")}>Artist</span>
          <span style={css("font:400 12px/1 ui-monospace,Menlo,monospace;letter-spacing:.14em;text-transform:uppercase;padding:8px 12px;border:1px solid rgba(32,31,29,.28);border-radius:4px")}>Creative</span>
          <span style={css("font:400 22px/1 'Caveat',cursive;color:#8a6224;margin-left:6px")}>…and whatever this week demands</span>
        </div>
        <div className="ms-poster-prompt" onClick={() => setBoardOpen(true)}
          style={css("cursor:pointer;margin-top:46px;display:inline-flex;align-items:center;gap:10px;font:400 12px/1 ui-monospace,Menlo,monospace;letter-spacing:.1em;color:rgba(32,31,29,.55);width:fit-content")}>
          <span>type "poster" anywhere, or click here</span><span>→</span>
        </div>
        <div style={css("position:absolute;left:7vw;bottom:34px;font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.2em;color:rgba(32,31,29,.4)")}>SCROLL_</div>
      </section>

      {/* LIFE PEOPLE ART */}
      <section id="about" style={css("border-top:1px solid rgba(32,31,29,.14);padding:96px 7vw;display:grid;grid-template-columns:minmax(0,1fr);gap:12px")}>
        <div style={css("display:flex;flex-wrap:wrap;align-items:baseline;gap:clamp(20px,5vw,72px);font:300 clamp(52px,9vw,124px)/1 'Cormorant Garamond',serif")}>
          <span>Life.</span><span>People.</span><span style={{ color: '#c8402c' }}>Art.</span>
        </div>
        <p style={css("margin:8px 0 0;font:400 24px/1.3 'Caveat',cursive;color:rgba(32,31,29,.6)")}>— me and my interests in a nutshell</p>
      </section>

      {/* ORIGIN */}
      <section style={css("position:relative;background:#14130f;color:#efece4;padding:88px 7vw;overflow:hidden")}>
        <div style={css("position:absolute;right:4vw;top:-24px;font:300 260px/1 'Cormorant Garamond',serif;color:rgba(182,130,53,.14);font-variant-numeric:tabular-nums;pointer-events:none")}>01</div>
        <div style={{ position: 'relative', ...kickerDark }}>ORIGIN_</div>
        <div style={css("position:relative;display:flex;flex-wrap:wrap;align-items:baseline;gap:22px;margin-top:20px;font:300 clamp(38px,6.4vw,86px)/1.05 'Cormorant Garamond',serif")}>
          <span>Tema, Ghana</span><span style={{ color: '#b68235' }}>→</span><span>Washington DC</span>
        </div>
        <p style={css("max-width:52ch;margin:24px 0 0;font:400 17px/1.7 'Lora',serif;color:rgba(239,236,228,.72)")}>Raised in a few different places. Tema would always be home.</p>
      </section>

      {/* THE PERSON */}
      <section style={css("padding:96px 7vw;border-bottom:1px solid rgba(32,31,29,.14)")}>
        <div className="ms-person-grid">
          <div className="ms-person-label" style={css("font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.24em;color:rgba(32,31,29,.5)")}>02_ THE PERSON</div>
          <div style={css("display:grid;gap:22px;max-width:62ch")}>
            <p style={css("margin:0;font:400 clamp(19px,2vw,23px)/1.65 'Lora',serif;text-align:justify;text-wrap:pretty")}>Someone who loves people, loves new experiences, and loves being put outside his comfort zone for the smallest speck of knowledge.</p>
            <p style={css("margin:0;font:400 17px/1.75 'Lora',serif;text-align:justify;color:rgba(32,31,29,.82);text-wrap:pretty")}>I call myself a creative and I have the receipts: started drawing around age three, picked up a couple of instruments not long after. Art has been sitting next to me the whole time, occasionally earning its keep.</p>
            <p style={css("margin:0;font:400 17px/1.75 'Lora',serif;text-align:justify;color:rgba(32,31,29,.82);text-wrap:pretty")}>Now I build things at the edge of design and engineering — work that feels like something rather than merely functioning. Research, interface, motion, and the odd hand-drawn asset when a stock icon would be a lie.</p>
            <div style={css("display:flex;gap:14px;align-items:flex-start;padding-top:6px")}>
              <span style={{ flex: 'none', width: 34, height: 1, background: '#b68235', marginTop: 16 }}></span>
              <span style={css("font:400 23px/1.35 'Caveat',cursive;color:#8a6224")}>the drawings on this site are mine. so, likely, are the typos.</span>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <Marquee />

      {/* SELECTED WORK */}
      <section id="work" style={css("padding:96px 7vw 40px")}>
        <div style={css("display:flex;align-items:baseline;justify-content:space-between;gap:20px;border-bottom:1px solid rgba(32,31,29,.2);padding-bottom:14px")}>
          <span style={kicker}>SELECTED WORK_</span>
          <span style={css("font:400 20px/1 'Caveat',cursive;color:rgba(32,31,29,.5)")}>hover for a peek</span>
        </div>
        <div style={{ display: 'grid' }}>
          {WORK.map(p => {
            const rowProps = {
              onMouseEnter: () => setHoverId(p.id),
              onMouseLeave: () => setHoverId(null),
              className: `ms-work-row${p.href ? '' : ' ms-work-row-stub'}`,
            };
            const inner = (
              <>
                <span className="ms-work-id">{p.id}</span>
                <span className="ms-work-title">{p.title}</span>
                <span className="ms-work-cat">{p.cat}</span>
                <span className="ms-work-year">{p.year}</span>
                <span className="ms-work-arrow">{p.href ? '→' : '·'}</span>
              </>
            );
            return p.href
              ? <Link key={p.id} to={p.href} {...rowProps}>{inner}</Link>
              : <div key={p.id} {...rowProps}>{inner}</div>;
          })}
        </div>
        <p style={css("margin:18px 0 0;font:400 21px/1.4 'Caveat',cursive;color:rgba(32,31,29,.55)")}>Stuff has the whole working file attached — research, screens, dead ends and all. Maable is live; go put it to the test.</p>
      </section>

      {/* LANGUAGES */}
      <section style={css("background:#14130f;color:#efece4;padding:92px 7vw;display:grid;gap:34px")}>
        <div style={kickerDark}>LANGUAGES_</div>
        <div style={{ display: 'grid', gap: 0 }}>
          <div className="ms-lang-row">
            <span style={css("font:300 clamp(30px,4vw,52px)/1 'Cormorant Garamond',serif")}>English</span>
            <span style={css("font:400 15px/1.4 'Lora',serif;color:rgba(239,236,228,.6)")}>native</span>
          </div>
          <div className="ms-lang-row">
            <span style={css("font:300 clamp(30px,4vw,52px)/1 'Cormorant Garamond',serif")}>한국어</span>
            <span style={css("font:400 15px/1.4 'Lora',serif;color:rgba(239,236,228,.6)")}>conversational — self-taught through cinema</span>
          </div>
          <div className="ms-lang-row" style={{ borderBottom: 'none' }}>
            <span style={css("font:300 clamp(30px,4vw,52px)/1 'Cormorant Garamond',serif")}>Spanish, French</span>
            <span style={css("font:400 15px/1.4 'Lora',serif;color:rgba(239,236,228,.6)")}>in progress, indefinitely</span>
          </div>
        </div>
        <p style={css("margin:0;font:400 24px/1.4 'Caveat',cursive;color:#b68235")}>took French for most of my life and still can't speak it to save my life.</p>
      </section>

      {/* QUOTE */}
      <section style={css("padding:110px 7vw;display:grid;justify-items:center;text-align:center;gap:14px")}>
        <div style={css("font:300 92px/1 'Cormorant Garamond',serif;color:#b68235")}>&ldquo;</div>
        <p style={css("margin:0;max-width:20ch;font:300 clamp(36px,5.4vw,72px)/1.12 'Cormorant Garamond',serif;text-wrap:balance")}>Embarrassment is an underexplored emotion.</p>
        <div style={css("font:400 13px/1 ui-monospace,Menlo,monospace;letter-spacing:.14em;color:rgba(32,31,29,.5)")}>— UNKNOWN (MY FAVOURITE)</div>
      </section>

      {/* YOUTUBE */}
      <section style={css("padding:0 7vw 96px")}>
        <div className="ms-yt-card">
          <div style={{ display: 'grid', gap: 12 }}>
            <span style={kicker}>YOUTUBE_</span>
            <p style={css("margin:0;font:400 17px/1.7 'Lora',serif;color:rgba(32,31,29,.82);max-width:46ch;text-wrap:pretty")}>A public gallery. Life and progress documented with a twist — spoken entirely in a language I recently threw myself into.</p>
          </div>
          <a href="https://youtube.com/@maehlo" target="_blank" rel="noopener noreferrer"
            style={css("justify-self:start;font:300 clamp(28px,3.6vw,44px)/1 'Cormorant Garamond',serif;border-bottom:1px solid #b68235;padding-bottom:6px")}>youtube.com/@maehlo ↗</a>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={css("background:#14130f;color:#efece4;padding:100px 7vw 34px;display:grid;gap:26px")}>
        <div style={kickerDark}>LET'S TALK_</div>
        <a href="mailto:malvinboye@gmail.com" className="ms-email"
          style={css("font:300 clamp(34px,6.6vw,92px)/1 'Cormorant Garamond',serif;color:#efece4;border-bottom:1px solid rgba(182,130,53,.6);padding-bottom:10px;justify-self:start")}>malvinboye@gmail.com</a>
        <div style={css("display:flex;flex-wrap:wrap;gap:26px;font:400 12px/1 ui-monospace,Menlo,monospace;letter-spacing:.12em")}>
          <a href="https://youtube.com/@maehlo" target="_blank" rel="noopener noreferrer" className="ms-social">YOUTUBE ↗</a>
          <a href="https://instagram.com/pseudo.sq" target="_blank" rel="noopener noreferrer" className="ms-social">INSTAGRAM ↗</a>
          <a href="https://github.com/MalvinBoye" target="_blank" rel="noopener noreferrer" className="ms-social">GITHUB ↗</a>
        </div>
        <p style={css("margin:0;max-width:54ch;font:400 16px/1.7 'Lora',serif;color:rgba(239,236,228,.66)")}>Open to internships, collaborations, and problems that don't have an obvious shape yet. Based in Washington DC.</p>
        <div style={css("display:flex;flex-wrap:wrap;justify-content:space-between;gap:16px;border-top:1px solid rgba(239,236,228,.18);padding-top:18px;margin-top:40px;font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.12em;color:rgba(239,236,228,.45)")}>
          <span>MALVIN BOYE © 2026</span><span>SEE YOU SPACE COWBOY…</span><span>MAEHLO.COM</span>
        </div>
      </section>

      {/* HOVER PREVIEW */}
      {hovered && hovered.img && (
        <div className="ms-hover-preview">
          <div style={{ display: 'block', width: 300, height: 200, background: `#e6e2d8 url(${hovered.img}) center/cover no-repeat`, filter: 'sepia(.14)' }}></div>
          <div style={css("font:400 19px/1.2 'Caveat',cursive;color:rgba(32,31,29,.6);padding-top:8px")}>{hovered.cap}</div>
        </div>
      )}

      {/* POSTER BOARD */}
      {boardOpen && <PosterBoard onClose={() => setBoardOpen(false)} />}

    </div>
  );
}
