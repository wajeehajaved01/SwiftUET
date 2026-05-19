// Sample Bookings Creator Script
// Run this in MongoDB shell (mongosh) to create test bookings

// Instructions:
// 1. Open MongoDB shell: mongosh
// 2. Switch to database: use rideuet
// 3. Copy and paste this script

// Get required IDs
const student1 = db.users.findOne({ email: "ahmed.student@uet.edu.pk" });
const schedules = db.schedules.find().toArray();

if (!student1) {
    print("❌ Error: Student user not found. Please create a student account first.");
    print("   Email: ahmed.student@uet.edu.pk");
} else if (schedules.length === 0) {
    print("❌ Error: No schedules found. Please create schedules first.");
} else {
    print("✅ Found student:", student1.firstName, student1.lastName);
    print("✅ Found", schedules.length, "schedule(s)");

    // Use the first schedule
    const schedule = schedules[0];

    print("\n📅 Using schedule:");
    print("   Bus:", schedule.busId);
    print("   Date:", schedule.date);
    print("   Route:", schedule.route);

    // Create sample bookings
    const sampleBookings = [
        {
            studentId: student1._id,
            studentName: `${student1.firstName} ${student1.lastName}`,
            scheduleId: schedule._id,
            seatNumber: "A1",
            status: "booked",
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            studentId: student1._id,
            studentName: `${student1.firstName} ${student1.lastName}`,
            scheduleId: schedule._id,
            seatNumber: "A2",
            status: "picked-up",
            createdAt: new Date(Date.now() - 86400000), // Yesterday
            updatedAt: new Date()
        },
        {
            studentId: student1._id,
            studentName: `${student1.firstName} ${student1.lastName}`,
            scheduleId: schedule._id,
            seatNumber: "A3",
            status: "cancelled",
            createdAt: new Date(Date.now() - 172800000), // 2 days ago
            updatedAt: new Date()
        },
        {
            studentId: student1._id,
            studentName: `${student1.firstName} ${student1.lastName}`,
            scheduleId: schedule._id,
            seatNumber: "B1",
            status: "booked",
            createdAt: new Date(Date.now() - 3600000), // 1 hour ago
            updatedAt: new Date()
        },
        {
            studentId: student1._id,
            studentName: `${student1.firstName} ${student1.lastName}`,
            scheduleId: schedule._id,
            seatNumber: "B2",
            status: "picked-up",
            createdAt: new Date(Date.now() - 259200000), // 3 days ago
            updatedAt: new Date()
        }
    ];

    // Check if bookings already exist
    const existingBookings = db.bookings.countDocuments();

    if (existingBookings > 0) {
        print("\n⚠️  Warning:", existingBookings, "booking(s) already exist.");
        print("   Do you want to add more? (You may get duplicate seat errors)");
        print("   To clear existing bookings first, run: db.bookings.deleteMany({})");
    }

    print("\n🚀 Creating", sampleBookings.length, "sample bookings...");

    try {
        const result = db.bookings.insertMany(sampleBookings);
        print("✅ Success! Created", result.insertedIds.length, "bookings");

        print("\n📊 Booking Summary:");
        print("   Total:", db.bookings.countDocuments());
        print("   Booked:", db.bookings.countDocuments({ status: "booked" }));
        print("   Picked Up:", db.bookings.countDocuments({ status: "picked-up" }));
        print("   Cancelled:", db.bookings.countDocuments({ status: "cancelled" }));

        print("\n🎉 Sample bookings created successfully!");
        print("   Now login as admin and go to /admin/bookings to view them.");

    } catch (error) {
        print("❌ Error creating bookings:", error.message);
        if (error.message.includes("duplicate")) {
            print("   Some seats are already booked. Try different seat numbers.");
        }
    }
}

print("\n📝 Quick Commands:");
print("   View all bookings: db.bookings.find().pretty()");
print("   Count bookings: db.bookings.countDocuments()");
print("   Delete all bookings: db.bookings.deleteMany({})");
print("   Delete by status: db.bookings.deleteMany({ status: 'cancelled' })");
