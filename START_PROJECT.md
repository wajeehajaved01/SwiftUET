# 🚀 Quick Start Guide - SwiftUET

## Prerequisites Check
- [ ] Node.js installed (v14+)
- [ ] MongoDB running (local or Atlas)
- [ ] Two terminal windows ready

---

## Step 1: Install Dependencies (First Time Only)

### Terminal 1 - Backend
```bash
cd backend
npm install
```

### Terminal 2 - Frontend
```bash
cd frontend
npm install
```

---

## Step 2: Configure Environment Variables

### Backend Environment
Check `backend/.env` file exists with:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rideuet
JWT_SECRET=rideuet-secret-key-2024
NODE_ENV=development
```

### Frontend Environment
Check `frontend/.env` file exists with:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## Step 3: Start the Application

### Terminal 1 - Start Backend
```bash
cd backend
npm start
```

**Expected Output:**
```
✅ MongoDB Connected
🚀 RideUET backend running on port 5000
```

### Terminal 2 - Start Frontend
```bash
cd frontend
npm start
```

**Expected Output:**
```
Compiled successfully!
You can now view frontend in the browser.
Local: http://localhost:3000
```

---

## Step 4: Access the Application

Open your browser and go to: **http://localhost:3000**

---

## Step 5: Create Test Accounts

### Option A: Use Register Page
1. Go to http://localhost:3000/register
2. Fill in the form
3. Select role (Student, Driver, Administrator, Parent)
4. Click "Create Account"

### Option B: Use API (Postman/Thunder Client)

#### Create Admin Account
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

#### Create Student Account
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

---

## Step 6: Login and Test

### Test Admin Features
1. Login with admin credentials
2. You'll be redirected to `/admin/dashboard`
3. Test the sidebar navigation:
   - 📊 Dashboard
   - 🚌 Buses
   - 🗺️ Routes
   - 📅 Schedules
   - 👥 Users

### Test Student Features
1. Login with student credentials
2. You'll be redirected to `/student/dashboard`
3. Test seat booking functionality

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if MongoDB is running
mongod --version

# Check if port 5000 is in use
netstat -ano | findstr :5000

# Kill process if needed (Windows)
taskkill /PID <PID> /F
```

### Frontend won't start
```bash
# Clear node_modules and reinstall
cd frontend
rmdir /s /q node_modules
npm install
npm start
```

### Can't login
- Check backend terminal for errors
- Open browser DevTools (F12) → Console tab
- Verify token is saved in localStorage
- Check Network tab for API responses

---

## 📋 Quick Test Checklist

After starting the application:

- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Can access login page
- [ ] Can register new account
- [ ] Can login successfully
- [ ] Redirected to correct dashboard based on role
- [ ] Sidebar navigation works
- [ ] Can logout

---

## 🎯 What to Test Next

See **TESTING_GUIDE.md** for comprehensive testing instructions including:
- All admin features (buses, routes, schedules, users)
- Student seat booking
- Driver dashboard
- Parent tracking
- API endpoints

---

## 📞 Need Help?

1. Check browser console (F12)
2. Check backend terminal for errors
3. Verify MongoDB is running
4. Check .env files are configured correctly
5. Review TESTING_GUIDE.md for detailed instructions

---

**Happy Coding! 🚀**
