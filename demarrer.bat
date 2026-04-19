@echo off
title Lancement de l'Application
echo ==========================================
echo    Demarrage de l'application...
echo ==========================================

:: 1. Verifier si Docker tourne [cite: 1]
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERREUR] Docker Desktop n'est pas lance. [cite: 1]
    echo Veuillez ouvrir Docker Desktop d'abord, puis relancez ce script. [cite: 1]
    pause
    exit /b
)

:: 2. Lancer ou verifier les conteneurs [cite: 1]
echo Compilation du code et lancement des serveurs...
echo (Le premier lancement peut prendre quelques minutes pour compiler le code)
docker-compose up -d --build

:: 3. Attendre que Spring Boot et React s'initialisent
echo Veuillez patienter pendant le chargement des conteneurs...
timeout /t 45 /nobreak >nul

:: 4. Ouvrir le navigateur [cite: 1, 2]
echo Application prete ! Ouverture dans votre navigateur... [cite: 2]
start http://localhost:3000

exit