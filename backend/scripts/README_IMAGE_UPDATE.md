# FCDS Database Image Update - Complete Instructions

## 🎯 Problem
Your images aren't loading because the Discord CDN links have expired. We've replaced them with permanent Pexels URLs.

## 📁 Updated Files
- ✅ `FoodOrderDB.sql` - Contains new Pexels image URLs
- ✅ `backend/scripts/backup-database.ps1` - Backup script
- ✅ `backend/scripts/update-images-option1.ps1` - Quick update (RECOMMENDED)
- ✅ `backend/scripts/reload-database-full.ps1` - Full reload

---

## 🚀 QUICK START (RECOMMENDED - Option 1)

### This is the safest and fastest option. Run in PowerShell:

```powershell
cd "d:\FCDS\Web\FCDS Project new\backend\scripts"
.\update-images-option1.ps1
```

**What it does:**
- ✅ Updates only the image URLs (keeps all your data)
- ✅ Creates a backup automatically
- ✅ Takes less than 1 minute
- ✅ No data loss

**After running, restart your backend:**
```
npm start
```

Then visit: `http://localhost:5000/api/menu` to see the new URLs!

---

## 🔄 FULL RELOAD (If Quick Update Doesn't Work - Options 2 & 3)

### This completely resets the database from the updated SQL file:

```powershell
cd "d:\FCDS\Web\FCDS Project new\backend\scripts"
.\reload-database-full.ps1
```

**What it does:**
- 📦 Creates a backup of your current database
- 🗑️ Drops the old database
- 🆕 Creates a fresh database
- 📥 Imports the updated SQL file with Pexels URLs
- ✅ Takes 2-5 minutes

**Warning:** This will reset all your data to what's in `FoodOrderDB.sql`

---

## 💾 Manual Backup Only (If you just want a backup)

```powershell
cd "d:\FCDS\Web\FCDS Project new\backend\scripts"
.\backup-database.ps1
```

This creates a backup file you can restore later.

---

## 🔧 Manual Method (If scripts don't work)

### Open Command Prompt/PowerShell and run:

```powershell
# Create backup
pg_dump -h localhost -p 5432 -U postgres -d food_ordering > "d:\FCDS\Web\FCDS Project new\backup_FCDS_manual.sql"

# Update only images (QUICK)
psql -h localhost -p 5432 -U postgres -d food_ordering -f "d:\FCDS\Web\FCDS Project new\backend\scripts\updateImages.sql"

# OR Full reload (if quick update fails)
psql -h localhost -p 5432 -U postgres -d food_ordering -f "d:\FCDS\Web\FCDS Project new\FoodOrderDB.sql"
```

---

## ✅ Verification

After any option, check if it worked:

1. **Open browser:** `http://localhost:5000/api/menu`
2. **Look for Pexels URLs** like: `https://images.pexels.com/photos/...`
3. **NOT Discord URLs** like: `https://cdn.discordapp.com/...?ex=...&is=...&hm=...`

---

## 📝 Image URLs Used (All Permanent Pexels URLs)

**Dishes:**
- Margherita Pizza: `https://images.pexels.com/photos/35068608/pexels-photo-35068608.jpeg`
- Pepperoni Pizza: `https://images.pexels.com/photos/708587/pexels-photo-708587.jpeg`
- Vegetarian Pizza: `https://images.pexels.com/photos/35123983/pexels-photo-35123983.jpeg`
- Cheese Burger: `https://images.pexels.com/photos/1199957/pexels-photo-1199957.jpeg`
- Chicken Burger: `https://images.pexels.com/photos/1431305/pexels-photo-1431305.jpeg`
- Chocolate Cake: `https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg`
- Tiramisu: `https://images.pexels.com/photos/1707920/pexels-photo-1707920.jpeg`

**Categories:**
- Pizza: `https://images.pexels.com/photos/35068608/pexels-photo-35068608.jpeg`
- Burgers: `https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg`
- Desserts: `https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg`

---

## 🆘 Troubleshooting

### "psql not found"
Add PostgreSQL bin to PATH:
```
C:\Program Files\PostgreSQL\18\bin
```

### "Connection refused"
- Make sure PostgreSQL is running
- Check if port 5432 is correct
- Verify database name is `food_ordering`

### "Still seeing old URLs"
- Clear browser cache (Ctrl+Shift+Delete)
- Restart your Node.js backend
- Make sure changes were applied with `http://localhost:5000/api/menu`

### Want to restore old backup?
```powershell
psql -h localhost -p 5432 -U postgres -d food_ordering -f "path\to\backup_file.sql"
```

---

## ❓ Which option should I use?

| Option | When to Use | Speed | Data Risk |
|--------|------------|-------|-----------|
| **Option 1** | First try this! | ⚡ 1 min | ✅ None |
| **Option 2 & 3** | Option 1 didn't work | 🐢 2-5 min | ⚠️ Resets data |
| **Manual** | Scripts not working | ⏱️ Varies | ⚠️ Depends |

---

**Happy coding! 🍕**
