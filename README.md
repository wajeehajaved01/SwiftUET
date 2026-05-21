# 🚌 SwiftUET - Smart University Bus Management System

> A comprehensive, role-based bus management system for UET Lahore with real-time tracking, seat booking, and automated notifications.

[![Status](https://img.shields.io/badge/status-complete-success)]()
[![Backend](https://img.shields.io/badge/backend-Express.js-green)]()
[![Frontend](https://img.shields.io/badge/frontend-React-blue)]()
[![Database](https://img.shields.io/badge/database-MongoDB-brightgreen)]()

---

## ✨ Features

### 🎓 For Students
- **Live Bus Tracking** - Real-time location tracking on interactive map
- **Seat Booking** - Visual seat selection with faculty row restrictions
- **Booking History** - View past and upcoming rides
- **Delay Alerts** - Proactive notifications for schedule changes

### 🚗 For Drivers
- **Dark Mode Dashboard** - Optimized for dashboard mounting
- **Student Manifest** - List of students to pick up
- **Hold-to-Confirm** - Safety feature for marking pickups
- **Route Navigation** - Clear next stop information

### 👨‍💼 For Admins
- **Analytics Dashboard** - Real-time statistics and metrics
- **Fleet Management** - Create and manage buses, routes, schedules
- **Driver Assignment** - Assign drivers to buses
- **Emergency Broadcast** - Send SMS alerts via Twilio

### 👨‍👩‍👧 For Parents
- **Live Tracking** - Monitor student's bus location
- **Status Updates** - Visual progress stepper
- **Notification Log** - Historical updates with timestamps

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB
- npm or yarn

### Installation

```bash
# Clone repository
git clone <repository-url>
cd RideUET

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Configuration

**Backend (.env):**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rideuet
JWT_SECRET=your-secret-key
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=your-twilio-number
```

**Frontend (.env):**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Run Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### Seed Real UET Route Data (Optional but Recommended)

Populate your database with actual UET New Campus routes:
```bash
cd backend
node scripts/seedUETRoutes.js
```

This will create:
- 15 real UET routes with stops and timings
- 15 driver accounts (driver01@uet.edu.pk to driver15@uet.edu.pk, password: driver123)
- 15 buses with actual vehicle numbers
- 105 schedules for the next 7 days

See [UET_ROUTES_SEEDING_GUIDE.md](UET_ROUTES_SEEDING_GUIDE.md) for details.

**Access:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- API Health: http://localhost:5000/api/health

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [START_HERE.md](START_HERE.md) | **Start here!** Quick start guide |
| [QUICK_TEST_GUIDE.md](QUICK_TEST_GUIDE.md) | Quick reference for testing |
| [HOW_TO_RUN_AND_TEST.md](HOW_TO_RUN_AND_TEST.md) | Comprehensive testing guide |
| [UET_ROUTES_SEEDING_GUIDE.md](UET_ROUTES_SEEDING_GUIDE.md) | **Seed real UET route data** |
| [API_ROUTES_COMPLETE.md](API_ROUTES_COMPLETE.md) | Complete API reference |
| [REQUESTED_ROUTES_STATUS.md](REQUESTED_ROUTES_STATUS.md) | Status of requested routes |
| [ARCHITECTURE_OVERVIEW.md](ARCHITECTURE_OVERVIEW.md) | System architecture |
| [IMPLEMENTATION_COMPLETE.md](IMPLEMENTATION_COMPLETE.md) | Implementation summary |
| [FINAL_DEPLOYMENT_CHECKLIST.md](FINAL_DEPLOYMENT_CHECKLIST.md) | Pre-deployment checklist |

---

## 🏗️ Architecture

```
Frontend (React) ←→ Backend (Express.js) ←→ Database (MongoDB)
     ↓                      ↓                       ↓
  - Dashboards         - REST API              - Collections
  - Components         - Controllers           - Models
  - Services           - Middleware            - Indexes
  - Context            - Routes
```

---

## 🔐 Authentication

- **Method:** JWT (JSON Web Tokens)
- **Storage:** localStorage
- **Expiry:** 7 days
- **Roles:** Student, Driver, Admin, Parent

---

## 📊 API Endpoints

### Core Routes (9 Requested)
✅ `GET /api/users` - Get all users (admin)
✅ `GET /api/users?role=student` - Filter by role (admin)
✅ `GET /api/admin/dashboard` - Dashboard stats (admin)
✅ `GET /api/buses` - Get all buses (public)
✅ `POST /api/buses` - Create bus (admin)
✅ `GET /api/schedules` - Get all schedules (public)
✅ `POST /api/schedules` - Create schedule (admin)
✅ `POST /api/bookings` - Create booking (student)
✅ `GET /api/bookings/schedule/:id` - Get bookings (admin/driver)

### Additional Routes
✅ `GET /api/bookings/my-bookings` - My bookings (student)
✅ `PATCH /api/bookings/:id/pickup` - Mark picked up (driver)
✅ Plus 30+ more endpoints

**Total: 43 API Endpoints**

See [API_ROUTES_COMPLETE.md](API_ROUTES_COMPLETE.md) for full list.

---

## 🎨 Tech Stack

### Frontend
- **Framework:** React 18
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Maps:** Leaflet.js
- **Styling:** Custom CSS with CSS Variables

### Backend
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT + bcrypt
- **Validation:** express-validator
- **SMS:** Twilio

### DevOps
- **Version Control:** Git
- **Package Manager:** npm
- **Development:** nodemon (backend), react-scripts (frontend)

---

## 📁 Project Structure

```
RideUET/
├── backend/
│   ├── src/
│   │   ├── config/          # Database, Twilio config
│   │   ├── controllers/     # Business logic
│   │   ├── middleware/      # Auth, validation, errors
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API routes
│   │   ├── services/        # External services
│   │   ├── utils/           # Helper functions
│   │   └── server.js        # Entry point
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── contexts/        # React contexts
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service
│   │   ├── App.js
│   │   └── index.js
│   ├── .env.example
│   └── package.json
└── docs/                    # Documentation
```

---

## 🧪 Testing

### Quick Test
```bash
# Test backend health
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@uet.edu.pk","password":"test123","phoneNumber":"+923001234567","role":"student"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@uet.edu.pk","password":"test123","role":"student"}'
```

See [QUICK_TEST_GUIDE.md](QUICK_TEST_GUIDE.md) for more tests.

---

## 🎯 Key Features Implemented

### Security
✅ JWT authentication
✅ Role-based authorization
✅ Password hashing (bcrypt)
✅ Input validation
✅ CORS protection
✅ Helmet security headers

### Functionality
✅ User management (CRUD)
✅ Bus management (CRUD)
✅ Route management (CRUD)
✅ Schedule management (CRUD)
✅ Booking system with seat selection
✅ Real-time location tracking
✅ SMS notifications (Twilio)
✅ Faculty row restrictions
✅ Driver pickup confirmation

### UI/UX
✅ Responsive design
✅ Role-based dashboards
✅ Dark mode (driver)
✅ Mobile-friendly
✅ SwiftUET branding
✅ Smooth animations
✅ Accessibility features

---

## 📈 Database Schema

### Collections
- **Users** - Students, drivers, admins, parents
- **Buses** - Fleet information
- **Routes** - Bus routes with stops
- **Schedules** - Daily bus schedules
- **Bookings** - Seat reservations
- **Notifications** - System notifications
- **Locations** - Real-time GPS data

See [docs/database-schema.md](docs/database-schema.md) for details.

---

## 🔒 Authorization Matrix

| Feature | Student | Driver | Admin | Parent |
|---------|---------|--------|-------|--------|
| View Schedules | ✅ | ✅ | ✅ | ✅ |
| Book Seat | ✅ | ❌ | ❌ | ❌ |
| Mark Pickup | ❌ | ✅ | ✅ | ❌ |
| Manage Fleet | ❌ | ❌ | ✅ | ❌ |
| Track Student | ❌ | ❌ | ❌ | ✅ |
| Send Broadcast | ❌ | ❌ | ✅ | ❌ |

---

## 🚦 Status

### ✅ Completed
- All 9 requested API routes
- 4 role-based dashboards
- Authentication & authorization
- Database models & schemas
- API documentation
- Testing guides

### 🎯 Ready for
- Production deployment
- User acceptance testing
- Integration testing
- Performance testing

---

## 📞 Support

### Getting Help
1. Check documentation files
2. Review console logs
3. Verify environment variables
4. Ensure MongoDB is running
5. Check port availability

### Common Issues
- **MongoDB Connection:** Ensure MongoDB is running
- **Port Conflict:** Change PORT in .env
- **API Errors:** Check token in Authorization header
- **Frontend Errors:** Verify REACT_APP_API_URL

---

## 🎉 Success Indicators

You'll know everything is working when:
- ✅ Backend shows "MongoDB Connected"
- ✅ Frontend loads without errors
- ✅ Can register and login
- ✅ Dashboard shows correct data
- ✅ All CRUD operations work
- ✅ Real-time features update

---

## 📝 License

This project is licensed under the ISC License.

---

## 👥 Contributors

- UET Lahore Development Team

---

## 🙏 Acknowledgments

- UET Lahore for project requirements
- Twilio for SMS integration
- Leaflet.js for mapping
- MongoDB for database
- React & Express.js communities

---

## 📧 Contact

For questions or support, please contact the development team.

---

**Built with ❤️ for UET Lahore**

**Status: ✅ Complete and Ready for Deployment**
