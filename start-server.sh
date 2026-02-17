#!/bin/bash

# T.I Assistant - Servidor Local (Linux/Mac)
# Este script inicia um servidor web local para o T.I Assistant

echo ""
echo "============================================"
echo "  T.I Assistant - Servidor Local"
echo "============================================"
echo ""

# Verificar se Python está instalado
if ! command -v python3 &> /dev/null; then
    echo "Erro: Python não encontrado!"
    echo ""
    echo "Por favor, instale Python:"
    echo "  Ubuntu/Debian: sudo apt-get install python3"
    echo "  macOS: brew install python3"
    echo "  Ou acesse: https://www.python.org/downloads/"
    exit 1
fi

# Iniciar servidor
echo "Iniciando servidor em http://localhost:8000"
echo ""
echo "Para parar o servidor, pressione CTRL + C"
echo ""

python3 -m http.server 8000

