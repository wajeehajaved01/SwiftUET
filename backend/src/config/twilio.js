const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

let client = null;

// Initialize Twilio client only if credentials are provided
if (accountSid && authToken) {
    client = twilio(accountSid, authToken);
    console.log('✅ Twilio client initialized');
} else {
    console.warn('⚠️  Twilio credentials not found. SMS notifications will be disabled.');
}

const sendSMS = async (to, message) => {
    if (!client) {
        console.log('📱 SMS (simulated):', { to, message });
        return { success: true, simulated: true };
    }

    try {
        const result = await client.messages.create({
            body: message,
            from: twilioPhoneNumber,
            to: to
        });

        console.log('✅ SMS sent:', result.sid);
        return { success: true, messageId: result.sid };
    } catch (error) {
        console.error('❌ SMS send failed:', error.message);
        throw error;
    }
};

module.exports = { sendSMS };
