# SwiftUET Testing & Running Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas connection)
- npm or yarn package manager

### 1. Install Dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

### 2. Environment Configuration

#### Backend (.env)
Create or verify `backend/.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rideuet
JWT_SECRET=your-secret-key-here
NODE_ENV=development

# Twilio (Optional - for SMS notifications)
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=your-twilio-phone
```

#### Frontend (.env)
Create or verify `frontend/.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Start MongoDB
Make sure MongoDB is running:
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas connection string in backend/.env
```

### 4. Run the Application

#### Terminal 1 - Backend
```bash
cd backend
npm start
```
Backend will run on: http://localhost:5000

#### Terminal 2 - Frontend
```bash
cd frontend
npm start
```
Frontend will run on: http://localhost:3000

---

## 🧪 Testing Guide

### Test User Accounts

You'll need to create test accounts for each role. Use the Register page or create them via API:

#### 1. Create Admin Account
```bash
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

#### 2. Create Student Account
```bash
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

#### 3. Create Driver Account
```bash
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

#### 4. Create Parent Account
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Parent",
  "email": "parent@swiftuet.com",
  "password": "parent123",
  "phoneNumber": "+1234567893",
  "role": "parent"
}
```

---

## 📋 Feature Testing Checklist

### ✅ Authentication & Authorization

1. **Login Page** (http://localhost:3000/login)
   - [ ] Test login with each role (student, driver, admin, parent)
   - [ ] Verify role dropdown sends correct value
   - [ ] Check "Create Account" link navigates to /register
   - [ ] Check "Forgot Password" link navigates to /forgot-password
   - [ ] Verify token is saved to localStorage
   - [ ] Verify user object is saved to localStorage

2. **Register Page** (http://localhost:3000/register)
   - [ ] Create new accounts for each role
   - [ ] Verify validation works
   - [ ] Check redirect after successful registration

3. **Protected Routes**
   - [ ] Try accessing admin routes without login (should redirect to /login)
   - [ ] Try accessing admin routes as student (should be blocked)
   - [ ] Verify each role can only access their own routes

---

### ✅ Admin Dashboard Features

Login as admin and test:

#### 1. Dashboard Tab (http://localhost:3000/admin/dashboard)
- [ ] Verify dashboard statistics load:
  - Total Students
  - Total Drivers
  - Total Buses
  - Total Routes
  - Today's Bookings
  - Active Schedules
- [ ] Check "Refresh" button updates data
- [ ] Verify recent activity shows

#### 2. Bus Management (http://localhost:3000/admin/buses)
- [ ] View all buses
- [ ] Click "Add New Bus" button
- [ ] Create a new bus with:
  - Bus Number: "UET-001"
  - Route: "Main Campus ↔ KSK"
  - Driver Name: "John Doe"
  - Capacity: 40
  - Status: Active
- [ ] Verify bus appears in the list
- [ ] Test delete bus functionality

#### 3. Route Management (http://localhost:3000/admin/routes)
- [ ] View all routes
- [ ] Click "Add New Route"
- [ ] Create a new route with:
  - Name: "Main Campus to KSK"
  - Start Point: "Main Campus"
  - End Point: "KSK Campus"
  - Stops: "Gate 1, Library, Hostel, KSK Gate"
  - Status: Active
- [ ] Verify route appears in the list
- [ ] Test delete route functionality

#### 4. Schedule Management (http://localhost:3000/admin/schedules)
- [ ] View all schedules
- [ ] Click "Add New Schedule"
- [ ] Create a new schedule:
  - Select a bus
  - Date: Today's date
  - Route: "Main Campus ↔ KSK"
  - Departure Time: "08:00"
  - Arrival Time: "09:00"
- [ ] Verify schedule appears in the list
- [ ] Test "Mark Delayed" button
- [ ] Test "Cancel" button

#### 5. User Management (http://localhost:3000/admin/users)
- [ ] View all users
- [ ] Test filter buttons (All, Students, Drivers, Parents)
- [ ] Verify user cards show correct information

#### 6. Management Tab
- [ ] Test "Create New Route" form
- [ ] Test "Assign Driver to Bus" form
- [ ] Test "Faculty Rows Toggle" (lock/unlock)

#### 7. Broadcast Tab
- [ ] Enter broadcast message
- [ ] Select target audience (All Users, Students, Drivers, Parents)
- [ ] Select urgency level (Low, Medium, High, Critical)
- [ ] Click "Broadcast Alert"
- [ ] Verify confirmation modal appears
- [ ] Confirm broadcast

---

### ✅ Student Dashboard Features

Login as student and test:

#### 1. Live Tracking (http://localhost:3000/student/dashboard)
- [ ] Verify map container loads
- [ ] Check current route status displays
- [ ] Verify delay alert banner shows when applicable

#### 2. Seat Booking
- [ ] Click "Book Seat" on an available schedule
- [ ] Verify seat booking modal opens
- [ ] Check that rows 1-3 are visually locked (Faculty Only)
- [ ] Try clicking a faculty seat (should not select)
- [ ] Click an available seat in rows 4-10
- [ ] Verify seat highlights when selected
- [ ] Click "Confirm Booking"
- [ ] Verify booking success message

#### 3. Boarding History
- [ ] Scroll to boarding history section
- [ ] Verify past rides are grouped by month
- [ ] Check ride details display correctly

---

### ✅ Driver Dashboard Features

Login as driver and test:

#### 1. Dark Mode Interface (http://localhost:3000/driver/dashboard)
- [ ] Verify dark mode styling
- [ ] Check no navbar is present (full-screen)
- [ ] Verify status bar shows:
  - Current route
  - Next stop
  - Remaining students

#### 2. Live Map
- [ ] Verify map loads with route visualization
- [ ] Check bus location marker displays

#### 3. Student Manifest
- [ ] Verify list of booked students shows
- [ ] Check pickup status for each student

#### 4. Hold-to-Confirm Button
- [ ] Press and hold "Mark as Picked Up" button
- [ ] Verify progress bar fills up
- [ ] Hold for 2 seconds to complete action
- [ ] Verify success state triggers
- [ ] Test releasing early (should cancel)

---

### ✅ Parent Tracking Features

Login as parent and test:

#### 1. Tracking View (http://localhost:3000/parent/tracking)
- [ ] Verify student badge displays
- [ ] Check status stepper shows 3 milestones:
  - Waiting to Board
  - In Transit
  - Safely Arrived
- [ ] Verify active milestone glows with teal color

#### 2. Live Map
- [ ] Verify map loads with bus location
- [ ] Check route polyline displays

#### 3. Notification Log
- [ ] Verify notification feed shows
- [ ] Check timestamps are correct
- [ ] Verify notifications are in chronological order

#### 4. Auto-Refresh
- [ ] Wait 15 seconds
- [ ] Verify page auto-refreshes

---

## 🔧 API Endpoint Testing

Use Postman, Thunder Client, or curl to test:

### Admin Endpoints

```bash
# Get Dashboard Stats
GET http://localhost:5000/api/admin/dashboard
Authorization: Bearer <admin-token>

# Assign Driver to Bus
POST http://localhost:5000/api/admin/assign-driver
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "driverId": "driver-id-here",
  "busId": "bus-id-here"
}

# Toggle Faculty Rows
POST http://localhost:5000/api/admin/toggle-faculty-rows
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "scheduleId": "schedule-id-here",
  "locked": true
}

# Send Broadcast
POST http://localhost:5000/api/admin/broadcast
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "message": "Emergency: All classes cancelled due to weather",
  "targetAudience": "all",
  "urgency": "high"
}

# Get Analytics
GET http://localhost:5000/api/admin/analytics
Authorization: Bearer <admin-token>
```

### Route Endpoints

```bash
# Get All Routes
GET http://localhost:5000/api/routes

# Create Route (Admin only)
POST http://localhost:5000/api/routes
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Main Campus to KSK",
  "startPoint": "Main Campus",
  "endPoint": "KSK Campus",
  "stops": ["Gate 1", "Library", "Hostel", "KSK Gate"],
  "status": "active"
}
```

### Bus Endpoints

```bash
# Get All Buses
GET http://localhost:5000/api/buses
Authorization: Bearer <token>

# Create Bus (Admin only)
POST http://localhost:5000/api/buses
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "busNumber": "UET-001",
  "capacity": 40,
  "route": "Main Campus ↔ KSK",
  "driverName": "John Doe",
  "status": "active"
}
```

### Schedule Endpoints

```bash
# Get All Schedules
GET http://localhost:5000/api/schedules
Authorization: Bearer <token>

# Get Today's Schedules
GET http://localhost:5000/api/schedules/today
Authorization: Bearer <token>

# Create Schedule (Admin only)
POST http://localhost:5000/api/schedules
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "busId": "bus-id-here",
  "date": "2026-05-19",
  "departureTime": "08:00",
  "arrivalTime": "09:00",
  "route": "Main Campus ↔ KSK"
}
```

### Booking Endpoints

```bash
# Get My Bookings (Student)
GET http://localhost:5000/api/bookings/my
Authorization: Bearer <student-token>

# Create Booking (Student)
POST http://localhost:5000/api/bookings
Authorization: Bearer <student-token>
Content-Type: application/json

{
  "scheduleId": "schedule-id-here",
  "seatNumber": "4A"
}

# Get Booked Seats for Schedule
GET http://localhost:5000/api/bookings/schedule/:scheduleId
Authorization: Bearer <token>
```

---

## 🐛 Common Issues & Solutions

### Issue: Backend won't start
**Solution:** 
- Check if MongoDB is running
- Verify .env file exists with correct MONGODB_URI
- Check if port 5000 is already in use

### Issue: Frontend can't connect to backend
**Solution:**
- Verify backend is running on port 5000
- Check REACT_APP_API_URL in frontend/.env
- Check browser console for CORS errors

### Issue: Login fails with "Invalid credentials"
**Solution:**
- Verify user exists in database
- Check password is correct
- Verify role matches (student, driver, admin, parent)

### Issue: Protected routes redirect to login
**Solution:**
- Check if token exists in localStorage
- Verify token is not expired
- Check if user role matches allowed roles

### Issue: Admin routes show "Unauthorized"
**Solution:**
- Verify you're logged in as admin
- Check token in localStorage
- Verify backend auth middleware is working

---

## 📊 Database Verification

Check your MongoDB database:

```bash
# Connect to MongoDB
mongo

# Use the database
use rideuet

# Check collections
show collections

# View users
db.users.find().pretty()

# View buses
db.buses.find().pretty()

# View schedules
db.schedules.find().pretty()

# View bookings
db.bookings.find().pretty()
```

---

## ✨ Features Implemented

### ✅ Completed Features
- [x] Login, Register, Forgot Password pages
- [x] Role-based authentication (student, driver, admin, parent)
- [x] Admin Dashboard with tabs (Analytics, Management, Broadcast)
- [x] Admin Bus Management (CRUD)
- [x] Admin Route Management (CRUD)
- [x] Admin Schedule Management (CRUD)
- [x] Admin User Management (View)
- [x] Student Dashboard with live tracking
- [x] Student Seat Booking with faculty row restrictions
- [x] Driver Dashboard (dark mode)
- [x] Driver Hold-to-Confirm button
- [x] Parent Tracking View with status stepper
- [x] Responsive design (mobile-first)
- [x] SwiftUET branding and theme
- [x] Protected routes with role-based access

### 🚧 Pending Features
- [ ] Actual GPS tracking integration
- [ ] Twilio SMS integration for broadcasts
- [ ] Real-time notifications (WebSocket/Socket.io)
- [ ] Chart.js integration for analytics
- [ ] User profile editing
- [ ] Password reset functionality
- [ ] Email notifications
- [ ] Push notifications

---

## 🎨 Design System

### Colors
- **Deep Academic Navy:** `#0F172A` (backgrounds, text)
- **Transit Yellow:** `#F59E0B` (accents, CTAs)
- **Teal:** `#06B6D4` (highlights, active states)

### Typography
- Font Family: Inter, system-ui, sans-serif
- Minimum touch target: 48px (thumb-friendly)

### Components
- All interactive elements have smooth transitions
- High contrast for readability
- Mobile-first responsive design

---

## 📝 Notes

- The backend uses inline routes in server.js for some endpoints. These should be migrated to modular route files for better organization.
- Faculty rows (1-3) are hardcoded in the seat booking modal. This could be made configurable per schedule.
- The hold-to-confirm button duration is set to 2 seconds. This can be adjusted in DriverDashboard.js.
- Auto-refresh interval for parent tracking is 15 seconds. This can be adjusted in ParentTracking.js.

---

## 🤝 Support

If you encounter any issues:
1. Check the browser console for errors
2. Check the backend terminal for server errors
3. Verify all environment variables are set correctly
4. Ensure MongoDB is running and accessible
5. Clear browser cache and localStorage if needed

---

**Happy Testing! 🚀**
