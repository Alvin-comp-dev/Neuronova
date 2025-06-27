@echo off
echo 🌐 Starting Ngrok Tunnel for NeuroNova...
echo.

echo 📋 Prerequisites:
echo 1. Frontend running on port 3001, 3003, 3004, or 3005
echo 2. Backend running on port 3002
echo.

echo 🔍 Checking which port frontend is using...
echo.

REM Try different ports
for %%p in (3001 3003 3004 3005) do (
    netstat -an | findstr ":%%p " >nul
    if not errorlevel 1 (
        echo ✅ Found frontend running on port %%p
        echo 🌐 Starting ngrok tunnel to http://localhost:%%p
        echo.
        echo ⚠️  IMPORTANT: Look for the "Forwarding" line in the output below
        echo    It will show something like: https://abc123.ngrok.io -> http://localhost:%%p
        echo.
        echo 📧 Copy that https:// URL and share it with the college
        echo.
        echo 🛑 Press Ctrl+C to stop the tunnel when done
        echo.
        echo ================================================
        ngrok http %%p
        goto :end
    )
)

echo ❌ No frontend server found on ports 3001, 3003, 3004, or 3005
echo Please start the frontend server first using: npm run dev
pause
:end 