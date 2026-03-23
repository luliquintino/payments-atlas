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

const formulaStyle: React.CSSProperties = {
  padding: "1rem 1.25rem",
  borderRadius: 10,
  background: "var(--surface)",
  border: "1px solid var(--border)",
  fontFamily: "monospace",
  fontSize: "0.95rem",
  fontWeight: 600,
  color: "var(--primary)",
  textAlign: "center",
  marginTop: "0.75rem",
  marginBottom: "0.75rem",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AdvancedCryptoPage() {
  const quiz = getQuizForPage("/crypto/advanced-crypto");
  const { recordQuiz } = useGameProgress();
  const [quizCompleted, setQuizCompleted] = useState(false);

  const sections: Section[] = [
    {
      id: "layer2-pagamentos",
      title: "Layer 2 para Pagamentos",
      icon: "1",
      content: (
        <>
          <p style={paragraphStyle}>
            Blockchains Layer 1 (Ethereum, Bitcoin) nao escalam para pagamentos de alto volume: Ethereum
            processa ~15 TPS com gas fees variaveis, Bitcoin ~7 TPS. Para comparacao, Visa processa ~65.000
            TPS no pico. Layer 2 (L2) sao protocolos construidos sobre L1 que herdam sua seguranca mas
            oferecem throughput muito maior e custos menores.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Metrica</th>
                  <th style={thStyle}>Ethereum L1</th>
                  <th style={thStyle}>L2 Rollup</th>
                  <th style={thStyle}>Visa</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>TPS</td><td style={tdStyle}>~15</td><td style={tdStyle}>2.000-4.000+</td><td style={tdStyle}>~65.000 (pico)</td></tr>
                <tr><td style={tdStyle}>Custo por tx</td><td style={tdStyle}>$1-50+ (variavel)</td><td style={tdStyle}>$0.01-0.10</td><td style={tdStyle}>~$0.05-0.20</td></tr>
                <tr><td style={tdStyle}>Finalidade</td><td style={tdStyle}>~12 min (finality)</td><td style={tdStyle}>Minutos (L2) / horas (L1 finality)</td><td style={tdStyle}>Segundos (auth) / dias (settlement)</td></tr>
                <tr><td style={tdStyle}>Seguranca</td><td style={tdStyle}>Consenso global PoS</td><td style={tdStyle}>Herda seguranca do L1</td><td style={tdStyle}>Centralizada (Visa Inc.)</td></tr>
              </tbody>
            </table>
          </div>
          <p style={paragraphStyle}>
            Para pagamentos, L2s tornam viavel usar stablecoins como meio de pagamento: custo baixo,
            settlement rapido e programabilidade (smart contracts para escrow, split, compliance automatico).
            A tendencia e que pagamentos cripto migrem majoritariamente para L2s.
          </p>
        </>
      ),
    },
    {
      id: "rollups",
      title: "Rollups: Optimistic vs ZK",
      icon: "2",
      content: (
        <>
          <p style={paragraphStyle}>
            Rollups sao a principal categoria de L2 para Ethereum. Eles executam transacoes off-chain,
            compactam os dados e publicam um resumo (batch) no L1. A diferenca fundamental esta no
            mecanismo de verificacao da validade das transacoes.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Aspecto</th>
                  <th style={thStyle}>Optimistic Rollups</th>
                  <th style={thStyle}>ZK Rollups</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Verificacao</td><td style={tdStyle}>Assume valido, permite contestacao (fraud proof) em 7 dias</td><td style={tdStyle}>Prova criptografica (validity proof) submetida com cada batch</td></tr>
                <tr><td style={tdStyle}>Finality L1</td><td style={tdStyle}>~7 dias (challenge period)</td><td style={tdStyle}>Minutos (apos proof ser verificado)</td></tr>
                <tr><td style={tdStyle}>Custo</td><td style={tdStyle}>Menor custo computacional, mais dados on-chain</td><td style={tdStyle}>Maior custo computacional (proof generation), menos dados on-chain</td></tr>
                <tr><td style={tdStyle}>EVM Compat.</td><td style={tdStyle}>Alta (Arbitrum, Optimism, Base sao EVM-compatíveis)</td><td style={tdStyle}>Variavel (zkSync Era: EVM, StarkNet: Cairo VM custom)</td></tr>
                <tr><td style={tdStyle}>Exemplos</td><td style={tdStyle}>Arbitrum, Optimism, Base (Coinbase)</td><td style={tdStyle}>zkSync Era, StarkNet, Polygon zkEVM, Scroll</td></tr>
                <tr><td style={tdStyle}>Melhor para</td><td style={tdStyle}>DApps gerais, DeFi, contratos complexos</td><td style={tdStyle}>Pagamentos (finality rapida), privacy, high-throughput</td></tr>
              </tbody>
            </table>
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Para Pagamentos: ZK tem vantagem
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Em pagamentos, a finality rapida dos ZK rollups e crucial. Um merchant nao pode esperar 7 dias
              para confirmar que o pagamento e valido no L1. ZK rollups oferecem finality em minutos,
              tornando-os mais adequados para payment rails cripto de producao.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "state-channels",
      title: "State Channels & Payment Channels",
      icon: "3",
      content: (
        <>
          <p style={paragraphStyle}>
            State channels permitem que duas partes realizem multiplas transacoes off-chain e so publiquem
            o estado final na blockchain. Payment channels sao um caso especifico: canais dedicados a
            transferencias de valor. O conceito e: abrir canal (on-chain), transacionar (off-chain, infinitas
            vezes), fechar canal (on-chain).
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Rede</th>
                  <th style={thStyle}>Blockchain Base</th>
                  <th style={thStyle}>Capacidade</th>
                  <th style={thStyle}>Uso Principal</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Lightning Network</td><td style={tdStyle}>Bitcoin</td><td style={tdStyle}>~1M+ TPS teorico</td><td style={tdStyle}>Micropagamentos BTC, pagamentos instantaneos</td></tr>
                <tr><td style={tdStyle}>Raiden Network</td><td style={tdStyle}>Ethereum</td><td style={tdStyle}>Similar ao Lightning</td><td style={tdStyle}>Pagamentos ERC-20, micropagamentos</td></tr>
                <tr><td style={tdStyle}>Connext</td><td style={tdStyle}>Multi-chain</td><td style={tdStyle}>Cross-chain transfers</td><td style={tdStyle}>Bridging, pagamentos cross-chain</td></tr>
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>Lightning Network: Como Funciona</p>
          <p style={paragraphStyle}>
            1. Alice e Bob abrem um canal depositando BTC em um multisig 2-of-2 on-chain. 2. Eles trocam
            transacoes assinadas off-chain atualizando os saldos. 3. Routing: se Alice quer pagar Carol mas
            nao tem canal direto, a transacao e roteada via intermediarios usando HTLCs (Hash Time-Locked
            Contracts). 4. Qualquer parte pode fechar o canal a qualquer momento publicando o ultimo estado.
          </p>
          <p style={paragraphStyle}>
            Limitacoes para pagamentos: requer pre-funding do canal (capital travado), routing pode falhar
            para valores altos, e a UX ainda e complexa. El Salvador adotou Lightning para pagamentos do
            dia-a-dia com BTC, mas a adocao mostrou desafios de liquidez e usabilidade.
          </p>
        </>
      ),
    },
    {
      id: "bridges",
      title: "Bridges & Cross-Chain",
      icon: "4",
      content: (
        <>
          <p style={paragraphStyle}>
            Bridges conectam blockchains diferentes, permitindo transferir ativos e dados entre cadeias
            que nao se comunicam nativamente. Para pagamentos, bridges sao essenciais: um merchant pode
            aceitar USDC no Polygon mas precisar de liquidez na Ethereum mainnet.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Modelo</th>
                  <th style={thStyle}>Como Funciona</th>
                  <th style={thStyle}>Seguranca</th>
                  <th style={thStyle}>Exemplo</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Lock & Mint</td><td style={tdStyle}>Trava ativo na chain A, minta representacao na chain B</td><td style={tdStyle}>Depende do validador do bridge</td><td style={tdStyle}>Wrapped BTC (WBTC), Portal (Wormhole)</td></tr>
                <tr><td style={tdStyle}>Burn & Mint</td><td style={tdStyle}>Queima na chain A, minta nativo na chain B</td><td style={tdStyle}>Requer coordenacao entre emissores</td><td style={tdStyle}>USDC (Circle CCTP)</td></tr>
                <tr><td style={tdStyle}>Atomic Swap</td><td style={tdStyle}>Troca atomica usando HTLCs, sem intermediario</td><td style={tdStyle}>Trustless, mas requer contraparte</td><td style={tdStyle}>Thorchain, atomic swaps BTC/ETH</td></tr>
                <tr><td style={tdStyle}>Liquidity Network</td><td style={tdStyle}>Pools de liquidez em cada chain, rebalanceamento</td><td style={tdStyle}>Risco de pool, mas sem wrapped tokens</td><td style={tdStyle}>Stargate, Across Protocol</td></tr>
              </tbody>
            </table>
          </div>
          <p style={paragraphStyle}>
            O CCTP (Cross-Chain Transfer Protocol) da Circle e particularmente relevante para pagamentos:
            USDC e queimado na chain de origem e mintado nativamente na chain de destino, eliminando o risco
            de wrapped tokens. Isso significa USDC nativo em qualquer chain, crucial para confianca em
            pagamentos comerciais.
          </p>
        </>
      ),
    },
    {
      id: "bridge-security",
      title: "Bridge Security",
      icon: "5",
      content: (
        <>
          <p style={paragraphStyle}>
            Bridges sao o elo mais fraco da seguranca cross-chain. Historicamente, foram responsaveis pelas
            maiores perdas em hacks cripto. O problema fundamental: bridges concentram enormes quantidades
            de valor em smart contracts que servem como honeypots para atacantes.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Incidente</th>
                  <th style={thStyle}>Perda</th>
                  <th style={thStyle}>Causa Raiz</th>
                  <th style={thStyle}>Licao</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Ronin Bridge (2022)</td><td style={tdStyle}>$625M</td><td style={tdStyle}>5 de 9 validadores comprometidos (social engineering)</td><td style={tdStyle}>Multisig com poucos validadores e ponto unico de falha</td></tr>
                <tr><td style={tdStyle}>Wormhole (2022)</td><td style={tdStyle}>$320M</td><td style={tdStyle}>Bug no contrato Solana permitiu mint nao autorizado</td><td style={tdStyle}>Auditoria rigorosa de smart contracts em todas as chains</td></tr>
                <tr><td style={tdStyle}>Nomad (2022)</td><td style={tdStyle}>$190M</td><td style={tdStyle}>Bug de inicializacao permitiu qualquer pessoa provar txs falsas</td><td style={tdStyle}>Testes de invariantes criticos em upgrades</td></tr>
                <tr><td style={tdStyle}>Poly Network (2021)</td><td style={tdStyle}>$611M</td><td style={tdStyle}>Exploracao de permissoes cross-chain</td><td style={tdStyle}>Principio do menor privilegio em contratos cross-chain</td></tr>
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>ZK Bridges vs Multisig</p>
          <p style={paragraphStyle}>
            A evolucao natural e de bridges baseados em multisig (confie nos validadores) para bridges
            baseados em ZK proofs (confie na matematica). ZK bridges verificam criptograficamente o estado
            da chain de origem sem precisar de validadores confiaveis. Projetos como Succinct, Polymer e
            zkBridge estao construindo essa infraestrutura. Para pagamentos de alto valor, ZK bridges
            oferecem garantias de seguranca muito superiores.
          </p>
        </>
      ),
    },
    {
      id: "stablecoin-risk",
      title: "Stablecoin Risk Framework",
      icon: "6",
      content: (
        <>
          <p style={paragraphStyle}>
            Stablecoins sao a espinha dorsal dos pagamentos cripto, mas carregam riscos especificos que
            precisam ser avaliados com rigor. Um framework de risco robusto analisa: backing, transparencia,
            mecanismo de peg, risco regulatorio e risco de smart contract.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Tipo</th>
                  <th style={thStyle}>Exemplo</th>
                  <th style={thStyle}>Backing</th>
                  <th style={thStyle}>Risco de Depeg</th>
                  <th style={thStyle}>Risco Regulatorio</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Fiat-backed</td><td style={tdStyle}>USDC, USDT</td><td style={tdStyle}>Reservas em cash + T-bills</td><td style={tdStyle}>Baixo (se reservas sao reais)</td><td style={tdStyle}>Alto (emissores sao regulados)</td></tr>
                <tr><td style={tdStyle}>Crypto-backed</td><td style={tdStyle}>DAI, LUSD</td><td style={tdStyle}>Over-collateralized com ETH/crypto</td><td style={tdStyle}>Medio (depende de liquidacao eficiente)</td><td style={tdStyle}>Medio (descentralizado)</td></tr>
                <tr><td style={tdStyle}>Algorithmic</td><td style={tdStyle}>UST (colapsou), FRAX</td><td style={tdStyle}>Algoritmo + incentivos de mercado</td><td style={tdStyle}>Alto (death spiral possivel)</td><td style={tdStyle}>Alto (sem backing real)</td></tr>
                <tr><td style={tdStyle}>RWA-backed</td><td style={tdStyle}>USDM, Mountain</td><td style={tdStyle}>T-bills tokenizados</td><td style={tdStyle}>Baixo</td><td style={tdStyle}>Medio (jurisdicional)</td></tr>
              </tbody>
            </table>
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Cenario de Depeg: USDC em Marco 2023
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              USDC caiu para $0.87 quando Silicon Valley Bank (que custodiava $3.3B das reservas) faliu.
              O peg foi restaurado apos o FDIC garantir depositos. Licao: mesmo stablecoins fiat-backed
              tem risco de contraparte bancaria. Diversificacao de custodia e crucial.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "cbdc",
      title: "CBDC Architecture",
      icon: "7",
      content: (
        <>
          <p style={paragraphStyle}>
            CBDCs (Central Bank Digital Currencies) sao moedas digitais emitidas por bancos centrais.
            Diferente de stablecoins privadas, CBDCs sao passivos diretos do banco central, com a mesma
            confianca do dinheiro fisico. A arquitetura varia significativamente entre projetos.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Modelo</th>
                  <th style={thStyle}>Descricao</th>
                  <th style={thStyle}>Exemplo</th>
                  <th style={thStyle}>Tradeoff</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Retail (account-based)</td><td style={tdStyle}>Contas digitais no banco central para cidadaos</td><td style={tdStyle}>e-CNY (Digital Yuan)</td><td style={tdStyle}>Privacy reduzida, desintermediacao bancaria</td></tr>
                <tr><td style={tdStyle}>Retail (token-based)</td><td style={tdStyle}>Tokens digitais transferiveis como dinheiro</td><td style={tdStyle}>Digital Euro (proposta)</td><td style={tdStyle}>Melhor privacy, complexidade tecnica</td></tr>
                <tr><td style={tdStyle}>Wholesale</td><td style={tdStyle}>Apenas para instituicoes financeiras, settlement interbancario</td><td style={tdStyle}>Helvetia (Suica), Drex fase 1</td><td style={tdStyle}>Menor impacto no sistema, escopo limitado</td></tr>
                <tr><td style={tdStyle}>Hibrido (2 camadas)</td><td style={tdStyle}>BC emite, bancos comerciais distribuem</td><td style={tdStyle}>Drex (Brasil), DCash (Caribe)</td><td style={tdStyle}>Preserva papel dos bancos, mais complexo</td></tr>
              </tbody>
            </table>
          </div>
          <p style={subheadingStyle}>Drex (Real Digital) - Brasil</p>
          <p style={paragraphStyle}>
            O Drex e o CBDC brasileiro, baseado em Hyperledger Besu (EVM-compativel, permissioned). Arquitetura
            de 2 camadas: BCB emite Drex wholesale para instituicoes, que tokenizam depositos para clientes
            (depositos tokenizados). Foco inicial: DVP (Delivery vs Payment) para ativos tokenizados, como
            titulos publicos tokenizados negociados com settlement atomico. Privacy via ZK proofs e um dos
            principais desafios tecnicos em fase de testes.
          </p>
          <p style={subheadingStyle}>Digital Euro</p>
          <p style={paragraphStyle}>
            O ECB esta na fase de preparacao do Digital Euro, previsto para lancamento apos 2025. Modelo
            token-based com limite de holding (~EUR 3.000 proposto), foco em privacy (transacoes offline
            anonimas ate certo valor) e interoperabilidade com sistemas de pagamento existentes (SEPA).
          </p>
        </>
      ),
    },
    {
      id: "defi-pagamentos",
      title: "DeFi para Pagamentos",
      icon: "8",
      content: (
        <>
          <p style={paragraphStyle}>
            DeFi (Decentralized Finance) oferece primitivas financeiras programaveis que podem ser
            integradas em payment stacks. Nao se trata de substituir rails tradicionais, mas de usar
            DeFi como infraestrutura para funcoes especificas dentro do ciclo de pagamento.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Caso de Uso</th>
                  <th style={thStyle}>Protocolo DeFi</th>
                  <th style={thStyle}>Aplicacao em Pagamentos</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>FX Descentralizado</td><td style={tdStyle}>Uniswap, Curve (stablecoin pools)</td><td style={tdStyle}>Conversao USDC/EURC on-chain para cross-border, sem banco correspondente</td></tr>
                <tr><td style={tdStyle}>Yield em Tesouraria</td><td style={tdStyle}>Aave, Compound, MakerDAO DSR</td><td style={tdStyle}>Float management: stablecoins em pool de lending geram yield enquanto aguardam settlement</td></tr>
                <tr><td style={tdStyle}>Escrow Programavel</td><td style={tdStyle}>Smart contracts custom</td><td style={tdStyle}>Pagamentos condicionais: libera fundos ao cumprir condicoes (delivery, milestone)</td></tr>
                <tr><td style={tdStyle}>Streaming Payments</td><td style={tdStyle}>Sablier, Superfluid</td><td style={tdStyle}>Pagamentos por segundo (salarios, assinaturas, royalties em tempo real)</td></tr>
                <tr><td style={tdStyle}>Insurance</td><td style={tdStyle}>Nexus Mutual, InsurAce</td><td style={tdStyle}>Seguro contra depeg de stablecoin, smart contract risk</td></tr>
              </tbody>
            </table>
          </div>
          <p style={paragraphStyle}>
            O risco principal e smart contract risk: bugs no codigo podem levar a perda total de fundos.
            Para pagamentos de producao, apenas protocolos battle-tested (anos de operacao sem exploit,
            multiplas auditorias) devem ser considerados. Aave e Compound tem track record de bilhoes de
            dolares processados sem perda de fundos dos depositors.
          </p>
        </>
      ),
    },
    {
      id: "oraculos",
      title: "Oraculos e Dados Off-Chain",
      icon: "9",
      content: (
        <>
          <p style={paragraphStyle}>
            Oraculos sao servicos que alimentam smart contracts com dados do mundo real (precos, taxas de
            cambio, eventos). Para pagamentos cripto, oraculos sao essenciais: como um smart contract sabe
            a taxa BRL/USD atual para converter um pagamento? Atraves de um oraculo.
          </p>
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Oraculo</th>
                  <th style={thStyle}>Modelo</th>
                  <th style={thStyle}>Dados Oferecidos</th>
                  <th style={thStyle}>Uso em Pagamentos</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Chainlink</td><td style={tdStyle}>Rede descentralizada de nodes</td><td style={tdStyle}>Price feeds, proof of reserves, CCIP</td><td style={tdStyle}>Pricing de transacoes, verificacao de reservas de stablecoins</td></tr>
                <tr><td style={tdStyle}>Pyth Network</td><td style={tdStyle}>First-party data (exchanges, market makers)</td><td style={tdStyle}>Low-latency price feeds</td><td style={tdStyle}>DeFi FX pricing, pagamentos em tempo real</td></tr>
                <tr><td style={tdStyle}>Band Protocol</td><td style={tdStyle}>Delegated proof of stake</td><td style={tdStyle}>Price feeds, random numbers</td><td style={tdStyle}>Cross-chain pricing, verificacao de dados</td></tr>
                <tr><td style={tdStyle}>API3</td><td style={tdStyle}>First-party (operado pelos data providers)</td><td style={tdStyle}>dAPIs (decentralized APIs)</td><td style={tdStyle}>Dados financeiros on-chain direto da fonte</td></tr>
              </tbody>
            </table>
          </div>
          <div style={highlightBoxStyle}>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--primary)", marginBottom: "0.25rem" }}>
              Oracle Manipulation Risk
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--foreground)", lineHeight: 1.6 }}>
              Se um atacante manipula o price feed de um oraculo, pode explorar smart contracts que dependem
              desse dado. Em pagamentos, isso poderia significar conversoes com taxa errada ou liquidacoes
              indevidas. Mitigacao: usar TWAP (Time-Weighted Average Price), multiplos oraculos, circuit
              breakers para desvios anormais e Chainlink Proof of Reserve para verificar backing.
            </p>
          </div>
          <p style={paragraphStyle}>
            Chainlink CCIP (Cross-Chain Interoperability Protocol) merece destaque especial: alem de price
            feeds, permite transferencia de tokens e mensagens entre chains de forma segura. Para pagamentos,
            CCIP pode servir como bridge institucional com seguranca de nivel enterprise, com risk management
            network independente que verifica cada transacao cross-chain.
          </p>
        </>
      ),
    },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <header className="page-header animate-fade-in">
        <h1 className="page-title" style={{ marginBottom: "0.75rem" }}>
          Crypto Avancado: Layer 2 & Bridges
        </h1>
        <p className="page-description">
          Layer 2 scaling, rollups, payment channels, bridges cross-chain, stablecoin risk,
          CBDCs, DeFi para pagamentos e oraculos.
        </p>
      </header>

      {/* Learning Objectives */}
      <div className="learning-objectives" style={{ marginBottom: "1.5rem" }}>
        <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--primary)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          O que voce vai aprender
        </p>
        <ul>
          <li>Por que Layer 1 nao escala para pagamentos e como L2s resolvem isso</li>
          <li>Tradeoffs entre Optimistic Rollups e ZK Rollups para payment rails</li>
          <li>Seguranca de bridges cross-chain e licoes dos maiores hacks</li>
          <li>Framework de risco para stablecoins, arquitetura de CBDCs (Drex, Digital Euro)</li>
          <li>Como DeFi e oraculos se integram a stacks de pagamento</li>
        </ul>
      </div>

      {/* Stats */}
      <div className="animate-fade-in stagger-1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>9</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Secoes</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>$1.7B+</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Perdas em Bridges</div>
        </div>
        <div className="stat-card" style={{ padding: "1rem", textAlign: "center" }}>
          <div className="metric-value" style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>100+</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Paises com CBDC</div>
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
