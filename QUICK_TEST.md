# Quick Test Guide - Send Notifications Feature

## 🚀 Quick Start (3 Steps)

### Step 1: Restart Backend
```bash
cd backend
node src/server.js
```
Wait for: `✅ MongoDB Connected` and `🚀 RideUET backend running on port 5000`

### Step 2: Test as Admin
1. Open browser: `http://localhost:3000/login`
2. Login: `sara.admin@uet.edu.pk` / `password123`
3. Click **"📢 Send Notifications"**
4. Fill form:
   - Title: `Bus Schedule Update`
   - Message: `All morning buses will depart 15 minutes earlier starting tomorrow.`
   - Type: `📢 Broadcast`
5. Click **"📢 Broadcast to All Students"**
6. ✅ See success message and notification in list below

### Step 3: Test as Student
1. Logout (click Logout in navbar)
2. Login: `ahmed.student@uet.edu.pk` / `password123`
3. ✅ See notifications banner at top with your message!

## 🎯 What to Look For

### Admin Side (`/admin/notifications`)
- ✅ Form with title, message, type selector
- ✅ Character counters (100 for title, 500 for message)
- ✅ "Broadcast to All Students" button
- ✅ Success message after sending
- ✅ Past notifications list below
- ✅ Each notification shows:
  - Icon based on type (📢 ⚠️ ℹ️ 🔔)
  - Title and message
  - Timestamp
  - Who sent it
  - Color-coded badge

### Student Side (`/student`)
- ✅ Purple gradient banner at top
- ✅ "📢 Latest Notifications" heading
- ✅ Latest 5 notifications displayed
- ✅ Each shows title, message, timestamp
- ✅ Hover effect (slides right)
- ✅ Banner only appears if notifications exist

## 🧪 Quick Tests

### Test 1: Send Different Types
Send 4 notifications with different types:
1. 📢 Broadcast: "Welcome to RideUET"
2. ⚠️ Alert: "Weather Warning"
3. ℹ️ Info: "New Feature Available"
4. 🔔 Update: "System Maintenance"

### Test 2: Character Limits
- Type 101 characters in title → Should stop at 100
- Type 501 characters in message → Should stop at 500

### Test 3: Empty Fields
- Leave title empty → Can't submit
- Leave message empty → Can't submit

### Test 4: Student View
- Login as student
- Should see all 4 notifications in banner
- Newest should be at top

## ✅ Success Checklist

- [ ] Backend starts without errors
- [ ] Admin can access `/admin/notifications`
- [ ] Form has all fields (title, message, type)
- [ ] Character counters work
- [ ] Can broadcast notification
- [ ] Success message appears
- [ ] Notification appears in past list
- [ ] Student sees notification on dashboard
- [ ] Notifications banner has gradient background
- [ ] Latest 5 notifications shown
- [ ] Timestamps are formatted correctly
- [ ] Type icons and badges display correctly

## 🐛 If Something Doesn't Work

### Backend won't start
- Check MongoDB is running: `mongod --dbpath C:\data\db`
- Check port 5000 is not in use

### Can't see notifications as student
- Refresh the page
- Check browser console for errors
- Verify notifications exist in database

### Form won't submit
- Check all required fields are filled
- Check browser console for errors
- Verify you're logged in as admin

### Notifications banner doesn't appear
- Make sure at least one notification exists
- Check browser console for errors
- Verify API call succeeds (Network tab)

## 📱 Test on Different Screens

- Desktop (1920x1080)
- Tablet (768px)
- Mobile (375px)

All should display correctly!

## 🎉 Done!

If all checkboxes are checked, the feature is working perfectly!

---

**Time to Complete**: ~5 minutes
**Difficulty**: Easy
**Status**: Ready to Test
