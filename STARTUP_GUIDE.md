# Development Startup Guide

## Quick Start

Simply run the startup script from the project root:

```powershell
.\start-dev.ps1
```

This will automatically start all four services:
1. **Cloud SQL Proxy** - Connects to your database
2. **FastAPI Backend** - API server with hot-reload
3. **Vite UI Dev Server** - React frontend with hot-reload
4. **Swagger UI** - Auto-running with the API

## What It Does

The `start-dev.ps1` script:
- Activates the Python virtual environment
- Starts Cloud SQL Proxy in background terminal (listens on 127.0.0.1:5432)
- Starts FastAPI uvicorn server in background terminal (listens on 127.0.0.1:8000)
- Starts Vite dev server in background terminal (listens on localhost:8081)

## Access Points

Once the script completes, you can access:

| Service | URL |
|---------|-----|
| UI | http://localhost:8081 |
| API | http://127.0.0.1:8000 |
| Swagger Docs | http://127.0.0.1:8000/docs |
| Database | 127.0.0.1:5432 |

## Database Credentials

```
User: imc_user
Password: Ibrahim_26!db
Database: imc_db
```

## Stopping Services

Each service runs in its own terminal window. To stop:
- Close the terminal windows, or
- Press `Ctrl+C` in each terminal

## Setup Instructions (One Time Only)

If this is your first time, make sure you have:

### 1. Python Virtual Environment
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### 2. Node.js Dependencies
```powershell
cd ui
npm install
cd ..
```

### 3. Cloud SQL Proxy
The `cloud-sql-proxy` binary should already be in your project root directory. If not, download it from:
https://cloud.google.com/sql/docs/postgres/sql-proxy

## Troubleshooting

### Port Already in Use
If you get a "port already in use" error:
```powershell
# Find and kill the process using the port
Get-Process | Where-Object { $_.ProcessName -eq 'node' } | Stop-Process -Force
Get-Process | Where-Object { $_.ProcessName -eq 'python' } | Stop-Process -Force
```

### Database Connection Failed
- Ensure Cloud SQL Proxy is running
- Check database credentials in the script
- Verify DATABASE_URL is set correctly

### UI Not Connecting to API
- Check that all three services are running
- Open browser console (F12) to see any errors
- Verify the Vite proxy is configured in `ui/vite.config.js`

## Automated Startup (Optional - Windows Task Scheduler)

To automatically run the script on login:

1. Open Task Scheduler
2. Create Basic Task
3. Set Trigger: "At log on"
4. Set Action: Start Program
5. Program: `powershell.exe`
6. Arguments: `-ExecutionPolicy Bypass -File "C:\Users\wardh\Documents\islamicmasterclass\islamicmasterclass\start-dev.ps1"`
7. Check "Run with highest privileges"

## Manual Alternative

If the script doesn't work, you can start each service manually in separate terminals:

```powershell
# Terminal 1: Cloud SQL Proxy
.\start-proxy.ps1

# Terminal 2: API Server (from project root)
$env:DATABASE_URL='postgresql+pg8000://imc_user:Ibrahim_26!db@127.0.0.1:5432/imc_db'
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

# Terminal 3: UI Dev Server
cd ui
npm run dev
```
