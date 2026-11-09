/* ?static disables motion — QA captures. Content stays visible either way. */
const staticMode = new URLSearchParams(location.search).has('static');
const reduceMotion = staticMode || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (staticMode) document.documentElement.classList.add('is-static');

const mast = document.querySelector('.mast');
function syncMast() {
  if (!mast) return;
  document.documentElement.style.setProperty('--mast-h', `${mast.offsetHeight}px`);
}
syncMast();
window.addEventListener('resize', syncMast);

/* ── fold-out menu ─────────────────────────────────────── */
const fold = document.querySelector('.fold');
const burger = document.querySelector('.mast__burger');

function setFold(open) {
  if (!fold || !burger) return;
  fold.classList.toggle('is-open', open);
  document.body.classList.toggle('nav-open', open);
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  fold.setAttribute('aria-hidden', String(!open));
  fold.inert = !open;
}
if (fold && burger) {
  fold.inert = true;
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
  if (new URLSearchParams(location.search).has('nav')) setFold(true);
}

/* ── menu tabs ─────────────────────────────────────────── */
const chips = document.querySelectorAll('.chip');
const panels = document.querySelectorAll('.panel');
let gsapPromise;

const chipList = [...chips];
const chipHint = document.querySelector('.chips-hint');
const chipStrip = document.querySelector('.chips');

function revealChip(chip) {
  if (!chipStrip) return;
  const pad = 12;
  const start = chip.offsetLeft - pad;
  const end = chip.offsetLeft + chip.offsetWidth + pad;
  const viewStart = chipStrip.scrollLeft;
  const viewEnd = viewStart + chipStrip.clientWidth;
  let left = viewStart;
  if (start < viewStart) left = Math.max(0, start);
  else if (end > viewEnd) left = end - chipStrip.clientWidth;
  if (left !== viewStart) {
    chipStrip.scrollTo({ left, behavior: reduceMotion ? 'auto' : 'smooth' });
  }
}

function syncChipHint() {
  if (!chipHint || !chipStrip) return;
  chipHint.hidden = chipStrip.scrollWidth <= chipStrip.clientWidth + 8;
}
syncChipHint();
window.addEventListener('resize', syncChipHint);

chipList.forEach((chip, index) => {
  chip.addEventListener('focus', () => revealChip(chip));
  chip.addEventListener('keydown', (e) => {
    const key = e.key;
    let next = null;
    if (key === 'ArrowRight') next = chipList[index + 1];
    else if (key === 'ArrowLeft') next = chipList[index - 1];
    else if (key === 'Home') next = chipList[0];
    else if (key === 'End') next = chipList[chipList.length - 1];
    if (!next || next === chip) return;
    e.preventDefault();
    next.focus();
  });
});

chips.forEach((chip) => {
  chip.addEventListener('click', async () => {
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

    const sheet = document.querySelector('.menu-sheet');
    if (sheet && sheet.getBoundingClientRect().top < 0) {
      sheet.scrollIntoView({ block: 'start', behavior: reduceMotion ? 'auto' : 'smooth' });
    }

    if (!reduceMotion && active) {
      gsapPromise ??= import('gsap');
      const { default: gsap } = await gsapPromise;
      gsap.fromTo(active.querySelectorAll('.row, .flourish, .secret, .menu-note'),
        { y: 10 },
        { y: 0, duration: 0.4, stagger: 0.025, ease: 'power2.out', overwrite: true, clearProps: 'transform' });
    }
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

/* Set ORDER_URL when the ordering provider link exists. The button stays in the page and stays hidden until then. */
const ORDER_URL = '';
const orderBtn = document.querySelector('[data-order]');
if (orderBtn && ORDER_URL) {
  orderBtn.href = ORDER_URL;
  orderBtn.hidden = false;
  orderBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const original = orderBtn.textContent;
    orderBtn.textContent = 'Opening the order';
    setTimeout(() => { orderBtn.textContent = original; }, 2400);
  });
}

/* Set a URL to show that icon. Instagram is linked in the HTML. */
const SOCIAL_URLS = { tiktok: '', facebook: '' };
document.querySelectorAll('[data-social]').forEach((link) => {
  const url = SOCIAL_URLS[link.dataset.social];
  if (!url) return;
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.hidden = false;
});

/* ── reservation form → Netlify Forms ── */
const form = document.querySelector('[data-reserve]');
form?.addEventListener('submit', async (e) => {
  if (typeof fetch !== 'function') return;
  e.preventDefault();
  const submit = form.querySelector('.form__submit');
  const done = form.querySelector('.form__done');
  const body = new URLSearchParams(new FormData(form)).toString();
  try {
    const res = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
    if (!res.ok) throw new Error('form');
    submit.hidden = true;
    done.hidden = false;
    done.focus?.();
  } catch {
    form.submit();
  }
});
