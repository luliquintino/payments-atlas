"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  FEATURES_REGISTRY,
  getFeatureById,
  getDependencies,
  getDependents,
} from "@/data/features";
import {
  LAYER_LABELS,
  LAYER_COLORS,
  COMPLEXITY_LABELS,
  COMPLEXITY_COLORS,
} from "@/data/types";
import type { PaymentFeature, Layer, Complexity } from "@/data/types";

// ---------------------------------------------------------------------------
// Componente de página de detalhe da feature
// ---------------------------------------------------------------------------

export default function FeatureDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const feature = getFeatureById(id);

  if (!feature) {
    return (
      <div
        className="max-w-3xl mx-auto text-center animate-fade-in"
        style={{ paddingTop: 80, paddingBottom: 80 }}
      >
        <div className="text-6xl" style={{ marginBottom: 16 }}>🔍</div>
        <h1 className="text-2xl font-bold" style={{ marginBottom: 8 }}>Feature não encontrada</h1>
        <p style={{ marginBottom: 24, color: "var(--text-muted)" }}>
          A feature &ldquo;{id}&rdquo; não existe no registro.
        </p>
        <Link
          href="/knowledge/features"
          className="rounded-xl font-medium transition-colors"
          style={{
            padding: "10px 20px",
            background: "var(--primary)",
            color: "#fff",
          }}
        >
          Voltar para Base de Features
        </Link>
      </div>
    );
  }

  const deps = getDependencies(feature.id);
  const dependents = getDependents(feature.id);

  return (
    <div className="max-w-4xl mx-auto">
      {/* ---- Header ---- */}
      <div className="page-header animate-fade-in">
        <h1 className="page-title" style={{ marginBottom: 12 }}>{feature.name}</h1>
        <p className="page-description" style={{ marginBottom: 20 }}>
          {feature.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap" style={{ gap: 10 }}>
          <span
            className={`chip text-xs font-semibold ${LAYER_COLORS[feature.layer]}`}
          >
            {LAYER_LABELS[feature.layer]}
          </span>
          <span className="chip chip-muted text-xs font-semibold">
            {feature.category}
          </span>
          <span
            className={`chip text-xs font-semibold ${COMPLEXITY_COLORS[feature.complexity]}`}
          >
            Complexidade: {COMPLEXITY_LABELS[feature.complexity]}
          </span>
        </div>
      </div>

      {/* Disclaimer */}
      <div
        className="animate-fade-in stagger-1"
        style={{
          marginBottom: 20,
          padding: "12px 16px",
          borderRadius: 10,
          border: "1px solid var(--border)",
          background: "var(--surface-hover)",
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontSize: 13,
          color: "var(--text-muted)",
        }}
      >
        <span style={{ fontSize: 16 }}>⚠️</span>
        Os números, dependências e métricas exibidos nesta página são ilustrativos e
        podem variar conforme o ambiente e a configuração do sistema.
      </div>

      <div
        className="grid grid-cols-1 lg:grid-cols-3"
        style={{ gap: 20 }}
      >
        {/* ---- Coluna principal ---- */}
        <div className="lg:col-span-2" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Atores */}
          <div className="card animate-fade-in stagger-1">
            <h2 className="section-heading" style={{ marginBottom: 12 }}>
              👥 Atores Envolvidos
            </h2>
            <div className="flex flex-wrap" style={{ gap: 10 }}>
              {feature.actors.map((actor) => (
                <span
                  key={actor}
                  className="chip chip-muted text-sm font-medium"
                >
                  {actor}
                </span>
              ))}
            </div>
          </div>

          {/* Métricas Impactadas */}
          {feature.metricsImpacted && feature.metricsImpacted.length > 0 && (
            <div className="card animate-fade-in stagger-2">
              <h2 className="section-heading" style={{ marginBottom: 12 }}>
                📊 Métricas Impactadas
              </h2>
              <div className="flex flex-wrap" style={{ gap: 10 }}>
                {feature.metricsImpacted.map((metric) => (
                  <span
                    key={metric}
                    className="chip chip-primary text-sm font-medium"
                  >
                    <span
                      className="rounded-full"
                      style={{
                        width: 8,
                        height: 8,
                        background: "var(--primary-light)",
                      }}
                    />
                    {metric}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Regras de Negócio */}
          {feature.businessRules && feature.businessRules.length > 0 && (
            <div className="card animate-fade-in stagger-3">
              <h2 className="section-heading" style={{ marginBottom: 12 }}>
                📋 Regras de Negócio
              </h2>
              <ul style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {feature.businessRules.map((rule, i) => (
                  <li
                    key={i}
                    className="flex items-start text-sm rounded-lg transition-colors"
                    style={{
                      gap: 12,
                      padding: 12,
                      background: "color-mix(in srgb, var(--surface-hover) 50%, transparent)",
                    }}
                  >
                    <span
                      className="flex items-center justify-center text-xs font-bold shrink-0 rounded-lg"
                      style={{
                        width: 24,
                        height: 24,
                        marginTop: 2,
                        background: "linear-gradient(to bottom right, var(--primary), var(--primary-light))",
                        color: "#fff",
                      }}
                    >
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Dependências (grafo mini) */}
          <div className="card animate-fade-in stagger-4">
            <h2 className="section-heading" style={{ marginBottom: 12 }}>
              🔗 Dependências
            </h2>

            {deps.length === 0 && dependents.length === 0 ? (
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Esta feature não possui dependências diretas registradas.
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Depende de */}
                {deps.length > 0 && (
                  <div>
                    <h3
                      className="text-xs font-medium"
                      style={{ color: "var(--text-muted)", marginBottom: 8 }}
                    >
                      Depende de ({deps.length})
                    </h3>
                    <div className="flex flex-wrap" style={{ gap: 8 }}>
                      {deps.map((dep) => (
                        <Link
                          key={dep.id}
                          href={`/knowledge/features/${dep.id}`}
                          className="rounded-lg text-sm font-medium transition-colors"
                          style={{
                            padding: "6px 12px",
                            border: "1px solid var(--border)",
                            background: "var(--surface)",
                          }}
                        >
                          ← {dep.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Requerido por */}
                {dependents.length > 0 && (
                  <div>
                    <h3
                      className="text-xs font-medium"
                      style={{ color: "var(--text-muted)", marginBottom: 8 }}
                    >
                      Requerido por ({dependents.length})
                    </h3>
                    <div className="flex flex-wrap" style={{ gap: 8 }}>
                      {dependents.map((dep) => (
                        <Link
                          key={dep.id}
                          href={`/knowledge/features/${dep.id}`}
                          className="rounded-lg text-sm font-medium transition-colors"
                          style={{
                            padding: "6px 12px",
                            border: "1px solid var(--border)",
                            background: "var(--surface)",
                          }}
                        >
                          {dep.name} →
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Link para grafo completo */}
            <div
              style={{
                marginTop: 16,
                paddingTop: 12,
                borderTop: "1px solid var(--border)",
              }}
            >
              <Link
                href="/knowledge/dependency-graph"
                className="text-sm font-medium inline-flex items-center"
                style={{ gap: 4, color: "var(--primary)" }}
              >
                Ver no Grafo de Dependências
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* ---- Sidebar ---- */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Ações rápidas */}
          <div className="card animate-fade-in stagger-2">
            <h2 className="section-heading" style={{ marginBottom: 16 }}>
              ⚡ Ações
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Link
                href={`/simulation/payment-simulator?propose=${feature.id}`}
                className="w-full flex items-center rounded-xl text-sm font-semibold transition-all"
                style={{
                  gap: 10,
                  padding: "12px 16px",
                  background: "linear-gradient(to right, var(--primary), var(--primary-light))",
                  color: "#fff",
                }}
              >
                🧪 Simular Impacto
              </Link>
              <Link
                href="/knowledge/dependency-graph"
                className="w-full flex items-center rounded-xl text-sm font-medium transition-all"
                style={{
                  gap: 10,
                  padding: "12px 16px",
                  border: "1px solid var(--border)",
                }}
              >
                🔗 Ver Dependências
              </Link>
              <Link
                href="/diagnostics/problem-library"
                className="w-full flex items-center rounded-xl text-sm font-medium transition-all"
                style={{
                  gap: 10,
                  padding: "12px 16px",
                  border: "1px solid var(--border)",
                }}
              >
                ⚠️ Problemas Relacionados
              </Link>
            </div>
          </div>

          {/* Info técnica */}
          <div className="card-flat animate-fade-in stagger-3">
            <h2 className="section-heading" style={{ marginBottom: 16 }}>
              📌 Info Técnica
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div className="rounded-lg" style={{ padding: 12, background: "var(--surface-hover)" }}>
                <dt
                  className="uppercase tracking-wider"
                  style={{ color: "var(--text-muted)", fontSize: 11, marginBottom: 4 }}
                >
                  Camada
                </dt>
                <dd className="font-semibold text-sm">{LAYER_LABELS[feature.layer]}</dd>
              </div>
              <div className="rounded-lg" style={{ padding: 12, background: "var(--surface-hover)" }}>
                <dt
                  className="uppercase tracking-wider"
                  style={{ color: "var(--text-muted)", fontSize: 11, marginBottom: 4 }}
                >
                  Categoria
                </dt>
                <dd className="font-semibold text-sm">{feature.category}</dd>
              </div>
              <div className="rounded-lg" style={{ padding: 12, background: "var(--surface-hover)" }}>
                <dt
                  className="uppercase tracking-wider"
                  style={{ color: "var(--text-muted)", fontSize: 11, marginBottom: 4 }}
                >
                  Complexidade
                </dt>
                <dd className="font-semibold text-sm capitalize">
                  {COMPLEXITY_LABELS[feature.complexity]}
                </dd>
              </div>
              <div className="rounded-lg" style={{ padding: 12, background: "var(--surface-hover)" }}>
                <dt
                  className="uppercase tracking-wider"
                  style={{ color: "var(--text-muted)", fontSize: 11, marginBottom: 4 }}
                >
                  ID
                </dt>
                <dd
                  className="font-mono text-xs rounded-md inline-block"
                  style={{ background: "var(--surface)", padding: "6px 10px" }}
                >
                  {feature.id}
                </dd>
              </div>
            </div>
          </div>

          {/* Features relacionadas (mesma camada) */}
          <div className="card-flat animate-fade-in stagger-4">
            <h2 className="section-heading" style={{ marginBottom: 12 }}>
              🏷️ Mesma Camada
            </h2>
            <div className="flex flex-wrap" style={{ gap: 10 }}>
              {FEATURES_REGISTRY.filter(
                (f) => f.layer === feature.layer && f.id !== feature.id
              )
                .slice(0, 6)
                .map((f) => (
                  <Link
                    key={f.id}
                    href={`/knowledge/features/${f.id}`}
                    className="inline-flex items-center rounded-lg text-sm font-medium transition-all"
                    style={{
                      gap: 6,
                      padding: "8px 14px",
                      border: "1px solid var(--border)",
                      background: "var(--surface-hover)",
                    }}
                  >
                    {f.name}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* ---- Footer: Related pages ---- */}
      <div
        className="animate-fade-in stagger-5"
        style={{
          marginTop: 32,
          paddingTop: 24,
          borderTop: "1px solid var(--border)",
        }}
      >
        <h3
          className="divider-text"
          style={{ marginBottom: 16 }}
        >
          Páginas Relacionadas
        </h3>
        <div className="flex flex-wrap" style={{ gap: 12 }}>
          <Link
            href="/knowledge/features"
            className="card-flat interactive-hover inline-flex items-center text-sm font-medium"
            style={{ gap: 8, padding: "10px 18px" }}
          >
            📚 Base de Features
          </Link>
          <Link
            href="/knowledge/dependency-graph"
            className="card-flat interactive-hover inline-flex items-center text-sm font-medium"
            style={{ gap: 8, padding: "10px 18px" }}
          >
            🔗 Grafo de Dependências
          </Link>
          <Link
            href="/knowledge/business-rules"
            className="card-flat interactive-hover inline-flex items-center text-sm font-medium"
            style={{ gap: 8, padding: "10px 18px" }}
          >
            📋 Regras de Negócio
          </Link>
        </div>
      </div>
    </div>
  );
}
