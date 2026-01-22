# 📊 Data Storage & Login Guide

## ✅ YES! Your Data IS Being Stored!

### Current Status:
- ✅ **1 User Registered**: Praneeth (praneeth123@gmail.com)
- ✅ **Data File**: `data.json` in your project folder
- ✅ **Password**: Securely hashed (encrypted)

---

## 📁 Where is Data Stored?

### Location:
```
C:\Users\srisa\OneDrive\Pictures\prajju-main\data.json
```

### What Gets Stored:

1. **Users Table** (Registration Data):
   - Name
   - Email
   - Phone
   - Password (encrypted/hashed - never stored as plain text!)
   - Registration date

2. **Student Details Table** (Academic Form Data):
   - Roll Number
   - B.Tech Year
   - CGPA (Present & Previous)
   - Attendance
   - Gender, Category, Quota Type
   - Backlogs status

---

## 🔍 How to View Your Stored Data

### Method 1: Using the Viewer Script (Easiest)

**Double-click:** `view_data.bat`

OR

**Run in PowerShell:**
```bash
node view_data.js
```

This will show:
- All registered users
- All academic details
- Registration dates
- Last updated times

### Method 2: Open the JSON File Directly

1. Open `data.json` in any text editor (Notepad, VS Code, etc.)
2. You'll see the raw JSON data
3. **Note:** Passwords are hashed (encrypted) - you can't see the actual password

### Method 3: Use a JSON Viewer

- Install a JSON viewer extension in VS Code
- Open `data.json` - it will format it nicely

---

## 🔐 Login & Dashboard Access

### How Login Works:

1. **User enters email and password**
2. **Backend checks:**
   - Email exists in database?
   - Password matches (compares hash)?
3. **If correct:**
   - Creates a session (user is logged in)
   - Redirects to dashboard ✅
4. **If incorrect:**
   - Shows error message ❌

### Login Flow:

```
Login Form → Backend Check → Session Created → Dashboard Opens
```

### Test Login with Your Registered User:

**Email:** `praneeth123@gmail.com`  
**Password:** (the password you used during registration)

**Expected Result:**
- ✅ Login successful message
- ✅ Dashboard opens automatically
- ✅ You can see all features (Academic Input, Eligibility, etc.)

---

## 🎯 Current Data Status

Based on your `data.json` file:

### ✅ Registered Users: 1
- **Name:** Praneeth
- **Email:** praneeth123@gmail.com
- **Phone:** 7981222645
- **Registered:** 22/1/2026, 2:37:02 pm

### ⏳ Academic Details: 0
- No academic details saved yet
- User needs to fill the "Academic Input" form after logging in

---

## 📝 Step-by-Step: Register → Login → Dashboard

### Step 1: Register (Already Done ✅)
- Fill registration form
- Click "Register"
- Data saved to `data.json`
- User automatically logged in
- Dashboard should open

### Step 2: Login (If Logged Out)
1. Go to login page
2. Enter email: `praneeth123@gmail.com`
3. Enter password: (your password)
4. Click "Login"
5. **Dashboard opens automatically** ✅

### Step 3: Fill Academic Details
1. Click "Academic Input" icon on dashboard
2. Fill all fields (Roll Number, CGPA, Attendance, etc.)
3. Click "Save Academic Data"
4. Data saved to `data.json` ✅

---

## 🔧 Troubleshooting

### Problem: Login doesn't open dashboard

**Check:**
1. Is backend running? (`http://localhost:3000` should work)
2. Is frontend running? (`http://localhost:8000/index.html`)
3. Check browser console (F12) for errors
4. Try clearing browser cache and cookies

### Problem: Can't see stored data

**Solution:**
- Run `node view_data.js` to view data
- Check `data.json` file exists
- Make sure backend is running when registering/login

### Problem: Login says "Invalid email or password"

**Check:**
- Email is correct (case doesn't matter)
- Password is correct
- User exists in `data.json` (run `node view_data.js`)

---

## 📊 Data File Structure

Your `data.json` looks like this:

```json
{
  "users": [
    {
      "id": 1,
      "name": "Praneeth",
      "email": "praneeth123@gmail.com",
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
      ...
    }
  ]
}
```

---

## ✅ Summary

1. **Data IS stored** ✅ - Check `data.json` file
2. **Login SHOULD open dashboard** ✅ - After successful login
3. **View data easily** ✅ - Run `node view_data.js` or double-click `view_data.bat`

---

## 🎯 Quick Commands

**View stored data:**
```bash
node view_data.js
```

**Or double-click:** `view_data.bat`

**Check if backend is running:**
```bash
# Open browser: http://localhost:3000
```

**Check if frontend is running:**
```bash
# Open browser: http://localhost:8000/index.html
```

---

**Your data is safe and stored! Login should work perfectly!** 🎉

