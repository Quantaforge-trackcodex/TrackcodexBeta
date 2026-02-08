# setup_postgres_manual.ps1

Write-Host ">>> Starting PostgreSQL Setup..." -ForegroundColor Cyan

# 1. Define Paths
$pgPath = "C:\Program Files\PostgreSQL\16"
$pgBin = "$pgPath\bin"
$pgData = "$pgPath\data"
$pgHba = "$pgData\pg_hba.conf"
$psql = "$pgBin\psql.exe"

# 2. Check Paths
if (-not (Test-Path $psql)) {
    Write-Host "X Error: Could not find psql.exe at $psql" -ForegroundColor Red
    exit
}

# 3. Modify pg_hba.conf to TRUST (No Password)
Write-Host ">>> Modifying pg_hba.conf to allow passwordless login... (This might require admin)" -ForegroundColor Yellow
$hbaContent = Get-Content $pgHba
$hbaContent = $hbaContent -replace "scram-sha-256", "trust"
$hbaContent = $hbaContent -replace "md5", "trust"
Set-Content $pgHba $hbaContent

# 4. Restart Service
Write-Host ">>> Restarting PostgreSQL service to apply changes..." -ForegroundColor Yellow
try {
    Restart-Service -Name postgresql-x64-16 -Force
    Write-Host "OK Service restarted." -ForegroundColor Green
} catch {
    Write-Host "X Failed to restart service automatically. Please restart it manually in services.msc and press Enter." -ForegroundColor Red
    Read-Host "Press Enter after restarting service..."
}

# 5. Connect & Setup
Write-Host ">>> Configuring Database..." -ForegroundColor Yellow

# Reset Password
& $psql -U postgres -c "ALTER USER postgres WITH PASSWORD 'trackcodex2024';"
if ($LASTEXITCODE -eq 0) {
    Write-Host "OK Password reset to 'trackcodex2024'" -ForegroundColor Green
} else {
    Write-Host "X Failed to reset password." -ForegroundColor Red
}

# Create Database
& $psql -U postgres -c "CREATE DATABASE trackcodex;"
if ($LASTEXITCODE -eq 0) {
    Write-Host "OK Database 'trackcodex' created" -ForegroundColor Green
} else {
    Write-Host "! Database creation might have failed or already exists. Continuing..." -ForegroundColor Yellow
}

# 6. Restore pg_hba.conf (Security)
Write-Host ">>> Restoring pg_hba.conf to secure mode..." -ForegroundColor Yellow
$hbaContent = Get-Content $pgHba
$hbaContent = $hbaContent -replace "trust", "scram-sha-256"
Set-Content $pgHba $hbaContent

# 7. Final Restart
Write-Host ">>> Restarting service one last time..." -ForegroundColor Yellow
try {
    Restart-Service -Name postgresql-x64-16 -Force
    Write-Host "OK Service restarted. Setup Complete!" -ForegroundColor Green
} catch {
    Write-Host "X Failed to restart service. Please restart manually." -ForegroundColor Red
}

Write-Host "`n>>> PostgreSQL Setup Finished! You can now run 'npm run server'" -ForegroundColor Cyan
