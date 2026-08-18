import React, { useState } from 'react';
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
  { title: 'Interest adjacency graph', body: 'Matching runs 0–100 across 7 signals, including a 27-category interest graph — not a black box.' },
  { title: 'Flat subscription', body: `One price, no pay-to-win boosts. Spending more doesn't buy a better match.` },
];

const results = [
  'The transparency panel was noticed, unprompted, by TODO: participant count — not recorded in the repo or README, need this from you',
  'The daily cap reframed itself — early frustration turned into recognition of how conditioned infinite scroll had made people',
  'Zero re-engagement guilt reported after passing on a match',
];

const kicker = css("font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.24em;color:rgba(32,31,29,.66)");
const kickerDark = css("font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.24em;color:#b68235");

// Screenshots live in public/case/connect/ (not imported — served by path,
// like everything else in public/). The folder was empty when this section
// was built; ScreenShot falls back to a labelled placeholder on load
// failure so the layout is already correct once real files land at these
// exact names.
const screens = [
  { file: 'connect-partners.png', alt: 'Potential Partners — scored profile list', cap: `potential partners — a full score breakdown sits behind every card, so "why am I seeing this person" always has an answer` },
  { file: 'connect-reflection-connect.png', alt: 'Reflection screen before connecting', cap: `reflection, before connecting — a deliberate pause instead of a swipe, because friction here is care, not a bug` },
  { file: 'connect-transparency.png', alt: 'Transparency dashboard', cap: `the transparency dashboard — full algorithmic accounting; no equivalent exists in any mainstream dating app` },
  { file: 'connect-messages.png', alt: 'Real-time messages screen', cap: `messages, in real time — with a nudge to move offline once a conversation has actually gone somewhere` },
  { file: 'connect-date-ideas.png', alt: 'Curated date ideas screen', cap: `date ideas — the app actively trying to talk you into leaving it` },
  { file: 'connect-profile.png', alt: 'My profile screen', cap: `my profile — full user control, a completeness tracker, and a data download sitting in settings` },
];

function ScreenShot({ file, alt, cap }) {
  const [broken, setBroken] = useState(false);
  return (
    <div style={css("display:grid;gap:12px")}>
      <div style={css("border:1px solid rgba(32,31,29,.2);background:#f7f5ef;padding:14px;border-radius:4px;box-shadow:0 3px 12px rgba(45,43,43,.12)")}>
        {broken ? (
          <div style={{ aspectRatio: '1920/1062', display: 'grid', placeItems: 'center', gap: 6, border: '1px dashed rgba(32,31,29,.3)', borderRadius: 2, padding: 16, textAlign: 'center' }}>
            <span style={css("font:400 11px/1.6 ui-monospace,Menlo,monospace;letter-spacing:.1em;color:rgba(32,31,29,.66)")}>EXPECTED{' '}FILE{' '}—{' '}public/case/connect/{file}</span>
          </div>
        ) : (
          <img src={`/case/connect/${file}`} alt={alt} onError={() => setBroken(true)} style={css("display:block;width:100%;border-radius:2px")} />
        )}
      </div>
      <span style={css("font:400 20px/1.35 'Caveat',cursive;color:rgba(32,31,29,.66)")}>{cap}</span>
    </div>
  );
}

// ── the scoring — verified against README's own scoring table, no conflict
// found (see matching.ts and README.md, connect-appv1 repo, commit 54b5d7d —
// i.e. one commit before the "for the demonstration" tweak). Recency's tiers
// are pulled from the code directly rather than the README's looser "active
// in the last 7 days" gloss, since the code is the more precise source.
const scoring = [
  { signal: 'Interest compatibility', max: 30, how: `Interest graph with 27 categories and an adjacency map. Scores exact matches (you both like hiking) and complementary ones (your languages, their travel).` },
  { signal: 'Age range', max: 15, how: `Both people within each other's stated range scores higher than a one-way fit.` },
  { signal: 'Mutual signals', max: 15, how: `Does this person share interests with people you've already connected with?` },
  { signal: 'Recency', max: 15, how: `Tiered by last active: 15 pts under 1 day, 12 under 3 days, 8 under 7 days, 4 under 14 days, 0 beyond that.` },
  { signal: 'Profile completeness', max: 10, how: `An avatar (5), a bio over 20 characters (3), a location set (2). Rewards effort, not payment.` },
  { signal: 'Response rate', max: 10, how: `Auto-updated from message activity — rewards people who actually reply.` },
  { signal: 'Relationship readiness', max: 5, how: `Self-reported on a 1–5 scale; a closer match between the two scores higher.` },
];

// ── how it works — sourced from README.md's "Database Schema" section plus
// what the client code in matching.ts/ConversationScreen.tsx actually does.
// No supabase_schema.sql exists anywhere in the repo (checked every commit
// and three duplicate local copies), so trigger/RLS specifics below are
// deliberately stated at the level the available sources actually support —
// see the TODO note for exactly what's unverified.
const engineering = [
  {
    title: 'Matches are created server-side',
    body: `Connecting with someone inserts a row into swipes — the client never writes to matches directly, it only checks afterward whether a row already exists there. The README's own schema notes describe matches as "auto-created by Postgres trigger when two users both connect," which is consistent with that gap. TODO: the trigger's actual SQL isn't available to read, so I can't describe its exact implementation beyond what the client's behavior and the README together confirm.`,
  },
  {
    title: 'Row-level security, five tables',
    body: `profiles, swipes, matches, messages, daily_swipes — five tables, confirmed both by the README and by every .from() call in the client. The README states row-level security is enabled across all five. TODO: the specific policies aren't recorded anywhere I could read, so I'm not going to guess at what each one actually allows or blocks.`,
  },
  {
    title: 'Realtime messaging',
    body: `Each open conversation subscribes to a Postgres change feed scoped to that match — an INSERT on messages appears immediately, no polling loop.`,
  },
  {
    title: 'The daily cap lives in the database',
    body: `Every swipe increments a counter through a Postgres RPC call against a dedicated daily_swipes table, not a number sitting in component state — clearing local storage or reloading doesn't reset it. One precise caveat: the limit itself (5) is a client-side constant applied to that server-tracked count when the app asks how many profiles remain. TODO: I can't verify from the client code alone whether the RPC function also refuses swipes past the limit at the database level — that function's own SQL isn't in the repo either.`,
  },
];

// ── the language — exact tokens from src/index.css, connect-appv1 @ 54b5d7d
const palette = [
  { name: 'cream', hex: '#F4F1E8' },
  { name: 'cream, dark', hex: '#EDE9DC' },
  { name: 'brown', hex: '#2C2416' },
  { name: 'brown, light', hex: '#5C5040' },
  { name: 'sage', hex: '#8A8C6A' },
  { name: 'sage, light', hex: '#C8C9A3' },
  { name: 'sage, background', hex: '#D6D8B8' },
];

export default function ConnectCaseStudy() {
  return (
    <div className="connect-case" style={{ background: '#efece4', backgroundImage: GRAIN, backgroundBlendMode: 'multiply', minHeight: '100vh', color: '#201f1d', fontFamily: '"Lora", Georgia, serif' }}>

      {/* NAV */}
      <div style={css("display:flex;justify-content:space-between;align-items:center;gap:16px;padding:14px 7vw;border-bottom:1px solid rgba(32,31,29,.14);font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.14em;color:rgba(32,31,29,.66)")}>
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
          <div style={css("display:grid;gap:5px")}><span style={css("font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.2em;color:rgba(32,31,29,.66)")}>ROLE</span><span>Solo design + full-stack development · CS capstone</span></div>
          <div style={css("display:grid;gap:5px")}><span style={css("font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.2em;color:rgba(32,31,29,.66)")}>SCOPE</span><span>React · TypeScript · Supabase · brand: Circée</span></div>
          <div style={css("display:grid;gap:5px")}><span style={css("font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.2em;color:rgba(32,31,29,.66)")}>STATUS</span><span>Live</span></div>
          <div style={css("display:grid;gap:5px")}>
            <span style={css("font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.2em;color:rgba(32,31,29,.66)")}>LINK</span>
            <a href="https://connect-app-rho.vercel.app/" target="_blank" rel="noopener noreferrer" className="connect-link">connect-app-rho.vercel.app ↗</a>
          </div>
        </div>
      </section>

      {/* SCREEN */}
      <section style={css("padding:0 7vw 70px")}>
        <div style={css("border:1px solid rgba(32,31,29,.2);background:#f7f5ef;padding:18px;border-radius:4px;box-shadow:0 3px 12px rgba(45,43,43,.12)")}>
          <img src={connect1} alt="Connect splash screen" style={css("display:block;width:100%;border-radius:2px")} />
        </div>
        <p style={css("margin:12px 0 0;font:400 21px/1.35 'Caveat',cursive;color:rgba(32,31,29,.66)")}>the splash screen — Circée's mark, and a promise: intentional connection, not infinite scroll</p>
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

      {/* SCREENS */}
      <section style={css("padding:0 7vw 90px;display:grid;gap:26px")}>
        <div style={kicker}>SCREENS_</div>
        <div style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(380px,1fr));gap:clamp(24px,4vw,54px)")}>
          {screens.map(s => <ScreenShot key={s.file} {...s} />)}
        </div>
      </section>

      {/* THE SCORING */}
      <section style={css("background:#14130f;color:#efece4;padding:90px 7vw;display:grid;gap:30px")}>
        <div style={kickerDark}>THE SCORING_</div>
        <h2 style={css("margin:0;max-width:26ch;font:300 clamp(32px,5vw,64px)/1.08 'Cormorant Garamond',serif")}>Profiles are scored 0–100 across seven signals. Every point is shown to the user.</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
            <thead>
              <tr>
                <th style={css("text-align:left;padding:12px 16px 12px 0;font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.2em;color:#b68235;border-bottom:1px solid rgba(239,236,228,.24);white-space:nowrap")}>SIGNAL</th>
                <th style={css("text-align:left;padding:12px 16px;font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.2em;color:#b68235;border-bottom:1px solid rgba(239,236,228,.24)")}>MAX</th>
                <th style={css("text-align:left;padding:12px 0 12px 16px;font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.2em;color:#b68235;border-bottom:1px solid rgba(239,236,228,.24)")}>HOW IT WORKS</th>
              </tr>
            </thead>
            <tbody>
              {scoring.map(s => (
                <tr key={s.signal}>
                  <td style={css("padding:18px 16px 18px 0;font:300 22px/1.25 'Cormorant Garamond',serif;color:#efece4;border-bottom:1px solid rgba(239,236,228,.14);vertical-align:top;white-space:nowrap")}>{s.signal}</td>
                  <td style={css("padding:18px 16px;font:400 22px/1.25 'Cormorant Garamond',serif;color:#b68235;font-variant-numeric:tabular-nums;border-bottom:1px solid rgba(239,236,228,.14);vertical-align:top")}>{s.max}</td>
                  <td style={css("padding:18px 0 18px 16px;font:400 15px/1.6 'Lora',serif;color:rgba(239,236,228,.82);border-bottom:1px solid rgba(239,236,228,.14);vertical-align:top")}>{s.how}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={css("border:1px solid rgba(239,236,228,.24);border-radius:4px;padding:18px 20px;display:grid;gap:6px;margin-top:8px")}>
          <span style={css("font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.18em;color:#b68235")}>HARD FILTERS — NOT SCORED_</span>
          <span style={css("font:400 15px/1.6 'Lora',serif;color:rgba(239,236,228,.82)")}>Shared intention and mutual gender preference gate who you see at all, before any scoring runs. They're binary — a yes or no, not points on the 0–100 scale.</span>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={css("padding:90px 7vw;display:grid;gap:26px")}>
        <div style={kicker}>HOW IT WORKS_</div>
        <h2 style={css("margin:0;max-width:28ch;font:300 clamp(32px,5vw,64px)/1.08 'Cormorant Garamond',serif")}>The design decisions that only show up in the schema.</h2>
        <div style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:clamp(22px,3.5vw,44px);margin-top:8px")}>
          {engineering.map(e => (
            <div key={e.title} style={css("display:grid;gap:9px;align-content:start")}>
              <span style={css("font:300 25px/1.2 'Cormorant Garamond',serif")}>{e.title}</span>
              <p style={css("margin:0;font:400 15.5px/1.65 'Lora',serif;color:rgba(32,31,29,.78)")}>{e.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* THE LANGUAGE */}
      <section style={css("padding:0 7vw 90px;display:grid;gap:14px")}>
        <div style={kicker}>THE LANGUAGE_</div>
        <h2 style={css("margin:0;max-width:24ch;font:300 clamp(34px,5vw,66px)/1.08 'Cormorant Garamond',serif")}>Circée — キルケー — an editorial serif register in a typewriter face.</h2>
        <p style={css("margin:6px 0 0;max-width:58ch;font:400 17px/1.75 'Lora',serif;color:rgba(32,31,29,.82);text-align:justify;text-wrap:pretty")}>Circée is my design practice, not a palette built for this one app — named for Circe the sorceress, stamped in katakana (キ / ル / ケ) down the side of the splash screen alongside the romanized wordmark. Every surface runs on Courier Prime, a typewriter face standing in for the editorial-serif register the rest of my work uses: warm cream, dark brown ink, and a single sage accent — no gradient, no drop shadow, one color doing all the work a whole palette usually does.</p>
        <div style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:14px;margin-top:20px")}>
          {palette.map(p => (
            <div key={p.hex} style={css("border:1px solid rgba(32,31,29,.18);border-radius:4px;overflow:hidden;background:#f7f5ef")}>
              <div style={{ height: 64, background: p.hex }} />
              <div style={{ padding: '10px 12px', display: 'grid', gap: 2 }}>
                <span style={css("font:400 13px/1.3 'Lora',serif;color:rgba(32,31,29,.82)")}>{p.name}</span>
                <span style={css("font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.05em;color:rgba(32,31,29,.66)")}>{p.hex}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHAT I'D CHANGE */}
      <section style={css("padding:0 7vw 90px;display:grid;gap:14px")}>
        <div style={kicker}>WHAT I&apos;D CHANGE_</div>
        <p style={css("margin:0;max-width:60ch;font:400 17px/1.75 'Lora',serif;color:rgba(32,31,29,.78)")}>TODO: Malvin to write this.</p>
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
        <p style={css("margin:0;font:400 20px/1.4 'Caveat',cursive;color:#b68235")}>409KB bundle, throughout.</p>
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
        <div style={css("display:flex;flex-wrap:wrap;justify-content:space-between;gap:16px;border-top:1px solid rgba(239,236,228,.18);padding-top:18px;margin-top:36px;font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.12em;color:rgba(239,236,228,.55)")}>
          <span>MALVIN BOYE © 2026</span><span>SEE YOU SPACE COWBOY…</span>
          <Link to="/" style={{ color: 'rgba(239,236,228,.55)' }}>BACK TO MAEHLO.COM</Link>
        </div>
      </section>

    </div>
  );
}
