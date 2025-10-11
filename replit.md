# Rugby Coaching App

## Overview
A foundational React app with Tailwind CSS built for rugby coaching purposes. This provides a clean, professional starting point for building custom rugby coaching features.

## Current State
- **Status**: Basic foundation complete, ready for custom development
- **Tech Stack**: React, TypeScript, Tailwind CSS, Express.js, Wouter (routing)
- **Design System**: Rugby-themed with green primary colors, professional blue accents
- **Features**: Navigation, theme toggle (light/dark mode), responsive layout, placeholder pages

## Project Structure

### Frontend (`client/src/`)
- **Components**:
  - `theme-provider.tsx` - Dark/light mode management with localStorage persistence
  - `theme-toggle.tsx` - Theme switcher button
  - `navigation.tsx` - Responsive navbar with mobile menu
  - `ui/` - Shadcn UI component library

- **Pages**:
  - `home.tsx` - Landing page with feature cards
  - `teams.tsx` - Teams placeholder page
  - `training.tsx` - Training placeholder page  
  - `analytics.tsx` - Analytics placeholder page
  - `not-found.tsx` - 404 error page

### Backend (`server/`)
- `routes.ts` - API routes (ready for custom endpoints)
- `storage.ts` - In-memory storage interface with user example

### Shared (`shared/`)
- `schema.ts` - Data models and types (example user schema included)

## Design System

### Colors
- **Primary**: Rugby pitch green (142 71% 45%)
- **Secondary**: Professional blue (217 91% 60%)
- Fully configured for dark mode

### Typography
- **Font**: Inter (Google Fonts)
- Clean, professional styling with proper hierarchy

### Layout
- Max-width containers (max-w-7xl)
- Responsive grid systems
- Consistent spacing (p-4, p-6, gap-4, gap-6)

## Recent Changes
- Initial project setup with React + Tailwind CSS
- Navigation system with responsive mobile menu
- Theme provider with dark/light mode toggle
- Home page with feature showcase
- Placeholder pages for teams, training, and analytics
- Clean, professional design following rugby coaching aesthetics

## User Preferences
- Requested basic React app with Tailwind CSS
- User will add custom rugby coaching code themselves
- Minimal setup, clean foundation approach

## Next Steps (For User)
You now have a solid foundation to build upon. Here's what you can add:

1. **Team Management**: Customize `/teams` page with roster management, player profiles
2. **Training Programs**: Build drill libraries and session planning in `/training`
3. **Analytics**: Add performance tracking and statistics in `/analytics`
4. **Data Models**: Update `shared/schema.ts` with your data structures
5. **API Routes**: Add endpoints in `server/routes.ts` for your features
6. **Storage**: Implement persistence (database or keep in-memory in `server/storage.ts`)

## How to Run
The app runs with `npm run dev` which starts both frontend (Vite) and backend (Express) servers on the same port. The workflow is already configured and will auto-restart when you make changes.
