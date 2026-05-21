# 🚀 Quick Start Testing Guide

## Prerequisites
- Backend running on http://localhost:5000
- Frontend running on http://localhost:3000
- MongoDB running

---

## Step 1: Start the Application

### Terminal 1 - Backend
```bash
cd backend
npm start
```

### Terminal 2 - Frontend
```bash
cd frontend
npm start
```

---

## Step 2: Create Test Accounts

### Option A: Use Frontend (Recommended)
1. Go to http://localhost:3000/register
2. Create accounts for each role:
   - **Admin:** admin@swiftuet.com / admin123
   - **Student:** student@swiftuet.com / student123
   - **Driver:** driver@swiftuet.com / driver123

### Option B: Use API
See `API_TEST_REQUESTS.md` for API calls

---

## Step 3: Seed Today's Data (IMPORTANT!)

### Using Postman/Thunder Client:
```http
POST http://localhost:5000/api/admin/seed-today
Authorization: Bearer <admin-token>
```

### Using curl:
```bash
# First login as admin to get token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@swiftuet.com","password":"admin123","role":"admin"}'

# Copy the token from response, then:
curl -X POST http://localhost:5000/api/admin/seed-today \
  -H "Authorization: Bearer <paste-token-here>"
```

**This creates:**
- 2 buses (UET-001, UET-002)
- 2 schedules for today (08:00 and 14:00)

---

## Step 4: Test Student Features

### 4.1 View Today's Schedules
1. Login as student (student@swiftuet.com / student123)
2. Go to dashboard
3. See "Today's Schedules" section
4. Should show 2 schedules:
   - Main Campus ↔ KSK (08:00)
   - Main Campus ↔ Hostel (14:00)

### 4.2 Book a Seat
1. Click "Book a Seat" on any schedule
2. Modal opens with seat grid
3. **Verify:**
   - Rows 1-3 are RED with diagonal stripes (Faculty Only)
   - Rows 4-10 are GREEN (Available)
   - Can't click rows 1-3
4. Click any seat in rows 4-10 (e.g., 4A)
5. Seat turns TEAL (selected)
6. Click "Confirm Booking"
7. See success message: "Seat 4A booked successfully!"
8. Modal closes

### 4.3 View My Bookings
1. Click "My Bookings" in navbar (or go to /student/bookings)
2. See your booking with:
   - Route name
   - Date
   - Bus number
   - Seat number
   - Green "Booked" badge

---

## Step 5: Test Driver Features

### 5.1 View Dashboard
1. Logout from student account
2. Login as driver (driver@swiftuet.com / driver123)
3. Go to driver dashboard
4. **Verify:**
   - Logout button in top-right corner (RED)
   - Dark mode interface
   - Status bar showing route, next stop, remaining students
   - Map with route
   - Student manifest showing booked students

### 5.2 Mark Student as Picked Up
1. Find student in manifest (should show "Waiting" status)
2. Press and HOLD "Mark as Picked Up" button
3. Progress bar fills up (takes 2 seconds)
4. Release after 2 seconds
5. See success message
6. Student status changes to "Picked Up" with green checkmark

### 5.3 Test Logout
1. Click logout button in top-right corner
2. Should redirect to login page

---

## Step 6: Verify Status Updates

### 6.1 Check Student Side
1. Login as student again
2. Go to "My Bookings"
3. **Verify:**
   - Booking status changed to "Picked Up"
   - Badge is now BLUE instead of green

---

## Step 7: Test Admin Features

### 7.1 View Dashboard
1. Login as admin (admin@swiftuet.com / admin123)
2. Go to admin dashboard
3. See statistics:
   - Total Students
   - Total Drivers
   - Total Buses
   - Total Routes
   - Today's Bookings
   - Active Schedules

### 7.2 View All Bookings
1. Click "Dashboard" tab
2. See recent bookings section
3. Should show all student bookings with statuses

### 7.3 Manage Buses
1. Click "Buses" in sidebar
2. See 2 buses (UET-001, UET-002)
3. Try creating a new bus
4. Try deleting a bus

### 7.4 Manage Routes
1. Click "Routes" in sidebar
2. Try creating a new route
3. Add stops (comma-separated)

### 7.5 Manage Schedules
1. Click "Schedules" in sidebar
2. See today's schedules
3. Try creating a new schedule
4. Try marking a schedule as "Delayed"

---

## ✅ Testing Checklist

### Student Features
- [ ] Can view today's schedules
- [ ] Can see available seats count
- [ ] Can open seat booking modal
- [ ] Rows 1-3 are RED and disabled (Faculty Only)
- [ ] Can select available seats (GREEN)
- [ ] Selected seat turns TEAL
- [ ] Can confirm booking
- [ ] See success message
- [ ] Can view "My Bookings"
- [ ] Bookings show correct status badges
- [ ] Status updates when driver marks picked up

### Driver Features
- [ ] Logout button visible in top-right
- [ ] Dark mode interface
- [ ] Can see student manifest
- [ ] Hold-to-confirm button works
- [ ] Can mark students as picked up
- [ ] Status updates in real-time

### Admin Features
- [ ] Dashboard shows statistics
- [ ] Can view all bookings
- [ ] Can manage buses (CRUD)
- [ ] Can manage routes (CRUD)
- [ ] Can manage schedules (CRUD)
- [ ] Can view all users
- [ ] Seed endpoint works

### Integration
- [ ] Driver pickup updates student booking status
- [ ] Student sees updated status immediately
- [ ] Admin can see all bookings and statuses
- [ ] All dashboards properly linked

---

## 🐛 Troubleshooting

### No schedules showing
**Solution:** Run seed endpoint
```
POST /api/admin/seed-today
```

### Can't book seat
**Possible causes:**
1. Seat already booked - choose different seat
2. Not logged in - check token in localStorage
3. Schedule full - try different schedule

### Driver can't see students
**Possible causes:**
1. No bookings for today - create bookings first
2. Wrong schedule - check schedule date

### Status not updating
**Solution:**
1. Refresh the page
2. Check network tab for API errors
3. Verify booking ID is correct

---

## 📊 Expected Data After Seeding

### Buses
```
UET-001 - Main Campus ↔ KSK (40 seats)
UET-002 - Main Campus ↔ Hostel (40 seats)
```

### Schedules (Today)
```
Schedule 1: UET-001, 08:00-09:00, Main Campus ↔ KSK
Schedule 2: UET-002, 14:00-15:00, Main Campus ↔ Hostel
```

### Bookings
```
Created by students when they book seats
Status: booked → picked-up (when driver confirms)
```

---

## 🎯 Key Features to Demonstrate

1. **Faculty Row Restriction**
   - Rows 1-3 are visually distinct (RED stripes)
   - Completely unclickable
   - Clear "Faculty Only" label

2. **Real-time Status Updates**
   - Driver marks pickup
   - Student sees status change
   - Admin sees all updates

3. **Seat Availability**
   - Dynamic calculation
   - Visual feedback (GREEN/GREY/RED)
   - Prevents double booking

4. **Hold-to-Confirm Safety**
   - Prevents accidental taps
   - Visual progress bar
   - 2-second hold required

5. **Role-based Access**
   - Each role sees appropriate dashboard
   - Protected routes
   - Proper authentication

---

## 📝 Notes

- All times are in 24-hour format
- Dates are in YYYY-MM-DD format
- Seat numbers are in format: RowLetter (e.g., 4A, 5B)
- Faculty rows are hardcoded as rows 1-3
- Total capacity is 40 seats (10 rows × 4 seats)

---

## 🎉 Success Criteria

If all the following work, the system is fully functional:

✅ Student can view schedules
✅ Student can book seats
✅ Faculty rows are restricted
✅ Student can view bookings
✅ Driver can mark pickups
✅ Status updates across dashboards
✅ Admin can manage all resources
✅ Logout works on all dashboards
✅ All routes are protected
✅ Seed endpoint creates test data

---

**Happy Testing! 🚀**

For detailed API testing, see `API_TEST_REQUESTS.md`
For implementation details, see `FIXES_APPLIED.md`
