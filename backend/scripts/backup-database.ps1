#!/usr/bin/env powershell

# FCDS Database Backup Script
# Creates a backup of your PostgreSQL database before making changes

$dbHost = "localhost"
$dbPort = "5432"
$dbName = "food_ordering"  # Change this if your database name is different
$dbUser = "postgres"
$backupDir = "d:\FCDS\Web\FCDS Project new"
$timestamp = Get-Date -Format "yyyy-MM-dd_HHmmss"
$backupFile = "$backupDir\backup_FCDS_$timestamp.sql"

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "FCDS Database Backup Script" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Check if pg_dump exists
Write-Host "Checking for pg_dump..." -ForegroundColor Yellow
$pgdumpPath = Get-Command pg_dump -ErrorAction SilentlyContinue
if (-not $pgdumpPath) {
    Write-Host "❌ ERROR: pg_dump not found. Please add PostgreSQL bin directory to your PATH" -ForegroundColor Red
    Write-Host "Typical path: C:\Program Files\PostgreSQL\18\bin" -ForegroundColor Red
    exit 1
}

Write-Host "✅ pg_dump found at: $pgdumpPath" -ForegroundColor Green
Write-Host ""

# Create backup
Write-Host "Starting backup process..." -ForegroundColor Yellow
Write-Host "Database: $dbName" -ForegroundColor Gray
Write-Host "Host: $dbHost" -ForegroundColor Gray
Write-Host "Output: $backupFile" -ForegroundColor Gray
Write-Host ""

try {
    # Set environment variable for password (avoid prompt)
    $env:PGPASSWORD = ""  # Empty for default password, or enter password
    
    # Run pg_dump
    & pg_dump -h $dbHost -p $dbPort -U $dbUser -d $dbName -F p -b -v -f $backupFile 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ BACKUP SUCCESSFUL!" -ForegroundColor Green
        Write-Host "📁 Backup file: $backupFile" -ForegroundColor Green
        
        # Get file size
        $fileSize = (Get-Item $backupFile).Length / 1MB
        Write-Host "📊 File size: $([Math]::Round($fileSize, 2)) MB" -ForegroundColor Green
        Write-Host ""
        Write-Host "💾 Keep this file safe! You can restore it using:" -ForegroundColor Cyan
        Write-Host "   psql -U postgres -d food_ordering -f `"$backupFile`"" -ForegroundColor Gray
    } else {
        Write-Host ""
        Write-Host "❌ BACKUP FAILED!" -ForegroundColor Red
        Write-Host "Exit code: $LASTEXITCODE" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host ""
    Write-Host "❌ ERROR: $_" -ForegroundColor Red
    exit 1
} finally {
    # Clear password variable
    Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue
}

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
