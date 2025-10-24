# Trojans Coaching Assistant - AI Development Guidelines

This document guides AI agents in understanding and contributing to the Trojans Coaching Assistant, an RFU Regulation 15 compliant rugby training session planner.

## Project Overview

- **Purpose**: AI-powered session planner for Trojans RFC coaches that generates RFU Regulation 15 compliant training plans
- **Core Features**: Session planning, WhatsApp summaries, YouTube resource suggestions
- **Tech Stack**: React + TypeScript, Vite, Tailwind CSS, Claude Sonnet API

## Key Architecture Components

1. **Client (`/client`)**
   - Single-page React application with TypeScript
   - Component-based UI using Radix UI primitives
   - Global state management via React hooks

2. **Server (`/server`)**
   - Express.js backend for API routing
   - Drizzle ORM with PostgreSQL (Neon Serverless)
   - Session management with `express-session`

3. **Shared (`/shared`)**
   - Common TypeScript schemas using Drizzle and Zod
   - Shared types and validation logic

## Critical Patterns & Conventions

1. **RFU Regulation 15 Compliance**
   - Age group rules defined in `App.tsx` under `getRegulation15Rules()`
   - All session plans must respect age-specific restrictions
   - Reference actual rules when modifying age group logic

2. **Component Structure**
   - UI components use Radix + Tailwind
   - Follow pattern in `/client/src/components/ui`
   - Always include dark mode support

3. **Data Flow**
   - API keys stored in `api-key-storage.ts`
   - Database schema defined in `shared/schema.ts`
   - Form validation with Zod schemas

## Development Workflow

1. **Installation**
```bash
git clone https://github.com/footnote42/trojans-coaching-assistant.git
cd trojans-coaching-assistant
npm install
cd client
npm run dev
```

2. **Environment Setup**
   - Requires Anthropic API key
   - PostgreSQL connection (if using DB features)
   - Node.js 18+

3. **Key Commands**
   - `npm run dev` - Start development server
   - `npm run build` - Production build
   - `npm run preview` - Preview production build

## Integration Points

1. **Claude AI Integration**
   - Uses Sonnet 4.5 model via Anthropic API
   - Prompt engineering in `App.tsx`
   - Required for session plan generation

2. **Database**
   - Neon Serverless PostgreSQL
   - User management schemas
   - Session plan storage (planned)

## Common Tasks

1. **Adding UI Components**
   - Place in `/client/src/components/ui`
   - Follow Radix UI + Tailwind patterns
   - Include dark mode styles

2. **Modifying Session Plans**
   - Update prompts in `App.tsx`
   - Test across all age groups
   - Ensure RFU compliance

3. **API Integration**
   - Add routes in `server/routes.ts`
   - Update shared types in `shared/schema.ts`
   - Add corresponding client hooks

## Project-Specific Guidelines

1. **Rugby Content**
   - Follow RFU Regulation 15 age grade rules
   - Use correct rugby terminology
   - Consider safety in all activities

2. **Code Style**
   - TypeScript strict mode
   - Functional React components
   - Tailwind for styling
   - Zod for validation

## Key Files to Know

- `App.tsx` - Main application logic and AI integration
- `shared/schema.ts` - Database and validation schemas
- `components/ui/*` - Reusable UI components
- `server/routes.ts` - API endpoints
- `lib/api-key-storage.ts` - API key management

## Notes

- User feedback system in development
- WhatsApp message generation requires specific formatting
- YouTube resource suggestions focus on Keep Your Boots On series
- Age group restrictions must be strictly enforced