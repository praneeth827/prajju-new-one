# 🗄️ Database Explanation - Simple Guide

## What Database is Used?

**JSON File-Based Database** - A simple, file-based storage system using JSON format.

---

## Why JSON File Database?

### ✅ Advantages:
1. **No Installation Needed**
   - Just a file (`data.json`) - no separate database server to install
   - Works immediately after setup

2. **Simple & Easy**
   - Perfect for learning and small projects
   - No complex configuration
   - Human-readable format

3. **Portable**
   - All data in one file
   - Easy to backup (just copy the file)
   - Works on Windows, Mac, Linux

4. **Fast**
   - Very fast for small to medium applications
   - No network overhead (local file)

5. **Free & Open Source**
   - No cost, no licensing issues

### ⚠️ Limitations:
- Best for single-user or small team applications
- Not ideal for very large applications (millions of records)
- No built-in user management (we handle that in our code)

---

## How JSON File Database Works

### Simple Explanation:
Think of JSON file like a **structured text file**:
- **JSON file** = `data.json` (your database file)
- **Arrays** = Collections (users, student_details)
- **Objects** = Records (each user, each student detail)
- **Properties** = Fields (name, email, CGPA, etc.)

### Visual Example:

**data.json file contains:**

```json
{
  "users": [
    {
      "id": 1,
      "name": "Praneeth",
      "email": "praneeth@gmail.com",
      "phone": "7981222645",
      "password_hash": "$2a$10$...",
      "created_at": "2026-01-22T09:07:02.525Z"
    }
  ],
  "student_details": [
    {
      "user_id": 1,
      "roll_number": "12345",
      "present_cgpa": 8.5,
      "attendance": 85,
      "active_backlogs": "No"
    }
  ]
}
```

---

## What Data Gets Stored?

### 1. **Users Array** (Registration/Login)
Stores when someone registers:
- `id` - Unique number for each user
- `name` - Full name
- `email` - Email address (must be unique)
- `phone` - Phone number (optional, must be unique)
- `password_hash` - Encrypted password (never stored as plain text!)
- `created_at` - When account was created

### 2. **Student Details Array** (Academic Information)
Stores when someone fills the academic form:
- `user_id` - Links to the user who owns this data
- `roll_number` - Student roll number
- `btech_year` - Year of study (1st, 2nd, 3rd, 4th)
- `gender` - Male/Female/Other
- `category` - SC/ST/OBC/General
- `quota_type` - Convener/Management
- `present_cgpa` - Current year CGPA
- `previous_cgpa` - Previous year CGPA
- `attendance` - Attendance percentage
- `active_backlogs` - Yes/No
- `updated_at` - When last updated

---

## How Data is Stored (Step by Step)

### When User Registers:
1. User fills registration form
2. Frontend sends data to backend (`POST /register`)
3. Backend checks if email already exists
4. Password is encrypted (hashed) using bcrypt
5. Data is inserted into `users` array in `data.json`
6. Session is created (user is logged in)
7. Response sent back to frontend

### When User Fills Academic Form:
1. User fills academic details form
2. Frontend sends data to backend (`POST /student/details`)
3. Backend checks if user is logged in (session check)
4. Data is saved/updated in `student_details` array in `data.json`
5. Response sent back to frontend

### When User Logs In:
1. User enters email and password
2. Frontend sends to backend (`POST /login`)
3. Backend finds user by email in `users` array
4. Password is compared (encrypted comparison)
5. If correct, session is created
6. Response sent back to frontend

---

## Where is the Database File?

**Location:** 
```
C:\Users\srisa\OneDrive\Pictures\prajju-main\data.json
```

**When is it created?**
- Automatically when you first run `npm start`
- If you delete it, it will be recreated (but all data will be lost!)

**File Size:**
- Starts small (few KB)
- Grows as you add more users and data
- Typically stays under 1 MB for small applications

---

## How to View Your Database

### Option 1: Use view_data.js (Recommended)
1. Run: `node view_data.js`
2. Or double-click: `view_data.bat`
3. See formatted, readable output

### Option 2: Open JSON File Directly
1. Open `data.json` in any text editor (Notepad, VS Code, etc.)
2. You'll see the raw JSON data
3. **Note:** Passwords are hashed (encrypted) - you can't see the actual password

### Option 3: Use a JSON Viewer
- Install a JSON viewer extension in VS Code
- Open `data.json` - it will format it nicely

---

## Database Security

### What's Protected:
1. **Passwords:**
   - Never stored as plain text
   - Encrypted using bcrypt (one-way encryption)
   - Even if someone gets the database, they can't see passwords

2. **Sessions:**
   - Users must be logged in to access their data
   - Session stored on server, not in database

3. **Data Isolation:**
   - Each user can only see their own data
   - Backend checks user_id before showing data

### What's NOT Protected (by default):
- The database file itself (if someone has access to your computer)
- For production, you'd want to:
  - Encrypt the database file
  - Use environment variables for secrets
  - Add more security layers

---

## Backup Your Data

### Simple Backup:
1. Just copy the `data.json` file
2. Paste it somewhere safe
3. That's it! You have a backup

### Restore Backup:
1. Stop the server
2. Replace `data.json` with your backup file
3. Start the server again

---

## Database vs Other Options

### JSON File (What We're Using) ✅
- ✅ Simple, no setup
- ✅ File-based
- ✅ Perfect for learning
- ❌ Not for very large apps

### MySQL/PostgreSQL (Alternative)
- ✅ Better for large applications
- ✅ Multiple users simultaneously
- ❌ Requires separate installation
- ❌ More complex setup

### MongoDB (Alternative)
- ✅ NoSQL (different structure)
- ✅ Good for flexible data
- ❌ Requires separate installation
- ❌ Different learning curve

**For this project, JSON file is perfect!** 🎯

---

## Summary

- **Database Type:** JSON file-based
- **File Name:** `data.json`
- **Location:** Project folder
- **Created:** Automatically on first run
- **Contains:** Users and student details
- **View:** Use `node view_data.js` or open `data.json`
- **Backup:** Just copy the file
- **Perfect For:** Learning, small projects, single-user apps

---

**That's it! JSON file database is simple, powerful, and perfect for your project!** 🎉
