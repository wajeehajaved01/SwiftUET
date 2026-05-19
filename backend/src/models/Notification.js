const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Recipient is required']
    },
    type: {
        type: String,
        enum: ['sms', 'push', 'email'],
        default: 'sms'
    },
    message: {
        type: String,
        required: [true, 'Message is required']
    },
    status: {
        type: String,
        enum: ['pending', 'sent', 'failed', 'delivered'],
        default: 'pending'
    },
    metadata: {
        bookingId: mongoose.Schema.Types.ObjectId,
        scheduleId: mongoose.Schema.Types.ObjectId,
        messageId: String,
        errorMessage: String
    },
    sentAt: Date,
    deliveredAt: Date
}, {
    timestamps: true
});

// TTL index - automatically delete old notifications after 30 days
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

// Index for efficient queries
notificationSchema.index({ recipientId: 1, createdAt: -1 });
notificationSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
