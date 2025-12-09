#!/usr/bin/env powershell

# FCDS Database Image Update - Automated Version
# No manual password entry needed

$dbHost = "localhost"
$dbPort = "5432"
$dbName = "food_ordering"
$dbUser = "postgres"
$dbPassword = "Ahmed@2006"

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "FCDS Image URL Quick Update (Option 1)" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Cyan
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
SELECT 'UPDATE SUCCESSFUL!' as status;
SELECT dish_id, dish_name, img FROM public.dish WHERE dish_id <= 3;
SELECT category_id, category_name, image_url FROM public.category;
"@

# Save SQL to temp file
$tempFile = [System.IO.Path]::GetTempFileName() -replace "\.tmp", ".sql"
$updateSQL | Out-File -FilePath $tempFile -Encoding UTF8

Write-Host "Starting update..." -ForegroundColor Yellow
Write-Host "Database: $dbName" -ForegroundColor Gray
Write-Host "Host: $dbHost" -ForegroundColor Gray
Write-Host ""

try {
    # Set password in environment
    $env:PGPASSWORD = $dbPassword
    
    # Execute update
    & psql -h $dbHost -p $dbPort -U $dbUser -d $dbName -f $tempFile 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ SUCCESS!" -ForegroundColor Green
        Write-Host "All image URLs have been updated to permanent Pexels URLs!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📝 Updated:" -ForegroundColor Cyan
        Write-Host "  • 7 Dishes" -ForegroundColor Gray
        Write-Host "  • 3 Categories" -ForegroundColor Gray
        Write-Host ""
        Write-Host "🚀 Next steps:" -ForegroundColor Cyan
        Write-Host "  1. Restart your backend: npm start" -ForegroundColor Gray
        Write-Host "  2. Visit: http://localhost:5000/api/menu" -ForegroundColor Gray
        Write-Host "  3. Refresh your frontend to see new images" -ForegroundColor Gray
    } else {
        Write-Host ""
        Write-Host "❌ UPDATE FAILED!" -ForegroundColor Red
        Write-Host "Exit code: $LASTEXITCODE" -ForegroundColor Red
    }
} catch {
    Write-Host ""
    Write-Host "❌ ERROR: $_" -ForegroundColor Red
} finally {
    # Cleanup
    Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue
    Remove-Item $tempFile -ErrorAction SilentlyContinue
}

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan

