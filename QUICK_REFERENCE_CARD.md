# 🚌 SwiftUET - Quick Reference Card

## 👥 4 User Roles at a Glance

---

### 🎓 STUDENT
**Dashboard:** Light Mode | **Route:** `/student/dashboard`

**Can Do:**
- 📍 Track bus live
- 💺 Book seats (rows 4-10)
- 📜 View booking history
- ⚠️ See delay alerts
- 🗺️ View route maps

**Login:** `student1@uet.edu.pk` / `student123`

---

### 🚗 DRIVER
**Dashboard:** Dark Mode | **Route:** `/driver/dashboard`

**Can Do:**
- 📋 View student manifest
- ✅ Mark pickups (hold 3 sec)
- 🗺️ Navigate routes
- 📊 Track progress
- 🚪 Logout (top-right)

**Login:** `driver01@uet.edu.pk` / `driver123`

---

### 👨‍💼 ADMIN
**Dashboard:** Tabbed | **Route:** `/admin/dashboard`

**Can Do:**
- 📊 View analytics
- 🚌 Manage buses
- 🛣️ Create routes
- 👤 Assign drivers
- 📢 Send broadcasts
- 👥 Manage users

**Login:** `admin@uet.edu.pk` / `admin123`

---

### 👨‍👩‍👧 PARENT
**Dashboard:** Tracking View | **Route:** `/parent/tracking`

**Can Do:**
- 📍 Track student live
- 🔵🚌✅ See status stepper
- 📝 View notification log
- 🔔 Receive updates
- 🗺️ Monitor journey

**Login:** `parent1@uet.edu.pk` / `parent123`

---

## 🎯 Quick Actions

### Student: Book a Seat
```
1. Login → Dashboard
2. Click "Book Seat"
3. Select seat (not rows 1-3)
4. Confirm → Done! ✅
```

### Driver: Mark Pickup
```
1. Login → Dashboard
2. See student list
3. Hold button 3 seconds
4. Student picked up! ✅
```

### Admin: Create Schedule
```
1. Login → Management Tab
2. Fill schedule form
3. Select bus & route
4. Save → Done! ✅
```

### Parent: Track Student
```
1. Login → Tracking View
2. See live map
3. Check status stepper
4. Monitor until arrival ✅
```

---

## 📊 Feature Count

| Role | Features | Dashboard |
|------|----------|-----------|
| Student | 10 | Light Mode |
| Driver | 8 | Dark Mode |
| Admin | 15 | Tabbed |
| Parent | 6 | Tracking |

**Total: 39 Features**

---

## 🔐 Security

- ✅ JWT Authentication
- ✅ Role-Based Access
- ✅ Password Hashing
- ✅ Protected Routes
- ✅ Token Expiration (7 days)

---

## 🎨 Color Coding

- 🟢 **Available** - Can book
- 🔵 **Selected** - Your choice
- 🔴 **Booked** - Taken
- ⚫ **Faculty** - Rows 1-3
- 🟠 **Waiting** - Not picked up
- ✅ **Picked Up** - Confirmed

---

## 📱 Responsive Design

- ✅ Desktop (1920x1080)
- ✅ Tablet (768x1024)
- ✅ Mobile (375x667)

---

## 🚀 Quick Start

```cmd
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm start

# Terminal 3 - Seed Data
cd backend && node scripts/seedUETRoutes.js
```

**Open:** http://localhost:3000

---

## ✅ System Status

- **Routes:** 15 (from UET)
- **Buses:** 15 (40 seats each)
- **Drivers:** 15 (one per bus)
- **Schedules:** 105 per week
- **Capacity:** 600 students/day
- **API Endpoints:** 43

---

## 📞 Quick Help

**Student Issues:** support@swiftuet.edu.pk
**Driver Issues:** transport@swiftuet.edu.pk
**Admin Issues:** admin@swiftuet.edu.pk
**Parent Issues:** parents@swiftuet.edu.pk

---

**SwiftUET - Smart University Bus Management 🚌**
