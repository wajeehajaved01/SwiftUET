# Quick Test Guide - View Bookings Feature

## 🚀 Quick Start (4 Steps)

### Step 1: Restart Backend
```bash
cd backend
node src/server.js
```
Wait for: `✅ MongoDB Connected` and `🚀 RideUET backend running on port 5000`

### Step 2: Create Sample Bookings

**Option A: Using MongoDB Shell (Recommended)**
```bash
mongosh
use rideuet
```

Then copy and paste the content from `create-sample-bookings.js` or run:
```javascript
const student = db.users.findOne({email: "ahmed.student@uet.edu.pk"});
const schedule = db.schedules.findOne();

db.bookings.insertMany([
  {
    studentId: student._id,
    studentName: student.firstName + " " + student.lastName,
    scheduleId: schedule._id,
    seatNumber: "A1",
    status: "booked",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    studentId: student._id,
    studentName: student.firstName + " " + student.lastName,
    scheduleId: schedule._id,
    seatNumber: "A2",
    status: "picked-up",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    studentId: student._id,
    studentName: student.firstName + " " + student.lastName,
    scheduleId: schedule._id,
    seatNumber: "A3",
    status: "cancelled",
    createdAt: new Date(),
    updatedAt: new Date()
  }
])
```

**Option B: Using API**
```bash
# Login as student
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"ahmed.student@uet.edu.pk\",\"password\":\"password123\"}"

# Copy the token, then create booking
curl -X POST http://localhost:5000/api/bookings ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_TOKEN" ^
  -d "{\"scheduleId\":\"SCHEDULE_ID\",\"seatNumber\":\"A1\"}"
```

### Step 3: View Bookings as Admin
1. Open browser: `http://localhost:3000/login`
2. Login: `sara.admin@uet.edu.pk` / `password123`
3. Click **"📊 View Bookings"**
4. ✅ See statistics dashboard with counts
5. ✅ See bookings table with all data

### Step 4: Test Features

**Test Filters:**
1. Select a date from date picker
2. ✅ Table updates to show only that date
3. Select "Booked" from status dropdown
4. ✅ Table shows only booked bookings
5. Click "Clear Filters"
6. ✅ All bookings appear again

**Test Status Updates:**
1. Find a "Booked" booking
2. Click **"Picked Up"** button
3. Confirm
4. ✅ Status changes to "Picked Up" (blue badge)
5. ✅ Statistics update

**Test Cancel:**
1. Find another "Booked" booking
2. Click **"Cancel"** button
3. Confirm
4. ✅ Status changes to "Cancelled" (red badge)
5. ✅ Statistics update

## 🎯 What to Look For

### Statistics Dashboard
- ✅ 4 color-coded cards
- ✅ Total bookings count
- ✅ Booked count (green)
- ✅ Picked up count (blue)
- ✅ Cancelled count (red)
- ✅ Hover effects

### Filters Section
- ✅ Date picker
- ✅ Status dropdown
- ✅ Clear filters button
- ✅ "Showing X of Y bookings" text
- ✅ Button disabled when no filters

### Bookings Table
- ✅ Student name (blue, bold)
- ✅ Student email
- ✅ Bus number (green, bold)
- ✅ Route
- ✅ Schedule date (formatted)
- ✅ Departure time
- ✅ Seat number (gray, bold, centered)
- ✅ Status badge (color-coded)
- ✅ Booking timestamp (small, gray)
- ✅ Action buttons based on status

### Status Badges
- ✅ 🟢 Green = Booked
- ✅ 🔵 Blue = Picked Up
- ✅ 🔴 Red = Cancelled

### Action Buttons
- ✅ **Booked**: "Picked Up" (blue) + "Cancel" (red)
- ✅ **Picked Up**: "Completed" text
- ✅ **Cancelled**: "Cancelled" text

## ✅ Success Checklist

- [ ] Backend starts without errors
- [ ] Sample bookings created in database
- [ ] Admin can access `/admin/bookings`
- [ ] Statistics show correct counts
- [ ] All bookings appear in table
- [ ] Date filter works
- [ ] Status filter works
- [ ] Clear filters works
- [ ] Can mark booking as picked up
- [ ] Can cancel booking
- [ ] Statistics update after actions
- [ ] Success messages appear
- [ ] Confirmation dialogs work
- [ ] Table is responsive
- [ ] Empty state shows when no bookings

## 🐛 If Something Doesn't Work

### No bookings appear
- Check MongoDB: `db.bookings.find()`
- Verify bookings exist
- Check browser console for errors
- Ensure you're logged in as admin

### Filters don't work
- Ensure bookings have valid schedule dates
- Check browser console
- Verify date format is YYYY-MM-DD

### Can't update status
- Check backend logs
- Verify you're admin
- Ensure booking exists

### Statistics are wrong
- Refresh the page
- Check if bookings are being fetched
- Verify API response in Network tab

## 📊 Sample Data Structure

After creating bookings, you should see:

| Student | Bus | Route | Date | Seat | Status | Actions |
|---------|-----|-------|------|------|--------|---------|
| Ahmed Khan | LHR-1234 | Main Campus | 2026-05-18 | A1 | Booked | Picked Up / Cancel |
| Ahmed Khan | LHR-1234 | Main Campus | 2026-05-17 | A2 | Picked Up | Completed |
| Ahmed Khan | LHR-1234 | Main Campus | 2026-05-16 | A3 | Cancelled | Cancelled |

## 🧪 Quick Tests

### Test 1: View All Bookings
- Login as admin
- Go to View Bookings
- Should see all bookings

### Test 2: Filter by Date
- Select today's date
- Should show only today's bookings

### Test 3: Filter by Status
- Select "Booked"
- Should show only booked bookings

### Test 4: Mark as Picked Up
- Click "Picked Up" on a booked booking
- Status should change to "Picked Up"

### Test 5: Cancel Booking
- Click "Cancel" on a booked booking
- Status should change to "Cancelled"

### Test 6: Statistics Update
- After each action
- Statistics should update automatically

## 📱 Test on Different Screens

- Desktop (1600px+): Full table
- Laptop (1200px): Compressed table
- Tablet (768px): Horizontal scroll
- Mobile (480px): Single column stats, scrollable table

## 🎉 Done!

If all checkboxes are checked, the feature is working perfectly!

---

**Time to Complete**: ~5 minutes
**Difficulty**: Easy
**Status**: Ready to Test

## 📝 Useful MongoDB Commands

```javascript
// View all bookings
db.bookings.find().pretty()

// Count bookings
db.bookings.countDocuments()

// Count by status
db.bookings.countDocuments({ status: "booked" })

// Delete all bookings
db.bookings.deleteMany({})

// Delete cancelled bookings
db.bookings.deleteMany({ status: "cancelled" })

// Find bookings for a specific student
db.bookings.find({ studentName: "Ahmed Khan" }).pretty()
```
