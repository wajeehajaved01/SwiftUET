const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    busId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bus',
        required: [true, 'Bus is required']
    },
    routeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Route',
        required: [true, 'Route is required']
    },
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Driver is required']
    },
    departureTime: {
        type: Date,
        required: [true, 'Departure time is required']
    },
    arrivalTime: {
        type: Date,
        required: [true, 'Arrival time is required']
    },
    date: {
        type: String,
        required: [true, 'Date is required'],
        match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format']
    },
    status: {
        type: String,
        enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
        default: 'scheduled'
    },
    availableSeats: {
        type: Number,
        required: true
    },
    facultyRowsLocked: {
        type: Boolean,
        default: true
    },
    actualDepartureTime: Date,
    actualArrivalTime: Date
}, {
    timestamps: true
});

// Validate arrival time is after departure time
scheduleSchema.pre('save', function (next) {
    if (this.arrivalTime <= this.departureTime) {
        next(new Error('Arrival time must be after departure time'));
    }
    next();
});

// Index for efficient queries
scheduleSchema.index({ date: 1, departureTime: 1 });
scheduleSchema.index({ busId: 1, date: 1 });
scheduleSchema.index({ status: 1, date: 1 });

module.exports = mongoose.model('Schedule', scheduleSchema);
