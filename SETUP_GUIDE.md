# 🚀 Node.js Backend Setup Guide - Simple Steps

## 📋 What You Need
- **Node.js** installed on your computer (download from nodejs.org)
- Your project files (index.html, script.js, styles.css, server.js, package.json)

---

## 🗄️ Database Used: JSON File-Based

**What is JSON File Database?**
- Simple JSON file that stores all your data
- **No installation needed** - it's just a file (data.json) that gets created automatically
- All your data (users, student details) is stored in one file: `data.json`
- Perfect for small to medium applications
- Works on Windows, Mac, Linux

**What gets stored?**
- User accounts (name, email, phone, password)
- Student academic details (CGPA, attendance, backlogs, etc.)
- All registration and login information

**Where is it stored?**
- In a file called `data.json` in your project folder
- Created automatically when you first run the server
- You can see it, but don't delete it (it has all your data!)

---

## ✅ STEP 1: Install Node.js

1. **Download Node.js:**
   - Go to: https://nodejs.org/
   - Download the **LTS version** (recommended)
   - Run the installer
   - Click "Next" through all steps (default settings are fine)

2. **Verify Installation:**
   - Open PowerShell
   - Type: `node --version`
   - You should see something like: `v20.x.x`
   - Type: `npm --version`
   - You should see something like: `10.x.x`

✅ **If you see version numbers, Node.js is installed!**

---

## ✅ STEP 2: Install Project Dependencies

**Open PowerShell in your project folder:**
```
C:\Users\srisa\OneDrive\Pictures\prajju-main
```

**Run this command:**
```bash
npm install
```

**What this does:**
- Downloads and installs all required packages (Express, bcrypt, etc.)
- Creates a `node_modules` folder (don't delete this!)

**Expected output:**
- You'll see packages being downloaded
- Wait until it says "added X packages"

**Time:** Takes 1-2 minutes (first time only)

---

## ✅ STEP 3: Start the Node.js Backend Server

**In the same PowerShell window, run:**
```bash
npm start
```

**What this does:**
- Starts your Node.js backend server on port 3000
- Creates the database file (data.json) automatically
- Sets up all database tables

**Expected output:**
```
============================================================
Node.js Backend Server Starting...
Server running at: http://localhost:3000
Database: JSON file (data.json)
Make sure to serve your HTML file from an HTTP server
============================================================
```

**⚠️ IMPORTANT:** Keep this PowerShell window open! The backend must keep running.

---

## ✅ STEP 4: Test if Backend is Running

**Open your web browser** and go to:
```
http://localhost:3000
```

**What you should see:** A JSON message:
```json
{
  "success": true,
  "message": "Backend is running",
  "status": "healthy"
}
```

✅ **If you see this, your backend is working!**

❌ **If you see "This site can't be reached"**, check:
- Did you run `npm start`?
- Is the PowerShell window still open?
- Is port 3000 already in use?

---

## ✅ STEP 5: Start the Frontend Server

**Open a NEW PowerShell window** (keep the backend one running!) and navigate to your project folder:

```bash
cd C:\Users\srisa\OneDrive\Pictures\prajju-main
```

Then run:
```bash
python -m http.server 8000
```

**What this does:** Serves your HTML file from an HTTP server on port 8000.

**Expected output:**
```
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
```

**⚠️ IMPORTANT:** Keep this PowerShell window open too!

---

## ✅ STEP 6: Open Your Application

**Open your web browser** and go to:
```
http://localhost:8000/index.html
```

**What you should see:** Your registration/login page.

---

## ✅ STEP 7: Test the Connection

1. **Fill in the registration form** with your details
2. **Click "Register"**
3. **What should happen:**
   - ✅ If backend is connected: You'll see "Registration successful!" message
   - ❌ If backend is NOT connected: You'll see an error popup

---

## 📊 Summary: What's Running?

You should have **TWO PowerShell windows open**:

1. **Window 1 (Backend):** Running `npm start` → Node.js on port 3000
2. **Window 2 (Frontend):** Running `python -m http.server 8000` → HTML on port 8000

**Your browser:** Open at `http://localhost:8000/index.html`

**Database:** JSON file `data.json` in your project folder (created automatically)

---

## 🗄️ Understanding the Database

### What is JSON File Database?
- **File-based database** - all data in one JSON file (`data.json`)
- **No separate server needed** - it's just a JSON file
- **Automatic** - created when you first run the server
- **Simple** - perfect for learning and small projects

### What Data Structures Are Created?

1. **`users` array:**
   - Stores: id, name, email, phone, password_hash
   - Used for: Registration, Login

2. **`student_details` array:**
   - Stores: roll_number, CGPA, attendance, backlogs, etc.
   - Used for: Academic information, eligibility checks

### How to View Your Data?

**Option 1: Use view_data.js (Recommended)**
- Run: `node view_data.js`
- Or double-click: `view_data.bat`
- Shows formatted, readable data

**Option 2: Open JSON File**
- Open `data.json` in any text editor
- View raw JSON data
- Use a JSON formatter for better readability

### Where is Data Stored?
- **Location:** `C:\Users\srisa\OneDrive\Pictures\prajju-main\data.json`
- **Size:** Grows as you add more users/data
- **Backup:** Just copy the `data.json` file to backup your data

---

## 🔧 Troubleshooting

### Problem: "Cannot connect to backend server" error

**Solution:**
1. Check if backend is running: Go to `http://localhost:3000` in browser
2. If it doesn't work, restart the backend: Press `Ctrl+C` in backend PowerShell, then run `npm start` again
3. Make sure you're opening the HTML from `http://localhost:8000/index.html`, NOT by double-clicking the file

### Problem: "npm is not recognized"

**Solution:**
- Node.js is not installed or not in PATH
- Reinstall Node.js from nodejs.org
- Restart PowerShell after installation

### Problem: Port 3000 is already in use

**Solution:**
1. Find what's using port 3000: `netstat -ano | findstr :3000`
2. Or change port in `server.js` (line with `const PORT = 3000;`) to `3001`
3. Then change in `script.js`: `API_BASE_URL = 'http://localhost:3001'`

### Problem: "Module not found" error

**Solution:**
Run: `npm install` again in your project folder

### Problem: Database not working

**Solution:**
- Delete `data.json` file (if corrupted)
- Restart the server - it will create a new database automatically
- ⚠️ **Warning:** This deletes all your data!

---

## 🎯 Quick Start Commands (Copy-Paste)

**Terminal 1 (Backend):**
```bash
cd C:\Users\srisa\OneDrive\Pictures\prajju-main
npm install
npm start
```

**Terminal 2 (Frontend):**
```bash
cd C:\Users\srisa\OneDrive\Pictures\prajju-main
python -m http.server 8000
```

**Browser:**
```
http://localhost:8000/index.html
```

---

## ✅ Success Checklist

- [ ] Node.js installed (`node --version` works)
- [ ] Dependencies installed (`npm install` completed)
- [ ] Backend running (`npm start` - see "Server running at: http://localhost:3000")
- [ ] Backend test works (`http://localhost:3000` shows JSON)
- [ ] Frontend server running (`python -m http.server 8000`)
- [ ] Browser opened at `http://localhost:8000/index.html`
- [ ] Registration form works without errors
- [ ] Database file `data.json` created in project folder

---

## 📁 Project Structure

```
prajju-main/
├── index.html          (Frontend - Your web page)
├── script.js           (Frontend - JavaScript code)
├── styles.css          (Frontend - Styling)
├── server.js           (Backend - Node.js server)
├── package.json        (Backend - Dependencies list)
├── data.json            (Database - Created automatically)
└── node_modules/       (Dependencies - Created by npm install)
```

---

## 🎉 You're All Set!

Once all checkboxes are done, your Node.js backend is connected and your data is being stored in JSON database!

**Remember:**
- Keep both PowerShell windows open while using the app
- The database file (`data.json`) contains all your data - don't delete it
- To stop the servers, press `Ctrl+C` in each PowerShell window

