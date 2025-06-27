@echo off
echo 🌐 Starting Ngrok Tunnel for NeuroNova...
echo.
echo 📡 Frontend detected on port 3001
echo 🌐 Starting ngrok tunnel to http://localhost:3001
echo.
echo ⚠️  IMPORTANT: Look for the "Forwarding" line in the output below
echo    It will show something like: https://abc123.ngrok.io -> http://localhost:3001
echo.
echo 📧 Copy that https:// URL and share it with the college
echo.
echo 🛑 Press Ctrl+C to stop the tunnel when done
echo.
echo ================================================
ngrok http 3001
pause 