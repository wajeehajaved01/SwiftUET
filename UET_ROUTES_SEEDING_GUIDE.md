# 🚌 UET Routes Seeding Guide

## 📋 Overview

This guide explains how to populate your database with **real UET New Campus route data** from the official UET transport document.

---

## 📊 What Will Be Created

### 15 Complete Routes
- **Route 01-10:** Various Lahore city routes to New Campus
- **Route 11-15:** Main Campus to New Campus shuttle routes

### For Each Route:
- ✅ **1 Driver Account** (with login credentials)
- ✅ **1 Bus** (with vehicle number)
- ✅ **1 Route** (with all stops and timings)
- ✅ **7 Schedules** (for next 7 days)

### Total Data Created:
- **15 Drivers** with accounts
- **15 Buses** with vehicle details
- **15 Routes** with complete stop information
- **105 Schedules** (15 routes × 7 days)

---

## 🚀 How to Run

### Step 1: Ensure MongoDB is Running
```cmd
net start MongoDB
```

### Step 2: Navigate to Backend Directory
```cmd
cd backend
```

### Step 3: Run the Seed Script
```cmd
node scripts/seedUETRoutes.js
```

### Expected Output:
```
✅ MongoDB Connected for seeding

🗑️  Clearing existing data...
✅ Existing data cleared

📍 Processing Route 01...
   ✅ Driver created: driver01@uet.edu.pk
   ✅ Route created: Route 01: Harbanspura → New Campus
   ✅ Bus created: LEJ-148

📍 Processing Route 02...
   ✅ Driver created: driver02@uet.edu.pk
   ✅ Route created: Route 02: Nishtar Colony → New Campus
   ✅ Bus created: LEA-6833

... (continues for all 15 routes)

📅 Creating schedules for next 7 days...
   ✅ Schedules created for 2026-05-19
   ✅ Schedules created for 2026-05-20
   ... (7 days total)

============================================================
🎉 UET ROUTES SEEDING COMPLETED SUCCESSFULLY!
============================================================
📊 Summary:
   • Drivers created: 15
   • Buses created: 15
   • Routes created: 15
   • Schedules created: 105
============================================================

📝 Driver Login Credentials:
   Email: driver01@uet.edu.pk to driver15@uet.edu.pk
   Password: driver123
============================================================
```

---

## 📍 Route Details

### Route 01 - Harbanspura Route
- **Driver:** Mr. Ejaz Ahmed (0323-4513997)
- **Vehicle:** LEJ-148
- **Stops:** Harbanspura → Madina Town → Taj Bagh → Fateh Garh → New Pull → Lal Pul → Mughal Pura → Dharam Pura → New Campus
- **Arrival:** 7:50 AM

### Route 02 - Nishtar Colony Route
- **Driver:** Mr. Abdul Basit (0308-4973489)
- **Vehicle:** LEA-6833
- **Stops:** Nishtar Colony → General Hospital → Qanchi Stop → Walton → Defence morr → Firdous Market → Hussain chowk → Kalma Chowk → Ichra → Qartba Chowk → New Campus
- **Arrival:** 7:50 AM

### Route 03 - Mochi Pura Route
- **Driver:** Mr. M. Sibtain (0305-4143017)
- **Vehicle:** LEJ-143
- **Stops:** Mochi pura → Akbar chowk → M. Ali chowk → Khokhar chowk → Al-Jannat Chowk → Ameer Chowk → Butt chowk → Ghazi chowk → Wapda Town → Abu bakar chowk → Edhi Road → New Campus
- **Arrival:** 7:50 AM

### Route 04 - Muslim Town Route
- **Driver:** Zahid Mehmood (0321-4990158)
- **Vehicle:** LZR-2351
- **Stops:** Muslim Town → Naqsha Stop → Baikhe wala → Wahdat Road → Raza Block → Kharak Stop → Liaqat chowk → Sabza Zar → Babu Sabu → Shahdara Station → New Campus
- **Arrival:** 7:50 AM

### Route 05 - Flat Stop Route
- **Driver:** Mr. M. Arshad (0322-4250804)
- **Vehicle:** LZB-2607
- **Stops:** Flat Stop → Scheme Morr → Yateem Khana → Morr Samanabad → Chowk Chaburji → MAO College → Secretariat → Data Darbar → Sheran wala → New Campus
- **Arrival:** 7:50 AM

### Route 06 - Ravi Hotel Route
- **Driver:** Mr. Rehmat Ali (0300-4112131)
- **Vehicle:** LRT-2034
- **Stops:** Ravi Hotel → Allah Hoo chowk → Shadewal chowk → G-I Market → Khokhar chowk → Expo Center → Thokar Niaz baig → New Campus
- **Arrival:** 7:50 AM

### Route 07 - Burj Attari Route
- **Driver:** Mr. M. Nasir (0300-8104930)
- **Vehicle:** LZR-2349
- **Stops:** Burj Attari → Faiz Pur → Phool Mandi → Begum Kot → Shahdara → Kashmir Park → Machis Factory → Imamia colony → Rachna Town → Haider road → Rana town → New Campus
- **Arrival:** 7:50 AM

### Route 08 - Bismillah Scheme Route
- **Driver:** Mr. Khadim Hussain (0322-3899181)
- **Vehicle:** LEE-9715
- **Stops:** Bismillah scheme → Yadgar Shuhda → Adda Shabeel → Salamat Pura → Darogawala → Akhri minute → Souk Nahar → Shalimar chowk → Gaas mandi → Singh pura → New Campus
- **Arrival:** 7:50 AM

### Route 09 - Chan da Qilla Route
- **Driver:** Mr. M. Arif (0300-4797349)
- **Vehicle:** LZB-2606
- **Stops:** Chan da qilla → Kamoki → Sadhoki → Muridkey → Ravi Riyan → Ittehad Chemical → S.A Garden → New Campus
- **Arrival:** 7:50 AM

### Route 10 - Ghazi Road Route
- **Driver:** Mr. Ansar Majeed (0300-8831159)
- **Vehicle:** LRT-2036
- **Stops:** Ghazi Road → Bhatta chowk → Barki Interchange → Ranger Hadquarter → Murgi Khana → Askari 9 → Sadar Gol Chakar → Ghari Shahu → Railway station → New Campus
- **Arrival:** 7:50 AM

### Routes 11-15 - Main Campus Shuttle
- **Route:** Main Campus → Tezab Ehata → Station stairs → Do Moria Pull → Lari adda → Yadgar Chowk → Timber market → Batti chowk → New Campus
- **Departure:** 7:00 AM
- **Arrival:** 7:50 AM

---

## 🔑 Login Credentials

### Driver Accounts
All drivers can login with:
- **Email Pattern:** `driver01@uet.edu.pk` to `driver15@uet.edu.pk`
- **Password:** `driver123`
- **Role:** driver

### Example Logins:
```
Email: driver01@uet.edu.pk
Password: driver123
Role: driver

Email: driver05@uet.edu.pk
Password: driver123
Role: driver
```

---

## 🧪 Testing After Seeding

### 1. Test Driver Login
```cmd
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"driver01@uet.edu.pk\",\"password\":\"driver123\",\"role\":\"driver\"}"
```

### 2. Get All Routes
```cmd
curl http://localhost:5000/api/routes
```

### 3. Get All Buses
```cmd
curl http://localhost:5000/api/buses
```

### 4. Get Today's Schedules
```cmd
curl http://localhost:5000/api/schedules/today
```

---

## 📱 Frontend Testing

### 1. Login as Driver
- Go to: http://localhost:3000
- Email: `driver01@uet.edu.pk`
- Password: `driver123`
- Role: Driver

### 2. View Driver Dashboard
- Should see student manifest
- Should see route information
- Can mark students as picked up

### 3. Login as Student
- Register a new student account
- View available schedules
- Book a seat on any route
- See all 15 routes available

### 4. Login as Admin
- View all 15 buses in Management tab
- View all 15 routes
- View all 105 schedules
- See driver assignments

---

## 🔄 Re-running the Script

**⚠️ WARNING:** Running this script will:
- Delete all existing routes
- Delete all existing buses
- Delete all existing driver accounts
- Create fresh data

To re-run:
```cmd
node scripts/seedUETRoutes.js
```

---

## 📊 Database Collections After Seeding

### Users Collection
```javascript
{
  email: "driver01@uet.edu.pk",
  firstName: "Mr.",
  lastName: "Ejaz Ahmed",
  role: "driver",
  phoneNumber: "+923234513997",
  isActive: true
}
```

### Buses Collection
```javascript
{
  busNumber: "LEJ-148",
  capacity: 40,
  route: "Route 01: Harbanspura → New Campus",
  status: "active",
  driverName: "Mr. Ejaz Ahmed",
  driver: ObjectId("...")
}
```

### Routes Collection
```javascript
{
  name: "Route 01: Harbanspura → New Campus",
  startPoint: "Harbanspura",
  endPoint: "New Campus",
  stops: [
    { name: "Harbanspura", time: "6:50", order: 1 },
    { name: "Madina Town Chungi Amarsudu", time: "", order: 2 },
    // ... more stops
  ],
  status: "active",
  estimatedDuration: 60
}
```

### Schedules Collection
```javascript
{
  busId: ObjectId("..."),
  routeId: ObjectId("..."),
  driverId: ObjectId("..."),
  date: "2026-05-19",
  departureTime: "2026-05-19T06:30:00.000Z",
  arrivalTime: "2026-05-19T07:50:00.000Z",
  status: "scheduled",
  availableSeats: 40,
  facultyRowsLocked: true
}
```

---

## ✅ Verification Checklist

After seeding, verify:
- [ ] 15 drivers created in Users collection
- [ ] 15 buses created in Buses collection
- [ ] 15 routes created in Routes collection
- [ ] 105 schedules created (15 routes × 7 days)
- [ ] Can login as any driver (driver01-driver15)
- [ ] All routes visible in frontend
- [ ] All buses visible in admin dashboard
- [ ] Schedules show correct dates and times

---

## 🐛 Troubleshooting

### MongoDB Connection Error
```
❌ MongoDB Error: connect ECONNREFUSED
```
**Solution:** Start MongoDB service
```cmd
net start MongoDB
```

### Script Fails Midway
**Solution:** Clear database and re-run
```cmd
# In MongoDB shell or Compass
use rideuet
db.users.deleteMany({ role: 'driver' })
db.buses.deleteMany({})
db.routes.deleteMany({})
db.schedules.deleteMany({})

# Then re-run
node scripts/seedUETRoutes.js
```

### Duplicate Key Error
**Solution:** The script already clears existing data. If error persists, manually clear collections and re-run.

---

## 📞 Contact Information

**Transport Committee Chairman:**
Mr. M. Mushtaq
Phone: 0304-0165776

---

## 🎉 Success!

Once seeding is complete, you'll have:
- ✅ Real UET route data in your system
- ✅ 15 working driver accounts
- ✅ Complete bus fleet information
- ✅ 7 days of schedules ready for booking
- ✅ All stops with accurate timings

**Your SwiftUET system is now populated with real UET data! 🚀**
