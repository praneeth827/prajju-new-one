# 🚀 Quick Start Guide - Run Your Project Again

## ⚡ Fastest Way (3 Steps)

### Step 1: Start Backend Server
**Open PowerShell** in your project folder and run:
```bash
npm start
```
**Keep this window open!**

You should see:
```
============================================================
Node.js Backend Server Starting...
Server running at: http://localhost:3000
Database: JSON file (data.json)
============================================================
```

### Step 2: Start Frontend Server
**Open a NEW PowerShell window** (keep backend running!) and run:
```bash
python -m http.server 8000
```
**Keep this window open too!**

### Step 3: Open in Browser
Go to:
```
http://localhost:8000/index.html
```

**That's it! Your project is running!** ✅

---

## 🎯 Even Easier Way (Double-Click Method)

### Option 1: Use Batch Files

1. **Double-click:** `start_backend.bat`
   - This starts the backend server
   - Keep the window open!

2. **Double-click:** `start_frontend.bat`
   - This starts the frontend server
   - Keep this window open too!

3. **Open browser:** `http://localhost:8000/index.html`

---

## 📋 Detailed Step-by-Step

### Prerequisites Check
Make sure you have:
- ✅ Node.js installed (`node --version` should work)
- ✅ Python installed (`python --version` should work)
- ✅ Project folder: `C:\Users\srisa\OneDrive\Pictures\prajju-main`

### Step-by-Step Instructions

#### 1. Open Project Folder
- Navigate to: `C:\Users\srisa\OneDrive\Pictures\prajju-main`
- Or right-click folder → "Open in Terminal" / "Open PowerShell here"

#### 2. Start Backend (Terminal 1)

**Method A: Using PowerShell**
```bash
cd C:\Users\srisa\OneDrive\Pictures\prajju-main
npm start
```

**Method B: Using Batch File**
- Double-click `start_backend.bat`

**What to expect:**
- Window shows: "Server running at: http://localhost:3000"
- **DO NOT CLOSE THIS WINDOW!**

#### 3. Start Frontend (Terminal 2)

**Open a NEW PowerShell window:**

**Method A: Using PowerShell**
```bash
cd C:\Users\srisa\OneDrive\Pictures\prajju-main
python -m http.server 8000
```

**Method B: Using Batch File**
- Double-click `start_frontend.bat`

**What to expect:**
- Window shows: "Serving HTTP on 0.0.0.0 port 8000"
- **DO NOT CLOSE THIS WINDOW!**

#### 4. Open Application

**Open your web browser** and go to:
```
http://localhost:8000/index.html
```

**You should see:**
- Login/Registration page
- Your project is ready to use!

---

## ✅ Verification Checklist

Before using the app, verify:

- [ ] Backend is running (check `http://localhost:3000` - should show JSON)
- [ ] Frontend is running (check `http://localhost:8000` - should show file listing)
- [ ] Application opens (`http://localhost:8000/index.html`)
- [ ] Login works (use your registered email/password)

---

## 🔧 Troubleshooting

### Problem: "npm is not recognized"

**Solution:**
1. Restart PowerShell (to refresh PATH)
2. Or refresh PATH manually:
```powershell
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
```

### Problem: "python is not recognized"

**Solution:**
- Python might not be installed or not in PATH
- Try: `py -m http.server 8000` instead

### Problem: Port 3000 already in use

**Solution:**
- Something else is using port 3000
- Close other applications using that port
- Or change port in `server.js` (line with `const PORT = 3000;`)

### Problem: Port 8000 already in use

**Solution:**
- Use a different port: `python -m http.server 8080`
- Then open: `http://localhost:8080/index.html`

### Problem: Backend not connecting

**Check:**
1. Is backend window still open?
2. Test: Open `http://localhost:3000` in browser
3. Should see: `{"success":true,"message":"Backend is running"}`

---

## 📝 Quick Reference Commands

### Start Everything (Copy-Paste)

**Terminal 1 (Backend):**
```bash
cd C:\Users\srisa\OneDrive\Pictures\prajju-main
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

## 🎯 What Happens When You Start?

1. **Backend starts:**
   - Loads `data.json` (your stored data)
   - Starts listening on port 3000
   - Ready to handle API requests

2. **Frontend starts:**
   - Serves HTML/CSS/JS files
   - Makes them accessible via HTTP
   - Ready to connect to backend

3. **Browser opens:**
   - Loads `index.html`
   - Connects to backend at `http://localhost:3000`
   - Shows login/registration page

---

## 💾 Your Data is Safe!

- All your registered users are stored in `data.json`
- Data persists even after shutdown
- Just start the servers again to access it

---

## 🛑 How to Stop Servers

**To stop:**
1. Go to each PowerShell window
2. Press `Ctrl + C`
3. Or simply close the windows

---

## 📁 Important Files

- `server.js` - Backend server code
- `data.json` - Your stored data (users, academic details)
- `index.html` - Frontend page
- `script.js` - Frontend JavaScript
- `package.json` - Dependencies list

---

## 🎉 Summary

**Every time you want to run your project:**

1. **Start backend:** `npm start` (or double-click `start_backend.bat`)
2. **Start frontend:** `python -m http.server 8000` (or double-click `start_frontend.bat`)
3. **Open browser:** `http://localhost:8000/index.html`

**That's it! Simple and easy!** ✅

---

**Need help? Check `SETUP_GUIDE.md` for detailed instructions.**

