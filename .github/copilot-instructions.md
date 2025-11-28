# Trojans Coaching Assistant - AI Development Guidelines

This document guides AI agents in understanding and contributing to the Trojans Coaching Assistant, an RFU Regulation 15 compliant rugby training session planner.

## Project Overview

- **Purpose**: AI-powered session planner for Trojans RFC coaches that generates RFU Regulation 15 compliant training plans
- **Core Features**: Session planning, WhatsApp summaries, YouTube resource suggestions
- **Tech Stack**: React + TypeScript, Vite, Tailwind CSS, Claude Sonnet API

## Key Architecture Components

1. **Client (`/client`)**
   ```md
   # Trojans Coaching Assistant — Quick AI Agent Guide

   This repo is a single Express server that serves a React SPA and proxies Anthropic requests. Focus on the minimal facts an agent needs to be productive.

   - Top-level layout:
     - `client/` — React + TypeScript UI (Radix primitives, Tailwind)
     - `server/` — Express API and Vite middleware (`server/index.ts`, `server/vite.ts`)
     - `shared/` — Drizzle ORM + Zod schemas (`shared/schema.ts`)

   - Core integration points to reference:
     - AI proxy endpoint: `POST /api/generate` (see `server/routes.ts`). Payload: `{ prompt: string, maxTokens?: number }`.
     - Prompt assembly: in `client/src/App.tsx` inside `getCoachingAdvice()`; RFU rules live in `getRegulation15Rules()`.
     - Path aliases (vite): `@` → `client/src`, `@shared` → `shared` (`vite.config.ts`).

   - Run & dev behavior (important):
     - Frontend-only: `npm run dev` (runs Vite with `client/` root).
     - Full app (API + Vite middleware): `npm start` (`tsx server/index.ts`) — use for end-to-end testing (recommended).
     - Env vars: `ANTHROPIC_API_KEY` (server-only), `DATABASE_URL`, `PORT` (default 5000).

   - Conventions and rules for contributors/agents:
     - Never expose the server `ANTHROPIC_API_KEY` to client code; use the `/api/generate` proxy.
     - RFU Regulation 15 rules in `getRegulation15Rules()` are authoritative. Any change must cite RFU docs and be validated across age groups.
     - UI components go in `client/src/components/ui/` and should follow existing Radix+Tailwind patterns including dark mode.
     - Database schema changes belong in `shared/schema.ts` (Drizzle) and updates should keep server/client types aligned.

   - Quick examples:
     - Where to change the prompt: `client/src/App.tsx`, search `getCoachingAdvice` and the prompt template near it.
     - Call shape to generate session: `fetch('/api/generate', { method: 'POST', body: JSON.stringify({ prompt, maxTokens: 4000 }) })`.

   - Known legacy items: `client/src/lib/api-key-storage.ts` and `ApiKeyModal.tsx` are local-dev fallbacks — production uses server-side proxying.

   If you want, I can expand this file with short examples of prompt sanitization, test payloads, or a checklist for safe changes to RFU rules.
   ```