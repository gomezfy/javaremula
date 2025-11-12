# Emulador J2ME - Jogos Java Retrô

## Visão Geral
Emulador web de jogos Java (J2ME) que recria a experiência nostálgica de jogar em celulares antigos como Nokia e Sony Ericsson. O projeto apresenta uma interface visual autêntica de celular com tela verde monocromática e controles físicos simulados.

## Estado Atual do Projeto
**Data:** 12 de Novembro de 2025
**Versão:** 1.0.0
**Status:** MVP Funcional ✅

### Características Implementadas
- ✅ Interface nostálgica de celular Nokia
- ✅ Display de 176x208 pixels com renderização em canvas
- ✅ Sistema de controles completo (teclado e touch)
- ✅ Jogo Snake Classic totalmente funcional
- ✅ Sistema de pontuação
- ✅ Suporte para save states via localStorage
- ✅ Controles responsivos para desktop e mobile
- ✅ **Importação de jogos JAR** - Sistema completo de upload
- ✅ **Parser de arquivos JAR** - Extração de metadata e ícones
- ✅ **Gerenciamento de jogos** - Adicionar e remover jogos importados
- ✅ **Persistência** - Jogos salvos no localStorage com ArrayBuffer

## Arquitetura do Projeto

### Estrutura de Diretórios
```
/
├── src/
│   ├── components/          # Componentes React
│   │   ├── Phone.jsx        # Componente principal do celular
│   │   ├── Display.jsx      # Tela do celular com canvas
│   │   ├── Controls.jsx     # Controles físicos (D-pad, numpad)
│   │   └── JarUpload.jsx    # Sistema de upload de jogos JAR
│   ├── games/               # Jogos do emulador
│   │   └── Snake.js         # Jogo Snake clássico
│   ├── utils/               # Utilitários
│   │   └── jarParser.js     # Parser de arquivos JAR
│   ├── engine/              # Motor de emulação J2ME
│   ├── App.jsx              # Componente raiz
│   └── main.jsx             # Entry point
├── vite.config.js           # Configuração do Vite
└── package.json             # Dependências
```

### Stack Tecnológica
- **Frontend:** React 19.2.0
- **Build Tool:** Vite 7.2.2
- **Renderização:** Canvas API nativa
- **Estilos:** CSS puro (sem frameworks)
- **Controles:** Event listeners nativos
- **Parser JAR:** JSZip (processamento de arquivos ZIP/JAR)
- **Persistência:** localStorage com serialização ArrayBuffer

### Componentes Principais

#### 1. Phone.jsx
Componente que gerencia o estado do emulador e carrega jogos dinamicamente. Conecta o motor do jogo com a interface visual. Usa `useRef` para garantir cleanup correto de timers e prevenir memory leaks. Implementa botões de Save/Load funcionais.

#### 2. Display.jsx
Renderiza o jogo usando Canvas API. Suporta:
- Pixels individuais para gráficos
- Texto com fontes customizáveis
- Background colorido (verde nostálgico)

#### 3. Controls.jsx
Sistema de controles dual:
- **Keyboard:** Setas direcionais, Enter, ESC, números 0-9
- **Touch:** Botões clicáveis no D-pad e numpad

#### 4. Snake.js (Game Engine)
Motor do jogo Snake com:
- Grid-based movement system
- Detecção de colisão
- Sistema de pontuação
- Geração procedural de comida
- Velocidade progressiva
- Save/Load states totalmente funcional (recupera jogo mesmo após game over)
- Cleanup correto de timers (sem memory leaks)

#### 5. JarUpload.jsx
Componente de upload de jogos JAR:
- Interface drag-and-drop amigável
- Validação de arquivos .jar
- Feedback visual durante processamento
- Mensagens de sucesso/erro
- Integração com JarParser

#### 6. jarParser.js (Utilitário)
Parser completo de arquivos JAR/ZIP:
- Extração de manifesto (META-INF/MANIFEST.MF)
- Leitura de arquivos JAD para metadata
- Extração automática de ícones PNG
- Conversão de imagens para Data URLs
- Serialização robusta para localStorage (ArrayBuffer ↔ Array)
- Gerenciamento CRUD de jogos importados
- Tratamento de erros e validações

## Como Jogar

### Controles do Teclado
- **Setas (↑↓←→):** Mover cobra
- **ESC:** Pausar/Despausar jogo
- **Enter ou OK:** Reiniciar após Game Over
- **Números 2,4,6,8:** Movimento alternativo

### Controles Touch
- Clique nos botões direcionais (▲▼◀▶) para mover
- **Botão OK (vermelho):** Reiniciar jogo após Game Over
- **Botão ↩ (voltar):** Pausar/Despausar
- Numpad para controles alternativos

### Sistema de Save/Load
- **💾 Salvar:** Salva o progresso atual do jogo (cobra, pontuação, velocidade)
- **📂 Carregar:** Recupera o último save (funciona mesmo após game over)
- Apenas 1 slot de save por vez (autosave)
- Saves são armazenados no localStorage do navegador

## Mudanças Recentes
- **12/11/2025 - 18:53:** Sistema de importação de jogos JAR
  - ✅ Criado parser completo de arquivos JAR usando JSZip
  - ✅ Extração automática de metadata (MIDlet-Name, Vendor, Version)
  - ✅ Suporte para extração de ícones PNG dos JARs
  - ✅ Sistema de persistência robusto com localStorage
  - ✅ Interface de upload com feedback visual
  - ✅ Funcionalidade de remover jogos importados
  - ✅ Corrigido bug crítico de corrupção de dados ao salvar múltiplos jogos
  - ✅ Display de informações do jogo (nome, tamanho, vendor)
  - ✅ Ícones dos jogos exibidos na lista

- **12/11/2025 - 18:20:** Correção do bug de tremor no botão OK
  - ✅ Removida função de pausa do botão OK durante o jogo
  - ✅ Botão OK agora só reinicia após Game Over
  - ✅ Botão ESC/Voltar (↩) agora pausa/despausa o jogo
  - ✅ Adicionado indicador visual "PAUSADO" na tela
  - ✅ Instruções atualizadas na interface

- **12/11/2025 - 18:10:** Correções críticas e melhorias
  - ✅ Corrigido memory leak usando useRef no Phone.jsx
  - ✅ Sistema Save/Load totalmente funcional com UI
  - ✅ loadState agora reseta flags gameOver/paused corretamente
  - ✅ Cleanup robusto de timers (gameLoop = null)
  - ✅ Mensagem honesta sobre upload JAR (em desenvolvimento)
  
- **12/11/2025 - 18:00:** Criação inicial do projeto
  - Implementação completa do emulador J2ME
  - Jogo Snake totalmente funcional
  - Interface nostálgica de celular Nokia
  - Sistema de controles dual (keyboard + touch)
  - Botões Save/Load com integração localStorage

## Próximos Passos

### Fase 2 - Expansão
1. Implementar parser de arquivos JAR
2. Adicionar mais jogos clássicos (Space Impact, Bounce)
3. Suporte completo MIDP 1.0/2.0
4. Sistema de som usando Web Audio API
5. Galeria de screenshots de jogos
6. Leaderboard online

### Fase 3 - Melhorias
1. Skins de diferentes celulares (Nokia 3310, 5110, etc)
2. Suporte para vibração (Vibration API)
3. Multiplayer via WebRTC
4. Cloud saves com banco de dados
5. Controles customizáveis
6. Suporte para gamepad

## Configuração Técnica

### Desenvolvimento
```bash
npm run dev    # Inicia servidor em localhost:5000
npm run build  # Build para produção
```

### Requisitos
- Node.js 20+
- Navegador moderno com suporte a Canvas API
- Tela mínima recomendada: 768px de largura

## Preferências do Usuário
- **Idioma:** Português (PT-BR)
- **Estilo Visual:** Nostálgico, retrô, inspirado em Nokia
- **Foco:** Autenticidade e experiência nostálgica

## Notas Técnicas
- O Vite está configurado com `allowedHosts: true` para funcionar no ambiente Replit
- O servidor roda na porta 5000 (requisito para webview no Replit)
- Save states são armazenados no localStorage do navegador
- A renderização usa `image-rendering: pixelated` para visual retrô autêntico
