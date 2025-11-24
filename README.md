# Azemera Academy - Online Learning Platform

An online learning platform by Azemera Farms to teach agricultural skills to learners across Ethiopia.

## Project Overview

Azemera Academy enables:

- **Learners**: Register, enroll in courses, watch lessons, take quizzes, and earn certificates
- **Content Creators**: Apply, get approved, and create courses with videos, PDFs, and quizzes
- **Admins**: Manage users, approve creators/courses, and maintain platform quality

## Tech Stack

### Frontend

- **Next.js 14+** (React) - Server-side rendering and PWA support
- **Tailwind CSS** - Utility-first styling
- **hls.js** - Adaptive video streaming for low bandwidth
- **TypeScript** - Type safety

### Backend

- **NestJS** - Structured Node.js framework
- **PostgreSQL** - Primary database
- **Redis** (optional) - Session management and caching
- **TypeScript** - Type safety

### Media & Storage

- **AWS S3 / DigitalOcean Spaces** - Video and document storage
- **ffmpeg** - Video processing and encoding

### Authentication

- **JWT** / **NextAuth** - Secure authentication and authorization

### Payments

- **Telebirr** - Ethiopian local payment integration

### Development

- **Docker** - Containerization
- **Git + GitHub** - Version control
- **GitHub Actions** - CI/CD

## Project Structure

```
Azemera/
├── frontend/          # Next.js application
├── backend/           # NestJS API server
├── docker-compose.yml # Local development setup
└── README.md          # This file
```

## Features

### MVP Features

- ✅ User registration & login (Learners, Creators, Admins)
- ✅ Creator application & approval workflow
- ✅ Course creation (draft → submit → publish)
- ✅ Video playback & PDF viewing
- ✅ Admin dashboard for approvals
- ✅ Progress tracking
- ✅ Certificate generation (digital & printable)
- ✅ Multi-language support (Amharic & English)
- ✅ Payment integration (Telebirr)
- ✅ Free and paid courses

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL 14+
- Redis (optional, for production)
- Docker (optional, for containerized setup)

### Installation

1. Clone the repository
2. Install dependencies (see frontend/ and backend/ README files)
3. Set up environment variables
4. Run database migrations
5. Start development servers

## Deployment

See deployment documentation in `backend/docs/deployment.md`

## License

Proprietary - Azemera Farms
