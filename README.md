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

- **Photography** — heroes and the about mosaic use the approved Instagram set.
  Menu dishes without a matching photo still use stock.
- **Online ordering** — "Start your order" stays in the markup and stays hidden
  until `ORDER_URL` in `src/main.js` is a real provider link.
- **Reservations** — the form posts to Netlify Forms (`name="reservation"`).
- **Phone** — the order page does not show a phone line. Add one only after
  Carol confirms the number. Do not publish (305) 331-9275 or any stand-in.
- **Address, hours, map, parking** — omitted from the pages and from Restaurant
  JSON-LD until the Google Business Profile listing is confirmed.
- **TikTok and Facebook** — the icons stay in the home markup and stay hidden
  until `SOCIAL_URLS` in `src/main.js` has real URLs. Instagram is linked.
