@echo off
echo ========================================
echo Starting Frontend Server...
echo ========================================
echo.
echo Frontend will run on: http://localhost:8000
echo.
echo Open in browser: http://localhost:8000/index.html
echo.
echo Keep this window open!
echo Press Ctrl+C to stop the server
echo.
python -m http.server 8000
pause

