# 🚌 SwiftUET - Smart University Bus Management System

A comprehensive, modern bus management system designed for university campuses with role-based dashboards for Students, Drivers, Admins, and Parents.

![SwiftUET](https://img.shields.io/badge/SwiftUET-v1.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-v14+-green)
![React](https://img.shields.io/badge/React-v18-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-v4+-green)

---

## 🎯 Features

### 👨‍🎓 Student Portal
- **Live Bus Tracking** - Real-time location tracking with interactive maps
- **Smart Seat Booking** - Visual seat selection with faculty row restrictions
- **Delay Alerts** - Proactive notifications for schedule changes
- **Boarding History** - Complete ride history organized by month

### 🚗 Driver Dashboard
- **Dark Mode Interface** - Distraction-free, dashboard-mounted design
- **Live Navigation** - Route visualization with next stop information
- **Student Manifest** - Real-time pickup status tracking
- **Hold-to-Confirm** - Safety feature preventing accidental taps

### 👨‍💼 Admin Panel
- **Analytics Dashboard** - Comprehensive ridership statistics
- **Bus Management** - CRUD operations for fleet management
- **Route Management** - Create and manage routes with multiple stops
- **Schedule Management** - Create, update, and monitor schedules
- **User Management** - View and filter all system users
- **Emergency Broadcast** - SMS notifications via Twilio integration

### 👨‍👩‍👧 Parent Tracking
- **Live Location** - Real-time bus tracking on map
- **Status Stepper** - Visual journey progress (Waiting → In Transit → Arrived)
- **Notification Log** - Timestamped updates and alerts
- **Auto-Refresh** - Automatic updates every 15 seconds

---

## 🏗️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **Leaflet.js** - Interactive maps
- **CSS Variables** - Consistent theming

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcrypt** - Password hashing

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd RideUET
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Install frontend dependencies**
```bash
cd frontend
npm install
```

4. **Configure environment variables**

Backend `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rideuet
JWT_SECRET=your-secret-key
NODE_ENV=development
```

Frontend `.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

5. **Start the application**

Terminal 1 - Backend:
```bash
cd backend
npm start
```

Terminal 2 - Frontend:
```bash
cd frontend
npm start
```

6. **Access the application**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

---

## 📚 Documentation

- **[START_PROJECT.md](START_PROJECT.md)** - Quick start guide
- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Comprehensive testing instructions
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Technical implementation details
- **[FEATURE_STATUS.md](FEATURE_STATUS.md)** - Feature completion status

---

## 🎨 Design System

### Color Palette
- **Deep Academic Navy** (`#0F172A`) - Primary background and text
- **Transit Yellow** (`#F59E0B`) - Accent color for CTAs
- **Teal** (`#06B6D4`) - Highlights and active states

### Design Principles
- **Mobile-First** - Responsive design optimized for all devices
- **Thumb-Friendly** - Minimum 48px touch targets
- **High Contrast** - Accessible color combinations
- **Smooth Transitions** - Polished user experience

---

## 🔐 Authentication & Authorization

### Roles
- **Student** - Book seats, track buses, view history
- **Driver** - Manage pickups, view manifest, navigate routes
- **Admin** - Full system access, manage all resources
- **Parent** - Track student's bus in real-time

### Security Features
- JWT-based authentication
- Role-based access control (RBAC)
- Protected API endpoints
- Password hashing with bcrypt
- Token expiration and refresh

---

## 📊 API Endpoints

### Authentication
```
POST /api/auth/register - Register new user
POST /api/auth/login - Login user
POST /api/auth/logout - Logout user
```

### Admin (Protected)
```
GET  /api/admin/dashboard - Dashboard statistics
POST /api/admin/assign-driver - Assign driver to bus
POST /api/admin/toggle-faculty-rows - Lock/unlock faculty rows
POST /api/admin/broadcast - Send broadcast notification
GET  /api/admin/analytics - Get analytics data
```

### Buses (Protected)
```
GET    /api/buses - Get all buses
POST   /api/buses - Create bus (Admin)
DELETE /api/buses/:id - Delete bus (Admin)
```

### Routes (Protected)
```
GET    /api/routes - Get all routes
POST   /api/routes - Create route (Admin)
DELETE /api/routes/:id - Delete route (Admin)
```

### Schedules (Protected)
```
GET   /api/schedules - Get all schedules
GET   /api/schedules/today - Get today's schedules
POST  /api/schedules - Create schedule (Admin)
PATCH /api/schedules/:id/status - Update status (Admin)
```

### Bookings (Protected)
```
GET    /api/bookings/my - Get user's bookings
POST   /api/bookings - Create booking
PATCH  /api/bookings/:id/status - Update booking status
DELETE /api/bookings/:id - Cancel booking
```

---

## 🗂️ Project Structure

```
RideUET/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Auth, validation, error handling
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Utility functions
│   │   └── server.js        # Entry point
│   ├── .env                 # Environment variables
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   ├── admin/       # Admin-specific components
│   │   │   ├── common/      # Shared components
│   │   │   └── student/     # Student-specific components
│   │   ├── contexts/        # React contexts (Auth)
│   │   ├── pages/           # Page components
│   │   │   ├── admin/       # Admin pages
│   │   │   ├── driver/      # Driver pages
│   │   │   ├── parent/      # Parent pages
│   │   │   └── student/     # Student pages
│   │   ├── services/        # API services
│   │   ├── App.js           # Main app component
│   │   ├── App.css          # Global styles
│   │   └── index.css        # Theme variables
│   ├── .env                 # Environment variables
│   └── package.json
│
├── docs/                    # Documentation
├── README.md                # This file
├── START_PROJECT.md         # Quick start guide
├── TESTING_GUIDE.md         # Testing instructions
└── IMPLEMENTATION_SUMMARY.md # Technical details
```

---

## ✅ Completed Features

- [x] User authentication and authorization
- [x] Role-based dashboards (Student, Driver, Admin, Parent)
- [x] Admin bus management (CRUD)
- [x] Admin route management (CRUD)
- [x] Admin schedule management (CRUD)
- [x] Admin user management (View)
- [x] Student seat booking with faculty restrictions
- [x] Driver dashboard with hold-to-confirm
- [x] Parent tracking with status stepper
- [x] Responsive design (mobile-first)
- [x] Protected routes with role-based access
- [x] SwiftUET branding and theme

---

## 🚧 Pending Features

- [ ] Real-time GPS tracking integration
- [ ] Twilio SMS integration for broadcasts
- [ ] WebSocket for live notifications
- [ ] Chart.js for analytics visualization
- [ ] User profile editing
- [ ] Password reset functionality
- [ ] Email notifications
- [ ] Push notifications
- [ ] Booking history export
- [ ] Advanced analytics and reporting

---

## 🧪 Testing

Run the test suite:
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

For comprehensive testing instructions, see [TESTING_GUIDE.md](TESTING_GUIDE.md)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👥 Team

- **Project Lead** - University of Engineering and Technology
- **Development Team** - SwiftUET Development Team

---

## 📞 Support

For support, email support@swiftuet.com or open an issue in the repository.

---

## 🙏 Acknowledgments

- University of Engineering and Technology for project sponsorship
- All contributors and testers
- Open source community for amazing tools and libraries

---

**Built with ❤️ for UET Community**

---

## 📈 Version History

### v1.0.0 (Current)
- Initial release
- Complete authentication system
- Role-based dashboards
- Admin management panel
- Student booking system
- Driver interface
- Parent tracking

---

**Last Updated:** May 19, 2026
