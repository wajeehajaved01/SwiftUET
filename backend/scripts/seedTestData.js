const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../src/models/User');
const Bus = require('../src/models/Bus');
const Route = require('../src/models/Route');
const Location = require('../src/models/Location');
const Schedule = require('../src/models/Schedule');
const Booking = require('../src/models/Booking');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rideuet', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const seedData = async () => {
    try {
        console.log('🌱 Starting database seeding...\n');

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await User.deleteMany({});
        await Bus.deleteMany({});
        await Route.deleteMany({});
        await Location.deleteMany({});
        await Schedule.deleteMany({});
        await Booking.deleteMany({});
        console.log('✅ Existing data cleared\n');

        // Create test users
        console.log('👥 Creating test users...');
        const hashedPassword = await bcrypt.hash('password123', 10);

        const admin = await User.create({
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@uet.edu.pk',
            password: hashedPassword,
            phone: '+923001234567',
            role: 'admin'
        });

        const driver1 = await User.create({
            firstName: 'Ahmed',
            lastName: 'Khan',
            email: 'driver1@uet.edu.pk',
            password: hashedPassword,
            phone: '+923001234568',
            role: 'driver'
        });

        const driver2 = await User.create({
            firstName: 'Muhammad',
            lastName: 'Ali',
            email: 'driver2@uet.edu.pk',
            password: hashedPassword,
            phone: '+923001234569',
            role: 'driver'
        });

        const students = [];
        for (let i = 1; i <= 10; i++) {
            const student = await User.create({
                firstName: `Student${i}`,
                lastName: 'Test',
                email: `student${i}@uet.edu.pk`,
                password: hashedPassword,
                phone: `+92300123456${i}`,
                role: 'student'
            });
            students.push(student);
        }

        const parent = await User.create({
            firstName: 'Parent',
            lastName: 'User',
            email: 'parent@uet.edu.pk',
            password: hashedPassword,
            phone: '+923001234570',
            role: 'parent'
        });

        console.log('✅ Test users created');
        console.log(`   - Admin: admin@uet.edu.pk / password123`);
        console.log(`   - Driver 1: driver1@uet.edu.pk / password123`);
        console.log(`   - Driver 2: driver2@uet.edu.pk / password123`);
        console.log(`   - Students: student1-10@uet.edu.pk / password123`);
        console.log(`   - Parent: parent@uet.edu.pk / password123\n`);

        // Create buses
        console.log('🚌 Creating buses...');
        const bus1 = await Bus.create({
            number: 'UET-001',
            registrationNumber: 'LHR-2024-001',
            capacity: 40,
            status: 'active',
            driver: driver1._id
        });

        const bus2 = await Bus.create({
            number: 'UET-002',
            registrationNumber: 'LHR-2024-002',
            capacity: 40,
            status: 'active',
            driver: driver2._id
        });

        console.log('✅ Buses created\n');

        // Create routes
        console.log('🗺️  Creating routes...');
        const route1 = await Route.create({
            name: 'Main Campus ↔ KSK',
            description: 'Main route between Main Campus and KSK Campus',
            stops: [
                {
                    name: 'Main Campus Gate',
                    latitude: 31.5204,
                    longitude: 74.3587,
                    order: 1
                },
                {
                    name: 'Canal Road Stop',
                    latitude: 31.5150,
                    longitude: 74.3500,
                    order: 2
                },
                {
                    name: 'KSK Campus',
                    latitude: 31.4825,
                    longitude: 74.3239,
                    order: 3
                }
            ],
            status: 'active'
        });

        const route2 = await Route.create({
            name: 'Main Campus ↔ City Campus',
            description: 'Route connecting Main Campus to City Campus',
            stops: [
                {
                    name: 'Main Campus Gate',
                    latitude: 31.5204,
                    longitude: 74.3587,
                    order: 1
                },
                {
                    name: 'Mall Road',
                    latitude: 31.5656,
                    longitude: 74.3242,
                    order: 2
                },
                {
                    name: 'City Campus',
                    latitude: 31.5825,
                    longitude: 74.3239,
                    order: 3
                }
            ],
            status: 'active'
        });

        console.log('✅ Routes created\n');

        // Create schedules
        console.log('📅 Creating schedules...');
        const today = new Date();
        today.setHours(8, 0, 0, 0);

        const schedule1 = await Schedule.create({
            route: route1._id,
            bus: bus1._id,
            driver: driver1._id,
            departureTime: new Date(today.getTime() + 60 * 60 * 1000), // 1 hour from now
            estimatedArrival: new Date(today.getTime() + 90 * 60 * 1000), // 1.5 hours from now
            availableSeats: 37, // 40 - 3 faculty rows
            status: 'scheduled'
        });

        const schedule2 = await Schedule.create({
            route: route2._id,
            bus: bus2._id,
            driver: driver2._id,
            departureTime: new Date(today.getTime() + 120 * 60 * 1000), // 2 hours from now
            estimatedArrival: new Date(today.getTime() + 150 * 60 * 1000), // 2.5 hours from now
            availableSeats: 37,
            status: 'scheduled'
        });

        console.log('✅ Schedules created\n');

        // Create sample bookings
        console.log('🎫 Creating sample bookings...');
        const booking1 = await Booking.create({
            user: students[0]._id,
            schedule: schedule1._id,
            seatNumber: '4A',
            status: 'confirmed'
        });

        const booking2 = await Booking.create({
            user: students[1]._id,
            schedule: schedule1._id,
            seatNumber: '4B',
            status: 'confirmed'
        });

        const booking3 = await Booking.create({
            user: students[2]._id,
            schedule: schedule2._id,
            seatNumber: '5A',
            status: 'confirmed'
        });

        console.log('✅ Sample bookings created\n');

        // Create current location for bus
        console.log('📍 Creating bus location...');
        await Location.create({
            bus: bus1._id,
            driver: driver1._id,
            latitude: 31.5204,
            longitude: 74.3587,
            speed: 0,
            heading: 0,
            timestamp: new Date()
        });

        console.log('✅ Bus location created\n');

        console.log('🎉 Database seeding completed successfully!\n');
        console.log('📝 Summary:');
        console.log(`   - Users: ${await User.countDocuments()}`);
        console.log(`   - Buses: ${await Bus.countDocuments()}`);
        console.log(`   - Routes: ${await Route.countDocuments()}`);
        console.log(`   - Schedules: ${await Schedule.countDocuments()}`);
        console.log(`   - Bookings: ${await Booking.countDocuments()}`);
        console.log(`   - Locations: ${await Location.countDocuments()}\n`);

        console.log('🚀 You can now login with:');
        console.log('   Email: admin@uet.edu.pk');
        console.log('   Password: password123\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedData();
