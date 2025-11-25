# Azemera Academy - Complete Setup Guide

## Quick Start for Deployment

### Backend Setup

1. **Navigate to backend directory:**

```bash
cd backend
```

2. **Install dependencies:**

```bash
npm install
```

3. **Create `.env` file in backend directory:**

```env
DATABASE_URL="postgresql://neondb_owner:npg_3GcRajWSn9If@ep-billowing-unit-ah7fa07k-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production-min-32-chars
JWT_REFRESH_EXPIRES_IN=30d
PORT=3001
APP_URL=http://localhost:3000
```

4. **Start backend server:**

```bash
npm run start:dev
```

Backend will run on `http://localhost:3001/api`

### Frontend Setup

1. **Navigate to frontend directory:**

```bash
cd frontend
```

2. **Install dependencies:**

```bash
npm install
```

3. **Create `.env.local` file in frontend directory:**

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

4. **Start frontend server:**

```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## Database Connection

The database is already configured with Neon PostgreSQL. The connection string is set in the backend `.env` file.

## Module 3: Courses - COMPLETED ✅

### Backend Implementation:

- ✅ Course entity with all fields
- ✅ Section entity for course organization
- ✅ Lesson entity for videos/documents
- ✅ Enrollment entity for tracking progress
- ✅ Complete CRUD operations
- ✅ Course creation with sections and lessons
- ✅ Enrollment system
- ✅ Progress tracking

### Frontend Integration:

- ✅ API client setup
- ✅ Course listing with real data
- ✅ Course creation form connected to API
- ✅ Course management for creators
- ✅ Enrollment functionality

## API Endpoints Available

### Courses

- `GET /api/courses` - List all published courses
- `GET /api/courses/:id` - Get course details
- `GET /api/courses/my-courses` - Creator's courses
- `GET /api/courses/enrolled` - Learner's enrolled courses
- `POST /api/courses` - Create course (Creator/Admin)
- `PATCH /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course
- `POST /api/courses/:id/enroll` - Enroll in course
- `PATCH /api/courses/:id/progress` - Update progress

## Real-Time Features

✅ When a creator creates a course:

- Course is saved to database
- Appears in creator's dashboard immediately
- Available for admin review
- Once published, visible to learners

✅ When a learner enrolls:

- Enrollment record created
- Course appears in learner's dashboard
- Progress tracking enabled

## Next Steps

1. Start both servers (backend and frontend)
2. Test course creation as a creator
3. Test enrollment as a learner
4. Verify data appears in all dashboards

## Production Deployment

For production:

1. Update `NODE_ENV=production` in backend `.env`
2. Set `synchronize: false` in database config
3. Use proper JWT secrets
4. Configure CORS for production domain
5. Set up file upload service (AWS S3/DigitalOcean Spaces)
