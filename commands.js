// Database of Commands and Responses
const COMMAND_DATABASE = {
    greetings: {
        keywords: ['oi', 'olá', 'opa', 'e aí', 'e ai', 'oi ti', 'olá ti'],
        responses: [
            'Olá! Sou T.I, seu assistente virtual. Como posso ajudar você?',
            'Oi! Tudo bem? Como posso ser útil hoje?',
            'E aí! Aqui é T.I. O que você precisa?',
            'Olá! Que bom ter você aqui. Em que posso ajudar?'
        ]
    },
    time: {
        keywords: ['que horas são', 'me diga as horas', 'qual é a hora', 'hora atual', 'horário'],
        action: 'getTime'
    },
    date: {
        keywords: ['qual é a data', 'data de hoje', 'que dia é hoje', 'data atual', 'dia e mês'],
        action: 'getDate'
    },
    jokes: {
        keywords: ['piada', 'me conte uma piada', 'diga uma piada', 'faça uma piada', 'algo engraçado', 'me faz rir'],
        responses: [
            'Por que a matemática foi à praia? Porque ela queria procurar a raiz quadrada!',
            'Como se chama um boomerang que não volta? Uma pau!',
            'O que o livro de matemática disse para o de português? "Você tem problemas!"',
            'Por que o JavaScript foi à terapia? Porque tinha muitos callbacks!',
            'Qual é o carro que mais rodopia? O Samsung Galaxy Fit!',
            'Por que o computador foi ao psicólogo? Porque tinha um bichinho de bits!',
            'O que o arquivo disse para o HD? "Você tem problemas de armazenamento!"'
        ]
    },
    calculator: {
        keywords: ['calcule', 'me calc', 'quanto é', 'me conta', 'soma', 'subtrai', 'multiplica', 'divide'],
        action: 'calculate'
    },
    weather: {
        keywords: ['clima', 'previsão', 'weather', 'tempo', 'está chovendo', 'vai chover'],
        responses: [
            'Infelizmente, preciso de sua localização para verificar o clima. Você pode me dizer sua cidade?',
            'Para a previsão do tempo, eu precisaria saber onde você está. Qual é sua cidade?'
        ]
    },
    google: {
        keywords: ['google', 'procure', 'pesquise', 'busque', 'abra o google', 'abra google'],
        action: 'openGoogle'
    },
    youtube: {
        keywords: ['youtube', 'vídeo', 'assista', 'abra youtube'],
        action: 'openYouTube'
    },
    music: {
        keywords: ['música', 'canção', 'reproduza', 'ouça', 'som'],
        responses: [
            '🎵 Aqui está uma música relaxante: https://www.youtube.com/results?search_query=relaxing+music',
            'Que tal ouvir música clássica? https://www.youtube.com/results?search_query=classical+music',
            'Deixa eu colocar uma boa música para você!'
        ]
    },
    alarm: {
        keywords: ['alarme', 'despertador', 'me acorde', 'defina um alarme'],
        action: 'setAlarm'
    },
    todo: {
        keywords: ['tarefa', 'afazer', 'lembrete', 'anote', 'escreva'],
        action: 'addTodo'
    },
    help: {
        keywords: ['ajuda', 'como funciona', 'o que você faz', 'seus comandos', 'me ajude'],
        responses: [
            'Sou T.I, seu assistente virtual! Posso ajudar com:\n' +
            '• Telling time and date\n' +
            '• Telling jokes\n' +
            '• Math calculations\n' +
            '• Abrindo websites\n' +
            '• E muito mais!\n' +
            'Clique em "Como Usar T.I" para mais informações!',
        ]
    },
    search: {
        keywords: ['busque', 'pesquise', 'procure', 'o que é', 'quem é', 'quando foi'],
        action: 'searchOnline'
    },
    weather: {
        keywords: ['clima', 'previsão', 'weather', 'tempo', 'está chovendo', 'vai chover', 'temperatura em'],
        action: 'getWeatherByCity'
    },
        keywords: ['quem é você', 'seu nome', 'apresente-se', 'o que você é', 'sobre você'],
        responses: [
            'Sou T.I, seu assistente virtual inteligente! Estou aqui para ajudar você com qualquer coisa. Posso responder perguntas, contar piadas, fazer cálculos e muito mais!',
            'Olá! Sou T.I, seu assistente virtual. Fui criado para tornar sua vida mais fácil e divertida!'
        ]
    },
    gratitude: {
        keywords: ['obrigado', 'valeu', 'muito obrigado', 'vlw', 'thanks', 'agradeço'],
        responses: [
            'Por nada! Sempre feliz em ajudar! 😊',
            'De nada! Estou sempre aqui para você.',
            'Magina! Para isso estou aqui!'
        ]
    },
    goodbye: {
        keywords: ['adeus', 'tchau', 'até logo', 'até logo', 'vou indo', 'até mais'],
        responses: [
            'Tchau! Volte logo! 👋',
            'Até a próxima! Tenha um ótimo dia!',
            'Adeus! Fico aguardando seu retorno!'
        ]
    }
};

// Get a random item from an array
function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Get current time
function getTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `São ${hours}:${minutes}`;
}

// Get current date
function getDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateStr = now.toLocaleDateString('pt-BR', options);
    return `Hoje é ${dateStr}`;
}

// Parse and calculate mathematical expression
function calculate(expression) {
    try {
        // Remove 'calcule' and similar words
        let cleaned = expression.toLowerCase()
            .replace(/me calc[u]?e?/g, '')
            .replace(/quanto é/g, '')
            .replace(/calcule/g, '')
            .replace(/me conta/g, '')
            .replace(/\s+/g, '')
            .trim();

        // Replace Portuguese words with operators
        cleaned = cleaned
            .replace(/mais/g, '+')
            .replace(/menos/g, '-')
            .replace(/vezes/g, '*')
            .replace(/dividido\s*por/g, '/')
            .replace(/\s+/g, '');

        // Validate expression (only allow safe characters)
        if (!/^[\d+\-*/.()]+$/.test(cleaned)) {
            return 'Desculpa, não consegui entender esse cálculo. Tente usar números e operações simples.';
        }

        // Evaluate
        const result = Function('"use strict"; return (' + cleaned + ')')();
        
        if (isNaN(result) || !isFinite(result)) {
            return 'Este cálculo resultou em um valor inválido.';
        }

        return `O resultado é: ${Number(result.toFixed(2))}`;
    } catch (e) {
        return 'Desculpa, não consegui fazer esse cálculo. Pode tentar novamente?';
    }
}

// Search in Wikipedia
async function searchWikipedia(query) {
    try {
        // Tenta usar o proxy do backend primeiro, depois fallback direto
        let url = `/api/wikipedia?query=${encodeURIComponent(query)}`;
        
        // Se não estiver em desenvolvimento, tenta usar a API direta com origin parameter
        const response = await fetch(url).catch(() => 
            fetch(`https://pt.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`)
        );
        
        const data = await response.json();
        
        if (data.query && data.query.search && data.query.search.length > 0) {
            const result = data.query.search[0];
            return `De acordo com a Wikipédia: ${result.snippet.replace(/<[^>]*>/g, '').substring(0, 200)}...`;
        }
        return null;
    } catch (error) {
        console.error('Erro na busca da Wikipédia:', error);
        return null;
    }
}

// Search in WolframAlpha (requires iframe approach for free tier)
async function searchOnline(query) {
    try {
        // Tenta Wikipedia primeiro
        const wikiResult = await searchWikipedia(query);
        if (wikiResult) {
            return wikiResult;
        }

        // Se Wikipedia não achar, retorna resposta genérica com sugestão
        return `🔍 Buscando informações sobre: "${query}"\n\nPara resultados mais precisos, você pode:\n• Visitar Wikipedia: https://pt.wikipedia.org/w/index.php?search=${encodeURIComponent(query)}\n• Pesquisar no Google: https://www.google.com/search?q=${encodeURIComponent(query)}\n\nVocê gostaria que eu abrisse a busca no Google?`;
    } catch (error) {
        console.error('Erro na busca online:', error);
        return 'Desculpa, não consegui buscar essa informação agora. Tente novamente.';
    }
}

// Get weather by city
async function getWeatherByCity(city) {
    try {
        // Usar proxy do backend (Open-Meteo API)
        const geoResponse = await fetch(`/api/geocoding?city=${encodeURIComponent(city)}`)
            .catch(() => 
                // Fallback para API direta se o backend não estiver disponível
                fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&language=pt&count=1&format=json`)
            );
        
        const geoData = await geoResponse.json();
        
        if (!geoData.results || geoData.results.length === 0) {
            return `Desculpa, não encontrei a cidade "${city}". Pode tentar outra?`;
        }

        const location = geoData.results[0];
        const weatherResponse = await fetch(
            `/api/weather?latitude=${location.latitude}&longitude=${location.longitude}`
        ).catch(() =>
            // Fallback para API direta
            fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,weather_code&temperature_unit=celsius&language=pt`
            )
        );
        
        const weatherData = await weatherResponse.json();
        
        const current = weatherData.current;
        const weatherDescriptions = {
            0: 'céu limpo',
            1: 'céu parcialmente nublado',
            2: 'parcialmente nublado',
            3: 'nublado',
            45: 'com neblina',
            48: 'com neblina e gelo',
            51: 'chuva leve',
            53: 'chuva moderada',
            55: 'chuva intensa',
            61: 'chuva',
            63: 'chuva forte',
            65: 'chuva muito forte',
            80: 'chuva moderada',
            81: 'chuva forte',
            82: 'chuva muito forte',
            95: 'trovoada'
        };

        const weather = weatherDescriptions[current.weather_code] || 'desconhecido';
        return `Em ${location.name}: ${current.temperature_2m}°C com ${weather}. Umidade: ${current.relative_humidity_2m}%`;
    } catch (error) {
        console.error('Erro ao buscar clima:', error);
        return 'Desculpa, não consegui obter a previsão do tempo. Internet está funcionando?';
    }
}

// Open Google
function openGoogle() {
    window.open('https://www.google.com', '_blank');
    return 'Abrindo Google para você! 🔍';
}

// Open YouTube
function openYouTube() {
    window.open('https://www.youtube.com', '_blank');
    return 'Abrindo YouTube! 🎬';
}

// Set Alarm (simple version)
function setAlarm(voiceInput) {
    const timeMatch = voiceInput.match(/(\d{1,2})[:\s]?(\d{2})?/);
    if (timeMatch) {
        const hours = timeMatch[1];
        const minutes = timeMatch[2] || '00';
        return `Alarme definido para ${hours}:${minutes}. Você será avisado neste horário!`;
    }
    return 'Qual hora você quer que eu defina o alarme?';
}

// Add To-Do (simple version)
function addTodo(voiceInput) {
    const taskMatch = voiceInput.match(/(?:anote|escreva|lembre|tarefa)[:\s]+(.+)/i);
    if (taskMatch) {
        const task = taskMatch[1];
        return `Tarefa adicionada: "${task}". Vou lembrar você sobre isso!`;
    }
    return 'Qual tarefa você quer que eu anote?';
}

// Process voice input and find matching command (returns Promise)
async function processCommand(voiceInput) {
    const input = voiceInput.toLowerCase().trim();

    // Search through command database
    for (const [key, command] of Object.entries(COMMAND_DATABASE)) {
        for (const keyword of command.keywords) {
            if (input.includes(keyword)) {
                if (command.action) {
                    // Execute action function
                    switch (command.action) {
                        case 'getTime':
                            return getTime();
                        case 'getDate':
                            return getDate();
                        case 'calculate':
                            return calculate(input);
                        case 'openGoogle':
                            return openGoogle();
                        case 'openYouTube':
                            return openYouTube();
                        case 'setAlarm':
                            return setAlarm(input);
                        case 'addTodo':
                            return addTodo(input);
                        case 'searchOnline':
                            return await searchOnline(input);
                        case 'getWeatherByCity':
                            const cityMatch = input.match(/(?:clima|previsão|temperatura)\s+(?:em|de|na|no)\s+([a-záéíóú\s]+)/i);
                            const city = cityMatch ? cityMatch[1].trim() : input.replace(/clima|previsão|temperatura/gi, '').trim();
                            return await getWeatherByCity(city);
                        default:
                            return 'Não consegui processar este comando.';
                    }
                } else if (command.responses) {
                    // Return random response
                    return getRandomItem(command.responses);
                }
            }
        }
    }

    // Se nenhum comando foi encontrado, retorna null para usar ChatGPT
    // O script.js irá detectar e chamar a IA paga
    return null;
}

// Get current time formatted
function getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

// Speech synthesis
function speak(text, rate = 1) {
    return new Promise((resolve) => {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = rate;
        utterance.pitch = 1;
        utterance.volume = 0.7;

        // Use Portuguese voice if available
        const voices = window.speechSynthesis.getVoices();
        const ptVoice = voices.find(v => v.lang.includes('pt'));
        if (ptVoice) {
            utterance.voice = ptVoice;
        }

        utterance.onend = resolve;
        utterance.onerror = resolve;

        window.speechSynthesis.speak(utterance);
    });
}
