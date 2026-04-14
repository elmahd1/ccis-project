@echo off
title Lancement de l'Application
echo ==========================================
echo    Demarrage de l'application...
echo ==========================================

:: 1. Verifier si Docker tourne
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERREUR] Docker Desktop n'est pas lance.
    echo Veuillez ouvrir Docker Desktop d'abord, puis relancez ce script.
    pause
    exit /b
)

:: 2. Lancer ou verifier les conteneurs (le -d permet de lancer en arriere-plan)
echo Verification et lancement des serveurs...
docker-compose up -d --build

:: 3. Attendre quelques secondes que Spring Boot et MySQL s'initialisent
echo Veuillez patienter pendant le chargement...
timeout /t 5 /nobreak >nul

:: 4. Ouvrir le navigateur
echo Application prete ! Ouverture dans votre navigateur...
start http://localhost:3000

exit