"use client";

import { useState } from "react";
import Link from "next/link";
import FeatureLink from "@/components/ui/FeatureLink";
import { getQuizForPage } from "@/data/quizzes";
import PageQuiz from "@/components/ui/PageQuiz";
import { useGameProgress } from "@/hooks/useGameProgress";
import {
  DASHBOARD_METRICS,
  BREAKDOWN_BY_METHOD,
  BREAKDOWN_BY_REGION,
  BREAKDOWN_BY_ACQUIRER,
} from "@/data/mock-events";
import type { DashboardMetric, DashboardBreakdown } from "@/data/mock-events";

/**
 * Dashboard de Pagamentos — Visão consolidada das métricas operacionais.
 *
 * Exibe as 4 métricas principais (Taxa de Autorização, Conversão, Fraude e
 * Chargeback) com sparklines e indicadores de tendência. Inclui breakdowns
 * por método de pagamento, região e adquirente. Cada métrica linka para a
 * Árvore de Métricas para investigação detalhada.
 */

/* -------------------------------------------------------------------------- */
/*                           Time Range Options                               */
/* -------------------------------------------------------------------------- */

const TIME_RANGES = [
  { label: "7d", value: "7d" },
  { label: "30d", value: "30d" },
  { label: "90d", value: "90d" },
] as const;

type TimeRange = (typeof TIME_RANGES)[number]["value"];

/* -------------------------------------------------------------------------- */
/*                         Sparkline SVG Component                            */
/* -------------------------------------------------------------------------- */

function Sparkline({
  data,
  color,
  width = 80,
  height = 28,
}: {
  data: number[];
  color: string;
  width?: number;
  height?: number;
}) {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(" L ")}`;
  const areaD = `${pathD} L ${width},${height} L 0,${height} Z`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
    >
      <defs>
        <linearGradient id={`gradient-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path
        d={areaD}
        fill={`url(#gradient-${color.replace("#", "")})`}
      />
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Last point dot */}
      <circle
        cx={(data.length - 1) / (data.length - 1) * width}
        cy={height - ((data[data.length - 1] - min) / range) * (height - 4) - 2}
        r="3"
        fill={color}
      />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*                           Metric Card Component                            */
/* -------------------------------------------------------------------------- */

/** Métricas invertidas: para fraude e chargeback, queda é positiva */
const INVERTED_METRICS = new Set(["fraud-rate", "chargeback-rate"]);

function MetricCard({
  metric,
  index,
}: {
  metric: DashboardMetric;
  index: number;
}) {
  const isInverted = INVERTED_METRICS.has(metric.id);
  const isPositiveTrend = isInverted
    ? metric.trend === "down"
    : metric.trend === "up";

  const trendColor = isPositiveTrend
    ? "var(--primary)"
    : "var(--error)";

  const trendArrow = metric.trend === "up" ? "↑" : "↓";

  return (
    <Link href="/diagnostics/metrics-tree">
      <div
        className={`card-glow cursor-pointer animate-fade-in stagger-${Math.min(
          index + 1,
          6
        )}`}
        style={{ padding: "1.25rem" }}
      >
        <div className="flex items-start justify-between" style={{ marginBottom: "0.75rem" }}>
          <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
            {metric.name}
          </p>
          <span
            className="flex items-center text-xs font-semibold rounded-full"
            style={{
              gap: "0.25rem",
              padding: "0.125rem 0.5rem",
              color: trendColor,
              backgroundColor: isPositiveTrend
                ? "rgba(22, 163, 74, 0.1)"
                : "rgba(214, 64, 69, 0.1)",
            }}
          >
            {trendArrow} {Math.abs(metric.trendDelta).toFixed(2)}
            {metric.unit}
          </span>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-3xl font-bold" style={{ color: "var(--foreground)" }}>
              {metric.value}
              <span className="text-lg font-normal" style={{ color: "var(--text-muted)" }}>
                {metric.unit}
              </span>
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)", marginTop: "0.25rem" }}>
              vs período anterior: {metric.previousValue}{metric.unit}
            </p>
          </div>
          <Sparkline data={metric.sparklineData} color={trendColor} />
        </div>
      </div>
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/*                       Breakdown Bar Chart Component                        */
/* -------------------------------------------------------------------------- */

function BreakdownChart({
  breakdown,
  index,
}: {
  breakdown: DashboardBreakdown;
  index: number;
}) {
  return (
    <div className={`card-glow animate-fade-in stagger-${Math.min(index + 3, 6)}`} style={{ padding: "1.25rem" }}>
      <h3 className="text-sm font-semibold" style={{ marginBottom: "1rem" }}>{breakdown.title}</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {breakdown.items.map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between text-sm" style={{ marginBottom: "0.25rem" }}>
              <span style={{ color: "var(--foreground)" }}>{item.label}</span>
              <span className="font-mono text-xs" style={{ color: "var(--text-muted)" }}>
                {item.value.toLocaleString("pt-BR")} ({item.percentage}%)
              </span>
            </div>
            <div className="w-full rounded-full overflow-hidden" style={{ height: "0.625rem", backgroundColor: "var(--surface-hover)" }}>
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${item.percentage}%`,
                  background: `linear-gradient(90deg, var(--primary) 0%, var(--primary-lighter) 100%)`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 Page                                       */
/* -------------------------------------------------------------------------- */

export default function PaymentsDashboardPage() {
  const quiz = getQuizForPage("/observability/payments-dashboard");
  const { recordQuiz } = useGameProgress();
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");

  const breakdowns = [BREAKDOWN_BY_METHOD, BREAKDOWN_BY_REGION, BREAKDOWN_BY_ACQUIRER];

  return (
    <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
      {/* Header */}
      <div className="page-header animate-fade-in">
        <h1 className="page-title" style={{ marginBottom: "0.75rem" }}>Dashboard de Pagamentos</h1>
        <p className="page-description">
          Visão consolidada das métricas operacionais de pagamento. Clique em
          qualquer métrica para explorar a árvore de métricas detalhada.
        </p>
      </div>

      <div className="learning-objectives" style={{ marginBottom: "1.5rem" }}>
        <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--primary)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          O que você vai aprender
        </p>
        <ul>
          <li>Monitoramento de saúde do sistema de pagamentos</li>
          <li>KPIs essenciais para observabilidade</li>
          <li>Como diagnosticar problemas via dashboard</li>
        </ul>
      </div>

      {/* Stats Section */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "2rem" }} className="animate-fade-in stagger-1">
        {[
          { label: "Metricas", value: "12", icon: "📊" },
          { label: "Graficos", value: "5", icon: "📈" },
          { label: "Periodos", value: "3", icon: "📅" },
          { label: "KPIs", value: "8", icon: "🎯" },
        ].map((stat) => (
          <div key={stat.label} className="stat-card" style={{ padding: "1.25rem", textAlign: "center" }}>
            <span style={{ fontSize: "1.5rem" }}>{stat.icon}</span>
            <p className="metric-value" style={{ margin: "0.5rem 0 0.25rem" }}>{stat.value}</p>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontStyle: "italic", marginBottom: "2rem", opacity: 0.7 }}>
        * Numeros podem variar conforme fonte e data de consulta. Valores aproximados para fins didaticos.
      </p>

      {/* Time Range Selector + Context */}
      <div className="flex items-center justify-between flex-wrap animate-fade-in stagger-2" style={{ gap: "1rem", marginBottom: "1.5rem" }}>
        <div className="flex items-center text-sm" style={{ gap: "0.5rem", color: "var(--text-muted)" }}>
          <span>Funcionalidades relacionadas:</span>
          <FeatureLink name="Smart Routing" />
          <span style={{ color: "var(--border)" }}>|</span>
          <FeatureLink name="Fraud Scoring" />
          <span style={{ color: "var(--border)" }}>|</span>
          <FeatureLink name="Settlement Reconciliation" />
        </div>

        <div className="flex items-center rounded-lg overflow-hidden" style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}>
          {TIME_RANGES.map((range) => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value)}
              className="text-sm font-medium transition-colors"
              style={{
                padding: "0.5rem 1rem",
                ...(timeRange === range.value
                  ? { backgroundColor: "var(--primary)", color: "white" }
                  : { color: "var(--text-muted)" }),
              }}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Período selecionado */}
      <div className="animate-fade-in stagger-3" style={{ marginBottom: "1.5rem" }}>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          Período selecionado:{" "}
          <span className="font-medium" style={{ color: "var(--foreground)" }}>
            {timeRange === "7d"
              ? "Últimos 7 dias"
              : timeRange === "30d"
              ? "Últimos 30 dias"
              : "Últimos 90 dias"}
          </span>{" "}
          — Dados atualizados em tempo real
        </p>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: "1rem", marginBottom: "2rem" }}>
        {DASHBOARD_METRICS.map((metric, idx) => (
          <MetricCard key={metric.id} metric={metric} index={idx} />
        ))}
      </div>

      {/* Breakdowns */}
      <div className="animate-fade-in stagger-5" style={{ marginBottom: "1.5rem" }}>
        <h2 className="text-xl font-bold" style={{ marginBottom: "0.25rem" }}>Detalhamento</h2>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Distribuição de transações por diferentes dimensões no período selecionado.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: "1rem", marginBottom: "2rem" }}>
        {breakdowns.map((breakdown, idx) => (
          <BreakdownChart
            key={breakdown.title}
            breakdown={breakdown}
            index={idx}
          />
        ))}
      </div>

      {/* Related Pages Footer */}
      <div className="divider-text animate-fade-in stagger-6" style={{ marginTop: "3rem" }}>
        <span>Paginas Relacionadas</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem", marginTop: "1.5rem" }}>
        {[
          { name: "Arvore de Metricas", href: "/diagnostics/metrics-tree", icon: "🌳" },
          { name: "Explorador de Eventos", href: "/observability/event-explorer", icon: "🔍" },
          { name: "Conta Comigo", href: "/assistant", icon: "🤖" },
        ].map((p) => (
          <a key={p.href} href={p.href} className="card-flat interactive-hover" style={{ padding: "1.25rem", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontSize: "1.5rem" }}>{p.icon}</span>
            <span style={{ color: "var(--foreground)", fontWeight: 500 }}>{p.name}</span>
            <span style={{ marginLeft: "auto", color: "var(--text-muted)" }}>→</span>
          </a>
        ))}
      </div>

      {quiz && !quizCompleted && (
        <div style={{ marginTop: "2.5rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem", color: "var(--foreground)" }}>
            🧠 Teste seu Conhecimento
          </h2>
          <PageQuiz
            questions={quiz.questions}
            xpPerQuestion={5}
            onComplete={(correct, total) => {
              recordQuiz(quiz.pageRoute, correct, total);
              setQuizCompleted(true);
            }}
          />
        </div>
      )}
    </div>
  );
}
