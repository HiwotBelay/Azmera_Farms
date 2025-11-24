# Azemera Academy - Frontend

Frontend application for Azemera Academy built with Next.js 14+, TypeScript, and Tailwind CSS.

## Tech Stack

- **Next.js 14+** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Chart library for dashboards
- **Lucide React** - Icon library
- **React Hook Form** - Form handling

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Authentication routes
│   │   ├── (dashboard)/       # Dashboard routes
│   │   ├── courses/           # Course pages
│   │   └── layout.tsx         # Root layout
│   ├── modules/               # Feature modules
│   │   ├── auth/              # Authentication module
│   │   ├── courses/            # Courses module
│   │   ├── payments/           # Payments module
│   │   ├── admin/              # Admin module
│   │   ├── certificates/       # Certificates module
│   │   └── profile/            # Profile module
│   ├── components/            # Shared components
│   │   ├── layout/            # Layout components
│   │   └── home/              # Home page components
│   ├── lib/                   # Utilities
│   ├── hooks/                # Custom React hooks
│   └── types/                 # TypeScript types
├── public/                    # Static assets
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Features Implemented

### ✅ Landing Page
- Hero section
- Categories section
- Popular courses
- Features section
- Success stories
- CTA section
- Header and Footer

### ✅ Authentication
- Login page
- Registration page with role selection
- Password reset (UI)

### ✅ Dashboard
- Learner dashboard with stats
- Continue learning section
- Weekly activity chart
- Course completion chart
- Recommended courses

### ✅ Courses
- Course listing page
- Course card component
- Course detail page (structure)

## Modules

### Authentication Module (`modules/auth`)
- Login and registration forms
- Auth hooks and API (mock)
- Protected route wrapper

### Courses Module (`modules/courses`)
- Course listing
- Course cards
- Course detail
- Continue learning
- Recommended courses

### Profile Module (`modules/profile`)
- Stats cards
- Progress charts
- Activity tracking

## Design System

### Colors
- Primary: `#10B981` (Green)
- Accent Yellow: `#FBBF24`
- Accent Blue: `#3B82F6`

### Typography
- Headings: Bold, large sizes
- Body: Regular weight
- Support for Amharic fonts

## Notes

- All API calls are currently mocked
- No backend integration yet
- Components are designed based on Figma designs
- Responsive design for mobile, tablet, and desktop
