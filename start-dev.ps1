# Islamic Masterclass Development Environment Startup Script
# This script starts all services needed for local development:
# - Cloud SQL Proxy (Database)
# - FastAPI Backend (API + Swagger)
# - Vite UI Dev Server

Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "Islamic Masterclass Development Startup" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

# Get the script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# 1. Activate Python Virtual Environment
Write-Host "[1/4] Activating Python virtual environment..." -ForegroundColor Yellow
$venvPath = "$scriptDir\.venv\Scripts\Activate.ps1"
if (Test-Path $venvPath) {
    & $venvPath
    Write-Host "Python virtual environment activated" -ForegroundColor Green
} else {
    Write-Host "Virtual environment not found at $venvPath - skipping activation" -ForegroundColor Yellow
}

# 2. Start Cloud SQL Proxy
Write-Host "[2/4] Starting Cloud SQL Proxy..." -ForegroundColor Yellow
$proxyProcess = Start-Process -FilePath "powershell.exe" `
    -ArgumentList "-NoExit -Command `"& '$scriptDir\start-proxy.ps1'`"" `
    -PassThru
Write-Host "Cloud SQL Proxy started (PID: $($proxyProcess.Id))" -ForegroundColor Green
Start-Sleep -Seconds 2

# 3. Start FastAPI Backend
Write-Host "[3/4] Starting FastAPI Backend..." -ForegroundColor Yellow
try {
    $apiProcess = Start-Process -FilePath "powershell.exe" `
        -ArgumentList "-NoExit -Command `"cd '$scriptDir'; `$env:DATABASE_URL='postgresql+pg8000://imc_user:Ibrahim_26!db@127.0.0.1:5432/imc_db'; python -m uvicorn app.main:app --host 0.0.0.0 --port 8000`"" `
        -PassThru -ErrorAction Stop
    Write-Host "FastAPI Backend started (PID: $($apiProcess.Id))" -ForegroundColor Green
} catch {
    Write-Host "Warning: Failed to start FastAPI Backend using Start-Process" -ForegroundColor Yellow
    Write-Host "To start it manually, run:" -ForegroundColor Yellow
    Write-Host "`$env:DATABASE_URL='postgresql+pg8000://imc_user:Ibrahim_26!db@127.0.0.1:5432/imc_db'; python -m uvicorn app.main:app --host 0.0.0.0 --port 8000" -ForegroundColor Cyan
}
Start-Sleep -Seconds 3

# 4. Start Vite UI Dev Server
Write-Host "[4/4] Starting Vite UI Dev Server..." -ForegroundColor Yellow
$uiProcess = Start-Process -FilePath "powershell.exe" `
    -ArgumentList "-NoExit -Command `"cd '$scriptDir\ui'; npm run dev`"" `
    -PassThru
Write-Host "Vite UI Dev Server started (PID: $($uiProcess.Id))" -ForegroundColor Green

Write-Host ""
Write-Host "===========================================" -ForegroundColor Green
Write-Host "All services started successfully!" -ForegroundColor Green
Write-Host "===========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Access your services at:" -ForegroundColor Cyan
Write-Host "  UI:              http://localhost:8081" -ForegroundColor White
Write-Host "  API:             http://localhost:8000" -ForegroundColor White
Write-Host "  Swagger Docs:    http://localhost:8000/docs" -ForegroundColor White
Write-Host "  Database:        127.0.0.1:5432" -ForegroundColor White
Write-Host ""
Write-Host "Process IDs:" -ForegroundColor Cyan
Write-Host "  Database Proxy:  $($proxyProcess.Id)" -ForegroundColor White
Write-Host "  API Server:      $($apiProcess.Id)" -ForegroundColor White
Write-Host "  UI Dev Server:   $($uiProcess.Id)" -ForegroundColor White
Write-Host ""
Write-Host "To stop services, close the terminal windows or press Ctrl+C in each." -ForegroundColor Yellow
Write-Host ""
