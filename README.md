<div align="center">
  <img src="public/favicon.svg" width="64" height="64" alt="MD to PDF logo" />
  <h1>MD to PDF Converter</h1>
  <p>
    A sophisticated, single-page Markdown editor with real-time preview and one-click PDF export.<br/>
    Designed for writers, developers, and anyone who needs beautiful documents — fast.
  </p>

  <p>
    <img src="https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white&style=flat-square" alt="React 18" />
    <img src="https://img.shields.io/badge/Vite-6-646cff?logo=vite&logoColor=white&style=flat-square" alt="Vite 6" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-3-38bdf8?logo=tailwindcss&logoColor=white&style=flat-square" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Deployed_on-Vercel-000000?logo=vercel&logoColor=white&style=flat-square" alt="Vercel" />
    <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="MIT License" />
  </p>
</div>

---

## Overview

MD to PDF Converter transforms Markdown into beautifully formatted PDF documents, entirely in the browser — **no server required, no sign-up, no data sent anywhere**.

Write or paste your Markdown, see a styled live preview, and export a print-quality A4 PDF with a single click. The app runs on any modern browser and is fully offline-capable once loaded.

---

## Key Features

| Feature | Details |
|---|---|
| **Real-time Preview** | Renders Markdown as you type — zero perceptible lag |
| **One-Click PDF Export** | High-quality A4 PDF via `html2pdf.js` (lazily loaded) |
| **Copy to Clipboard** | Copy your entire Markdown source with one tap |
| **Clear All** | Two-step confirmation so you can't accidentally erase your work |
| **Drag & Drop Upload** | Drop any `.md`, `.txt`, or `.markdown` file anywhere on the screen |
| **Click-to-Upload** | Alternatively use the Upload button in the header |
| **Dark / Light Mode** | Toggle with one tap; preference persisted across sessions |
| **Resizable Split Panes** | Drag the centre divider on desktop to balance editor vs. preview |
| **Formatting Toolbar** | 17 buttons covering headings, inline styles, links, lists, tables, code |
| **Keyboard Shortcuts** | `⌘/Ctrl + B` bold · `⌘/Ctrl + I` italic · `⌘/Ctrl + K` link · `Tab` indent |
| **Auto-save** | Markdown and dark-mode preference persisted to `localStorage` |
| **Mobile Responsive** | Tabbed layout on phones/tablets with 44 × 44 px touch targets |
| **GFM Support** | Tables, strikethrough, task lists, and auto-links via `remark-gfm` |

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 18 — functional components + hooks |
| Styling | Tailwind CSS v3 + `@tailwindcss/typography` |
| Icons | Lucide React |
| Markdown Parsing | `react-markdown` + `remark-gfm` |
| PDF Generation | `html2pdf.js` (dynamic import — not in initial bundle) |
| Build Tool | Vite 6 |
| Deployment | Vercel |

---

## Project Structure

```
md-to-pdf/
├── public/
│   └── favicon.svg               # Gradient SVG app icon
├── src/
│   ├── components/
│   │   ├── DragOverlay.jsx       # Full-screen drag-and-drop overlay
│   │   ├── Editor.jsx            # Textarea + stats + Copy + Clear
│   │   ├── Header.jsx            # Top navigation bar
│   │   ├── MobileTabBar.jsx      # Bottom nav on mobile (Edit | PDF | Preview)
│   │   ├── Preview.jsx           # Rendered Markdown (A4 paper simulation)
│   │   └── Toolbar.jsx           # 17-button formatting toolbar
│   ├── hooks/
│   │   └── useMediaQuery.js      # Reactive CSS media query hook
│   ├── lib/
│   │   ├── defaultContent.js     # Demo Markdown shown on first load
│   │   └── markdownComponents.jsx # Custom react-markdown renderers
│   ├── App.jsx                   # Root — state, effects, event handlers only
│   ├── index.css                 # Tailwind directives + global utilities
│   └── main.jsx                  # React DOM entry point
├── index.html                    # HTML shell (viewport-fit=cover for iOS)
├── package.json
├── tailwind.config.js
├── vite.config.js
├── postcss.config.js
└── vercel.json                   # Build config + SPA rewrites
```

---

## Getting Started

### Prerequisites

- **Node.js** 18 or later
- **npm** 9 or later (ships with Node 18)

### Installation

```bash
# 1 — Clone the repository
git clone https://github.com/your-username/md-to-pdf.git
cd md-to-pdf

# 2 — Install dependencies
npm install

# 3 — Start the development server
npm run dev
```

The app opens at **http://localhost:5173** with hot-module replacement enabled.

### Production build

```bash
npm run build       # outputs to dist/
npm run preview     # serve the production build locally
```

---

## Deploy to Vercel

### Option A — Vercel CLI (fastest)

```bash
npm install -g vercel
vercel
```

Vercel auto-detects Vite, sets `dist` as the output directory, and deploys in under a minute.

### Option B — GitHub Integration (recommended for teams)

1. Push this repository to GitHub.
2. Open [vercel.com/new](https://vercel.com/new) and import the repo.
3. Leave all settings at their defaults — Vercel detects Vite automatically.
4. Click **Deploy**.

The included `vercel.json` adds a catch-all SPA rewrite so direct URL navigation always serves `index.html`.

---

## UX Philosophy

### Two layouts for two contexts

The app uses a single reactive breakpoint (`max-width: 767 px`, matching Tailwind's `md`) to serve fundamentally different experiences rather than simply stacking the desktop layout.

**Desktop (≥ 768 px)**

A three-mode segmented control — *Editor*, *Split*, *Preview* — lets users choose their workflow. In Split mode a draggable divider (25–75 % range) lets power users tune the balance between writing space and preview area in real time. The PDF action is a labelled button in the header — visible, but not dominant.

**Mobile (< 768 px)**

The header shrinks to only the essential actions (upload, dark-mode toggle). A bottom tab bar replaces the segmented control with a familiar iOS/Android navigation pattern:

```
[ Edit ]  ——  [ ⬇ PDF ]  ——  [ Preview ]
  flex-1      56×56 circle     flex-1
```

The centred gradient circle is the primary action on mobile. Placing it in the thumb zone (bottom-centre) means users can export without repositioning their grip. Both tab buttons satisfy the 44 × 44 px touch target guidelines.

The formatting toolbar is horizontally scrollable with a hidden scrollbar and `-webkit-overflow-scrolling: touch` for momentum scrolling on iOS. Each toolbar button has a `min-h-[44px] min-w-[44px]` touch target, so even dense formatting operations are comfortable to tap.

### Progressive loading

`html2pdf.js` (~670 KB gzipped: 197 KB) is loaded via `import()` only when the user clicks Export. This keeps the critical-path bundle below 110 KB gzipped, giving a fast first paint even on slower connections.

### Accessibility

- Every interactive element carries `title` and/or `aria-label` attributes.
- Focus states are preserved across toolbar interactions (toolbar buttons use `onMouseDown` + `e.preventDefault()` to prevent textarea blur).
- Keyboard shortcuts (`⌘B`, `⌘I`, `⌘K`, `Tab`) cover the most common formatting actions without reaching for the mouse.
- `viewport-fit=cover` + `env(safe-area-inset-bottom)` ensure the bottom tab bar never overlaps the iPhone home indicator.

### Data privacy

All processing — parsing, rendering, PDF generation — happens in the user's browser. No Markdown content is ever transmitted to a server.

---

## Contributing

Pull requests are welcome. For major changes please open an issue first to discuss what you'd like to change.

```bash
# Fork → clone → branch
git checkout -b feature/my-improvement

# Make changes, then
npm run build   # ensure the build passes before opening a PR
```

---

## License

MIT © 2025 — free to use, modify, and distribute.
