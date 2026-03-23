# UX Improvements: Navigation, Interactivity & Connectivity

**Date:** 2026-03-23
**Status:** Approved

## 1. Navigation — Sidebar Simplification

### Problem
Sidebar has 50+ items in 6 expandable categories. Impossible to find content quickly.

### Solution
Reduce sidebar to 6 fixed top-level items:

| # | Item | Icon | Target |
|---|------|------|--------|
| 1 | Home | 🏠 | / (dashboard) |
| 2 | Trilhas | 🗺️ | /trilhas |
| 3 | Quiz | 🧠 | /quiz |
| 4 | Explorar | 🧭 | /explore (hub page) |
| 5 | Ferramentas | 🔧 | expandable: 6 tools |
| 6 | Buscar | 🔍 | /search |

### Explore Hub Page (`/explore`)
Replaces the giant sidebar submenu. A page with:
- Grid of 8 categories (Pagamentos, Infra, Crypto, Knowledge, Fraude, Diagnóstico, Regulação, Operacional)
- Each category: card with icon, name, page count, user progress
- Click expands showing all pages in that category
- Inline search to filter by name
- Tags: "Novo", "Avançado", "Popular"
- Visual progress per category

## 2. Interactivity — Visual Components

### FlowDiagram
SVG sequence diagrams with:
- Actor columns (Cliente, Merchant, PSP, Adquirente, Bandeira, Emissor)
- Animated arrows between actors
- Click each step for detailed explanation
- Play/Pause auto-animation
- Used in: Transaction Flows, Payment Rails, Chargeback Lifecycle, Settlement/Clearing

### InteractiveLayerMap
Clickable payment stack showing 6 layers:
- Click layer to expand and show features
- Hover highlights cross-layer dependencies
- Features link to Feature Discovery
- Used in: Payments Map, Feature Discovery, Architecture Advisor

### ComparisonTable
Interactive comparison tables:
- Toggle between options (Pix vs Card vs Boleto)
- Highlight differences
- Sort by any column
- Used in: Payment Rails, Brand Rules, Regulatory Matrix

## 3. Connectivity — Cross-Links

### content-map.ts
Relationship map for all 77 pages with 5 relation types:
- relatedPages, relatedFeatures, relatedGlossary, prerequisites, nextSteps

### RelatedContent Component
Footer of each page showing 3-4 related content cards.

### InlineFeatureLink Component
Auto-linking feature mentions in text with hover tooltip.

### PrerequisiteBanner Component
Top banner on advanced pages suggesting prerequisites based on user progress.
