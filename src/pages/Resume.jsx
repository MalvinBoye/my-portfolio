import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Resume.css';

// ---------------------------------------------------------------------------
// The printable one-page résumé, routed at /resume. The page is a <doc-page>
// custom element (the handoff's own doc-page.js, copied unmodified into
// public/): it owns the letter-size page box, the on-screen card, and the
// print layout, so print output stays identical to the prototype's. This
// component supplies the markup and loads that script once.
//
// The layout and typography are the handoff's (Cormorant Garamond / Lora,
// mono labels, a wide left column and a narrow ruled right one); the content
// is Malvin's updated résumé PDF. Left: summary, selected work, experience.
// Right: skills, languages, education.
//
// Deliberately not carried over from the PDF header: the phone number and the
// american.edu address. This is a public page, and the student address will
// stop working; the site's own email is used, as everywhere else.
// ---------------------------------------------------------------------------

const MONO = "ui-monospace,Menlo,monospace";
const label = { font: `400 8pt/1 ${MONO}`, letterSpacing: '.2em', color: '#6a6a6a' };
const body = { font: "400 8pt/1.38 'Lora',serif", color: '#2a2a2a' };
const title = { font: "600 11.5pt/1.15 'Cormorant Garamond',serif" };
const sub = { font: "400 8pt/1.3 'Lora',serif", color: '#4a4a4a' };
const date = { font: `400 7.2pt/1 ${MONO}`, color: '#6a6a6a', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' };
const stack = { font: "400 italic 8pt/1.3 'Lora',serif", color: '#4a4a4a' };
const head = { display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 };
const bullets = { margin: '1px 0 0', padding: '0 0 0 12px', display: 'grid', gap: 1.5, ...body };
const entry = { display: 'grid', gap: 1.5 };
const rule = { borderBottom: '1px solid rgba(20,20,20,.14)', paddingBottom: 6 };

const WORK = [
  { t: 'Connect — Ethical Dating App', s: 'CS Capstone', to: '/work/connect', url: 'maehlo.com/connect', d: '2026',
    st: 'Figma · React · TypeScript · Supabase',
    b: ['Sole designer and engineer. Documented 40+ dark patterns across incumbent dating apps, then inverted them — a transparent client-side matching algorithm that shows users every scoring signal, a hard daily cap, and one flat subscription with no paid visibility.',
      'Designed the full experience in Figma — user flows, information architecture, visual system — then built and deployed it end to end. Result: shipped and live at a 409KB bundle.'] },
  { t: 'Stuff — Grocery App for a Brain That Wanders', to: '/work/stuff', url: 'maehlo.com/stuff', d: '2026',
    st: 'Figma · Product Design · Illustration · Design System',
    b: ['Led a self-directed product design project end to end: user research, flows, information architecture, and ~40 high-fidelity screens in Figma across nine iteration rounds.',
      'Designed the core interaction — a prompt surfacing a staple the user appears to have forgotten — around the hardest question in the product: when a system may interrupt someone without reading as nagging.',
      'Built an original visual system and component library with hand-drawn illustration; designed monetization around cosmetic themes so no part of the core experience is gated, advertised, or engagement-farmed.'] },
  { t: 'Maable — Productivity Ecosystem', to: '/work/maable', url: 'maehlo.com/maable', d: '2025',
    st: 'React · Canvas API · Motion Design · ADHD-Focused UX',
    b: ['Led interaction design, motion system, and flow structure on a 3-person team; built an adaptive decision-support algorithm to minimize cognitive load. Result: in usability testing, 7 of 15 students reported improved clarity and focus.'] },
];

const JOBS = [
  { t: 'Freelance Design & Front-End Development', s: 'Washington, DC', d: '2022 – Present', r: 'Designer / Developer',
    b: ['Design and build sites for small business and independent clients, owning each engagement end to end — discovery, visual direction, build, launch.'] },
  { t: 'YouTube/Editor', d: '2025 – Present', r: 'Creator',
    b: ['Write, shoot, and edit Korean–English video weekly for ~4,000 subscribers, ~85% based in Korea — ongoing practice in pacing, motion, and designing for an audience that does not share my language.'] },
  { t: 'Donfox Systems', s: 'Accra, Ghana', d: 'June 2022 – September 2022', r: 'Software Engineering Intern, EV Mart',
    b: ['Interviewed cashiers to identify workflow friction in the EV Mart point-of-sale interface and translated findings into a redesign of the core task flows.',
      'Rebuilt key UI components for clarity and speed, removing steps from the most frequent checkout path; branch management reported a 27% improvement in average checkout time.',
      'Shipped the redesign into the existing C/C++ system, deployed across 3 branches, and led onboarding for 6 employees.'] },
];

const SKILLS = [
  ['Design', 'Wireframing, prototyping, interaction design, UI design, design systems, information architecture (IA), user flows, responsive design, motion design, illustration, accessibility (WCAG)'],
  ['Research', 'User interviews, usability testing, user journey mapping, personas, competitive analysis, human-centered design, human-computer interaction (HCI)'],
  ['Tools', 'Figma (auto-layout, components, prototyping), Claude Design, Git/GitHub, Vercel, Supabase'],
  ['Engineering & collaboration', 'JavaScript, TypeScript, React, React Native, Node.js, Python, HTML/CSS, GSAP; developer handoff, cross-functional collaboration'],
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
        <section className="page" style={{ display: 'grid', gridTemplateRows: 'auto 1fr auto', padding: '0.5in 0.55in 0.4in', boxSizing: 'border-box', background: '#fff' }}>

          <header style={{ display: 'grid', gap: 8, paddingBottom: 12, borderBottom: '1px solid rgba(20,20,20,.34)' }}>
            <Link to="/" style={{ font: `400 8pt/1 ${MONO}`, letterSpacing: '.18em', color: '#6a6a6a' }}>← BACK TO MAEHLO.COM</Link>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 14 }}>
              <h1 style={{ margin: 0, font: "400 30pt/.92 'Cormorant Garamond',serif", letterSpacing: '.01em' }}>Malvin Mallock Boye</h1>
              <span style={{ font: `400 8pt/1.5 ${MONO}`, letterSpacing: '.16em', color: '#6a6a6a', textAlign: 'right' }}>UX DESIGNER<br />WASHINGTON, DC</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px 16px', font: "400 7.7pt/1.38 'Lora',serif", color: '#3d3d3d' }}>
              <a href="mailto:malvinboye@gmail.com">malvinboye@gmail.com</a>
              <span>Portfolio: <a href="https://maehlo.com">maehlo.com</a></span>
              <a href="https://github.com/MalvinBoye">github.com/MalvinBoye</a>
              <a href="https://www.linkedin.com/in/malvin-m-boye/">linkedin.com/in/malvin-m-boye</a>
            </div>
          </header>

          <main style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.9fr) minmax(0,.62fr)', gap: 20, paddingTop: 11, alignContent: 'start' }}>

            <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
              <p style={{ margin: 0, ...body, textWrap: 'pretty' }}>UX designer and design engineer who runs projects end to end user research and high-fidelity Figma work through shipped production front-end code. Led interaction design on a 3-person team and designed and built a full-stack product solo, working inside the constraints engineers actually face. Seeking a product design role where research-grounded interaction design and developer fluency both matter.</p>

              <div style={{ display: 'grid', gap: 6 }}>
                <span style={label}>SELECTED WORK</span>
                {WORK.map((w, i) => (
                  <div key={w.t} style={{ ...entry, ...(i < WORK.length - 1 ? rule : null) }}>
                    <div style={head}>
                      <span style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '0 9px' }}>
                        <span style={title}>{w.t}</span>
                        <span style={sub}>{w.s ? w.s + ' · ' : ''}<Link to={w.to}>{w.url}</Link></span>
                      </span>
                      <span style={date}>{w.d}</span>
                    </div>
                    <span style={stack}>{w.st}</span>
                    <ul style={bullets}>{w.b.map((x) => <li key={x} style={{ textWrap: 'pretty' }}>{x}</li>)}</ul>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gap: 6 }}>
                <span style={label}>EXPERIENCE</span>
                {JOBS.map((j, i) => (
                  <div key={j.t} style={{ ...entry, ...(i < JOBS.length - 1 ? rule : null) }}>
                    <div style={head}>
                      <span style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '0 9px' }}>
                        <span style={title}>{j.t}</span>
                        {j.s && <span style={sub}>{j.s}</span>}
                      </span>
                      <span style={date}>{j.d}</span>
                    </div>
                    <span style={stack}>{j.r}</span>
                    <ul style={bullets}>{j.b.map((x) => <li key={x} style={{ textWrap: 'pretty' }}>{x}</li>)}</ul>
                  </div>
                ))}
              </div>
            </div>

            <aside style={{ display: 'grid', gap: 11, alignContent: 'start', paddingLeft: 15, borderLeft: '1px solid rgba(20,20,20,.16)' }}>
              <div style={{ display: 'grid', gap: 7 }}>
                <span style={label}>SKILLS</span>
                {SKILLS.map(([k, v]) => (
                  <div key={k} style={{ display: 'grid', gap: 1 }}>
                    <span style={{ font: `400 7pt/1.3 ${MONO}`, letterSpacing: '.1em', color: '#6a6a6a', textTransform: 'uppercase' }}>{k}</span>
                    <span style={{ ...body, font: "400 7.7pt/1.38 'Lora',serif" }}>{v}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gap: 4 }}>
                <span style={label}>LANGUAGES</span>
                <span style={{ ...body, font: "400 7.7pt/1.38 'Lora',serif" }}>English, Spanish, Korean, French</span>
              </div>

              <div style={{ display: 'grid', gap: 6 }}>
                <span style={label}>EDUCATION</span>
                <div style={{ display: 'grid', gap: 1 }}>
                  <span style={{ font: "600 10pt/1.15 'Cormorant Garamond',serif" }}>American University</span>
                  <span style={{ ...body, font: "400 7.7pt/1.35 'Lora',serif" }}>Washington, DC · MS Computer Science (in progress), BS Computer Science</span>
                  <span style={date}>MS 06/27 · BS 12/26</span>
                </div>
                <div style={{ display: 'grid', gap: 1 }}>
                  <span style={{ font: "600 10pt/1.15 'Cormorant Garamond',serif" }}>Lincoln Community School</span>
                  <span style={{ ...body, font: "400 7.7pt/1.35 'Lora',serif" }}>Accra, Ghana · International Baccalaureate Diploma</span>
                  <span style={date}>2019 – 2022</span>
                </div>
              </div>
            </aside>
          </main>

          <footer style={{ display: 'flex', justifyContent: 'space-between', gap: 14, paddingTop: 10, borderTop: '1px solid rgba(20,20,20,.2)', font: `400 7.5pt/1 ${MONO}`, letterSpacing: '.16em', color: '#6a6a6a' }}>
            <span>MALVIN MALLOCK BOYE</span><span>MAEHLO.COM</span><span>2026</span>
          </footer>

        </section>
      </doc-page>
    </div>
  );
}
