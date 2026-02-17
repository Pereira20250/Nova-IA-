# 🔧 Documentação Técnica - T.I Assistant

## Arquitetura

T.I é uma Progressive Web App (PWA) construída com vanilla JavaScript, sem dependências externas.

```
┌─────────────────────────────────────┐
│       User Interface (HTML/CSS)     │
└──────────────────┬──────────────────┘
                   │
┌──────────────────▼──────────────────┐
│   VirtualAssistant Class (JS)       │
│  - Voice Recognition                │
│  - Command Processing               │
│  - Settings Management              │
└──────────────────┬──────────────────┘
                   │
┌──────────────────▼──────────────────┐
│   Command Database (commands.js)    │
│  - Keywords & Patterns              │
│  - Response Handlers                │
│  - Utility Functions                │
└─────────────────────────────────────┘
```

## Componentes Principais

### 1. **index.html**
- Estrutura semântica HTML5
- Elementos para UI (botões, input, modais)
- Links para CSS e JavaScript
- Meta tags para SEO e PWA

### 2. **style.css**
- CSS custom properties (variáveis)
- Design responsivo mobile-first
- Temas claro/escuro
- Animações suaves
- Componentes reutilizáveis

### 3. **script.js**
- Classe `VirtualAssistant` principal
- Gerenciamento de Web Speech API
- Controle de modais
- Persistência de dados (localStorage)
- Síntese de voz (Text-to-Speech)

### 4. **commands.js**
- Database `COMMAND_DATABASE`
- Funções de processamento
- Handlers de ações
- Utilitários

### 5. **sw.js**
- Service Worker para offline
- Cache estratégies
- Background sync

## APIs Usadas

### Web Speech API
```javascript
// Speech Recognition
const recognition = new SpeechRecognition();
recognition.lang = 'pt-BR';
recognition.start();

// Speech Synthesis
const utterance = new SpeechSynthesisUtterance(text);
speechSynthesis.speak(utterance);
```

### Web Audio API
```javascript
// Para efeitos sonoros
const audioContext = new AudioContext();
const oscillator = audioContext.createOscillator();
```

### LocalStorage API
```javascript
// Salvar settings
localStorage.setItem('tiAssistantSettings', JSON.stringify(settings));
const settings = JSON.parse(localStorage.getItem('tiAssistantSettings'));
```

## Classe VirtualAssistant

### Propriedades Principais
```javascript
{
    isListening: boolean,        // Estado de escuta
    isProcessing: boolean,       // Processando comando
    volume: number,              // 0-100
    speechRate: number,          // 0.5-2
    soundEffectsEnabled: boolean,
    autoStart: boolean,
    history: Array,              // Histórico de interações
    recognition: SpeechRecognition
}
```

### Métodos Principais

#### `toggleListening()`
Inicia ou para o reconhecimento de voz.

#### `handleVoiceInput(input: string)`
Processa entrada de voz do usuário.

#### `processCommand(input: string): string`
Procura matching de keywords e retorna resposta.

#### `displayResponse(response: string)`
Atualiza UI com resposta.

#### `speakResponse(text: string): Promise`
Sintetiza voz da resposta.

#### `saveSettings() / loadSettings()`
Persistência de preferências.

## Database de Comandos

### Estrutura
```javascript
{
    comandoName: {
        keywords: ['palavra-chave1', 'palavra-chave2'],
        responses: [
            'Resposta 1',
            'Resposta 2'
        ],
        // OU
        action: 'functionName'
    }
}
```

### Exemplo: Comando com Resposta Estática
```javascript
greetings: {
    keywords: ['oi', 'olá', 'opa'],
    responses: [
        'Olá! Sou T.I. Como posso ajudar?',
        'Oi! Tudo bem?'
    ]
}
```

### Exemplo: Comando com Ação
```javascript
calculator: {
    keywords: ['calcule', 'me calc', 'quanto é'],
    action: 'calculate'  // Chama função calculate()
}
```

## Adicionando Novos Comandos

### Passo 1: Adicione ao COMMAND_DATABASE
```javascript
// Em commands.js
mynewcommand: {
    keywords: ['trigger', 'palavra-chave'],
    responses: ['Resposta aqui']
}
```

### Passo 2: (Opcional) Implemente a função ação
```javascript
function myCustomAction(voiceInput) {
    // Processar input
    return resultString;
}

// No database
mycommand: {
    keywords: ['trigger'],
    action: 'myCustomAction'
}
```

### Passo 3: Teste
Verifique os keywords e respostas funcionando.

## Customizando a UI

### Cores Primárias
```css
:root {
    --primary-color: #4f46e5;      /* Azul/Roxo */
    --secondary-color: #06b6d4;    /* Ciano */
    --accent-color: #f59e0b;       /* Amarelo */
}
```

### Fontes
```css
body {
    font-family: 'Segoe UI', Tahoma, Geneva, sans-serif;
}
```

### Animações
```css
@keyframes myAnimation {
    from { /* ... */ }
    to { /* ... */ }
}
```

## Integração com APIs Externas

### Exemplo: Integrar Previsão do Tempo

1. Escolha uma API (OpenWeatherMap, WTTR.in)
2. Crie função em `commands.js`:

```javascript
async function getWeather(city) {
    const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=...`
    );
    const data = await response.json();
    return `Clima em ${city}: ${data.temperature}°C`;
}
```

3. Adicione ao command database:
```javascript
weather: {
    keywords: ['clima', 'previsão'],
    action: 'getWeather'
}
```

## Performance Otimizações

### 1. **Lazy Loading**
```javascript
// Imagens lazy-load (quando necessário)
<img loading="lazy" src="..." />
```

### 2. **Caching**
- Service Worker faz cache de assets estáticos
- LocalStorage para dados do usuário

### 3. **Minification**
Para produção, minifique CSS/JS:
```bash
# Com ferramentas como:
# - terser (JavaScript)
# - cssnano (CSS)
```

## Debugging

### Console Logs
```javascript
console.log('Action:', action);        // Info
console.error('Error message:', error); // Errors
console.warn('Warning:', message);     // Warnings
```

### DevTools
1. Abra F12
2. Vá para "Network" para ver requisições
3. "Application" > "Storage" para localStorage
4. "Application" > "Service Workers" para SW

## Testing

### Manual Testing Checklist
- [ ] Microfone funciona
- [ ] Reconhecimento de voz funciona
- [ ] Síntese de voz funciona
- [ ] Modo escuro funciona
- [ ] Configurações salvam
- [ ] Histórico funciona
- [ ] Responsivo em mobile
- [ ] PWA instala

### Teste de Compatibilidade
Navegadores suportados:
- Chrome 25+
- Firefox 25+
- Safari 14.1+
- Edge 18+

## Segurança

### XSS Prevention
```javascript
// ❌ Não fazer
element.innerHTML = userInput;

// ✅ Fazer
element.textContent = userInput;
// Ou
element.innerText = userInput;
```

### CSRF Protection
Aplicável se integrar com backend. Use tokens.

## Deployment

### Hospedagem Gratuita
- GitHub Pages (estático)
- Vercel
- Netlify
- Firebase Hosting

### Exemplo - GitHub Pages
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/usuario/ti-assistant
git push -u origin main
```

Ative GitHub Pages nas settings do repo.

## CI/CD

### GitHub Actions (Exemplo)
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
```

## Troubleshooting

### Web Speech API não funciona
- Verificar permissões do navegador
- Testar em HTTPS (produção)
- Fallback para input de texto

### Service Worker não registra
- Limpar cache do navegador
- Verificar console para erros
- Usar devtools > Application > Service Workers

### LocalStorage cheia
- Limpar dados antigos
- Implementar rotação de dados

## Recursos Úteis

- [MDN Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

## Changelog

### v1.0.0 (Fevereiro 2026)
- Release inicial
- Voice recognition com Web Speech API
- 30+ comandos pré-configurados
- Modo escuro
- PWA support
- Service Worker offline
- LocalStorage persistence
- Tema responsivo

---

**Última atualização:** Fevereiro de 2026
