const fs = require('fs');
const path = require('path');

console.log('🔍 SwiftUET Setup Verification\n');
console.log('='.repeat(50));

let allGood = true;

// Check Node.js version
console.log('\n📦 Checking Node.js...');
const nodeVersion = process.version;
console.log(`   Node.js version: ${nodeVersion}`);
if (parseInt(nodeVersion.slice(1)) < 14) {
    console.log('   ⚠️  Warning: Node.js 14+ recommended');
    allGood = false;
} else {
    console.log('   ✅ Node.js version OK');
}

// Check directories
console.log('\n📁 Checking project structure...');
const requiredDirs = [
    'backend',
    'frontend',
    'backend/src',
    'frontend/src',
    'frontend/src/pages',
    'frontend/src/components'
];

requiredDirs.forEach(dir => {
    if (fs.existsSync(path.join(__dirname, dir))) {
        console.log(`   ✅ ${dir}`);
    } else {
        console.log(`   ❌ ${dir} - MISSING`);
        allGood = false;
    }
});

// Check backend files
console.log('\n🔧 Checking backend files...');
const backendFiles = [
    'backend/package.json',
    'backend/src/server.js',
    'backend/src/config/database.js',
    'backend/scripts/seedTestData.js'
];

backendFiles.forEach(file => {
    if (fs.existsSync(path.join(__dirname, file))) {
        console.log(`   ✅ ${file}`);
    } else {
        console.log(`   ❌ ${file} - MISSING`);
        allGood = false;
    }
});

// Check frontend files
console.log('\n⚛️  Checking frontend files...');
const frontendFiles = [
    'frontend/package.json',
    'frontend/src/App.js',
    'frontend/src/index.css',
    'frontend/src/App.css',
    'frontend/src/pages/Login.js',
    'frontend/src/pages/student/StudentDashboard.js',
    'frontend/src/pages/driver/DriverDashboard.js',
    'frontend/src/pages/admin/AdminDashboard.js',
    'frontend/src/pages/parent/ParentTracking.js',
    'frontend/src/components/common/Navbar.js',
    'frontend/src/components/student/SeatBookingModal.js',
    'frontend/src/components/admin/AnalyticsTab.js',
    'frontend/src/components/admin/ManagementTab.js',
    'frontend/src/components/admin/BroadcastTab.js',
    'frontend/src/services/api.js'
];

frontendFiles.forEach(file => {
    if (fs.existsSync(path.join(__dirname, file))) {
        console.log(`   ✅ ${file}`);
    } else {
        console.log(`   ❌ ${file} - MISSING`);
        allGood = false;
    }
});

// Check CSS files
console.log('\n🎨 Checking CSS files...');
const cssFiles = [
    'frontend/src/pages/Login.css',
    'frontend/src/pages/student/StudentDashboard.css',
    'frontend/src/pages/driver/DriverDashboard.css',
    'frontend/src/pages/admin/AdminDashboard.css',
    'frontend/src/pages/parent/ParentTracking.css',
    'frontend/src/components/common/Navbar.css',
    'frontend/src/components/student/SeatBookingModal.css',
    'frontend/src/components/admin/AnalyticsTab.css',
    'frontend/src/components/admin/ManagementTab.css',
    'frontend/src/components/admin/BroadcastTab.css'
];

cssFiles.forEach(file => {
    if (fs.existsSync(path.join(__dirname, file))) {
        console.log(`   ✅ ${file}`);
    } else {
        console.log(`   ❌ ${file} - MISSING`);
        allGood = false;
    }
});

// Check environment files
console.log('\n🔐 Checking environment files...');
if (fs.existsSync(path.join(__dirname, 'backend/.env'))) {
    console.log('   ✅ backend/.env');
} else {
    console.log('   ⚠️  backend/.env - MISSING (create from .env.example)');
    allGood = false;
}

if (fs.existsSync(path.join(__dirname, 'frontend/.env'))) {
    console.log('   ✅ frontend/.env');
} else {
    console.log('   ⚠️  frontend/.env - MISSING (create with REACT_APP_API_URL)');
}

// Check node_modules
console.log('\n📚 Checking dependencies...');
if (fs.existsSync(path.join(__dirname, 'backend/node_modules'))) {
    console.log('   ✅ Backend dependencies installed');
} else {
    console.log('   ❌ Backend dependencies - Run: cd backend && npm install');
    allGood = false;
}

if (fs.existsSync(path.join(__dirname, 'frontend/node_modules'))) {
    console.log('   ✅ Frontend dependencies installed');
} else {
    console.log('   ❌ Frontend dependencies - Run: cd frontend && npm install');
    allGood = false;
}

// Check package.json dependencies
console.log('\n📦 Checking required packages...');
try {
    const frontendPkg = require('./frontend/package.json');
    const requiredPackages = ['react', 'react-router-dom', 'axios', 'leaflet', 'react-leaflet'];

    requiredPackages.forEach(pkg => {
        if (frontendPkg.dependencies[pkg]) {
            console.log(`   ✅ ${pkg}`);
        } else {
            console.log(`   ❌ ${pkg} - Run: cd frontend && npm install ${pkg}`);
            allGood = false;
        }
    });
} catch (error) {
    console.log('   ⚠️  Could not read frontend/package.json');
}

// Summary
console.log('\n' + '='.repeat(50));
if (allGood) {
    console.log('\n✅ All checks passed! Your setup looks good.\n');
    console.log('📝 Next steps:');
    console.log('   1. Ensure MongoDB is running');
    console.log('   2. Run: cd backend && node scripts/seedTestData.js');
    console.log('   3. Run: cd backend && npm start (Terminal 1)');
    console.log('   4. Run: cd frontend && npm start (Terminal 2)');
    console.log('   5. Open http://localhost:3000 in your browser');
    console.log('   6. Login with: admin@uet.edu.pk / password123\n');
} else {
    console.log('\n⚠️  Some issues found. Please fix them before proceeding.\n');
    console.log('📝 Common fixes:');
    console.log('   - Run: cd backend && npm install');
    console.log('   - Run: cd frontend && npm install');
    console.log('   - Create backend/.env file');
    console.log('   - Create frontend/.env file\n');
}

console.log('📖 For detailed instructions, see START_PROJECT.md');
console.log('🧪 For testing guide, see TESTING_GUIDE.md\n');
