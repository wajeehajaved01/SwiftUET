// Twilio disabled for development
// Will be enabled when real credentials are added

const sendSMS = async (to, message) => {
  console.log(`[SMS DISABLED] To: ${to}, Message: ${message}`);
  return { success: true, message: 'SMS disabled in development' };
};

module.exports = { sendSMS };