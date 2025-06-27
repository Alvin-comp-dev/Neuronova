@echo off
echo 🚀 Starting temporary hosting for NeuroNova...
echo.
echo 📋 Prerequisites:
echo 1. Frontend running on port 3004
echo 2. Backend running on port 3002
echo 3. Ngrok installed globally
echo.
echo 🌐 Starting ngrok tunnel...
echo.
echo ⚠️  IMPORTANT: Look for the "Forwarding" line in the output below
echo    It will show something like: https://abc123.ngrok.io -> http://localhost:3004
echo.
echo 📧 Copy that https:// URL and share it with the college
echo.
echo 🛑 Press Ctrl+C to stop the tunnel when done
echo.
echo ================================================
ngrok http 3004
pause 