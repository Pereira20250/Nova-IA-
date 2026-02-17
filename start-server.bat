@echo off
REM T.I Assistant - Servidor Local (Windows)
REM Este script inicia um servidor web local para o T.I Assistant

echo.
echo ============================================
echo  T.I Assistant - Servidor Local
echo ============================================
echo.

REM Verificar se Python está instalado
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Erro: Python não encontrado!
    echo.
    echo Por favor, instale Python de: https://www.python.org/downloads/
    pause
    exit /b 1
)

REM Iniciar servidor
echo Iniciando servidor em http://localhost:8000
echo.
echo Para parar o servidor, pressione CTRL + C
echo.

python -m http.server 8000 --directory .

pause
