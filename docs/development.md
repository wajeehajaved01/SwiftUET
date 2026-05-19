# RideUET Development Guide

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- MongoDB installed locally
- Twilio account (free trial)
- Git

### Initial Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd RideUET
   ```

2. **Install dependencies:**
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

3. **Set up MongoDB:**
   ```bash
   # Start MongoDB
   mongod

   # Or use MongoDB Compass for GUI
   ```

4. **Configure environment variables:**
   
   Backend (`.env`):
   ```env
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   MONGODB_URI=mongodb://localhost:27017/rideuet
   JWT_SECRET=your-secret-key-change-in-production
   JWT_EXPIRES_IN=7d
   TWILIO_ACCOUNT_SID=your-twilio-sid
   TWILIO_AUTH_TOKEN=your-twilio-token
   TWILIO_PHONE_NUMBER=+1234567890
   ```

   Frontend (`.env`):
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

5. **Run the application:**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm start
   ```

6. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api
   - Health check: http://localhost:5000/health

## Project Structure

```
RideUET/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   │   ├── database.js  # MongoDB connection
│   │   │   └── twilio.js    # Twilio SMS setup
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Express middleware
│   │   │   ├── auth.js      # Authentication
│   │   │   ├── errorHandler.js
│   │   │   └── validation.js
│   │   ├── models/          # Mongoose models
│   │   │   ├── User.js
│   │   │   ├── Bus.js
│   │   │   ├── Route.js
│   │   │   ├── Schedule.js
│   │   │   ├── Booking.js
│   │   │   ├── Location.js
│   │   │   └── Notification.js
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   │   └── notificationService.js
│   │   ├── utils/           # Utility functions
│   │   ├── app.js           # Express app setup
│   │   └── server.js        # Server entry point
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── manifest.json
│   ├── src/
│   │   ├── components/
│   │   │   └── common/
│   │   │       ├── Navbar.js
│   │   │       └── ProtectedRoute.js
│   │   ├── contexts/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── student/
│   │   │   │   └── StudentDashboard.js
│   │   │   ├── driver/
│   │   │   │   └── DriverDashboard.js
│   │   │   ├── admin/
│   │   │   │   └── AdminDashboard.js
│   │   │   └── parent/
│   │   │       └── ParentDashboard.js
│   │   ├── services/
│   │   │   └── api.js       # Axios instance
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
├── docs/
│   ├── api.md
│   ├── database-schema.md
│   ├── deployment.md
│   └── development.md
├── .gitignore
└── README.md
```

## Development Workflow

### Creating a New Feature

1. **Create a new branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Backend development:**
   - Create model in `backend/src/models/`
   - Create controller in `backend/src/controllers/`
   - Create routes in `backend/src/routes/`
   - Add validation in `backend/src/middleware/validation.js`
   - Test with Postman or curl

3. **Frontend development:**
   - Create components in `frontend/src/components/`
   - Create pages in `frontend/src/pages/`
   - Add API calls in `frontend/src/services/`
   - Style with CSS

4. **Test your changes:**
   ```bash
   # Backend tests
   cd backend
   npm test

   # Frontend tests
   cd frontend
   npm test
   ```

5. **Commit and push:**
   ```bash
   git add .
   git commit -m "Add: your feature description"
   git push origin feature/your-feature-name
   ```

## Common Tasks

### Adding a New API Endpoint

1. **Create controller method:**
   ```javascript
   // backend/src/controllers/exampleController.js
   exports.getExample = async (req, res, next) => {
     try {
       // Your logic here
       res.json({ success: true, data: result });
     } catch (error) {
       next(error);
     }
   };
   ```

2. **Add route:**
   ```javascript
   // backend/src/routes/example.routes.js
   router.get('/', authenticate, exampleController.getExample);
   ```

3. **Register route in app.js:**
   ```javascript
   app.use('/api/example', require('./routes/example.routes'));
   ```

### Adding a New React Component

1. **Create component file:**
   ```javascript
   // frontend/src/components/Example.js
   import React from 'react';

   const Example = () => {
     return <div>Example Component</div>;
   };

   export default Example;
   ```

2. **Import and use:**
   ```javascript
   import Example from './components/Example';
   ```

### Database Operations

**Create a document:**
```javascript
const user = await User.create({
  email: 'test@uet.edu.pk',
  password: 'password123',
  // ...
});
```

**Find documents:**
```javascript
const users = await User.find({ role: 'student' });
const user = await User.findById(userId);
const user = await User.findOne({ email: 'test@uet.edu.pk' });
```

**Update a document:**
```javascript
const user = await User.findByIdAndUpdate(
  userId,
  { firstName: 'New Name' },
  { new: true, runValidators: true }
);
```

**Delete a document:**
```javascript
await User.findByIdAndDelete(userId);
```

## Testing

### Backend Testing

```bash
cd backend
npm test
```

### Frontend Testing

```bash
cd frontend
npm test
```

### Manual API Testing

Use Postman or curl:

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@uet.edu.pk","password":"password123","firstName":"Test","lastName":"User","role":"student","phoneNumber":"+923001234567"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@uet.edu.pk","password":"password123"}'

# Get schedules (with token)
curl http://localhost:5000/api/schedules \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Debugging

### Backend Debugging

1. **Add console.log statements:**
   ```javascript
   console.log('Debug:', variable);
   ```

2. **Use VS Code debugger:**
   - Add breakpoints
   - Press F5 to start debugging

3. **Check MongoDB data:**
   ```bash
   mongosh
   use rideuet
   db.users.find()
   ```

### Frontend Debugging

1. **Use React DevTools:**
   - Install React DevTools browser extension
   - Inspect component state and props

2. **Console logging:**
   ```javascript
   console.log('State:', state);
   ```

3. **Network tab:**
   - Open browser DevTools
   - Check Network tab for API calls

## Code Style

### Backend
- Use async/await for asynchronous operations
- Use try-catch for error handling
- Follow RESTful API conventions
- Use meaningful variable names
- Add comments for complex logic

### Frontend
- Use functional components with hooks
- Keep components small and focused
- Use CSS modules or styled-components
- Follow React best practices
- Add PropTypes or TypeScript

## Git Workflow

1. **Pull latest changes:**
   ```bash
   git pull origin main
   ```

2. **Create feature branch:**
   ```bash
   git checkout -b feature/feature-name
   ```

3. **Make changes and commit:**
   ```bash
   git add .
   git commit -m "Description of changes"
   ```

4. **Push to remote:**
   ```bash
   git push origin feature/feature-name
   ```

5. **Create pull request on GitHub**

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- Verify MongoDB port (default: 27017)

### Port Already in Use
```bash
# Find process using port
netstat -ano | findstr :5000

# Kill process (Windows)
taskkill /PID <PID> /F
```

### CORS Issues
- Check `FRONTEND_URL` in backend `.env`
- Verify CORS configuration in `backend/src/app.js`

### JWT Token Issues
- Check token expiration
- Verify `JWT_SECRET` in `.env`
- Clear localStorage and login again

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [React Documentation](https://react.dev/)
- [Leaflet.js Documentation](https://leafletjs.com/)
- [Twilio Documentation](https://www.twilio.com/docs)
