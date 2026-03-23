"use client";

import { useState } from "react";
import { getQuizForPage } from "@/data/quizzes";
import PageQuiz from "@/components/ui/PageQuiz";
import { useGameProgress } from "@/hooks/useGameProgress";

// ---------------------------------------------------------------------------
// Section data
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
  background: "var(--surface)",
  border: "1px solid var(--border)",
  fontFamily: "monospace",
  fontSize: "0.8rem",
  lineHeight: 1.6,
  color: "var(--foreground)",
  marginTop: "0.75rem",
  marginBottom: "0.75rem",
  whiteSpace: "pre-wrap",
  overflowX: "auto",
};

const alertBoxStyle: React.CSSProperties = {
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

export default function OperationalExcellencePage() {
  const quiz = getQuizForPage("/knowledge/operational-excellence");
  const { recordQuiz } = useGameProgress();
  const [quizCompleted, setQuizCompleted] = useState(false);

  const sections: Section[] = [
    {
      id: "alta-disponibilidade",
      title: "Arquitetura de Alta Disponibilidade",
      icon: "1",
      content: (
        <>
          <p style={paragraphStyle}>
            Sistemas de pagamento exigem disponibilidade extrema: cada minuto de downtime significa
            transacoes perdidas, receita nao capturada e dano reputacional. A arquitetura deve eliminar
            pontos unicos de falha (SPOF) em todas as camadas: compute, storage, network e dependencias
            externas.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Padrao</th>
                  <th style={thStyle}>Descricao</th>
                  <th style={thStyle}>Tradeoff</th>
                  <th style={thStyle}>Uso em Pagamentos</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Active-Passive</td><td style={tdStyle}>Regiao primaria ativa, standby assume em caso de falha</td><td style={tdStyle}>Failover lento (minutos), dados podem defasar</td><td style={tdStyle}>Servicos menos criticos, batch processing</td></tr>
                <tr><td style={tdStyle}>Active-Active</td><td style={tdStyle}>Ambas regioes processam trafego simultaneamente</td><td style={tdStyle}>Complexidade de consistencia, split-brain</td><td style={tdStyle}>Payment gateway, autorizacao em tempo real</td></tr>
                <tr><td style={tdStyle}>Multi-Region</td><td style={tdStyle}>3+ regioes com consensus distribuido</td><td style={tdStyle}>Latencia de escrita, custo alto</td><td style={tdStyle}>Sistemas globais, cross-border payments</td></tr>
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>Database Replication para Pagamentos</p>
          <p style={paragraphStyle}>
            A escolha de replicacao de banco de dados e critica. Para pagamentos, a consistencia e
            geralmente mais importante que disponibilidade (CP no CAP theorem). Opcoes: replicacao
            sincrona (garante zero data loss, mas adiciona latencia), semi-sincrona (pelo menos 1
            replica confirma), assincrona (mais rapida, mas risco de perda em failover). Sistemas
            como CockroachDB e Spanner oferecem consistencia forte com distribuicao global.
          </p>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Regra de Ouro
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Em pagamentos, perder dados e pior que ficar indisponivel. Uma transacao processada mas
              perdida gera inconsistencia financeira muito mais custosa de resolver do que uma
              indisponibilidade temporaria. Sempre priorize durabilidade sobre latencia.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "disaster-recovery",
      title: "Disaster Recovery para Pagamentos",
      icon: "2",
      content: (
        <>
          <p style={paragraphStyle}>
            Disaster Recovery (DR) em pagamentos vai alem de restaurar sistemas: precisa garantir
            integridade financeira, consistencia de estado e capacidade de reconciliar todas as
            transacoes em voo durante o desastre.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Metrica</th>
                  <th style={thStyle}>Definicao</th>
                  <th style={thStyle}>Target Pagamentos</th>
                  <th style={thStyle}>Implicacao</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>RPO (Recovery Point Objective)</td><td style={tdStyle}>Maxima perda de dados aceitavel</td><td style={tdStyle}>0 (zero data loss)</td><td style={tdStyle}>Replicacao sincrona obrigatoria para ledger</td></tr>
                <tr><td style={tdStyle}>RTO (Recovery Time Objective)</td><td style={tdStyle}>Tempo maximo para restaurar servico</td><td style={tdStyle}>Menos de 5 minutos</td><td style={tdStyle}>Failover automatico, pre-provisioned infra</td></tr>
                <tr><td style={tdStyle}>MTTR (Mean Time to Recovery)</td><td style={tdStyle}>Tempo medio real de recuperacao</td><td style={tdStyle}>Menos de 2 minutos</td><td style={tdStyle}>Automacao total, runbooks testados</td></tr>
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>Estrategias de Failover</p>
          <p style={paragraphStyle}>
            1. Hot Standby: replica sincronizada pronta para assumir em segundos. Custo alto (2x infra),
            mas RTO proximo de zero. 2. Warm Standby: infraestrutura provisionada mas nao processando
            trafego. RTO de minutos. 3. Pilot Light: configuracao minima na DR region, scale-up sob
            demanda. RTO de 15-30 min. Para o path critico de autorizacao, hot standby e obrigatorio.
          </p>
          <p style={paragraphStyle}>
            DR testing deve ser regular e realista: simular perda total de uma regiao, nao apenas
            failover de um servico. Game Days trimestrais onde o DR e ativado em producao sao best
            practice. Documentar e medir: tempo real de deteccao, decisao de failover, execucao e
            validacao.
          </p>
        </>
      ),
    },
    {
      id: "capacity-planning",
      title: "Capacity Planning",
      icon: "3",
      content: (
        <>
          <p style={paragraphStyle}>
            Pagamentos tem picos previsíveis (Black Friday, datas de pagamento) e imprevisiveis (viral
            marketing, flash sales). Capacity planning precisa cobrir ambos cenarios com margem de seguranca.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Evento</th>
                  <th style={thStyle}>Multiplicador Tipico</th>
                  <th style={thStyle}>Duracao do Pico</th>
                  <th style={thStyle}>Preparacao</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Black Friday</td><td style={tdStyle}>5-10x trafego normal</td><td style={tdStyle}>4-6 horas</td><td style={tdStyle}>Pre-scale 2 semanas antes, load test 1 mes antes</td></tr>
                <tr><td style={tdStyle}>Dia do Pagamento (5o util)</td><td style={tdStyle}>2-3x</td><td style={tdStyle}>Manha inteira</td><td style={tdStyle}>Auto-scaling configurado, threshold alerts</td></tr>
                <tr><td style={tdStyle}>PIX no Natal</td><td style={tdStyle}>3-5x</td><td style={tdStyle}>24-48 horas</td><td style={tdStyle}>Pre-scale, monitoramento 24/7</td></tr>
                <tr><td style={tdStyle}>Flash sale inesperada</td><td style={tdStyle}>10-50x (!)</td><td style={tdStyle}>Minutos</td><td style={tdStyle}>Auto-scaling agressivo, circuit breakers, rate limiting</td></tr>
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>Load Testing para Pagamentos</p>
          <p style={paragraphStyle}>
            Load tests devem simular o fluxo completo: autorizacao, captura, clearing, settlement. Ferramentas:
            k6, Gatling, Locust para gerar carga; Grafana + Prometheus para observar. Metricas chave: p50/p95/p99
            de latencia de autorizacao (target: p99 &lt; 500ms), taxa de aprovacao sob carga (nao deve cair),
            throughput maximo sustentavel (TPS). Testar tambem degradacao graceful: o que acontece quando o
            sistema atinge 100% de capacidade? Deve rejeitar com 429, nao crashar.
          </p>
        </>
      ),
    },
    {
      id: "chaos-engineering",
      title: "Chaos Engineering",
      icon: "4",
      content: (
        <>
          <p style={paragraphStyle}>
            Chaos Engineering e a disciplina de experimentar em sistemas de producao para construir confianca
            na capacidade do sistema de resistir a condicoes turbulentas. Em pagamentos, significa: injetar
            falhas controladas para descobrir vulnerabilidades antes que causem incidentes reais.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Ferramenta</th>
                  <th style={thStyle}>Tipo</th>
                  <th style={thStyle}>Foco</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Gremlin</td><td style={tdStyle}>SaaS / Enterprise</td><td style={tdStyle}>Falhas de infra (CPU, memoria, rede, disco), attack scenarios</td></tr>
                <tr><td style={tdStyle}>LitmusChaos</td><td style={tdStyle}>Open-source (CNCF)</td><td style={tdStyle}>Kubernetes-native, pods, nodes, network</td></tr>
                <tr><td style={tdStyle}>AWS FIS</td><td style={tdStyle}>AWS nativo</td><td style={tdStyle}>Falhas de servicos AWS, AZ failures</td></tr>
                <tr><td style={tdStyle}>Chaos Monkey (Netflix)</td><td style={tdStyle}>Open-source</td><td style={tdStyle}>Terminacao aleatoria de instancias</td></tr>
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>Testes de Chaos Especificos para Pagamentos</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Experimento</th>
                  <th style={thStyle}>O que Testa</th>
                  <th style={thStyle}>Resultado Esperado</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Kill adquirente connection</td><td style={tdStyle}>Failover para adquirente secundario</td><td style={tdStyle}>Transacoes continuam via rota alternativa em &lt;2s</td></tr>
                <tr><td style={tdStyle}>Latencia no banco de dados</td><td style={tdStyle}>Timeouts e retries</td><td style={tdStyle}>Autorizacao degrada gracefully, nao duplica transacoes</td></tr>
                <tr><td style={tdStyle}>Perda de regiao inteira</td><td style={tdStyle}>DR e failover multi-region</td><td style={tdStyle}>Trafego redireciona em &lt;5min, zero data loss</td></tr>
                <tr><td style={tdStyle}>Antifraude indisponivel</td><td style={tdStyle}>Fallback policy</td><td style={tdStyle}>Transacoes de baixo risco aprovam, alto risco recusam</td></tr>
                <tr><td style={tdStyle}>Clock skew entre servers</td><td style={tdStyle}>Idempotencia e ordering</td><td style={tdStyle}>Nao processa duplicatas, ledger consistente</td></tr>
              </tbody>
            </table>
          </div>
          <p style={paragraphStyle}>
            Regra fundamental: nunca execute chaos experiments sem blast radius definido e kill switch
            imediato. Em pagamentos, comece em staging, evolua para canary em producao (1% do trafego),
            e so expanda apos confianca. Cada experimento deve ter hipotese clara e metricas observadas.
          </p>
        </>
      ),
    },
    {
      id: "incident-response",
      title: "Incident Response Playbooks",
      icon: "5",
      content: (
        <>
          <p style={paragraphStyle}>
            Em pagamentos, a velocidade de resposta a incidentes impacta diretamente em receita e confianca.
            Um framework claro de severidade, escalacao e comunicacao e essencial para minimizar o impacto.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Severidade</th>
                  <th style={thStyle}>Criterio</th>
                  <th style={thStyle}>Tempo de Resposta</th>
                  <th style={thStyle}>Escalacao</th>
                  <th style={thStyle}>Comunicacao</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ ...tdStyle, color: "#ef4444", fontWeight: 600 }}>SEV-1 (Critico)</td><td style={tdStyle}>Pagamentos completamente indisponiveis ou dados financeiros corrompidos</td><td style={tdStyle}>5 min</td><td style={tdStyle}>CTO, VP Eng, On-call leads</td><td style={tdStyle}>Status page, clientes enterprise, regulador</td></tr>
                <tr><td style={{ ...tdStyle, color: "#f59e0b", fontWeight: 600 }}>SEV-2 (Alto)</td><td style={tdStyle}>Degradacao severa (&gt;10% txs falhando), um adquirente down</td><td style={tdStyle}>15 min</td><td style={tdStyle}>Eng Manager, On-call leads</td><td style={tdStyle}>Status page, clientes afetados</td></tr>
                <tr><td style={{ ...tdStyle, color: "#3b82f6", fontWeight: 600 }}>SEV-3 (Medio)</td><td style={tdStyle}>Degradacao leve (&lt;5% txs), latencia elevada, alerta de capacidade</td><td style={tdStyle}>1 hora</td><td style={tdStyle}>On-call engineer</td><td style={tdStyle}>Ticket interno, monitoramento</td></tr>
                <tr><td style={tdStyle}>SEV-4 (Baixo)</td><td style={tdStyle}>Anomalia detectada, sem impacto visivel ao usuario</td><td style={tdStyle}>Next business day</td><td style={tdStyle}>Team backlog</td><td style={tdStyle}>Nota interna</td></tr>
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>Template de Comunicacao (SEV-1)</p>
          <div style={codeBlockStyle}>
{`[INCIDENTE] Pagamentos - Degradacao Severa
Status: INVESTIGANDO
Inicio: 2024-01-15 14:32 UTC
Impacto: ~30% das autorizacoes falhando
Causa Raiz: Em investigacao
Proximo update: 15 min
Incident Commander: [Nome]
Canal de War Room: #incident-payments-20240115`}
          </div>
          <p style={paragraphStyle}>
            Updates a cada 15 minutos para SEV-1, 30 minutos para SEV-2. Cada update deve conter: status
            atual, acoes tomadas, proximos passos, ETA estimado. Mesmo que nao haja novidade, comunique
            &quot;investigacao em andamento&quot; para evitar ansiedade dos stakeholders.
          </p>
        </>
      ),
    },
    {
      id: "runbook-falhas",
      title: "Runbook: Pagamentos Falhando",
      icon: "6",
      content: (
        <>
          <p style={paragraphStyle}>
            Quando a taxa de falha de pagamentos sobe acima do threshold, este runbook guia o diagnostico
            sistematico. A ordem importa: comece pela causa mais provavel e mais facil de verificar.
          </p>
          <div style={alertBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#ef4444", marginBottom: "0.25rem" }}>
              Trigger: Taxa de falha &gt; 5% por 5 minutos consecutivos
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Alerta automatico dispara, on-call e acionado. Iniciar diagnostico imediatamente.
            </p>
          </div>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Passo</th>
                  <th style={thStyle}>Verificacao</th>
                  <th style={thStyle}>Como Checar</th>
                  <th style={thStyle}>Acao se Positivo</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>1</td><td style={tdStyle}>Health check do adquirente</td><td style={tdStyle}>Dashboard de status do acquirer, response codes (timeout vs reject)</td><td style={tdStyle}>Ativar rota secundaria / failover de adquirente</td></tr>
                <tr><td style={tdStyle}>2</td><td style={tdStyle}>Conectividade de rede</td><td style={tdStyle}>Latencia ao endpoint do acquirer, packet loss, DNS resolution</td><td style={tdStyle}>Verificar VPN/dedicated link, acionar NOC</td></tr>
                <tr><td style={tdStyle}>3</td><td style={tdStyle}>Regras de fraude</td><td style={tdStyle}>Taxa de rejeicao por fraude, deploy recente de regras?</td><td style={tdStyle}>Rollback de regra, ajustar threshold temporariamente</td></tr>
                <tr><td style={tdStyle}>4</td><td style={tdStyle}>Limites e quotas</td><td style={tdStyle}>Rate limits atingidos? Limites de merchant ou BIN?</td><td style={tdStyle}>Aumentar limites temporariamente, verificar configuracao</td></tr>
                <tr><td style={tdStyle}>5</td><td style={tdStyle}>Servicos internos</td><td style={tdStyle}>Health de microservicos (auth, tokenization, risk), filas, DB</td><td style={tdStyle}>Restart servico, scale up, verificar deadlocks</td></tr>
                <tr><td style={tdStyle}>6</td><td style={tdStyle}>Certificados e credenciais</td><td style={tdStyle}>TLS cert expirado? API key rotacionada?</td><td style={tdStyle}>Renovar cert, restaurar credenciais</td></tr>
                <tr><td style={tdStyle}>7</td><td style={tdStyle}>Deploy recente</td><td style={tdStyle}>Houve deploy nos ultimos 60 min? Canary metrics?</td><td style={tdStyle}>Rollback imediato</td></tr>
              </tbody>
            </table>
          </div>
          <p style={paragraphStyle}>
            Se nenhum passo identificar a causa, escalar para SEV-1 e acionar war room com representantes
            de: engineering, infra/SRE, produto e suporte. Em paralelo, considerar mitigacao: circuit
            breaker para requests ao acquirer com problema, redirecionar trafego, ou ativar modo degradado
            (aprovar transacoes de baixo risco offline para reconciliar depois).
          </p>
        </>
      ),
    },
    {
      id: "observability",
      title: "Observability Stack",
      icon: "7",
      content: (
        <>
          <p style={paragraphStyle}>
            Observability em pagamentos vai alem de metricas genericas de infra. Precisa capturar metricas
            de negocio (taxa de aprovacao, valor processado, distribuicao de bandeiras) com a mesma
            granularidade e urgencia que metricas tecnicas (latencia, error rate, saturation).
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Pilar</th>
                  <th style={thStyle}>Ferramenta</th>
                  <th style={thStyle}>Metricas de Pagamento</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Metricas</td><td style={tdStyle}>Prometheus / Datadog / CloudWatch</td><td style={tdStyle}>TPS, taxa de aprovacao por acquirer/bandeira, latencia p50/p95/p99, valor processado/hora</td></tr>
                <tr><td style={tdStyle}>Logs</td><td style={tdStyle}>ELK Stack / Loki / Splunk</td><td style={tdStyle}>Log estruturado de cada transacao (mascarado), response codes, erros de integracao</td></tr>
                <tr><td style={tdStyle}>Traces</td><td style={tdStyle}>Jaeger / OpenTelemetry / Datadog APM</td><td style={tdStyle}>Trace de ponta a ponta: API gateway -&gt; auth -&gt; risk -&gt; acquirer -&gt; response</td></tr>
                <tr><td style={tdStyle}>Alertas</td><td style={tdStyle}>PagerDuty / OpsGenie / Grafana Alerting</td><td style={tdStyle}>Anomaly detection em taxa de aprovacao, SLA breach, threshold de latencia</td></tr>
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>Dashboards Essenciais para Pagamentos</p>
          <p style={paragraphStyle}>
            1. Real-time Overview: TPS atual, taxa de aprovacao, valor processado, error rate por acquirer.
            2. Acquirer Health: latencia, taxa de sucesso, volume por bandeira para cada acquirer.
            3. Business Metrics: ticket medio, distribuicao de parcelas, split por metodo de pagamento.
            4. Fraud Signals: taxa de rejeicao por fraude, chargebacks, alertas de padroes anomalos.
            5. Settlement: volume liquidado vs esperado, exceptions em reconciliacao, aging de pendencias.
          </p>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Golden Signals para Pagamentos
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Adapte os 4 Golden Signals do Google SRE: Latencia (tempo de autorizacao), Trafego (TPS),
              Erros (taxa de falha por tipo), Saturacao (capacidade do acquirer, filas internas). Adicione
              o 5o signal especifico: Taxa de Aprovacao (metrica de negocio mais critica).
            </p>
          </div>
        </>
      ),
    },
    {
      id: "sla-management",
      title: "SLA Management",
      icon: "8",
      content: (
        <>
          <p style={paragraphStyle}>
            SLAs (Service Level Agreements) em pagamentos sao contratos que definem os niveis minimos de
            servico que devem ser mantidos. Sao mais rigorosos que em outros dominios porque impactam
            diretamente a receita dos clientes (merchants).
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>SLA</th>
                  <th style={thStyle}>Target</th>
                  <th style={thStyle}>Downtime Permitido/Ano</th>
                  <th style={thStyle}>Penalidade Tipica</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Uptime (autorizacao)</td><td style={tdStyle}>99.99%</td><td style={tdStyle}>52 min/ano</td><td style={tdStyle}>Creditos proporcionais ao downtime</td></tr>
                <tr><td style={tdStyle}>Latencia (autorizacao)</td><td style={tdStyle}>p99 &lt; 500ms</td><td style={tdStyle}>N/A</td><td style={tdStyle}>Renegociacao de taxas se persistente</td></tr>
                <tr><td style={tdStyle}>Throughput</td><td style={tdStyle}>X TPS garantidos</td><td style={tdStyle}>N/A</td><td style={tdStyle}>Scale-up obrigatorio ou creditos</td></tr>
                <tr><td style={tdStyle}>Settlement timing</td><td style={tdStyle}>D+1 (ou D+0)</td><td style={tdStyle}>N/A</td><td style={tdStyle}>Multa por atraso na liquidacao</td></tr>
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>SLO vs SLA vs SLI</p>
          <p style={paragraphStyle}>
            SLI (Service Level Indicator) e a metrica medida (ex: % de requests com latencia &lt; 500ms).
            SLO (Service Level Objective) e o target interno (ex: 99.95% dos requests com latencia &lt; 500ms).
            SLA e o contrato externo com penalidades (ex: 99.9%, com creditos se violado). Best practice:
            SLO deve ser mais rigoroso que SLA para criar margem de seguranca (error budget).
          </p>
          <p style={paragraphStyle}>
            Error budget e a diferenca entre SLO e 100%. Com SLO de 99.95%, o error budget e 0.05%, ou
            ~22 minutos/mes. Quando o error budget se esgota, a equipe deve priorizar confiabilidade
            sobre features. Esse modelo (popularizado pelo Google SRE) alinha engineering e produto em
            torno de objetivos de confiabilidade metrificados.
          </p>
        </>
      ),
    },
    {
      id: "post-mortem",
      title: "Post-Mortem Culture",
      icon: "9",
      content: (
        <>
          <p style={paragraphStyle}>
            Post-mortems blameless sao documentos que analisam incidentes sem atribuir culpa a individuos.
            O objetivo e aprender e prevenir recorrencia, nao punir. Em pagamentos, onde incidentes podem
            ter impacto financeiro significativo, a cultura de post-mortem e especialmente importante.
          </p>
          <p style={subheadingStyle}>Estrutura de Post-Mortem</p>
          <div style={codeBlockStyle}>
{`## Post-Mortem: [Titulo do Incidente]
Data: [Data do incidente]
Severidade: SEV-[1-4]
Duracao: [Tempo de impacto]
Impacto: [Transacoes afetadas, valor, clientes]

## Timeline
- HH:MM - Alerta disparou
- HH:MM - On-call respondeu
- HH:MM - Causa identificada
- HH:MM - Mitigacao aplicada
- HH:MM - Servico restaurado

## Causa Raiz (5 Whys)
1. Por que as transacoes falharam? Timeout no acquirer.
2. Por que houve timeout? Latencia do banco de dados.
3. Por que a latencia subiu? Query sem indice em tabela nova.
4. Por que nao havia indice? Migration nao incluiu.
5. Por que nao foi detectado? Load test nao cobriu esse path.

## Action Items
- [ ] [P0] Adicionar indice na tabela X (Owner: @eng)
- [ ] [P1] Incluir query paths no load test (Owner: @sre)
- [ ] [P2] Alert para latencia de DB > 100ms (Owner: @sre)
- [ ] [P2] Checklist de migration inclui indices (Owner: @eng)`}
          </div>
          <p style={paragraphStyle}>
            Action items devem ser trackados como tickets com owners e deadlines. Revisao semanal de
            action items pendentes de post-mortems garante que as licoes se transformem em melhorias
            concretas. Metricas de saude do processo: % de action items completados no prazo, tempo
            medio para publicar post-mortem (&lt;72h), recorrencia de causas raiz (deve diminuir ao longo do tempo).
          </p>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Principios Blameless
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              1. Pessoas agem com as melhores intencoes e informacoes disponiveis no momento.
              2. Se alguem cometeu um erro, o sistema permitiu que esse erro acontecesse.
              3. Foque em: &quot;como melhoramos o sistema?&quot; nao &quot;quem errou?&quot;.
              4. Compartilhe post-mortems amplamente para que toda a organizacao aprenda.
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
          Operational Excellence & Incident Response
        </h1>
        <p className="page-description">
          Alta disponibilidade, disaster recovery, chaos engineering, observability,
          playbooks de incidentes e cultura de post-mortem para sistemas de pagamento.
        </p>
      </header>

      {/* Learning Objectives */}
      <div className="learning-objectives" style={{ marginBottom: "1.5rem" }}>
        <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--primary)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          O que voce vai aprender
        </p>
        <ul>
          <li>Padroes de alta disponibilidade e disaster recovery para pagamentos (RPO=0, RTO&lt;5min)</li>
          <li>Capacity planning para picos e chaos engineering especifico para payment systems</li>
          <li>Playbooks de incident response com severidade, escalacao e runbook de diagnostico</li>
          <li>Observability stack completo e SLA management com error budgets</li>
          <li>Cultura de post-mortem blameless com 5 whys e action items trackados</li>
        </ul>
      </div>

      {/* Stats */}
      <div className="animate-fade-in stagger-1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>9</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Secoes</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>99.99%</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Uptime Target</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>52min</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Downtime/Ano</div>
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
