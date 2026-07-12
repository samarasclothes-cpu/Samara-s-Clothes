@echo off
chcp 65001 >nul
title Samara's Clothes - Recompilar
cd /d "%~dp0"

echo ==================================================
echo    SAMARA'S CLOTHES  -  Recompilando
echo ==================================================
echo.
echo   Usa esto SOLO si cambiaste lib\config.js
echo   (WhatsApp, categorias, moneda) o el codigo.
echo   NO hace falta para agregar productos desde /admin.
echo.

call npm run build

echo.
echo Listo. Ahora abre  iniciar-tienda.bat  para arrancar la tienda.
pause
