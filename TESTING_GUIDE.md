# Azemera Academy - Testing Guide

## 🧪 How to Test All Implemented Features

### Prerequisites

1. **Backend running**: `cd backend && npm run start:dev` (should run on http://localhost:3001)
2. **Frontend running**: `cd frontend && npm run dev` (should run on http://localhost:3000)
3. **Database**: Ensure `.env` file in `backend/` has correct `DATABASE_URL`

---

## ✅ **COMPLETED MODULES TO TEST**

### 1. **Category Management** ✅

**Backend Endpoints:**

- `GET /api/categories` - List all categories
- `GET /api/categories/:id` - Get category details
- `POST /api/categories` - Create category (Admin only)
- `PUT /api/categories/:id` - Update category (Admin only)
- `DELETE /api/categories/:id` - Delete category (Admin only)
- `GET /api/categories/:id/stats` - Get category statistics

**How to Test:**

1. Login as Admin
2. Navigate to admin dashboard
3. Create a new category via API or add UI
4. View categories list
5. Update/Delete categories

**Test via API:**

```bash
# Get all categories
curl http://localhost:3001/api/categories

# Create category (requires admin token)
curl -X POST http://localhost:3001/api/categories \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Agriculture", "description": "Agricultural courses", "icon": "🌾"}'
```

---

### 2. **i18n Backend** ✅

**Backend Endpoints:**

- `GET /api/i18n/locales` - Get supported locales
- `GET /api/i18n/translations?locale=en` - Get all translations
- `GET /api/i18n/translate/:key?locale=am` - Translate specific key

**How to Test:**

1. Test translation API endpoints
2. Verify English and Amharic translations are loaded
3. Test language switching (frontend integration needed)

**Test via API:**

```bash
# Get supported locales
curl http://localhost:3001/api/i18n/locales

# Get English translations
curl http://localhost:3001/api/i18n/translations?locale=en

# Get Amharic translations
curl http://localhost:3001/api/i18n/translations?locale=am

# Translate specific key
curl http://localhost:3001/api/i18n/translate/courses.title?locale=am
```

---

### 3. **Notifications Module** ✅

**Backend Endpoints:**

- `GET /api/notifications` - Get user notifications
- `GET /api/notifications/unread-count` - Get unread count
- `GET /api/notifications/:id` - Get notification details
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/mark-all-read` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification
- `POST /api/notifications` - Create notification (Admin only)

**Frontend:**

- Notification bell in dashboard header
- `/notifications` page for full notification list

**How to Test:**

1. Login as any user
2. Check notification bell in dashboard (top right)
3. Click bell to see dropdown
4. Navigate to `/notifications` page
5. Mark notifications as read
6. Test unread count badge

**Test via API:**

```bash
# Get notifications (requires auth token)
curl http://localhost:3001/api/notifications \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get unread count
curl http://localhost:3001/api/notifications/unread-count \
  -H "Authorization: Bearer YOUR_TOKEN"

# Mark as read
curl -X PUT http://localhost:3001/api/notifications/NOTIFICATION_ID/read \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 4. **Quizzes Module** ✅

**Backend Endpoints:**

- `POST /api/courses/:courseId/quizzes` - Create quiz (Creator)
- `GET /api/courses/:courseId/quizzes` - Get course quizzes
- `GET /api/courses/:courseId/quizzes/:quizId` - Get quiz details
- `POST /api/courses/:courseId/quizzes/:quizId/questions` - Add question
- `POST /api/courses/:courseId/quizzes/:quizId/start` - Start attempt
- `POST /api/courses/quizzes/attempts/:attemptId/submit` - Submit attempt
- `GET /api/courses/quizzes/attempts/:attemptId` - Get attempt results
- `GET /api/courses/:courseId/quizzes/:quizId/attempts` - Get user attempts

**Frontend:**

- Quiz cards on course page
- Quiz player at `/courses/[id]/quizzes/[quizId]`
- Quiz results page

**How to Test:**

1. Login as Creator
2. Create a course
3. Add a quiz to the course (via API for now)
4. Login as Learner
5. Enroll in course
6. Navigate to quiz page
7. Take the quiz
8. View results

**Test via API:**

```bash
# Create quiz (Creator token required)
curl -X POST http://localhost:3001/api/courses/COURSE_ID/quizzes \
  -H "Authorization: Bearer CREATOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Introduction Quiz",
    "description": "Test your knowledge",
    "passingScore": 70,
    "timeLimit": 30,
    "questions": [
      {
        "question": "What is agriculture?",
        "type": "MULTIPLE_CHOICE",
        "options": ["Farming", "Teaching", "Coding"],
        "correctAnswers": ["Farming"],
        "points": 10
      }
    ]
  }'

# Start quiz attempt
curl -X POST http://localhost:3001/api/courses/COURSE_ID/quizzes/QUIZ_ID/start \
  -H "Authorization: Bearer LEARNER_TOKEN"

# Submit quiz
curl -X POST http://localhost:3001/api/courses/quizzes/attempts/ATTEMPT_ID/submit \
  -H "Authorization: Bearer LEARNER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "answers": [
      {"questionId": "QUESTION_ID", "answers": ["Farming"]}
    ]
  }'
```

---

### 5. **Reviews & Ratings** ✅

**Backend Endpoints:**

- `POST /api/courses/:courseId/reviews` - Create review
- `GET /api/courses/:courseId/reviews` - Get course reviews
- `GET /api/courses/:courseId/reviews/:id` - Get review details
- `PUT /api/courses/:courseId/reviews/:id` - Update review
- `DELETE /api/courses/:courseId/reviews/:id` - Delete review
- `PUT /api/courses/:courseId/reviews/:id/moderate` - Moderate review (Admin)

**Frontend:**

- Review form component
- Review list component
- Star ratings display

**How to Test:**

1. Login as Learner
2. Enroll in a course
3. Navigate to course detail page
4. Submit a review with rating and comment
5. View reviews list
6. Edit/Delete your review
7. Verify course rating updates

**Test via API:**

```bash
# Create review
curl -X POST http://localhost:3001/api/courses/COURSE_ID/reviews \
  -H "Authorization: Bearer LEARNER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 5,
    "comment": "Excellent course! Very informative."
  }'

# Get reviews
curl http://localhost:3001/api/courses/COURSE_ID/reviews
```

---

### 6. **Analytics & Reporting** ✅

**Backend Endpoints:**

- `GET /api/analytics/platform` - Platform stats (Admin)
- `GET /api/analytics/course/:courseId` - Course analytics (Creator)
- `GET /api/analytics/user` - User analytics
- `GET /api/analytics/revenue` - Revenue report (Admin)

**How to Test:**

1. Login as Admin - Test platform stats
2. Login as Creator - Test course analytics
3. Login as Learner - Test user analytics
4. Check revenue reports

**Test via API:**

```bash
# Platform stats (Admin)
curl http://localhost:3001/api/analytics/platform \
  -H "Authorization: Bearer ADMIN_TOKEN"

# Course analytics (Creator)
curl http://localhost:3001/api/analytics/course/COURSE_ID \
  -H "Authorization: Bearer CREATOR_TOKEN"

# User analytics
curl http://localhost:3001/api/analytics/user \
  -H "Authorization: Bearer LEARNER_TOKEN"

# Revenue report
curl "http://localhost:3001/api/analytics/revenue?startDate=2024-01-01&endDate=2024-12-31" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

### 7. **Search & Discovery** ✅

**Backend Endpoints:**

- `GET /api/search/courses?q=query` - Search courses
- `GET /api/search/recommendations` - Get recommendations (Auth required)
- `GET /api/search/popular` - Get popular courses
- `GET /api/search/trending` - Get trending courses

**How to Test:**

1. Use search bar in header
2. Test course search with filters
3. View recommended courses (when logged in)
4. View popular/trending courses

**Test via API:**

```bash
# Search courses
curl "http://localhost:3001/api/search/courses?q=agriculture&level=BEGINNER"

# Get recommendations (requires auth)
curl http://localhost:3001/api/search/recommendations \
  -H "Authorization: Bearer LEARNER_TOKEN"

# Get popular courses
curl http://localhost:3001/api/search/popular?limit=10

# Get trending courses
curl http://localhost:3001/api/search/trending?limit=10
```

---

## 🔍 **Testing Checklist**

### Backend Testing

- [ ] All API endpoints return correct status codes
- [ ] Authentication/Authorization works correctly
- [ ] Database entities are created correctly
- [ ] Validation works (try invalid data)
- [ ] Error handling works (try non-existent IDs)

### Frontend Testing

- [ ] All pages load without errors
- [ ] Navigation works correctly
- [ ] Forms submit and show success/error messages
- [ ] API integration works (data displays correctly)
- [ ] Responsive design works on mobile/tablet

### Integration Testing

- [ ] Create course → Appears in dashboard
- [ ] Enroll in course → Shows in "My Courses"
- [ ] Complete lesson → Progress updates
- [ ] Submit review → Rating updates on course
- [ ] Take quiz → Results saved correctly

---

## 🐛 **Common Issues & Solutions**

### Issue: Database Connection Error

**Solution:** Check `.env` file in `backend/` has correct `DATABASE_URL`

### Issue: CORS Error

**Solution:** Ensure backend CORS is configured to allow frontend origin

### Issue: 401 Unauthorized

**Solution:** Check if token is valid and not expired. Try logging in again.

### Issue: 403 Forbidden

**Solution:** Check user role has required permissions

### Issue: 404 Not Found

**Solution:** Verify endpoint URL and ensure resource exists

---

## 📝 **Test Data Setup**

### Create Test Users:

1. **Admin**: Register with role "ADMIN"
2. **Creator**: Register with role "CREATOR"
3. **Learner**: Register with role "LEARNER"

### Create Test Course:

1. Login as Creator
2. Create course via `/creator/courses/create`
3. Add sections and lessons
4. Submit for review

### Create Test Quiz:

1. Login as Creator
2. Add quiz to course (via API)
3. Add questions to quiz

---

## ✅ **Expected Results**

After testing, you should be able to:

- ✅ Manage categories (Admin)
- ✅ Switch languages (i18n)
- ✅ Receive and manage notifications
- ✅ Create and take quizzes
- ✅ Submit and view reviews
- ✅ View analytics for platform/course/user
- ✅ Search and discover courses

---

**Note:** Some features may need frontend UI integration. Backend APIs are fully functional and can be tested via Postman/curl.
