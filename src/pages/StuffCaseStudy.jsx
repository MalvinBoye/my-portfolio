import React from 'react';
import { Link } from 'react-router-dom';
import './StuffCaseStudy.css';
import { css, GRAIN } from '../utils/cssString';
import stuff1c from '../images/stuff-1c.png';
import stuff3a from '../images/stuff-3a.png';
import stuff4a from '../images/stuff-4a.png';
import bagJala from '../images/bag-jala.png';
import bagGracias from '../images/bag-gracias.png';
import bagJala2 from '../images/bag-jala-2.png';
import petMeeks from '../images/pet-meeks.png';

const findings = [
  `The list is a chore before it's a tool. Every tick is a reminder of the ones you didn't tick.`,
  `People buy the same thing every third shop and never notice. Memory isn't the problem; it's noticing.`,
  `Finishing is never rewarded. The app goes quiet the moment you actually do the thing.`,
];

const screens = [
  { src: stuff1c, alt: 'Stuff list screen', cap: `the list — notes under items instead of quantities, because “a lot of cheese” is the real unit` },
  { src: stuff3a, alt: 'Stuff big shop screen', cap: `one field, no forms. type and it lands. Meeks interrupts when you're about to buy rice again` },
  { src: stuff4a, alt: 'Stuff shop and customise screen', cap: `shika — earned by finishing a shop, spent on bags, pets and skins. the only economy here rewards doing the boring thing` },
];

const drawn = [
  { src: bagJala, alt: 'Jala bag' },
  { src: bagGracias, alt: 'Gracias bag' },
  { src: bagJala2, alt: 'Second bag' },
  { src: petMeeks, alt: 'Meeks the cat' },
];

const kicker = css("font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.24em;color:rgba(32,31,29,.66)");
const kickerDark = css("font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.24em;color:#b68235");
const plate = css("border:1px solid rgba(32,31,29,.2);background:#f7f5ef;padding:14px;border-radius:4px;box-shadow:0 3px 12px rgba(45,43,43,.12)");

export default function StuffCaseStudy() {
  return (
    <div className="stuff-case" style={{ background: '#efece4', backgroundImage: GRAIN, backgroundBlendMode: 'multiply', minHeight: '100vh', color: '#201f1d', fontFamily: '"Lora", Georgia, serif' }}>

      {/* NAV */}
      <div style={css("display:flex;justify-content:space-between;align-items:center;gap:16px;padding:14px 7vw;border-bottom:1px solid rgba(32,31,29,.14);font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.14em;color:rgba(32,31,29,.66)")}>
        <Link to="/" className="stuff-link">← MAEHLO.COM</Link>
        <span>CASE 001 · STUFF · 2026</span>
      </div>

      {/* TITLE */}
      <section style={css("padding:clamp(60px,10vw,120px) 7vw 60px;display:grid;gap:26px")}>
        <div style={kicker}>A GROCERY APP FOR A BRAIN THAT WANDERS_</div>
        <h1 style={css("margin:0;font:300 clamp(64px,13vw,190px)/.88 'Cormorant Garamond',serif;letter-spacing:-.02em")}>
          stuff<span style={{ color: '#c8402c' }}>.</span>
        </h1>
        <p style={css("margin:0;max-width:36ch;font:400 clamp(21px,2.4vw,28px)/1.45 'Lora',serif;text-wrap:pretty")}>
          Lists don't fail ADHD people because they're badly organised. They fail because opening one feels like being told off.
        </p>
        <div style={css("display:flex;flex-wrap:wrap;gap:44px;border-top:1px solid rgba(32,31,29,.2);padding-top:20px;margin-top:10px;font:400 14px/1.5 'Lora',serif")}>
          <div style={css("display:grid;gap:5px")}><span style={css("font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.2em;color:rgba(32,31,29,.66)")}>ROLE</span><span>Research, product, UI, illustration</span></div>
          <div style={css("display:grid;gap:5px")}><span style={css("font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.2em;color:rgba(32,31,29,.66)")}>SCOPE</span><span>iOS concept, 9 rounds, ~40 screens</span></div>
          <div style={css("display:grid;gap:5px")}><span style={css("font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.2em;color:rgba(32,31,29,.66)")}>STATUS</span><span>Design complete · build next</span></div>
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
        <p style={css("margin:0;font:400 25px/1.4 'Caveat',cursive;color:#b68235;max-width:44ch")}>so the fix: make it feel like a scrap of paper, give it a cat with opinions, and actually pay people for finishing.</p>
      </section>

      {/* THE LANGUAGE */}
      <section style={css("padding:90px 7vw;display:grid;gap:14px")}>
        <div style={kicker}>THE LANGUAGE_</div>
        <h2 style={css("margin:0;max-width:22ch;font:300 clamp(34px,5vw,66px)/1.08 'Cormorant Garamond',serif")}>Kraft paper, biro scribble, and nothing that looks like an app.</h2>
        <p style={css("margin:6px 0 0;max-width:58ch;font:400 17px/1.75 'Lora',serif;color:rgba(32,31,29,.82);text-align:justify;text-wrap:pretty")}>Every surface is a card torn out of a notebook. Items are handwritten. The bag skins and the cat are drawn by hand, badly on purpose — a stock icon set would have made it a productivity app, which is the one thing it must never be.</p>
      </section>

      {/* SCREENS */}
      <section style={css("padding:0 7vw 40px;display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:clamp(24px,4vw,54px)")}>
        {screens.map(s => (
          <div key={s.alt} style={css("display:grid;gap:12px")}>
            <div style={plate}><img src={s.src} alt={s.alt} style={css("display:block;width:100%;border-radius:2px")} /></div>
            <span style={css("font:400 20px/1.35 'Caveat',cursive;color:rgba(32,31,29,.66)")}>{s.cap}</span>
          </div>
        ))}
      </section>

      {/* DRAWN, NOT GENERATED */}
      <section style={css("padding:60px 7vw 90px;display:grid;gap:26px")}>
        <div style={kicker}>DRAWN, NOT GENERATED_</div>
        <div style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:clamp(20px,4vw,50px)")}>
          {drawn.map(d => (
            <div key={d.alt} style={css("border:1px solid rgba(32,31,29,.2);background:#f7f5ef;padding:16px;border-radius:4px")}>
              <img src={d.src} alt={d.alt} style={css("display:block;width:100%;height:200px;object-fit:contain")} />
            </div>
          ))}
        </div>
      </section>

      {/* CLOSE */}
      <section style={css("background:#14130f;color:#efece4;padding:80px 7vw 30px;display:grid;gap:20px")}>
        <p style={css("margin:0;max-width:26ch;font:300 clamp(32px,5vw,64px)/1.1 'Cormorant Garamond',serif")}>Want one of these for your thing?</p>
        <a href="mailto:malvinboye@gmail.com" className="stuff-link" style={css("justify-self:start;font:400 clamp(20px,2.6vw,30px)/1 'Lora',serif;color:#b68235;border-bottom:1px solid rgba(182,130,53,.6);padding-bottom:8px")}>malvinboye@gmail.com</a>
        <div style={css("display:flex;flex-wrap:wrap;justify-content:space-between;gap:16px;border-top:1px solid rgba(239,236,228,.18);padding-top:18px;margin-top:36px;font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.12em;color:rgba(239,236,228,.55)")}>
          <span>MALVIN BOYE © 2026</span><span>SEE YOU SPACE COWBOY…</span>
          <Link to="/" style={{ color: 'rgba(239,236,228,.55)' }}>BACK TO MAEHLO.COM</Link>
        </div>
      </section>

    </div>
  );
}
