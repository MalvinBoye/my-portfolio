import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import './ProjectsPage.css';

// page transition
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

//Images
import manageable1 from '../images/manageable-1.png';
import manageable2 from '../images/manageable-2.png';
import manageable3 from '../images/manageable-3.png';
import dormdrop1 from '../images/dormdrop-1.png';
import dormdrop2 from '../images/dormdrop-2.png';
import dormdrop3 from '../images/dormdrop-3.png';
import connect1 from '../images/connect-1.png';

//my projects data hard coded for now 
const PROJECTS = [
  {
    id: '001', title: 'Manageable',
    category: 'Design Engineering · Product',
    tags: ['React', 'Node.js', 'Canvas API', 'Motion Design'],
    filter: 'creative', role: 'Interaction Design · Motion System · UI Lead',
    year: '2025', team: 'Malvin Boye, Yuri, Kimberly',
    context: '3-person team · CS Capstone · American University',
    description: `Manageable is a student-optimized productivity ecosystem that bridges the gap between task managers and learning tools. Built to address a specific gap: students needed intelligent prioritization, integrated study support, and behavioral motivation in one platform — not three separate apps.`,
    process: `Led the full interaction design, motion system, and flow architecture. Co-created an adaptive decision-support algorithm that analyzes deadlines, task weights, and personal preferences to surface the next best action. Designed the Lock-In Mode distraction-free focus system and the automatic note-to-flashcard conversion pipeline.`,
    outcomes: [
      '90% of 15 student testers reported improved clarity, focus, and reduced decision fatigue',
      'Flashcard system automated Q&A generation from raw notes using custom JS structural parser',
      'Canvas API integration automated assignment tracking across all enrolled courses',
      'Lock-In Mode adopted as primary focus tool — distraction-free with progress tracking',
    ],
    tools: ['React', 'Node.js', 'Canvas API', 'Flask', 'JavaScript', 'Figma', 'Motion Design'],
    link: null, img: null, images: [manageable1, manageable2, manageable3],
  },
  {
    id: '002', title: 'DormDrop',
    category: 'UI/UX · Frontend Engineering',
    tags: ['React', 'Node.js', 'Auth', 'UX Research'],
    filter: 'creative', role: 'UX Flow Design · React Frontend · Information Architecture',
    year: '2024', team: 'Malvin Boye + team',
    context: 'Team project · American University',
    description: `A secure peer-to-peer marketplace built exclusively for verified American University students. The core design challenge was building trust in a commerce platform between strangers who share a campus — verified .edu authentication was the structural solution.`,
    process: `Led complete UX flow design, user journey mapping, and information architecture across posting, browsing, and messaging flows. Built the React.js frontend and collaborated with teammates on API integration, real-time messaging, and filtering systems.`,
    outcomes: [
      'Verified .edu authentication eliminated anonymous listing risk entirely',
      'Category filtering reduced browse time significantly',
      'Seller/buyer messaging flow kept all transactions within the verified platform',
      'Responsive layout works across all devices without a native app',
    ],
    tools: ['React', 'Node.js', 'Figma', 'Git', 'REST API', 'Authentication'],
    link: null, img: null, images: [dormdrop1, dormdrop2, dormdrop3],
  },
  {
    id: '003', title: 'Connect',
    category: 'Full-Stack · Ethical Product Design',
    tags: ['React', 'TypeScript', 'Supabase', 'Vercel'],
    filter: 'technical', role: 'Solo Design + Full-Stack Development · CS Capstone',
    year: '2026', team: 'Malvin Boye — solo',
    context: 'CSC-493/694 Computer Science Capstone · Brand: Circeé (キルケー)',
    description: `A full-stack dating application built as a direct technical and design critique of dark patterns in mainstream platforms. Core provocation: what would a dating app look like if it were designed to succeed when its users find relationships — not when they stay engaged?`,
    process: `Audited Bumble and Hinge documenting 40+ dark patterns. Built Connect as a direct inversion: transparent client-side scoring algorithm, 5-profile daily cap, deliberate friction before connecting, flat subscription with no pay-to-win. Matching scores 0–100 across 7 signals including an interest adjacency graph of 28 categories.`,
    outcomes: [
      'Transparency panel noticed unprompted by all participants',
      'Daily cap reframing: frustration → recognition of infinite-scroll conditioning',
      'Zero re-engagement guilt reported after passing',
      '409KB bundle · Vercel CI/CD · Zero TypeScript errors throughout',
    ],
    tools: ['React 18', 'TypeScript', 'Supabase', 'PostgreSQL', 'Vite', 'Vercel', 'Figma'],
    link: 'https://connect-app-rho.vercel.app/', img: null, images: [connect1],
  },
  {
    id: '004', title: 'EV Mart POS',
    category: 'UX Research · Systems Design',
    tags: ['C/C++', 'Figma', 'User Research', 'Deployment'],
    filter: 'technical', role: 'UX Research · UI Redesign · Deployment Lead',
    year: '2022', team: 'Malvin Boye',
    context: 'Software Engineering Intern · Donfox Systems · Accra, Ghana',
    description: `Redesign of the EV Mart point-of-sale interface used by cashiers across 3 branches in Accra. Problem identified through direct observation: checkout errors and slow task completion were creating friction at high-volume periods.`,
    process: `Conducted direct user interviews with cashiers to map workflow friction points. Identified 3 core bottlenecks: unclear button hierarchy, redundant confirmation steps, and poor error state communication. Redesigned key UI components and integrated the improved interface into the existing C/C++ system.`,
    outcomes: [
      '27% improvement in checkout speed across all 3 deployed branches',
      'Deployed to 3 EV Mart locations in Accra — zero rollback needed',
      'Led onboarding for 6 employees — zero support escalations post-launch',
    ],
    tools: ['C/C++', 'Figma', 'User Interviews', 'Prototyping', 'Usability Testing'],
    link: null, img: null,
  },
  {
    id: '005', title: 'Kase',
    category: 'AI · Language Learning · UX',
    tags: ['AI', 'React', 'Figma', 'NLP'],
    filter: 'creative', role: 'UX Design · Overlay UI · Information Architecture',
    year: '2024', team: 'Malvin Boye',
    context: 'Independent project · Language immersion tool',
    description: `An AI-driven language learning tool that teaches through context rather than memorization. Kase surfaces relevant phrases from real videos at the moment they appear — building vocabulary through living language rather than isolated drills.`,
    process: `Designed an adaptive overlay system that sits on top of real video content and surfaces contextual phrases in real time. Information architecture prioritizes discovery over drilling.`,
    outcomes: [
      '25% increase in comprehension among early pilot test participants',
      'Overlay UI designed to minimize cognitive interruption during video viewing',
      'Adaptive phrase surfacing personalizes based on learning history',
    ],
    tools: ['Figma', 'React', 'AI Integration', 'UX Research', 'Prototyping'],
    link: null, img: null,
  },
];

// youtube videos data hard coded for now as well
const VIDEOS = [
  { id: 'p6nL-df7w4o', title: 'Video 01' },
  { id: 'pF3fFd6KTV8', title: 'Video 02' },
  { id: 'vj822sFhEZI', title: 'Video 03' },
  { id: 'zccw9mXSQ4E', title: 'Video 04' },
  { id: 'qfGGwldck2o', title: 'Video 05' },
  { id: 'hD1rlyPr1lM', title: 'Video 06' },
  { id: 'IrJbWg2P1XQ', title: 'Video 07' },
  { id: 'Qrdu3Ju5_8I', title: 'Video 08' },
];

// cursor media component that follows the cursor around and displays either an image or a youtube thumbnail based on props
function CursorMedia({ src, videoId, visible }) {
  const ref = useRef(null);
  const mouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const pos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const raf = useRef(null);

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
        ref.current.style.top = pos.current.y + 'px';
      }
      raf.current = requestAnimationFrame(loop);
    }
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  useEffect(() => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      opacity: visible ? 1 : 0,
      scale: visible ? 1 : 0.88,
      duration: visible ? 0.3 : 0.18,
    });
  }, [visible]);

  return (
    <div ref={ref} className="cursor-media">
      {videoId
        ? <img src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`} alt="" className="cursor-img" />
        : src
          ? <img src={src} alt="" className="cursor-img" />
          : <div className="cursor-placeholder" />
      }
    </div>
  );
}

// project detail
function ProjectDetail({ project, onClose }) {
  const ref = useRef(null);
  const bodyRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(ref.current, { x: '100%' }, { x: '0%', duration: 0.6, ease: 'power3.out' });
    gsap.fromTo(bodyRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4, delay: 0.35 });
    function onKey(e) { if (e.key === 'Escape') handleClose(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  function handleClose() {
    gsap.to(ref.current, { x: '100%', duration: 0.5, ease: 'power3.in', onComplete: onClose });
  }

  return (
    <div ref={ref} className="detail" style={{ transform: 'translateX(100%)' }}>
      <div className="detail-header">
        <button className="detail-back" onClick={handleClose}>← back_</button>
        <span className="detail-context-label">{project.context}</span>
        <span className="detail-year-label">{project.year}</span>
      </div>

      <div ref={bodyRef} className="detail-body">
        {/* Left */}
        <div className="detail-meta">
          <div className="detail-num">{project.id}</div>
          <div className="detail-title">{project.title}</div>
          <div className="detail-cat">{project.category}</div>
          <div className="detail-rule" />

          <div className="detail-field">
            <div className="detail-field-label">role_</div>
            <div className="detail-field-val">{project.role}</div>
          </div>
          <div className="detail-field">
            <div className="detail-field-label">team_</div>
            <div className="detail-field-val">{project.team}</div>
          </div>
          <div className="detail-field">
            <div className="detail-field-label">tools_</div>
            <div className="detail-tools">
              {project.tools.map(t => <span key={t} className="detail-tool">{t}</span>)}
            </div>
          </div>
          {project.link && (
            <div className="detail-field">
              <div className="detail-field-label">live_</div>
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="detail-live">view live ↗</a>
            </div>
          )}
          <div className="detail-rule" />
          <div className="detail-field">
            <div className="detail-field-label">outcomes_</div>
            <ul className="detail-outcomes">
              {project.outcomes.map((o, i) => <li key={i}>{o}</li>)}
            </ul>
          </div>
          <div className="detail-tags">
            {project.tags.map(t => <span key={t} className="detail-tag">{t}</span>)}
          </div>
        </div>

        {/* Right */}
        <div className="detail-content">
          {/* Image placeholder */}
          <div className="detail-img-area">
            <div className="detail-img-placeholder">
              <span className="detail-img-num">{project.id}</span>
              <span className="detail-img-title">{project.title}</span>
              <span className="detail-img-hint">add images to src/images/ to display here</span>
            </div>
          </div>

          <div className="detail-text">
            <div className="detail-text-block">
              <div className="detail-text-label">overview_</div>
              <p className="detail-text-body">{project.description}</p>
            </div>
            <div className="detail-text-block">
              <div className="detail-text-label">process_</div>
              <p className="detail-text-body">{project.process}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="detail-footer">
        <span>Malvin Boye</span>
        <span>maehlo.com</span>
        <span>Circée</span>
      </div>
    </div>
  );
}

// youtube overlay 
function YouTubeOverlay({ onClose }) {
  const ref = useRef(null);
  const [active, setActive] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    gsap.fromTo(ref.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
    function onKey(e) {
      if (e.key === 'Escape') handleClose();
      if (e.key === 'ArrowRight' && active !== null) setActive(v => Math.min(v + 1, VIDEOS.length - 1));
      if (e.key === 'ArrowLeft' && active !== null) setActive(v => Math.max(v - 1, 0));
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active]);

  useEffect(() => { setPlaying(false); }, [active]);

  function handleClose() {
    gsap.to(ref.current, { opacity: 0, y: 20, duration: 0.35, ease: 'power2.in', onComplete: onClose });
  }

  const video = active !== null ? VIDEOS[active] : null;

  return (
    <div ref={ref} className="yt-overlay">
      <CursorMedia
        videoId={hovered !== null && active === null ? VIDEOS[hovered].id : null}
        visible={hovered !== null && active === null}
      />

      <div className="yt-header">
        <div className="yt-header-left">
          <span className="yt-title">maehlo_</span>
          <span className="yt-sub">youtube.com/@maehlo</span>
        </div>
        <div className="yt-header-right">
          {active !== null && <span className="yt-count">{String(active + 1).padStart(2,'0')} / {String(VIDEOS.length).padStart(2,'0')}</span>}
          <button className="yt-close-btn" onClick={handleClose}>✕ esc_</button>
        </div>
      </div>

      <div className="yt-body">
        {/* List */}
        <div className="yt-list">
          <div className="yt-list-head">
            <span>index_</span><span>@maehlo</span>
          </div>
          {VIDEOS.map((v, i) => (
            <button key={v.id}
              className={`yt-row ${active === i ? 'active' : ''}`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setActive(i)}>
              <span className="yt-row-num">{String(i + 1).padStart(2,'0')}</span>
              <span className="yt-row-title">{v.title}</span>
              <span className="yt-row-arrow">→</span>
              {active === i && <div className="yt-row-bar" />}
            </button>
          ))}
        </div>

        {/* Player */}
        <div className="yt-player">
          {active === null ? (
            <div className="yt-empty">
              <span className="yt-empty-text">hover to preview_</span>
              <span className="yt-empty-sub">click to play</span>
            </div>
          ) : playing ? (
            <iframe className="yt-iframe"
              src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`}
              title={video.title} frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen />
          ) : (
            <div className="yt-thumb-wrap" onClick={() => setPlaying(true)}>
              <img src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
                alt={video.title} className="yt-thumb"
                onError={e => { e.target.src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`; }} />
              <div className="yt-play">▶ play_</div>
            </div>
          )}
          {active !== null && (
            <div className="yt-player-nav">
              <button className="yt-nav-btn" onClick={() => setActive(v => Math.max(v-1,0))} disabled={active===0}>← prev_</button>
              <button className="yt-nav-btn" onClick={() => setActive(null)}>back to index_</button>
              <button className="yt-nav-btn" onClick={() => setActive(v => Math.min(v+1,VIDEOS.length-1))} disabled={active===VIDEOS.length-1}>next_ →</button>
            </div>
          )}
        </div>
      </div>

      <div className="yt-footer">
        <span>Malvin Boye</span>
        <a href="https://youtube.com/@maehlo" target="_blank" rel="noopener noreferrer" className="yt-footer-link">youtube.com/@maehlo ↗</a>
        <span>esc to close_</span>
      </div>
    </div>
  );
}

// projects page component that lists projects and allows filtering, with a cursor-following preview and a youtube overlay
export default function ProjectsPage() {
  const navigate = useNavigate();
  const { transitionTo, Curtain } = usePageTransition();
  const [hovered, setHovered] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeProject, setActiveProject] = useState(null);
  const [showYT, setShowYT] = useState(false);
  const pageRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    if (!listRef.current) return;
    const rows = listRef.current.querySelectorAll('.proj-row');
    gsap.fromTo(rows,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.07, ease: 'power2.out', delay: 0.15 }
    );
  }, [activeFilter]);

  function goBack() {
    transitionTo(() => navigate('/'));
  }

  const filtered = activeFilter === 'all' ? PROJECTS : PROJECTS.filter(p => p.filter === activeFilter);
  const hoveredProject = PROJECTS.find(p => p.id === hovered);

  if (activeProject) return <ProjectDetail project={activeProject} onClose={() => setActiveProject(null)} />;
  if (showYT) return <YouTubeOverlay onClose={() => setShowYT(false)} />;

  return (
    <div ref={pageRef} className="proj-page">
      <Curtain />

      {/* Cursor following preview */}
      <CursorMedia src={hoveredProject?.img} visible={!!hovered} />

      {/* Header */}
      <div className="proj-header">
        <button className="proj-back" onClick={goBack}>← back_</button>
        <div className="proj-filters">
          {['all', 'creative', 'technical'].map(f => (
            <button key={f}
              className={`proj-filter ${activeFilter === f ? 'active' : ''}`}
              onClick={() => setActiveFilter(f)}>
              {f}_
            </button>
          ))}
        </div>
        <div className="proj-header-right">
          <button className="proj-yt-btn" onClick={() => setShowYT(true)}>▶ youtube_</button>
          <span className="proj-count">{String(filtered.length).padStart(2,'0')} projects</span>
        </div>
      </div>

      {/* Big label */}
      <div className="proj-big-label">
        <span className="proj-big-word">Selected</span>
        <span className="proj-big-word proj-big-word-right">Work_</span>
      </div>

      {/* Dramatic list */}
      <ul ref={listRef} className="proj-list">
        {filtered.map((p, i) => (
          <li key={p.id}
            className={`proj-row ${hovered === p.id ? 'hovered' : ''}`}
            onMouseEnter={() => setHovered(p.id)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setActiveProject(p)}>

            {/* Number + category — slide in on hover */}
            <div className="proj-row-meta">
              <span className="proj-row-id">{p.id}</span>
              <span className="proj-row-cat">{p.category}</span>
            </div>

            {/* Title — the big one */}
            <span className="proj-row-title">{p.title}</span>

            {/* Year + arrow */}
            <div className="proj-row-right">
              <span className="proj-row-year">{p.year}</span>
              <span className="proj-row-arrow">→</span>
            </div>

            {/* Sweep line */}
            <div className="proj-row-sweep" />
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="proj-footer">
        <span>Malvin Boye</span>
        <span>maehlo.com</span>
        <span>Circée</span>
      </div>
    </div>
  );
}
