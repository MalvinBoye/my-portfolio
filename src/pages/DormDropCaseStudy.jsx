import React from 'react';
import { Link } from 'react-router-dom';
import './DormDropCaseStudy.css';
import { css, GRAIN } from '../utils/cssString';
import dormdrop1 from '../images/dormdrop-1.png';
import dormdrop2 from '../images/dormdrop-2.png';
import dormdrop3 from '../images/dormdrop-3.png';

const findings = [
  `Open sign-up meant anyone could list anything — there was no reputation system standing in for real accountability.`,
  `One long undifferentiated feed made browsing a chore. The harder something is to find, the sooner people give up looking.`,
  `Once a buyer and seller started messaging, nothing kept the conversation on the platform — deals moved to text, and every safeguard went with them.`,
];

const screens = [
  { src: dormdrop1, alt: 'DormDrop landing page', cap: 'the landing page — one line of truth: American University students only' },
  { src: dormdrop2, alt: 'DormDrop authenticated home', cap: 'inside the gate — verified-students-only badge, and a marketplace waiting on its first listing' },
  { src: dormdrop3, alt: 'DormDrop browse marketplace', cap: 'browse, filtered by category — a fridge and a stats textbook shouldn’t live in one long scroll' },
];

const shipped = [
  { title: 'Verified .edu auth', body: 'Signup gated behind a student email, so every listing traces back to an actual, accountable person.' },
  { title: 'Category filtering', body: 'Textbooks, electronics, dorm essentials, clothes, stationery — browsing narrows instead of scrolling forever.' },
  { title: 'In-platform messaging', body: 'Buyer/seller conversation stays inside DormDrop, so the trust safeguards stay with it too.' },
];

const kicker = css("font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.24em;color:rgba(32,31,29,.66)");
const kickerDark = css("font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.24em;color:#b68235");
const plate = css("border:1px solid rgba(32,31,29,.2);background:#f7f5ef;padding:14px;border-radius:4px;box-shadow:0 3px 12px rgba(45,43,43,.12)");

export default function DormDropCaseStudy() {
  return (
    <div className="dormdrop-case" style={{ background: '#efece4', backgroundImage: GRAIN, backgroundBlendMode: 'multiply', minHeight: '100vh', color: '#201f1d', fontFamily: '"Lora", Georgia, serif' }}>

      {/* NAV */}
      <div style={css("display:flex;justify-content:space-between;align-items:center;gap:16px;padding:14px 7vw;border-bottom:1px solid rgba(32,31,29,.14);font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.14em;color:rgba(32,31,29,.66)")}>
        <Link to="/" className="dormdrop-link">← MAEHLO.COM</Link>
        <span>CASE 004 · DORMDROP · 2024</span>
      </div>

      {/* TITLE */}
      <section style={css("padding:clamp(60px,10vw,120px) 7vw 60px;display:grid;gap:26px")}>
        <div style={kicker}>A CAMPUS MARKETPLACE, VERIFIED DOWN TO THE .EDU_</div>
        <h1 style={css("margin:0;font:300 clamp(58px,12vw,168px)/.88 'Cormorant Garamond',serif;letter-spacing:-.02em")}>
          dormdrop<span style={{ color: '#c8402c' }}>.</span>
        </h1>
        <p style={css("margin:0;max-width:38ch;font:400 clamp(21px,2.4vw,28px)/1.45 'Lora',serif;text-wrap:pretty")}>
          Buying a stranger's old textbook is normal. Buying it from a stranger who lives two floors up needs a different kind of trust.
        </p>
        <div style={css("display:flex;flex-wrap:wrap;gap:44px;border-top:1px solid rgba(32,31,29,.2);padding-top:20px;margin-top:10px;font:400 14px/1.5 'Lora',serif")}>
          <div style={css("display:grid;gap:5px")}><span style={css("font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.2em;color:rgba(32,31,29,.66)")}>ROLE</span><span>UX flow design, React frontend, information architecture</span></div>
          <div style={css("display:grid;gap:5px")}><span style={css("font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.2em;color:rgba(32,31,29,.66)")}>SCOPE</span><span>Team project · 3-person team · American University</span></div>
          <div style={css("display:grid;gap:5px")}><span style={css("font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.2em;color:rgba(32,31,29,.66)")}>STATUS</span><span>Built · verified .edu marketplace</span></div>
        </div>
      </section>

      {/* WHAT I FOUND */}
      <section style={css("background:#14130f;color:#efece4;padding:80px 7vw;display:grid;gap:30px")}>
        <div style={kickerDark}>WHAT I FOUND_</div>
        <div style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:clamp(24px,4vw,60px)")}>
          {findings.map((f, i) => (
            <div key={i} style={css("display:grid;gap:10px;align-content:start")}>
              <span style={css("font:300 64px/1 'Cormorant Garamond',serif;color:#b68235;font-variant-numeric:tabular-nums")}>{String(i + 1).padStart(2, '0')}</span>
              <p style={css("margin:0;font:400 17px/1.65 'Lora',serif;color:rgba(239,236,228,.82)")}>{f}</p>
            </div>
          ))}
        </div>
        <p style={css("margin:0;font:400 25px/1.4 'Caveat',cursive;color:#b68235;max-width:48ch")}>so the fix: gate it behind a verified .edu account, split browsing into categories, and keep the whole conversation in-app.</p>
      </section>

      {/* THE APPROACH */}
      <section style={css("padding:90px 7vw;display:grid;gap:14px")}>
        <div style={kicker}>THE APPROACH_</div>
        <h2 style={css("margin:0;max-width:24ch;font:300 clamp(32px,5vw,62px)/1.08 'Cormorant Garamond',serif")}>A marketplace only works if the people on it actually trust each other.</h2>
        <p style={css("margin:6px 0 0;max-width:58ch;font:400 17px/1.75 'Lora',serif;color:rgba(32,31,29,.82);text-align:justify;text-wrap:pretty")}>Led the complete UX flow design, user journey mapping, and information architecture across posting, browsing, and messaging. Built the React frontend and worked with the team on API integration, real-time messaging, and the filtering system that makes the marketplace searchable instead of just scrollable.</p>
      </section>

      {/* SCREENS */}
      <section style={css("padding:0 7vw 90px;display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:clamp(22px,3.5vw,44px)")}>
        {screens.map(s => (
          <div key={s.alt} style={css("display:grid;gap:12px")}>
            <div style={plate}><img src={s.src} alt={s.alt} style={css("display:block;width:100%;border-radius:2px")} /></div>
            <span style={css("font:400 20px/1.35 'Caveat',cursive;color:rgba(32,31,29,.66)")}>{s.cap}</span>
          </div>
        ))}
      </section>

      {/* WHAT SHIPPED */}
      <section style={css("padding:0 7vw 90px;display:grid;gap:26px")}>
        <div style={kicker}>WHAT SHIPPED_</div>
        <div style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:clamp(16px,2.4vw,28px)")}>
          {shipped.map(s => (
            <div key={s.title} style={css("border:1px solid rgba(32,31,29,.2);border-radius:4px;padding:20px;display:grid;gap:7px;background:#f7f5ef")}>
              <span style={css("font:300 26px/1.15 'Cormorant Garamond',serif")}>{s.title}</span>
              <span style={css("font:400 15px/1.5 'Lora',serif;color:rgba(32,31,29,.72)")}>{s.body}</span>
            </div>
          ))}
        </div>
        <p style={css("margin:0;font:400 21px/1.4 'Caveat',cursive;color:rgba(32,31,29,.66)")}>fully responsive, too — no native app needed to buy someone's old mini-fridge.</p>
      </section>

      {/* CLOSE */}
      <section style={css("background:#14130f;color:#efece4;padding:80px 7vw 30px;display:grid;gap:20px")}>
        <p style={css("margin:0;max-width:26ch;font:300 clamp(32px,5vw,64px)/1.1 'Cormorant Garamond',serif")}>Want one of these for your thing?</p>
        <a href="mailto:malvinboye@gmail.com" className="dormdrop-link" style={css("justify-self:start;font:400 clamp(20px,2.6vw,30px)/1 'Lora',serif;color:#b68235;border-bottom:1px solid rgba(182,130,53,.6);padding-bottom:8px")}>malvinboye@gmail.com</a>
        <div style={css("display:flex;flex-wrap:wrap;justify-content:space-between;gap:16px;border-top:1px solid rgba(239,236,228,.18);padding-top:18px;margin-top:36px;font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.12em;color:rgba(239,236,228,.55)")}>
          <span>MALVIN BOYE © 2026</span><span>SEE YOU SPACE COWBOY…</span>
          <Link to="/" style={{ color: 'rgba(239,236,228,.55)' }}>BACK TO MAEHLO.COM</Link>
        </div>
      </section>

    </div>
  );
}
