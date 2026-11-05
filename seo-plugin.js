/**
 * Absolute URLs follow the deploy host.
 * SITE_URL wins (set by the GitHub Pages workflow from configure-pages base_url).
 * URL is Netlify's primary site URL.
 * Local builds fall back to this repo's GitHub Pages project URL.
 */
const DEFAULT_ORIGIN = 'https://nelsonschnebelen.github.io/missgreek';

export function siteOrigin() {
  const raw = process.env.SITE_URL || process.env.URL || DEFAULT_ORIGIN;
  return raw.replace(/\/$/, '');
}

function decode(html) {
  return html
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/\s+/g, ' ')
    .trim();
}

function offersFor(priceText, sectionName) {
  const nums = [...priceText.matchAll(/\$(\d+(?:\.\d+)?)/g)].map((m) => m[1]);
  if (!nums.length) return undefined;
  const glass = /glass/i.test(sectionName);
  if (nums.length >= 2 && glass) {
    return [
      { '@type': 'Offer', name: 'Glass', price: nums[0], priceCurrency: 'USD' },
      { '@type': 'Offer', name: 'Bottle', price: nums[1], priceCurrency: 'USD' },
    ];
  }
  if (nums.length >= 2) {
    return nums.slice(0, 2).map((price) => ({
      '@type': 'Offer',
      price,
      priceCurrency: 'USD',
    }));
  }
  return { '@type': 'Offer', price: nums[0], priceCurrency: 'USD' };
}

export function menuSchema(html, origin) {
  const start = html.indexOf('data-panel="kitchen"');
  const end = html.indexOf('<footer');
  const slice = html.slice(start, end > start ? end : undefined);
  const tokens = [...slice.matchAll(/<h2 class="flourish"><span>([\s\S]*?)<\/span><\/h2>|<p class="menu-note(?: menu-note--fine)?"[^>]*>([\s\S]*?)<\/p>|<article class="row"[\s\S]*?<\/article>/g)];
  const sections = [];
  let current = null;
  const ensure = () => {
    if (!current) current = { name: 'Menu', description: '', items: [] };
    return current;
  };
  for (const token of tokens) {
    if (token[1] != null) {
      if (current && (current.items.length || current.description)) sections.push(current);
      current = { name: decode(token[1]), description: '', items: [] };
      continue;
    }
    if (token[2] != null) {
      if (/menu-note--fine/.test(token[0])) continue;
      const note = decode(token[2]);
      const section = ensure();
      section.description = section.description ? `${section.description} ${note}` : note;
      continue;
    }
    const article = token[0];
    const name = decode((article.match(/<h3>([\s\S]*?)<\/h3>/) || [])[1] || '');
    const price = decode((article.match(/row__price">([\s\S]*?)<\/span>/) || [])[1] || '');
    const description = decode((article.match(/<p>([\s\S]*?)<\/p>/) || [])[1] || '');
    if (!name) continue;
    const section = ensure();
    const item = { '@type': 'MenuItem', name };
    if (description) item.description = description;
    const offers = offersFor(price, section.name);
    if (offers) item.offers = offers;
    section.items.push(item);
  }
  if (current && (current.items.length || current.description)) sections.push(current);

  return {
    '@type': 'Menu',
    '@id': `${origin}/menu.html#menu`,
    name: 'Miss Greek menu',
    url: `${origin}/menu.html`,
    inLanguage: 'en',
    hasMenuSection: sections.map((section) => {
      const out = { '@type': 'MenuSection', name: section.name };
      if (section.description) out.description = section.description;
      if (section.items.length) out.hasMenuItem = section.items;
      return out;
    }),
  };
}

function restaurantSchema(origin) {
  const day = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const span = (opens, closes) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: day,
    opens,
    closes,
  });
  return {
    '@type': 'Restaurant',
    '@id': `${origin}/#restaurant`,
    name: 'Miss Greek',
    alternateName: 'Miss Greek Beach Bar & Grill',
    url: `${origin}/`,
    menu: `${origin}/menu.html`,
    image: `${origin}/images/og.jpg`,
    servesCuisine: 'Greek',
    priceRange: '$3–$205',
    sameAs: ['https://www.instagram.com/miss.greek/'],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Miami Beach',
      addressRegion: 'FL',
      addressCountry: 'US',
      description: 'Oceanfront at the hotel. Street address is not published.',
    },
    openingHoursSpecification: [
      span('08:00', '11:00'),
      span('12:00', '15:00'),
      span('15:00', '17:00'),
      span('18:00', '22:00'),
    ],
  };
}

function jsonLd(data) {
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

function crawlFiles(origin) {
  const pages = [
    ['/', 'Home'],
    ['/menu.html', 'Menu'],
    ['/order.html', 'Order online'],
    ['/about.html', 'About'],
    ['/reservation.html', 'Book a table'],
  ];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(([path]) => `  <url><loc>${origin}${path}</loc></url>`).join('\n')}
</urlset>
`;
  const robots = `User-agent: *
Allow: /

Sitemap: ${origin}/sitemap.xml
`;
  const llms = `# Miss Greek

> Greek beach bar and grill in Miami Beach. Plates in the middle, a full priced menu, and a table by the water.

## Key facts

- Name: Miss Greek · Beach Bar & Grill
- Cuisine: Greek, with the priced menu published on the menu page
- Where published: oceanfront at the hotel, Miami Beach, FL. Street address is not published.
- Hours published on the site: every day from 8 AM. Breakfast 8–11 AM, lunch 12–3 PM, no-hurry hour 3–5 PM, dinner 6–10 PM, then an easy evening from 10 until close. The kitchen winds down at 10. A precise closing time is not published.
- Happy hour on the menu: Monday–Thursday 4–7 PM, Friday–Sunday 3–6 PM.
- Reservations: recommended for sunset. Walk-ins are welcome; the door doesn't check names.
- Gluten-free note from the menu: pita and sandwiches can be a collard green wrap for +3, served with fries.
- Price range on the published menu: about $3 (coffee) to $205 (Miss Greek platter).
- Instagram: https://www.instagram.com/miss.greek/
- A 20% service charge is added to checks.

## Pages

${pages.map(([path, label]) => `- [${label}](${origin}${path})`).join('\n')}

## Not yet published

- Street address and map coordinates
- A real telephone (the order page shows (305) 555-0142, marked as a placeholder)
- Parking
- Exact closing time after 10 PM
- TikTok and Facebook URLs (icons on the home page are not linked)
`;
  return { sitemap, robots, llms };
}

export function seoPlugin() {
  const origin = siteOrigin();
  const files = crawlFiles(origin);
  return {
    name: 'miss-greek-seo',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        let out = html.replaceAll('%%SITE%%', origin);
        const restaurant = restaurantSchema(origin);
        const graph = [restaurant];
        const file = ctx.filename || ctx.path || '';
        if (file.endsWith('menu.html')) graph.push(menuSchema(out, origin));
        const block = `<!-- TODO: street address, geo coordinates, telephone, parking, and the closing time after 10 PM are not in the repo. Do not invent them. The (305) 555-0142 number on the order page is a placeholder. -->\n${jsonLd({ '@context': 'https://schema.org', '@graph': graph })}`;
        if (!out.includes('application/ld+json')) {
          out = out.replace('</head>', `${block}\n</head>`);
        } else {
          out = out.replace('</head>', `${block}\n</head>`);
        }
        return out;
      },
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: files.sitemap });
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: files.robots });
      this.emitFile({ type: 'asset', fileName: 'llms.txt', source: files.llms });
    },
  };
}
