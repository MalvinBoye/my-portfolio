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

const ROLES = [
  {
    id: 'design-engineer',
    roleA: 'A',
    roleLine1: 'Design',
    roleLine2: 'Engineer',
    bg: '#CF3A24',
    projects: [
      {
        id: 1,
        title: 'Manageable',
        subtitle: 'React · Canvas API · Motion',
        img: manageable1,
        role: 'Interaction Design · Motion System · UI',
        description: 'A unified ADHD-friendly productivity platform integrating notes, scheduling, and Canvas API for automated assignment tracking. Built motion-based UI and conducted user testing with 15 students — 90% reported improved clarity and reduced decision fatigue.',
        tools: ['React', 'Canvas API', 'Motion Design', 'Figma'],
        link: null,
        images: [manageable1, manageable2, manageable3],
      },
      {
        id: 2,
        title: 'DormDrop',
        subtitle: 'React · Node.js · UX',
        img: dormdrop1,
        role: 'UX Flow Design · React Frontend · Information Architecture',
        description: 'A secure campus marketplace where AU students buy and sell goods using verified accounts. Led UX flow design, user journey mapping, and information architecture for posting, browsing, and messaging.',
        tools: ['React', 'Node.js', 'Figma', 'Git'],
        link: null,
        images: [dormdrop1, dormdrop2, dormdrop3],
      },
      {
        id: 3,
        title: 'EV Mart POS',
        subtitle: 'C/C++ · UX Research · UI',
        img: dormdrop2,
        role: 'UX Research · UI Redesign · Deployment',
        description: 'Researched cashier pain points through user interviews and simplified task flows to reduce error rates. Redesigned key UI components improving checkout speed by 27%, deployed across 3 branches.',
        tools: ['C/C++', 'Figma', 'User Research'],
        link: null,
        images: [dormdrop2],
      },
    ]
  },
  {
    id: 'artist',
    roleA: 'An',
    roleLine1: 'Artist',
    roleLine2: '',
    bg: '#1C1C1C',
    projects: [
      {
        id: 4,
        title: 'Connect',
        subtitle: 'React · Full-Stack · Ethics',
        img: connect1,
        role: 'Solo Design + Development',
        description: 'An ethical dating app built as a full-stack capstone project focused on intentional connection. Designed and developed end-to-end — from interaction design to deployment.',
        tools: ['React', 'Node.js', 'Vercel', 'Figma'],
        link: 'https://connect-app-rho.vercel.app/',
        images: [connect1],
      },
      {
        id: 5,
        title: 'Manageable',
        subtitle: 'Motion · ADHD Design · React',
        img: manageable2,
        role: 'Motion System · Flashcard UI',
        description: 'The artistic side of Manageable — a motion-first interface designed around cognitive ease. Every interaction is intentional, every animation serves the user\'s mental state.',
        tools: ['React', 'GSAP', 'Motion Design'],
        link: null,
        images: [manageable2, manageable3],
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
    roleLine1: 'UI/UX',
    roleLine2: 'Designer',
    bg: '#1a237e',
    projects: [
      {
        id: 7,
        title: 'Connect',
        subtitle: 'Ethical Design · Full-Stack',
        img: connect1,
        role: 'Product Design · UX · Frontend',
        description: 'Designed the full UX of an ethical dating app from scratch — interaction flows, visual system, and frontend implementation. Built as a CSC-493/694 Computer Science Capstone.',
        tools: ['React', 'Figma', 'Node.js'],
        link: 'https://connect-app-rho.vercel.app/',
        images: [connect1],
      },
      {
        id: 8,
        title: 'DormDrop',
        subtitle: 'UX Flow · React · Auth',
        img: dormdrop3,
        role: 'UX Flow Design · Frontend · Information Architecture',
        description: 'Designed and built the full UX for a campus commerce platform — from user journey mapping to React implementation with authentication and verified student accounts.',
        tools: ['React', 'Figma', 'Node.js', 'Git'],
        link: null,
        images: [dormdrop1, dormdrop2, dormdrop3],
      },
      {
        id: 9,
        title: 'Manageable',
        subtitle: 'Cognitive UX · Motion · React',
        img: manageable3,
        role: 'Interaction Design · Motion System · User Testing',
        description: 'Led interaction design and motion system for an ADHD-friendly productivity platform. Conducted user testing with 15 students — 90% reported improved clarity, focus, and reduced decision fatigue.',
        tools: ['React', 'Canvas API', 'Figma', 'Motion Design'],
        link: null,
        images: [manageable1, manageable2, manageable3],
      },
    ]
  }
];

function ProjectOverlay({ project, onClose }) {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(overlayRef.current,
      { y: '100vh' },
      { y: '0vh', duration: 0.7, ease: 'power3.out' }
    );
    tl.fromTo(contentRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
      '-=0.3'
    );
  }, []);

  function handleClose() {
    gsap.to(overlayRef.current, {
      y: '100vh',
      duration: 0.6,
      ease: 'power3.in',
      onComplete: onClose,
    });
  }

  return (
    <div ref={overlayRef} className="project-overlay">
      <div className="overlay-header">
        <span className="overlay-title">{project.title}</span>
        <button className="overlay-close" onClick={handleClose}>✕ close</button>
      </div>

      <div ref={contentRef} className="overlay-content">
        <div className="overlay-images">
          {project.images.length > 0
            ? project.images.map((img, i) => (
                <img key={i} src={img} alt={`${project.title} ${i + 1}`} className="overlay-img" />
              ))
            : <div className="overlay-img-placeholder">{project.title[0]}</div>
          }
        </div>

        <div className="overlay-info">
          <div className="overlay-section">
            <p className="overlay-label">role</p>
            <p className="overlay-value">{project.role}</p>
          </div>

          <div className="overlay-section">
            <p className="overlay-label">about</p>
            <p className="overlay-value overlay-desc">{project.description}</p>
          </div>

          <div className="overlay-section">
            <p className="overlay-label">tools</p>
            <div className="overlay-tools">
              {project.tools.map(tool => (
                <span key={tool} className="overlay-tool">{tool}</span>
              ))}
            </div>
          </div>

          {project.link && (
            <div className="overlay-section">
              <p className="overlay-label">live</p>
              
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="overlay-link"
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

function VtoASection({ onComplete }) {
  const containerRef = useRef(null);
  const vRef = useRef(null);
  const aRef = useRef(null);
  const hasTriggered = useRef(false);

  useEffect(() => {
    function handleWheel() {
      if (hasTriggered.current) return;
      hasTriggered.current = true;

      const tl = gsap.timeline({ onComplete });

      tl.to(vRef.current, {
        y: 10,
        rotation: -15,
        duration: 0.2,
        ease: 'power1.inOut',
      })
      .to(vRef.current, {
        y: 40,
        rotation: -90,
        scaleX: 0.6,
        duration: 0.3,
        ease: 'power2.in',
      })
      .to(vRef.current, {
        y: 80,
        rotation: -180,
        scaleY: 0,
        opacity: 0,
        duration: 0.25,
        ease: 'power3.in',
      })
      .fromTo(aRef.current,
        { y: 60, scaleY: 0, opacity: 0, rotation: 15 },
        { y: 0, scaleY: 1, opacity: 1, rotation: 0, duration: 0.5, ease: 'power3.out' }
      )
      .to(containerRef.current, {
        y: -60,
        opacity: 0,
        duration: 0.5,
        delay: 0.3,
        ease: 'power2.in',
      });
    }

    window.addEventListener('wheel', handleWheel, { once: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <div ref={containerRef} className="vta-container">
      <div className="vta-hi">Hi</div>
      <div className="vta-name-row">
        <span className="vta-m-green">M</span>
        <span className="vta-static">al</span>
        <span
          ref={vRef}
          className="vta-v"
          style={{ display: 'inline-block', transformOrigin: 'center bottom' }}
        >v</span>
        <span
          ref={aRef}
          className="vta-a"
          style={{
            display: 'inline-block',
            position: 'absolute',
            transformOrigin: 'center bottom',
          }}
        >a</span>
        <span className="vta-static">in</span>
      </div>
    </div>
  );
}

function ProjectCard({ project, index, sectionRef, onProjectClick }) {
  const cardRef = useRef(null);
  const bracketLeftRef = useRef(null);
  const bracketRightRef = useRef(null);
  const titleRef = useRef(null);
  const tagsRef = useRef(null);

  useEffect(() => {
    if (!cardRef.current || !sectionRef.current) return;

    const startOffset = 15 + index * 25;

    gsap.fromTo(cardRef.current,
      { y: '70vh', scale: 0.25, opacity: 0 },
      {
        y: '0vh',
        scale: 1,
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: `${startOffset}% top`,
          end: `${startOffset + 16}% top`,
          scrub: 1.2,
        }
      }
    );

    gsap.to(cardRef.current, {
      scale: 0.7,
      y: '-30vh',
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: `${startOffset + 20}% top`,
        end: `${startOffset + 30}% top`,
        scrub: 1.2,
      }
    });

    gsap.fromTo(bracketLeftRef.current,
      { opacity: 0, x: -20 },
      {
        opacity: 1, x: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: `${startOffset + 10}% top`,
          end: `${startOffset + 16}% top`,
          scrub: 1,
        }
      }
    );

    gsap.fromTo(bracketRightRef.current,
      { opacity: 0, x: 20 },
      {
        opacity: 1, x: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: `${startOffset + 10}% top`,
          end: `${startOffset + 16}% top`,
          scrub: 1,
        }
      }
    );

    gsap.fromTo([titleRef.current, tagsRef.current],
      { opacity: 0 },
      {
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: `${startOffset + 12}% top`,
          end: `${startOffset + 16}% top`,
          scrub: 1,
        }
      }
    );

  }, [index]);

  return (
    <div className="card-scene">
      <div ref={titleRef} className="card-nav">
        <span className="card-nav-title">{project.title}</span>
        <div ref={tagsRef} className="card-nav-tags">
          {project.subtitle.split('·').map(tag => (
            <span key={tag} className="card-nav-tag">{tag.trim()}</span>
          ))}
        </div>
      </div>

      <div className="card-row">
        <span ref={bracketLeftRef} className="card-bracket">(</span>

        <div
          ref={cardRef}
          className="project-card-float"
          onClick={() => onProjectClick(project)}
        >
          {project.img
            ? <img src={project.img} alt={project.title} className="card-img" />
            : <div className="card-img-placeholder">
                <span>{project.title[0]}</span>
              </div>
          }
        </div>

        <span ref={bracketRightRef} className="card-bracket">)</span>
      </div>

      <div className="card-bottom">
        <span className="card-dot">•</span>
        <span className="card-index">0{index + 1}</span>
        <span className="card-dot">•</span>
      </div>
    </div>
  );
}

function RoleSection({ role, onProjectClick }) {
  const sectionRef = useRef(null);
  const word1Ref = useRef(null);
  const word2Ref = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    gsap.to(word1Ref.current, {
      x: '-35vw',
      rotation: -90,
      transformOrigin: 'center center',
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: '20% top',
        scrub: 1.5,
      }
    });

    if (word2Ref.current) {
      gsap.to(word2Ref.current, {
        x: '35vw',
        rotation: 90,
        transformOrigin: 'center center',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '20% top',
          scrub: 1.5,
        }
      });
    }

  }, []);

  return (
    <section
      ref={sectionRef}
      className="role-section"
      style={{ background: role.bg }}
    >
      <div className="role-title-block">
        <div className="role-a-letter">{role.roleA}</div>
        <div className="role-words">
          <span ref={word1Ref} className="role-word">{role.roleLine1}</span>
          {role.roleLine2 && (
            <span ref={word2Ref} className="role-word">{role.roleLine2}</span>
          )}
        </div>
      </div>

      <div className="cards-zone">
        {role.projects.map((project, i) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={i}
            sectionRef={sectionRef}
            onProjectClick={onProjectClick}
          />
        ))}
      </div>

      <div className="role-bottom-labels">
        <span>Malvin</span>
        <span>Boye</span>
      </div>
    </section>
  );
}

export default function ScrollPage() {
  const [showVtoA, setShowVtoA] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const smoothWrapperRef = useRef(null);
  const smoothContentRef = useRef(null);

  useEffect(() => {
    if (!showContent) return;
    if (!smoothWrapperRef.current || !smoothContentRef.current) return;

    const smoother = ScrollSmoother.create({
      wrapper: smoothWrapperRef.current,
      content: smoothContentRef.current,
      smooth: 1.8,
      effects: true,
    });

    return () => smoother.kill();
  }, [showContent]);

  return (
    <div className="scroll-page">
      {showVtoA && (
        <VtoASection onComplete={() => {
          setShowVtoA(false);
          setShowContent(true);
        }} />
      )}

      {showContent && (
        <div ref={smoothWrapperRef} id="smooth-wrapper">
          <div ref={smoothContentRef} id="smooth-content">
            {ROLES.map((role) => (
              <RoleSection
                key={role.id}
                role={role}
                onProjectClick={setActiveProject}
              />
            ))}
          </div>
        </div>
      )}

      {activeProject && (
        <ProjectOverlay
          project={activeProject}
          onClose={() => setActiveProject(null)}
        />
      )}
    </div>
  );
}