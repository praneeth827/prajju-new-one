# Student Academic & Scholarship Advisor

A web application for students to manage academic details, check scholarship eligibility, and get personalized recommendations.

## 🚀 Quick Start

### Prerequisites
- **Node.js** (Download from https://nodejs.org/)
- **Python** (for serving frontend - usually pre-installed)

### Installation & Setup

1. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

2. **Start Backend (Terminal 1):**
   ```bash
   npm start
   ```
   Or double-click: `start_backend.bat`

3. **Start Frontend (Terminal 2):**
   ```bash
   python -m http.server 8000
   ```
   Or double-click: `start_frontend.bat`

4. **Open in Browser:**
   ```
   http://localhost:8000/index.html
   ```

## 🗄️ Database

- **Type:** JSON file-based database
- **File:** `data.json` (created automatically)
- **Location:** Project root folder
- **No installation needed** - Just a JSON file

### What Gets Stored?
- User accounts (registration/login)
- Student academic details (CGPA, attendance, etc.)
- All form submissions

### View Database
- Open `data.json` file in any text editor
- Or use `node view_data.js` to view formatted data

## 📁 Project Structure

```
├── index.html          # Frontend HTML
├── script.js           # Frontend JavaScript
├── styles.css          # Frontend Styling
├── server.js           # Node.js Backend
├── package.json        # Node.js Dependencies
├── data.json           # JSON Database (auto-created)
└── node_modules/       # Dependencies (auto-created)
```

## 🔧 Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js + Express
- **Database:** JSON file-based (data.json)
- **Authentication:** Session-based with bcrypt

## 📖 Detailed Setup

See `SETUP_GUIDE.md` for complete step-by-step instructions.

## ⚠️ Important Notes

- Keep both backend and frontend servers running while using the app
- Don't delete `data.json` file (contains all your data)
- Always open HTML from `http://localhost:8000/index.html`, not by double-clicking

## 🐛 Troubleshooting

- **Backend not connecting?** Check `http://localhost:3000` in browser
- **Port in use?** Change port in `server.js` and `script.js`
- **Module errors?** Run `npm install` again

