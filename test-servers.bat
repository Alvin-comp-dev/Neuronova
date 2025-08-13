@echo off
echo.
echo ================================================
echo  Testing NeuroNova Servers
echo ================================================
echo.

echo Testing Backend (Port 3001)...
curl http://localhost:3001/api/health 2>nul
if %errorlevel% == 0 (
    echo ✅ Backend is running correctly!
) else (
    echo ❌ Backend is not responding
)
echo.

echo Testing Frontend (Port 3000)...
curl http://localhost:3000 2>nul | findstr "html" >nul
if %errorlevel% == 0 (
    echo ✅ Frontend is running correctly!
) else (
    echo ⚠️  Frontend may still be starting or on different port
    echo Check: http://localhost:3000 or http://localhost:3003
)
echo.

echo ================================================
echo  Manual Test URLs:
echo  Backend Health: http://localhost:3001/api/health
echo  Backend Research: http://localhost:3001/api/research
echo  Frontend: http://localhost:3000 (or check console)
echo ================================================
echo.
pause 