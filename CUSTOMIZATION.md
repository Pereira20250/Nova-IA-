# 📚 Exemplos de Customização

## Adicionando Novos Comandos

### Exemplo 1: Comando Simples com Respostas

```javascript
// Em commands.js, adicione ao COMMAND_DATABASE:

birthdays: {
    keywords: ['aniversário', 'parabéns', 'quando é seu aniversário'],
    responses: [
        'Eu sou um assistente virtual, então não tenho aniversário, mas a data que me criaram foi 16 de fevereiro de 2026!',
        'Meu aniversário é digital: 16 de fevereiro de 2026! 🎉'
    ]
}
```

### Exemplo 2: Comando com Ação Personalizada

```javascript
// 1. Implemente a função em commands.js:

function getRandomNumber(voiceInput) {
    const match = voiceInput.match(/(\d+)\s*(?:e|a)\s*(\d+)/);
    if (match) {
        const min = parseInt(match[1]);
        const max = parseInt(match[2]);
        const random = Math.floor(Math.random() * (max - min + 1)) + min;
        return `Um número aleatório entre ${min} e ${max} é: ${random}`;
    }
    return 'Por favor especifique um intervalo. Ex: "número aleatório entre 1 e 10"';
}

// 2. Adicione ao database:

randomnumber: {
    keywords: ['número aleatório', 'número ao acaso', 'aleatório'],
    action: 'getRandomNumber'
}
```

### Exemplo 3: Comando com API

```javascript
// Integração com API de citações (exemplo)

async function getQuote() {
    try {
        const response = await fetch('https://api.quotable.io/random');
        if (!response.ok) throw new Error('Erro ao carregar');
        const data = await response.json();
        return `Uma citação para você: "${data.content}" - ${data.author}`;
    } catch (error) {
        return 'Desculpa, não consegui buscar uma citação agora.';
    }
}

// No database:

quote: {
    keywords: ['citação', 'frase', 'inspiração', 'motivação'],
    action: 'getQuote'
}
```

### Exemplo 4: Comando com Confirmação do Usuário

```javascript
function setReminder(voiceInput) {
    const match = voiceInput.match(/lembrar[a-z\s]+(.*?)\s+(?:em|dentro de|daqui a)\s+(\d+)\s+(?:minuto|hora|dia)/i);
    
    if (match) {
        const task = match[1];
        const time = match[2];
        
        // Salvar no localStorage
        const reminders = JSON.parse(localStorage.getItem('reminders') || '[]');
        reminders.push({
            task: task,
            time: new Date().getTime() + parseInt(time) * 60000
        });
        localStorage.setItem('reminders', JSON.stringify(reminders));
        
        return `Lembrete configurado: ${task} em ${time} minutos!`;
    }
    return 'Especifique o lembrete. Ex: "Lembrar beber água em 30 minutos"';
}

// No database:

reminder: {
    keywords: ['lembrar', 'me avise', 'reminder'],
    action: 'setReminder'
}
```

## Customizando a Interface

### Adicionar Novo Botão Quick Command

1. **Em index.html**, dentro de `.commands-grid`:
```html
<button class="command-btn" data-command="Qual é a temperatura">🌡️ Temperatura</button>
```

2. O JavaScript já detecta automaticamente!

### Alterar Cores do Tema

**Em style.css**:
```css
:root {
    --primary-color: #ff6b6b;        /* Vermelho */
    --secondary-color: #4ecdc4;      /* Verde azulado */
    --accent-color: #ffe66d;         /* Amarelo */
    --bg-light: #f8fafc;
    --bg-dark: #1e293b;
    --text-light: #334155;
    --text-dark: #f1f5f9;
}
```

### Adicionar Novo Modal

1. **Em index.html**, adicione antes de `</main>`:
```html
<div class="modal" id="myModal">
    <div class="modal-content">
        <div class="modal-header">
            <h2>Meu Modal</h2>
            <button class="close-btn" id="closeModal">&times;</button>
        </div>
        <div class="modal-body">
            Conteúdo aqui
        </div>
    </div>
</div>
```

2. **Em script.js**, adicione no `setupEventListeners`:
```javascript
const myModal = document.getElementById('myModal');
const closeBtn = document.getElementById('closeModal');

closeBtn.addEventListener('click', () => this.closeModal(myModal));
document.addEventListener('click', (e) => {
    if (e.target === myModal) this.closeModal(myModal);
});
```

## Integrações Avançadas

### Integrar Google Calendar

```javascript
// Requer OAuth2 setup
async function checkCalendar() {
    // Implementar usando Google Calendar API
    // Documentação: https://developers.google.com/calendar
    return 'Seus eventos de hoje: ...';
}
```

### Integrar com Spotify

```javascript
// Requer Spotify API
async function playSong(songName) {
    // Implementar usando Spotify API
    // Documentação: https://developer.spotify.com/documentation
    return `Tocando: ${songName}`;
}
```

### Integrar com Smart Home

```javascript
// Exemplo com MQTT ou HTTP request
async function controlLight(action) {
    try {
        const response = await fetch('http://seu-hub-smart-home/light', {
            method: 'POST',
            body: JSON.stringify({ action: action })
        });
        return `Luz ${action}`;
    } catch (error) {
        return 'Erro ao controlar luz';
    }
}
```

## Melhorando a Precisão do Reconhecimento

### Adicionar Variações de Palavras

```javascript
calculator: {
    keywords: [
        'calcule', 'me calc', 'calcula', 'quanto é',
        'me conta', 'soma', 'subtrai', 'multiplica',
        'divide', 'calculo', 'fazer conta'
    ],
    action: 'calculate'
}
```

### Usar Fuzzy Matching

```javascript
function fuzzyMatch(keyword, input) {
    // Implementar fuzzy matching para melhor reconhecimento
    // Biblioteca: fuse.js
}
```

## Adicionando Suporte a Múltiplos Idiomas

```javascript
// Criar objeto de idiomas
const LANGUAGES = {
    'pt-BR': { /* comandos em português */ },
    'en-US': { /* comandos em inglês */ },
    'es-ES': { /* comandos em espanhol */ }
};

// Detectar idioma do navegador
const userLang = navigator.language || navigator.userLanguage;
const currentCommands = LANGUAGES[userLang] || LANGUAGES['pt-BR'];
```

## Performance e Otimização

### Lazy Load de Comandos

```javascript
// Apenas carregar comandos quando necessário
const COMMANDS_LAZY = {
    weather: async () => {
        const module = await import('./commands/weather.js');
        return module.weatherCommands;
    }
};
```

### Cache de Respostas

```javascript
const responseCache = new Map();

function getCachedResponse(command) {
    if (responseCache.has(command)) {
        return responseCache.get(command);
    }
    // Processar e cachear
}
```

## Debug e Logging

### Adicionar Logging Detalhado

```javascript
function log(level, message, data) {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] [${level}] ${message}`, data);
    
    // Salvar em localStorage para análise
    const logs = JSON.parse(localStorage.getItem('logs') || '[]');
    logs.push({ timestamp, level, message, data });
    localStorage.setItem('logs', JSON.stringify(logs.slice(-100)));
}

// Usar
log('INFO', 'Comando processado', { input, response });
log('ERROR', 'Erro ao processar comando', error);
```

## Exemplo Completo: Sistema de Notas

```javascript
// 1. Adicionar ao database
notes: {
    keywords: ['criar nota', 'nova nota', 'anotar'],
    action: 'createNote'
}

// 2. Implementar função
function createNote(voiceInput) {
    const match = voiceInput.match(/(?:criar nota|nova nota|anotar)[:\s]+(.+)/i);
    if (match) {
        const note = match[1];
        const notes = JSON.parse(localStorage.getItem('notes') || '[]');
        const id = Date.now();
        notes.push({ id, text: note, created: new Date().toISOString() });
        localStorage.setItem('notes', JSON.stringify(notes));
        return `Nota criada: "${note}"`;
    }
    return 'Diga a nota que deseja criar';
}

// 3. Adicionar comando para listar
listaNotas: {
    keywords: ['minhas notas', 'listar notas'],
    action: 'listNotes'
}

function listNotes() {
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    if (notes.length === 0) return 'Você não tem notas';
    return `Suas notas: ${notes.map(n => n.text).join(', ')}`;
}
```

---

**Dicas Finais:**
- Sempre teste novos comandos antes de usar em produção
- Mantenha o database organizado com comentários
- Documente funções personalizadas
- Considere a experiência do usuário ao adicionar recursos

Boa sorte customizando T.I! 🚀
