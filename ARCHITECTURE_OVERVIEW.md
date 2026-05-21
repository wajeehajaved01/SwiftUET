# SwiftUET - Architecture Overview

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                      │
│                     http://localhost:3000                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Student    │  │    Driver    │  │    Admin     │      │
│  │  Dashboard   │  │  Dashboard   │  │  Dashboard   │      │
│  │              │  │  (Dark Mode) │  │   (Tabs)     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    Parent    │  │    Login     │  │   Register   │      │
│  │   Tracking   │  │     Page     │  │     Page     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │           AuthContext (JWT Token Management)        │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │         API Service (Axios with Interceptors)       │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            │ HTTP/REST API
                            │ Authorization: Bearer <token>
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                    BACKEND (Express.js)                      │
│                   http://localhost:5000                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Middleware Layer                        │    │
│  │  ┌──────────────┐  ┌──────────────┐                │    │
│  │  │     CORS     │  │     Auth     │                │    │
│  │  │   Helmet     │  │  Validation  │                │    │
│  │  └──────────────┘  └──────────────┘                │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                  Route Layer                         │    │
│  │                                                       │    │
│  │  /api/auth          → auth.routes.js                │    │
│  │  /api/users         → user.routes.js                │    │
│  │  /api/admin         → admin.routes.js               │    │
│  │  /api/buses         → bus.routes.js                 │    │
│  │  /api/routes        → route.routes.js               │    │
│  │  /api/schedules     → schedule.routes.js            │    │
│  │  /api/bookings      → booking.routes.js             │    │
│  │  /api/notifications → notification.routes.js        │    │
│  │  /api/locations     → location.routes.js            │    │
│  │                                                       │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │               Controller Layer                       │    │
│  │                                                       │    │
│  │  authController      adminController                │    │
│  │  userController      busController                  │    │
│  │  routeController     scheduleController             │    │
│  │  bookingController   notificationController         │    │
│  │  locationController                                  │    │
│  │                                                       │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                 Service Layer                        │    │
│  │                                                       │    │
│  │  notificationService (Twilio SMS Integration)       │    │
│  │                                                       │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            │ Mongoose ODM
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                    DATABASE (MongoDB)                        │
│                mongodb://localhost:27017/rideuet             │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    Users     │  │    Buses     │  │   Routes     │      │
│  │  Collection  │  │  Collection  │  │  Collection  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Schedules   │  │   Bookings   │  │ Notifications│      │
│  │  Collection  │  │  Collection  │  │  Collection  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────┐                                            │
│  │  Locations   │                                            │
│  │  Collection  │                                            │
│  └──────────────┘                                            │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 Authentication Flow

```
┌─────────────┐
│   Client    │
│  (Browser)  │
└──────┬──────┘
       │
       │ 1. POST /api/auth/login
       │    { email, password, role }
       │
       ▼
┌─────────────────────────────────────┐
│      Backend - Auth Controller      │
│                                     │
│  1. Validate credentials            │
│  2. Check user exists               │
│  3. Compare password (bcrypt)       │
│  4. Generate JWT token              │
│  5. Return token + user data        │
└──────┬──────────────────────────────┘
       │
       │ Response:
       │ {
       │   success: true,
       │   data: {
       │     token: "eyJ...",
       │     user: { ... }
       │   }
       │ }
       │
       ▼
┌─────────────────────────────────────┐
│    Client - AuthContext             │
│                                     │
│  1. Save token to localStorage      │
│  2. Save user to localStorage       │
│  3. Set auth state                  │
│  4. Redirect to dashboard           │
└──────┬──────────────────────────────┘
       │
       │ All subsequent requests:
       │ Authorization: Bearer <token>
       │
       ▼
┌─────────────────────────────────────┐
│   Backend - Auth Middleware         │
│                                     │
│  1. Extract token from header       │
│  2. Verify JWT signature            │
│  3. Decode user info                │
│  4. Attach to req.user              │
│  5. Call next()                     │
└─────────────────────────────────────┘
```

---

## 🛣️ Request Flow Example

### Example: Student Books a Seat

```
1. User Action
   └─> Click "Book Seat" button
       └─> Select seat number 15

2. Frontend (StudentDashboard.js)
   └─> Call API: POST /api/bookings
       └─> Body: { scheduleId, seatNumber: 15, pickupStopId, dropoffStopId }
       └─> Headers: { Authorization: Bearer <token> }

3. Backend (server.js)
   └─> Route: app.use('/api/bookings', bookingRoutes)

4. Route File (booking.routes.js)
   └─> Match: POST /
       └─> Middleware: authenticate
           └─> Verify JWT token
           └─> Attach user to req.user
       └─> Middleware: authorize('student')
           └─> Check req.user.role === 'student'
       └─> Middleware: validateBooking
           └─> Validate request body
       └─> Controller: bookingController.createBooking

5. Controller (bookingController.js)
   └─> Validate schedule exists
   └─> Check booking time (30 mins before)
   └─> Check for duplicate bookings
   └─> Check seat availability
   └─> Validate faculty row restrictions
   └─> Create booking in database
   └─> Update available seats
   └─> Send notification to parent
   └─> Return success response

6. Database (MongoDB)
   └─> Insert into Bookings collection
   └─> Update Schedule document

7. Response to Frontend
   └─> { success: true, data: { booking } }

8. Frontend Updates
   └─> Show success message
   └─> Refresh bookings list
   └─> Update UI
```

---

## 📊 Data Models

### User Model
```javascript
{
  email: String (unique),
  password: String (hashed),
  firstName: String,
  lastName: String,
  role: Enum ['student', 'driver', 'admin', 'parent'],
  phoneNumber: String,
  isFaculty: Boolean,
  parentId: ObjectId (ref: User),
  studentIds: [ObjectId] (ref: User),
  isActive: Boolean
}
```

### Bus Model
```javascript
{
  busNumber: String (unique),
  capacity: Number,
  route: String,
  driverName: String,
  status: Enum ['active', 'inactive'],
  driver: ObjectId (ref: User)
}
```

### Schedule Model
```javascript
{
  busId: ObjectId (ref: Bus),
  routeId: ObjectId (ref: Route),
  driverId: ObjectId (ref: User),
  date: String (YYYY-MM-DD),
  departureTime: Date,
  arrivalTime: Date,
  status: Enum ['scheduled', 'in-progress', 'completed', 'cancelled'],
  availableSeats: Number,
  facultyRowsLocked: Boolean
}
```

### Booking Model
```javascript
{
  studentId: ObjectId (ref: User),
  scheduleId: ObjectId (ref: Schedule),
  seatNumber: Number,
  status: Enum ['confirmed', 'cancelled', 'completed', 'no-show', 'picked-up'],
  pickupStopId: ObjectId,
  dropoffStopId: ObjectId,
  pickedUpAt: Date,
  cancelledAt: Date
}
```

---

## 🔒 Authorization Matrix

| Route | Public | Student | Driver | Admin | Parent |
|-------|--------|---------|--------|-------|--------|
| GET /api/buses | ✅ | ✅ | ✅ | ✅ | ✅ |
| POST /api/buses | ❌ | ❌ | ❌ | ✅ | ❌ |
| GET /api/schedules | ✅ | ✅ | ✅ | ✅ | ✅ |
| POST /api/schedules | ❌ | ❌ | ❌ | ✅ | ❌ |
| POST /api/bookings | ❌ | ✅ | ❌ | ❌ | ❌ |
| GET /api/bookings/my-bookings | ❌ | ✅ | ❌ | ❌ | ❌ |
| PATCH /api/bookings/:id/pickup | ❌ | ❌ | ✅ | ✅ | ❌ |
| GET /api/users | ❌ | ❌ | ❌ | ✅ | ❌ |
| GET /api/admin/dashboard | ❌ | ❌ | ❌ | ✅ | ❌ |
| POST /api/admin/broadcast | ❌ | ❌ | ❌ | ✅ | ❌ |

---

## 🎨 Frontend Component Hierarchy

```
App.js
├── AuthContext.Provider
│   ├── Routes
│   │   ├── / (Login)
│   │   ├── /register (Register)
│   │   ├── /forgot-password (ForgotPassword)
│   │   │
│   │   ├── Protected Routes (with Navbar)
│   │   │   ├── /student/dashboard (StudentDashboard)
│   │   │   │   ├── Live Map (Leaflet)
│   │   │   │   ├── Available Schedules
│   │   │   │   ├── SeatBookingModal
│   │   │   │   └── Booking History
│   │   │   │
│   │   │   ├── /driver/dashboard (DriverDashboard)
│   │   │   │   ├── Route Map
│   │   │   │   ├── Student Manifest
│   │   │   │   └── Hold-to-Confirm Button
│   │   │   │
│   │   │   ├── /admin/dashboard (AdminDashboard)
│   │   │   │   ├── AnalyticsTab
│   │   │   │   ├── ManagementTab
│   │   │   │   └── BroadcastTab
│   │   │   │
│   │   │   └── /parent/tracking (ParentTracking)
│   │   │       ├── Status Stepper
│   │   │       ├── Live Map
│   │   │       └── Notification Log
│   │   │
│   │   └── Navbar (role-based)
```

---

## 🔄 State Management

### AuthContext
```javascript
{
  user: {
    userId: String,
    email: String,
    firstName: String,
    lastName: String,
    role: String,
    phoneNumber: String,
    isFaculty: Boolean
  },
  token: String,
  loading: Boolean,
  login: Function,
  logout: Function
}
```

### Local Storage
```javascript
{
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  user: "{\"userId\":\"...\",\"email\":\"...\"}"
}
```

---

## 🌐 API Endpoints Summary

### Authentication (3 routes)
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout

### Users (7 routes)
- GET /api/users/me
- PUT /api/users/me
- GET /api/users
- GET /api/users/:userId
- PUT /api/users/:userId
- DELETE /api/users/:userId
- POST /api/users/:userId/link-parent

### Admin (6 routes)
- GET /api/admin/dashboard
- POST /api/admin/assign-driver
- POST /api/admin/toggle-faculty-rows
- POST /api/admin/broadcast
- GET /api/admin/broadcast-history
- GET /api/admin/analytics

### Buses (5 routes)
- GET /api/buses
- GET /api/buses/:busId
- POST /api/buses
- PUT /api/buses/:busId
- DELETE /api/buses/:busId

### Routes (5 routes)
- GET /api/routes
- GET /api/routes/:routeId
- POST /api/routes
- PUT /api/routes/:routeId
- DELETE /api/routes/:routeId

### Schedules (6 routes)
- GET /api/schedules
- GET /api/schedules/:scheduleId
- POST /api/schedules
- PUT /api/schedules/:scheduleId
- DELETE /api/schedules/:scheduleId
- PUT /api/schedules/:scheduleId/status

### Bookings (6 routes)
- POST /api/bookings
- GET /api/bookings/my-bookings
- DELETE /api/bookings/:bookingId
- GET /api/bookings
- GET /api/bookings/schedule/:scheduleId
- PATCH /api/bookings/:id/pickup

### Notifications (2 routes)
- GET /api/notifications/my-notifications
- POST /api/notifications/broadcast

### Locations (3 routes)
- GET /api/locations/bus/:busId
- GET /api/locations/schedule/:scheduleId
- POST /api/locations/update

**Total: 43 API Endpoints**

---

## 🎯 Key Features

### Security
✅ JWT-based authentication
✅ Role-based authorization
✅ Password hashing (bcrypt)
✅ Input validation
✅ CORS protection
✅ Helmet security headers

### Performance
✅ Database indexing
✅ Pagination support
✅ Efficient queries
✅ Mongoose population

### User Experience
✅ Responsive design
✅ Role-based dashboards
✅ Real-time updates
✅ Mobile-friendly
✅ Dark mode (driver)

### Code Quality
✅ Modular architecture
✅ Separation of concerns
✅ Error handling
✅ Consistent API responses
✅ Clean code structure

---

## 📈 Scalability Considerations

### Current Architecture
- Monolithic backend (Express.js)
- Single MongoDB instance
- Client-side rendering (React)

### Future Enhancements
- Microservices architecture
- Redis caching layer
- WebSocket for real-time updates
- Load balancing
- CDN for static assets
- MongoDB replica sets
- Docker containerization
- Kubernetes orchestration

---

## 🎉 Summary

**SwiftUET is a complete, production-ready university bus management system with:**

✅ 43 API endpoints
✅ 4 role-based dashboards
✅ JWT authentication
✅ Role-based authorization
✅ Real-time tracking
✅ Seat booking system
✅ Notification system
✅ Responsive design
✅ Complete documentation

**Ready to deploy and use! 🚀**
