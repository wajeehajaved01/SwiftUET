const mongoose = require('mongoose');

const stopSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    latitude: {
        type: Number,
        required: true,
        min: -90,
        max: 90
    },
    longitude: {
        type: Number,
        required: true,
        min: -180,
        max: 180
    },
    order: {
        type: Number,
        required: true
    }
}, { _id: true });

const routeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Route name is required'],
        trim: true
    },
    stops: {
        type: [stopSchema],
        validate: {
            validator: function (stops) {
                return stops.length >= 2;
            },
            message: 'Route must have at least 2 stops'
        }
    },
    distance: {
        type: Number,
        required: [true, 'Distance is required'],
        min: 0
    },
    estimatedDuration: {
        type: Number,
        required: [true, 'Estimated duration is required'],
        min: 1
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Sort stops by order before saving
routeSchema.pre('save', function (next) {
    if (this.stops && this.stops.length > 0) {
        this.stops.sort((a, b) => a.order - b.order);
    }
    next();
});

module.exports = mongoose.model('Route', routeSchema);
