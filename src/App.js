import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import paper from './paper.jpg';
import UXUIDesign from './pages/UXUIDesign';
import CreativeWorks from './pages/CreativeWorks';
import SoftwareEngineering from './pages/SoftwareEngineering';
import WebDev from './pages/WebDev';

const NUM_PAPERS = 120;

function generateScatteredPositions() {
  return Array.from({ length: NUM_PAPERS }, (_, i) => ({
    x: Math.random() * 140 - 70,
    y: Math.random() * 100 - 50,
    rotation: Math.random() * 60 - 30,
  }));
}

const scatteredPositions = generateScatteredPositions();

function Home() {
  const [papers, setPapers] = useState(
    Array.from({ length: NUM_PAPERS }, (_, i) => ({
      id: i,
      x: 0,
      y: 0,
      rotation: i * 3 - (NUM_PAPERS * 3) / 2,
      zIndex: i,
    }))
  );
  const [flying, setFlying] = useState(false);
  const dragging = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => scatter(), 2000);
    return () => clearTimeout(timer);
  }, []);

  function scatter() {
    setPapers(prev =>
      prev.map((p, i) => ({
        ...p,
        x: scatteredPositions[i].x,
        y: scatteredPositions[i].y,
        rotation: scatteredPositions[i].rotation,
      }))
    );
  }

  function clearClutter() {
    const corners = [
      { x: -55, y: -45 }, { x: 55, y: -45 },
      { x: -55, y: 45 },  { x: 55, y: 45 },
      { x: -65, y: -15 }, { x: 65, y: -15 },
      { x: -65, y: 15 },  { x: 65, y: 15 },
      { x: -30, y: -55 }, { x: 30, y: -55 },
      { x: -30, y: 55 },  { x: 30, y: 55 },
    ];
    setPapers(prev =>
      prev.map((p, i) => ({
        ...p,
        x: corners[i % corners.length].x,
        y: corners[i % corners.length].y,
        rotation: Math.random() * 30 - 15,
      }))
    );
  }

  function flyAwayThenNavigate(path) {
    setFlying(true);
    setPapers(prev =>
      prev.map((p, i) => {
        const angle = (i / NUM_PAPERS) * 360;
        const rad = (angle * Math.PI) / 180;
        return {
          ...p,
          x: Math.cos(rad) * 150,
          y: Math.sin(rad) * 150,
          rotation: Math.random() * 60 - 30,
        };
      })
    );
    setTimeout(() => navigate(path), 800);
  } 

  function ScrambleText({ text, path, onClick }) {
    const [displayed, setDisplayed] = useState(text);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%&';
    const intervalRef = useRef(null);

    function scramble() {
      let iterations = 0;
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setDisplayed(
          text.split('').map((char, i) => {
            if (char === ' ') return ' ';
            if (i < iterations) return text[i];
            return chars[Math.floor(Math.random() * chars.length)];
          }).join('')
        );
        iterations += 0.5;
        if (iterations >= text.length) {
          clearInterval(intervalRef.current);
          setDisplayed(text);
        }
      }, 30);
    }

    return (
      <span onClick={onClick} onMouseEnter={scramble}>
        {displayed}
      </span>
    );
  }

  

  function onMouseDown(e, id) {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const p = papers.find(p => p.id === id);
    const maxZ = Math.max(...papers.map(p => p.zIndex));
    setPapers(prev =>
      prev.map(p => p.id === id ? { ...p, zIndex: maxZ + 1 } : p)
    );
    dragging.current = { id, startX, startY, origX: p.x, origY: p.y };
  }

  useEffect(() => {
    function onMouseMove(e) {
      if (!dragging.current) return;
      const { id, startX, startY, origX, origY } = dragging.current;
      const dx = ((e.clientX - startX) / window.innerWidth) * 100;
      const dy = ((e.clientY - startY) / window.innerHeight) * 100;
      setPapers(prev =>
        prev.map(p => p.id === id ? { ...p, x: origX + dx, y: origY + dy } : p)
      );
    }
    function onMouseUp() { dragging.current = null; }
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [papers]);

  return (
    <div className="home">
      <div className="labels">
        <ScrambleText text="UX/UI Design" onClick={() => flyAwayThenNavigate('/uxui')} />
        <ScrambleText text="Creative Works" onClick={() => flyAwayThenNavigate('/creative')} />
        <ScrambleText text="Software Engineering" onClick={() => flyAwayThenNavigate('/swe')} />
        <ScrambleText text="Web Dev & Design" onClick={() => flyAwayThenNavigate('/webdev')} />
      </div>


      {papers.map(p => (
        <div
          key={p.id}
          className="paper"
          style={{
            transform: `translate(calc(-50% + ${p.x}vw), calc(-50% + ${p.y}vh)) rotate(${p.rotation}deg)`,
            zIndex: p.zIndex,
            transition: dragging.current?.id === p.id ? 'none' : 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
          onMouseDown={e => onMouseDown(e, p.id)}
        />
      ))}

      <button className="clear-btn" onClick={clearClutter}>clear the clutter</button>
      <button className="scatter-btn" onClick={scatter}>scatter</button>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/uxui" element={<UXUIDesign />} />
        <Route path="/creative" element={<CreativeWorks />} />
        <Route path="/swe" element={<SoftwareEngineering />} />
        <Route path="/webdev" element={<WebDev />} />
      </Routes>
    </BrowserRouter>
  );
}

