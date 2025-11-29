# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Trojans Coaching Assistant is an AI-powered rugby training session planner for Trojans RFC that generates RFU Regulation 15 compliant coaching plans. The application uses Claude Sonnet 4.5 via the Anthropic API to create age-appropriate, comprehensive training sessions that follow the club's coaching framework.

**Tech Stack:** React 18 + TypeScript, Express.js, Vite, Tailwind CSS, Drizzle ORM, PostgreSQL (Neon Serverless)

## Development Commands

### Running the Application
```bash
npm run dev          # Start Vite development server (frontend only)
npm start            # Start Express server (includes Vite in dev mode, serves on port 5000)
npm run build        # Production build
```

**Note:** In development, use `npm start` to run the full application (Express backend + Vite frontend integration). The server runs on port 5000.

### Database Operations
```bash
# Drizzle ORM with PostgreSQL via Neon Serverless
# Schema location: shared/schema.ts
# Config: drizzle.config.ts
# Requires DATABASE_URL environment variable
```

## Architecture Overview

### Project Structure
```
trojans-coaching-assistant/
├── client/               # React frontend
│   └── src/
│       ├── components/   # UI components (Radix UI + Tailwind)
│       ├── pages/        # Page-level components
│       ├── lib/          # Utilities and helpers
│       └── App.tsx       # Main application with AI integration
├── server/               # Express backend
│   ├── index.ts          # Server entry point (port 5000)
│   ├── routes.ts         # API route definitions
│   ├── storage.ts        # Database storage interface
│   └── vite.ts           # Vite dev server integration
└── shared/               # Shared TypeScript schemas
    └── schema.ts         # Drizzle + Zod schemas
```

### Key Architectural Patterns

**Monorepo with Unified Server:**
- Single Express server serves both API routes (`/api/*`) and frontend (via Vite)
- Development: Vite dev middleware integrated with Express (server/vite.ts)
- Production: Static assets served from `dist/public`
- Always runs on port 5000 (configurable via PORT env var)

**Path Aliases (vite.config.ts):**
- `@/` → `client/src/`
- `@shared/` → `shared/`
- `@assets/` → `attached_assets/`

**AI Integration (Backend Proxy Pattern):**
- Backend proxy route at `/api/generate` (server/routes.ts:7) handles all Anthropic API requests
- API key stored securely in server environment variable (`ANTHROPIC_API_KEY`)
- Frontend makes POST requests to backend proxy (client/src/App.tsx:332, 366)
- Backend proxies requests to Anthropic Claude API with server-side API key
- Uses Claude Sonnet 4.5 model (`claude-sonnet-4-20250514`)
- **Benefits:** Enhanced security (API key never exposed to browser), centralized rate limiting, request logging capabilities
- **Client-side API key management:** The application still includes `lib/api-key-storage.ts` and `components/ApiKeyModal.tsx` for fallback API key management (stored in localStorage). These are used when `ANTHROPIC_API_KEY` is not configured server-side.

**Database (Currently Minimal Usage):**
- Schema defined in `shared/schema.ts` using Drizzle ORM
- Storage interface in `server/storage.ts` with in-memory implementation (`MemStorage`)
- Currently implements basic user CRUD scaffolding (not actively used in the application)
- Database integration is set up but minimal - primarily prepared for future features

## Critical Domain Logic

### RFU Regulation 15 Compliance

The core business logic is RFU Regulation 15 age-grade rules, defined in `client/src/App.tsx:66` in the `getRegulation15Rules()` function. These rules are **non-negotiable** and must be strictly enforced:

**Age Group Restrictions:**
- U6: Training only, no matches
- U7-U8: Tag rugby, no contact
- U9: Transitional contact (tackle including hold)
- U10+: Progressive contact rugby with specific limitations per age

**Key Validation Points:**
- Team sizes (4v4 for U7 → 15v15 for U14+)
- Contact levels (no contact → tackle → ruck/maul → full contact)
- Match durations and maximum play time per day
- Scrum configurations (none → 3-player → 8-player)
- Tackle height restrictions (below sternum for youth)

When modifying age group logic, **always reference the actual RFU Regulation 15 documentation**. The rules are updated annually, and the current implementation follows the 2025-26 season rules.

### Trojans Coaching Framework

All session plans must incorporate:
- **TREDS Values:** Teamwork, Respect, Enjoyment, Discipline, Sportsmanship
- **Trojans Coaching Habits:** Shared Purpose, Progression, Praise, Review, Choice
- **The Trojans Player:** Development of Behaviours, Skills, and Knowledge
- **APES Sessions:** Active, Purposeful, Enjoyable, Safe

This framework is embedded in the AI prompt at `client/src/App.tsx:275` (in the `getCoachingAdvice()` function).

### Session Generation Flow

1. User inputs coaching challenge and session parameters
2. Application validates RFU Regulation 15 rules for selected age group
3. Constructs comprehensive prompt with:
   - Coaching challenge and session parameters
   - Age-specific RFU rules
   - Trojans framework requirements
   - Coaching method (Game/Skill Zone, Freeze Frame, Block Practice, Decision Making)
4. Frontend sends prompt to backend proxy endpoint `/api/generate`
5. Backend proxy authenticates with Anthropic API using server-side `ANTHROPIC_API_KEY`
6. Backend forwards request to Claude Sonnet API and returns response to frontend
7. Frontend parses response into:
   - Main session plan (markdown formatted)
   - WhatsApp summary for parents
8. Includes feedback system (thumbs up/down) for session quality

## UI Component Library

The project uses **Radix UI primitives** with **Tailwind CSS** styling. All UI components are in `client/src/components/ui/` and follow a consistent pattern:

- Based on Radix UI for accessibility
- Styled with Tailwind utility classes
- Configured via `components.json`
- Dark mode support via `next-themes` (theme-provider.tsx)
- Class variance patterns using `class-variance-authority`

### Design System

Refer to `design_guidelines.md` for complete design specifications:
- Color palette: Rugby pitch green primary (142 71% 45%), professional blue secondary
- Typography: Inter font family
- Spacing: Tailwind units (2, 4, 6, 8, 12, 16)
- Layout: Max-width 7xl containers, responsive grid patterns

**Important:** All new components must support both light and dark modes.

## Common Development Patterns

### Adding New UI Components
1. Create component in `client/src/components/ui/`
2. Follow Radix UI + Tailwind pattern from existing components
3. Export from component file
4. Include dark mode styles using HSL color variables

### Modifying AI Prompts
Location: `client/src/App.tsx:275` in the `getCoachingAdvice()` function

When modifying:
1. Ensure RFU Regulation 15 rules are accurately represented
2. Test across multiple age groups (especially U7-U8 tag, U9 transitional, U10+ contact)
3. Verify session structure and timing allocations
4. Include coaching dialogue examples with player names

### Adding API Routes
1. Define route in `server/routes.ts` (currently minimal implementation)
2. Use `/api` prefix for all backend routes
3. Update shared types in `shared/schema.ts`
4. Add corresponding frontend hooks if needed

### Database Schema Changes
1. Modify `shared/schema.ts` with Drizzle schema definitions
2. Validation schemas automatically generated via `drizzle-zod`
3. Run migrations (migration files stored in `./migrations`)
4. Update storage interface in `server/storage.ts`

## Environment Variables

Required:
- `ANTHROPIC_API_KEY` - **Server-side only** - Anthropic API key for Claude access via backend proxy (server/routes.ts:12)
- `DATABASE_URL` - PostgreSQL connection string for Neon Serverless
- `PORT` - Server port (defaults to 5000, other ports are firewalled)

**Security Note:** API key is never exposed to the frontend. All AI requests are proxied through the Express backend to keep credentials secure.

## Testing & Deployment

**Current Status:** Development/prototype stage, primarily tested on Replit

**Claude AI Artifact Access:** Development version available at https://claude.ai/public/artifacts/b1063080-9538-4ace-9ab3-76ca48ace623 (provides free API access during testing)

**Production Deployment:** TBD - requires environment configuration for API keys and database

## Rugby-Specific Terminology

When working with rugby content:
- Use correct RFU terminology (e.g., "tackle" vs "hold", "ruck" vs "breakdown")
- Safety is paramount - all activities must be age-appropriate
- Follow World Rugby coaching conventions
- Reference "Keep Your Boots On" (KYBO) video series for resources

## Known Issues & Roadmap

### Technical Debt
- **Dual API key management:** The application supports both server-side (`ANTHROPIC_API_KEY` env var) and client-side (localStorage) API key storage. This dual approach adds complexity. Consider standardizing on server-side only for production deployments.

### Planned Features
See GitHub Issues for planned features:
- Individual section regeneration (#3)
- Trojans helmet logo (#2)
- UI/UX improvements (#4)
- Session history/save feature
- Export to PDF
- Multi-week programme planning

## Important Files Reference

- `client/src/App.tsx` - Main application logic, frontend AI integration, RFU rules
- `server/routes.ts` - API routes including `/api/generate` proxy endpoint for Anthropic API
- `shared/schema.ts` - Database and validation schemas
- `server/index.ts` - Express server setup and middleware
- `vite.config.ts` - Build configuration and path aliases
- `design_guidelines.md` - Complete design system specifications
- `.github/copilot-instructions.md` - AI development guidelines (already incorporated above)
