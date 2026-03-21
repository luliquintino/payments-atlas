# UX Redesign — Exploração Gamificada

**Data**: 2026-03-21
**Abordagem**: B — Exploração Gamificada (Duolingo + Notion híbrido)
**Constraint**: Conteúdo existente não muda. Apenas apresentação e UX.

---

## Resumo

Redesign completo da experiência do Payments Knowledge System, transformando de uma documentação técnica densa e escura em uma **plataforma de estudo gamificada** com visual light, navegação simplificada e sistema de progressão (XP, badges, streaks, níveis).

**Referência principal**: Duolingo / Khan Academy
**Público**: Iniciantes e pessoas entrando na área de pagamentos

### Problemas Atuais
1. **Navegação confusa** — sidebar com 30+ itens visíveis, 8 seções colapsáveis. Intimida iniciantes
2. **Visual monótono/denso** — dark mode navy, todas as páginas idênticas (título → stats → conteúdo). Cansa visualmente
3. **Falta de guia** — sem caminho claro para iniciantes, sem validação de aprendizado
4. **Sem motivação** — nenhum feedback de progresso, nenhuma recompensa por estudar

---

## Seção 1: Design System & Visual Identity

### Paleta de Cores — Light Mode

| Variável | Valor | Uso |
|----------|-------|-----|
| `--background` | `#FAFBFC` | Fundo da página |
| `--surface` | `#FFFFFF` | Cards, sidebar |
| `--surface-hover` | `#F3F4F6` | Hover states |
| `--border` | `#E5E7EB` | Bordas sutis |
| `--foreground` | `#111827` | Texto principal |
| `--text-muted` | `#6B7280` | Texto secundário |
| `--text-light` | `#9CA3AF` | Texto terciário |
| `--primary` | `#6366F1` | Ação principal (indigo) |
| `--primary-light` | `#818CF8` | Hover do primary |
| `--primary-bg` | `#EEF2FF` | Background de badges/highlights |
| `--success` | `#10B981` | Completo, correto, XP |
| `--warning` | `#F59E0B` | Streak, atenção |
| `--danger` | `#EF4444` | Erro, quiz incorreto |
| `--xp-gold` | `#F59E0B` | XP points |
| `--streak-orange` | `#F97316` | Streak counter |

### Tipografia
- Font: **Inter** (já em uso)
- Display: 2.25rem / 800 — títulos de página
- H1: 1.5rem / 700 — seções
- H2: 1.25rem / 600 — sub-seções
- Body: 0.9375rem / 400 — texto corrido
- Caption: 0.8125rem / 500 — labels, badges

### Componentes Base
- **Cards**: Fundo branco, `border: 1px solid var(--border)`, `border-radius: 12px`, sombra `0 1px 3px rgba(0,0,0,0.04)`. Hover: sombra cresce + borda primary
- **Badges**: Pill shape, fundo colorido 10% opacidade, texto cor forte
- **Botões**: Primary `var(--primary)`, border-radius 8px, hover escurece 10%
- **Progress bars**: Rounded, fundo `var(--surface-hover)`, preenchimento gradiente primary
- **Micro-animações**: Confetti em quiz correto, bounce no XP counter, scale-up em badges

---

## Seção 2: Navegação & Sidebar

### Sidebar Minimalista — 5 itens

De 30+ itens para 5 itens de alto nível:

1. **🏠 Home** → Dashboard pessoal do aluno
2. **🗺️ Trilhas** → Mapa visual de todas as trilhas
3. **🧭 Explorar** → Expande sub-menu com todas as 30 páginas por categoria
4. **🔧 Ferramentas** → Simulador, Consultor, Dashboard, Event Explorer
5. **🔍 Buscar** → Overlay Cmd+K

**Rodapé da sidebar**: XP total + streak counter (sempre visível)

### "Explorar" expandido
Ao clicar, mostra as categorias (mesmas 8 seções atuais):
- Pagamentos (5 páginas)
- Infraestrutura (3 páginas)
- Crypto & Web3 (3 páginas)
- Knowledge Base (5 páginas)
- Fraude & Risco (3 páginas)
- Diagnóstico (3 páginas)

Cada categoria expande para mostrar sub-páginas. **Colapsado por default**.

### Navegação Contextual (dentro de trilha)
Barra no topo da página:
```
Trilha: Fundamentos  ·  3 de 8  ·  ████░░░░ 37%
                                  ← Anterior | Próximo →
```

---

## Seção 3: Homepage — Dashboard do Aluno

### Seções do Dashboard (top to bottom)

1. **Header pessoal**: Saudação + streak + XP total
2. **Continuar estudando**: Card da trilha ativa com progresso e botão "Continuar"
3. **Meu progresso**: 4 stat cards (páginas visitadas, trilhas, badges, quiz avg)
4. **Trilhas de aprendizado**: Grid de cards de trilhas com progresso %
5. **Conquistas recentes**: Row de badges (desbloqueados + "???" para descobrir)
6. **Acesso rápido**: Links para Glossário, Busca, Simulador, Consultor AI

### Estado de primeiro acesso
Welcome message + 2 CTAs:
- "Começar pelos Fundamentos" (guiado)
- "Explorar livremente" (modo livre)

### Comportamento dinâmico
- Trilhas com 🔒 não bloqueiam acesso, mas tooltip recomenda completar pré-requisito
- Streak conta dias consecutivos com 1+ página visitada
- Badges "???" criam curiosidade

---

## Seção 4: Páginas de Conteúdo

### Estrutura de cada página

1. **Trail bar** (se dentro de trilha): progresso + navegação anterior/próximo
2. **Título + descrição**
3. **"O que você vai aprender"**: 3 bullet points do que a página cobre
4. **Conteúdo em accordions**: Seções colapsáveis. Primeira aberta, demais fechadas
5. **Termos-chave**: Badges de glossário com tooltip
6. **Quiz**: 2-3 perguntas múltipla escolha, +5 XP por acerto
7. **Completion card**: Celebração com XP ganho + navegação para próxima

### Progressive Disclosure
- Conteúdo denso fica em accordions (reduz overwhelm)
- Primeira seção aberta por default
- Click para expandir/colapsar

### Páginas de Ferramentas
Simulador, Dashboard, etc. mantêm layout livre sem quiz/progresso, mas ganham visual light.

---

## Seção 5: Gamificação

### XP System

| Ação | XP |
|------|-----|
| Visitar página (primeira vez) | +5 |
| Quiz: por pergunta correta | +5 |
| Completar trilha inteira | +50 bônus |
| Streak 3 dias | +20 bônus |
| Streak 7 dias | +50 bônus |

### Níveis

| Nível | Nome | XP |
|-------|------|-----|
| 1 | Iniciante | 0 |
| 2 | Curioso | 100 |
| 3 | Estudante | 250 |
| 4 | Analista | 400 |
| 5 | Especialista | 700 |
| 6 | Mestre em Pagamentos | 1000 |

### Badges — 12 conquistas em 4 categorias

**Explorador** (navegação):
- 🌟 Primeiro Passo (1 página) +10 XP
- 📚 Leitor Dedicado (10 páginas) +25 XP
- 🗺️ Explorador (20 páginas) +50 XP
- 🌍 Cartógrafo (30 páginas) +100 XP

**Estudante** (quizzes):
- 🧠 Curioso (1 quiz) +10 XP
- 🎯 Precisão (3 quizzes 100%) +30 XP
- 💯 Perfeição (todos 100%) +200 XP

**Trilheiro** (trilhas):
- 🏁 Decolagem (1 trilha) +50 XP
- ⭐ Especialista (3 trilhas) +100 XP
- 🏆 Mestre (todas) +300 XP

**Consistência** (streaks):
- 🔥 Em Chamas (3 dias) +20 XP
- ⚡ Imparável (7 dias) +50 XP
- 💎 Lendário (30 dias) +200 XP

### Página "Meu Progresso"
- Stats: XP, streak, badges, quiz average
- Barra de nível com progresso
- Grid de badges (desbloqueados + locked)
- Competição consigo mesmo: histórico de XP por sessão, recorde pessoal

### Leaderboard (sem backend)
- Competição consigo mesmo: mostra sessões anteriores
- Meta: bater recorde ou atingir próximo nível
- Estrutura preparada para leaderboard real com backend futuro

### Persistência (localStorage)
- `pks-xp`: XP total
- `pks-streak`: {count, lastDate}
- `pks-badges`: badge IDs desbloqueados
- `pks-quiz-scores`: {pageRoute: {correct, total}}
- `pks-pages-visited`: routes visitadas
- `pks-sessions`: histórico XP por sessão

---

## Mudanças Técnicas de Alto Nível

### O que muda
1. **globals.css**: Paleta de cores dark → light, novos componentes (accordion, progress bar, trail bar, quiz)
2. **Sidebar.tsx**: De 30+ itens para 5 itens com sub-menu "Explorar"
3. **Homepage (page.tsx)**: De landing page estática para dashboard dinâmico do aluno
4. **Todas as 30 páginas de conteúdo**: Ganham structure "O que vai aprender" + accordions + termos-chave + quiz + completion card
5. **Novo sistema de gamificação**: Hooks e componentes para XP, badges, streak, níveis

### O que NÃO muda
- **Conteúdo**: Textos, dados, informações permanecem idênticos
- **Rotas**: URLs das páginas continuam as mesmas
- **Data files**: features.ts, glossary.ts, business-rules.ts, etc. intocados
- **Funcionalidades**: Busca (Cmd+K), glossário, breadcrumb continuam funcionando

### Novos arquivos necessários
- `hooks/useGameProgress.ts` — XP, badges, streak, nível (localStorage)
- `hooks/useQuizProgress.ts` — Scores de quiz por página
- `components/ui/PageQuiz.tsx` — Componente de quiz
- `components/ui/TrailBar.tsx` — Barra de progresso de trilha no topo
- `components/ui/CompletionCard.tsx` — Card de celebração pós-quiz
- `components/ui/BadgeGrid.tsx` — Grid de badges
- `components/ui/XPCounter.tsx` — Animação de XP
- `components/ui/Accordion.tsx` — Seções colapsáveis
- `data/quizzes.ts` — Perguntas de quiz por página
- `data/badges.ts` — Definições de badges
- `app/progress/page.tsx` — Página "Meu Progresso"

### Stack
- Next.js App Router (já em uso)
- Tailwind + CSS custom properties (inline styles por causa do CSS reset)
- localStorage para persistência
- Sem backend necessário
