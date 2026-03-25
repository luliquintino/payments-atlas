"use client";

import Link from "next/link";
import { useState, useCallback, useEffect, useRef } from "react";
import { useGameProgress } from "@/hooks/useGameProgress";

// ---------------------------------------------------------------------------
// Types & Constants
// ---------------------------------------------------------------------------
interface Action {
  label: string;
  timeCost: number; // simulated minutes
  optimal: boolean;
  result: LogEntry[];
  narrative: string;
}

interface Step {
  title: string;
  alert: string;
  alertType: "critical" | "warning" | "info";
  actions: Action[];
}

interface LogEntry {
  timestamp: string;
  level: "ERROR" | "WARN" | "INFO" | "DEBUG";
  message: string;
}

const LOG_COLORS: Record<string, string> = {
  ERROR: "#EF4444",
  WARN: "#F59E0B",
  INFO: "#10B981",
  DEBUG: "#6B7280",
};

function fmtTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// ---------------------------------------------------------------------------
// Scenario Data
// ---------------------------------------------------------------------------
const STEPS: Step[] = [
  {
    title: "Alerta Recebido",
    alert: "[SEV-1] Auth rate caiu de 85% para 40% nos ultimos 5 minutos. 12.000 transacoes impactadas.",
    alertType: "critical",
    actions: [
      {
        label: "Check Acquirer Dashboard",
        timeCost: 2,
        optimal: true,
        narrative:
          "Voce abre o dashboard de adquirentes e imediatamente ve o problema. Diagnostico rapido!",
        result: [
          { timestamp: "14:32:01", level: "INFO", message: "Conectando ao dashboard de adquirentes..." },
          { timestamp: "14:32:03", level: "ERROR", message: "ADQUIRENTE A: Auth rate 15% (normal: 82%) | Volume: 70% do trafego" },
          { timestamp: "14:32:03", level: "INFO", message: "ADQUIRENTE B: Auth rate 82% (normal: 83%) | Volume: 30% do trafego" },
          { timestamp: "14:32:04", level: "WARN", message: "Adquirente A retornando code 91 (Issuer Unavailable) em 85% dos requests" },
          { timestamp: "14:32:04", level: "INFO", message: ">>> Causa identificada: Adquirente A com falha de conectividade ao emissor" },
        ],
      },
      {
        label: "Check Network Status",
        timeCost: 5,
        optimal: false,
        narrative:
          "Voce verifica status das bandeiras. Nenhum alerta publico. Perde tempo antes de olhar os adquirentes.",
        result: [
          { timestamp: "14:32:01", level: "INFO", message: "Verificando status Visa... OK" },
          { timestamp: "14:33:15", level: "INFO", message: "Verificando status Mastercard... OK" },
          { timestamp: "14:34:22", level: "INFO", message: "Verificando status Elo... OK" },
          { timestamp: "14:35:10", level: "WARN", message: "Nenhuma bandeira reporta incidente. Problema pode ser no adquirente." },
          { timestamp: "14:36:50", level: "INFO", message: "Recomendacao: verificar dashboard de adquirentes" },
        ],
      },
      {
        label: "Check Recent Deploys",
        timeCost: 4,
        optimal: false,
        narrative:
          "Voce verifica deploys recentes. Nenhum deploy nas ultimas 6 horas. Tempo perdido, mas boa pratica em geral.",
        result: [
          { timestamp: "14:32:01", level: "INFO", message: "Consultando historico de deploys..." },
          { timestamp: "14:32:45", level: "INFO", message: "Ultimo deploy: 6h atras (v2.14.3 - fix de logging)" },
          { timestamp: "14:33:20", level: "INFO", message: "Deploy anterior: 18h atras (v2.14.2 - feature flag)" },
          { timestamp: "14:34:10", level: "DEBUG", message: "Nenhum deploy coincide com inicio do incidente (14:27)" },
          { timestamp: "14:35:00", level: "WARN", message: "Deploy descartado como causa. Investigar outra hipotese." },
        ],
      },
      {
        label: "Check Fraud Rules",
        timeCost: 5,
        optimal: false,
        narrative:
          "Voce verifica regras antifraude. Nenhuma mudanca recente. Direcao errada para este incidente.",
        result: [
          { timestamp: "14:32:01", level: "INFO", message: "Carregando regras antifraude ativas..." },
          { timestamp: "14:33:30", level: "INFO", message: "42 regras ativas. Ultima alteracao: 3 dias atras" },
          { timestamp: "14:34:45", level: "INFO", message: "Taxa de bloqueio antifraude: 2.1% (normal)" },
          { timestamp: "14:36:00", level: "DEBUG", message: "Nenhuma regra nova ou alterada no periodo do incidente" },
          { timestamp: "14:36:30", level: "WARN", message: "Antifraude descartado. Verificar infraestrutura de adquirentes." },
        ],
      },
    ],
  },
  {
    title: "Diagnostico Confirmado",
    alert: "Adquirente A com falha. 70% do trafego impactado. Auth rate global: 40%.",
    alertType: "warning",
    actions: [
      {
        label: "Redirecionar Trafego para Adquirente B",
        timeCost: 3,
        optimal: true,
        narrative:
          "Voce ativa o failover para Adquirente B. Trafego comeca a ser redirecionado. Auth rate subindo!",
        result: [
          { timestamp: "14:38:01", level: "INFO", message: "Iniciando redirecionamento de trafego..." },
          { timestamp: "14:38:15", level: "INFO", message: "Regra de roteamento atualizada: Adquirente A -> Adquirente B" },
          { timestamp: "14:38:30", level: "INFO", message: "Auth rate: 45% (+5)" },
          { timestamp: "14:39:00", level: "INFO", message: "Auth rate: 62% (+17)" },
          { timestamp: "14:39:30", level: "INFO", message: "Auth rate: 78% (+16) - ESTABILIZANDO" },
          { timestamp: "14:40:00", level: "INFO", message: ">>> Auth rate restaurada: 80%. Incidente mitigado." },
        ],
      },
      {
        label: "Contatar Adquirente A",
        timeCost: 8,
        optimal: false,
        narrative:
          "Voce liga para o suporte do Adquirente A. Espera na fila. Enquanto isso, transacoes continuam falhando.",
        result: [
          { timestamp: "14:38:01", level: "INFO", message: "Ligando para suporte Adquirente A..." },
          { timestamp: "14:40:00", level: "WARN", message: "Em espera... posicao 3 na fila" },
          { timestamp: "14:42:00", level: "WARN", message: "Em espera... posicao 1 na fila. +3.500 transacoes falharam." },
          { timestamp: "14:44:00", level: "INFO", message: "Atendente confirma: 'Estamos cientes do problema. ETA: 30 min'" },
          { timestamp: "14:45:00", level: "ERROR", message: "30 min de espera e inaceitavel. Precisava ter redirecionado o trafego." },
        ],
      },
      {
        label: "Rollback Deploy",
        timeCost: 6,
        optimal: false,
        narrative:
          "Voce inicia um rollback, mas o problema nao e de deploy. Tempo perdido e transacoes continuam falhando.",
        result: [
          { timestamp: "14:38:01", level: "INFO", message: "Iniciando rollback para v2.14.2..." },
          { timestamp: "14:40:00", level: "INFO", message: "Rollback completo. Verificando metricas..." },
          { timestamp: "14:41:00", level: "ERROR", message: "Auth rate continua em 40%. Rollback nao resolveu." },
          { timestamp: "14:42:00", level: "WARN", message: "Problema nao e de codigo. +4.200 transacoes falharam durante rollback." },
          { timestamp: "14:43:00", level: "INFO", message: "Recomendacao: redirecionar trafego para Adquirente B" },
        ],
      },
      {
        label: "Habilitar Modo Fallback",
        timeCost: 5,
        optimal: false,
        narrative:
          "Fallback envia para Adquirente B apenas apos falha em A. Mais lento que redirecionar direto.",
        result: [
          { timestamp: "14:38:01", level: "INFO", message: "Habilitando fallback mode..." },
          { timestamp: "14:39:00", level: "INFO", message: "Fallback ativo. Cada transacao tenta A primeiro, depois B." },
          { timestamp: "14:40:00", level: "WARN", message: "Latencia aumentou: cada falha em A adiciona 2-3s antes do fallback" },
          { timestamp: "14:41:00", level: "INFO", message: "Auth rate: 65% (melhoria parcial, mas com latencia alta)" },
          { timestamp: "14:42:00", level: "WARN", message: "Redirecionar direto seria mais eficaz. Fallback gera timeout em 15% dos casos." },
        ],
      },
    ],
  },
  {
    title: "Mitigacao em Andamento",
    alert: "Trafego redirecionado. Auth rate recuperando. Hora de estabilizar.",
    alertType: "info",
    actions: [
      {
        label: "Monitorar + Notificar + Incident Report (Todas)",
        timeCost: 3,
        optimal: true,
        narrative:
          "Voce faz tudo certo: monitora metricas, notifica merchants, e abre o incident report. Operacao completa!",
        result: [
          { timestamp: "14:45:01", level: "INFO", message: "[MONITOR] Auth rate estavel em 80% por 5 minutos" },
          { timestamp: "14:45:02", level: "INFO", message: "[NOTIFY] Email enviado para 2.000 merchants: 'Incidente mitigado'" },
          { timestamp: "14:45:03", level: "INFO", message: "[REPORT] Incident report INC-2024-0892 criado no PagerDuty" },
          { timestamp: "14:50:00", level: "INFO", message: "[MONITOR] Auth rate: 81% - dentro do SLA" },
          { timestamp: "14:55:00", level: "INFO", message: ">>> Incidente encerrado. Post-mortem agendado para amanha." },
        ],
      },
      {
        label: "Apenas Monitorar por 15min",
        timeCost: 15,
        optimal: false,
        narrative:
          "Voce monitora, mas merchants nao foram notificados. Varios abriram tickets de suporte.",
        result: [
          { timestamp: "14:45:01", level: "INFO", message: "Monitorando metricas..." },
          { timestamp: "14:50:00", level: "INFO", message: "Auth rate: 80% - estavel" },
          { timestamp: "14:52:00", level: "WARN", message: "47 tickets de suporte abertos por merchants. Eles nao sabem do incidente." },
          { timestamp: "14:55:00", level: "INFO", message: "Auth rate: 81% - estavel" },
          { timestamp: "14:59:00", level: "WARN", message: "Faltou comunicacao proativa e incident report formal." },
        ],
      },
      {
        label: "Apenas Notificar Merchants",
        timeCost: 5,
        optimal: false,
        narrative:
          "Merchants notificados, mas sem monitoramento continuo nem incident report. Incompleto.",
        result: [
          { timestamp: "14:45:01", level: "INFO", message: "Preparando comunicacao para merchants..." },
          { timestamp: "14:47:00", level: "INFO", message: "Email enviado: 'Identificamos instabilidade no processamento'" },
          { timestamp: "14:48:00", level: "WARN", message: "Sem monitoramento ativo — se Adquirente B tambem cair, ninguem vera." },
          { timestamp: "14:50:00", level: "WARN", message: "Sem incident report — nao havera post-mortem estruturado." },
          { timestamp: "14:52:00", level: "DEBUG", message: "Acao parcial. Faltou monitoramento e documentacao." },
        ],
      },
      {
        label: "Criar Incident Report Apenas",
        timeCost: 10,
        optimal: false,
        narrative:
          "Documentacao e importante, mas voce focou demais nela. Merchants sem comunicacao, sem monitoramento ativo.",
        result: [
          { timestamp: "14:45:01", level: "INFO", message: "Abrindo incident report detalhado..." },
          { timestamp: "14:50:00", level: "INFO", message: "INC-2024-0892 criado com timeline completa" },
          { timestamp: "14:52:00", level: "WARN", message: "62 tickets de suporte — merchants nao foram notificados proativamente" },
          { timestamp: "14:54:00", level: "WARN", message: "Sem monitoramento ativo durante redacao do report" },
          { timestamp: "14:55:00", level: "DEBUG", message: "Report e necessario, mas nao pode ser a unica acao." },
        ],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function IncidentSimulator() {
  const [started, setStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [simulatedMinutes, setSimulatedMinutes] = useState(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [actionHistory, setActionHistory] = useState<{ step: number; action: number; optimal: boolean }[]>([]);
  const [showingResult, setShowingResult] = useState(false);
  const [showXpToast, setShowXpToast] = useState<string | null>(null);
  const { recordQuiz, visitPage } = useGameProgress();
  const xpAwardedRef = useRef(false);

  useEffect(() => {
    visitPage("/labs/incident-simulator");
  }, [visitPage]);
  const [lastNarrative, setLastNarrative] = useState("");
  const [animatingLogs, setAnimatingLogs] = useState(false);
  const [finished, setFinished] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Timer
  useEffect(() => {
    if (started && !finished) {
      timerRef.current = setInterval(() => {
        setElapsedSec((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [started, finished]);

  // Auto-scroll logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const handleStart = useCallback(() => {
    setStarted(true);
    setLogs([
      { timestamp: "14:27:00", level: "ERROR", message: "=== ALERTA SEV-1 RECEBIDO ===" },
      { timestamp: "14:27:00", level: "ERROR", message: "Auth rate caiu de 85% para 40% nos ultimos 5 minutos" },
      { timestamp: "14:27:01", level: "WARN", message: "12.000 transacoes impactadas. Merchants reportando falhas." },
      { timestamp: "14:27:02", level: "INFO", message: "On-call engineer notificado. Timer iniciado." },
    ]);
  }, []);

  const handleAction = useCallback(
    (actionIdx: number) => {
      if (animatingLogs || showingResult) return;
      const step = STEPS[currentStep];
      const action = step.actions[actionIdx];

      setActionHistory((prev) => [...prev, { step: currentStep, action: actionIdx, optimal: action.optimal }]);
      setSimulatedMinutes((m) => m + action.timeCost);
      setLastNarrative(action.narrative);
      setAnimatingLogs(true);

      // Animate log entries one by one
      const newLogs = action.result;
      let i = 0;
      const interval = setInterval(() => {
        if (i < newLogs.length) {
          setLogs((prev) => [...prev, newLogs[i]]);
          i++;
        } else {
          clearInterval(interval);
          setAnimatingLogs(false);
          setShowingResult(true);
        }
      }, 300);
    },
    [currentStep, animatingLogs, showingResult]
  );

  const handleNext = useCallback(() => {
    if (currentStep + 1 >= STEPS.length) {
      setFinished(true);
      if (timerRef.current) clearInterval(timerRef.current);
      // XP rewards
      if (!xpAwardedRef.current) {
        xpAwardedRef.current = true;
        const optCount = [...actionHistory, ...([] as typeof actionHistory)].filter((a) => a.optimal).length;
        const sc = Math.round((optCount / STEPS.length) * 100);
        const isExpert = simulatedMinutes <= 10 && sc >= 80;
        const xp = isExpert ? 40 : 25;
        recordQuiz("/labs/incident-simulator", optCount, STEPS.length, xp);
        setShowXpToast(`+${xp} XP${isExpert ? " — Expert!" : ""}`);
        setTimeout(() => setShowXpToast(null), 4000);
      }
    } else {
      setCurrentStep((s) => s + 1);
      setShowingResult(false);
      setLogs((prev) => [
        ...prev,
        { timestamp: "--:--:--", level: "INFO", message: "---" },
      ]);
    }
  }, [currentStep, actionHistory, simulatedMinutes, recordQuiz]);

  const resetAll = useCallback(() => {
    setStarted(false);
    setCurrentStep(0);
    setElapsedSec(0);
    setSimulatedMinutes(0);
    setLogs([]);
    setActionHistory([]);
    setShowingResult(false);
    setLastNarrative("");
    setAnimatingLogs(false);
    setFinished(false);
  }, []);

  // -------------------------------------------------------------------------
  // Render: Start Screen
  // -------------------------------------------------------------------------
  if (!started) {
    return (
      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "2rem 1rem" }}>
        <div style={{ marginBottom: "1.5rem" }}>
          <Link
            href="/labs"
            style={{
              color: "var(--primary)",
              fontSize: "0.8rem",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.25rem",
              marginBottom: "0.75rem",
            }}
          >
            &larr; Labs
          </Link>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "var(--foreground)",
              marginBottom: "0.375rem",
            }}
          >
            Simulador de Incidente
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
            Voce e o engenheiro on-call. Um alerta SEV-1 acaba de chegar. Suas decisoes determinam
            o tempo de resolucao.
          </p>
        </div>

        <div
          style={{
            background: "#0D1117",
            border: "1px solid #21262D",
            borderRadius: "0.75rem",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "3rem",
              marginBottom: "1rem",
              filter: "none",
            }}
          >
            {"\uD83D\uDEA8"}
          </div>
          <div
            style={{
              fontFamily: "'SF Mono', 'Fira Code', monospace",
              fontSize: "1rem",
              color: "#EF4444",
              marginBottom: "0.5rem",
              fontWeight: 700,
            }}
          >
            SEV-1 INCIDENT ALERT
          </div>
          <div
            style={{
              fontFamily: "'SF Mono', 'Fira Code', monospace",
              fontSize: "0.8rem",
              color: "#8B949E",
              marginBottom: "1.5rem",
            }}
          >
            Auth rate dropped from 85% to 40%
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            {[
              { label: "Antes", value: "85%", color: "#10B981" },
              { label: "Agora", value: "40%", color: "#EF4444" },
              { label: "Impacto", value: "12K txn", color: "#F59E0B" },
            ].map((m) => (
              <div
                key={m.label}
                style={{
                  background: "#161B22",
                  borderRadius: "0.5rem",
                  padding: "0.75rem",
                  border: "1px solid #21262D",
                }}
              >
                <div
                  style={{
                    fontSize: "0.65rem",
                    color: "#8B949E",
                    marginBottom: "0.25rem",
                    textTransform: "uppercase",
                  }}
                >
                  {m.label}
                </div>
                <div
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    color: m.color,
                    fontFamily: "monospace",
                  }}
                >
                  {m.value}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleStart}
            style={{
              padding: "0.75rem 2rem",
              borderRadius: "0.5rem",
              background: "#EF4444",
              color: "white",
              border: "none",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "0.9rem",
              fontFamily: "'SF Mono', 'Fira Code', monospace",
            }}
          >
            ACEITAR INCIDENTE &rarr;
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Render: Finished / Post-mortem
  // -------------------------------------------------------------------------
  if (finished) {
    const optimalCount = actionHistory.filter((a) => a.optimal).length;
    const score = Math.round((optimalCount / STEPS.length) * 100);
    const totalMinutes = simulatedMinutes;
    const grade =
      totalMinutes <= 10 && score >= 80
        ? "A"
        : totalMinutes <= 15 && score >= 50
        ? "B"
        : totalMinutes <= 20
        ? "C"
        : "D";
    const gradeColor =
      grade === "A" ? "#10B981" : grade === "B" ? "#3B82F6" : grade === "C" ? "#F59E0B" : "#EF4444";

    return (
      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "2rem 1rem" }}>
        {showXpToast && (
          <div
            style={{
              position: "fixed",
              top: "1.5rem",
              right: "1.5rem",
              background: "#10B981",
              color: "white",
              padding: "0.75rem 1.25rem",
              borderRadius: "0.75rem",
              fontWeight: 700,
              fontSize: "0.85rem",
              zIndex: 999,
              boxShadow: "0 4px 20px rgba(16,185,129,0.4)",
            }}
          >
            {showXpToast}
          </div>
        )}
        <div
          style={{
            background: "#0D1117",
            border: "1px solid #21262D",
            borderRadius: "0.75rem",
            padding: "2rem",
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: "1.5rem",
            }}
          >
            <div
              style={{
                fontFamily: "monospace",
                fontSize: "0.8rem",
                color: "#10B981",
                marginBottom: "0.5rem",
              }}
            >
              === POST-MORTEM ===
            </div>
            <div
              style={{
                fontSize: "3rem",
                fontWeight: 800,
                color: gradeColor,
                fontFamily: "monospace",
              }}
            >
              Grade: {grade}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "0.75rem",
              marginBottom: "1.5rem",
            }}
          >
            {[
              { label: "Tempo Real", value: fmtTime(elapsedSec), color: "#8B949E" },
              { label: "Tempo Simulado", value: `${totalMinutes}min`, color: totalMinutes <= 10 ? "#10B981" : "#F59E0B" },
              { label: "Score", value: `${score}%`, color: score >= 80 ? "#10B981" : "#F59E0B" },
            ].map((m) => (
              <div
                key={m.label}
                style={{
                  background: "#161B22",
                  borderRadius: "0.5rem",
                  padding: "0.75rem",
                  textAlign: "center",
                  border: "1px solid #21262D",
                }}
              >
                <div
                  style={{
                    fontSize: "0.65rem",
                    color: "#8B949E",
                    marginBottom: "0.25rem",
                    textTransform: "uppercase",
                    fontFamily: "monospace",
                  }}
                >
                  {m.label}
                </div>
                <div
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    color: m.color,
                    fontFamily: "monospace",
                  }}
                >
                  {m.value}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <div
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "#10B981",
                marginBottom: "0.5rem",
                fontFamily: "monospace",
              }}
            >
              ACOES TOMADAS:
            </div>
            {actionHistory.map((a, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.375rem 0",
                  fontSize: "0.8rem",
                  fontFamily: "monospace",
                  color: "#C9D1D9",
                }}
              >
                <span style={{ color: a.optimal ? "#10B981" : "#F59E0B" }}>
                  {a.optimal ? "\u2713" : "\u2717"}
                </span>
                <span style={{ color: "#8B949E" }}>[Step {a.step + 1}]</span>
                <span>{STEPS[a.step].actions[a.action].label}</span>
                <span style={{ color: "#8B949E" }}>
                  (+{STEPS[a.step].actions[a.action].timeCost}min)
                </span>
              </div>
            ))}
          </div>

          <div
            style={{
              background: "#161B22",
              borderRadius: "0.5rem",
              padding: "1rem",
              marginBottom: "1.5rem",
              border: "1px solid #21262D",
            }}
          >
            <div
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "#3B82F6",
                marginBottom: "0.5rem",
                fontFamily: "monospace",
              }}
            >
              CAMINHO OTIMO:
            </div>
            <div
              style={{
                fontSize: "0.8rem",
                color: "#C9D1D9",
                lineHeight: 1.6,
                fontFamily: "monospace",
              }}
            >
              1. Check Acquirer Dashboard (2min) - Diagnostico direto{"\n"}
              <br />
              2. Redirecionar Trafego (3min) - Mitigacao imediata{"\n"}
              <br />
              3. Monitorar + Notificar + Report (3min) - Estabilizacao completa{"\n"}
              <br />
              <span style={{ color: "#10B981" }}>Total: 8 minutos | Grade A</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
            <button
              onClick={resetAll}
              style={{
                padding: "0.625rem 1.25rem",
                borderRadius: "0.5rem",
                background: "#21262D",
                color: "#C9D1D9",
                border: "1px solid #30363D",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.85rem",
                fontFamily: "monospace",
              }}
            >
              TENTAR NOVAMENTE
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Render: Active Step
  // -------------------------------------------------------------------------
  const step = STEPS[currentStep];

  return (
    <div style={{ maxWidth: "950px", margin: "0 auto", padding: "2rem 1rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "1rem" }}>
        <Link
          href="/labs"
          style={{
            color: "var(--primary)",
            fontSize: "0.8rem",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.25rem",
            marginBottom: "0.75rem",
          }}
        >
          &larr; Labs
        </Link>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h1
            style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              color: "var(--foreground)",
            }}
          >
            Simulador de Incidente
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                fontFamily: "'SF Mono', 'Fira Code', monospace",
                fontSize: "1.25rem",
                fontWeight: 700,
                color: elapsedSec > 120 ? "#EF4444" : elapsedSec > 60 ? "#F59E0B" : "#10B981",
                background: "#0D1117",
                padding: "0.375rem 0.75rem",
                borderRadius: "0.5rem",
                border: "1px solid #21262D",
              }}
            >
              {fmtTime(elapsedSec)}
            </div>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "var(--primary)",
                background: "var(--primary-bg)",
                padding: "0.25rem 0.75rem",
                borderRadius: "1rem",
              }}
            >
              Step {currentStep + 1}/{STEPS.length}
            </span>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
        }}
      >
        {/* LEFT: Terminal / Logs */}
        <div
          style={{
            background: "#0D1117",
            border: "1px solid #21262D",
            borderRadius: "0.75rem",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "0.5rem 0.75rem",
              borderBottom: "1px solid #21262D",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <div style={{ display: "flex", gap: "0.35rem" }}>
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: "#EF4444",
                  display: "inline-block",
                }}
              />
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: "#F59E0B",
                  display: "inline-block",
                }}
              />
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: "#10B981",
                  display: "inline-block",
                }}
              />
            </div>
            <span
              style={{
                fontSize: "0.7rem",
                color: "#8B949E",
                fontFamily: "monospace",
              }}
            >
              incident-logs ~
            </span>
          </div>

          <div
            ref={logContainerRef}
            style={{
              padding: "0.75rem",
              minHeight: "400px",
              maxHeight: "400px",
              overflowY: "auto",
              fontFamily: "'SF Mono', 'Fira Code', monospace",
              fontSize: "0.72rem",
              lineHeight: 1.7,
            }}
          >
            {logs.map((log, i) => (
              <div key={i} style={{ display: "flex", gap: "0.5rem" }}>
                <span style={{ color: "#484F58", minWidth: "60px" }}>
                  {log.timestamp}
                </span>
                <span
                  style={{
                    color: LOG_COLORS[log.level],
                    minWidth: "40px",
                    fontWeight: 600,
                  }}
                >
                  [{log.level}]
                </span>
                <span style={{ color: log.level === "ERROR" ? "#F47067" : "#C9D1D9" }}>
                  {log.message}
                </span>
              </div>
            ))}
            {animatingLogs && (
              <span
                style={{
                  color: "#10B981",
                  animation: "blink 1s infinite",
                }}
              >
                _
              </span>
            )}
          </div>
        </div>

        {/* RIGHT: Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {/* Alert banner */}
          <div
            style={{
              background:
                step.alertType === "critical"
                  ? "#EF444415"
                  : step.alertType === "warning"
                  ? "#F59E0B15"
                  : "#10B98115",
              border: `1px solid ${
                step.alertType === "critical"
                  ? "#EF444440"
                  : step.alertType === "warning"
                  ? "#F59E0B40"
                  : "#10B98140"
              }`,
              borderRadius: "0.5rem",
              padding: "0.75rem 1rem",
            }}
          >
            <div
              style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                color:
                  step.alertType === "critical"
                    ? "#EF4444"
                    : step.alertType === "warning"
                    ? "#F59E0B"
                    : "#10B981",
                textTransform: "uppercase",
                marginBottom: "0.25rem",
              }}
            >
              {step.title}
            </div>
            <p
              style={{
                fontSize: "0.8rem",
                color: "var(--foreground)",
                lineHeight: 1.5,
              }}
            >
              {step.alert}
            </p>
          </div>

          {/* Simulated time */}
          <div
            style={{
              fontSize: "0.75rem",
              color: "var(--text-secondary)",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            Tempo simulado decorrido:{" "}
            <span style={{ fontWeight: 700, color: "var(--foreground)", fontFamily: "monospace" }}>
              {simulatedMinutes}min
            </span>
          </div>

          {/* Action buttons */}
          {!showingResult && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <div
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Escolha sua acao:
              </div>
              {step.actions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => handleAction(i)}
                  disabled={animatingLogs}
                  style={{
                    padding: "0.75rem 1rem",
                    borderRadius: "0.5rem",
                    border: "1px solid var(--border)",
                    background: "var(--surface)",
                    cursor: animatingLogs ? "not-allowed" : "pointer",
                    textAlign: "left",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    opacity: animatingLogs ? 0.5 : 1,
                    transition: "border-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (!animatingLogs) e.currentTarget.style.borderColor = "var(--primary)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)";
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 500,
                      color: "var(--foreground)",
                    }}
                  >
                    {action.label}
                  </span>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      color: "var(--text-secondary)",
                      fontFamily: "monospace",
                      background: "var(--background)",
                      padding: "0.15rem 0.5rem",
                      borderRadius: "0.25rem",
                    }}
                  >
                    +{action.timeCost}min
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Result narrative */}
          {showingResult && (
            <div
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "0.5rem",
                padding: "1rem",
              }}
            >
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "var(--foreground)",
                  lineHeight: 1.6,
                  marginBottom: "1rem",
                }}
              >
                {lastNarrative}
              </p>
              <button
                onClick={handleNext}
                style={{
                  padding: "0.625rem 1.5rem",
                  borderRadius: "0.5rem",
                  background: "var(--primary)",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                }}
              >
                {currentStep + 1 >= STEPS.length ? "Ver Post-mortem" : "Proximo Passo \u2192"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
