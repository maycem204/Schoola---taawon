@echo off
set BACKUP_PATH=C:\Users\hcman\Desktop\schoola-taawon\server
set NODE_PATH=%BACKUP_PATH%\node_modules
set SMTP_USER=votre_email@gmail.com
set SMTP_PASS=votre_mot_de_passe_app

cd %BACKUP_PATH%
node scripts/backup.js >> logs/backup.log 2>&1