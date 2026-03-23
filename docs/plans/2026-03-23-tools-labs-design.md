# Professional Tools & Interactive Labs

**Date:** 2026-03-23
**Status:** Approved

## Professional Tools (5)

### 1. Calculadora de MDR/Interchange (`/tools/mdr-calculator`)
Input: volume, ticket médio, mix bandeiras, tipo (crédito/débito/pix), parcelamento.
Output: custo por transação, MDR efetivo, breakdown (interchange + scheme fee + acquirer markup).

### 2. Simulador de P&L de PSP (`/tools/psp-pnl`)
Input: GMV, take rate, mix meios de pagamento, custo processamento, chargebacks, headcount.
Output: P&L mensal, receita, custos, margem, break-even.

### 3. Comparador de PSPs (`/tools/psp-comparator`)
Tabela comparativa: Cielo, Rede, Stone, PagSeguro, Adyen, Stripe, Mercado Pago.
Critérios: pricing, features, API quality, settlement speed, suporte.

### 4. Checklist de Integração (`/tools/integration-checklist`)
Wizard: tipo de integração → checklist personalizado com etapas, pré-requisitos, testes, armadilhas.

### 5. Calculadora de Chargeback (`/tools/chargeback-calculator`)
Input: volume, chargeback rate, win rate, custo por disputa.
Output: impacto financeiro, projeção multas VDMP/ECM, ROI prevenção.

## Interactive Labs (4)

### 1. Sandbox de API (`/labs/api-sandbox`)
JSON editor para montar requests (create payment, capture, refund, void). Response simulada. Valida campos.

### 2. Estudo de Caso Interativo (`/labs/case-study`)
3 cenários narrados com decisões do usuário. Impacto simulado nas métricas.

### 3. Simulador de Incidente (`/labs/incident-simulator`)
Role-play de incidente de pagamentos. Runbook interativo, logs simulados, timer, score.

### 4. Role-Play de Disputa (`/labs/dispute-roleplay`)
Defesa de chargeback simulada. Reason code, evidence package, avaliação de resultado.
