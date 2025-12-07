@echo off
REM DevScore NFT - Development Server Launcher (Windows Batch)
REM This script starts both the backend FastAPI server and frontend Vite dev server

setlocal enabledelayedexpansion

cd /d "%~dp0"

echo.
echo ================================
echo DevScore NFT - Development Server
echo ================================
echo.

REM Start Backend
echo Starting Backend FastAPI Server on port 8000...
start "DevScore Backend" cmd /k "cd backend && venv\Scripts\activate.bat && uvicorn main:app --reload --port 8000"

REM Wait a bit for backend to start
timeout /t 2 /nobreak

REM Start Frontend
echo Starting Frontend Vite Dev Server on port 8080...
start "DevScore Frontend" cmd /k "npm run dev"

echo.
echo ================================
echo Servers Starting...
echo ================================
echo.
echo Backend API:
echo   - Main: http://localhost:8000
echo   - Docs: http://localhost:8000/docs
echo   - ReDoc: http://localhost:8000/redoc
echo.
echo Frontend:
echo   - App: http://localhost:8080
echo.

endlocal
