import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { gsap } from 'gsap';
import './ProjectsPage.css';

// ─── PROJECT DATA ─────────────────────────────────────────────────────────────
// Drop your images into src/images/ and import them here:
// import manageable1 from '../images/manageable-1.png';
// import dormdrop1 from '../images/dormdrop-1.png';
// import connect1 from '../images/connect-1.png';

const PROJECTS = [
  {
    id: '001',
    title: 'Manageable',
    category: 'Design Engineering',
    tags: ['React', 'Canvas API', 'Motion Design', 'Figma'],
    filter: 'creative',
    role: 'Interaction Design · Motion System · UI Lead',
    year: '2024',
    description: `A unified ADHD-friendly productivity platform integrating notes, scheduling, and Canvas API for automated assignment tracking. Built motion-based UI and conducted user testing with 15 students — 90% reported improved clarity, focus, and reduced decision fatigue.

Led the full interaction design and motion system for the core experience. Co-created an adaptive decision-support algorithm to minimize cognitive load and guide users toward optimal next tasks.`,
    tools: ['React', 'Canvas API', 'Motion Design', 'Figma', 'Node.js'],
    link: null,
    // img: manageable1,
    // images: [manageable1, manageable2, manageable3],
    img: null,
    images: [],
  },
  {
    id: '002',
    title: 'DormDrop',
    category: 'UI/UX · Frontend',
    tags: ['React', 'Node.js', 'UX', 'Auth'],
    filter: 'creative',
    role: 'UX Flow Design · React Frontend · Information Architecture',
    year: '2024',
    description: `A secure campus marketplace where AU students buy and sell goods using verified university accounts. Led UX flow design, user journey mapping, and information architecture for posting, browsing, and messaging flows.

Developed the React.js front-end and collaborated with teammates on API integration and authentication systems.`,
    tools: ['React', 'Node.js', 'Figma', 'Git', 'Authentication'],
    link: null,
    img: null,
    images: [],
  },
  {
    id: '003',
    title: 'Connect',
    category: 'Full-Stack · Product',
    tags: ['React', 'Node.js', 'Ethics', 'Vercel'],
    filter: 'technical',
    role: 'Solo Design + Development — CS Capstone',
    year: '2025',
    description: `An ethical dating app built as a full-stack Computer Science Capstone (CSC-493/694) focused on intentional connection over dopamine-driven engagement. Designed and developed end-to-end.

From initial concept through interaction design, visual system, and full frontend + backend implementation. Live on Vercel.`,
    tools: ['React', 'Node.js', 'Vercel', 'Figma', 'REST API'],
    link: 'https://connect-app-rho.vercel.app/',
    img: null,
    images: [],
  },
  {
    id: '004',
    title: 'EV Mart POS',
    category: 'UX Research · Systems',
    tags: ['C/C++', 'Figma', 'User Research', 'Deployment'],
    filter: 'technical',
    role: 'UX Research · UI Redesign · Deployment Lead',
    year: '2022',
    description: `Researched cashier pain points through direct user interviews at Donfox Systems. Simplified task flows to reduce error rates and redesigned key UI components for clarity and faster task execution.

Improved checkout speed by 27%. Deployed integrated UI into C/C++ system across 3 EV Mart branches and led onboarding for 6 employees.`,
    tools: ['C/C++', 'Figma', 'User Research', 'Prototyping'],
    link: null,
    img: null,
    images: [],
  },
  {
    id: '005',
    title: 'Kase',
    category: 'AI · Language · UX',
    tags: ['AI', 'React', 'Figma', 'Language'],
    filter: 'creative',
    role: 'UX Design · Overlay UI · Information Architecture',
    year: '2024',
    description: `An AI-driven language learning tool that surfaces contextual phrases from real videos to teach languages naturally — not through rote memorization but through living context.

Created adaptive overlay UI and information architecture. Pilot tests showed a 25% increase in comprehension among early users.`,
    tools: ['Figma', 'React', 'AI Integration', 'UX Research'],
    link: null,
    img: null,
    images: [],
  },
];

// ─── PROJECT DETAIL ──────────────────────────────────────────────────────────
function ProjectDetail({ project, onClose }) {
  const detailRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(detailRef.current,
      { x: '100vw' },
      { x: '0vw', duration: 0.6, ease: 'power3.out' }
    );
    tl.fromTo(contentRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: 'power2.out' },
      '-=0.2'
    );

    function onKey(e) { if (e.key === 'Escape') handleClose(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  function handleClose() {
    gsap.to(detailRef.current, {
      x: '100vw', duration: 0.5, ease: 'power3.in', onComplete: onClose
    });
  }

  return (
    <div ref={detailRef} className="detail">
      {/* Header bar */}
      <div className="detail-header">
        <button className="detail-back" onClick={handleClose}>← index_</button>
        <span className="detail-id">{project.id}_</span>
        <span className="detail-year">{project.year}</span>
      </div>

      <div ref={contentRef} className="detail-body">
        {/* Left — meta */}
        <div className="detail-meta">
          <div className="detail-num">{project.id}</div>
          <div className="detail-title">{project.title}</div>
          <div className="detail-category">{project.category}</div>

          <div className="detail-section">
            <div className="detail-label">role_</div>
            <div className="detail-value">{project.role}</div>
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
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="detail-link">
                {project.link} ↗
              </a>
            </div>
          )}

          <div className="detail-tags">
            {project.tags.map(t => <span key={t} className="detail-tag">{t}</span>)}
          </div>
        </div>

        {/* Right — image + description */}
        <div className="detail-content">
          {/* Image */}
          <div className="detail-image-wrap">
            {project.images && project.images.length > 0 ? (
              <div className="detail-images">
                {project.images.map((img, i) => (
                  <img key={i} src={img} alt={`${project.title} ${i + 1}`} className="detail-img" />
                ))}
              </div>
            ) : (
              <div className="detail-img-placeholder">
                <span className="detail-placeholder-title">{project.title}</span>
                <span className="detail-placeholder-sub">{project.category}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="detail-desc">
            {project.description.split('\n\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="detail-footer">
        <span>Malvin Boye</span>
        <span>maehlo.com</span>
        <span>Circée</span>
      </div>
    </div>
  );
}

// ─── PROJECT INDEX ────────────────────────────────────────────────────────────
export default function ProjectsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const filter = searchParams.get('filter') || 'all';
  const [activeProject, setActiveProject] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [activeFilter, setActiveFilter] = useState(filter);
  const pageRef = useRef(null);
  const listRef = useRef(null);
  const previewRef = useRef(null);

  // Entrance animation
  useEffect(() => {
    gsap.fromTo(pageRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.6, ease: 'power2.out' }
    );
    gsap.fromTo(listRef.current?.children ? Array.from(listRef.current.children) : [],
      { opacity: 0, x: -16 },
      { opacity: 1, x: 0, duration: 0.4, stagger: 0.06, ease: 'power2.out', delay: 0.3 }
    );
  }, []);

  // Preview image follows hover
  useEffect(() => {
    if (!previewRef.current) return;
    if (hoveredId) {
      gsap.to(previewRef.current, { opacity: 1, duration: 0.3, ease: 'power2.out' });
    } else {
      gsap.to(previewRef.current, { opacity: 0, duration: 0.2 });
    }
  }, [hoveredId]);

  const filtered = activeFilter === 'all'
    ? PROJECTS
    : PROJECTS.filter(p => p.filter === activeFilter);

  const hoveredProject = PROJECTS.find(p => p.id === hoveredId);

  if (activeProject) {
    return <ProjectDetail project={activeProject} onClose={() => setActiveProject(null)} />;
  }

  return (
    <div ref={pageRef} className="projects-page">
      {/* Top bar */}
      <div className="projects-header">
        <button className="proj-back" onClick={() => navigate('/')}>← back_</button>
        <div className="proj-filters">
          {['all', 'creative', 'technical'].map(f => (
            <button
              key={f}
              className={`proj-filter ${activeFilter === f ? 'active' : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}_
            </button>
          ))}
        </div>
        <span className="proj-count">{String(filtered.length).padStart(2, '0')} projects</span>
      </div>

      {/* Index list */}
      <div className="projects-body">
        <ul ref={listRef} className="project-list">
          {filtered.map((project) => (
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

        {/* Preview panel */}
        <div ref={previewRef} className="preview-panel">
          {hoveredProject && (
            <>
              {hoveredProject.img ? (
                <img src={hoveredProject.img} alt={hoveredProject.title} className="preview-img" />
              ) : (
                <div className="preview-placeholder">
                  <span className="preview-title">{hoveredProject.title}</span>
                  <span className="preview-category">{hoveredProject.category}</span>
                  <div className="preview-tags">
                    {hoveredProject.tags.map(t => <span key={t}>{t}</span>)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="projects-footer">
        <span>Malvin Boye</span>
        <span>maehlo.com</span>
        <span>Circée</span>
      </div>
    </div>
  );
}
