import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Resume.css';

// ---------------------------------------------------------------------------
// Ported from the design handoff's "Maelo - Resume.dc.html" — the printable
// one-page résumé, routed at /resume. The page is a <doc-page> custom element
// (the handoff's own doc-page.js, copied unmodified into public/): it owns the
// letter-size page box, the on-screen card, and the print layout, so print
// output stays identical to the prototype. This component only supplies the
// markup and loads that script once.
//
// rev. 2 changes: the "← back to maehlo.com" link points at `/`, and the
// contact line carries LinkedIn.
//
// FLAG (kept verbatim, not fixed): the Education block is still the
// prototype's placeholder — "Washington, DC" over an italic "Add your school,
// programme and years here". It will show on the live page as written until
// there's real content to put there.
// ---------------------------------------------------------------------------

const MONO = "ui-monospace,Menlo,monospace";
const label = { font: `400 8pt/1 ${MONO}`, letterSpacing: '.2em', color: '#6a6a6a' };
const item = { font: "400 9pt/1.6 'Lora',serif" };
const itemTight = { font: "400 9pt/1.5 'Lora',serif" };
const workTitle = { font: "600 13pt/1.15 'Cormorant Garamond',serif" };
const workMeta = { font: `400 8pt/1 ${MONO}`, color: '#6a6a6a', fontVariantNumeric: 'tabular-nums' };
const workRole = { font: "400 italic 9pt/1.3 'Lora',serif", color: '#4a4a4a' };
const workBody = { margin: '2px 0 0', font: "400 9pt/1.55 'Lora',serif", color: '#2a2a2a', textWrap: 'pretty' };
const workHead = { display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 };
const ruled = { display: 'grid', gap: 3, paddingBottom: 9, borderBottom: '1px solid rgba(20,20,20,.14)' };
const block = { display: 'grid', gap: 6 };

const WORK = [
  { t: 'Maable — gamified productivity', d: '2026 · LIVE', r: 'Product, design engineering, front end',
    b: 'Ten tools on one surface — tasks, habits, notes, flashcards, focus timer, journal, breathwork. XP is the exhaust of real work rather than a separate game, and a companion whose mood tracks your week supplies the accountability. Focus Mode strips the app to five tools in one click. Shipped at maable-web.vercel.app.' },
  { t: 'Stuff — groceries for ADHD', d: '2026', r: 'Research, product, UI, illustration',
    b: 'Lists fail ADHD people because opening one feels like being told off. Nine rounds of design across ~40 screens: kraft paper and handwriting instead of a productivity chrome, hand-drawn bags and a cat with opinions, and a currency you earn only by finishing a shop.' },
  { t: 'DormDrop — campus delivery', d: '2024', r: 'UI/UX, front end',
    b: 'Ordering built around dorm reality: shared drop points, the narrow windows between classes, and roommates who never split the bill.' },
  { t: 'Connect — social with a conscience', d: '2026', r: 'Full-stack, ethical design',
    b: 'A social product designed around what it costs the person using it — attention, comparison, time — instead of what it extracts from them.' },
];

export default function Resume() {
  // Load the handoff's doc-page.js once. It registers <doc-page>; any already
  // rendered on this route upgrade in place, and its disconnectedCallback
  // removes the @page/meta tags it injected when the route unmounts.
  useEffect(() => {
    if (window.customElements && window.customElements.get('doc-page')) return;
    if (document.querySelector('script[data-doc-page]')) return;
    const s = document.createElement('script');
    s.src = process.env.PUBLIC_URL + '/doc-page.js';
    s.setAttribute('data-doc-page', '');
    document.body.appendChild(s);
  }, []);

  return (
    <div className="mh-resume">
      <doc-page>
        <section className="page" style={{ display: 'grid', gridTemplateRows: 'auto 1fr auto', padding: '0.62in 0.7in 0.5in', boxSizing: 'border-box', background: '#fff' }}>

          <header style={{ display: 'grid', gap: 9, paddingBottom: 14, borderBottom: '1px solid rgba(20,20,20,.34)' }}>
            <Link to="/" style={{ font: `400 8pt/1 ${MONO}`, letterSpacing: '.18em', color: '#6a6a6a' }}>← BACK TO MAEHLO.COM</Link>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 14 }}>
              <h1 style={{ margin: 0, font: "400 34pt/.92 'Cormorant Garamond',serif", letterSpacing: '.01em' }}>Malvin Mallock Boye</h1>
              <span style={{ font: `400 8pt/1.5 ${MONO}`, letterSpacing: '.16em', color: '#6a6a6a', textAlign: 'right' }}>MAEHLO<br />WASHINGTON, DC</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, font: "400 9pt/1.4 'Lora',serif", color: '#3d3d3d' }}>
              <span>Designer · Design engineer · Artist</span>
              <a href="mailto:malvinboye@gmail.com">malvinboye@gmail.com</a>
              <a href="https://maehlo.com">maehlo.com</a>
              <a href="https://github.com/MalvinBoye">github.com/MalvinBoye</a>
              <a href="https://www.linkedin.com/in/malvin-m-boye/">linkedin.com/in/malvin-m-boye</a>
              <a href="https://youtube.com/@maehlo">youtube.com/@maehlo</a>
            </div>
          </header>

          <main style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.55fr) minmax(0,.75fr)', gap: 26, paddingTop: 16, alignContent: 'start' }}>

            <div style={{ display: 'grid', gap: 15, alignContent: 'start' }}>
              <p style={{ margin: 0, font: "400 9.5pt/1.6 'Lora',serif", color: '#2a2a2a', textWrap: 'pretty' }}>I work where design meets engineering — research, interface, motion, and the drawings inside them. Raised in Tema, Ghana; based in Washington DC. Every illustration in my work is my own.</p>

              <div style={{ display: 'grid', gap: 11 }}>
                <span style={label}>SELECTED WORK</span>
                {WORK.map((w, i) => (
                  <div key={w.t} style={i === WORK.length - 1 ? { display: 'grid', gap: 3 } : ruled}>
                    <div style={workHead}>
                      <span style={workTitle}>{w.t}</span>
                      <span style={workMeta}>{w.d}</span>
                    </div>
                    <span style={workRole}>{w.r}</span>
                    <p style={workBody}>{w.b}</p>
                  </div>
                ))}
              </div>
            </div>

            <aside style={{ display: 'grid', gap: 14, alignContent: 'start', paddingLeft: 22, borderLeft: '1px solid rgba(20,20,20,.16)' }}>
              <div style={block}>
                <span style={label}>PRACTICE</span>
                <span style={item}>UX research</span>
                <span style={item}>Interface &amp; interaction design</span>
                <span style={item}>Motion &amp; prototyping</span>
                <span style={item}>Design systems</span>
                <span style={item}>Illustration</span>
              </div>

              <div style={block}>
                <span style={label}>BUILD</span>
                <span style={item}>HTML, CSS, JavaScript</span>
                <span style={item}>React, Vite</span>
                <span style={item}>Canvas &amp; SVG animation</span>
                <span style={item}>Figma</span>
              </div>

              <div style={block}>
                <span style={label}>LANGUAGES</span>
                <span style={itemTight}>English — native</span>
                <span style={itemTight}>한국어 — conversational, self-taught through cinema</span>
                <span style={itemTight}>Spanish, French — in progress</span>
              </div>

              <div style={block}>
                <span style={label}>ALSO</span>
                <p style={{ margin: 0, font: "400 9pt/1.55 'Lora',serif", color: '#2a2a2a', textWrap: 'pretty' }}>I run a YouTube channel documenting life and progress, spoken entirely in a language I recently threw myself into — filming, editing, thumbnails, pacing, sound.</p>
                <a href="https://youtube.com/@maehlo" style={{ font: "400 9pt/1.5 'Lora',serif", borderBottom: '1px solid rgba(20,20,20,.3)', justifySelf: 'start' }}>youtube.com/@maehlo</a>
              </div>

              <div style={block}>
                <span style={label}>EDUCATION</span>
                <span style={itemTight}>Washington, DC</span>
                <span style={{ font: "400 italic 8.5pt/1.5 'Lora',serif", color: '#6a6a6a' }}>Add your school, programme and years here</span>
              </div>
            </aside>
          </main>

          <footer style={{ display: 'flex', justifyContent: 'space-between', gap: 14, paddingTop: 11, borderTop: '1px solid rgba(20,20,20,.2)', font: `400 7.5pt/1 ${MONO}`, letterSpacing: '.16em', color: '#6a6a6a' }}>
            <span>MALVIN MALLOCK BOYE</span><span>MAEHLO.COM</span><span>2026</span>
          </footer>

        </section>
      </doc-page>
    </div>
  );
}
