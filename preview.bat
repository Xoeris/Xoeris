@echo off
echo Building Acelbyte Website...
call npm run build
echo.
echo Starting Production Preview on localhost...
call npm run preview
pause
