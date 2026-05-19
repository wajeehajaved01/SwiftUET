@echo off
echo ========================================
echo    SwiftUET Development Server
echo ========================================
echo.

REM Check if MongoDB is running
echo Checking MongoDB...
sc query MongoDB | find "RUNNING" >nul
if %errorlevel% neq 0 (
    echo MongoDB is not running. Starting MongoDB...
    net start MongoDB
    if %errorlevel% neq 0 (
        echo Warning: Could not start MongoDB automatically.
        echo Please start MongoDB manually or check if it's installed.
        echo.
    )
) else (
    echo MongoDB is running.
)
echo.

REM Check if node_modules exist
if not exist "backend\node_modules" (
    echo Installing backend dependencies...
    cd backend
    call npm install
    cd ..
    echo.
)

if not exist "frontend\node_modules" (
    echo Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
    echo.
)

REM Check if .env files exist
if not exist "backend\.env" (
    echo Warning: backend\.env not found!
    echo Please create backend\.env file with required variables.
    echo See backend\.env.example for reference.
    echo.
    pause
)

if not exist "frontend\.env" (
    echo Warning: frontend\.env not found!
    echo Creating frontend\.env with default values...
    echo REACT_APP_API_URL=http://localhost:5000/api > frontend\.env
    echo.
)

echo ========================================
echo Starting Development Servers...
echo ========================================
echo.
echo Backend will run on: http://localhost:5000
echo Frontend will run on: http://localhost:3000
echo.
echo Press Ctrl+C in each window to stop the servers.
echo.

REM Start backend in new window
start "SwiftUET Backend" cmd /k "cd backend && npm start"

REM Wait a bit for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend in new window
start "SwiftUET Frontend" cmd /k "cd frontend && npm start"

echo.
echo ========================================
echo Servers are starting...
echo ========================================
echo.
echo Backend: Check "SwiftUET Backend" window
echo Frontend: Check "SwiftUET Frontend" window
echo.
echo Your browser should open automatically.
echo If not, navigate to: http://localhost:3000
echo.
echo Login credentials:
echo   Email: admin@uet.edu.pk
echo   Password: password123
echo.
echo Press any key to exit this window...
pause >nul
