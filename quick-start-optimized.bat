@echo off
echo.
echo ================================================
echo    NeuroNova Quick Start (Optimized)
echo ================================================
echo.

echo [1/4] Stopping existing processes...
taskkill /F /IM "node.exe" >nul 2>&1
timeout /t 2 /nobreak >nul

echo [2/4] Ensuring dependencies are installed...
if not exist "node_modules\critters" (
    echo   - Installing missing dependencies...
    npm install critters --silent
)

echo [3/4] Starting backend server...
start /B "NeuroNova Backend" cmd /c "node backend-final-working.js"
timeout /t 3 /nobreak >nul

echo [4/4] Starting optimized frontend...
echo.
echo ================================================
echo    NeuroNova is starting with optimizations:
echo    - SWC minification enabled
echo    - Package imports optimized
echo    - Security headers configured
echo    - Performance monitoring enabled
echo ================================================
echo.
echo Backend:  http://localhost:3001
echo Frontend: http://localhost:3000
echo Health:   http://localhost:3001/api/health
echo.

set NODE_OPTIONS=--max-old-space-size=4096
set NEXT_TELEMETRY_DISABLED=1
set NEXT_PUBLIC_ENABLE_PERF_MONITORING=true

npm run dev

pause 