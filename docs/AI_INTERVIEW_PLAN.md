# 🤖 NextHire AI — Mock Interview Feature Plan

## 📋 Table of Contents
1. [Best API Recommendations](#best-api-recommendations)
2. [How to Get Each API Key](#how-to-get-each-api-key)
3. [Environment Variables Setup](#environment-variables-setup)
4. [Full Project File Structure](#full-project-file-structure)
5. [What Each File Does](#what-each-file-does)
6. [Build Order / Roadmap](#build-order--roadmap)

---

## 🔑 Best API Recommendations

| Priority | API | Purpose | Cost | Verdict |
|---|---|---|---|---|
| ✅ **MUST** | **OpenAI GPT-4o** | CV analysis, question generation, answer scoring | ~$0.02–0.05/session | ⭐ Best choice |
| ✅ **MUST** | **Web Speech API** | Candidate mic input (speech → text) | FREE (built-in browser) | No key needed |
| ✅ **MUST** | **Web SpeechSynthesis** | AI speaks questions aloud | FREE (built-in browser) | No key needed |
| ✅ **MUST** | **pdf-parse** (npm) | Extract text from uploaded CV PDF | FREE (npm package) | No key needed |
| 🔵 Optional | **ElevenLabs** | More realistic AI voice | Free tier: 10k chars/month | Nice upgrade |
| 🔵 Optional | **Google Gemini** | Alternative to GPT-4o | Free tier available | Backup option |

> **Bottom Line:** You only need **ONE paid API key — OpenAI GPT-4o**. Everything else is free.

---

## 🪪 How to Get Each API Key

### 1. OpenAI GPT-4o API Key ⭐ (Most Important)

**Steps:**
1. Go to → https://platform.openai.com
2. Click **"Sign up"** or **"Log in"**
3. After login → Go to **API section** → https://platform.openai.com/api-keys
4. Click **"Create new secret key"**
5. Give it a name (e.g., `nexthire-dev`) → Click **"Create secret key"**
6. **COPY IT IMMEDIATELY** — you won't see it again
7. Add billing: Go to **Settings → Billing → Add payment method** (pay-as-you-go)

**Estimated Cost:**
- GPT-4o: ~$0.005 per 1K input tokens
- A full 15-min interview (CV + 15 Q&As): ~**$0.02–0.05 total**
- 100 interviews/month ≈ **$2–5/month**

---

### 2. ElevenLabs API Key 🔵 (Optional — Realistic AI Voice)

**Steps:**
1. Go to → https://elevenlabs.io
2. Click **"Sign Up"** (free account)
3. Go to **Profile → API Key**
4. Copy your API key
5. Free tier gives **10,000 characters/month** (enough for testing)

---

### 3. Google Gemini API Key 🔵 (Optional Backup for GPT-4o)

**Steps:**
1. Go to → https://aistudio.google.com
2. Sign in with your Google account
3. Click **"Get API Key"** → **"Create API Key"**
4. Select a project or create new one
5. Copy the key
6. **Free tier:** 15 requests/min, 1 million tokens/day — very generous!

---

## ⚙️ Environment Variables Setup

Create a `.env.local` file in your project root:

```bash
# .env.local (NEVER commit this to GitHub!)

# OpenAI (Required)
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ElevenLabs (Optional - for realistic AI voice)
ELEVENLABS_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM

# Google Gemini (Optional - backup AI)
GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

> ⚠️ **IMPORTANT:** Make sure `.env.local` is in your `.gitignore` — it already is by default in Next.js!

---

## 📁 Full Project File Structure

```
nexthire-ai/
│
├── .env.local                          ← API keys (never commit!)
├── package.json
├── next.config.js
│
├── app/                                ← Next.js App Router pages
│   ├── layout.js                       ← Root layout (Navbar, Footer)
│   ├── page.js                         ← Landing page (2 feature cards)
│   ├── globals.css                     ← Global styles
│   │
│   ├── interview/                      ← 🎤 AI Mock Interview Feature
│   │   ├── page.js                     ← Step 1: Setup page (upload CV, enter role)
│   │   ├── session/
│   │   │   └── page.js                 ← Step 2: Live interview room (camera + AI)
│   │   └── report/
│   │       └── page.js                 ← Step 3: Score report after interview
│   │
│   ├── cv-prep/                        ← 📄 CV Preparation Feature
│   │   └── page.js                     ← CV upload + rebuild flow
│   │
│   └── api/                            ← Next.js API Routes (backend)
│       ├── parse-cv/
│       │   └── route.js                ← Extracts text from uploaded PDF CV
│       ├── generate-questions/
│       │   └── route.js                ← GPT-4o generates 15 interview questions
│       ├── evaluate-answer/
│       │   └── route.js                ← GPT-4o scores each candidate answer
│       └── tts-elevenlabs/
│           └── route.js                ← (Optional) ElevenLabs text-to-speech
│
├── components/                         ← Reusable UI components
│   ├── Navbar.jsx                      ← Top navigation bar
│   ├── Footer.jsx                      ← Footer
│   ├── UploadBox.jsx                   ← File upload drag-and-drop
│   ├── StepRail.jsx                    ← Step progress indicator
│   ├── PaymentGateway.jsx              ← Payment UI
│   │
│   └── interview/                      ← 🆕 Interview-specific components
│       ├── CameraView.jsx              ← Webcam feed + face detection UI
│       ├── CVUploader.jsx              ← CV upload for interview setup
│       ├── RoleInput.jsx               ← Input: job role/title candidate wants
│       ├── InterviewInstructions.jsx   ← Pre-interview instructions modal/screen
│       ├── AIInterviewer.jsx           ← Displays question + speaks via TTS
│       ├── MicRecorder.jsx             ← Records answer via Web Speech API
│       ├── AnswerDisplay.jsx           ← Shows live transcript of candidate answer
│       ├── QuestionProgress.jsx        ← Shows Q1/15, Q2/15 progress bar
│       └── ScoreReport.jsx             ← Post-interview detailed score card
│
├── lib/                                ← Utility / helper functions
│   ├── store.jsx                       ← Global state (Zustand or Context)
│   ├── openai.js                       ← 🆕 OpenAI client setup
│   ├── parsePDF.js                     ← 🆕 PDF text extraction helper
│   └── speechUtils.js                  ← 🆕 Web Speech API helpers (TTS + STT)
│
├── data/                               ← Static data / mock data
│   └── sampleQuestions.js             ← Sample questions for testing
│
└── docs/
    └── AI_INTERVIEW_PLAN.md            ← This file
```

---

## 📝 What Each File Does

### App Pages

| File | Role |
|---|---|
| `app/interview/page.js` | Setup page: user uploads CV + enters target job role → clicks "Start Interview" |
| `app/interview/session/page.js` | Live interview room: camera on, AI asks questions, user speaks answers |
| `app/interview/report/page.js` | Final page: shows score, correct vs missed answers, improvement tips |

### API Routes (Backend)

| File | Role |
|---|---|
| `api/parse-cv/route.js` | Receives uploaded PDF, uses pdf-parse to extract raw text, returns it |
| `api/generate-questions/route.js` | Sends CV text + job role to GPT-4o, returns 15 tailored questions |
| `api/evaluate-answer/route.js` | Sends question + candidate's answer to GPT-4o, returns score + ideal answer |
| `api/tts-elevenlabs/route.js` | (Optional) Sends text to ElevenLabs, returns audio for AI to speak |

### Interview Components

| File | Role |
|---|---|
| `CameraView.jsx` | Opens webcam, shows live video feed, overlays face-detection frame |
| `CVUploader.jsx` | Drag-and-drop CV upload with PDF validation |
| `RoleInput.jsx` | Text input for the job role the candidate is targeting |
| `InterviewInstructions.jsx` | Countdown + instructions screen before interview starts |
| `AIInterviewer.jsx` | Displays the current question text, speaks it using TTS |
| `MicRecorder.jsx` | Listens via Web Speech API, shows real-time transcript |
| `AnswerDisplay.jsx` | Live display of what the candidate is saying |
| `QuestionProgress.jsx` | Progress bar showing "Question 3 of 15" |
| `ScoreReport.jsx` | Renders final score card with per-question breakdown |

### Lib / Utilities

| File | Role |
|---|---|
| `lib/openai.js` | Initializes OpenAI client with API key |
| `lib/parsePDF.js` | Helper to call the parse-cv API route |
| `lib/speechUtils.js` | Wrappers for SpeechRecognition and SpeechSynthesis browser APIs |

---

## 🗺️ Build Order / Roadmap

Build in this order to avoid dependency issues:

```
Phase 1 — Backend Foundation
  [ ] Step 1: Create .env.local with OpenAI key
  [ ] Step 2: Install packages: npm install pdf-parse openai
  [ ] Step 3: Build app/api/parse-cv/route.js
  [ ] Step 4: Build app/api/generate-questions/route.js
  [ ] Step 5: Build app/api/evaluate-answer/route.js
  [ ] Step 6: Build lib/openai.js + lib/parsePDF.js + lib/speechUtils.js

Phase 2 — Interview Setup Page
  [ ] Step 7: Build components/interview/CVUploader.jsx
  [ ] Step 8: Build components/interview/RoleInput.jsx
  [ ] Step 9: Update app/interview/page.js (setup form)

Phase 3 — Live Interview Session
  [ ] Step 10: Build components/interview/CameraView.jsx (webcam)
  [ ] Step 11: Build components/interview/InterviewInstructions.jsx
  [ ] Step 12: Build components/interview/AIInterviewer.jsx (TTS)
  [ ] Step 13: Build components/interview/MicRecorder.jsx (STT)
  [ ] Step 14: Build components/interview/QuestionProgress.jsx
  [ ] Step 15: Build app/interview/session/page.js (assemble all above)

Phase 4 — Score Report
  [ ] Step 16: Build components/interview/ScoreReport.jsx
  [ ] Step 17: Build app/interview/report/page.js

Phase 5 — Polish
  [ ] Step 18: Animations, loading states, error handling
  [ ] Step 19: Mobile responsiveness
  [ ] Step 20: Test full flow end-to-end
```

---

## 💰 Cost Summary

| Service | Free Tier | Paid |
|---|---|---|
| OpenAI GPT-4o | $5 free credit on signup | ~$0.05/interview after |
| ElevenLabs | 10,000 chars/month | $5/month for more |
| Web Speech API | Unlimited | Free forever |
| pdf-parse | Unlimited | Free forever |

**For development/testing:** Your free OpenAI credit ($5) = ~100 free test interviews.

---

*Last updated: 2026-08-30 | NextHire AI Project*
