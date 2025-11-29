# CLAUDE.md - Project Handoff Document

This file provides comprehensive guidance to Claude Code (claude.ai/code) and future developers working with the Trojans Coaching Assistant codebase.

**Last Updated:** November 2025 (v2.1 - Production Deployment)

---

## 📋 Project Overview & Purpose

### What This Is
The Trojans Coaching Assistant is an AI-powered rugby training session planner specifically designed for **Trojans RFC volunteer coaches**. It generates comprehensive, age-appropriate coaching session plans that:
- Comply with **RFU Regulation 15** age-grade rules (U6-U18)
- Follow the **Trojans Coaching Framework** (TREDS values, coaching habits)
- Are tailored to the coach's specific challenge ("players struggle with support play")
- Can be generated in 30 seconds instead of 2+ hours of manual planning

### Why This Exists
**Problem:** Trojans RFC volunteer coaches (many with full-time jobs) need to plan 90-minute training sessions that are safe, engaging, and compliant with complex RFU regulations. Manual planning takes 2-3 hours per session.

**Solution:** AI-powered session generator that encapsulates:
1. RFU Regulation 15 age-grade rules (updated annually)
2. Trojans RFC coaching framework and club ethos
3. Best practice coaching methodologies (Game Zone, Freeze Frame, etc.)
4. Age-appropriate activity progressions using STEP principles

**Impact:** Reduces session planning from 2+ hours to 30 seconds while ensuring compliance and quality.

### Current Status
- **Version:** v2.1 (Production-ready)
- **Deployment:** Vercel (https://trojans-coaching-assistant.vercel.app/)
- **Tech Stack:** React 18 + TypeScript, Express.js, Vite, Tailwind CSS, Radix UI, Claude Sonnet 4.5
- **Database:** PostgreSQL + Drizzle ORM (minimal usage, prepared for future)

---

## 🏗️ Key Architectural Decisions

### Decision 1: Vercel Deployment with Frontend-Only Strategy

**What:** The application is deployed to Vercel as a static site with serverless Edge Functions for API routes.

**Why:**
- **Zero infrastructure management** - No server maintenance, auto-scaling, global CDN
- **Vercel's free tier** is generous for a club application with moderate usage
- **Edge Functions** handle backend proxy without maintaining an Express server in production
- **Instant deploys** from GitHub pushes enable rapid iteration

**How it works:**
- `npm run build` generates static assets to `dist/public/`
- Vercel serves static files from CDN
- API routes in `server/routes.ts` compile to serverless Edge Functions
- Environment variables configured in Vercel dashboard

**Trade-offs:**
- Edge Functions have cold start latency (~100-500ms on first request)
- Limited to 10-second execution time (acceptable for AI API calls)
- Serverless means no persistent in-memory state (must use external storage)

**Alternative considered:** Full Express server on Railway/Render - rejected due to cost and maintenance overhead for a volunteer club project.

### Decision 2: Backend Proxy Pattern for API Security

**What:** Frontend makes requests to `/api/generate-session` which proxies to Anthropic API using server-side `ANTHROPIC_API_KEY`.

**Why:**
- **Security:** API key never exposed to browser (prevents key theft/abuse)
- **Rate limiting:** Centralized control over API usage
- **Logging:** Comprehensive request tracking for debugging and usage monitoring
- **Cost control:** Server-side validation prevents malicious or oversized requests

**How it works:**
1. Frontend sends POST to `/api/generate-session` with prompt and parameters
2. Backend validates request, adds server-side API key
3. Backend proxies to Anthropic Claude API
4. Response streams back through backend to frontend

**Critical file:** `server/routes.ts:12` - Contains the proxy logic with comprehensive logging

**Trade-offs:**
- Adds latency (~50-100ms) vs direct frontend API calls
- Requires server-side environment (can't use purely static hosting)
- But security and cost control benefits far outweigh latency cost

**Legacy dual API key system:** The application still includes `lib/api-key-storage.ts` for client-side API key fallback. This is **technical debt** and should be removed once server-side proxy is proven stable in production.

### Decision 3: RFU Regulation 15 Rules Hardcoded in Frontend

**What:** All RFU age-grade rules are hardcoded in `client/src/App.tsx:66` in the `getRegulation15Rules()` function.

**Why:**
- **Rules are authoritative** - These are legal safety requirements, not user preferences
- **Offline validation** - Coaches can see rules instantly without API calls
- **Cost savings** - No database queries for every session generation
- **Simplicity** - Rules change annually (predictable update cycle), no need for dynamic management
- **Trust** - Rules are visible in code, coaches can verify compliance

**How it works:**
```typescript
const getRegulation15Rules = (ageGroup: string) => {
  switch (ageGroup) {
    case "U7": return { teamSize: "4v4 or 6v6", contact: "Tag only - no contact", ... }
    case "U8": return { teamSize: "4v4 or 6v6", contact: "Tag only - no contact", ... }
    // ... U9-U18 rules
  }
}
```

**Update process:** Annually review RFU Regulation 15 documentation (published June/July) and update the switch statement.

**Alternative considered:** Database-driven rules - rejected as over-engineering for annually-updated static data.

### Decision 4: Custom Markdown Parser for AI Responses

**What:** `lib/session-parser.ts` parses Claude's markdown responses into structured `ActivitySection[]` objects.

**Why:**
- **Consistent UI** - AI responses vary in structure, parser normalizes them
- **Better UX** - Collapsible sections, individual copy-to-clipboard, duration badges
- **Extensibility** - Can add features like "regenerate this section" in future
- **Error handling** - Fallback to single section if parsing fails (graceful degradation)

**How it works:**
1. Takes raw markdown string from Claude API
2. Detects activity boundaries (headers, numbered lists, keywords like "Warm-up", "Cool Down")
3. Extracts durations from patterns like "(10 minutes)", "Duration: 15 min"
4. Nests subsections under main activities
5. Returns array of structured activity objects

**Trade-offs:**
- Parser logic is complex (~200 lines)
- Brittle to unexpected AI response formats (mitigated by fallback logic)
- But UX improvements justify the complexity

---

## 🏉 Coaching Frameworks Embedded in Prompts

### Trojans Coaching Habits (The 5 Pillars)

All session plans must demonstrate these habits (embedded in `App.tsx:275`):

1. **Shared Purpose** - Clear session objective aligned to player development
2. **Progression** - Activities build on each other using STEP principles (Space, Task, Equipment, People)
3. **Praise** - Coaching dialogue includes specific, positive feedback
4. **Review** - Session includes reflection questions and key learning points
5. **Choice** - Players given decision-making opportunities within activities

**Why hardcoded:** These represent Trojans RFC's coaching philosophy and must appear in every session regardless of age group or focus area.

### TREDS Values (Trojans RFC Ethos)

Every session plan reinforces:
- **T**eamwork - Activities emphasize collaboration
- **R**espect - For opponents, coaches, officials
- **E**njoyment - Sessions must be fun and engaging
- **D**iscipline - Structure, organization, listening skills
- **S**portsmanship - Fair play and positive attitudes

**How they're embedded:** The AI prompt instructs Claude to weave these values into coaching points and activity design.

### RFU Regulation 15 Compliance Requirements

**Critical:** These are **legal safety requirements**, not suggestions.

**Key rules by age group:**

| Age | Team Size | Contact Level | Scrum | Match Duration |
|-----|-----------|---------------|-------|----------------|
| U6 | 4v4 | None (training only) | None | No matches |
| U7-U8 | 4v4/6v6 | Tag only | None | 10 min halves |
| U9 | 7v7 | Tackle + hold | 3-player | 15 min halves |
| U10 | 8v8 | Tackle + 1 support | 3-player | 20 min halves |
| U11 | 9v9 | Tackle + 2 support | 3-player | 25 min halves |
| U12 | 12v12 | Full breakdown | 8-player | 25 min halves |
| U13+ | 15v15 | Full contact (restricted) | 8-player | 30-35 min halves |

**Contact level restrictions:**
- **No contact:** Tag belts only, no tackling
- **Tackle + hold:** Ball carrier can be held and brought to ground, no ruck/maul
- **Tackle + support:** Rucking allowed with limited support players
- **Full breakdown:** Ruck/maul with restrictions (e.g., no "flying wedge")

**Why this matters:** RFU Regulation 15 violations can result in insurance invalidation and coach suspensions. **The application must never generate non-compliant sessions.**

### APES Sessions Framework

All sessions must be:
- **A**ctive - Minimize standing/waiting time (target: 80% active time)
- **P**urposeful - Every activity linked to clear learning objective
- **E**njoyable - Fun, varied, game-based where possible
- **S**afe - Age-appropriate contact, proper progressions, risk management

---

## ⚠️ CRITICAL FILES - Change with Extreme Care

### 🚨 `client/src/App.tsx:66` - RFU Regulation 15 Rules Function

**Location:** `getRegulation15Rules(ageGroup: string)`

**Why critical:** Contains legally-mandated safety requirements. Errors here could result in unsafe training sessions.

**Before modifying:**
1. Consult official RFU Regulation 15 documentation (published annually)
2. Cross-reference with current Trojans RFC age-grade guidelines
3. Test across ALL age groups (U6-U18) to ensure no regressions
4. Have a qualified Level 2+ coach review changes

**Common mistakes to avoid:**
- Mixing up U7/U8 rules (both tag but different match durations)
- Incorrect scrum player counts (3-player for U9-U11, 8-player for U12+)
- Missing tackle height restrictions (below sternum for youth)

### 🚨 `client/src/App.tsx:275` - Claude API Prompt Structure

**Location:** `getCoachingAdvice()` function - constructs the AI prompt

**Why critical:** This is the "coaching brain" of the application. The prompt structure determines session quality, compliance, and usefulness.

**Current prompt sections:**
1. **Role definition** - "You are an expert rugby coach at Trojans RFC..."
2. **Session parameters** - Age group, player count, duration, focus area
3. **RFU Regulation 15 rules** - Injected from `getRegulation15Rules()`
4. **Trojans Framework** - TREDS, coaching habits, APES
5. **Coaching methodology** - Game Zone/Skill Zone/Freeze Frame/Block Practice/Decision Making
6. **Output format** - Markdown structure with specific sections
7. **Safety emphasis** - Age-appropriate contact progressions
8. **Resource suggestions** - KYBO videos, RFU Kids First resources

**Before modifying:**
1. Test changes with multiple age groups (especially U7/U8 tag and U9 transitional)
2. Verify all output sections are still present (equipment, safety brief, etc.)
3. Check that RFU rules are accurately represented in prompt
4. Ensure coaching dialogue examples include player names (engagement technique)
5. Test with various coaching challenges (skills, tactics, behavior)

**Common mistakes:**
- Removing RFU rules from prompt (results in non-compliant sessions)
- Changing output format without updating `session-parser.ts`
- Over-constraining the AI (reduces creativity and adaptability)
- Under-constraining the AI (results in generic, non-Trojans-specific sessions)

### 🚨 `server/routes.ts` - API Proxy Endpoint

**Location:** `/api/generate-session` route handler

**Why critical:** Handles all AI requests, contains API key, logging, error handling.

**Security requirements:**
- API key must NEVER be logged or returned to frontend
- Request validation must prevent oversized prompts (cost control)
- Error messages must not expose internal implementation details

**Before modifying:**
1. Test with various prompt sizes and edge cases
2. Verify API key is still server-side only
3. Check that logging doesn't expose sensitive data
4. Ensure error handling is graceful and user-friendly

---

## 🛠️ Common Development Tasks

### Task 1: Adding a New Age Group

**Scenario:** RFU introduces a new age band (e.g., U19) or splits an existing one.

**Steps:**

1. **Update RFU rules constant** (`client/src/App.tsx:66`)
   ```typescript
   case "U19":
     return {
       ageGroup: "U19",
       teamSize: "15v15",
       matchDuration: "40 minute halves",
       contact: "Full adult contact rules",
       scrums: "Full scrums (8-player)",
       ruck: "Full breakdown",
       maul: "Full maul allowed",
       kicking: "All kicks allowed",
       tackleHeight: "Full contact (chest and below)",
       maxPlayTime: "160 minutes per day"
     }
   ```

2. **Update age group dropdown** (`client/src/App.tsx` - search for `ageGroups` array)
   ```typescript
   const ageGroups = ["U6", "U7", "U8", ..., "U18", "U19"]
   ```

3. **Test the new age group:**
   - Generate a session for the new age group
   - Verify RFU rules display correctly in the UI
   - Check that Claude generates age-appropriate content
   - Ensure contact level color-coding is correct (green/yellow/orange)

4. **Update documentation:**
   - `README.md` - RFU compliance table
   - This file (`CLAUDE.md`) - Age group rules table
   - `design_guidelines.md` - If visual changes needed

### Task 2: Modifying Trojans Coaching Framework

**Scenario:** Club updates coaching habits or adds new TREDS values.

**Steps:**

1. **Update the prompt** (`client/src/App.tsx:275` in `getCoachingAdvice()`)

   Locate the section:
   ```typescript
   **Trojans Coaching Framework:**
   - TREDS Values: Teamwork, Respect, Enjoyment, Discipline, Sportsmanship
   - Coaching Habits: Shared Purpose, Progression, Praise, Review, Choice
   ```

   Modify to reflect new framework.

2. **Update UI display** (if framework is shown to user)
   - Search for "TREDS" across codebase to find all references
   - Update any UI components that display framework

3. **Test impact on session generation:**
   - Generate sessions for multiple age groups
   - Verify new framework elements appear in AI output
   - Check that session quality/structure hasn't degraded

4. **Update documentation:**
   - `README.md` - Trojans Coaching Framework section
   - This file - Coaching Frameworks section

### Task 3: Updating Claude API Integration

**Scenario:** Anthropic releases Claude 4.0 or changes API format.

**Steps:**

1. **Check API compatibility:**
   - Review Anthropic API changelog
   - Test new model/API with current integration
   - Verify pricing changes don't break budget

2. **Update model reference** (`server/routes.ts`)
   ```typescript
   model: "claude-sonnet-4-20250514" // Update to new model ID
   ```

3. **Update API call structure if needed:**
   - Message format changes
   - New parameters (temperature, top_p, etc.)
   - Response structure changes

4. **Update error handling:**
   - New error codes or formats
   - Rate limiting changes
   - Token limit changes

5. **Test thoroughly:**
   - Session generation across all age groups
   - Error scenarios (invalid prompts, API errors)
   - Cost monitoring (new model pricing)
   - Response quality (compare to previous model)

6. **Update documentation:**
   - `README.md` - Tech stack section
   - `.env.example` - If new environment variables needed
   - This file - AI Integration section

### Task 4: Adding a New Coaching Methodology

**Scenario:** Want to add "EDGE" (Explain, Demonstrate, Guide, Enable) to existing methodologies.

**Steps:**

1. **Add to methodology dropdown** (`client/src/App.tsx`)
   ```typescript
   const methodologies = [
     "Game Zone / Skill Zone",
     "Freeze Frame",
     "Block Practice",
     "Decision Making Activities",
     "EDGE (Explain, Demonstrate, Guide, Enable)" // New
   ]
   ```

2. **Update AI prompt** (`client/src/App.tsx:275`)

   Add EDGE explanation to the methodology section:
   ```typescript
   if (method === "EDGE (Explain, Demonstrate, Guide, Enable)") {
     methodPrompt = `
       Use the EDGE coaching method:
       - Explain: Coach clearly explains the skill/concept
       - Demonstrate: Coach or skilled player demonstrates
       - Guide: Players practice with coach guidance and feedback
       - Enable: Players perform independently in game-like scenarios
     `
   }
   ```

3. **Test methodology:**
   - Generate sessions using EDGE for various age groups
   - Verify AI follows EDGE structure
   - Check that output quality matches other methodologies

4. **Update templates** (`client/src/lib/templates.ts`)
   - Consider adding example challenges that work well with EDGE

### Task 5: Fixing RFU Regulation 15 Rules (Annual Update)

**Scenario:** RFU publishes updated Regulation 15 for 2026-27 season.

**Steps:**

1. **Obtain official documentation:**
   - Download from RFU website (usually published June/July)
   - Cross-reference with RFU age-grade rugby handbook
   - Note all changes from previous season

2. **Update rules systematically:**
   ```typescript
   // client/src/App.tsx:66
   const getRegulation15Rules = (ageGroup: string) => {
     switch (ageGroup) {
       case "U10": // Example: scrum rules changed
         return {
           scrums: "3-player uncontested scrums (NEW: contested allowed with trained coaches)",
           // Update all changed fields
         }
     }
   }
   ```

3. **Update color-coding if contact levels change:**
   - Check `client/src/App.tsx` where contact level determines alert color
   - Green (no contact), Yellow (limited), Orange (full contact)

4. **Test ALL age groups:**
   - U6, U7, U8, U9, U10, U11, U12, U13, U14, U15, U16, U17, U18
   - Verify rules display correctly in UI
   - Generate sessions and check AI respects new rules

5. **Document changes:**
   - Add note to README.md: "Updated for RFU Regulation 15 2026-27 season"
   - Update this file's rules table
   - Consider adding changelog entry

---

## 🐛 Known Technical Debt to Address

### 1. Dual API Key Management System

**Issue:** Application supports both server-side (`ANTHROPIC_API_KEY` env var) and client-side (localStorage) API key storage.

**Why it exists:** Originally built with client-side API calls, then added backend proxy for security. Client-side fallback remained for backward compatibility.

**Current state:**
- `server/routes.ts` - Backend proxy (primary, secure method)
- `lib/api-key-storage.ts` + `components/ApiKeyModal.tsx` - Client-side fallback (deprecated)

**Recommended fix:**
1. Remove `lib/api-key-storage.ts` and `ApiKeyModal.tsx`
2. Remove client-side API key logic from `App.tsx`
3. Standardize on backend proxy only
4. Update documentation to remove client-side key references

**Risk:** Low - backend proxy has been stable in production. Client-side code is legacy.

**Effort:** Medium - requires testing to ensure no regressions.

### 2. 32 Unused Radix UI Components (~3,500 lines)

**Issue:** Project includes full Radix UI component library but only uses ~15 components.

**Unused bloat:**
- `sidebar.tsx` (727 lines) - Never imported
- `chart.tsx` (365 lines) - Never imported
- `carousel.tsx`, `menubar.tsx`, `form.tsx`, etc. - 29 more unused files

**Current state:** All files present in `client/src/components/ui/`

**Recommended fix:**
1. Identify components used in production
2. Delete unused components (save ~3,500 lines of code)
3. Verify build size reduction

**Risk:** Low - unused components have zero imports.

**Effort:** Low - simple deletion with build verification.

**Trade-off:** Keeping components provides "ready to use" library for future features. Deleting improves build times and reduces cognitive overhead.

### 3. Session History Stored in localStorage Only

**Issue:** Sessions saved to browser localStorage are lost if user clears browser data or switches devices.

**Current state:** `lib/session-storage.ts` uses `localStorage.setItem()`

**Recommended fix:** **Next major phase - Supabase backend integration**
1. Replace localStorage with Supabase database
2. Add user authentication (Supabase Auth)
3. Cloud-based session storage with sync across devices
4. Enable session sharing between coaches

**Risk:** Medium - requires significant architecture changes.

**Effort:** High - full backend integration project.

### 4. WhatsApp Summaries Cannot Be Regenerated Independently

**Issue:** WhatsApp summary is generated once during session creation. If user wants a different summary, they must regenerate the entire session.

**Current state:** Single API call generates both full session and WhatsApp summary.

**Recommended fix:**
1. Add "Regenerate WhatsApp Summary" button
2. Separate API call with different prompt (summary-focused)
3. Preserve full session plan while updating summary only

**Risk:** Low - additive feature, doesn't affect existing functionality.

**Effort:** Medium - requires UI changes and new API endpoint.

### 5. PDF Export Uses Client-Side Rendering (Performance Issues)

**Issue:** Large sessions with many activities can cause browser slowdown during PDF generation.

**Current state:** `html2canvas` + `jspdf` render in browser (client-side).

**Recommended fix:**
1. Move PDF generation to serverless function
2. Use server-side rendering (Puppeteer or similar)
3. Return PDF blob to frontend for download

**Risk:** Medium - requires new backend infrastructure.

**Effort:** High - serverless PDF generation is complex.

**Alternative:** Keep client-side but optimize (reduce image quality, lazy rendering).

---

## 🗺️ Next Planned Features

### Phase 1: Supabase Backend Integration (Q1 2026)

**Primary goals:**
- Replace localStorage with Supabase PostgreSQL database
- Add user authentication (Supabase Auth)
- Cloud-based session storage accessible from any device
- Session sharing between coaches

**GitHub Issues:**
- See project Issues for detailed breakdown

**Technical approach:**
1. Set up Supabase project
2. Design session schema (sessions, users, shared_sessions tables)
3. Implement Supabase Auth (email/password or OAuth)
4. Migrate `session-storage.ts` to Supabase client
5. Add session sharing UI (share by email, generate link)
6. Migrate existing localStorage sessions (one-time migration tool)

**Estimated effort:** 2-3 weeks (depending on auth complexity)

### Phase 2: Session Management Enhancements

**Features:**
- Individual section regeneration ([#3](https://github.com/footnote42/trojans-coaching-assistant/issues/3))
- Multi-week programme planning
- Equipment inventory tracking
- Session templates based on saved sessions

### Phase 3: Analytics & Insights

**Features:**
- Session feedback analytics dashboard
- Most popular coaching challenges
- Age group usage statistics
- Activity effectiveness tracking (based on thumbs up/down)

---

## 📁 Important Files Reference

### Core Application Files

**`client/src/App.tsx`** (989 lines) - Main application component
- Line 66: `getRegulation15Rules()` - **CRITICAL** RFU rules function
- Line 275: `getCoachingAdvice()` - **CRITICAL** AI prompt construction
- Session generation logic, form handling, state management

**`server/routes.ts`** - API proxy endpoint
- Line 12: `/api/generate-session` route handler
- Anthropic API integration with comprehensive logging
- Server-side API key storage and validation

**`server/index.ts`** - Express server entry point
- Port 5000 (configurable via PORT env var)
- Vite dev middleware integration
- CORS configuration

**`shared/schema.ts`** - Database schemas (Drizzle ORM + Zod)
- User schema (minimal, prepared for future)
- Validation schemas for API requests

### Session Processing

**`client/src/lib/session-parser.ts`** - Markdown parser
- Parses Claude's markdown responses into structured `ActivitySection[]`
- Extracts activity titles, durations, content
- Handles nested subsections and fallback logic

**`client/src/components/coaching/SessionPlan.tsx`** - Session display
- Radix UI Accordion with collapsible sections
- Individual copy-to-clipboard for each activity
- Duration badges and numbered indicators

**`client/src/components/coaching/SessionPlanSkeleton.tsx`** - Loading state
- Multi-stage loading indicators
- Estimated completion time display
- Animated placeholders

### UI Components

**`client/src/components/coaching/TemplateLibrary.tsx`** - Quick-start templates
- Pre-built coaching challenges
- Auto-fill functionality

**`client/src/components/ui/toaster.tsx`** - Toast notifications
- 3-message limit, 3-second auto-dismiss
- Success/error/info variants

### Storage & Utilities

**`client/src/lib/session-storage.ts`** - localStorage session management
- Save/load/delete sessions from localStorage
- **Technical debt:** Replace with Supabase in next phase

**`client/src/lib/templates.ts`** - Coaching challenge templates
- 4 pre-built templates (U10-U14)
- Easy to add more templates

**`client/src/lib/api-key-storage.ts`** - Legacy client-side API key storage
- **Technical debt:** Remove once backend proxy is proven stable

### Configuration

**`vite.config.ts`** - Vite build configuration
- Path aliases: `@/` → `client/src/`, `@shared/` → `shared/`
- React plugin configuration
- Build optimizations

**`vercel.json`** - Vercel deployment configuration
- Build command: `npm run build`
- Output directory: `dist/public`
- API route rewrites for `/api/*`

**`tailwind.config.ts`** - Tailwind CSS configuration
- Custom color palette (rugby green, professional blue)
- Custom spacing, typography, animations

**`.env.example`** - Environment variables template
- `ANTHROPIC_API_KEY` (required)
- `DATABASE_URL` (optional, for future)
- `PORT` (optional, default 5000)

---

## 🎓 Rugby-Specific Terminology Reference

When working with rugby coaching content, use these correct terms:

**Contact Levels:**
- "Tag rugby" (not "flag rugby")
- "Tackle" (bringing ball carrier to ground)
- "Hold" (grasping without bringing to ground)
- "Ruck" (contest for ball on ground)
- "Maul" (contest with ball carrier still standing)
- "Breakdown" (general term for ruck/maul situations)

**Coaching Methods:**
- "Game Zone / Skill Zone" (not "drills and scrimmages")
- "Freeze Frame" (stopping play to highlight teaching points)
- "STEP Progression" (Space, Task, Equipment, People modifications)

**Safety Terminology:**
- "Tackle height" (where contact is made, e.g., "below sternum")
- "Fly-hack" (kicking ball as it bounces - restricted for younger ages)
- "Uncontested scrum" (no pushing, just formation)
- "Contested scrum" (full pushing, requires trained coaches)

**Age Grades:**
- Always use "U" prefix (U7, not "Under-7" or "7s")
- "Mini rugby" = U6-U12
- "Youth rugby" = U13-U18

**Resources:**
- "Keep Your Boots On (KYBO)" - RFU video series
- "RFU Kids First" - Safeguarding framework
- "World Rugby" (not "International Rugby Board" - old name)

---

## 📚 Additional Documentation

**For detailed design specifications:** See `design_guidelines.md`
**For deployment procedures:** See `VERCEL-DEPLOYMENT.md`
**For API testing:** See `API-TESTING.md`
**For project roadmap:** See `README.md` and GitHub Issues

---

**Last Updated:** November 2025 by Wayne Ellis (Trojans RFC)
**Next Review:** June 2026 (RFU Regulation 15 annual update)
