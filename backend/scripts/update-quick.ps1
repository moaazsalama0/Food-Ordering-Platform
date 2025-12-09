# FCDS Database Image Update - Automated Version
# No manual password entry needed

$dbHost = "localhost"
$dbPort = "5432"
$dbName = "food_ordering"
$dbUser = "postgres"
$dbPassword = "Ahmed@2006"

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "FCDS Image URL Quick Update" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# SQL Update Commands
$updateSQL = @"
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

UPDATE public.category SET image_url = 
  CASE category_id
    WHEN 1 THEN 'https://images.pexels.com/photos/35068608/pexels-photo-35068608.jpeg'
    WHEN 2 THEN 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg'
    WHEN 3 THEN 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg'
  END
WHERE category_id IN (1,2,3);

SELECT 'UPDATE SUCCESSFUL' as status;
"@

$tempFile = [System.IO.Path]::GetTempFileName() -replace "\.tmp", ".sql"
$updateSQL | Out-File -FilePath $tempFile -Encoding UTF8

Write-Host "Starting update..." -ForegroundColor Yellow
Write-Host "Database: $dbName" -ForegroundColor Gray
Write-Host ""

try {
    $env:PGPASSWORD = $dbPassword
    $output = & psql -h $dbHost -p $dbPort -U $dbUser -d $dbName -f $tempFile 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "SUCCESS! Image URLs updated!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Updated:" -ForegroundColor Cyan
        Write-Host "  - 7 Dishes" -ForegroundColor Gray
        Write-Host "  - 3 Categories" -ForegroundColor Gray
        Write-Host ""
        Write-Host "Next: Restart backend and visit http://localhost:5000/api/menu" -ForegroundColor Cyan
    } else {
        Write-Host "Update failed with exit code: $LASTEXITCODE" -ForegroundColor Red
    }
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
} finally {
    Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue
    Remove-Item $tempFile -ErrorAction SilentlyContinue
}
