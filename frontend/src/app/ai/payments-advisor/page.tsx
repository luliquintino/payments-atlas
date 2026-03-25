"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";

// ---------------------------------------------------------------------------
// Rate limiting helper
// ---------------------------------------------------------------------------

interface RateLimitData {
  count: number;
  resetAt: number;
}

function checkRateLimit(): { allowed: boolean; minutesLeft: number } {
  const key = "pks-ai-requests";
  const now = Date.now();
  const raw = typeof window !== "undefined" ? localStorage.getItem(key) : null;
  let data: RateLimitData = raw
    ? JSON.parse(raw)
    : { count: 0, resetAt: now + 3600000 };

  if (now > data.resetAt) {
    data = { count: 0, resetAt: now + 3600000 };
  }

  if (data.count >= 20) {
    const minutesLeft = Math.ceil((data.resetAt - now) / 60000);
    return { allowed: false, minutesLeft };
  }

  data.count++;
  if (typeof window !== "undefined")
    localStorage.setItem(key, JSON.stringify(data));
  return { allowed: true, minutesLeft: 0 };
}

// ---------------------------------------------------------------------------
// SSE stream parser helper
// ---------------------------------------------------------------------------

async function parseSSEStream(
  response: Response,
  onText: (fullText: string) => void
): Promise<string> {
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let fullText = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value);
    const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));
    for (const line of lines) {
      const data = line.slice(6);
      if (data === "[DONE]") break;
      try {
        const parsed = JSON.parse(data);
        if (parsed.text) {
          fullText += parsed.text;
          onText(fullText);
        }
      } catch {
        // skip malformed lines
      }
    }
  }

  return fullText;
}

// ---------------------------------------------------------------------------
// Type definitions
// ---------------------------------------------------------------------------

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number; // epoch ms for serialization
  followUps?: string[];
}

interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  messages: ChatMessage[];
}

interface UserProfile {
  nome?: string;
  cargo?: string;
  empresa?: string;
}

// ---------------------------------------------------------------------------
// Predefined Q&A knowledge base (expanded to 20 topics)
// ---------------------------------------------------------------------------

const QA_PAIRS: {
  keywords: string[];
  answer: string;
  followUps: string[];
  relatedPages: { label: string; href: string }[];
}[] = [
  {
    keywords: [
      "authorization",
      "rate",
      "improve",
      "auth",
      "feature",
      "autorização",
      "taxa",
      "melhorar",
      "aprovação",
    ],
    answer: `Diversas features podem melhorar significativamente sua taxa de autorização:

1. **Network Tokens** (+3-5%): Substituem PANs por tokens de rede. Permanecem válidos após reemissão do cartão e são reconhecidos pelos emissores como de menor risco.

2. **Smart Routing** (+2-4%): Roteia dinamicamente cada transação para o adquirente com maior probabilidade de aprovação com base em BIN, emissor, valor e dados históricos.

3. **Account Updater** (+2-3%): Atualiza automaticamente credenciais de cartões expirados ou reemitidos para que pagamentos recorrentes não sejam recusados.

4. **Retry Logic** (+1-2%): Retenta automaticamente soft declines com timing e seleção de adquirente otimizados.

5. **Cascade Routing** (+1-2%): Quando um adquirente primário recusa, a transação é enviada a um adquirente secundário.

Para o maior impacto, comece com Network Tokens e Smart Routing -- são complementares e entregam o maior ROI combinado.`,
    followUps: [
      "Como implementar Network Tokens?",
      "Qual a diferença entre Smart Routing e Cascade Routing?",
      "Quais métricas devo acompanhar para auth rate?",
    ],
    relatedPages: [
      { label: "Base de Features", href: "/knowledge/features" },
      { label: "Simulador de Pagamentos", href: "/simulation/payment-simulator" },
    ],
  },
  {
    keywords: ["3d", "secure", "3ds", "how", "work", "como", "funciona", "autenticação"],
    answer: `**3D Secure (3DS)** é um protocolo de autenticação do titular do cartão criado pela Visa ("Verified by Visa") e adotado por todas as principais bandeiras.

**Como funciona o fluxo:**

1. O cliente insere os dados do cartão no checkout.
2. Seu gateway envia uma requisição de autenticação ao Directory Server da bandeira.
3. O Directory Server roteia para o Access Control Server (ACS) do emissor.
4. O ACS determina se autenticação adicional é necessária (OTP, biometria, push) com base em sinais de risco.
5. Se o cliente passa na autenticação, o emissor retorna uma prova criptográfica (CAVV).

**3DS2 vs 3DS1:**
- 3DS2 suporta fluxos frictionless (autenticação baseada em risco)
- 3DS2 passa 10x mais dados ao emissor
- 3DS1 sempre aciona redirect e challenge, aumentando abandono

**Impacto nas métricas:**
- Taxa de fraude: -2 a -4%
- Taxa de chargeback: -2 a -3% (liability shift)
- Taxa de conversão: -1 a -3% (fricção dos challenges)

Dica: Use 3DS baseado em risco ("Dynamic 3DS") para desafiar apenas transações de alto risco.`,
    followUps: [
      "Qual o impacto do 3DS na conversão?",
      "Como implementar Dynamic 3DS?",
      "O que é liability shift?",
    ],
    relatedPages: [
      { label: "Base de Features", href: "/knowledge/features" },
    ],
  },
  {
    keywords: [
      "cross-border",
      "cross",
      "border",
      "failing",
      "international",
      "pagamentos",
      "falhando",
      "internacionais",
    ],
    answer: `Falhas em pagamentos cross-border geralmente têm várias causas raiz:

**1. Recusas do Emissor (mais comum)**
- Muitos emissores têm regras mais rígidas para transações cross-border.
- **Solução:** Use adquirentes locais na região do cliente.

**2. Incompatibilidade de Moeda**
- Apresentar preço em moeda inesperada aumenta recusas.
- **Solução:** Implemente Dynamic Currency Conversion (DCC) ou Multi-Currency Pricing.

**3. Métodos de Pagamento Locais Ausentes**
- Em muitas regiões, a penetração de cartões é baixa (Pix, iDEAL, GrabPay).
- **Solução:** Integre Alternative Payment Methods (APMs) para seus principais mercados.

**4. Bloqueios Regulatórios (SCA/PSD2)**
- Emissores europeus podem recusar transações sem Strong Customer Authentication.
- **Solução:** Implemente 3D Secure 2 com tratamento de isenções.

**5. Roteamento de Rede**
- Algumas redes roteiam transações cross-border por caminhos subótimos.
- **Solução:** Smart Routing com lógica baseada em BIN.

**Ganhos rápidos:** Adicione adquirência local nos seus 2-3 principais mercados, habilite 3DS2 e integre 1-2 APMs chave por região.`,
    followUps: [
      "Quais APMs são mais importantes no Brasil?",
      "Como funciona Dynamic Currency Conversion?",
      "O que é SCA/PSD2?",
    ],
    relatedPages: [
      { label: "Mapa de Pagamentos", href: "/explore/payments-map" },
      { label: "Simulador", href: "/simulation/payment-simulator" },
    ],
  },
  {
    keywords: [
      "network",
      "token",
      "tokenization",
      "what",
      "why",
      "tokens",
      "devo",
      "tokenização",
    ],
    answer: `**Network Tokens** são tokens emitidos pela bandeira do cartão (Visa, Mastercard) que substituem o PAN real para um par específico de merchant-cartão.

**Diferenças dos tokens de PSP/gateway:**
- Tokens de PSP são proprietários e funcionam apenas dentro daquele PSP.
- Network tokens são emitidos pela bandeira, reconhecidos por toda a cadeia.

**Benefícios:**

| Benefício | Detalhes |
|-----------|----------|
| Maiores taxas de auth | Emissores consideram network tokens mais confiáveis (+3-5%) |
| Auto-atualização | Cartão reemitido = token atualizado automaticamente |
| Menos fraude | Tokens são restritos ao domínio |
| Menor interchange | Algumas bandeiras oferecem interchange reduzido |

**Como funcionam:**
1. Você solicita um token ao TSP da bandeira usando o PAN.
2. O TSP retorna token + criptograma para seu merchant ID.
3. Você armazena o token no lugar do PAN.
4. A bandeira faz de-tokenização na autorização.

Network tokens são a base para Account Updater, Apple Pay/Google Pay e billing recorrente.`,
    followUps: [
      "Como migrar de tokens de PSP para Network Tokens?",
      "Qual o impacto na taxa de autorização?",
      "Network Tokens funcionam com recorrência?",
    ],
    relatedPages: [
      { label: "Base de Features", href: "/knowledge/features" },
    ],
  },
  {
    keywords: [
      "chargeback",
      "reduce",
      "dispute",
      "prevention",
      "reduzir",
      "chargebacks",
      "disputas",
    ],
    answer: `Reduzir chargebacks requer uma estratégia multicamadas:

**Camada de Prevenção:**
1. **Fraud Scoring** -- ML para bloquear transações fraudulentas antes da autorização.
2. **3D Secure** -- Transfere responsabilidade para o emissor.
3. **Descriptors claros** -- Muitos chargebacks de "friendly fraud" ocorrem por cobranças não reconhecidas.
4. **Confirmação de entrega** -- Sempre capture rastreamento e confirmação.

**Camada de Detecção:**
5. **Velocity Checks** -- Sinalizam compras incomumente frequentes.
6. **Device Fingerprinting** -- Detecta dispositivos suspeitos.
7. **AVS** -- Verifica endereço de cobrança vs. emissor.

**Camada de Resposta:**
8. **Alertas (Ethoca/Verifi)** -- Notificações de disputas antes do chargeback.
9. **Compelling Evidence 3.0** -- Resposta automática a certas disputas.

**Benchmarks alvo:** Mantenha abaixo de 0.65% (Visa) e 1.0% (Mastercard).`,
    followUps: [
      "O que é Compelling Evidence 3.0?",
      "Como funciona o Ethoca?",
      "Qual a diferença entre friendly fraud e true fraud?",
    ],
    relatedPages: [
      { label: "Base de Features", href: "/knowledge/features" },
    ],
  },
  {
    keywords: [
      "smart",
      "routing",
      "route",
      "acquirer",
      "how",
      "roteamento",
      "inteligente",
    ],
    answer: `**Smart Routing** seleciona dinamicamente o adquirente ideal para cada transação em tempo real.

**Como funciona:**
1. O engine avalia: BIN do cartão, emissor, país, valor, moeda, MCC, taxa de aprovação histórica, uptime e custo.
2. Pontua cada adquirente disponível e roteia para o de maior probabilidade de aprovação.

**Abordagens:**
- **Baseada em regras:** "Rotear cartões brasileiros para adquirente local." Simples mas limitada.
- **Baseada em score:** Pondera fatores e escolhe o maior score. Mais flexível.
- **Baseada em ML:** Modelos preditivos com dados históricos. Mais eficaz, requer dados.

**Resultados típicos:**
- +2 a 4% na taxa de autorização
- -15 a 30% de redução de custo
- +1 a 2% na conversão

**Pré-requisitos:** Pelo menos 2 adquirentes (idealmente 3+) e uma camada de orquestração.`,
    followUps: [
      "Quantos adquirentes preciso para Smart Routing?",
      "Qual a diferença entre Smart Routing e Cascade?",
      "Como medir o impacto do Smart Routing?",
    ],
    relatedPages: [
      { label: "Simulador", href: "/simulation/payment-simulator" },
      { label: "Mapa de Pagamentos", href: "/explore/payments-map" },
    ],
  },
  {
    keywords: ["pix", "brasil", "brazil", "instant", "payment", "pagamento", "instantâneo"],
    answer: `**Pix** é o sistema de pagamentos instantâneos do Banco Central do Brasil, lançado em 2020.

**Características chave:**
- Transferências em tempo real, 24/7/365
- Liquidação em até 10 segundos
- Custo zero para pessoas físicas
- Suporta QR codes estáticos e dinâmicos

**Para merchants:**
- Custo significativamente menor que cartões (0.01-0.22% vs 2-3%)
- Liquidação instantânea (vs D+30 para cartões)
- Sem chargebacks (transações irrevogáveis)
- Alta conversão (sem necessidade de dados de cartão)

**Pix como alternativa a cartões:**
O Pix já ultrapassou cartões em volume de transações no Brasil. Para e-commerce brasileiro, oferecer Pix no checkout é essencial.

**Integrações:** A maioria dos PSPs brasileiros já oferece Pix via API. O fluxo típico gera um QR code no checkout que o cliente escaneia com seu app bancário.`,
    followUps: [
      "Qual o custo do Pix para merchants?",
      "Como integrar Pix via API?",
      "Pix suporta recorrência?",
    ],
    relatedPages: [
      { label: "Mapa de Pagamentos", href: "/explore/payments-map" },
    ],
  },
  {
    keywords: ["interchange", "fee", "mdr", "taxa", "custo", "cost", "pricing"],
    answer: `**Interchange** é a taxa paga pelo adquirente ao emissor em cada transação com cartão. É o maior componente do custo de processamento.

**Estrutura de custos:**
- **Interchange** (70-80% do custo total): Definida pelas bandeiras, varia por tipo de cartão, MCC e região.
- **Scheme fee** (5-10%): Taxa cobrada pela bandeira (Visa, Mastercard).
- **Acquirer markup** (10-20%): Margem do adquirente.

**Fatores que influenciam interchange:**
- Tipo de cartão (débito < crédito < corporate < premium)
- Presença do cartão (card-present < card-not-present)
- Região (doméstico < cross-border)
- MCC do merchant

**Como reduzir custos:**
1. **Level 2/3 data** -- Enviar dados adicionais pode reduzir interchange em 0.5-1%.
2. **Network Tokens** -- Algumas bandeiras oferecem interchange menor.
3. **Smart Routing** -- Escolher adquirente com melhor custo-benefício.
4. **Interchange++ pricing** -- Modelo transparente de precificação.`,
    followUps: [
      "O que é Interchange++ pricing?",
      "Como enviar dados Level 2/3?",
      "Qual a diferença de interchange entre débito e crédito?",
    ],
    relatedPages: [
      { label: "Calculadora MDR", href: "/tools/mdr-calculator" },
    ],
  },
  {
    keywords: ["fraud", "fraude", "prevention", "prevenção", "detection", "detecção", "score"],
    answer: `**Prevenção de Fraude** em pagamentos envolve múltiplas camadas de defesa:

**Camada 1 -- Pré-autorização:**
- **Fraud Scoring (ML):** Modelos treinados com dados históricos pontuam cada transação em tempo real.
- **Regras de velocidade:** Limites de tentativas por cartão/IP/dispositivo em janela de tempo.
- **Device Fingerprinting:** Identifica dispositivos únicos e detecta anomalias.

**Camada 2 -- Autenticação:**
- **3D Secure 2:** Autenticação baseada em risco do titular do cartão.
- **AVS/CVV:** Verificação de endereço e código de segurança.

**Camada 3 -- Pós-autorização:**
- **Manual Review:** Análise humana para transações de risco médio.
- **Alertas de chargeback:** Ethoca/Verifi para disputas precoces.

**Métricas chave:**
- Taxa de fraude: meta < 0.1% do GMV
- Taxa de falsos positivos: meta < 2% (insult rate)
- Taxa de chargeback: meta < 0.5%

O equilíbrio entre segurança e conversão é crucial -- bloqueios excessivos custam mais que a fraude em si.`,
    followUps: [
      "Como funciona fraud scoring com ML?",
      "Qual a taxa aceitável de falsos positivos?",
      "Devo usar 3DS para todas as transações?",
    ],
    relatedPages: [
      { label: "Base de Features", href: "/knowledge/features" },
    ],
  },
  {
    keywords: ["recurring", "recorrência", "subscription", "assinatura", "billing", "cobrança"],
    answer: `**Pagamentos Recorrentes** requerem estratégias específicas para maximizar retenção:

**Desafios principais:**
- Cartões expirados causando involuntary churn
- Fundos insuficientes em datas fixas de cobrança
- Regulamentações de consentimento (PSD2/SCA)

**Features essenciais:**
1. **Account Updater:** Atualiza cartões automaticamente (+2-3% de retenção).
2. **Network Tokens:** Token permanece válido após reemissão (+3-5%).
3. **Smart Retry:** Retenta cobranças falhadas em dias/horários otimizados (+1-2%).
4. **Dunning Management:** Comunicação proativa para atualização de dados de pagamento.

**Melhores práticas:**
- Cobrar em dias variados (não sempre dia 1)
- Implementar retry inteligente (não apenas repetir imediatamente)
- Oferecer múltiplos métodos de pagamento como fallback
- Enviar notificações antes de cobranças e após falhas

**Métricas alvo:**
- Taxa de sucesso na primeira tentativa: > 95%
- Taxa de recuperação após retry: > 60%
- Involuntary churn rate: < 2% ao mês`,
    followUps: [
      "Como funciona Smart Retry para recorrência?",
      "Qual o impacto do Account Updater?",
      "O que é dunning management?",
    ],
    relatedPages: [
      { label: "Base de Features", href: "/knowledge/features" },
      { label: "Simulador", href: "/simulation/payment-simulator" },
    ],
  },
  {
    keywords: ["psp", "gateway", "processador", "processor", "adquirente", "acquirer", "escolher"],
    answer: `**Como escolher um PSP/Gateway de Pagamento:**

**Critérios de avaliação:**

| Critério | O que avaliar |
|----------|---------------|
| Cobertura | Países, moedas e métodos de pagamento suportados |
| Features | Tokenização, smart routing, retry, fraud scoring |
| Custos | Modelo de pricing (flat vs interchange++) |
| Integração | Qualidade da API, SDKs, documentação |
| Suporte | SLA, suporte técnico, account management |

**Modelos de arquitetura:**
1. **PSP único:** Simples, menor custo operacional, mas single point of failure.
2. **Multi-PSP:** Redundância e otimização, mas maior complexidade.
3. **Orquestrador + múltiplos PSPs:** Máxima flexibilidade, smart routing, failover.

**Red flags:**
- Pricing opaco sem breakdown de interchange
- Sem suporte a 3DS2
- Lock-in de tokens (sem portabilidade)
- Sem relatórios de performance detalhados

Recomendação: comece com 1 PSP principal e adicione um segundo quando atingir volume que justifique a complexidade operacional.`,
    followUps: [
      "Qual a diferença entre PSP e gateway?",
      "Quando devo adicionar um segundo adquirente?",
      "O que é um orquestrador de pagamentos?",
    ],
    relatedPages: [
      { label: "Mapa de Pagamentos", href: "/explore/payments-map" },
    ],
  },
  {
    keywords: ["pci", "compliance", "dss", "segurança", "security", "dados", "cartão"],
    answer: `**PCI DSS** (Payment Card Industry Data Security Standard) define requisitos para proteger dados de cartão.

**Níveis de compliance:**
- **Nível 1:** > 6M transações/ano (auditoria anual completa)
- **Nível 2:** 1-6M transações/ano (SAQ + scan trimestral)
- **Nível 3:** 20K-1M transações e-commerce/ano (SAQ)
- **Nível 4:** < 20K transações e-commerce/ano (SAQ)

**Como reduzir escopo PCI:**
1. **Tokenização:** Armazene tokens em vez de PANs. Elimina a maior parte do escopo.
2. **Hosted Payment Page:** Redirecione para página do PSP para coleta de dados.
3. **iFrame/JS SDK:** Dados de cartão nunca tocam seus servidores.
4. **Network Tokens:** Substitua PANs por tokens da bandeira.

**Ponto chave:** A maioria dos merchants modernos deve buscar **SAQ A** (menor escopo possível) usando hosted fields ou redirect do PSP. Nunca armazene PANs em seus próprios servidores a menos que absolutamente necessário.`,
    followUps: [
      "Qual SAQ preciso preencher?",
      "Tokenização elimina PCI compliance?",
      "O que são hosted payment fields?",
    ],
    relatedPages: [
      { label: "Base de Features", href: "/knowledge/features" },
    ],
  },
  {
    keywords: ["reconciliation", "reconciliação", "settlement", "liquidação", "report", "relatório"],
    answer: `**Reconciliação de Pagamentos** garante que cada transação é contabilizada corretamente.

**Tipos de reconciliação:**
1. **Transacional:** Cada transação no seu sistema = registro no PSP/adquirente.
2. **Financeira:** Valores liquidados na conta bancária = somatório de transações.
3. **Fee reconciliation:** Taxas cobradas = taxas esperadas pelo contrato.

**Desafios comuns:**
- Diferenças de timezone entre sistemas
- Chargebacks e estornos alterando valores após liquidação
- Múltiplos adquirentes com formatos de relatório diferentes
- Conversão cambial em cross-border

**Melhores práticas:**
- Automatize a reconciliação com regras configuráveis
- Defina tolerância para diferenças de centavos (arredondamento)
- Reconcilie diariamente para detectar discrepâncias cedo
- Mantenha audit trail completo

**Métricas alvo:**
- Taxa de auto-reconciliação: > 98%
- Tempo de resolução de exceções: < 24h`,
    followUps: [
      "Como automatizar reconciliação?",
      "Qual a frequência ideal de reconciliação?",
      "Como lidar com diferenças cambiais?",
    ],
    relatedPages: [
      { label: "Base de Features", href: "/knowledge/features" },
    ],
  },
  {
    keywords: ["refund", "estorno", "reembolso", "void", "cancel", "cancelar", "reversal"],
    answer: `**Estornos e Reembolsos** são operações distintas com impactos diferentes:

**Void (Cancelamento):**
- Cancela uma autorização antes da captura
- Sem custo de interchange (a transação nunca foi liquidada)
- Janela limitada (geralmente até o batch settlement)

**Refund (Reembolso):**
- Devolve fundos de uma transação já capturada
- Interchange geralmente **não** é devolvido pelo emissor
- Pode ser parcial ou total

**Melhores práticas:**
1. **Priorize voids sobre refunds** -- sempre cancele antes da captura quando possível.
2. **Automatize refunds** -- integre com sistema de atendimento para agilizar.
3. **Refunds parciais** -- ofereça quando aplicável para reter parte da receita.
4. **Tracking** -- monitore taxa de refund por produto/categoria para detectar problemas.

**Métricas:**
- Taxa de refund saudável: < 5% do GMV
- Tempo médio de processamento: < 5 dias úteis
- Refund como prevenção de chargeback: cada refund proativo previne ~$25 em custos de disputa.`,
    followUps: [
      "Qual a diferença entre void e refund?",
      "Interchange é devolvido em refunds?",
      "Como prevenir chargebacks com refunds proativos?",
    ],
    relatedPages: [
      { label: "Base de Features", href: "/knowledge/features" },
    ],
  },
  {
    keywords: ["wallet", "carteira", "apple", "google", "pay", "digital", "contactless"],
    answer: `**Carteiras Digitais** (Apple Pay, Google Pay, Samsung Pay) usam network tokens no nível do dispositivo.

**Como funcionam:**
1. Cartão é provisionado na carteira via TSP da bandeira
2. Device-level token armazenado no secure element do dispositivo
3. A cada transação, um criptograma dinâmico é gerado
4. Bandeira faz de-tokenização na autorização

**Benefícios para merchants:**
- **Taxa de auth superior:** +5-7% vs card-not-present convencional
- **Menor fraude:** Criptograma dinâmico por transação + biometria
- **Melhor UX:** Checkout com 1 toque/clique
- **Sem PCI scope:** Dados de cartão nunca tocam seu servidor

**Implementação:**
- Integre via Apple Pay JS / Google Pay API
- Ou use SDK do seu PSP que já abstrai ambas
- Suporte desktop (Safari/Chrome) e mobile

**Adoção:** Carteiras digitais já representam ~30% das transações e-commerce globais e crescem rapidamente.`,
    followUps: [
      "Como integrar Apple Pay no meu checkout?",
      "Apple Pay funciona em todos os navegadores?",
      "Qual o impacto de wallets na conversão?",
    ],
    relatedPages: [
      { label: "Base de Features", href: "/knowledge/features" },
    ],
  },
  {
    keywords: ["conversion", "conversão", "checkout", "abandono", "cart", "carrinho", "otimizar"],
    answer: `**Otimização de Conversão no Checkout** pode aumentar receita em 10-30%:

**Principais causas de abandono:**
1. Checkout longo demais (> 3 etapas)
2. Falta de métodos de pagamento preferidos
3. Erros de validação confusos
4. Medo de segurança
5. Custos inesperados

**Features de alto impacto:**
- **One-click checkout** (+5-8%): Salvar dados de pagamento para compras futuras.
- **Wallets (Apple/Google Pay)** (+3-5%): Checkout sem digitação.
- **Smart payment method ordering** (+1-2%): Mostrar métodos mais usados primeiro.
- **Inline error handling** (+1-2%): Validação em tempo real dos campos.
- **Guest checkout** (+2-4%): Não forçar criação de conta.

**Métricas para acompanhar:**
- Taxa de conversão do checkout (meta: > 65%)
- Taxa de abandono por etapa
- Tempo médio de checkout (meta: < 2 minutos)
- Taxa de tentativa de pagamento falhada`,
    followUps: [
      "Como implementar one-click checkout?",
      "Quais métricas de checkout devo monitorar?",
      "Como reduzir abandono de carrinho?",
    ],
    relatedPages: [
      { label: "Simulador", href: "/simulation/payment-simulator" },
    ],
  },
  {
    keywords: ["webhook", "notification", "notificação", "event", "evento", "api", "integração"],
    answer: `**Webhooks de Pagamento** permitem receber notificações em tempo real de eventos.

**Eventos comuns:**
- \`payment.authorized\` -- Pagamento autorizado
- \`payment.captured\` -- Captura confirmada
- \`payment.declined\` -- Pagamento recusado
- \`payment.refunded\` -- Reembolso processado
- \`chargeback.created\` -- Nova disputa aberta

**Melhores práticas:**
1. **Idempotência:** Trate webhooks duplicados (use event ID para dedup).
2. **Verificação de assinatura:** Sempre valide HMAC/signature do webhook.
3. **Retry handling:** Retorne 2xx rapidamente; processe assincronamente.
4. **Ordem de eventos:** Não assuma ordem -- verifique timestamps.
5. **Dead letter queue:** Capture webhooks falhados para reprocessamento.

**Armadilhas comuns:**
- Não verificar assinatura (vulnerável a spoofing)
- Processamento síncrono bloqueante (causa timeouts)
- Não tratar duplicatas (double-processing)

**Monitoramento:** Acompanhe taxa de entrega, latência e falhas de processamento.`,
    followUps: [
      "Como verificar assinatura de webhooks?",
      "O que é idempotência em webhooks?",
      "Como lidar com webhooks fora de ordem?",
    ],
    relatedPages: [
      { label: "Base de Features", href: "/knowledge/features" },
    ],
  },
  {
    keywords: ["sca", "psd2", "europe", "europa", "regulation", "regulação", "strong", "customer"],
    answer: `**SCA (Strong Customer Authentication)** é um requisito do PSD2 na Europa.

**O que é SCA:**
Autenticação com pelo menos 2 de 3 fatores:
- **Conhecimento:** Senha, PIN
- **Posse:** Celular, token
- **Inerência:** Biometria (digital, facial)

**Quando é necessário:**
- Pagamentos online iniciados pelo cliente no EEA
- Transações card-present (já atendido por chip + PIN)

**Isenções disponíveis:**
- **Low value:** < EUR 30 (acumulado < EUR 100)
- **TRA (Transaction Risk Analysis):** Com base na taxa de fraude do acquirer
- **Recurring:** Apenas primeira transação precisa SCA
- **Merchant-initiated:** MIT não requer SCA
- **Whitelisted merchants:** Cliente pode adicionar merchant a lista de confiança

**Implementação prática:**
3DS2 é o mecanismo padrão para SCA online. Use isenções estrategicamente para reduzir fricção em transações de baixo risco.`,
    followUps: [
      "Quais isenções de SCA devo usar?",
      "SCA se aplica a transações recorrentes?",
      "Como funciona TRA (Transaction Risk Analysis)?",
    ],
    relatedPages: [
      { label: "Base de Features", href: "/knowledge/features" },
    ],
  },
  {
    keywords: ["bnpl", "buy", "now", "pay", "later", "parcelamento", "installment", "crediário"],
    answer: `**BNPL (Buy Now, Pay Later)** e parcelamento são formas de crédito no checkout.

**Modelos principais:**
1. **Pay in 4:** 4 parcelas quinzenais sem juros (Klarna, Afterpay)
2. **Parcelamento com juros:** 3-12x com juros (modelo brasileiro)
3. **Parcelamento sem juros:** Merchant absorve o custo (comum no Brasil)
4. **Crédito longo prazo:** 6-36 meses com financiadora

**Impacto no merchant:**
- **Conversão:** +20-30% em ticket médio
- **Custo:** 2-8% por transação (inclui risco de crédito)
- **Chargeback:** Responsabilidade geralmente do provedor BNPL

**No Brasil:**
O parcelamento no cartão é cultural -- 60-70% das compras online são parceladas. Oferecer parcelamento sem juros é praticamente obrigatório para e-commerce brasileiro.

**Considerações:**
- Avalie se o custo do parcelamento compensa o aumento de conversão
- BNPL providers assumem risco de crédito (você recebe à vista)
- Monitore taxa de inadimplência se oferecer crédito próprio`,
    followUps: [
      "Qual o custo de parcelamento sem juros?",
      "BNPL vale a pena para meu negócio?",
      "Como funciona parcelamento no cartão no Brasil?",
    ],
    relatedPages: [
      { label: "Calculadora MDR", href: "/tools/mdr-calculator" },
    ],
  },
  {
    keywords: ["data", "analytics", "dados", "análise", "dashboard", "monitoramento", "kpi", "metric"],
    answer: `**Métricas Essenciais de Pagamentos** que todo time deve monitorar:

**KPIs Primários:**
- **Authorization rate:** % de transações aprovadas (meta: > 85-90%)
- **Conversion rate:** % de checkouts completados (meta: > 65%)
- **Fraud rate:** % de fraude sobre GMV (meta: < 0.1%)
- **Chargeback rate:** % de disputas (meta: < 0.5%)
- **Cost per transaction:** Custo total de processamento

**KPIs Secundários:**
- **Retry success rate:** % de soft declines recuperados
- **Time to settlement:** D+ médio de liquidação
- **Refund rate:** % de reembolsos sobre vendas
- **APM adoption:** % de transações via métodos alternativos

**Segmentações importantes:**
- Por adquirente/PSP (comparar performance)
- Por bandeira (Visa vs Mastercard vs local)
- Por região/país (identificar problemas geográficos)
- Por tipo de transação (e-commerce vs recorrente)

**Frequência de review:**
- Diário: Auth rate, fraud alerts, uptime
- Semanal: Conversion funnel, cost analysis
- Mensal: Chargeback trends, PSP benchmarking`,
    followUps: [
      "Qual auth rate é considerado bom?",
      "Como segmentar métricas por adquirente?",
      "Quais alertas devo configurar?",
    ],
    relatedPages: [
      { label: "Simulador", href: "/simulation/payment-simulator" },
      { label: "Base de Features", href: "/knowledge/features" },
    ],
  },
];

/** Suggested questions displayed before the first message */
const SUGGESTED_QUESTIONS = [
  "Quais features melhoram a taxa de autorização?",
  "Como funciona o 3D Secure?",
  "Por que pagamentos cross-border falham?",
  "O que são network tokens?",
  "Como reduzir chargebacks?",
  "Como funciona Smart Routing?",
];

// ---------------------------------------------------------------------------
// Response matching logic (enhanced)
// ---------------------------------------------------------------------------

function findBestAnswer(
  query: string
): { answer: string; followUps: string[]; relatedPages: { label: string; href: string }[] } {
  const queryWords = query
    .toLowerCase()
    .replace(/[?.,!]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2);

  let bestScore = 0;
  let bestPair = QA_PAIRS[0];

  for (const pair of QA_PAIRS) {
    let score = 0;
    for (const kw of pair.keywords) {
      for (const w of queryWords) {
        if (w.includes(kw) || kw.includes(w)) {
          score += 1;
        }
        // Partial match bonus
        if (w.length > 3 && kw.length > 3 && (w.startsWith(kw.slice(0, 4)) || kw.startsWith(w.slice(0, 4)))) {
          score += 0.5;
        }
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestPair = pair;
    }
  }

  if (bestScore < 0.5) {
    return {
      answer: `Não encontrei uma resposta específica para essa pergunta. Aqui estão temas que posso ajudar:

- **Taxas de autorização** -- quais features melhoram aprovação
- **3D Secure** -- protocolos de autenticação
- **Pagamentos cross-border** -- diagnóstico de falhas internacionais
- **Network Tokens** -- estratégias de tokenização
- **Chargebacks** -- prevenção e redução de disputas
- **Smart Routing** -- orquestração de adquirentes
- **Pix** -- pagamentos instantâneos no Brasil
- **Interchange/MDR** -- custos de processamento
- **Prevenção de Fraude** -- scoring e detecção
- **Recorrência** -- billing e retry strategies

Tente reformular sua pergunta ou escolha um dos temas acima!`,
      followUps: [
        "Quais features melhoram a taxa de autorização?",
        "Como reduzir chargebacks?",
        "Como funciona o Smart Routing?",
      ],
      relatedPages: [
        { label: "Base de Features", href: "/knowledge/features" },
        { label: "Mapa de Pagamentos", href: "/explore/payments-map" },
      ],
    };
  }

  return {
    answer: bestPair.answer,
    followUps: bestPair.followUps,
    relatedPages: bestPair.relatedPages,
  };
}

// ---------------------------------------------------------------------------
// Chat history persistence
// ---------------------------------------------------------------------------

const HISTORY_KEY = "pks-chat-history";
const MAX_CONVERSATIONS = 20;

function loadConversations(): Conversation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveConversations(convs: Conversation[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    HISTORY_KEY,
    JSON.stringify(convs.slice(0, MAX_CONVERSATIONS))
  );
}

function loadProfile(): UserProfile {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem("pks-user");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

// ---------------------------------------------------------------------------
// ID generation
// ---------------------------------------------------------------------------

let messageCounter = 0;
function generateId(): string {
  return `msg-${Date.now()}-${++messageCounter}`;
}

function generateConvId(): string {
  return `conv-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// ---------------------------------------------------------------------------
// Simple markdown-to-JSX renderer
// ---------------------------------------------------------------------------

function renderMarkdown(text: string): React.ReactNode {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Table detection
    if (
      line.includes("|") &&
      i + 1 < lines.length &&
      /^\s*\|[-\s|:]+\|\s*$/.test(lines[i + 1])
    ) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].includes("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      const headerCells = tableLines[0]
        .split("|")
        .filter(Boolean)
        .map((c) => c.trim());
      const bodyRows = tableLines.slice(2);
      elements.push(
        <div key={`t-${i}`} style={{ margin: "8px 0", overflowX: "auto" }}>
          <table
            style={{
              borderCollapse: "collapse",
              width: "100%",
              fontSize: 13,
            }}
          >
            <thead>
              <tr>
                {headerCells.map((cell, ci) => (
                  <th
                    key={ci}
                    style={{
                      border: "1px solid var(--border)",
                      padding: "6px 10px",
                      background: "var(--surface-hover)",
                      textAlign: "left",
                      fontWeight: 600,
                    }}
                  >
                    {renderInline(cell)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bodyRows.map((row, ri) => {
                const cells = row
                  .split("|")
                  .filter(Boolean)
                  .map((c) => c.trim());
                return (
                  <tr key={ri}>
                    {cells.map((cell, ci) => (
                      <td
                        key={ci}
                        style={{
                          border: "1px solid var(--border)",
                          padding: "6px 10px",
                        }}
                      >
                        {renderInline(cell)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // Headers (## or ###)
    if (/^#{1,3}\s/.test(line.trim())) {
      const level = line.trim().match(/^(#+)/)?.[1].length ?? 2;
      const text_ = line.trim().replace(/^#+\s*/, "");
      elements.push(
        <div
          key={`h-${i}`}
          style={{
            fontWeight: 700,
            fontSize: level === 1 ? 18 : level === 2 ? 16 : 14,
            margin: "12px 0 4px 0",
          }}
        >
          {renderInline(text_)}
        </div>
      );
      i++;
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      elements.push(<div key={`s-${i}`} style={{ height: 8 }} />);
      i++;
      continue;
    }

    // Numbered list
    if (/^\d+\.\s/.test(line.trim())) {
      elements.push(
        <div
          key={`n-${i}`}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 8,
            margin: "3px 0 3px 8px",
          }}
        >
          <span style={{ color: "var(--text-muted)", flexShrink: 0 }}>
            {line.trim().match(/^(\d+\.)/)?.[1]}
          </span>
          <span>{renderInline(line.trim().replace(/^\d+\.\s*/, ""))}</span>
        </div>
      );
      i++;
      continue;
    }

    // Bullet list
    if (/^[-*]\s/.test(line.trim())) {
      elements.push(
        <div
          key={`b-${i}`}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 8,
            margin: "3px 0 3px 16px",
          }}
        >
          <span
            style={{
              marginTop: 7,
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "var(--text-muted)",
              flexShrink: 0,
            }}
          />
          <span>{renderInline(line.trim().replace(/^[-*]\s*/, ""))}</span>
        </div>
      );
      i++;
      continue;
    }

    // Regular line
    elements.push(
      <p key={`p-${i}`} style={{ margin: "3px 0" }}>
        {renderInline(line)}
      </p>
    );
    i++;
  }

  return <>{elements}</>;
}

/** Render inline markdown: **bold**, `code`, [links] */
function renderInline(text: string): React.ReactNode {
  // Split by bold, code, and link patterns
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} style={{ fontWeight: 600 }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          style={{
            background: "var(--surface-hover)",
            padding: "1px 5px",
            borderRadius: 4,
            fontSize: "0.9em",
            fontFamily: "monospace",
          }}
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a
          key={i}
          href={linkMatch[2]}
          style={{ color: "var(--primary)", textDecoration: "underline" }}
        >
          {linkMatch[1]}
        </a>
      );
    }
    return part;
  });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function PaymentsAdvisorPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isFallbackMode, setIsFallbackMode] = useState(false);
  const [rateLimitToast, setRateLimitToast] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load profile and conversations on mount
  useEffect(() => {
    setProfile(loadProfile());
    setConversations(loadConversations());
  }, []);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Rate limit toast dismiss
  useEffect(() => {
    if (rateLimitToast) {
      const timer = setTimeout(() => setRateLimitToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [rateLimitToast]);

  // Auto-resize textarea
  const autoResizeTextarea = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
  }, []);

  // Save current conversation to history
  const saveCurrentConversation = useCallback(
    (msgs: ChatMessage[]) => {
      if (msgs.length === 0) return;
      const title =
        msgs.find((m) => m.role === "user")?.content.slice(0, 60) || "Conversa";
      const convId = activeConvId || generateConvId();

      setConversations((prev) => {
        const existing = prev.filter((c) => c.id !== convId);
        const updated = [
          { id: convId, title, createdAt: Date.now(), messages: msgs },
          ...existing,
        ].slice(0, MAX_CONVERSATIONS);
        saveConversations(updated);
        return updated;
      });

      if (!activeConvId) setActiveConvId(convId);
    },
    [activeConvId]
  );

  /** Send message */
  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isTyping) return;

      const rateCheck = checkRateLimit();
      if (!rateCheck.allowed) {
        setRateLimitToast(
          `Limite de requisições atingido. Tente novamente em ${rateCheck.minutesLeft} minutos.`
        );
        return;
      }

      const userMessage: ChatMessage = {
        id: generateId(),
        role: "user",
        content: text.trim(),
        timestamp: Date.now(),
      };

      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setInput("");
      setIsTyping(true);

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }

      try {
        const response = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text.trim(),
            mode: "knowledge",
          }),
        });

        // Fallback to keyword-based if API not configured
        if (response.status === 503) {
          setIsFallbackMode(true);
          const result = findBestAnswer(text);
          const assistantMessage: ChatMessage = {
            id: generateId(),
            role: "assistant",
            content: result.answer,
            timestamp: Date.now(),
            followUps: result.followUps,
          };
          const updated = [...newMessages, assistantMessage];
          setMessages(updated);
          setIsTyping(false);
          saveCurrentConversation(updated);
          return;
        }

        if (!response.ok) {
          throw new Error("API error");
        }

        // SSE streaming
        setIsFallbackMode(false);
        const placeholderId = generateId();
        const withPlaceholder = [
          ...newMessages,
          {
            id: placeholderId,
            role: "assistant" as const,
            content: "",
            timestamp: Date.now(),
          },
        ];
        setMessages(withPlaceholder);

        const finalText = await parseSSEStream(response, (fullText) => {
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              content: fullText,
            };
            return updated;
          });
        });

        // Add follow-ups after streaming finishes
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          updated[updated.length - 1] = {
            ...last,
            content: finalText || last.content,
            followUps: [
              "Me conte mais sobre esse tema",
              "Como isso impacta a conversão?",
              "Quais são as melhores práticas?",
            ],
          };
          saveCurrentConversation(updated);
          return updated;
        });

        setIsTyping(false);
      } catch {
        setIsFallbackMode(true);
        const result = findBestAnswer(text);
        const assistantMessage: ChatMessage = {
          id: generateId(),
          role: "assistant",
          content: result.answer,
          timestamp: Date.now(),
          followUps: result.followUps,
        };
        const updated = [...newMessages, assistantMessage];
        setMessages(updated);
        setIsTyping(false);
        saveCurrentConversation(updated);
      }
    },
    [isTyping, messages, saveCurrentConversation]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const startNewConversation = () => {
    setMessages([]);
    setActiveConvId(null);
    setSidebarOpen(false);
  };

  const loadConversation = (conv: Conversation) => {
    setMessages(conv.messages);
    setActiveConvId(conv.id);
    setSidebarOpen(false);
  };

  const formatTime = (ts: number) => {
    return new Date(ts).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    });
  };

  // Get last assistant message for related pages
  const lastAssistantMsg = [...messages]
    .reverse()
    .find((m) => m.role === "assistant");

  return (
    <div
      style={{
        display: "flex",
        height: "calc(100vh - 48px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.3)",
            zIndex: 40,
          }}
        />
      )}

      {/* Sidebar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: sidebarOpen ? 0 : -320,
          width: 300,
          height: "100vh",
          background: "var(--surface)",
          borderRight: "1px solid var(--border)",
          zIndex: 50,
          transition: "left 0.2s ease",
          display: "flex",
          flexDirection: "column",
          padding: "16px 0",
        }}
      >
        <div
          style={{
            padding: "0 16px 16px 16px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <button
            onClick={startNewConversation}
            style={{
              width: "100%",
              padding: "10px 16px",
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: "var(--primary)",
              color: "#fff",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            + Nova conversa
          </button>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "8px 0",
          }}
        >
          {conversations.length === 0 && (
            <div
              style={{
                padding: "24px 16px",
                textAlign: "center",
                color: "var(--text-muted)",
                fontSize: 13,
              }}
            >
              Nenhuma conversa salva
            </div>
          )}
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => loadConversation(conv)}
              style={{
                width: "100%",
                padding: "10px 16px",
                textAlign: "left",
                border: "none",
                background:
                  conv.id === activeConvId
                    ? "var(--primary-bg)"
                    : "transparent",
                cursor: "pointer",
                borderLeft:
                  conv.id === activeConvId
                    ? "3px solid var(--primary)"
                    : "3px solid transparent",
                color: "var(--foreground)",
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {conv.title}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--text-muted)",
                  marginTop: 2,
                }}
              >
                {formatDate(conv.createdAt)} --{" "}
                {conv.messages.length} mensagens
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main chat area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          maxWidth: 900,
          margin: "0 auto",
          width: "100%",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "12px 16px",
            gap: 12,
            borderBottom: "1px solid var(--border)",
            flexShrink: 0,
          }}
        >
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Menu"
            style={{
              background: "none",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: "6px 10px",
              cursor: "pointer",
              color: "var(--foreground)",
              fontSize: 16,
            }}
          >
            &#9776;
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 16 }}>
              Consultor de Pagamentos
            </div>
            {profile.nome && (
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                Olá, {profile.nome}
                {profile.cargo ? ` — ${profile.cargo}` : ""}
                {profile.empresa ? ` na ${profile.empresa}` : ""}
              </div>
            )}
          </div>
          {isFallbackMode && messages.length > 0 && (
            <div
              style={{
                fontSize: 11,
                padding: "4px 10px",
                borderRadius: 9999,
                background: "var(--surface-hover)",
                border: "1px solid var(--border)",
                color: "var(--text-muted)",
                flexShrink: 0,
              }}
            >
              Modo offline
            </div>
          )}
        </div>

        {/* Rate limit toast */}
        {rateLimitToast && (
          <div
            style={{
              padding: "10px 16px",
              margin: "8px 16px 0 16px",
              borderRadius: 8,
              background: "var(--danger, #ef4444)",
              color: "#fff",
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            {rateLimitToast}
          </div>
        )}

        {/* Messages area */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px",
          }}
        >
          {/* Empty state */}
          {messages.length === 0 && !isTyping && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                minHeight: "60vh",
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 16,
                  background:
                    "linear-gradient(135deg, var(--primary), var(--primary-light))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  color: "#fff",
                  marginBottom: 16,
                }}
              >
                AI
              </div>
              <h3
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  marginBottom: 4,
                }}
              >
                Consultor de Pagamentos
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: "var(--text-muted)",
                  marginBottom: 32,
                  maxWidth: 480,
                  lineHeight: 1.5,
                }}
              >
                Pergunte sobre features de pagamento, taxas de autorização,
                prevenção de fraude, roteamento, integrações e mais.
              </p>

              {/* Suggested question cards */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                  gap: 10,
                  width: "100%",
                  maxWidth: 680,
                }}
              >
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    style={{
                      textAlign: "left",
                      padding: "14px 16px",
                      borderRadius: 10,
                      border: "1px solid var(--border)",
                      background: "var(--surface)",
                      cursor: "pointer",
                      color: "var(--foreground)",
                      fontSize: 13,
                      lineHeight: 1.4,
                      transition: "border-color 0.15s",
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg, idx) => (
            <div key={msg.id} style={{ marginBottom: 16 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    msg.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "85%",
                    borderRadius: 16,
                    padding: "12px 16px",
                    ...(msg.role === "user"
                      ? {
                          background: "var(--primary)",
                          color: "#fff",
                          borderBottomRightRadius: 6,
                        }
                      : {
                          background: "var(--surface)",
                          border: "1px solid var(--border)",
                          borderBottomLeftRadius: 6,
                        }),
                  }}
                >
                  {/* Role label */}
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      marginBottom: 4,
                      color:
                        msg.role === "user"
                          ? "rgba(255,255,255,0.7)"
                          : "var(--text-muted)",
                    }}
                  >
                    {msg.role === "user" ? "Você" : "Consultor de Pagamentos"}
                  </div>
                  {/* Content */}
                  <div style={{ fontSize: 14, lineHeight: 1.7 }}>
                    {msg.role === "assistant"
                      ? renderMarkdown(msg.content)
                      : msg.content}
                  </div>
                  {/* Timestamp */}
                  <div
                    style={{
                      fontSize: 10,
                      marginTop: 8,
                      color:
                        msg.role === "user"
                          ? "rgba(255,255,255,0.5)"
                          : "var(--text-muted)",
                    }}
                  >
                    {formatTime(msg.timestamp)}
                  </div>
                </div>
              </div>

              {/* Follow-up pills after last assistant message */}
              {msg.role === "assistant" &&
                idx === messages.length - 1 &&
                msg.followUps &&
                msg.followUps.length > 0 &&
                !isTyping && (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 8,
                      marginTop: 10,
                      paddingLeft: 4,
                    }}
                  >
                    {msg.followUps.slice(0, 3).map((fq) => (
                      <button
                        key={fq}
                        onClick={() => sendMessage(fq)}
                        style={{
                          padding: "6px 14px",
                          borderRadius: 9999,
                          border: "1px solid var(--border)",
                          background: "var(--surface)",
                          cursor: "pointer",
                          fontSize: 12,
                          color: "var(--primary)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {fq}
                      </button>
                    ))}
                  </div>
                )}
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 16,
                  borderBottomLeftRadius: 6,
                  padding: "12px 16px",
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    marginBottom: 4,
                    color: "var(--text-muted)",
                  }}
                >
                  Consultor de Pagamentos
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: 4 }}
                >
                  {[0, 150, 300].map((delay) => (
                    <span
                      key={delay}
                      style={{
                        width: 8,
                        height: 8,
                        background: "var(--text-muted)",
                        borderRadius: "50%",
                        animation: "bounce 1s infinite",
                        animationDelay: `${delay}ms`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Related pages after messages */}
        {messages.length > 0 && !isTyping && lastAssistantMsg && (
          <div
            style={{
              display: "flex",
              gap: 8,
              padding: "0 16px 8px 16px",
              flexShrink: 0,
              overflowX: "auto",
            }}
          >
            {[
              {
                label: "Base de Features",
                href: "/knowledge/features",
                icon: "📦",
              },
              {
                label: "Simulador",
                href: "/simulation/payment-simulator",
                icon: "⚡",
              },
              {
                label: "Mapa de Pagamentos",
                href: "/explore/payments-map",
                icon: "🗺️",
              },
            ].map((p) => (
              <Link
                key={p.href}
                href={p.href}
                style={{
                  padding: "6px 12px",
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                  background: "var(--surface)",
                  fontSize: 12,
                  color: "var(--foreground)",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  flexShrink: 0,
                }}
              >
                <span>{p.icon}</span>
                {p.label}
              </Link>
            ))}
          </div>
        )}

        {/* Input area */}
        <form
          onSubmit={handleSubmit}
          style={{
            borderTop: "1px solid var(--border)",
            padding: "12px 16px",
            display: "flex",
            alignItems: "flex-end",
            gap: 8,
            flexShrink: 0,
            background: "var(--background)",
          }}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              autoResizeTextarea();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Pergunte sobre pagamentos... (Ctrl+Enter para enviar)"
            disabled={isTyping}
            rows={1}
            style={{
              flex: 1,
              padding: "10px 16px",
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: "var(--surface)",
              outline: "none",
              color: "var(--foreground)",
              opacity: isTyping ? 0.5 : 1,
              fontSize: 14,
              lineHeight: 1.5,
              resize: "none",
              fontFamily: "inherit",
              minHeight: 42,
              maxHeight: 160,
            }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            style={{
              padding: "10px 20px",
              borderRadius: 10,
              border: "none",
              background:
                "linear-gradient(135deg, var(--primary), var(--primary-light))",
              color: "#fff",
              cursor:
                !input.trim() || isTyping ? "not-allowed" : "pointer",
              opacity: !input.trim() || isTyping ? 0.5 : 1,
              fontSize: 14,
              fontWeight: 500,
              flexShrink: 0,
              height: 42,
            }}
          >
            Enviar
          </button>
        </form>
      </div>

      {/* Bounce animation keyframes */}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}
