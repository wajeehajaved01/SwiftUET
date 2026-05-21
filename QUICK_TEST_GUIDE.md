# SwiftUET - Quick Test Guide

## 🚀 Start Servers

### Terminal 1 - Backend
```cmd
cd backend
npm run dev
```
✅ Should see: "MongoDB Connected" and "RideUET backend running on port 5000"

### Terminal 2 - Frontend
```cmd
cd frontend
npm start
```
✅ Should open browser at: http://localhost:3000

---

## 🧪 Quick API Tests (Windows CMD)

### 1. Health Check
```cmd
curl http://localhost:5000/api/health
```

### 2. Register Admin
```cmd
curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d "{\"firstName\":\"Admin\",\"lastName\":\"User\",\"email\":\"admin@uet.edu.pk\",\"password\":\"admin123\",\"phoneNumber\":\"+923001234567\",\"role\":\"admin\"}"
```

### 3. Login Admin
```cmd
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@uet.edu.pk\",\"password\":\"admin123\",\"role\":\"admin\"}"
```
**📝 Copy the token from response!**

### 4. Get All Users (Replace TOKEN)
```cmd
curl http://localhost:5000/api/users -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 5. Get Students Only
```cmd
curl "http://localhost:5000/api/users?role=student" -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 6. Get Dashboard Stats
```cmd
curl http://localhost:5000/api/admin/dashboard -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 7. Get All Buses
```cmd
curl http://localhost:5000/api/buses
```

### 8. Create Bus
```cmd
curl -X POST http://localhost:5000/api/buses -H "Authorization: Bearer YOUR_TOKEN_HERE" -H "Content-Type: application/json" -d "{\"busNumber\":\"UET-001\",\"capacity\":40,\"route\":\"Main Campus ↔ KSK\",\"driverName\":\"Ali Khan\",\"status\":\"active\"}"
```

### 9. Get All Schedules
```cmd
curl http://localhost:5000/api/schedules
```

---

## 🌐 Quick UI Tests

### 1. Test Login Page
- Open: http://localhost:3000
- Should see SwiftUET branding
- Try login with: admin@uet.edu.pk / admin123

### 2. Test Student Dashboard
- Login as student
- Should see: Live map, Available schedules, Booking history

### 3. Test Driver Dashboard
- Login as driver
- Should see: Dark mode, Student manifest, Hold-to-confirm button

### 4. Test Admin Dashboard
- Login as admin
- Should see: Analytics, Management, Broadcast tabs

### 5. Test Parent Tracking
- Login as parent
- Should see: Status stepper, Live map, Notification log

---

## ✅ Success Checklist

### Backend
- [ ] MongoDB connected
- [ ] Server running on port 5000
- [ ] Health check returns success
- [ ] Can register user
- [ ] Can login and get token
- [ ] Protected routes work with token

### Frontend
- [ ] App loads on port 3000
- [ ] Login page displays correctly
- [ ] Can login successfully
- [ ] Redirects to correct dashboard
- [ ] Navbar shows user info
- [ ] Can logout

### API Routes (All 9 Requested)
- [ ] GET /api/users (admin only)
- [ ] GET /api/users?role=student (admin only)
- [ ] GET /api/admin/dashboard (admin only)
- [ ] GET /api/buses (public)
- [ ] POST /api/buses (admin only)
- [ ] GET /api/schedules (public)
- [ ] POST /api/schedules (admin only)
- [ ] POST /api/bookings (student only)
- [ ] GET /api/bookings/schedule/:id (admin/driver)

### Bonus Routes
- [ ] GET /api/bookings/my-bookings (student)
- [ ] PATCH /api/bookings/:id/pickup (driver/admin)

---

## 🐛 Common Issues

### MongoDB Not Connected
```cmd
net start MongoDB
```

### Port 5000 Already in Use
```cmd
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Frontend Can't Connect to Backend
- Check backend is running on port 5000
- Check `frontend/.env` has correct API URL
- Clear browser cache

---

## 📱 Test Scenarios

### Scenario 1: Student Books a Seat
1. Register as student
2. Login to student dashboard
3. View available schedules
4. Click "Book Seat"
5. Select seat from grid (rows 4-10)
6. Confirm booking
7. Check "My Bookings" section

### Scenario 2: Driver Picks Up Student
1. Login as driver
2. View student manifest
3. Hold "Mark as Picked Up" button
4. Verify status changes

### Scenario 3: Admin Creates Schedule
1. Login as admin
2. Go to Management tab
3. Create new bus
4. Create new schedule
5. Verify schedule appears in list

### Scenario 4: Parent Tracks Student
1. Login as parent
2. View live map
3. Check status stepper
4. View notification log

---

## 🎯 Quick Verification

Run this command to test all main endpoints:
```cmd
echo Testing Health... && curl http://localhost:5000/api/health && echo. && echo Testing Buses... && curl http://localhost:5000/api/buses && echo. && echo Testing Schedules... && curl http://localhost:5000/api/schedules
```

---

## 📞 Need Help?

1. Check console logs (backend terminal)
2. Check browser console (F12)
3. Verify .env files are configured
4. Ensure MongoDB is running
5. Check `HOW_TO_RUN_AND_TEST.md` for detailed guide

---

**Everything Working? You're Ready to Go! 🎉**
