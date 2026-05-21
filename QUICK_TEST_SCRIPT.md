# 🧪 Quick Test Script

## ⚡ 5-Minute Complete Test

### Step 1: Start Everything (2 minutes)

```cmd
:: Terminal 1 - Backend
cd backend
npm run dev

:: Terminal 2 - Frontend  
cd frontend
npm start

:: Terminal 3 - Seed Data
cd backend
node scripts/seedUETRoutes.js
```

**Expected Output:**
```
✅ MongoDB Connected
✅ RideUET backend running on port 5000
✅ React app running on port 3000
✅ 15 drivers created
✅ 15 buses created
✅ 15 routes created
✅ 105 schedules created
```

---

### Step 2: Test Student Booking (2 minutes)

#### A. Register & Login
```
1. Open: http://localhost:3000
2. Click "Create Account"
3. Fill form:
   - First Name: Test
   - Last Name: Student
   - Email: teststudent@uet.edu.pk
   - Password: test123
   - Phone: +923001234567
   - Role: student
4. Click "Register"
5. Should auto-login and redirect to /student/dashboard
```

#### B. Book a Seat
```
1. Dashboard loads - see "Available Schedules"
2. Click "Book Seat" on first schedule
3. Modal opens with seat grid
4. Verify:
   ✓ Rows 1-3 are gray with "Faculty Only"
   ✓ Other seats are green
5. Click any green seat (e.g., Seat 15)
6. Seat turns blue
7. Click "Confirm Booking"
8. See: "✅ Booking confirmed! Seat 15 is now reserved for you."
9. Modal closes
10. See booking in "Boarding History"
```

**✅ Student Booking Works!**

---

### Step 3: Test Driver Pickup (1 minute)

#### A. Login as Driver
```
1. Click logout (if logged in)
2. Login:
   - Email: driver01@uet.edu.pk
   - Password: driver123
3. Should redirect to /driver/dashboard
```

#### B. Mark Pickup
```
1. Dashboard loads (dark mode)
2. See:
   ✓ Route name
   ✓ Next stop
   ✓ Student count
   ✓ Student list with "Test Student"
3. Hold "Mark as Picked Up" button for 3 seconds
4. See: "✅ Test Student marked as picked up!"
5. Student status changes to "Picked Up" with green badge
6. Remaining count decreases
```

**✅ Driver Pickup Works!**

---

## 🎯 Quick Verification Commands

### Check Backend Health
```cmd
curl http://localhost:5000/api/health
```
**Expected:** `{"status":"RideUET backend running!"}`

### Check Schedules
```cmd
curl http://localhost:5000/api/schedules
```
**Expected:** Array of schedules

### Check Buses
```cmd
curl http://localhost:5000/api/buses
```
**Expected:** Array of 15 buses

---

## 🐛 Quick Fixes

### Backend Not Starting
```cmd
cd backend
npm install
npm run dev
```

### Frontend Not Starting
```cmd
cd frontend
npm install
npm start
```

### MongoDB Not Connected
```cmd
net start MongoDB
```

### No Schedules Showing
```cmd
cd backend
node scripts/seedUETRoutes.js
```

---

## ✅ Success Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] MongoDB connected
- [ ] Data seeded (15 routes, 105 schedules)
- [ ] Can register student
- [ ] Can login student
- [ ] Can see available schedules
- [ ] Can open seat modal
- [ ] Can select seat
- [ ] Can confirm booking
- [ ] Booking appears in history
- [ ] Can login driver
- [ ] Can see student list
- [ ] Can mark pickup
- [ ] Student status updates
- [ ] Logout button works

---

## 🎉 All Tests Pass?

**Congratulations! Your SwiftUET system is fully functional! 🚀**

### What's Working:
✅ Student registration and login
✅ Student seat booking with real-time availability
✅ Faculty row restrictions
✅ Driver login and dashboard
✅ Driver student manifest
✅ Driver pickup marking
✅ Real-time status updates
✅ Logout functionality

### Ready For:
✅ User acceptance testing
✅ Demo to stakeholders
✅ Production deployment
✅ Real-world usage

---

**Total Test Time: ~5 minutes**
**Result: Fully Functional Bus Management System! 🎊**
