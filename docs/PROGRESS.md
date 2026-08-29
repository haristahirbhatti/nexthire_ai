# Progress Tracker

Read this first if you're resuming this project in a new chat/session. It
tells you exactly what's done, what's mocked, and what to build next — so
nothing has to be re-explained or rebuilt from scratch.

## Where things stand

**Phase 1 (this delivery): Fantastic, light-themed, fully dynamic frontend — ✅ complete.**

Every screen in `docs/REQUIREMENTS.md` exists and is clickable end-to-end,
built in Next.js 14 (App Router, JavaScript) + Tailwind. No backend yet —
everywhere the spec implies "the AI does X" or "the payment gateway does
Y", the UI is real but the logic behind it is mocked. See the table in the
root `README.md` for the exact real-vs-mocked breakdown.

## Requirements coverage checklist

- [x] Homepage, two side-by-side service blocks, click to select
- [x] **Interview flow:** central video-call-style screen
- [x] **Interview flow:** language dropdown
- [x] **Interview flow:** CV upload box → mock analysis → 10 questions
- [x] **Interview flow:** job title input → mock 5 role questions (15 total)
- [x] **Interview flow:** Confirm/Next → payment gateway → invoice
- [x] **Interview flow:** Start Interview → avatar (male/female) picker
- [x] **Interview flow:** 15-question session, 15-minute countdown
- [x] **Interview flow:** report — questions black, user answers red, ideal answers green, correct/incorrect %
- [x] **Interview flow:** "Start Over" → homepage
- [x] **CV-prep flow:** old CV upload → Next
- [x] **CV-prep flow:** 10,000-template gallery → Next
- [x] **CV-prep flow:** language dropdown (all 28 languages) → Next
- [x] **CV-prep flow:** AI processing screen (CV, cover letter, LinkedIn, keywords, skills, layout)
- [x] **CV-prep flow:** review page, read-only preview, download blocked, "Agree"
- [x] **CV-prep flow:** payment gateway → invoice
- [x] **CV-prep flow:** unlocked Word/PDF download buttons
- [x] **CV-prep flow:** "Start Over" → homepage
- [x] Live user counter starting at 50,000, +1 per completed payment
- [x] Payment gateway badges (PayPal, Google Pay, Visa)
- [x] No email/account registration anywhere
- [x] Responsive: desktop, tablet, mobile
- [x] Support email `support@nexthire.ai` in nav + footer

Nothing from the brief is missing at the frontend level.

## Known gaps to close in Phase 2 (backend)

1. **Real CV parsing** — replace `data/interviewQuestions.js` mock
   generator with an actual resume-parsing + LLM question-generation call.
2. **Real interview scoring** — `ReportStep` in `app/interview/page.js`
   currently scores answers by length only (`answers[q.id].length >= 20`).
   Swap for a real grading model.
3. **Real AI avatar** — currently a static icon with a pulse animation, no
   video/voice. Needs a video/voice avatar provider if the client wants a
   literal Teams/Zoom-style presence, not just a visual metaphor.
4. **Real CV template library** — `data/templates.js` procedurally
   generates 10,000 template *cards* (name/tone/accent/thumbnail pattern),
   not 10,000 real designed templates. Needs real template assets or a
   generative layout engine.
5. **Real document generation** — CV/cover-letter/LinkedIn generation in
   the CV-prep flow is a fake progress checklist. Needs a real generation
   pipeline (LLM + document templating) producing actual Word/PDF files.
6. **Real payment gateway** — `components/PaymentGateway.jsx` fakes a
   1.4s "processing" delay and a random invoice number. Needs real PayPal
   / Google Pay / Stripe-for-Visa integration, real invoice emailing (no
   user account, so likely invoice-by-download rather than email).
7. **Real downloads** — `DownloadStep` in `app/cv-prep/page.js` currently
   downloads a placeholder `.txt` file renamed to `.doc`/`.pdf`. Needs
   real file generation from step 5.
8. **Persistence** — the live counter uses `localStorage`, which is
   per-browser, not global. Needs a real backend counter (or a serverless
   KV store) so the number is the same for every visitor.

None of these require frontend rework — the components are already
structured so a real API call can replace each mock function
(`onFile`, `onPaid`, `buildQuestionSet`, `getTemplatePage`, the
`generate()` function in `DownloadStep`, etc.) without touching layout or
styling.

## Design notes

- Palette, type, and layout rationale are in the root `README.md` under
  "Design direction" and in `tailwind.config.js` (all custom tokens, named
  `paper`, `ink`, `ready`, `signal`, `flag`, `line`).
- The reference link the client gave
  (`https://next-career-pulse.base44.app/`) renders via client-side JS; an
  automated fetch of it only returned page `<meta>` tags (title/description),
  not the actual visual layout. If pixel-level parity with that reference
  matters, the most reliable path is a manual screenshot walkthrough from
  the client, or opening it in a real browser session next time — it
  wasn't possible to inspect visually this round.
- "Fantastic light theme" was interpreted as: warm paper background,
  ink-navy text, emerald accent for confidence/success, amber for the
  CV-prep track, Fraunces display serif + IBM Plex Sans body + IBM Plex
  Mono for data — deliberately avoiding the generic "cream + terracotta"
  AI-website look. Open to adjustment once the client sees it.

## If you're continuing this project

1. Re-read this file and the checklist above.
2. Run `npm install && npm run dev` inside `nexthire-ai/` to see current state.
3. Confirm with the client whether Phase 2 = backend/AI integration, or
   whether Phase 1 needs visual revisions first.
4. Any new requirements from the client should be appended to
   `docs/REQUIREMENTS.md` (keep the original verbatim block intact, add a
   dated "Addendum" section below it) so this stays the single source of
   truth.
