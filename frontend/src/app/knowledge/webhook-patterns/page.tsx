"use client";

import { useState } from "react";
import { getQuizForPage } from "@/data/quizzes";
import PageQuiz from "@/components/ui/PageQuiz";
import { useGameProgress } from "@/hooks/useGameProgress";

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

interface Section {
  id: string;
  title: string;
  icon: string;
  content: React.ReactNode;
}

const sectionStyle: React.CSSProperties = {
  padding: "1.5rem",
  borderRadius: 12,
  border: "1px solid var(--border)",
  background: "var(--surface)",
  marginBottom: "1.25rem",
};

const headingStyle: React.CSSProperties = {
  fontSize: "1.125rem",
  fontWeight: 700,
  color: "var(--foreground)",
  marginBottom: "0.75rem",
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
};

const paragraphStyle: React.CSSProperties = {
  fontSize: "0.9rem",
  lineHeight: 1.7,
  color: "var(--text-secondary)",
  marginBottom: "0.75rem",
};

const subheadingStyle: React.CSSProperties = {
  fontSize: "0.95rem",
  fontWeight: 600,
  color: "var(--foreground)",
  marginBottom: "0.5rem",
  marginTop: "1rem",
};

const tableWrapperStyle: React.CSSProperties = {
  overflowX: "auto",
  marginTop: "0.75rem",
  marginBottom: "0.75rem",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "0.8125rem",
};

const thStyle: React.CSSProperties = {
  padding: "0.625rem 0.75rem",
  textAlign: "left",
  fontWeight: 600,
  fontSize: "0.75rem",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  color: "var(--text-secondary)",
  borderBottom: "2px solid var(--border)",
  background: "var(--surface)",
};

const tdStyle: React.CSSProperties = {
  padding: "0.625rem 0.75rem",
  borderBottom: "1px solid var(--border)",
  color: "var(--foreground)",
  verticalAlign: "top",
};

const highlightBoxStyle: React.CSSProperties = {
  padding: "1rem 1.25rem",
  borderRadius: 10,
  border: "1px solid rgba(59,130,246,0.25)",
  background: "rgba(59,130,246,0.06)",
  marginTop: "0.75rem",
  marginBottom: "0.75rem",
};

const codeBlockStyle: React.CSSProperties = {
  padding: "1rem 1.25rem",
  borderRadius: 10,
  background: "#1e1e2e",
  border: "1px solid var(--border)",
  fontFamily: "monospace",
  fontSize: "0.8rem",
  color: "#cdd6f4",
  overflowX: "auto",
  marginTop: "0.75rem",
  marginBottom: "0.75rem",
  lineHeight: 1.6,
  whiteSpace: "pre",
};

const warningBoxStyle: React.CSSProperties = {
  padding: "1rem 1.25rem",
  borderRadius: 10,
  border: "1px solid rgba(239,68,68,0.25)",
  background: "rgba(239,68,68,0.06)",
  marginTop: "0.75rem",
  marginBottom: "0.75rem",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function WebhookPatternsPage() {
  const quiz = getQuizForPage("/knowledge/webhook-patterns");
  const { recordQuiz } = useGameProgress();
  const [quizCompleted, setQuizCompleted] = useState(false);

  const sections: Section[] = [
    {
      id: "arquitetura",
      title: "Arquitetura de Webhooks em Pagamentos",
      icon: "1",
      content: (
        <>
          <p style={paragraphStyle}>
            Webhooks sao o mecanismo primario de comunicacao assincrona entre payment processors
            e merchants. Quando um evento ocorre (pagamento autorizado, capturado, estornado), o
            PSP envia uma requisicao HTTP POST para um endpoint pre-configurado do merchant.
          </p>
          <p style={subheadingStyle}>Polling vs Push (Webhooks)</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Aspecto</th>
                  <th style={thStyle}>Polling</th>
                  <th style={thStyle}>Webhook (Push)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={tdStyle}>Latencia</td>
                  <td style={tdStyle}>Alta (intervalo do poll: 5s-60s)</td>
                  <td style={{ ...tdStyle, color: "#10b981", fontWeight: 600 }}>Baixa (near real-time, &lt;1s tipico)</td>
                </tr>
                <tr>
                  <td style={tdStyle}>Custo computacional</td>
                  <td style={tdStyle}>Alto (requests constantes, maioria sem novos dados)</td>
                  <td style={{ ...tdStyle, color: "#10b981" }}>Baixo (so recebe quando ha evento)</td>
                </tr>
                <tr>
                  <td style={tdStyle}>Confiabilidade</td>
                  <td style={{ ...tdStyle, color: "#10b981" }}>Alta (client controla)</td>
                  <td style={tdStyle}>Requer retry logic no sender e idempotency no receiver</td>
                </tr>
                <tr>
                  <td style={tdStyle}>Complexidade</td>
                  <td style={tdStyle}>Simples de implementar</td>
                  <td style={tdStyle}>Requer endpoint publico, signature verification, queuing</td>
                </tr>
                <tr>
                  <td style={tdStyle}>Uso em pagamentos</td>
                  <td style={tdStyle}>Fallback / reconciliacao</td>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Primario para notificacao de eventos</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>Tipos de Eventos em Pagamentos</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Evento</th>
                  <th style={thStyle}>Quando Ocorre</th>
                  <th style={thStyle}>Acao Tipica do Merchant</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>payment.authorized</td><td style={tdStyle}>Issuer aprovou a transacao</td><td style={tdStyle}>Reservar estoque, mostrar confirmacao ao cliente</td></tr>
                <tr><td style={tdStyle}>payment.captured</td><td style={tdStyle}>Fundos foram capturados (debitados do cardholder)</td><td style={tdStyle}>Faturar, iniciar fulfillment/envio</td></tr>
                <tr><td style={tdStyle}>payment.refused</td><td style={tdStyle}>Transacao recusada pelo issuer ou risk engine</td><td style={tdStyle}>Notificar cliente, oferecer metodo alternativo</td></tr>
                <tr><td style={tdStyle}>payment.refunded</td><td style={tdStyle}>Estorno processado com sucesso</td><td style={tdStyle}>Atualizar pedido, recolocar estoque, creditar cliente</td></tr>
                <tr><td style={tdStyle}>chargeback.created</td><td style={tdStyle}>Disputa aberta pelo cardholder</td><td style={tdStyle}>Iniciar fluxo de representment, coletar evidencias</td></tr>
                <tr><td style={tdStyle}>payout.completed</td><td style={tdStyle}>Liquidacao depositada na conta do merchant</td><td style={tdStyle}>Reconciliar com banking, confirmar recebimento</td></tr>
              </tbody>
            </table>
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Principio fundamental
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Webhooks sao notificacoes, nao fonte de verdade. Sempre trate o webhook como um
              &quot;trigger&quot; e faca uma chamada GET a API do PSP para confirmar o estado atual antes
              de tomar acoes criticas (como enviar mercadoria). Isso protege contra replay attacks
              e race conditions.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "reliability",
      title: "Reliability Patterns",
      icon: "2",
      content: (
        <>
          <p style={paragraphStyle}>
            A confiabilidade de webhooks e a responsabilidade compartilhada entre sender (PSP) e
            receiver (merchant). O sender garante at-least-once delivery. O receiver garante
            processamento idempotente e rapido.
          </p>
          <p style={subheadingStyle}>At-Least-Once Delivery</p>
          <p style={paragraphStyle}>
            Nenhum sistema de webhook garante exactly-once delivery. O padrao de mercado e
            at-least-once: o PSP vai tentar entregar ate receber um HTTP 2xx. Isso significa que
            o merchant PODE receber o mesmo evento multiplas vezes e precisa ser idempotente.
          </p>
          <p style={subheadingStyle}>Retry Strategy — Exponential Backoff</p>
          <div style={codeBlockStyle}>
{`Estrategia tipica de retry (Stripe, Adyen, PagSeguro):

Tentativa 1:  imediata
Tentativa 2:  5 minutos depois
Tentativa 3:  30 minutos depois
Tentativa 4:  2 horas depois
Tentativa 5:  8 horas depois
Tentativa 6:  24 horas depois
Tentativa 7:  48 horas depois
Tentativa 8:  72 horas depois (ultima)

Formula: delay = base_delay * 2^(attempt - 1) + jitter

O jitter (variacao aleatoria) evita thundering herd quando
muitos webhooks falharam ao mesmo tempo e retentam juntos.

Timeout tipico: 5-30 segundos. Se seu endpoint nao responde
com 2xx dentro do timeout, conta como falha.`}
          </div>
          <p style={subheadingStyle}>Dead Letter Queue (DLQ)</p>
          <p style={paragraphStyle}>
            Apos esgotar todas as tentativas de retry, o webhook vai para uma Dead Letter Queue.
            A maioria dos PSPs oferece um dashboard para visualizar e re-enviar webhooks na DLQ.
            No lado do merchant, implemente sua propria DLQ interna para webhooks que falharam
            no processamento (ex: database down).
          </p>
          <div style={codeBlockStyle}>
{`Arquitetura recomendada para o receiver:

                    ┌─────────────┐
  Webhook ──POST──→ │  Endpoint   │──→ Responde 200 IMEDIATAMENTE
                    │  (slim)     │
                    └──────┬──────┘
                           │ Enfileira evento
                           ▼
                    ┌─────────────┐
                    │    Queue    │  (SQS, RabbitMQ, Redis Streams)
                    │             │
                    └──────┬──────┘
                           │ Worker consome
                           ▼
                    ┌─────────────┐      ┌─────────────┐
                    │   Worker    │─ERR─→│     DLQ     │
                    │  (processa) │      │  (internal) │
                    └─────────────┘      └─────────────┘

REGRA DE OURO: O endpoint HTTP deve fazer APENAS:
1. Verificar signature
2. Enfileirar o payload
3. Responder 200 OK

Todo processamento pesado (DB writes, API calls, business logic)
acontece no worker. Isso garante response time < 500ms.`}
          </div>
        </>
      ),
    },
    {
      id: "idempotency",
      title: "Idempotency Deep Dive",
      icon: "3",
      content: (
        <>
          <p style={paragraphStyle}>
            Idempotencia e a propriedade que garante que processar o mesmo evento multiplas vezes
            produz o mesmo resultado que processa-lo uma unica vez. Em pagamentos, falta de
            idempotencia pode causar cobrancas duplicadas, estornos duplos ou status inconsistente.
          </p>
          <p style={subheadingStyle}>Estrategias de Idempotency Key</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Estrategia</th>
                  <th style={thStyle}>Key</th>
                  <th style={thStyle}>Pros</th>
                  <th style={thStyle}>Contras</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Event ID do PSP</td>
                  <td style={tdStyle}>event.id (ex: &quot;evt_1234abc&quot;)</td>
                  <td style={tdStyle}>Simples, garantido unico pelo PSP</td>
                  <td style={tdStyle}>Depende do PSP fornecer ID unico</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Composite Key</td>
                  <td style={tdStyle}>payment_id + event_type + timestamp</td>
                  <td style={tdStyle}>Funciona sem event ID do PSP</td>
                  <td style={tdStyle}>Timestamp pode variar em retries (usar created_at do evento, nao do recebimento)</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Hash do payload</td>
                  <td style={tdStyle}>SHA-256(canonical_payload)</td>
                  <td style={tdStyle}>Independe de IDs</td>
                  <td style={tdStyle}>Payloads identicos com timestamps diferentes geram hashes diferentes</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>Storage Pattern</p>
          <div style={codeBlockStyle}>
{`-- Tabela de idempotency (PostgreSQL)
CREATE TABLE webhook_events (
  idempotency_key  VARCHAR(255) PRIMARY KEY,
  event_type       VARCHAR(100) NOT NULL,
  payload          JSONB NOT NULL,
  status           VARCHAR(20) DEFAULT 'processing',
  -- processing | completed | failed
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  processed_at     TIMESTAMPTZ,
  attempts         INT DEFAULT 1
);

-- Index para cleanup de eventos antigos
CREATE INDEX idx_webhook_events_created
  ON webhook_events (created_at);

-- Fluxo no worker:
-- 1. INSERT com ON CONFLICT DO NOTHING
-- 2. Se inseriu (affected rows = 1), processe
-- 3. Se nao inseriu (duplicate), ignore ou verifique status
-- 4. Se status = 'failed', tente reprocessar

-- TTL: Limpe eventos com mais de 30-90 dias
-- para evitar crescimento indefinido da tabela`}
          </div>
          <p style={subheadingStyle}>Race Conditions</p>
          <div style={warningBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#ef4444", marginBottom: "0.25rem" }}>
              Cenario perigoso
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              O PSP envia payment.authorized e, 200ms depois, payment.captured. Se o worker
              processa captured antes de authorized (race condition em sistemas distribuidos),
              o estado final pode ficar incorreto. Solucao: use ordenacao por sequence number
              ou timestamp do evento (nao do recebimento), e implemente state machine que so
              permite transicoes validas (authorized → captured, nunca captured sem authorized).
            </p>
          </div>
        </>
      ),
    },
    {
      id: "event-sourcing",
      title: "Event Sourcing para Pagamentos",
      icon: "4",
      content: (
        <>
          <p style={paragraphStyle}>
            Event Sourcing e o padrao onde o estado de uma entidade (pagamento) e derivado de uma
            sequencia imutavel de eventos, ao inves de ser armazenado diretamente. Cada webhook
            recebido vira um evento no event store, e o estado atual e calculado via replay.
          </p>
          <p style={subheadingStyle}>Event Store</p>
          <div style={codeBlockStyle}>
{`-- Event Store (PostgreSQL)
CREATE TABLE payment_events (
  event_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id      VARCHAR(100) NOT NULL,
  event_type      VARCHAR(100) NOT NULL,
  event_data      JSONB NOT NULL,
  sequence_number BIGSERIAL,
  occurred_at     TIMESTAMPTZ NOT NULL,
  received_at     TIMESTAMPTZ DEFAULT NOW(),
  source          VARCHAR(50) NOT NULL  -- 'webhook', 'api', 'manual'
);

CREATE INDEX idx_payment_events_payment
  ON payment_events (payment_id, sequence_number);

-- Exemplo de eventos para um pagamento:
-- seq 1: payment.created     (merchant criou o payment intent)
-- seq 2: payment.authorized  (issuer aprovou)
-- seq 3: payment.captured    (fundos capturados)
-- seq 4: payment.settled     (liquidado para merchant)

-- Para saber o estado atual: replay todos os eventos do payment_id
-- em ordem de sequence_number`}
          </div>
          <p style={subheadingStyle}>Projections (Read Models)</p>
          <p style={paragraphStyle}>
            Fazer replay de todos os eventos a cada consulta e ineficiente. Projections sao views
            materializadas que sao atualizadas a cada novo evento. Exemplo: uma tabela
            &quot;payment_current_state&quot; que tem o ultimo estado de cada pagamento, atualizada por
            um projection handler que escuta novos eventos.
          </p>
          <p style={subheadingStyle}>CQRS (Command Query Responsibility Segregation)</p>
          <p style={paragraphStyle}>
            Combinado com event sourcing, CQRS separa o modelo de escrita (commands que geram
            eventos) do modelo de leitura (projections otimizadas para queries). Em pagamentos,
            isso permite ter um event store imutavel para auditoria e compliance, e projections
            rapidas para dashboards e APIs.
          </p>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Beneficio para compliance
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Event sourcing cria automaticamente uma audit trail completa e imutavel de todo o
              ciclo de vida de cada pagamento. Isso atende requisitos do PCI DSS (Req 10),
              SOX compliance, e facilita investigacao de disputas e chargebacks — voce pode
              fazer replay e ver exatamente o que aconteceu e em que ordem.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "signature-verification",
      title: "Verificacao de Assinatura",
      icon: "5",
      content: (
        <>
          <p style={paragraphStyle}>
            Verificar a assinatura do webhook e a primeira linha de defesa contra ataques. Sem
            verificacao, qualquer pessoa que descubra seu endpoint pode enviar payloads falsos
            simulando pagamentos aprovados.
          </p>
          <p style={subheadingStyle}>HMAC-SHA256 — Padrao de Mercado</p>
          <div style={codeBlockStyle}>
{`// Node.js — Verificacao de assinatura (padrao Stripe)
import crypto from 'crypto';

function verifyWebhookSignature(
  payload: string,       // raw body (string, NAO parsed JSON)
  signature: string,     // header: Stripe-Signature
  secret: string         // webhook signing secret
): boolean {
  // 1. Extrair timestamp e signature do header
  const elements = signature.split(',');
  const timestamp = elements
    .find(e => e.startsWith('t='))?.split('=')[1];
  const expectedSig = elements
    .find(e => e.startsWith('v1='))?.split('=')[1];

  if (!timestamp || !expectedSig) return false;

  // 2. Construir signed payload
  const signedPayload = timestamp + '.' + payload;

  // 3. Computar HMAC
  const computedSig = crypto
    .createHmac('sha256', secret)
    .update(signedPayload)
    .digest('hex');

  // 4. Comparacao timing-safe (previne timing attacks)
  return crypto.timingSafeEqual(
    Buffer.from(computedSig),
    Buffer.from(expectedSig)
  );
}

// IMPORTANTE: Use o raw body, nao o JSON parsed.
// Parsing e re-stringifying pode alterar a ordem
// das chaves ou whitespace, invalidando o HMAC.`}
          </div>
          <p style={subheadingStyle}>Prevencao de Replay Attack</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Tecnica</th>
                  <th style={thStyle}>Implementacao</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={tdStyle}>Timestamp validation</td>
                  <td style={tdStyle}>Rejeitar webhooks com timestamp mais antigo que 5 minutos. Previne que atacante capture e re-envie webhook valido.</td>
                </tr>
                <tr>
                  <td style={tdStyle}>Nonce / Event ID</td>
                  <td style={tdStyle}>Armazenar event IDs processados. Rejeitar IDs ja vistos. Complementa a idempotency key.</td>
                </tr>
                <tr>
                  <td style={tdStyle}>IP allowlisting</td>
                  <td style={tdStyle}>Aceitar webhooks apenas de IPs do PSP (Stripe, Adyen publicam suas ranges). Defesa adicional, nao substitui HMAC.</td>
                </tr>
                <tr>
                  <td style={tdStyle}>mTLS</td>
                  <td style={tdStyle}>Mutual TLS — PSP e merchant verificam certificados mutuamente. Mais seguro, mais complexo de operar.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={warningBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#ef4444", marginBottom: "0.25rem" }}>
              Vulnerabilidade real
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Em 2023, uma vulnerabilidade publica demonstrou que merchants usando string comparison
              simples (== ao inves de timing-safe compare) para verificar HMAC estavam vulneraveis
              a timing attacks. Um atacante podia descobrir o HMAC correto byte a byte medindo o
              tempo de resposta. Sempre use crypto.timingSafeEqual ou equivalente.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "monitoring",
      title: "Monitoramento e Alertas",
      icon: "6",
      content: (
        <>
          <p style={paragraphStyle}>
            Webhooks falham silenciosamente. Sem monitoramento ativo, voce pode perder horas ou
            dias de eventos antes de perceber. Um bom sistema de observabilidade para webhooks
            inclui metricas, dashboards e alertas automaticos.
          </p>
          <p style={subheadingStyle}>Metricas Criticas</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Metrica</th>
                  <th style={thStyle}>O que mede</th>
                  <th style={thStyle}>Alerta quando</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Delivery rate</td>
                  <td style={tdStyle}>% de webhooks entregues com sucesso (2xx) na primeira tentativa</td>
                  <td style={tdStyle}>&lt; 95% por 15 min</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Processing latency P99</td>
                  <td style={tdStyle}>Tempo entre recebimento e processamento completo (percentil 99)</td>
                  <td style={tdStyle}>&gt; 30s (endpoint), &gt; 5min (worker)</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Queue depth</td>
                  <td style={tdStyle}>Numero de webhooks na fila aguardando processamento</td>
                  <td style={tdStyle}>&gt; 1000 (growing trend)</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>DLQ count</td>
                  <td style={tdStyle}>Numero de webhooks na dead letter queue</td>
                  <td style={tdStyle}>&gt; 0 (qualquer evento na DLQ precisa de atencao)</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Signature failure rate</td>
                  <td style={tdStyle}>% de webhooks com assinatura invalida</td>
                  <td style={tdStyle}>&gt; 1% (pode indicar ataque ou key rotation issue)</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Event gap detection</td>
                  <td style={tdStyle}>Tempo desde o ultimo webhook recebido por event type</td>
                  <td style={tdStyle}>&gt; 30min sem payment events (possivel outage no PSP)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>Dashboard Minimo</p>
          <div style={codeBlockStyle}>
{`Dashboard de Webhooks (Grafana/Datadog):

+------------------------------------------+
|  Delivery Rate (15min rolling)           |
|  ████████████████████░░  96.2%           |
+------------------------------------------+
|  P99 Latency    |  Queue Depth           |
|  ██ 1.2s (OK)   |  ██ 47 msgs (OK)      |
+------------------------------------------+
|  DLQ Count      |  Sig Failures (24h)    |
|  🔴 3 events    |  ██ 0.02% (OK)        |
+------------------------------------------+
|  Events/min by Type (last 1h)            |
|  payment.authorized  ████████ 142        |
|  payment.captured    ██████ 98           |
|  payment.refunded    ██ 12               |
|  chargeback.created  █ 3                 |
+------------------------------------------+
|  Last Event Received                     |
|  payment.*    2 min ago  ✅              |
|  chargeback.* 45 min ago ⚠️              |
|  payout.*     3h ago     ⚠️              |
+------------------------------------------+`}
          </div>
        </>
      ),
    },
    {
      id: "payloads",
      title: "Payload Examples",
      icon: "7",
      content: (
        <>
          <p style={paragraphStyle}>
            Conhecer a estrutura dos payloads e essencial para implementar handlers corretos.
            Abaixo, exemplos completos dos eventos mais comuns em formato JSON.
          </p>
          <p style={subheadingStyle}>payment.authorized</p>
          <div style={codeBlockStyle}>
{`{
  "id": "evt_3f8a2b1c4d5e6f7g",
  "type": "payment.authorized",
  "created_at": "2025-01-15T14:32:10.000Z",
  "data": {
    "payment_id": "pay_9k8j7h6g5f4d3s2a",
    "amount": 15000,
    "currency": "BRL",
    "status": "authorized",
    "payment_method": {
      "type": "credit_card",
      "brand": "visa",
      "last_four": "4242",
      "exp_month": 12,
      "exp_year": 2027
    },
    "authorization_code": "A12345",
    "risk_score": 12,
    "three_ds": {
      "version": "2.2.0",
      "status": "authenticated",
      "eci": "05"
    },
    "metadata": {
      "order_id": "ORD-2025-001234",
      "customer_id": "cust_abc123"
    }
  }
}`}
          </div>
          <p style={subheadingStyle}>payment.captured</p>
          <div style={codeBlockStyle}>
{`{
  "id": "evt_7g6f5e4d3c2b1a0z",
  "type": "payment.captured",
  "created_at": "2025-01-15T14:32:45.000Z",
  "data": {
    "payment_id": "pay_9k8j7h6g5f4d3s2a",
    "amount": 15000,
    "captured_amount": 15000,
    "currency": "BRL",
    "status": "captured",
    "settlement_date": "2025-01-17",
    "net_amount": 14550,
    "fees": {
      "mdr": 375,
      "gateway_fee": 75
    }
  }
}`}
          </div>
          <p style={subheadingStyle}>payment.refunded</p>
          <div style={codeBlockStyle}>
{`{
  "id": "evt_r3f4n5d6e7v8e9n0",
  "type": "payment.refunded",
  "created_at": "2025-01-18T09:15:00.000Z",
  "data": {
    "payment_id": "pay_9k8j7h6g5f4d3s2a",
    "refund_id": "ref_x1y2z3w4v5u6t7s8",
    "amount": 15000,
    "refunded_amount": 15000,
    "currency": "BRL",
    "status": "refunded",
    "reason": "customer_request",
    "refund_type": "full"
  }
}`}
          </div>
          <p style={subheadingStyle}>chargeback.created</p>
          <div style={codeBlockStyle}>
{`{
  "id": "evt_cb_a1b2c3d4e5f6g7h8",
  "type": "chargeback.created",
  "created_at": "2025-02-01T11:00:00.000Z",
  "data": {
    "chargeback_id": "chg_m1n2o3p4q5r6s7t8",
    "payment_id": "pay_9k8j7h6g5f4d3s2a",
    "amount": 15000,
    "currency": "BRL",
    "reason_code": "10.4",
    "reason_description": "Other Fraud - Card Absent Environment",
    "network": "visa",
    "deadline": "2025-02-15T23:59:59.000Z",
    "status": "open",
    "representment_allowed": true
  }
}`}
          </div>
        </>
      ),
    },
    {
      id: "error-handling",
      title: "Error Handling e Recuperacao",
      icon: "8",
      content: (
        <>
          <p style={paragraphStyle}>
            Mesmo com a melhor arquitetura, webhooks vao falhar. O que diferencia um sistema
            resiliente de um fragil e como ele se recupera de falhas.
          </p>
          <p style={subheadingStyle}>Tipos de Falha e Resposta</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Falha</th>
                  <th style={thStyle}>Causa</th>
                  <th style={thStyle}>Acao</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={tdStyle}>Endpoint down</td>
                  <td style={tdStyle}>Deploy, crash, infra issue</td>
                  <td style={tdStyle}>PSP faz retry automatico. Garanta uptime &gt; 99.9% com redundancia.</td>
                </tr>
                <tr>
                  <td style={tdStyle}>Timeout (&gt; 30s)</td>
                  <td style={tdStyle}>Processamento sincrono pesado no endpoint</td>
                  <td style={tdStyle}>Mova logica para worker. Endpoint so enfileira e responde 200.</td>
                </tr>
                <tr>
                  <td style={tdStyle}>Signature invalida</td>
                  <td style={tdStyle}>Key rotation, bug no verification, ataque</td>
                  <td style={tdStyle}>Responda 401. Alerte equipe. Verifique se houve rotation de key no PSP.</td>
                </tr>
                <tr>
                  <td style={tdStyle}>Payload invalido</td>
                  <td style={tdStyle}>Schema change do PSP, campo novo/removido</td>
                  <td style={tdStyle}>Parse graceful (ignore unknown fields). Logue e alerte para investigacao.</td>
                </tr>
                <tr>
                  <td style={tdStyle}>Worker crash</td>
                  <td style={tdStyle}>Bug no business logic, dependency down</td>
                  <td style={tdStyle}>Message volta para queue (visibility timeout). Apos N falhas, vai para DLQ.</td>
                </tr>
                <tr>
                  <td style={tdStyle}>Out of order</td>
                  <td style={tdStyle}>Eventos chegam fora de sequencia</td>
                  <td style={tdStyle}>State machine valida transicoes. Buffer e reorder se necessario.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>Reconciliacao Manual (Catch-up)</p>
          <p style={paragraphStyle}>
            Quando webhooks sao perdidos (PSP bug, outage prolongada, migration), voce precisa de
            um mecanismo de catch-up. A maioria dos PSPs oferece endpoints de listagem de eventos
            com paginacao e filtros por data.
          </p>
          <div style={codeBlockStyle}>
{`// Catch-up pattern: buscar eventos perdidos via API

async function catchUpMissedWebhooks(
  since: Date,
  until: Date
) {
  let hasMore = true;
  let cursor: string | null = null;

  while (hasMore) {
    // 1. Buscar eventos via API do PSP
    const response = await psp.events.list({
      created_after: since.toISOString(),
      created_before: until.toISOString(),
      cursor: cursor,
      limit: 100,
    });

    for (const event of response.data) {
      // 2. Verificar se ja foi processado (idempotency)
      const exists = await db.webhookEvents.findOne({
        idempotency_key: event.id,
      });

      if (!exists) {
        // 3. Enfileirar para processamento
        await queue.publish({
          event_id: event.id,
          type: event.type,
          data: event.data,
          source: 'catch-up',  // marcar origem
        });
      }
    }

    cursor = response.next_cursor;
    hasMore = response.has_more;
  }
}

// Executar diariamente como safety net:
// catchUpMissedWebhooks(yesterday, now)`}
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Best practice: Belt and Suspenders
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Execute um job de reconciliacao diario que compara eventos recebidos via webhook com
              eventos listados via API do PSP. Qualquer discrepancia e automaticamente enfileirada
              para processamento. Isso garante que mesmo em caso de falha total de webhooks por
              horas, nenhum evento e perdido permanentemente.
            </p>
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <header className="page-header animate-fade-in">
        <h1 className="page-title" style={{ marginBottom: "0.75rem" }}>
          Webhook Reliability Patterns
        </h1>
        <p className="page-description">
          Padroes de confiabilidade para webhooks de pagamento: idempotencia, event sourcing,
          verificacao de assinatura, monitoramento e recuperacao de falhas.
        </p>
      </header>

      {/* Learning Objectives */}
      <div className="learning-objectives" style={{ marginBottom: "1.5rem" }}>
        <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--primary)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          O que voce vai aprender
        </p>
        <ul>
          <li>Arquitetura de webhooks: polling vs push, tipos de eventos, fluxo completo</li>
          <li>Padroes de confiabilidade: at-least-once, exponential backoff, dead letter queues</li>
          <li>Idempotencia: estrategias de key, storage patterns e race conditions</li>
          <li>Event sourcing e CQRS aplicados a pagamentos</li>
          <li>Verificacao de assinatura HMAC-SHA256 e prevencao de replay attacks</li>
        </ul>
      </div>

      {/* Stats */}
      <div className="animate-fade-in stagger-1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>8</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Secoes</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>4</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Payloads</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>6+</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Code Examples</div>
        </div>
      </div>

      {/* Content Sections */}
      {sections.map((section, idx) => (
        <div
          key={section.id}
          className={`animate-fade-in stagger-${Math.min(idx + 2, 5)}`}
          style={sectionStyle}
        >
          <h2 style={headingStyle}>
            <span style={{
              width: 28, height: 28, borderRadius: "50%",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.75rem", fontWeight: 700, flexShrink: 0,
              background: "var(--primary)", color: "#fff",
            }}>
              {section.icon}
            </span>
            {section.title}
          </h2>
          {section.content}
        </div>
      ))}

      {/* Quiz */}
      {quiz && !quizCompleted && (
        <div style={{ marginTop: "2.5rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem", color: "var(--foreground)" }}>
            Teste seu Conhecimento
          </h2>
          <PageQuiz
            questions={quiz.questions}
            onComplete={(correct, total, xpEarned) => {
              recordQuiz(quiz.pageRoute, correct, total, xpEarned);
              setQuizCompleted(true);
            }}
          />
        </div>
      )}
    </div>
  );
}
