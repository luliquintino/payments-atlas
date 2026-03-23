"use client";

import { useState } from "react";
import Link from "next/link";
import { getQuizForPage } from "@/data/quizzes";
import PageQuiz from "@/components/ui/PageQuiz";
import { useGameProgress } from "@/hooks/useGameProgress";

const sectionStyle: React.CSSProperties = { padding: "1.5rem", borderRadius: 12, border: "1px solid var(--border)", background: "var(--surface)", marginBottom: "1.25rem" };
const headingStyle: React.CSSProperties = { fontSize: "1.125rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" };
const paragraphStyle: React.CSSProperties = { fontSize: "0.9rem", lineHeight: 1.7, color: "var(--text-secondary)", marginBottom: "0.75rem" };
const subheadingStyle: React.CSSProperties = { fontSize: "0.95rem", fontWeight: 600, color: "var(--foreground)", marginBottom: "0.5rem", marginTop: "1rem" };
const tableWrapperStyle: React.CSSProperties = { overflowX: "auto", marginTop: "0.75rem", marginBottom: "0.75rem" };
const tableStyle: React.CSSProperties = { width: "100%", borderCollapse: "collapse", fontSize: "0.8125rem" };
const thStyle: React.CSSProperties = { padding: "0.625rem 0.75rem", textAlign: "left", fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-secondary)", borderBottom: "2px solid var(--border)", background: "var(--surface)" };
const tdStyle: React.CSSProperties = { padding: "0.625rem 0.75rem", borderBottom: "1px solid var(--border)", color: "var(--foreground)", verticalAlign: "top" };
const highlightBoxStyle: React.CSSProperties = { padding: "1rem 1.25rem", borderRadius: 10, border: "1px solid rgba(59,130,246,0.25)", background: "rgba(59,130,246,0.06)", marginTop: "0.75rem", marginBottom: "0.75rem" };
const codeBlockStyle: React.CSSProperties = { background: "var(--background)", border: "1px solid var(--border)", borderRadius: 8, padding: "1rem", fontSize: "0.8rem", fontFamily: "monospace", overflowX: "auto", whiteSpace: "pre", color: "var(--foreground)", lineHeight: 1.6, marginTop: "0.75rem", marginBottom: "0.75rem" };
const pillarCardStyle: React.CSSProperties = { padding: "1rem 1.25rem", borderRadius: 10, border: "1px solid var(--border)", background: "var(--background)", marginBottom: "0.75rem" };
const tagStyle: React.CSSProperties = { display: "inline-block", padding: "0.2rem 0.5rem", borderRadius: 6, fontSize: "0.7rem", fontWeight: 600, background: "var(--primary-bg)", color: "var(--primary)", marginRight: "0.375rem", marginBottom: "0.25rem" };

interface Section { id: string; title: string; icon: string; content: React.ReactNode; }

export default function EventArchitecturePage() {
  const quiz = getQuizForPage("/knowledge/event-architecture");
  const { recordQuiz } = useGameProgress();
  const [quizCompleted, setQuizCompleted] = useState(false);

  const sections: Section[] = [
    {
      id: "por-que-event-driven",
      title: "Por que Event-Driven para Pagamentos",
      icon: "1",
      content: (
        <>
          <p style={paragraphStyle}>
            Pagamentos sao naturalmente event-based. Uma transacao nao e uma operacao atomica — e uma sequencia
            de eventos: authorized → captured → settled → funded → disputed → resolved. Cada evento muda o estado
            do pagamento e pode disparar acoes em multiplos sistemas (contabilidade, risk, notificacao, compliance).
          </p>
          <p style={paragraphStyle}>
            Arquiteturas sincronas (request/response) forçam acoplamento temporal: todos os sistemas precisam
            estar disponiveis no mesmo instante. Em pagamentos, onde envolve terminal → acquirer → network → issuer,
            essa dependencia e fragil. Event-driven permite desacoplamento temporal e espacial: cada componente
            processa eventos no seu ritmo, com retry automatico e resiliencia a falhas parciais.
          </p>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Beneficios concretos em pagamentos
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Desacoplamento entre autorizacao (sync, latencia critica) e settlement (async, batch toleravel).
              Audit trail nativo — cada evento e um registro imutavel. Extensibilidade: adicionar um novo consumer
              (ex: fraud scoring) nao requer mudar o producer. Resiliencia: se o sistema de notificacao cair,
              autorizacoes continuam funcionando.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "arquitetura-eventos",
      title: "Arquitetura de Eventos",
      icon: "2",
      content: (
        <>
          <p style={paragraphStyle}>
            Uma arquitetura event-driven tem tres componentes fundamentais: producers (geram eventos),
            brokers (transportam e armazenam eventos) e consumers (processam eventos). A escolha do broker
            define as garantias de delivery, ordering, throughput e latencia.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Broker</th>
                  <th style={thStyle}>Ordering</th>
                  <th style={thStyle}>Delivery</th>
                  <th style={thStyle}>Throughput</th>
                  <th style={thStyle}>Uso em Pagamentos</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Apache Kafka</td>
                  <td style={tdStyle}>Por particao</td>
                  <td style={tdStyle}>At-least-once (exactly-once com txn)</td>
                  <td style={tdStyle}>Milhoes/seg</td>
                  <td style={tdStyle}>Event sourcing, ledger, audit trail, analytics</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>RabbitMQ</td>
                  <td style={tdStyle}>Por fila (FIFO)</td>
                  <td style={tdStyle}>At-least-once / at-most-once</td>
                  <td style={tdStyle}>Dezenas de milhares/seg</td>
                  <td style={tdStyle}>Notificacoes, webhooks, task queues</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>AWS SQS</td>
                  <td style={tdStyle}>FIFO (com FIFO queue)</td>
                  <td style={tdStyle}>At-least-once</td>
                  <td style={tdStyle}>Milhares/seg (standard ilimitado)</td>
                  <td style={tdStyle}>Desacoplamento, batch processing, dead letters</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>AWS SNS + SQS</td>
                  <td style={tdStyle}>Sem garantia (SNS)</td>
                  <td style={tdStyle}>At-least-once</td>
                  <td style={tdStyle}>Alto</td>
                  <td style={tdStyle}>Fan-out de eventos para multiplos consumers</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Google Pub/Sub</td>
                  <td style={tdStyle}>Por chave de ordering</td>
                  <td style={tdStyle}>At-least-once</td>
                  <td style={tdStyle}>Muito alto</td>
                  <td style={tdStyle}>Streaming analytics, data pipelines</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={codeBlockStyle}>{`Arquitetura tipica de pagamento event-driven:

[API Gateway] → [Authorization Service] → publish("payment.authorized")
                                                  |
                    +-----------------------------+----------------------------+
                    |                             |                            |
            [Ledger Service]            [Notification Svc]           [Fraud Scoring]
            consume & update            consume & notify             consume & score
                    |
              publish("ledger.entry.created")
                    |
            [Settlement Service]
            consume & batch`}</div>
        </>
      ),
    },
    {
      id: "event-sourcing",
      title: "Event Sourcing para Pagamentos",
      icon: "3",
      content: (
        <>
          <p style={paragraphStyle}>
            Event Sourcing e o padrao onde o estado de uma entidade e reconstruido a partir de uma sequencia
            de eventos, em vez de armazenar apenas o estado atual. Para pagamentos, isso e transformador:
            o ledger (razao contabil) torna-se naturalmente um event log imutavel.
          </p>
          <p style={paragraphStyle}>
            Em vez de atualizar um registro &ldquo;payment.status = settled&rdquo;, voce armazena cada evento:
            PaymentCreated → PaymentAuthorized → PaymentCaptured → PaymentSettled. O estado atual e uma
            projecao (fold) desses eventos. Qualquer auditoria pode reconstruir o estado em qualquer ponto
            no tempo.
          </p>
          <div style={codeBlockStyle}>{`// Event Store para um pagamento
[
  { eventId: "evt_001", type: "PaymentCreated",    ts: "2024-01-15T10:00:00Z",
    data: { amount: 150.00, currency: "BRL", merchantId: "m_abc" } },
  { eventId: "evt_002", type: "PaymentAuthorized", ts: "2024-01-15T10:00:02Z",
    data: { authCode: "A12345", acquirerId: "acq_xyz" } },
  { eventId: "evt_003", type: "PaymentCaptured",   ts: "2024-01-15T23:00:00Z",
    data: { capturedAmount: 150.00 } },
  { eventId: "evt_004", type: "PaymentSettled",     ts: "2024-01-17T06:00:00Z",
    data: { settlementId: "stl_789", netAmount: 145.50, fee: 4.50 } }
]

// Estado reconstruido (projecao):
{ status: "settled", amount: 150.00, netAmount: 145.50, fee: 4.50 }`}</div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Beneficios para compliance e auditoria
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Event sourcing fornece audit trail completo e imutavel por design. Reguladores (BCB, PCI) exigem
              rastreabilidade de transacoes — com event sourcing, cada mudanca de estado e um evento com timestamp,
              actor e dados. Replay de eventos permite debug de problemas em producao e reconstrucao de cenarios.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "cqrs",
      title: "CQRS — Command Query Responsibility Segregation",
      icon: "4",
      content: (
        <>
          <p style={paragraphStyle}>
            CQRS separa o modelo de escrita (commands) do modelo de leitura (queries). Em pagamentos, isso resolve
            um problema fundamental: o modelo otimizado para processar transacoes (normalizado, consistent, event-sourced)
            e diferente do modelo otimizado para consultas (denormalizado, fast, search-optimized).
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Aspecto</th>
                  <th style={thStyle}>Write Model (Command)</th>
                  <th style={thStyle}>Read Model (Query)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Proposito</td>
                  <td style={tdStyle}>Processar transacoes, garantir consistencia</td>
                  <td style={tdStyle}>Servir consultas rapidas, dashboards, relatorios</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Storage</td>
                  <td style={tdStyle}>Event store (Kafka, EventStoreDB, DynamoDB)</td>
                  <td style={tdStyle}>Read-optimized (Elasticsearch, PostgreSQL views, Redis)</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Consistencia</td>
                  <td style={tdStyle}>Strong consistency (per-aggregate)</td>
                  <td style={tdStyle}>Eventually consistent (lag de ms a segundos)</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Escala</td>
                  <td style={tdStyle}>Escala vertical (fewer writes, complex logic)</td>
                  <td style={tdStyle}>Escala horizontal (many reads, simple queries)</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Exemplo</td>
                  <td style={tdStyle}>POST /payments (autorizar pagamento)</td>
                  <td style={tdStyle}>GET /payments?merchant=X&date=2024-01 (listar)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style={paragraphStyle}>
            O trade-off principal e eventual consistency: apos um command ser processado, o read model pode
            levar alguns milissegundos a segundos para refletir a mudanca. Para pagamentos, isso e geralmente
            aceitavel — o portador nao precisa ver o settlement em tempo real, mas precisa ver a autorizacao
            instantaneamente (que e sync). O truque e saber quais operacoes exigem strong consistency (auth)
            e quais toleram eventual consistency (relatorios, dashboards).
          </p>
        </>
      ),
    },
    {
      id: "padroes-mensageria",
      title: "Padroes de Mensageria",
      icon: "5",
      content: (
        <>
          <p style={paragraphStyle}>
            Diferentes padroes de comunicacao sao usados para diferentes cenarios em pagamentos.
            A escolha do padrao afeta acoplamento, escalabilidade e complexidade operacional.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              { name: "Pub/Sub (Publish-Subscribe)", emoji: "📢", desc: "Producer publica evento em um topico; multiplos consumers recebem independentemente. Ideal para fan-out: um evento 'payment.authorized' dispara notificacao, fraud check, ledger update e analytics simultaneamente.", use: "Eventos de transacao, notificacoes, analytics" },
              { name: "Point-to-Point (Queue)", emoji: "📬", desc: "Mensagem enviada para uma fila; exatamente um consumer processa. Ideal para tasks que devem ser processadas uma unica vez. Suporta load balancing natural entre consumers.", use: "Settlement batches, reconciliation tasks, retries" },
              { name: "Fan-Out", emoji: "🌊", desc: "Um evento dispara processamento em multiplos servicos diferentes. SNS → multiplas SQS queues. Cada fila pode ter consumer groups independentes com velocidades diferentes.", use: "Evento de disputa dispara: notificacao merchant, ajuste de saldo, report regulatorio" },
              { name: "Request-Reply (via messaging)", emoji: "↩️", desc: "Producer envia request como mensagem e espera reply em fila dedicada. Combina desacoplamento com semantica sync. Correlation ID vincula request e response.", use: "Consultas a issuer via messaging, autorizacao async" },
            ].map((item) => (
              <div key={item.name} style={pillarCardStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "1.25rem" }}>{item.emoji}</span>
                  <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--foreground)" }}>{item.name}</span>
                </div>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "0.375rem" }}>{item.desc}</p>
                <p style={{ fontSize: "0.8rem", color: "var(--foreground)" }}><strong>Uso tipico:</strong> {item.use}</p>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      id: "saga-pattern",
      title: "Saga Pattern",
      icon: "6",
      content: (
        <>
          <p style={paragraphStyle}>
            O Saga Pattern gerencia transacoes distribuidas que abrangem multiplos servicos. Em pagamentos,
            um fluxo como auth → capture → settle envolve servicos diferentes, cada um com seu banco de dados.
            Nao e possivel usar uma transacao ACID tradicional. Sagas dividem a operacao em passos locais,
            cada um com uma compensating transaction (rollback) caso um passo falhe.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Tipo</th>
                  <th style={thStyle}>Orquestrada</th>
                  <th style={thStyle}>Coreografada</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Coordenacao</td>
                  <td style={tdStyle}>Orquestrador central envia commands para cada servico</td>
                  <td style={tdStyle}>Cada servico escuta eventos e decide o proximo passo</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Acoplamento</td>
                  <td style={tdStyle}>Servicos acoplados ao orquestrador</td>
                  <td style={tdStyle}>Servicos acoplados via eventos (mais desacoplado)</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Visibilidade</td>
                  <td style={tdStyle}>Facil de rastrear — fluxo centralizado</td>
                  <td style={tdStyle}>Dificil de rastrear — fluxo distribuido</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Complexidade</td>
                  <td style={tdStyle}>Orquestrador pode ficar complexo</td>
                  <td style={tdStyle}>Cada servico tem logica de compensacao</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Uso</td>
                  <td style={tdStyle}>Fluxos complexos com muitos passos e regras de negocio</td>
                  <td style={tdStyle}>Fluxos simples com poucos servicos</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={codeBlockStyle}>{`Saga Orquestrada — Fluxo de pagamento:

Orchestrator:
  1. Command → AuthService.authorize(payment)
     Success → proceed
     Failure → ABORT (no compensation needed)

  2. Command → FraudService.screen(payment)
     Success → proceed
     Failure → COMPENSATE: AuthService.void(payment)

  3. Command → LedgerService.capture(payment)
     Success → proceed
     Failure → COMPENSATE: AuthService.void(payment)

  4. Command → SettlementService.settle(payment)
     Success → COMPLETE
     Failure → COMPENSATE: LedgerService.reverseCapture()
                         → AuthService.void(payment)`}</div>
        </>
      ),
    },
    {
      id: "idempotency",
      title: "Idempotency em Event Systems",
      icon: "7",
      content: (
        <>
          <p style={paragraphStyle}>
            Em sistemas distribuidos, mensagens podem ser entregues mais de uma vez (network retry, consumer crash
            antes do ACK, rebalancing de particoes Kafka). Se processar uma mensagem de captura duas vezes resulta
            em captura dupla, o merchant perde dinheiro. Idempotency garante que processar a mesma mensagem N vezes
            produz o mesmo resultado que processar uma vez.
          </p>
          <p style={subheadingStyle}>Estrategias de idempotency</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {[
              { strategy: "Idempotency Key", desc: "Cada request/evento carrega um ID unico (UUID). O consumer verifica se ja processou esse ID antes de executar. Armazenamento: Redis (TTL de 24-72h) ou tabela SQL com unique constraint." },
              { strategy: "Deduplication no Broker", desc: "Kafka: enable.idempotence=true no producer garante deduplication no topico. SQS FIFO: MessageDeduplicationId impede mensagens duplicadas na fila (janela de 5 minutos)." },
              { strategy: "Conditional Writes", desc: "Operacoes no banco usam WHERE clauses que verificam estado esperado: UPDATE payments SET status='captured' WHERE id=X AND status='authorized'. Se ja capturado, o update nao executa." },
              { strategy: "Outbox Pattern", desc: "Em vez de publicar evento diretamente no broker, grava na tabela outbox atomicamente com o business update. Um relay process le o outbox e publica no broker. Garante exactly-once semantics entre DB e broker." },
            ].map((item) => (
              <div key={item.strategy} style={pillarCardStyle}>
                <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--foreground)", marginBottom: "0.25rem" }}>{item.strategy}</p>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
          <div style={codeBlockStyle}>{`// Exemplo: Idempotency com Redis
async function processCapture(event: PaymentEvent) {
  const idempotencyKey = \`capture:\${event.paymentId}:\${event.eventId}\`;

  // Check if already processed
  const exists = await redis.get(idempotencyKey);
  if (exists) {
    logger.info("Duplicate event, skipping", { eventId: event.eventId });
    return; // ACK the message, but don't process
  }

  // Process the capture
  await ledger.recordCapture(event.paymentId, event.amount);

  // Mark as processed (TTL 72h)
  await redis.set(idempotencyKey, "processed", "EX", 259200);
}`}</div>
        </>
      ),
    },
    {
      id: "dead-letter-queues",
      title: "Dead Letter Queues",
      icon: "8",
      content: (
        <>
          <p style={paragraphStyle}>
            Dead Letter Queues (DLQs) sao filas especiais para mensagens que falharam apos multiplas tentativas
            de processamento. Em pagamentos, uma mensagem na DLQ pode significar: transacao presa, settlement
            nao executado, notificacao nao enviada. Monitorar DLQs e critico — cada mensagem ali pode representar
            dinheiro parado.
          </p>
          <p style={subheadingStyle}>Retry Strategies</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Estrategia</th>
                  <th style={thStyle}>Como funciona</th>
                  <th style={thStyle}>Quando usar</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Fixed Delay</td>
                  <td style={tdStyle}>Retry a cada N segundos (ex: 5s, 5s, 5s)</td>
                  <td style={tdStyle}>Falhas previsiveis com recovery rapido</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Exponential Backoff</td>
                  <td style={tdStyle}>Delay cresce exponencialmente (1s, 2s, 4s, 8s, 16s...)</td>
                  <td style={tdStyle}>Rate limiting, servico sobrecarregado</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Exponential + Jitter</td>
                  <td style={tdStyle}>Backoff + componente aleatorio para evitar thundering herd</td>
                  <td style={tdStyle}>Padrao recomendado para a maioria dos cenarios</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>Circuit Breaker</td>
                  <td style={tdStyle}>Apos N falhas, para de tentar por um periodo (open state)</td>
                  <td style={tdStyle}>Dependencia externa caiu completamente</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>Poison Messages</p>
          <p style={paragraphStyle}>
            Poison messages sao mensagens que sempre falham, independente de quantos retries. Exemplo: JSON
            malformado, campo obrigatorio ausente, versao de schema incompativel. Sem DLQ, uma poison message
            bloqueia o consumer indefinidamente (se for ordered queue). A DLQ isola essas mensagens para
            investigacao manual enquanto o fluxo normal continua.
          </p>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Alerting para DLQs em pagamentos
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Regra de ouro: DLQ vazia = sistema saudavel. Qualquer mensagem na DLQ deve gerar alerta imediato
              (PagerDuty, OpsGenie). Metricas essenciais: DLQ depth (quantas mensagens), DLQ age (quanto tempo
              a mais antiga esta esperando), DLQ rate (mensagens/minuto entrando). Dashboard com essas metricas
              e obrigatorio para operacoes de pagamento.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "observabilidade",
      title: "Observabilidade em Sistemas Event-Driven",
      icon: "9",
      content: (
        <>
          <p style={paragraphStyle}>
            Observabilidade e o calcanhar de Aquiles de arquiteturas event-driven. Quando um pagamento falha
            em um sistema sync, o stack trace mostra o problema. Em um sistema async, o evento pode ter passado
            por 5 servicos antes de falhar — e cada servico tem seus proprios logs. Sem observabilidade adequada,
            debugging e como procurar agulha em palheiro.
          </p>
          <p style={subheadingStyle}>Pilares de Observabilidade</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              { name: "Distributed Tracing", emoji: "🔍", desc: "OpenTelemetry / Jaeger / Datadog APM. Cada transacao recebe um trace_id propagado por todos os servicos. Visualizacao de waterfall mostra o caminho completo do evento e onde ocorreu latencia ou falha." },
              { name: "Correlation IDs", emoji: "🔗", desc: "Cada pagamento recebe um payment_id que e incluido em todos os eventos, logs e mensagens relacionados. Permite buscar 'tudo sobre este pagamento' em qualquer sistema — do terminal ao settlement." },
              { name: "Structured Logging", emoji: "📝", desc: "Logs em formato JSON com campos padronizados (traceId, paymentId, eventType, serviceName). Ingestao em ELK/Datadog/Splunk para busca centralizada. Nada de logs em texto livre sem contexto." },
              { name: "Event Replay", emoji: "⏪", desc: "Kafka retém eventos por periodo configuravel (7 dias, 30 dias). Em caso de bug, e possivel reprocessar eventos passados com a versao corrigida do consumer. Essencial para correcao de erros contabeis." },
              { name: "Health Metrics", emoji: "📊", desc: "Consumer lag (Kafka), queue depth (SQS), processing rate, error rate, p99 latency. Dashboards em Grafana/Datadog com alertas para anomalias. SLIs: tempo de processamento por evento, taxa de erro por consumer." },
            ].map((item) => (
              <div key={item.name} style={pillarCardStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "1.25rem" }}>{item.emoji}</span>
                  <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--foreground)" }}>{item.name}</span>
                </div>
                <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
          <div style={codeBlockStyle}>{`// Structured log entry para evento de pagamento
{
  "timestamp": "2024-01-15T10:00:02.345Z",
  "level": "info",
  "service": "authorization-service",
  "traceId": "abc123def456",
  "spanId": "span_789",
  "paymentId": "pay_001",
  "eventType": "payment.authorized",
  "merchantId": "m_abc",
  "amount": 150.00,
  "currency": "BRL",
  "authCode": "A12345",
  "latencyMs": 245,
  "acquirer": "cielo",
  "cardBrand": "visa"
}`}</div>
        </>
      ),
    },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <header className="page-header animate-fade-in">
        <h1 className="page-title" style={{ marginBottom: "0.75rem" }}>Event-Driven Architecture para Pagamentos</h1>
        <p className="page-description">
          Guia completo sobre arquitetura orientada a eventos aplicada a pagamentos: event sourcing, CQRS,
          saga pattern, idempotency, dead letter queues e observabilidade em sistemas distribuidos.
        </p>
      </header>

      <div className="learning-objectives" style={{ marginBottom: "1.5rem" }}>
        <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--primary)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>O que voce vai aprender</p>
        <ul>
          <li>Por que pagamentos sao naturalmente event-driven e beneficios do desacoplamento</li>
          <li>Comparacao de brokers: Kafka vs RabbitMQ vs SQS para diferentes cenarios</li>
          <li>Event Sourcing como ledger imutavel e CQRS para separar leitura de escrita</li>
          <li>Saga Pattern (orquestrada vs coreografada) para transacoes distribuidas</li>
          <li>Estrategias de idempotency e deduplication para garantir exactly-once processing</li>
          <li>Dead letter queues, retry strategies e poison message handling</li>
          <li>Observabilidade: distributed tracing, correlation IDs e event replay</li>
        </ul>
      </div>

      <div className="animate-fade-in stagger-1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>9</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Secoes</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>5</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Brokers</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>4</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Padroes</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>5</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Pilares Obs.</div>
        </div>
      </div>

      {sections.map((section, idx) => (
        <div key={section.id} className={`animate-fade-in stagger-${Math.min(idx + 2, 5)}`} style={sectionStyle}>
          <h2 style={headingStyle}>
            <span style={{ minWidth: 28, height: 28, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 700, flexShrink: 0, background: "var(--primary)", color: "#fff", padding: "0 0.25rem" }}>{section.icon}</span>
            {section.title}
          </h2>
          {section.content}
        </div>
      ))}

      {quiz && !quizCompleted && (
        <div style={{ marginTop: "2.5rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem", color: "var(--foreground)" }}>Teste seu Conhecimento</h2>
          <PageQuiz questions={quiz.questions} onComplete={(correct, total, xpEarned) => { recordQuiz(quiz.pageRoute, correct, total, xpEarned); setQuizCompleted(true); }} />
        </div>
      )}

      <div style={{ ...sectionStyle, marginTop: "2rem" }}>
        <h2 style={headingStyle}>Paginas Relacionadas</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {[
            { name: "Webhook Patterns", href: "/knowledge/webhook-patterns" },
            { name: "HSM & Criptografia", href: "/knowledge/hsm-cryptography" },
            { name: "Operational Excellence", href: "/knowledge/operational-excellence" },
            { name: "Settlement & Clearing", href: "/knowledge/settlement-clearing" },
          ].map((link) => (
            <Link key={link.href} href={link.href} style={{ padding: "0.375rem 0.75rem", borderRadius: 8, border: "1px solid var(--border)", background: "var(--background)", color: "var(--primary)", fontSize: "0.825rem", fontWeight: 500, textDecoration: "none" }}>{link.name}</Link>
          ))}
        </div>
      </div>
    </div>
  );
}
