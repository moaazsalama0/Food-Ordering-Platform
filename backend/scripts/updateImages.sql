-- UPDATE SCRIPT: Replace image URLs with permanent Pexels URLs
-- Created: 2025-12-09
-- This script updates only the image URLs, preserving all other data

-- Step 1: Update dish table with new Pexels URLs
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

-- Step 2: Update category table with new Pexels URLs
UPDATE public.category SET image_url = 
  CASE category_id
    WHEN 1 THEN 'https://images.pexels.com/photos/35068608/pexels-photo-35068608.jpeg'
    WHEN 2 THEN 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg'
    WHEN 3 THEN 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg'
  END
WHERE category_id IN (1,2,3);

-- Verify updates
SELECT 'DISH TABLE UPDATED:' as status;
SELECT dish_id, dish_name, img FROM public.dish WHERE dish_id IN (1,2,3,4,5,6,7);

SELECT 'CATEGORY TABLE UPDATED:' as status;
SELECT category_id, category_name, image_url FROM public.category WHERE category_id IN (1,2,3);

-- Done!
SELECT 'UPDATE COMPLETE! All image URLs have been replaced with permanent Pexels URLs.' as confirmation;
