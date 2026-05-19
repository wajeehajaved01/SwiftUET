# Student Dashboard - Complete Testing Guide

## ✅ What's Been Implemented

### Backend (MongoDB + Express)

**New API Routes:**
1. `GET /api/schedules/today` - Get today's schedules (status: scheduled)
2. `GET /api/bookings/schedule/:id` - Get booked seats for a specific schedule

**Existing Routes Used:**
- `GET /api/bookings/my` - Get student's own bookings
- `POST /api/bookings` - Create new booking
- `GET /api/notifications` - Get notifications

### Frontend - Student Dashboard

**Complete Redesign with:**

1. **Notifications Banner**
   - Shows latest 5 notifications
   - Gradient purple background
   - Title, message, timestamp

2. **Today's Bus Schedules**
   - Grid layout of available schedules
   - Shows bus number, route, driver, times, capacity
   - "Book Seat" button for each schedule

3. **Seat Selection Modal**
   - 10 rows × 4 seats = 40 seats total
   - **Seats 1-12**: RED (Faculty Only) - Locked
   - **Booked seats**: GREY - Disabled
   - **Available seats**: GREEN - Clickable
   - **Selected seat**: BLUE - Highlighted
   - Visual legend explaining colors
   - Confirm/Cancel buttons

4. **My Bookings History**
   - Table showing all student's bookings
   - Bus number, route, date, departure, seat, status
   - Color-coded status badges
   - Booking timestamp

## 🚀 How to Test

### Step 1: Restart Backend

```bash
cd backend
node src/server.js
```

Wait for: `✅ MongoDB Connected` and `🚀 RideUET backend running on port 5000`

### Step 2: Create Today's Schedules

**Important:** Schedules must have today's date to appear!

```bash
mongosh
use rideuet
```

Get today's date and create schedules:

```javascript
// Get today's date in YYYY-MM-DD format
const today = new Date().toISOString().split('T')[0];
print("Today's date:", today);

// Get a bus
const bus = db.buses.findOne();
if (!bus) {
    print("❌ No buses found. Create buses first!");
} else {
    print("✅ Using bus:", bus.busNumber);
    
    // Create today's schedules
    db.schedules.insertMany([
        {
            busId: bus._id,
            date: today,
            departureTime: "08:00",
            arrivalTime: "09:00",
            route: "Main Campus to Hostels",
            status: "scheduled",
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            busId: bus._id,
            date: today,
            departureTime: "14:00",
            arrivalTime: "15:00",
            route: "Hostels to Main Campus",
            status: "scheduled",
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            busId: bus._id,
            date: today,
            departureTime: "18:00",
            arrivalTime: "19:00",
            route: "Engineering to Library",
            status: "scheduled",
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ]);
    
    print("✅ Created 3 schedules for today!");
}
```

### Step 3: Login as Student

1. Open browser: `http://localhost:3000/login`
2. Login: `ahmed.student@uet.edu.pk` / `password123`
3. You'll be redirected to `/student` (Student Dashboard)

### Step 4: View Today's Schedules

✅ **Expected Result:**
- See "🚌 Today's Bus Schedules" section
- 3 schedule cards displayed
- Each card shows:
  - Bus number (blue, large)
  - Route badge (blue background)
  - Driver name
  - Departure and arrival times
  - Capacity
  - "📝 Book Seat" button

### Step 5: Book a Seat

1. Click **"📝 Book Seat"** on any schedule
2. ✅ Seat selection modal opens

**Modal Contents:**
- Schedule info (bus, route, departure)
- Color legend explaining seat types
- Seat grid (10 rows × 4 seats)

**Seat Colors:**
- 🔴 **Seats 1-12**: RED (Faculty Only) - Can't click
- 🟢 **Seats 13-40**: GREEN (Available) - Clickable
- ⚫ **Booked seats**: GREY (if any) - Can't click
- 🔵 **Selected seat**: BLUE - Your selection

### Step 6: Select and Confirm Seat

1. **Try clicking seat #5** (Faculty seat)
   - ✅ Error message: "Seats 1-12 are reserved for faculty only"
   - ✅ Seat doesn't get selected

2. **Click seat #15** (Available seat)
   - ✅ Seat turns BLUE
   - ✅ "Selected Seat: #15" appears below grid
   - ✅ "Confirm Booking" button becomes enabled

3. **Click "Confirm Booking"**
   - ✅ Modal closes
   - ✅ Success message: "Booking Confirmed! Seat #15"
   - ✅ Dashboard refreshes
   - ✅ New booking appears in "My Bookings" table

### Step 7: View My Bookings

Scroll down to "📋 My Bookings" section

✅ **Expected Result:**
- Table shows your booking
- Columns: Bus Number, Route, Date, Departure, Seat, Status, Booked At
- Seat #15 is displayed
- Status badge shows "BOOKED" (green)
- Timestamp shows when you booked

### Step 8: Test Seat Blocking

1. **Book another seat** on the same schedule
2. Click "📝 Book Seat" again
3. ✅ Seat #15 now appears GREY (booked)
4. ✅ Can't click seat #15
5. Select a different seat (e.g., #20)
6. Confirm booking
7. ✅ Now you have 2 bookings

### Step 9: Test Multiple Schedules

1. Book seats on different schedules
2. ✅ Each schedule tracks its own booked seats
3. ✅ Seat #15 on schedule 1 ≠ Seat #15 on schedule 2
4. ✅ All bookings appear in "My Bookings" table

## 🧪 Test Cases

### ✅ Positive Tests

1. **View today's schedules** - Should display all scheduled buses for today
2. **Open seat modal** - Should show seat grid with correct colors
3. **Select available seat** - Should highlight in blue
4. **Confirm booking** - Should create booking and show success
5. **View bookings** - Should display all student's bookings
6. **Booked seats appear grey** - Should be disabled in modal
7. **Multiple bookings** - Should allow booking multiple seats
8. **Different schedules** - Should track seats separately per schedule
9. **Notifications display** - Should show latest 5 notifications
10. **Responsive design** - Should work on mobile/tablet

### ❌ Negative Tests

1. **Click faculty seat (1-12)**:
   - Should show error
   - Should not select seat

2. **Click booked seat**:
   - Should show error
   - Should not select seat

3. **Confirm without selecting**:
   - Button should be disabled

4. **Duplicate seat booking**:
   - Backend should prevent
   - Should show error

5. **No schedules for today**:
   - Should show empty state message

6. **No bookings yet**:
   - Should show empty state message

## 🔍 API Testing with curl

### Get Today's Schedules
```bash
curl -X GET http://localhost:5000/api/schedules/today ^
  -H "Authorization: Bearer YOUR_STUDENT_TOKEN"
```

### Get Booked Seats for Schedule
```bash
curl -X GET http://localhost:5000/api/bookings/schedule/SCHEDULE_ID ^
  -H "Authorization: Bearer YOUR_STUDENT_TOKEN"
```

### Create Booking
```bash
curl -X POST http://localhost:5000/api/bookings ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_STUDENT_TOKEN" ^
  -d "{\"scheduleId\":\"SCHEDULE_ID\",\"seatNumber\":\"15\"}"
```

### Get My Bookings
```bash
curl -X GET http://localhost:5000/api/bookings/my ^
  -H "Authorization: Bearer YOUR_STUDENT_TOKEN"
```

## 📊 Database Verification

```bash
mongosh
use rideuet

# Check today's schedules
const today = new Date().toISOString().split('T')[0];
db.schedules.find({ date: today, status: "scheduled" }).pretty()

# Check bookings
db.bookings.find().pretty()

# Check booked seats for a schedule
db.bookings.find({ 
    scheduleId: ObjectId("SCHEDULE_ID"),
    status: { $ne: "cancelled" }
}).pretty()
```

## 🎨 UI Features

### Today's Schedules
- ✅ Grid layout (responsive)
- ✅ Card design with hover effects
- ✅ Bus number (large, blue)
- ✅ Route badge
- ✅ Detailed information with icons
- ✅ "Book Seat" button

### Seat Selection Modal
- ✅ Overlay with backdrop
- ✅ Centered modal
- ✅ Schedule information
- ✅ Color legend
- ✅ 10×4 seat grid
- ✅ Visual feedback on hover
- ✅ Selected seat info
- ✅ Confirm/Cancel buttons
- ✅ Close button (×)
- ✅ Click outside to close

### Seat Colors & States
- 🔴 **RED (1-12)**: Faculty only, locked, cursor: not-allowed
- 🟢 **GREEN (13-40)**: Available, hover scale effect
- ⚫ **GREY**: Booked, disabled, opacity: 0.6
- 🔵 **BLUE**: Selected, scaled, glowing shadow

### My Bookings Table
- ✅ Comprehensive columns
- ✅ Color-coded status badges
- ✅ Formatted dates/times
- ✅ Hover effects on rows
- ✅ Responsive (horizontal scroll on mobile)

## 🔐 Security Features

1. **Authentication Required**: All routes require valid JWT token
2. **Student Authorization**: Can only view/book their own
3. **Duplicate Prevention**: Backend prevents same seat booking
4. **Schedule Validation**: Checks if schedule exists
5. **Faculty Seat Protection**: Frontend and backend validation
6. **Status Filtering**: Only shows scheduled buses

## 🐛 Troubleshooting

### Issue: No schedules appear
**Solution**: 
1. Check schedules exist for TODAY's date
2. Verify date format: YYYY-MM-DD
3. Check status is "scheduled"
4. Run: `db.schedules.find({ date: "2026-05-17" })`

### Issue: All seats are grey
**Solution**: 
1. Check if bookings exist for this schedule
2. Verify booked seats API returns correct data
3. Check browser console for errors

### Issue: Can't book seat
**Solution**: 
1. Ensure seat is not 1-12 (faculty)
2. Ensure seat is not already booked
3. Check backend logs for errors
4. Verify student is logged in

### Issue: Modal doesn't open
**Solution**: 
1. Check browser console for errors
2. Verify schedule has valid ID
3. Check API response in Network tab

### Issue: Booking doesn't appear
**Solution**: 
1. Refresh the page
2. Check MongoDB: `db.bookings.find()`
3. Verify booking was created successfully

## 📝 Code Structure

```
backend/src/server.js
├── GET /api/schedules/today (new)
├── GET /api/bookings/schedule/:id (new)
├── GET /api/bookings/my (existing)
└── POST /api/bookings (existing)

frontend/src/pages/student/
├── StudentDashboard.js (completely rewritten)
└── StudentDashboard.css (completely rewritten)
```

## ✨ Features Implemented

### Student Dashboard
- ✅ Notifications banner (latest 5)
- ✅ Today's schedules grid
- ✅ Book seat button per schedule
- ✅ Seat selection modal
- ✅ 40-seat grid (10×4)
- ✅ Faculty seats (1-12) locked
- ✅ Booked seats disabled
- ✅ Available seats clickable
- ✅ Visual seat selection
- ✅ Booking confirmation
- ✅ Success messages
- ✅ My bookings history table
- ✅ Real-time updates
- ✅ Responsive design
- ✅ Empty states

### Backend Features
- ✅ Today's schedules endpoint
- ✅ Booked seats per schedule endpoint
- ✅ Duplicate seat prevention
- ✅ Faculty seat validation
- ✅ Schedule validation
- ✅ Authentication & authorization

## 🎯 Seat Layout

```
Row 1:  [1]  [2]  [3]  [4]   ← Faculty (RED)
Row 2:  [5]  [6]  [7]  [8]   ← Faculty (RED)
Row 3:  [9]  [10] [11] [12]  ← Faculty (RED)
Row 4:  [13] [14] [15] [16]  ← Available (GREEN)
Row 5:  [17] [18] [19] [20]  ← Available (GREEN)
Row 6:  [21] [22] [23] [24]  ← Available (GREEN)
Row 7:  [25] [26] [27] [28]  ← Available (GREEN)
Row 8:  [29] [30] [31] [32]  ← Available (GREEN)
Row 9:  [33] [34] [35] [36]  ← Available (GREEN)
Row 10: [37] [38] [39] [40]  ← Available (GREEN)
```

## 📈 Sample Workflow

1. **Student logs in** → Sees dashboard
2. **Views today's schedules** → 3 buses available
3. **Clicks "Book Seat"** → Modal opens
4. **Sees seat grid** → Faculty seats red, others green
5. **Tries seat #5** → Error: Faculty only
6. **Clicks seat #15** → Turns blue, selected
7. **Clicks "Confirm"** → Booking created
8. **Success message** → "Booking Confirmed! Seat #15"
9. **Views "My Bookings"** → Sees new booking in table
10. **Books another seat** → Seat #15 now grey (booked)

## 🎉 Success Criteria

✅ Student can view today's schedules
✅ Student can click "Book Seat" button
✅ Seat modal opens with 40-seat grid
✅ Seats 1-12 are RED and locked
✅ Available seats are GREEN and clickable
✅ Booked seats are GREY and disabled
✅ Selected seat turns BLUE
✅ Can confirm booking
✅ Success message appears
✅ Booking appears in "My Bookings"
✅ Can book multiple seats
✅ Each schedule tracks seats separately
✅ Notifications display at top
✅ Responsive design works
✅ Empty states show helpful messages

---

**Status**: ✅ Fully Functional
**Last Updated**: May 17, 2026

## 🚀 Quick Start

1. Restart backend
2. Create today's schedules (use script above)
3. Login as student
4. Book seats!

Enjoy your fully functional student dashboard! 🎓🚌
