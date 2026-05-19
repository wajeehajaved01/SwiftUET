const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rideuet')
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.log('❌ MongoDB Error:', err));

// Import routes (after MongoDB connection, before models)
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const routeRoutes = require('./routes/route.routes');
const busRoutes = require('./routes/bus.routes');
const scheduleRoutes = require('./routes/schedule.routes');
const bookingRoutes = require('./routes/booking.routes');
const notificationRoutes = require('./routes/notification.routes');

// Test route
app.get('/api/health', (req, res) => {
    res.json({ status: 'RideUET backend running!' });
});

// User Model
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    password: String,
    phone: String,
    role: { type: String, enum: ['student', 'driver', 'admin', 'parent'], default: 'student' },
    isFaculty: { type: Boolean, default: false }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// Bus Model
const busSchema = new mongoose.Schema({
    busNumber: {
        type: String,
        required: [true, 'Bus number is required'],
        unique: true,
        trim: true
    },
    capacity: {
        type: Number,
        default: 40,
        min: [10, 'Capacity must be at least 10'],
        max: [60, 'Capacity cannot exceed 60']
    },
    route: {
        type: String,
        required: [true, 'Route is required'],
        trim: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    driverName: {
        type: String,
        required: [true, 'Driver name is required'],
        trim: true
    }
}, { timestamps: true });

const Bus = mongoose.model('Bus', busSchema);

// Schedule Model
const scheduleSchema = new mongoose.Schema({
    busId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bus',
        required: [true, 'Bus is required']
    },
    date: {
        type: String,
        required: [true, 'Date is required'],
        match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format']
    },
    departureTime: {
        type: String,
        required: [true, 'Departure time is required']
    },
    arrivalTime: {
        type: String,
        required: [true, 'Arrival time is required']
    },
    route: {
        type: String,
        required: [true, 'Route is required'],
        trim: true
    },
    status: {
        type: String,
        enum: ['scheduled', 'cancelled', 'delayed'],
        default: 'scheduled'
    }
}, { timestamps: true });

const Schedule = mongoose.model('Schedule', scheduleSchema);

// Notification Model
const notificationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    message: {
        type: String,
        required: [true, 'Message is required'],
        trim: true
    },
    type: {
        type: String,
        enum: ['general', 'schedule', 'emergency', 'announcement'],
        default: 'general'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);

// Booking Model
const bookingSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Student ID is required']
    },
    studentName: {
        type: String,
        required: [true, 'Student name is required'],
        trim: true
    },
    scheduleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Schedule',
        required: [true, 'Schedule ID is required']
    },
    seatNumber: {
        type: String,
        required: [true, 'Seat number is required'],
        trim: true
    },
    status: {
        type: String,
        enum: ['booked', 'picked-up', 'cancelled'],
        default: 'booked'
    }
}, { timestamps: true });

// Index for faster queries
bookingSchema.index({ studentId: 1, scheduleId: 1 });
bookingSchema.index({ status: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

// Dependencies
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Auth Middleware
const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'No token provided'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'rideuet-secret');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            error: 'Invalid or expired token'
        });
    }
};

// Admin Authorization Middleware
const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            error: 'Admin access required'
        });
    }
    next();
};

// ==================== API ROUTES ====================
// Use modular routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/buses', busRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/notifications', notificationRoutes);

// ==================== INLINE ROUTES (TO BE MIGRATED) ====================

app.post('/api/auth/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password, phoneNumber, role, isFaculty } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !email || !password || !phoneNumber) {
            return res.status(400).json({
                success: false,
                error: 'All fields are required'
            });
        }

        // Check if user exists
        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(400).json({
                success: false,
                error: 'Email already registered'
            });
        }

        // Hash password
        const hashed = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashed,
            phone: phoneNumber,
            role: role || 'student',
            isFaculty: isFaculty || false
        });

        // Generate token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET || 'rideuet-secret',
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            data: {
                token,
                userId: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            }
        });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({
            success: false,
            error: err.message || 'Registration failed'
        });
    }
});

// Login Route
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required'
            });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        // Check password
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        // Generate token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET || 'rideuet-secret',
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            data: {
                token,
                user: {
                    userId: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    phoneNumber: user.phone,
                    isFaculty: user.isFaculty
                }
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({
            success: false,
            error: 'Login failed'
        });
    }
});

// ==================== SCHEDULE ROUTES ====================

// GET all schedules
app.get('/api/schedules', authenticateToken, async (req, res) => {
    try {
        const { date, status } = req.query;

        // Build query
        const query = {};
        if (date) query.date = date;
        if (status) query.status = status;

        const schedules = await Schedule.find(query)
            .populate('busId', 'busNumber capacity route driverName')
            .sort({ date: -1, departureTime: -1 });

        res.json({
            success: true,
            data: schedules
        });
    } catch (error) {
        console.error('Get schedules error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch schedules'
        });
    }
});

// GET today's schedules
app.get('/api/schedules/today', authenticateToken, async (req, res) => {
    try {
        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];

        const schedules = await Schedule.find({
            date: today,
            status: 'scheduled'
        })
            .populate('busId', 'busNumber capacity route driverName')
            .sort({ departureTime: 1 });

        res.json({
            success: true,
            data: schedules
        });
    } catch (error) {
        console.error('Get today schedules error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch today\'s schedules'
        });
    }
});

// POST create new schedule (Admin only)
app.post('/api/schedules', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { busId, date, departureTime, arrivalTime, route } = req.body;

        // Validate required fields
        if (!busId || !date || !departureTime || !arrivalTime || !route) {
            return res.status(400).json({
                success: false,
                error: 'All fields are required'
            });
        }

        // Verify bus exists
        const bus = await Bus.findById(busId);
        if (!bus) {
            return res.status(404).json({
                success: false,
                error: 'Bus not found'
            });
        }

        // Validate date format
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return res.status(400).json({
                success: false,
                error: 'Date must be in YYYY-MM-DD format'
            });
        }

        // Check for duplicate schedule (same bus, date, and departure time)
        const existingSchedule = await Schedule.findOne({
            busId,
            date,
            departureTime,
            status: { $ne: 'cancelled' }
        });

        if (existingSchedule) {
            return res.status(400).json({
                success: false,
                error: 'A schedule already exists for this bus at this time'
            });
        }

        // Create schedule
        const schedule = await Schedule.create({
            busId,
            date,
            departureTime,
            arrivalTime,
            route,
            status: 'scheduled'
        });

        // Populate bus details
        const populatedSchedule = await Schedule.findById(schedule._id)
            .populate('busId', 'busNumber capacity route driverName');

        res.status(201).json({
            success: true,
            data: populatedSchedule,
            message: 'Schedule created successfully'
        });
    } catch (error) {
        console.error('Create schedule error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to create schedule'
        });
    }
});

// PATCH update schedule status (Admin only)
app.patch('/api/schedules/:id/status', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate status
        if (!status || !['scheduled', 'cancelled', 'delayed'].includes(status)) {
            return res.status(400).json({
                success: false,
                error: 'Valid status is required (scheduled, cancelled, or delayed)'
            });
        }

        // Find and update schedule
        const schedule = await Schedule.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        ).populate('busId', 'busNumber capacity route driverName');

        if (!schedule) {
            return res.status(404).json({
                success: false,
                error: 'Schedule not found'
            });
        }

        res.json({
            success: true,
            data: schedule,
            message: `Schedule ${status} successfully`
        });
    } catch (error) {
        console.error('Update schedule status error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update schedule status'
        });
    }
});

// ==================== BUS ROUTES ====================

// GET all buses
app.get('/api/buses', authenticateToken, async (req, res) => {
    try {
        const buses = await Bus.find().sort({ createdAt: -1 });

        res.json({
            success: true,
            data: buses
        });
    } catch (error) {
        console.error('Get buses error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch buses'
        });
    }
});

// POST create new bus (Admin only)
app.post('/api/buses', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { busNumber, capacity, route, driverName, status } = req.body;

        // Validate required fields
        if (!busNumber || !route || !driverName) {
            return res.status(400).json({
                success: false,
                error: 'Bus number, route, and driver name are required'
            });
        }

        // Check if bus number already exists
        const existingBus = await Bus.findOne({ busNumber });
        if (existingBus) {
            return res.status(400).json({
                success: false,
                error: 'Bus number already exists'
            });
        }

        // Create new bus
        const bus = await Bus.create({
            busNumber,
            capacity: capacity || 40,
            route,
            driverName,
            status: status || 'active'
        });

        res.status(201).json({
            success: true,
            data: bus,
            message: 'Bus created successfully'
        });
    } catch (error) {
        console.error('Create bus error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to create bus'
        });
    }
});

// DELETE bus (Admin only)
app.delete('/api/buses/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const bus = await Bus.findByIdAndDelete(id);

        if (!bus) {
            return res.status(404).json({
                success: false,
                error: 'Bus not found'
            });
        }

        res.json({
            success: true,
            message: 'Bus deleted successfully'
        });
    } catch (error) {
        console.error('Delete bus error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete bus'
        });
    }
});

// ==================== NOTIFICATION ROUTES ====================

// GET all notifications
app.get('/api/notifications', authenticateToken, async (req, res) => {
    try {
        const { limit } = req.query;

        let query = Notification.find()
            .populate('createdBy', 'firstName lastName email')
            .sort({ createdAt: -1 });

        if (limit) {
            query = query.limit(parseInt(limit));
        }

        const notifications = await query;

        res.json({
            success: true,
            data: notifications
        });
    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch notifications'
        });
    }
});

// POST broadcast notification (Admin only)
app.post('/api/notifications/broadcast', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { title, message, type } = req.body;

        // Validate required fields
        if (!title || !message) {
            return res.status(400).json({
                success: false,
                error: 'Title and message are required'
            });
        }

        // Create notification
        const notification = await Notification.create({
            title,
            message,
            type: type || 'general',
            createdBy: req.user.userId
        });

        // Populate creator details
        const populatedNotification = await Notification.findById(notification._id)
            .populate('createdBy', 'firstName lastName email');

        res.status(201).json({
            success: true,
            data: populatedNotification,
            message: 'Notification broadcast successfully'
        });
    } catch (error) {
        console.error('Broadcast notification error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to broadcast notification'
        });
    }
});

// ==================== NOTIFICATION ROUTES ====================

// GET all notifications
app.get('/api/notifications', authenticateToken, async (req, res) => {
    try {
        const notifications = await Notification.find()
            .populate('createdBy', 'firstName lastName email role')
            .sort({ createdAt: -1 })
            .limit(50); // Limit to last 50 notifications

        res.json({
            success: true,
            data: notifications
        });
    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch notifications'
        });
    }
});

// POST broadcast notification (Admin only)
app.post('/api/notifications/broadcast', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { title, message, type } = req.body;

        // Validate required fields
        if (!title || !message) {
            return res.status(400).json({
                success: false,
                error: 'Title and message are required'
            });
        }

        // Validate title length
        if (title.length > 100) {
            return res.status(400).json({
                success: false,
                error: 'Title cannot exceed 100 characters'
            });
        }

        // Validate message length
        if (message.length > 500) {
            return res.status(400).json({
                success: false,
                error: 'Message cannot exceed 500 characters'
            });
        }

        // Create notification
        const notification = await Notification.create({
            title,
            message,
            type: type || 'broadcast',
            createdBy: req.user.userId
        });

        // Populate creator details
        const populatedNotification = await Notification.findById(notification._id)
            .populate('createdBy', 'firstName lastName email role');

        res.status(201).json({
            success: true,
            data: populatedNotification,
            message: 'Notification broadcast successfully'
        });
    } catch (error) {
        console.error('Broadcast notification error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to broadcast notification'
        });
    }
});

// ==================== BOOKING ROUTES ====================

// GET all bookings (Admin only)
app.get('/api/bookings', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { date, status } = req.query;

        // Build query
        const query = {};
        if (status) query.status = status;

        let bookings = await Booking.find(query)
            .populate('studentId', 'firstName lastName email')
            .populate({
                path: 'scheduleId',
                populate: {
                    path: 'busId',
                    select: 'busNumber route'
                }
            })
            .sort({ createdAt: -1 });

        // Filter by date if provided
        if (date) {
            bookings = bookings.filter(booking => {
                if (booking.scheduleId && booking.scheduleId.date) {
                    return booking.scheduleId.date === date;
                }
                return false;
            });
        }

        res.json({
            success: true,
            data: bookings
        });
    } catch (error) {
        console.error('Get bookings error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch bookings'
        });
    }
});

// GET student's own bookings
app.get('/api/bookings/my', authenticateToken, async (req, res) => {
    try {
        const bookings = await Booking.find({ studentId: req.user.userId })
            .populate({
                path: 'scheduleId',
                populate: {
                    path: 'busId',
                    select: 'busNumber route driverName'
                }
            })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: bookings
        });
    } catch (error) {
        console.error('Get my bookings error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch your bookings'
        });
    }
});

// GET booked seats for a schedule
app.get('/api/bookings/schedule/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        // Get all non-cancelled bookings for this schedule
        const bookings = await Booking.find({
            scheduleId: id,
            status: { $ne: 'cancelled' }
        }).select('seatNumber');

        // Extract just the seat numbers
        const bookedSeats = bookings.map(b => b.seatNumber);

        res.json({
            success: true,
            data: bookedSeats
        });
    } catch (error) {
        console.error('Get schedule bookings error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch booked seats'
        });
    }
});

// POST create booking (Student)
app.post('/api/bookings', authenticateToken, async (req, res) => {
    try {
        const { scheduleId, seatNumber } = req.body;

        // Validate required fields
        if (!scheduleId || !seatNumber) {
            return res.status(400).json({
                success: false,
                error: 'Schedule ID and seat number are required'
            });
        }

        // Verify schedule exists
        const schedule = await Schedule.findById(scheduleId);
        if (!schedule) {
            return res.status(404).json({
                success: false,
                error: 'Schedule not found'
            });
        }

        // Check if seat is already booked
        const existingBooking = await Booking.findOne({
            scheduleId,
            seatNumber,
            status: { $ne: 'cancelled' }
        });

        if (existingBooking) {
            return res.status(400).json({
                success: false,
                error: 'This seat is already booked'
            });
        }

        // Get student details
        const student = await User.findById(req.user.userId);
        if (!student) {
            return res.status(404).json({
                success: false,
                error: 'Student not found'
            });
        }

        // Create booking
        const booking = await Booking.create({
            studentId: req.user.userId,
            studentName: `${student.firstName} ${student.lastName}`,
            scheduleId,
            seatNumber,
            status: 'booked'
        });

        // Populate details
        const populatedBooking = await Booking.findById(booking._id)
            .populate('studentId', 'firstName lastName email')
            .populate({
                path: 'scheduleId',
                populate: {
                    path: 'busId',
                    select: 'busNumber route driverName'
                }
            });

        res.status(201).json({
            success: true,
            data: populatedBooking,
            message: 'Booking created successfully'
        });
    } catch (error) {
        console.error('Create booking error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to create booking'
        });
    }
});

// PATCH update booking status
app.patch('/api/bookings/:id/status', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate status
        if (!status || !['booked', 'picked-up', 'cancelled'].includes(status)) {
            return res.status(400).json({
                success: false,
                error: 'Valid status is required (booked, picked-up, or cancelled)'
            });
        }

        // Find booking
        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({
                success: false,
                error: 'Booking not found'
            });
        }

        // Check authorization (student can only update their own, admin can update any)
        if (req.user.role !== 'admin' && booking.studentId.toString() !== req.user.userId) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to update this booking'
            });
        }

        // Update booking
        booking.status = status;
        await booking.save();

        // Populate details
        const populatedBooking = await Booking.findById(booking._id)
            .populate('studentId', 'firstName lastName email')
            .populate({
                path: 'scheduleId',
                populate: {
                    path: 'busId',
                    select: 'busNumber route driverName'
                }
            });

        res.json({
            success: true,
            data: populatedBooking,
            message: `Booking ${status} successfully`
        });
    } catch (error) {
        console.error('Update booking status error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update booking status'
        });
    }
});

// DELETE booking (Cancel)
app.delete('/api/bookings/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        // Find booking
        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({
                success: false,
                error: 'Booking not found'
            });
        }

        // Check authorization (student can only cancel their own, admin can cancel any)
        if (req.user.role !== 'admin' && booking.studentId.toString() !== req.user.userId) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to cancel this booking'
            });
        }

        // Update status to cancelled instead of deleting
        booking.status = 'cancelled';
        await booking.save();

        res.json({
            success: true,
            message: 'Booking cancelled successfully'
        });
    } catch (error) {
        console.error('Cancel booking error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to cancel booking'
        });
    }
});

// ==================== SERVER ====================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 RideUET backend running on port ${PORT}`));