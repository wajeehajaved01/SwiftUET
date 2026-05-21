# Driver Dashboard - Quick Test Guide

## 🚀 5-Minute Test

### Step 1: Seed Data (30 seconds)
```bash
# Login as admin, then:
POST http://localhost:5000/api/admin/seed-today
Authorization: Bearer <admin-token>
```

### Step 2: Create Bookings (1 minute)
```bash
# Login as student, then book 2-3 seats:
POST http://localhost:5000/api/bookings
Authorization: Bearer <student-token>
{
  "scheduleId": "<schedule-id>",
  "seatNumber": "4A"
}
```

### Step 3: Test Driver Dashboard (3 minutes)

1. **Login as driver**
   - Email: `driver@swiftuet.com`
   - Password: `driver123`
   - Role: `Driver`

2. **Verify Display**
   - ✅ Driver name at top
   - ✅ Logout button (red, top-right)
   - ✅ Schedule card shows
   - ✅ Students list displays
   - ✅ Counter shows "0/X"

3. **Test Pickup**
   - Click "Mark as Picked Up" on first student
   - ✅ Button shows spinner
   - ✅ Success alert appears
   - ✅ Status changes to "Picked Up" (green)
   - ✅ Counter updates to "1/X"

4. **Test Completion**
   - Mark all students as picked up
   - ✅ Counter shows "X/X"
   - ✅ Footer shows "All students picked up!" (green)

5. **Test Logout**
   - Click logout button
   - ✅ Redirects to login

---

## ✅ Quick Checklist

### Display
- [ ] Driver name visible
- [ ] Logout button works
- [ ] Schedule info correct
- [ ] Students list shows

### Functionality
- [ ] Mark pickup works
- [ ] Counter updates
- [ ] Status changes
- [ ] Completion message shows

### Integration
- [ ] Student sees updated status
- [ ] Auto-refresh works

---

## 🐛 Quick Fixes

**No schedules?**
→ Run seed endpoint

**No students?**
→ Create bookings as student

**Can't mark pickup?**
→ Check token, refresh page

**Status not updating?**
→ Click refresh button

---

## 📊 Expected Results

### Initial State
```
Counter: 0/3
Students: All show "Mark as Picked Up" button
Footer: "3 student(s) remaining" (orange)
```

### After 1 Pickup
```
Counter: 1/3
Student 1: Green "Picked Up" badge
Students 2-3: "Mark as Picked Up" button
Footer: "2 student(s) remaining" (orange)
```

### After All Pickups
```
Counter: 3/3
All Students: Green "Picked Up" badge
Footer: "All students picked up!" (green)
```

---

## 🎯 Key Features to Demo

1. **Real-time Counter** - Updates immediately
2. **Large Buttons** - Easy to tap
3. **Status Badges** - Clear visual feedback
4. **Dark Mode** - Easy on eyes
5. **Auto-refresh** - Always up-to-date

---

**Total Test Time: ~5 minutes**
**Status: Ready to test!** ✅
