#!/usr/bin/env powershell

# FCDS Database Full Reload Script
# Complete database reset with new updated SQL file
# This is OPTION 2 & 3 - Full reload (deletes and recreates database)

$dbHost = "localhost"
$dbPort = "5432"
$dbName = "food_ordering"  # Change if your database name is different
$dbUser = "postgres"
$sqlFile = "d:\FCDS\Web\FCDS Project new\FoodOrderDB.sql"
$timestamp = Get-Date -Format "yyyy-MM-dd_HHmmss"
$backupDir = "d:\FCDS\Web\FCDS Project new"
$backupFile = "$backupDir\backup_FCDS_before_reload_$timestamp.sql"

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "FCDS Database Full Reload Script" -ForegroundColor Cyan
Write-Host "Options 2 & 3 - Complete Reset" -ForegroundColor Red
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "⚠️  WARNING: This will DELETE and RECREATE your database!" -ForegroundColor Yellow
Write-Host "All data will be replaced with the FoodOrderDB.sql file" -ForegroundColor Yellow
Write-Host ""
Write-Host "A backup will be created first at:" -ForegroundColor Cyan
Write-Host "  $backupFile" -ForegroundColor Gray
Write-Host ""

$response = Read-Host "Do you want to continue? (yes/no)"
if ($response -ne "yes") {
    Write-Host "Cancelled by user" -ForegroundColor Yellow
    exit 0
}

Write-Host ""

# Check if psql and pg_dump exist
Write-Host "Checking PostgreSQL tools..." -ForegroundColor Yellow
$psqlPath = Get-Command psql -ErrorAction SilentlyContinue
$pgdumpPath = Get-Command pg_dump -ErrorAction SilentlyContinue

if (-not $psqlPath -or -not $pgdumpPath) {
    Write-Host "❌ ERROR: PostgreSQL tools not found. Please add PostgreSQL bin directory to your PATH" -ForegroundColor Red
    Write-Host "Typical path: C:\Program Files\PostgreSQL\18\bin" -ForegroundColor Red
    exit 1
}

Write-Host "✅ PostgreSQL tools found" -ForegroundColor Green
Write-Host ""

# Step 1: Create Backup
Write-Host "STEP 1: Creating Backup..." -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

try {
    $env:PGPASSWORD = ""  # Empty for default password
    
    Write-Host "Creating backup file: $backupFile" -ForegroundColor Yellow
    & pg_dump -h $dbHost -p $dbPort -U $dbUser -d $dbName -F p -b -f $backupFile 2>&1 | Out-Null
    
    if ($LASTEXITCODE -eq 0) {
        $fileSize = (Get-Item $backupFile).Length / 1MB
        Write-Host "✅ Backup created successfully!" -ForegroundColor Green
        Write-Host "📊 File size: $([Math]::Round($fileSize, 2)) MB" -ForegroundColor Green
    } else {
        Write-Host "❌ Backup failed!" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ ERROR during backup: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 2: Drop existing database
Write-Host "STEP 2: Dropping existing database..." -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

try {
    $env:PGPASSWORD = ""
    
    Write-Host "Dropping database: $dbName" -ForegroundColor Yellow
    # Terminate all connections first
    $terminateSQL = @"
SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE pg_stat_activity.datname = '$dbName'
  AND pid <> pg_backend_pid();
"@
    
    $terminateSQL | & psql -h $dbHost -p $dbPort -U $dbUser -d "postgres" 2>&1 | Out-Null
    
    # Drop database
    & psql -h $dbHost -p $dbPort -U $dbUser -d "postgres" -c "DROP DATABASE IF EXISTS $dbName;" 2>&1 | Out-Null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Database dropped successfully!" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to drop database!" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ ERROR during drop: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 3: Create new database
Write-Host "STEP 3: Creating new database..." -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

try {
    $env:PGPASSWORD = ""
    
    Write-Host "Creating new database: $dbName" -ForegroundColor Yellow
    & psql -h $dbHost -p $dbPort -U $dbUser -d "postgres" -c "CREATE DATABASE $dbName;" 2>&1 | Out-Null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Database created successfully!" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to create database!" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ ERROR during creation: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 4: Import new SQL file
Write-Host "STEP 4: Importing updated SQL file..." -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

if (-not (Test-Path $sqlFile)) {
    Write-Host "❌ ERROR: SQL file not found!" -ForegroundColor Red
    Write-Host "Expected path: $sqlFile" -ForegroundColor Red
    exit 1
}

try {
    $env:PGPASSWORD = ""
    
    Write-Host "Importing SQL file: $sqlFile" -ForegroundColor Yellow
    Write-Host "This may take a minute..." -ForegroundColor Gray
    
    & psql -h $dbHost -p $dbPort -U $dbUser -d $dbName -f $sqlFile 2>&1 | Out-Null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ SQL file imported successfully!" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to import SQL file!" -ForegroundColor Red
        Write-Host "Restoring from backup..." -ForegroundColor Yellow
        
        & psql -h $dbHost -p $dbPort -U $dbUser -d "postgres" -c "DROP DATABASE IF EXISTS $dbName;" 2>&1 | Out-Null
        & psql -h $dbHost -p $dbPort -U $dbUser -d "postgres" -c "CREATE DATABASE $dbName;" 2>&1 | Out-Null
        & psql -h $dbHost -p $dbPort -U $dbUser -d $dbName -f $backupFile 2>&1 | Out-Null
        
        Write-Host "✅ Database restored from backup" -ForegroundColor Green
        exit 1
    }
} catch {
    Write-Host "❌ ERROR during import: $_" -ForegroundColor Red
    exit 1
} finally {
    Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue
}

Write-Host ""

# Step 5: Verify
Write-Host "STEP 5: Verifying installation..." -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

try {
    $env:PGPASSWORD = ""
    
    $verifySQL = @"
SELECT COUNT(*) as dish_count FROM public.dish;
SELECT COUNT(*) as category_count FROM public.category;
SELECT COUNT(*) as user_count FROM public.users;
"@
    
    $result = $verifySQL | & psql -h $dbHost -p $dbPort -U $dbUser -d $dbName -t 2>&1
    
    Write-Host "✅ Database verification:" -ForegroundColor Green
    Write-Host $result -ForegroundColor Gray
} catch {
    Write-Host "⚠️  Warning during verification: $_" -ForegroundColor Yellow
}

Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "======================================" -ForegroundColor Green
Write-Host "✅ DATABASE RELOAD COMPLETE!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host ""

Write-Host "📝 What was done:" -ForegroundColor Cyan
Write-Host "  1. ✅ Backup created: $backupFile" -ForegroundColor Gray
Write-Host "  2. ✅ Old database dropped" -ForegroundColor Gray
Write-Host "  3. ✅ New database created" -ForegroundColor Gray
Write-Host "  4. ✅ New SQL file imported with Pexels image URLs" -ForegroundColor Gray
Write-Host ""

Write-Host "🚀 Next steps:" -ForegroundColor Cyan
Write-Host "  1. Restart your Node.js backend: npm start" -ForegroundColor Gray
Write-Host "  2. Check the API: http://localhost:5000/api/menu" -ForegroundColor Gray
Write-Host "  3. Refresh your frontend to see the new images" -ForegroundColor Gray
Write-Host ""

Write-Host "💾 Your old data is safely backed up at:" -ForegroundColor Cyan
Write-Host "  $backupFile" -ForegroundColor Gray
Write-Host ""
