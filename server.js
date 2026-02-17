// T.I Assistant - Backend Server
// Servidor Node.js/Express com suporte a proxy de APIs e CORS

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';

// Middlewares
app.use(compression());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, '.')));

// ============ ROTAS DE API ============

// OpenAI ChatGPT Integration
app.post('/api/chat', async (req, res) => {
    try {
        const { message, conversationHistory = [], apiKey, model } = req.body;
        const headerApiKey = req.headers['x-api-key'];
        const headerModel = req.headers['x-model'];

        if (!message) {
            return res.status(400).json({ error: 'Message parameter required' });
        }

        // Usar chave do cliente (prioridade) ou do .env
        const api_key = apiKey || headerApiKey || OPENAI_API_KEY;
        const ai_model = model || headerModel || OPENAI_MODEL;

        if (!api_key) {
            return res.status(400).json({ 
                error: 'OpenAI API key not configured',
                hint: 'Configure chave na interface ou arquivo .env'
            });
        }

        // Construir histórico de conversa
        const messages = [
            {
                role: 'system',
                content: 'Você é T.I, um assistente virtual inteligente em português. Responda perguntas de forma clara, concisa e amigável. Sempre responda em português conforme o contexto.'
            },
            ...conversationHistory,
            {
                role: 'user',
                content: message
            }
        ];

        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: ai_model,
                messages: messages,
                temperature: 0.7,
                max_tokens: 500,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0
            },
            {
                headers: {
                    'Authorization': `Bearer ${api_key}`,
                    'Content-Type': 'application/json'
                },
                timeout: 30000
            }
        );

        const reply = response.data.choices[0].message.content;

        res.json({
            success: true,
            reply: reply,
            model: ai_model,
            usage: {
                prompt_tokens: response.data.usage.prompt_tokens,
                completion_tokens: response.data.usage.completion_tokens,
                total_tokens: response.data.usage.total_tokens
            }
        });

    } catch (error) {
        console.error('OpenAI API Error:', error.response?.data || error.message);
        
        if (error.response?.status === 401) {
            return res.status(401).json({ 
                error: 'Invalid API key',
                message: 'Verifique sua chave OpenAI no arquivo .env'
            });
        }

        if (error.response?.status === 429) {
            return res.status(429).json({ 
                error: 'Rate limit exceeded',
                message: 'Limite de requisições atingido. Tente novamente em alguns segundos.'
            });
        }

        res.status(error.response?.status || 500).json({ 
            error: 'Chat API failed',
            message: error.response?.data?.error?.message || error.message
        });
    }
});

// Text-to-Speech usando Google TTS (free, sem chave)
app.get('/api/tts', async (req, res) => {
    try {
        const { text, lang = 'pt-BR' } = req.query;

        if (!text) {
            return res.status(400).json({ error: 'Text parameter required' });
        }

        // Usar Google Translate TTS (free, sem autenticação)
        const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=tw-ob`;

        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Cache-Control', 'public, max-age=86400');

        const audioResponse = await axios.get(audioUrl, {
            responseType: 'stream',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 10000
        });

        audioResponse.data.pipe(res);

    } catch (error) {
        console.error('TTS Error:', error.message);
        res.status(500).json({ 
            error: 'Text-to-speech failed',
            message: error.message
        });
    }
});

// Rota auxiliar para análise rápida sem histórico
app.post('/api/ask', async (req, res) => {
    try {
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({ error: 'Question parameter required' });
        }

        if (!OPENAI_API_KEY) {
            return res.status(400).json({ 
                error: 'OpenAI API key not configured'
            });
        }

        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: OPENAI_MODEL,
                messages: [
                    {
                        role: 'system',
                        content: 'Responda em português de forma breve e direta. Máximo 3-4 frases.'
                    },
                    {
                        role: 'user',
                        content: question
                    }
                ],
                temperature: 0.7,
                max_tokens: 150
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                timeout: 30000
            }
        );

        res.json({
            success: true,
            answer: response.data.choices[0].message.content
        });

    } catch (error) {
        console.error('OpenAI API Error:', error.message);
        res.status(500).json({ 
            error: 'Ask API failed',
            message: error.message
        });
    }
});

app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Proxy para Wikipedia Search
app.get('/api/wikipedia', async (req, res) => {
    try {
        const { query } = req.query;
        
        if (!query) {
            return res.status(400).json({ error: 'Query parameter required' });
        }

        const response = await axios.get('https://pt.wikipedia.org/w/api.php', {
            params: {
                action: 'query',
                list: 'search',
                srsearch: query,
                format: 'json',
                origin: '*'
            },
            timeout: 10000,
            headers: {
                'User-Agent': 'T.I Assistant (https://github.com/seu-usuario/ti-assistant)'
            }
        });

        res.setHeader('Cache-Control', 'public, max-age=3600');
        res.json(response.data);
    } catch (error) {
        console.error('Wikipedia API Error:', error.message);
        res.status(error.response?.status || 500).json({ 
            error: 'Wikipedia search failed',
            message: error.message
        });
    }
});

// Proxy para Geocoding (Open-Meteo)
app.get('/api/geocoding', async (req, res) => {
    try {
        const { city } = req.query;
        
        if (!city) {
            return res.status(400).json({ error: 'City parameter required' });
        }

        const response = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
            params: {
                name: city,
                language: 'pt',
                count: 1,
                format: 'json'
            },
            timeout: 10000
        });

        res.setHeader('Cache-Control', 'public, max-age=3600');
        res.json(response.data);
    } catch (error) {
        console.error('Geocoding API Error:', error.message);
        res.status(error.response?.status || 500).json({ 
            error: 'Geocoding failed',
            message: error.message
        });
    }
});

// Proxy para Weather (Open-Meteo)
app.get('/api/weather', async (req, res) => {
    try {
        const { latitude, longitude } = req.query;
        
        if (!latitude || !longitude) {
            return res.status(400).json({ error: 'Latitude and longitude parameters required' });
        }

        const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
            params: {
                latitude,
                longitude,
                current: 'temperature_2m,relative_humidity_2m,weather_code',
                temperature_unit: 'celsius',
                language: 'pt'
            },
            timeout: 10000
        });

        res.setHeader('Cache-Control', 'public, max-age=600');
        res.json(response.data);
    } catch (error) {
        console.error('Weather API Error:', error.message);
        res.status(error.response?.status || 500).json({ 
            error: 'Weather forecast failed',
            message: error.message
        });
    }
});

// Rota para servir index.html (SPA fallback)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// 404 handler
app.use((req, res) => {
    console.warn(`404 Not Found: ${req.method} ${req.path}`);
    res.status(404).json({ error: 'Route not found' });
});

// Server startup
const server = app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║          🎤 T.I ASSISTANT - SERVIDOR INICIADO 🎤          ║
║                                                            ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║  ✓ Servidor rodando em: http://localhost:${PORT}          
║  ✓ Modo: ${process.env.NODE_ENV || 'production'}
║  ✓ CORS ativado para todas as origens                     ║
║  ✓ Compressão gzip ativada                                ║
║  ✓ Proxy de APIs configurado                              ║
║                                                            ║
║  📍 Endpoints disponíveis:                                 ║
║     - GET /api/health         → Health check              ║
║     - GET /api/wikipedia      → Busca Wikipedia           ║
║     - GET /api/geocoding      → Localização por cidade    ║
║     - GET /api/weather        → Previsão do tempo         ║
║                                                            ║
║  🔗 Acesse: http://localhost:${PORT}                      
║                                                            ║
║  Pressione CTRL + C para parar o servidor                 ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
    `);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n⚠️  Encerrando servidor...');
    server.close(() => {
        console.log('✓ Servidor finalizado com sucesso');
        process.exit(0);
    });
});

// Handle unhandled errors
process.on('uncaughtException', (error) => {
    console.error('Erro não tratado:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Promise rejeitada não tratada:', reason);
});

module.exports = app;
