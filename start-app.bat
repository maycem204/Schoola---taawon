@echo off
cd /d C:\Users\hcman\Desktop\schoola-taawon\server
call pm2 start ecosystem.config.js --env production
cd /d C:\Users\hcman\Desktop\schoola-taawon\client
serve -s build -l 3000