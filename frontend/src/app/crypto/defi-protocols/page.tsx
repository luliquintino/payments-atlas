"use client";

import { useState, useMemo } from "react";
import { getQuizForPage } from "@/data/quizzes";
import PageQuiz from "@/components/ui/PageQuiz";
import { useGameProgress } from "@/hooks/useGameProgress";
import {
  defiProtocols,
  DEFI_CATEGORY_COLORS,
  DeFiCategory,
} from "@/data/crypto-data";

/**
 * Protocolos DeFi — Pagina hibrida com (1) Mapa de Camadas DeFi
 * e (2) Base de dados de protocolos com busca e filtro por categoria.
 *
 * Secao 1: Mapa visual interativo das 5 camadas do ecossistema DeFi,
 * expandivel ao clicar (mesmo pattern do payments-map, sem animacao de fluxo).
 *
 * Secao 2: Catalogo de protocolos importados de crypto-data, com search,
 * filtro por categoria, cards detalhados com TVL, features, riscos e governanca.
 */

// ---------------------------------------------------------------------------
// Tipos e dados inline — Mapa de Camadas DeFi
// ---------------------------------------------------------------------------

interface DeFiLayerComponent {
  name: string;
  description: string;
}

interface DeFiLayer {
  id: string;
  name: string;
  description: string;
  colorClass: string;
  components: DeFiLayerComponent[];
  examples: string[];
}

const defiLayers: DeFiLayer[] = [
  {
    id: "wallet",
    name: "Carteira (Wallet)",
    description:
      "Ponto de entrada do usuario no ecossistema DeFi. Carteiras non-custodial permitem interagir diretamente com smart contracts, assinar transacoes e gerenciar chaves privadas sem intermediarios.",
    colorClass: "bg-[var(--primary-dark)]",
    components: [
      {
        name: "Chaves Privadas & Seed Phrase",
        description:
          "Par criptografico que garante a posse dos ativos. A seed phrase (12-24 palavras) permite recuperar a carteira.",
      },
      {
        name: "Assinatura de Transacoes",
        description:
          "Cada interacao com um protocolo DeFi requer assinatura criptografica do usuario, garantindo autorizacao explicita.",
      },
      {
        name: "Conexao com dApps (WalletConnect)",
        description:
          "Protocolo que conecta carteiras a aplicacoes descentralizadas via QR code ou deep link, sem expor chaves.",
      },
      {
        name: "Gestao de Tokens & NFTs",
        description:
          "Visualizacao de saldos ERC-20, ERC-721 e outros padroes de tokens em multiplas blockchains.",
      },
    ],
    examples: ["MetaMask", "Phantom", "Rainbow", "Rabby", "Trust Wallet"],
  },
  {
    id: "protocol",
    name: "Protocolo",
    description:
      "Camada de aplicacao onde os protocolos DeFi implementam logica financeira — exchanges descentralizadas, emprestimos, derivativos e estrategias de yield. Cada protocolo define regras de interacao e incentivos economicos.",
    colorClass: "bg-[var(--primary)]",
    components: [
      {
        name: "AMM (Automated Market Maker)",
        description:
          "Mecanismo que substitui order books por formulas matematicas (x*y=k) para prover liquidez e precificar ativos.",
      },
      {
        name: "Lending & Borrowing",
        description:
          "Protocolos que permitem emprestar ativos para ganhar juros ou tomar emprestado usando colateral crypto.",
      },
      {
        name: "Yield Aggregators",
        description:
          "Estrategias automatizadas que otimizam retornos movendo capital entre diferentes protocolos e pools.",
      },
      {
        name: "Derivativos On-Chain",
        description:
          "Contratos perpetuos, opcoes e futuros executados inteiramente via smart contracts sem intermediario central.",
      },
    ],
    examples: ["Uniswap", "Aave", "Compound", "GMX", "Pendle"],
  },
  {
    id: "smart-contracts",
    name: "Smart Contracts",
    description:
      "Codigo auto-executavel implantado na blockchain que define as regras do protocolo. Sao imutaveis apos deploy (a menos que usem proxies upgradaveis) e auditaveis publicamente.",
    colorClass: "bg-[var(--primary-light)]",
    components: [
      {
        name: "Contratos de Logica (Implementation)",
        description:
          "Contem a logica principal do protocolo — swaps, liquidacoes, calculo de juros, etc.",
      },
      {
        name: "Proxy Patterns (Upgradeability)",
        description:
          "Padroes como Transparent Proxy e UUPS que permitem atualizar a logica sem alterar o endereco do contrato.",
      },
      {
        name: "Oracles (Chainlink, Pyth)",
        description:
          "Servicos que alimentam precos e dados externos para os smart contracts, essenciais para liquidacoes e pricing.",
      },
      {
        name: "Auditorias & Verificacao Formal",
        description:
          "Processos de seguranca que revisam o codigo para identificar vulnerabilidades antes e apos o deploy.",
      },
    ],
    examples: [
      "Solidity (EVM)",
      "Rust (Solana)",
      "Vyper",
      "Cairo (StarkNet)",
    ],
  },
  {
    id: "liquidity-pools",
    name: "Pools de Liquidez",
    description:
      "Reservas de tokens depositadas por provedores de liquidez (LPs) que permitem trades sem order book. LPs recebem fees proporcionais a sua participacao, mas estao sujeitos a impermanent loss.",
    colorClass: "bg-[var(--primary)]",
    components: [
      {
        name: "Constant Product Pools (x*y=k)",
        description:
          "Modelo classico do Uniswap v2 onde o produto das reservas permanece constante apos cada trade.",
      },
      {
        name: "Concentrated Liquidity",
        description:
          "Modelo do Uniswap v3 onde LPs alocam capital em faixas de preco especificas para maior eficiencia.",
      },
      {
        name: "StableSwap Pools",
        description:
          "Curvas otimizadas para ativos pareados (stablecoins) com slippage minimo, popularizadas pela Curve.",
      },
      {
        name: "LP Tokens & Receipts",
        description:
          "Tokens emitidos ao depositar em um pool que representam a posicao e podem ser usados como colateral em outros protocolos.",
      },
    ],
    examples: [
      "Uniswap v3 Pools",
      "Curve 3pool",
      "Balancer Weighted Pools",
      "Raydium CLMM",
    ],
  },
  {
    id: "blockchain",
    name: "Blockchain",
    description:
      "Camada de liquidacao final que garante imutabilidade, censura-resistencia e disponibilidade dos dados. Todas as transacoes DeFi sao registradas permanentemente na blockchain subjacente.",
    colorClass: "bg-[var(--primary-dark)]",
    components: [
      {
        name: "Consenso & Validacao",
        description:
          "Mecanismo (PoW, PoS) que garante que todos os nos concordam sobre o estado atual da rede.",
      },
      {
        name: "Gas & Fee Market",
        description:
          "Sistema de precificacao de recursos computacionais que determina o custo de cada transacao na rede.",
      },
      {
        name: "Finality & Confirmacoes",
        description:
          "Tempo necessario para que uma transacao seja considerada irreversivel, variando de segundos a minutos.",
      },
      {
        name: "Bridges & Interoperabilidade",
        description:
          "Protocolos que permitem transferir ativos e dados entre blockchains diferentes (cross-chain).",
      },
    ],
    examples: [
      "Ethereum",
      "Solana",
      "Arbitrum",
      "Polygon",
      "Base",
      "Avalanche",
    ],
  },
];

// ---------------------------------------------------------------------------
// Constantes — Secao de Protocolos
// ---------------------------------------------------------------------------

const ALL_CATEGORIES: ("Todos" | DeFiCategory)[] = [
  "Todos",
  "DEX",
  "Lending",
  "Stablecoins",
  "Derivatives",
  "Yield",
  "Liquid Staking",
];

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

export default function DeFiProtocolsPage() {
  const quiz = getQuizForPage("/crypto/defi-protocols");
  const { recordQuiz } = useGameProgress();
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Estado — Mapa de Camadas
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);

  // Estado — Base de Protocolos
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<
    "Todos" | DeFiCategory
  >("Todos");

  // ---------- Filtragem de protocolos ----------
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return defiProtocols.filter((protocol) => {
      const matchesCategory =
        activeCategory === "Todos" || protocol.category === activeCategory;
      const matchesSearch =
        q === "" ||
        protocol.name.toLowerCase().includes(q) ||
        protocol.description.toLowerCase().includes(q) ||
        protocol.governance.toLowerCase().includes(q) ||
        protocol.blockchain.some((b) => b.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  // ---------- Contagens por categoria ----------
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { Todos: defiProtocols.length };
    for (const cat of ALL_CATEGORIES.slice(1)) {
      counts[cat] = defiProtocols.filter((p) => p.category === cat).length;
    }
    return counts;
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      {/* ================================================================ */}
      {/* CABECALHO                                                        */}
      {/* ================================================================ */}
      <header className="page-header animate-fade-in">
        <h1 className="page-title" style={{ marginBottom: "0.75rem" }}>Protocolos DeFi</h1>
        <p className="page-description">
          Mapa visual das camadas do ecossistema DeFi e catalogo dos principais
          protocolos de financas descentralizadas. Explore a arquitetura por
          camada ou busque protocolos por categoria.
        </p>
      </header>

      <div className="learning-objectives" style={{ marginBottom: "1.5rem" }}>
        <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--primary)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          O que você vai aprender
        </p>
        <ul>
          <li>O que são AMMs (Automated Market Makers)</li>
          <li>Como funcionam protocolos de lending</li>
          <li>Riscos de smart contracts em DeFi</li>
        </ul>
      </div>

      {/* ================================================================ */}
      {/* STATS                                                            */}
      {/* ================================================================ */}
      <div className="animate-fade-in stagger-1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>~25</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Protocolos</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>6</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Categorias</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>$50B+</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>TVL</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>8</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Redes</div>
        </div>
      </div>

      <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontStyle: "italic", marginBottom: "2rem", opacity: 0.7 }}>
        * Numeros podem variar conforme fonte e data de consulta. Valores aproximados para fins didaticos.
      </p>

      {/* ================================================================ */}
      {/* SECAO 1 — MAPA DE CAMADAS DeFi                                   */}
      {/* ================================================================ */}
      <div className="animate-fade-in stagger-1" style={{ marginBottom: "1.5rem" }}>
        <div className="flex items-center" style={{ gap: "0.75rem", marginBottom: "0.75rem" }}>
          {selectedLayer && (
            <button
              onClick={() => setSelectedLayer(null)}
              className="rounded-lg border border-[var(--border)] text-sm transition-colors"
              style={{ padding: "0.5rem 0.75rem", color: "var(--text-muted)" }}
            >
              Limpar selecao
            </button>
          )}
          <span style={{ marginLeft: "auto", fontSize: "0.75rem", color: "var(--text-muted)" }}>
            Clique em uma camada para expandir
          </span>
        </div>
      </div>

      <div className="flex flex-col animate-fade-in stagger-1" style={{ gap: "1rem" }}>
        {defiLayers.map((layer, index) => {
          const isSelected = selectedLayer === layer.id;
          const isDimmed = selectedLayer !== null && !isSelected;

          let cardClasses =
            "card overflow-hidden transition-all duration-500 ease-out";
          if (isDimmed) {
            cardClasses += " opacity-40 scale-[0.98]";
          }

          return (
            <div key={layer.id}>
              {/* Conector visual entre camadas */}
              {index > 0 && (
                <div className="flex justify-center relative z-10" style={{ padding: "0.25rem 0" }}>
                  <div className="flex flex-col items-center opacity-40">
                    <div className="w-0.5 h-3 rounded-full bg-[var(--border)]" />
                    <svg
                      width="16"
                      height="10"
                      viewBox="0 0 16 10"
                      fill="none"
                      className="text-[var(--border)]"
                    >
                      <path
                        d="M1 1L8 8L15 1"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              )}

              <div
                id={`layer-${layer.id}`}
                className={cardClasses}
              >
                {/* Cabecalho clicavel */}
                <button
                  onClick={() =>
                    setSelectedLayer(isSelected ? null : layer.id)
                  }
                  className={`w-full ${layer.colorClass} flex items-center text-left transition-all hover:brightness-110 cursor-pointer`}
                  style={{ padding: "1.25rem 1.5rem", gap: "0.75rem" }}
                >
                  <span className="text-white/70 text-sm font-mono">
                    C{index + 1}
                  </span>
                  <h2 className="text-white text-lg font-semibold flex-1">
                    {layer.name}
                  </h2>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    className={`text-white/70 transition-transform duration-200 ${
                      isSelected ? "rotate-180" : ""
                    }`}
                  >
                    <path
                      d="M5 7.5L10 12.5L15 7.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {/* Corpo da camada */}
                <div className="bg-[var(--surface)]" style={{ padding: "1.5rem" }}>
                  <p className="text-sm" style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>
                    {layer.description}
                  </p>

                  {/* Componentes */}
                  <div style={{ marginBottom: "1rem" }}>
                    <h3 className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                      Componentes Principais
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: "0.625rem" }}>
                      {layer.components.map((comp) => (
                        <div
                          key={comp.name}
                          className="group flex items-start text-sm rounded-lg bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--border-hover)] hover:bg-[var(--surface-hover)] transition-all"
                          style={{ gap: "0.625rem", padding: "0.75rem 1rem" }}
                        >
                          <span className="w-2 h-2 rounded-full bg-[var(--primary-lighter)] shrink-0" style={{ marginTop: "0.375rem" }} />
                          <div>
                            <span className="font-medium" style={{ color: "var(--foreground)" }}>
                              {comp.name}
                            </span>
                            {isSelected && (
                              <p className="text-xs" style={{ color: "var(--text-muted)", marginTop: "0.125rem" }}>
                                {comp.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Exemplos — mostrados quando expandido */}
                  {isSelected && (
                    <div className="animate-fade-in">
                      <h3 className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                        Exemplos
                      </h3>
                      <div className="flex flex-wrap" style={{ gap: "0.5rem" }}>
                        {layer.examples.map((ex) => (
                          <span
                            key={ex}
                            className="text-xs rounded-full border border-[var(--border)]"
                            style={{ padding: "0.25rem 0.625rem", color: "var(--text-muted)" }}
                          >
                            {ex}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Exemplos compactos quando colapsado */}
                  {!isSelected && (
                    <div>
                      <h3 className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                        Exemplos
                      </h3>
                      <div className="flex flex-wrap" style={{ gap: "0.5rem" }}>
                        {layer.examples.map((ex) => (
                          <span
                            key={ex}
                            className="text-xs rounded-full border border-[var(--border)]"
                            style={{ padding: "0.25rem 0.625rem", color: "var(--text-muted)" }}
                          >
                            {ex}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legenda do mapa */}
      <div className="card-flat animate-fade-in stagger-2" style={{ marginTop: "2rem" }}>
        <h3 className="font-semibold" style={{ marginBottom: "0.75rem" }}>Como ler este mapa</h3>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Cada camada representa um nivel da stack DeFi. O usuario interage pela
          carteira no topo, que se conecta aos protocolos de aplicacao. Esses
          protocolos sao implementados como smart contracts que gerenciam pools
          de liquidez, todos executados e registrados na blockchain base. Clique
          em uma camada para ver descricoes detalhadas dos componentes.
        </p>
      </div>

      {/* ================================================================ */}
      {/* DIVISOR                                                          */}
      {/* ================================================================ */}
      <div className="divider-text animate-fade-in stagger-3" style={{ marginTop: "2.5rem", marginBottom: "2.5rem" }}>
        Principais Protocolos DeFi
      </div>

      {/* ================================================================ */}
      {/* SECAO 2 — BASE DE DADOS DE PROTOCOLOS                            */}
      {/* ================================================================ */}

      {/* Busca e filtros */}
      <div className="card-glow animate-fade-in stagger-3" style={{ marginBottom: "1.5rem" }}>
        {/* Campo de busca */}
        <div className="relative" style={{ marginBottom: "1rem" }}>
          <span className="absolute top-1/2 -translate-y-1/2" style={{ left: "0.75rem", color: "var(--text-muted)" }}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Pesquisar por nome, descricao, governanca ou blockchain..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl shadow-sm border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-1 placeholder:text-[var(--text-muted)]"
            style={{ paddingLeft: "2.5rem", paddingRight: "1rem", paddingTop: "0.625rem", paddingBottom: "0.625rem" }}
          />
        </div>

        {/* Filtros de categoria */}
        <div className="flex flex-wrap" style={{ gap: "0.5rem" }}>
          {ALL_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            const color =
              cat !== "Todos" ? DEFI_CATEGORY_COLORS[cat] : undefined;

            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "shadow-sm" : ""
                }`}
                style={{
                  padding: "0.625rem 1.25rem",
                  ...(isActive
                    ? {
                        background: color ?? "var(--primary)",
                        color: "white",
                      }
                    : {
                        background: "var(--surface-hover)",
                        color: "var(--text-muted)",
                      }),
                }}
              >
                {cat}
                <span className="opacity-70 font-semibold" style={{ marginLeft: "0.375rem" }}>
                  ({categoryCounts[cat]})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid de protocolos */}
      {filtered.length === 0 ? (
        <div className="card text-center animate-fade-in stagger-4" style={{ padding: "3rem" }}>
          <div className="text-4xl opacity-30" style={{ marginBottom: "1rem" }}>?</div>
          <h3 className="text-lg font-semibold" style={{ marginBottom: "0.5rem" }}>
            Nenhum protocolo encontrado
          </h3>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Tente ajustar sua pesquisa ou alterar o filtro de categoria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "1.25rem" }}>
          {filtered.map((protocol, idx) => {
            const catColor = DEFI_CATEGORY_COLORS[protocol.category];

            return (
              <div
                key={protocol.id}
                className={`card-glow hover:shadow-lg hover:-translate-y-0.5 transition-all animate-fade-in stagger-${Math.min(
                  idx + 1,
                  6
                )}`}
                style={{ borderLeft: `3px solid ${catColor}` }}
              >
                {/* Cabecalho: nome + badge de categoria */}
                <div className="flex items-start" style={{ gap: "0.75rem", marginBottom: "0.75rem" }}>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold" style={{ marginBottom: "0.25rem" }}>
                      {protocol.name}
                    </h3>
                    <span
                      className="inline-block text-xs rounded-full font-medium"
                      style={{
                        padding: "0.125rem 0.625rem",
                        background: `${catColor}18`,
                        color: catColor,
                      }}
                    >
                      {protocol.category}
                    </span>
                  </div>
                  {/* TVL badge */}
                  <div className="text-right shrink-0">
                    <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                      TVL
                    </span>
                    <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                      {protocol.tvl}
                    </p>
                  </div>
                </div>

                {/* Blockchains como chips */}
                <div className="flex flex-wrap" style={{ gap: "0.375rem", marginBottom: "0.75rem" }}>
                  {protocol.blockchain.map((chain) => (
                    <span
                      key={chain}
                      className="text-[11px] rounded-md bg-[var(--surface-hover)] border border-[var(--border)]"
                      style={{ padding: "0.125rem 0.5rem", color: "var(--text-muted)" }}
                    >
                      {chain}
                    </span>
                  ))}
                </div>

                {/* Descricao */}
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>
                  {protocol.description}
                </p>

                {/* Key Features */}
                <div style={{ marginBottom: "0.75rem" }}>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)", marginBottom: "0.375rem" }}>
                    Funcionalidades
                  </h4>
                  <ul className="flex flex-col" style={{ gap: "0.25rem" }}>
                    {protocol.keyFeatures.map((feat) => (
                      <li
                        key={feat}
                        className="flex items-start text-sm"
                        style={{ gap: "0.5rem", color: "var(--foreground)" }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary-lighter)] shrink-0" style={{ marginTop: "0.375rem" }} />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Riscos */}
                <div style={{ marginBottom: "0.75rem" }}>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)", marginBottom: "0.375rem" }}>
                    Riscos
                  </h4>
                  <ul className="flex flex-col" style={{ gap: "0.25rem" }}>
                    {protocol.risks.map((risk) => (
                      <li
                        key={risk}
                        className="flex items-start text-sm"
                        style={{ gap: "0.5rem", color: "#ef4444" }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ marginTop: "0.375rem", background: "#f87171" }} />
                        {risk}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Governanca */}
                <div className="border-t border-[var(--border)]" style={{ paddingTop: "0.75rem" }}>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)", marginBottom: "0.25rem" }}>
                    Governanca
                  </h4>
                  <p className="text-sm" style={{ color: "var(--foreground)" }}>
                    {protocol.governance}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Nota explicativa */}
      <div className="card-flat animate-fade-in stagger-6" style={{ marginTop: "2rem" }}>
        <h3 className="font-semibold" style={{ marginBottom: "0.75rem" }}>Como interpretar os dados</h3>
        <div className="flex flex-col text-sm" style={{ gap: "0.75rem", color: "var(--text-muted)" }}>
          <p>
            <strong style={{ color: "var(--foreground)" }}>
              TVL (Total Value Locked):
            </strong>{" "}
            Valor total de ativos depositados no protocolo. Indica a confianca
            do mercado e a liquidez disponivel, mas nao garante seguranca.
          </p>
          <p>
            <strong style={{ color: "var(--foreground)" }}>Riscos:</strong> Todo
            protocolo DeFi carrega riscos inerentes — smart contract bugs,
            manipulacao de oracles, ataques de governanca e volatilidade de
            mercado. A diversificacao entre protocolos e categorias e a
            principal estrategia de mitigacao.
          </p>
          <p>
            <strong style={{ color: "var(--foreground)" }}>Governanca:</strong>{" "}
            Tokens de governanca permitem que holders votem em mudancas no
            protocolo. Modelos vote-escrowed (ve) incentivam o bloqueio de
            longo prazo para maior poder de voto.
          </p>
        </div>
      </div>

      {/* ================================================================ */}
      {/* FOOTER — PAGINAS RELACIONADAS                                    */}
      {/* ================================================================ */}
      <div className="divider-text animate-fade-in stagger-6" style={{ marginTop: "3rem" }}>
        <span>Paginas Relacionadas</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem", marginTop: "1.5rem" }}>
        {[
          { name: "Mapa Blockchain", href: "/crypto/blockchain-map", icon: "\u{1F517}" },
          { name: "Stablecoin Systems", href: "/crypto/stablecoin-systems", icon: "\u{1F4B2}" },
          { name: "Grafo de Dependencias", href: "/fundamentos/dependency-graph", icon: "\u{1F578}\u{FE0F}" },
        ].map((p) => (
          <a key={p.href} href={p.href} className="card-flat interactive-hover" style={{ padding: "1.25rem", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontSize: "1.5rem" }}>{p.icon}</span>
            <span style={{ color: "var(--foreground)", fontWeight: 500 }}>{p.name}</span>
            <span style={{ marginLeft: "auto", color: "var(--text-muted)" }}>{"\u2192"}</span>
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
