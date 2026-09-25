import { useEffect } from 'react';

// ---------------------------------------------------------------------------
// The cursor picker (rev. 2). Ported from the prototype's second <helmet>
// script, which every page carried verbatim; here it's one shared component,
// mounted once in App. The DOM code is moved, not rewritten: the chip is
// injected into whichever invert button is on the page (found each frame, so
// it survives route changes and React re-rendering the button's label), and
// the cursors are generated from character grids as SVG data URIs.
//
// It applies on every page, including ones with no invert button (the Works
// Stack): the chosen cursor lives in localStorage["mh-cursor"] and is applied
// as html[data-cur], synced across tabs via the storage event.
// ---------------------------------------------------------------------------

const G = {
  arrow: { hx: 1, hy: 1, g: ['K...........', 'KK..........', 'KKK.........', 'KKKK........', 'KKKKK.......', 'KKKKKK......', 'KKKKKKK.....', 'KKKKKKKK....', 'KKKKKKKKK...', 'KKKK........', 'KKK.........', 'KK..........', 'K...........'] },
  koi: { hx: 15, hy: 4, g: ['................', '.K......KKKKK...', 'KKK...KKKKKKKK..', 'KKKKKKKKKKKKKKK.', '.KKKKKKKKKKKKWK.', 'KKKKKKKKKKKKKKK.', 'KKK...KKKKKKKK..', '.K......KKKKK...', '................'] },
  survey: { hx: 7, hy: 7, g: ['...............', '.......K.......', '.......K.......', '.......K.......', '.......K.......', '...............', '...............', '.KKKK..K..KKKK.', '...............', '...............', '.......K.......', '.......K.......', '.......K.......', '.......K.......', '...............'] },
  pencil: { hx: 1, hy: 14, g: ['...........KK...', '..........KKKK..', '.........KKWKK..', '........KKKKK...', '.......KKKKK....', '......KKKKK.....', '.....KKKKK......', '....KKKKK.......', '...KKKKK........', '...KKKK.........', '..KKKK..........', '..KWK...........', '.KKK............', '.KK.............', 'KK..............', '................'] },
  pellet: { hx: 4, hy: 4, g: ['..KKKK..', '.KKKKKK.', 'KKWKKKKK', 'KKKKKKKK', 'KKKKKKKK', 'KKKKKKKK', '.KKKKKK.', '..KKKK..'] },
};
const OPTS = [['site', 'Site default'], ['arrow', 'Pixel arrow'], ['koi', 'Koi'], ['survey', 'Survey mark'], ['pencil', 'Drafting pencil'], ['pellet', 'Pellet']];
const FRAME = '0 -2px 0 0 #141414,0 2px 0 0 #141414,-2px 0 0 0 #141414,2px 0 0 0 #141414';

// Auto-outlined in white on all eight neighbours, so every cursor stays
// visible in invert mode.
function svg(c, px) {
  const g = c.g, h = g.length + 2, w = g[0].length + 2;
  let r = '';
  const at = (x, y) => (y >= 0 && y < g.length && x >= 0 && x < g[0].length ? g[y][x] : '.');
  for (let y = -1; y <= g.length; y++) for (let x = -1; x <= g[0].length; x++) {
    const ch = at(x, y);
    let f = null;
    if (ch === 'K') f = '#141414'; else if (ch === 'W') f = '#fff';
    else { for (let dy = -1; dy <= 1 && !f; dy++) for (let dx = -1; dx <= 1; dx++) if (at(x + dx, y + dy) !== '.') { f = '#fff'; break; } }
    if (f) r += '<rect x="' + (x + 1) + '" y="' + (y + 1) + '" width="1" height="1" fill="' + f + '"/>';
  }
  return 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="' + w * px + '" height="' + h * px + '" viewBox="0 0 ' + w + ' ' + h + '" shape-rendering="crispEdges">' + r + '</svg>');
}

export default function CursorPicker() {
  useEffect(() => {
    let css = '';
    Object.keys(G).forEach((k) => {
      const u = svg(G[k], 2);
      css += 'html[data-cur="' + k + '"] body,html[data-cur="' + k + '"] body *{cursor:url("' + u + '") ' + (G[k].hx + 1) * 2 + ' ' + (G[k].hy + 1) * 2 + ',auto!important}'
        + 'html[data-cur="' + k + '"] body :is(a,button,[role=button],select,label,summary,[tabindex]:not([tabindex="-1"])),html[data-cur="' + k + '"] body :is(a,button,[role=button]) *{cursor:pointer!important}'
        + 'html[data-cur="' + k + '"] body :is(input,textarea){cursor:text!important}';
    });
    const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

    const cur = () => { try { return localStorage.getItem('mh-cursor') || 'site'; } catch (e) { return 'site'; } };
    let open = false, anchor = null, raf = 0, alive = true;

    const chip = document.createElement('span'), pop = document.createElement('div');
    chip.setAttribute('role', 'button'); chip.tabIndex = 0; chip.setAttribute('aria-haspopup', 'true'); chip.setAttribute('aria-expanded', 'false'); chip.title = 'Change cursor';
    chip.style.cssText = 'display:inline-flex;align-items:center;justify-content:center;vertical-align:middle;margin:0 -2px 0 8px;padding:0 0 0 8px;align-self:stretch;border-left:2px solid currentColor;cursor:pointer';
    const ci = document.createElement('img'); ci.alt = ''; ci.style.cssText = 'display:block;width:14px;height:14px;image-rendering:pixelated';
    chip.appendChild(ci);
    const lab = document.createElement('span'); lab.textContent = 'Cursor'; lab.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)'; chip.appendChild(lab);

    pop.setAttribute('role', 'menu'); pop.setAttribute('aria-label', 'Cursor');
    pop.style.cssText = "position:fixed;z-index:9991;display:none;min-width:200px;background:#fff;font:19px/1 'VT323',ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#141414;box-shadow:" + FRAME + ',6px 6px 0 #141414';
    const head = document.createElement('div'); head.textContent = 'Cursor · pick one'; head.style.cssText = 'padding:4px 10px;background:#141414;color:#fff;font-size:15px;letter-spacing:.16em'; pop.appendChild(head);

    let toggle;
    const paint = () => {
      const c = cur(); ci.src = c === 'site' ? svg(G.arrow, 1) : svg(G[c], 1);
      items.forEach((p) => { const on = p[0].dataset.k === c; p[0].setAttribute('aria-checked', on ? 'true' : 'false'); p[1].style.background = on ? '#8b1a1a' : 'transparent'; });
    };
    const apply = () => { const c = cur(); if (c === 'site') document.documentElement.removeAttribute('data-cur'); else document.documentElement.setAttribute('data-cur', c); paint(); };

    const items = OPTS.map((o) => {
      const b = document.createElement('button'); b.type = 'button'; b.setAttribute('role', 'menuitemradio'); b.dataset.k = o[0];
      b.style.cssText = 'display:flex;align-items:center;gap:10px;width:100%;padding:6px 10px;border:0;border-top:2px solid #141414;background:#fff;color:#141414;font:inherit;letter-spacing:inherit;text-transform:inherit;text-align:left;cursor:pointer';
      const im = document.createElement('span'); im.style.cssText = 'flex:none;width:28px;height:28px;display:flex;align-items:center;justify-content:center';
      if (o[0] !== 'site') { const i2 = document.createElement('img'); i2.alt = ''; i2.src = svg(G[o[0]], 1); i2.style.cssText = 'max-width:28px;max-height:28px;transform:scale(1.5);image-rendering:pixelated'; im.appendChild(i2); }
      else { im.textContent = '↖'; im.style.fontSize = '22px'; }
      const t = document.createElement('span'); t.textContent = o[1]; t.style.flex = '1';
      const m = document.createElement('span'); m.setAttribute('aria-hidden', 'true'); m.style.cssText = 'width:9px;height:9px;flex:none;box-shadow:0 0 0 2px #141414';
      b.appendChild(im); b.appendChild(t); b.appendChild(m);
      b.addEventListener('mouseenter', () => { b.style.background = '#141414'; b.style.color = '#fff'; m.style.boxShadow = '0 0 0 2px #fff'; });
      b.addEventListener('mouseleave', () => { b.style.background = '#fff'; b.style.color = '#141414'; m.style.boxShadow = '0 0 0 2px #141414'; });
      b.addEventListener('click', () => { try { localStorage.setItem('mh-cursor', o[0]); } catch (e) { /* private mode */ } apply(); toggle(false); chip.focus(); });
      pop.appendChild(b); return [b, m];
    });

    const findAnchor = () => {
      const bs = document.querySelectorAll('button[aria-pressed]');
      for (let i = 0; i < bs.length; i++) if (/invert|light/i.test(bs[i].textContent)) return bs[i];
      return null;
    };
    // The picker lives inside the invert button, after a divider, so it
    // takes its place in the layout instead of floating over neighbours.
    const place = () => {
      if (!anchor || !anchor.isConnected) anchor = findAnchor();
      if (!anchor) return;
      if (chip.parentNode !== anchor) anchor.appendChild(chip);
      const r = anchor.getBoundingClientRect();
      if (!r.width || r.bottom < 0 || r.top > window.innerHeight) { if (open) toggle(false); return; }
      if (open) {
        const c = chip.getBoundingClientRect(), pw = pop.offsetWidth, ph = pop.offsetHeight;
        const pl = Math.min(window.innerWidth - pw - 10, Math.max(8, c.right - pw));
        let pt = r.bottom + 10;
        if (pt + ph > window.innerHeight - 8) pt = r.top - ph - 10;
        pop.style.left = pl + 'px'; pop.style.top = Math.max(8, pt) + 'px';
      }
    };
    toggle = (v) => {
      open = v; pop.style.display = v ? 'block' : 'none'; chip.setAttribute('aria-expanded', v ? 'true' : 'false');
      if (v) { place(); const a = pop.querySelector('[aria-checked="true"]'); if (a) a.focus(); }
    };

    // Clicking the chip must not toggle invert: stop propagation, at every
    // level React or the button might be listening at.
    const onChipClick = (e) => { e.stopPropagation(); e.preventDefault(); toggle(!open); };
    const onChipKey = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); e.preventDefault(); toggle(!open); } };
    const stop = (e) => e.stopPropagation();
    chip.addEventListener('click', onChipClick);
    chip.addEventListener('keydown', onChipKey);
    ['pointerdown', 'mousedown', 'pointerup', 'mouseup'].forEach((t) => chip.addEventListener(t, stop));
    pop.addEventListener('click', stop);
    const onDocClick = () => { if (open) toggle(false); };
    const onDocKey = (e) => { if (open && e.key === 'Escape') { toggle(false); chip.focus(); } };
    const onStorage = (e) => { if (e.key === 'mh-cursor') apply(); };
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onDocKey);
    window.addEventListener('storage', onStorage);

    document.body.appendChild(pop);
    apply();
    const loop = () => { if (!alive) return; place(); raf = requestAnimationFrame(loop); };
    loop();

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onDocKey);
      window.removeEventListener('storage', onStorage);
      chip.remove(); pop.remove(); st.remove();
    };
  }, []);

  return null;
}
