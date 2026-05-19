# RideUET Troubleshooting Guide

## Registration Issues

### Problem: Unable to register as student/admin/driver/parent

**Solution Steps:**

1. **Check if MongoDB is running:**
   ```bash
   # Windows
   tasklist | findstr mongod
   
   # If not running, start it:
   mongod
   ```

2. **Check if backend server is running:**
   ```bash
   # Should see: "🚀 RideUET backend running on port 5000"
   # And: "✅ MongoDB Connected"
   ```

3. **Verify backend is accessible:**
   Open browser and go to: http://localhost:5000/api/health
   
   Should see: `{"status":"RideUET backend running!"}`

4. **Test registration with curl:**
   ```bash
   curl -X POST http://localhost:5000/api/auth/register ^
     -H "Content-Type: application/json" ^
     -d "{\"firstName\":\"Test\",\"lastName\":\"User\",\"email\":\"test@uet.edu.pk\",\"password\":\"password123\",\"phoneNumber\":\"+923001234567\",\"role\":\"student\"}"
   ```

5. **Check browser console for errors:**
   - Open browser DevTools (F12)
   - Go to Console tab
   - Try registering again
   - Look for error messages

6. **Common Errors and Fixes:**

   **Error: "Email already registered"**
   - Solution: Use a different email address
   - Or delete the user from MongoDB:
     ```bash
     mongosh
     use rideuet
     db.users.deleteOne({email: "your.email@uet.edu.pk"})
     ```

   **Error: "All fields are required"**
   - Solution: Make sure all form fields are filled
   - Phone number must be in format: +92XXXXXXXXXX

   **Error: "Network Error" or "Failed to fetch"**
   - Solution: Backend is not running or wrong URL
   - Check backend is running on port 5000
   - Check frontend .env has correct API_URL

   **Error: "CORS policy"**
   - Solution: Backend CORS not configured correctly
   - Verify backend server.js has: `app.use(cors({ origin: 'http://localhost:3000' }))`

## Quick Test Script

Run this to test all user roles:

```bash
node test-registration.js
```

This will attempt to register:
- Student: ahmed.student@uet.edu.pk
- Driver: ali.driver@uet.edu.pk
- Admin: sara.admin@uet.edu.pk
- Parent: fatima.parent@uet.edu.pk

Password for all: `password123`

## Login Issues

### Problem: Cannot login after registration

**Solution:**

1. **Check credentials:**
   - Email must match exactly (case-sensitive)
   - Password must match exactly

2. **Check token storage:**
   - Open DevTools → Application → Local Storage
   - Should see `authToken` after successful login

3. **Clear browser data:**
   ```
   DevTools → Application → Clear storage → Clear site data
   ```

## Backend Issues

### Problem: Backend won't start

**Check these:**

1. **Dependencies installed:**
   ```bash
   cd backend
   npm install
   ```

2. **Environment file exists:**
   ```bash
   # Should exist: backend/.env
   # Copy from: backend/.env.example
   ```

3. **Port 5000 not in use:**
   ```bash
   # Windows
   netstat -ano | findstr :5000
   
   # If in use, kill the process:
   taskkill /PID <PID> /F
   ```

4. **MongoDB connection string:**
   - Check backend/.env
   - Should be: `MONGODB_URI=mongodb://localhost:27017/rideuet`

### Problem: MongoDB connection error

**Solutions:**

1. **Start MongoDB:**
   ```bash
   mongod
   ```

2. **Check MongoDB is running:**
   ```bash
   # Windows
   tasklist | findstr mongod
   ```

3. **Check MongoDB port:**
   - Default port is 27017
   - Verify in backend/.env

4. **Reset MongoDB data (if corrupted):**
   ```bash
   mongosh
   use rideuet
   db.dropDatabase()
   ```

## Frontend Issues

### Problem: Frontend won't start

**Solutions:**

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Check port 3000:**
   ```bash
   netstat -ano | findstr :3000
   ```

3. **Clear npm cache:**
   ```bash
   npm cache clean --force
   rm -rf node_modules
   npm install
   ```

### Problem: API calls failing

**Check:**

1. **API URL in frontend/.env:**
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

2. **Backend is running:**
   - Visit: http://localhost:5000/api/health

3. **CORS enabled:**
   - Check backend server.js has CORS middleware

4. **Network tab in DevTools:**
   - F12 → Network tab
   - Try registration
   - Check request/response

## Database Issues

### Problem: Need to reset database

**Solution:**

```bash
# Connect to MongoDB
mongosh

# Switch to rideuet database
use rideuet

# Drop all collections
db.users.drop()
db.bookings.drop()
db.schedules.drop()
# ... etc

# Or drop entire database
db.dropDatabase()
```

### Problem: View database contents

**Solution:**

```bash
# Connect to MongoDB
mongosh

# Switch to database
use rideuet

# View all users
db.users.find().pretty()

# Count users
db.users.countDocuments()

# Find specific user
db.users.findOne({email: "test@uet.edu.pk"})
```

## Common Error Messages

### "Cannot read property 'data' of undefined"
- **Cause:** API response format mismatch
- **Fix:** Check backend response format matches frontend expectations

### "Unexpected token < in JSON"
- **Cause:** Backend returning HTML instead of JSON
- **Fix:** Check backend route exists and returns JSON

### "Failed to compile"
- **Cause:** Syntax error in React code
- **Fix:** Check error message for file and line number

### "Module not found"
- **Cause:** Missing dependency
- **Fix:** `npm install <package-name>`

## Step-by-Step Registration Test

1. **Start MongoDB:**
   ```bash
   mongod
   ```

2. **Start Backend:**
   ```bash
   cd backend
   npm run dev
   ```
   Wait for: "✅ MongoDB Connected"

3. **Start Frontend:**
   ```bash
   cd frontend
   npm start
   ```
   Browser should open to http://localhost:3000

4. **Register:**
   - Click "Register here"
   - Fill all fields:
     - First Name: Ahmed
     - Last Name: Khan
     - Email: ahmed@uet.edu.pk
     - Password: password123
     - Phone: +923001234567
     - Role: Student
   - Click "Register"

5. **Check Success:**
   - Should redirect to /student
   - Should see "Student Dashboard"

## Still Having Issues?

1. **Check all services are running:**
   - MongoDB: `tasklist | findstr mongod`
   - Backend: http://localhost:5000/api/health
   - Frontend: http://localhost:3000

2. **Check logs:**
   - Backend terminal for errors
   - Browser console (F12) for frontend errors

3. **Restart everything:**
   ```bash
   # Stop all services (Ctrl+C)
   # Start MongoDB
   mongod
   
   # Start backend
   cd backend
   npm run dev
   
   # Start frontend
   cd frontend
   npm start
   ```

4. **Clean install:**
   ```bash
   # Backend
   cd backend
   rm -rf node_modules
   npm install
   
   # Frontend
   cd frontend
   rm -rf node_modules
   npm install
   ```

## Get Help

If you're still stuck:

1. Check the error message carefully
2. Search the error in the documentation
3. Check backend terminal logs
4. Check browser console logs
5. Verify all environment variables are set correctly

## Quick Checklist

- [ ] MongoDB is running
- [ ] Backend is running on port 5000
- [ ] Frontend is running on port 3000
- [ ] backend/.env exists and is configured
- [ ] frontend/.env exists (optional)
- [ ] All dependencies installed (npm install)
- [ ] No port conflicts
- [ ] Browser console shows no errors
- [ ] Backend health check works: http://localhost:5000/api/health
