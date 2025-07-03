@echo off
echo.
echo ================================================
echo    NeuroNova Optimized Restart Script
echo ================================================
echo.

echo [1/6] Stopping existing processes...
taskkill /F /IM "node.exe" >nul 2>&1
taskkill /F /IM "next.exe" >nul 2>&1
timeout /t 2 /nobreak >nul

echo [2/6] Cleaning build cache and temporary files...
if exist ".next" (
    echo   - Removing .next directory...
    rmdir /S /Q ".next" 2>nul
)
if exist "node_modules\.cache" (
    echo   - Removing node_modules cache...
    rmdir /S /Q "node_modules\.cache" 2>nul
)
if exist ".turbo" (
    echo   - Removing turbo cache...
    rmdir /S /Q ".turbo" 2>nul
)

echo [3/6] Cleaning npm cache...
npm cache clean --force >nul 2>&1

echo [4/6] Verifying dependencies...
if not exist "node_modules" (
    echo   - Installing dependencies...
    npm ci --silent
) else (
    echo   - Dependencies already installed
)

echo [5/6] Starting backend server...
start /B "NeuroNova Backend" cmd /c "node backend-final-working.js"
timeout /t 3 /nobreak >nul

echo [6/6] Starting optimized frontend...
echo.
echo ================================================
echo    Starting NeuroNova with optimizations:
echo    - Memory limit: 4GB
echo    - Telemetry disabled
echo    - Cache optimization enabled
echo    - Performance monitoring enabled
echo ================================================
echo.
echo Backend: http://localhost:3001
echo Frontend: http://localhost:3000
echo.

set NODE_OPTIONS=--max-old-space-size=4096
set NEXT_TELEMETRY_DISABLED=1
set NEXT_PUBLIC_ENABLE_PERF_MONITORING=true

npm run dev

pause 