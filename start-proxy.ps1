# Start Cloud SQL Auth Proxy for local development
# Requires: gcloud CLI installed and authenticated

Write-Host "Starting Cloud SQL Proxy..." -ForegroundColor Green
Write-Host "Connection: islamicmasterclass-dev-479617:us-central1:imc-postgres" -ForegroundColor Cyan
Write-Host "Listening on: 127.0.0.1:5432" -ForegroundColor Cyan
Write-Host ""
Write-Host "Keep this terminal open. Proxy will run in the background." -ForegroundColor Yellow
Write-Host ""

& "c:\tools\cloud-sql-proxy\cloud-sql-proxy.exe" `
  "islamicmasterclass-dev-479617:us-central1:imc-postgres" `
  --port 5432

# If you see auth errors, run first:
# gcloud auth application-default login
