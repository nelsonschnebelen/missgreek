# Miss Greek · Beach Bar & Grill

Marketing site for Miss Greek — a Greek beach bar & grill in Miami.
*Your Greek summer. All year.*

## Stack

- **Vite** (multi-page, no framework)
- **GSAP** only for menu-tab motion, loaded when a tab is opened
- Native scrolling. Content stays visible with motion off (`?static` or reduced motion)

## Pages

| Page | File |
|---|---|
| Home | `index.html` |
| Menu | `menu.html` |
| Order Online | `order.html` |
| About | `about.html` |
| Book a Table | `reservation.html` |

## Brand

The mark in `public/images/logo/` still carries the brand-book blue and rose.
The page around it is a separate harbor palette: cream paper, navy, clay.

| Token | Hex | Role |
|---|---|---|
| Cream | `#F3E7D3` | Page canvas |
| Paper | `#FBF6EC` | Cards and the menu sheet |
| Harbor navy | `#17384A` | Headings, buttons, dock |
| Aegean | `#1E5870` | Links |
| Clay | `#8E4328` | Prices, script, kickers |

**Type.** The brand book specifies Londona (display), Neutra (body) and
lettermagic (script). Those are commercial faces and are not licensed here.
The preview uses free stand-ins chosen for a warm printed-menu feeling:

- **Bodoni Moda** (OFL) for display titles, standing in for Londona
- **Jost** (OFL) for body text, standing in for Neutra
- **Caveat** (OFL) for the short handwritten lines, standing in for lettermagic

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
- **Phone** — (305) 332-6933 on the order line, footer, reservations, and
  Restaurant JSON-LD. Do not publish (305) 331-9275, (305) 555-0142, or any stand-in.
- **Address** — 1401 Collins Ave, Miami Beach, FL 33139, with a Google Maps
  directions link. Do not publish opening hours or “Temporarily closed”.
- **TikTok and Facebook** — the icons stay in the home markup and stay hidden
  until `SOCIAL_URLS` in `src/main.js` has real URLs. Instagram is linked.
