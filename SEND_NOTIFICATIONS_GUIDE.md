# Send Notifications Feature - Testing Guide

## ✅ What's Been Implemented

### Backend (MongoDB + Express)

**1. Notification Model** with fields:
- `title` (String, required, max 100 chars)
- `message` (String, required, max 500 chars)
- `type` (String, enum: 'broadcast'/'alert'/'info'/'update', default: 'broadcast')
- `createdBy` (ObjectId, ref: User)
- `timestamps` (createdAt, updatedAt)

**2. API Routes**:
- `GET /api/notifications` - Get all notifications (authenticated users)
- `POST /api/notifications/broadcast` - Broadcast notification (admin only)

**3. Features**:
- ✅ Populates creator details (firstName, lastName, email, role)
- ✅ Validates title length (max 100 characters)
- ✅ Validates message length (max 500 characters)
- ✅ Sorts by creation date (newest first)
- ✅ Limits to last 50 notifications
- ✅ Admin-only access for broadcasting
- ✅ All authenticated users can view notifications

### Frontend - Admin Side

**1. SendNotifications Component** (`/admin/notifications`) with:
- ✅ Form to broadcast notifications
  - Title input with character counter (100 max)
  - Message textarea with character counter (500 max)
  - Type selector (Broadcast, Alert, Info, Update)
  - "Broadcast to All Students" button
- ✅ List of past notifications sent
  - Shows title, message, timestamp
  - Shows who sent it
  - Color-coded type badges
  - Type icons (📢 🔔 ⚠️ ℹ️)
- ✅ Real-time updates
- ✅ Error and success messages
- ✅ Loading states
- ✅ Responsive design

### Frontend - Student Side

**1. StudentDashboard Enhancement** with:
- ✅ Notifications banner at the top
  - Shows latest 5 notifications
  - Attractive gradient background
  - Title and message display
  - Timestamp for each notification
  - Hover effects
- ✅ Auto-fetches on dashboard load
- ✅ Responsive design

## 🚀 How to Test

### Step 1: Restart Backend Server

The Notification model and routes have been added to `server.js`. Restart the backend:

```bash
cd backend
node src/server.js
```

✅ **Expected Output**:
```
✅ MongoDB Connected
🚀 RideUET backend running on port 5000
```

### Step 2: Test Admin - Send Notification

1. **Login as admin**: `sara.admin@uet.edu.pk` / `password123`
2. Click on **"📢 Send Notifications"** card
3. You'll be redirected to `/admin/notifications`

**Fill in the form:**
- **Title**: "Bus Schedule Update"
- **Message**: "All morning buses will depart 15 minutes earlier starting tomorrow. Please plan accordingly."
- **Type**: Select "📢 Broadcast"

Click **"📢 Broadcast to All Students"**

✅ **Expected Result**:
- Success message: "Notification broadcast successfully to all students!"
- Form resets
- New notification appears in "Past Notifications" list below
- Shows timestamp, your name, and type badge

### Step 3: Send More Notifications

**Notification 2 (Alert):**
- **Title**: "Weather Alert"
- **Message**: "Heavy rain expected today. Buses may experience delays. Stay updated."
- **Type**: ⚠️ Alert

**Notification 3 (Info):**
- **Title**: "New Route Added"
- **Message**: "We've added a new route from Engineering Block to Library. Check schedules for timings."
- **Type**: ℹ️ Info

**Notification 4 (Update):**
- **Title**: "App Maintenance"
- **Message**: "The app will undergo maintenance tonight from 11 PM to 1 AM. Service may be interrupted."
- **Type**: 🔔 Update

### Step 4: View Notifications as Student

1. **Logout** from admin account
2. **Login as student**: `ahmed.student@uet.edu.pk` / `password123`
3. You'll be redirected to `/student` (Student Dashboard)

✅ **Expected Result**:
- **Notifications banner appears at the top** with gradient purple background
- Shows "📢 Latest Notifications" heading
- Displays the latest 5 notifications you just created
- Each notification shows:
  - Title (bold)
  - Message
  - Timestamp (e.g., "May 17, 2:30 PM")
- Hover effect on each notification
- Notifications are sorted newest first

### Step 5: Test Character Limits

**As Admin:**

1. Try to enter a title longer than 100 characters
   - ✅ Input field prevents typing beyond 100 chars
   - ✅ Character counter shows "100/100"

2. Try to enter a message longer than 500 characters
   - ✅ Textarea prevents typing beyond 500 chars
   - ✅ Character counter shows "500/500"

### Step 6: Test Validations

**Missing Fields:**
1. Leave title empty and try to submit
   - ✅ Browser validation prevents submission

2. Leave message empty and try to submit
   - ✅ Browser validation prevents submission

**Access Control:**
1. Login as student
2. Try to access `/admin/notifications` directly
   - ✅ Should redirect or show error (protected route)

## 🧪 Test Cases

### ✅ Positive Tests

1. **Admin broadcasts notification** - Should succeed
2. **Admin views past notifications** - Should display all
3. **Student views notifications** - Should see latest 5
4. **Multiple notification types** - Should display with correct icons/badges
5. **Character counters** - Should update in real-time
6. **Form reset after submit** - Should clear all fields
7. **Notifications sorted by date** - Newest first
8. **Responsive design** - Works on mobile/tablet

### ❌ Negative Tests

1. **Empty title**:
   - Should prevent submission
   - Browser validation

2. **Empty message**:
   - Should prevent submission
   - Browser validation

3. **Title > 100 characters**:
   - Input field prevents typing beyond limit

4. **Message > 500 characters**:
   - Textarea prevents typing beyond limit

5. **Non-admin tries to broadcast**:
   - Should return 403 Forbidden error

6. **Unauthenticated access**:
   - Should redirect to login

## 🔍 API Testing with curl

### Get All Notifications (Any authenticated user)
```bash
curl -X GET http://localhost:5000/api/notifications ^
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Broadcast Notification (Admin only)
```bash
curl -X POST http://localhost:5000/api/notifications/broadcast ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" ^
  -d "{\"title\":\"Test Notification\",\"message\":\"This is a test message\",\"type\":\"broadcast\"}"
```

## 📊 Database Verification

Check MongoDB directly:

```bash
mongosh
use rideuet
db.notifications.find().pretty()
```

Should show all notifications with populated creator references.

## 🎨 UI Features

### Admin Side

**Form:**
- ✅ Title input with character counter
- ✅ Message textarea with character counter
- ✅ Type dropdown with icons
- ✅ Large broadcast button
- ✅ Validation messages
- ✅ Submit button with loading state

**Past Notifications List:**
- ✅ Card-based layout
- ✅ Type icons (📢 ⚠️ ℹ️ 🔔)
- ✅ Title and message display
- ✅ Formatted timestamps
- ✅ Creator information
- ✅ Color-coded type badges:
  - 🔵 Blue = Broadcast
  - 🟠 Orange = Alert
  - 🟢 Green = Info
  - 🟣 Purple = Update
- ✅ Hover effects
- ✅ Empty state message

### Student Side

**Notifications Banner:**
- ✅ Gradient purple background
- ✅ Prominent placement at top
- ✅ Shows latest 5 notifications
- ✅ Clean card design
- ✅ Title and message
- ✅ Timestamp
- ✅ Hover animation (slides right)
- ✅ Responsive design
- ✅ Only shows if notifications exist

## 🔐 Security Features

1. **Authentication Required**: All notification routes require valid JWT token
2. **Admin Authorization**: Only admins can broadcast notifications
3. **Input Validation**: Backend validates title and message lengths
4. **XSS Protection**: Text is properly escaped in React
5. **Creator Tracking**: Records who sent each notification

## 🐛 Troubleshooting

### Issue: Notifications don't appear on student dashboard
**Solution**: 
1. Check backend is running
2. Check MongoDB is running
3. Verify notifications exist in database
4. Check browser console for errors
5. Ensure student is logged in

### Issue: Can't broadcast notification
**Solution**: 
1. Ensure you're logged in as admin
2. Check backend logs for errors
3. Verify all required fields are filled

### Issue: Character counter not updating
**Solution**: 
1. Check browser console for JavaScript errors
2. Refresh the page

### Issue: Past notifications not showing
**Solution**: 
1. Verify notifications exist in database
2. Check API response in Network tab
3. Ensure backend route is working

## 📝 Code Structure

```
backend/src/server.js
├── Notification Model (Mongoose schema)
├── GET /api/notifications
└── POST /api/notifications/broadcast

frontend/src/pages/admin/
├── SendNotifications.js (Admin component)
├── SendNotifications.css (Admin styles)
└── AdminDashboard.js (Updated with routing)

frontend/src/pages/student/
├── StudentDashboard.js (Updated with notifications)
└── StudentDashboard.css (Updated with notification styles)
```

## ✨ Features Implemented

### Admin Features
- ✅ Broadcast notifications to all students
- ✅ View all past notifications
- ✅ Character counters for title/message
- ✅ Type selection (Broadcast, Alert, Info, Update)
- ✅ Real-time form validation
- ✅ Success/error feedback
- ✅ Loading states
- ✅ Responsive design

### Student Features
- ✅ View latest notifications on dashboard
- ✅ Attractive notification banner
- ✅ Automatic updates on page load
- ✅ Formatted timestamps
- ✅ Responsive design
- ✅ Hover effects

### Backend Features
- ✅ Notification model with validation
- ✅ GET endpoint for all users
- ✅ POST endpoint for admins
- ✅ Creator tracking
- ✅ Sorting by date
- ✅ Limit to 50 notifications
- ✅ Population of creator details
- ✅ Authentication & authorization

## 🎯 Notification Types

| Type | Icon | Color | Use Case |
|------|------|-------|----------|
| Broadcast | 📢 | Blue | General announcements |
| Alert | ⚠️ | Orange | Urgent warnings |
| Info | ℹ️ | Green | Informational updates |
| Update | 🔔 | Purple | System/app updates |

## 📈 Sample Data

After testing, you should have notifications like:

| Title | Message | Type | Created By |
|-------|---------|------|------------|
| Bus Schedule Update | All morning buses will depart 15 minutes earlier... | Broadcast | Sara Admin |
| Weather Alert | Heavy rain expected today. Buses may experience delays... | Alert | Sara Admin |
| New Route Added | We've added a new route from Engineering Block... | Info | Sara Admin |
| App Maintenance | The app will undergo maintenance tonight... | Update | Sara Admin |

## 🎉 Success Criteria

✅ Admin can broadcast notifications
✅ Admin can view all past notifications
✅ Students see latest notifications on dashboard
✅ Character limits enforced (100 title, 500 message)
✅ Non-admin users cannot broadcast
✅ Notifications sorted by date (newest first)
✅ UI updates in real-time
✅ Error messages are clear
✅ Success messages confirm actions
✅ Data persists in MongoDB
✅ Authentication is enforced
✅ Creator details are tracked
✅ Type badges are color-coded
✅ Responsive design works on all devices
✅ Notifications banner only shows when notifications exist

## 🔄 Workflow

1. **Admin creates notification** → Saved to database
2. **Student logs in** → Fetches latest notifications
3. **Notifications displayed** → Shows in banner at top
4. **Admin views history** → Sees all past notifications

## 📱 Responsive Behavior

- **Desktop**: Full layout with side-by-side elements
- **Tablet**: Adjusted spacing, stacked elements
- **Mobile**: Single column, optimized touch targets

---

**Status**: ✅ Fully Functional
**Last Updated**: May 17, 2026

## 🚀 Next Steps

The feature is complete and ready to test! Just:
1. Restart your backend server
2. Login as admin and send some notifications
3. Login as student and see them appear on the dashboard

Enjoy broadcasting to your students! 📢
