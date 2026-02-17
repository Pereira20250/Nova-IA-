# 🚀 Configuração OpenAI - T.I Assistant

## ⚙️ Passos para Integrar ChatGPT ao T.I

### 1️⃣ Obtenha sua Chave de API OpenAI

1. Acesse: https://platform.openai.com/account/api-keys
2. Faça login com sua conta OpenAI (crie uma se não tiver)
3. Clique em "Create new secret key"
4. Copie a chave gerada (ela começa com `sk-`)
5. **⚠️ Guarde-a com segurança - não compartilhe!**

### 2️⃣ Configure o Arquivo .env

1. Na pasta do T.I, procure por `.env.example`
2. Faça uma cópia e renomeie para `.env`
3. Abra o arquivo `.env` e preencha:

```
OPENAI_API_KEY=sk-sua-chave-aqui
OPENAI_MODEL=gpt-3.5-turbo
PORT=3000
NODE_ENV=production
```

4. Salve o arquivo

### 3️⃣ Reinicie o Servidor

Após adicionar a chave no `.env`:

```bash
# Parar o servidor (Ctrl + C no terminal)
# Depois iniciar novamente:
node server.js
```

### 4️⃣ Teste a Integração

Fale com o T.I:
- "Qual é a capital da França?"
- "Me explique o que é inteligência artificial"
- "Como faço um biscoito?"
- "Quem ganhou a Copa de 1970?"

## ✅ Funcionalidades Ativadas com ChatGPT

✨ **Responder Qualquer Pergunta** - O ChatGPT responde perguntas complexas
🗣️ **Melhor Síntese de Voz** - Usando Google TTS para falar corretamente
💬 **Conversa Contínua** - O assistente lembra do contexto da conversa
⚡ **Rápido e Preciso** - Usando modelo gpt-3.5-turbo

## 🎯 Modelos Disponíveis

| Modelo | Velocidade | Qualidade | Custo |
|--------|-----------|----------|-------|
| `gpt-3.5-turbo` | ⚡⚡⚡ | ⭐⭐⭐⭐ | 💰 |
| `gpt-4` | ⚡⚡ | ⭐⭐⭐⭐⭐ | 💰💰💰 |
| `gpt-4-turbo-preview` | ⚡⚡ | ⭐⭐⭐⭐⭐ | 💰💰 |

## 📊 Informações de Custo

- **gpt-3.5-turbo**: ~$0.0005 por 1000 tokens (muito barato!)
- **gpt-4**: ~$0.03 por 1000 tokens
- Uma conversa média = 100-200 tokens

## 🔍 Endpoints da API Backend

### 1. Chat com Histórico
```
POST /api/chat
Body: {
  "message": "Sua pergunta aqui",
  "conversationHistory": [...]
}
```

### 2. Pergunta Rápida
```
POST /api/ask
Body: {
  "question": "Sua pergunta"
}
```

### 3. Síntese de Voz
```
GET /api/tts?text=seu+texto&lang=pt-BR
```

### 4. Wikipedia
```
GET /api/wikipedia?query=python
```

### 5. Clima
```
GET /api/weather?latitude=-23.55&longitude=-46.63
```

## ❓ Troubleshooting

### "OpenAI API key not configured"
- Verifique se criou o arquivo `.env`
- Confirme se a chave está correta
- Reinicie o servidor

### "Rate limit exceeded"
- Você atingiu o limite de requisições
- Aguarde alguns segundos
- Configure limites na conta OpenAI

### Síntese de voz travando
- Pode ser latência de rede
- Verifique sua conexão internet
- Use Web Speech API como fallback

## 📞 Suporte

Para mais informações:
- OpenAI Docs: https://platform.openai.com/docs
- GitHub: https://github.com/openai/openai-python
- API Status: https://status.openai.com
