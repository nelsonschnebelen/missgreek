# Miss Greek · Beach Bar & Grill

Marketing site for Miss Greek — a Greek beach bar & grill in Miami.
*Your Greek summer. All year.*

## Stack

- **Vite** (multi-page, no framework)
- **GSAP + ScrollTrigger** for entrance and scroll reveals
- Vanilla canvas for the hero "sun dust" particles
- Native scrolling — no smooth-scroll library

## Pages

| Page | File |
|---|---|
| Home | `index.html` |
| Menu | `menu.html` |
| Order Online | `order.html` |
| About | `about.html` |
| Book a Table | `reservation.html` |

## Brand

Taken from the client's brand book and voice guidelines.

| Token | Hex | Role |
|---|---|---|
| Deep Aegean | `#004FC1` | Primary — headings, CTAs |
| Ouzo Glow | `#BD646D` | Accent — prices, script notes |
| Erato's Midnight | `#003575` | Body text |
| Miami Dawn | `#00A5F2` | Focus states |
| Santorini Mist | `#B3DFFF` | Light accent |
| Bougainvillea | `#E8B7B3` | Script on dark |
| Seashell Sand | `#EDE6DA` | Page canvas |

**Type.** The brand book specifies Londona (display), Neutra (body) and
lettermagic (script). Those are commercial faces and are not licensed here,
so the site currently ships with free stand-ins:

- **Yeseva One** → Londona (display, uppercase)
- **Jost** → Neutra (body)
- **Caveat** → lettermagic (her handwriting)

To swap in the real faces: drop the font files in `public/fonts/`, add
`@font-face` rules at the top of `src/style.css`, and update the three
`--font-*` custom properties in `:root`.

**Logo.** The lockup lives in `public/images/logo/` (`logo-primary.svg` on light
panels, `logo-light.svg` for dark grounds, `favicon.svg` plus the 32 and 180
PNGs). It sits in the header pill, the footer, and the About sign-off. Per the
brand book it is never placed bare over imagery — frame it, or keep it on white.

## Develop

```bash
npm install
npm run dev
```

```bash
npm run build
```

`?static` on any URL disables all motion (used for QA screenshots).
`?nav` opens the fold-out menu on load.

## Placeholders to replace before launch

- **Photography** — all imagery is Unsplash stock. The brand book's shot list
  (hands pouring, bracelets in frame, her back walking to the next table,
  golden hour) should replace it.
- **Online ordering** — `order.html` "Start your order" is a UI placeholder.
  Wire it to the provider (Toast / ChowNow / Olo) when the account exists.
- **Reservations** — `reservation.html` form is front-end only. Point it at
  Resy / OpenTable / SevenRooms, or a backend endpoint.
- **Phone, address, social handles** — currently placeholder values.
