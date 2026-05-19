const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
    registrationNumber: {
        type: String,
        required: [true, 'Registration number is required'],
        unique: true,
        uppercase: true,
        trim: true
    },
    capacity: {
        type: Number,
        required: [true, 'Capacity is required'],
        min: [10, 'Capacity must be at least 10'],
        max: [60, 'Capacity cannot exceed 60']
    },
    facultyRows: {
        type: [Number],
        default: [1, 2],
        validate: {
            validator: function (rows) {
                return rows.every(row => row > 0 && row <= Math.ceil(this.capacity / 4));
            },
            message: 'Invalid faculty row numbers'
        }
    },
    status: {
        type: String,
        enum: ['active', 'maintenance', 'inactive'],
        default: 'active'
    },
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    features: {
        hasAC: { type: Boolean, default: false },
        hasWifi: { type: Boolean, default: false },
        isAccessible: { type: Boolean, default: false }
    }
}, {
    timestamps: true
});

// Virtual for seats per row
busSchema.virtual('seatsPerRow').get(function () {
    return 4; // Standard bus layout: 2 seats on each side
});

module.exports = mongoose.model('Bus', busSchema);
