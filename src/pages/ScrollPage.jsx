import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import './ScrollPage.css';
import { useNavigate } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const ROLES = [
  {
    id: 'design-engineer',
    roleA: 'A',
    roleLine1: 'Design',
    roleLine2: 'Engineer',
    bg: '#CF3A24',
    projects: [
      { id: 1, title: 'EV Mart POS', subtitle: 'UX Research · UI Design', img: null },
      { id: 2, title: 'University Marketplace', subtitle: 'React · Frontend · UX', img: null },
      { id: 3, title: 'MIPE Platform', subtitle: 'Product · Motion · Design', img: null },
    ]
  },
  {
    id: 'artist',
    roleA: 'An',
    roleLine1: 'Artist',
    roleLine2: '',
    bg: '#1C1C1C',
    projects: [
      { id: 4, title: 'Sketches & Illustration', subtitle: 'Drawing · Ink · Digital', img: null },
      { id: 5, title: 'Photography', subtitle: 'Film · Portrait · Street', img: null },
      { id: 6, title: 'Motion & Film', subtitle: 'Video · Edit · Sound', img: null },
    ]
  },
  {
    id: 'uxui',
    roleA: 'A',
    roleLine1: 'UI/UX',
    roleLine2: 'Designer',
    bg: '#1a237e',
    projects: [
      { id: 7, title: 'Kase Language App', subtitle: 'AI · UX · Interaction', img: null },
      { id: 8, title: 'ADHD Productivity UI', subtitle: 'Cognitive UX · Motion', img: null },
      { id: 9, title: 'Portfolio Site', subtitle: 'Creative Dev · GSAP', img: null },
    ]
  }
];

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
        >A</span>
        <span className="vta-static">in</span>
      </div>
    </div>
  );
}

function ProjectCard({ project, index, sectionRef }) {
  const cardRef = useRef(null);
  const bracketLeftRef = useRef(null);
  const bracketRightRef = useRef(null);
  const titleRef = useRef(null);
  const tagsRef = useRef(null);

  useEffect(() => {
    if (!cardRef.current || !sectionRef.current) return;

    const startOffset = 15 + index * 25;

    // Card floats up small from bottom and grows
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

    // Card shrinks out as you scroll past
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

    // Brackets slide in when card is full size
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

    // Title and tags fade in
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
      {/* Top nav bar — project name left, tags right */}
      <div ref={titleRef} className="card-nav">
        <span className="card-nav-title">{project.title}</span>
        <div className="card-nav-tags">
          {project.subtitle.split('·').map(tag => (
            <span key={tag} className="card-nav-tag">{tag.trim()}</span>
          ))}
        </div>
      </div>

      {/* Brackets */}
      <div className="card-row">
        <span ref={bracketLeftRef} className="card-bracket">(</span>

        {/* The card itself — pure image */}
        <div ref={cardRef} className="project-card-float">
          {project.img
            ? <img src={project.img} alt={project.title} className="card-img" />
            : <div className="card-img-placeholder">
                <span>{project.title[0]}</span>
              </div>
          }
        </div>

        <span ref={bracketRightRef} className="card-bracket">)</span>
      </div>

      {/* Bottom dot indicators */}
      <div className="card-bottom">
        <span className="card-dot">•</span>
        <span className="card-index">0{index + 1}</span>
        <span className="card-dot">•</span>
      </div>
    </div>
  );
}

function RoleSection({ role }) {
  const sectionRef = useRef(null);
  const word1Ref = useRef(null);
  const word2Ref = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    // Words pack to sides vertically
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
      {/* Sticky title block */}
      <div className="role-title-block">
        <div className="role-a-letter">{role.roleA}</div>
        <div className="role-words">
          <span ref={word1Ref} className="role-word">{role.roleLine1}</span>
          {role.roleLine2 && (
            <span ref={word2Ref} className="role-word">{role.roleLine2}</span>
          )}
        </div>
      </div>

      {/* Cards centered in section */}
      <div className="cards-zone">
        {role.projects.map((project, i) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={i}
            sectionRef={sectionRef}
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
  const smoothWrapperRef = useRef(null);
  const smoothContentRef = useRef(null);
  const navigate = useNavigate();

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
        <button className="back-btn" onClick={() => navigate('/')}>← back</button>
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
              <RoleSection key={role.id} role={role} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}