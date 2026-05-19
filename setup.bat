@echo off
echo ========================================
echo RideUET - Automated Setup Script
echo ========================================
echo.

echo [1/5] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js found: 
node --version
echo.

echo [2/5] Installing backend dependencies...
cd backend
if not exist "node_modules" (
    echo Installing backend packages...
    call npm install
    if errorlevel 1 (
        echo ERROR: Failed to install backend dependencies
        pause
        exit /b 1
    )
) else (
    echo Backend dependencies already installed
)
cd ..
echo.

echo [3/5] Installing frontend dependencies...
cd frontend
if not exist "node_modules" (
    echo Installing frontend packages...
    call npm install
    if errorlevel 1 (
        echo ERROR: Failed to install frontend dependencies
        pause
        exit /b 1
    )
) else (
    echo Frontend dependencies already installed
)
cd ..
echo.

echo [4/5] Setting up environment files...
if not exist "backend\.env" (
    echo Creating backend .env file...
    copy "backend\.env.example" "backend\.env" >nul
    echo Backend .env created from template
    echo IMPORTANT: Edit backend\.env and add your configuration
) else (
    echo Backend .env already exists
)

if not exist "frontend\.env" (
    echo Creating frontend .env file...
    copy "frontend\.env.example" "frontend\.env" >nul
    echo Frontend .env created from template
) else (
    echo Frontend .env already exists
)
echo.

echo [5/5] Checking MongoDB...
echo Please ensure MongoDB is running before starting the application
echo Run 'mongod' in a separate terminal if not already running
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Edit backend\.env with your configuration
echo 2. Start MongoDB: mongod
echo 3. Start backend: cd backend ^&^& npm run dev
echo 4. Start frontend: cd frontend ^&^& npm start
echo.
echo For detailed instructions, see QUICKSTART.md
echo.
pause
