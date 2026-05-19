# RideUET Database Schema

## MongoDB Collections

### Users Collection

**Purpose**: Store all user accounts (students, drivers, admins, parents)

**Schema:**
```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed, required),
  firstName: String (required),
  lastName: String (required),
  role: String (enum: ['student', 'driver', 'admin', 'parent'], required),
  phoneNumber: String (format: +92XXXXXXXXXX, required),
  isFaculty: Boolean (default: false),
  parentId: ObjectId (ref: User),
  studentIds: [ObjectId] (ref: User),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `email`: unique
- `role`: for filtering by role
- `parentId`: for parent-student relationships

**Example:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "ahmed.khan@uet.edu.pk",
  "password": "$2a$10$...",
  "firstName": "Ahmed",
  "lastName": "Khan",
  "role": "student",
  "phoneNumber": "+923001234567",
  "isFaculty": false,
  "parentId": "507f1f77bcf86cd799439012",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Buses Collection

**Purpose**: Store bus fleet information

**Schema:**
```javascript
{
  _id: ObjectId,
  registrationNumber: String (unique, uppercase, required),
  capacity: Number (min: 10, max: 60, required),
  facultyRows: [Number] (default: [1, 2]),
  status: String (enum: ['active', 'maintenance', 'inactive'], default: 'active'),
  driverId: ObjectId (ref: User),
  features: {
    hasAC: Boolean (default: false),
    hasWifi: Boolean (default: false),
    isAccessible: Boolean (default: false)
  },
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `registrationNumber`: unique
- `status`: for filtering active buses

**Example:**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "registrationNumber": "LHR-1234",
  "capacity": 40,
  "facultyRows": [1, 2],
  "status": "active",
  "driverId": "507f1f77bcf86cd799439014",
  "features": {
    "hasAC": true,
    "hasWifi": false,
    "isAccessible": true
  },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Routes Collection

**Purpose**: Store bus routes with stops

**Schema:**
```javascript
{
  _id: ObjectId,
  name: String (required),
  stops: [{
    _id: ObjectId,
    name: String (required),
    latitude: Number (min: -90, max: 90, required),
    longitude: Number (min: -180, max: 180, required),
    order: Number (required)
  }],
  distance: Number (min: 0, required),
  estimatedDuration: Number (min: 1, required),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `name`: for searching routes
- `isActive`: for filtering active routes

**Example:**
```json
{
  "_id": "507f1f77bcf86cd799439015",
  "name": "Main Campus to Hostels",
  "stops": [
    {
      "_id": "507f1f77bcf86cd799439016",
      "name": "Main Gate",
      "latitude": 31.5204,
      "longitude": 74.3587,
      "order": 1
    },
    {
      "_id": "507f1f77bcf86cd799439017",
      "name": "Library",
      "latitude": 31.5210,
      "longitude": 74.3590,
      "order": 2
    }
  ],
  "distance": 5.2,
  "estimatedDuration": 25,
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Schedules Collection

**Purpose**: Store bus trip schedules

**Schema:**
```javascript
{
  _id: ObjectId,
  busId: ObjectId (ref: Bus, required),
  routeId: ObjectId (ref: Route, required),
  driverId: ObjectId (ref: User, required),
  departureTime: Date (required),
  arrivalTime: Date (required),
  date: String (format: YYYY-MM-DD, required),
  status: String (enum: ['scheduled', 'in-progress', 'completed', 'cancelled'], default: 'scheduled'),
  availableSeats: Number (required),
  actualDepartureTime: Date,
  actualArrivalTime: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `date, departureTime`: for finding schedules by date
- `busId, date`: for bus schedule lookup
- `status, date`: for filtering by status

**Example:**
```json
{
  "_id": "507f1f77bcf86cd799439018",
  "busId": "507f1f77bcf86cd799439013",
  "routeId": "507f1f77bcf86cd799439015",
  "driverId": "507f1f77bcf86cd799439014",
  "departureTime": "2024-01-15T08:00:00.000Z",
  "arrivalTime": "2024-01-15T08:45:00.000Z",
  "date": "2024-01-15",
  "status": "scheduled",
  "availableSeats": 35,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Bookings Collection

**Purpose**: Store seat bookings

**Schema:**
```javascript
{
  _id: ObjectId,
  studentId: ObjectId (ref: User, required),
  scheduleId: ObjectId (ref: Schedule, required),
  seatNumber: Number (min: 1, required),
  status: String (enum: ['confirmed', 'cancelled', 'completed', 'no-show'], default: 'confirmed'),
  pickupStopId: ObjectId (required),
  dropoffStopId: ObjectId (required),
  cancelledAt: Date,
  cancellationReason: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `studentId, scheduleId`: unique for confirmed bookings
- `scheduleId, seatNumber`: for seat availability
- `studentId, createdAt`: for user booking history

**Example:**
```json
{
  "_id": "507f1f77bcf86cd799439019",
  "studentId": "507f1f77bcf86cd799439011",
  "scheduleId": "507f1f77bcf86cd799439018",
  "seatNumber": 15,
  "status": "confirmed",
  "pickupStopId": "507f1f77bcf86cd799439016",
  "dropoffStopId": "507f1f77bcf86cd799439017",
  "createdAt": "2024-01-10T00:00:00.000Z",
  "updatedAt": "2024-01-10T00:00:00.000Z"
}
```

### Locations Collection

**Purpose**: Store real-time bus locations

**Schema:**
```javascript
{
  _id: ObjectId,
  busId: ObjectId (ref: Bus, required),
  scheduleId: ObjectId (ref: Schedule),
  latitude: Number (min: -90, max: 90, required),
  longitude: Number (min: -180, max: 180, required),
  speed: Number (min: 0, default: 0),
  heading: Number (min: 0, max: 360),
  accuracy: Number (default: 10),
  timestamp: Date (default: now),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `busId, timestamp`: for location history
- `scheduleId, timestamp`: for trip tracking
- `createdAt`: TTL index (expires after 7 days)

**Example:**
```json
{
  "_id": "507f1f77bcf86cd799439020",
  "busId": "507f1f77bcf86cd799439013",
  "scheduleId": "507f1f77bcf86cd799439018",
  "latitude": 31.5204,
  "longitude": 74.3587,
  "speed": 45,
  "heading": 180,
  "accuracy": 5,
  "timestamp": "2024-01-15T08:15:00.000Z",
  "createdAt": "2024-01-15T08:15:00.000Z",
  "updatedAt": "2024-01-15T08:15:00.000Z"
}
```

### Notifications Collection

**Purpose**: Store notification history

**Schema:**
```javascript
{
  _id: ObjectId,
  recipientId: ObjectId (ref: User, required),
  type: String (enum: ['sms', 'push', 'email'], default: 'sms'),
  message: String (required),
  status: String (enum: ['pending', 'sent', 'failed', 'delivered'], default: 'pending'),
  metadata: {
    bookingId: ObjectId,
    scheduleId: ObjectId,
    messageId: String,
    errorMessage: String
  },
  sentAt: Date,
  deliveredAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `recipientId, createdAt`: for user notification history
- `status, createdAt`: for monitoring
- `createdAt`: TTL index (expires after 30 days)

**Example:**
```json
{
  "_id": "507f1f77bcf86cd799439021",
  "recipientId": "507f1f77bcf86cd799439012",
  "type": "sms",
  "message": "RideUET: Ahmed's bus LHR-1234 has started.",
  "status": "delivered",
  "metadata": {
    "bookingId": "507f1f77bcf86cd799439019",
    "scheduleId": "507f1f77bcf86cd799439018",
    "messageId": "SM1234567890"
  },
  "sentAt": "2024-01-15T08:00:00.000Z",
  "deliveredAt": "2024-01-15T08:00:05.000Z",
  "createdAt": "2024-01-15T08:00:00.000Z",
  "updatedAt": "2024-01-15T08:00:05.000Z"
}
```

## Relationships

```
User (Student) ──┬─> Booking ──> Schedule ──┬─> Bus
                 │                           │
User (Parent) ───┘                           ├─> Route
                                             │
User (Driver) ───────────────────────────────┴─> Location

Notification ──> User (Parent)
```

## Common Queries

### Get Available Schedules for Today
```javascript
db.schedules.find({
  date: "2024-01-15",
  status: "scheduled",
  availableSeats: { $gt: 0 }
}).populate('busId routeId driverId');
```

### Get Student's Bookings
```javascript
db.bookings.find({
  studentId: ObjectId("507f1f77bcf86cd799439011"),
  status: "confirmed"
}).populate('scheduleId').sort({ createdAt: -1 });
```

### Get Bus Current Location
```javascript
db.locations.findOne({
  busId: ObjectId("507f1f77bcf86cd799439013")
}).sort({ timestamp: -1 });
```

### Check Seat Availability
```javascript
db.bookings.findOne({
  scheduleId: ObjectId("507f1f77bcf86cd799439018"),
  seatNumber: 15,
  status: "confirmed"
});
```

## Data Retention

- **Users**: Permanent
- **Buses**: Permanent
- **Routes**: Permanent
- **Schedules**: Archive after 90 days
- **Bookings**: Permanent (for records)
- **Locations**: Auto-delete after 7 days (TTL)
- **Notifications**: Auto-delete after 30 days (TTL)

## Backup Strategy

1. **Automated Backups**: Daily at 2 AM
2. **Retention**: 7 days for daily, 4 weeks for weekly
3. **Point-in-Time Recovery**: Enabled
4. **Test Restores**: Monthly

## Performance Optimization

### Indexes
- Create compound indexes for common queries
- Use sparse indexes where appropriate
- Monitor index usage with `explain()`

### Query Optimization
- Use projection to limit returned fields
- Implement pagination for large result sets
- Use aggregation pipeline for complex queries

### Caching
- Cache frequently accessed data (routes, buses)
- Implement Redis for session management
- Use MongoDB's built-in caching

## Security

- **Encryption at Rest**: Enabled
- **Encryption in Transit**: TLS/SSL
- **Access Control**: Role-based (RBAC)
- **Audit Logging**: Enabled
- **IP Whitelist**: Configured
