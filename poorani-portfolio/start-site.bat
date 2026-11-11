@echo off
title Poorani K portfolio
cd /d "%~dp0"
where node >NUL 2>NUL
if errorlevel 1 (
  echo Node.js is not installed. Opening the download page...
  echo Install the LTS version, then double-click this file again.
  echo Or just open the "open-without-install" folder and double-click index.html
  start https://nodejs.org/en/download
  pause
  exit /b 1
)
if not exist node_modules\next (
  echo Installing packages - first run only, this takes a few minutes...
  call npm install
  if errorlevel 1 (
    echo.
    echo Install failed. Copy the messages above and send them to Claude.
    pause
    exit /b 1
  )
)
echo.
echo Starting the site. Your browser opens http://localhost:3000 automatically once it is ready.
echo Keep this window open while you use the site. Close it to stop.
echo.
start "" powershell -NoProfile -WindowStyle Hidden -Command "for($i=0;$i -lt 120;$i++){try{Invoke-WebRequest -UseBasicParsing http://localhost:3000 -TimeoutSec 3 | Out-Null; Start-Process http://localhost:3000; break}catch{Start-Sleep 2}}"
call npm run dev
echo.
echo The site stopped. If you see an error above, send it to Claude.
pause
