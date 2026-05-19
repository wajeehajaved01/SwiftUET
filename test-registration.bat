@echo off
echo ========================================
echo Testing RideUET Registration
echo ========================================
echo.

echo Testing Student Registration...
curl -X POST http://localhost:5000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"firstName\":\"Ahmed\",\"lastName\":\"Khan\",\"email\":\"ahmed.student@uet.edu.pk\",\"password\":\"password123\",\"phoneNumber\":\"+923001234567\",\"role\":\"student\",\"isFaculty\":false}"
echo.
echo.

echo Testing Driver Registration...
curl -X POST http://localhost:5000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"firstName\":\"Ali\",\"lastName\":\"Hassan\",\"email\":\"ali.driver@uet.edu.pk\",\"password\":\"password123\",\"phoneNumber\":\"+923001234568\",\"role\":\"driver\"}"
echo.
echo.

echo Testing Admin Registration...
curl -X POST http://localhost:5000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"firstName\":\"Sara\",\"lastName\":\"Ahmed\",\"email\":\"sara.admin@uet.edu.pk\",\"password\":\"password123\",\"phoneNumber\":\"+923001234569\",\"role\":\"admin\"}"
echo.
echo.

echo Testing Parent Registration...
curl -X POST http://localhost:5000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"firstName\":\"Fatima\",\"lastName\":\"Ali\",\"email\":\"fatima.parent@uet.edu.pk\",\"password\":\"password123\",\"phoneNumber\":\"+923001234570\",\"role\":\"parent\"}"
echo.
echo.

echo ========================================
echo Test Complete!
echo ========================================
echo.
echo You can now login with:
echo Email: ahmed.student@uet.edu.pk (or any of the above)
echo Password: password123
echo.
pause
