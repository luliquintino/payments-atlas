# Tools & Labs Improvements Design

**Date:** 2026-03-25
**Status:** Approved

## Calculadoras

### MDR Calculator
- Breakdown visual por componente (interchange + scheme fee + markup)
- Gráfico de pizza
- Comparar até 3 cenários lado a lado
- Slider parcelamento (1x-12x) com impacto no MDR
- Export PDF

### Chargeback Calculator
- Custo real: valor + operational fee + scheme fee + multa
- Gráfico projeção 12 meses
- Barra visual vs limites VDMP/ECM
- ROI de prevenção por ferramenta

### P&L PSP
- Dashboard 4 gráficos: receita vs custo, margem trend, break-even, unit economics
- Sliders de sensibilidade em tempo real
- Benchmarks de mercado BR

## Consultores AI

### Payments Advisor
- Claude API com streaming SSE + contexto completo do atlas
- Perfil do usuário no system prompt
- Respostas com markdown + links internos + code blocks
- 3 follow-up suggestions por resposta
- Histórico 20 conversas (localStorage)
- Chat fullscreen

### Document Analyzer
- Upload real PDF (pdf.js client-side)
- Fetch real de URL
- Auto-resumo estruturado ao carregar
- Identifica termos do glossário no documento
- Chat especializado em comparação com atlas

## Simuladores & Labs

### API Sandbox
- Syntax highlighting + auto-complete + validação
- 8 operações (create, authorize, capture, void, refund, partial, 3DS, tokenize)
- Responses realistas com headers/status/timing
- Modo Caos (erros injetados)
- Checklist de API mastered

### Incident Simulator
- 5 cenários (auth drop, latency, fraud, settlement, acquirer down)
- Dashboard simulado com métricas tempo real
- Console de logs scrollando
- Score: tempo, ações corretas, root cause

### Dispute Roleplay
- 6 reason codes
- 15 tipos de evidência selecionáveis
- Resultado com probabilidade + explicação
- Fluxo diferente por bandeira

### Case Study
- 6 cenários (auth rate, fraud, churn, cross-border, PIX, multi-acquirer)
- 4-5 decision points com trade-offs
- Métricas animadas antes/depois

## Ferramentas de Análise

### Architecture Advisor
- Features com dependências visuais (mini grafo)
- Métricas recalculam ao add/remove features
- Estimativa de custo por feature
- Modo Compare (2 perfis)

### Payment Simulator
- Presets por tipo de negócio
- Gráfico radar 6 eixos
- Toggle features ON/OFF com impacto tempo real
- Salvar e comparar 3 cenários

### PSP Comparator
- 10 PSPs reais com dados atualizados
- Filtros por feature/preço/região/tipo
- Score ponderado por perfil
- Card expandido com pros/cons

### Integration Checklist
- Wizard 5 steps personalizado
- Estimativa tempo por step
- Armadilhas comuns por step
- Export markdown/PDF
