#!/bin/bash

# T.I Assistant - Backend Server (Linux/macOS)
# Com suporte opcional a ChatGPT

echo ""
echo "============================================"
echo "  T.I Assistant - Servidor Backend"
echo "============================================"
echo ""

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "Erro: Node.js não encontrado!"
    echo ""
    echo "Por favor, instale Node.js:"
    echo "  Ubuntu/Debian: sudo apt-get install nodejs npm"
    echo "  macOS: brew install node"
    echo "  Ou acesse: https://nodejs.org"
    exit 1
fi

# Verificar se .env existe
if [ ! -f .env ]; then
    echo ""
    echo "[!] Arquivo .env não encontrado!"
    echo ""
    echo "Para usar ChatGPT, crie o arquivo .env baseado em .env.example"
    echo "ou execute para usar apenas comandos locais"
    echo ""
fi

# Instalar dependências se node_modules não existe
if [ ! -d node_modules ]; then
    echo "Instalando dependências..."
    npm install
fi

# Iniciar servidor
echo ""
echo "Iniciando servidor em http://localhost:3000"
echo ""
echo "Abra seu navegador e acesse:"
echo "  http://localhost:3000"
echo ""
echo "Para parar, pressione CTRL + C"
echo ""

node server.js
