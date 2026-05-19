# View Bookings Feature - Testing Guide

## ✅ What's Been Implemented

### Backend (MongoDB + Express)

**1. Booking Model** with fields:
- `studentId` (ObjectId, ref: User, required)
- `studentName` (String, required)
- `scheduleId` (ObjectId, ref: Schedule, required)
- `seatNumber` (String, required)
- `status` (String, enum: 'booked'/'picked-up'/'cancelled', default: 'booked')
- `timestamps` (createdAt, updatedAt)
- Indexes for faster queries on studentId, scheduleId, and status

**2. API Routes**:
- `GET /api/bookings` - Get all bookings (admin only, with optional filters)
- `GET /api/bookings/my` - Get student's own bookings
- `POST /api/bookings` - Create new booking (students)
- `PATCH /api/bookings/:id/status` - Update booking status
- `DELETE /api/bookings/:id` - Cancel booking (soft delete)

**3. Features**:
- ✅ Populates student details (firstName, lastName, email)
- ✅ Populates schedule details with bus information
- ✅ Filter by date and status
- ✅ Prevents duplicate seat bookings
- ✅ Validates schedule exists before booking
- ✅ Authorization checks (students can only manage their own bookings)
- ✅ Soft delete (marks as cancelled instead of deleting)

### Frontend - Admin Side

**1. ViewBookings Component** (`/admin/bookings`) with:
- ✅ Statistics Dashboard
  - Total bookings count
  - Booked count
  - Picked up count
  - Cancelled count
  - Color-coded cards with icons
- ✅ Filters
  - Filter by date
  - Filter by status (All, Booked, Picked Up, Cancelled)
  - Clear filters button
  - Shows filtered count
- ✅ Bookings Table
  - Student name and email
  - Bus number and route
  - Schedule date and departure time
  - Seat number
  - Status badge (color-coded)
  - Booking timestamp
  - Action buttons based on status
- ✅ Status Management
  - Mark as "Picked Up" for booked bookings
  - Cancel bookings
  - Confirmation dialogs
- ✅ Real-time updates
- ✅ Responsive design
- ✅ Empty states

## 🚀 How to Test

### Step 1: Restart Backend Server

The Booking model and routes have been added. Restart the backend:

```bash
cd backend
node src/server.js
```

✅ **Expected Output**:
```
✅ MongoDB Connected
🚀 RideUET backend running on port 5000
```

### Step 2: Create Test Data

Before viewing bookings, we need some test data. Let's create bookings using curl or the API.

**Option A: Using curl (Windows)**

First, login as student to get token:
```bash
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"ahmed.student@uet.edu.pk\",\"password\":\"password123\"}"
```

Copy the token from the response, then create a booking:
```bash
curl -X POST http://localhost:5000/api/bookings ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_STUDENT_TOKEN" ^
  -d "{\"scheduleId\":\"SCHEDULE_ID\",\"seatNumber\":\"A1\"}"
```

**Option B: Create bookings manually in MongoDB**

```bash
mongosh
use rideuet

# First, get a schedule ID
db.schedules.findOne()

# Then create a booking
db.bookings.insertOne({
  studentId: ObjectId("STUDENT_USER_ID"),
  studentName: "Ahmed Khan",
  scheduleId: ObjectId("SCHEDULE_ID"),
  seatNumber: "A1",
  status: "booked",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

**Option C: Use the sample data script below**

### Step 3: View Bookings as Admin

1. **Login as admin**: `sara.admin@uet.edu.pk` / `password123`
2. Click **"📊 View Bookings"** card
3. You'll be redirected to `/admin/bookings`

✅ **Expected Result**:
- Statistics cards show counts
- Bookings table displays all bookings
- Each booking shows complete information
- Status badges are color-coded
- Action buttons appear based on status

### Step 4: Test Filters

**Filter by Date:**
1. Click on the date filter
2. Select a date that has bookings
3. ✅ Table updates to show only bookings for that date
4. ✅ Filter info shows "Showing X of Y bookings"

**Filter by Status:**
1. Select "Booked" from status dropdown
2. ✅ Table shows only booked bookings
3. Select "Cancelled"
4. ✅ Table shows only cancelled bookings

**Combine Filters:**
1. Select both date and status
2. ✅ Table shows bookings matching both criteria

**Clear Filters:**
1. Click "Clear Filters" button
2. ✅ All filters reset
3. ✅ Table shows all bookings

### Step 5: Test Status Updates

**Mark as Picked Up:**
1. Find a booking with status "Booked"
2. Click **"Picked Up"** button
3. Confirm in the popup
4. ✅ Status changes to "Picked Up" (blue badge)
5. ✅ "Picked Up" button disappears
6. ✅ Shows "Completed" text
7. ✅ Statistics update

**Cancel a Booking:**
1. Find a booking with status "Booked"
2. Click **"Cancel"** button
3. Confirm in the popup
4. ✅ Status changes to "Cancelled" (red badge)
5. ✅ All action buttons disappear
6. ✅ Shows "Cancelled" text
7. ✅ Statistics update

### Step 6: Create Sample Bookings

Here's a script to create sample bookings for testing:

```javascript
// Run this in MongoDB shell (mongosh)
use rideuet

// Get IDs
const student1 = db.users.findOne({email: "ahmed.student@uet.edu.pk"})._id;
const schedule1 = db.schedules.findOne()._id;

// Create multiple bookings
db.bookings.insertMany([
  {
    studentId: student1,
    studentName: "Ahmed Khan",
    scheduleId: schedule1,
    seatNumber: "A1",
    status: "booked",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    studentId: student1,
    studentName: "Ahmed Khan",
    scheduleId: schedule1,
    seatNumber: "A2",
    status: "picked-up",
    createdAt: new Date(Date.now() - 86400000), // Yesterday
    updatedAt: new Date()
  },
  {
    studentId: student1,
    studentName: "Ahmed Khan",
    scheduleId: schedule1,
    seatNumber: "A3",
    status: "cancelled",
    createdAt: new Date(Date.now() - 172800000), // 2 days ago
    updatedAt: new Date()
  }
])
```

## 🧪 Test Cases

### ✅ Positive Tests

1. **View all bookings** - Should display all bookings
2. **Filter by date** - Should show only bookings for selected date
3. **Filter by status** - Should show only bookings with selected status
4. **Combine filters** - Should apply both filters
5. **Clear filters** - Should reset all filters
6. **Mark as picked up** - Should update status
7. **Cancel booking** - Should update status to cancelled
8. **Statistics update** - Should reflect current data
9. **Responsive design** - Should work on all screen sizes
10. **Empty state** - Should show message when no bookings

### ❌ Negative Tests

1. **Non-admin access**:
   - Login as student
   - Try to access `/admin/bookings`
   - Should redirect or show error

2. **Invalid booking ID**:
   - Try to update non-existent booking
   - Should show error

3. **Unauthorized status update**:
   - Student tries to update another student's booking
   - Should return 403 Forbidden

4. **Duplicate seat booking**:
   - Try to book same seat on same schedule
   - Should show error: "This seat is already booked"

5. **Invalid schedule**:
   - Try to create booking with non-existent schedule
   - Should show error: "Schedule not found"

## 🔍 API Testing with curl

### Get All Bookings (Admin)
```bash
curl -X GET http://localhost:5000/api/bookings ^
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Get Bookings by Date
```bash
curl -X GET "http://localhost:5000/api/bookings?date=2026-05-18" ^
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Get Bookings by Status
```bash
curl -X GET "http://localhost:5000/api/bookings?status=booked" ^
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Get My Bookings (Student)
```bash
curl -X GET http://localhost:5000/api/bookings/my ^
  -H "Authorization: Bearer YOUR_STUDENT_TOKEN"
```

### Create Booking (Student)
```bash
curl -X POST http://localhost:5000/api/bookings ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_STUDENT_TOKEN" ^
  -d "{\"scheduleId\":\"SCHEDULE_ID\",\"seatNumber\":\"A1\"}"
```

### Update Booking Status
```bash
curl -X PATCH http://localhost:5000/api/bookings/BOOKING_ID/status ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" ^
  -d "{\"status\":\"picked-up\"}"
```

### Cancel Booking
```bash
curl -X DELETE http://localhost:5000/api/bookings/BOOKING_ID ^
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

## 📊 Database Verification

Check MongoDB directly:

```bash
mongosh
use rideuet
db.bookings.find().pretty()
```

Should show all bookings with populated references.

## 🎨 UI Features

### Statistics Dashboard
- ✅ 4 color-coded cards
- ✅ Icons for each stat
- ✅ Real-time counts
- ✅ Hover effects
- ✅ Responsive grid

### Filters Section
- ✅ Date picker
- ✅ Status dropdown
- ✅ Clear filters button
- ✅ Filter info display
- ✅ Disabled state when no filters

### Bookings Table
- ✅ Comprehensive columns
- ✅ Student information
- ✅ Schedule details
- ✅ Color-coded status badges:
  - 🟢 Green = Booked
  - 🔵 Blue = Picked Up
  - 🔴 Red = Cancelled
- ✅ Formatted dates and times
- ✅ Action buttons based on status
- ✅ Hover effects on rows
- ✅ Responsive design
- ✅ Horizontal scroll on mobile

### Status Management
- ✅ **Booked**: Can mark as picked up or cancel
- ✅ **Picked Up**: Shows "Completed" (no actions)
- ✅ **Cancelled**: Shows "Cancelled" (no actions)
- ✅ Confirmation dialogs
- ✅ Real-time updates

## 🔐 Security Features

1. **Authentication Required**: All booking routes require valid JWT token
2. **Admin Authorization**: Only admins can view all bookings
3. **Student Authorization**: Students can only view/manage their own bookings
4. **Input Validation**: Backend validates all fields
5. **Duplicate Prevention**: Prevents booking same seat twice
6. **Schedule Verification**: Checks if schedule exists
7. **Soft Delete**: Marks as cancelled instead of deleting data

## 🐛 Troubleshooting

### Issue: No bookings appear
**Solution**: 
1. Create sample bookings using the script above
2. Check MongoDB has bookings: `db.bookings.find()`
3. Verify you're logged in as admin
4. Check browser console for errors

### Issue: Filters don't work
**Solution**: 
1. Ensure bookings have valid schedule dates
2. Check browser console for errors
3. Verify date format is YYYY-MM-DD

### Issue: Can't update status
**Solution**: 
1. Ensure you're admin
2. Check backend logs
3. Verify booking exists

### Issue: Statistics don't update
**Solution**: 
1. Refresh the page
2. Check if bookings are being fetched
3. Verify API response in Network tab

## 📝 Code Structure

```
backend/src/server.js
├── Booking Model (Mongoose schema)
├── GET /api/bookings (admin, with filters)
├── GET /api/bookings/my (student)
├── POST /api/bookings (student)
├── PATCH /api/bookings/:id/status
└── DELETE /api/bookings/:id

frontend/src/pages/admin/
├── ViewBookings.js (Main component)
├── ViewBookings.css (Styles)
└── AdminDashboard.js (Updated with routing)
```

## ✨ Features Implemented

### Admin Features
- ✅ View all bookings in table
- ✅ Statistics dashboard
- ✅ Filter by date
- ✅ Filter by status
- ✅ Clear filters
- ✅ Mark bookings as picked up
- ✅ Cancel bookings
- ✅ Real-time updates
- ✅ Responsive design
- ✅ Empty states

### Backend Features
- ✅ Booking model with validation
- ✅ GET all bookings (admin)
- ✅ GET student's bookings
- ✅ POST create booking
- ✅ PATCH update status
- ✅ DELETE cancel booking
- ✅ Population of related data
- ✅ Filtering by date and status
- ✅ Duplicate prevention
- ✅ Authorization checks
- ✅ Soft delete

## 🎯 Status Flow

```
BOOKED → PICKED-UP (final)
   ↓
CANCELLED (final)
```

- **Booked**: Initial state, can be picked up or cancelled
- **Picked Up**: Final state, no further actions
- **Cancelled**: Final state, no further actions

## 📈 Sample Data

After testing, you should have bookings like:

| Student | Bus | Route | Date | Seat | Status | Booked At |
|---------|-----|-------|------|------|--------|-----------|
| Ahmed Khan | LHR-1234 | Main Campus to Hostels | 2026-05-18 | A1 | Booked | May 17, 2:30 PM |
| Ahmed Khan | LHR-1234 | Main Campus to Hostels | 2026-05-17 | A2 | Picked Up | May 16, 8:00 AM |
| Ahmed Khan | LHR-5678 | Engineering to Library | 2026-05-16 | A3 | Cancelled | May 15, 10:15 AM |

## 🎉 Success Criteria

✅ Admin can view all bookings
✅ Statistics display correctly
✅ Can filter by date
✅ Can filter by status
✅ Can combine filters
✅ Can clear filters
✅ Can mark bookings as picked up
✅ Can cancel bookings
✅ Non-admin users cannot access admin view
✅ Students can view their own bookings
✅ Duplicate seats are prevented
✅ UI updates in real-time
✅ Error messages are clear
✅ Success messages confirm actions
✅ Data persists in MongoDB
✅ Authentication is enforced
✅ Status badges are color-coded
✅ Responsive design works
✅ Empty states show helpful messages

## 🔄 Workflow

1. **Student creates booking** → Saved to database with status "booked"
2. **Admin views bookings** → Sees all bookings in table
3. **Admin filters bookings** → Table updates based on filters
4. **Admin marks as picked up** → Status changes to "picked-up"
5. **Admin cancels booking** → Status changes to "cancelled"
6. **Statistics update** → Reflects current booking counts

## 📱 Responsive Behavior

- **Desktop (1600px+)**: Full table with all columns
- **Laptop (1200px)**: Slightly compressed table
- **Tablet (768px)**: Horizontal scroll for table
- **Mobile (480px)**: Statistics in single column, scrollable table

---

**Status**: ✅ Fully Functional
**Last Updated**: May 17, 2026

## 🚀 Next Steps

The feature is complete and ready to test! Just:
1. Restart your backend server
2. Create some sample bookings
3. Login as admin and view bookings
4. Test filters and status updates

Enjoy managing your bookings! 📊
