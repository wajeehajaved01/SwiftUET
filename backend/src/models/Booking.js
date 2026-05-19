const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Student is required']
    },
    scheduleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Schedule',
        required: [true, 'Schedule is required']
    },
    seatNumber: {
        type: Number,
        required: [true, 'Seat number is required'],
        min: 1
    },
    status: {
        type: String,
        enum: ['confirmed', 'cancelled', 'completed', 'no-show'],
        default: 'confirmed'
    },
    pickupStopId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Pickup stop is required']
    },
    dropoffStopId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Dropoff stop is required']
    },
    cancelledAt: Date,
    cancellationReason: String
}, {
    timestamps: true
});

// Compound index to prevent duplicate bookings
bookingSchema.index({ studentId: 1, scheduleId: 1 }, {
    unique: true,
    partialFilterExpression: { status: 'confirmed' }
});

// Index for efficient queries
bookingSchema.index({ scheduleId: 1, seatNumber: 1 });
bookingSchema.index({ studentId: 1, createdAt: -1 });

module.exports = mongoose.model('Booking', bookingSchema);
