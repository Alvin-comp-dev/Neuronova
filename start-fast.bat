@echo off
echo 🚀 Starting NeuroNova FAST...

echo 🔄 Killing existing processes...
taskkill /F /IM node.exe >nul 2>&1

echo 🧹 Cleaning .next directory...
if exist .next rmdir /s /q .next >nul 2>&1

echo 📡 Starting Backend Server...
start "Backend" cmd /k "node simple-backend.js"

echo ⏳ Waiting 2 seconds...
timeout /t 2 /nobreak >nul

echo 📡 Starting Frontend Server...
start "Frontend" cmd /k "npm run dev"

echo ✅ Servers starting up!
echo 🌐 Frontend: http://localhost:3001 (or next available port)
echo 🔧 Backend: http://localhost:3002
echo 🛑 Close the command windows to stop servers
pause 