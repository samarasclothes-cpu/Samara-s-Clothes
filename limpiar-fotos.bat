@echo off
chcp 65001 >nul
title Samara's Clothes - Limpiar fotos
cd /d "%~dp0"

if "%1"=="todas" (
  node herramientas\limpiar-fotos.js --todas
) else if "%1"=="huerfanas" (
  node herramientas\limpiar-fotos.js --huerfanas
) else (
  node herramientas\limpiar-fotos.js
)

echo.
pause
