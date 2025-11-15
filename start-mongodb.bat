@echo off
echo 🚀 Démarrage de MongoDB...

REM Essayer de démarrer le service MongoDB
echo Tentative de démarrage du service MongoDB...
net start MongoDB 2>nul
if %errorlevel% equ 0 (
    echo ✅ Service MongoDB démarré avec succès
    goto :success
)

REM Si le service n'existe pas, essayer de démarrer mongod directement
echo Service non trouvé, tentative de démarrage direct...

REM Chemins communs d'installation de MongoDB
set MONGO_PATHS="C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" "C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe" "C:\Program Files\MongoDB\Server\5.0\bin\mongod.exe"

for %%p in (%MONGO_PATHS%) do (
    if exist %%p (
        echo Démarrage de MongoDB depuis %%p
        start "MongoDB" %%p --dbpath "C:\data\db"
        timeout /t 3 /nobreak >nul
        goto :success
    )
)

echo ❌ MongoDB non trouvé. Veuillez :
echo 1. Ouvrir MongoDB Compass
echo 2. Ou installer MongoDB Community Server
echo 3. Ou démarrer MongoDB manuellement
pause
exit /b 1

:success
echo ✅ MongoDB est maintenant en cours d'exécution
echo 🌐 Vous pouvez utiliser MongoDB Compass sur : mongodb://localhost:27017
echo.
echo Appuyez sur une touche pour continuer...
pause >nul
