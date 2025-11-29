# 🏉 Trojans Coaching Assistant

AI-powered rugby training session planner for Trojans RFC that generates RFU Regulation 15 compliant coaching plans using Claude Sonnet 4.5.

**🚀 Live App:** https://trojans-coaching-assistant.vercel.app/

---

## Overview

The Trojans Coaching Assistant helps rugby coaches quickly generate comprehensive, age-appropriate training sessions that follow the club's coaching framework and comply with RFU Regulation 15 age-grade regulations.

**Built for:** Trojans RFC volunteer coaches
**Status:** ✅ Production-ready (v2.1)

---

## ✨ Current Features

### Core Functionality
- ✅ **RFU Regulation 15 Compliance** - Automatic age group validation (U6-U18) with correct team sizes, contact levels, and match durations
- ✅ **AI-Powered Session Generation** - Claude Sonnet 4.5 creates complete training plans tailored to your coaching challenge
- ✅ **Trojans Framework Integration** - Embeds TREDS values, coaching habits, and the Trojans Player development model
- ✅ **Multiple Coaching Methodologies** - Game Zone/Skill Zone, Freeze Frame, Block Practice, Decision Making Activities

### Session Planning
- ✅ **Structured Session Display** - Collapsible accordion sections with individual copy-to-clipboard for each activity
- ✅ **WhatsApp Parent Summaries** - Auto-generated parent-friendly session descriptions (150-200 words)
- ✅ **PDF Export** - Download session plans as PDF documents
- ✅ **Session Save/Load** - Save sessions to localStorage and reload them later
- ✅ **Quick-Start Templates** - Pre-built coaching challenges for common scenarios (U10-U14)

### User Experience
- ✅ **Professional Loading States** - Multi-stage loading indicators with estimated completion time
- ✅ **Toast Notifications** - Modern feedback system for all user actions
- ✅ **Mobile Responsive** - Touch-optimized with sticky generate button for mobile devices
- ✅ **Color-Coded RFU Rules** - Visual indicators (green/yellow/orange) for contact level restrictions
- ✅ **Feedback System** - Thumbs up/down tracking for session quality

---

## 🛠️ Tech Stack

**Frontend:**
- React 18 + TypeScript
- Tailwind CSS + Radix UI components
- Vite (build tool)

**Backend:**
- Express.js with backend proxy pattern
- Claude Sonnet 4.5 API (Anthropic)
- PostgreSQL + Drizzle ORM (minimal usage, prepared for future features)

**Deployment:**
- Vercel (production)
- Serverless Edge Functions for API routes

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js 18+ and npm
- Git
- Anthropic API key ([get one here](https://console.anthropic.com/settings/keys))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/footnote42/trojans-coaching-assistant.git
   cd trojans-coaching-assistant
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy `.env.example` to `.env` and add your API key:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add:
   ```env
   ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

   This runs the Express server with integrated Vite middleware on port 5000.

   Alternative (frontend-only, faster for UI iteration):
   ```bash
   npm run dev
   ```
   This runs the Vite dev server on port 5173 (API calls will fail without backend).

5. **Open in browser**
   - Full app: `http://localhost:5000`
   - Frontend-only: `http://localhost:5173`

---

## 🌐 Deployment (Vercel)

### Deploy to Vercel

1. **Install Vercel CLI** (optional)
   ```bash
   npm install -g vercel
   ```

2. **Connect your project**
   ```bash
   vercel
   ```

3. **Configure environment variables**

   In Vercel dashboard (Project Settings > Environment Variables):
   - `ANTHROPIC_API_KEY` - Your Anthropic API key

   Add for all environments: Production, Preview, Development

4. **Deploy**
   ```bash
   vercel --prod
   ```

### Vercel Configuration

The project includes `vercel.json` with:
- Build command: `npm run build`
- Output directory: `dist/public`
- Framework detection: Vite
- API route rewrites for `/api/*` endpoints

---

## 📋 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | **Yes** | Server-side Anthropic API key for Claude Sonnet 4.5 |
| `DATABASE_URL` | No | PostgreSQL connection string (for future features) |
| `PORT` | No | Server port (default: 5000, ignored by Vercel) |

**Security Note:** The API key is stored server-side only and never exposed to the browser. All AI requests are proxied through the Express backend at `/api/generate-session`.

---

## 🏉 RFU Regulation 15 Compliance

The application enforces correct age-grade rules:

| Age Group | Format | Team Size | Contact Level | Match Duration |
|-----------|--------|-----------|---------------|----------------|
| U6 | Training Only | 4v4 | No contact | No matches |
| U7-U8 | Tag Rugby | 4v4 / 6v6 | No contact | 10 min halves |
| U9 | Transitional Contact | 7v7 | Tackle including hold | 15 min halves |
| U10 | Contact Rugby | 8v8 | Full tackle, 1 support | 20 min halves |
| U11 | Contact Rugby | 9v9 | Full tackle, 2 support | 25 min halves |
| U12 | Contact Rugby | 12v12 | Progressive full contact | 25 min halves |
| U13-U18 | Contact Rugby | 15v15 | Full contact with restrictions | 30-35 min halves |

---

## 🎯 Trojans Coaching Framework

All session plans incorporate:

- **TREDS Values** - Teamwork, Respect, Enjoyment, Discipline, Sportsmanship
- **Trojans Coaching Habits** - Shared Purpose, Progression, Praise, Review, Choice
- **The Trojans Player** - Development of Behaviours, Skills, and Knowledge
- **RFU Principles of Play** - Go Forward, Support, Continuity, Pressure, Contest
- **APES Sessions** - Active, Purposeful, Enjoyable, Safe

---

## 🐛 Known Issues & Limitations

See [GitHub Issues](https://github.com/footnote42/trojans-coaching-assistant/issues) for current bugs and feature requests.

**Current Limitations:**
- Session history stored in browser localStorage only (cleared if browser data is cleared)
- PDF export uses client-side rendering (large sessions may be slow)
- No multi-user accounts or cloud storage (yet)
- WhatsApp summaries cannot be regenerated independently

---

## 🗺️ Roadmap

### Next Phase: Supabase Backend Integration
- [ ] Replace localStorage with Supabase database
- [ ] User authentication and accounts
- [ ] Cloud-based session storage
- [ ] Share sessions with other coaches
- [ ] Multi-week programme planning

### Future Features
- [ ] Individual section regeneration ([#3](https://github.com/footnote42/trojans-coaching-assistant/issues/3))
- [ ] Trojans helmet logo integration ([#2](https://github.com/footnote42/trojans-coaching-assistant/issues/2))
- [ ] Export to Word/Google Docs format
- [ ] Session feedback analytics dashboard
- [ ] Equipment inventory tracking
- [ ] Player attendance tracking

### Recently Completed (v2.1 - November 2025)
- [x] Structured session plan display with accordion
- [x] Toast notification system
- [x] Enhanced loading states with skeleton components
- [x] Form layout reorganization
- [x] Quick-start template library
- [x] Mobile responsive optimizations
- [x] PDF export functionality
- [x] Session save/load to localStorage
- [x] WhatsApp parent summaries
- [x] Backend API proxy for security
- [x] Color-coded RFU rules display

---

## 📁 Project Structure

```
trojans-coaching-assistant/
├── client/                      # React frontend
│   └── src/
│       ├── components/          # UI components
│       │   ├── coaching/        # Session plan, history, templates
│       │   └── ui/              # Radix UI primitives
│       ├── lib/                 # Utilities (session parser, storage)
│       ├── hooks/               # Custom React hooks
│       └── App.tsx              # Main application (989 lines)
├── server/                      # Express backend
│   ├── index.ts                 # Server entry point
│   ├── routes.ts                # API proxy endpoint
│   └── vite.ts                  # Vite dev integration
├── shared/                      # Shared TypeScript schemas
│   └── schema.ts                # Drizzle ORM + Zod validation
├── vercel.json                  # Vercel deployment config
└── package.json                 # Monorepo dependencies
```

**Key Files:**
- `client/src/App.tsx:66` - RFU Regulation 15 rules function
- `client/src/App.tsx:275` - AI prompt construction
- `client/src/lib/session-parser.ts` - Markdown parser for AI responses
- `server/routes.ts` - Backend API proxy with comprehensive logging

---

## 🤝 Contributing

This is currently a Trojans RFC internal project. If you're a Trojans coach interested in contributing or providing feedback, please contact the development team or open a GitHub issue.

---

## 📄 License

*Internal use only for Trojans RFC* - License TBD

---

## 🙏 Acknowledgments

- **Trojans RFC** - For the coaching framework and club ethos
- **RFU** - For Regulation 15 and age grade guidelines
- **Anthropic** - For Claude AI capabilities
- **Tim Dancer & Sully** - Club Coaching Coordinators providing feedback
- **All Trojans volunteer coaches** - Who inspired this tool

---

## 📧 Contact

**Project Maintainer:** Wayne Ellis
**Club:** Trojans RFC, Southampton
**Website:** [trojansrugby.co.uk](https://www.trojansrugby.co.uk)

---

**#ProudToBeATrojan** 🏉
