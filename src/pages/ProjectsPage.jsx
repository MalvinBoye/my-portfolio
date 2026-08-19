import React from 'react';
import { Link } from 'react-router-dom';
import './ProjectsPage.css';
import { css, GRAIN } from '../utils/cssString';
import stuff1c from '../images/stuff-1c.png';
import maableDashboard from '../images/maable-dashboard.png';
import dormdrop1 from '../images/dormdrop-1.png';
import connect1 from '../images/connect-1.png';

const PROJECTS = [
  { title: 'Stuff', kicker: "a grocery app for a brain that wanders", studio: 'Personal — research → UI', year: '2026', href: '/work/stuff', img: stuff1c },
  { title: 'Maable', kicker: 'productivity that pays you back', studio: 'Personal — design engineering', year: '2026', href: '/work/maable', img: maableDashboard },
  { title: 'Connect', kicker: 'a dating app built as a critique of dating apps', studio: 'Personal — full-stack', year: '2026', href: '/work/connect', img: connect1 },
  { title: 'DormDrop', kicker: 'campus delivery, minus the chaos', studio: 'Personal — UI/UX, frontend', year: '2024', href: '/work/dormdrop', img: dormdrop1 },
  { title: 'EV Mart POS', kicker: 'a till that cashiers stopped cursing at', studio: 'Donfox Systems, Accra — UX research', year: '2022', href: '/work/ev-mart', img: null },
];

const kicker = css("font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.24em;color:rgba(32,31,29,.66)");

export default function ProjectsPage() {
  return (
    <div className="projects-page" style={{ background: '#efece4', backgroundImage: GRAIN, backgroundBlendMode: 'multiply', minHeight: '100vh', color: '#201f1d', fontFamily: '"Lora", Georgia, serif' }}>

      {/* NAV */}
      <div style={css("display:flex;justify-content:space-between;align-items:center;gap:16px;padding:14px 7vw;border-bottom:1px solid rgba(32,31,29,.14);font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.14em;color:rgba(32,31,29,.66)")}>
        <Link to="/" className="projects-link">← MAEHLO.COM</Link>
        <span>ALL WORK · 2022 → 2026</span>
      </div>

      {/* TITLE */}
      <section style={css("padding:clamp(60px,10vw,120px) 7vw 50px;display:grid;gap:22px")}>
        <div style={kicker}>SELECTED WORK_</div>
        <h1 style={css("margin:0;font:300 clamp(58px,12vw,150px)/.9 'Cormorant Garamond',serif;letter-spacing:-.02em")}>
          work<span style={{ color: '#c8402c' }}>.</span>
        </h1>
        <p style={css("margin:0;max-width:46ch;font:400 clamp(17px,1.8vw,21px)/1.6 'Lora',serif;color:rgba(32,31,29,.78);text-wrap:pretty")}>Five projects, 2022 through 2026 — shipped, half-shipped, and one still just a wireframe pass.</p>
      </section>

      {/* LIST */}
      <section style={css("padding:0 7vw 90px")}>
        <div style={{ borderTop: '1px solid rgba(32,31,29,.18)' }}>
          {PROJECTS.map(p => (
            <Link
              key={p.title}
              to={p.href}
              className="projects-row"
              style={css("display:flex;flex-wrap:wrap;align-items:center;gap:clamp(20px,3vw,32px);padding:clamp(20px,3.5vw,32px) 0;border-bottom:1px solid rgba(32,31,29,.18);text-decoration:none;color:#201f1d")}
            >
              <div style={{ width: 84, height: 84, flexShrink: 0, borderRadius: 4, overflow: 'hidden', background: '#f7f5ef', border: '1px solid rgba(32,31,29,.18)' }}>
                {p.img ? (
                  <img src={p.img} alt={`${p.title} preview`} style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', filter: 'sepia(.13)' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center' }}>
                    <span style={css("font:400 10px/1.3 ui-monospace,Menlo,monospace;letter-spacing:.08em;color:rgba(32,31,29,.66);text-align:center")}>NO SHOTS</span>
                  </div>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 240, display: 'grid', gap: 6 }}>
                <div style={css("display:flex;flex-wrap:wrap;align-items:baseline;gap:14px")}>
                  <span style={css("font:300 clamp(28px,4vw,44px)/1 'Cormorant Garamond',serif")}>{p.title}</span>
                  <span style={css("font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.14em;color:rgba(32,31,29,.66);font-variant-numeric:tabular-nums")}>{p.year}</span>
                </div>
                <span style={css("font:400 15px/1.5 'Lora',serif;color:rgba(32,31,29,.72)")}>{p.kicker}</span>
                <span style={css("font:400 12px/1.4 'Lora',serif;color:rgba(32,31,29,.66)")}>{p.studio}</span>
              </div>
              <span className="projects-row-arrow" style={css("font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.14em;color:#8a6224;white-space:nowrap")}>VIEW ↗</span>
            </Link>
          ))}
        </div>
      </section>

      {/* CLOSE */}
      <section style={css("background:#14130f;color:#efece4;padding:80px 7vw 30px;display:grid;gap:20px")}>
        <p style={css("margin:0;max-width:26ch;font:300 clamp(32px,5vw,64px)/1.1 'Cormorant Garamond',serif")}>Want one of these for your thing?</p>
        <a href="mailto:malvinboye@gmail.com" className="projects-link" style={css("justify-self:start;font:400 clamp(20px,2.6vw,30px)/1 'Lora',serif;color:#b68235;border-bottom:1px solid rgba(182,130,53,.6);padding-bottom:8px")}>malvinboye@gmail.com</a>
        <div style={css("display:flex;flex-wrap:wrap;justify-content:space-between;gap:16px;border-top:1px solid rgba(239,236,228,.18);padding-top:18px;margin-top:36px;font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.12em;color:rgba(239,236,228,.55)")}>
          <span>MALVIN BOYE © 2026</span><span>SEE YOU SPACE COWBOY…</span>
          <Link to="/" style={{ color: 'rgba(239,236,228,.55)' }}>BACK TO MAEHLO.COM</Link>
        </div>
      </section>

    </div>
  );
}
