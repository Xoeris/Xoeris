@echo off
setlocal
echo =========================================
echo  Pushing Updates to Xoeris GitHub Repo
echo =========================================

REM Add git safe directory exception in case of ownership mismatched environment
git config --global --add safe.directory E:/Home/Projects/Users/Acelbyte/Categories/Programmings/projects/Xoeris/websites/Xoeris >nul 2>&1

set /p COMMIT_MSG="Enter commit message (default: Update website): "
if "%COMMIT_MSG%"=="" set COMMIT_MSG=Update website

echo.
echo Staging all changes...
git add -A

echo Committing with message: "%COMMIT_MSG%"
git commit -m "%COMMIT_MSG%"

echo.
echo Pushing to GitHub (xoeris main)...
git push xoeris main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo [SUCCESS] Project successfully updated on GitHub!
) else (
    echo.
    echo [ERROR] Failed to push to GitHub. Attempting push to origin main...
    git push origin main
)

echo.
pause
