# DevScore NFT - Development Server Launcher
# This script starts both the backend FastAPI server and frontend Vite dev server

param(
    [switch]$BackendOnly,
    [switch]$FrontendOnly
)

$ScriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path

# Color output
function Write-Success {
    Write-Host $args -ForegroundColor Green
}

function Write-Info {
    Write-Host $args -ForegroundColor Cyan
}

function Write-Warning {
    Write-Host $args -ForegroundColor Yellow
}

Write-Info "================================"
Write-Info "DevScore NFT - Development Server"
Write-Info "================================"
Write-Info ""

# Start Backend if not FrontendOnly
if (-not $FrontendOnly) {
    Write-Info "Starting Backend FastAPI Server..."
    Write-Info "Location: $ScriptPath\backend"
    
    $BackendPath = Join-Path $ScriptPath "backend"
    
    # Check if venv exists
    if (-not (Test-Path "$BackendPath\venv")) {
        Write-Warning "Virtual environment not found. Creating one..."
        cd $BackendPath
        python -m venv venv
    }
    
    # Activate venv and start server
    $ActivateScript = Join-Path $BackendPath "venv\Scripts\Activate.ps1"
    
    # Start backend in new PowerShell window
    $BackendCommand = {
        & $ActivateScript
        Write-Host "Backend virtual environment activated"
        Write-Host "Starting uvicorn server on port 8000..."
        cd $BackendPath
        uvicorn main:app --reload --port 8000
    }
    
    Start-Process powershell.exe -ArgumentList "-NoExit -Command `"$BackendCommand`"" -WindowTitle "DevScore Backend"
    Write-Success "✓ Backend started in new window"
    Start-Sleep -Seconds 2
}

# Start Frontend if not BackendOnly
if (-not $BackendOnly) {
    Write-Info "Starting Frontend Vite Dev Server..."
    Write-Info "Location: $ScriptPath"
    
    # Start frontend in new PowerShell window
    $FrontendCommand = {
        Write-Host "Starting Vite dev server on port 8080..."
        cd "$ScriptPath"
        npm run dev
    }
    
    Start-Process powershell.exe -ArgumentList "-NoExit -Command `"cd '$ScriptPath' ; npm run dev`"" -WindowTitle "DevScore Frontend"
    Write-Success "✓ Frontend started in new window"
}

Write-Info ""
Write-Success "================================"
Write-Success "Servers Starting..."
Write-Success "================================"
Write-Info ""
Write-Info "Backend API:"
Write-Info "  • Main: http://localhost:8000"
Write-Info "  • Docs: http://localhost:8000/docs"
Write-Info "  • ReDoc: http://localhost:8000/redoc"
Write-Info ""
Write-Info "Frontend:"
Write-Info "  • App: http://localhost:8080"
Write-Info ""
Write-Warning "Keep this window open to maintain the servers running."
Write-Info ""

# Keep main window alive
while ($true) {
    Start-Sleep -Seconds 10
}
