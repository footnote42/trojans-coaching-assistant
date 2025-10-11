# Rugby Coaching App - Design Guidelines

## Design Approach: Design System with Sports Focus
**Selected System**: Material Design with athletic customization
**Justification**: Utility-focused coaching tool requiring clear data hierarchy, quick interactions, and professional presentation. Drawing inspiration from Strava and Hudl for sports-specific patterns.

## Core Design Elements

### Color Palette

**Light Mode:**
- Primary: 142 71% 45% (Rugby pitch green)
- Secondary: 217 91% 60% (Professional blue)
- Background: 0 0% 100%
- Surface: 0 0% 98%
- Text Primary: 0 0% 13%
- Text Secondary: 0 0% 45%

**Dark Mode:**
- Primary: 142 65% 55%
- Secondary: 217 91% 65%
- Background: 222 47% 11%
- Surface: 217 33% 17%
- Text Primary: 0 0% 98%
- Text Secondary: 0 0% 70%

### Typography
- **Primary Font**: Inter (Google Fonts)
- **Display/Headers**: font-bold, tracking-tight
- **Body**: font-normal, leading-relaxed
- **Scale**: text-sm (14px), text-base (16px), text-lg (18px), text-xl (20px), text-2xl (24px), text-3xl (30px)

### Layout System
**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, 16
- Component padding: p-4 to p-6
- Section spacing: py-8 to py-16
- Container: max-w-7xl mx-auto px-4
- Card gaps: gap-4 to gap-6

### Component Library

**Navigation**
- Top navigation bar with logo, main menu items, profile dropdown
- Mobile: Hamburger menu with slide-out drawer
- Active states with underline or background highlight

**Data Display**
- Clean tables with alternating row colors (odd:bg-surface)
- Stat cards with large numbers and subtle icons
- Player/team cards with avatar, name, key metrics
- Chart containers with subtle borders and proper legends

**Forms & Inputs**
- Rounded inputs (rounded-md) with clear labels
- Consistent focus rings (ring-primary)
- Dark mode aware with proper contrast
- Button hierarchy: primary (filled), secondary (outline), ghost (text only)

**Cards & Containers**
- Subtle shadows (shadow-sm to shadow-md)
- Rounded corners (rounded-lg)
- Border treatments for dark mode (border-surface)

### Layout Patterns
- Dashboard: 3-column grid on desktop (grid-cols-3), stack on mobile
- Lists: Single column with dividers
- Detail views: 2-column split (content + sidebar)

### Images
No hero image required for utility app. Use placeholder images for:
- Player/coach avatars (circular, 40-48px)
- Team logos (square, 64px)
- Drill thumbnails (16:9 aspect ratio)
- Field diagrams (as needed for drill visualization)

### Key Principles
- **Performance First**: Fast load times, minimal animations
- **Data Clarity**: Clear hierarchy, readable at a glance
- **Mobile Ready**: Touch-friendly targets (min 44px), responsive layouts
- **Accessibility**: WCAG AA contrast, keyboard navigation, screen reader support