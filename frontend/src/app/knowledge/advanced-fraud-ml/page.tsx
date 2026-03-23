"use client";

import { useState } from "react";
import { getQuizForPage } from "@/data/quizzes";
import PageQuiz from "@/components/ui/PageQuiz";
import { useGameProgress } from "@/hooks/useGameProgress";

// ---------------------------------------------------------------------------
// Shared styles
// ---------------------------------------------------------------------------

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
  background: "var(--background)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  padding: "1rem",
  fontSize: "0.8rem",
  fontFamily: "monospace",
  overflowX: "auto",
  whiteSpace: "pre",
  color: "var(--foreground)",
  lineHeight: 1.6,
  marginTop: "0.75rem",
  marginBottom: "0.75rem",
};

// ---------------------------------------------------------------------------
// Section type
// ---------------------------------------------------------------------------

interface Section {
  id: string;
  title: string;
  icon: string;
  content: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AdvancedFraudMLPage() {
  const quiz = getQuizForPage("/knowledge/advanced-fraud-ml");
  const { recordQuiz } = useGameProgress();
  const [quizCompleted, setQuizCompleted] = useState(false);

  const sections: Section[] = [
    {
      id: "evolucao-deteccao",
      title: "Evolucao da Deteccao de Fraude",
      icon: "1",
      content: (
        <>
          <p style={paragraphStyle}>
            A deteccao de fraude em pagamentos evoluiu de regras manuais simples para sistemas de inteligencia
            artificial capazes de analisar centenas de sinais em tempo real. Cada geracao adicionou capacidades,
            mas nao substituiu completamente a anterior — os melhores sistemas combinam todas as abordagens.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Geracao</th>
                  <th style={thStyle}>Abordagem</th>
                  <th style={thStyle}>Vantagens</th>
                  <th style={thStyle}>Limitacoes</th>
                  <th style={thStyle}>Exemplo</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>1a (1990s)</td><td style={tdStyle}>Regras manuais</td><td style={tdStyle}>Simples, interpretavel, rapida de implementar</td><td style={tdStyle}>Nao escala, alta taxa de falso positivo</td><td style={tdStyle}>&quot;Bloquear se valor &gt; R$ 5k e pais != BR&quot;</td></tr>
                <tr><td style={tdStyle}>2a (2000s)</td><td style={tdStyle}>Score estatistico</td><td style={tdStyle}>Combina multiplos sinais, probabilistico</td><td style={tdStyle}>Features manuais, modelo estatico</td><td style={tdStyle}>Regressao logistica com 20-50 features</td></tr>
                <tr><td style={tdStyle}>3a (2010s)</td><td style={tdStyle}>Machine Learning</td><td style={tdStyle}>Aprende padroes complexos, auto-ajuste</td><td style={tdStyle}>Precisa de dados rotulados, black box</td><td style={tdStyle}>Random Forest, XGBoost, ensemble</td></tr>
                <tr><td style={tdStyle}>4a (2015+)</td><td style={tdStyle}>Deep Learning</td><td style={tdStyle}>Features automaticas, sequencias temporais</td><td style={tdStyle}>Requer muito dado, computacionalmente caro</td><td style={tdStyle}>LSTM para sequencias de transacoes</td></tr>
                <tr><td style={tdStyle}>5a (2020+)</td><td style={tdStyle}>Graph Neural Networks</td><td style={tdStyle}>Detecta redes de fraude, relacoes ocultas</td><td style={tdStyle}>Complexidade, latencia</td><td style={tdStyle}>GNN para fraud rings, conluio</td></tr>
              </tbody>
            </table>
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Estado da arte
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Os sistemas mais avancados usam uma arquitetura em camadas: regras rapidas filtram
              fraudes obvias (latencia &lt;5ms), modelos de ML em tempo real pontuam transacoes
              (latencia ~50ms), e graph analysis roda em near-real-time para detectar redes de
              fraude (latencia ~500ms). Cada camada tem seu papel.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "feature-engineering",
      title: "Feature Engineering para Fraude",
      icon: "2",
      content: (
        <>
          <p style={paragraphStyle}>
            A qualidade das features e o fator mais determinante na performance de um modelo de fraude.
            Features bem construidas podem fazer um modelo simples superar um modelo complexo com features
            ruins. As categorias principais sao:
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Categoria</th>
                  <th style={thStyle}>Exemplos de Features</th>
                  <th style={thStyle}>Sinal</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Transacionais</td><td style={tdStyle}>Valor, moeda, MCC, tipo de entrada (chip/CNP/contactless)</td><td style={tdStyle}>Baseline da transacao</td></tr>
                <tr><td style={tdStyle}>Velocity</td><td style={tdStyle}>Txns/hora, txns/dia, valor acumulado 24h, merchants distintos/hora</td><td style={tdStyle}>Padroes de uso acelerado</td></tr>
                <tr><td style={tdStyle}>Comportamentais</td><td style={tdStyle}>Desvio do padrao historico, hora atipica, merchant nunca visitado</td><td style={tdStyle}>Anomalia vs baseline do usuario</td></tr>
                <tr><td style={tdStyle}>Device</td><td style={tdStyle}>Device fingerprint, mudanca de device, root/jailbreak, emulador</td><td style={tdStyle}>Confiabilidade do dispositivo</td></tr>
                <tr><td style={tdStyle}>Geolocation</td><td style={tdStyle}>Distancia entre transacoes, impossible travel, VPN detection</td><td style={tdStyle}>Consistencia geografica</td></tr>
                <tr><td style={tdStyle}>Network</td><td style={tdStyle}>IP reputation, ASN, proxy/TOR detection, IP-BIN mismatch</td><td style={tdStyle}>Qualidade da conexao</td></tr>
                <tr><td style={tdStyle}>Sessao</td><td style={tdStyle}>Tempo na pagina, cliques antes do checkout, copiar/colar no formulario</td><td style={tdStyle}>Comportamento de navegacao</td></tr>
                <tr><td style={tdStyle}>Identidade</td><td style={tdStyle}>Email age, email-name mismatch, phone carrier, CPF bureau score</td><td style={tdStyle}>Validade da identidade</td></tr>
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>Exemplo de Feature Store</p>
          <div style={codeBlockStyle}>{`{
  "transaction_features": {
    "amount": 2500.00,
    "amount_zscore_30d": 3.2,
    "is_first_purchase_at_merchant": true,
    "mcc_risk_category": "high"
  },
  "velocity_features": {
    "txn_count_1h": 5,
    "txn_count_24h": 12,
    "distinct_merchants_1h": 4,
    "cumulative_amount_24h": 8750.00,
    "time_since_last_txn_seconds": 45
  },
  "device_features": {
    "device_age_days": 2,
    "device_trust_score": 0.15,
    "is_new_device": true,
    "is_emulator": false,
    "screen_resolution_common": true
  },
  "geo_features": {
    "distance_from_last_txn_km": 450,
    "minutes_since_last_txn": 30,
    "impossible_travel": true,
    "country_matches_bin": false
  }
}`}</div>
        </>
      ),
    },
    {
      id: "modelos-ml",
      title: "Modelos de ML para Risco",
      icon: "3",
      content: (
        <>
          <p style={paragraphStyle}>
            A escolha do modelo depende do balanco entre interpretabilidade, performance, latencia e
            volume de dados disponivel. Na pratica, a maioria das empresas de pagamento usa ensemble
            de modelos baseados em arvore (XGBoost/LightGBM) como modelo principal.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Modelo</th>
                  <th style={thStyle}>AUC-ROC Tipico</th>
                  <th style={thStyle}>Latencia (p99)</th>
                  <th style={thStyle}>Interpretabilidade</th>
                  <th style={thStyle}>Quando Usar</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Regressao Logistica</td><td style={tdStyle}>0.85-0.90</td><td style={tdStyle}>&lt;5ms</td><td style={tdStyle}>Alta (coeficientes)</td><td style={tdStyle}>Baseline, features lineares, compliance</td></tr>
                <tr><td style={tdStyle}>Random Forest</td><td style={tdStyle}>0.90-0.94</td><td style={tdStyle}>10-30ms</td><td style={tdStyle}>Media (feature importance)</td><td style={tdStyle}>Bom generalista, poucos hiperparametros</td></tr>
                <tr><td style={tdStyle}>XGBoost/LightGBM</td><td style={tdStyle}>0.93-0.97</td><td style={tdStyle}>5-20ms</td><td style={tdStyle}>Media (SHAP values)</td><td style={tdStyle}>Producao principal, melhor custo-beneficio</td></tr>
                <tr><td style={tdStyle}>Neural Network (MLP)</td><td style={tdStyle}>0.92-0.96</td><td style={tdStyle}>10-50ms</td><td style={tdStyle}>Baixa (black box)</td><td style={tdStyle}>Muitos dados, interacoes complexas</td></tr>
                <tr><td style={tdStyle}>LSTM/Transformer</td><td style={tdStyle}>0.94-0.97</td><td style={tdStyle}>50-200ms</td><td style={tdStyle}>Baixa</td><td style={tdStyle}>Sequencias temporais, historico de transacoes</td></tr>
                <tr><td style={tdStyle}>Graph Neural Network</td><td style={tdStyle}>0.95-0.98*</td><td style={tdStyle}>100-500ms</td><td style={tdStyle}>Baixa</td><td style={tdStyle}>Fraud rings, redes de conluio</td></tr>
              </tbody>
            </table>
          </div>
          <p style={{ ...paragraphStyle, fontSize: "0.8rem", fontStyle: "italic" }}>
            * AUC-ROC para deteccao de fraud rings especificamente, nao para transacoes individuais.
          </p>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Arquitetura tipica de producao
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Modelo primario: XGBoost com ~200 features (latencia p99 &lt; 20ms).
              Modelo secundario: LSTM para analise de sequencia (top 10% transacoes por score).
              Modelo terciario: GNN para deteccao de redes (batch diario + alertas near-real-time).
              Regras de negocio: filtros pre e pos-modelo para compliance e casos especificos.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "graph-analysis",
      title: "Graph Analysis para Fraud Rings",
      icon: "4",
      content: (
        <>
          <p style={paragraphStyle}>
            Fraud rings sao redes organizadas de fraudadores que compartilham recursos (cartoes, enderecos,
            devices, contas) para executar fraude em escala. A analise de grafos e a ferramenta mais poderosa
            para detectar esses padroes que sao invisiveis para modelos tradicionais baseados em transacoes individuais.
          </p>
          <div style={codeBlockStyle}>{`Exemplo de Fraud Ring - Compartilhamento de Recursos:

       ┌──────────┐
       │ Device A │
       └────┬─────┘
            │ usado por
     ┌──────┴──────┐
     │             │
┌────▼───┐   ┌────▼───┐
│ User 1 │   │ User 2 │
└────┬───┘   └────┬───┘
     │             │
     │  mesmo IP   │    ┌────────┐
     ├─────────────┤    │ User 4 │
     │             │    └────┬───┘
┌────▼───┐   ┌────▼───┐     │
│ Card A │   │ Card B │     │ mesmo endereco
└────────┘   └────┬───┘     │
                  │    ┌────▼───┐
                  └───►│ User 3 │
                       └────────┘
                  mesmo shipping

Sinais de Fraud Ring:
- 4 usuarios compartilhando 1 device
- 3 usuarios com mesmo IP nao-residencial
- 2 cartoes usados por multiplos usuarios
- Shipping address compartilhado por 2+ usuarios
- Transacoes coordenadas temporalmente`}</div>
          <p style={subheadingStyle}>Tecnicas de Graph Analysis</p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Tecnica</th>
                  <th style={thStyle}>Funcao</th>
                  <th style={thStyle}>Aplicacao em Fraude</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Entity Resolution</td><td style={tdStyle}>Unificar identidades fragmentadas (mesmo usuario com dados diferentes)</td><td style={tdStyle}>Detectar usuarios com multiplas contas (multi-accounting)</td></tr>
                <tr><td style={tdStyle}>Link Analysis</td><td style={tdStyle}>Identificar conexoes entre entidades (users, devices, enderecos)</td><td style={tdStyle}>Mapear relacionamentos suspeitos entre contas</td></tr>
                <tr><td style={tdStyle}>Community Detection</td><td style={tdStyle}>Agrupar entidades fortemente conectadas</td><td style={tdStyle}>Identificar clusters de fraude (fraud rings)</td></tr>
                <tr><td style={tdStyle}>Centrality Analysis</td><td style={tdStyle}>Encontrar nos mais influentes/conectados</td><td style={tdStyle}>Identificar &quot;mastermind&quot; de uma rede de fraude</td></tr>
                <tr><td style={tdStyle}>Anomaly Propagation</td><td style={tdStyle}>Propagar scores de risco pela rede</td><td style={tdStyle}>Contaminar score de contas conectadas a fraudadores</td></tr>
              </tbody>
            </table>
          </div>
        </>
      ),
    },
    {
      id: "realtime-vs-batch",
      title: "Real-Time vs Batch Processing",
      icon: "5",
      content: (
        <>
          <p style={paragraphStyle}>
            A decisao entre processamento em tempo real e batch nao e binaria — os melhores sistemas
            usam ambos. A chave e entender qual tipo de deteccao exige qual latencia.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Aspecto</th>
                  <th style={thStyle}>Real-Time (&lt;100ms)</th>
                  <th style={thStyle}>Near-Real-Time (1-60s)</th>
                  <th style={thStyle}>Batch (horas)</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Uso</td><td style={tdStyle}>Decisao de autorizar/negar</td><td style={tdStyle}>Alertas pos-autorizacao</td><td style={tdStyle}>Deteccao de padroes, re-treinamento</td></tr>
                <tr><td style={tdStyle}>Features</td><td style={tdStyle}>Pre-computadas + transacionais</td><td style={tdStyle}>Aggregacoes janeladas</td><td style={tdStyle}>Historicas, grafos, cross-merchant</td></tr>
                <tr><td style={tdStyle}>Modelos</td><td style={tdStyle}>XGBoost, regras rapidas</td><td style={tdStyle}>Modelos mais complexos, ensemble</td><td style={tdStyle}>GNN, deep learning, clustering</td></tr>
                <tr><td style={tdStyle}>Tecnologia</td><td style={tdStyle}>Redis, feature store in-memory</td><td style={tdStyle}>Kafka Streams, Flink</td><td style={tdStyle}>Spark, BigQuery, dbt</td></tr>
                <tr><td style={tdStyle}>Acao</td><td style={tdStyle}>Approve/Decline/Review</td><td style={tdStyle}>Bloquear conta, alertar analista</td><td style={tdStyle}>Atualizar modelos, blacklists</td></tr>
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>Arquitetura de Pipeline</p>
          <div style={codeBlockStyle}>{`
┌─────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────┐
│ Transacao│───►│ Feature Store │───►│  ML Scoring   │───►│ Decision │
│  (API)  │    │  (Redis/     │    │  (XGBoost     │    │ Engine   │
│         │    │   Feast)     │    │   <20ms)      │    │          │
└─────────┘    └──────────────┘    └──────────────┘    └────┬─────┘
                                                            │
                    ┌───────────────────────────────────────┘
                    │
              ┌─────▼─────┐    ┌──────────────┐    ┌──────────────┐
              │   Kafka    │───►│ Stream Proc   │───►│  Alerting    │
              │  (events)  │    │ (Flink/KS)   │    │  System      │
              └─────┬──────┘    └──────────────┘    └──────────────┘
                    │
              ┌─────▼─────┐    ┌──────────────┐    ┌──────────────┐
              │  Data Lake │───►│ Batch ML      │───►│  Model       │
              │  (S3/GCS)  │    │ (Spark/GNN)  │    │  Registry    │
              └────────────┘    └──────────────┘    └──────────────┘`}</div>
        </>
      ),
    },
    {
      id: "behavioral-biometrics",
      title: "Behavioral Biometrics",
      icon: "6",
      content: (
        <>
          <p style={paragraphStyle}>
            Biometria comportamental analisa como um usuario interage com o dispositivo, criando um perfil
            unico que e extremamente dificil de replicar. Diferentemente de dados transacionais, esses
            sinais sao coletados continuamente durante toda a sessao.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Sinal</th>
                  <th style={thStyle}>O que Mede</th>
                  <th style={thStyle}>Indicador de Fraude</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Typing patterns</td><td style={tdStyle}>Velocidade de digitacao, dwell time, flight time entre teclas</td><td style={tdStyle}>Bot (velocidade uniforme), conta roubada (padrao diferente do historico)</td></tr>
                <tr><td style={tdStyle}>Mouse movement</td><td style={tdStyle}>Trajetoria, velocidade, aceleracao, hesitacao</td><td style={tdStyle}>Bots (movimentos lineares), remote access (lag no movimento)</td></tr>
                <tr><td style={tdStyle}>Touch patterns (mobile)</td><td style={tdStyle}>Pressao, area do toque, angulo, mao dominante</td><td style={tdStyle}>Emulador (sem variacao de pressao), usuario diferente</td></tr>
                <tr><td style={tdStyle}>Scroll behavior</td><td style={tdStyle}>Velocidade, padrao, direcao</td><td style={tdStyle}>Bots (scroll automatico), familiaridade com a pagina</td></tr>
                <tr><td style={tdStyle}>Device sensors</td><td style={tdStyle}>Acelerometro, giroscopio, orientacao</td><td style={tdStyle}>Emulador (valores estaticos), device fixo (nao e smartphone)</td></tr>
                <tr><td style={tdStyle}>Session behavior</td><td style={tdStyle}>Tempo em cada pagina, sequencia de navegacao, copiar/colar</td><td style={tdStyle}>Checkout rapido demais, copiar numero de cartao (tipagem nao manual)</td></tr>
              </tbody>
            </table>
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Caso pratico: deteccao de Account Takeover (ATO)
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Um usuario legítimo digita seu e-mail em ~2s com padrao consistente. Um fraudador com ATO
              tipicamente copia/cola o e-mail, digita a senha com velocidade diferente do perfil historico
              e navega pelo site de forma diferente (vai direto ao checkout). A combinacao desses sinais
              comportamentais pode elevar o score de risco mesmo quando credenciais validas sao usadas.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "friendly-fraud",
      title: "Friendly Fraud Deep Dive",
      icon: "7",
      content: (
        <>
          <p style={paragraphStyle}>
            Friendly fraud (fraude amigavel ou first-party fraud) ocorre quando o proprio titular do cartao
            realiza uma compra legitima e depois contesta a cobranca. E o tipo mais dificil de detectar
            porque o &quot;fraudador&quot; e o cliente real, com credenciais validas e comportamento normal.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Padrao</th>
                  <th style={thStyle}>Descricao</th>
                  <th style={thStyle}>Sinais de Deteccao</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Buyer Remorse</td><td style={tdStyle}>Arrependimento de compra, contesta ao inves de pedir reembolso</td><td style={tdStyle}>Nao tentou contato antes do chargeback, item digital ja consumido</td></tr>
                <tr><td style={tdStyle}>Family Fraud</td><td style={tdStyle}>Familiar usa o cartao sem permissao explicita</td><td style={tdStyle}>Mesmo device/IP do titular, compras em categorias familiares</td></tr>
                <tr><td style={tdStyle}>Cyber Shoplifting</td><td style={tdStyle}>Compra intencional com plano de contestar</td><td style={tdStyle}>Historico de chargebacks, contesta apos receber produto</td></tr>
                <tr><td style={tdStyle}>Subscription Abuse</td><td style={tdStyle}>Usa servico e contesta cobranca recorrente</td><td style={tdStyle}>Acesso continuou apos contestacao, uso intensivo pre-chargeback</td></tr>
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>Compelling Evidence 3.0 (Visa)</p>
          <p style={paragraphStyle}>
            O Compelling Evidence 3.0 da Visa permite que merchants provem que o titular fez compras
            anteriores nao-disputadas com os mesmos dados, tornando dificil alegar fraude.
          </p>
          <div style={codeBlockStyle}>{`Compelling Evidence 3.0 - Dados Necessarios:

Para cada transacao disputada, apresentar 2+ transacoes
anteriores (120-365 dias) com PELO MENOS 2 matches:

Match 1: IP Address          → mesmo IP nas transacoes
Match 2: Device ID           → mesmo device fingerprint
Match 3: Shipping Address    → mesmo endereco de entrega
Match 4: User Account ID     → mesma conta no merchant

Se 2+ matches: liability shift para o emissor
O merchant vence o chargeback automaticamente.

Exemplo:
┌──────────────┬────────────────┬────────────────┐
│              │ Txn Disputada  │ Txn Anterior #1│
├──────────────┼────────────────┼────────────────┤
│ Data         │ 2025-01-15     │ 2024-11-20     │
│ IP Address   │ 189.45.xxx.xx  │ 189.45.xxx.xx  │  ✓ Match
│ Device ID    │ d4f8a2b...     │ d4f8a2b...     │  ✓ Match
│ Account      │ user_12345     │ user_12345     │  ✓ Match
│ Status       │ DISPUTADA      │ NAO DISPUTADA  │
└──────────────┴────────────────┴────────────────┘
Resultado: 3 matches → Merchant vence`}</div>
        </>
      ),
    },
    {
      id: "scoring-multi-signal",
      title: "Modelo de Scoring Multi-Signal",
      icon: "8",
      content: (
        <>
          <p style={paragraphStyle}>
            Um sistema de scoring moderno combina 50-200+ sinais em um unico score de risco (0-1000 ou 0-100).
            O desafio nao e apenas combinar os sinais, mas calibrar o score para que ele represente uma
            probabilidade real de fraude e definir thresholds operacionais otimos.
          </p>
          <div style={codeBlockStyle}>{`Arquitetura de Scoring Multi-Signal:

Sinais de Entrada (200+ features):
├── Transacionais (30 features)
│   ├── amount, currency, mcc
│   ├── amount_zscore, is_round_amount
│   └── time_of_day, day_of_week
├── Velocity (25 features)
│   ├── txn_count_1h, txn_count_24h
│   ├── distinct_merchants_1h
│   └── cumulative_amount_7d
├── Device (20 features)
│   ├── device_trust_score
│   ├── is_new_device, is_emulator
│   └── screen_resolution_match
├── Geo (15 features)
│   ├── impossible_travel
│   ├── distance_from_home
│   └── country_risk_score
├── Identity (20 features)
│   ├── email_age, phone_carrier
│   ├── name_email_match_score
│   └── cpf_bureau_score
├── Behavioral (25 features)
│   ├── session_duration
│   ├── typing_speed_zscore
│   └── navigation_pattern_score
├── Network/Graph (15 features)
│   ├── shared_device_count
│   ├── network_fraud_exposure
│   └── community_risk_score
└── Historical (50+ features)
    ├── past_chargeback_count
    ├── avg_monthly_spend
    └── account_age_days

          │
          ▼
┌─────────────────────────┐
│   MODEL ENSEMBLE        │
│                         │
│  XGBoost (weight: 0.4)  │
│  LightGBM (weight: 0.3) │
│  Neural Net (weight: 0.2)│
│  Rules (weight: 0.1)    │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  CALIBRATION LAYER      │
│  (Platt scaling)        │
│  Score → Probabilidade  │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  THRESHOLD ENGINE       │
│                         │
│  Score 0-30:   APPROVE  │
│  Score 31-65:  REVIEW   │
│  Score 66-85:  3DS/SCA  │
│  Score 86-100: DECLINE  │
└─────────────────────────┘`}</div>
          <p style={subheadingStyle}>Calibracao de Score</p>
          <p style={paragraphStyle}>
            Um score de 70 deve significar ~70% de probabilidade de fraude. Sem calibracao, os modelos tendem
            a ser overconfident ou underconfident. A calibracao e feita via Platt Scaling (regressao logistica
            sobre os scores) ou Isotonic Regression, validada com reliability diagrams.
          </p>
        </>
      ),
    },
    {
      id: "false-positive-management",
      title: "False Positive Management",
      icon: "9",
      content: (
        <>
          <p style={paragraphStyle}>
            Falsos positivos (transacoes legitimas bloqueadas) sao o maior custo oculto de sistemas antifraude.
            Estudos indicam que para cada R$ 1 em fraude evitada, R$ 3-10 em receita legitima e perdida
            por falsos positivos. A gestao de FP e tao importante quanto a deteccao de fraude.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Impacto do Falso Positivo</th>
                  <th style={thStyle}>Consequencia</th>
                  <th style={thStyle}>Custo Estimado</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Venda perdida</td><td style={tdStyle}>Cliente nao completa a compra</td><td style={tdStyle}>100% do valor da transacao</td></tr>
                <tr><td style={tdStyle}>Churn do cliente</td><td style={tdStyle}>33% dos clientes bloqueados nao voltam</td><td style={tdStyle}>LTV do cliente (R$ 500-5.000+)</td></tr>
                <tr><td style={tdStyle}>Custo de revisao manual</td><td style={tdStyle}>Analista revisa cada caso na fila</td><td style={tdStyle}>R$ 5-15 por revisao</td></tr>
                <tr><td style={tdStyle}>Dano reputacional</td><td style={tdStyle}>Reviews negativas, reclamacoes</td><td style={tdStyle}>Dificil de quantificar</td></tr>
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>Estrategias de Reducao de Falsos Positivos</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.75rem", marginBottom: "0.75rem" }}>
            {[
              { step: "1", text: "Step-up authentication: ao inves de bloquear, pedir 3DS/OTP para transacoes de risco medio" },
              { step: "2", text: "Whitelisting dinamico: clientes com historico limpo tem thresholds mais altos automaticamente" },
              { step: "3", text: "Feedback loops: resultado das revisoes manuais alimenta re-treinamento semanal do modelo" },
              { step: "4", text: "A/B testing de thresholds: testar limites diferentes em populacoes controladas" },
              { step: "5", text: "Segmentacao de modelos: modelos especificos por segmento (novo vs recorrente, alto vs baixo valor)" },
              { step: "6", text: "Network intelligence: dados compartilhados entre merchants (consorcio) reduzem incerteza" },
            ].map((item) => (
              <div key={item.step} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                <span style={{
                  width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.7rem", fontWeight: 700, background: "var(--primary)", color: "#fff",
                }}>
                  {item.step}
                </span>
                <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.5 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      id: "metricas-avancadas",
      title: "Metricas Avancadas",
      icon: "10",
      content: (
        <>
          <p style={paragraphStyle}>
            As metricas classicas de ML (acuracia, F1) nao capturam a realidade operacional de sistemas
            antifraude. Metricas especializadas sao necessarias para avaliar performance real.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Metrica</th>
                  <th style={thStyle}>Definicao</th>
                  <th style={thStyle}>Target Tipico</th>
                  <th style={thStyle}>Por que Importa</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Detection Rate @ 1% FPR</td><td style={tdStyle}>% de fraudes detectadas com 1% de falsos positivos</td><td style={tdStyle}>&gt;80%</td><td style={tdStyle}>Metrica principal: quanta fraude pego sem irritar clientes?</td></tr>
                <tr><td style={tdStyle}>AUC-ROC</td><td style={tdStyle}>Area under ROC curve</td><td style={tdStyle}>&gt;0.95</td><td style={tdStyle}>Capacidade geral de discriminacao do modelo</td></tr>
                <tr><td style={tdStyle}>AUC-PR</td><td style={tdStyle}>Area under Precision-Recall curve</td><td style={tdStyle}>&gt;0.60</td><td style={tdStyle}>Melhor para datasets desbalanceados (fraude e rara)</td></tr>
                <tr><td style={tdStyle}>Value Detection Rate</td><td style={tdStyle}>% do valor em BRL de fraude detectada</td><td style={tdStyle}>&gt;90%</td><td style={tdStyle}>Fraudes de alto valor importam mais financeiramente</td></tr>
                <tr><td style={tdStyle}>False Positive Rate (FPR)</td><td style={tdStyle}>% de transacoes legitimas bloqueadas</td><td style={tdStyle}>&lt;1.5%</td><td style={tdStyle}>Impacto direto em receita e experiencia do cliente</td></tr>
                <tr><td style={tdStyle}>Manual Review Rate</td><td style={tdStyle}>% de transacoes enviadas para revisao</td><td style={tdStyle}>&lt;3%</td><td style={tdStyle}>Custo operacional do time de analistas</td></tr>
                <tr><td style={tdStyle}>Time to Detect (TTD)</td><td style={tdStyle}>Tempo entre fraude ocorrer e ser detectada</td><td style={tdStyle}>&lt;1 hora</td><td style={tdStyle}>Quanto mais rapido, menor o prejuizo</td></tr>
                <tr><td style={tdStyle}>Model Decay Rate</td><td style={tdStyle}>Velocidade de degradacao do modelo ao longo do tempo</td><td style={tdStyle}>&lt;2% AUC/mes</td><td style={tdStyle}>Indica necessidade de re-treinamento</td></tr>
              </tbody>
            </table>
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              A metrica que importa para o CFO
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Net Fraud Loss = Fraude nao detectada + Custo de falsos positivos + Custo operacional de revisao.
              O objetivo nao e minimizar fraude a zero (impossivel sem bloquear tudo), mas minimizar o Net
              Fraud Loss total. Um sistema que bloqueia menos fraude mas tem menos falsos positivos pode
              ter resultado financeiro superior.
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
          Deteccao Avancada de Fraude & ML
        </h1>
        <p className="page-description">
          Deep dive tecnico em machine learning para fraude: feature engineering, modelos,
          graph analysis, biometria comportamental, friendly fraud e metricas operacionais.
        </p>
      </header>

      {/* Learning Objectives */}
      <div className="learning-objectives" style={{ marginBottom: "1.5rem" }}>
        <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--primary)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          O que voce vai aprender
        </p>
        <ul>
          <li>Evolucao historica da deteccao de fraude: regras, scoring, ML, deep learning, grafos</li>
          <li>Como construir features de alta qualidade para modelos de fraude</li>
          <li>Comparativo de modelos ML: performance, latencia, interpretabilidade</li>
          <li>Graph analysis para deteccao de fraud rings e conluio</li>
          <li>Biometria comportamental e deteccao de Account Takeover</li>
          <li>Metricas avancadas alem de AUC-ROC: o que realmente importa em producao</li>
        </ul>
      </div>

      {/* Stats */}
      <div className="animate-fade-in stagger-1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>10</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Secoes</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>200+</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Features</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>6</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Modelos ML</div>
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
