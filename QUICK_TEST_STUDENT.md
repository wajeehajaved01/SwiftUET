# Quick Test Guide - Student Dashboard

## 🚀 Quick Start (5 Steps)

### Step 1: Restart Backend
```bash
cd backend
node src/server.js
```
Wait for: `✅ MongoDB Connected` and `🚀 RideUET backend running on port 5000`

### Step 2: Create Today's Schedules

**IMPORTANT:** Schedules must have TODAY's date!

```bash
mongosh
use rideuet
```

Then copy and paste content from `create-today-schedules.js` or run:

```javascript
const today = new Date().toISOString().split('T')[0];
const bus = db.buses.findOne({ status: "active" });

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
```

### Step 3: Login as Student
1. Open browser: `http://localhost:3000/login`
2. Login: `ahmed.student@uet.edu.pk` / `password123`
3. You'll see the Student Dashboard

### Step 4: Book a Seat

**View Schedules:**
- ✅ See "🚌 Today's Bus Schedules" section
- ✅ 3 schedule cards displayed
- ✅ Each shows bus, route, times, driver

**Open Seat Modal:**
1. Click **"📝 Book Seat"** on any schedule
2. ✅ Modal opens with seat grid

**Understand Seat Colors:**
- 🔴 **RED (Seats 1-12)**: Faculty Only - Can't click
- 🟢 **GREEN (Seats 13-40)**: Available - Click to select
- ⚫ **GREY**: Already booked - Can't click
- 🔵 **BLUE**: Your selection

**Select and Book:**
1. Try clicking **Seat #5** (Faculty)
   - ✅ Error: "Seats 1-12 are reserved for faculty only"
2. Click **Seat #15** (Available)
   - ✅ Turns BLUE
   - ✅ "Selected Seat: #15" appears
3. Click **"Confirm Booking"**
   - ✅ Modal closes
   - ✅ Success: "Booking Confirmed! Seat #15"

### Step 5: View Your Bookings

Scroll down to "📋 My Bookings"

✅ **Expected:**
- Table shows your booking
- Seat #15 displayed
- Status: "BOOKED" (green badge)
- Timestamp shown

## 🧪 Quick Tests

### Test 1: Faculty Seat Protection
- Click seat #1 to #12
- Should show error
- Should NOT select

### Test 2: Multiple Bookings
- Book seat #15 on first schedule
- Book seat #20 on same schedule
- Both should appear in "My Bookings"

### Test 3: Seat Blocking
- Book seat #15
- Click "Book Seat" again
- Seat #15 should be GREY (booked)
- Can't click it

### Test 4: Different Schedules
- Book seat #15 on schedule 1
- Book seat #15 on schedule 2
- Both bookings should work (different schedules)

### Test 5: Notifications
- Should see notifications banner at top
- Shows latest 5 notifications
- Purple gradient background

## ✅ Success Checklist

- [ ] Backend starts without errors
- [ ] Created today's schedules
- [ ] Student can login
- [ ] Today's schedules appear (3 cards)
- [ ] Can click "Book Seat" button
- [ ] Modal opens with seat grid
- [ ] Seats 1-12 are RED (faculty)
- [ ] Seats 13-40 are GREEN (available)
- [ ] Can't click faculty seats
- [ ] Can click available seats
- [ ] Selected seat turns BLUE
- [ ] "Confirm Booking" button works
- [ ] Success message appears
- [ ] Booking appears in "My Bookings"
- [ ] Booked seat turns GREY next time
- [ ] Can book multiple seats
- [ ] Notifications display at top

## 🐛 Common Issues

### No schedules appear
**Fix:** Schedules must have TODAY's date
```javascript
// Check date
const today = new Date().toISOString().split('T')[0];
print(today); // Should be 2026-05-17 (or current date)

// Check schedules
db.schedules.find({ date: today }).pretty()
```

### All seats are grey
**Fix:** Check if bookings exist
```javascript
db.bookings.find({ scheduleId: ObjectId("SCHEDULE_ID") }).pretty()
```

### Can't book seat
**Fix:** 
- Ensure seat is 13-40 (not faculty)
- Ensure seat is not already booked
- Check browser console for errors

### Modal doesn't open
**Fix:**
- Check browser console
- Verify schedule has valid ID
- Check Network tab for API errors

## 📊 Sample Data

After testing, you should have:

**Today's Schedules:**
| Time | Route | Status |
|------|-------|--------|
| 08:00 | Main Campus to Hostels | Scheduled |
| 14:00 | Hostels to Main Campus | Scheduled |
| 18:00 | Engineering to Library | Scheduled |

**My Bookings:**
| Bus | Route | Seat | Status |
|-----|-------|------|--------|
| LHR-1234 | Main Campus to Hostels | 15 | Booked |
| LHR-1234 | Hostels to Main Campus | 20 | Booked |

## 🎯 Visual Guide

### Seat Grid Layout
```
Row 1:  [1🔴]  [2🔴]  [3🔴]  [4🔴]   ← Faculty
Row 2:  [5🔴]  [6🔴]  [7🔴]  [8🔴]   ← Faculty
Row 3:  [9🔴]  [10🔴] [11🔴] [12🔴]  ← Faculty
Row 4:  [13🟢] [14🟢] [15🔵] [16🟢]  ← Available (15 selected)
Row 5:  [17🟢] [18🟢] [19🟢] [20⚫]  ← Available (20 booked)
Row 6:  [21🟢] [22🟢] [23🟢] [24🟢]  ← Available
Row 7:  [25🟢] [26🟢] [27🟢] [28🟢]  ← Available
Row 8:  [29🟢] [30🟢] [31🟢] [32🟢]  ← Available
Row 9:  [33🟢] [34🟢] [35🟢] [36🟢]  ← Available
Row 10: [37🟢] [38🟢] [39🟢] [40🟢]  ← Available
```

## 📱 Test on Different Screens

- **Desktop**: Full layout
- **Tablet**: Responsive grid
- **Mobile**: Single column, scrollable table

## 🎉 Done!

If all checkboxes are checked, the Student Dashboard is working perfectly!

---

**Time to Complete**: ~5 minutes
**Difficulty**: Easy
**Status**: Ready to Test

## 💡 Pro Tips

1. **Create multiple schedules** for better testing
2. **Book seats on different schedules** to see separation
3. **Try booking same seat twice** to test duplicate prevention
4. **Check "My Bookings"** after each booking
5. **Test on mobile** to see responsive design

## 📝 Useful Commands

```javascript
// View today's schedules
const today = new Date().toISOString().split('T')[0];
db.schedules.find({ date: today }).pretty()

// View all bookings
db.bookings.find().pretty()

// View student's bookings
db.bookings.find({ studentName: "Ahmed Khan" }).pretty()

// Delete all bookings (reset)
db.bookings.deleteMany({})

// Delete today's schedules
db.schedules.deleteMany({ date: today })
```
