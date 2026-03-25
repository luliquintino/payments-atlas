"use client";

import Link from "next/link";
import { useState, useCallback, useEffect } from "react";
import { useGameProgress } from "@/hooks/useGameProgress";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Choice {
  label: string;
  impact: Record<string, number>;
  explanation: string;
  optimal: boolean;
}

interface Round {
  prompt: string;
  choices: Choice[];
}

interface ScenarioMetrics {
  [key: string]: { label: string; value: number; suffix: string; color: string };
}

interface Scenario {
  id: string;
  title: string;
  icon: string;
  context: string;
  initialMetrics: ScenarioMetrics;
  rounds: Round[];
  expertPath: string;
}

// ---------------------------------------------------------------------------
// Scenario Data
// ---------------------------------------------------------------------------
const SCENARIOS: Scenario[] = [
  {
    id: "ecommerce-auth",
    title: "E-commerce com Auth Rate de 68%",
    icon: "\uD83D\uDED2",
    context:
      "Voce e o novo Head de Pagamentos de um grande e-commerce brasileiro. A empresa processa 500K transacoes/mes, mas a auth rate esta em apenas 68%. Cerca de 60% do trafego e cross-border. O CEO quer melhorias rapidas.",
    initialMetrics: {
      authRate: { label: "Auth Rate", value: 68, suffix: "%", color: "#EF4444" },
      revenue: { label: "Receita Mensal", value: 12.5, suffix: "M", color: "#3B82F6" },
      crossBorder: { label: "Cross-border", value: 60, suffix: "%", color: "#F59E0B" },
      chargebackRate: { label: "Chargeback Rate", value: 1.2, suffix: "%", color: "#8B5CF6" },
    },
    rounds: [
      {
        prompt: "Qual feature voce prioriza primeiro para melhorar a auth rate?",
        choices: [
          {
            label: "Smart Routing",
            impact: { authRate: 8, revenue: 2.1, crossBorder: -5, chargebackRate: -0.1 },
            explanation:
              "Smart Routing direciona cada transacao para o adquirente com maior probabilidade de aprovacao. Com 60% cross-border, rotear para adquirentes locais nos paises de origem tem impacto massivo. Excelente primeira escolha.",
            optimal: true,
          },
          {
            label: "Network Tokens",
            impact: { authRate: 5, revenue: 1.3, crossBorder: 0, chargebackRate: -0.05 },
            explanation:
              "Network Tokens substituem o PAN por tokens da bandeira, melhorando aprovacao e seguranca. Bom impacto, mas Smart Routing teria sido mais eficaz com tanto trafego cross-border.",
            optimal: false,
          },
          {
            label: "3DS Optimization",
            impact: { authRate: 3, revenue: 0.8, crossBorder: -2, chargebackRate: -0.3 },
            explanation:
              "Otimizar 3DS reduz fricao e chargebacks, mas o ganho em auth rate e menor. A reducao de chargeback e boa, porem Smart Routing resolveria a causa raiz.",
            optimal: false,
          },
          {
            label: "Retry Logic",
            impact: { authRate: 4, revenue: 1.0, crossBorder: 0, chargebackRate: 0 },
            explanation:
              "Retry automatico recupera transacoes com soft-declines. Util, mas nao endereca o problema principal de roteamento cross-border.",
            optimal: false,
          },
        ],
      },
      {
        prompt: "Auth rate melhorou! Qual o proximo investimento?",
        choices: [
          {
            label: "Network Tokens",
            impact: { authRate: 5, revenue: 1.5, crossBorder: 0, chargebackRate: -0.1 },
            explanation:
              "Com o roteamento ja otimizado, Network Tokens agora maximizam aprovacao no adquirente correto. Tokens da bandeira tem 5-10% mais aprovacao que PANs tradicionais.",
            optimal: true,
          },
          {
            label: "Machine Learning Antifraude",
            impact: { authRate: 2, revenue: 0.5, crossBorder: 0, chargebackRate: -0.4 },
            explanation:
              "ML antifraude reduz falsos positivos e chargebacks, mas o impacto em auth rate e limitado neste momento. Melhor focar em tokens primeiro.",
            optimal: false,
          },
          {
            label: "Checkout Optimization",
            impact: { authRate: 3, revenue: 0.9, crossBorder: 0, chargebackRate: 0 },
            explanation:
              "Otimizar o checkout (campos, UX, one-click) melhora conversao, mas e uma camada acima do processamento. Network Tokens teriam mais impacto tecnico.",
            optimal: false,
          },
          {
            label: "Multi-acquirer Fallback",
            impact: { authRate: 4, revenue: 1.2, crossBorder: -3, chargebackRate: 0 },
            explanation:
              "Fallback para segundo adquirente recupera declines, mas com Smart Routing ja implementado, o ganho incremental e menor. Tokens seriam mais eficazes.",
            optimal: false,
          },
        ],
      },
      {
        prompt: "Otimo progresso! Ultimo investimento do trimestre:",
        choices: [
          {
            label: "Retry com Backoff Inteligente",
            impact: { authRate: 4, revenue: 1.1, crossBorder: 0, chargebackRate: 0 },
            explanation:
              "Retry inteligente com analise de decline codes recupera soft-declines sem risco. Com routing e tokens otimizados, retries capturam o valor residual. Escolha ideal para fechar o trimestre.",
            optimal: true,
          },
          {
            label: "3DS Optimization",
            impact: { authRate: 3, revenue: 0.8, crossBorder: -2, chargebackRate: -0.3 },
            explanation:
              "3DS otimizado e valioso mas o ganho em auth rate e menor que retry logic neste contexto. A reducao de chargeback e um bonus, porem.",
            optimal: false,
          },
          {
            label: "Account Updater",
            impact: { authRate: 2, revenue: 0.5, crossBorder: 0, chargebackRate: 0 },
            explanation:
              "Account Updater mantem dados de cartao atualizados para recorrencia. Importante, mas com impacto limitado para e-commerce com maioria de compras avulsas.",
            optimal: false,
          },
          {
            label: "Dynamic Currency Conversion",
            impact: { authRate: 1, revenue: 0.3, crossBorder: -8, chargebackRate: 0.1 },
            explanation:
              "DCC mostra o preco na moeda do comprador, mas pode aumentar chargebacks de disputas de cambio. Impacto em auth rate e minimo.",
            optimal: false,
          },
        ],
      },
    ],
    expertPath:
      "A sequencia otima e: Smart Routing (resolve cross-border) -> Network Tokens (maximiza aprovacao por adquirente) -> Retry Logic (captura residual). Esta combinacao atinge +17% de auth rate.",
  },
  {
    id: "marketplace-fraud",
    title: "Marketplace com Spike de Fraude",
    icon: "\uD83D\uDEA8",
    context:
      "Voce gerencia pagamentos de um marketplace de eletronicos. Nas ultimas 2 semanas, a taxa de fraude subiu de 0.5% para 3.2%. O time de risco esta sobrecarregado e a Visa enviou um alerta de programa de monitoramento.",
    initialMetrics: {
      fraudRate: { label: "Fraud Rate", value: 3.2, suffix: "%", color: "#EF4444" },
      chargebacks: { label: "Chargebacks/mes", value: 847, suffix: "", color: "#F59E0B" },
      gmv: { label: "GMV Mensal", value: 8.2, suffix: "M", color: "#3B82F6" },
      reviewQueue: { label: "Fila de Review", value: 1250, suffix: "", color: "#8B5CF6" },
    },
    rounds: [
      {
        prompt: "Acao imediata para conter a fraude:",
        choices: [
          {
            label: "Adicionar Velocity Checks",
            impact: { fraudRate: -1.2, chargebacks: -320, gmv: -0.3, reviewQueue: -400 },
            explanation:
              "Velocity checks limitam transacoes por cartao/device/IP por periodo. E a acao mais equilibrada: contem fraude sem bloquear todo o trafego. Impacto imediato e controlado.",
            optimal: true,
          },
          {
            label: "Bloquear Todo Internacional",
            impact: { fraudRate: -1.8, chargebacks: -480, gmv: -2.5, reviewQueue: -600 },
            explanation:
              "Bloquear internacional reduz fraude drasticamente, mas mata 30% do GMV. Muitos merchants legitimos tambem sao afetados. Acao desproporcional.",
            optimal: false,
          },
          {
            label: "Aumentar Threshold 3DS",
            impact: { fraudRate: -0.5, chargebacks: -130, gmv: -0.1, reviewQueue: -100 },
            explanation:
              "Forcar 3DS em mais transacoes ajuda, mas o impacto e lento (chargebacks ja disputados nao sao afetados). Velocity checks teriam sido mais rapidos.",
            optimal: false,
          },
          {
            label: "Fila de Review Manual",
            impact: { fraudRate: -0.3, chargebacks: -80, gmv: 0, reviewQueue: 500 },
            explanation:
              "Mais review manual nao escala quando a fila ja tem 1250 itens. Vai sobrecarregar ainda mais o time sem resolver a causa raiz.",
            optimal: false,
          },
        ],
      },
      {
        prompt: "Fraude contida parcialmente. Como investigar a causa raiz?",
        choices: [
          {
            label: "Analisar por Seller",
            impact: { fraudRate: -0.8, chargebacks: -200, gmv: 0.2, reviewQueue: -300 },
            explanation:
              "Analise por seller revela que 3 sellers novos concentram 70% das fraudes. Suspender essas contas elimina a maior parte do problema. Investigacao mais eficaz.",
            optimal: true,
          },
          {
            label: "Analisar por BIN Range",
            impact: { fraudRate: -0.4, chargebacks: -100, gmv: 0, reviewQueue: -150 },
            explanation:
              "Analise por BIN identifica cartoes de teste e BINs comprometidos, mas nao revela quem esta por tras. Sellers seriam mais direto ao ponto.",
            optimal: false,
          },
          {
            label: "Check Device Fingerprints",
            impact: { fraudRate: -0.5, chargebacks: -130, gmv: 0, reviewQueue: -200 },
            explanation:
              "Device fingerprinting encontra multiplas contas do mesmo dispositivo, mas leva tempo para implementar. Analise por seller daria resultado mais rapido.",
            optimal: false,
          },
          {
            label: "Revisar Regras Antifraude",
            impact: { fraudRate: -0.3, chargebacks: -80, gmv: -0.1, reviewQueue: -100 },
            explanation:
              "Revisar regras e importante a longo prazo, mas nao identifica a causa raiz do spike. E otimizacao, nao investigacao.",
            optimal: false,
          },
        ],
      },
      {
        prompt: "Causa raiz identificada. Medida permanente:",
        choices: [
          {
            label: "Modelo Hibrido (ML + Regras)",
            impact: { fraudRate: -0.6, chargebacks: -150, gmv: 0.5, reviewQueue: -300 },
            explanation:
              "Modelo hibrido combina ML para deteccao de padroes novos com regras para casos conhecidos. Mais resiliente e adaptavel. Melhor solucao a longo prazo.",
            optimal: true,
          },
          {
            label: "Modelo ML Puro",
            impact: { fraudRate: -0.5, chargebacks: -120, gmv: 0.3, reviewQueue: -250 },
            explanation:
              "ML puro e poderoso, mas precisa de dados historicos e pode ter blind spots. Sem regras de backstop, novos vetores de ataque podem passar.",
            optimal: false,
          },
          {
            label: "Sistema Rule-based",
            impact: { fraudRate: -0.4, chargebacks: -100, gmv: -0.2, reviewQueue: -200 },
            explanation:
              "Regras sao previsíveis e rapidas, mas frageis contra ataques sofisticados. Falsos positivos tendem a ser mais altos sem ML.",
            optimal: false,
          },
          {
            label: "Terceirizar Antifraude",
            impact: { fraudRate: -0.5, chargebacks: -130, gmv: -0.4, reviewQueue: -350 },
            explanation:
              "Terceirizar e rapido, mas caro e remove o controle. Para um marketplace, entender os proprios dados e estrategico.",
            optimal: false,
          },
        ],
      },
    ],
    expertPath:
      "Sequencia otima: Velocity Checks (contencao imediata) -> Analise por Seller (causa raiz) -> Modelo Hibrido (prevencao permanente). Reduz fraud rate de 3.2% para ~0.3%.",
  },
  {
    id: "fintech-settlement",
    title: "Fintech com Settlement Delay",
    icon: "\u23F3",
    context:
      "Voce e CTO de um PSP brasileiro que liquida em D+2. Merchants estao migrando para concorrentes que oferecem D+1 ou mesmo D+0. Sua base de 2.000 merchants caiu 15% no ultimo trimestre.",
    initialMetrics: {
      settlementDays: { label: "Settlement", value: 2, suffix: " dias", color: "#EF4444" },
      merchantBase: { label: "Merchants Ativos", value: 1700, suffix: "", color: "#3B82F6" },
      churnRate: { label: "Churn Rate", value: 15, suffix: "%", color: "#F59E0B" },
      cashReserve: { label: "Reserva de Caixa", value: 45, suffix: "M", color: "#10B981" },
    },
    rounds: [
      {
        prompt: "Como reduzir o prazo de liquidacao?",
        choices: [
          {
            label: "Implementar Pre-funding com Reserva",
            impact: { settlementDays: -1, merchantBase: 150, churnRate: -6, cashReserve: -15 },
            explanation:
              "Pre-funding usa sua reserva de caixa para adiantar o settlement para D+1. Impacto imediato na retencao. Custo financeiro controlado se bem gerenciado.",
            optimal: true,
          },
          {
            label: "Migrar para Novo Processador",
            impact: { settlementDays: -1, merchantBase: 50, churnRate: -2, cashReserve: -5 },
            explanation:
              "Migrar processador leva 3-6 meses e tem riscos de integracao. O resultado final e bom, mas a demora causa mais churn no caminho.",
            optimal: false,
          },
          {
            label: "Negociar com Adquirentes",
            impact: { settlementDays: 0, merchantBase: 30, churnRate: -1, cashReserve: 0 },
            explanation:
              "Negociar melhores termos com adquirentes e lento e incerto. Voce depende da boa vontade deles. Pre-funding da controle imediato.",
            optimal: false,
          },
          {
            label: "Oferecer Antecipacao a Pedido",
            impact: { settlementDays: 0, merchantBase: 80, churnRate: -3, cashReserve: -3 },
            explanation:
              "Antecipacao a pedido e um bom complemento, mas merchants querem D+1 como padrao, nao como servico extra pago.",
            optimal: false,
          },
        ],
      },
      {
        prompt: "Settlement melhorou! Como recuperar merchants perdidos?",
        choices: [
          {
            label: "Programa de Win-back com D+1 + Pricing Agressivo",
            impact: { settlementDays: 0, merchantBase: 200, churnRate: -4, cashReserve: -5 },
            explanation:
              "Combinar D+1 com pricing competitivo para os primeiros 3 meses traz merchants de volta rapidamente. O custo se paga com o volume recuperado.",
            optimal: true,
          },
          {
            label: "Adicionar Features (Split, Recorrencia)",
            impact: { settlementDays: 0, merchantBase: 100, churnRate: -2, cashReserve: -2 },
            explanation:
              "Features adicionais diferenciam, mas levam meses para construir. Win-back agressivo traria resultado mais rapido.",
            optimal: false,
          },
          {
            label: "Investir em Marca e Marketing",
            impact: { settlementDays: 0, merchantBase: 50, churnRate: -1, cashReserve: -8 },
            explanation:
              "Marketing ajuda a longo prazo, mas merchants B2B decidem por features e preco, nao por branding. ROI mais lento.",
            optimal: false,
          },
          {
            label: "Parcerias com Plataformas",
            impact: { settlementDays: 0, merchantBase: 120, churnRate: -3, cashReserve: -3 },
            explanation:
              "Parcerias com ERPs e plataformas de e-commerce geram leads qualificados. Bom, mas win-back direto e mais rapido para recuperar quem ja saiu.",
            optimal: false,
          },
        ],
      },
      {
        prompt: "Base crescendo! Como garantir sustentabilidade financeira do D+1?",
        choices: [
          {
            label: "Pricing Tiered + Reserva Dinamica",
            impact: { settlementDays: 0, merchantBase: 50, churnRate: -1, cashReserve: 8 },
            explanation:
              "Pricing por tier (D+1 padrao, D+0 premium) com reserva dinamica baseada em volume e risco garante sustentabilidade. Modelo mais equilibrado.",
            optimal: true,
          },
          {
            label: "Captar Investimento para Reserva",
            impact: { settlementDays: 0, merchantBase: 20, churnRate: 0, cashReserve: 30 },
            explanation:
              "Investimento externo aumenta reserva, mas dilui equity e cria pressao de retorno. Melhor tornar o modelo auto-sustentavel primeiro.",
            optimal: false,
          },
          {
            label: "Cobrar Taxa de Antecipacao",
            impact: { settlementDays: 0, merchantBase: -50, churnRate: 2, cashReserve: 10 },
            explanation:
              "Cobrar taxa adicional pode causar churn novamente. Merchants esperam D+1 incluso. Pricing tiered e mais elegante.",
            optimal: false,
          },
          {
            label: "Reduzir Custos Operacionais",
            impact: { settlementDays: 0, merchantBase: 0, churnRate: 0, cashReserve: 5 },
            explanation:
              "Eficiencia operacional e sempre valida, mas sozinha nao resolve o modelo financeiro de pre-funding. Precisa de pricing estrategico.",
            optimal: false,
          },
        ],
      },
    ],
    expertPath:
      "Sequencia otima: Pre-funding (D+1 imediato) -> Win-back agressivo (recuperar base) -> Pricing Tiered (sustentabilidade). Resultado: D+1 padrao, base recuperada, modelo financeiro saudavel.",
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function animateValue(
  from: number,
  to: number,
  duration: number,
  onUpdate: (v: number) => void,
  onDone?: () => void
) {
  const start = performance.now();
  function frame(now: number) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    onUpdate(from + (to - from) * eased);
    if (progress < 1) {
      requestAnimationFrame(frame);
    } else {
      onUpdate(to);
      onDone?.();
    }
  }
  requestAnimationFrame(frame);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function CaseStudyLab() {
  const [selectedScenario, setSelectedScenario] = useState<number | null>(null);
  const [currentRound, setCurrentRound] = useState(0);
  const [metrics, setMetrics] = useState<ScenarioMetrics>({});
  const [choices, setChoices] = useState<number[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [lastExplanation, setLastExplanation] = useState("");
  const [lastWasOptimal, setLastWasOptimal] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [finished, setFinished] = useState(false);
  const [displayMetrics, setDisplayMetrics] = useState<ScenarioMetrics>({});
  const [showXpToast, setShowXpToast] = useState<string | null>(null);
  const { recordQuiz, visitPage } = useGameProgress();

  useEffect(() => {
    visitPage("/labs/case-study");
  }, [visitPage]);

  const scenario = selectedScenario !== null ? SCENARIOS[selectedScenario] : null;

  const startScenario = useCallback((idx: number) => {
    const s = SCENARIOS[idx];
    setSelectedScenario(idx);
    setCurrentRound(0);
    setMetrics(JSON.parse(JSON.stringify(s.initialMetrics)));
    setDisplayMetrics(JSON.parse(JSON.stringify(s.initialMetrics)));
    setChoices([]);
    setShowExplanation(false);
    setFinished(false);
  }, []);

  const handleChoice = useCallback(
    (choiceIdx: number) => {
      if (!scenario || animating) return;
      const round = scenario.rounds[currentRound];
      const choice = round.choices[choiceIdx];
      setChoices((prev) => [...prev, choiceIdx]);
      setLastExplanation(choice.explanation);
      setLastWasOptimal(choice.optimal);
      setAnimating(true);

      // Animate metrics
      const newMetrics = JSON.parse(JSON.stringify(metrics)) as ScenarioMetrics;
      const keys = Object.keys(choice.impact);
      let completed = 0;

      keys.forEach((key) => {
        const from = metrics[key].value;
        const to = from + choice.impact[key];
        newMetrics[key] = { ...newMetrics[key], value: to };

        animateValue(from, to, 800, (v) => {
          setDisplayMetrics((prev) => ({
            ...prev,
            [key]: { ...prev[key], value: v },
          }));
        }, () => {
          completed++;
          if (completed === keys.length) {
            setAnimating(false);
            setShowExplanation(true);
          }
        });
      });

      setMetrics(newMetrics);
    },
    [scenario, currentRound, metrics, animating]
  );

  const nextRound = useCallback(() => {
    if (!scenario) return;
    if (currentRound + 1 >= scenario.rounds.length) {
      setFinished(true);
      // Calculate score for XP
      const optCount = choices.filter((c, i) => scenario.rounds[i]?.choices[c]?.optimal).length;
      const finalScore = Math.round((optCount / scenario.rounds.length) * 100);
      const xp = finalScore > 80 ? 30 : 20;
      recordQuiz("/labs/case-study-" + scenario.id, optCount, scenario.rounds.length, xp);
      setShowXpToast(`+${xp} XP — Caso concluido!${finalScore > 80 ? " (Bonus Expert!)" : ""}`);
      setTimeout(() => setShowXpToast(null), 4000);
    } else {
      setCurrentRound((r) => r + 1);
      setShowExplanation(false);
    }
  }, [scenario, currentRound, choices, recordQuiz]);

  const calcScore = useCallback(() => {
    if (!scenario) return 0;
    let optimal = 0;
    choices.forEach((c, i) => {
      if (scenario.rounds[i].choices[c]?.optimal) optimal++;
    });
    return Math.round((optimal / scenario.rounds.length) * 100);
  }, [scenario, choices]);

  const resetAll = useCallback(() => {
    setSelectedScenario(null);
    setCurrentRound(0);
    setMetrics({});
    setDisplayMetrics({});
    setChoices([]);
    setShowExplanation(false);
    setFinished(false);
    setLastExplanation("");
  }, []);

  // -------------------------------------------------------------------------
  // Render: Scenario Selector
  // -------------------------------------------------------------------------
  const xpToastEl = showXpToast ? (
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
  ) : null;

  if (selectedScenario === null) {
    return (
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem 1rem" }}>
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
            Estudo de Caso Interativo
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
            Tome decisoes estrategicas em cenarios reais de pagamentos. Cada escolha impacta
            metricas — compare seu resultado com a solucao otima.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {SCENARIOS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => startScenario(i)}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "0.75rem",
                padding: "1.25rem",
                cursor: "pointer",
                textAlign: "left",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "var(--primary)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "var(--border)")
              }
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "0.5rem",
                }}
              >
                <span style={{ fontSize: "1.5rem" }}>{s.icon}</span>
                <span
                  style={{
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: "var(--foreground)",
                  }}
                >
                  {s.title}
                </span>
              </div>
              <p
                style={{
                  fontSize: "0.825rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.5,
                }}
              >
                {s.context.slice(0, 120)}...
              </p>
              <div
                style={{
                  marginTop: "0.75rem",
                  display: "flex",
                  gap: "0.5rem",
                  flexWrap: "wrap",
                }}
              >
                {Object.values(s.initialMetrics).map((m) => (
                  <span
                    key={m.label}
                    style={{
                      fontSize: "0.7rem",
                      padding: "0.2rem 0.5rem",
                      borderRadius: "0.25rem",
                      background: m.color + "18",
                      color: m.color,
                      fontWeight: 600,
                    }}
                  >
                    {m.label}: {m.value}
                    {m.suffix}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Render: Finished
  // -------------------------------------------------------------------------
  if (finished && scenario) {
    const score = calcScore();
    const scoreColor =
      score >= 80 ? "#10B981" : score >= 50 ? "#F59E0B" : "#EF4444";
    const scoreLabel =
      score >= 80 ? "Excelente!" : score >= 50 ? "Bom trabalho" : "Pode melhorar";

    return (
      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "2rem 1rem" }}>
        {xpToastEl}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "0.75rem",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>
            {score >= 80 ? "\uD83C\uDFC6" : score >= 50 ? "\uD83D\uDC4D" : "\uD83D\uDCDA"}
          </div>
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              color: "var(--foreground)",
              marginBottom: "0.25rem",
            }}
          >
            {scoreLabel}
          </h2>
          <div
            style={{
              fontSize: "2.5rem",
              fontWeight: 800,
              color: scoreColor,
              marginBottom: "1rem",
            }}
          >
            {score}%
          </div>
          <p
            style={{
              fontSize: "0.8rem",
              color: "var(--text-secondary)",
              marginBottom: "0.25rem",
            }}
          >
            Decisoes otimas: {choices.filter((c, i) => scenario.rounds[i].choices[c]?.optimal).length} de{" "}
            {scenario.rounds.length}
          </p>

          {/* Final Metrics */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.75rem",
              margin: "1.5rem 0",
            }}
          >
            {Object.entries(metrics).map(([key, m]) => {
              const initial = scenario.initialMetrics[key];
              const diff = m.value - initial.value;
              return (
                <div
                  key={key}
                  style={{
                    background: "var(--background)",
                    borderRadius: "0.5rem",
                    padding: "0.75rem",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.7rem",
                      color: "var(--text-secondary)",
                      marginBottom: "0.25rem",
                    }}
                  >
                    {m.label}
                  </div>
                  <div style={{ fontSize: "1.25rem", fontWeight: 700, color: m.color }}>
                    {typeof m.value === "number" ? (Number.isInteger(m.value) ? m.value : m.value.toFixed(1)) : m.value}
                    {m.suffix}
                  </div>
                  <div
                    style={{
                      fontSize: "0.7rem",
                      color: diff >= 0 ? "#10B981" : "#EF4444",
                      fontWeight: 600,
                    }}
                  >
                    {diff >= 0 ? "+" : ""}
                    {Number.isInteger(diff) ? diff : diff.toFixed(1)}
                    {m.suffix}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Expert Path */}
          <div
            style={{
              background: "var(--primary-bg)",
              border: "1px solid var(--border)",
              borderRadius: "0.5rem",
              padding: "1rem",
              textAlign: "left",
              marginBottom: "1.5rem",
            }}
          >
            <div
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "var(--primary)",
                marginBottom: "0.5rem",
              }}
            >
              Caminho do Especialista
            </div>
            <p
              style={{
                fontSize: "0.8rem",
                color: "var(--text-secondary)",
                lineHeight: 1.6,
              }}
            >
              {scenario.expertPath}
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
            <button
              onClick={resetAll}
              style={{
                padding: "0.625rem 1.25rem",
                borderRadius: "0.5rem",
                background: "var(--surface)",
                color: "var(--foreground)",
                border: "1px solid var(--border)",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.85rem",
              }}
            >
              Escolher Outro Cenario
            </button>
            <button
              onClick={() => startScenario(selectedScenario)}
              style={{
                padding: "0.625rem 1.25rem",
                borderRadius: "0.5rem",
                background: "var(--primary)",
                color: "white",
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.85rem",
              }}
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Render: Active Round
  // -------------------------------------------------------------------------
  const round = scenario?.rounds[currentRound];

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem 1rem" }}>
      {/* Header */}
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "0.5rem",
          }}
        >
          <h1
            style={{
              fontSize: "1.25rem",
              fontWeight: 700,
              color: "var(--foreground)",
            }}
          >
            {scenario?.icon} {scenario?.title}
          </h1>
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
            Rodada {currentRound + 1}/{scenario?.rounds.length}
          </span>
        </div>
      </div>

      {/* Context */}
      {currentRound === 0 && !showExplanation && (
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "0.75rem",
            padding: "1rem 1.25rem",
            marginBottom: "1rem",
          }}
        >
          <div
            style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              color: "var(--text-secondary)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "0.5rem",
            }}
          >
            Contexto
          </div>
          <p
            style={{
              fontSize: "0.85rem",
              color: "var(--foreground)",
              lineHeight: 1.6,
            }}
          >
            {scenario?.context}
          </p>
        </div>
      )}

      {/* Metrics Dashboard */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "0.75rem",
          marginBottom: "1.25rem",
        }}
      >
        {Object.entries(displayMetrics).map(([, m]) => (
          <div
            key={m.label}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "0.5rem",
              padding: "0.75rem",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "0.65rem",
                color: "var(--text-secondary)",
                marginBottom: "0.25rem",
                textTransform: "uppercase",
                letterSpacing: "0.03em",
              }}
            >
              {m.label}
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: m.color }}>
              {Number.isInteger(m.value)
                ? Math.round(m.value)
                : m.value.toFixed(1)}
              {m.suffix}
            </div>
          </div>
        ))}
      </div>

      {/* Decision */}
      {round && !showExplanation && (
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "0.75rem",
            padding: "1.25rem",
          }}
        >
          <h2
            style={{
              fontSize: "1rem",
              fontWeight: 600,
              color: "var(--foreground)",
              marginBottom: "1rem",
            }}
          >
            {round.prompt}
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.75rem",
            }}
          >
            {round.choices.map((c, i) => (
              <button
                key={i}
                onClick={() => handleChoice(i)}
                disabled={animating}
                style={{
                  padding: "1rem",
                  borderRadius: "0.5rem",
                  border: "1px solid var(--border)",
                  background: "var(--background)",
                  cursor: animating ? "not-allowed" : "pointer",
                  textAlign: "left",
                  transition: "border-color 0.2s, background 0.2s",
                  opacity: animating ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!animating) {
                    e.currentTarget.style.borderColor = "var(--primary)";
                    e.currentTarget.style.background = "var(--primary-bg)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.background = "var(--background)";
                }}
              >
                <div
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "var(--foreground)",
                    marginBottom: "0.25rem",
                  }}
                >
                  {c.label}
                </div>
                <div
                  style={{
                    fontSize: "0.7rem",
                    color: "var(--text-secondary)",
                  }}
                >
                  Clique para escolher
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Explanation */}
      {showExplanation && (
        <div
          style={{
            background: lastWasOptimal ? "#10B98110" : "#F59E0B10",
            border: `1px solid ${lastWasOptimal ? "#10B98140" : "#F59E0B40"}`,
            borderRadius: "0.75rem",
            padding: "1.25rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.75rem",
            }}
          >
            <span style={{ fontSize: "1.25rem" }}>
              {lastWasOptimal ? "\u2705" : "\uD83D\uDCA1"}
            </span>
            <span
              style={{
                fontSize: "0.875rem",
                fontWeight: 700,
                color: lastWasOptimal ? "#10B981" : "#F59E0B",
              }}
            >
              {lastWasOptimal ? "Escolha Otima!" : "Boa escolha, mas havia uma melhor"}
            </span>
          </div>
          <p
            style={{
              fontSize: "0.85rem",
              color: "var(--foreground)",
              lineHeight: 1.6,
              marginBottom: "1rem",
            }}
          >
            {lastExplanation}
          </p>
          <button
            onClick={nextRound}
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
            {currentRound + 1 >= (scenario?.rounds.length ?? 0)
              ? "Ver Resultado Final"
              : "Proxima Rodada \u2192"}
          </button>
        </div>
      )}
    </div>
  );
}
