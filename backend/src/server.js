const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
dotenv.config();

const app = express();
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rideuet')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Error:', err));

// ── MODELS ──────────────────────────────────────────
const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  role: { type: String, enum: ['student', 'driver', 'admin', 'parent'], default: 'student' },
  isFaculty: { type: Boolean, default: false }
}, { timestamps: true }));

const Bus = mongoose.models.Bus || mongoose.model('Bus', new mongoose.Schema({
  busNumber: { type: String, required: true, unique: true },
  capacity: { type: Number, default: 40 },
  route: { type: String, required: true },
  driverName: { type: String, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true }));

const Route = mongoose.models.Route || mongoose.model('Route', new mongoose.Schema({
  name: { type: String, required: true },
  startPoint: { type: String, required: true },
  endPoint: { type: String, required: true },
  stops: [String],
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true }));

const Schedule = mongoose.models.Schedule || mongoose.model('Schedule', new mongoose.Schema({
  busId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
  date: { type: String, required: true },
  departureTime: { type: String, required: true },
  arrivalTime: { type: String, required: true },
  route: { type: String, required: true },
  status: { type: String, enum: ['scheduled', 'cancelled', 'delayed'], default: 'scheduled' }
}, { timestamps: true }));

const Booking = mongoose.models.Booking || mongoose.model('Booking', new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentName: { type: String, required: true },
  scheduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Schedule', required: true },
  seatNumber: { type: String, required: true },
  status: { type: String, enum: ['booked', 'picked-up', 'cancelled'], default: 'booked' }
}, { timestamps: true }));

const Notification = mongoose.models.Notification || mongoose.model('Notification', new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, default: 'general' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true }));

// ── MIDDLEWARE ───────────────────────────────────────
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, error: 'No token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'rideuet-secret');
    next();
  } catch {
    res.status(401).json({ success: false, error: 'Invalid token' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ success: false, error: 'Admin only' });
  next();
};

// ── AUTH ROUTES ──────────────────────────────────────
app.post('/api/auth/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, phoneNumber, role, isFaculty } = req.body;
    if (!firstName || !lastName || !email || !password || !phoneNumber)
      return res.status(400).json({ success: false, error: 'All fields are required' });

    if (await User.findOne({ email }))
      return res.status(400).json({ success: false, error: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ firstName, lastName, email, password: hashed, phoneNumber, role: role || 'student', isFaculty: isFaculty || false });
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || 'rideuet-secret', { expiresIn: '7d' });

    res.status(201).json({ success: true, data: { token, user: { userId: user._id, firstName, lastName, email, role: user.role } } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ success: false, error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || 'rideuet-secret', { expiresIn: '7d' });
    res.json({ success: true, data: { token, user: { userId: user._id, firstName: user.firstName, lastName: user.lastName, email, role: user.role, phoneNumber: user.phoneNumber, isFaculty: user.isFaculty } } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── USER ROUTES ──────────────────────────────────────
app.get('/api/users', auth, adminOnly, async (req, res) => {
  try {
    const filter = req.query.role ? { role: req.query.role } : {};
    const users = await User.find(filter).select('-password');
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/users/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── BUS ROUTES ───────────────────────────────────────
app.get('/api/buses', auth, async (req, res) => {
  try {
    const buses = await Bus.find().sort({ createdAt: -1 });
    res.json({ success: true, data: buses });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/buses', auth, adminOnly, async (req, res) => {
  try {
    const { busNumber, capacity, route, driverName, status } = req.body;
    if (!busNumber || !route || !driverName)
      return res.status(400).json({ success: false, error: 'Bus number, route, and driver name required' });
    if (await Bus.findOne({ busNumber }))
      return res.status(400).json({ success: false, error: 'Bus number already exists' });
    const bus = await Bus.create({ busNumber, capacity: capacity || 40, route, driverName, status: status || 'active' });
    res.status(201).json({ success: true, data: bus, message: 'Bus created successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/buses/:id', auth, adminOnly, async (req, res) => {
  try {
    await Bus.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Bus deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── ROUTE ROUTES ─────────────────────────────────────
app.get('/api/routes', auth, async (req, res) => {
  try {
    const routes = await Route.find().sort({ createdAt: -1 });
    res.json({ success: true, data: routes });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/routes', auth, adminOnly, async (req, res) => {
  try {
    const { name, startPoint, endPoint, stops } = req.body;
    if (!name || !startPoint || !endPoint)
      return res.status(400).json({ success: false, error: 'Name, start and end point required' });
    const route = await Route.create({ name, startPoint, endPoint, stops: stops || [] });
    res.status(201).json({ success: true, data: route, message: 'Route created successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── SCHEDULE ROUTES ──────────────────────────────────
app.get('/api/schedules', auth, async (req, res) => {
  try {
    const schedules = await Schedule.find().populate('busId', 'busNumber capacity route driverName').sort({ date: -1 });
    res.json({ success: true, data: schedules });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/schedules/today', auth, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const schedules = await Schedule.find({ date: today, status: 'scheduled' }).populate('busId');
    res.json({ success: true, data: schedules });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/schedules', auth, adminOnly, async (req, res) => {
  try {
    const { busId, date, departureTime, arrivalTime, route } = req.body;
    if (!busId || !date || !departureTime || !arrivalTime || !route)
      return res.status(400).json({ success: false, error: 'All fields required' });
    const schedule = await Schedule.create({ busId, date, departureTime, arrivalTime, route });
    res.status(201).json({ success: true, data: schedule, message: 'Schedule created successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.patch('/api/schedules/:id/status', auth, adminOnly, async (req, res) => {
  try {
    const schedule = await Schedule.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json({ success: true, data: schedule });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── BOOKING ROUTES ───────────────────────────────────
app.get('/api/bookings', auth, adminOnly, async (req, res) => {
  try {
    const bookings = await Booking.find().populate('studentId', 'firstName lastName email').populate('scheduleId').sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/bookings/my', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ studentId: req.user.userId }).populate('scheduleId').sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/bookings/recent', auth, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('studentId', 'firstName lastName email')
      .populate({
        path: 'scheduleId',
        populate: {
          path: 'busId',
          select: 'busNumber'
        }
      })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/bookings/schedule/:id', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ scheduleId: req.params.id, status: { $ne: 'cancelled' } }).select('seatNumber studentName status');
    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/bookings', auth, async (req, res) => {
  try {
    const { scheduleId, seatNumber } = req.body;
    if (await Booking.findOne({ scheduleId, seatNumber, status: { $ne: 'cancelled' } }))
      return res.status(400).json({ success: false, error: 'Seat already booked' });
    const student = await User.findById(req.user.userId);
    const booking = await Booking.create({ studentId: req.user.userId, studentName: `${student.firstName} ${student.lastName}`, scheduleId, seatNumber });
    res.status(201).json({ success: true, data: booking, message: 'Seat booked successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.patch('/api/bookings/:id/pickup', auth, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status: 'picked-up' }, { new: true });
    res.json({ success: true, data: booking, message: 'Student marked as picked up' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── NOTIFICATION ROUTES ──────────────────────────────
app.get('/api/notifications', auth, async (req, res) => {
  try {
    const notifications = await Notification.find().populate('createdBy', 'firstName lastName').sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, data: notifications });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/notifications/broadcast', auth, adminOnly, async (req, res) => {
  try {
    const { title, message, type } = req.body;
    if (!title || !message) return res.status(400).json({ success: false, error: 'Title and message required' });
    const notification = await Notification.create({ title, message, type: type || 'general', createdBy: req.user.userId });
    res.status(201).json({ success: true, data: notification, message: 'Broadcast sent!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── SEED ENDPOINT ────────────────────────────────────
app.post('/api/admin/seed-today', auth, adminOnly, async (req, res) => {
  try {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    // Check if schedules already exist for today
    const existingSchedules = await Schedule.find({ date: today });
    if (existingSchedules.length > 0) {
      return res.json({
        success: true,
        message: 'Schedules already exist for today',
        data: existingSchedules
      });
    }

    // Check if buses exist, if not create sample buses
    let buses = await Bus.find();
    if (buses.length === 0) {
      // Create 2 sample buses
      buses = await Bus.create([
        {
          busNumber: 'UET-001',
          capacity: 40,
          route: 'Main Campus ↔ KSK',
          driverName: 'Ahmed Khan',
          status: 'active'
        },
        {
          busNumber: 'UET-002',
          capacity: 40,
          route: 'Main Campus ↔ Hostel',
          driverName: 'Hassan Ali',
          status: 'active'
        }
      ]);
    }

    // Create 2 schedules for today
    const schedules = await Schedule.create([
      {
        busId: buses[0]._id,
        date: today,
        departureTime: '08:00',
        arrivalTime: '09:00',
        route: 'Main Campus ↔ KSK',
        status: 'scheduled'
      },
      {
        busId: buses[1]._id,
        date: today,
        departureTime: '14:00',
        arrivalTime: '15:00',
        route: 'Main Campus ↔ Hostel',
        status: 'scheduled'
      }
    ]);

    // Populate bus details
    const populatedSchedules = await Schedule.find({ _id: { $in: schedules.map(s => s._id) } })
      .populate('busId', 'busNumber capacity route driverName');

    res.status(201).json({
      success: true,
      message: `Created ${schedules.length} schedules for today`,
      data: populatedSchedules
    });
  } catch (err) {
    console.error('Seed error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── ADMIN DASHBOARD ──────────────────────────────────
app.get('/api/admin/dashboard', auth, adminOnly, async (req, res) => {
  try {
    const [totalStudents, totalDrivers, totalBuses, totalRoutes, todayBookings] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'driver' }),
      Bus.countDocuments(),
      Route.countDocuments(),
      Booking.countDocuments({ createdAt: { $gte: new Date().setHours(0, 0, 0, 0) } })
    ]);
    res.json({ success: true, data: { totalStudents, totalDrivers, totalBuses, totalRoutes, todayBookings } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/health', (req, res) => res.json({ status: 'SwiftUET running!' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 SwiftUET backend running on port ${PORT}`));



