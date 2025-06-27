@echo off
echo 🚀 NeuroNova - Share with Friend
echo =================================
echo.

echo 📋 Checking servers...
netstat -ano | findstr ":3002" >nul
if errorlevel 1 (
    echo ❌ Backend not running on port 3002
    echo    Please start: node simple-backend.js
    pause
    exit /b 1
)

netstat -ano | findstr ":300" | findstr "LISTENING" >nul
if errorlevel 1 (
    echo ❌ Frontend not running
    echo    Please start: npm run dev
    pause
    exit /b 1
)

echo ✅ Servers are running!

echo.
echo 🌐 Starting ngrok tunnel...
echo    This will create a public URL you can share
echo.

"C:\Users\Eogamers\AppData\Roaming\npm\ngrok.cmd" http 3001

echo.
echo 💡 If ngrok fails, you can:
echo    1. Download ngrok from https://ngrok.com/download
echo    2. Extract to this folder
echo    3. Run: ngrok.exe http 3001
echo.
pause 