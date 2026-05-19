# RideUET Quick Start Guide

## 🚀 Get Up and Running in 5 Minutes

### Step 1: Install Prerequisites

1. **Node.js 18+**: Download from [nodejs.org](https://nodejs.org/)
2. **MongoDB**: Download from [mongodb.com](https://www.mongodb.com/try/download/community)
3. **Git**: Download from [git-scm.com](https://git-scm.com/)

### Step 2: Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd RideUET

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 3: Set Up MongoDB

**Windows:**
```bash
# Start MongoDB
mongod
```

**Mac/Linux:**
```bash
# Start MongoDB
sudo systemctl start mongod
```

### Step 4: Configure Environment

**Backend** - Create `backend/.env`:
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/rideuet
JWT_SECRET=your-secret-key-min-32-characters-long
JWT_EXPIRES_IN=7d

# Optional: Twilio (for SMS)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
```

**Frontend** - Create `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 5: Run the Application

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

### Step 6: Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/health

### Step 7: Create Your First Account

1. Go to http://localhost:3000
2. Click "Register here"
3. Fill in the form:
   - Email: your.email@uet.edu.pk
   - Password: (min 6 characters)
   - Phone: +923001234567
   - Role: Student (or Admin for full access)
4. Click "Register"
5. You'll be redirected to your dashboard

## 📁 Project Structure

```
RideUET/
├── backend/              # Node.js + Express API
│   ├── src/
│   │   ├── models/      # Mongoose models
│   │   ├── controllers/ # Request handlers
│   │   ├── routes/      # API routes
│   │   ├── middleware/  # Auth, validation, etc.
│   │   ├── services/    # Business logic
│   │   └── config/      # Configuration files
│   └── package.json
├── frontend/            # React application
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── contexts/    # React contexts
│   │   └── services/    # API calls
│   └── package.json
└── docs/               # Documentation
```

## 🎯 User Roles

### Student
- Book bus seats
- View schedules
- Track bus location
- View booking history

### Driver
- View assigned schedules
- Update bus location
- View passenger list
- Update trip status

### Admin
- Manage schedules
- Manage users
- Manage buses and routes
- Send notifications
- View all bookings

### Parent
- View children's bookings
- Receive SMS notifications
- Track children's rides

## 🔑 Key Features

### Seat Booking
- Real-time seat availability
- Faculty row reservation (rows 1-2)
- 30-minute advance booking required
- 1-hour cancellation policy

### Real-time Tracking
- Live bus location on map
- Route visualization with Leaflet.js
- ETA calculations

### SMS Notifications (Twilio)
- Booking confirmations
- Trip start/completion alerts
- Schedule change notifications
- Emergency alerts

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Schedules
- `GET /api/schedules` - Get all schedules
- `GET /api/schedules/:id` - Get schedule details
- `POST /api/schedules` - Create schedule (Admin)

### Bookings
- `POST /api/bookings` - Create booking (Student)
- `GET /api/bookings/my-bookings` - Get my bookings
- `DELETE /api/bookings/:id` - Cancel booking

### Locations
- `GET /api/locations/bus/:busId` - Get bus location
- `POST /api/locations/update` - Update location (Driver)

See [docs/api.md](docs/api.md) for complete API documentation.

## 🛠️ Development Commands

### Backend
```bash
npm run dev      # Start development server
npm start        # Start production server
npm test         # Run tests
```

### Frontend
```bash
npm start        # Start development server
npm run build    # Build for production
npm test         # Run tests
```

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Start MongoDB with `mongod`

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: 
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill
```

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution**: Verify `FRONTEND_URL` in backend `.env` matches your frontend URL

### JWT Token Error
```
Error: Invalid token
```
**Solution**: Clear browser localStorage and login again

## 📖 Next Steps

1. **Read Documentation**:
   - [Development Guide](docs/development.md)
   - [Database Schema](docs/database-schema.md)
   - [Deployment Guide](docs/deployment.md)

2. **Explore Features**:
   - Create test data (buses, routes, schedules)
   - Test booking flow
   - Try different user roles

3. **Customize**:
   - Update branding and colors
   - Add new features
   - Integrate additional services

## 🚀 Deploy to Production

### Quick Deploy

**Frontend (Vercel):**
```bash
cd frontend
npm install -g vercel
vercel
```

**Backend (Render):**
1. Push code to GitHub
2. Connect repository to Render
3. Add environment variables
4. Deploy

See [docs/deployment.md](docs/deployment.md) for detailed instructions.

## 💡 Tips

- Use **MongoDB Compass** for GUI database management
- Use **Postman** for API testing
- Use **React DevTools** for frontend debugging
- Check browser console for errors
- Monitor backend logs for issues

## 🆘 Get Help

- Check [docs/development.md](docs/development.md) for detailed guides
- Review error messages carefully
- Check MongoDB and server logs
- Verify environment variables
- Test API endpoints with curl or Postman

## 📝 Sample Data

Create sample admin user:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@uet.edu.pk",
    "password": "Admin123!",
    "firstName": "Admin",
    "lastName": "User",
    "role": "admin",
    "phoneNumber": "+923001234567"
  }'
```

## ✅ Checklist

- [ ] Node.js installed
- [ ] MongoDB installed and running
- [ ] Dependencies installed (backend & frontend)
- [ ] Environment variables configured
- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Can access http://localhost:3000
- [ ] Can register and login
- [ ] Database connection working

## 🎉 You're Ready!

Your RideUET application is now running. Start by creating an admin account and adding buses, routes, and schedules. Happy coding!
