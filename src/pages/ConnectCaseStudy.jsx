import React from 'react';
import { Link } from 'react-router-dom';
import './ConnectCaseStudy.css';
import { css, GRAIN } from '../utils/cssString';
import connect1 from '../images/connect-1.png';

const findings = [
  `Infinite scroll doesn't reward finding someone — it rewards not stopping. The interface has no incentive to ever let you leave satisfied.`,
  `Matching algorithms stay opaque on purpose. When you can't see why you matched, you can't trust that you did.`,
  `Boosts, super likes, and paid visibility turn attention into a line item — spending money outcompetes actually matching well.`,
];

const shipped = [
  { title: 'Transparency panel', body: `The scoring behind every match is visible, not asserted — client-side, so it can't quietly change behind the scenes.` },
  { title: 'A hard daily cap', body: 'Five profiles a day. No infinite feed to lose an hour to.' },
  { title: 'Interest adjacency graph', body: 'Matching runs 0–100 across 7 signals, including a 28-category interest graph — not a black box.' },
  { title: 'Flat subscription', body: `One price, no pay-to-win boosts. Spending more doesn't buy a better match.` },
];

const results = [
  'The transparency panel was noticed, unprompted, by every participant who tested it',
  'The daily cap reframed itself — early frustration turned into recognition of how conditioned infinite scroll had made people',
  'Zero re-engagement guilt reported after passing on a match',
];

const kicker = css("font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.24em;color:rgba(32,31,29,.5)");
const kickerDark = css("font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.24em;color:#b68235");

export default function ConnectCaseStudy() {
  return (
    <div className="connect-case" style={{ background: '#efece4', backgroundImage: GRAIN, backgroundBlendMode: 'multiply', minHeight: '100vh', color: '#201f1d', fontFamily: '"Lora", Georgia, serif' }}>

      {/* NAV */}
      <div style={css("display:flex;justify-content:space-between;align-items:center;gap:16px;padding:14px 7vw;border-bottom:1px solid rgba(32,31,29,.14);font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.14em;color:rgba(32,31,29,.6)")}>
        <Link to="/" className="connect-link">← MAEHLO.COM</Link>
        <span>CASE 005 · CONNECT · 2026</span>
      </div>

      {/* TITLE */}
      <section style={css("padding:clamp(60px,10vw,120px) 7vw 60px;display:grid;gap:26px")}>
        <div style={kicker}>A DATING APP BUILT AS A CRITIQUE OF DATING APPS_</div>
        <h1 style={css("margin:0;font:300 clamp(58px,12vw,168px)/.88 'Cormorant Garamond',serif;letter-spacing:-.02em")}>
          connect<span style={{ color: '#c8402c' }}>.</span>
        </h1>
        <p style={css("margin:0;max-width:40ch;font:400 clamp(21px,2.4vw,28px)/1.45 'Lora',serif;text-wrap:pretty")}>
          What would a dating app look like if it were built to succeed the moment people leave — not the moment they open it again?
        </p>
        <div style={css("display:flex;flex-wrap:wrap;gap:44px;border-top:1px solid rgba(32,31,29,.2);padding-top:20px;margin-top:10px;font:400 14px/1.5 'Lora',serif")}>
          <div style={css("display:grid;gap:5px")}><span style={css("font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.2em;color:rgba(32,31,29,.5)")}>ROLE</span><span>Solo design + full-stack development · CS capstone</span></div>
          <div style={css("display:grid;gap:5px")}><span style={css("font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.2em;color:rgba(32,31,29,.5)")}>SCOPE</span><span>React · TypeScript · Supabase · brand: Circée</span></div>
          <div style={css("display:grid;gap:5px")}><span style={css("font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.2em;color:rgba(32,31,29,.5)")}>STATUS</span><span>Live · zero TypeScript errors</span></div>
          <div style={css("display:grid;gap:5px")}>
            <span style={css("font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.2em;color:rgba(32,31,29,.5)")}>LINK</span>
            <a href="https://connect-app-rho.vercel.app/" target="_blank" rel="noopener noreferrer" className="connect-link">connect-app-rho.vercel.app ↗</a>
          </div>
        </div>
      </section>

      {/* SCREEN */}
      <section style={css("padding:0 7vw 70px")}>
        <div style={css("border:1px solid rgba(32,31,29,.2);background:#f7f5ef;padding:18px;border-radius:4px;box-shadow:0 3px 12px rgba(45,43,43,.12)")}>
          <img src={connect1} alt="Connect splash screen" style={css("display:block;width:100%;border-radius:2px")} />
        </div>
        <p style={css("margin:12px 0 0;font:400 21px/1.35 'Caveat',cursive;color:rgba(32,31,29,.6)")}>the splash screen — Circée's mark, and a promise: intentional connection, not infinite scroll</p>
      </section>

      {/* WHAT I FOUND */}
      <section style={css("background:#14130f;color:#efece4;padding:84px 7vw;display:grid;gap:30px")}>
        <div style={kickerDark}>WHAT I FOUND_</div>
        <h2 style={css("margin:0;max-width:26ch;font:300 clamp(32px,5vw,64px)/1.08 'Cormorant Garamond',serif")}>Forty-plus dark patterns, documented, then inverted one by one.</h2>
        <div style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:clamp(24px,4vw,58px);margin-top:8px")}>
          {findings.map((f, i) => (
            <div key={i} style={css("display:grid;gap:10px;align-content:start")}>
              <span style={css("font:300 62px/1 'Cormorant Garamond',serif;color:#b68235;font-variant-numeric:tabular-nums")}>{String(i + 1).padStart(2, '0')}</span>
              <p style={css("margin:0;font:400 17px/1.65 'Lora',serif;color:rgba(239,236,228,.82)")}>{f}</p>
            </div>
          ))}
        </div>
        <p style={css("margin:0;font:400 25px/1.4 'Caveat',cursive;color:#b68235;max-width:52ch")}>so the approach: a transparent client-side scoring algorithm, a hard 5-profile daily cap, deliberate friction before connecting, and one flat subscription with no pay-to-win.</p>
      </section>

      {/* WHAT SHIPPED */}
      <section style={css("padding:90px 7vw;display:grid;gap:26px")}>
        <div style={kicker}>WHAT SHIPPED_</div>
        <div style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:clamp(16px,2.4vw,28px)")}>
          {shipped.map(s => (
            <div key={s.title} style={css("border:1px solid rgba(32,31,29,.2);border-radius:4px;padding:20px;display:grid;gap:7px;background:#f7f5ef")}>
              <span style={css("font:300 26px/1.15 'Cormorant Garamond',serif")}>{s.title}</span>
              <span style={css("font:400 15px/1.5 'Lora',serif;color:rgba(32,31,29,.72)")}>{s.body}</span>
            </div>
          ))}
        </div>
      </section>

      {/* THE RESULT */}
      <section style={css("background:#14130f;color:#efece4;padding:80px 7vw;display:grid;gap:30px")}>
        <div style={kickerDark}>THE RESULT_</div>
        <div style={{ display: 'grid', gap: 0 }}>
          {results.map((r, i) => (
            <div key={i} style={{ ...css("display:flex;align-items:baseline;gap:16px;padding:18px 0"), borderBottom: i === results.length - 1 ? 'none' : '1px solid rgba(239,236,228,.16)' }}>
              <span style={css("font:400 12px/1 ui-monospace,Menlo,monospace;color:#b68235;font-variant-numeric:tabular-nums")}>{String(i + 1).padStart(2, '0')}</span>
              <span style={css("font:400 19px/1.4 'Lora',serif;color:rgba(239,236,228,.86)")}>{r}</span>
            </div>
          ))}
        </div>
        <p style={css("margin:0;font:400 20px/1.4 'Caveat',cursive;color:#b68235")}>409KB bundle · zero TypeScript errors, throughout.</p>
      </section>

      {/* CTA */}
      <section style={css("padding:0 7vw 90px;padding-top:70px")}>
        <a href="https://connect-app-rho.vercel.app/" target="_blank" rel="noopener noreferrer" className="connect-cta"
          style={css("display:grid;gap:14px;border:1px solid rgba(32,31,29,.24);border-radius:4px;padding:clamp(28px,5vw,54px);background:#f7f5ef;color:#201f1d")}>
          <span style={kicker}>IT&apos;S LIVE_</span>
          <span style={css("font:300 clamp(28px,4.4vw,58px)/1.05 'Cormorant Garamond',serif")}>Go try it → connect-app-rho.vercel.app</span>
          <span style={css("max-width:52ch;font:400 17px/1.7 'Lora',serif;color:rgba(32,31,29,.78)")}>A daily cap, transparent scoring, one flat price. No pay-to-win.</span>
        </a>
      </section>

      {/* FOOTER */}
      <section style={css("background:#14130f;color:#efece4;padding:70px 7vw 30px;display:grid;gap:20px")}>
        <p style={css("margin:0;max-width:26ch;font:300 clamp(30px,4.6vw,58px)/1.1 'Cormorant Garamond',serif")}>Want one of these for your thing?</p>
        <a href="mailto:malvinboye@gmail.com" className="connect-link" style={css("justify-self:start;font:400 clamp(20px,2.6vw,30px)/1 'Lora',serif;color:#b68235;border-bottom:1px solid rgba(182,130,53,.6);padding-bottom:8px")}>malvinboye@gmail.com</a>
        <div style={css("display:flex;flex-wrap:wrap;justify-content:space-between;gap:16px;border-top:1px solid rgba(239,236,228,.18);padding-top:18px;margin-top:36px;font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.12em;color:rgba(239,236,228,.45)")}>
          <span>MALVIN BOYE © 2026</span><span>SEE YOU SPACE COWBOY…</span>
          <Link to="/" style={{ color: 'rgba(239,236,228,.45)' }}>BACK TO MAEHLO.COM</Link>
        </div>
      </section>

    </div>
  );
}
