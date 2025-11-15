@echo off
echo Starting Schoola-Taawon Application...

REM Start MongoDB (if using local MongoDB)
REM start "MongoDB" mongod --dbpath "C:\data\db"

REM Start Backend Server
start "Backend Server" cmd /k "cd server && npm run dev"

REM Start Frontend Client
start "Frontend Client" cmd /k "cd client && npm start"

echo Application started successfully!
echo Backend: http://localhost:5001
echo Frontend: http://localhost:3000
pause
