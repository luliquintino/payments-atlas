"use client";

import { useState, useMemo } from "react";
import {
  blockchains,
  BLOCKCHAIN_CATEGORY_COLORS,
  BlockchainCategory,
} from "@/data/crypto-data";

/**
 * Mapa de Blockchain — Pagina hibrida com mapa de camadas da arquitetura
 * blockchain (Secao 1) e catalogo pesquisavel de blockchains (Secao 2).
 */

// ---------------------------------------------------------------------------
// Tipos e dados inline — Camadas da arquitetura blockchain
// ---------------------------------------------------------------------------

interface LayerComponent {
  name: string;
  description: string;
}

interface BlockchainLayer {
  id: string;
  name: string;
  description: string;
  colorClass: string;
  components: LayerComponent[];
  examples: string[];
}

const blockchainLayers: BlockchainLayer[] = [
  {
    id: "user",
    name: "Usuario",
    description:
      "A camada de interacao humana — onde usuarios iniciam transacoes, verificam saldos e gerenciam seus ativos digitais atraves de interfaces visuais.",
    colorClass: "bg-[#2563eb]",
    components: [
      {
        name: "Interface de dApp",
        description:
          "Frontends web e mobile que permitem interacao com protocolos descentralizados.",
      },
      {
        name: "Portfolio Tracker",
        description:
          "Dashboards para monitorar saldos, historico de transacoes e performance de ativos.",
      },
      {
        name: "Bridge UI",
        description:
          "Interfaces para transferir ativos entre diferentes blockchains (cross-chain).",
      },
    ],
    examples: ["MetaMask Browser", "DeFi Llama", "Zapper", "Etherscan"],
  },
  {
    id: "wallet",
    name: "Wallet",
    description:
      "Gerenciamento de chaves privadas e assinatura de transacoes. A wallet e o ponto de autenticacao e autorizacao do usuario na rede blockchain.",
    colorClass: "bg-[#3b82f6]",
    components: [
      {
        name: "Key Management",
        description:
          "Geracao, armazenamento e protecao de chaves privadas (seed phrases, hardware wallets).",
      },
      {
        name: "Transaction Signing",
        description:
          "Assinatura criptografica de transacoes antes do envio a rede.",
      },
      {
        name: "Account Abstraction",
        description:
          "Wallets baseadas em smart contracts com recuperacao social, gas sponsoring e batching.",
      },
      {
        name: "Multi-sig",
        description:
          "Wallets que requerem multiplas assinaturas para autorizar transacoes (governanca corporativa).",
      },
    ],
    examples: ["MetaMask", "Phantom", "Ledger", "Safe (Gnosis Safe)"],
  },
  {
    id: "smart-contract",
    name: "Smart Contract",
    description:
      "Programas autoexecutaveis implantados na blockchain que codificam logica de negocios — DeFi, NFTs, DAOs e tokenizacao operam nesta camada.",
    colorClass: "bg-[#6366f1]",
    components: [
      {
        name: "Token Standards",
        description:
          "Padroes como ERC-20 (fungivel), ERC-721 (NFT) e ERC-1155 (multi-token).",
      },
      {
        name: "DeFi Protocols",
        description:
          "Protocolos de lending, DEX, derivativos e yield implementados como contratos on-chain.",
      },
      {
        name: "Oracles",
        description:
          "Servicos que trazem dados off-chain (precos, clima, eventos) para dentro dos smart contracts.",
      },
      {
        name: "Upgradeability Patterns",
        description:
          "Proxy patterns e mecanismos de governanca para atualizar logica de contratos imutaveis.",
      },
    ],
    examples: ["Solidity/Vyper (EVM)", "Rust (Solana)", "Chainlink Oracles", "OpenZeppelin"],
  },
  {
    id: "blockchain-network",
    name: "Rede Blockchain",
    description:
      "A camada de rede peer-to-peer que propaga transacoes e blocos entre nos. Inclui o mempool, propagacao de blocos e comunicacao entre validadores.",
    colorClass: "bg-[#8b5cf6]",
    components: [
      {
        name: "Mempool",
        description:
          "Pool de transacoes pendentes aguardando inclusao em um bloco pelos validadores.",
      },
      {
        name: "Block Propagation",
        description:
          "Disseminacao de blocos recem-criados pela rede de nos (gossip protocol).",
      },
      {
        name: "State Management",
        description:
          "Armazenamento e sincronizacao do estado global (saldos, storage de contratos, nonces).",
      },
      {
        name: "MEV (Maximal Extractable Value)",
        description:
          "Oportunidades de extracao de valor via ordenacao de transacoes (arbitragem, liquidacoes).",
      },
    ],
    examples: ["Ethereum Mainnet", "Solana Cluster", "Polygon PoS", "Arbitrum One"],
  },
  {
    id: "consensus",
    name: "Camada de Consenso",
    description:
      "O mecanismo que garante que todos os nos concordam sobre o estado da blockchain — define como blocos sao propostos, validados e finalizados.",
    colorClass: "bg-[#7c3aed]",
    components: [
      {
        name: "Proof of Work",
        description:
          "Mineradores competem resolvendo puzzles criptograficos para propor blocos (Bitcoin).",
      },
      {
        name: "Proof of Stake",
        description:
          "Validadores fazem stake de tokens como garantia para propor e validar blocos (Ethereum).",
      },
      {
        name: "BFT Variants",
        description:
          "Algoritmos tolerantes a falhas bizantinas como Tendermint, HotStuff e Tower BFT (Solana).",
      },
      {
        name: "Finality Mechanism",
        description:
          "Processo pelo qual transacoes se tornam irreversiveis (probabilistica vs. deterministica).",
      },
    ],
    examples: ["Gasper (Ethereum)", "Nakamoto Consensus (Bitcoin)", "Tower BFT (Solana)", "Tendermint"],
  },
  {
    id: "node-infrastructure",
    name: "Infraestrutura de Nos",
    description:
      "A camada fisica e logica que sustenta a rede — hardware de validadores, RPC providers, indexadores e servicos de infraestrutura blockchain.",
    colorClass: "bg-[#581c87]",
    components: [
      {
        name: "Validator Nodes",
        description:
          "Nos que participam do consenso, propondo e validando blocos na rede.",
      },
      {
        name: "RPC Providers",
        description:
          "Servicos que expõem APIs para leitura e escrita na blockchain (Alchemy, Infura, QuickNode).",
      },
      {
        name: "Indexers",
        description:
          "Servicos que organizam dados on-chain para consultas eficientes (The Graph, Goldsky).",
      },
      {
        name: "Data Availability",
        description:
          "Camada que garante que dados de transacoes estejam acessiveis para verificacao (EIP-4844, Celestia).",
      },
    ],
    examples: ["Alchemy", "Infura", "The Graph", "Celestia"],
  },
];

// ---------------------------------------------------------------------------
// Constantes para o catalogo
// ---------------------------------------------------------------------------

const ALL_CATEGORIES: ("Todos" | BlockchainCategory)[] = [
  "Todos",
  "Layer 1",
  "Layer 2",
  "Sidechain",
];

const CATEGORY_ICONS: Record<BlockchainCategory, string> = {
  "Layer 1": "L1",
  "Layer 2": "L2",
  Sidechain: "SC",
};

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

export default function BlockchainMapPage() {
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<"Todos" | BlockchainCategory>("Todos");

  /* ---- Filtragem do catalogo ---- */
  const filtered = useMemo(() => {
    return blockchains.filter((chain) => {
      const matchesCategory =
        activeCategory === "Todos" || chain.category === activeCategory;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        q === "" ||
        chain.name.toLowerCase().includes(q) ||
        chain.description.toLowerCase().includes(q) ||
        chain.consensus.toLowerCase().includes(q) ||
        chain.nativeToken.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  /* ---- Contagens por categoria ---- */
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { Todos: blockchains.length };
    for (const cat of ALL_CATEGORIES.slice(1)) {
      counts[cat] = blockchains.filter((c) => c.category === cat).length;
    }
    return counts;
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      {/* ================================================================== */}
      {/* CABECALHO                                                          */}
      {/* ================================================================== */}
      <header className="page-header animate-fade-in">
        <h1 className="page-title" style={{ marginBottom: "0.75rem" }}>Mapa de Blockchain</h1>
        <p className="page-description">
          Arquitetura em camadas de uma rede blockchain e catalogo completo das
          principais redes. Clique em uma camada para explorar seus componentes
          e exemplos.
        </p>
      </header>

      {/* ================================================================== */}
      {/* STATS                                                              */}
      {/* ================================================================== */}
      <div className="animate-fade-in stagger-1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>~30</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Blockchains</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>5</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Tipos Consenso</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>12</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Ecossistemas</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>8</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Camadas</div>
        </div>
      </div>

      <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontStyle: "italic", marginBottom: "2rem", opacity: 0.7 }}>
        * Numeros podem variar conforme fonte e data de consulta. Valores aproximados para fins didaticos.
      </p>

      {/* ================================================================== */}
      {/* SECAO 1 — MAPA DE CAMADAS                                          */}
      {/* ================================================================== */}
      <section style={{ marginBottom: "3rem" }}>
        <div className="flex items-center animate-fade-in stagger-1" style={{ gap: "0.75rem", marginBottom: "1rem" }}>
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

        {/* Stack de camadas */}
        <div className="flex flex-col animate-fade-in stagger-1" style={{ gap: "0" }}>
          {blockchainLayers.map((layer, index) => {
            const isSelected = selectedLayer === layer.id;
            const isDimmed = selectedLayer !== null && !isSelected;

            return (
              <div key={layer.id}>
                {/* Conector visual entre camadas */}
                {index > 0 && (
                  <div className="flex justify-center" style={{ padding: "0.25rem 0" }}>
                    <div className="flex flex-col items-center">
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
                  className={`card overflow-hidden transition-all duration-500 ease-out ${
                    isDimmed ? "opacity-40 scale-[0.98]" : ""
                  }`}
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

                  {/* Corpo */}
                  <div className="bg-[var(--surface)]" style={{ padding: "1.5rem" }}>
                    <p className="text-sm" style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>
                      {layer.description}
                    </p>

                    {/* Componentes — sempre visiveis */}
                    <div style={{ marginBottom: "1rem" }}>
                      <h3 className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                        Componentes Principais
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: "0.625rem" }}>
                        {layer.components.map((comp) => (
                          <div
                            key={comp.name}
                            className="flex items-start text-sm rounded-lg bg-[var(--surface)] border border-[var(--border)]"
                            style={{ gap: "0.625rem", padding: "0.75rem 1rem" }}
                          >
                            <span className="w-2 h-2 rounded-full bg-[var(--primary-lighter)] shrink-0" style={{ marginTop: "0.375rem" }} />
                            <div className="flex-1 min-w-0">
                              <span className="font-medium" style={{ color: "var(--foreground)" }}>
                                {comp.name}
                              </span>
                              {isSelected && (
                                <p className="text-xs animate-fade-in" style={{ color: "var(--text-muted)", marginTop: "0.125rem" }}>
                                  {comp.description}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Exemplos */}
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
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legenda do mapa */}
        <div className="card-flat animate-fade-in stagger-2" style={{ marginTop: "1.5rem" }}>
          <h3 className="font-semibold" style={{ marginBottom: "0.75rem" }}>Como ler este mapa</h3>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Cada camada se apoia na camada abaixo dela. Uma transacao blockchain
            flui do topo (Usuario) passando pela Wallet, Smart Contracts e a rede
            ate ser finalizada pela camada de Consenso e sustentada pela
            Infraestrutura de Nos. Clique em uma camada para ver descricoes
            detalhadas de cada componente.
          </p>
        </div>
      </section>

      {/* ================================================================== */}
      {/* DIVISOR ENTRE SECOES                                               */}
      {/* ================================================================== */}
      <div className="flex items-center animate-fade-in stagger-2" style={{ gap: "1rem", marginBottom: "2rem" }}>
        <div className="flex-1 h-px bg-[var(--border)]" />
        <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
          Catalogo de Blockchains
        </span>
        <div className="flex-1 h-px bg-[var(--border)]" />
      </div>

      {/* ================================================================== */}
      {/* SECAO 2 — CATALOGO DE BLOCKCHAINS                                  */}
      {/* ================================================================== */}
      <section>
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
              placeholder="Pesquisar por nome, descricao, consenso ou token..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl shadow-sm border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-1 placeholder:text-[var(--text-muted)]"
              style={{ paddingLeft: "2.5rem", paddingRight: "1rem", paddingTop: "0.625rem", paddingBottom: "0.625rem" }}
            />
          </div>

          {/* Filtros de categoria */}
          <div className="flex flex-wrap" style={{ gap: "0.5rem" }}>
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === cat ? "shadow-sm" : ""
                }`}
                style={{
                  padding: "0.625rem 1.25rem",
                  ...(activeCategory === cat
                    ? { background: "var(--primary)", color: "white" }
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
            ))}
          </div>
        </div>

        {/* Grid de cards */}
        {filtered.length === 0 ? (
          <div className="card text-center animate-fade-in stagger-4" style={{ padding: "3rem" }}>
            <div className="text-4xl opacity-30" style={{ marginBottom: "1rem" }}>?</div>
            <h3 className="text-lg font-semibold" style={{ marginBottom: "0.5rem" }}>
              Nenhuma blockchain encontrada
            </h3>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Tente ajustar sua pesquisa ou alterar o filtro de categoria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "1.25rem" }}>
            {filtered.map((chain, idx) => {
              const catColor = BLOCKCHAIN_CATEGORY_COLORS[chain.category];

              return (
                <div
                  key={chain.id}
                  className={`card-glow hover:shadow-lg hover:-translate-y-0.5 transition-all animate-fade-in stagger-${Math.min(
                    idx + 1,
                    6
                  )}`}
                  style={{ borderLeft: `3px solid ${catColor}` }}
                >
                  {/* Cabecalho: icone + nome + badge */}
                  <div className="flex items-start" style={{ gap: "0.75rem", marginBottom: "0.75rem" }}>
                    <span
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-sm"
                      style={{
                        background: `linear-gradient(to bottom right, ${catColor}, ${catColor}cc)`,
                      }}
                    >
                      {CATEGORY_ICONS[chain.category]}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold" style={{ marginBottom: "0.125rem" }}>
                        {chain.name}
                      </h3>
                      <span
                        className="text-xs rounded-full font-medium"
                        style={{
                          padding: "0.125rem 0.5rem",
                          background: `${catColor}15`,
                          color: catColor,
                        }}
                      >
                        {chain.category}
                      </span>
                    </div>
                  </div>

                  {/* Consenso */}
                  <div className="flex items-center" style={{ gap: "0.375rem", marginBottom: "0.5rem" }}>
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                      Consenso:
                    </span>
                    <span className="text-xs font-medium" style={{ color: "var(--foreground)" }}>
                      {chain.consensus}
                    </span>
                  </div>

                  {/* Descricao */}
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)", marginBottom: "0.75rem" }}>
                    {chain.description}
                  </p>

                  {/* Metricas: TPS, Finality, Fees, Token */}
                  <div className="grid grid-cols-2" style={{ gap: "0.5rem", marginBottom: "0.75rem" }}>
                    <div className="rounded-lg bg-[var(--surface)] border border-[var(--border)]" style={{ padding: "0.5rem 0.75rem" }}>
                      <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--text-muted)" }}>
                        TPS
                      </span>
                      <p className="text-xs font-medium" style={{ color: "var(--foreground)", marginTop: "0.125rem" }}>
                        {chain.tps}
                      </p>
                    </div>
                    <div className="rounded-lg bg-[var(--surface)] border border-[var(--border)]" style={{ padding: "0.5rem 0.75rem" }}>
                      <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--text-muted)" }}>
                        Finalidade
                      </span>
                      <p className="text-xs font-medium" style={{ color: "var(--foreground)", marginTop: "0.125rem" }}>
                        {chain.finality}
                      </p>
                    </div>
                    <div className="rounded-lg bg-[var(--surface)] border border-[var(--border)]" style={{ padding: "0.5rem 0.75rem" }}>
                      <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--text-muted)" }}>
                        Taxas
                      </span>
                      <p className="text-xs font-medium" style={{ color: "var(--foreground)", marginTop: "0.125rem" }}>
                        {chain.fees}
                      </p>
                    </div>
                    <div className="rounded-lg bg-[var(--surface)] border border-[var(--border)]" style={{ padding: "0.5rem 0.75rem" }}>
                      <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--text-muted)" }}>
                        Token Nativo
                      </span>
                      <p className="text-xs font-medium" style={{ color: "var(--foreground)", marginTop: "0.125rem" }}>
                        {chain.nativeToken}
                      </p>
                    </div>
                  </div>

                  {/* Use Cases — chips */}
                  <div style={{ marginBottom: "0.75rem" }}>
                    <h4 className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--text-muted)", marginBottom: "0.375rem" }}>
                      Casos de Uso
                    </h4>
                    <div className="flex flex-wrap" style={{ gap: "0.375rem" }}>
                      {chain.useCases.map((uc) => (
                        <span
                          key={uc}
                          className="text-[11px] rounded-full border border-[var(--border)]"
                          style={{ padding: "0.125rem 0.5rem", color: "var(--text-muted)" }}
                        >
                          {uc}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Ecosystem — chips */}
                  <div>
                    <h4 className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--text-muted)", marginBottom: "0.375rem" }}>
                      Ecossistema
                    </h4>
                    <div className="flex flex-wrap" style={{ gap: "0.375rem" }}>
                      {chain.ecosystem.map((eco) => (
                        <span
                          key={eco}
                          className="text-[11px] rounded-full font-medium"
                          style={{
                            padding: "0.125rem 0.5rem",
                            background: `${catColor}10`,
                            color: catColor,
                            border: `1px solid ${catColor}30`,
                          }}
                        >
                          {eco}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Nota explicativa do catalogo */}
        <div className="card-flat animate-fade-in stagger-6" style={{ marginTop: "2rem" }}>
          <h3 className="font-semibold" style={{ marginBottom: "0.75rem" }}>Como interpretar o catalogo</h3>
          <div className="flex flex-col text-sm" style={{ gap: "0.75rem", color: "var(--text-muted)" }}>
            <p>
              <strong style={{ color: "var(--foreground)" }}>Layer 1:</strong>{" "}
              Blockchains base que possuem seu proprio mecanismo de consenso e
              seguranca. Exemplos incluem Bitcoin, Ethereum e Solana.
            </p>
            <p>
              <strong style={{ color: "var(--foreground)" }}>Layer 2:</strong>{" "}
              Solucoes construidas sobre uma Layer 1 para aumentar throughput e
              reduzir custos, herdando a seguranca da rede principal. Exemplos:
              Arbitrum e Base.
            </p>
            <p>
              <strong style={{ color: "var(--foreground)" }}>Sidechain:</strong>{" "}
              Blockchains independentes compativeis com uma rede principal, com
              seu proprio consenso e validadores. Oferecem flexibilidade, mas com
              modelo de seguranca distinto.
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* FOOTER — PAGINAS RELACIONADAS                                      */}
      {/* ================================================================== */}
      <div className="divider-text animate-fade-in stagger-6" style={{ marginTop: "3rem" }}>
        <span>Paginas Relacionadas</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem", marginTop: "1.5rem" }}>
        {[
          { name: "Protocolos DeFi", href: "/crypto/defi-protocols", icon: "\u{1F4CA}" },
          { name: "Stablecoin Systems", href: "/crypto/stablecoin-systems", icon: "\u{1F4B2}" },
          { name: "Mapa de Pagamentos", href: "/fundamentos/payments-map", icon: "\u{1F5FA}\u{FE0F}" },
        ].map((p) => (
          <a key={p.href} href={p.href} className="card-flat interactive-hover" style={{ padding: "1.25rem", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontSize: "1.5rem" }}>{p.icon}</span>
            <span style={{ color: "var(--foreground)", fontWeight: 500 }}>{p.name}</span>
            <span style={{ marginLeft: "auto", color: "var(--text-muted)" }}>{"\u2192"}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
