@echo off
REM T.I Assistant - Backend Server (Windows)
REM Com suporte opcional a ChatGPT

echo.
echo ============================================
echo  T.I Assistant - Servidor Backend
echo ============================================
echo.

REM Verificar se Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Erro: Node.js nao encontrado!
    echo.
    echo Por favor, instale Node.js de: https://nodejs.org
    pause
    exit /b 1
)

REM Verificar se .env existe
if not exist .env (
    echo.
    echo [!] Arquivo .env nao encontrado!
    echo.
    echo Para usar ChatGPT, crie o arquivo .env baseado em .env.example
    echo ou execute para usar apenas comandos locais
    echo.
)

REM Instalar dependências se node_modules não existe
if not exist node_modules (
    echo Instalando dependências...
    call npm install
)

REM Iniciar servidor
echo.
echo Iniciando servidor em http://localhost:3000
echo.
echo Abra seu navegador e acesse:
echo   http://localhost:3000
echo.
echo Para parar, pressione CTRL + C
echo.

node server.js

pause
