@echo off
echo 🚀 Starting NeuroNova Simple...
echo.

echo 📡 Starting Backend Server...
start "Backend Server" cmd /k "node simple-backend.js"

echo ⏳ Waiting 3 seconds...
timeout /t 3 /nobreak >nul

echo 📡 Starting Frontend Server...
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ✅ Both servers are starting!
echo 🌐 Frontend: http://localhost:3000 (or next available port)
echo 🔧 Backend: http://localhost:3002
echo.
echo 📚 Expert Application System: http://localhost:3000/experts
echo 👨‍💼 Admin Panel: http://localhost:3000/admin
echo.
echo 🛑 Close the command windows to stop the servers
pause 