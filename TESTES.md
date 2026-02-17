# 🧪 Guia de Testes - T.I Assistant v1.1

Teste a nova funcionalidade de busca na internet!

## 📋 Checklist de Testes

### 1️⃣ Testes Básicos (v1.0.0)

- [ ] App carrega sem erros
- [ ] Tema claro/escuro alterna
- [ ] Botão microfone responde
- [ ] Pode falar comando: "Que horas são?"
- [ ] Pode falar comando: "Qual é a data?"
- [ ] Pode falar comando: "Diga uma piada"
- [ ] Pode falar comando: "Me calcule 10 + 5"

### 2️⃣ Testes de Busca na Internet (NOVO - v1.1.0)

#### ✅ Perguntas com "?"
Teste cada uma (requer internet):

```
[ ] "Qual é a capital da França?"
[ ] "O que é Python?"
[ ] "Quem foi Albert Einstein?"
[ ] "Quando começou a Segunda Guerra Mundial?"
[ ] "Por que o céu é azul?"
[ ] "O que é fotossíntese?"
[ ] "Como funciona a gravidade?"
```

**Esperado:** T.I busca na Wikipedia e retorna um resumo

#### ✅ Comandos de Busca
```
[ ] "Busque sobre energia renovável"
[ ] "Pesquise Leonardo da Vinci"
[ ] "Procure por inteligência artificial"
```

**Esperado:** Busca automática similar a perguntas com "?"

#### ✅ Clima em Tempo Real
Teste clima de várias cidades:

```
[ ] "Clima em São Paulo"
[ ] "Qual é a temperatura em Rio de Janeiro?"
[ ] "Como está o tempo em Nova York?"
[ ] "Clima em Tóquio"
[ ] "Temperatura em Paris"
[ ] "Como está em Londres?"
```

**Esperado:** Retorna temperatura, umidade e condição do céu

### 3️⃣ Testes de Interface

- [ ] Botões quick commands funcionam
- [ ] Modal de ajuda mostra novos comandos
- [ ] Histórico registra buscas
- [ ] Visualizador de voz anima durante busca
- [ ] Status muda para "Processando..." durante busca

### 4️⃣ Testes de Configurações

- [ ] Volume funciona (teste ajustando 0-100%)
- [ ] Velocidade de fala ajusta (0.5x a 2x)
- [ ] Som de efeitos pode ser desativado
- [ ] Histórico pode ser limpo
- [ ] Configurações salvam ao recarregar página

### 5️⃣ Testes de Compatibilidade

- [ ] Chrome (versão __)
- [ ] Edge (versão __)
- [ ] Firefox (versão __)
- [ ] Safari (versão __)
- [ ] Mobile/Responsivo

### 6️⃣ Testes de Erro & Edge Cases

```
[ ] Digitar pergunta sem internet (deve oferecer fallback)
[ ] Pergunta que não existe na Wikipedia (deve oferecer Google)
[ ] Cidade que não existe (deve pedir para tentar outra)
[ ] Microfone não funciona (deve mostrar mensagem de erro)
[ ] LocalStorage desativado (deve funcionar sem histórico)
[ ] Recarregar página durante busca (deve parar gracefully)
```

### 7️⃣ Testes de Performance

- [ ] App carrega em menos de 2 segundos
- [ ] Busca na internet leva 1-3 segundos
- [ ] Sem lag ao digitar
- [ ] Síntese de voz é suave
- [ ] Nenhum "freeze" da UI

### 8️⃣ Testes de Privacidade & Segurança

- [ ] Nenhum tracker visível
- [ ] Dados não vão além de Wikipedia/OpenMeteo
- [ ] LocalStorage só tem dados esperados
- [ ] Sem console errors relacionados a CORS

---

## 📝 Script de Teste Completo

Execute isto para teste rápido (5 minutos):

```
1. Abra intro.html
2. Clique "Iniciar Agora"
3. Teste: "Que horas são?" (testa voz básica)
4. Teste: "O que é JavaScript?" (testa busca)
5. Teste: "Clima em São Paulo" (testa API weather)
6. Teste: "Me calcule 100 / 4" (testa cálculo)
7. Teste: "Diga uma piada" (testa resposta pré-config)
8. Abra configurações (teste volume/velocidade)
9. Mude tema para escuro
10. Recarregue a página (verifique se configurações salvaram)
```

**Tempo esperado:** 5-10 minutos

---

## 🐛 Como Reportar Bugs

Se encontrar um bug, verifique:

### 1. Informações Básicas
- [ ] Navegador e versão
- [ ] Sistema operacional
- [ ] URL da página
- [ ] Reproduzível? (SIM/NÃO)

### 2. O Bug
- [ ] Qual comando não funcionou?
- [ ] Qual era o resultado esperado?
- [ ] Qual foi o resultado real?
- [ ] Screenshot/vídeo?

### 3. Contexto
- [ ] Estava online/offline?
- [ ] Microfone funcionando?
- [ ] Internet funcionando?
- [ ] Algum erro no console (F12)?

### Relatório Exemplo
```
Navegador: Chrome 120.0.6099.129
SO: Windows 11
Comando: "Clima em São Paulo"
Esperado: Temperatura e umidade
Real: Erro "Cannot read property 'results' of undefined"
Console: XHR request failed
Online: SIM
Microfone: SIM funcionando
```

---

## ✅ Casos de Sucesso

Se tudo passar:

```
✅ Reconhecimento de voz funcionando
✅ Busca na Wikipedia funcionando
✅ API de clima funcionando
✅ Síntese de voz natural
✅ Interface responsiva
✅ Configurações salvam
✅ Histórico aparece
✅ Sem erros em console
✅ Rápido e fluido
✅ Pronto para produção!
```

---

## 🚀 Teste de Produção

Antes de liberar para uso:

- [ ] Testar em 3+ navegadores diferentes
- [ ] Testar em desktop + mobile
- [ ] Testar com internet lenta (DevTools throttling)
- [ ] Testar com Service Worker desativado
- [ ] Testar fluxo completo de A-Z
- [ ] Rodar console checker (F12)
- [ ] Verificar mobile responsividade
- [ ] Testar input muito longo
- [ ] Testar comando muito rápido repetidamente
- [ ] Performance em device antigo

---

## 📊 Resultado Final

Ao completar todos os testes, T.I v1.1.0 está pronto para:

✅ Produção  
✅ Compartilhamento  
✅ Instalação como PWA  
✅ Uso diário  

---

**Protocolo de Teste:** Gerado em 16 de Fevereiro de 2026  
**Versão:** 1.1.0  
**Tempo Estimado:** 30-60 minutos de testes completos
