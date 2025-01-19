@echo off
REM Change to the frontend directory and start React
cd C:\Users\HP\Desktop\FYP\Frontend
start cmd /k "npm run dev"

REM Change to the backend directory and start Node.js server
cd ../Backend
start cmd /k "npm start"

REM Wait for the servers to start
timeout /t 5 >nul

REM Open the default web browser to localhost
start http://localhost:5173

REM Return to the parent directory
cd ..
echo Servers and frontend are starting. Webpage is opening in your browser.
pause
