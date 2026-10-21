@echo off
cd /d "%~dp0website"
echo ===================================================
echo   RigForge Official Website - Local Development
echo ===================================================
echo Opening website on local server...
start http://localhost:5173
npm run dev
