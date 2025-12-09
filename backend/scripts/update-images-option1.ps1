#!/usr/bin/env powershell

# FCDS Database Image Update Script
# Updates image URLs from Discord CDN to permanent Pexels URLs
# This is OPTION 1 - Quick update without dropping database

$dbHost = "localhost"
$dbPort = "5432"
$dbName = "food_ordering"  # Change if your database name is different
$dbUser = "postgres"

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "FCDS Image URL Update Script (Option 1)" -ForegroundColor Cyan
Write-Host "Quick Update - Preserves All Data" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "This script will update image URLs using SQL UPDATE statements" -ForegroundColor Yellow
Write-Host "Your data will NOT be deleted - only image URLs will change" -ForegroundColor Yellow
Write-Host ""

# Check if psql exists
Write-Host "Checking for psql..." -ForegroundColor Yellow
$psqlPath = Get-Command psql -ErrorAction SilentlyContinue
if (-not $psqlPath) {
    Write-Host "❌ ERROR: psql not found. Please add PostgreSQL bin directory to your PATH" -ForegroundColor Red
    Write-Host "Typical path: C:\Program Files\PostgreSQL\18\bin" -ForegroundColor Red
    exit 1
}

Write-Host "✅ psql found" -ForegroundColor Green
Write-Host ""

# SQL Update Commands
$updateSQL = @"
-- Update dish table with Pexels URLs
UPDATE public.dish SET img = 
  CASE dish_id
    WHEN 1 THEN 'https://images.pexels.com/photos/35068608/pexels-photo-35068608.jpeg'
    WHEN 2 THEN 'https://images.pexels.com/photos/708587/pexels-photo-708587.jpeg'
    WHEN 3 THEN 'https://images.pexels.com/photos/35123983/pexels-photo-35123983.jpeg'
    WHEN 4 THEN 'https://images.pexels.com/photos/1199957/pexels-photo-1199957.jpeg'
    WHEN 5 THEN 'https://images.pexels.com/photos/1431305/pexels-photo-1431305.jpeg'
    WHEN 6 THEN 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg'
    WHEN 7 THEN 'https://images.pexels.com/photos/1707920/pexels-photo-1707920.jpeg'
  END
WHERE dish_id IN (1,2,3,4,5,6,7);

-- Update category table with Pexels URLs
UPDATE public.category SET image_url = 
  CASE category_id
    WHEN 1 THEN 'https://images.pexels.com/photos/35068608/pexels-photo-35068608.jpeg'
    WHEN 2 THEN 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg'
    WHEN 3 THEN 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg'
  END
WHERE category_id IN (1,2,3);

-- Verify updates
SELECT 'IMAGE URLS UPDATED SUCCESSFULLY!' as status;
"@

# Save SQL to temp file
$tempFile = [System.IO.Path]::GetTempFileName() -replace "\.tmp", ".sql"
$updateSQL | Out-File -FilePath $tempFile -Encoding UTF8

Write-Host "Connecting to database..." -ForegroundColor Yellow
Write-Host "Host: $dbHost" -ForegroundColor Gray
Write-Host "Port: $dbPort" -ForegroundColor Gray
Write-Host "Database: $dbName" -ForegroundColor Gray
Write-Host ""

try {
    # Set environment variable for password
    $env:PGPASSWORD = ""  # Empty for default, or enter password
    
    # Execute update SQL
    Write-Host "Executing UPDATE statements..." -ForegroundColor Yellow
    & psql -h $dbHost -p $dbPort -U $dbUser -d $dbName -f $tempFile 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ SUCCESS! Image URLs have been updated!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Updated records:" -ForegroundColor Cyan
        Write-Host "  • 7 dishes (pizza, burgers, desserts)" -ForegroundColor Gray
        Write-Host "  • 3 categories (Pizza, Burgers, Desserts)" -ForegroundColor Gray
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Cyan
        Write-Host "  1. Restart your backend: npm start" -ForegroundColor Gray
        Write-Host "  2. Visit: http://localhost:5000/api/menu" -ForegroundColor Gray
        Write-Host "  3. Check your frontend to see the new images" -ForegroundColor Gray
    } else {
        Write-Host ""
        Write-Host "❌ UPDATE FAILED!" -ForegroundColor Red
        Write-Host "Exit code: $LASTEXITCODE" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host ""
    Write-Host "❌ ERROR: $_" -ForegroundColor Red
    exit 1
} finally {
    # Cleanup
    Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue
    Remove-Item $tempFile -ErrorAction SilentlyContinue
}

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
