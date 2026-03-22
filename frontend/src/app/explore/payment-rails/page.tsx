"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { getQuizForPage } from "@/data/quizzes";
import PageQuiz from "@/components/ui/PageQuiz";
import { useGameProgress } from "@/hooks/useGameProgress";
import {
  getRailDetail,
  type RailDetailSection,
  type RailSectionCards,
  type RailSectionTable,
  type RailSectionSteps,
  type RailSectionComparison,
  type RailSectionText,
} from "@/data/rail-details";

/**
 * Trilhos de Pagamento — Visao geral dos principais trilhos de pagamento,
 * incluindo tradicionais (cartoes, transferencias, carteiras) e cripto
 * (blockchain nativo, stablecoins).
 *
 * Cards simplificados convidam ao clique; modal exibe conteudo completo.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RailCharacteristics {
  settlementTime: string;
  typicalFees: string;
  coverage: string;
  reversibility: string;
}

interface PaymentRail {
  name: string;
  description: string;
  icon: string;
  colorFrom: string;
  colorTo: string;
  characteristics: RailCharacteristics;
  supportedRegions: string[];
  keyActors: string[];
  useCases: string[];
  atlasLink?: { label: string; href: string };
}

// ---------------------------------------------------------------------------
// Dados — 5 trilhos de pagamento
// ---------------------------------------------------------------------------

const paymentRails: PaymentRail[] = [
  {
    name: "Cartoes",
    description:
      "Redes de cartao de credito e debito — o trilho de pagamento online mais amplamente adotado globalmente. As transacoes fluem pelas bandeiras (Visa, Mastercard) do emissor ao adquirente.",
    icon: "\u{1F4B3}",
    colorFrom: "var(--primary)",
    colorTo: "var(--primary-light)",
    characteristics: {
      settlementTime: "T+1 a T+3",
      typicalFees: "1,5% - 3,5% + fixo",
      coverage: "Global (200+ paises)",
      reversibility: "Chargebacks ate 120 dias",
    },
    supportedRegions: [
      "America do Norte",
      "Europa",
      "LATAM",
      "Asia-Pacifico",
      "Oriente Medio",
      "Africa",
    ],
    keyActors: [
      "Visa",
      "Mastercard",
      "American Express",
      "Discover",
      "UnionPay",
      "Elo (Brasil)",
      "JCB (Japao)",
    ],
    useCases: [
      "Checkout de e-commerce",
      "Cobranca recorrente",
      "Compras in-app",
      "Ponto de venda",
    ],
    atlasLink: { label: "Ver Mapa de Pagamentos", href: "/explore/payments-map" },
  },
  {
    name: "Transferencias Bancarias",
    description:
      "Transferencias diretas conta-a-conta utilizando trilhos bancarios locais ou internacionais. Inclui esquemas de pagamento instantaneo (PIX, SEPA Instant) e sistemas em lote (ACH, BACS).",
    icon: "\u{1F3E6}",
    colorFrom: "var(--primary)",
    colorTo: "var(--primary-light)",
    characteristics: {
      settlementTime: "Instantaneo a T+3",
      typicalFees: "0% - 1% (geralmente fixo)",
      coverage: "Regional / domestico",
      reversibility: "Limitada — frequentemente irrevogavel apos confirmacao",
    },
    supportedRegions: [
      "Brasil (PIX)",
      "UE (SEPA)",
      "UK (Faster Payments)",
      "EUA (ACH / FedNow)",
      "India (UPI)",
      "Australia (NPP)",
    ],
    keyActors: [
      "Bancos Centrais",
      "PIX (BACEN)",
      "SEPA (EPC)",
      "ACH (Nacha)",
      "Faster Payments (UK)",
      "UPI (NPCI)",
      "FedNow (Federal Reserve)",
    ],
    useCases: [
      "Pagamento de contas",
      "Folha de pagamento",
      "Desembolsos governamentais",
      "Transferencias P2P",
      "B2B de alto valor",
    ],
    atlasLink: { label: "Ver Sistemas de Liquidacao", href: "/infrastructure/settlement-systems" },
  },
  {
    name: "Carteiras Digitais",
    description:
      "Carteiras digitais e contas de valor armazenado que permitem aos usuarios pagar a partir de um saldo pre-carregado ou fonte de financiamento vinculada. Podem ser closed-loop (especificas do lojista) ou open-loop.",
    icon: "\u{1F4F1}",
    colorFrom: "var(--primary)",
    colorTo: "var(--primary-light)",
    characteristics: {
      settlementTime: "Instantaneo a T+1",
      typicalFees: "0% - 2,5%",
      coverage: "Varia — dominancia regional",
      reversibility: "Dependente do provedor",
    },
    supportedRegions: [
      "China (Alipay / WeChat)",
      "India (Paytm / PhonePe)",
      "Africa (M-Pesa)",
      "Sudeste Asiatico (GrabPay / GoPay)",
      "Global (PayPal / Apple Pay)",
    ],
    keyActors: [
      "PayPal",
      "Apple Pay",
      "Google Pay",
      "Alipay",
      "WeChat Pay",
      "M-Pesa",
      "MercadoPago",
      "GrabPay",
    ],
    useCases: [
      "Comercio mobile",
      "Pagamento contactless em loja",
      "Transferencias P2P",
      "Remessas cross-border",
    ],
    atlasLink: { label: "Ver Ecossistema", href: "/explore/ecosystem-map" },
  },
  {
    name: "Pagamentos Blockchain",
    description:
      "Trilhos de pagamento baseados em blockchain utilizando criptomoedas nativas (BTC, ETH, SOL) para transferencia de valor peer-to-peer sem intermediarios. Infraestrutura descentralizada com liquidacao on-chain irrevogavel.",
    icon: "\u{1F517}",
    colorFrom: "#7c3aed",
    colorTo: "#a78bfa",
    characteristics: {
      settlementTime: "Segundos a minutos",
      typicalFees: "< $1 (taxas de gas variaveis)",
      coverage: "Sem fronteiras (permissionless)",
      reversibility: "Irreversivel apos confirmacao on-chain",
    },
    supportedRegions: [
      "Global (permissionless)",
      "Forte nos EUA, UE, LATAM, Sudeste Asiatico",
    ],
    keyActors: [
      "Ethereum",
      "Bitcoin",
      "Solana",
      "Polygon",
      "Arbitrum",
      "Coinbase Commerce",
      "BitPay",
      "Lightning Network",
    ],
    useCases: [
      "Pagamentos P2P cross-border",
      "Remessas internacionais",
      "Liquidacao DeFi",
      "Micropagamentos",
      "Pagamentos machine-to-machine",
    ],
    atlasLink: { label: "Ver Mapa Blockchain", href: "/crypto/blockchain-map" },
  },
  {
    name: "Stablecoins",
    description:
      "Trilhos de pagamento utilizando tokens digitais ancorados a moedas fiduciarias (USDC, USDT, PYUSD) que combinam a estabilidade de precos do fiat com a velocidade e alcance global do blockchain. O trilho de maior crescimento para B2B cross-border.",
    icon: "\u{1FA99}",
    colorFrom: "#0ea5e9",
    colorTo: "#38bdf8",
    characteristics: {
      settlementTime: "Segundos (finality on-chain)",
      typicalFees: "< 0,1% em L2s / < $1 fixo",
      coverage: "Global — 24/7/365",
      reversibility: "Irreversivel (exceto freeze por emissor)",
    },
    supportedRegions: [
      "Global (on-chain)",
      "EUA (USDC via Circle)",
      "LATAM (USDT dominante)",
      "Europa (EUR stablecoins)",
      "Asia (forte adocao em remessas)",
    ],
    keyActors: [
      "Circle (USDC)",
      "Tether (USDT)",
      "PayPal (PYUSD)",
      "Paxos (USDP / BUSD)",
      "MakerDAO (DAI)",
      "Stripe Stablecoin Payments",
      "Visa Stablecoin Settlement",
    ],
    useCases: [
      "Pagamentos B2B cross-border",
      "Remessas (LATAM, Africa, Asia)",
      "Treasury operations (corporate)",
      "Liquidacao mercado interbancario",
      "Comercio e-commerce global",
      "Payouts para creators/freelancers",
    ],
    atlasLink: { label: "Ver Sistemas de Stablecoin", href: "/crypto/stablecoin-systems" },
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const characteristicLabels: { key: keyof RailCharacteristics; label: string }[] = [
  { key: "settlementTime", label: "Liquidacao" },
  { key: "typicalFees", label: "Taxas" },
  { key: "coverage", label: "Cobertura" },
  { key: "reversibility", label: "Reversibilidade" },
];

/** Map section type to emoji icon */
function sectionIcon(type: string): string {
  switch (type) {
    case "cards": return "\u{1F4CB}";
    case "table": return "\u{1F4CA}";
    case "steps": return "\u{1F504}";
    case "comparison": return "\u2696\uFE0F";
    case "text": return "\u{1F4DD}";
    default: return "\u{1F4C4}";
  }
}

// ---------------------------------------------------------------------------
// Section Renderers
// ---------------------------------------------------------------------------

function SectionCards({ section }: { section: RailSectionCards }) {
  return (
    <div>
      {section.description && (
        <p className="text-sm text-[var(--text-muted)] leading-relaxed" style={{ marginBottom: "1rem" }}>
          {section.description}
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "1rem" }}>
        {section.items.map((item) => (
          <div key={item.name} className="card-flat" style={{ padding: "1.25rem" }}>
            <h4 className="font-bold text-sm" style={{ marginBottom: "0.375rem" }}>
              {item.name}
            </h4>
            <p
              className="text-xs text-[var(--text-muted)] leading-relaxed"
              style={{ marginBottom: "0.875rem" }}
            >
              {item.description}
            </p>
            <div>
              {item.details.map((d, idx) => (
                <div
                  key={d.label}
                  className="flex text-xs"
                  style={{
                    padding: "0.375rem 0",
                    gap: "0.5rem",
                    borderTop: idx > 0 ? "1px solid var(--border)" : "none",
                  }}
                >
                  <span
                    className="font-semibold text-[var(--text-muted)] whitespace-nowrap"
                    style={{ minWidth: "120px" }}
                  >
                    {d.label}:
                  </span>
                  <span style={{ color: "var(--foreground)" }}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionTable({ section }: { section: RailSectionTable }) {
  return (
    <div>
      {section.description && (
        <p className="text-sm text-[var(--text-muted)] leading-relaxed" style={{ marginBottom: "1rem" }}>
          {section.description}
        </p>
      )}
      <div
        className="overflow-x-auto rounded-lg border border-[var(--border)]"
        style={{ maxHeight: "24rem" }}
      >
        <table className="w-full" style={{ fontSize: "0.8125rem" }}>
          <thead>
            <tr style={{ position: "sticky", top: 0, zIndex: 1 }}>
              {section.columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left font-semibold text-[var(--text-muted)] uppercase tracking-wider whitespace-nowrap"
                  style={{
                    padding: "0.75rem 1rem",
                    fontSize: "0.6875rem",
                    borderBottom: "2px solid var(--border)",
                    background: "var(--surface-hover)",
                  }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {section.rows.map((row, idx) => (
              <tr
                key={idx}
                className="transition-colors duration-150"
                style={{
                  borderTop: idx > 0 ? "1px solid var(--border)" : undefined,
                  background: idx % 2 === 1 ? "var(--surface-hover)" : "transparent",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "var(--surface-active)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    idx % 2 === 1 ? "var(--surface-hover)" : "transparent";
                }}
              >
                {section.columns.map((col) => (
                  <td
                    key={col.key}
                    className={col.key === section.columns[0]?.key ? "font-semibold" : ""}
                    style={{ padding: "0.625rem 1rem", lineHeight: "1.5" }}
                  >
                    {row[col.key] ?? "\u2014"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SectionSteps({ section }: { section: RailSectionSteps }) {
  return (
    <div>
      {section.description && (
        <p className="text-sm text-[var(--text-muted)] leading-relaxed" style={{ marginBottom: "1rem" }}>
          {section.description}
        </p>
      )}
      <div className="relative" style={{ paddingLeft: "3rem" }}>
        {/* Vertical connector line — centered through circles */}
        <div
          className="absolute"
          style={{
            left: "1.125rem",
            top: "1.125rem",
            bottom: "1.125rem",
            width: "2px",
            background: "var(--border)",
            transform: "translateX(-1px)",
          }}
        />
        <div>
          {section.steps.map((s, idx) => (
            <div
              key={s.step}
              className="relative"
              style={{ marginBottom: idx < section.steps.length - 1 ? "1.25rem" : "0" }}
            >
              {/* Step number circle */}
              <div
                className="absolute flex items-center justify-center rounded-full text-white text-xs font-bold"
                style={{
                  left: "-3rem",
                  top: "0.75rem",
                  width: "2.25rem",
                  height: "2.25rem",
                  background: "var(--primary)",
                  boxShadow: "0 2px 8px rgba(30, 58, 95, 0.25)",
                }}
              >
                {s.step}
              </div>
              <div className="card-flat" style={{ padding: "1rem 1.25rem" }}>
                <h4 className="font-semibold text-sm" style={{ marginBottom: "0.25rem" }}>
                  {s.label}
                </h4>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  {s.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SectionComparison({ section }: { section: RailSectionComparison }) {
  return (
    <div>
      {section.description && (
        <p className="text-sm text-[var(--text-muted)] leading-relaxed" style={{ marginBottom: "1rem" }}>
          {section.description}
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: "1rem" }}>
        {section.groups.map((group) => {
          const color = group.color || "var(--primary)";
          return (
            <div
              key={group.name}
              className="card-flat overflow-hidden"
              style={{ borderTop: `4px solid ${color}` }}
            >
              {/* Gradient color bar */}
              <div
                style={{
                  height: "6px",
                  background: `linear-gradient(90deg, ${color}, ${color}88)`,
                }}
              />
              {/* Content with subtle tint */}
              <div
                style={{
                  padding: "1.25rem",
                  background: `linear-gradient(180deg, ${color}08 0%, transparent 60%)`,
                }}
              >
                <h4
                  className="font-bold text-sm flex items-center"
                  style={{ marginBottom: "0.875rem", color, gap: "0.5rem" }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      width: "0.5rem",
                      height: "0.5rem",
                      borderRadius: "50%",
                      background: color,
                    }}
                  />
                  {group.name}
                </h4>
                <div>
                  {group.items.map((item, idx) => (
                    <div
                      key={item.label}
                      className="text-xs"
                      style={{
                        padding: "0.5rem 0",
                        borderTop: idx > 0 ? "1px solid var(--border)" : "none",
                      }}
                    >
                      <span className="font-semibold text-[var(--text-muted)]">
                        {item.label}:{" "}
                      </span>
                      <span>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SectionText({ section }: { section: RailSectionText }) {
  return (
    <div>
      {section.paragraphs.map((p, idx) => (
        <div
          key={idx}
          style={{
            marginBottom: idx < section.paragraphs.length - 1 ? "0.75rem" : "0",
            padding: "0.875rem 1.25rem",
            borderLeft: "3px solid var(--accent-sky)",
            background: "var(--surface-hover)",
            borderRadius: "0 8px 8px 0",
          }}
        >
          <p className="text-sm text-[var(--text-muted)] leading-relaxed">
            {p}
          </p>
        </div>
      ))}
    </div>
  );
}

/** Dispatcher: renders any section by type */
function ModalSection({ section }: { section: RailDetailSection }) {
  switch (section.type) {
    case "cards":
      return <SectionCards section={section} />;
    case "table":
      return <SectionTable section={section} />;
    case "steps":
      return <SectionSteps section={section} />;
    case "comparison":
      return <SectionComparison section={section} />;
    case "text":
      return <SectionText section={section} />;
    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// Rail Modal
// ---------------------------------------------------------------------------

function RailModal({
  rail,
  onClose,
}: {
  rail: PaymentRail;
  onClose: () => void;
}) {
  const detail = getRailDetail(rail.name);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Escape to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
        cursor: "pointer",
      }}
      onClick={onClose}
    >
      <div
        className="relative w-full bg-[var(--surface)] rounded-2xl shadow-2xl animate-scale-in"
        style={{
          maxWidth: "56rem",
          maxHeight: "90vh",
          overflowY: "auto",
          margin: "1rem",
          cursor: "default",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ---- Compact Header with gradient ---- */}
        <div
          className="sticky top-0 z-10"
          style={{
            background: `linear-gradient(135deg, ${rail.colorFrom}, ${rail.colorTo})`,
            padding: "1.25rem 2rem",
            borderRadius: "1rem 1rem 0 0",
          }}
        >
          {/* Row 1: icon + title + close */}
          <div className="flex items-start justify-between" style={{ gap: "1rem" }}>
            <div className="flex items-start" style={{ minWidth: 0, gap: "0.75rem" }}>
              <span className="text-3xl" style={{ flexShrink: 0, lineHeight: 1 }}>{rail.icon}</span>
              <div style={{ minWidth: 0 }}>
                <h2 className="text-white text-xl font-bold">{rail.name}</h2>
                <p
                  className="text-white/75 text-sm leading-relaxed"
                  style={{ marginTop: "0.125rem" }}
                >
                  {rail.description}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
              style={{ width: "2.25rem", height: "2.25rem", flexShrink: 0 }}
              aria-label="Fechar"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Row 2: characteristics as inline pills */}
          <div className="flex flex-wrap" style={{ marginTop: "0.875rem", gap: "0.5rem" }}>
            {characteristicLabels.map(({ key, label }) => (
              <span
                key={key}
                className="inline-flex items-center rounded-full bg-white/15 backdrop-blur-sm text-white text-xs font-medium"
                style={{ padding: "0.3rem 0.75rem", gap: "0.375rem" }}
              >
                <span className="text-white/60" style={{ fontSize: "0.625rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {label}:
                </span>
                {rail.characteristics[key]}
              </span>
            ))}
          </div>
        </div>

        {/* ---- Body ---- */}
        <div style={{ padding: "1.5rem 2rem" }}>
          {/* Quick reference: actors, regions, use cases */}
          <div
            className="animate-fade-in"
            style={{
              marginBottom: "2rem",
              padding: "1.25rem",
              background: "var(--surface-hover)",
              borderRadius: "12px",
              border: "1px solid var(--border)",
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: "1rem" }}>
              {/* Use Cases */}
              <div>
                <h4
                  className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]"
                  style={{ marginBottom: "0.5rem" }}
                >
                  Casos de Uso
                </h4>
                <div className="flex flex-wrap" style={{ gap: "0.375rem" }}>
                  {rail.useCases.map((uc) => (
                    <span
                      key={uc}
                      className="chip chip-primary"
                      style={{ fontSize: "0.6875rem", padding: "0.2rem 0.625rem" }}
                    >
                      {uc}
                    </span>
                  ))}
                </div>
              </div>
              {/* Key Actors */}
              <div>
                <h4
                  className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]"
                  style={{ marginBottom: "0.5rem" }}
                >
                  Atores Principais
                </h4>
                <div className="flex flex-wrap" style={{ gap: "0.375rem" }}>
                  {rail.keyActors.map((actor) => (
                    <span
                      key={actor}
                      className="chip chip-muted"
                      style={{ fontSize: "0.6875rem", padding: "0.2rem 0.625rem" }}
                    >
                      {actor}
                    </span>
                  ))}
                </div>
              </div>
              {/* Regions */}
              <div>
                <h4
                  className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]"
                  style={{ marginBottom: "0.5rem" }}
                >
                  Regioes
                </h4>
                <div className="flex flex-wrap" style={{ gap: "0.375rem" }}>
                  {rail.supportedRegions.map((region) => (
                    <span
                      key={region}
                      className="badge badge-primary"
                      style={{ fontSize: "0.6875rem" }}
                    >
                      {region}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Detail sections with left accent border */}
          {detail ? (
            <div>
              {detail.sections.map((section, idx) => (
                <div
                  key={idx}
                  className={`animate-fade-in stagger-${Math.min(idx + 1, 6)}`}
                  style={{
                    marginBottom: idx < detail.sections.length - 1 ? "2rem" : "0",
                    paddingLeft: "1.25rem",
                    borderLeft: "3px solid var(--primary-lighter)",
                  }}
                >
                  <h3
                    className="font-bold flex items-center"
                    style={{
                      marginBottom: "0.875rem",
                      fontSize: "1.125rem",
                      color: "var(--foreground)",
                      gap: "0.5rem",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "1.5rem",
                        height: "1.5rem",
                        borderRadius: "6px",
                        background: "rgba(37, 99, 235, 0.1)",
                        fontSize: "0.75rem",
                      }}
                    >
                      {sectionIcon(section.type)}
                    </span>
                    {section.title}
                  </h3>
                  <ModalSection section={section} />

                  {/* Divider between sections */}
                  {idx < detail.sections.length - 1 && (
                    <div
                      style={{
                        marginTop: "2rem",
                        height: "1px",
                        background: "var(--border)",
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[var(--text-muted)] text-sm">
              Detalhes nao disponiveis para este trilho.
            </p>
          )}
        </div>

        {/* ---- Footer ---- */}
        <div
          className="flex items-center justify-between"
          style={{
            padding: "1rem 2rem",
            borderTop: "1px solid var(--border)",
          }}
        >
          {rail.atlasLink ? (
            <Link
              href={rail.atlasLink.href}
              className="flex items-center text-sm font-medium text-[var(--primary)] hover:text-[var(--primary-light)] transition-colors group"
              style={{ gap: "0.5rem" }}
            >
              <span>{rail.atlasLink.label}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          ) : (
            <div />
          )}
          <button
            onClick={onClose}
            className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors rounded-lg"
            style={{ padding: "0.5rem 1rem" }}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Componente Principal
// ---------------------------------------------------------------------------

export default function PaymentRailsPage() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const quiz = getQuizForPage("/explore/payment-rails");
  const { recordQuiz } = useGameProgress();
  const [quizCompleted, setQuizCompleted] = useState(false);

  const closeModal = useCallback(() => setActiveModal(null), []);

  const activeRail = activeModal
    ? paymentRails.find((r) => r.name === activeModal) ?? null
    : null;

  return (
    <div className="max-w-6xl mx-auto">
      {/* ---- Cabecalho da pagina ---- */}
      <header className="page-header animate-fade-in">
        <h1 className="page-title" style={{ marginBottom: "0.75rem" }}>Trilhos de Pagamento</h1>
        <p className="page-description">
          A infraestrutura fundamental sobre a qual o dinheiro se move — dos
          trilhos tradicionais (cartoes, transferencias bancarias) aos emergentes
          (blockchain, stablecoins). Clique em qualquer trilho para explorar seus
          detalhes, taxas e fluxos.
        </p>
      </header>

      {/* Learning Objectives */}
      <div className="learning-objectives" style={{ marginBottom: "1.5rem" }}>
        <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--primary)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          O que você vai aprender
        </p>
        <ul>
          <li>Os 5 principais trilhos de pagamento</li>
          <li>Diferenças de liquidação, taxas e reversibilidade</li>
          <li>Quando usar cada trilho</li>
        </ul>
      </div>

      {/* ---- Stats ---- */}
      <div className="grid grid-cols-2 md:grid-cols-4 animate-fade-in stagger-1" style={{ gap: "1rem", marginBottom: "2rem" }}>
        {[
          { label: "Trilhos", value: 5, emoji: "\u{1F6E4}\uFE0F" },
          { label: "Tradicionais", value: 3, emoji: "\u{1F4B3}" },
          { label: "Cripto", value: 2, emoji: "\u{1F517}" },
          { label: "Regioes Cobertas", value: "20+", emoji: "\u{1F30D}" },
        ].map((stat, idx) => {
          const STAT_COLORS = [
            { from: "#6366f1", to: "#818cf8" },
            { from: "#10b981", to: "#34d399" },
            { from: "#8b5cf6", to: "#a78bfa" },
            { from: "#0ea5e9", to: "#38bdf8" },
          ];
          return (
            <div key={stat.label} className="stat-card" style={{ padding: "1.25rem" }}>
              <div className="flex items-center" style={{ gap: "0.875rem" }}>
                <div className="flex items-center justify-center shrink-0" style={{ width: "2.5rem", height: "2.5rem", borderRadius: "50%", background: `linear-gradient(135deg, ${STAT_COLORS[idx].from}, ${STAT_COLORS[idx].to})`, fontSize: "1.125rem" }}>
                  {stat.emoji}
                </div>
                <div>
                  <div className="metric-value" style={{ fontSize: "1.5rem" }}>{stat.value}</div>
                  <div className="text-xs text-[var(--text-muted)]">{stat.label}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ---- Disclaimer ---- */}
      <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 16, fontStyle: "italic" }}>
        * Esses numeros (taxas, tempos de liquidacao) podem ter sofrido alteracao com o tempo. Verifique novamente se permanecem atuais.
      </p>

      {/* ---- Simplified clickable cards ---- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 animate-fade-in stagger-1" style={{ gap: "1.25rem" }}>
        {paymentRails.map((rail, idx) => (
          <div
            key={rail.name}
            className={`card-interactive overflow-hidden animate-fade-in stagger-${Math.min(idx + 1, 6)}`}
            onClick={() => setActiveModal(rail.name)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setActiveModal(rail.name);
              }
            }}
          >
            {/* Compact gradient header */}
            <div
              style={{
                background: `linear-gradient(135deg, ${rail.colorFrom}, ${rail.colorTo})`,
                padding: "1rem 1.25rem",
              }}
            >
              <div className="flex items-center" style={{ gap: "0.75rem" }}>
                <span className="text-2xl">{rail.icon}</span>
                <h2 className="text-white text-lg font-semibold">{rail.name}</h2>
              </div>
            </div>

            {/* Card body */}
            <div style={{ padding: "1.25rem" }}>
              {/* Tagline — first sentence only */}
              <p
                className="text-sm text-[var(--text-muted)] leading-relaxed"
                style={{ marginBottom: "1rem" }}
              >
                {rail.description.split(". ")[0]}.
              </p>

              {/* Two key metrics */}
              <div className="grid grid-cols-2" style={{ gap: "0.75rem", marginBottom: "1rem" }}>
                <div
                  className="rounded-lg"
                  style={{
                    padding: "0.625rem 0.875rem",
                    background: "var(--surface-hover)",
                  }}
                >
                  <div
                    className="font-bold uppercase tracking-wider text-[var(--text-muted)]"
                    style={{ fontSize: "0.5625rem", marginBottom: "0.25rem" }}
                  >
                    Liquidacao
                  </div>
                  <div className="text-sm font-semibold" style={{ lineHeight: "1.3" }}>
                    {rail.characteristics.settlementTime}
                  </div>
                </div>
                <div
                  className="rounded-lg"
                  style={{
                    padding: "0.625rem 0.875rem",
                    background: "var(--surface-hover)",
                  }}
                >
                  <div
                    className="font-bold uppercase tracking-wider text-[var(--text-muted)]"
                    style={{ fontSize: "0.5625rem", marginBottom: "0.25rem" }}
                  >
                    Taxas
                  </div>
                  <div className="text-sm font-semibold" style={{ lineHeight: "1.3" }}>
                    {rail.characteristics.typicalFees}
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="flex items-center text-xs font-medium text-[var(--primary)]" style={{ gap: "0.375rem" }}>
                <span>Clique para explorar</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ---- Ponte Tradicional <-> Crypto ---- */}
      <div className="card-glow animate-fade-in stagger-2" style={{ marginTop: "2rem" }}>
        <h3 className="font-semibold flex items-center" style={{ marginBottom: "0.75rem", gap: "0.5rem" }}>
          <span>{"\u{1F309}"}</span>
          Ponte: Trilhos Tradicionais ↔ Cripto
        </h3>
        <p className="text-sm text-[var(--text-muted)]" style={{ marginBottom: "1rem" }}>
          Os mundos tradicional e cripto estao cada vez mais conectados. Veja
          como os trilhos se interligam:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: "1rem" }}>
          <div className="rounded-xl" style={{ padding: "1rem", background: "var(--surface-hover)" }}>
            <div style={{ fontSize: "1.125rem", marginBottom: "0.5rem" }}>{"\u{1F53C}"}</div>
            <h4 className="text-sm font-semibold" style={{ marginBottom: "0.25rem" }}>On-Ramps</h4>
            <p className="text-xs text-[var(--text-muted)]">
              Fiat → Cripto: usuarios convertem moeda fiduciaria em stablecoins
              ou cripto via exchanges, bancos ou apps como MoonPay e Ramp.
            </p>
          </div>
          <div className="rounded-xl" style={{ padding: "1rem", background: "var(--surface-hover)" }}>
            <div style={{ fontSize: "1.125rem", marginBottom: "0.5rem" }}>{"\u{1F53D}"}</div>
            <h4 className="text-sm font-semibold" style={{ marginBottom: "0.25rem" }}>Off-Ramps</h4>
            <p className="text-xs text-[var(--text-muted)]">
              Cripto → Fiat: conversao de stablecoins de volta para moeda local
              via exchanges, Visa/Mastercard cripto cards ou liquidacao bancaria.
            </p>
          </div>
          <div className="rounded-xl" style={{ padding: "1rem", background: "var(--surface-hover)" }}>
            <div style={{ fontSize: "1.125rem", marginBottom: "0.5rem" }}>{"\u{1F504}"}</div>
            <h4 className="text-sm font-semibold" style={{ marginBottom: "0.25rem" }}>Hybrid Rails</h4>
            <p className="text-xs text-[var(--text-muted)]">
              Stripe, PayPal e Visa ja liquidam em stablecoins por baixo dos
              panos, combinando UX tradicional com eficiencia cripto.
            </p>
          </div>
        </div>
        <Link
          href="/explore/financial-system"
          className="inline-flex items-center text-sm font-medium text-[var(--primary)] hover:text-[var(--primary-light)] transition-colors group"
          style={{ marginTop: "1rem", gap: "0.5rem" }}
        >
          <span>Ver Sistema Financeiro Global</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>
      </div>

      {/* ---- Nota comparativa ---- */}
      <div className="card-glow animate-fade-in stagger-3" style={{ marginTop: "1.5rem" }}>
        <h3 className="font-semibold" style={{ marginBottom: "0.75rem" }}>Escolhendo o trilho certo</h3>
        <p className="text-sm text-[var(--text-muted)]">
          O melhor trilho depende do tipo de transacao, geografia, tolerancia a
          custos e requisitos de velocidade de liquidacao. Muitas plataformas de
          pagamento modernas operam em multiplos trilhos simultaneamente,
          utilizando camadas de orquestracao para selecionar o caminho otimo para
          cada transacao — incluindo a opcao de liquidar em stablecoins quando
          vantajoso.
        </p>
      </div>

      {/* ---- Related Pages ---- */}
      <div className="divider-text animate-fade-in" style={{ marginTop: "2.5rem" }}>Paginas Relacionadas</div>
      <div className="grid grid-cols-1 sm:grid-cols-3 animate-fade-in" style={{ gap: "0.75rem", marginTop: "1rem" }}>
        {[
          { name: "Mapa de Pagamentos", desc: "Visualize a stack completa", href: "/explore/payments-map", icon: "\u{1F5FA}\uFE0F" },
          { name: "Fluxos de Transacao", desc: "Veja transacoes passo a passo", href: "/explore/transaction-flows", icon: "\u{1F504}" },
          { name: "Sistema Financeiro", desc: "Infraestrutura financeira global", href: "/explore/financial-system", icon: "\u{1F30D}" },
        ].map((link) => (
          <Link key={link.href} href={link.href} className="card-flat interactive-hover" style={{ padding: "1rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontSize: "1.5rem" }}>{link.icon}</span>
            <div>
              <div className="font-semibold text-sm">{link.name}</div>
              <div className="text-xs text-[var(--text-muted)]">{link.desc}</div>
            </div>
          </Link>
        ))}
      </div>

      {quiz && !quizCompleted && (
        <div style={{ marginTop: "2.5rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem", color: "var(--foreground)" }}>
            🧠 Teste seu Conhecimento
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

      {/* ---- Modal ---- */}
      {activeRail && <RailModal rail={activeRail} onClose={closeModal} />}
    </div>
  );
}
