# Manage Schedules Feature - Testing Guide

## ✅ What's Been Implemented

### Backend (MongoDB + Express)

**1. Schedule Model** with fields:
- `busId` (ObjectId, ref: Bus, required)
- `date` (String, format: YYYY-MM-DD, required)
- `departureTime` (String, required)
- `arrivalTime` (String, required)
- `route` (String, required)
- `status` (String, enum: 'scheduled'/'cancelled'/'delayed', default: 'scheduled')
- `timestamps` (createdAt, updatedAt)

**2. API Routes**:
- `GET /api/schedules` - Get all schedules (with optional filters)
- `POST /api/schedules` - Create new schedule (admin only)
- `PATCH /api/schedules/:id/status` - Update schedule status (admin only)

**3. Features**:
- ✅ Populates bus details (busNumber, capacity, route, driverName)
- ✅ Validates date format (YYYY-MM-DD)
- ✅ Prevents duplicate schedules (same bus, date, time)
- ✅ Query filtering by date and status
- ✅ Admin-only access with JWT authentication

### Frontend (React)

**1. ManageSchedules Component** with:
- ✅ Form to create schedules
  - Bus selection dropdown (shows active buses only)
  - Date picker (prevents past dates)
  - Time pickers for departure/arrival
  - Route input
- ✅ Table listing all schedules
  - Shows bus number, date, times, route, driver, status
  - Color-coded status badges
  - Action buttons based on status
- ✅ Status management
  - "Delay" button for scheduled schedules
  - "Cancel" button for scheduled/delayed schedules
  - Confirmation dialogs
- ✅ Real-time updates
- ✅ Error and success messages
- ✅ Loading states
- ✅ Responsive design

## 🚀 How to Test

### Step 1: Ensure Prerequisites

**Make sure you have buses in the system:**
1. Login as admin
2. Go to "Manage Buses"
3. Add at least 2 buses if you haven't already

Example buses:
- Bus 1: LHR-1234, Route: Main Campus to Hostels, Driver: Ahmed Khan
- Bus 2: LHR-5678, Route: Engineering to Library, Driver: Ali Hassan

### Step 2: Navigate to Manage Schedules

1. Login as admin: `sara.admin@uet.edu.pk` / `password123`
2. Click on **"📅 Manage Schedules"** card
3. You'll be redirected to `/admin/schedules`

### Step 3: Create a Schedule

**Fill in the form:**
1. **Select Bus**: Choose "LHR-1234 - Main Campus to Hostels (Driver: Ahmed Khan)"
2. **Date**: Select tomorrow's date
3. **Departure Time**: 08:00
4. **Arrival Time**: 09:00
5. **Route**: Main Campus to Hostels

Click **"Create Schedule"**

✅ **Expected Result**:
- Success message: "Schedule created successfully!"
- Form resets
- New schedule appears in the table below
- Status badge shows "SCHEDULED" in green

### Step 4: Create More Schedules

**Schedule 2:**
- Bus: LHR-1234
- Date: Tomorrow
- Departure: 14:00
- Arrival: 15:00
- Route: Hostels to Main Campus

**Schedule 3:**
- Bus: LHR-5678
- Date: Tomorrow
- Departure: 09:00
- Arrival: 10:00
- Route: Engineering to Library

**Schedule 4:**
- Bus: LHR-5678
- Date: Day after tomorrow
- Departure: 16:00
- Arrival: 17:00
- Route: Library to Engineering

### Step 5: Test Status Changes

**Mark as Delayed:**
1. Find a schedule with status "SCHEDULED"
2. Click the **"Delay"** button
3. Confirm in the popup
4. ✅ Status changes to "DELAYED" (yellow badge)
5. ✅ "Delay" button disappears
6. ✅ "Cancel" button remains

**Cancel a Schedule:**
1. Find a schedule (scheduled or delayed)
2. Click the **"Cancel"** button
3. Confirm in the popup
4. ✅ Status changes to "CANCELLED" (red badge)
5. ✅ All action buttons disappear
6. ✅ Shows "No actions" text

### Step 6: Test Validations

**Duplicate Schedule:**
1. Try to create a schedule with:
   - Same bus as existing schedule
   - Same date
   - Same departure time
2. ✅ Should show error: "A schedule already exists for this bus at this time"

**Missing Fields:**
1. Leave any required field empty
2. Try to submit
3. ✅ Browser validation prevents submission

**No Buses Available:**
1. If no active buses exist
2. ✅ Dropdown shows "No active buses available"
3. ✅ Submit button is disabled
4. ✅ Helper text appears

## 🧪 Test Cases

### ✅ Positive Tests

1. **Create valid schedule** - Should succeed
2. **View all schedules** - Should display all schedules
3. **Mark schedule as delayed** - Should update status
4. **Cancel schedule** - Should update status
5. **Create multiple schedules for same bus** - Should work if different times
6. **Create schedules for different buses** - Should work
7. **Filter by date** (backend) - Should return filtered results
8. **Filter by status** (backend) - Should return filtered results

### ❌ Negative Tests

1. **Duplicate schedule**:
   - Same bus, date, and time
   - Should show error

2. **Invalid date format**:
   - Backend validates YYYY-MM-DD format
   - Should reject invalid formats

3. **Non-existent bus**:
   - Try to create schedule with invalid busId
   - Should show error: "Bus not found"

4. **Invalid status**:
   - Try to update with invalid status
   - Should show error

5. **Access without admin role**:
   - Login as student
   - Try to access /admin/schedules
   - Should redirect or show error

6. **Access without authentication**:
   - Logout
   - Try to access /admin/schedules
   - Should redirect to login

## 🔍 API Testing with curl

### Get All Schedules
```bash
curl -X GET http://localhost:5000/api/schedules ^
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Schedules by Date
```bash
curl -X GET "http://localhost:5000/api/schedules?date=2026-05-18" ^
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Schedules by Status
```bash
curl -X GET "http://localhost:5000/api/schedules?status=scheduled" ^
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Schedule
```bash
curl -X POST http://localhost:5000/api/schedules ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" ^
  -d "{\"busId\":\"BUS_ID\",\"date\":\"2026-05-18\",\"departureTime\":\"08:00\",\"arrivalTime\":\"09:00\",\"route\":\"Main Campus\"}"
```

### Update Schedule Status
```bash
curl -X PATCH http://localhost:5000/api/schedules/SCHEDULE_ID/status ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" ^
  -d "{\"status\":\"delayed\"}"
```

## 📊 Database Verification

Check MongoDB directly:

```bash
mongosh
use rideuet
db.schedules.find().pretty()
```

Should show all schedules with populated bus references.

## 🎨 UI Features

### Form
- ✅ Bus dropdown with detailed info
- ✅ Date picker (prevents past dates)
- ✅ Time pickers for departure/arrival
- ✅ Route text input
- ✅ Validation messages
- ✅ Submit button with loading state
- ✅ Disabled when no buses available

### Table
- ✅ Comprehensive schedule information
- ✅ Color-coded status badges:
  - 🟢 Green = Scheduled
  - 🟡 Yellow = Delayed
  - 🔴 Red = Cancelled
- ✅ Contextual action buttons
- ✅ Formatted dates
- ✅ Responsive design
- ✅ Empty state message

### Status Management
- ✅ **Scheduled**: Can delay or cancel
- ✅ **Delayed**: Can only cancel
- ✅ **Cancelled**: No actions available
- ✅ Confirmation dialogs
- ✅ Real-time updates

## 🔐 Security Features

1. **Authentication Required**: All schedule routes require valid JWT token
2. **Admin Authorization**: Only admins can create/update schedules
3. **Input Validation**: Backend validates all fields
4. **Duplicate Prevention**: Prevents conflicting schedules
5. **Date Format Validation**: Ensures proper date format
6. **Bus Verification**: Checks if bus exists before creating schedule

## 🐛 Troubleshooting

### Issue: "No active buses available"
**Solution**: Add buses first in "Manage Buses" section

### Issue: "A schedule already exists for this bus at this time"
**Solution**: Choose a different time or bus

### Issue: Schedules don't appear
**Solution**: 
1. Check backend is running
2. Check MongoDB is running
3. Check browser console for errors
4. Verify you're logged in as admin

### Issue: Can't update status
**Solution**: 
1. Ensure you're admin
2. Check backend logs
3. Verify schedule exists

### Issue: Date picker shows past dates
**Solution**: The `min` attribute should prevent this, but you can still select future dates

## 📝 Code Structure

```
backend/src/server.js
├── Schedule Model (Mongoose schema)
├── GET /api/schedules (with filters)
├── POST /api/schedules
└── PATCH /api/schedules/:id/status

frontend/src/pages/admin/
├── ManageSchedules.js (Main component)
├── ManageSchedules.css (Styles)
└── AdminDashboard.js (Updated with routing)
```

## ✨ Features Implemented

- ✅ Create schedules with bus selection
- ✅ View all schedules in table
- ✅ Update schedule status (delay/cancel)
- ✅ Real-time updates
- ✅ Form validation
- ✅ Error handling
- ✅ Success feedback
- ✅ Loading states
- ✅ Responsive design
- ✅ Authentication & Authorization
- ✅ Bus population
- ✅ Date formatting
- ✅ Status badges
- ✅ Contextual actions
- ✅ Duplicate prevention

## 🎯 Status Flow

```
SCHEDULED → DELAYED → CANCELLED
    ↓
CANCELLED
```

- **Scheduled**: Initial state, can be delayed or cancelled
- **Delayed**: Can only be cancelled
- **Cancelled**: Final state, no further actions

## 📈 Sample Data

After testing, you should have schedules like:

| Bus | Date | Departure | Arrival | Route | Status |
|-----|------|-----------|---------|-------|--------|
| LHR-1234 | 2026-05-18 | 08:00 | 09:00 | Main Campus to Hostels | Scheduled |
| LHR-1234 | 2026-05-18 | 14:00 | 15:00 | Hostels to Main Campus | Delayed |
| LHR-5678 | 2026-05-18 | 09:00 | 10:00 | Engineering to Library | Cancelled |
| LHR-5678 | 2026-05-19 | 16:00 | 17:00 | Library to Engineering | Scheduled |

## 🎉 Success Criteria

✅ Admin can create schedules
✅ Admin can view all schedules
✅ Admin can mark schedules as delayed
✅ Admin can cancel schedules
✅ Non-admin users cannot create/update schedules
✅ Form validates input
✅ Duplicate schedules are prevented
✅ UI updates in real-time
✅ Error messages are clear
✅ Success messages confirm actions
✅ Data persists in MongoDB
✅ Authentication is enforced
✅ Bus details are populated
✅ Status badges are color-coded
✅ Actions are contextual to status

---

**Status**: ✅ Fully Functional
**Last Updated**: May 17, 2026
