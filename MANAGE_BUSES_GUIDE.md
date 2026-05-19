# Manage Buses Feature - Testing Guide

## ✅ What's Been Implemented

### Backend (MongoDB + Express)
- ✅ **Bus Model** with fields:
  - `busNumber` (String, required, unique)
  - `capacity` (Number, default: 40, min: 10, max: 60)
  - `route` (String, required)
  - `status` (String, enum: 'active'/'inactive', default: 'active')
  - `driverName` (String, required)
  - `timestamps` (createdAt, updatedAt)

- ✅ **API Routes**:
  - `GET /api/buses` - Get all buses (requires authentication)
  - `POST /api/buses` - Create new bus (requires admin role)
  - `DELETE /api/buses/:id` - Delete bus (requires admin role)

- ✅ **Authentication Middleware**:
  - JWT token verification
  - Admin role authorization

### Frontend (React)
- ✅ **ManageBuses Component** with:
  - Form to add new buses
  - Table listing all buses
  - Delete functionality
  - Real-time updates
  - Error and success messages
  - Loading states

- ✅ **Admin Dashboard Integration**:
  - Clickable "Manage Buses" card
  - Routing to /admin/buses
  - Navigation back to dashboard

## 🚀 How to Test

### Step 1: Start the Servers

**Terminal 1 - MongoDB:**
```bash
mongod --dbpath C:\data\db
```

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm start
```

### Step 2: Login as Admin

1. Go to http://localhost:3000
2. Login with admin account:
   - Email: `sara.admin@uet.edu.pk`
   - Password: `password123`

### Step 3: Navigate to Manage Buses

1. You should see the Admin Dashboard
2. Click on the **"🚌 Manage Buses"** card
3. You'll be redirected to `/admin/buses`

### Step 4: Add a New Bus

Fill in the form:
- **Bus Number**: LHR-1234
- **Capacity**: 40 (default)
- **Route**: Main Campus to Hostels
- **Driver Name**: Ahmed Khan
- **Status**: Active (default)

Click **"Add Bus"** button

✅ You should see:
- Success message: "Bus added successfully!"
- The new bus appears in the table below
- Form resets to empty

### Step 5: Add More Buses

Try adding these buses:

**Bus 2:**
- Bus Number: LHR-5678
- Capacity: 50
- Route: Engineering Block to Library
- Driver Name: Ali Hassan
- Status: Active

**Bus 3:**
- Bus Number: ISB-9012
- Capacity: 35
- Route: Hostel to Main Gate
- Driver Name: Usman Malik
- Status: Inactive

### Step 6: View All Buses

The table should now show all 3 buses with:
- Bus Number
- Capacity
- Route
- Driver Name
- Status (with colored badge)
- Delete button

### Step 7: Delete a Bus

1. Click the **"Delete"** button on any bus
2. Confirm the deletion in the popup
3. ✅ Bus should be removed from the table
4. Success message: "Bus deleted successfully!"

## 🧪 Test Cases

### ✅ Positive Tests

1. **Add valid bus** - Should succeed
2. **View all buses** - Should display all buses
3. **Delete bus** - Should remove bus
4. **Add bus with custom capacity** - Should accept 10-60
5. **Add inactive bus** - Should work with status='inactive'

### ❌ Negative Tests

1. **Add duplicate bus number**:
   - Try adding LHR-1234 again
   - Should show error: "Bus number already exists"

2. **Add bus with missing fields**:
   - Leave bus number empty
   - Should show error: "Bus number, route, and driver name are required"

3. **Add bus with invalid capacity**:
   - Try capacity < 10 or > 60
   - Browser validation should prevent submission

4. **Access without admin role**:
   - Logout and login as student
   - Try to access /admin/buses
   - Should redirect or show error

5. **Access without authentication**:
   - Logout completely
   - Try to access /admin/buses
   - Should redirect to login

## 🔍 API Testing with curl

### Get All Buses
```bash
curl -X GET http://localhost:5000/api/buses ^
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Add New Bus
```bash
curl -X POST http://localhost:5000/api/buses ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" ^
  -d "{\"busNumber\":\"LHR-1234\",\"capacity\":40,\"route\":\"Main Campus\",\"driverName\":\"Ahmed Khan\"}"
```

### Delete Bus
```bash
curl -X DELETE http://localhost:5000/api/buses/BUS_ID ^
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

## 📊 Database Verification

Check MongoDB directly:

```bash
mongosh
use rideuet
db.buses.find().pretty()
```

Should show all buses with their details.

## 🎨 UI Features

### Form
- ✅ Clean, organized layout
- ✅ Two-column responsive design
- ✅ Input validation
- ✅ Default values (capacity: 40, status: active)
- ✅ Clear labels and placeholders
- ✅ Submit button with loading state

### Table
- ✅ Responsive design
- ✅ Sortable columns
- ✅ Colored status badges
- ✅ Hover effects
- ✅ Delete button with confirmation
- ✅ Empty state message

### Messages
- ✅ Success messages (green)
- ✅ Error messages (red)
- ✅ Auto-clear on new action

## 🔐 Security Features

1. **Authentication Required**: All bus routes require valid JWT token
2. **Admin Authorization**: Only admins can add/delete buses
3. **Input Validation**: Backend validates all fields
4. **Unique Bus Numbers**: Prevents duplicates
5. **SQL Injection Protection**: MongoDB prevents injection
6. **XSS Protection**: React escapes all user input

## 🐛 Troubleshooting

### Issue: "No token provided"
**Solution**: Make sure you're logged in. Token is stored in localStorage.

### Issue: "Admin access required"
**Solution**: Login with admin account (sara.admin@uet.edu.pk)

### Issue: "Bus number already exists"
**Solution**: Use a different bus number

### Issue: Form doesn't submit
**Solution**: Check browser console for errors. Ensure all required fields are filled.

### Issue: Buses don't appear
**Solution**: 
1. Check backend is running
2. Check MongoDB is running
3. Check browser console for API errors
4. Verify token is valid

### Issue: Delete doesn't work
**Solution**: 
1. Confirm you're admin
2. Check backend logs for errors
3. Verify bus ID is correct

## 📝 Code Structure

```
backend/src/server.js
├── Bus Model (Mongoose schema)
├── authenticateToken middleware
├── requireAdmin middleware
├── GET /api/buses
├── POST /api/buses
└── DELETE /api/buses/:id

frontend/src/pages/admin/
├── ManageBuses.js (Main component)
├── ManageBuses.css (Styles)
└── AdminDashboard.js (Updated with routing)
```

## ✨ Features Implemented

- ✅ Full CRUD operations (Create, Read, Delete)
- ✅ Real-time updates
- ✅ Form validation
- ✅ Error handling
- ✅ Success feedback
- ✅ Loading states
- ✅ Responsive design
- ✅ Authentication & Authorization
- ✅ Clean UI/UX
- ✅ MongoDB integration

## 🎯 Next Steps (Optional Enhancements)

1. **Edit Bus**: Add PUT route and edit functionality
2. **Search/Filter**: Add search bar to filter buses
3. **Pagination**: Add pagination for large bus lists
4. **Export**: Export bus list to CSV/PDF
5. **Bulk Actions**: Select multiple buses for bulk delete
6. **Bus Details**: Click bus to view detailed information
7. **Driver Assignment**: Link to actual driver users
8. **Route Integration**: Link to route management system

## 🎉 Success Criteria

✅ Admin can add new buses
✅ Admin can view all buses
✅ Admin can delete buses
✅ Non-admin users cannot add/delete buses
✅ Form validates input
✅ UI updates in real-time
✅ Error messages are clear
✅ Success messages confirm actions
✅ Data persists in MongoDB
✅ Authentication is enforced

---

**Status**: ✅ Fully Functional
**Last Updated**: May 17, 2026
