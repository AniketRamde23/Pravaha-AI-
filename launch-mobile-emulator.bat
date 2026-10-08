@echo off
title Pravaha AI - Mobile Phone Emulator
echo ========================================================
echo   Starting Pravaha AI Mobile Phone Emulator on PC...
echo ========================================================
echo.
echo Opening interactive smartphone simulator in your browser...
echo No mobile device or QR code scanning required!
echo.
cd /d "%~dp0smartroad-mobile"
call npm run web
pause
