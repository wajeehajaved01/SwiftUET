# SwiftUET - How to Run and Test

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (running locally or MongoDB Atlas)
- Git

---

## 📦 Installation

### 1. Install Backend Dependencies
```cmd
cd backend
npm install
```

### 2. Install Frontend Dependencies
```cmd
cd frontend
npm install
```

---

## ⚙️ Configuration

### Backend Environment Variables
Create `backend/.env` file:
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/rideuet

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Twilio (Optional - for SMS notifications)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number
```

### Frontend Environment Variables
Create `frontend/.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🏃 Running the Application

### Option 1: Run Both Servers Separately (Recommended for Development)

#### Terminal 1 - Backend Server
```cmd
cd backend
npm run dev
```
✅ Backend will run on: `http://localhost:5000`

#### Terminal 2 - Frontend Server
```cmd
cd frontend
npm start
```
✅ Frontend will run on: `http://localhost:3000`

### Option 2: Production Mode

#### Backend
```cmd
cd backend
npm start
```

#### Frontend
```cmd
cd frontend
npm run build
```

---

## 🧪 Testing the Application

### 1. Test Backend API Health
Open browser or use curl:
```cmd
curl http://localhost:5000/api/health
```
Expected response:
```json
{
  "status": "RideUET backend running!"
}
```

### 2. Test User Registration
```cmd
curl -X POST http://localhost:5000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"firstName\":\"John\",\"lastName\":\"Doe\",\"email\":\"john@uet.edu.pk\",\"password\":\"password123\",\"phoneNumber\":\"+923001234567\",\"role\":\"student\"}"
```

### 3. Test User Login
```cmd
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"john@uet.edu.pk\",\"password\":\"password123\",\"role\":\"student\"}"
```

Save the token from the response!

### 4. Test Protected Routes
Replace `YOUR_TOKEN_HERE` with the token from login:
```cmd
curl http://localhost:5000/api/users/me ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🎯 Testing Each Feature

### A. Student Features

#### 1. View Available Schedules
- Navigate to: `http://localhost:3000/student/dashboard`
- Login with student credentials
- Check "Available Schedules" section

#### 2. Book a Seat
- Click "Book Seat" on any schedule
- Select a seat from the grid (rows 4-10 for students)
- Confirm booking
- Check "My Bookings" section

#### 3. View Live Tracking
- Check the map on dashboard
- Should show bus location (if driver is active)

### B. Driver Features

#### 1. View Student Manifest
- Navigate to: `http://localhost:3000/driver/dashboard`
- Login with driver credentials
- See list of students to pick up

#### 2. Mark Student as Picked Up
- Hold the "Mark as Picked Up" button for 3 seconds
- Student status should change to "Picked Up"

### C. Admin Features

#### 1. View Dashboard Analytics
- Navigate to: `http://localhost:3000/admin/dashboard`
- Login with admin credentials
- Check Analytics tab for metrics

#### 2. Create New Bus
- Go to Management tab
- Fill in bus details:
  - Bus Number: UET-001
  - Capacity: 40
  - Route: Main Campus ↔ KSK
  - Driver Name: Ali Khan
- Click "Add Bus"

#### 3. Create New Schedule
- Go to Management tab
- Fill in schedule details:
  - Select Bus
  - Date: Today's date
  - Departure Time: 08:00 AM
  - Route: Main Campus ↔ KSK
- Click "Create Schedule"

#### 4. Assign Driver to Bus
- Go to Management tab
- Select driver from dropdown
- Select bus from dropdown
- Click "Assign Driver"

#### 5. Send Broadcast Notification
- Go to Broadcast tab
- Type emergency message
- Select target audience (All/Students/Drivers)
- Click "Broadcast Alert"

### D. Parent Features

#### 1. Track Student
- Navigate to: `http://localhost:3000/parent/tracking`
- Login with parent credentials
- View student's current status
- Check live map for bus location

---

## 🔍 API Testing with Postman/Thunder Client

### Import Collection
Create a new collection with these requests:

#### 1. Register User
```
POST http://localhost:5000/api/auth/register
Body (JSON):
{
  "firstName": "Admin",
  "lastName": "User",
  "email": "admin@uet.edu.pk",
  "password": "admin123",
  "phoneNumber": "+923001234567",
  "role": "admin"
}
```

#### 2. Login
```
POST http://localhost:5000/api/auth/login
Body (JSON):
{
  "email": "admin@uet.edu.pk",
  "password": "admin123",
  "role": "admin"
}
```

#### 3. Get All Users (Admin)
```
GET http://localhost:5000/api/users
Headers:
Authorization: Bearer YOUR_TOKEN_HERE
```

#### 4. Get Users by Role
```
GET http://localhost:5000/api/users?role=student
Headers:
Authorization: Bearer YOUR_TOKEN_HERE
```

#### 5. Get Admin Dashboard
```
GET http://localhost:5000/api/admin/dashboard
Headers:
Authorization: Bearer YOUR_TOKEN_HERE
```

#### 6. Create Bus
```
POST http://localhost:5000/api/buses
Headers:
Authorization: Bearer YOUR_TOKEN_HERE
Body (JSON):
{
  "busNumber": "UET-001",
  "capacity": 40,
  "route": "Main Campus ↔ KSK",
  "driverName": "Ali Khan",
  "status": "active"
}
```

#### 7. Create Schedule
```
POST http://localhost:5000/api/schedules
Headers:
Authorization: Bearer YOUR_TOKEN_HERE
Body (JSON):
{
  "busId": "PASTE_BUS_ID_HERE",
  "date": "2026-05-20",
  "departureTime": "2026-05-20T08:00:00Z",
  "arrivalTime": "2026-05-20T09:00:00Z",
  "route": "Main Campus ↔ KSK"
}
```

#### 8. Create Booking (Student)
```
POST http://localhost:5000/api/bookings
Headers:
Authorization: Bearer STUDENT_TOKEN_HERE
Body (JSON):
{
  "scheduleId": "PASTE_SCHEDULE_ID_HERE",
  "seatNumber": 15,
  "pickupStopId": "PASTE_STOP_ID_HERE",
  "dropoffStopId": "PASTE_STOP_ID_HERE"
}
```

#### 9. Get Bookings for Schedule
```
GET http://localhost:5000/api/bookings/schedule/SCHEDULE_ID_HERE
Headers:
Authorization: Bearer YOUR_TOKEN_HERE
```

#### 10. Mark Student as Picked Up (Driver)
```
PATCH http://localhost:5000/api/bookings/BOOKING_ID_HERE/pickup
Headers:
Authorization: Bearer DRIVER_TOKEN_HERE
```

---

## 🐛 Troubleshooting

### Backend Issues

#### MongoDB Connection Error
```
❌ MongoDB Error: connect ECONNREFUSED
```
**Solution:**
1. Make sure MongoDB is running
2. Check MONGODB_URI in `.env`
3. For Windows: Start MongoDB service
   ```cmd
   net start MongoDB
   ```

#### Port Already in Use
```
❌ Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:**
1. Kill the process using port 5000
   ```cmd
   netstat -ano | findstr :5000
   taskkill /PID <PID_NUMBER> /F
   ```
2. Or change PORT in `.env`

### Frontend Issues

#### API Connection Error
```
❌ Network Error
```
**Solution:**
1. Make sure backend is running on port 5000
2. Check REACT_APP_API_URL in `frontend/.env`
3. Clear browser cache and reload

#### Module Not Found
```
❌ Module not found: Can't resolve 'leaflet'
```
**Solution:**
```cmd
cd frontend
npm install leaflet react-leaflet
```

---

## ✅ Verification Checklist

### Backend Verification
- [ ] MongoDB connected successfully
- [ ] Server running on port 5000
- [ ] `/api/health` returns success
- [ ] User registration works
- [ ] User login returns token
- [ ] Protected routes require authentication
- [ ] Admin routes require admin role

### Frontend Verification
- [ ] React app loads on port 3000
- [ ] Login page displays correctly
- [ ] Can register new user
- [ ] Can login with credentials
- [ ] Redirects to correct dashboard based on role
- [ ] Navbar shows user info
- [ ] Can logout successfully

### Feature Verification
- [ ] Student can view schedules
- [ ] Student can book seats
- [ ] Faculty rows (1-3) are locked for students
- [ ] Driver can see student manifest
- [ ] Driver can mark students as picked up
- [ ] Admin can view dashboard statistics
- [ ] Admin can create buses and schedules
- [ ] Admin can send broadcast notifications
- [ ] Parent can track student location

---

## 📊 Database Seeding (Optional)

To populate the database with test data:

```cmd
cd backend
node scripts/seedTestData.js
```

This will create:
- 5 Admin users
- 50 Student users
- 10 Driver users
- 5 Parent users
- 8 Buses
- 5 Routes
- 20 Schedules
- 100 Bookings

---

## 🎨 UI Testing

### Responsive Design
Test on different screen sizes:
- Desktop: 1920x1080
- Tablet: 768x1024
- Mobile: 375x667

### Browser Compatibility
Test on:
- Chrome (recommended)
- Firefox
- Edge
- Safari

### Dark Mode (Driver Dashboard)
- Navigate to driver dashboard
- Verify dark theme is applied
- Check readability of all text

---

## 📝 Test User Credentials

After seeding, you can use these credentials:

### Admin
- Email: `admin@uet.edu.pk`
- Password: `admin123`

### Student
- Email: `student1@uet.edu.pk`
- Password: `student123`

### Driver
- Email: `driver1@uet.edu.pk`
- Password: `driver123`

### Parent
- Email: `parent1@uet.edu.pk`
- Password: `parent123`

---

## 🚀 Next Steps

1. **Test all API endpoints** using Postman/Thunder Client
2. **Test all UI features** in the browser
3. **Check responsive design** on mobile devices
4. **Verify authentication** and authorization
5. **Test error handling** (wrong credentials, invalid data)
6. **Check real-time features** (live tracking, notifications)
7. **Test Twilio integration** (if configured)

---

## 📞 Support

If you encounter any issues:
1. Check the console logs (both frontend and backend)
2. Verify environment variables are set correctly
3. Ensure MongoDB is running
4. Check network connectivity
5. Review the error messages carefully

---

## ✨ Success Indicators

You'll know everything is working when:
- ✅ Backend shows "MongoDB Connected" and "RideUET backend running"
- ✅ Frontend loads without errors
- ✅ You can register and login
- ✅ Dashboard shows correct data based on role
- ✅ All CRUD operations work
- ✅ Real-time features update correctly
- ✅ No console errors in browser or terminal

**Happy Testing! 🎉**
