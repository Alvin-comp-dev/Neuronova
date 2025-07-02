@echo off
echo 🧹 NeuroNova Clean Restart
echo ========================

echo 🛑 Stopping all Node processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 >nul

echo 🗂️ Cleaning build cache...
if exist .next rmdir /s /q .next >nul 2>&1
if exist node_modules\.cache rmdir /s /q node_modules\.cache >nul 2>&1

echo ⏳ Waiting for cleanup...
timeout /t 3 >nul

echo 🚀 Starting backend on port 3001...
start "NeuroNova Backend" cmd /c "node backend-final-working.js"

echo ⏳ Waiting for backend to start...
timeout /t 5 >nul

echo 🎨 Starting frontend on port 3000...
start "NeuroNova Frontend" cmd /c "npm run dev"

echo ✅ Restart complete!
echo 📍 Backend: http://localhost:3001
echo 📍 Frontend: http://localhost:3000
echo.
pause 