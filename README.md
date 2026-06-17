# Trojans Coaching Assistant

An AI-powered rugby session planner for volunteer coaches at Trojans RFC. Generates complete, RFU Regulation 15 compliant training sessions in around 30 seconds — covering U6 through U18 — compared to 2+ hours of manual planning.

**Live:** https://trojans-coaching-assistant.vercel.app/

---

## The problem it solves

Volunteer rugby coaches typically have full-time jobs. Planning a 90-minute training session that is age-appropriate, legally compliant, methodologically sound, and engaging takes real time — time most coaches don't have mid-week. Get the compliance wrong (wrong contact level for the age group, prohibited techniques) and you risk insurance invalidation and coach suspension under RFU Regulation 15.

This tool encodes everything a coach needs to know into a single AI-driven interface. Describe your challenge ("players are losing possession at the breakdown"), pick your age group and session length, and get a complete plan with activities, STEP progressions, coaching dialogue examples, safety considerations, and a ready-to-paste WhatsApp message for parents.

---

## What it does

**Session generation** — Claude Sonnet produces a full structured session plan from a free-text coaching challenge. Activities are broken into arrival, warm-up, main block, and cool-down. Each activity includes organisation instructions, key coaching points, STEP progressions (Space, Task, Equipment, People), and example coaching dialogue.

**RFU Regulation 15 compliance** — Rules for every age grade (U6–U18) are encoded in the app: team sizes, contact levels, scrum formats, tackle height restrictions, kicking permissions, maximum play times. These rules are injected into the AI prompt on every generation. The UI shows a compliance badge (green / yellow / orange) before generation.

**Coaching methodology selection** — Four methods supported: Game Zone / Skill Zone, Freeze Frame / Rewind, Block Practice (Pull Outs), and Decision Making Activities. The chosen method shapes the prompt and the structure of the output.

**Trojans framework embedding** — Every session incorporates TREDS values (Teamwork, Respect, Enjoyment, Discipline, Sportsmanship), the five Trojans Coaching Habits (Shared Purpose, Progression, Praise, Review, Choice), and the APES principles (Active, Purposeful, Enjoyable, Safe). These are baked into the prompt, not applied as post-processing filters.

**WhatsApp parent message** — A second Claude call generates a 150–200 word parent-ready message: session focus, what to bring, pickup reminder. Copies to clipboard in one click.

**Session history** — Generated sessions auto-save to localStorage with full parameters and plan text.

**PDF export** — Full session plan exported via html2canvas + jsPDF.

**Quick-start templates** — Four pre-built challenges auto-fill the form for common scenarios.

---

## How it works

### Architecture

The app is a React 18 + TypeScript SPA served as a static site from Vercel's CDN. AI calls are proxied through a Vercel serverless function (`api/generate-session.ts`) so the Anthropic API key never reaches the browser.

```
Browser (React SPA)
    └── POST /api/generate-session
            └── Vercel serverless function
                    └── Anthropic Messages API (claude-sonnet-4-20250514)
```

### Prompt engineering

The main prompt (`client/src/App.tsx`, `getCoachingAdvice()`) is structured in eight sections:

1. Role definition — expert rugby coach at Trojans RFC with RFU qualification context
2. Session parameters — age group, player count, coach count, duration, focus area
3. RFU Regulation 15 rules — dynamically injected from `getRegulation15Rules()` for the selected age group
4. Trojans coaching framework — TREDS values and five coaching habits
5. Coaching methodology — detailed description of the selected method (e.g., the full Game Zone / Skill Zone workflow: unopposed game, then skill practice, then opposed game)
6. Output format specification — section structure, what each activity must contain
7. Safety emphasis — age-appropriate contact progressions, tackle height, prohibited elements per age grade
8. Resource suggestions — Keep Your Boots On (KYBO) video topic references by activity

The WhatsApp summary uses a second, lighter call (400 token budget) with the full session plan as context and a separate prompt focused on parent communication.

### Response parsing

Claude returns markdown. `client/src/lib/session-parser.ts` parses it into structured `ActivitySection[]` objects, detecting section boundaries by markdown headers, numbered list patterns, and a keyword list. Each section renders as a collapsible accordion card with a duration badge and individual copy-to-clipboard. If parsing produces no sections, the raw text falls back to a single panel.

### RFU compliance as a data layer

`getRegulation15Rules()` is a typed switch statement covering all 13 age grades. Each grade returns an object with: format, team size, pitch size, half length, max play time, contact level, scrum rules, lineout rules, kickoff type, kicking permissions, and notes. This data is injected verbatim into the AI prompt and displayed in the UI compliance alert. The switch statement is the single source of truth — both the UI and the AI prompt read from the same object.

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, Radix UI primitives |
| AI | Anthropic Claude (`claude-sonnet-4-20250514`) via Messages API |
| Backend | Vercel serverless functions |
| PDF export | html2canvas + jsPDF |
| Session storage | localStorage (Supabase migration planned) |
| Deployment | Vercel (auto-deploy from GitHub main) |

---

## Local development

Prerequisites: Node.js 18+, an Anthropic API key.

```bash
git clone https://github.com/footnote42/trojans-coaching-assistant
cd trojans-coaching-assistant
npm install
cp .env.example .env
# Add ANTHROPIC_API_KEY to .env
npm start
```

The Express dev server runs on port 5000 with Vite middleware. Open http://localhost:5000.

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Yes | Server-side only — never exposed to the browser |
| `DATABASE_URL` | No | PostgreSQL (Neon) — not active in current version |
| `PORT` | No | Local server port (default: 5000) |

---

## Deployment

Auto-deploys to Vercel on push to `main`. Add `ANTHROPIC_API_KEY` to Vercel project environment variables before first deploy.

---

## RFU Regulation 15 — age grade reference

| Age | Format | Contact | Scrum |
|-----|--------|---------|-------|
| U6 | Training only | None | None |
| U7 | Tag 4v4 | Tag only | None |
| U8 | Tag 6v6 | Tag only | None |
| U9 | Contact 7v7 | Tackle + hold, below sternum | None |
| U10 | Contact 8v8 | Tackle, ruck/maul (1 support) | 3-player uncontested |
| U11 | Contact 9v9 | Tackle, ruck/maul (2 support) | 3-player contested |
| U12 | Contact 12v12 | Full breakdown | 5-player contested |
| U13–U18 | Full 15v15 | Full contact, tackle below sternum | 8-player contested |

Full rules including pitch sizes, half lengths, and kicking permissions are encoded in `client/src/App.tsx:90`.

---

## Project structure

```
trojans-coaching-assistant/
├── client/src/
│   ├── App.tsx                      # Main app — RFU rules (line 90), AI prompt (line 278)
│   ├── components/coaching/
│   │   ├── SessionPlan.tsx          # Accordion display with copy/export
│   │   ├── SessionHistory.tsx       # localStorage session browser
│   │   └── TemplateLibrary.tsx      # Quick-start templates
│   └── lib/
│       ├── session-parser.ts        # Markdown to ActivitySection[] parser
│       ├── session-storage.ts       # localStorage read/write
│       └── pdf-export.ts            # html2canvas + jsPDF export
├── server/
│   ├── index.ts                     # Express entry point (local dev)
│   └── routes.ts                    # API proxy (local dev)
├── api/
│   └── generate-session.ts          # Vercel serverless function (production)
└── vercel.json                      # Build config and API route rewrites
```

---

## Roadmap

**Next phase:** Supabase backend — replace localStorage with cloud storage, user authentication, session sharing between coaches.

**Future:** Individual section regeneration, multi-week programme planning, equipment inventory tracking, coaching analytics from session feedback.

---

## Background

Built by Wayne Ellis, Senior Engineering Manager and volunteer U10s coach at Trojans RFC. The tool came from a real coaching problem: planning compliant, structured sessions for young players week after week while working full-time. The domain knowledge — RFU regulations, Trojans coaching framework, KYBO resources — was accumulated over several seasons and embedded into the prompt design.

Built using Claude Code with an iterative vibe-coding methodology: define the problem, spec the solution, implement, test against real coaching scenarios, refine the prompt based on output quality.

GitHub: https://github.com/footnote42
