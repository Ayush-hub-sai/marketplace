@echo off
REM ServiceHub Quick Start Script (Windows)
REM This script sets up and runs the ServiceHub marketplace application

echo 🚀 ServiceHub - Quick Start Setup
echo ==================================
echo.

REM Check Node.js version
echo ✅ Checking Node.js version...
node -v
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install dependencies
    exit /b 1
)
echo ✅ Dependencies installed successfully
echo.

REM Build Angular application
echo 🔨 Building Angular application...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Build failed
    exit /b 1
)
echo ✅ Build completed successfully
echo.

REM Run development server
echo 🎯 Starting development server...
echo    Application will be available at: http://localhost:4200
echo.
call npm start
