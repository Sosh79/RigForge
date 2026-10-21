@echo off
setlocal enabledelayedexpansion
title Starting RigForge...

set "TARGET_DIR=%~dp0RigForge\bin\Release\net8.0-windows\win-x64\publish"
set "TARGET_EXE=%TARGET_DIR%\RigForge.exe"

if not exist "!TARGET_EXE!" (
    echo.
    echo ========================================================
    echo  [RigForge Error] Executable not found:
    echo  !TARGET_EXE!
    echo ========================================================
    echo.
    echo The project has not been built or the path is missing.
    echo.
    pause
    exit /b 1
)

echo Starting RigForge...
cd /d "!TARGET_DIR!"
start "" "!TARGET_EXE!"
exit /b 0
