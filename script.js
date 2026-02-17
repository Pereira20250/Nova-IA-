// T.I Virtual Assistant - Main Script
class VirtualAssistant {
    constructor() {
        // Configuration
        this.isListening = false;
        this.isProcessing = false;
        this.volume = 70;
        this.speechRate = 1;
        this.soundEffectsEnabled = true;
        this.autoStart = true;
        this.history = [];
        this.conversationHistory = []; // Para manter histórico de conversa com IA
        this.useAIBackend = true; // Usar ChatGPT quando disponível
        this.openaiApiKey = null; // Chave de API carregada
        this.openaiModel = 'gpt-3.5-turbo'; // Modelo padrão

        // Get DOM elements
        this.micButton = document.getElementById('micButton');
        this.micStatus = document.getElementById('micStatus');
        this.userInput = document.getElementById('userInput');
        this.aiResponse = document.getElementById('aiResponse');
        this.historyList = document.getElementById('historyList');
        this.visualizer = document.querySelector('.voice-visualizer');
        this.commandBtns = document.querySelectorAll('.command-btn');
        this.themeToggle = document.getElementById('themeToggle');
        this.settingsBtn = document.getElementById('settingsBtn');
        this.helpBtn = document.getElementById('helpBtn');
        this.paidBtn = document.getElementById('paidBtn');
        this.settingsModal = document.getElementById('settingsModal');
        this.helpModal = document.getElementById('helpModal');
        this.paidModal = document.getElementById('paidModal');
        this.closeSettings = document.getElementById('closeSettings');
        this.closeHelp = document.getElementById('closeHelp');
        this.closePaid = document.getElementById('closePaid');
        this.modalOverlay = document.getElementById('modalOverlay');
        this.volumeSlider = document.getElementById('volumeSlider');
        this.speedSlider = document.getElementById('speedSlider');
        this.volumeValue = document.getElementById('volumeValue');
        this.speedValue = document.getElementById('speedValue');
        this.clearHistoryBtn = document.getElementById('clearHistoryBtn');
        this.autoStartCheckbox = document.getElementById('autoStartCheckbox');
        this.soundEffectsCheckbox = document.getElementById('soundEffectsCheckbox');
        this.apiKeyInput = document.getElementById('apiKeyInput');
        this.modelSelect = document.getElementById('modelSelect');
        this.savePaidBtn = document.getElementById('savePaidBtn');
        this.removePaidBtn = document.getElementById('removePaidBtn');
        this.paidStatus = document.getElementById('paidStatus');

        // Speech Recognition Setup
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            this.recognition = new SpeechRecognition();
            this.setupRecognition();
        } else {
            this.showError('Speech Recognition não é suportado neste navegador.');
        }

        // Load settings
        this.loadSettings();
        this.loadPaidSettings();

        // Initialize UI
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateVoiceSettings();
        this.addHistoryItem('Assistente iniciado');
    }

    setupRecognition() {
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = 'pt-BR';

        this.recognition.onstart = () => {
            this.isListening = true;
            this.micButton.classList.add('listening');
            this.micStatus.textContent = 'Escutando...';
            this.micStatus.classList.add('listening');
            this.visualizer.classList.add('active');
            this.playSound('start');
        };

        this.recognition.onresult = (event) => {
            let transcript = '';
            let isFinal = false;

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const t = event.results[i][0].transcript;
                transcript += t;
                if (event.results[i].isFinal) {
                    isFinal = true;
                }
            }

            this.userInput.textContent = transcript || '-';

            if (isFinal) {
                this.handleVoiceInput(transcript);
            }
        };

        this.recognition.onerror = (event) => {
            console.error('Speech Recognition error:', event.error);
            if (event.error !== 'no-speech' && event.error !== 'audio-abort') {
                this.showError(`Erro: ${event.error}`);
            }
        };

        this.recognition.onend = () => {
            this.isListening = false;
            this.micButton.classList.remove('listening');
            this.micStatus.textContent = 'Clique para falar';
            this.micStatus.classList.remove('listening');
            this.visualizer.classList.remove('active');
        };
    }

    setupEventListeners() {
        // Mic button
        this.micButton.addEventListener('click', () => this.toggleListening());

        // Quick command buttons
        this.commandBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const command = btn.getAttribute('data-command');
                this.handleVoiceInput(command);
            });
        });

        // Theme toggle
        this.themeToggle.addEventListener('click', () => this.toggleTheme());

        // Settings button
        this.settingsBtn.addEventListener('click', () => this.openModal(this.settingsModal));
        this.closeSettings.addEventListener('click', () => this.closeModal(this.settingsModal));
        this.helpBtn.addEventListener('click', () => this.openModal(this.helpModal));
        this.closeHelp.addEventListener('click', () => this.closeModal(this.helpModal));
        this.paidBtn.addEventListener('click', () => this.openModal(this.paidModal));
        this.closePaid.addEventListener('click', () => this.closeModal(this.paidModal));
        this.savePaidBtn.addEventListener('click', () => this.savePaidSettings());
        this.removePaidBtn.addEventListener('click', () => this.removePaidSettings());
        this.modalOverlay.addEventListener('click', () => {
            this.closeModal(this.settingsModal);
            this.closeModal(this.helpModal);
            this.closeModal(this.paidModal);
        });

        // Settings controls
        this.volumeSlider.addEventListener('input', (e) => {
            this.volume = e.target.value;
            this.volumeValue.textContent = `${this.volume}%`;
            this.saveSettings();
        });

        this.speedSlider.addEventListener('input', (e) => {
            this.speechRate = parseFloat(e.target.value);
            const speedText = this.speechRate < 1 ? 'Lento' : this.speechRate > 1 ? 'Rápido' : 'Normal';
            this.speedValue.textContent = speedText;
            this.saveSettings();
        });

        this.autoStartCheckbox.addEventListener('change', (e) => {
            this.autoStart = e.target.checked;
            this.saveSettings();
        });

        this.soundEffectsCheckbox.addEventListener('change', (e) => {
            this.soundEffectsEnabled = e.target.checked;
            this.saveSettings();
        });

        this.clearHistoryBtn.addEventListener('click', () => {
            this.history = [];
            this.historyList.innerHTML = '';
            this.addHistoryItem('Histórico limpo');
            this.saveSettings();
        });

        // Keyboard shortcut
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.toggleListening();
            }
        });
    }

    toggleListening() {
        if (!this.recognition) {
            this.showError('Speech Recognition não disponível');
            return;
        }

        if (this.isListening) {
            this.recognition.abort();
        } else {
            this.userInput.textContent = '-';
            this.recognition.start();
        }
    }

    handleVoiceInput(input) {
        if (!input.trim()) return;

        this.userInput.textContent = input;
        this.micStatus.textContent = 'Processando...';
        this.micStatus.classList.add('processing');
        this.isProcessing = true;

        // Primeiro tenta comando local, depois IA paga
        Promise.resolve(processCommand(input)).then(async (response) => {
            // Se a resposta for null ou padrão, tenta ChatGPT
            if (!response || response.includes('não tenho resposta') || response.includes('Desculpa')) {
                try {
                    const aiResponse = await this.callChatGPT(input);
                    if (aiResponse) {
                        response = aiResponse;
                    }
                } catch (error) {
                    console.warn('ChatGPT indisponível, usando respostas padrão');
                }
            }

            this.displayResponse(response);
            this.addHistoryItem(input);
            this.speakResponse(response);
        }).catch(error => {
            console.error('Erro ao processar comando:', error);
            this.displayResponse('Desculpa, ocorreu um erro ao processar seu comando.');
        }).finally(() => {
            setTimeout(() => {
                this.micStatus.classList.remove('processing');
                this.isProcessing = false;
            }, 500);
        });
    }

    async callChatGPT(userMessage) {
        try {
            // Verificar se tem chave de API
            if (!this.openaiApiKey) {
                console.warn('ChatGPT não configurado - usando comandos locais');
                return null;
            }

            // Construir histórico para conversa mais natural
            const messages = this.conversationHistory.slice(-4); // Últimas 4 mensagens
            messages.push({ role: 'user', content: userMessage });

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': this.openaiApiKey,
                    'X-Model': this.openaiModel
                },
                body: JSON.stringify({
                    message: userMessage,
                    conversationHistory: this.conversationHistory.slice(-4), // Contexto das últimas 4 mensagens
                    apiKey: this.openaiApiKey,
                    model: this.openaiModel
                })
            });

            if (!response.ok) {
                const error = await response.json();
                if (error.error === 'OpenAI API key not configured') {
                    console.warn('ChatGPT não configurado - usando comandos locais');
                    return null;
                }
                throw new Error(error.message);
            }

            const data = await response.json();
            const reply = data.reply;

            // Adicionar à conversa
            this.conversationHistory.push(
                { role: 'user', content: userMessage },
                { role: 'assistant', content: reply }
            );

            // Manter histórico limitado
            if (this.conversationHistory.length > 20) {
                this.conversationHistory.shift();
                this.conversationHistory.shift();
            }

            return reply;
        } catch (error) {
            console.error('Erro ao chamar ChatGPT:', error);
            return null; // Retorna null para usar fallback
        }
    }

    displayResponse(response) {
        this.aiResponse.textContent = response;
        this.aiResponse.classList.add('fade-in');
        setTimeout(() => this.aiResponse.classList.remove('fade-in'), 500);
    }

    async speakResponse(text) {
        if (!text) return;

        // Tentar usar Google TTS para melhor qualidade
        try {
            const audioElement = await this.getAudioFromGoogleTTS(text);
            audioElement.play().catch(() => {
                // Fallback para Web Speech API se Google TTS falhar
                this.fallbackToWebSpeech(text);
            });
        } catch (error) {
            console.warn('Google TTS falhou, usando Web Speech API:', error.message);
            this.fallbackToWebSpeech(text);
        }
    }

    async getAudioFromGoogleTTS(text) {
        const cleanText = text.replace(/[🔍🎬📱💻🧮🎤🌙🌡️]/g, '').trim();
        if (!cleanText) return new Audio();

        const audioElement = new Audio();
        
        try {
            // Tenta usar o backend se disponível
            const encodedText = encodeURIComponent(cleanText);
            audioElement.src = `/api/tts?text=${encodedText}&lang=pt-BR`;
        } catch (error) {
            // Fallback para URL direta do Google
            audioElement.src = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(cleanText)}&tl=pt&client=tw-ob`;
        }

        audioElement.volume = this.volume / 100;
        return audioElement;
    }

    fallbackToWebSpeech(text) {
        if (!window.speechSynthesis) return;

        // Clean the text for speech
        let cleanText = text.replace(/[🔍🎬📱💻🧮🎤🌙🌡️]/g, '').trim();

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        // Set volume
        window.speechSynthesis.volume = this.volume / 100;

        // Get Portuguese voice
        const voices = window.speechSynthesis.getVoices();
        const ptVoice = voices.find(v => v.lang.includes('pt')) || voices.find(v => v.lang.includes('pt'));

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = this.speechRate;
        utterance.pitch = 1.1; // Pitch um pouco mais alto para soar melhor
        utterance.volume = this.volume / 100;

        if (ptVoice) {
            utterance.voice = ptVoice;
        }

        this.playSound('speak');
        window.speechSynthesis.speak(utterance);
    }

    addHistoryItem(text) {
        const time = getCurrentTime();
        this.history.push({ time, text });

        // Create history item
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item fade-in';
        historyItem.innerHTML = `
            <span class="history-time">${time}</span>
            <span class="history-text">${text.substring(0, 50)}${text.length > 50 ? '...' : ''}</span>
        `;

        // Add to top of history
        this.historyList.insertBefore(historyItem, this.historyList.firstChild);

        // Limit history to 50 items
        while (this.historyList.children.length > 50) {
            this.historyList.removeChild(this.historyList.lastChild);
        }

        this.saveSettings();
    }

    openModal(modal) {
        modal.classList.add('active');
        this.modalOverlay.classList.add('active');
    }

    closeModal(modal) {
        modal.classList.remove('active');
        this.modalOverlay.classList.remove('active');
    }

    toggleTheme() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        this.themeToggle.querySelector('.theme-icon').textContent = isDark ? '☀️' : '🌙';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        this.playSound('click');
    }

    updateVoiceSettings() {
        this.volumeSlider.value = this.volume;
        this.speedSlider.value = this.speechRate;
        this.volumeValue.textContent = `${this.volume}%`;
        this.autoStartCheckbox.checked = this.autoStart;
        this.soundEffectsCheckbox.checked = this.soundEffectsEnabled;

        const speedText = this.speechRate < 1 ? 'Lento' : this.speechRate > 1 ? 'Rápido' : 'Normal';
        this.speedValue.textContent = speedText;
    }

    saveSettings() {
        const settings = {
            volume: this.volume,
            speechRate: this.speechRate,
            autoStart: this.autoStart,
            soundEffectsEnabled: this.soundEffectsEnabled,
            history: this.history
        };
        localStorage.setItem('tiAssistantSettings', JSON.stringify(settings));
    }

    loadPaidSettings() {
        const saved = localStorage.getItem('tiAssistantPaid');
        if (saved) {
            try {
                const settings = JSON.parse(saved);
                this.openaiApiKey = settings.apiKey || null;
                this.openaiModel = settings.model || 'gpt-3.5-turbo';
                this.updatePaidStatus();
            } catch (e) {
                console.error('Error loading paid settings:', e);
            }
        }
    }

    savePaidSettings() {
        const apiKey = this.apiKeyInput.value.trim();
        const model = this.modelSelect.value;

        if (!apiKey || !apiKey.startsWith('sk-')) {
            this.showPaidStatus('❌ Chave inválida! Deve começar com "sk-"', 'error');
            return;
        }

        this.openaiApiKey = apiKey;
        this.openaiModel = model;

        const settings = {
            apiKey: apiKey,
            model: model
        };

        localStorage.setItem('tiAssistantPaid', JSON.stringify(settings));
        this.updatePaidStatus();
        this.showPaidStatus('✅ ChatGPT ativado com sucesso!', 'success');

        setTimeout(() => {
            this.closeModal(this.paidModal);
        }, 2000);
    }

    removePaidSettings() {
        if (confirm('Tem certeza que deseja desativar ChatGPT?')) {
            this.openaiApiKey = null;
            localStorage.removeItem('tiAssistantPaid');
            this.apiKeyInput.value = '';
            this.updatePaidStatus();
            this.showPaidStatus('❌ ChatGPT desativado', 'info');
            setTimeout(() => {
                this.closeModal(this.paidModal);
            }, 1000);
        }
    }

    updatePaidStatus() {
        if (this.openaiApiKey) {
            this.paidBtn.classList.add('active');
            this.paidBtn.innerHTML = '💎✓';
            this.apiKeyInput.value = this.openaiApiKey.substring(0, 10) + '***' + this.openaiApiKey.substring(-10);
            this.apiKeyInput.disabled = true;
        } else {
            this.paidBtn.classList.remove('active');
            this.paidBtn.innerHTML = '💎';
            this.apiKeyInput.value = '';
            this.apiKeyInput.disabled = false;
        }
        this.modelSelect.value = this.openaiModel;
    }

    showPaidStatus(message, type = 'info') {
        this.paidStatus.textContent = message;
        this.paidStatus.className = `paid-status ${type}`;
        this.paidStatus.style.display = 'block';
    }

    loadSettings() {
        const saved = localStorage.getItem('tiAssistantSettings');
        if (saved) {
            try {
                const settings = JSON.parse(saved);
                this.volume = settings.volume || 70;
                this.speechRate = settings.speechRate || 1;
                this.autoStart = settings.autoStart !== false;
                this.soundEffectsEnabled = settings.soundEffectsEnabled !== false;
                this.history = settings.history || [];

                // Restore history
                this.history.forEach(item => {
                    const historyItem = document.createElement('div');
                    historyItem.className = 'history-item';
                    historyItem.innerHTML = `
                        <span class="history-time">${item.time}</span>
                        <span class="history-text">${item.text.substring(0, 50)}${item.text.length > 50 ? '...' : ''}</span>
                    `;
                    this.historyList.appendChild(historyItem);
                });
            } catch (e) {
                console.error('Error loading settings:', e);
            }
        }

        // Load theme preference
        const theme = localStorage.getItem('theme') || 'light';
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            this.themeToggle.querySelector('.theme-icon').textContent = '☀️';
        }
    }

    playSound(type) {
        if (!this.soundEffectsEnabled) return;

        const audioContext = new (window.AudioContext || window.webkitAudioContext)();

        switch (type) {
            case 'start':
                this.playBeep(400, 0.1, audioContext);
                break;
            case 'click':
                this.playBeep(800, 0.1, audioContext);
                break;
            case 'speak':
                this.playBeep(600, 0.05, audioContext);
                break;
        }
    }

    playBeep(frequency, duration, audioContext) {
        try {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.type = 'sine';
            oscillator.frequency.value = frequency;
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration);
        } catch (e) {
            console.error('Error playing beep:', e);
        }
    }

    showError(message) {
        this.displayResponse(`❌ ${message}`);
        console.error(message);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.tiAssistant = new VirtualAssistant();

    // Load voices when ready
    window.speechSynthesis.onvoiceschanged = () => {
        console.log('Voices loaded');
    };
});

// Service Worker for offline support (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').catch(() => {
            // Service worker registration failed, but app will still work
        });
    });
}
