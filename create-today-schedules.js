// Create Today's Schedules Script
// Run this in MongoDB shell (mongosh) to create schedules for today

// Instructions:
// 1. Open MongoDB shell: mongosh
// 2. Switch to database: use rideuet
// 3. Copy and paste this script

// Get today's date in YYYY-MM-DD format
const today = new Date().toISOString().split('T')[0];
print("📅 Today's date:", today);

// Get buses
const buses = db.buses.find({ status: "active" }).toArray();

if (buses.length === 0) {
    print("❌ Error: No active buses found. Please create buses first.");
    print("   Go to Admin Dashboard → Manage Buses → Add buses");
} else {
    print("✅ Found", buses.length, "active bus(es)");

    // Use the first bus
    const bus = buses[0];
    print("   Using bus:", bus.busNumber, "-", bus.route);

    // Check if schedules already exist for today
    const existingSchedules = db.schedules.countDocuments({ date: today });

    if (existingSchedules > 0) {
        print("\n⚠️  Warning:", existingSchedules, "schedule(s) already exist for today.");
        print("   Do you want to add more?");
        print("   To clear today's schedules first, run:");
        print("   db.schedules.deleteMany({ date: '" + today + "' })");
    }

    // Create sample schedules for today
    const schedules = [
        {
            busId: bus._id,
            date: today,
            departureTime: "08:00",
            arrivalTime: "09:00",
            route: "Main Campus to Hostels",
            status: "scheduled",
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            busId: bus._id,
            date: today,
            departureTime: "10:00",
            arrivalTime: "11:00",
            route: "Hostels to Engineering Block",
            status: "scheduled",
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            busId: bus._id,
            date: today,
            departureTime: "14:00",
            arrivalTime: "15:00",
            route: "Engineering to Library",
            status: "scheduled",
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            busId: bus._id,
            date: today,
            departureTime: "16:00",
            arrivalTime: "17:00",
            route: "Library to Main Campus",
            status: "scheduled",
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            busId: bus._id,
            date: today,
            departureTime: "18:00",
            arrivalTime: "19:00",
            route: "Main Campus to Hostels",
            status: "scheduled",
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ];

    print("\n🚀 Creating", schedules.length, "schedules for today...");

    try {
        const result = db.schedules.insertMany(schedules);
        print("✅ Success! Created", result.insertedIds.length, "schedules");

        print("\n📊 Today's Schedule Summary:");
        const todaySchedules = db.schedules.find({ date: today }).toArray();
        todaySchedules.forEach((schedule, index) => {
            print("   " + (index + 1) + ". " + schedule.departureTime + " - " + schedule.route + " (" + schedule.status + ")");
        });

        print("\n🎉 Today's schedules created successfully!");
        print("   Now login as student and go to /student to see them.");
        print("   Student can book seats from these schedules.");

    } catch (error) {
        print("❌ Error creating schedules:", error.message);
    }
}

// If you have multiple buses, create schedules for all of them
if (buses.length > 1) {
    print("\n💡 Tip: You have", buses.length, "buses.");
    print("   This script only created schedules for the first bus.");
    print("   To create schedules for other buses, modify the script or run:");
    print("   const bus2 = db.buses.findOne({ busNumber: 'BUS_NUMBER' })");
    print("   Then create schedules with bus2._id");
}

print("\n📝 Quick Commands:");
print("   View today's schedules: db.schedules.find({ date: '" + today + "' }).pretty()");
print("   Count today's schedules: db.schedules.countDocuments({ date: '" + today + "' })");
print("   Delete today's schedules: db.schedules.deleteMany({ date: '" + today + "' })");
print("   Update schedule status: db.schedules.updateOne({ _id: ObjectId('ID') }, { $set: { status: 'cancelled' } })");
