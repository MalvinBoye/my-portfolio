import React from 'react';
import { Link } from 'react-router-dom';
import './MaableCaseStudy.css';
import { css, GRAIN } from '../utils/cssString';
import maableDashboard from '../images/maable-dashboard.png';
import maableBoard from '../images/maable-board.png';
import maableMenu from '../images/maable-menu.png';
import maableCompanion from '../images/maable-companion.png';

const decisions = [
  {
    title: 'XP as the exhaust, not the point',
    body: `Every task, habit, note and breath emits XP toward a level and a leaderboard place. The reward is a by-product of the work rather than a separate mini-game, so it can't be farmed and doesn't need to be balanced like an economy — it just has to be reliably there when you finish something.`,
  },
  {
    title: 'A companion with a mood, not a mascot',
    body: `The Chibi reads real progress: euphoric on a good day, sad when you drift, blunt when things pile up. It gives the interface a stake in your week — the cheapest possible source of accountability, and the only one that doesn't nag by push notification.`,
  },
  {
    title: 'Focus Mode as subtraction',
    body: `One click and a cinematic wipe strips the app to tasks, habits, notes, schedule and the timer. Everything else is still there, just not in the room. Feature-rich products usually die of their own surface area; this is the escape hatch that lets Maable keep growing without becoming unusable on a bad day.`,
  },
  {
    title: 'Skins earned, never sold',
    body: `Cybercore, Acid Design, Shibuya Punk, ASCII, Kawaii — unlocked with XP and achievements, no purchases. The vibe is part of the reward loop instead of a paywall, which also means the visual identity gets to be loud without committing the whole product to one taste.`,
  },
];

const toolkit = [
  { kicker: 'DO THE WORK', title: 'Tasks & Habits', body: 'Routines that stick, with schedule alongside' },
  { kicker: 'REMEMBER IT', title: 'Notes & Flashcards', body: 'Write once, revise forever' },
  { kicker: 'STAY IN IT', title: 'Focus Timer', body: '5 / 25 / 45, running across every page' },
  { kicker: 'COME DOWN', title: 'Journal & Breathwork', body: 'Mood, prompts, streaks · box, 4-7-8, Wim Hof' },
  { kicker: 'FOR RESTLESS HANDS', title: 'ADHD Mode', body: 'Keystrokes float, combos count, the screen shakes' },
  { kicker: 'HAVE A LIFE', title: 'Moodboard, games, Spotify', body: 'Corkboard, tic-tac-toe, now-playing on the dashboard' },
];

const nextUp = [
  `Whether XP survives week three, or whether levels stop meaning anything once the novelty wears off. The honest test is retention after the first level-up, not signups.`,
  `Whether the companion's sad face lands as care or as guilt. There's a thin line, and it's different for every user — probably a setting eventually.`,
  `Whether ten tools in one product stays coherent. Focus Mode is the pressure valve, but the day it becomes the default view is the day the rest needs pruning.`,
];

const kicker = css("font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.24em;color:rgba(32,31,29,.66)");
const kickerDark = css("font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.24em;color:#b68235");
const plate = css("border:1px solid rgba(32,31,29,.2);background:#f7f5ef;padding:18px;border-radius:4px;box-shadow:0 3px 12px rgba(45,43,43,.12)");

export default function MaableCaseStudy() {
  return (
    <div className="maable-case" style={{ background: '#efece4', backgroundImage: GRAIN, backgroundBlendMode: 'multiply', minHeight: '100vh', color: '#201f1d', fontFamily: '"Lora", Georgia, serif' }}>

      {/* NAV */}
      <div style={css("display:flex;justify-content:space-between;align-items:center;gap:16px;padding:14px 7vw;border-bottom:1px solid rgba(32,31,29,.14);font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.14em;color:rgba(32,31,29,.66)")}>
        <Link to="/work" className="maable-link">← MAEHLO.COM</Link>
        <span>CASE 002 · MAABLE · 2026</span>
      </div>

      {/* HERO */}
      <section style={css("padding:clamp(60px,10vw,120px) 7vw 60px;display:grid;gap:26px")}>
        <div style={kicker}>GAMIFIED PRODUCTIVITY FOR REAL LIFE_</div>
        <h1 style={css("margin:0;font:300 clamp(56px,12vw,180px)/.88 'Cormorant Garamond',serif;letter-spacing:-.02em")}>
          maable<span style={{ color: '#c8402c' }}>.</span>
        </h1>
        <p style={css("margin:0;max-width:38ch;font:400 clamp(21px,2.4vw,28px)/1.45 'Lora',serif;text-wrap:pretty")}>
          Productivity apps are excellent at recording the work you didn't do. Maable pays you for the work you did.
        </p>
        <div style={css("display:flex;flex-wrap:wrap;gap:44px;border-top:1px solid rgba(32,31,29,.2);padding-top:20px;margin-top:10px;font:400 14px/1.5 'Lora',serif")}>
          <div style={css("display:grid;gap:5px")}><span style={css("font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.2em;color:rgba(32,31,29,.66)")}>ROLE</span><span>Design engineering — product, UI, front end</span></div>
          <div style={css("display:grid;gap:5px")}><span style={css("font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.2em;color:rgba(32,31,29,.66)")}>SCOPE</span><span>Web app · 10+ tools · 5 life areas</span></div>
          <div style={css("display:grid;gap:5px")}><span style={css("font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.2em;color:rgba(32,31,29,.66)")}>STATUS</span><span>Live — Focus Mode &amp; Companion shipped</span></div>
          <div style={css("display:grid;gap:5px")}>
            <span style={css("font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.2em;color:rgba(32,31,29,.66)")}>LINK</span>
            <a href="https://maable-web.vercel.app/" target="_blank" rel="noopener noreferrer" className="maable-link">maable-web.vercel.app ↗</a>
          </div>
        </div>
      </section>

      {/* SCREENS */}
      <section style={css("padding:0 7vw 70px")}>
        <div style={plate}><img src={maableDashboard} alt="Maable dashboard" style={css("display:block;width:100%;border-radius:2px")} /></div>
        <p style={css("margin:12px 0 0;font:400 21px/1.35 'Caveat',cursive;color:rgba(32,31,29,.66)")}>
          formerly &ldquo;Manageable&rdquo; — shorter name, same promise, fewer syllables to type at 2am
        </p>
        <div style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:clamp(22px,3.5vw,44px);margin-top:44px")}>
          <div style={css("display:grid;gap:12px")}>
            <div style={plate}><img src={maableBoard} alt="Maable moodboard" style={css("display:block;width:100%;border-radius:2px")} /></div>
            <span style={css("font:400 20px/1.35 'Caveat',cursive;color:rgba(32,31,29,.66)")}>the moodboard — a corkboard for photos and word clips, because not everything worth keeping is a task</span>
          </div>
          <div style={css("display:grid;gap:12px")}>
            <div style={plate}><img src={maableMenu} alt="Maable navigation menu" style={css("display:block;width:100%;border-radius:2px")} /></div>
            <span style={css("font:400 20px/1.35 'Caveat',cursive;color:rgba(32,31,29,.66)")}>the whole app in one menu — ten-plus tools sorted into explore, grow and connect</span>
          </div>
          <div style={css("display:grid;gap:12px")}>
            <div style={plate}><img src={maableCompanion} alt="Maable companion chat" style={css("display:block;width:100%;border-radius:2px")} /></div>
            <span style={css("font:400 20px/1.35 'Caveat',cursive;color:rgba(32,31,29,.66)")}>the companion — two bars and a curve for a face, and a chat box that actually starts your timer</span>
          </div>
        </div>
      </section>

      {/* ANALYSIS */}
      <section style={css("background:#14130f;color:#efece4;padding:84px 7vw;display:grid;gap:30px")}>
        <div style={kickerDark}>THE ANALYSIS_</div>
        <h2 style={css("margin:0;max-width:24ch;font:300 clamp(32px,5vw,64px)/1.08 'Cormorant Garamond',serif")}>Task apps punish. Games reward. Only one of those gets opened twice.</h2>
        <div style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:clamp(24px,4vw,58px);margin-top:8px")}>
          <div style={css("display:grid;gap:10px;align-content:start")}>
            <span style={css("font:300 62px/1 'Cormorant Garamond',serif;color:#b68235;font-variant-numeric:tabular-nums")}>01</span>
            <p style={css("margin:0;font:400 17px/1.65 'Lora',serif;color:rgba(239,236,228,.82)")}>A to-do list is a ledger of debt. It grows when you rest and never says thank you. The scoreboard is always negative.</p>
          </div>
          <div style={css("display:grid;gap:10px;align-content:start")}>
            <span style={css("font:300 62px/1 'Cormorant Garamond',serif;color:#b68235;font-variant-numeric:tabular-nums")}>02</span>
            <p style={css("margin:0;font:400 17px/1.65 'Lora',serif;color:rgba(239,236,228,.82)")}>Tools are scattered — timer here, notes there, journal in a fourth tab. Every switch is a chance to leave and not come back.</p>
          </div>
          <div style={css("display:grid;gap:10px;align-content:start")}>
            <span style={css("font:300 62px/1 'Cormorant Garamond',serif;color:#b68235;font-variant-numeric:tabular-nums")}>03</span>
            <p style={css("margin:0;font:400 17px/1.65 'Lora',serif;color:rgba(239,236,228,.82)")}>Nothing in these apps is on your side. No object in the interface notices you, misses you, or has an opinion about your week.</p>
          </div>
        </div>
        <p style={css("margin:0;font:400 25px/1.4 'Caveat',cursive;color:#b68235;max-width:48ch")}>so the approach: one surface for everything, XP on the way out instead of guilt, and a companion that visibly cares whether you show up.</p>
      </section>

      {/* DECISIONS HEADER */}
      <section style={css("padding:90px 7vw 40px;display:grid;gap:14px")}>
        <div style={kicker}>THE DECISIONS_</div>
        <h2 style={css("margin:0;max-width:24ch;font:300 clamp(32px,5vw,62px)/1.08 'Cormorant Garamond',serif")}>Four calls the whole product hangs on.</h2>
      </section>

      {/* DECISIONS LIST */}
      <section style={css("padding:0 7vw 80px;display:grid;gap:0;border-top:1px solid rgba(32,31,29,.2)")}>
        {decisions.map(d => (
          <div key={d.title} style={css("display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.7fr);gap:clamp(18px,5vw,70px);padding:30px 0;border-bottom:1px solid rgba(32,31,29,.14)")}>
            <h3 style={css("margin:0;font:300 clamp(26px,3.2vw,40px)/1.1 'Cormorant Garamond',serif")}>{d.title}</h3>
            <p style={css("margin:0;font:400 17px/1.7 'Lora',serif;color:rgba(32,31,29,.82);text-align:justify;text-wrap:pretty")}>{d.body}</p>
          </div>
        ))}
      </section>

      {/* WHAT'S IN IT */}
      <section style={css("padding:0 7vw 90px;display:grid;gap:26px")}>
        <div style={kicker}>WHAT&apos;S IN IT_</div>
        <div style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:clamp(16px,2.4vw,28px)")}>
          {toolkit.map(t => (
            <div key={t.title} style={css("border:1px solid rgba(32,31,29,.2);border-radius:4px;padding:20px;display:grid;gap:7px;background:#f7f5ef")}>
              <span style={css("font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.18em;color:rgba(32,31,29,.66)")}>{t.kicker}</span>
              <span style={css("font:300 30px/1.05 'Cormorant Garamond',serif")}>{t.title}</span>
              <span style={css("font:400 15px/1.5 'Lora',serif;color:rgba(32,31,29,.72)")}>{t.body}</span>
            </div>
          ))}
        </div>
        <p style={css("margin:0;font:400 21px/1.4 'Caveat',cursive;color:rgba(32,31,29,.66)")}>five life areas hold it together: career, student, hobbies, reading corner, and — genuinely — feeling lazy. rest days count.</p>
      </section>

      {/* WHAT I'D WATCH NEXT */}
      <section style={css("background:#14130f;color:#efece4;padding:80px 7vw;display:grid;gap:22px")}>
        <div style={kickerDark}>WHAT I&apos;D WATCH NEXT_</div>
        <div style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:clamp(22px,4vw,56px)")}>
          {nextUp.map((t, i) => (
            <p key={i} style={css("margin:0;font:400 17px/1.7 'Lora',serif;color:rgba(239,236,228,.8)")}>{t}</p>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={css("padding:0 7vw 90px;padding-top:70px")}>
        <a href="https://maable-web.vercel.app/" target="_blank" rel="noopener noreferrer" className="maable-cta"
          style={css("display:grid;gap:14px;border:1px solid rgba(32,31,29,.24);border-radius:4px;padding:clamp(28px,5vw,54px);background:#f7f5ef;color:#201f1d")}>
          <span style={kicker}>IT&apos;S LIVE_</span>
          <span style={css("font:300 clamp(28px,4.4vw,58px)/1.05 'Cormorant Garamond',serif")}>Go use it → maable-web.vercel.app</span>
          <span style={css("max-width:52ch;font:400 17px/1.7 'Lora',serif;color:rgba(32,31,29,.78)")}>Free to start. Focus Mode and the Companion are shipped; skins are earned, not bought.</span>
        </a>
      </section>

      {/* FOOTER */}
      <section style={css("background:#14130f;color:#efece4;padding:70px 7vw 30px;display:grid;gap:20px")}>
        <p style={css("margin:0;max-width:26ch;font:300 clamp(30px,4.6vw,58px)/1.1 'Cormorant Garamond',serif")}>Want one of these for your thing?</p>
        <a href="mailto:malvinboye@gmail.com" className="maable-link" style={css("justify-self:start;font:400 clamp(20px,2.6vw,30px)/1 'Lora',serif;color:#b68235;border-bottom:1px solid rgba(182,130,53,.6);padding-bottom:8px")}>malvinboye@gmail.com</a>
        <div style={css("display:flex;flex-wrap:wrap;justify-content:space-between;gap:16px;border-top:1px solid rgba(239,236,228,.18);padding-top:18px;margin-top:36px;font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.12em;color:rgba(239,236,228,.55)")}>
          <span>MALVIN BOYE © 2026</span><span>SEE YOU SPACE COWBOY…</span>
          <Link to="/work" style={{ color: 'rgba(239,236,228,.55)' }}>BACK TO MAEHLO.COM</Link>
        </div>
      </section>

    </div>
  );
}
