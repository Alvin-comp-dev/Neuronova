@echo off
echo Starting NeuroNova Application...
echo.

echo Cleaning build cache...
rmdir /s /q .next 2>nul
echo Build cache cleaned.
echo.

echo Starting Backend Server...
start "NeuroNova Backend" cmd /k "node backend-final-working.js"
timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
start "NeuroNova Frontend" cmd /k "npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:3001
echo Frontend: Check the frontend window for the actual port
echo.
pause 