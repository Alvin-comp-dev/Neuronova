@echo off
echo.
echo ================================================
echo  Starting NeuroNova - Original Working Setup
echo ================================================
echo.

echo Cleaning any existing processes...
taskkill /F /IM node.exe 2>nul
echo.

echo Starting Backend Server (Port 3001)...
start "NeuroNova Backend" cmd /k "node backend-final-working.js"
echo Backend: http://localhost:3001
echo.

echo Waiting for backend to initialize...
timeout /t 3 /nobreak >nul
echo.

echo Starting Frontend Server...
start "NeuroNova Frontend" cmd /k "npm run dev"
echo Frontend: Check the frontend window for the port (usually 3000 or 3003)
echo.

echo ================================================
echo  Both servers are starting...
echo  Backend API: http://localhost:3001/api/health
echo  Frontend: Will open in new window
echo ================================================
echo.
echo Press any key to close this window...
pause 