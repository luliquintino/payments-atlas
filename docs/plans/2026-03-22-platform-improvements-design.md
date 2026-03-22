# Platform Improvements Design

Date: 2026-03-22

## 1. AI & Document Analysis

### Problem
Consultor AI and Document Analyzer use keyword matching — generic, pre-defined responses.

### Solution
- API Route `/api/ai/chat` — receives message + context (document or knowledge base)
- API Route `/api/ai/analyze-document` — receives PDF/URL, extracts text, returns summary
- Claude API via env var `ANTHROPIC_API_KEY`
- SSE streaming for real-time response feedback
- Auto-context: Consultor AI injects features/glossary/rules as system prompt
- Document context: Analyzer injects extracted text as context
- Rate limiting: max 20 requests/hour per user (localStorage counter)
- Fallback: if no API key, keeps keyword-based with warning

## 2. Improved Quizzes

### Problem
Shallow questions, 1-3 per page, single format, generic explanations.

### Solution
- 3-5 questions per page
- 4 question types: multiple choice, true/false, ordering, practical scenario
- Progressive difficulty: easy → medium → hard
- Detailed explanations with "why X is wrong" for each option
- Real Brazilian market scenarios
- XP by difficulty: easy +3, medium +5, hard +10, scenario +15

## 3. Usability & Interaction

### Bugs to Fix
- Global search: results in DOM but invisible (CSS height/overflow)
- Profile: Save/Logout buttons below viewport
- Document Analyzer: chat input cut off
- Consultor AI: small response area
- Brand Rules: cards don't expand on click
- Trail buttons not working

### UX Improvements
- Toast notifications for actions
- Skeleton loaders on all data-loading pages
- Friendly empty states
- Clickable breadcrumbs on all pages
- Scroll-to-top button on long pages
- Cmd+K shortcut for quick search

## 4. Information & Data

### Content Expansion
- Complete technicalRequirements/payloadExample for all 83 features
- Expand glossary from 60 to 120+ terms (including BR terms)
- Add BR-specific business rules (BCB, CVM, payment arrangement regulation)
- "Real Cases" section on each content page
- Comparative tables (Pix vs card, acquirer vs sub-acquirer, SCD vs bank)

### Deep Content Areas
- Antecipacao de recebiveis: discount rate calculation, cash flow impact, registradora (CERC, CIP, B3)
- Parcelamento: emissor vs lojista, interchange impact, MDR, chargeback on installments
- Credit/SCD/FIDC: SCD model, BCB regulation, FIDC as financing structure, receivables assignment
- Advanced crypto: bridges, MEV, liquidity pools, impermanent loss, flash loans, oracles, L2 rollups

## 5. Security

### Fixes
- Password: SHA-256 hash on client before storing (never store raw)
- Rate limiting on login: 5 attempts then 15min lockout
- Input validation: email regex, password strength indicator, name min 2 chars
- Sanitization: strip HTML tags from all inputs
- CSP meta tag in layout
