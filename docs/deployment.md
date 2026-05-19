# RideUET Deployment Guide

## Overview

This guide covers deploying RideUET to production using:
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: MongoDB Atlas

## Prerequisites

- GitHub account
- Vercel account
- Render account
- MongoDB Atlas account
- Twilio account (for SMS)

## Part 1: MongoDB Atlas Setup

### 1. Create MongoDB Atlas Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Create a new project: "RideUET"
4. Click "Build a Database"
5. Choose "Shared" (Free tier)
6. Select your preferred region
7. Click "Create Cluster"

### 2. Configure Database Access

1. Go to "Database Access"
2. Click "Add New Database User"
3. Create username and password
4. Set privileges to "Read and write to any database"
5. Click "Add User"

### 3. Configure Network Access

1. Go to "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### 4. Get Connection String

1. Go to "Database" → "Connect"
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Replace `<dbname>` with `rideuet`

Example:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/rideuet?retryWrites=true&w=majority
```

## Part 2: Backend Deployment (Render)

### 1. Prepare Backend for Deployment

1. **Create `render.yaml` in project root:**
   ```yaml
   services:
     - type: web
       name: rideuet-backend
       env: node
       buildCommand: cd backend && npm install
       startCommand: cd backend && npm start
       envVars:
         - key: NODE_ENV
           value: production
         - key: PORT
           value: 5000
         - key: MONGODB_URI
           sync: false
         - key: JWT_SECRET
           sync: false
         - key: FRONTEND_URL
           sync: false
         - key: TWILIO_ACCOUNT_SID
           sync: false
         - key: TWILIO_AUTH_TOKEN
           sync: false
         - key: TWILIO_PHONE_NUMBER
           sync: false
   ```

2. **Update `backend/package.json`:**
   ```json
   {
     "engines": {
       "node": ">=18.0.0"
     }
   }
   ```

### 2. Deploy to Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: rideuet-backend
   - **Environment**: Node
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Instance Type**: Free

5. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=<your-mongodb-atlas-connection-string>
   JWT_SECRET=<generate-strong-secret>
   JWT_EXPIRES_IN=7d
   FRONTEND_URL=<your-vercel-url>
   TWILIO_ACCOUNT_SID=<your-twilio-sid>
   TWILIO_AUTH_TOKEN=<your-twilio-token>
   TWILIO_PHONE_NUMBER=<your-twilio-number>
   ```

6. Click "Create Web Service"
7. Wait for deployment to complete
8. Note your backend URL: `https://rideuet-backend.onrender.com`

### 3. Test Backend

```bash
curl https://rideuet-backend.onrender.com/health
```

Should return:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production"
}
```

## Part 3: Frontend Deployment (Vercel)

### 1. Prepare Frontend for Deployment

1. **Update `frontend/.env.production`:**
   ```env
   REACT_APP_API_URL=https://rideuet-backend.onrender.com/api
   ```

2. **Create `vercel.json` in frontend directory:**
   ```json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```

### 2. Deploy to Vercel

#### Option A: Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   cd frontend
   vercel
   ```

4. **Follow prompts:**
   - Set up and deploy: Yes
   - Which scope: Your account
   - Link to existing project: No
   - Project name: rideuet
   - Directory: ./
   - Override settings: No

5. **Deploy to production:**
   ```bash
   vercel --prod
   ```

#### Option B: Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: frontend
   - **Build Command**: `npm run build`
   - **Output Directory**: build

5. Add Environment Variables:
   ```
   REACT_APP_API_URL=https://rideuet-backend.onrender.com/api
   ```

6. Click "Deploy"
7. Wait for deployment
8. Note your frontend URL: `https://rideuet.vercel.app`

### 3. Update Backend CORS

Update `FRONTEND_URL` in Render environment variables:
```
FRONTEND_URL=https://rideuet.vercel.app
```

Redeploy backend on Render.

## Part 4: Post-Deployment Setup

### 1. Seed Initial Data

Create an admin user:

```bash
curl -X POST https://rideuet-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@uet.edu.pk",
    "password": "SecurePassword123!",
    "firstName": "Admin",
    "lastName": "User",
    "role": "admin",
    "phoneNumber": "+923001234567"
  }'
```

### 2. Test the Application

1. Visit your frontend URL
2. Register a test student account
3. Login and test features
4. Verify SMS notifications (if Twilio is configured)

### 3. Set Up Custom Domain (Optional)

#### Vercel (Frontend)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

#### Render (Backend)

1. Go to Service Settings → Custom Domains
2. Add your custom domain
3. Follow DNS configuration instructions

## Part 5: Monitoring & Maintenance

### 1. Monitor Application

**Render:**
- View logs in Render dashboard
- Set up health checks
- Monitor resource usage

**Vercel:**
- View deployment logs
- Monitor analytics
- Check error tracking

### 2. Set Up Alerts

**MongoDB Atlas:**
1. Go to Alerts
2. Set up alerts for:
   - High connection count
   - Low storage space
   - Query performance

**Render:**
1. Enable email notifications
2. Set up uptime monitoring

### 3. Backup Strategy

**MongoDB Atlas:**
1. Enable automated backups
2. Configure backup schedule
3. Test restore process

## Part 6: Environment Variables Reference

### Backend (Render)

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rideuet
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://rideuet.vercel.app
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (Vercel)

```env
REACT_APP_API_URL=https://rideuet-backend.onrender.com/api
```

## Part 7: Troubleshooting

### Backend Issues

**MongoDB Connection Failed:**
- Verify connection string
- Check IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions

**CORS Errors:**
- Verify `FRONTEND_URL` matches your Vercel URL
- Check CORS configuration in `backend/src/app.js`

**Twilio SMS Not Sending:**
- Verify Twilio credentials
- Check phone number format (+92XXXXXXXXXX)
- Ensure Twilio account is active

### Frontend Issues

**API Calls Failing:**
- Verify `REACT_APP_API_URL` is correct
- Check backend is running
- Inspect network tab in browser DevTools

**Build Failures:**
- Check build logs in Vercel
- Verify all dependencies are in `package.json`
- Test build locally: `npm run build`

### Performance Issues

**Slow API Responses:**
- Add database indexes
- Optimize queries
- Consider caching

**High Memory Usage:**
- Monitor Render metrics
- Optimize code
- Upgrade instance type if needed

## Part 8: Scaling

### Database Scaling

1. Upgrade MongoDB Atlas tier
2. Add read replicas
3. Implement connection pooling

### Backend Scaling

1. Upgrade Render instance
2. Enable auto-scaling
3. Add load balancer

### Frontend Scaling

Vercel handles this automatically with CDN.

## Part 9: Security Checklist

- [ ] Use strong JWT secret (min 32 characters)
- [ ] Enable HTTPS only
- [ ] Set secure CORS policy
- [ ] Use environment variables for secrets
- [ ] Enable rate limiting
- [ ] Implement input validation
- [ ] Use MongoDB Atlas IP whitelist
- [ ] Enable MongoDB encryption at rest
- [ ] Set up monitoring and alerts
- [ ] Regular security updates
- [ ] Implement proper error handling
- [ ] Use secure password hashing (bcrypt)

## Part 10: Cost Estimation

### Free Tier (Development)

- **MongoDB Atlas**: Free (512MB storage)
- **Render**: Free (750 hours/month)
- **Vercel**: Free (100GB bandwidth)
- **Twilio**: Free trial ($15 credit)

**Total: $0/month**

### Production (500 users)

- **MongoDB Atlas**: $9/month (Shared M2)
- **Render**: $7/month (Starter)
- **Vercel**: Free (within limits)
- **Twilio**: ~$50/month (SMS costs)

**Total: ~$66/month**

## Support

For deployment issues:
- Render: https://render.com/docs
- Vercel: https://vercel.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com/
- Twilio: https://www.twilio.com/docs
