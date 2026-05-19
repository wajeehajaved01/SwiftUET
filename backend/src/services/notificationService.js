const Notification = require('../models/Notification');
const User = require('../models/User');
const { sendSMS } = require('../config/twilio');

// SMS message templates
const SMS_TEMPLATES = {
    BOOKING_CONFIRMED: (studentName, busNumber, departureTime) =>
        `RideUET: Booking confirmed for ${studentName}. Bus ${busNumber} departs at ${departureTime}. Track at rideuet.edu.pk`,

    BOOKING_CANCELLED: (studentName, busNumber) =>
        `RideUET: Booking cancelled for ${studentName} on bus ${busNumber}.`,

    TRIP_STARTED: (studentName, busNumber) =>
        `RideUET: ${studentName}'s bus ${busNumber} has started. Track live at rideuet.edu.pk`,

    TRIP_COMPLETED: (studentName, busNumber) =>
        `RideUET: ${studentName} has reached destination safely on bus ${busNumber}.`,

    TRIP_DELAYED: (studentName, busNumber, delay) =>
        `RideUET: Bus ${busNumber} delayed by ${delay} mins. ${studentName} will arrive late.`,

    EMERGENCY: (studentName, busNumber, message) =>
        `RideUET ALERT: ${message} - Bus ${busNumber}, Student: ${studentName}. Contact: 042-XXXXXXX`
};

// Notify parent about booking confirmation
exports.notifyBookingConfirmed = async (studentId, booking) => {
    try {
        const student = await User.findById(studentId).populate('parentId');

        if (!student.parentId) {
            console.log('No parent linked to student');
            return;
        }

        const schedule = await booking.populate({
            path: 'scheduleId',
            populate: { path: 'busId', select: 'registrationNumber' }
        });

        const message = SMS_TEMPLATES.BOOKING_CONFIRMED(
            student.firstName,
            schedule.scheduleId.busId.registrationNumber,
            new Date(schedule.scheduleId.departureTime).toLocaleTimeString()
        );

        await this.sendNotification(student.parentId._id, message, {
            bookingId: booking._id,
            scheduleId: booking.scheduleId
        });
    } catch (error) {
        console.error('Failed to send booking confirmation:', error);
    }
};

// Notify parent about booking cancellation
exports.notifyBookingCancelled = async (studentId, booking) => {
    try {
        const student = await User.findById(studentId).populate('parentId');

        if (!student.parentId) {
            return;
        }

        const schedule = await booking.populate({
            path: 'scheduleId',
            populate: { path: 'busId', select: 'registrationNumber' }
        });

        const message = SMS_TEMPLATES.BOOKING_CANCELLED(
            student.firstName,
            schedule.scheduleId.busId.registrationNumber
        );

        await this.sendNotification(student.parentId._id, message, {
            bookingId: booking._id,
            scheduleId: booking.scheduleId
        });
    } catch (error) {
        console.error('Failed to send cancellation notification:', error);
    }
};

// Send notification to a user
exports.sendNotification = async (recipientId, message, metadata = {}) => {
    try {
        const recipient = await User.findById(recipientId);

        if (!recipient) {
            throw new Error('Recipient not found');
        }

        // Create notification record
        const notification = await Notification.create({
            recipientId,
            type: 'sms',
            message,
            metadata,
            status: 'pending'
        });

        // Send SMS
        try {
            const result = await sendSMS(recipient.phoneNumber, message);

            notification.status = result.simulated ? 'sent' : 'delivered';
            notification.sentAt = new Date();
            if (result.messageId) {
                notification.metadata.messageId = result.messageId;
            }
            await notification.save();

            return notification;
        } catch (smsError) {
            notification.status = 'failed';
            notification.metadata.errorMessage = smsError.message;
            await notification.save();

            throw smsError;
        }
    } catch (error) {
        console.error('Failed to send notification:', error);
        throw error;
    }
};

// Broadcast notification to multiple users
exports.broadcastNotification = async (users, message, type = 'sms') => {
    const results = {
        success: 0,
        failed: 0
    };

    for (const user of users) {
        try {
            await this.sendNotification(user._id, message);
            results.success++;
        } catch (error) {
            results.failed++;
            console.error(`Failed to send to user ${user._id}:`, error);
        }
    }

    return results;
};
