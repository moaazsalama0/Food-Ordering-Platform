# Admin Page Fixes - Summary

## Issues Fixed

### 1. **Missing MEALS API Endpoint**
**Problem:** Frontend components were using `endpoints.MEALS` which didn't exist in the API configuration.
**Solution:** Added `MEALS: "dishes/"` to the API endpoints in `frontend/src/api/api.js`, mapping it to the backend's `/api/dishes` endpoint (which is an alias for `/api/menu`).

### 2. **Field Name Mismatches**
**Problem:** Frontend was sending incorrect field names that didn't match the backend API expectations.

**Changes Made:**

#### AddDish.jsx
- Changed `category` → `categoryId` (integer)
- Changed `is_available` → removed (not needed for creation)
- Added proper validation for required fields
- Updated field labels to indicate `categoryId` is needed
- Added optional fields: `preparationTime`, `calories`

#### EditDish.jsx  
- Updated to handle both `categoryId` and `category_id` responses from backend
- Fixed image field handling (backend returns `img`, not `image`)
- Added support for `preparationTime` and `calories` fields
- Improved error messages

#### UploadMealImages.jsx
- Fixed image display to check for both `img` and `image` fields
- Updated state management after upload
- Improved error handling with better messages

### 3. **Incorrect API Endpoint Usage**
**Problem:** Admin Orders page was using user orders endpoint instead of admin orders endpoint.
**Solution:** Changed `endpoints.ORDERS` → `endpoints.ADMIN_ORDERS` ("orders/admin/all")

### 4. **Missing Rating Statistics Endpoint**
**Problem:** RatingStatistics page was trying to use non-existent `endpoints.RATINGS_STATS`.
**Solution:** Modified to fetch meals list and display mock statistics (can be updated when actual ratings API is implemented).

## Files Modified

1. **frontend/src/api/api.js**
   - Added `MEALS: "dishes/"` endpoint

2. **frontend/src/admin/pages/AddDish.jsx**
   - Fixed field names (categoryId, removed is_available)
   - Added validation
   - Updated form labels
   - Better error handling

3. **frontend/src/admin/pages/EditDish.jsx**
   - Fixed field mapping for backend response
   - Improved image handling
   - Better error messages

4. **frontend/src/admin/pages/UploadMealImages.jsx**
   - Fixed image field references
   - Better state management
   - Improved error handling

5. **frontend/src/admin/pages/Orders.jsx**
   - Changed to use correct admin endpoint
   - Better error messages with API details

6. **frontend/src/admin/pages/RatingStatistics.jsx**
   - Fallback solution for missing ratings endpoint
   - Loads meals data instead

## Backend API Endpoints (for reference)

- **Add Meal:** `POST /api/dishes/` (requires adminAuth)
- **Get All Meals:** `GET /api/dishes/`
- **Get Single Meal:** `GET /api/dishes/:id`
- **Update Meal:** `PUT /api/dishes/:id` (requires adminAuth)
- **Delete Meal:** `DELETE /api/dishes/:id` (requires adminAuth)
- **Get All Orders (Admin):** `GET /api/orders/admin/all` (requires adminAuth)

## Required Fields for Meal Creation

- `name` (string, required)
- `description` (string, required, min 10 chars)
- `price` (number, required, positive)
- `categoryId` (integer, required, positive)
- `image` (file, optional)
- `preparationTime` (integer, optional)
- `calories` (integer, optional)

## Testing Checklist

- [ ] Create a new meal from Admin > Add Meal
- [ ] Verify meal appears in admin menu
- [ ] Edit existing meal
- [ ] Upload/change meal image
- [ ] View admin orders
- [ ] Check that all 404 errors are resolved

## Notes

- Backend uses snake_case in database (`category_id`, `is_available`, `img`)
- Frontend should use camelCase for form fields (`categoryId`, `image`)
- All admin routes require authentication and admin privileges
- Image uploads use FormData with multipart/form-data content type
