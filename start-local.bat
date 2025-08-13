@echo off
echo Starting NeuroNova Application (Local Development)...
echo.

echo Cleaning build cache...
rmdir /s /q .next 2>nul
echo Build cache cleaned.
echo.

echo Starting Backend Server...
start "NeuroNova Backend" cmd /k "node backend-final-working.js"
echo Backend starting at http://localhost:3001
echo.

echo Waiting for backend to start...
timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
start "NeuroNova Frontend" cmd /k "npm run dev"
echo Frontend will be available at http://localhost:3000
echo.

echo ===============================================
echo  NeuroNova is starting in local development mode
echo ===============================================
echo  Backend:  http://localhost:3001
echo  Frontend: http://localhost:3000
echo ===============================================
echo.
echo Press any key to exit...
pause 