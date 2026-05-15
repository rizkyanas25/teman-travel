# TEMAN TRAVEL

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Mapbox GL](https://img.shields.io/badge/Mapbox_GL-3-000?style=for-the-badge&logo=mapbox)
![next-intl](https://img.shields.io/badge/next--intl-4-blue?style=for-the-badge)

**A premium Bali & Nusa Penida tour agency website with full i18n support**

[Live Demo](#) • [English](./messages/en/) • [Indonesian](./messages/id/) • [Contact](#-contact)

</div>

---

## ⚡ Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

---

## 🎨 Features

- **Dark Tropical Theme** — Deep teal/jungle green palette, luxury gold assets, and unified glassmorphism
- **Full Internationalization** — English & Indonesian with automatic locale detection
- **Smart Currency Display** — USD for international visitors, IDR for Indonesian market
- **Interactive Carousel** — Destination gallery with image-description split layout
- **🗺️ Itinerary Map Visualizer** — Mapbox-powered animated route maps with per-day playback, dynamic marker states, and stop sync
- **Package Comparison** — 3 tiered tour packages with collapsible itineraries
- **Legal & Trust Integration** — Terms, Privacy, and Cancellation pages with official payment badges
- **SEO Optimized** — JSON-LD structured data, OpenGraph, sitemap, robots.txt
- **PWA Ready** — Web manifest, favicons, and apple-touch-icon
- **Fully Responsive** — Mobile-first design across all breakpoints

---

## 📸 Preview

### Sections

| Section             | Description                                                              |
| ------------------- | ------------------------------------------------------------------------ |
| **Hero**            | Full-screen background with CTA buttons and animated text                |
| **About**           | Company story with stats (5+ years, 1K+ travelers, 6+ packages)         |
| **Tour Packages**   | 3 packages (4D3N / 5D4N / 6D5N) with pricing, icon badges & itinerary  |
| **Route Map**       | Animated Mapbox itinerary visualizer with per-day playback & stop sync  |
| **Destinations**    | Image carousel with 6 iconic Bali & Nusa Penida spots                   |
| **Contact**         | Contact form, address, WhatsApp link, and social media icons             |
| **Footer**          | Quick links, package list, and copyright info                            |

### Tour Packages

| Package   | Price From (USD) | Price From (IDR) | Highlights                                   |
| --------- | ---------------- | ---------------- | -------------------------------------------- |
| **4D3N**  | $139             | Rp 2.200.000     | Nusa Penida + Ubud Cultural Tour             |
| **5D4N**  | $219             | Rp 3.450.000     | + Uluwatu, GWK & South Coast                 |
| **6D5N**  | $299             | Rp 4.700.000     | + Tanah Lot, Bedugul, Lempuyang & Jatiluwih  |

### Destinations Featured

| Destination              | Location        |
| ------------------------ | --------------- |
| Kelingking Beach         | Nusa Penida     |
| Tegalalang Rice Terrace  | Ubud, Bali      |
| Uluwatu Temple           | South Bali      |
| Tanah Lot Temple         | Tabanan, Bali   |
| Tirta Empul              | Tampaksiring    |
| Lempuyang Temple         | East Bali       |

---

## 🛠️ Tech Stack

| Category          | Technologies                          |
| ----------------- | ------------------------------------- |
| **Framework**     | Next.js 16 (App Router, Turbopack)    |
| **UI Library**    | React 19                              |
| **Language**      | TypeScript 5                          |
| **Styling**       | Tailwind CSS 4                        |
| **Icons**         | React Icons (`react-icons/fa`)        |
| **Maps**          | Mapbox GL JS 3                        |
| **i18n**          | next-intl 4 (locale routing + proxy)  |
| **Images**        | Next.js Image (optimized, lazy-load)  |
| **SEO**           | Next.js Metadata API, JSON-LD         |
| **Fonts**         | Google Fonts (Playfair Display, Inter) |

---

## 📁 Project Structure

```
├── messages/                  # i18n translation files
│   ├── en/                    # English translations
│   │   ├── about.json
│   │   ├── common.json
│   │   ├── contact.json
│   │   ├── footer.json
│   │   ├── gallery.json
│   │   ├── hero.json
│   │   ├── navbar.json
│   │   └── packages.json
│   └── id/                    # Indonesian translations (same structure)
├── public/
│   ├── images/                # Destination & hero images
│   ├── manifest.json          # PWA manifest
│   ├── favicon.ico
│   └── apple-icon.png
├── src/
│   ├── app/
│   │   ├── [locale]/          # Locale-aware pages
│   │   │   ├── layout.tsx     # SEO metadata, JSON-LD, fonts
│   │   │   └── page.tsx       # Main page (assembles all sections)
│   │   ├── layout.tsx         # Root layout (delegates to [locale])
│   │   ├── globals.css        # Design tokens, animations, utilities
│   │   ├── sitemap.ts         # Dynamic sitemap with hreflang
│   │   └── robots.ts          # Robots.txt configuration
│   ├── components/
│   │   ├── About.tsx          # Company story + stats
│   │   ├── Contact.tsx        # Contact form + info
│   │   ├── FloatingWhatsApp.tsx
│   │   ├── Footer.tsx
│   │   ├── Gallery.tsx        # Destination carousel
│   │   ├── Hero.tsx           # Full-screen hero
│   │   ├── ItineraryMapModal.tsx  # Route map modal controller
│   │   ├── LanguageSwitcher.tsx
│   │   ├── Navbar.tsx         # Responsive navigation
│   │   ├── PackageCard.tsx    # Individual package card
│   │   ├── PackageDetailsModal.tsx  # Shared includes/excludes modal
│   │   ├── PackagesSection.tsx
│   │   ├── SocialSidebar.tsx
│   │   └── map/
│   │       ├── MapView.tsx    # Mapbox map + animation engine
│   │       ├── DaySidebar.tsx # Day timeline with stop progress
│   │       └── PlaybackControls.tsx # Play/pause + day info
│   ├── data/
│   │   ├── itinerary-geo.ts   # Geo coordinates + stop definitions
│   │   └── routes/            # Pre-generated Mapbox route JSONs
│   ├── types/
│   │   └── routes.ts          # Shared route data interfaces
│   ├── i18n/
│   │   ├── navigation.ts     # Localized navigation helpers
│   │   ├── request.ts        # Message loading config
│   │   └── routing.ts        # Locale routing config
│   └── proxy.ts              # Middleware for locale detection
└── package.json
```

---

## 🎯 Design System

### Colors

- **Primary**: `#D4A843` (Gold)
- **Background**: `#0B1121` (Dark Navy) → `#0F172A` (Dark Slate)
- **Glass**: `rgba(255,255,255,0.05)` with backdrop blur

### Typography

- **Display**: Playfair Display (headings, package titles)
- **Body**: Inter (paragraphs, UI elements)

### Principles

- Dark luxury theme with gold accents
- Glassmorphism cards with subtle borders
- Smooth hover transitions and micro-animations
- Gradient overlays on images
- Rounded corners (2xl radius system)

---

## 🌐 Internationalization

| Feature              | Implementation                                              |
| -------------------- | ----------------------------------------------------------- |
| **Locale Detection** | Automatic via `Accept-Language` header in `proxy.ts`        |
| **Default Locale**   | `en` (English)                                              |
| **Supported**        | `en` (English), `id` (Indonesian)                           |
| **Routing**          | `/en/...` and `/id/...` path-based routing                  |
| **Currency**         | USD for `en`, IDR for `id`                                  |
| **SEO**              | `hreflang` alternates in sitemap + `<link rel="alternate">` |
| **Switching**        | Language toggle in navbar (EN / ID)                         |

### Adding a New Language

1. Create a new folder in `messages/` (e.g., `messages/ja/`)
2. Copy all JSON files from `messages/en/` and translate
3. Add the locale to `src/i18n/routing.ts`
4. The middleware will automatically detect and route

---

## 🔍 SEO

| Feature               | Details                                                |
| --------------------- | ------------------------------------------------------ |
| **Title Tags**        | Locale-aware, keyword-optimized                        |
| **Meta Description**  | Dynamic from hero translations                         |
| **Open Graph**        | Full OG tags with 1200×630 image                       |
| **Twitter Cards**     | `summary_large_image` with image                       |
| **JSON-LD**           | `TravelAgency` + `WebSite` schemas with tour offers    |
| **Sitemap**           | `/sitemap.xml` with hreflang xhtml:link                |
| **Robots**            | `/robots.txt` with sitemap reference                   |
| **Canonical URLs**    | Per-locale canonical + alternates                      |
| **Keywords**          | 11 locale-specific travel keywords                     |
| **PWA Manifest**      | Theme color, icons, standalone display                 |

---

## 📜 Available Scripts

| Command                  | Description                             |
| ------------------------ | --------------------------------------- |
| `npm run dev`            | Start development server with Turbopack |
| `npm run build`          | Create production build                 |
| `npm run start`          | Start production server                 |
| `npm run lint`           | Run ESLint                              |
| `npm run generate-routes`| Re-generate Mapbox route data           |

---

## 🚀 Deployment

Deploy easily on [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Environment Variables

| Variable                     | Required | Description                        |
| ---------------------------- | -------- | ---------------------------------- |
| `NEXT_PUBLIC_MAPBOX_TOKEN`   | Yes      | Mapbox GL JS access token          |

### Notes

- `next-intl` plugin is configured in `next.config.ts`
- All images are statically served from `/public/images/`
- Route data is pre-generated — run `npm run generate-routes` after editing `itinerary-geo.ts`

---

## 📧 Contact

**Teman Travel**

- 📧 Email: [info@temantravel.com](mailto:info@temantravel.com)
- 📱 WhatsApp: [+62 888-666-2507](https://wa.me/628886662507)
- 📍 Location: Jl. Cempaka Wangi No. 18, Batubulan, Sukawati, Gianyar, Bali 80582

---

## 📝 License

© 2026 Teman Travel. All rights reserved.

---
