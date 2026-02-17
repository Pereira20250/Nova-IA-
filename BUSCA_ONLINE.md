# 🌐 Busca na Internet - Nova Funcionalidade!

Agora o **T.I pode responder qualquer pergunta buscando na internet**! 

## 🎯 Como Funciona

### Método 1: Perguntas com "?"
Basta fazer uma pergunta com interrogação:

```
"Qual é a capital da França?"
"O que é inteligência artificial?"
"Quem foi Albert Einstein?"
"Quando foi descoberto o Brasil?"
"Por que o céu é azul?"
```

T.I automaticamente:
1. ✅ Reconhece que é uma pergunta (por ter "?")
2. ✅ Busca na Wikipedia em português
3. ✅ Retorna um resumo da resposta
4. ✅ Fala a resposta em voz

### Método 2: Comando de Busca Direto
Use palavras-chave como "busque", "pesquise", "procure":

```
"Busque sobre Python"
"Pesquise sobre célula"
"Procure por Leonardo da Vinci"
```

### Método 3: Clima com Localização
Pergunte sobre o clima de qualquer cidade:

```
"Qual é o clima em São Paulo?"
"Temperatura em Rio de Janeiro"
"Como está o tempo em Salvador?"
"Clima em Nova York"
```

T.I responde com:
- 🌡️ Temperatura em Celsius
- 💧 Umidade
- 🌥️ Condição do céu

## 📡 APIs Usadas

### 1️⃣ **Wikipedia**
- Busca por artigos em português
- Retorna resumos dos primeiros resultados
- Sem limite de requisições
- Completamente gratuita

```javascript
// Exemplo de busca
"O que é energia renovável?"
→ Busca em pt.wikipedia.org
→ Retorna resumo do artigo
```

### 2️⃣ **Open-Meteo Weather**
- Previsão do tempo em tempo real
- Sem chave necessária
- Funciona para qualquer cidade do mundo
- Retorna temperatura, umidade, condição

```javascript
// Exemplo
"Clima em Barcelona"
→ Geocodifica a cidade
→ Busca clima atual
→ Retorna temperatura e condição
```

## 🔄 Fluxo de Processamento

```
Você faz uma pergunta
         ↓
T.I reconhece a voz
         ↓
Verifica se é pergunta (tem "?" ou começa com question words)
         ↓
SIM → Busca na Wikipedia/APIs
         ↓
Verifica resultado
         ↓
SE encontrou → Retorna resposta formatada
SE não encontrou → Oferece link para Google manual
         ↓
T.I fala a resposta com síntese de voz
         ↓
Adiciona ao histórico
```

## 📝 Exemplos Práticos

### ✅ Funciona Perfeitamente

```
Pergunta: "O que é machine learning?"
Resposta: "De acordo com a Wikipédia: Machine learning é um campo da 
inteligência artificial que se concentra no desenvolvimento de algoritmos 
e modelos estatísticos..."

Pergunta: "Clima em Londres"
Resposta: "Em Londres: 12°C com parcialmente nublado. Umidade: 65%"

Pergunta: "Quem foi Marie Curie?"
Resposta: "De acordo com a Wikipédia: Marie Curie foi uma física e 
química polonesa que conduziu pesquisa pioneira sobre radioatividade..."
```

### Melhor Usar Com

| Assim | Não assim |
|------|-----------|
| "O que é Python?" | "me explica Python" |
| "Qual é a capital de Portugal?" | "capital Portugal" |
| "Clima em Brasília" | "como está o tempo" |
| "Quem foi Bach?" | "me fala sobre Bach" |

## ⚙️ Configurações

### Volume e Velocidade
As respostas longas da internet respeitam suas configurações:
- Volume: Ajuste em ⚙️ (0-100%)
- Velocidade: Ajuste em ⚙️ (0.5x a 2x)

### Histórico
Todas as buscas aparecem no histórico com timestamp.

## 🚨 Importante

### Requer Internet
- A busca na internet precisa de conexão de dados
- Se a internet cair, T.I voltará aos comandos locais
- Service Worker mantém funcionalidade offline para comandos pré-carregados

### Privacidade
- Buscas vão para Wikipedia (não enviamos dados sensíveis)
- Open-Meteo não requer autenticação
- Nenhum rastreamento pessoal

### Limitações
- Deve estar conectado à internet
- Wikipedia pode ter informações em português limitadas
- Respostas muito longas são truncadas para leitura

## 🎓 Testes Para Fazer

1. **Perguntas Simples**
   ```
   "Qual é a maior planeta do sistema solar?"
   "O que é fotossíntese?"
   ```

2. **Perguntas Históricas**
   ```
   "Quando começou a Segunda Guerra?"
   "Qual foi a Revolução Francesa?"
   ```

3. **Perguntas Científicas**
   ```
   "O que é um bósón de Higgs?"
   "Como funciona a gravidade?"
   ```

4. **Clima de Diversas Cidades**
   ```
   "Clima em Tóquio"
   "Temperatura em Cairo"
   "Como está em Estocolmo?"
   ```

## 💡 Dicas Para Melhores Resultados

✅ **Fale de forma clara** - Melhor reconhecimento de voz
✅ **Use perguntas simples** - Mais fácil de processar
✅ **Seja específico** - "Python linguagem" em vez de só "Python"
✅ **Profira a pergunta completa** - Não tente pedir respostas incompletas
✅ **Pause entre perguntas** - Deixe T.I terminar de responder

## 🔧 Como Integrar Mais APIs

Quer adicionar mais fontes de informação? É fácil!

Veja `CUSTOMIZATION.md` para exemplos de como integrar:
- Google Custom Search
- OpenWeather API
- Wolframalpha
- APIs personalizadas

## 📚 Documentação Técnica

Para detalhes técnicos sobre como a busca funciona:
- Veja `TECHNICAL.md` - Seção de APIs
- Veja `commands.js` - Funções `searchWikipedia()` e `getWeatherByCity()`
- Veja `script.js` - Como `handleVoiceInput()` processa promises

## 🎉 Novo no T.I v1.1!

Esta é uma das maiores melhorias da versão 1.1:
- ✅ Busca automática na internet
- ✅ Clima em tempo real
- ✅ Suporte a perguntas abertas
- ✅ Wikipedia integrada
- ✅ Fallback para buscas quando comando não é reconhecido

---

**Aproveite seu assistente T.I agora com poderes de busca na internet!** 🚀
