const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    busId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bus',
        required: [true, 'Bus is required']
    },
    scheduleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Schedule'
    },
    latitude: {
        type: Number,
        required: [true, 'Latitude is required'],
        min: -90,
        max: 90
    },
    longitude: {
        type: Number,
        required: [true, 'Longitude is required'],
        min: -180,
        max: 180
    },
    speed: {
        type: Number,
        default: 0,
        min: 0
    },
    heading: {
        type: Number,
        min: 0,
        max: 360
    },
    accuracy: {
        type: Number,
        default: 10
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// TTL index - automatically delete old locations after 7 days
locationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 604800 });

// Index for efficient queries
locationSchema.index({ busId: 1, timestamp: -1 });
locationSchema.index({ scheduleId: 1, timestamp: -1 });

module.exports = mongoose.model('Location', locationSchema);
