/**
 * Seed Script for UET New Campus Routes
 * This script populates the database with actual UET route data
 * Source: UET New Campus Routes Document
 */

require('dotenv').config();
const mongoose = require('mongoose');

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rideuet';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ MongoDB Connected for seeding'))
    .catch(err => console.log('❌ MongoDB Error:', err));

// Define Schemas
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    firstName: String,
    lastName: String,
    role: String,
    phoneNumber: String,
    isFaculty: Boolean,
    isActive: Boolean
}, { timestamps: true });

const busSchema = new mongoose.Schema({
    busNumber: String,
    capacity: Number,
    route: String,
    status: String,
    driverName: String,
    driver: mongoose.Schema.Types.ObjectId
}, { timestamps: true });

const routeSchema = new mongoose.Schema({
    name: String,
    startPoint: String,
    endPoint: String,
    stops: [{
        name: String,
        time: String,
        order: Number
    }],
    status: String,
    estimatedDuration: Number
}, { timestamps: true });

const scheduleSchema = new mongoose.Schema({
    busId: mongoose.Schema.Types.ObjectId,
    routeId: mongoose.Schema.Types.ObjectId,
    driverId: mongoose.Schema.Types.ObjectId,
    date: String,
    departureTime: Date,
    arrivalTime: Date,
    status: String,
    availableSeats: Number,
    facultyRowsLocked: Boolean
}, { timestamps: true });

// Models
const User = mongoose.model('User', userSchema);
const Bus = mongoose.model('Bus', busSchema);
const Route = mongoose.model('Route', routeSchema);
const Schedule = mongoose.model('Schedule', scheduleSchema);

// UET Routes Data from Document
const uetRoutesData = [
    {
        routeNumber: '01',
        driverName: 'Mr. Ejaz Ahmed',
        driverPhone: '0323-4513997',
        vehicleNumber: 'LEJ-148',
        stops: [
            { name: 'Harbanspura', time: '6:50', order: 1 },
            { name: 'Madina Town Chungi Amarsudu', time: '', order: 2 },
            { name: 'Taj Bagh', time: '7:05', order: 3 },
            { name: 'Fateh Garh', time: '', order: 4 },
            { name: 'New Pull', time: '', order: 5 },
            { name: 'Lal Pul', time: '7:10', order: 6 },
            { name: 'Mughal Pura', time: '', order: 7 },
            { name: 'Dharam Pura', time: '', order: 8 },
            { name: 'New Campus', time: '7:50', order: 9 }
        ]
    },
    {
        routeNumber: '02',
        driverName: 'Mr. Abdul Basit',
        driverPhone: '0308-4973489',
        vehicleNumber: 'LEA-6833',
        stops: [
            { name: 'Nishtar Colony', time: '6:30', order: 1 },
            { name: 'General Hospital', time: '6:40', order: 2 },
            { name: 'Qanchi Stop', time: '', order: 3 },
            { name: 'Walton Stop', time: '', order: 4 },
            { name: 'Defence morr', time: '6:45', order: 5 },
            { name: 'Firdous Market', time: '', order: 6 },
            { name: 'Hussain chowk', time: '', order: 7 },
            { name: 'Kalma Chowk', time: '7:00', order: 8 },
            { name: 'Ichra', time: '', order: 9 },
            { name: 'Qartba Chowk', time: '', order: 10 },
            { name: 'New Campus', time: '7:50', order: 11 }
        ]
    },
    {
        routeNumber: '03',
        driverName: 'Mr. M. Sibtain',
        driverPhone: '0305-4143017',
        vehicleNumber: 'LEJ-143',
        stops: [
            { name: 'Mochi pura', time: '6:30', order: 1 },
            { name: 'Akbar chowk', time: '', order: 2 },
            { name: 'M. Ali chowk', time: '', order: 3 },
            { name: 'Khokhar chowk', time: '', order: 4 },
            { name: 'Al-Jannat Chowk', time: '', order: 5 },
            { name: 'Ameer Chowk', time: '6:45', order: 6 },
            { name: 'Butt chowk', time: '', order: 7 },
            { name: 'Ghazi chowk', time: '', order: 8 },
            { name: 'Wapda Town', time: '6:50', order: 9 },
            { name: 'Abu bakar chowk', time: '', order: 10 },
            { name: 'Edhi Road', time: '7:00', order: 11 },
            { name: 'New Campus', time: '7:50', order: 12 }
        ]
    },
    {
        routeNumber: '04',
        driverName: 'Zahid Mehmood',
        driverPhone: '0321-4990158',
        vehicleNumber: 'LZR-2351',
        stops: [
            { name: 'Muslim Town', time: '6:40', order: 1 },
            { name: 'Naqsha Stop', time: '', order: 2 },
            { name: 'Baikhe wala', time: '', order: 3 },
            { name: 'Wahdat Road', time: '', order: 4 },
            { name: 'Raza Block', time: '6:50', order: 5 },
            { name: 'Kharak Stop', time: '', order: 6 },
            { name: 'Liaqat chowk', time: '7:00', order: 7 },
            { name: 'Sabza Zar', time: '', order: 8 },
            { name: 'Babu Sabu', time: '7:10', order: 9 },
            { name: 'Shahdara Station', time: '', order: 10 },
            { name: 'New Campus', time: '7:50', order: 11 }
        ]
    },
    {
        routeNumber: '05',
        driverName: 'Mr. M. Arshad',
        driverPhone: '0322-4250804',
        vehicleNumber: 'LZB-2607',
        stops: [
            { name: 'Flat Stop', time: '6:40', order: 1 },
            { name: 'Scheme Morr', time: '', order: 2 },
            { name: 'Yateem Khana', time: '', order: 3 },
            { name: 'Morr Samanabad', time: '7:00', order: 4 },
            { name: 'Chowk Chaburji', time: '', order: 5 },
            { name: 'MAO College', time: '', order: 6 },
            { name: 'Secretariat', time: '', order: 7 },
            { name: 'Data Darbar', time: '', order: 8 },
            { name: 'Sheran wala', time: '', order: 9 },
            { name: 'New Campus', time: '7:50', order: 10 }
        ]
    },
    {
        routeNumber: '06',
        driverName: 'Mr. Rehmat Ali',
        driverPhone: '0300-4112131',
        vehicleNumber: 'LRT-2034',
        stops: [
            { name: 'Ravi Hotel', time: '6:30', order: 1 },
            { name: 'Allah Hoo chowk', time: '', order: 2 },
            { name: 'Shadewal chowk', time: '', order: 3 },
            { name: 'G-I Market', time: '6:45', order: 4 },
            { name: 'Khokhar chowk', time: '', order: 5 },
            { name: 'Expo Center', time: '', order: 6 },
            { name: 'Thokar Niaz baig', time: '7:00', order: 7 },
            { name: 'New Campus', time: '7:50', order: 8 }
        ]
    },
    {
        routeNumber: '07',
        driverName: 'Mr. M. Nasir',
        driverPhone: '0300-8104930',
        vehicleNumber: 'LZR-2349',
        stops: [
            { name: 'Burj Attari', time: '6:50', order: 1 },
            { name: 'Faiz Pur', time: '', order: 2 },
            { name: 'Phool Mandi', time: '7:00', order: 3 },
            { name: 'Begum Kot', time: '7:20', order: 4 },
            { name: 'Shahdara', time: '', order: 5 },
            { name: 'Kashmir Park', time: '', order: 6 },
            { name: 'Machis Factory', time: '7:30', order: 7 },
            { name: 'Imamia colony', time: '', order: 8 },
            { name: 'Rachna Town', time: '', order: 9 },
            { name: 'Haider road', time: '', order: 10 },
            { name: 'Rana town', time: '', order: 11 },
            { name: 'New Campus', time: '7:50', order: 12 }
        ]
    },
    {
        routeNumber: '08',
        driverName: 'Mr. Khadim Hussain',
        driverPhone: '0322-3899181',
        vehicleNumber: 'LEE-9715',
        stops: [
            { name: 'Bismillah scheme', time: '6:30', order: 1 },
            { name: 'Yadgar Shuhda', time: '6:40', order: 2 },
            { name: 'Adda Shabeel', time: '', order: 3 },
            { name: 'Salamat Pura', time: '', order: 4 },
            { name: 'Darogawala', time: '6:55', order: 5 },
            { name: 'Akhri minute', time: '', order: 6 },
            { name: 'Souk Nahar', time: '', order: 7 },
            { name: 'Shalimar chowk', time: '7:00', order: 8 },
            { name: 'Gaas mandi', time: '', order: 9 },
            { name: 'Singh pura', time: '', order: 10 },
            { name: 'New Campus', time: '7:50', order: 11 }
        ]
    },
    {
        routeNumber: '09',
        driverName: 'Mr. M. Arif',
        driverPhone: '0300-4797349',
        vehicleNumber: 'LZB-2606',
        stops: [
            { name: 'Chan da qilla', time: '6:40', order: 1 },
            { name: 'Kamoki', time: '', order: 2 },
            { name: 'Sadhoki', time: '7:05', order: 3 },
            { name: 'Muridkey', time: '7:30', order: 4 },
            { name: 'Ravi Riyan', time: '', order: 5 },
            { name: 'Ittehad Chemical', time: '', order: 6 },
            { name: 'S.A Garden', time: '', order: 7 },
            { name: 'New Campus', time: '7:50', order: 8 }
        ]
    },
    {
        routeNumber: '10',
        driverName: 'Mr. Ansar Majeed',
        driverPhone: '0300-8831159',
        vehicleNumber: 'LRT-2036',
        stops: [
            { name: 'Ghazi Road', time: '6:30', order: 1 },
            { name: 'Bhatta chowk', time: '6:45', order: 2 },
            { name: 'Barki Interchange', time: '', order: 3 },
            { name: 'Ranger Hadquarter', time: '', order: 4 },
            { name: 'Murgi Khana', time: '', order: 5 },
            { name: 'Askari 9', time: '7:10', order: 6 },
            { name: 'Sadar Gol Chakar', time: '', order: 7 },
            { name: 'Ghari Shahu', time: '', order: 8 },
            { name: 'Railway station', time: '7:25', order: 9 },
            { name: 'New Campus', time: '7:50', order: 10 }
        ]
    },
    {
        routeNumber: '11',
        driverName: 'Driver 11',
        driverPhone: '0300-0000011',
        vehicleNumber: 'UET-011',
        stops: [
            { name: 'Main Campus', time: '7:00', order: 1 },
            { name: 'Tezab Ehata', time: '', order: 2 },
            { name: 'Station stairs', time: '', order: 3 },
            { name: 'Do Moria Pull', time: '7:10', order: 4 },
            { name: 'Lari adda', time: '', order: 5 },
            { name: 'Yadgar Chowk', time: '', order: 6 },
            { name: 'Timber market', time: '7:15', order: 7 },
            { name: 'Batti chowk', time: '', order: 8 },
            { name: 'New Campus', time: '7:50', order: 9 }
        ]
    },
    {
        routeNumber: '12',
        driverName: 'Driver 12',
        driverPhone: '0300-0000012',
        vehicleNumber: 'UET-012',
        stops: [
            { name: 'Main Campus', time: '7:00', order: 1 },
            { name: 'Tezab Ehata', time: '', order: 2 },
            { name: 'Station stairs', time: '', order: 3 },
            { name: 'Do Moria Pull', time: '7:10', order: 4 },
            { name: 'Lari adda', time: '', order: 5 },
            { name: 'Yadgar Chowk', time: '', order: 6 },
            { name: 'Timber market', time: '7:15', order: 7 },
            { name: 'Batti chowk', time: '', order: 8 },
            { name: 'New Campus', time: '7:50', order: 9 }
        ]
    },
    {
        routeNumber: '13',
        driverName: 'Driver 13',
        driverPhone: '0300-0000013',
        vehicleNumber: 'UET-013',
        stops: [
            { name: 'Main Campus', time: '7:00', order: 1 },
            { name: 'Tezab Ehata', time: '', order: 2 },
            { name: 'Station stairs', time: '', order: 3 },
            { name: 'Do Moria Pull', time: '7:10', order: 4 },
            { name: 'Lari adda', time: '', order: 5 },
            { name: 'Yadgar Chowk', time: '', order: 6 },
            { name: 'Timber market', time: '7:15', order: 7 },
            { name: 'Batti chowk', time: '', order: 8 },
            { name: 'New Campus', time: '7:50', order: 9 }
        ]
    },
    {
        routeNumber: '14',
        driverName: 'Driver 14',
        driverPhone: '0300-0000014',
        vehicleNumber: 'UET-014',
        stops: [
            { name: 'Main Campus', time: '7:00', order: 1 },
            { name: 'Tezab Ehata', time: '', order: 2 },
            { name: 'Station stairs', time: '', order: 3 },
            { name: 'Do Moria Pull', time: '7:10', order: 4 },
            { name: 'Lari adda', time: '', order: 5 },
            { name: 'Yadgar Chowk', time: '', order: 6 },
            { name: 'Timber market', time: '7:15', order: 7 },
            { name: 'Batti chowk', time: '', order: 8 },
            { name: 'New Campus', time: '7:50', order: 9 }
        ]
    },
    {
        routeNumber: '15',
        driverName: 'Driver 15',
        driverPhone: '0300-0000015',
        vehicleNumber: 'UET-015',
        stops: [
            { name: 'Main Campus', time: '7:00', order: 1 },
            { name: 'Tezab Ehata', time: '', order: 2 },
            { name: 'Station stairs', time: '', order: 3 },
            { name: 'Do Moria Pull', time: '7:10', order: 4 },
            { name: 'Lari adda', time: '', order: 5 },
            { name: 'Yadgar Chowk', time: '', order: 6 },
            { name: 'Timber market', time: '7:15', order: 7 },
            { name: 'Batti chowk', time: '', order: 8 },
            { name: 'New Campus', time: '7:50', order: 9 }
        ]
    }
];

// Seed Function
async function seedUETRoutes() {
    try {
        console.log('🌱 Starting UET Routes Seeding...\n');

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await Route.deleteMany({});
        await Bus.deleteMany({});
        await User.deleteMany({ role: 'driver' });
        console.log('✅ Existing data cleared\n');

        const bcrypt = require('bcryptjs');
        const createdDrivers = [];
        const createdBuses = [];
        const createdRoutes = [];

        // Create drivers, buses, and routes
        for (const routeData of uetRoutesData) {
            console.log(`📍 Processing Route ${routeData.routeNumber}...`);

            // Create Driver User
            const hashedPassword = await bcrypt.hash('driver123', 10);
            const driver = await User.create({
                email: `driver${routeData.routeNumber}@uet.edu.pk`,
                password: hashedPassword,
                firstName: routeData.driverName.split(' ')[0],
                lastName: routeData.driverName.split(' ').slice(1).join(' '),
                role: 'driver',
                phoneNumber: `+92${routeData.driverPhone.replace(/^0/, '')}`,
                isFaculty: false,
                isActive: true
            });
            createdDrivers.push(driver);
            console.log(`   ✅ Driver created: ${driver.email}`);

            // Create Route
            const startStop = routeData.stops[0].name;
            const endStop = 'New Campus';
            const route = await Route.create({
                name: `Route ${routeData.routeNumber}: ${startStop} → New Campus`,
                startPoint: startStop,
                endPoint: endStop,
                stops: routeData.stops,
                status: 'active',
                estimatedDuration: 60 // minutes
            });
            createdRoutes.push(route);
            console.log(`   ✅ Route created: ${route.name}`);

            // Create Bus
            const bus = await Bus.create({
                busNumber: routeData.vehicleNumber,
                capacity: 40,
                route: route.name,
                status: 'active',
                driverName: routeData.driverName,
                driver: driver._id
            });
            createdBuses.push(bus);
            console.log(`   ✅ Bus created: ${bus.busNumber}\n`);
        }

        // Create schedules for today and next 7 days
        console.log('📅 Creating schedules for next 7 days...\n');
        const today = new Date();

        for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
            const scheduleDate = new Date(today);
            scheduleDate.setDate(today.getDate() + dayOffset);
            const dateString = scheduleDate.toISOString().split('T')[0];

            for (let i = 0; i < createdRoutes.length; i++) {
                const route = createdRoutes[i];
                const bus = createdBuses[i];
                const driver = createdDrivers[i];

                // Morning schedule (7:50 AM arrival)
                const departureTime = new Date(scheduleDate);
                departureTime.setHours(6, 30, 0, 0);

                const arrivalTime = new Date(scheduleDate);
                arrivalTime.setHours(7, 50, 0, 0);

                await Schedule.create({
                    busId: bus._id,
                    routeId: route._id,
                    driverId: driver._id,
                    date: dateString,
                    departureTime: departureTime,
                    arrivalTime: arrivalTime,
                    status: 'scheduled',
                    availableSeats: 40,
                    facultyRowsLocked: true
                });
            }
            console.log(`   ✅ Schedules created for ${dateString}`);
        }

        // Summary
        console.log('\n' + '='.repeat(60));
        console.log('🎉 UET ROUTES SEEDING COMPLETED SUCCESSFULLY!');
        console.log('='.repeat(60));
        console.log(`📊 Summary:`);
        console.log(`   • Drivers created: ${createdDrivers.length}`);
        console.log(`   • Buses created: ${createdBuses.length}`);
        console.log(`   • Routes created: ${createdRoutes.length}`);
        console.log(`   • Schedules created: ${createdRoutes.length * 7}`);
        console.log('='.repeat(60));
        console.log('\n📝 Driver Login Credentials:');
        console.log('   Email: driver01@uet.edu.pk to driver15@uet.edu.pk');
        console.log('   Password: driver123');
        console.log('='.repeat(60));

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding UET routes:', error);
        process.exit(1);
    }
}

// Run seeding
seedUETRoutes();
