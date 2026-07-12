@echo off
chcp 65001 >nul
title Samara's Clothes - Catalogo (puerto 9000)
cd /d "%~dp0"

echo ==================================================
echo    SAMARA'S CLOTHES  -  Iniciando catalogo
echo ==================================================
echo.

REM --- Instala dependencias la primera vez ---
if not exist "node_modules" (
  echo [1/2] Instalando dependencias por primera vez...
  call npm install
  echo.
)

REM --- Compila si aun no existe el build ---
if not exist ".next" (
  echo [2/2] Compilando la tienda por primera vez...
  call npm run build
  echo.
)

echo --------------------------------------------------
echo   Tienda local:    http://localhost:9000
echo   Enlace publico:   https://9000.aplicacionesdamasco.com
echo --------------------------------------------------
echo.
echo   Deja esta ventana ABIERTA mientras uses la tienda.
echo   Cierrala (o pulsa Ctrl+C) para apagar la tienda.
echo.

call npm run start -- -p 9000

echo.
echo La tienda se detuvo.
pause
