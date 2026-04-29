# ⚡ Toolify v2 — Enterprise-Grade Free Tools

Free online tools for developers, writers & creators. Built with Next.js 14, Tailwind CSS, Framer Motion & pdf-lib.

**Live:** [toolify.io](https://toolify.io)

---

## 🚀 Quick Start

```bash
git clone https://github.com/your-username/Toolify.git
cd Toolify
npm install
cp .env.example .env.local
npm run dev
# → http://localhost:3000
```

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 App Router |
| Styling | Tailwind CSS + CSS vars (OKLCH) |
| Animation | Framer Motion |
| PDF | pdf-lib (client-side) |
| State | React Context + LocalStorage |
| Theme | next-themes Dark/Light/System |
| Icons | Lucide React |
| PWA | Custom Service Worker |
| Deploy | Vercel |

---

## 🧰 Tools (23 total)

### AI Content
- Word Counter · Text Analyzer · SEO Keyword Generator · AI Prompt Generator

### Developer
- JSON → Zod & TypeBox · JSON → TypeBox (legacy) · Code Formatter
- Color Converter · Hash Generator · JWT Debugger · Password Generator

### PDF Tools
- PDF Merge · PDF Split · Compress PDF · Image to PDF · PDF to Word · Word to PDF

### Calculators
- BMI Calculator · BMR & TDEE · Unit Converter · Loan Calculator · Age Calculator

---

## ✨ v2 Features

- **Global State** — Recent Tools + Favorites + Auto-save (LocalStorage)
- **⌘K Search** — Keyboard command palette
- **Toast Notifications** — Liquid Glass feedback
- **PWA** — Installable, offline-capable
- **Analytics Dashboard** — `/dashboard` with revenue estimator
- **JWT Debugger** — Decode tokens client-side
- **Password Generator** — Entropy scoring
- **BMR/TDEE** — Mifflin-St Jeor formula

---

## 📁 Structure

```
toolify-v2/
├── app/
│   ├── dashboard/        # Analytics dashboard
│   ├── offline/          # PWA offline page
│   └── tools/            # 23 tool pages
├── components/
│   ├── tools/            # Tool components (23)
│   ├── layout/           # Navbar, Footer, HeroSection…
│   └── ui/               # GlassCard, CommandPalette, Toast…
├── hooks/
│   └── usePWA.tsx        # PWA install + SW registration
├── lib/
│   ├── store.tsx          # Global state (Recent + Favorites)
│   ├── toast.tsx          # Toast notification system
│   └── tools-registry.ts  # Central tool definitions
└── public/
    ├── sw.js              # Service Worker
    ├── manifest.json      # PWA manifest
    └── icons/             # App icons
```

---

## 💰 Revenue Setup

1. Sign up at [adsense.google.com](https://adsense.google.com)
2. Add to `.env.local`:
   ```
   NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=ca-pub-XXXXXXXXXXXXXXXX
   ```
3. Uncomment AdSense script in `app/layout.tsx`

---

## 🌐 Deploy

```bash
vercel
# Root Directory: . (root)
```

MIT License
