# Design: Learning Journey Redesign

## Problema

O Payments Knowledge System tem 30 paginas ricas em conteudo, mas um usuario novo nao sabe por onde comecar. A home page nao guia, a navegacao e por referencia (sidebar) em vez de por aprendizado, e ~15 paginas ainda tem UX inconsistente (spacing quebrado, sem stats, sem busca).

## Decisoes

- **Publico**: Pessoas novas em pagamentos (tom didatico, progressivo)
- **Abordagem**: "Learning Journey" — trilhas de aprendizado + padronizacao visual

## Design

### 1. Home Page — Hub de Aprendizado

A home vira o ponto de entrada didatico com:

- **Hero section**: "Bem-vindo ao mundo dos pagamentos" + subtitulo convidando a escolher trilha
- **Stats overview**: 30 Paginas | 300+ Features | 8 Areas
- **3 Trilhas de aprendizado** como cards com progress bar:

| Trilha | Publico | Paginas (ordem) |
|--------|---------|-----------------|
| Fundamentos | Iniciante | Mapa de Pagamentos > Trilhos > Fluxos > Sistema Financeiro > Ecossistema > Banking > Settlement > Liquidez |
| Operacoes & Risco | Intermediario | Dashboard > Metricas > Conta Comigo > Problemas > Mapa de Fraude > Sinais > Chargeback |
| Arquitetura | Avancado | Features > Taxonomia > Regras > Dependencias > Simulador > Consultor > Blockchain > DeFi |

- **Secao "Continuar aprendendo"**: Mostra proxima pagina da trilha ativa
- **Recentes**: Ultimas 4 paginas visitadas
- **Acesso rapido**: 6 links populares

Progress tracking via `localStorage`.

### 2. Navegacao Sequencial

Componente `TrailNavigation` no footer de cada pagina:
- Detecta trilha ativa via pathname + localStorage
- Mostra "Anterior" e "Proximo" com nome da pagina destino
- Progress bar: "Passo X de Y" com percentual
- Dados centralizados em `LEARNING_TRAILS` constant

### 3. Sidebar Melhorada

- **Badge de progresso**: "Explorar 3/5" ao lado de cada grupo
- **Highlight "Comecar aqui"**: Destaque na primeira pagina da trilha ativa
- **Tooltips descritivos**: Hover mostra 1 frase sobre cada pagina

### 4. Padronizacao das 15 Paginas Restantes

Cada pagina recebe:
- Fix spacing (Tailwind > inline styles)
- Stats section (3-5 stat-cards)
- Disclaimer numeros volateis
- Search (quando >5 itens)
- CSS Grid expand/collapse
- Footer com related pages
- Animacoes fade-in + stagger

Paginas: blockchain-map, stablecoin-systems, defi-protocols, features, business-rules, dependency-graph, taxonomy, fraud-map, fraud-signals, chargeback-lifecycle, payments-dashboard, event-explorer, payments-advisor, search, feature detail.

## Arquivos Criticos

- `frontend/src/app/page.tsx` — Home page (reescrever)
- `frontend/src/components/layout/Sidebar.tsx` — Sidebar (modificar)
- `frontend/src/components/layout/TrailNavigation.tsx` — NOVO componente
- `frontend/src/data/learning-trails.ts` — NOVO arquivo de dados das trilhas
- `frontend/src/hooks/useTrailProgress.ts` — NOVO hook para localStorage
- 15 paginas individuais (spacing + stats + footer + disclaimer)

## Verificacao

1. Home page: 3 trilhas visiveis, progress bars funcionando, links corretos
2. Trail navigation: botoes Anterior/Proximo em cada pagina da trilha
3. Sidebar: badges de progresso atualizando ao visitar paginas
4. 15 paginas: 0 erros console, spacing correto, stats + footer + disclaimer presentes
5. localStorage: progresso persiste entre sessoes
