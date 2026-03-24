"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import FeatureLink from "@/components/ui/FeatureLink";
import {
  MOCK_EVENTS,
  EVENT_TYPES,
  EVENT_TYPE_LABELS,
} from "@/data/mock-events";
import type { PaymentEvent } from "@/data/mock-events";

/**
 * Explorador de Eventos — Timeline interativa de eventos de pagamento.
 *
 * Exibe uma lista cronológica de eventos de pagamento com filtros por tipo
 * e status. Cada evento pode ser expandido para revelar o payload JSON
 * completo. Inclui link para o fluxo completo de transação.
 */

/* -------------------------------------------------------------------------- */
/*                              Status Helpers                                */
/* -------------------------------------------------------------------------- */

const STATUS_CONFIG = {
  success: {
    label: "Sucesso",
    color: "var(--success)",
    bg: "rgba(22, 163, 74, 0.1)",
  },
  failed: {
    label: "Falha",
    color: "var(--error)",
    bg: "rgba(214, 64, 69, 0.1)",
  },
  pending: {
    label: "Pendente",
    color: "var(--warning)",
    bg: "rgba(233, 168, 32, 0.1)",
  },
} as const;

const STATUS_OPTIONS = ["all", "success", "failed", "pending"] as const;
type StatusFilter = (typeof STATUS_OPTIONS)[number];

const STATUS_LABELS: Record<StatusFilter, string> = {
  all: "Todos",
  success: "Sucesso",
  failed: "Falha",
  pending: "Pendente",
};

/* -------------------------------------------------------------------------- */
/*                         Format Helpers                                      */
/* -------------------------------------------------------------------------- */

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
  }).format(amount);
}

function formatJson(obj: Record<string, unknown>): string {
  return JSON.stringify(obj, null, 2);
}

/* -------------------------------------------------------------------------- */
/*                         Event Row Component                                */
/* -------------------------------------------------------------------------- */

function EventRow({ event }: { event: PaymentEvent }) {
  const [expanded, setExpanded] = useState(false);
  const statusConfig = STATUS_CONFIG[event.status];

  return (
    <div className="card-flat overflow-hidden hover:-translate-y-0.5 transition-all" style={{ boxShadow: "none" }}>
      {/* Main row */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left transition-colors"
        style={{ padding: "1rem" }}
      >
        <div className="flex items-center flex-wrap" style={{ gap: "1rem" }}>
          {/* Timeline dot */}
          <div className="flex flex-col items-center shrink-0">
            <div className="rounded-full" style={{ width: "0.75rem", height: "0.75rem", backgroundColor: statusConfig.color }} />
          </div>

          {/* Timestamp */}
          <div className="shrink-0" style={{ width: "10rem" }}>
            <p className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
              {formatTimestamp(event.timestamp)}
            </p>
          </div>

          {/* Event type badge */}
          <div className="shrink-0">
            <span
              className="rounded-md text-xs font-medium font-mono"
              style={{
                padding: "0.25rem 0.625rem",
                color: statusConfig.color,
                backgroundColor: statusConfig.bg,
              }}
            >
              {event.type}
            </span>
          </div>

          {/* Description */}
          <div className="flex-1 min-w-0">
            <p className="text-sm truncate" style={{ color: "var(--foreground)" }}>
              {event.description}
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)", marginTop: "0.125rem" }}>
              {event.merchant}
            </p>
          </div>

          {/* Amount */}
          <div className="text-right shrink-0" style={{ width: "7rem" }}>
            <p className="text-sm font-semibold font-mono">
              {formatCurrency(event.amount, event.currency)}
            </p>
          </div>

          {/* Payment ID */}
          <div className="shrink-0 hidden md:block">
            <span className="text-xs font-mono rounded" style={{ color: "var(--text-muted)", backgroundColor: "var(--surface-hover)", padding: "0.25rem 0.5rem" }}>
              {event.paymentId}
            </span>
          </div>

          {/* Status badge */}
          <div className="shrink-0">
            <span
              className="rounded-full text-xs font-medium"
              style={{
                padding: "0.125rem 0.5rem",
                color: statusConfig.color,
                backgroundColor: statusConfig.bg,
              }}
            >
              {statusConfig.label}
            </span>
          </div>

          {/* Expand toggle */}
          <div className="shrink-0">
            <span
              className={`inline-flex items-center justify-center rounded text-xs transition-transform ${
                expanded ? "rotate-180" : ""
              }`}
              style={{ width: "1.5rem", height: "1.5rem", color: "var(--text-muted)", backgroundColor: "var(--surface-hover)" }}
            >
              ▼
            </span>
          </div>
        </div>
      </button>

      {/* Expanded payload */}
      {expanded && (
        <div className="animate-fade-in" style={{ borderTop: "1px solid var(--border)", backgroundColor: "var(--surface-hover)", padding: "1rem" }}>
          <div className="flex items-center justify-between" style={{ marginBottom: "0.75rem" }}>
            <div className="flex items-center" style={{ gap: "0.75rem" }}>
              <h4 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                Payload do Evento
              </h4>
              <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                ID: {event.id}
              </span>
            </div>
            <Link
              href="/explore/transaction-flows"
              className="flex items-center text-xs font-medium transition-colors"
              style={{ gap: "0.375rem", color: "var(--primary)" }}
            >
              Ver fluxo completo
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>

          <pre className="text-xs font-mono leading-relaxed rounded-lg overflow-x-auto" style={{ color: "var(--foreground)", backgroundColor: "var(--surface)", border: "1px solid var(--border)", padding: "1rem" }}>
            {formatJson(event.payload)}
          </pre>

          {/* Meta info row */}
          <div className="flex items-center flex-wrap" style={{ gap: "1rem", marginTop: "0.75rem" }}>
            <div className="flex items-center text-xs" style={{ gap: "0.375rem", color: "var(--text-muted)" }}>
              <span className="font-medium">Método:</span>
              <span className="font-mono">{event.paymentMethod}</span>
            </div>
            <div className="flex items-center text-xs" style={{ gap: "0.375rem", color: "var(--text-muted)" }}>
              <span className="font-medium">Pagamento:</span>
              <span className="font-mono">{event.paymentId}</span>
            </div>
            <div className="flex items-center text-xs" style={{ gap: "0.375rem", color: "var(--text-muted)" }}>
              <span className="font-medium">Valor:</span>
              <span className="font-mono">
                {formatCurrency(event.amount, event.currency)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 Page                                       */
/* -------------------------------------------------------------------------- */

export default function EventExplorerPage() {
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  /* ---- Filter logic ---- */
  const filteredEvents = useMemo(() => {
    return MOCK_EVENTS.filter((event) => {
      const matchesType =
        selectedTypes.size === 0 || selectedTypes.has(event.type);
      const matchesStatus =
        statusFilter === "all" || event.status === statusFilter;
      return matchesType && matchesStatus;
    });
  }, [selectedTypes, statusFilter]);

  /* ---- Toggle event type chip ---- */
  function toggleType(type: string) {
    setSelectedTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  }

  /* ---- Stats ---- */
  const successCount = MOCK_EVENTS.filter((e) => e.status === "success").length;
  const failedCount = MOCK_EVENTS.filter((e) => e.status === "failed").length;
  const pendingCount = MOCK_EVENTS.filter((e) => e.status === "pending").length;

  return (
    <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
      {/* Header */}
      <div className="page-header animate-fade-in">
        <h1 className="page-title" style={{ marginBottom: "0.75rem" }}>Explorador de Eventos</h1>
        <p className="page-description">
          Timeline de eventos de pagamento em tempo real. Filtre por tipo ou
          status e expanda para ver o payload completo de cada evento.
        </p>
      </div>

      {/* Stats Section */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "2rem" }} className="animate-fade-in stagger-1">
        {[
          { label: "Eventos", value: "50+", icon: "📋" },
          { label: "Tipos", value: "8", icon: "🏷️" },
          { label: "Fontes", value: "5", icon: "🔗" },
          { label: "Filtros", value: "10", icon: "🔍" },
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

      {/* Summary Stats */}
      <div className="grid grid-cols-3 animate-fade-in stagger-2" style={{ gap: "1.25rem", marginBottom: "1.5rem" }}>
        <div className="card-glow" style={{ padding: "1rem" }}>
          <div className="flex items-center" style={{ gap: "0.5rem" }}>
            <div className="rounded-full" style={{ width: "0.625rem", height: "0.625rem", backgroundColor: "var(--success)" }} />
            <span className="text-sm" style={{ color: "var(--text-muted)" }}>Sucesso</span>
          </div>
          <p className="text-2xl font-bold" style={{ color: "var(--success)", marginTop: "0.25rem" }}>
            {successCount}
          </p>
        </div>
        <div className="card-glow" style={{ padding: "1rem" }}>
          <div className="flex items-center" style={{ gap: "0.5rem" }}>
            <div className="rounded-full" style={{ width: "0.625rem", height: "0.625rem", backgroundColor: "var(--error)" }} />
            <span className="text-sm" style={{ color: "var(--text-muted)" }}>Falha</span>
          </div>
          <p className="text-2xl font-bold" style={{ color: "var(--error)", marginTop: "0.25rem" }}>
            {failedCount}
          </p>
        </div>
        <div className="card-glow animate-fade-in stagger-3" style={{ padding: "1rem" }}>
          <div className="flex items-center" style={{ gap: "0.5rem" }}>
            <div className="rounded-full" style={{ width: "0.625rem", height: "0.625rem", backgroundColor: "var(--warning)" }} />
            <span className="text-sm" style={{ color: "var(--text-muted)" }}>Pendente</span>
          </div>
          <p className="text-2xl font-bold" style={{ color: "var(--warning)", marginTop: "0.25rem" }}>
            {pendingCount}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="card-glow animate-fade-in stagger-4" style={{ padding: "1.25rem", marginBottom: "1.5rem" }}>
        {/* Event type chips */}
        <div style={{ marginBottom: "1rem" }}>
          <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)", marginBottom: "0.75rem" }}>
            Filtrar por tipo de evento
          </h3>
          <div className="flex flex-wrap" style={{ gap: "0.5rem" }}>
            {EVENT_TYPES.map((type) => {
              const isActive = selectedTypes.has(type);
              return (
                <button
                  key={type}
                  onClick={() => toggleType(type)}
                  className="rounded-lg font-mono font-medium transition-all"
                  style={{
                    padding: "0.375rem 0.75rem",
                    fontSize: "13px",
                    ...(isActive
                      ? { backgroundColor: "var(--primary)", color: "white" }
                      : { backgroundColor: "var(--surface-hover)", color: "var(--text-muted)" }),
                  }}
                >
                  {type}
                </button>
              );
            })}
            {selectedTypes.size > 0 && (
              <button
                onClick={() => setSelectedTypes(new Set())}
                className="rounded-lg font-medium transition-colors"
                style={{ padding: "0.375rem 0.75rem", fontSize: "13px", color: "var(--error)", backgroundColor: "rgba(214,64,69,0.1)" }}
              >
                Limpar filtros
              </button>
            )}
          </div>
        </div>

        {/* Status filter */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)", marginBottom: "0.75rem" }}>
            Filtrar por status
          </h3>
          <div className="flex items-center" style={{ gap: "0.5rem" }}>
            {STATUS_OPTIONS.map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className="rounded-lg font-medium transition-all"
                style={{
                  padding: "0.375rem 0.75rem",
                  fontSize: "13px",
                  ...(statusFilter === status
                    ? { backgroundColor: "var(--primary)", color: "white" }
                    : { backgroundColor: "var(--surface-hover)", color: "var(--text-muted)" }),
                }}
              >
                {STATUS_LABELS[status]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Related features */}
      <div className="flex items-center text-sm animate-fade-in stagger-5" style={{ gap: "0.5rem", marginBottom: "1rem", color: "var(--text-muted)" }}>
        <span>Funcionalidades relacionadas:</span>
        <FeatureLink name="Webhooks & Notificações" />
        <span style={{ color: "var(--border)" }}>|</span>
        <FeatureLink name="Idempotency Keys" />
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between animate-fade-in stagger-5" style={{ marginBottom: "1rem" }}>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Exibindo{" "}
          <span className="font-semibold" style={{ color: "var(--foreground)" }}>
            {filteredEvents.length}
          </span>{" "}
          de {MOCK_EVENTS.length} eventos
        </p>
        <Link
          href="/explore/transaction-flows"
          className="flex items-center text-sm font-medium transition-colors"
          style={{ gap: "0.375rem", color: "var(--primary)" }}
        >
          Ver fluxo completo
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Event Timeline */}
      <div className="animate-fade-in stagger-6" style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "2rem" }}>
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <EventRow key={event.id} event={event} />
          ))
        ) : (
          <div className="card-flat text-center" style={{ padding: "2rem" }}>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Nenhum evento encontrado com os filtros selecionados.
            </p>
            <button
              onClick={() => {
                setSelectedTypes(new Set());
                setStatusFilter("all");
              }}
              className="text-sm font-medium rounded-lg transition-colors"
              style={{ marginTop: "0.75rem", padding: "0.5rem 1rem", backgroundColor: "var(--primary)", color: "white" }}
            >
              Limpar todos os filtros
            </button>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="card-glow animate-fade-in stagger-6" style={{ padding: "1.25rem", marginBottom: "2rem" }}>
        <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)", marginBottom: "0.75rem" }}>
          Legenda de tipos de evento
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5" style={{ gap: "0.75rem" }}>
          {EVENT_TYPES.map((type) => (
            <div key={type} className="flex items-center text-xs" style={{ gap: "0.5rem" }}>
              <span className="font-mono" style={{ color: "var(--text-muted)" }}>{type}</span>
              <span style={{ color: "var(--text-muted)" }}>
                {EVENT_TYPE_LABELS[type] ?? type}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Related Pages Footer */}
      <div className="divider-text animate-fade-in stagger-6" style={{ marginTop: "3rem" }}>
        <span>Paginas Relacionadas</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem", marginTop: "1.5rem" }}>
        {[
          { name: "Arvore de Metricas", href: "/diagnostics/metrics-tree", icon: "🌳" },
          { name: "Biblioteca de Problemas", href: "/diagnostics/problem-library", icon: "📚" },
        ].map((p) => (
          <a key={p.href} href={p.href} className="card-flat interactive-hover" style={{ padding: "1.25rem", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontSize: "1.5rem" }}>{p.icon}</span>
            <span style={{ color: "var(--foreground)", fontWeight: 500 }}>{p.name}</span>
            <span style={{ marginLeft: "auto", color: "var(--text-muted)" }}>→</span>
          </a>
        ))}
      </div>
    </div>
  );
}
