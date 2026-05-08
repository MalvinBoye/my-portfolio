import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './App.css';
import MainSite from './pages/MainSite';
import ProjectsPage from './pages/ProjectsPage';

gsap.registerPlugin(ScrollTrigger);

// signature intro components 
// SVG path for cursive "maehlo" — hand-drawn style paths
function SignatureIntro({ onComplete }) {
  const containerRef = useRef(null);
  const svgRef = useRef(null);

  useEffect(() => {
    const paths = svgRef.current?.querySelectorAll('path');
    if (!paths) return;

    // Set up dash animation for each path
    paths.forEach(path => {
      const len = path.getTotalLength();
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = len;
    });

    const tl = gsap.timeline({
      onComplete: () => {
        // Hold for a moment then fade out
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.8,
          delay: 0.6,
          ease: 'power2.inOut',
          onComplete,
        });
      }
    });

    // Draw each letter in sequence
    paths.forEach((path, i) => {
      tl.to(path, {
        strokeDashoffset: 0,
        duration: 0.45,
        ease: 'power2.inOut',
      }, i * 0.18);
    });

    return () => tl.kill();
  }, []);

  return (
    <div ref={containerRef} className="sig-container">
      <svg
        ref={svgRef}
        viewBox="0 0 600 160"
        className="sig-svg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* m */}
        <path
          d="M 30 110 C 30 80 40 60 55 60 C 65 60 72 72 72 85 L 72 110 C 72 80 82 60 97 60 C 107 60 114 72 114 85 L 114 110"
          stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        />
        {/* a */}
        <path
          d="M 155 80 C 145 72 132 68 125 76 C 116 86 118 108 130 112 C 142 116 155 105 155 95 L 155 75 L 155 115"
          stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        />
        {/* e */}
        <path
          d="M 180 100 C 185 85 210 85 212 100 C 212 112 195 118 185 110 C 178 104 182 270 12 86 L 212 96 174 95 178 88 C 182 80 195 75 208 82"
          stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        />
        {/* h */}
        <path
          d="M 235 50 L 235 115 M 235 82 C 240 70 250 64 262 66 C 274 68 280 78 280 90 L 280 115"
          stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        />
        {/* l */}
        <path
          d="M 300 50 L 300 115"
          stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        />
        {/* o */}
        <path
          d="M 360 90 C 360 74 350 64 338 64 C 326 64 316 74 316 90 C 316 106 326 116 338 116 C 350 116 360 106 360 90 Z"
          stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        />
        {/* underscore flourish */}
        <path
          d="M 30 130 C 100 138 280 132 370 128"
          stroke="#111" strokeWidth="1.5" strokeLinecap="round"
          opacity="0.35"
        />
      </svg>
    </div>
  );
}

// app
function AppContent() {
  const [showSig, setShowSig] = useState(true);

  return (
    <>
      {showSig && <SignatureIntro onComplete={() => setShowSig(false)} />}
      {!showSig && (
        <Routes>
          <Route path="/" element={<MainSite />} />
          <Route path="/projects" element={<ProjectsPage />} />
        </Routes>
      )}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
