"use client";

import Link from "next/link";
import { useState, useCallback, useEffect, useRef } from "react";
import { useGameProgress } from "@/hooks/useGameProgress";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface LogEntry {
  timestamp: string;
  level: "ERROR" | "WARN" | "INFO";
  message: string;
}

interface MetricSnapshot {
  authRate: number;
  latencyP99: number;
  errorRate: number;
  revenueImpact: number;
}

interface ActionDef {
  id: number;
  label: string;
  icon: string;
  timeCost: number;
  relevantTo: string[];
  resultText: string;
}

interface RootCauseOption {
  id: string;
  label: string;
}

interface MitigationOption {
  id: string;
  label: string;
}

interface Scenario {
  id: string;
  title: string;
  trigger: string;
  rootCauseId: string;
  correctMitigationId: string;
  icon: string;
  color: string;
  initialMetrics: MetricSnapshot;
  degradedMetrics: MetricSnapshot;
  recoveredMetrics: MetricSnapshot;
  initialLogs: LogEntry[];
  streamingLogs: LogEntry[];
  actionResults: Record<number, { logs: LogEntry[]; insight: string }>;
  rootCauseOptions: RootCauseOption[];
  mitigationOptions: MitigationOption[];
}

type Phase = "select" | "simulate" | "rootcause" | "mitigation" | "recovering" | "score";
type Grade = "S" | "A" | "B" | "C" | "D";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const ACTIONS: ActionDef[] = [
  { id: 1, label: "Verificar saude dos adquirentes", icon: "\u{1F3E6}", timeCost: 8, relevantTo: ["auth-drop", "acquirer-down"], resultText: "" },
  { id: 2, label: "Checar logs de erro do gateway", icon: "\u{1F4CB}", timeCost: 6, relevantTo: ["auth-drop", "latency-spike", "acquirer-down"], resultText: "" },
  { id: 3, label: "Verificar regras de fraude", icon: "\u{1F6E1}", timeCost: 7, relevantTo: ["fraud-spike"], resultText: "" },
  { id: 4, label: "Testar conectividade de rede", icon: "\u{1F310}", timeCost: 5, relevantTo: ["acquirer-down"], resultText: "" },
  { id: 5, label: "Verificar pool de conexoes DB", icon: "\u{1F5C4}", timeCost: 6, relevantTo: ["latency-spike"], resultText: "" },
  { id: 6, label: "Analisar padroes de BIN", icon: "\u{1F50D}", timeCost: 8, relevantTo: ["fraud-spike"], resultText: "" },
  { id: 7, label: "Comparar arquivos de clearing", icon: "\u{1F4C4}", timeCost: 10, relevantTo: ["settlement-mismatch"], resultText: "" },
  { id: 8, label: "Ativar rota de failover", icon: "\u{26A1}", timeCost: 4, relevantTo: ["auth-drop", "acquirer-down"], resultText: "" },
];

const SCENARIOS: Scenario[] = [
  {
    id: "auth-drop",
    title: "Auth Rate Drop",
    trigger: "Auth rate caiu de 85% para 40%",
    rootCauseId: "ssl-cert",
    correctMitigationId: "failover",
    icon: "\u{1F4C9}",
    color: "#EF4444",
    initialMetrics: { authRate: 85, latencyP99: 800, errorRate: 2, revenueImpact: 0 },
    degradedMetrics: { authRate: 40, latencyP99: 2200, errorRate: 45, revenueImpact: 12500 },
    recoveredMetrics: { authRate: 82, latencyP99: 850, errorRate: 3, revenueImpact: 200 },
    initialLogs: [
      { timestamp: "14:27:00", level: "ERROR", message: "=== ALERTA SEV-1: AUTH RATE DROP ===" },
      { timestamp: "14:27:01", level: "ERROR", message: "Auth rate caiu de 85% para 40% nos ultimos 5 min" },
      { timestamp: "14:27:02", level: "WARN", message: "12.000 transacoes impactadas. Merchants reportando falhas." },
      { timestamp: "14:27:03", level: "INFO", message: "On-call engineer notificado. Iniciando investigacao." },
    ],
    streamingLogs: [
      { timestamp: "14:27:10", level: "ERROR", message: "Adquirente A: response code 91 (Issuer Unavailable) — 85% dos requests" },
      { timestamp: "14:27:15", level: "WARN", message: "SSL handshake timeout em 3 de 5 endpoints do Adquirente A" },
      { timestamp: "14:27:22", level: "ERROR", message: "Transacao TXN-88291 falhou: connection reset by peer (Adquirente A)" },
      { timestamp: "14:27:30", level: "INFO", message: "Health check Adquirente B: OK (latency 120ms)" },
      { timestamp: "14:27:35", level: "ERROR", message: "Certificate verify failed: unable to get local issuer certificate" },
      { timestamp: "14:27:42", level: "WARN", message: "Retry queue crescendo: 3.200 transacoes pendentes" },
      { timestamp: "14:27:50", level: "INFO", message: "CPU gateway: 45% | Memory: 62% — infraestrutura propria OK" },
      { timestamp: "14:27:55", level: "ERROR", message: "Adquirente A: TLS certificate expired 2h ago" },
      { timestamp: "14:28:05", level: "WARN", message: "Revenue impact estimado: R$12.500/min" },
      { timestamp: "14:28:12", level: "ERROR", message: "Mais 1.500 transacoes falharam no ultimo minuto" },
      { timestamp: "14:28:20", level: "INFO", message: "Bandeiras Visa/Master: status operacional normal" },
      { timestamp: "14:28:28", level: "WARN", message: "Adquirente A nao respondendo a health checks desde 14:25" },
      { timestamp: "14:28:35", level: "ERROR", message: "Timeout em batch de 500 transacoes — dropping to fallback queue" },
      { timestamp: "14:28:42", level: "INFO", message: "Database latency: 12ms — DB nao e o problema" },
    ],
    actionResults: {
      1: { logs: [
        { timestamp: "--:--", level: "INFO", message: "Conectando ao dashboard de adquirentes..." },
        { timestamp: "--:--", level: "ERROR", message: "ADQUIRENTE A: Auth rate 15% | SSL errors em 85% dos requests" },
        { timestamp: "--:--", level: "INFO", message: "ADQUIRENTE B: Auth rate 83% — operando normalmente" },
      ], insight: "Adquirente A apresenta falhas massivas de SSL. Certificado possivelmente expirado." },
      2: { logs: [
        { timestamp: "--:--", level: "INFO", message: "Analisando logs do gateway..." },
        { timestamp: "--:--", level: "ERROR", message: "4.200 erros SSL_HANDSHAKE_FAILED nos ultimos 10 min" },
        { timestamp: "--:--", level: "WARN", message: "Todos os erros apontam para endpoints do Adquirente A" },
      ], insight: "Logs confirmam falha de handshake SSL concentrada no Adquirente A." },
      3: { logs: [
        { timestamp: "--:--", level: "INFO", message: "Verificando regras antifraude..." },
        { timestamp: "--:--", level: "INFO", message: "42 regras ativas. Nenhuma alteracao recente." },
      ], insight: "Regras de fraude estao normais. Nao e a causa do problema." },
      4: { logs: [
        { timestamp: "--:--", level: "INFO", message: "Testando conectividade de rede..." },
        { timestamp: "--:--", level: "INFO", message: "Ping para Adquirente A: OK (latency 45ms)" },
        { timestamp: "--:--", level: "INFO", message: "Rede OK — problema e na camada de aplicacao/TLS." },
      ], insight: "Conectividade de rede esta OK. O problema e em nivel de TLS/SSL." },
      5: { logs: [
        { timestamp: "--:--", level: "INFO", message: "Pool de conexoes: 45/200 ativas. Saudavel." },
      ], insight: "Pool de conexoes DB esta saudavel. Nao relacionado ao incidente." },
      6: { logs: [
        { timestamp: "--:--", level: "INFO", message: "Padroes de BIN normais. Sem anomalias." },
      ], insight: "Analise de BIN nao mostra anomalias. Direcao errada." },
      7: { logs: [
        { timestamp: "--:--", level: "INFO", message: "Arquivos de clearing recentes: OK" },
      ], insight: "Clearing files sem problemas. Nao e o foco deste incidente." },
      8: { logs: [
        { timestamp: "--:--", level: "INFO", message: "Ativando rota de failover para Adquirente B..." },
        { timestamp: "--:--", level: "INFO", message: "Failover ativado. Trafego redirecionado." },
      ], insight: "Failover ativado! Trafego redirecionado para Adquirente B." },
    },
    rootCauseOptions: [
      { id: "ssl-cert", label: "Certificado SSL do adquirente principal expirado" },
      { id: "network", label: "Falha de rede no datacenter do gateway" },
      { id: "db-pool", label: "Pool de conexoes do banco de dados esgotado" },
      { id: "fraud-rule", label: "Regra de fraude bloqueando transacoes legitimas" },
    ],
    mitigationOptions: [
      { id: "failover", label: "Ativar failover para adquirente secundario" },
      { id: "restart", label: "Reiniciar servicos do gateway" },
      { id: "rollback", label: "Rollback do ultimo deploy" },
    ],
  },
  {
    id: "latency-spike",
    title: "Latency Spike",
    trigger: "P99 latencia subiu de 800ms para 12s",
    rootCauseId: "db-pool",
    correctMitigationId: "increase-pool",
    icon: "\u{23F1}",
    color: "#F59E0B",
    initialMetrics: { authRate: 84, latencyP99: 800, errorRate: 3, revenueImpact: 0 },
    degradedMetrics: { authRate: 65, latencyP99: 12000, errorRate: 22, revenueImpact: 8500 },
    recoveredMetrics: { authRate: 83, latencyP99: 820, errorRate: 3.5, revenueImpact: 150 },
    initialLogs: [
      { timestamp: "10:15:00", level: "ERROR", message: "=== ALERTA SEV-1: LATENCY SPIKE ===" },
      { timestamp: "10:15:01", level: "ERROR", message: "P99 latencia: 12.000ms (normal: 800ms)" },
      { timestamp: "10:15:02", level: "WARN", message: "Timeouts crescendo. 30% das transacoes acima de 10s." },
      { timestamp: "10:15:03", level: "INFO", message: "Investigacao iniciada pelo time de plantao." },
    ],
    streamingLogs: [
      { timestamp: "10:15:10", level: "ERROR", message: "Connection pool: 200/200 conexoes em uso — ESGOTADO" },
      { timestamp: "10:15:18", level: "WARN", message: "Thread wait queue: 450 threads aguardando conexao DB" },
      { timestamp: "10:15:25", level: "ERROR", message: "Query timeout: SELECT * FROM transactions WHERE... (>10s)" },
      { timestamp: "10:15:32", level: "INFO", message: "CPU: 35% | Memory: 71% — nao e problema de hardware" },
      { timestamp: "10:15:40", level: "ERROR", message: "Slow query log: 12 queries acima de 5s no ultimo minuto" },
      { timestamp: "10:15:48", level: "WARN", message: "Adquirentes respondendo normalmente (avg 150ms)" },
      { timestamp: "10:15:55", level: "ERROR", message: "HikariPool-1: Connection is not available, request timed out after 30000ms" },
      { timestamp: "10:16:05", level: "INFO", message: "Ultimo deploy: 8h atras. Sem correlacao." },
      { timestamp: "10:16:12", level: "WARN", message: "Novas conexoes DB falhando: too many connections" },
      { timestamp: "10:16:20", level: "ERROR", message: "Transaction processing queue backup: 2.800 pendentes" },
      { timestamp: "10:16:28", level: "INFO", message: "Network latency to DB: 2ms — rede OK" },
      { timestamp: "10:16:35", level: "ERROR", message: "OOM warning em worker-thread-pool-3: heap space" },
      { timestamp: "10:16:42", level: "WARN", message: "Retry storm detectado: transacoes sendo reenviadas apos timeout" },
      { timestamp: "10:16:50", level: "ERROR", message: "DB active connections: 200 (max: 200) — sem margem" },
    ],
    actionResults: {
      1: { logs: [
        { timestamp: "--:--", level: "INFO", message: "Adquirentes A e B: operando normalmente. Latencia < 200ms." },
      ], insight: "Adquirentes estao saudaveis. Problema e interno." },
      2: { logs: [
        { timestamp: "--:--", level: "INFO", message: "Analisando logs do gateway..." },
        { timestamp: "--:--", level: "ERROR", message: "Milhares de erros 'Connection pool exhausted'" },
        { timestamp: "--:--", level: "WARN", message: "Todas as 200 conexoes DB ocupadas." },
      ], insight: "Logs confirmam esgotamento do pool de conexoes do banco." },
      3: { logs: [
        { timestamp: "--:--", level: "INFO", message: "Regras de fraude: sem alteracoes. Nao e a causa." },
      ], insight: "Fraude descartada como causa." },
      4: { logs: [
        { timestamp: "--:--", level: "INFO", message: "Rede OK. Latencia entre servicos < 5ms." },
      ], insight: "Rede esta operando normalmente." },
      5: { logs: [
        { timestamp: "--:--", level: "ERROR", message: "DB Connection Pool: 200/200 (100% utilizado)" },
        { timestamp: "--:--", level: "ERROR", message: "Wait queue: 450 threads. Avg wait: 8.5s" },
        { timestamp: "--:--", level: "WARN", message: "Pool nao esta liberando conexoes — possivel leak ou queries lentas" },
      ], insight: "CONFIRMADO: Pool de conexoes DB completamente esgotado. 450 threads na fila." },
      6: { logs: [
        { timestamp: "--:--", level: "INFO", message: "Padroes de BIN: distribuicao normal." },
      ], insight: "BIN analysis normal. Nao relevante para latencia." },
      7: { logs: [
        { timestamp: "--:--", level: "INFO", message: "Clearing files: sem anomalias." },
      ], insight: "Clearing OK. Nao e foco deste incidente." },
      8: { logs: [
        { timestamp: "--:--", level: "WARN", message: "Failover ativado, mas latencia persiste — problema e interno." },
      ], insight: "Failover nao resolve — o problema e no banco de dados interno." },
    },
    rootCauseOptions: [
      { id: "db-pool", label: "Database connection pool esgotado" },
      { id: "ssl-cert", label: "Certificado SSL expirado" },
      { id: "ddos", label: "Ataque DDoS em andamento" },
      { id: "memory-leak", label: "Memory leak no servico de auth" },
    ],
    mitigationOptions: [
      { id: "increase-pool", label: "Aumentar pool size e matar queries lentas" },
      { id: "restart", label: "Reiniciar todos os pods do gateway" },
      { id: "scale-out", label: "Escalar horizontalmente os workers" },
    ],
  },
  {
    id: "fraud-spike",
    title: "Fraud Spike",
    trigger: "Fraud rate subiu de 0.5% para 8% em 2h",
    rootCauseId: "bin-attack",
    correctMitigationId: "block-bins",
    icon: "\u{1F6A8}",
    color: "#DC2626",
    initialMetrics: { authRate: 84, latencyP99: 790, errorRate: 8, revenueImpact: 0 },
    degradedMetrics: { authRate: 78, latencyP99: 950, errorRate: 15, revenueImpact: 45000 },
    recoveredMetrics: { authRate: 83, latencyP99: 800, errorRate: 3, revenueImpact: 500 },
    initialLogs: [
      { timestamp: "03:12:00", level: "ERROR", message: "=== ALERTA SEV-1: FRAUD SPIKE ===" },
      { timestamp: "03:12:01", level: "ERROR", message: "Fraud rate subiu de 0.5% para 8% nas ultimas 2h" },
      { timestamp: "03:12:02", level: "WARN", message: "Chargebacks projetados: R$450K se nao mitigado." },
      { timestamp: "03:12:03", level: "INFO", message: "Time de fraude notificado. Analise iniciada." },
    ],
    streamingLogs: [
      { timestamp: "03:12:10", level: "ERROR", message: "523 transacoes fraudulentas detectadas na ultima hora" },
      { timestamp: "03:12:18", level: "WARN", message: "Concentracao em BIN range 411111-411115 (78% das fraudes)" },
      { timestamp: "03:12:25", level: "ERROR", message: "Multiplas tentativas por segundo do mesmo BIN: pattern de BIN attack" },
      { timestamp: "03:12:32", level: "INFO", message: "Velocidade de tentativas: 45/min em BINs suspeitos" },
      { timestamp: "03:12:40", level: "ERROR", message: "Cartoes gerados sequencialmente: 4111-1100-0001 ate 4111-1100-9999" },
      { timestamp: "03:12:48", level: "WARN", message: "IP de origem: 3 IPs concentrando 90% do trafego fraudulento" },
      { timestamp: "03:12:55", level: "INFO", message: "Adquirentes: operando normalmente. Problema nao e de infra." },
      { timestamp: "03:13:05", level: "ERROR", message: "Valores das fraudes: R$1 a R$5 (teste de cartao) + R$500-2000 (monetizacao)" },
      { timestamp: "03:13:12", level: "WARN", message: "Regra de velocity check: threshold de 10/min por BIN — atacante enviando 9/min" },
      { timestamp: "03:13:20", level: "ERROR", message: "+87 transacoes fraudulentas nos ultimos 3 minutos" },
      { timestamp: "03:13:28", level: "INFO", message: "DB e gateway: latencia normal" },
      { timestamp: "03:13:35", level: "WARN", message: "Merchant MID-4421 recebendo 60% das fraudes — possivel conluio" },
      { timestamp: "03:13:42", level: "ERROR", message: "Chargebacks ja registrados: R$32.000 hoje" },
      { timestamp: "03:13:50", level: "WARN", message: "BIN attack classico: enumeration + testing + monetization" },
    ],
    actionResults: {
      1: { logs: [
        { timestamp: "--:--", level: "INFO", message: "Adquirentes saudaveis. Problema nao e de infra." },
      ], insight: "Adquirentes OK. Problema e de fraude, nao infraestrutura." },
      2: { logs: [
        { timestamp: "--:--", level: "INFO", message: "Gateway logs: alto volume de small-value transactions." },
        { timestamp: "--:--", level: "WARN", message: "Pattern: tentativas rapidas com cartoes sequenciais." },
      ], insight: "Logs mostram pattern de teste de cartao em alta velocidade." },
      3: { logs: [
        { timestamp: "--:--", level: "WARN", message: "Velocity check: threshold 10/min — atacante enviando 9/min (abaixo)" },
        { timestamp: "--:--", level: "ERROR", message: "Regra de BIN nao tem blacklist atualizada para BINs comprometidos" },
        { timestamp: "--:--", level: "INFO", message: "Score-based rules: nao capturam BIN attack pattern" },
      ], insight: "Regras de fraude tem gap: velocity threshold muito alto e sem BIN blacklist." },
      4: { logs: [
        { timestamp: "--:--", level: "INFO", message: "Rede operando normalmente." },
      ], insight: "Rede OK. Irrelevante para fraude." },
      5: { logs: [
        { timestamp: "--:--", level: "INFO", message: "DB pool: saudavel. 60/200 conexoes." },
      ], insight: "DB OK. Nao relacionado." },
      6: { logs: [
        { timestamp: "--:--", level: "ERROR", message: "BIN range 411111-411115: 523 transacoes em 2h (normal: 12)" },
        { timestamp: "--:--", level: "ERROR", message: "Cartoes sequenciais detectados: 4111-1100-XXXX" },
        { timestamp: "--:--", level: "WARN", message: "3 IPs concentram 90% do trafego suspeito" },
      ], insight: "CONFIRMADO: BIN attack em andamento. Range 411111-411115 com cartoes sequenciais." },
      7: { logs: [
        { timestamp: "--:--", level: "INFO", message: "Clearing files normais." },
      ], insight: "Clearing OK. Nao relevante." },
      8: { logs: [
        { timestamp: "--:--", level: "WARN", message: "Failover ativado, mas fraude continua — problema nao e de roteamento." },
      ], insight: "Failover nao ajuda contra fraude. Acao incorreta." },
    },
    rootCauseOptions: [
      { id: "bin-attack", label: "BIN attack em andamento (enumeracao de cartoes)" },
      { id: "rule-change", label: "Mudanca recente em regras de fraude" },
      { id: "merchant-fraud", label: "Fraude do proprio merchant" },
      { id: "data-breach", label: "Vazamento de dados de cartoes" },
    ],
    mitigationOptions: [
      { id: "block-bins", label: "Bloquear BIN range comprometido e IPs suspeitos" },
      { id: "lower-threshold", label: "Reduzir threshold de velocity check para 3/min" },
      { id: "block-merchant", label: "Suspender merchant MID-4421" },
    ],
  },
  {
    id: "settlement-mismatch",
    title: "Settlement Mismatch",
    trigger: "Reconciliacao com diferenca de R$450K",
    rootCauseId: "duplicate-clearing",
    correctMitigationId: "dedup-reprocess",
    icon: "\u{1F4B0}",
    color: "#8B5CF6",
    initialMetrics: { authRate: 84, latencyP99: 810, errorRate: 2.5, revenueImpact: 0 },
    degradedMetrics: { authRate: 84, latencyP99: 810, errorRate: 2.5, revenueImpact: 450000 },
    recoveredMetrics: { authRate: 84, latencyP99: 810, errorRate: 2.5, revenueImpact: 0 },
    initialLogs: [
      { timestamp: "08:00:00", level: "ERROR", message: "=== ALERTA: SETTLEMENT MISMATCH ===" },
      { timestamp: "08:00:01", level: "ERROR", message: "Reconciliacao D-1: diferenca de R$450.000 detectada" },
      { timestamp: "08:00:02", level: "WARN", message: "Arquivo de clearing com 15.230 registros (esperado: ~12.000)" },
      { timestamp: "08:00:03", level: "INFO", message: "Time de financas notificado. Analise iniciada." },
    ],
    streamingLogs: [
      { timestamp: "08:00:10", level: "ERROR", message: "Diferenca concentrada em batch ID BATCH-20250324-002" },
      { timestamp: "08:00:18", level: "WARN", message: "3.230 registros a mais que o esperado no clearing file" },
      { timestamp: "08:00:25", level: "INFO", message: "Checksum do arquivo: nao bate com expected hash" },
      { timestamp: "08:00:32", level: "ERROR", message: "Registros duplicados encontrados: mesmo TXN_ID aparece 2x" },
      { timestamp: "08:00:40", level: "WARN", message: "Duplicatas concentradas entre 22:00 e 23:30 de ontem" },
      { timestamp: "08:00:48", level: "INFO", message: "Adquirente A: confirmou envio unico do arquivo" },
      { timestamp: "08:00:55", level: "ERROR", message: "Parser de clearing teve retry apos timeout — pode ter processado 2x" },
      { timestamp: "08:01:05", level: "WARN", message: "Log do parser: 'Connection reset during batch write, retrying...'" },
      { timestamp: "08:01:12", level: "INFO", message: "Transacoes auth/capture: totais normais no nosso lado" },
      { timestamp: "08:01:20", level: "ERROR", message: "Settlement amount: R$2.450.000 (esperado: R$2.000.000)" },
      { timestamp: "08:01:28", level: "WARN", message: "Nenhuma anomalia em fraud rate ou auth rate" },
      { timestamp: "08:01:35", level: "INFO", message: "DB queries retornando registros duplicados em settlements table" },
      { timestamp: "08:01:42", level: "ERROR", message: "UNIQUE constraint nao aplicado em clearing_records.txn_id" },
      { timestamp: "08:01:50", level: "WARN", message: "Reprocessamento do arquivo gerou inserts duplicados" },
    ],
    actionResults: {
      1: { logs: [
        { timestamp: "--:--", level: "INFO", message: "Adquirentes OK. Settlement amounts conferem do lado deles." },
      ], insight: "Adquirentes confirmam valores corretos. Problema e no nosso processamento." },
      2: { logs: [
        { timestamp: "--:--", level: "WARN", message: "Gateway logs mostram retry em batch processing ontem as 22:15." },
        { timestamp: "--:--", level: "ERROR", message: "Clearing parser: timeout + retry = processamento duplicado." },
      ], insight: "Logs revelam que parser de clearing fez retry e processou registros 2x." },
      3: { logs: [
        { timestamp: "--:--", level: "INFO", message: "Fraude: nao relacionada a settlement mismatch." },
      ], insight: "Fraude nao e a causa. Problema e de reconciliacao." },
      4: { logs: [
        { timestamp: "--:--", level: "INFO", message: "Rede OK." },
      ], insight: "Rede irrelevante para este caso." },
      5: { logs: [
        { timestamp: "--:--", level: "INFO", message: "DB pool saudavel. Mas tabela settlements sem UNIQUE constraint!" },
      ], insight: "Pool OK, mas falta constraint UNIQUE na tabela de settlements." },
      6: { logs: [
        { timestamp: "--:--", level: "INFO", message: "BIN patterns: normal. Nao e fraude." },
      ], insight: "BIN analysis irrelevante aqui." },
      7: { logs: [
        { timestamp: "--:--", level: "ERROR", message: "Arquivo clearing: 15.230 registros. Esperado: 12.000." },
        { timestamp: "--:--", level: "ERROR", message: "3.230 registros DUPLICADOS (mesmo TXN_ID, mesmo valor)" },
        { timestamp: "--:--", level: "WARN", message: "Duplicatas geradas por retry do parser apos timeout" },
      ], insight: "CONFIRMADO: Arquivo de clearing com 3.230 registros duplicados por retry do parser." },
      8: { logs: [
        { timestamp: "--:--", level: "INFO", message: "Failover irrelevante para settlement mismatch." },
      ], insight: "Failover nao se aplica a este tipo de incidente." },
    },
    rootCauseOptions: [
      { id: "duplicate-clearing", label: "Arquivo de clearing com registros duplicados (parser retry)" },
      { id: "acquirer-error", label: "Adquirente enviou arquivo incorreto" },
      { id: "fx-rate", label: "Erro de taxa de cambio na conversao" },
      { id: "missing-refunds", label: "Refunds nao contabilizados na reconciliacao" },
    ],
    mitigationOptions: [
      { id: "dedup-reprocess", label: "Deduplicar registros e reprocessar settlement" },
      { id: "manual-adjust", label: "Ajuste manual de R$450K no ledger" },
      { id: "request-new-file", label: "Solicitar novo arquivo ao adquirente" },
    ],
  },
  {
    id: "acquirer-down",
    title: "Acquirer Down",
    trigger: "Adquirente principal retornando 100% timeout",
    rootCauseId: "datacenter-network",
    correctMitigationId: "full-failover",
    icon: "\u{1F6AB}",
    color: "#EF4444",
    initialMetrics: { authRate: 85, latencyP99: 780, errorRate: 2, revenueImpact: 0 },
    degradedMetrics: { authRate: 12, latencyP99: 30000, errorRate: 72, revenueImpact: 28000 },
    recoveredMetrics: { authRate: 80, latencyP99: 900, errorRate: 4, revenueImpact: 800 },
    initialLogs: [
      { timestamp: "19:45:00", level: "ERROR", message: "=== ALERTA SEV-1: ACQUIRER DOWN ===" },
      { timestamp: "19:45:01", level: "ERROR", message: "Adquirente A: 100% timeout. Zero transacoes aprovadas." },
      { timestamp: "19:45:02", level: "WARN", message: "80% do trafego impactado. Revenue loss imediato." },
      { timestamp: "19:45:03", level: "INFO", message: "Escalacao automatica acionada. All-hands." },
    ],
    streamingLogs: [
      { timestamp: "19:45:10", level: "ERROR", message: "Adquirente A: connection timeout em todos os 5 endpoints" },
      { timestamp: "19:45:18", level: "ERROR", message: "TCP handshake falhando — host unreachable" },
      { timestamp: "19:45:25", level: "WARN", message: "Traceroute para Adquirente A: packet loss 100% apos hop 12" },
      { timestamp: "19:45:32", level: "INFO", message: "Status page Adquirente A: 'Investigating connectivity issues'" },
      { timestamp: "19:45:40", level: "ERROR", message: "Fila de retry: 12.000 transacoes e crescendo" },
      { timestamp: "19:45:48", level: "WARN", message: "Adquirente B: operacional mas com capacity para apenas 40% do volume" },
      { timestamp: "19:45:55", level: "ERROR", message: "Merchants grandes (Merchant-001, Merchant-005) ligando para suporte" },
      { timestamp: "19:46:05", level: "INFO", message: "Nossa infra: CPU 25%, Mem 55%, DB 8ms — tudo saudavel" },
      { timestamp: "19:46:12", level: "ERROR", message: "Perda estimada: R$28.000/min enquanto Adquirente A offline" },
      { timestamp: "19:46:20", level: "WARN", message: "BGP route para datacenter do Adquirente A: withdrawn" },
      { timestamp: "19:46:28", level: "ERROR", message: "Nenhum endpoint do Adquirente A respondendo (primary + backup)" },
      { timestamp: "19:46:35", level: "INFO", message: "Adquirente A Twitter: 'Problemas de rede no datacenter SP-1'" },
      { timestamp: "19:46:42", level: "WARN", message: "ETA de recuperacao desconhecido" },
      { timestamp: "19:46:50", level: "ERROR", message: "Total de transacoes falhadas: 45.000 em 2 minutos" },
    ],
    actionResults: {
      1: { logs: [
        { timestamp: "--:--", level: "ERROR", message: "ADQUIRENTE A: OFFLINE. Todos endpoints timeout." },
        { timestamp: "--:--", level: "INFO", message: "ADQUIRENTE B: Operacional. Capacity limitada a 40% volume total." },
      ], insight: "Adquirente A completamente offline. Adquirente B operacional mas com capacidade limitada." },
      2: { logs: [
        { timestamp: "--:--", level: "ERROR", message: "100% dos requests para Adquirente A: connection timeout" },
        { timestamp: "--:--", level: "WARN", message: "Nenhum response code — conexao nem chega a ser estabelecida" },
      ], insight: "Gateway nao consegue nem abrir conexao com Adquirente A." },
      3: { logs: [
        { timestamp: "--:--", level: "INFO", message: "Fraude: sem anomalias. Nao e a causa." },
      ], insight: "Regras de fraude normais. Irrelevante." },
      4: { logs: [
        { timestamp: "--:--", level: "ERROR", message: "Ping Adquirente A: 100% packet loss" },
        { timestamp: "--:--", level: "ERROR", message: "Traceroute: falha apos hop 12 (edge do datacenter SP-1)" },
        { timestamp: "--:--", level: "WARN", message: "BGP route withdrawn — datacenter isolado da internet" },
      ], insight: "CONFIRMADO: Problema de rede no datacenter do Adquirente A. BGP route withdrawn." },
      5: { logs: [
        { timestamp: "--:--", level: "INFO", message: "DB pool: saudavel. Problema e externo." },
      ], insight: "DB OK. Problema e no adquirente, nao interno." },
      6: { logs: [
        { timestamp: "--:--", level: "INFO", message: "BIN patterns: normal." },
      ], insight: "BIN analysis normal. Nao relevante." },
      7: { logs: [
        { timestamp: "--:--", level: "INFO", message: "Clearing: sem pendencias." },
      ], insight: "Clearing irrelevante para este incidente." },
      8: { logs: [
        { timestamp: "--:--", level: "INFO", message: "Failover ativado! Todo trafego -> Adquirente B." },
        { timestamp: "--:--", level: "WARN", message: "Adquirente B operando em 95% de capacity. Monitorar de perto." },
      ], insight: "Failover ativado com sucesso. Adquirente B absorvendo o trafego." },
    },
    rootCauseOptions: [
      { id: "datacenter-network", label: "Datacenter do adquirente com problema de rede" },
      { id: "our-firewall", label: "Nosso firewall bloqueando trafego ao adquirente" },
      { id: "dns-failure", label: "Falha de DNS na resolucao do adquirente" },
      { id: "ssl-renewal", label: "Renovacao automatica de SSL falhou" },
    ],
    mitigationOptions: [
      { id: "full-failover", label: "Failover completo para adquirente secundario" },
      { id: "partial-routing", label: "Roteamento parcial 50/50 entre adquirentes" },
      { id: "queue-retry", label: "Enfileirar transacoes e fazer retry em 5 minutos" },
    ],
  },
];

function fmtTimer(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function lerp(from: number, to: number, t: number): number {
  return from + (to - from) * Math.min(t, 1);
}

function computeGrade(time: number, actionsTaken: number, unnecessary: number, correctCause: boolean, correctMitigation: boolean): Grade {
  if (!correctCause || !correctMitigation) return "D";
  const score = 100 - (time / 2) - (unnecessary * 8) - (actionsTaken * 2);
  if (score >= 80) return "S";
  if (score >= 60) return "A";
  if (score >= 40) return "B";
  if (score >= 20) return "C";
  return "D";
}

const GRADE_XP: Record<Grade, number> = { S: 25, A: 20, B: 15, C: 10, D: 5 };
const GRADE_COLORS: Record<Grade, string> = { S: "#10B981", A: "#3B82F6", B: "#F59E0B", C: "#F97316", D: "#EF4444" };

const LOG_LEVEL_COLORS: Record<string, string> = {
  ERROR: "#EF4444",
  WARN: "#F59E0B",
  INFO: "#60A5FA",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function IncidentSimulator() {
  const [phase, setPhase] = useState<Phase>("select");
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [metrics, setMetrics] = useState<MetricSnapshot>({ authRate: 85, latencyP99: 800, errorRate: 2, revenueImpact: 0 });
  const [actionsTaken, setActionsTaken] = useState<number[]>([]);
  const [actionDialogOpen, setActionDialogOpen] = useState<number | null>(null);
  const [selectedCause, setSelectedCause] = useState<string | null>(null);
  const [selectedMitigation, setSelectedMitigation] = useState<string | null>(null);
  const [correctCause, setCorrectCause] = useState(false);
  const [correctMitigation, setCorrectMitigation] = useState(false);
  const [recoveryProgress, setRecoveryProgress] = useState(0);
  const [showXpToast, setShowXpToast] = useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const logStreamRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const metricDegRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recoveryRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const logIndexRef = useRef(0);
  const xpAwardedRef = useRef(false);
  const { recordQuiz, visitPage } = useGameProgress();

  useEffect(() => {
    visitPage("/labs/incident-simulator");
  }, [visitPage]);

  // Auto-scroll logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Cleanup all intervals on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (logStreamRef.current) clearInterval(logStreamRef.current);
      if (metricDegRef.current) clearInterval(metricDegRef.current);
      if (recoveryRef.current) clearInterval(recoveryRef.current);
    };
  }, []);

  const startScenario = useCallback((sc: Scenario) => {
    setScenario(sc);
    setPhase("simulate");
    setElapsedSec(0);
    setLogs([...sc.initialLogs]);
    setMetrics({ ...sc.initialMetrics });
    setActionsTaken([]);
    setActionDialogOpen(null);
    setSelectedCause(null);
    setSelectedMitigation(null);
    setCorrectCause(false);
    setCorrectMitigation(false);
    setRecoveryProgress(0);
    logIndexRef.current = 0;
    xpAwardedRef.current = false;

    // Timer
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setElapsedSec((s) => s + 1);
    }, 1000);

    // Streaming logs every 3 seconds
    if (logStreamRef.current) clearInterval(logStreamRef.current);
    logStreamRef.current = setInterval(() => {
      setScenario((currentSc) => {
        if (!currentSc) return currentSc;
        const idx = logIndexRef.current;
        if (idx < currentSc.streamingLogs.length) {
          setLogs((prev) => [...prev, currentSc.streamingLogs[idx]]);
          logIndexRef.current = idx + 1;
        } else {
          // Loop logs with variation
          logIndexRef.current = 0;
        }
        return currentSc;
      });
    }, 3000);

    // Metrics degradation every 2 seconds
    if (metricDegRef.current) clearInterval(metricDegRef.current);
    let degradationStep = 0;
    metricDegRef.current = setInterval(() => {
      degradationStep++;
      const t = Math.min(degradationStep / 15, 1); // degrade over ~30 seconds
      setScenario((currentSc) => {
        if (!currentSc) return currentSc;
        setMetrics({
          authRate: Math.round(lerp(currentSc.initialMetrics.authRate, currentSc.degradedMetrics.authRate, t) * 10) / 10,
          latencyP99: Math.round(lerp(currentSc.initialMetrics.latencyP99, currentSc.degradedMetrics.latencyP99, t)),
          errorRate: Math.round(lerp(currentSc.initialMetrics.errorRate, currentSc.degradedMetrics.errorRate, t) * 10) / 10,
          revenueImpact: Math.round(lerp(currentSc.initialMetrics.revenueImpact, currentSc.degradedMetrics.revenueImpact, t)),
        });
        return currentSc;
      });
    }, 2000);
  }, []);

  const handleAction = useCallback((actionId: number) => {
    if (!scenario) return;
    if (actionsTaken.includes(actionId)) return;

    setActionsTaken((prev) => [...prev, actionId]);
    setElapsedSec((s) => s + (ACTIONS.find((a) => a.id === actionId)?.timeCost || 0));

    const result = scenario.actionResults[actionId];
    if (result) {
      setLogs((prev) => [
        ...prev,
        { timestamp: "--:--", level: "INFO", message: "--- Executando: " + (ACTIONS.find((a) => a.id === actionId)?.label || "") + " ---" },
        ...result.logs,
      ]);
      setActionDialogOpen(actionId);
    }
  }, [scenario, actionsTaken]);

  const goToRootCause = useCallback(() => {
    setActionDialogOpen(null);
    setPhase("rootcause");
  }, []);

  const submitRootCause = useCallback(() => {
    if (!scenario || !selectedCause) return;
    const isCorrect = selectedCause === scenario.rootCauseId;
    setCorrectCause(isCorrect);
    if (isCorrect) {
      setLogs((prev) => [...prev, { timestamp: "--:--", level: "INFO", message: ">>> CAUSA RAIZ IDENTIFICADA CORRETAMENTE! <<<" }]);
    } else {
      setLogs((prev) => [...prev, { timestamp: "--:--", level: "ERROR", message: "Causa raiz incorreta. Tente novamente..." }]);
    }
    setPhase("mitigation");
  }, [scenario, selectedCause]);

  const submitMitigation = useCallback(() => {
    if (!scenario || !selectedMitigation) return;
    const isCorrect = selectedMitigation === scenario.correctMitigationId;
    setCorrectMitigation(isCorrect);

    // Stop degradation
    if (metricDegRef.current) clearInterval(metricDegRef.current);

    if (isCorrect) {
      setLogs((prev) => [...prev, { timestamp: "--:--", level: "INFO", message: ">>> MITIGACAO APLICADA! Metricas recuperando... <<<" }]);
      setPhase("recovering");

      // Recovery animation
      let recStep = 0;
      if (recoveryRef.current) clearInterval(recoveryRef.current);
      recoveryRef.current = setInterval(() => {
        recStep++;
        const t = recStep / 10;
        setRecoveryProgress(Math.min(t * 100, 100));
        setScenario((currentSc) => {
          if (!currentSc) return currentSc;
          setMetrics({
            authRate: Math.round(lerp(currentSc.degradedMetrics.authRate, currentSc.recoveredMetrics.authRate, t) * 10) / 10,
            latencyP99: Math.round(lerp(currentSc.degradedMetrics.latencyP99, currentSc.recoveredMetrics.latencyP99, t)),
            errorRate: Math.round(lerp(currentSc.degradedMetrics.errorRate, currentSc.recoveredMetrics.errorRate, t) * 10) / 10,
            revenueImpact: Math.round(lerp(currentSc.degradedMetrics.revenueImpact, currentSc.recoveredMetrics.revenueImpact, t)),
          });
          return currentSc;
        });
        if (recStep >= 10) {
          if (recoveryRef.current) clearInterval(recoveryRef.current);
          // Go to score after a delay
          setTimeout(() => finishSimulation(), 1500);
        }
      }, 500);
    } else {
      setLogs((prev) => [...prev, { timestamp: "--:--", level: "ERROR", message: "Mitigacao incorreta. Metricas continuam degradadas. Tente novamente." }]);
      // Let them try again
      setSelectedMitigation(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario, selectedMitigation]);

  const finishSimulation = useCallback(() => {
    // Stop all intervals
    if (timerRef.current) clearInterval(timerRef.current);
    if (logStreamRef.current) clearInterval(logStreamRef.current);
    if (metricDegRef.current) clearInterval(metricDegRef.current);
    if (recoveryRef.current) clearInterval(recoveryRef.current);

    setPhase("score");

    if (!xpAwardedRef.current) {
      xpAwardedRef.current = true;
      const unnecessary = actionsTaken.filter((id) => {
        const a = ACTIONS.find((act) => act.id === id);
        return a && scenario ? !a.relevantTo.includes(scenario.id) : false;
      }).length;
      const grade = computeGrade(elapsedSec, actionsTaken.length, unnecessary, correctCause, correctMitigation);
      const xp = GRADE_XP[grade];
      const correct = (correctCause ? 1 : 0) + (correctMitigation ? 1 : 0);
      recordQuiz("/labs/incident-simulator", correct, 2, xp);
      setShowXpToast(`+${xp} XP (Grade ${grade})`);
      setTimeout(() => setShowXpToast(null), 4000);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionsTaken, elapsedSec, correctCause, correctMitigation, scenario, recordQuiz]);

  const resetAll = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (logStreamRef.current) clearInterval(logStreamRef.current);
    if (metricDegRef.current) clearInterval(metricDegRef.current);
    if (recoveryRef.current) clearInterval(recoveryRef.current);
    setPhase("select");
    setScenario(null);
    setElapsedSec(0);
    setLogs([]);
    setMetrics({ authRate: 85, latencyP99: 800, errorRate: 2, revenueImpact: 0 });
    setActionsTaken([]);
    setActionDialogOpen(null);
    setSelectedCause(null);
    setSelectedMitigation(null);
    setCorrectCause(false);
    setCorrectMitigation(false);
    setRecoveryProgress(0);
    xpAwardedRef.current = false;
  }, []);

  // ---------------------------------------------------------------------------
  // Derived
  // ---------------------------------------------------------------------------
  const unnecessary = actionsTaken.filter((id) => {
    const a = ACTIONS.find((act) => act.id === id);
    return a && scenario ? !a.relevantTo.includes(scenario.id) : false;
  }).length;

  const grade = computeGrade(elapsedSec, actionsTaken.length, unnecessary, correctCause, correctMitigation);

  // ---------------------------------------------------------------------------
  // Render: Scenario Selection
  // ---------------------------------------------------------------------------
  if (phase === "select") {
    return (
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1rem" }}>
        <div style={{ marginBottom: "1.5rem" }}>
          <Link
            href="/labs"
            style={{ color: "var(--primary)", fontSize: "0.8rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.25rem", marginBottom: "0.75rem" }}
          >
            &larr; Labs
          </Link>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "0.375rem" }}>
            Simulador de Incidente
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
            Voce e o engenheiro on-call. Escolha um cenario de incidente e resolva o mais rapido possivel. Suas decisoes determinam o score final.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem" }}>
          {SCENARIOS.map((sc) => (
            <button
              key={sc.id}
              onClick={() => startScenario(sc)}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "0.75rem",
                padding: "1.25rem",
                cursor: "pointer",
                textAlign: "left",
                transition: "border-color 0.2s, transform 0.15s",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = sc.color; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: sc.color }} />
              <div style={{ fontSize: "1.75rem", marginBottom: "0.75rem" }}>{sc.icon}</div>
              <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "0.375rem" }}>{sc.title}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>{sc.trigger}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Render: Score Screen
  // ---------------------------------------------------------------------------
  if (phase === "score" && scenario) {
    const gradeColor = GRADE_COLORS[grade];
    return (
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "2rem 1rem" }}>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "0.75rem", padding: "2rem", textAlign: "center" }}>
          <div style={{ fontSize: "4rem", fontWeight: 900, color: gradeColor, marginBottom: "0.5rem" }}>{grade}</div>
          <div style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--foreground)", marginBottom: "1.5rem" }}>
            {grade === "S" ? "Excelente! Resposta expert." : grade === "A" ? "Bom trabalho! Resposta eficiente." : grade === "B" ? "OK. Pode melhorar a eficiencia." : grade === "C" ? "Lento. Muitas acoes desnecessarias." : "Falhou na identificacao. Pratique mais."}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem", textAlign: "left" }}>
            {[
              { label: "Tempo total", value: fmtTimer(elapsedSec) },
              { label: "Acoes tomadas", value: String(actionsTaken.length) },
              { label: "Acoes desnecessarias", value: String(unnecessary), bad: unnecessary > 0 },
              { label: "Causa raiz correta", value: correctCause ? "Sim" : "Nao", bad: !correctCause },
              { label: "Mitigacao correta", value: correctMitigation ? "Sim" : "Nao", bad: !correctMitigation },
              { label: "XP ganho", value: `+${GRADE_XP[grade]}` },
            ].map((item, i) => (
              <div key={i} style={{ background: "var(--background)", border: "1px solid var(--border)", borderRadius: "0.5rem", padding: "0.75rem" }}>
                <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginBottom: "0.25rem" }}>{item.label}</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "bad" in item && item.bad ? "#EF4444" : "var(--foreground)" }}>{item.value}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
            <button
              onClick={resetAll}
              style={{ background: "var(--primary)", color: "#fff", border: "none", borderRadius: "0.5rem", padding: "0.625rem 1.25rem", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem" }}
            >
              Tentar Outro Cenario
            </button>
            <Link
              href="/labs"
              style={{ background: "var(--surface)", color: "var(--foreground)", border: "1px solid var(--border)", borderRadius: "0.5rem", padding: "0.625rem 1.25rem", textDecoration: "none", fontWeight: 600, fontSize: "0.85rem" }}
            >
              Voltar aos Labs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Render: Simulation / Root Cause / Mitigation / Recovering
  // ---------------------------------------------------------------------------
  if (!scenario) return null;

  const metricCards: { label: string; value: string; initial: number; current: number; unit: string; invertBad?: boolean }[] = [
    { label: "Auth Rate", value: `${metrics.authRate}%`, initial: scenario.initialMetrics.authRate, current: metrics.authRate, unit: "%", invertBad: true },
    { label: "Latency P99", value: `${metrics.latencyP99.toLocaleString()}ms`, initial: scenario.initialMetrics.latencyP99, current: metrics.latencyP99, unit: "ms" },
    { label: "Error Rate", value: `${metrics.errorRate}%`, initial: scenario.initialMetrics.errorRate, current: metrics.errorRate, unit: "%" },
    { label: "Revenue Impact", value: `R$${metrics.revenueImpact.toLocaleString()}/min`, initial: scenario.initialMetrics.revenueImpact, current: metrics.revenueImpact, unit: "R$/min" },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "1.5rem 1rem" }}>
      {/* XP Toast */}
      {showXpToast && (
        <div style={{ position: "fixed", top: "1.5rem", right: "1.5rem", background: "#10B981", color: "#fff", padding: "0.75rem 1.25rem", borderRadius: "0.5rem", fontWeight: 700, fontSize: "0.9rem", zIndex: 1000, boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}>
          {showXpToast}
        </div>
      )}

      {/* Header bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <button
            onClick={resetAll}
            style={{ background: "transparent", border: "none", color: "var(--primary)", cursor: "pointer", fontSize: "0.8rem", padding: "0.25rem" }}
          >
            &larr; Sair
          </button>
          <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--foreground)" }}>
            {scenario.icon} {scenario.title}
          </span>
          {phase === "recovering" && (
            <span style={{ fontSize: "0.75rem", color: "#10B981", fontWeight: 600, background: "rgba(16,185,129,0.1)", padding: "0.2rem 0.5rem", borderRadius: "0.25rem" }}>
              RECUPERANDO...
            </span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
            Acoes: <span style={{ color: "var(--foreground)", fontWeight: 600 }}>{actionsTaken.length}</span>
          </div>
          <div style={{
            fontFamily: "monospace",
            fontSize: "1.25rem",
            fontWeight: 700,
            color: elapsedSec > 120 ? "#EF4444" : elapsedSec > 60 ? "#F59E0B" : "#10B981",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "0.375rem",
            padding: "0.25rem 0.75rem",
          }}>
            {fmtTimer(elapsedSec)}
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem", marginBottom: "1rem" }}>
        {metricCards.map((mc, i) => {
          const isWorse = mc.invertBad
            ? mc.current < mc.initial - 5
            : mc.current > mc.initial + 5;
          const isRecovering = phase === "recovering";
          const trendColor = isRecovering ? "#10B981" : isWorse ? "#EF4444" : "#10B981";
          const trendArrow = isRecovering
            ? (mc.invertBad ? "\u2191" : "\u2193")
            : (isWorse ? (mc.invertBad ? "\u2193" : "\u2191") : "\u2192");

          return (
            <div key={i} style={{
              background: "var(--surface)",
              border: `1px solid ${isWorse && !isRecovering ? "rgba(239,68,68,0.3)" : "var(--border)"}`,
              borderRadius: "0.625rem",
              padding: "0.875rem",
              position: "relative",
              overflow: "hidden",
            }}>
              {isWorse && !isRecovering && (
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "#EF4444" }} />
              )}
              {isRecovering && (
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "#10B981" }} />
              )}
              <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginBottom: "0.25rem" }}>{mc.label}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.375rem" }}>
                <span style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--foreground)" }}>{mc.value}</span>
                <span style={{ fontSize: "0.85rem", fontWeight: 600, color: trendColor }}>{trendArrow}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recovery bar */}
      {phase === "recovering" && (
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "0.5rem", padding: "0.75rem", marginBottom: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.375rem" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#10B981" }}>Recuperacao em andamento</span>
            <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--foreground)" }}>{Math.round(recoveryProgress)}%</span>
          </div>
          <div style={{ height: 6, background: "var(--background)", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${recoveryProgress}%`, background: "#10B981", borderRadius: 3, transition: "width 0.4s" }} />
          </div>
        </div>
      )}

      {/* Main content: Log console + Actions / Root Cause / Mitigation */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        {/* Log Console */}
        <div style={{
          background: "#0D1117",
          border: "1px solid #21262D",
          borderRadius: "0.625rem",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          minHeight: 400,
        }}>
          <div style={{ padding: "0.625rem 0.875rem", borderBottom: "1px solid #21262D", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#EF4444" }} />
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#F59E0B" }} />
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981" }} />
            <span style={{ fontSize: "0.7rem", color: "#8B949E", marginLeft: "0.5rem" }}>incident-logs</span>
          </div>
          <div ref={logContainerRef} style={{ flex: 1, overflowY: "auto", padding: "0.75rem", fontFamily: "monospace", fontSize: "0.72rem", lineHeight: 1.7 }}>
            {logs.map((log, i) => (
              <div key={i} style={{ display: "flex", gap: "0.5rem", color: "#C9D1D9" }}>
                <span style={{ color: "#484F58", flexShrink: 0 }}>{log.timestamp}</span>
                <span style={{ color: LOG_LEVEL_COLORS[log.level] || "#C9D1D9", fontWeight: 600, flexShrink: 0 }}>[{log.level}]</span>
                <span>{log.message}</span>
              </div>
            ))}
            {(phase === "simulate" || phase === "recovering") && (
              <div style={{ color: "#10B981", opacity: 0.6 }}>
                <span className="blink-cursor" style={{ animation: "blink 1s step-end infinite" }}>_</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {/* Simulate: Action Buttons */}
          {phase === "simulate" && (
            <>
              <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--foreground)" }}>
                Acoes de Diagnostico
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                {ACTIONS.map((action) => {
                  const used = actionsTaken.includes(action.id);
                  return (
                    <button
                      key={action.id}
                      onClick={() => handleAction(action.id)}
                      disabled={used}
                      style={{
                        background: used ? "var(--background)" : "var(--surface)",
                        border: `1px solid ${used ? "var(--border)" : "var(--border)"}`,
                        borderRadius: "0.5rem",
                        padding: "0.75rem",
                        cursor: used ? "not-allowed" : "pointer",
                        textAlign: "left",
                        opacity: used ? 0.5 : 1,
                        transition: "border-color 0.2s",
                      }}
                      onMouseEnter={(e) => { if (!used) e.currentTarget.style.borderColor = "var(--primary)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                        <span style={{ fontSize: "1rem" }}>{action.icon}</span>
                        <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--foreground)" }}>{action.label}</span>
                      </div>
                      <div style={{ fontSize: "0.65rem", color: "var(--text-secondary)" }}>
                        {used ? "Ja executada" : `+${action.timeCost}s ao timer`}
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={goToRootCause}
                style={{
                  background: "var(--primary)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "0.5rem",
                  padding: "0.75rem",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  marginTop: "0.5rem",
                }}
              >
                Identificar Causa Raiz &rarr;
              </button>
            </>
          )}

          {/* Action Dialog */}
          {actionDialogOpen !== null && phase === "simulate" && (
            <div style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 999,
              padding: "1rem",
            }}>
              <div style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "0.75rem",
                padding: "1.5rem",
                maxWidth: 500,
                width: "100%",
              }}>
                <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "0.75rem" }}>
                  {ACTIONS.find((a) => a.id === actionDialogOpen)?.icon} {ACTIONS.find((a) => a.id === actionDialogOpen)?.label}
                </div>
                <div style={{
                  background: "#0D1117",
                  border: "1px solid #21262D",
                  borderRadius: "0.5rem",
                  padding: "0.75rem",
                  fontFamily: "monospace",
                  fontSize: "0.72rem",
                  lineHeight: 1.7,
                  marginBottom: "0.75rem",
                  maxHeight: 150,
                  overflowY: "auto",
                }}>
                  {scenario.actionResults[actionDialogOpen]?.logs.map((log, i) => (
                    <div key={i} style={{ color: LOG_LEVEL_COLORS[log.level] || "#C9D1D9" }}>
                      [{log.level}] {log.message}
                    </div>
                  ))}
                </div>
                <div style={{
                  background: "var(--primary-bg)",
                  border: "1px solid var(--primary)",
                  borderRadius: "0.5rem",
                  padding: "0.75rem",
                  fontSize: "0.8rem",
                  color: "var(--foreground)",
                  marginBottom: "1rem",
                  lineHeight: 1.5,
                }}>
                  {scenario.actionResults[actionDialogOpen]?.insight}
                </div>
                <button
                  onClick={() => setActionDialogOpen(null)}
                  style={{
                    background: "var(--primary)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "0.375rem",
                    padding: "0.5rem 1rem",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: "0.8rem",
                  }}
                >
                  Continuar Investigacao
                </button>
              </div>
            </div>
          )}

          {/* Root Cause Selection */}
          {phase === "rootcause" && (
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "0.625rem", padding: "1.25rem" }}>
              <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "0.375rem" }}>
                Qual e a causa raiz?
              </div>
              <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
                Com base na sua investigacao, selecione a causa raiz mais provavel.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
                {scenario.rootCauseOptions.map((opt) => (
                  <label
                    key={opt.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      background: selectedCause === opt.id ? "var(--primary-bg)" : "var(--background)",
                      border: `1px solid ${selectedCause === opt.id ? "var(--primary)" : "var(--border)"}`,
                      borderRadius: "0.375rem",
                      padding: "0.75rem",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                      color: "var(--foreground)",
                    }}
                  >
                    <input
                      type="radio"
                      name="rootcause"
                      checked={selectedCause === opt.id}
                      onChange={() => setSelectedCause(opt.id)}
                      style={{ accentColor: "var(--primary)" }}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
              <button
                onClick={submitRootCause}
                disabled={!selectedCause}
                style={{
                  background: selectedCause ? "var(--primary)" : "var(--border)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "0.375rem",
                  padding: "0.625rem 1rem",
                  cursor: selectedCause ? "pointer" : "not-allowed",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  width: "100%",
                }}
              >
                Confirmar Causa Raiz
              </button>
            </div>
          )}

          {/* Mitigation Selection */}
          {phase === "mitigation" && (
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "0.625rem", padding: "1.25rem" }}>
              <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "0.375rem" }}>
                Qual acao de mitigacao?
              </div>
              <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
                {correctCause
                  ? "Causa raiz correta! Agora selecione a melhor mitigacao."
                  : "Causa raiz incorreta, mas selecione a mitigacao."}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
                {scenario.mitigationOptions.map((opt) => (
                  <label
                    key={opt.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      background: selectedMitigation === opt.id ? "var(--primary-bg)" : "var(--background)",
                      border: `1px solid ${selectedMitigation === opt.id ? "var(--primary)" : "var(--border)"}`,
                      borderRadius: "0.375rem",
                      padding: "0.75rem",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                      color: "var(--foreground)",
                    }}
                  >
                    <input
                      type="radio"
                      name="mitigation"
                      checked={selectedMitigation === opt.id}
                      onChange={() => setSelectedMitigation(opt.id)}
                      style={{ accentColor: "var(--primary)" }}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
              <button
                onClick={submitMitigation}
                disabled={!selectedMitigation}
                style={{
                  background: selectedMitigation ? "var(--primary)" : "var(--border)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "0.375rem",
                  padding: "0.625rem 1rem",
                  cursor: selectedMitigation ? "pointer" : "not-allowed",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  width: "100%",
                }}
              >
                Aplicar Mitigacao
              </button>
            </div>
          )}

          {/* Recovering: just shows status */}
          {phase === "recovering" && (
            <div style={{ background: "var(--surface)", border: "1px solid #10B981", borderRadius: "0.625rem", padding: "1.25rem", textAlign: "center" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{"\u2705"}</div>
              <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#10B981", marginBottom: "0.5rem" }}>
                Mitigacao Aplicada com Sucesso
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Metricas estao se recuperando. Aguarde a estabilizacao para ver seu score final.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Blink cursor keyframes */}
      <style>{`
        @keyframes blink {
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
