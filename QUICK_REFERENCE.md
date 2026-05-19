# 🚀 SwiftUET - Quick Reference Card

## ⚡ Quick Start (3 Steps)

```cmd
1. node verify-setup.js          # Check setup
2. cd backend && node scripts\seedTestData.js  # Add test data
3. start-dev.bat                 # Start servers
```

**Login:** http://localhost:3000
**Credentials:** admin@uet.edu.pk / password123

---

## 📋 Common Commands

### Start Servers
```cmd
# Easy way
start-dev.bat

# Manual way
cd backend && npm start          # Terminal 1
cd frontend && npm start         # Terminal 2
```

### Install Dependencies
```cmd
cd backend && npm install
cd frontend && npm install
```

### Seed Database
```cmd
cd backend
node scripts\seedTestData.js
```

### Check Setup
```cmd
node verify-setup.js
```

---

## 🔑 Test Accounts

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@uet.edu.pk | password123 |
| **Driver** | driver1@uet.edu.pk | password123 |
| **Student** | student1@uet.edu.pk | password123 |
| **Parent** | parent@uet.edu.pk | password123 |

---

## 🌐 URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **MongoDB:** mongodb://localhost:27017/rideuet

---

## 📱 Test Routes

### Student
- `/student/dashboard` - Main dashboard with map and booking

### Driver
- `/driver/dashboard` - Dark mode interface with manifest

### Admin
- `/admin/dashboard` - Analytics, management, broadcast tabs

### Parent
- `/parent/tracking` - Live tracking with status timeline

---

## 🧪 Quick Test Checklist

### Login ✅
- [ ] Login as admin
- [ ] Verify redirect to dashboard
- [ ] Check navbar appears

### Student ✅
- [ ] View map
- [ ] Click "Book Seat"
- [ ] Try faculty row (should fail)
- [ ] Book seat in row 4+
- [ ] Check booking history

### Driver ✅
- [ ] View dark interface
- [ ] See student list
- [ ] Hold pickup button
- [ ] Verify status update

### Admin ✅
- [ ] Switch tabs
- [ ] Create route
- [ ] Toggle faculty rows
- [ ] Send broadcast

### Parent ✅
- [ ] View status stepper
- [ ] Check map
- [ ] Read notifications
- [ ] Verify auto-refresh

---

## 🐛 Quick Fixes

### Port Already in Use
```cmd
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### MongoDB Not Running
```cmd
net start MongoDB
```

### Module Not Found
```cmd
cd backend && npm install
cd frontend && npm install
```

### Map Not Showing
1. Check internet connection
2. Clear browser cache (Ctrl+Shift+Delete)
3. Hard refresh (Ctrl+Shift+R)

### Login Not Working
1. Check backend is running
2. Verify MongoDB is connected
3. Check test data was seeded
4. Clear localStorage

---

## 🔍 Debug Tools

### Browser Console
```
F12 - Open DevTools
Ctrl+Shift+M - Mobile view
Ctrl+Shift+C - Inspect element
```

### Check API Calls
1. Open DevTools (F12)
2. Network tab
3. Filter: XHR/Fetch
4. Check status codes

### View Database
```cmd
mongosh
use rideuet
db.users.find().pretty()
db.bookings.find().pretty()
```

---

## 📊 Status Codes

- **200** - Success
- **201** - Created
- **400** - Bad request
- **401** - Unauthorized (not logged in)
- **403** - Forbidden (no permission)
- **404** - Not found
- **500** - Server error

---

## 🎨 Responsive Sizes

- **Mobile:** 375px (iPhone SE)
- **Tablet:** 768px (iPad)
- **Desktop:** 1920px

Test with: Ctrl+Shift+M in Chrome

---

## 📦 Key Dependencies

### Frontend
- react (18.2.0)
- react-router-dom (6.20.0)
- axios (1.6.2)
- leaflet (1.9.4)
- react-leaflet (4.2.1)

### Backend
- express
- mongoose
- jsonwebtoken
- bcryptjs
- twilio

---

## 🔐 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rideuet
JWT_SECRET=swiftuet_secret_key_2024
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=your_number
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🎯 Feature Checklist

- [x] Authentication (all roles)
- [x] Student seat booking
- [x] Faculty row restrictions
- [x] Driver pickup system
- [x] Admin management
- [x] Emergency broadcast
- [x] Parent tracking
- [x] Real-time maps
- [x] Responsive design
- [x] Dark mode (driver)

---

## 📞 Need Help?

1. Check **TESTING_GUIDE.md** for detailed tests
2. Check **START_PROJECT.md** for setup help
3. Check browser console for errors
4. Check backend terminal for logs
5. Verify MongoDB is running

---

## 🚀 Production Checklist

- [ ] Build frontend: `npm run build`
- [ ] Set production env variables
- [ ] Configure MongoDB Atlas
- [ ] Set up Twilio
- [ ] Enable HTTPS
- [ ] Test all features
- [ ] Run Lighthouse audit
- [ ] Deploy backend
- [ ] Deploy frontend

---

## 💡 Pro Tips

1. **Use start-dev.bat** - Easiest way to start
2. **Keep terminals open** - Don't close backend/frontend windows
3. **Check both terminals** - Errors appear in respective windows
4. **Clear cache often** - Ctrl+Shift+Delete
5. **Use DevTools** - F12 is your friend
6. **Test mobile first** - Ctrl+Shift+M
7. **Seed fresh data** - Run seedTestData.js when needed
8. **Check MongoDB** - Verify it's running before starting

---

**Quick Links:**
- 📖 [Full README](README.md)
- 🚀 [Setup Guide](START_PROJECT.md)
- 🧪 [Testing Guide](TESTING_GUIDE.md)

**Happy Coding! 🚌💨**
