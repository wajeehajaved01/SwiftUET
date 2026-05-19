// Quick test script to verify registration endpoint
const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testRegistration() {
    console.log('🧪 Testing RideUET Registration...\n');

    // Test data for different roles
    const testUsers = [
        {
            firstName: 'Ahmed',
            lastName: 'Khan',
            email: 'ahmed.student@uet.edu.pk',
            password: 'password123',
            phoneNumber: '+923001234567',
            role: 'student',
            isFaculty: false
        },
        {
            firstName: 'Ali',
            lastName: 'Hassan',
            email: 'ali.driver@uet.edu.pk',
            password: 'password123',
            phoneNumber: '+923001234568',
            role: 'driver'
        },
        {
            firstName: 'Sara',
            lastName: 'Ahmed',
            email: 'sara.admin@uet.edu.pk',
            password: 'password123',
            phoneNumber: '+923001234569',
            role: 'admin'
        },
        {
            firstName: 'Fatima',
            lastName: 'Ali',
            email: 'fatima.parent@uet.edu.pk',
            password: 'password123',
            phoneNumber: '+923001234570',
            role: 'parent'
        }
    ];

    for (const user of testUsers) {
        try {
            console.log(`Testing ${user.role} registration...`);
            const response = await axios.post(`${API_URL}/auth/register`, user);

            if (response.data.success) {
                console.log(`✅ ${user.role} registered successfully!`);
                console.log(`   Email: ${user.email}`);
                console.log(`   Token: ${response.data.data.token.substring(0, 20)}...`);
            }
        } catch (error) {
            if (error.response?.data?.error === 'Email already registered') {
                console.log(`⚠️  ${user.role} already registered (${user.email})`);
            } else {
                console.log(`❌ ${user.role} registration failed:`);
                console.log(`   Error: ${error.response?.data?.error || error.message}`);
            }
        }
        console.log('');
    }

    console.log('✅ Registration test complete!\n');
    console.log('You can now login with any of these accounts:');
    console.log('Password for all: password123\n');
    testUsers.forEach(u => console.log(`${u.role.padEnd(10)} - ${u.email}`));
}

// Run the test
testRegistration().catch(console.error);
