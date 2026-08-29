# NextHire.ai — Phase 1 Frontend

AI mock interview training + ATS-ready CV preparation. This is the **Phase 1
deliverable**: a fully dynamic, light-themed Next.js frontend with mocked
AI/payment logic so every screen and flow can be reviewed and clicked
through before any backend is built.

📄 See [`docs/REQUIREMENTS.md`](docs/REQUIREMENTS.md) for the client brief
(verbatim, extracted from `Project_No__087326-1.docx`) and
[`docs/PROGRESS.md`](docs/PROGRESS.md) for exactly what's built, what's
mocked, and what Phase 2 needs — read that file first if you're picking
this project back up in a new session.

## Stack

- **Next.js 14** (App Router, JavaScript, no TypeScript)
- **Tailwind CSS** with a custom design-token palette (`tailwind.config.js`)
- **lucide-react** for icons
- Self-hosted fonts via `@fontsource` (Fraunces / IBM Plex Sans / IBM Plex Mono) —
  no external font requests, so it builds in fully offline/sandboxed environments
- No backend, no database, no real payment processor — everything AI- or
  payment-related is mocked client-side (clearly marked in the code)

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
```

Production build:

```bash
npm run build
npm run start
```

## Project structure

```
app/
  layout.js            Root layout: fonts, providers, Navbar/Footer
  page.js               Homepage — the two service blocks
  interview/page.js      AI Mock Interview flow (setup → analyze → pay → live → report)
  cv-prep/page.js        CV Preparation flow (upload → template → language → generate → review → pay → download)
  globals.css            Design tokens / base styles
components/
  Navbar.jsx              Live user counter, logo, support email
  Footer.jsx              Payment badges, support email, responsive note
  UploadBox.jsx           Drag-and-drop CV upload (shared by both flows)
  StepRail.jsx            Step progress indicator (shared by both flows)
  PaymentGateway.jsx       Mock PayPal / Google Pay / Visa checkout + invoice
lib/
  store.jsx               Client-side app state: live counter (persisted), session data
data/
  languages.js             28-language list
  interviewQuestions.js    Mock CV-derived + role-derived question bank
  templates.js              10,000-template catalog generator
```

## What's real vs. mocked in Phase 1

| Feature | Status |
|---|---|
| Two-block homepage, both flows, all screens | ✅ Real, fully built |
| Responsive layout (mobile/tablet/desktop) | ✅ Real |
| Live user counter (50,000 base, +1 per completed payment) | ✅ Real, persisted in `localStorage` |
| CV upload UI | ✅ Real UI, file is accepted but not parsed |
| "AI" question generation from CV + job title | 🟡 Mocked question bank, not a real model call |
| Mock interview timer, avatar, live Q&A | ✅ Real UI/flow, avatar has no video/audio |
| Interview scoring report (black / red / green) | 🟡 Mocked scoring (answer length heuristic), not real grading |
| 10,000 CV templates | 🟡 Real count, generated pattern-based thumbnails, not real designs |
| CV / cover letter / LinkedIn generation | 🟡 Mocked "processing" checklist, no real document generation |
| Payment (PayPal / Google Pay / Visa) | 🟡 Mocked checkout UI + fake invoice number, no real gateway |
| Word/PDF download | 🟡 Downloads a placeholder text file with a `.doc`/`.pdf` extension |

Everything marked 🟡 is intentionally mocked so the **frontend** can be
reviewed end-to-end this phase. Phase 2 swaps each mock for a real
integration without changing the UI contracts (see `docs/PROGRESS.md`).

## Design direction

Light theme built around the idea of a **calm, well-lit "briefing room"**
rather than a generic SaaS gradient: warm paper background, ink-navy text,
an "ready" emerald for confirmations/success, and a warm amber signal
color for the CV-prep track. Display type is Fraunces (serif, editorial),
body/UI type is IBM Plex Sans, data/labels use IBM Plex Mono. Full token
list is in `tailwind.config.js`.

The reference link provided
(`https://next-career-pulse.base44.app/`) is a JS-rendered single-page app;
automated fetching only returned page metadata, not visual layout, so this
build follows the **written requirements** as the source of truth for
functionality and applies an original visual system on top. If you'd like
the design nudged closer to that reference in specific ways (colors,
spacing, a particular layout), point them out and they're quick to adjust.
