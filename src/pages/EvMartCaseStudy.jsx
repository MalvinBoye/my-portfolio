import React from 'react';
import { Link } from 'react-router-dom';
import './EvMartCaseStudy.css';
import { css, GRAIN } from '../utils/cssString';

const findings = [
  `Cashiers hesitated at the same buttons every shift — the hierarchy never told them where to look first, so every till relearned the same lesson.`,
  `Every sale asked for one confirmation too many. The habit cashiers built wasn't care, it was reflex: confirm without reading.`,
  `When something went wrong, the interface said so in the same tone as when it went right. Errors got missed until the drawer didn't balance.`,
];

const shipped = [
  { title: 'Redesigned hierarchy', body: 'Primary actions given clear visual priority, so the right button is the obvious one, not the memorised one.' },
  { title: 'Fewer confirmations', body: 'Cut the redundant confirmation steps that had turned into auto-pilot clicks instead of actual checks.' },
  { title: 'Real error states', body: 'Errors that read differently from success — color, weight, and wording all doing the work of getting noticed.' },
];

const results = [
  '27% faster checkout across all 3 deployed branches',
  'Zero rollbacks after deployment',
  '6 cashiers onboarded, zero support escalations',
];

const kicker = css("font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.24em;color:rgba(32,31,29,.5)");
const kickerDark = css("font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.24em;color:#b68235");

export default function EvMartCaseStudy() {
  return (
    <div className="evmart-case" style={{ background: '#efece4', backgroundImage: GRAIN, backgroundBlendMode: 'multiply', minHeight: '100vh', color: '#201f1d', fontFamily: '"Lora", Georgia, serif' }}>

      {/* NAV */}
      <div style={css("display:flex;justify-content:space-between;align-items:center;gap:16px;padding:14px 7vw;border-bottom:1px solid rgba(32,31,29,.14);font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.14em;color:rgba(32,31,29,.6)")}>
        <Link to="/" className="evmart-link">← MAEHLO.COM</Link>
        <span>CASE 003 · EV MART POS · 2022</span>
      </div>

      {/* TITLE */}
      <section style={css("padding:clamp(60px,10vw,120px) 7vw 60px;display:grid;gap:26px")}>
        <div style={kicker}>A TILL THAT CASHIERS STOPPED CURSING AT_</div>
        <h1 style={css("margin:0;font:300 clamp(58px,12vw,168px)/.88 'Cormorant Garamond',serif;letter-spacing:-.02em")}>
          ev mart<span style={{ color: '#c8402c' }}>.</span>
        </h1>
        <p style={css("margin:0;max-width:38ch;font:400 clamp(21px,2.4vw,28px)/1.45 'Lora',serif;text-wrap:pretty")}>
          Three branches, one point-of-sale interface, and a queue of Accra cashiers losing time to a UI that fought them at every step.
        </p>
        <div style={css("display:flex;flex-wrap:wrap;gap:44px;border-top:1px solid rgba(32,31,29,.2);padding-top:20px;margin-top:10px;font:400 14px/1.5 'Lora',serif")}>
          <div style={css("display:grid;gap:5px")}><span style={css("font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.2em;color:rgba(32,31,29,.5)")}>ROLE</span><span>UX research, UI redesign, deployment lead</span></div>
          <div style={css("display:grid;gap:5px")}><span style={css("font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.2em;color:rgba(32,31,29,.5)")}>SCOPE</span><span>POS redesign · 3 branches · Donfox Systems, Accra</span></div>
          <div style={css("display:grid;gap:5px")}><span style={css("font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.2em;color:rgba(32,31,29,.5)")}>STATUS</span><span>Deployed · 27% faster checkout</span></div>
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
        <p style={css("margin:0;font:400 25px/1.4 'Caveat',cursive;color:#b68235;max-width:46ch")}>so the fix: fewer confirmations, a clearer hierarchy, and errors that actually look like errors.</p>
      </section>

      {/* THE APPROACH */}
      <section style={css("padding:90px 7vw;display:grid;gap:14px")}>
        <div style={kicker}>THE APPROACH_</div>
        <h2 style={css("margin:0;max-width:24ch;font:300 clamp(32px,5vw,62px)/1.08 'Cormorant Garamond',serif")}>Three branches, three shifts, and a system I couldn't rebuild — only redress.</h2>
        <p style={css("margin:6px 0 0;max-width:58ch;font:400 17px/1.75 'Lora',serif;color:rgba(32,31,29,.82);text-align:justify;text-wrap:pretty")}>No ticket queue was going to surface this — it took standing at the counter during a rush and interviewing the cashiers who worked it. That's where the three bottlenecks came from: button hierarchy, confirmation fatigue, and error states nobody noticed. The fix had to live inside the existing C/C++ system, not replace it — so every change was scoped to what could ship without a rebuild.</p>
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
      </section>

      {/* THE RESULT */}
      <section style={css("background:#14130f;color:#efece4;padding:80px 7vw 96px;display:grid;gap:30px")}>
        <div style={kickerDark}>THE RESULT_</div>
        <div style={css("display:grid;gap:0")}>
          {results.map((r, i) => (
            <div key={i} style={{ ...css("display:flex;align-items:baseline;gap:16px;padding:18px 0;border-bottom:1px solid rgba(239,236,228,.16)"), borderBottom: i === results.length - 1 ? 'none' : '1px solid rgba(239,236,228,.16)' }}>
              <span style={css("font:400 12px/1 ui-monospace,Menlo,monospace;color:#b68235;font-variant-numeric:tabular-nums")}>{String(i + 1).padStart(2, '0')}</span>
              <span style={css("font:400 19px/1.4 'Lora',serif;color:rgba(239,236,228,.86)")}>{r}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CLOSE */}
      <section style={css("padding:80px 7vw 30px;display:grid;gap:20px")}>
        <p style={css("margin:0;max-width:26ch;font:300 clamp(32px,5vw,64px)/1.1 'Cormorant Garamond',serif")}>Want one of these for your thing?</p>
        <a href="mailto:malvinboye@gmail.com" className="evmart-link" style={css("justify-self:start;font:400 clamp(20px,2.6vw,30px)/1 'Lora',serif;color:#8a6224;border-bottom:1px solid rgba(182,130,53,.6);padding-bottom:8px")}>malvinboye@gmail.com</a>
        <div style={css("display:flex;flex-wrap:wrap;justify-content:space-between;gap:16px;border-top:1px solid rgba(32,31,29,.14);padding-top:18px;margin-top:36px;font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.12em;color:rgba(32,31,29,.4)")}>
          <span>MALVIN BOYE © 2026</span><span>SEE YOU SPACE COWBOY…</span>
          <Link to="/" style={{ color: 'rgba(32,31,29,.4)' }}>BACK TO MAEHLO.COM</Link>
        </div>
      </section>

    </div>
  );
}
