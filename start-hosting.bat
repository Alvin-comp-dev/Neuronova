@echo off
title NeuroNova Hosting
echo 🚀 NeuroNova - Starting Public Hosting
echo ======================================
echo.

echo 📋 Checking if servers are running...
netstat -ano | findstr ":3002" >nul
if errorlevel 1 (
    echo ❌ Backend not running on port 3002
    echo    Please start: node simple-backend.js
    echo.
    pause
    exit /b 1
)

echo ✅ Backend is running on port 3002

netstat -ano | findstr ":3001" >nul
if errorlevel 1 (
    echo ❌ Frontend not running on port 3001
    echo    Please start: npm run dev
    echo.
    pause
    exit /b 1
)

echo ✅ Frontend is running on port 3001
echo.

echo 🌐 Starting ngrok tunnel...
echo    This will create a public URL you can share with your friend
echo    Keep this window open while testing
echo.

echo 🔐 Test Credentials:
echo    Regular User: ejialvtuke@gmail.com / password123
echo    Admin User: admin@neuronova.com / password123
echo.

echo 📧 Once ngrok starts, copy the https://xxxxx.ngrok.io URL
echo    and send it to your friend for testing
echo.

echo Press any key to start ngrok...
pause >nul

ngrok http 3001

echo.
echo 💡 If ngrok fails, download from: https://ngrok.com/download
echo    Then run: ngrok.exe http 3001
echo.
pause 