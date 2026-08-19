import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './AboutPage.css';
import { css } from '../utils/cssString';

const PANELS = [
  { tag: '01', glyph: '✎', caption: 'me, opening a new file' },
  { tag: '02', glyph: '...', caption: 'then immediately overthinking it' },
  { tag: '03', glyph: '?!', caption: "and somehow it's 2am again" },
];

// mirrors ProjectsPage's dark/mono carryover — see MainSite's artMode
// effect for where the flag gets written.
export default function AboutPage() {
  const [mono] = useState(() => localStorage.getItem('ms-art-mode') === '1');

  useEffect(() => {
    document.body.classList.add(mono ? 'mono' : 'night');
    return () => document.body.classList.remove('night', 'mono');
  }, [mono]);

  const bg = mono ? '#ffffff' : '#080807';
  const fg = mono ? '#141414' : '#f2efe6';
  const ink66 = mono ? 'rgba(20,20,20,.66)' : 'rgba(242,239,230,.66)';
  const ink78 = mono ? 'rgba(20,20,20,.78)' : 'rgba(242,239,230,.78)';
  const border14 = mono ? 'rgba(20,20,20,.14)' : 'rgba(242,239,230,.16)';
  const gold = mono ? '#8a6224' : '#f2c14e';
  const panelBg = mono ? '#f7f5ef' : '#16150f';
  const panelInk = mono ? '#201f1d' : '#efece4';
  const panelDot = mono ? 'rgba(32,31,29,.22)' : 'rgba(239,236,228,.16)';
  const panelShadow = mono ? 'rgba(32,31,29,.9)' : 'rgba(0,0,0,.7)';

  return (
    <div className="about-page" style={{ background: bg, minHeight: '100vh', color: fg, fontFamily: '"Lora", Georgia, serif' }}>

      {/* NAV */}
      <div style={{ ...css("display:flex;justify-content:space-between;align-items:center;gap:16px;padding:14px 7vw;font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.14em"), borderBottom: `1px solid ${border14}`, color: ink66 }}>
        <Link to="/" className="about-link" style={{ color: gold }}>← MAEHLO.COM</Link>
        <span>STATUS: WIP_</span>
      </div>

      {/* TITLE */}
      <section style={css("padding:clamp(60px,10vw,120px) 7vw 40px;display:grid;gap:22px")}>
        <div style={{ ...css("font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.24em"), color: ink66 }}>ABOUT_</div>
        <h1 style={css("margin:0;font:300 clamp(58px,12vw,150px)/.9 'Cormorant Garamond',serif;letter-spacing:-.02em")}>
          about<span style={{ color: gold }}>.</span>
        </h1>
        <p style={{ ...css("margin:0;max-width:46ch;font:400 clamp(17px,1.8vw,21px)/1.6 'Lora',serif;text-wrap:pretty"), color: ink78 }}>The real page is still on the drawing board. Here's roughly where it's at.</p>
      </section>

      {/* COMIC STRIP */}
      <section style={css("padding:20px 7vw clamp(70px,10vw,120px)")}>
        <div className="about-strip">
          {PANELS.map((p, i) => (
            <React.Fragment key={p.tag}>
              <div
                className="about-panel"
                style={{
                  background: panelBg,
                  backgroundImage: `radial-gradient(${panelDot} 1px, transparent 1.4px)`,
                  borderColor: panelInk,
                  boxShadow: `5px 6px 0 ${panelShadow}`,
                  color: panelInk,
                }}
              >
                <span className="about-panel-tag" style={{ color: panelInk, borderColor: panelInk }}>{p.tag}</span>
                <span className="about-panel-glyph">{p.glyph}</span>
                <span className="about-panel-caption">{p.caption}</span>
              </div>
              {i < PANELS.length - 1 && <span className="about-gutter" style={{ color: ink66 }}>→</span>}
            </React.Fragment>
          ))}
        </div>

        <div
          className="about-panel about-panel--final"
          style={{
            background: panelBg,
            backgroundImage: `radial-gradient(${panelDot} 1px, transparent 1.4px)`,
            borderColor: panelInk,
            boxShadow: `7px 8px 0 ${panelShadow}`,
            color: panelInk,
          }}
        >
          <span className="about-panel-tag" style={{ color: panelInk, borderColor: panelInk }}>04</span>
          <span className="about-panel-final-text">DESIGN IN PROGRESS</span>
          <span className="about-panel-caption">check back soon — or don't, I'll still be here</span>
        </div>
      </section>

    </div>
  );
}
