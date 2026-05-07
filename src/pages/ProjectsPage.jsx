import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { gsap } from 'gsap';
import './ProjectsPage.css';

// ─── IMAGES ──────────────────────────────────────────────────────────────────
// import manageable1 from '../images/manageable-1.png';
// import manageable2 from '../images/manageable-2.png';
// import manageable3 from '../images/manageable-3.png';
// import dormdrop1 from '../images/dormdrop-1.png';
// import dormdrop2 from '../images/dormdrop-2.png';
// import dormdrop3 from '../images/dormdrop-3.png';
// import connect1 from '../images/connect-1.png';

// ─── PROJECT DATA ─────────────────────────────────────────────────────────────
const PROJECTS = [
  {
    id: '001',
    title: 'Manageable',
    category: 'Design Engineering · Product',
    tags: ['React', 'Node.js', 'Canvas API', 'Motion Design'],
    filter: 'creative',
    role: 'Interaction Design · Motion System · UI Lead',
    year: '2025',
    team: 'Malvin Boye, Yuri, Kimberly',
    context: '3-person team · CS Capstone · American University',
    description: `Manageable is a student-optimized productivity ecosystem that bridges the gap between task managers and learning tools. Built to address a specific gap: students needed intelligent prioritization, integrated study support, and behavioral motivation in one platform, not three separate apps.`,
    process: `Led the full interaction design, motion system, and flow architecture. Co-created an adaptive decision-support algorithm that analyzes deadlines, task weights, and personal preferences to surface the next best action. Designed the Lock-In Mode distraction-free focus system and the automatic note-to-flashcard conversion pipeline, which moved from spaCy NLP to a custom JavaScript structural parser after testing revealed the NLP approach produced inconsistent results on loosely formatted notes.`,
    outcomes: [
      '90% of 15 student testers reported improved clarity, focus, and reduced decision fatigue',
      'Flashcard system automated Q&A generation from raw notes using custom JS structural parser',
      'Canvas API integration automated assignment tracking across all enrolled courses',
      'Lock-In Mode adopted as primary focus tool — distraction-free with progress tracking',
    ],
    tools: ['React', 'Node.js', 'Canvas API', 'Flask', 'JavaScript', 'Figma', 'Motion Design'],
    link: null,
    img: null,
    images: [],
  },
  {
    id: '002',
    title: 'DormDrop',
    category: 'UI/UX · Frontend Engineering',
    tags: ['React', 'Node.js', 'Auth', 'UX Research'],
    filter: 'creative',
    role: 'UX Flow Design · React Frontend · Information Architecture',
    year: '2024',
    team: 'Malvin Boye + team',
    context: 'Team project · American University',
    description: `A secure peer-to-peer marketplace built exclusively for verified American University students. The core design challenge was building trust in a commerce platform between strangers who share a campus — verified .edu authentication was the structural solution.`,
    process: `Led complete UX flow design, user journey mapping, and information architecture across posting, browsing, and messaging flows. Designed the verified student onboarding — authentication gates the entire experience so buyers and sellers are always confirmed AU community members. Built the React.js frontend and collaborated with teammates on API integration, real-time messaging, and filtering systems.`,
    outcomes: [
      'Verified .edu authentication eliminated anonymous listing risk entirely',
      'Category filtering (Textbooks, Electronics, Dorm Essentials, Clothes) reduced browse time',
      'Seller/buyer messaging flow kept all transactions within the verified platform',
      'Responsive layout works across all devices without a native app',
    ],
    tools: ['React', 'Node.js', 'Figma', 'Git', 'REST API', 'Authentication'],
    link: null,
    img: null,
    images: [],
  },
  {
    id: '003',
    title: 'Connect',
    category: 'Full-Stack · Ethical Product Design',
    tags: ['React', 'TypeScript', 'Supabase', 'Vercel'],
    filter: 'technical',
    role: 'Solo Design + Full-Stack Development · CS Capstone',
    year: '2026',
    team: 'Malvin Boye — solo',
    context: 'CSC-493/694 Computer Science Capstone · American University · Brand: Circeé (キルケー)',
    description: `A full-stack dating application built as a direct technical and design critique of dark patterns in mainstream platforms. Core provocation: what would a dating app look like if it were designed to succeed when its users find relationships — not when they stay engaged?`,
    process: `Conducted structured audits of Bumble and Hinge documenting 40+ screenshots of dark patterns. Built Connect as a direct inversion: transparent client-side scoring algorithm (fully auditable via browser dev tools), 5-profile daily cap, deliberate friction before connecting, flat subscription with no pay-to-win. Matching scores 0–100 across 7 signals including an interest adjacency graph of 28 categories. Deployed live with Supabase Realtime messaging and PostgreSQL Row-Level Security.`,
    outcomes: [
      'Transparency panel noticed unprompted by all participants — no mainstream app exposes algorithm reasoning this way',
      'Daily cap reframing: frustration → recognition of conditioned infinite-scroll behavior',
      'Zero re-engagement guilt reported after passing — no dark pattern prompts present',
      '12-screen full-stack system live with real auth, Realtime messaging, and automated match triggers',
      '409KB bundle · Vercel CI/CD · Zero TypeScript errors maintained throughout',
    ],
    tools: ['React 18', 'TypeScript', 'Supabase', 'PostgreSQL', 'Vite', 'Vercel', 'Figma'],
    link: 'https://connect-app-rho.vercel.app/',
    img: null,
    images: [],
  },
  {
    id: '004',
    title: 'EV Mart POS',
    category: 'UX Research · Systems Design',
    tags: ['C/C++', 'Figma', 'User Research', 'Deployment'],
    filter: 'technical',
    role: 'UX Research · UI Redesign · Deployment Lead',
    year: '2022',
    team: 'Malvin Boye',
    context: 'Software Engineering Intern · Donfox Systems · Accra, Ghana',
    description: `Redesign of the EV Mart point-of-sale interface used by cashiers across 3 branches in Accra. Problem identified through direct observation: checkout errors and slow task completion were creating friction at high-volume periods.`,
    process: `Conducted direct user interviews with cashiers to map workflow friction points. Identified 3 core bottlenecks: unclear button hierarchy, redundant confirmation steps, and poor error state communication. Redesigned key UI components for clarity and faster task execution, then integrated the improved interface into the existing C/C++ system and deployed across all 3 branches.`,
    outcomes: [
      '27% improvement in checkout speed across all 3 deployed branches',
      'Deployed to 3 EV Mart locations in Accra — zero rollback needed',
      'Led onboarding for 6 employees — zero support escalations post-launch',
      'Error rate reduction through clearer hierarchy and improved error state design',
    ],
    tools: ['C/C++', 'Figma', 'User Interviews', 'Prototyping', 'Usability Testing'],
    link: null,
    img: null,
    images: [],
  },
  {
    id: '005',
    title: 'Kase',
    category: 'AI · Language Learning · UX',
    tags: ['AI', 'React', 'Figma', 'NLP'],
    filter: 'creative',
    role: 'UX Design · Overlay UI · Information Architecture',
    year: '2024',
    team: 'Malvin Boye',
    context: 'Independent project · Language immersion tool',
    description: `An AI-driven language learning tool that teaches through context rather than memorization. Kase surfaces relevant phrases from real videos at the moment they appear — building vocabulary through living language rather than isolated drills.`,
    process: `Identified the core problem: existing apps teach vocabulary in isolation from authentic usage. Designed an adaptive overlay system that sits on top of real video content and surfaces contextual phrases in real time. Information architecture prioritizes discovery over drilling — users encounter language naturally, then optionally drill what they have encountered.`,
    outcomes: [
      '25% increase in comprehension among early pilot test participants',
      'Overlay UI designed to minimize cognitive interruption during video viewing',
      'Adaptive phrase surfacing personalizes based on learning history',
    ],
    tools: ['Figma', 'React', 'AI Integration', 'UX Research', 'Prototyping'],
    link: null,
    img: null,
    images: [],
  },
];

// ─── YOUTUBE VIDEOS ───────────────────────────────────────────────────────────
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

// ─── CURSOR FOLLOWING MEDIA ───────────────────────────────────────────────────
// This is the Obys-style interaction: media follows the cursor
function CursorMedia({ src, isVideo, visible, videoId }) {
  const ref = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const raf = useRef(null);

  useEffect(() => {
    function onMove(e) {
      mouse.current = { x: e.clientX, y: e.clientY };
    }
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useEffect(() => {
    function loop() {
      // Lerp — smooth follow with lag
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
    if (visible) {
      gsap.to(ref.current, { opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out' });
    } else {
      gsap.to(ref.current, { opacity: 0, scale: 0.88, duration: 0.2, ease: 'power2.in' });
    }
  }, [visible]);

  return (
    <div ref={ref} className="cursor-media">
      {isVideo ? (
        <img
          src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
          alt="video preview"
          className="cursor-media-img"
        />
      ) : src ? (
        <img src={src} alt="project preview" className="cursor-media-img" />
      ) : (
        <div className="cursor-media-placeholder" />
      )}
    </div>
  );
}

// ─── CROSSHAIRS ───────────────────────────────────────────────────────────────
function Crosshairs({ visible, color = 'rgba(0,0,0,0.18)' }) {
  return (
    <div className={`crosshairs ${visible ? 'visible' : ''}`}>
      {['tl', 'tr', 'bl', 'br'].map(pos => (
        <div key={pos} className={`crosshair crosshair-${pos}`}>
          <div className="ch-h" style={{ background: color }} />
          <div className="ch-v" style={{ background: color }} />
          <div className="ch-dot" style={{ background: color }} />
        </div>
      ))}
    </div>
  );
}

// ─── IMAGE VIEWER ─────────────────────────────────────────────────────────────
function ImageViewer({ images, title }) {
  const [active, setActive] = useState(0);
  const mainRef = useRef(null);
  // Cursor following thumbnail preview
  const [hoveredThumb, setHoveredThumb] = useState(null);

  function goTo(index) {
    if (!mainRef.current || index === active) return;
    const dir = index > active ? -20 : 20;
    gsap.to(mainRef.current, {
      opacity: 0, x: -dir, duration: 0.12, ease: 'power2.in',
      onComplete: () => {
        setActive(index);
        gsap.fromTo(mainRef.current,
          { opacity: 0, x: dir },
          { opacity: 1, x: 0, duration: 0.18, ease: 'power2.out' }
        );
      }
    });
  }

  if (!images || images.length === 0) {
    return (
      <div className="img-viewer-empty">
        <Crosshairs visible color="rgba(0,0,0,0.07)" />
        <span className="img-placeholder-title">{title}</span>
        <span className="img-placeholder-sub">images coming soon_</span>
      </div>
    );
  }

  return (
    <div className="img-viewer">
      <div className="img-viewer-main" ref={mainRef}>
        <Crosshairs visible color="rgba(0,0,0,0.1)" />
        <img src={images[active]} alt={`${title} ${active + 1}`} className="img-viewer-img" />
        <div className="img-viewer-counter">
          {String(active + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
        </div>
      </div>

      {/* Obys-style thumbnail strip — hover to preview, click to select */}
      {images.length > 1 && (
        <div className="img-thumbs">
          {images.map((img, i) => (
            <button
              key={i}
              className={`img-thumb ${i === active ? 'active' : ''}`}
              onMouseEnter={() => setHoveredThumb(i)}
              onMouseLeave={() => setHoveredThumb(null)}
              onClick={() => goTo(i)}
            >
              <img src={img} alt={`${i + 1}`} />
              <div className="thumb-progress" style={{ width: i === active ? '100%' : '0%' }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── YOUTUBE OVERLAY — OBYS STYLE ─────────────────────────────────────────────
function YouTubeOverlay({ onClose }) {
  const overlayRef = useRef(null);
  const [activeVideo, setActiveVideo] = useState(null); // null = none selected yet
  const [playing, setPlaying] = useState(false);
  const [hoveredVideo, setHoveredVideo] = useState(null);

  useEffect(() => {
    gsap.fromTo(overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: 'power2.out' }
    );
    function onKey(e) { if (e.key === 'Escape') handleClose(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => { setPlaying(false); }, [activeVideo]);

  function handleClose() {
    gsap.to(overlayRef.current, {
      opacity: 0, duration: 0.35, ease: 'power2.in', onComplete: onClose
    });
  }

  function selectVideo(i) {
    setActiveVideo(i);
    setPlaying(false);
  }

  const video = activeVideo !== null ? VIDEOS[activeVideo] : null;

  return (
    <div ref={overlayRef} className="yt-overlay">
      {/* Cursor following thumbnail */}
      <CursorMedia
        isVideo
        videoId={hoveredVideo !== null ? VIDEOS[hoveredVideo].id : (video ? video.id : null)}
        visible={hoveredVideo !== null && activeVideo === null}
      />

      <div className="yt-header">
        <div className="yt-header-left">
          <span className="yt-label">maehlo_</span>
          <span className="yt-sub">youtube.com/@maehlo</span>
        </div>
        <div className="yt-header-right">
          {activeVideo !== null && (
            <span className="yt-count">{String(activeVideo + 1).padStart(2,'0')} / {String(VIDEOS.length).padStart(2,'0')}</span>
          )}
          <button className="yt-close" onClick={handleClose}>✕ esc_</button>
        </div>
      </div>

      <div className="yt-body">
        {/* Left — numbered video list */}
        <div className="yt-list">
          <div className="yt-list-title-row">
            <span>index_</span>
            <span>maehlo</span>
          </div>
          {VIDEOS.map((v, i) => (
            <button
              key={v.id}
              className={`yt-list-item ${activeVideo === i ? 'active' : ''}`}
              onMouseEnter={() => setHoveredVideo(i)}
              onMouseLeave={() => setHoveredVideo(null)}
              onClick={() => selectVideo(i)}
            >
              <span className="yt-list-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="yt-list-title">{v.title}</span>
              <span className="yt-list-arrow">→</span>
              <div className="yt-list-line" />
            </button>
          ))}
        </div>

        {/* Right — player or empty state */}
        <div className="yt-player-wrap">
          {activeVideo === null ? (
            <div className="yt-empty-state">
              <Crosshairs visible color="rgba(0,0,0,0.08)" />
              <span className="yt-empty-text">hover to preview_</span>
              <span className="yt-empty-sub">click to play</span>
            </div>
          ) : playing ? (
            <iframe
              className="yt-iframe"
              src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="yt-thumbnail-wrap" onClick={() => setPlaying(true)}>
              <Crosshairs visible color="rgba(0,0,0,0.1)" />
              <img
                src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
                alt={video.title}
                className="yt-thumbnail"
                onError={e => { e.target.src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`; }}
              />
              <div className="yt-play-btn">
                <span>▶ play_</span>
              </div>
            </div>
          )}

          {activeVideo !== null && (
            <div className="yt-nav">
              <button className="yt-nav-btn" onClick={() => selectVideo(Math.max(activeVideo - 1, 0))} disabled={activeVideo === 0}>← prev_</button>
              <button className="yt-nav-btn" onClick={() => { setActiveVideo(null); setPlaying(false); }}>back to index_</button>
              <button className="yt-nav-btn" onClick={() => selectVideo(Math.min(activeVideo + 1, VIDEOS.length - 1))} disabled={activeVideo === VIDEOS.length - 1}>next_ →</button>
            </div>
          )}
        </div>
      </div>

      <div className="yt-footer">
        <span>Malvin Boye</span>
        <a href="https://youtube.com/@maehlo" target="_blank" rel="noopener noreferrer" className="yt-channel-link">youtube.com/@maehlo ↗</a>
        <span>press esc to close_</span>
      </div>
    </div>
  );
}

// ─── PROJECT DETAIL ───────────────────────────────────────────────────────────
function ProjectDetail({ project, onClose }) {
  const detailRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(detailRef.current, { x: '100vw' }, { x: '0vw', duration: 0.6, ease: 'power3.out' });
    gsap.fromTo(contentRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4, delay: 0.3, ease: 'power2.out' });
    function onKey(e) { if (e.key === 'Escape') handleClose(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  function handleClose() {
    gsap.to(detailRef.current, { x: '100vw', duration: 0.5, ease: 'power3.in', onComplete: onClose });
  }

  return (
    <div ref={detailRef} className="detail">
      <div className="detail-header">
        <button className="detail-back" onClick={handleClose}>← index_</button>
        <div className="detail-header-mid">
          <span className="detail-id-label">{project.id}_</span>
          <span className="detail-context">{project.context}</span>
        </div>
        <span className="detail-year">{project.year}</span>
      </div>

      <div ref={contentRef} className="detail-body">
        <div className="detail-meta">
          <div className="detail-num">{project.id}</div>
          <div className="detail-title">{project.title}</div>
          <div className="detail-category">{project.category}</div>
          <div className="detail-divider" />
          <div className="detail-section">
            <div className="detail-label">role_</div>
            <div className="detail-value">{project.role}</div>
          </div>
          <div className="detail-section">
            <div className="detail-label">team_</div>
            <div className="detail-value">{project.team}</div>
          </div>
          <div className="detail-section">
            <div className="detail-label">tools_</div>
            <div className="detail-tools">
              {project.tools.map(t => <span key={t} className="detail-tool">{t}</span>)}
            </div>
          </div>
          {project.link && (
            <div className="detail-section">
              <div className="detail-label">live_</div>
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="detail-link">view live ↗</a>
            </div>
          )}
          <div className="detail-divider" />
          <div className="detail-section">
            <div className="detail-label">outcomes_</div>
            <ul className="detail-outcomes">
              {project.outcomes.map((o, i) => <li key={i}>{o}</li>)}
            </ul>
          </div>
          <div className="detail-tags">
            {project.tags.map(t => <span key={t} className="detail-tag">{t}</span>)}
          </div>
        </div>

        <div className="detail-content">
          <ImageViewer images={project.images} title={project.title} />
          <div className="detail-text">
            <div className="detail-text-section">
              <div className="detail-text-label">overview_</div>
              <p className="detail-desc-text">{project.description}</p>
            </div>
            <div className="detail-text-section">
              <div className="detail-text-label">process_</div>
              <p className="detail-desc-text">{project.process}</p>
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

// ─── PROJECTS PAGE — OBYS STYLE LIST ─────────────────────────────────────────
export default function ProjectsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const filter = searchParams.get('filter') || 'all';
  const [activeProject, setActiveProject] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [activeFilter, setActiveFilter] = useState(filter);
  const [showYouTube, setShowYouTube] = useState(false);
  const pageRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(pageRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out' });
    const items = listRef.current?.querySelectorAll('.project-row');
    if (items) {
      gsap.fromTo(items,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, ease: 'power2.out', delay: 0.15 }
      );
    }
  }, [activeFilter]);

  const filtered = activeFilter === 'all' ? PROJECTS : PROJECTS.filter(p => p.filter === activeFilter);
  const hoveredProject = PROJECTS.find(p => p.id === hoveredId);

  if (showYouTube) return <YouTubeOverlay onClose={() => setShowYouTube(false)} />;
  if (activeProject) return <ProjectDetail project={activeProject} onClose={() => setActiveProject(null)} />;

  return (
    <div ref={pageRef} className="projects-page">
      {/* Cursor-following media preview */}
      <CursorMedia
        src={hoveredProject?.img}
        visible={!!hoveredId}
        isVideo={false}
      />

      <div className="projects-header">
        <button className="proj-back" onClick={() => navigate('/')}>← back_</button>
        <div className="proj-filters">
          {['all', 'creative', 'technical'].map(f => (
            <button key={f} className={`proj-filter ${activeFilter === f ? 'active' : ''}`} onClick={() => setActiveFilter(f)}>
              {f}_
            </button>
          ))}
        </div>
        <div className="proj-header-right">
          <button className="proj-yt-btn" onClick={() => setShowYouTube(true)}>▶ youtube_</button>
          <span className="proj-count">{String(filtered.length).padStart(2, '0')} projects</span>
        </div>
      </div>

      <div className="projects-body">
        {/* Top labels */}
        <div className="list-header">
          <span>index_</span>
          <span>project</span>
          <span>category</span>
          <span>year_</span>
        </div>

        <ul ref={listRef} className="project-list">
          {filtered.map(project => (
            <li
              key={project.id}
              className={`project-row ${hoveredId === project.id ? 'hovered' : ''}`}
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => setActiveProject(project)}
            >
              <span className="row-id">{project.id}</span>
              <span className="row-title">{project.title}</span>
              <span className="row-category">{project.category}</span>
              <span className="row-year">{project.year}</span>
              <span className="row-arrow">→</span>
              <div className="row-underline" />
            </li>
          ))}
        </ul>
      </div>

      <div className="projects-footer">
        <span>Malvin Boye</span>
        <span>maehlo.com</span>
        <span>Circée</span>
      </div>
    </div>
  );
}
