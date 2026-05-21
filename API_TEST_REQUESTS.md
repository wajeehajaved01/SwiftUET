# SwiftUET API Test Requests

## Quick Testing Guide

### 1. Register Admin
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "firstName": "Admin",
  "lastName": "User",
  "email": "admin@swiftuet.com",
  "password": "admin123",
  "phoneNumber": "+1234567890",
  "role": "admin"
}
```

### 2. Register Student
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Student",
  "email": "student@swiftuet.com",
  "password": "student123",
  "phoneNumber": "+1234567891",
  "role": "student"
}
```

### 3. Register Driver
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "firstName": "Mike",
  "lastName": "Driver",
  "email": "driver@swiftuet.com",
  "password": "driver123",
  "phoneNumber": "+1234567892",
  "role": "driver"
}
```

### 4. Login as Admin
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@swiftuet.com",
  "password": "admin123",
  "role": "admin"
}
```

**Save the token from response!**

### 5. Seed Today's Schedules (Admin Only)
```http
POST http://localhost:5000/api/admin/seed-today
Authorization: Bearer <admin-token>
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Created 2 schedules for today",
  "data": [
    {
      "_id": "...",
      "busId": {
        "busNumber": "UET-001",
        "capacity": 40,
        "route": "Main Campus ↔ KSK"
      },
      "date": "2026-05-20",
      "departureTime": "08:00",
      "arrivalTime": "09:00",
      "route": "Main Campus ↔ KSK",
      "status": "scheduled"
    },
    {
      "_id": "...",
      "busId": {
        "busNumber": "UET-002",
        "capacity": 40,
        "route": "Main Campus ↔ Hostel"
      },
      "date": "2026-05-20",
      "departureTime": "14:00",
      "arrivalTime": "15:00",
      "route": "Main Campus ↔ Hostel",
      "status": "scheduled"
    }
  ]
}
```

### 6. Get Today's Schedules
```http
GET http://localhost:5000/api/schedules/today
Authorization: Bearer <any-token>
```

### 7. Get Booked Seats for a Schedule
```http
GET http://localhost:5000/api/bookings/schedule/<schedule-id>
Authorization: Bearer <any-token>
```

### 8. Login as Student
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "student@swiftuet.com",
  "password": "student123",
  "role": "student"
}
```

### 9. Book a Seat (Student)
```http
POST http://localhost:5000/api/bookings
Authorization: Bearer <student-token>
Content-Type: application/json

{
  "scheduleId": "<schedule-id-from-step-5>",
  "seatNumber": "4A"
}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "studentId": "...",
    "studentName": "John Student",
    "scheduleId": "...",
    "seatNumber": "4A",
    "status": "booked"
  },
  "message": "Seat booked successfully!"
}
```

### 10. Get My Bookings (Student)
```http
GET http://localhost:5000/api/bookings/my
Authorization: Bearer <student-token>
```

### 11. Login as Driver
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "driver@swiftuet.com",
  "password": "driver123",
  "role": "driver"
}
```

### 12. Mark Student as Picked Up (Driver)
```http
PATCH http://localhost:5000/api/bookings/<booking-id>/pickup
Authorization: Bearer <driver-token>
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "status": "picked-up",
    ...
  },
  "message": "Student marked as picked up"
}
```

### 13. Verify Status Update (Student)
```http
GET http://localhost:5000/api/bookings/my
Authorization: Bearer <student-token>
```

**Should show status as "picked-up"**

### 14. Get All Bookings (Admin)
```http
GET http://localhost:5000/api/bookings
Authorization: Bearer <admin-token>
```

---

## Complete Testing Flow

### Flow 1: Student Books a Seat

1. **Admin seeds data:**
   ```
   POST /api/admin/seed-today
   ```

2. **Student views schedules:**
   ```
   GET /api/schedules/today
   ```

3. **Student checks available seats:**
   ```
   GET /api/bookings/schedule/<schedule-id>
   ```

4. **Student books a seat:**
   ```
   POST /api/bookings
   Body: { scheduleId, seatNumber: "4A" }
   ```

5. **Student views their bookings:**
   ```
   GET /api/bookings/my
   ```

### Flow 2: Driver Picks Up Student

1. **Driver views their schedule:**
   ```
   GET /api/schedules?date=2026-05-20
   ```

2. **Driver gets student manifest:**
   ```
   GET /api/bookings/schedule/<schedule-id>
   ```

3. **Driver marks student as picked up:**
   ```
   PATCH /api/bookings/<booking-id>/pickup
   ```

4. **Student checks status:**
   ```
   GET /api/bookings/my
   Status should be "picked-up"
   ```

### Flow 3: Admin Monitors System

1. **Admin views all bookings:**
   ```
   GET /api/bookings
   ```

2. **Admin views dashboard stats:**
   ```
   GET /api/admin/dashboard
   ```

3. **Admin views all schedules:**
   ```
   GET /api/schedules
   ```

---

## Testing with Frontend

### 1. Seed Data
```bash
# Use Postman or curl
curl -X POST http://localhost:5000/api/admin/seed-today \
  -H "Authorization: Bearer <admin-token>"
```

### 2. Test Student Flow
1. Open browser: http://localhost:3000
2. Login as student
3. Go to dashboard
4. See 2 schedules in "Today's Schedules"
5. Click "Book a Seat" on first schedule
6. Modal opens with seat grid
7. Verify rows 1-3 are RED (Faculty Only)
8. Click seat "4A" (should turn TEAL)
9. Click "Confirm Booking"
10. See success message
11. Click "My Bookings" in navbar
12. See booking with green "Booked" badge

### 3. Test Driver Flow
1. Login as driver
2. Go to driver dashboard
3. See student in manifest
4. Hold "Mark as Picked Up" button
5. See success message

### 4. Verify Update
1. Login as student again
2. Go to "My Bookings"
3. See booking status changed to "Picked Up" (blue badge)

---

## Common Issues

### Issue: "No schedules available"
**Solution:** Run seed endpoint first
```
POST /api/admin/seed-today
```

### Issue: "Seat already booked"
**Solution:** Choose a different seat or create new schedule

### Issue: "Unauthorized"
**Solution:** Check token is valid and not expired

### Issue: "Schedule not found"
**Solution:** Make sure schedule ID is correct from seed response

---

## Quick Commands

### Start Backend
```bash
cd backend
npm start
```

### Start Frontend
```bash
cd frontend
npm start
```

### Check MongoDB
```bash
mongo
use rideuet
db.schedules.find().pretty()
db.bookings.find().pretty()
db.buses.find().pretty()
```

---

**All endpoints are ready for testing!**
