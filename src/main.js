import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ?static disables all motion — QA captures + safety hatch */
const staticMode = new URLSearchParams(location.search).has('static');
const reduceMotion = staticMode || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (staticMode) document.documentElement.classList.add('is-static');

/* ── fold-out menu ─────────────────────────────────────── */
const fold = document.querySelector('.fold');
const burger = document.querySelector('.bar__burger');

function setFold(open) {
  fold.classList.toggle('is-open', open);
  document.body.classList.toggle('nav-open', open);
  burger.setAttribute('aria-expanded', String(open));
}
burger.addEventListener('click', (e) => {
  e.stopPropagation();
  setFold(!fold.classList.contains('is-open'));
});
document.addEventListener('click', (e) => {
  if (fold.classList.contains('is-open') && !fold.contains(e.target)) setFold(false);
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') setFold(false);
});
/* ?nav opens the fold on load — QA hook */
if (new URLSearchParams(location.search).has('nav')) setFold(true);

/* ── menu tabs ─────────────────────────────────────────── */
const chips = document.querySelectorAll('.chip');
const panels = document.querySelectorAll('.panel');

chips.forEach((chip) => {
  chip.addEventListener('click', () => {
    if (chip.classList.contains('is-active')) return;
    chips.forEach((c) => { c.classList.remove('is-active'); c.setAttribute('aria-selected', 'false'); });
    chip.classList.add('is-active');
    chip.setAttribute('aria-selected', 'true');

    const id = chip.dataset.tab;
    let active = null;
    panels.forEach((p) => {
      const on = p.dataset.panel === id;
      p.classList.toggle('is-active', on);
      p.hidden = !on;
      if (on) active = p;
    });

    if (!reduceMotion && active) {
      gsap.fromTo(active.querySelectorAll('.row, .flourish, .secret, .menu-note'),
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.045, ease: 'power2.out', overwrite: true, clearProps: 'all' });
    }
    ScrollTrigger.refresh();
  });
});

/* ── order: pickup / delivery toggle ───────────────────── */
const modes = document.querySelectorAll('.mode');
modes.forEach((mode) => {
  mode.addEventListener('click', () => {
    modes.forEach((m) => { m.classList.remove('is-active'); m.setAttribute('aria-selected', 'false'); });
    mode.classList.add('is-active');
    mode.setAttribute('aria-selected', 'true');
  });
});

/* placeholder until the ordering provider link is wired */
document.querySelector('[data-order]')?.addEventListener('click', (e) => {
  e.preventDefault();
  const btn = e.currentTarget;
  const mode = document.querySelector('.mode.is-active')?.dataset.mode ?? 'pickup';
  const original = btn.textContent;
  btn.textContent = mode === 'pickup' ? 'Pickup — coming right up' : 'Delivery — on its way';
  setTimeout(() => { btn.textContent = original; }, 2400);
});

/* ── reservation form (placeholder until a booking link) ── */
const form = document.querySelector('[data-reserve]');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  form.querySelector('.form__submit').style.display = 'none';
  form.querySelector('.form__done').hidden = false;
});

/* ── entrance + scroll motion ──────────────────────────── */
if (!reduceMotion) {
  const intro = gsap.timeline();
  intro
    .from('.stage', { opacity: 0, duration: 0.7, ease: 'power2.out' })
    .from('.stage__title > span, .stage__title--page > span', {
      yPercent: 60, opacity: 0, duration: 1, stagger: 0.12, ease: 'power4.out',
    }, '-=0.3')
    .from('.stage__script, .bar, .stage__socials', {
      opacity: 0, y: 14, duration: 0.7, stagger: 0.08, ease: 'power3.out',
    }, '-=0.6')
    .from('.rail__card', {
      opacity: 0, x: 26, duration: 0.8, stagger: 0.1, ease: 'power3.out',
    }, '-=0.55');

  /* Simple [data-reveal] fades are CSS scroll-driven animations.
     GSAP stays for the load-in timeline, menu-tab swaps, and the
     scrubbed hero drift. There is no SplitText, Flip, or pin. */
  const stageImg = document.querySelector('.shell--split .stage__media img');
  if (stageImg) {
    gsap.to(stageImg, {
      yPercent: 6, ease: 'none',
      scrollTrigger: { trigger: '.flow', start: 'top top', end: 'bottom bottom', scrub: 0.6 },
    });
  }
}

/* ── sun-dust particles ────────────────────────────────────
   Sea-spray specks in Cycladic white / Santorini mist /
   Bougainvillea, plus a few slow-turning ✺ sun-sparks —
   the brand's own glyph, drifting like dust at golden hour. */

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReduced) {
  document.querySelectorAll('.stage__dust').forEach((c) => c.remove());
} else {
  /* in ?static mode draw a single frame so captures still show the dust */
  document.querySelectorAll('.stage__dust').forEach((c) => initDust(c, staticMode));
}

function initDust(canvas, singleFrame) {
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const COLORS = ['253, 252, 248', '179, 223, 255', '232, 183, 179'];
  let w = 0, h = 0, parts = [], sparks = [], raf = 0;

  function size() {
    const r = canvas.getBoundingClientRect();
    w = r.width; h = r.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed();
  }

  function seed() {
    const n = Math.max(16, Math.min(36, Math.round((w * h) / 26000)));
    parts = Array.from({ length: n }, () => spawn(true));
    sparks = Array.from({ length: 3 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 5 + Math.random() * 5,
      a: Math.random() * Math.PI * 2,
      spin: (Math.random() < 0.5 ? -1 : 1) * (0.002 + Math.random() * 0.003),
      vy: 0.06 + Math.random() * 0.08,
      sway: Math.random() * Math.PI * 2,
      o: 0.14 + Math.random() * 0.12,
    }));
  }

  function spawn(anywhere) {
    return {
      x: Math.random() * w,
      y: anywhere ? Math.random() * h : h + 6,
      r: 0.7 + Math.random() * 1.9,
      vy: 0.1 + Math.random() * 0.22,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: 0.004 + Math.random() * 0.008,
      swayAmp: 0.2 + Math.random() * 0.45,
      o: 0.12 + Math.random() * 0.3,
      c: COLORS[Math.floor(Math.random() * COLORS.length)],
    };
  }

  function star(s) {
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.rotate(s.a);
    ctx.strokeStyle = `rgba(253, 252, 248, ${s.o})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -s.r);
      ctx.rotate(Math.PI / 4);
    }
    ctx.stroke();
    ctx.restore();
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (const p of parts) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.c}, ${p.o})`;
      ctx.fill();
    }
    for (const s of sparks) star(s);
  }

  function tick() {
    for (const p of parts) {
      p.y -= p.vy;
      p.sway += p.swaySpeed;
      p.x += Math.sin(p.sway) * p.swayAmp * 0.3;
      if (p.y < -6) Object.assign(p, spawn(false));
    }
    for (const s of sparks) {
      s.y -= s.vy;
      s.a += s.spin;
      s.sway += 0.003;
      s.x += Math.sin(s.sway) * 0.15;
      if (s.y < -12) { s.y = h + 12; s.x = Math.random() * w; }
    }
    draw();
    raf = requestAnimationFrame(tick);
  }

  const ro = new ResizeObserver(size);
  ro.observe(canvas);
  size();
  if (singleFrame) { draw(); return; }
  tick();
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else raf = requestAnimationFrame(tick);
  });
}
