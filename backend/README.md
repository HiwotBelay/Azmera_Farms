# Azemera Academy - Backend

Backend API server built with NestJS, TypeScript, and PostgreSQL.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the backend directory:

```env
DATABASE_URL="postgresql://neondb_owner:npg_3GcRajWSn9If@ep-billowing-unit-ah7fa07k-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_REFRESH_EXPIRES_IN=30d
PORT=3001
APP_URL=http://localhost:3000
```

### 3. Run Database Migrations

The database will auto-sync in development mode. For production, use migrations.

### 4. Start Development Server

```bash
npm run start:dev
```

The API will be available at `http://localhost:3001/api`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/me` - Get current user

### Courses

- `GET /api/courses` - Get all courses (with filters)
- `GET /api/courses/:id` - Get course by ID
- `GET /api/courses/my-courses` - Get creator's courses
- `GET /api/courses/enrolled` - Get enrolled courses
- `POST /api/courses` - Create course (Creator/Admin)
- `PATCH /api/courses/:id` - Update course (Creator/Admin)
- `DELETE /api/courses/:id` - Delete course (Creator/Admin)
- `POST /api/courses/:id/enroll` - Enroll in course
- `PATCH /api/courses/:id/progress` - Update course progress

## Modules

### Module 1: Authentication & Authorization ✅

- User registration and login
- JWT token management
- Password reset
- Email verification
- Role-based access control

### Module 2: Users Management ✅

- User profiles
- Profile updates

### Module 3: Courses Management ✅

- Course CRUD operations
- Section and Lesson management
- Course enrollment
- Progress tracking

## Database Schema

- **users** - User accounts
- **user_profiles** - Extended user information
- **refresh_tokens** - JWT refresh tokens
- **courses** - Course information
- **sections** - Course sections
- **lessons** - Course lessons (videos/documents)
- **enrollments** - Student enrollments and progress
